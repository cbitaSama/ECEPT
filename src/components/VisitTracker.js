// ══════════════════════════════════════════════════════════════
// VisitTracker — registra visitas a items en user_visits.
// ══════════════════════════════════════════════════════════════
// Componente invisible. Solo monta el tracking en useEffect.
//
// Props:
//   itemType — string ('enfermedad', 'triada', 'lab', 'receptor',
//              'mediador', 'salud_mental_trastorno', 'trauma_entry',
//              'vocab_entry', 'deck', 'study_session', 'anatomia_item').
//   itemId   — string identificador único.
//
// Notas:
// - Usa SELECT-luego-INSERT/UPDATE para evitar conflictos de upsert sin
//   constraint únicos garantizados.
// - Si no hay sesión: no-op silencioso.
// - Cache local _ECEPT_VISIT_RECENT evita doble registro en mounts rápidos
//   del mismo item (debounce 60s).
// ══════════════════════════════════════════════════════════════

window._ECEPT_VISIT_RECENT = window._ECEPT_VISIT_RECENT || {};

function VisitTracker(props) {
  useEffect(function() {
    if (!props.itemType || !props.itemId) return;
    if (!window.ECEPT_SUPABASE) return;

    var key = props.itemType + ':' + props.itemId;
    var lastSeen = window._ECEPT_VISIT_RECENT[key] || 0;
    var nowMs = Date.now();
    if (nowMs - lastSeen < 60000) return; // debounce 60s
    window._ECEPT_VISIT_RECENT[key] = nowMs;

    window.ECEPT_SUPABASE.auth.getSession().then(function(res) {
      var user = res && res.data && res.data.session && res.data.session.user;
      if (!user) return;

      var nowIso = new Date().toISOString();
      window.ECEPT_SUPABASE
        .from('user_visits')
        .select('visit_count')
        .eq('user_id', user.id)
        .eq('item_type', props.itemType)
        .eq('item_id', props.itemId)
        .maybeSingle()
        .then(function(r) {
          if (r && r.data) {
            window.ECEPT_SUPABASE
              .from('user_visits')
              .update({ visit_count: (r.data.visit_count || 0) + 1, last_visited: nowIso })
              .eq('user_id', user.id)
              .eq('item_type', props.itemType)
              .eq('item_id', props.itemId)
              .then(function(){}, function(){});
          } else {
            window.ECEPT_SUPABASE
              .from('user_visits')
              .insert({
                user_id: user.id,
                item_type: props.itemType,
                item_id: props.itemId,
                visit_count: 1,
                last_visited: nowIso
              }).then(function(){}, function(){});
          }
        }, function(){});
    }, function(){});
  }, [props.itemType, props.itemId]);

  return null;
}

window.VisitTracker = VisitTracker;
