// ══════════════════════════════════════════════════════════════
// DEBUG PANEL — backend diagnostic tool (admin-only, temporary)
// ──────────────────────────────────────────────────────────────
// ES5 estricto: solo declaraciones var y function. Nada de ES6+.
// React.createElement vía el alias global `e`. Sin JSX.
// Props: user (Supabase user), onClose (function, optional)
// ══════════════════════════════════════════════════════════════
function DebugPanel(props) {
  var s;
  s = useState('');   var DP_chatResult = s[0], DP_setChatResult = s[1];
  s = useState('');   var DP_genResult  = s[0], DP_setGenResult  = s[1];
  s = useState(false);var DP_loading    = s[0], DP_setLoading    = s[1];
  s = useState(null); var DP_profile    = s[0], DP_setProfile    = s[1];

  useEffect(function() {
    if (!props.user || !window.ECEPT_SUPABASE) return;
    window.ECEPT_SUPABASE
      .from('profiles')
      .select('id, username, role, credits')
      .eq('id', props.user.id)
      .single()
      .then(function(r) { DP_setProfile(r.data); });
  }, [props.user]);

  async function DP_testChat(model) {
    DP_setLoading(true);
    DP_setChatResult('Llamando /api/chat con ' + model + '...');
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess.data.session && sess.data.session.access_token;
      if (!token) { DP_setChatResult('❌ No hay sesión activa'); DP_setLoading(false); return; }
      var res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hola Elion, decime quién sos en una frase' }],
          model: model
        })
      });
      var data = await res.json();
      DP_setChatResult('STATUS: ' + res.status + '\n\n' + JSON.stringify(data, null, 2));
    } catch(err) {
      DP_setChatResult('❌ ' + err.message);
    }
    DP_setLoading(false);
  }

  async function DP_testGen() {
    DP_setLoading(true);
    DP_setGenResult('Llamando /api/flashcard-gen...');
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess.data.session && sess.data.session.access_token;
      if (!token) { DP_setGenResult('❌ No hay sesión activa'); DP_setLoading(false); return; }
      var res = await fetch('/api/flashcard-gen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({
          sourceType: 'text',
          sourceData: 'La aspirina es un AINE que inhibe la ciclooxigenasa de forma irreversible. Se usa como antiagregante plaquetario a bajas dosis (75-100mg/día) para prevenir eventos cardiovasculares.',
          sourceName: 'Test',
          count: 5,
          cardType: 'mixed'
        })
      });
      var data = await res.json();
      DP_setGenResult('STATUS: ' + res.status + '\n\n' + JSON.stringify(data, null, 2));
    } catch(err) {
      DP_setGenResult('❌ ' + err.message);
    }
    DP_setLoading(false);
  }

  var box    = { background:'#0d1224', border:'1px solid #1a2040', borderRadius:8, padding:12, margin:'8px 0', fontFamily:'monospace', fontSize:11, color:'#e2e8f0', whiteSpace:'pre-wrap', wordBreak:'break-all', maxHeight:300, overflow:'auto' };
  var btn    = { background:'#3b82f6', color:'#fff', border:'none', borderRadius:8, padding:'10px 16px', margin:'4px', fontSize:13, cursor:'pointer', minHeight:44 };
  var btnDis = Object.assign({}, btn, { opacity:0.5 });

  return e('div', { style:{ background:'#080e1f', minHeight:'100vh', padding:20 } },
    e('div', { style:{ maxWidth:700, margin:'0 auto' } },
      e('div', { style:{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 } },
        e('h2', { style:{ color:'#e2e8f0', margin:0 } }, '🛠 Debug Panel'),
        props.onClose && e('button', {
          onClick: props.onClose,
          style:{ background:'rgba(255,255,255,.08)', color:'#e2e8f0', border:'none', borderRadius:8, padding:'8px 14px', fontSize:13, cursor:'pointer' }
        }, '✕ Cerrar')
      ),

      e('div', { style:box },
        'Profile: ' + (DP_profile ? JSON.stringify(DP_profile, null, 2) : 'cargando...')
      ),

      e('div', { style:{ marginTop:16 } },
        e('h3', { style:{ color:'#94a3b8', fontSize:14, marginBottom:8 } }, 'Test Chat'),
        e('button', { style: DP_loading ? btnDis : btn, disabled:DP_loading, onClick: function() { DP_testChat('gemini-2.5-flash-lite'); } }, 'Test flash-lite (free tier)'),
        e('button', { style: DP_loading ? btnDis : btn, disabled:DP_loading, onClick: function() { DP_testChat('gemini-2.5-flash'); } }, 'Test 2.5-flash (premium)'),
        e('button', { style: DP_loading ? btnDis : btn, disabled:DP_loading, onClick: function() { DP_testChat('gemini-2.5-pro'); } }, 'Test 2.5-pro (créditos)'),
        e('div', { style:box }, DP_chatResult || '(sin resultado)')
      ),

      e('div', { style:{ marginTop:16 } },
        e('h3', { style:{ color:'#94a3b8', fontSize:14, marginBottom:8 } }, 'Test Flashcard-Gen'),
        e('button', { style: DP_loading ? btnDis : btn, disabled:DP_loading, onClick: DP_testGen }, 'Generar 5 cards de prueba'),
        e('div', { style:box }, DP_genResult || '(sin resultado)')
      ),

      e('div', { style:{ marginTop:24, color:'#64748b', fontSize:11 } },
        'Quitá este panel cuando termines de testear (Fase de cleanup pre-Fase 3).'
      )
    )
  );
}
window.DebugPanel = DebugPanel;
