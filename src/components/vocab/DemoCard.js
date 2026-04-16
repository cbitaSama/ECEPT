/* DemoCard — expandable decomposition demo card.
   Ported from artifacts/vocabulario_medico_v4.html lines 952-1000.
   When expanded, cycles through morpheme steps every 1400 ms. */

function VocabDemoCard(props) {
  var d = props.d;
  var stepState = useState(0); var step = stepState[0], setStep = stepState[1];
  var expState  = useState(false); var exp = expState[0], setExp = expState[1];

  useEffect(function() {
    if (!exp) { setStep(0); return; }
    var max = d.p.length;
    var i = setInterval(function() {
      setStep(function(s){ return s >= max ? 0 : s + 1; });
    }, 1400);
    return function(){ clearInterval(i); };
  }, [exp, d.p.length]);

  return e("div", {
    style:{background:"linear-gradient(135deg, rgba(13,18,36,.95) 0%, rgba(13,18,36,.5) 100%)",
           border:"1px solid "+C.bd, borderRadius:"16px",
           overflow:"hidden", transition:"all .3s"}
  },
    e("div", {onClick: function(){ setExp(!exp); },
      style:{padding:"16px 18px", cursor:"pointer",
             display:"flex", alignItems:"center",
             justifyContent:"space-between", gap:"12px"}
    },
      e("div", {style:{flex:1, minWidth:0}},
        e("div", {style:{fontSize:"10px", color:"#60a5fa",
                         letterSpacing:"1.5px", textTransform:"uppercase",
                         fontWeight:700, marginBottom:"4px"}},
          exp ? "En vivo" : "Decodifica"),
        e("div", {style:{fontFamily:"'Playfair Display',serif",
                         fontSize:"18px", fontWeight:800, color:C.tx,
                         marginBottom:"2px", lineHeight:"1.2"}}, d.w),
        e("div", {style:{fontSize:"11px", color:C.mt, fontStyle:"italic"}}, d.sub)
      ),
      e("div", {style:{fontSize:"18px", color:"#60a5fa",
                       transform: exp ? "rotate(180deg)" : "rotate(0)",
                       transition:"transform .3s"}}, "▾")
    ),
    exp && e("div", {style:{padding:"0 18px 18px", animation:"fadeIn .4s",
                            borderTop:"1px solid "+C.bd}},
      (d.type === "neck" || d.type === "heart" || d.type === "abd")
        ? e("div", {style:{maxWidth:"260px", margin:"12px auto 0",
                           aspectRatio:"1/1"}},
            e(DemoSVG, {type: d.type, step: step, p: d.p}))
        : e(WordSVG, {step: step, p: d.p}),
      e("div", {style:{display:"grid",
                       gridTemplateColumns:"repeat("+d.p.length+",1fr)",
                       gap:"5px", marginTop:"10px", marginBottom:"10px"}},
        d.p.map(function(pt, i) {
          var act = step >= (i + 1);
          return e("div", {key:i, style:{
            padding:"8px 6px",
            background: act ? pt.c+"22" : "rgba(13,18,36,.4)",
            border: "1px solid " + (act ? pt.c+"66" : C.bd),
            borderRadius:"9px", textAlign:"center",
            transition:"all .5s", opacity: act ? 1 : .45
          }},
            e("div", {style:{fontFamily:"'JetBrains Mono',monospace",
                             fontSize:"10px", fontWeight:700,
                             color:pt.c, marginBottom:"1px"}}, pt.s),
            e("div", {style:{fontSize:"10px", color:C.tx, fontWeight:600}}, pt.m)
          );
        })
      ),
      e("div", {style:{padding:"10px 12px",
                       background:"rgba(52,211,153,.08)",
                       border:"1px solid rgba(52,211,153,.3)",
                       borderRadius:"10px", fontSize:"12px",
                       color:C.tx, lineHeight:"1.5"}}, "💡 " + d.rev)
    )
  );
}
