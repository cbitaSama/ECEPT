/* TraumaView — native replacement for the trauma iframe embed.
   Composes: hub landing → topic view (with subnav) → sección rendering.
   Uses BloqueRenderer + the widget components registered by app.js.

   Props: { widgets, onBackRef }
   - widgets: map of widget components to pass into BloqueRenderer
   - onBackRef: ref to a function that the parent can call to pop nav state;
     returns true if TraumaView consumed the back action, false if parent
     should handle it (i.e., already at hub → go home).
*/

function TraumaView(props) {
  /* View state:
     - topic: null (hub) | "gen"|"via"|"poli"|"shock"|"torax"
     - sec: active sección id within current topic (e.g., "gen-1")
     - repasoOpen: boolean
  */
  var sTopic = useState(null);  var topic = sTopic[0], setTopic = sTopic[1];
  var sSec   = useState(null);  var sec   = sSec[0],   setSec   = sSec[1];
  var sRep   = useState(false); var repasoOpen = sRep[0], setRepaso = sRep[1];

  /* Restore last topic on mount (parity with artifact localStorage key). */
  useEffect(function(){
    try {
      var saved = localStorage.getItem("ecept-trauma-view");
      if (saved && saved !== "hub") {
        var ok = false;
        for (var i=0;i<TRAUMA_TOPICS.length;i++) if (TRAUMA_TOPICS[i].id === saved) ok = true;
        if (ok) setTopic(saved);
      }
    } catch(e){}
  }, []);

  /* Persist topic selection. */
  useEffect(function(){
    try { localStorage.setItem("ecept-trauma-view", topic || "hub"); } catch(e){}
  }, [topic]);

  /* Expose back handler so app.js back button pops trauma state first. */
  useEffect(function(){
    if (!props.onBackRef) return;
    props.onBackRef.current = function(){
      if (repasoOpen) { setRepaso(false); return true; }
      if (topic) { setTopic(null); setSec(null); return true; }
      return false;
    };
    return function(){ if (props.onBackRef) props.onBackRef.current = null; };
  }, [topic, repasoOpen, props.onBackRef]);

  /* Expose a focus handler so external callers (search / cross-link) can
     jump directly to a sección: window._traumaFocus = function(secId){...} */
  useEffect(function(){
    window._traumaFocus = function(secId){
      if (!secId) return;
      var prefix = secId.split("-")[0];
      var map = {gen:"gen", via:"via", poli:"poli", sh:"shock", tx:"torax"};
      var target = map[prefix];
      if (!target) return;
      setTopic(target);
      setSec(secId);
      setTimeout(function(){ window.scrollTo({top:0,behavior:"instant"}); }, 0);
    };
    return function(){ try { delete window._traumaFocus; } catch(e){} };
  }, []);

  function jumpToTopic(tid) {
    setTopic(tid);
    setSec(null);
    window.scrollTo({top:0,behavior:"instant"});
  }
  function jumpToSec(secId) {
    var prefix = secId.split("-")[0];
    var map = {gen:"gen", via:"via", poli:"poli", sh:"shock", tx:"torax"};
    var target = map[prefix];
    if (!target) return;
    setTopic(target);
    setSec(secId);
    window.scrollTo({top:0,behavior:"instant"});
  }

  /* Top bar: breadcrumb + repaso button (+ optional internal back). */
  var topicObj = null;
  if (topic) {
    for (var ti=0; ti<TRAUMA_TOPICS.length; ti++) {
      if (TRAUMA_TOPICS[ti].id === topic) { topicObj = TRAUMA_TOPICS[ti]; break; }
    }
  }

  return e(F, null,
    /* Repaso launcher (right-aligned; crumb removed — ECEPT shell
       already shows Inicio › Emergenciología › Trauma · Unidad 1) */
    e("div", {
      style:{display:"flex", justifyContent:"flex-end",
             marginBottom:"16px"}
    },
      e("button", {
        onClick: function(){ setRepaso(true); },
        style:{display:"inline-flex", alignItems:"center", gap:"6px",
               padding:"10px 16px", borderRadius:"10px",
               background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",
               color:"#fff", fontSize:"13px", fontWeight:700,
               minHeight:"40px", border:"none", cursor:"pointer",
               fontFamily:"inherit"}
      }, "⚡ Repaso")
    ),

    /* Body: hub or topic */
    topic == null
      ? e(TraumaHub, {onJump: jumpToTopic})
      : e(TraumaTopic, {topic: topicObj, sec: sec, setSec: setSec,
                        onJump: jumpToTopic, onSecJump: jumpToSec,
                        widgets: props.widgets}),

    /* Footer */
    e("footer", {
      style:{marginTop:"48px", paddingTop:"24px",
             borderTop:"1px solid #1a2040",
             fontSize:"12px", color:"#64748b",
             textAlign:"center", lineHeight:"1.6"}
    },
      e("strong", {style:{color:"#94a3b8"}}, "ECEPT"), " · El Conocimiento Es Para Todos",
      e("br"),
      "Trauma · Unidad 1 — Emergenciología",
      e("br"),
      "Este material es una herramienta de estudio. Siempre contrastá con guías clínicas vigentes para decisiones asistenciales."
    ),

    /* Repaso modal */
    repasoOpen && e(TraumaRepasoModal, {onClose: function(){ setRepaso(false); }})
  );
}

/* ============= HUB ============= */
function TraumaHub(props) {
  return e("div", null,
    /* Hero */
    e("div", {style:{marginBottom:"36px"}},
      e("div", {style:{fontSize:"12px", fontWeight:700, letterSpacing:".18em",
                       textTransform:"uppercase", color:"#60a5fa",
                       marginBottom:"10px"}}, TRAUMA_HUB.eyebrow),
      e("h1", {style:{fontSize:"clamp(40px,6.5vw,60px)", lineHeight:"1.02",
                      margin:"0 0 14px", fontWeight:900,
                      fontFamily:"'Playfair Display',serif",
                      background:"linear-gradient(135deg,#f1f5f9 0%,#cbd5e1 100%)",
                      WebkitBackgroundClip:"text", backgroundClip:"text",
                      WebkitTextFillColor:"transparent"}}, TRAUMA_HUB.title),
      e("p", {style:{color:"#94a3b8", maxWidth:"680px",
                     fontSize:"16px", lineHeight:"1.6"}}, TRAUMA_HUB.sub),
      e("div", {style:{display:"flex", gap:"18px", marginTop:"18px", flexWrap:"wrap"}},
        TRAUMA_HUB.stats.map(function(s, i){
          return e("div", {key:i, style:{fontSize:"12px", color:"#64748b",
                                         display:"flex", alignItems:"center", gap:"6px"}},
            s.ico, " ", e("strong", {style:{color:"#cbd5e1", fontWeight:700}}, s.label));
        })
      )
    ),

    /* Card grid */
    e("div", {style:{display:"grid",
                     gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",
                     gap:"14px"}},
      TRAUMA_TOPICS.map(function(t, i){
        return e("button", {key:t.id,
          onClick: function(){ props.onJump(t.id); },
          style:{position:"relative", display:"block", textAlign:"left",
                 width:"100%", padding:"22px 22px 24px", borderRadius:"18px",
                 background:"#0d1224", border:"1px solid #1a2040",
                 overflow:"hidden", minHeight:"170px",
                 cursor:"pointer", fontFamily:"inherit", color:"inherit",
                 transition:"transform .2s, border-color .2s, background .2s"}
        },
          e("div", {style:{position:"absolute", top:0, right:0, bottom:0,
                           width:"4px", background:t.accent}}),
          e("div", {style:{fontFamily:"'Playfair Display',serif", fontSize:"13px",
                           fontWeight:700, color:t.accent, letterSpacing:".2em",
                           marginBottom:"8px"}}, t.num + " · " + t.chip),
          e("div", {style:{fontFamily:"'Playfair Display',serif", fontSize:"24px",
                           fontWeight:800, color:"#f1f5f9", margin:"0 0 8px",
                           lineHeight:"1.15"}}, t.title),
          e("div", {style:{fontSize:"13.5px", color:"#94a3b8", lineHeight:"1.5"}}, t.desc),
          e("div", {style:{marginTop:"14px", display:"flex", gap:"8px", flexWrap:"wrap"}},
            t.chips.map(function(c, ci){
              return e("span", {key:ci,
                style:{fontSize:"11px", padding:"4px 9px", borderRadius:"999px",
                       background:"rgba(255,255,255,.04)", color:"#94a3b8",
                       border:"1px solid #1a2040"}}, c);
            })
          )
        );
      })
    )
  );
}

/* ============= TOPIC ============= */
function TraumaTopic(props) {
  var topic = props.topic;
  /* Secciones for this topic, in defined order. */
  var secs = useMemo(function(){
    return TRAUMA_SECCIONES.filter(function(s){ return s.topic === topic.id; });
  }, [topic.id]);
  /* Default active sec = first. */
  var activeSec = props.sec;
  if (!activeSec || !secs.some(function(s){ return s.id === activeSec; })) {
    activeSec = secs[0] && secs[0].id;
  }
  var current = null;
  for (var i=0;i<secs.length;i++) if (secs[i].id === activeSec) { current = secs[i]; break; }

  return e("div", {style:{"--accent": topic.accent}},
    /* Topic header */
    e("div", {style:{margin:"0 0 22px"}},
      e("div", {style:{fontSize:"12px", fontWeight:700, letterSpacing:".18em",
                       textTransform:"uppercase", color: topic.accent,
                       marginBottom:"8px"}}, "Tema " + String(parseInt(topic.num, 10))),
      e("h1", {style:{fontSize:"clamp(32px,5vw,46px)", margin:"0",
                      lineHeight:"1.05", fontWeight:900,
                      fontFamily:"'Playfair Display',serif",
                      color:"#f1f5f9"}}, topic.title)
    ),

    /* Subnav */
    e("div", {style:{display:"flex", gap:"8px", overflowX:"auto",
                     padding:"6px 0 14px",
                     marginBottom:"22px",
                     borderBottom:"1px solid #1a2040"}},
      secs.map(function(s, si){
        var active = s.id === activeSec;
        return e("button", {key:s.id,
          onClick: function(){ props.setSec(s.id); },
          style:{flex:"none", padding:"10px 14px", borderRadius:"10px",
                 background: active ? topic.accent : "#0d1224",
                 border: "1px solid " + (active ? topic.accent : "#1a2040"),
                 fontSize:"13px", fontWeight:600,
                 color: active ? "#fff" : "#94a3b8",
                 minHeight:"40px", whiteSpace:"nowrap",
                 cursor:"pointer", fontFamily:"inherit"}
        }, s.title);
      })
    ),

    /* Active sección */
    current && e("div", {key: current.id,
      style:{marginBottom:"36px", animation:"fadeUp .35s ease"}},
      e("h2", {style:{fontSize:"22px", margin:"0 0 14px", fontWeight:800,
                      color:"#f1f5f9", fontFamily:"'Playfair Display',serif",
                      display:"flex", alignItems:"center", gap:"10px"}},
        e("span", {style:{width:"10px", height:"10px", borderRadius:"50%",
                          background: topic.accent, display:"inline-block"}}),
        current.title
      ),
      e(BloqueRenderer, {bloques: current.bloques,
                         accent: topic.accent,
                         widgets: props.widgets,
                         onJump: props.onJump,
                         onSecJump: props.onSecJump})
    )
  );
}

/* ============= REPASO MODAL ============= */
function TraumaRepasoModal(props) {
  useEffect(function(){
    document.body.style.overflow = "hidden";
    return function(){ document.body.style.overflow = ""; };
  }, []);
  function onBackdrop(ev) { if (ev.target === ev.currentTarget) props.onClose(); }
  return e("div", {
    onClick: onBackdrop,
    style:{position:"fixed", inset:"0",
           background:"rgba(2,6,16,.88)",
           backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)",
           zIndex:50, overflowY:"auto", padding:"30px 16px",
           paddingTop:"calc(30px + env(safe-area-inset-top))"}
  },
    e("div", {style:{maxWidth:"820px", margin:"0 auto",
                     background:"#0d1224", border:"1px solid #1a2040",
                     borderRadius:"18px", padding:"24px"}},
      e("div", {style:{display:"flex", alignItems:"center",
                       justifyContent:"space-between", marginBottom:"18px",
                       position:"sticky", top:0, background:"#0d1224",
                       paddingBottom:"10px", zIndex:2}},
        e("h2", {style:{margin:0, fontSize:"24px",
                        fontFamily:"'Playfair Display',serif",
                        fontWeight:800, color:"#f1f5f9"}},
          "⚡ Modo repaso · alto rendimiento"),
        e("button", {onClick: props.onClose,
          style:{width:"40px", height:"40px", borderRadius:"10px",
                 background:"#060a14", border:"1px solid #1a2040",
                 color:"#cbd5e1", fontSize:"20px",
                 display:"flex", alignItems:"center", justifyContent:"center",
                 cursor:"pointer", fontFamily:"inherit"},
          "aria-label":"Cerrar"}, "×")
      ),
      TRAUMA_REPASO.map(function(block, bi){
        return e("div", {key:bi,
          style:{marginBottom:"22px", padding:"16px", borderRadius:"12px",
                 background:"rgba(255,255,255,.02)",
                 borderLeft:"3px solid "+block.accent}
        },
          e("h3", {style:{fontFamily:"'Playfair Display',serif", fontSize:"18px",
                          margin:"0 0 12px", color:block.accent,
                          fontWeight:800}}, block.title),
          e("dl", {style:{display:"grid",
                          gridTemplateColumns:"max-content 1fr",
                          gap:"6px 16px", fontSize:"13.5px", margin:0}},
            block.pairs.map(function(p, pi){
              return e(F, {key:pi},
                e("dt", {style:{color:"#94a3b8", fontWeight:600}}, p[0]),
                e("dd", {style:{margin:0, color:"#e2e8f0"},
                         dangerouslySetInnerHTML:{__html: p[1]}})
              );
            })
          )
        );
      })
    )
  );
}
