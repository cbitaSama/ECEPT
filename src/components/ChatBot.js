// ══════════════════════════════════════════════════════════════
// CHATBOT — Elion AI assistant for ECEPT
// ES5 estricto: solo declaraciones var y function. Nada de ES6+.
// React.createElement vía alias global `e`. Sin JSX.
// Prefijo CB_ en todos los globales. Props: onLoginRequest (fn)
// ══════════════════════════════════════════════════════════════

var CB_MODELS = [
  { id:'gemini-2.5-flash-lite', name:'Flash Lite', desc:'Rápido y eficiente',           cost:1,  icon:'⚡' },
  { id:'gemini-2.5-flash',      name:'Flash 2.5',  desc:'Mejor calidad y razonamiento', cost:3,  icon:'✨' },
  { id:'gemini-2.5-pro',        name:'Pro 2.5',    desc:'Máxima inteligencia',           cost:15, icon:'🧠' }
];

var CB_TIER_MODELS = {
  student: ['gemini-2.5-flash-lite'],
  premium: ['gemini-2.5-flash-lite','gemini-2.5-flash'],
  admin:   ['gemini-2.5-flash-lite','gemini-2.5-flash']
};

var CB_styleInjected = false;

function CB_elionAvatar(sz) {
  return e('div', { style:{
    width:sz+'px', height:sz+'px', flexShrink:0, borderRadius:'50%',
    background:'linear-gradient(135deg,#60a5fa,#a78bfa)',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:Math.round(sz*0.46)+'px', fontWeight:700, color:'#fff', userSelect:'none'
  }}, 'E');
}

// ── Inline markdown: **bold**, `code`, *italic* ───────────────
function CB_parseInline(text) {
  var result = [];
  var remaining = String(text || '');
  var kn = 0;
  while (remaining.length > 0) {
    var m = /\*\*(.+?)\*\*|`([^`]+)`|\*([^*\n]+)\*/.exec(remaining);
    if (!m) { if (remaining) result.push(remaining); break; }
    if (m.index > 0) result.push(remaining.slice(0, m.index));
    if (m[1] !== undefined)
      result.push(e('strong', { key:'ck'+(kn++), style:{fontWeight:700} }, m[1]));
    else if (m[2] !== undefined)
      result.push(e('code', { key:'ck'+(kn++), style:{background:'rgba(255,255,255,.1)',padding:'1px 4px',borderRadius:3,fontFamily:'monospace',fontSize:'0.9em'} }, m[2]));
    else if (m[3] !== undefined)
      result.push(e('em', { key:'ck'+(kn++), style:{fontStyle:'italic'} }, m[3]));
    else result.push(m[0]);
    remaining = remaining.slice(m.index + m[0].length);
  }
  return result;
}

// ── Block markdown renderer ───────────────────────────────────
function CB_renderMarkdown(text) {
  var lines = String(text || '').split('\n');
  var elems = [];
  var i = 0;
  var kn = 0;
  while (i < lines.length) {
    var line = lines[i];
    if (/^\s*```/.test(line)) {
      var codeLines = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) { codeLines.push(lines[i]); i++; }
      elems.push(e('pre', { key:'mk'+(kn++), style:{ background:'rgba(0,0,0,.35)', borderRadius:6, padding:'8px 10px', fontSize:11, fontFamily:'monospace', overflowX:'auto', margin:'6px 0', color:'#e2e8f0', whiteSpace:'pre-wrap', wordBreak:'break-all' } }, codeLines.join('\n')));
      i++; continue;
    }
    if (line.indexOf('### ') === 0) {
      elems.push(e('div', { key:'mk'+(kn++), style:{ color:C.ac, fontSize:13, fontWeight:700, margin:'8px 0 3px' } }, e('span', null, CB_parseInline(line.slice(4)))));
      i++; continue;
    }
    if (line.indexOf('## ') === 0) {
      elems.push(e('div', { key:'mk'+(kn++), style:{ color:C.ac, fontSize:14, fontWeight:700, margin:'10px 0 4px' } }, e('span', null, CB_parseInline(line.slice(3)))));
      i++; continue;
    }
    if (line.indexOf('# ') === 0) {
      elems.push(e('div', { key:'mk'+(kn++), style:{ color:C.ac, fontSize:16, fontWeight:700, margin:'10px 0 5px' } }, e('span', null, CB_parseInline(line.slice(2)))));
      i++; continue;
    }
    if (line.indexOf('- ') === 0 || line.indexOf('* ') === 0) {
      elems.push(e('div', { key:'mk'+(kn++), style:{ display:'flex', gap:'6px', margin:'2px 0', alignItems:'flex-start' } },
        e('span', { style:{ color:C.ac, flexShrink:0, marginTop:2, fontSize:12 } }, '•'),
        e('span', { style:{ lineHeight:1.55 } }, e('span', null, CB_parseInline(line.slice(2))))
      ));
      i++; continue;
    }
    if (!line.trim()) {
      elems.push(e('div', { key:'mk'+(kn++), style:{ height:6 } }));
      i++; continue;
    }
    elems.push(e('p', { key:'mk'+(kn++), style:{ margin:'2px 0', lineHeight:1.55 } }, e('span', null, CB_parseInline(line))));
    i++;
  }
  return e('div', { style:{ fontSize:13, color:C.tx, lineHeight:1.55 } }, elems);
}

// ── Main component ────────────────────────────────────────────
function ChatBot(props) {
  var s;
  s=useState(false);                     var CB_open=s[0],            CB_setOpen=s[1];
  s=useState(null);                      var CB_session=s[0],         CB_setSession=s[1];
  s=useState('student');                 var CB_role=s[0],            CB_setRole=s[1];
  s=useState(0);                         var CB_credits=s[0],         CB_setCredits=s[1];
  s=useState(null);                      var CB_uid=s[0],             CB_setUid=s[1];
  s=useState(false);                     var CB_fullscreen=s[0],      CB_setFullscreen=s[1];
  s=useState(typeof window!=='undefined'&&window.innerWidth>=768);
                                         var CB_isDesktop=s[0],       CB_setIsDesktop=s[1];
  s=useState([]);                        var CB_msgs=s[0],            CB_setMsgs=s[1];
  s=useState('');                        var CB_input=s[0],           CB_setInput=s[1];
  s=useState(false);                     var CB_loading=s[0],         CB_setLoading=s[1];
  s=useState('');                        var CB_connErr=s[0],         CB_setConnErr=s[1];
  s=useState(null);                      var CB_quota=s[0],           CB_setQuota=s[1];
  s=useState('gemini-2.5-flash-lite');   var CB_selectedModel=s[0],   CB_setSelectedModel=s[1];
  s=useState([]);                        var CB_pendingFiles=s[0],    CB_setPendingFiles=s[1];
  s=useState(false);                     var CB_showPicker=s[0],      CB_setShowPicker=s[1];

  var CB_scrollRef = useRef(null);
  var CB_inputRef  = useRef(null);

  // ── Inject CSS animations once ──
  useEffect(function() {
    if (!CB_styleInjected) {
      var st = document.createElement('style');
      st.textContent =
        '@keyframes CB_dotBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}' +
        '@keyframes CB_slideInLeft{from{transform:translateX(-100%)}to{transform:translateX(0)}}' +
        '@keyframes CB_slideInUp{from{transform:translateY(100%)}to{transform:translateY(0)}}' +
        '@keyframes CB_spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}';
      document.head.appendChild(st);
      CB_styleInjected = true;
    }
  }, []);

  // ── Auth + viewport resize ──
  useEffect(function() {
    function CB_onResize() { CB_setIsDesktop(window.innerWidth >= 768); }
    window.addEventListener('resize', CB_onResize);

    if (!window.ECEPT_SUPABASE) {
      CB_setSession(false);
      return function() { window.removeEventListener('resize', CB_onResize); };
    }
    try {
      window.ECEPT_SUPABASE.auth.getSession().then(function(res) {
        if (res && res.data && res.data.session) {
          var uid = res.data.session.user.id;
          CB_setSession(true); CB_setUid(uid);
          window.ECEPT_SUPABASE.from('profiles').select('role,credits').eq('id', uid).single()
            .then(function(prof) {
              if (prof && prof.data) {
                CB_setRole(prof.data.role || 'student');
                CB_setCredits(prof.data.credits || 0);
              }
            }).catch(function() { CB_setRole('student'); });
          // TODO: persist — load localStorage['ECEPT_CHAT_HISTORY'] in commit B
        } else {
          CB_setSession(false);
        }
      }).catch(function() { CB_setSession(false); });
    } catch(e2) { CB_setSession(false); }

    return function() { window.removeEventListener('resize', CB_onResize); };
  }, []);

  // ── Auto-scroll on new messages ──
  useEffect(function() {
    if (CB_scrollRef.current) CB_scrollRef.current.scrollTop = CB_scrollRef.current.scrollHeight;
  }, [CB_msgs, CB_loading]);

  // ── Send ──
  async function CB_send() {
    var txt = CB_input.trim();
    if (CB_loading || (!txt && CB_pendingFiles.length === 0)) return;

    var modelName = CB_selectedModel;
    for (var mi = 0; mi < CB_MODELS.length; mi++) {
      if (CB_MODELS[mi].id === CB_selectedModel) { modelName = CB_MODELS[mi].name; break; }
    }

    var history = CB_msgs.slice(-9).map(function(m) { return { role:m.role, content:m.text }; });
    history.push({ role:'user', content:txt });

    CB_setInput('');
    CB_setPendingFiles([]);
    CB_setLoading(true);
    CB_setConnErr('');
    CB_setMsgs(function(prev) { return prev.concat([{ role:'user', text:txt, ts:Date.now() }]); });

    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) {
        CB_setMsgs(function(prev) { return prev.concat([{ role:'assistant', text:'Sesión expirada. Volvé a iniciar sesión.', error:true, ts:Date.now() }]); });
        CB_setLoading(false); return;
      }
      var res = await fetch('/api/chat', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+token },
        body:JSON.stringify({ messages:history, model:CB_selectedModel })
        // attachments: CB_pendingFiles — TODO commit B
      });
      var data = await res.json();

      if (res.status === 402) {
        CB_setMsgs(function(prev) { return prev.concat([{ role:'assistant', text:'Sin créditos para '+modelName+'. Cambiá a Flash Lite o comprá créditos.', error:true, ts:Date.now() }]); });
        CB_setLoading(false); return;
      }
      if (!res.ok || !data.reply) {
        CB_setMsgs(function(prev) { return prev.concat([{ role:'assistant', text:'Error de conexión. Intentá de nuevo.', error:true, ts:Date.now() }]); });
        CB_setConnErr('Error'); CB_setLoading(false); return;
      }
      if (data.quota) { CB_setQuota(data.quota); CB_setCredits(data.quota.credits); }
      CB_setMsgs(function(prev) { return prev.concat([{ role:'assistant', text:data.reply, ts:Date.now() }]); });
      // TODO: persist — save to localStorage['ECEPT_CHAT_HISTORY'] in commit B
    } catch(err) {
      CB_setMsgs(function(prev) { return prev.concat([{ role:'assistant', text:'Error de conexión. Intentá de nuevo.', error:true, ts:Date.now() }]); });
      CB_setConnErr(err.message || 'Error');
    }
    CB_setLoading(false);
  }

  // ── Derived values ──
  var isMobile = !CB_isDesktop;
  var currentModel = null;
  for (var cmIdx = 0; cmIdx < CB_MODELS.length; cmIdx++) {
    if (CB_MODELS[cmIdx].id === CB_selectedModel) { currentModel = CB_MODELS[cmIdx]; break; }
  }
  var modelLabel  = currentModel ? (currentModel.icon+' '+currentModel.name) : CB_selectedModel;
  var quotaStr    = CB_quota ? (CB_quota.dailyUsed+'/'+CB_quota.dailyLimit) : '—';
  var quickPrompts = ['Explicame los betabloqueantes','DDx de dolor torácico','Resumen de cetoacidosis diabética'];

  var panelStyle;
  if (isMobile) {
    panelStyle = { position:'fixed', inset:0, background:C.bg, zIndex:9999, display:'flex', flexDirection:'column', animation:'CB_slideInUp 250ms ease-out' };
  } else if (CB_fullscreen) {
    panelStyle = { position:'fixed', inset:0, background:C.bg, zIndex:9999, display:'flex', flexDirection:'row', animation:'CB_slideInLeft 250ms ease-out' };
  } else {
    panelStyle = { position:'fixed', left:0, top:0, bottom:0, width:'420px', background:C.bg, borderRight:'1px solid '+C.bd, zIndex:9999, display:'flex', flexDirection:'column', animation:'CB_slideInLeft 250ms ease-out' };
  }

  return e('div', null,

    // ── Floating button ──
    !CB_open && e('button', {
      onClick: function() {
        if (CB_session === false) { if (typeof props.onLoginRequest === 'function') props.onLoginRequest(); }
        else { CB_setOpen(true); CB_setConnErr(''); }
      },
      'aria-label':'Abrir asistente Elion',
      style:{ position:'fixed', bottom:20, right:20, width:52, height:52, minWidth:44, minHeight:44, borderRadius:'50%', background:'linear-gradient(135deg,#60a5fa,#a78bfa)', border:'none', color:'#fff', fontSize:20, cursor:'pointer', boxShadow:'0 4px 20px rgba(96,165,250,.45)', zIndex:95, display:'flex', alignItems:'center', justifyContent:'center' }
    }, '🧬'),

    // ── Backdrop (mobile / fullscreen) ──
    CB_open && (isMobile || CB_fullscreen) && e('div', {
      onClick: function() { CB_setOpen(false); CB_setFullscreen(false); },
      style:{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:9998 }
    }),

    // ── Panel ──
    CB_open && e('div', { style:panelStyle },

      // Sidebar (desktop fullscreen only)
      CB_isDesktop && CB_fullscreen && e('div', {
        style:{ width:280, flexShrink:0, borderRight:'1px solid '+C.bd, padding:'20px 16px' }
      }, e('div', { style:{ color:C.mt, fontSize:12, fontWeight:600 } }, 'Conversación actual')),

      // Main column
      e('div', { style:{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' } },

        // ── Header ──
        e('div', { style:{ padding:'12px 16px', borderBottom:'1px solid '+C.bd, display:'flex', alignItems:'center', justifyContent:'space-between', background:C.bg, flexShrink:0 } },
          e('div', { style:{ display:'flex', alignItems:'center', gap:10, overflow:'hidden', minWidth:0 } },
            CB_elionAvatar(32),
            e('div', { style:{ display:'flex', flexDirection:'column', gap:2, overflow:'hidden' } },
              e('div', { style:{ fontWeight:700, color:C.tx, fontSize:16, lineHeight:'1.2' } }, 'Elion'),
              e('div', {
                onClick: function() { CB_setShowPicker(true); },
                style:{ fontSize:11, color:C.mt, lineHeight:'1.2', cursor:'pointer', display:'flex', gap:5, alignItems:'center', flexWrap:'wrap' }
              },
                e('span', null, modelLabel),
                e('span', { style:{ color:C.bd } }, '·'),
                e('span', null, quotaStr+' hoy'),
                e('span', { style:{ color:C.bd } }, '·'),
                e('span', null, '🪙'+CB_credits)
              )
            )
          ),
          e('div', { style:{ display:'flex', alignItems:'center', gap:4, flexShrink:0 } },
            CB_isDesktop && e('button', {
              onClick: function() { CB_setFullscreen(function(f) { return !f; }); },
              'aria-label': CB_fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa',
              style:{ background:'none', border:'none', color:C.mt, fontSize:16, cursor:'pointer', minWidth:44, minHeight:44, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8 }
            }, CB_fullscreen ? '↙' : '⛶'),
            e('button', {
              onClick: function() { CB_setOpen(false); CB_setFullscreen(false); },
              'aria-label':'Cerrar',
              style:{ background:'none', border:'none', color:C.mt, fontSize:22, cursor:'pointer', minWidth:44, minHeight:44, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8 }
            }, '×')
          )
        ),

        // ── Content ──
        CB_session === null
          ? e('div', { style:{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' } },
              e('div', { style:{ color:C.dm, fontSize:13 } }, 'Verificando sesión...')
            )
          : CB_session === false
          ? e('div', { style:{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, gap:12 } },
              e('div', { style:{ fontSize:32, marginBottom:4 } }, '🔒'),
              e('div', { style:{ color:C.tx, fontSize:14, fontWeight:600, textAlign:'center' } }, 'Necesitás una cuenta'),
              e('div', { style:{ color:C.mt, fontSize:13, textAlign:'center', lineHeight:1.5 } }, 'El asistente está disponible para usuarios registrados.'),
              e('button', {
                onClick: function() { CB_setOpen(false); if (typeof props.onLoginRequest === 'function') props.onLoginRequest(); },
                style:{ minHeight:44, padding:'12px 20px', borderRadius:10, background:C.ac, color:'#fff', border:'none', cursor:'pointer', fontSize:14, fontWeight:700 }
              }, 'Crear cuenta / Iniciar sesión')
            )
          : e(F, null,
              // Messages scroll area
              e('div', { ref:CB_scrollRef, style:{ flex:1, overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:12 } },

                // Empty state
                CB_msgs.length === 0 && !CB_loading && e('div', {
                  style:{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1, gap:14, minHeight:200, paddingTop:20 }
                },
                  e('div', { style:{ fontSize:44 } }, '🧬'),
                  e('div', { style:{ color:C.tx, fontWeight:700, fontSize:18 } }, 'Hola, soy Elion'),
                  e('div', { style:{ color:C.mt, fontSize:13 } }, '¿Con qué te ayudo hoy?'),
                  e('div', { style:{ display:'flex', flexDirection:'column', gap:8, width:'100%', maxWidth:300, marginTop:4 } },
                    quickPrompts.map(function(qp, qi) {
                      return e('button', {
                        key:qi,
                        onClick: function() { CB_setInput(qp); if (CB_inputRef.current) CB_inputRef.current.focus(); },
                        style:{ minHeight:44, padding:'10px 14px', borderRadius:10, background:'rgba(59,130,246,.08)', border:'1px solid rgba(59,130,246,.2)', color:C.tx, fontSize:13, cursor:'pointer', textAlign:'left', lineHeight:1.4 }
                      }, qp);
                    })
                  )
                ),

                // Message list
                CB_msgs.map(function(m, i) {
                  var isUser = m.role === 'user';
                  return e('div', { key:i, style:{ display:'flex', flexDirection:'column', alignItems:isUser?'flex-end':'flex-start', gap:4 } },
                    isUser
                      ? e('div', { style:{ maxWidth:'85%', padding:'12px 16px', borderRadius:'18px 18px 4px 18px', background:'rgba(59,130,246,.15)', border:'1px solid '+C.ac, color:C.tx, fontSize:13, lineHeight:1.55, wordBreak:'break-word', whiteSpace:'pre-wrap' } }, m.text)
                      : e('div', { style:{ display:'flex', alignItems:'flex-start', gap:8, maxWidth:'92%' } },
                          CB_elionAvatar(28),
                          e('div', { style:{ padding:'12px 16px', borderRadius:'4px 18px 18px 18px', background:m.error?'rgba(239,68,68,.08)':C.cd, border:'1px solid '+(m.error?'rgba(239,68,68,.25)':C.bd), color:m.error?'#ef4444':C.tx, fontSize:13, lineHeight:1.55, wordBreak:'break-word' } },
                            m.error ? e('span', null, m.text) : CB_renderMarkdown(m.text)
                          )
                        )
                  );
                }),

                // Typing indicator
                CB_loading && e('div', { style:{ display:'flex', alignItems:'flex-start', gap:8 } },
                  CB_elionAvatar(28),
                  e('div', { style:{ padding:'12px 16px', borderRadius:'4px 18px 18px 18px', background:C.cd, border:'1px solid '+C.bd, display:'flex', alignItems:'center', gap:5 } },
                    e('span', { style:{ display:'inline-block', fontSize:8, color:C.dm, animation:'CB_dotBounce .8s ease-in-out infinite', animationDelay:'0s' } }, '●'),
                    e('span', { style:{ display:'inline-block', fontSize:8, color:C.dm, animation:'CB_dotBounce .8s ease-in-out infinite', animationDelay:'.15s' } }, '●'),
                    e('span', { style:{ display:'inline-block', fontSize:8, color:C.dm, animation:'CB_dotBounce .8s ease-in-out infinite', animationDelay:'.3s' } }, '●')
                  )
                )
              ),

              // ── Input bar ──
              e('div', { style:{ padding:'10px 12px', borderTop:'1px solid '+C.bd, background:C.bg, flexShrink:0 } },
                e('div', { style:{ display:'flex', alignItems:'flex-end', gap:8 } },
                  e('button', {
                    disabled:true, title:'Próximamente',
                    style:{ minWidth:44, minHeight:44, flexShrink:0, background:'rgba(255,255,255,.04)', border:'1px solid '+C.bd, borderRadius:10, color:C.mt, fontSize:16, cursor:'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', opacity:0.5 }
                  }, '📎'),
                  e('textarea', {
                    ref:CB_inputRef,
                    value:CB_input, rows:1,
                    onChange:function(ev) {
                      CB_setInput(ev.target.value);
                      ev.target.style.height='auto';
                      ev.target.style.height=Math.min(ev.target.scrollHeight,96)+'px';
                    },
                    onKeyDown:function(ev) { if (ev.key==='Enter'&&!ev.shiftKey) { ev.preventDefault(); CB_send(); } },
                    placeholder:'Escribe tu mensaje...',
                    disabled:CB_loading,
                    'aria-label':'Mensaje',
                    style:{ flex:1, minHeight:44, maxHeight:96, padding:'11px 12px', borderRadius:10, border:'1px solid '+C.bd, background:C.cd, color:C.tx, fontSize:14, outline:'none', resize:'none', lineHeight:'1.4', fontFamily:'inherit', overflowY:'auto' }
                  }),
                  e('button', {
                    onClick:CB_send,
                    disabled:CB_loading||(!CB_input.trim()&&CB_pendingFiles.length===0),
                    'aria-label':CB_loading?'Cargando':'Enviar',
                    style:{ minWidth:44, minHeight:44, flexShrink:0, padding:'0 14px', borderRadius:10, background:(CB_loading||(!CB_input.trim()&&CB_pendingFiles.length===0))?C.dm:C.ac, color:'#fff', border:'none', cursor:(CB_loading||(!CB_input.trim()&&CB_pendingFiles.length===0))?'default':'pointer', fontSize:16, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }
                  }, CB_loading
                    ? e('span', { style:{ display:'inline-block', animation:'CB_spin .8s linear infinite' } }, '⟳')
                    : '➤'
                  )
                )
              )
            )
      )
    )
  );
}
window.ChatBot = ChatBot;
