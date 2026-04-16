/* VocabularioView — native replacement for the vocab iframe embed.
   Composes Hero + HeroVisual (heart demo) + 4 tabs (Biblioteca / Decoder
   / Ejemplos / Quiz). Ported structure from artifacts/vocabulario_medico_v4.html
   App()/Hero()/HeroVisual() lines 866-947, 1225-1386. */

/* ───────── HeroVisual (inline; only used by Hero) ───────── */
function VocabHeroVisual() {
  var d = VOCAB_DEMOS.find(function(x){ return x.id === "heart"; }) || VOCAB_DEMOS[1];
  var stepState = useState(0); var step = stepState[0], setStep = stepState[1];
  var maxStep = d.p.length;
  var replayKey = useState(0); var rk = replayKey[0], setRk = replayKey[1];

  useEffect(function() {
    setStep(0);
    var i = setInterval(function() {
      setStep(function(s) {
        if (s >= maxStep) { clearInterval(i); return maxStep; }
        return s + 1;
      });
    }, 1400);
    return function(){ clearInterval(i); };
  }, [rk, maxStep]);

  function replay(){ setRk(rk + 1); }

  return e("div", {
    style:{marginTop:"16px", padding:"22px 18px",
           background:"linear-gradient(135deg, rgba(13,18,36,.95) 0%, rgba(13,18,36,.6) 100%)",
           border:"1px solid "+C.bd, borderRadius:"20px",
           position:"relative", overflow:"hidden"}
  },
    e("div", {style:{position:"absolute", top:"-30px", right:"-30px",
                     width:"160px", height:"160px",
                     background:"radial-gradient(circle, rgba(96,165,250,.2) 0%, transparent 70%)",
                     filter:"blur(20px)", pointerEvents:"none"}}),
    e("div", {style:{position:"relative"}},
      e("div", {style:{display:"flex", justifyContent:"space-between",
                       alignItems:"center", marginBottom:"6px"}},
        e("div", {style:{fontSize:"10px", letterSpacing:"2.5px",
                         color:"#60a5fa", textTransform:"uppercase",
                         fontWeight:700}}, "◆ Ejemplo visual"),
        e("button", {onClick:replay,
          style:{background:"rgba(96,165,250,.15)",
                 border:"1px solid rgba(96,165,250,.4)",
                 borderRadius:"16px", padding:"4px 10px",
                 color:"#60a5fa", fontSize:"10px", fontWeight:700,
                 cursor:"pointer", fontFamily:"inherit"}}, "↻ Repetir")
      ),
      e("div", {style:{fontFamily:"'Playfair Display',serif",
                       fontSize:"26px", fontWeight:900, color:C.tx,
                       lineHeight:"1.1", marginBottom:"4px"}}, d.w),
      e("div", {style:{fontSize:"12px", color:C.mt,
                       marginBottom:"14px", fontStyle:"italic"}}, d.sub),
      e("div", {style:{position:"relative", maxWidth:"300px",
                       margin:"0 auto 14px", aspectRatio:"1/1"}},
        e(DemoSVG, {type:d.type, step:step, p:d.p})
      ),
      e("div", {style:{display:"grid",
                       gridTemplateColumns:"repeat("+d.p.length+",1fr)",
                       gap:"6px", marginBottom:"14px"}},
        d.p.map(function(pt, i) {
          var act = step >= (i + 1);
          return e("div", {key:i, style:{
            padding:"9px 6px",
            background: act ? pt.c+"18" : "rgba(13,18,36,.4)",
            border: "1px solid " + (act ? pt.c+"66" : C.bd),
            borderRadius:"9px", textAlign:"center",
            transition:"all .5s",
            transform: act ? "scale(1)" : "scale(.95)",
            opacity: act ? 1 : .5
          }},
            e("div", {style:{fontFamily:"'JetBrains Mono',monospace",
                             fontSize:"11px", fontWeight:700,
                             color:pt.c, marginBottom:"2px"}}, pt.s),
            e("div", {style:{fontSize:"10px", color:C.tx,
                             fontWeight:600, marginBottom:"1px"}}, pt.m),
            e("div", {style:{fontSize:"9px", color:C.dm, lineHeight:"1.2"}}, pt.d)
          );
        })
      ),
      step >= maxStep && e("div", {
        style:{padding:"12px 14px",
               background:"linear-gradient(135deg, rgba(52,211,153,.12), rgba(96,165,250,.08))",
               border:"1px solid rgba(52,211,153,.3)",
               borderRadius:"12px", animation:"fadeIn .4s"}
      },
        e("div", {style:{fontSize:"10px", color:"#34d399", fontWeight:700,
                         letterSpacing:"1.5px", textTransform:"uppercase",
                         marginBottom:"6px"}}, "💡 La clave"),
        e("div", {style:{fontSize:"12px", color:C.tx,
                         lineHeight:"1.5", fontWeight:500}}, d.rev)
      )
    )
  );
}

/* ───────── Hero ───────── */
function VocabHero() {
  return e("div", {style:{position:"relative", padding:"36px 20px 14px",
                          overflow:"hidden"}},
    e("div", {style:{position:"absolute", top:"-80px", left:"50%",
                     transform:"translateX(-50%)",
                     width:"520px", height:"420px",
                     background:"radial-gradient(ellipse, rgba(59,130,246,.18) 0%, transparent 70%)",
                     pointerEvents:"none", filter:"blur(30px)"}}),
    e("div", {style:{position:"relative", textAlign:"center",
                     animation:"fadeIn .6s"}},
      e("div", {style:{fontSize:"56px", marginBottom:"12px",
                       animation:"float 3.5s ease-in-out infinite",
                       filter:"drop-shadow(0 10px 25px rgba(96,165,250,.3))"}},
        "📖"),
      e("div", {style:{fontSize:"11px", letterSpacing:"3px", color:C.mt,
                       textTransform:"uppercase", fontWeight:600,
                       marginBottom:"8px"}}, "Generalidades · ECEPT"),
      e("h1", {style:{fontFamily:"'Playfair Display',serif",
                      fontSize:"42px", fontWeight:900, lineHeight:"1",
                      background:"linear-gradient(135deg,#e2e8f0 0%,#60a5fa 50%,#a78bfa 100%)",
                      WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                      backgroundClip:"text", marginBottom:"14px"}},
        "Vocabulario", e("br"), "Médico"),
      e("p", {style:{color:C.mt, fontSize:"14px", maxWidth:"520px",
                     margin:"0 auto", lineHeight:"1.6"}},
        "La etimología es la llave. Cada palabra médica es un mapa: si conoces las piezas, sabes el significado ",
        e("strong", {style:{color:C.tx}}, "sin memorizar"), "."),
      e("div", {style:{marginTop:"16px", display:"flex", gap:"7px",
                       justifyContent:"center", flexWrap:"wrap"}},
        e("div", {style:{padding:"5px 12px",
                         background:"rgba(96,165,250,.12)",
                         border:"1px solid rgba(96,165,250,.3)",
                         borderRadius:"20px", fontSize:"11px",
                         color:"#60a5fa", fontWeight:700}},
          "🏛️ " + VOCAB_VOC.length + " raíces"),
        e("div", {style:{padding:"5px 12px",
                         background:"rgba(251,191,36,.12)",
                         border:"1px solid rgba(251,191,36,.3)",
                         borderRadius:"20px", fontSize:"11px",
                         color:"#fbbf24", fontWeight:700}},
          "📚 " + VOCAB_CATS.length + " categorías"),
        e("div", {style:{padding:"5px 12px",
                         background:"rgba(232,121,249,.12)",
                         border:"1px solid rgba(232,121,249,.3)",
                         borderRadius:"20px", fontSize:"11px",
                         color:"#e879f9", fontWeight:700}},
          "✨ " + VOCAB_DEMOS.length + " demos")
      )
    ),
    e("div", {style:{maxWidth:"560px", margin:"20px auto 0"}},
      e(VocabHeroVisual, null))
  );
}

/* ───────── VocabularioView (root) ───────── */
function VocabularioView() {
  var decState = useState("");      var dec = decState[0],    setDec = decState[1];
  var catState = useState("all");   var cat = catState[0],    setCat = catState[1];
  var searchState = useState("");   var search = searchState[0], setSearch = searchState[1];
  var typeState = useState("all");  var tipo = typeState[0],  setTipo = typeState[1];
  var openState = useState({});     var open = openState[0],  setOpen = openState[1];
  var viewState = useState("lib");  var view = viewState[0],  setView = viewState[1];
  var qSeedState = useState(0);     var qSeed = qSeedState[0],setQSeed = qSeedState[1];

  /* Expose focus hook so search entries can jump into a specific term. */
  useEffect(function() {
    window._vocabFocus = function(tx) {
      if (!tx) return;
      setView("lib");
      setSearch(tx);
      setCat("all");
      setTipo("all");
      setTimeout(function(){ window.scrollTo({top:0,behavior:"instant"}); }, 0);
    };
    return function(){ try { delete window._vocabFocus; } catch(e){} };
  }, []);

  var counts = useMemo(function() {
    var map = {};
    VOCAB_CATS.forEach(function(c) {
      map[c.id] = VOCAB_VOC.filter(function(x){ return x.cat === c.id; }).length;
    });
    return map;
  }, []);

  var filtered = useMemo(function() {
    var list = VOCAB_VOC;
    if (cat !== "all") list = list.filter(function(x){ return x.cat === cat; });
    if (tipo !== "all") list = list.filter(function(x){ return x.t === tipo; });
    if (search) {
      var q = search.toLowerCase();
      list = list.filter(function(x) {
        return x.tx.toLowerCase().indexOf(q) >= 0
            || x.sig.toLowerCase().indexOf(q) >= 0
            || x.ej.some(function(j){ return j.toLowerCase().indexOf(q) >= 0; });
      });
    }
    return list;
  }, [cat, tipo, search]);

  function toggleItem(k) {
    var n = {};
    Object.keys(open).forEach(function(x){ n[x] = open[x]; });
    n[k] = !n[k];
    setOpen(n);
  }

  return e("div", {style:{minHeight:"100vh", paddingBottom:"60px"}},
    /* Sticky header (below the ECEPT shell header) */
    e("div", {style:{position:"sticky", top:0, zIndex:10,
                     background:"rgba(6,10,20,.85)",
                     backdropFilter:"blur(16px)",
                     WebkitBackdropFilter:"blur(16px)",
                     borderBottom:"1px solid "+C.bd,
                     padding:"12px 20px",
                     display:"flex", alignItems:"center", gap:"10px"}},
      e("div", {style:{fontSize:"20px"}}, "🧬"),
      e("div", {style:{flex:1, minWidth:0}},
        e("div", {style:{fontSize:"10px", color:C.dm,
                         letterSpacing:"2px", textTransform:"uppercase",
                         fontWeight:600}}, "ECEPT › Generalidades"),
        e("div", {style:{fontSize:"14px", color:C.tx, fontWeight:700}},
          "Vocabulario Médico")
      )
    ),

    e(VocabHero, null),

    /* Tab bar */
    e("div", {style:{display:"flex", gap:"6px",
                     padding:"12px 20px 14px", overflowX:"auto"}},
      [{k:"lib", l:"📚 Biblioteca"},
       {k:"dec", l:"🔎 Decoder"},
       {k:"ex",  l:"✨ Ejemplos"},
       {k:"qz",  l:"🎯 Quiz"}].map(function(t) {
        return e("button", {key:t.k,
          onClick: function(){ setView(t.k); },
          style:{flex:"0 0 auto", padding:"9px 14px",
                 background: view === t.k
                   ? "linear-gradient(135deg,#3b82f6,#a78bfa)"
                   : "rgba(13,18,36,.6)",
                 border: "1px solid " + (view === t.k ? "transparent" : C.bd),
                 borderRadius:"11px",
                 color: view === t.k ? "#fff" : C.mt,
                 fontSize:"12px", fontWeight:700,
                 cursor:"pointer", whiteSpace:"nowrap",
                 fontFamily:"inherit"}}, t.l);
      })
    ),

    /* Decoder tab */
    view === "dec" && e(F, null,
      e(VocabSmartDecoder, {v:dec, set:setDec}),
      !dec && e("div", {style:{padding:"0 20px"}},
        e("div", {style:{padding:"16px",
                         background:"rgba(13,18,36,.5)",
                         border:"1px solid "+C.bd, borderRadius:"14px",
                         fontSize:"13px", color:C.mt, lineHeight:"1.6"}},
          e("div", {style:{fontSize:"11px", color:"#60a5fa",
                           fontWeight:700, letterSpacing:"1.5px",
                           textTransform:"uppercase", marginBottom:"10px"}},
            "◆ Cómo funciona"),
          e("div", {style:{color:C.tx, marginBottom:"6px"}},
            "El decoder parte cualquier palabra médica en sus raíces reconocidas:"),
          e("div", {style:{fontSize:"12px", marginTop:"6px",
                           padding:"8px 10px", background:"rgba(6,10,20,.4)",
                           borderRadius:"8px"}},
            "Ejemplo: ",
            e("span", {style:{color:"#60a5fa",
                              fontFamily:"'JetBrains Mono',monospace"}},
              "pielonefritis"), " → ",
            e("strong", {style:{color:"#34d399"}}, "pielo"), " + ",
            e("strong", {style:{color:"#fb7185"}}, "nefr"), " + ",
            e("strong", {style:{color:"#a78bfa"}}, "itis")),
          e("div", {style:{fontSize:"12px", marginTop:"6px",
                           padding:"8px 10px", background:"rgba(6,10,20,.4)",
                           borderRadius:"8px"}},
            "Ejemplo: ",
            e("span", {style:{color:"#60a5fa",
                              fontFamily:"'JetBrains Mono',monospace"}},
              "hepatoesplenomegalia"), " → ",
            e("strong", {style:{color:"#fb7185"}}, "hepato"), " + ",
            e("strong", {style:{color:"#fb7185"}}, "esplen"), " + ",
            e("strong", {style:{color:"#fbbf24"}}, "megalia")),
          e("div", {style:{marginTop:"12px", color:C.tx,
                           fontStyle:"italic", fontSize:"12px"}},
            "Prueba: neumonía · taquicardia · osteoporosis · leucocitosis · broncoespasmo")
        )
      )
    ),

    /* Ejemplos tab */
    view === "ex" && e("div", {style:{padding:"0 20px"}},
      e("div", {style:{fontSize:"10px", color:C.dm,
                       letterSpacing:"2px", textTransform:"uppercase",
                       fontWeight:700, marginBottom:"12px"}},
        "◆ " + VOCAB_DEMOS.length + " palabras descompuestas"),
      e("div", {style:{display:"flex", flexDirection:"column", gap:"10px"}},
        VOCAB_DEMOS.map(function(d, i){
          return e(VocabDemoCard, {key:d.id, d:d});
        })
      )
    ),

    /* Quiz tab */
    view === "qz" && e("div", {style:{padding:"0 20px"}},
      e(VocabQuiz, {seed:qSeed,
                    restart: function(){ setQSeed(qSeed + 1); }})
    ),

    /* Biblioteca tab */
    view === "lib" && e(F, null,
      e(VocabWordOfDay, null),
      e("div", {style:{padding:"0 20px 14px"}},
        e("input", {type:"text", value:search,
          onChange: function(ev){ setSearch(ev.target.value); },
          placeholder: "🔍 Buscar en " + VOCAB_VOC.length + " términos...",
          style:{width:"100%", padding:"13px 16px",
                 background:"rgba(13,18,36,.7)",
                 border:"1px solid "+C.bd, borderRadius:"12px",
                 color:C.tx, fontSize:"14px",
                 fontFamily:"inherit"}})
      ),
      e("div", {style:{padding:"0 20px 10px", display:"flex", gap:"6px"}},
        [{k:"all", l:"Todos",    c:"#60a5fa"},
         {k:"p",   l:"Prefijos", c:"#fbbf24"},
         {k:"s",   l:"Sufijos",  c:"#60a5fa"},
         {k:"w",   l:"Términos", c:"#e879f9"}].map(function(t) {
          return e("button", {key:t.k,
            onClick: function(){ setTipo(t.k); },
            style:{flex:"1", padding:"8px",
                   background: tipo === t.k ? t.c+"22" : "transparent",
                   border: "1px solid " + (tipo === t.k ? t.c+"66" : C.bd),
                   borderRadius:"10px",
                   color: tipo === t.k ? t.c : C.mt,
                   fontSize:"11px", fontWeight:700,
                   cursor:"pointer", fontFamily:"inherit"}}, t.l);
        })
      ),
      /* Category grid */
      e("div", {style:{padding:"0 20px 16px"}},
        e("div", {style:{fontSize:"10px", color:C.dm,
                         letterSpacing:"2px", textTransform:"uppercase",
                         fontWeight:700, marginBottom:"10px"}},
          "◆ Categorías (" + VOCAB_CATS.length + ")"),
        e("div", {style:{display:"grid",
                         gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",
                         gap:"7px"}},
          e("div", {onClick: function(){ setCat("all"); },
            style:{padding:"14px 12px",
                   background: cat === "all"
                     ? "linear-gradient(135deg,rgba(59,130,246,.15),rgba(167,139,250,.08))"
                     : "linear-gradient(135deg,rgba(13,18,36,.8),rgba(13,18,36,.4))",
                   border: "1px solid " + (cat === "all" ? "rgba(96,165,250,.6)" : C.bd),
                   borderRadius:"14px", cursor:"pointer"}},
            e("div", {style:{fontSize:"26px", marginBottom:"6px"}}, "🌐"),
            e("div", {style:{fontSize:"12px", fontWeight:700,
                             color:C.tx, marginBottom:"3px"}}, "Todos"),
            e("div", {style:{fontSize:"10px", color:C.mt}},
              "Biblioteca completa"),
            e("div", {style:{marginTop:"7px", display:"inline-flex",
                             padding:"2px 7px",
                             background:"rgba(96,165,250,.2)",
                             color:"#60a5fa", borderRadius:"5px",
                             fontSize:"10px", fontWeight:700}},
              VOCAB_VOC.length)
          ),
          VOCAB_CATS.map(function(c) {
            return e(VocabCatCard, {key:c.id, c:c,
                                    cnt:counts[c.id],
                                    active: cat === c.id,
                                    onClick: function(){ setCat(c.id); }});
          })
        )
      ),
      /* Results list */
      e("div", {style:{padding:"0 20px"}},
        e("div", {style:{display:"flex", justifyContent:"space-between",
                         alignItems:"center", marginBottom:"12px"}},
          e("div", {style:{fontSize:"10px", color:C.dm,
                           letterSpacing:"2px", textTransform:"uppercase",
                           fontWeight:700}},
            "◆ " + (cat === "all"
              ? "Biblioteca"
              : VOCAB_CATS.find(function(x){return x.id===cat;}).n)),
          e("div", {style:{fontSize:"11px", color:C.mt}},
            filtered.length + " resultados")
        ),
        filtered.length === 0
          ? e("div", {style:{padding:"40px 20px", textAlign:"center",
                             color:C.mt, background:"rgba(13,18,36,.4)",
                             borderRadius:"16px",
                             border:"1px dashed "+C.bd}},
              e("div", {style:{fontSize:"40px", marginBottom:"10px"}}, "🔍"),
              e("div", null, "Sin coincidencias"))
          : e("div", {style:{display:"flex", flexDirection:"column", gap:"7px"}},
              filtered.map(function(x, i) {
                var cobj = VOCAB_CATS.find(function(c){ return c.id === x.cat; });
                var k = x.cat + "_" + x.tx + "_" + i;
                return e(VocabTermCard, {key:k, x:x, cat:cobj,
                                         open: !!open[k],
                                         toggle: function(){ toggleItem(k); }});
              })
            )
      ),
      /* Footer */
      e("div", {style:{margin:"40px 20px 0", padding:"24px 20px",
                       background:"linear-gradient(135deg,rgba(96,165,250,.08),rgba(167,139,250,.08))",
                       border:"1px solid "+C.bd, borderRadius:"18px",
                       textAlign:"center"}},
        e("div", {style:{fontSize:"28px", marginBottom:"10px"}}, "🏛️"),
        e("div", {style:{fontFamily:"'Playfair Display',serif",
                         fontSize:"18px", color:C.tx, fontWeight:700,
                         marginBottom:"4px"}},
          "El Conocimiento Es Para Todos"),
        e("div", {style:{fontSize:"12px", color:C.mt,
                         lineHeight:"1.5", fontStyle:"italic"}},
          "La etimología médica es la llave maestra.",
          e("br"),
          "Cada palabra es un mapa de significado."),
        e("div", {style:{marginTop:"14px", fontSize:"10px",
                         color:C.dm, letterSpacing:"1.5px"}},
          "ECEPT · v3.0 · " + VOCAB_VOC.length + " raíces · " + VOCAB_DEMOS.length + " demos")
      )
    )
  );
}
