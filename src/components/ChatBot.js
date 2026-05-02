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
    background:'rgba(59,130,246,.15)', border:'1px solid rgba(59,130,246,.3)',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:Math.round(sz*0.52)+'px', userSelect:'none'
  }}, '🧬');
}

// ── Inline markdown: [link](url), **bold**, `code`, *italic* ─
function CB_parseInline(text) {
  var result = [];
  var remaining = String(text || '');
  var kn = 0;
  // Groups: 1=link-text 2=link-url 3=bold 4=code 5=italic
  while (remaining.length > 0) {
    var m = /\[([^\]]+)\]\(([^)]+)\)|\*\*(.+?)\*\*|`([^`]+)`|\*([^*\n]+)\*/.exec(remaining);
    if (!m) { if (remaining) result.push(remaining); break; }
    if (m.index > 0) result.push(remaining.slice(0, m.index));
    if (m[1] !== undefined) {
      // Link — IIFE captures href/label per iteration
      (function(href, label, key) {
        if (href.indexOf('#') === 0) {
          var route = href.slice(1);
          result.push(e('span', { key:key, onClick:function() {
            if (window.CB_go) window.CB_go(route);
            if (window._CB_closePanel) window._CB_closePanel();
          }, style:{ color:C.ac, cursor:'pointer', textDecoration:'underline' } }, label));
        } else {
          result.push(e('a', { key:key, href:href, target:'_blank', rel:'noopener', style:{ color:C.ac2, textDecoration:'underline' } }, label));
        }
      })(m[2], m[1], 'ck'+(kn++));
    } else if (m[3] !== undefined) {
      result.push(e('strong', { key:'ck'+(kn++), style:{fontWeight:700} }, m[3]));
    } else if (m[4] !== undefined) {
      result.push(e('code', { key:'ck'+(kn++), style:{background:'rgba(255,255,255,.1)',padding:'1px 4px',borderRadius:3,fontFamily:'monospace',fontSize:'0.9em'} }, m[4]));
    } else if (m[5] !== undefined) {
      result.push(e('em', { key:'ck'+(kn++), style:{fontStyle:'italic'} }, m[5]));
    } else result.push(m[0]);
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

    // Code block
    if (/^\s*```/.test(line)) {
      var codeLines = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) { codeLines.push(lines[i]); i++; }
      elems.push(e('pre', { key:'mk'+(kn++), style:{ background:'#0a0e1f', border:'1px solid '+C.bd, borderRadius:8, padding:12, fontSize:12, fontFamily:'monospace', overflowX:'auto', margin:'8px 0', color:'#e2e8f0', whiteSpace:'pre-wrap', wordBreak:'break-all' } }, codeLines.join('\n')));
      i++; continue;
    }

    // Headers
    if (line.indexOf('### ') === 0) {
      elems.push(e('div', { key:'mk'+(kn++), style:{ color:C.ac2, fontSize:14, fontWeight:600, marginTop:12, marginBottom:6 } }, e('span', null, CB_parseInline(line.slice(4)))));
      i++; continue;
    }
    if (line.indexOf('## ') === 0) {
      elems.push(e('div', { key:'mk'+(kn++), style:{ color:C.ac, fontSize:16, fontWeight:700, marginTop:16, marginBottom:8 } }, e('span', null, CB_parseInline(line.slice(3)))));
      i++; continue;
    }
    if (line.indexOf('# ') === 0) {
      elems.push(e('div', { key:'mk'+(kn++), style:{ color:C.ac, fontSize:18, fontWeight:700, marginTop:16, marginBottom:8 } }, e('span', null, CB_parseInline(line.slice(2)))));
      i++; continue;
    }

    // Horizontal rule
    if (/^\s*---+\s*$/.test(line) || /^\s*\*\*\*+\s*$/.test(line)) {
      elems.push(e('hr', { key:'mk'+(kn++), style:{ border:0, borderTop:'1px solid '+C.bd, margin:'12px 0' } }));
      i++; continue;
    }

    // Table
    if (line.indexOf('|') !== -1 && i+1 < lines.length && /^\s*\|[\s|:=-]+\|\s*$/.test(lines[i+1])) {
      var headerCells = line.split('|').filter(function(c) { return c.trim() !== ''; }).map(function(c) { return c.trim(); });
      i += 2;
      var tableRows = [];
      while (i < lines.length && lines[i].indexOf('|') !== -1) { tableRows.push(lines[i]); i++; }
      elems.push(e('div', { key:'mk'+(kn++), style:{ overflowX:'auto', margin:'8px 0' } },
        e('table', { style:{ borderCollapse:'collapse', width:'100%', fontSize:12 } },
          e('thead', null, e('tr', null,
            headerCells.map(function(hc, hi) {
              return e('th', { key:hi, style:{ padding:'8px', borderBottom:'2px solid '+C.ac, textAlign:'left', color:C.ac, fontWeight:700 } }, hc);
            })
          )),
          e('tbody', null,
            tableRows.map(function(row, ri) {
              var cells = row.split('|').filter(function(c) { return c.trim() !== ''; }).map(function(c) { return c.trim(); });
              return e('tr', { key:ri },
                cells.map(function(cell, ci) {
                  return e('td', { key:ci, style:{ padding:'8px', borderBottom:'1px solid '+C.bd, fontSize:13 } }, e('span', null, CB_parseInline(cell)));
                })
              );
            })
          )
        )
      ));
      continue;
    }

    // Callout blocks
    var calloutStyle = null;
    if (line.indexOf('⚠') === 0)
      calloutStyle = { background:'rgba(245,158,11,.1)', borderLeft:'3px solid #fbbf24', padding:'8px 12px', borderRadius:6, margin:'4px 0' };
    else if (line.indexOf('💡') === 0)
      calloutStyle = { background:'rgba(52,211,153,.1)', borderLeft:'3px solid #34d399', padding:'8px 12px', borderRadius:6, margin:'4px 0' };
    else if (line.indexOf('🚨') === 0)
      calloutStyle = { background:'rgba(239,68,68,.08)', borderLeft:'3px solid #ef4444', padding:'8px 12px', borderRadius:6, margin:'4px 0' };
    if (calloutStyle) {
      elems.push(e('div', { key:'mk'+(kn++), style:calloutStyle }, e('span', null, CB_parseInline(line))));
      i++; continue;
    }

    // List items
    if (line.indexOf('- ') === 0 || line.indexOf('* ') === 0) {
      elems.push(e('div', { key:'mk'+(kn++), style:{ display:'flex', gap:'6px', margin:'2px 0', alignItems:'flex-start' } },
        e('span', { style:{ color:C.ac, flexShrink:0, marginTop:2, fontSize:12 } }, '•'),
        e('span', { style:{ lineHeight:1.55 } }, e('span', null, CB_parseInline(line.slice(2))))
      ));
      i++; continue;
    }

    // Empty line
    if (!line.trim()) {
      elems.push(e('div', { key:'mk'+(kn++), style:{ height:6 } }));
      i++; continue;
    }

    // Normal paragraph
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
  s=useState(false);                     var CB_inputFocused=s[0],    CB_setInputFocused=s[1];

  var CB_scrollRef = useRef(null);
  var CB_inputRef  = useRef(null);

  // ── Inject CSS animations once ──
  useEffect(function() {
    if (!CB_styleInjected) {
      var st = document.createElement('style');
      st.textContent =
        '@keyframes CB_dotBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}' +
        '@keyframes CB_panelIn{from{opacity:0;transform:translateX(-30px) scale(0.97)}to{opacity:1;transform:translateX(0) scale(1)}}' +
        '@keyframes CB_panelInMobile{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}' +
        '@keyframes CB_spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}';
      document.head.appendChild(st);
      CB_styleInjected = true;
    }
  }, []);

  // ── Scroll lock when panel is fullscreen or on mobile ──
  useEffect(function() {
    var locked = CB_open && (CB_fullscreen || !CB_isDesktop);
    document.body.style.overflow = locked ? 'hidden' : '';
    return function() { document.body.style.overflow = ''; };
  }, [CB_open, CB_fullscreen, CB_isDesktop]);

  // ── iPad keyboard fix (visualViewport) ──
  useEffect(function() {
    if (!CB_open || !window.visualViewport) return;
    function CB_handleViewport() {
      var vv = window.visualViewport;
      var panel = document.getElementById('CB_panel');
      if (!panel) return;
      if (CB_isDesktop && !CB_fullscreen) {
        var kbHeight = window.innerHeight - vv.height;
        panel.style.bottom = (16 + kbHeight) + 'px';
      } else {
        panel.style.height = vv.height + 'px';
      }
    }
    window.visualViewport.addEventListener('resize', CB_handleViewport);
    window.visualViewport.addEventListener('scroll', CB_handleViewport);
    CB_handleViewport();
    return function() {
      window.visualViewport.removeEventListener('resize', CB_handleViewport);
      window.visualViewport.removeEventListener('scroll', CB_handleViewport);
      var panel = document.getElementById('CB_panel');
      if (panel) { panel.style.bottom = ''; panel.style.height = ''; }
    };
  }, [CB_open, CB_isDesktop, CB_fullscreen]);

  // ── Expose close handler for deeplink auto-close ──
  useEffect(function() {
    window._CB_closePanel = function() { CB_setOpen(false); CB_setFullscreen(false); };
    return function() { window._CB_closePanel = null; };
  }, [CB_setOpen, CB_setFullscreen]);

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
  var modelLabel   = currentModel ? (currentModel.icon+' '+currentModel.name) : CB_selectedModel;
  var quotaStr     = CB_quota ? (CB_quota.dailyUsed+'/'+CB_quota.dailyLimit) : '—';
  var quickPrompts = ['Explicame los betabloqueantes','DDx de dolor torácico','Resumen de cetoacidosis diabética'];

  var panelStyle;
  if (isMobile) {
    panelStyle = { position:'fixed', inset:0, background:C.bg, zIndex:9999, display:'flex', flexDirection:'column', overflow:'hidden', animation:'CB_panelInMobile 280ms cubic-bezier(0.32,0.72,0,1)' };
  } else if (CB_fullscreen) {
    panelStyle = { position:'fixed', inset:0, background:C.bg, zIndex:9999, display:'flex', flexDirection:'row', overflow:'hidden', animation:'CB_panelIn 280ms cubic-bezier(0.32,0.72,0,1)' };
  } else {
    panelStyle = { position:'fixed', top:16, left:16, bottom:16, width:'440px', borderRadius:20, background:'linear-gradient(180deg,#0d1224 0%,#060a14 100%)', border:'1px solid rgba(59,130,246,.25)', boxShadow:'0 20px 60px rgba(0,0,0,.6),0 0 0 1px rgba(59,130,246,.1) inset', zIndex:9999, display:'flex', flexDirection:'column', overflow:'hidden', animation:'CB_panelIn 280ms cubic-bezier(0.32,0.72,0,1)' };
  }

  var inputContainerStyle = {
    display:'flex', alignItems:'flex-end', gap:8,
    background:C.cd, border:'1px solid '+(CB_inputFocused?'rgba(59,130,246,.4)':C.bd),
    borderRadius:14, padding:'6px 8px 6px 12px',
    transition:'border-color .2s,box-shadow .2s',
    boxShadow:CB_inputFocused?'0 0 0 3px rgba(59,130,246,.1)':'none'
  };

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

    // ── Backdrop (mobile / fullscreen only) ──
    CB_open && (isMobile || CB_fullscreen) && e('div', {
      onClick: function() { CB_setOpen(false); CB_setFullscreen(false); },
      style:{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:9998 }
    }),

    // ── Panel ──
    CB_open && e('div', { id:'CB_panel', style:panelStyle },

      // Sidebar (desktop fullscreen only)
      CB_isDesktop && CB_fullscreen && e('div', {
        style:{ width:280, flexShrink:0, borderRight:'1px solid '+C.bd, padding:'20px 16px' }
      }, e('div', { style:{ color:C.mt, fontSize:12, fontWeight:600 } }, 'Conversación actual')),

      // Main column
      e('div', { style:{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' } },

        // ── Header ──
        e('div', { style:{ padding:'18px 20px 16px', background:'linear-gradient(180deg,rgba(59,130,246,.08),transparent)', borderBottom:'1px solid rgba(59,130,246,.15)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 } },
          e('div', { style:{ display:'flex', alignItems:'center', gap:12, overflow:'hidden', minWidth:0 } },
            e('div', { style:{ width:36, height:36, borderRadius:'50%', background:'rgba(59,130,246,.15)', border:'1px solid rgba(59,130,246,.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 } }, '🧬'),
            e('div', { style:{ display:'flex', flexDirection:'column', gap:2, overflow:'hidden' } },
              e('div', { style:{ fontWeight:700, fontSize:16, lineHeight:'1.2', background:'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' } }, 'Elion'),
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
              e('div', { ref:CB_scrollRef, style:{ flex:1, overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:14 } },

                // Empty state
                CB_msgs.length === 0 && !CB_loading && e('div', {
                  style:{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1, gap:14, minHeight:200, paddingTop:20 }
                },
                  e('div', { style:{ width:64, height:64, borderRadius:'50%', background:'rgba(59,130,246,.12)', border:'1px solid rgba(59,130,246,.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, boxShadow:'0 0 40px rgba(59,130,246,.3)' } }, '🧬'),
                  e('div', { style:{ fontWeight:700, fontSize:20, background:'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' } }, 'Hola, soy Elion'),
                  e('div', { style:{ color:C.mt, fontSize:13 } }, '¿Con qué te ayudo hoy?'),
                  e('div', { style:{ display:'flex', flexDirection:'column', gap:8, width:'100%', maxWidth:300, marginTop:4 } },
                    quickPrompts.map(function(qp, qi) {
                      return e('button', {
                        key:qi,
                        onClick: function() { CB_setInput(qp); if (CB_inputRef.current) CB_inputRef.current.focus(); },
                        style:{ minHeight:44, padding:'12px 14px', borderRadius:12, background:C.cd, border:'1px solid '+C.bd, color:C.tx, fontSize:13, cursor:'pointer', textAlign:'left', lineHeight:1.4, transition:'border-color .2s,transform .2s' }
                      }, qp);
                    })
                  )
                ),

                // Message list
                CB_msgs.map(function(m, i) {
                  var isUser = m.role === 'user';
                  return e('div', { key:i, style:{ display:'flex', flexDirection:'column', alignItems:isUser?'flex-end':'flex-start', gap:4 } },
                    isUser
                      ? e('div', { style:{ maxWidth:'85%', padding:'14px 16px', borderRadius:'18px 18px 4px 18px', background:'linear-gradient(135deg,rgba(59,130,246,.18),rgba(96,165,250,.12))', border:'1px solid rgba(96,165,250,.25)', color:C.tx, fontSize:13, lineHeight:1.55, wordBreak:'break-word', whiteSpace:'pre-wrap' } }, m.text)
                      : e('div', { style:{ display:'flex', alignItems:'flex-start', gap:8, maxWidth:'92%' } },
                          CB_elionAvatar(28),
                          e('div', { style:{ padding:'14px 16px', borderRadius:'4px 18px 18px 18px', background:m.error?'rgba(239,68,68,.08)':'#0d1224', border:'1px solid '+(m.error?'rgba(239,68,68,.25)':'#1a2040'), boxShadow:m.error?'none':'0 2px 8px rgba(0,0,0,.2)', color:m.error?'#ef4444':C.tx, fontSize:13, lineHeight:1.55, wordBreak:'break-word' } },
                            m.error ? e('span', null, m.text) : CB_renderMarkdown(m.text)
                          )
                        )
                  );
                }),

                // Typing indicator
                CB_loading && e('div', { style:{ display:'flex', alignItems:'flex-start', gap:8 } },
                  CB_elionAvatar(28),
                  e('div', { style:{ padding:'14px 16px', borderRadius:'4px 18px 18px 18px', background:'#0d1224', border:'1px solid #1a2040', display:'flex', alignItems:'center', gap:5 } },
                    e('span', { style:{ display:'inline-block', fontSize:8, color:C.dm, animation:'CB_dotBounce .8s ease-in-out infinite', animationDelay:'0s' } }, '●'),
                    e('span', { style:{ display:'inline-block', fontSize:8, color:C.dm, animation:'CB_dotBounce .8s ease-in-out infinite', animationDelay:'.15s' } }, '●'),
                    e('span', { style:{ display:'inline-block', fontSize:8, color:C.dm, animation:'CB_dotBounce .8s ease-in-out infinite', animationDelay:'.3s' } }, '●')
                  )
                )
              ),

              // ── Input bar (capsule design) ──
              e('div', { style:{ padding:'12px 14px', borderTop:'1px solid rgba(59,130,246,.1)', background:C.bg, flexShrink:0 } },
                e('div', { style:inputContainerStyle },
                  e('button', {
                    disabled:true, title:'Próximamente',
                    style:{ width:32, height:32, flexShrink:0, background:'none', border:'none', color:C.mt, fontSize:16, cursor:'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', opacity:0.4, padding:0 }
                  }, '📎'),
                  e('textarea', {
                    ref:CB_inputRef,
                    value:CB_input, rows:1,
                    onFocus: function() { CB_setInputFocused(true); },
                    onBlur:  function() { CB_setInputFocused(false); },
                    onChange:function(ev) {
                      CB_setInput(ev.target.value);
                      ev.target.style.height='auto';
                      ev.target.style.height=Math.min(ev.target.scrollHeight,96)+'px';
                    },
                    onKeyDown:function(ev) { if (ev.key==='Enter'&&!ev.shiftKey) { ev.preventDefault(); CB_send(); } },
                    placeholder:'Escribe tu mensaje...',
                    disabled:CB_loading,
                    enterKeyHint:'send',
                    'aria-label':'Mensaje',
                    style:{ flex:1, minHeight:36, maxHeight:96, padding:'8px 4px', border:'none', background:'transparent', color:C.tx, fontSize:14, outline:'none', resize:'none', lineHeight:'1.4', fontFamily:'inherit', overflowY:'auto' }
                  }),
                  e('button', {
                    onClick:CB_send,
                    disabled:CB_loading||(!CB_input.trim()&&CB_pendingFiles.length===0),
                    'aria-label':CB_loading?'Cargando':'Enviar',
                    style:{ width:36, height:36, flexShrink:0, borderRadius:10, border:'none', background:(CB_loading||(!CB_input.trim()&&CB_pendingFiles.length===0))?'#1a2040':C.ac, color:'#fff', cursor:(CB_loading||(!CB_input.trim()&&CB_pendingFiles.length===0))?'default':'pointer', fontSize:14, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', transition:'background .2s', padding:0 }
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
