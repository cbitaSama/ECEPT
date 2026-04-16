/* VocabQuiz — 10-question MCQ over VOCAB_VOC.
   Ported from artifacts/vocabulario_medico_v4.html lines 1133-1220.
   Props: {seed, restart} */

function VocabQuiz(props) {
  var qz = useMemo(function() {
    var arr = VOCAB_VOC.slice().sort(function(){ return Math.random() - .5; }).slice(0, 10);
    return arr.map(function(x) {
      var others = VOCAB_VOC.filter(function(o) {
        return o.tx !== x.tx && o.cat !== x.cat;
      }).sort(function(){ return Math.random() - .5; }).slice(0, 3);
      var shortDef = function(t){ return t.sig.split(".")[0].slice(0, 70); };
      var opts = [shortDef(x)].concat(others.map(shortDef)).sort(function(){ return Math.random() - .5; });
      return {p:"¿Qué significa " + x.tx + "?",
              o: opts, r: opts.indexOf(shortDef(x)),
              x: x.tip, or: x.or, cat: x.cat};
    });
  }, [props.seed]);

  var state = useState(0);       var i = state[0],     setI     = state[1];
  var aState = useState(null);   var ans = aState[0],  setAns   = aState[1];
  var sState = useState(0);      var score = sState[0],setScore = sState[1];
  var dState = useState(false);  var done = dState[0], setDone  = dState[1];

  function pick(idx) {
    if (ans !== null) return;
    setAns(idx);
    if (idx === qz[i].r) setScore(score + 1);
  }
  function next() {
    if (i < qz.length - 1) { setI(i + 1); setAns(null); }
    else setDone(true);
  }
  function restart() {
    setI(0); setAns(null); setScore(0); setDone(false);
    props.restart();
  }

  if (done) {
    var pct = Math.round(score / qz.length * 100);
    var col = pct >= 80 ? "#34d399" : pct >= 50 ? "#fbbf24" : "#ef4444";
    var msg = pct >= 80 ? "Dominio" : pct >= 50 ? "Vas bien" : "Sigue practicando";
    return e("div", {
      style:{padding:"32px 24px",
             background:"linear-gradient(135deg, "+col+"18 0%, "+col+"05 100%)",
             border:"1px solid "+col+"44", borderRadius:"18px", textAlign:"center"}
    },
      e("div", {style:{fontSize:"52px", marginBottom:"10px",
                       animation:"float 2s infinite"}},
        pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "📚"),
      e("div", {style:{fontSize:"42px", fontWeight:900, color:col,
                       fontFamily:"'Playfair Display',serif", lineHeight:"1"}},
        score + "/" + qz.length),
      e("div", {style:{fontSize:"13px", color:C.mt,
                       marginTop:"4px", marginBottom:"4px"}},
        pct + "% de aciertos"),
      e("div", {style:{fontSize:"14px", color:col,
                       fontWeight:700, marginBottom:"20px"}}, msg),
      e("button", {onClick:restart,
        style:{padding:"12px 28px", background:col, color:"#060a14",
               border:"none", borderRadius:"12px",
               fontWeight:700, fontSize:"14px", cursor:"pointer",
               fontFamily:"inherit"}},
        "↻ Nuevo intento")
    );
  }

  var q = qz[i];
  return e("div", {
    style:{background:"rgba(13,18,36,.7)", border:"1px solid "+C.bd,
           borderRadius:"18px", padding:"20px", animation:"fadeIn .5s"}
  },
    e("div", {style:{display:"flex", justifyContent:"space-between",
                     alignItems:"center", marginBottom:"14px"}},
      e("div", {style:{fontSize:"11px", color:C.mt, fontWeight:600,
                       letterSpacing:"1px", textTransform:"uppercase"}},
        "Pregunta " + (i + 1) + " / " + qz.length),
      e("div", {style:{fontSize:"12px", color:"#fbbf24", fontWeight:700}},
        "🔥 " + score)
    ),
    e("div", {style:{height:"3px", background:"rgba(26,32,64,.5)",
                     borderRadius:"2px", overflow:"hidden", marginBottom:"18px"}},
      e("div", {style:{height:"100%",
                       width: ((i + 1) / qz.length * 100) + "%",
                       background:"linear-gradient(90deg,#60a5fa,#a78bfa)",
                       transition:"width .3s"}})
    ),
    e("div", {style:{fontFamily:"'Playfair Display',serif",
                     fontSize:"19px", fontWeight:700, color:C.tx,
                     marginBottom:"14px", lineHeight:"1.3"}}, q.p),
    e("div", {style:{display:"flex", flexDirection:"column",
                     gap:"6px", marginBottom:"14px"}},
      q.o.map(function(opt, idx) {
        var isR = ans !== null && idx === q.r;
        var isW = ans === idx && idx !== q.r;
        var bg = isR ? "rgba(52,211,153,.15)" : isW ? "rgba(239,68,68,.15)" : "rgba(6,10,20,.4)";
        var br = isR ? "#34d399" : isW ? "#ef4444" : C.bd;
        return e("button", {key:idx,
          onClick: function(){ pick(idx); },
          disabled: ans !== null,
          style:{padding:"11px 13px", background:bg,
                 border:"1px solid "+br, borderRadius:"10px",
                 color:C.tx, textAlign:"left", fontSize:"12px",
                 cursor: ans === null ? "pointer" : "default",
                 lineHeight:"1.4", fontFamily:"inherit"}
        },
          e("span", {style:{color: isR ? "#34d399" : isW ? "#ef4444" : C.ac2,
                            fontWeight:700, marginRight:"8px"}},
            String.fromCharCode(65 + idx)),
          opt,
          isR && e("span", {style:{float:"right", color:"#34d399",
                                    fontWeight:700}}, "✓"),
          isW && e("span", {style:{float:"right", color:"#ef4444",
                                    fontWeight:700}}, "✗")
        );
      })
    ),
    ans !== null && e(F, null,
      e("div", {style:{padding:"10px 12px",
                       background:"rgba(251,191,36,.1)",
                       border:"1px solid rgba(251,191,36,.3)",
                       borderRadius:"10px", fontSize:"11px",
                       color:C.tx, marginBottom:"6px", lineHeight:"1.5"}},
        "💡 " + q.x),
      e("div", {style:{padding:"6px 10px", fontSize:"10px",
                       color:C.dm, fontStyle:"italic",
                       textAlign:"center", marginBottom:"8px"}},
        "⟨ " + q.or + " ⟩"),
      e("button", {onClick:next,
        style:{width:"100%", padding:"12px",
               background:"linear-gradient(135deg,#3b82f6,#a78bfa)",
               color:"#fff", border:"none", borderRadius:"11px",
               fontWeight:700, fontSize:"14px", cursor:"pointer",
               fontFamily:"inherit"}},
        i < qz.length - 1 ? "Siguiente →" : "Ver resultado")
    )
  );
}
