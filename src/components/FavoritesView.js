// ══════════════════════════════════════════════════════════════
// FavoritesView — página dedicada de favoritos del usuario.
// ══════════════════════════════════════════════════════════════
// Props:
//   user — supabase user.
//   go   — función de navegación de App (recibe modId, secId, itemId).
// ══════════════════════════════════════════════════════════════

function FavoritesView(props) {
  var p = T;
  var user = props.user;
  var go = props.go;

  var s = useState([]);
  var favs = s[0];
  var setFavs = s[1];
  s = useState(true);
  var loading = s[0];
  var setLoading = s[1];
  s = useState('all');
  var filter = s[0];
  var setFilter = s[1];

  function reload() {
    if (!user) { setLoading(false); setFavs([]); return; }
    setLoading(true);
    var t0 = Date.now();
    window.ECEPT_FAVORITES.list(user.id).then(function(arr) {
      var elapsed = Date.now() - t0;
      var remaining = Math.max(0, 400 - elapsed);
      setTimeout(function() {
        setFavs(arr || []);
        setLoading(false);
      }, remaining);
    });
  }

  useEffect(function() { reload(); }, [user]);

  // Listen for favorite changes (sync con FavoriteButton en otras vistas)
  useEffect(function() {
    function onChange() { reload(); }
    window.addEventListener('ECEPT_FAVORITES_CHANGE', onChange);
    return function() { window.removeEventListener('ECEPT_FAVORITES_CHANGE', onChange); };
  }, [user]);

  // Resolve metadata para cada favorito
  function resolveMeta(fav) {
    var t = fav.item_type;
    var id = fav.item_id;
    if (t === 'enfermedad' && typeof RD !== 'undefined') {
      var d = RD.find(function(x){ return x.id === id; });
      if (d) {
        var sec = (typeof REUMA_SECS !== 'undefined') ? REUMA_SECS.find(function(s2){return s2.id===d.s;}) : null;
        return { name: d.n, module: 'Reumatología', moduleIcon: '🦴', accent: '#60a5fa', go: function(){ go('reuma_dis', d.s, d.id); } };
      }
    }
    if (t === 'triada' && typeof TR !== 'undefined') {
      var ti = parseInt(id, 10);
      if (!isNaN(ti) && TR[ti]) return { name: TR[ti].nm, module: 'Tríadas', moduleIcon: '🔺', accent: '#e879f9', go: function(){ go('triadas'); } };
    }
    if (t === 'deck') {
      return { name: 'Baraja ' + id.slice(0,8), module: 'Flashcards', moduleIcon: '🎴', accent: '#a78bfa', go: function(){ window.ECEPT_DECK_SELECTED = { id: id, name: 'Baraja' }; go('flashcards_deck'); } };
    }
    if (t === 'lab') return { name: id, module: 'Labs', moduleIcon: '🧪', accent: '#34d399', go: function(){ go('labs'); } };
    if (t === 'receptor') return { name: id, module: 'Receptores', moduleIcon: '🧬', accent: '#ec4899', go: function(){ go('receptores'); } };
    if (t === 'mediador') return { name: id, module: 'Mediadores', moduleIcon: '🔬', accent: '#a78bfa', go: function(){ go('mediadores'); } };
    if (t === 'salud_mental_trastorno') return { name: id, module: 'Salud Mental', moduleIcon: '🧠', accent: '#a78bfa', go: function(){ go('salud_mental'); } };
    if (t === 'trauma_entry') return { name: id, module: 'Trauma', moduleIcon: '🩸', accent: '#ef4444', go: function(){ go('trauma-u1'); } };
    if (t === 'vocab_entry') return { name: id, module: 'Vocabulario', moduleIcon: '🔤', accent: '#06b6d4', go: function(){ go('vocabulario'); } };
    if (t === 'anatomia_item') return { name: id, module: 'Anatomía', moduleIcon: '🩻', accent: '#f59e0b', go: function(){ go('anat_menu'); } };
    return { name: id, module: t, moduleIcon: '⭐', accent: '#fbbf24', go: null };
  }

  var enriched = favs.map(function(f) {
    var meta = resolveMeta(f);
    return { fav: f, meta: meta };
  });

  // Tab filters
  var tabs = [
    { id: 'all', label: 'Todos' },
    { id: 'enfermedad', label: 'Enfermedades' },
    { id: 'triada', label: 'Tríadas' },
    { id: 'deck', label: 'Barajas' },
    { id: 'lab', label: 'Labs' },
    { id: 'receptor', label: 'Receptores' },
    { id: 'salud_mental_trastorno', label: 'Salud Mental' }
  ];
  var visible = filter === 'all' ? enriched : enriched.filter(function(it){ return it.fav.item_type === filter; });

  // Group by item_type para sections
  var byType = {};
  visible.forEach(function(it) {
    var t = it.fav.item_type;
    if (!byType[t]) byType[t] = [];
    byType[t].push(it);
  });
  var typeOrder = ['enfermedad','triada','deck','lab','receptor','mediador','salud_mental_trastorno','trauma_entry','vocab_entry','anatomia_item'];
  var typeLabels = {
    enfermedad:'Enfermedades', triada:'Tríadas', deck:'Barajas', lab:'Labs',
    receptor:'Receptores', mediador:'Mediadores', salud_mental_trastorno:'Salud Mental',
    trauma_entry:'Trauma', vocab_entry:'Vocabulario', anatomia_item:'Anatomía'
  };

  var content;
  if (loading) {
    content = e('div', { style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:p.space.lg } },
      [0,1,2,3].map(function(i){ return e('div',{key:i}, window.SkeletonCard ? e(window.SkeletonCard,{minHeight:120}) : null); })
    );
  } else if (favs.length === 0) {
    content = e(window.EmptyState || 'div', {
      icon: '⭐',
      title: 'Sin favoritos todavía',
      description: 'Marcá tus enfermedades, tríadas o tarjetas favoritas tocando el ⭐ en cualquier vista. También podés mantener presionado un item en la lista para favoritearlo.',
      actions: [{ label: 'Ir al inicio', onClick: function(){ go('home'); }, variant:'primary' }]
    });
  } else if (visible.length === 0) {
    content = e('div', { style:{ padding:'40px 20px', textAlign:'center', color:p.color.textMuted, fontSize:13 } },
      'Sin favoritos en esta categoría.'
    );
  } else {
    content = e('div', { style:{ display:'flex', flexDirection:'column', gap:p.space.xxl } },
      typeOrder.filter(function(t){ return byType[t] && byType[t].length>0; }).map(function(t){
        var items = byType[t];
        return e('div', { key:t },
          e('div', { style:{ fontSize:11, fontWeight:700, color:'#475569', letterSpacing:'0.10em', textTransform:'uppercase', marginBottom:p.space.md, display:'flex', alignItems:'center', gap:p.space.sm } },
            e('span', null, typeLabels[t] || t),
            e('span', { style:{ fontSize:11, color:p.color.textGhost, fontWeight:500 } }, '· ' + items.length)
          ),
          e('div', { style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:p.space.lg } },
            items.map(function(it, idx) {
              var m = it.meta;
              return e('div', {
                key: it.fav.item_type + ':' + it.fav.item_id,
                onClick: function(){ if (m.go) m.go(); },
                style:{
                  background: 'linear-gradient(180deg,#0d1224 0%,#0a0e1f 100%)',
                  border: '1px solid '+p.color.bg4,
                  borderRadius: p.radius.lg,
                  padding: '16px 18px',
                  cursor: m.go ? 'pointer' : 'default',
                  display:'flex',
                  alignItems:'center',
                  gap: p.space.md,
                  minHeight: 80,
                  transition: 'transform 220ms ' + p.ease.standard + ', border-color 220ms ' + p.ease.standard + ', box-shadow 220ms ease-out',
                  animation: 'ecept_fadeSlideUp 320ms ' + p.ease.out + ' ' + (idx*30) + 'ms both',
                  boxSizing:'border-box',
                  position:'relative'
                },
                onMouseEnter: function(ev){
                  if (!m.go) return;
                  ev.currentTarget.style.borderColor = m.accent + '50';
                  ev.currentTarget.style.transform = 'translateY(-2px)';
                  ev.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.30)';
                },
                onMouseLeave: function(ev){
                  ev.currentTarget.style.borderColor = p.color.bg4;
                  ev.currentTarget.style.transform = 'translateY(0)';
                  ev.currentTarget.style.boxShadow = 'none';
                }
              },
                e('span', { style:{ fontSize:24, width:48, height:48, display:'flex', alignItems:'center', justifyContent:'center', background:m.accent+'14', border:'1px solid '+m.accent+'24', borderRadius:p.radius.md, flexShrink:0 } }, m.moduleIcon),
                e('div', { style:{ flex:1, minWidth:0 } },
                  e('div', { style:{ fontSize:15, fontWeight:600, color:p.color.text, letterSpacing:'-0.01em', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' } }, m.name),
                  e('div', { style:{ fontSize:12, color:p.color.textDim, marginTop:2 } }, m.module)
                ),
                e(FavoriteButton, { user:user, itemType:it.fav.item_type, itemId:it.fav.item_id, size:18 })
              );
            })
          )
        );
      })
    );
  }

  return e(ModuleShell, { title:'Mis favoritos', subtitle: favs.length+' item'+(favs.length===1?'':'s')+' guardado'+(favs.length===1?'':'s'), icon:'⭐', accent:'#fbbf24' },
    // Tab filters
    favs.length > 0 && e('div', { style:{ display:'flex', flexWrap:'wrap', gap:p.space.sm, marginBottom:p.space.xl } },
      tabs.filter(function(tb){ return tb.id==='all' || (byType[tb.id] && byType[tb.id].length>0) || filter===tb.id; }).map(function(tb){
        var active = filter === tb.id;
        return e('button', {
          key:tb.id,
          onClick:function(){ setFilter(tb.id); },
          style:{
            padding:'8px 14px',
            borderRadius: p.radius.pill,
            border:'1px solid '+(active?'rgba(251,191,36,0.40)':p.color.bg4),
            background: active?'linear-gradient(135deg, rgba(251,191,36,0.18), rgba(245,158,11,0.10))':'transparent',
            color: active?p.color.gold:p.color.textMuted,
            fontSize:12,
            fontWeight:600,
            cursor:'pointer',
            fontFamily:'inherit',
            transition:'all 200ms ease-out',
            letterSpacing:'-0.005em'
          }
        }, tb.label);
      })
    ),
    content
  );
}

window.FavoritesView = FavoritesView;
