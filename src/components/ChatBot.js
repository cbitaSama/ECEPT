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

var CB_MODEL_INFO = [
  {
    id:'gemini-2.5-flash-lite', icon:'⚡', name:'Flash Lite',
    tagline:'Rápido y eficiente',
    description:'Ideal para preguntas cotidianas, definiciones, repaso rápido.',
    bullets:['Respuestas en segundos','Acceso libre con cuota diaria','1 🪙 por mensaje extra'],
    gradient:'linear-gradient(135deg,rgba(96,165,250,0.15),rgba(96,165,250,0.05))',
    accent:'#60a5fa'
  },
  {
    id:'gemini-2.5-flash', icon:'✨', name:'Flash 2.5',
    tagline:'Mejor calidad y razonamiento',
    description:'Para casos clínicos complejos, análisis comparativos, esquemas detallados.',
    bullets:['Razonamiento más sólido','⭐ Incluido en Premium','3 🪙 por mensaje (sin Premium)'],
    gradient:'linear-gradient(135deg,rgba(167,139,250,0.18),rgba(167,139,250,0.06))',
    accent:'#a78bfa', badge:'POPULAR'
  },
  {
    id:'gemini-2.5-pro', icon:'🧠', name:'Pro 2.5',
    tagline:'Máxima inteligencia',
    description:'Análisis profundo de documentos largos, casos extensos, razonamiento avanzado.',
    bullets:['Razonamiento avanzado','Sin cuota gratis','15 🪙 por mensaje'],
    gradient:'linear-gradient(135deg,rgba(251,191,36,0.18),rgba(251,191,36,0.06))',
    accent:'#fbbf24', badge:'PREMIUM'
  }
];

var CB_styleInjected = false;

var CB_CALLOUTS = {
  '⚠': { bg:'rgba(245,158,11,.1)',    border:'#fbbf24' },
  '💡': { bg:'rgba(52,211,153,.1)',   border:'#34d399' },
  '🚨': { bg:'rgba(239,68,68,.08)',   border:'#ef4444' },
  '📌': { bg:'rgba(99,102,241,.1)',   border:'#818cf8' },
  '🔬': { bg:'rgba(139,92,246,.08)',  border:'#a78bfa' },
  '📊': { bg:'rgba(59,130,246,.08)',  border:'#60a5fa' },
  '🩺': { bg:'rgba(20,184,166,.08)',  border:'#2dd4bf' }
};

function CB_elionAvatar(sz) {
  // Avatar premium: Logo SVG hélice doble en círculo gradiente sutil
  return e('div', { style:{
    width:sz+'px', height:sz+'px', flexShrink:0, borderRadius:'50%',
    background:'linear-gradient(135deg,rgba(96,165,250,0.18),rgba(167,139,250,0.10))',
    border:'1px solid rgba(167,139,250,0.30)',
    display:'flex', alignItems:'center', justifyContent:'center',
    boxShadow:'0 0 12px rgba(167,139,250,0.18)', userSelect:'none', overflow:'hidden'
  }}, e(window.Logo || 'span', { size: Math.round(sz * 0.78), idSuffix:'av_'+sz }));
}

// ── Inline markdown: [link](url), **bold**, `code`, *italic* ─
function CB_parseInline(text) {
  var result = [];
  var remaining = String(text || '');
  var kn = 0;
  while (remaining.length > 0) {
    var m = /\[([^\]]+)\]\(([^)]+)\)|\*\*(.+?)\*\*|`([^`]+)`|\*([^*\n]+)\*/.exec(remaining);
    if (!m) { if (remaining) result.push(remaining); break; }
    if (m.index > 0) result.push(remaining.slice(0, m.index));
    if (m[1] !== undefined) {
      (function(href, label, key) {
        if (href.indexOf('#') === 0) {
          var route = href.slice(1);
          result.push(e('button', { key:key,
            onClick:function(ev) {
              ev.preventDefault(); ev.stopPropagation();
              if (window.CB_go) window.CB_go(route);
              if (window._CB_closePanel) window._CB_closePanel();
            },
            onMouseOver:function(ev) {
              ev.currentTarget.style.background='linear-gradient(135deg,rgba(59,130,246,0.25),rgba(96,165,250,0.15))';
              ev.currentTarget.style.transform='translateY(-1px)';
            },
            onMouseOut:function(ev) {
              ev.currentTarget.style.background='linear-gradient(135deg,rgba(59,130,246,0.15),rgba(96,165,250,0.08))';
              ev.currentTarget.style.transform='translateY(0)';
            },
            style:{
              display:'inline-flex', alignItems:'center', gap:'6px',
              padding:'6px 12px', margin:'2px 4px 2px 0',
              background:'linear-gradient(135deg,rgba(59,130,246,0.15),rgba(96,165,250,0.08))',
              border:'1px solid rgba(96,165,250,0.3)', borderRadius:'999px',
              color:'#60a5fa', fontSize:'12px', fontWeight:500, cursor:'pointer',
              fontFamily:'inherit', transition:'all 200ms ease', whiteSpace:'nowrap'
            }
          }, '🔗 '+label));
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

    if (/^\s*```/.test(line)) {
      var codeLines = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) { codeLines.push(lines[i]); i++; }
      elems.push(e('pre', { key:'mk'+(kn++), style:{ background:'#0a0e1f', border:'1px solid '+C.bd, borderRadius:8, padding:12, fontSize:12, fontFamily:'monospace', overflowX:'auto', margin:'8px 0', color:'#e2e8f0', whiteSpace:'pre-wrap', wordBreak:'break-all' } }, codeLines.join('\n')));
      i++; continue;
    }

    if (line.indexOf('### ') === 0) {
      elems.push(e('div', { key:'mk'+(kn++), style:{ color:'#a78bfa', fontSize:14, fontWeight:600, marginTop:12, marginBottom:6 } }, e('span', null, CB_parseInline(line.slice(4)))));
      i++; continue;
    }
    if (line.indexOf('## ') === 0) {
      elems.push(e('div', { key:'mk'+(kn++), style:{ color:'#60a5fa', fontSize:17, fontWeight:700, marginTop:14, marginBottom:8, paddingBottom:4, borderBottom:'1px solid rgba(96,165,250,0.2)' } }, e('span', null, CB_parseInline(line.slice(3)))));
      i++; continue;
    }
    if (line.indexOf('# ') === 0) {
      elems.push(e('div', { key:'mk'+(kn++), style:{ color:C.ac, fontSize:18, fontWeight:700, marginTop:16, marginBottom:8 } }, e('span', null, CB_parseInline(line.slice(2)))));
      i++; continue;
    }

    if (/^\s*---+\s*$/.test(line) || /^\s*\*\*\*+\s*$/.test(line)) {
      elems.push(e('hr', { key:'mk'+(kn++), style:{ border:0, borderTop:'1px solid '+C.bd, margin:'12px 0' } }));
      i++; continue;
    }

    if (line.indexOf('|') !== -1 && i+1 < lines.length && /^\s*\|[\s|:=-]+\|\s*$/.test(lines[i+1])) {
      var headerCells = line.split('|').filter(function(c) { return c.trim() !== ''; }).map(function(c) { return c.trim(); });
      i += 2;
      var tableRows = [];
      while (i < lines.length && lines[i].indexOf('|') !== -1) { tableRows.push(lines[i]); i++; }
      elems.push(e('div', { key:'mk'+(kn++), style:{ overflowX:'auto', margin:'8px 0', borderRadius:8, border:'1px solid '+C.bd, overflow:'hidden' } },
        e('table', { style:{ borderCollapse:'collapse', width:'100%', fontSize:12 } },
          e('thead', null, e('tr', null,
            headerCells.map(function(hc, hi) {
              return e('th', { key:hi, style:{ padding:'8px 10px', background:'rgba(59,130,246,.1)', textAlign:'left', color:'#60a5fa', fontWeight:700, fontSize:11, letterSpacing:1, textTransform:'uppercase' } }, hc);
            })
          )),
          e('tbody', null,
            tableRows.map(function(row, ri) {
              var cells = row.split('|').filter(function(c) { return c.trim() !== ''; }).map(function(c) { return c.trim(); });
              var isLastRow = ri === tableRows.length - 1;
              return e('tr', { key:ri },
                cells.map(function(cell, ci) {
                  return e('td', { key:ci, style:{ padding:'8px 10px', borderBottom:isLastRow?'none':'1px solid '+C.bd, fontSize:13 } }, e('span', null, CB_parseInline(cell)));
                })
              );
            })
          )
        )
      ));
      continue;
    }

    var _calloutKey = null;
    var _calloutEmojis = Object.keys(CB_CALLOUTS);
    for (var _cki = 0; _cki < _calloutEmojis.length; _cki++) {
      if (line.indexOf(_calloutEmojis[_cki]) === 0) { _calloutKey = _calloutEmojis[_cki]; break; }
    }
    if (_calloutKey) {
      var _cs = CB_CALLOUTS[_calloutKey];
      elems.push(e('div', { key:'mk'+(kn++), style:{ background:_cs.bg, borderLeft:'3px solid '+_cs.border, padding:'8px 12px', borderRadius:6, margin:'4px 0' } }, e('span', null, CB_parseInline(line))));
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

    if (line.indexOf('📚 En ECEPT:') === 0) {
      var footerText = line.slice('📚 En ECEPT:'.length).trim();
      elems.push(e('div', { key:'mk'+(kn++), style:{ borderTop:'1px solid rgba(96,165,250,0.15)', marginTop:12, paddingTop:10, display:'flex', flexWrap:'wrap', alignItems:'center', gap:4 } },
        e('span', { style:{ fontSize:11, color:'#94a3b8', fontWeight:600, marginRight:4, flexShrink:0 } }, '📚 En ECEPT:'),
        e('span', { style:{ display:'inline-flex', flexWrap:'wrap', gap:4 } }, CB_parseInline(footerText))
      ));
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
  s=useState(false);                     var CB_inputFocused=s[0],    CB_setInputFocused=s[1];
  // ── New state (25b-D) ──
  s=useState([]);                        var CB_conversations=s[0],   CB_setConversations=s[1];
  s=useState(null);                      var CB_activeConvId=s[0],    CB_setActiveConvId=s[1];
  s=useState(false);                     var CB_loadingConvs=s[0],    CB_setLoadingConvs=s[1];
  s=useState(false);                     var CB_sidebarOpen=s[0],     CB_setSidebarOpen=s[1];
  s=useState(null);                      var CB_convMenuId=s[0],      CB_setConvMenuId=s[1];
  s=useState(null);                      var CB_renamingId=s[0],      CB_setRenamingId=s[1];
  s=useState('');                        var CB_renameValue=s[0],     CB_setRenameValue=s[1];
  s=useState(false);                     var CB_modelPickerOpen=s[0], CB_setModelPickerOpen=s[1];
  s=useState(false);                     var CB_settingsOpen=s[0],    CB_setSettingsOpen=s[1];
  s=useState('');                        var CB_userNotes=s[0],       CB_setUserNotes=s[1];
  s=useState(false);                     var CB_userNotesLoaded=s[0], CB_setUserNotesLoaded=s[1];
  s=useState(false);                     var CB_notesSaving=s[0],     CB_setNotesSaving=s[1];
  s=useState('');                        var CB_notesError=s[0],      CB_setNotesError=s[1];

  var CB_scrollRef = useRef(null);
  var CB_inputRef  = useRef(null);
  var CB_longPressRef = useRef(null);
  var CB_convLoadedRef = useRef(false);
  var CB_skipNextConvLoad = useRef(false);

  // ── Inject CSS animations once ──
  useEffect(function() {
    if (!CB_styleInjected) {
      var st = document.createElement('style');
      st.textContent =
        '@keyframes CB_dotBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}' +
        '@keyframes CB_panelIn{from{opacity:0;transform:translateX(-30px) scale(0.97)}to{opacity:1;transform:translateX(0) scale(1)}}' +
        '@keyframes CB_panelInMobile{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}' +
        '@keyframes CB_spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}' +
        '@keyframes CB_sidebarIn{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}' +
        '.CB_convItem:hover{background:rgba(96,165,250,0.08)!important;}';
      document.head.appendChild(st);
      CB_styleInjected = true;
    }
  }, []);

  // ── Scroll lock ──
  useEffect(function() {
    var locked = CB_open && (CB_fullscreen || !CB_isDesktop);
    document.body.style.overflow = locked ? 'hidden' : '';
    return function() { document.body.style.overflow = ''; };
  }, [CB_open, CB_fullscreen, CB_isDesktop]);

  // ── iPad keyboard fix ──
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

  // ── Expose close handler for deeplinks ──
  useEffect(function() {
    window._CB_closePanel = function() { CB_setOpen(false); CB_setFullscreen(false); };
    return function() { window._CB_closePanel = null; };
  }, [CB_setOpen, CB_setFullscreen]);

  // ── Auth + resize ──
  useEffect(function() {
    function CB_onResize() { CB_setIsDesktop(window.innerWidth >= 768); }
    window.addEventListener('resize', CB_onResize);

    if (!window.ECEPT_SUPABASE) {
      CB_setSession(false);
      return function() { window.removeEventListener('resize', CB_onResize); };
    }
    try {
      // Load saved model
      try {
        var savedModel = localStorage.getItem('ECEPT_CHAT_MODEL');
        if (savedModel) {
          for (var _smi = 0; _smi < CB_MODELS.length; _smi++) {
            if (CB_MODELS[_smi].id === savedModel) { CB_setSelectedModel(savedModel); break; }
          }
        }
      } catch(e3) {}

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
        } else {
          CB_setSession(false);
        }
      }).catch(function() { CB_setSession(false); });
    } catch(e2) { CB_setSession(false); }

    return function() { window.removeEventListener('resize', CB_onResize); };
  }, []);

  // ── Load conversations when panel opens ──
  useEffect(function() {
    if (CB_open && CB_session === true && !CB_convLoadedRef.current) {
      CB_convLoadedRef.current = true;
      CB_loadConversations();
    }
    if (!CB_open) { CB_convLoadedRef.current = false; }
  }, [CB_open, CB_session]);

  // ── Load messages when active conv changes ──
  useEffect(function() {
    if (!CB_activeConvId) return;
    try { localStorage.setItem('ECEPT_CHAT_LAST_CONV', CB_activeConvId); } catch(e) {}
    // Skip when CB_send just set the ID — messages already in state from optimistic update
    if (CB_skipNextConvLoad.current) { CB_skipNextConvLoad.current = false; return; }
    CB_loadConvMessages(CB_activeConvId);
  }, [CB_activeConvId]);

  // ── Auto-scroll ──
  useEffect(function() {
    if (CB_scrollRef.current) CB_scrollRef.current.scrollTop = CB_scrollRef.current.scrollHeight;
  }, [CB_msgs, CB_loading]);

  // ── Conversation loaders ──
  async function CB_loadConversations() {
    CB_setLoadingConvs(true);
    var CB_loadStart = Date.now();
    function CB_finish(fn) {
      var elapsed = Date.now() - CB_loadStart;
      var remaining = Math.max(0, 400 - elapsed);
      setTimeout(fn, remaining);
    }
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) { CB_finish(function(){ CB_setLoadingConvs(false); }); return; }
      var r = await fetch('/api/conversations', {
        headers: { 'Authorization':'Bearer '+token }
      });
      if (!r.ok) { CB_finish(function(){ CB_setLoadingConvs(false); }); return; }
      var convs = await r.json();
      var convsList = Array.isArray(convs) ? convs : [];

      var pendingActiveId = null;
      try {
        var lastId = localStorage.getItem('ECEPT_CHAT_LAST_CONV');
        if (lastId) {
          for (var _i = 0; _i < convsList.length; _i++) {
            if (convsList[_i].id === lastId) { pendingActiveId = lastId; break; }
          }
        }
      } catch(e) {}

      CB_finish(function(){
        CB_setConversations(convsList);
        if (pendingActiveId) CB_setActiveConvId(pendingActiveId);
        CB_setLoadingConvs(false);
      });
    } catch(err) {
      console.error('CB_loadConversations:', err.message);
      CB_finish(function(){ CB_setLoadingConvs(false); });
    }
  }

  async function CB_loadConvMessages(convId) {
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) return;
      var r = await fetch('/api/conversations?id='+convId, {
        headers: { 'Authorization':'Bearer '+token }
      });
      if (!r.ok) return;
      var data = await r.json();
      var mapped = (data.messages || []).map(function(m) {
        return { role:m.role, text:m.content, ts: new Date(m.created_at).getTime() };
      });
      CB_setMsgs(mapped);
    } catch(err) {
      console.error('CB_loadConvMessages:', err.message);
    }
  }

  async function CB_loadUserNotes() {
    if (CB_userNotesLoaded) return;
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) return;
      var r = await fetch('/api/user-context', {
        headers: { 'Authorization':'Bearer '+token }
      });
      var data = await r.json();
      CB_setUserNotes(data.notes || '');
      CB_setUserNotesLoaded(true);
    } catch(err) {
      console.error('CB_loadUserNotes:', err.message);
    }
  }

  async function CB_saveUserNotes() {
    CB_setNotesSaving(true);
    CB_setNotesError('');
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) { CB_setNotesError('Sesión expirada'); CB_setNotesSaving(false); return; }
      var r = await fetch('/api/user-context', {
        method:'PATCH',
        headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+token },
        body:JSON.stringify({ notes:CB_userNotes })
      });
      var data = await r.json();
      if (r.status === 503) {
        CB_setNotesError('La memoria estará disponible próximamente.');
      } else if (!r.ok) {
        CB_setNotesError('Error al guardar. Intentá de nuevo.');
      } else {
        CB_setSettingsOpen(false);
      }
    } catch(err) {
      CB_setNotesError('Error de conexión.');
    }
    CB_setNotesSaving(false);
  }

  async function CB_renameConv(convId, title) {
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) return;
      await fetch('/api/conversations', {
        method:'PATCH',
        headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+token },
        body:JSON.stringify({ id:convId, title:title })
      });
      CB_setConversations(function(prev) {
        return prev.map(function(c) { return c.id===convId ? Object.assign({},c,{title:title}) : c; });
      });
    } catch(err) { console.error('CB_renameConv:', err.message); }
  }

  async function CB_archiveConv(convId) {
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) return;
      await fetch('/api/conversations', {
        method:'PATCH',
        headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+token },
        body:JSON.stringify({ id:convId, archived:true })
      });
      CB_setConversations(function(prev) { return prev.filter(function(c) { return c.id !== convId; }); });
      if (CB_activeConvId === convId) { CB_setActiveConvId(null); CB_setMsgs([]); }
    } catch(err) { console.error('CB_archiveConv:', err.message); }
  }

  async function CB_newConv() {
    try {
      var sess = await window.ECEPT_SUPABASE.auth.getSession();
      var token = sess && sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) return;
      var r = await fetch('/api/conversations', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+token },
        body:JSON.stringify({ model:CB_selectedModel })
      });
      var conv = await r.json();
      if (conv && conv.id) {
        CB_setConversations(function(prev) { return [conv].concat(prev); });
        CB_setActiveConvId(conv.id);
        CB_setMsgs([]);
        CB_setSidebarOpen(false);
      }
    } catch(err) { console.error('CB_newConv:', err.message); }
  }

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
        body:JSON.stringify({ messages:history, model:CB_selectedModel, conversationId:CB_activeConvId })
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

      // Handle new conversation created by backend
      if (data.conversationId && data.conversationId !== CB_activeConvId) {
        // Flag prevents the loadConvMessages useEffect from overwriting optimistic messages
        CB_skipNextConvLoad.current = true;
        CB_setActiveConvId(data.conversationId);
        try { localStorage.setItem('ECEPT_CHAT_LAST_CONV', data.conversationId); } catch(e) {}
        // Refresh sidebar after title auto-generation (~1.5s)
        setTimeout(function() { CB_loadConversations(); }, 1500);
      }
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
  var modelLabel = currentModel ? (currentModel.icon+' '+currentModel.name) : CB_selectedModel;
  var quotaStr   = CB_quota ? (CB_quota.dailyUsed+'/'+CB_quota.dailyLimit) : '—';
  var quickPrompts = ['Explicame los betabloqueantes','DDx de dolor torácico','Resumen de cetoacidosis diabética'];

  var panelStyle;
  if (isMobile) {
    panelStyle = { position:'fixed', inset:0, background:C.bg, zIndex:9999, display:'flex', flexDirection:'column', overflow:'hidden', animation:'CB_panelInMobile 280ms cubic-bezier(0.32,0.72,0,1)' };
  } else if (CB_fullscreen) {
    panelStyle = { position:'fixed', inset:0, background:C.bg, zIndex:9999, display:'flex', flexDirection:'row', overflow:'hidden', animation:'CB_panelIn 280ms cubic-bezier(0.32,0.72,0,1)' };
  } else {
    panelStyle = { position:'fixed', top:24, left:24, bottom:24, width:'460px', borderRadius:28, background:'linear-gradient(180deg,#0d1224 0%,#060a14 100%)', border:'1px solid rgba(96,165,250,.20)', boxShadow:'0 20px 48px rgba(0,0,0,0.4), 0 8px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(96,165,250,.08) inset', zIndex:9999, display:'flex', flexDirection:'column', overflow:'hidden', animation:'CB_panelIn 320ms cubic-bezier(0.16,1,0.3,1)' };
  }

  var inputContainerStyle = {
    display:'flex', alignItems:'flex-end', gap:8,
    background:C.cd, border:'1px solid '+(CB_inputFocused?'rgba(59,130,246,.4)':C.bd),
    borderRadius:14, padding:'6px 8px 6px 12px',
    transition:'border-color .2s,box-shadow .2s',
    boxShadow:CB_inputFocused?'0 0 0 3px rgba(59,130,246,.1)':'none'
  };

  // ── Sidebar renderer ──
  function CB_renderSidebar(permanent) {
    var sidebarStyle = permanent
      ? { width:280, flexShrink:0, borderRight:'1px solid '+C.bd, display:'flex', flexDirection:'column', overflow:'hidden' }
      : { position:'absolute', top:0, left:0, bottom:0, width:280, zIndex:20,
          background:'linear-gradient(180deg,#0d1224 0%,#060a14 100%)',
          borderRight:'1px solid rgba(59,130,246,.2)',
          display:'flex', flexDirection:'column', overflow:'hidden',
          animation:'CB_sidebarIn 200ms ease', boxShadow:'4px 0 20px rgba(0,0,0,.4)' };

    return e('div', { style:sidebarStyle },
      // Sidebar header
      e('div', { style:{ padding:'16px 14px 12px', borderBottom:'1px solid '+C.bd, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 } },
        e('span', { style:{ fontSize:13, fontWeight:700, color:C.tx } }, 'Conversaciones'),
        e('button', {
          onClick: CB_newConv,
          title:'Nueva conversación',
          style:{ background:'linear-gradient(135deg,#a78bfa,#60a5fa)', border:'none', borderRadius:8, color:'#fff', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:16, flexShrink:0 }
        }, '+')
      ),

      // Conversation list
      e('div', { style:{ flex:1, overflowY:'auto', padding:'6px 8px' } },
        CB_loadingConvs && (window.SkeletonRow ? e('div', { style:{ display:'flex', flexDirection:'column', gap:4, padding:'4px 0' } }, e(window.SkeletonRow), e(window.SkeletonRow), e(window.SkeletonRow), e(window.SkeletonRow)) : e('div', { style:{ color:C.dm, fontSize:12, padding:'12px 8px', textAlign:'center' } }, 'Cargando…')),

        !CB_loadingConvs && CB_conversations.length === 0 && e('div', { style:{ padding:'24px 12px', textAlign:'center' } },
          e('div', { style:{
            width:64, height:64, margin:'0 auto 12px',
            borderRadius:'50%',
            background:'linear-gradient(135deg, rgba(96,165,250,0.12), rgba(167,139,250,0.08))',
            border:'1px solid rgba(96,165,250,0.20)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:28,
            boxShadow:'0 0 24px rgba(96,165,250,0.12)'
          } }, '💬'),
          e('div', { style:{ fontSize:14, fontWeight:600, color:C.tx, marginBottom:4, letterSpacing:'-0.01em' } }, 'Sin conversaciones'),
          e('div', { style:{ color:C.dm, fontSize:12, lineHeight:1.5, maxWidth:200, margin:'0 auto' } }, 'Mandá tu primer mensaje para empezar a chatear con Elion.')
        ),

        CB_conversations.map(function(conv) {
          var isActive = conv.id === CB_activeConvId;
          var isRenaming = CB_renamingId === conv.id;
          var isMenuOpen = CB_convMenuId === conv.id;

          return e('div', { key:conv.id, style:{ marginBottom:2, position:'relative' } },
            // Row
            e('div', {
              className:'CB_convItem',
              style:{
                padding:'9px 32px 9px 10px', borderRadius:10, cursor:'pointer',
                background: isActive ? 'rgba(96,165,250,0.18)' : 'transparent',
                borderLeft: isActive ? '3px solid '+C.ac : '3px solid transparent',
                transition:'background .15s', position:'relative'
              },
              onClick: function() {
                if (CB_renamingId === conv.id) return;
                CB_setActiveConvId(conv.id);
                CB_setConvMenuId(null);
                if (!permanent) CB_setSidebarOpen(false);
              }
            },
              isRenaming
                ? e('input', {
                    autoFocus:true,
                    value:CB_renameValue,
                    onChange:function(ev) { CB_setRenameValue(ev.target.value); },
                    onKeyDown:function(ev) {
                      if (ev.key==='Enter') {
                        var t = CB_renameValue.trim();
                        if (t) CB_renameConv(conv.id, t);
                        CB_setRenamingId(null);
                      } else if (ev.key==='Escape') {
                        CB_setRenamingId(null);
                      }
                    },
                    onBlur:function() { CB_setRenamingId(null); },
                    onClick:function(ev) { ev.stopPropagation(); },
                    style:{ width:'100%', background:'transparent', border:'none', borderBottom:'1px solid '+C.ac, color:C.tx, fontSize:12, outline:'none', padding:'2px 0' }
                  })
                : e('div', { style:{ fontSize:12, color: isActive ? C.tx : C.mt, fontWeight: isActive ? 600 : 400, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', lineHeight:1.4 } }, conv.title || 'Nueva conversación')
            ),

            // ⋮ button (always visible)
            !isRenaming && e('button', {
              onClick:function(ev) {
                ev.stopPropagation();
                CB_setConvMenuId(isMenuOpen ? null : conv.id);
              },
              style:{
                position:'absolute', right:4, top:'50%', transform:'translateY(-50%)',
                width:24, height:24, borderRadius:6, border:'none',
                background: isMenuOpen ? 'rgba(96,165,250,0.15)' : 'transparent',
                color: isMenuOpen ? C.ac : '#64748b',
                cursor:'pointer', fontSize:16, lineHeight:1, padding:0,
                display:'flex', alignItems:'center', justifyContent:'center'
              }
            }, '⋮'),

            // Dropdown menu
            isMenuOpen && e('div', {
              onClick:function(ev) { ev.stopPropagation(); },
              style:{
                position:'absolute', top:'100%', right:4, zIndex:30,
                background:'#0d1224', border:'1px solid #1a2040',
                borderRadius:8, padding:4, minWidth:140,
                boxShadow:'0 4px 16px rgba(0,0,0,.5)'
              }
            },
              e('button', {
                onClick:function(ev) {
                  ev.stopPropagation();
                  CB_setRenameValue(conv.title || '');
                  CB_setRenamingId(conv.id);
                  CB_setConvMenuId(null);
                },
                style:{ display:'block', width:'100%', padding:'8px 10px', background:'none', border:'none', color:C.mt, fontSize:12, cursor:'pointer', textAlign:'left', borderRadius:6, fontFamily:'inherit' }
              }, '✎ Renombrar'),
              e('button', {
                onClick:function(ev) {
                  ev.stopPropagation();
                  CB_archiveConv(conv.id);
                  CB_setConvMenuId(null);
                },
                style:{ display:'block', width:'100%', padding:'8px 10px', background:'none', border:'none', color:'#ef4444', fontSize:12, cursor:'pointer', textAlign:'left', borderRadius:6, fontFamily:'inherit' }
              }, '🗑 Archivar')
            )
          );
        })
      )
    );
  }

  // ── Model picker ──
  function CB_renderModelPicker() {
    return ReactDOM.createPortal(
      e('div', {
        style:{ position:'fixed', inset:0, zIndex:10000, background:'rgba(6,10,20,0.85)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' },
        onClick:function(ev) { if(ev.target===ev.currentTarget) CB_setModelPickerOpen(false); }
      },
        e('div', { style:{ width:'100%', maxWidth:480, background:'linear-gradient(180deg,#0d1224 0%,#060a14 100%)', border:'1px solid rgba(167,139,250,.25)', borderRadius:20, boxShadow:'0 20px 60px rgba(0,0,0,.6)', overflow:'hidden' } },
          e('div', { style:{ padding:'20px 20px 16px', borderBottom:'1px solid rgba(167,139,250,.15)' } },
            e('h2', { style:{ margin:'0 0 4px', fontSize:17, fontWeight:800, background:'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' } }, 'Elegí tu modelo de IA'),
            e('p', { style:{ margin:0, fontSize:12, color:C.mt } }, 'Cada modelo se especializa en algo distinto. Empezá con Flash Lite para lo cotidiano.')
          ),
          e('div', { style:{ padding:'16px', display:'flex', flexDirection:'column', gap:10 } },
            CB_MODEL_INFO.map(function(info) {
              var isSelected = CB_selectedModel === info.id;
              var tierModels = CB_TIER_MODELS[CB_role] || CB_TIER_MODELS.student;
              var inTier = false;
              for (var _ti = 0; _ti < tierModels.length; _ti++) {
                if (tierModels[_ti] === info.id) { inTier = true; break; }
              }
              var cost = 0;
              for (var _ci = 0; _ci < CB_MODELS.length; _ci++) {
                if (CB_MODELS[_ci].id === info.id) { cost = CB_MODELS[_ci].cost; break; }
              }
              var canAfford = CB_credits >= cost;
              var available = inTier || canAfford || CB_role === 'admin';

              return e('div', {
                key:info.id,
                onClick:function() {
                  if (!available) return;
                  CB_setSelectedModel(info.id);
                  try { localStorage.setItem('ECEPT_CHAT_MODEL', info.id); } catch(e) {}
                  CB_setModelPickerOpen(false);
                },
                style:{
                  padding:'16px', borderRadius:14, cursor: available ? 'pointer' : 'default',
                  background: isSelected ? info.gradient : 'rgba(255,255,255,.03)',
                  border:'1px solid '+(isSelected ? info.accent : C.bd),
                  opacity: available ? 1 : 0.5,
                  transition:'all .15s', position:'relative'
                }
              },
                info.badge && e('div', { style:{ position:'absolute', top:10, right:10, fontSize:9, fontWeight:800, letterSpacing:1.5, padding:'2px 7px', borderRadius:4, background:info.accent+'22', border:'1px solid '+info.accent+'55', color:info.accent } }, info.badge),
                e('div', { style:{ display:'flex', alignItems:'center', gap:10, marginBottom:6 } },
                  e('span', { style:{ fontSize:22 } }, info.icon),
                  e('div', null,
                    e('div', { style:{ fontSize:14, fontWeight:700, color: isSelected ? info.accent : C.tx } }, info.name),
                    e('div', { style:{ fontSize:11, color:C.mt } }, info.tagline)
                  )
                ),
                e('div', { style:{ fontSize:12, color:C.dm, marginBottom:10, lineHeight:1.5 } }, info.description),
                e('div', { style:{ display:'flex', flexDirection:'column', gap:2 } },
                  info.bullets.map(function(b, bi) {
                    return e('div', { key:bi, style:{ fontSize:11, color:C.mt, display:'flex', gap:6 } },
                      e('span', { style:{ color:info.accent } }, '✓'),
                      e('span', null, b)
                    );
                  })
                ),
                !available && e('div', { style:{ marginTop:8, fontSize:11, color:'#ef4444' } }, 'Necesitás '+(cost - CB_credits)+' 🪙 más')
              );
            })
          ),
          e('div', { style:{ padding:'12px 16px 16px', display:'flex', justifyContent:'flex-end' } },
            e('button', {
              onClick:function() { CB_setModelPickerOpen(false); },
              style:{ padding:'9px 20px', borderRadius:10, border:'1px solid '+C.bd, background:'none', color:C.mt, fontSize:13, cursor:'pointer', fontWeight:600 }
            }, 'Cerrar')
          )
        )
      ),
      document.body
    );
  }

  // ── Settings modal ──
  function CB_renderSettings() {
    return ReactDOM.createPortal(
      e('div', {
        style:{ position:'fixed', inset:0, zIndex:10000, background:'rgba(6,10,20,0.85)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' },
        onClick:function(ev) { if(ev.target===ev.currentTarget) CB_setSettingsOpen(false); }
      },
        e('div', { style:{ width:'100%', maxWidth:440, background:'linear-gradient(180deg,#0d1224 0%,#060a14 100%)', border:'1px solid rgba(167,139,250,.25)', borderRadius:20, boxShadow:'0 20px 60px rgba(0,0,0,.6)', overflow:'hidden' } },
          e('div', { style:{ padding:'20px 20px 16px', borderBottom:'1px solid rgba(167,139,250,.15)', display:'flex', alignItems:'center', gap:10 } },
            e('span', { style:{ fontSize:24 } }, '🧠'),
            e('div', null,
              e('h2', { style:{ margin:'0 0 2px', fontSize:16, fontWeight:800, color:C.tx } }, 'Memoria de Elion'),
              e('p', { style:{ margin:0, fontSize:12, color:C.mt } }, 'Elion va a recordar esto en todas tus conversaciones.')
            )
          ),
          e('div', { style:{ padding:'16px 20px' } },
            e('p', { style:{ margin:'0 0 12px', fontSize:12, color:C.mt, lineHeight:1.6 } }, 'Útil para tu especialidad, año de carrera, preferencias.'),
            e('textarea', {
              value:CB_userNotes,
              onChange:function(ev) { CB_setUserNotes(ev.target.value.slice(0,1500)); },
              rows:5,
              placeholder:'Soy estudiante de 4to año de medicina. Estoy preparando el examen de\ncardiología. Prefiero respuestas con casos clínicos cuando sea posible.',
              style:{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid '+C.bd, background:C.bg, color:C.tx, fontSize:13, outline:'none', boxSizing:'border-box', fontFamily:'inherit', resize:'vertical', lineHeight:1.6 }
            }),
            e('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:6 } },
              e('span', { style:{ fontSize:11, color:C.dm } }, CB_userNotes.length+' / 1500 caracteres'),
              CB_notesError && e('span', { style:{ fontSize:11, color:'#fbbf24' } }, CB_notesError)
            )
          ),
          e('div', { style:{ padding:'8px 16px 16px', display:'flex', gap:8, justifyContent:'flex-end' } },
            e('button', {
              onClick:function() { CB_setSettingsOpen(false); CB_setNotesError(''); },
              style:{ padding:'9px 18px', borderRadius:10, border:'1px solid '+C.bd, background:'none', color:C.mt, fontSize:13, cursor:'pointer', fontWeight:600 }
            }, 'Cancelar'),
            e('button', {
              onClick:CB_saveUserNotes,
              disabled:CB_notesSaving,
              style:{ padding:'9px 20px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#a78bfa,#60a5fa)', color:'#fff', fontSize:13, cursor:CB_notesSaving?'default':'pointer', fontWeight:700, opacity:CB_notesSaving?0.7:1 }
            }, CB_notesSaving ? 'Guardando…' : 'Guardar')
          )
        )
      ),
      document.body
    );
  }

  // ── Main render ───────────────────────────────────────────────
  return e('div', null,

    // Model picker portal
    CB_modelPickerOpen && CB_renderModelPicker(),

    // Settings portal
    CB_settingsOpen && CB_renderSettings(),

    // ── Floating button ──
    !CB_open && e('button', {
      onClick: function() {
        if (CB_session === false) { if (typeof props.onLoginRequest === 'function') props.onLoginRequest(); }
        else { CB_setOpen(true); CB_setConnErr(''); }
      },
      'aria-label':'Abrir asistente Elion',
      style:{ position:'fixed', bottom:24, right:24, width:60, height:60, minWidth:44, minHeight:44, borderRadius:'50%', background:'linear-gradient(135deg,#60a5fa 0%,#a78bfa 100%)', border:'none', color:'#fff', cursor:'pointer', boxShadow:'0 0 32px rgba(167,139,250,0.35), 0 8px 24px rgba(0,0,0,0.3)', zIndex:95, display:'flex', alignItems:'center', justifyContent:'center', transition:'transform 240ms cubic-bezier(0.32,0.72,0,1), box-shadow 240ms ease-out', animation:'ecept_scaleIn 360ms cubic-bezier(0.34,1.56,0.64,1) 600ms both' },
      onMouseEnter: function(ev) {
        ev.currentTarget.style.transform = 'scale(1.06)';
        ev.currentTarget.style.boxShadow = '0 0 40px rgba(167,139,250,0.5), 0 12px 28px rgba(0,0,0,0.35)';
      },
      onMouseLeave: function(ev) {
        ev.currentTarget.style.transform = 'scale(1)';
        ev.currentTarget.style.boxShadow = '0 0 32px rgba(167,139,250,0.35), 0 8px 24px rgba(0,0,0,0.3)';
      }
    }, e(window.Logo || 'span', { size: 32, idSuffix:'fab' })),

    // ── Backdrop ──
    CB_open && (isMobile || CB_fullscreen) && e('div', {
      onClick: function() { CB_setOpen(false); CB_setFullscreen(false); CB_setSidebarOpen(false); },
      style:{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:9998 }
    }),

    // Sidebar overlay backdrop (floating desktop mode)
    CB_open && !CB_fullscreen && CB_isDesktop && CB_sidebarOpen && e('div', {
      onClick:function() { CB_setSidebarOpen(false); },
      style:{ position:'fixed', inset:0, zIndex:9999 }
    }),

    // ── Panel ──
    CB_open && e('div', { id:'CB_panel', style:Object.assign({},panelStyle,{position:'fixed'}), onClick:function() { CB_setConvMenuId(null); } },

      // Permanent sidebar (fullscreen desktop)
      CB_isDesktop && CB_fullscreen && CB_renderSidebar(true),

      // Overlay sidebar (floating desktop)
      CB_isDesktop && !CB_fullscreen && CB_sidebarOpen && CB_renderSidebar(false),

      // Mobile sidebar (full overlay modal)
      isMobile && CB_sidebarOpen && ReactDOM.createPortal(
        e('div', { style:{ position:'fixed', inset:0, zIndex:10001, background:'rgba(6,10,20,0.95)', display:'flex', flexDirection:'column' } },
          CB_renderSidebar(true),
          e('button', {
            onClick:function() { CB_setSidebarOpen(false); },
            style:{ position:'absolute', top:14, right:14, background:'none', border:'none', color:C.mt, fontSize:22, cursor:'pointer', padding:8 }
          }, '×')
        ),
        document.body
      ),

      // Main column
      e('div', { style:{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' } },

        // ── Header ──
        e('div', { style:{ padding:'14px 16px', background:'linear-gradient(180deg,rgba(59,130,246,.08),transparent)', borderBottom:'1px solid rgba(59,130,246,.15)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 } },
          e('div', { style:{ display:'flex', alignItems:'center', gap:8, overflow:'hidden', minWidth:0 } },
            // Sidebar toggle
            e('button', {
              onClick:function(ev) { ev.stopPropagation(); CB_setSidebarOpen(function(o) { return !o; }); },
              title:'Conversaciones',
              style:{ background:'none', border:'none', color: CB_sidebarOpen ? C.ac : C.mt, fontSize:15, cursor:'pointer', minWidth:32, minHeight:32, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8, flexShrink:0 }
            }, '📋'),
            e('div', { style:{ width:32, height:32, borderRadius:'50%', background:'rgba(59,130,246,.15)', border:'1px solid rgba(59,130,246,.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 } }, '🧬'),
            e('div', { style:{ display:'flex', flexDirection:'column', gap:1, overflow:'hidden', minWidth:0 } },
              e('div', { style:{ fontWeight:700, fontSize:15, lineHeight:'1.2', background:'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', whiteSpace:'nowrap' } }, 'Elion'),
              e('div', {
                onClick:function(ev) { ev.stopPropagation(); CB_setModelPickerOpen(true); },
                style:{ fontSize:11, color:C.mt, lineHeight:'1.2', cursor:'pointer', display:'flex', gap:4, alignItems:'center', flexWrap:'wrap', overflow:'hidden' }
              },
                e('span', null, modelLabel),
                e('span', { style:{ color:C.bd } }, '·'),
                e('span', null, quotaStr+' hoy'),
                e('span', { style:{ color:C.bd } }, '·'),
                e('span', null, '🪙'+CB_credits),
                CB_userNotes && CB_userNotes.trim() && e('span', { title:'Memoria activa', style:{ fontSize:11, color:'#a78bfa', marginLeft:2 } }, '🧠')
              )
            )
          ),
          e('div', { style:{ display:'flex', alignItems:'center', gap:2, flexShrink:0 } },
            e('button', {
              onClick:function(ev) { ev.stopPropagation(); CB_loadUserNotes(); CB_setSettingsOpen(true); },
              title:'Memoria de Elion',
              style:{ background:'none', border:'none', color:C.mt, fontSize:15, cursor:'pointer', minWidth:32, minHeight:32, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8 }
            }, '⚙️'),
            CB_isDesktop && e('button', {
              onClick: function() { CB_setFullscreen(function(f) { return !f; }); },
              'aria-label': CB_fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa',
              style:{ background:'none', border:'none', color:C.mt, fontSize:15, cursor:'pointer', minWidth:32, minHeight:32, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8 }
            }, CB_fullscreen ? '↙' : '⛶'),
            e('button', {
              onClick: function() { CB_setOpen(false); CB_setFullscreen(false); CB_setSidebarOpen(false); },
              'aria-label':'Cerrar',
              style:{ background:'none', border:'none', color:C.mt, fontSize:20, cursor:'pointer', minWidth:32, minHeight:32, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8 }
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
              e('div', { ref:CB_scrollRef, style:{ flex:1, overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:14 } },

                CB_msgs.length === 0 && !CB_loading && e('div', {
                  style:{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1, gap:14, minHeight:200, paddingTop:20 }
                },
                  e('div', { style:{ width:64, height:64, borderRadius:'50%', background:'rgba(59,130,246,.12)', border:'1px solid rgba(59,130,246,.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, boxShadow:'0 0 40px rgba(59,130,246,.3)' } }, '🧬'),
                  e('div', { style:{ marginBottom: 4 } }, e(window.Logo || 'span', { size: 72, glow: true, float: true, idSuffix:'empty' })),
                  e('div', { style:{ fontWeight:800, fontSize:26, letterSpacing:'-0.02em', background:'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1.1 } }, '¿Cómo te ayudo hoy?'),
                  e('div', { style:{ color:C.mt, fontSize:13, marginTop:-4 } }, 'Soy Elion · tu asistente médico'),
                  e('div', { style:{ display:'flex', flexDirection:'column', gap:10, width:'100%', maxWidth:340, marginTop:12 } },
                    quickPrompts.map(function(qp, qi) {
                      return e('button', {
                        key:qi,
                        onClick: function() { CB_setInput(qp); if (CB_inputRef.current) CB_inputRef.current.focus(); },
                        style:{
                          minHeight:48, padding:'14px 18px', borderRadius:14,
                          background:'linear-gradient(180deg,#0d1224 0%,#0a0e1f 100%)',
                          border:'1px solid '+C.bd, color:C.tx, fontSize:13, cursor:'pointer',
                          textAlign:'left', lineHeight:1.45,
                          transition:'all 220ms cubic-bezier(0.16,1,0.3,1)',
                          animation:'ecept_fadeSlideUp 480ms cubic-bezier(0.16,1,0.3,1) '+(200+qi*80)+'ms both',
                          boxShadow:'0 1px 2px rgba(0,0,0,0.2)'
                        },
                        onMouseEnter: function(ev) {
                          ev.currentTarget.style.borderColor = 'rgba(96,165,250,0.4)';
                          ev.currentTarget.style.transform = 'translateY(-1px)';
                          ev.currentTarget.style.boxShadow = '0 4px 14px rgba(96,165,250,0.15)';
                        },
                        onMouseLeave: function(ev) {
                          ev.currentTarget.style.borderColor = C.bd;
                          ev.currentTarget.style.transform = 'translateY(0)';
                          ev.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.2)';
                        }
                      }, qp);
                    })
                  )
                ),

                CB_msgs.map(function(m, i) {
                  var isUser = m.role === 'user';
                  return e('div', { key:i, style:{ display:'flex', flexDirection:'column', alignItems:isUser?'flex-end':'flex-start', gap:4, animation:'ecept_messageIn 320ms cubic-bezier(0.32,0.72,0,1)' } },
                    isUser
                      ? e('div', { style:{ maxWidth:'85%', padding:'13px 18px', borderRadius:'20px 20px 6px 20px', background:'linear-gradient(135deg,rgba(59,130,246,.20),rgba(96,165,250,.10))', border:'1px solid rgba(96,165,250,.28)', color:C.tx, fontSize:14, lineHeight:1.55, wordBreak:'break-word', whiteSpace:'pre-wrap', boxShadow:'0 1px 2px rgba(0,0,0,0.2)' } }, m.text)
                      : e('div', { style:{ display:'flex', alignItems:'flex-start', gap:10, maxWidth:'92%' } },
                          CB_elionAvatar(30),
                          e('div', { style:{ padding:'14px 18px', borderRadius:'20px 20px 20px 6px', background:m.error?'rgba(239,68,68,.08)':'linear-gradient(180deg,#0d1224 0%,#0a0e1f 100%)', border:'1px solid '+(m.error?'rgba(239,68,68,.25)':'#1a2040'), boxShadow:m.error?'none':'0 2px 8px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.15)', color:m.error?'#ef4444':C.tx, fontSize:14, lineHeight:1.55, wordBreak:'break-word' } },
                            m.error ? e('span', null, m.text) : CB_renderMarkdown(m.text)
                          )
                        )
                  );
                }),

                CB_loading && e('div', { style:{ display:'flex', alignItems:'flex-start', gap:8 } },
                  CB_elionAvatar(28),
                  e('div', { style:{ padding:'14px 16px', borderRadius:'4px 18px 18px 18px', background:'#0d1224', border:'1px solid #1a2040', display:'flex', alignItems:'center', gap:5 } },
                    e('span', { style:{ display:'inline-block', fontSize:8, color:C.dm, animation:'CB_dotBounce .8s ease-in-out infinite', animationDelay:'0s' } }, '●'),
                    e('span', { style:{ display:'inline-block', fontSize:8, color:C.dm, animation:'CB_dotBounce .8s ease-in-out infinite', animationDelay:'.15s' } }, '●'),
                    e('span', { style:{ display:'inline-block', fontSize:8, color:C.dm, animation:'CB_dotBounce .8s ease-in-out infinite', animationDelay:'.3s' } }, '●')
                  )
                )
              ),

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
                    style:{ width:40, height:40, flexShrink:0, borderRadius:'50%', border:'none', background:(CB_loading||(!CB_input.trim()&&CB_pendingFiles.length===0))?'#1a2040':'linear-gradient(135deg,#60a5fa,#a78bfa)', color:'#fff', cursor:(CB_loading||(!CB_input.trim()&&CB_pendingFiles.length===0))?'default':'pointer', fontSize:15, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 240ms cubic-bezier(0.34,1.56,0.64,1)', padding:0, boxShadow:(CB_loading||(!CB_input.trim()&&CB_pendingFiles.length===0))?'none':'0 4px 12px rgba(167,139,250,0.30)' }
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
