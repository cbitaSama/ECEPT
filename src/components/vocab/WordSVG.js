/* WordSVG — generic morpheme-chip animation (not an SVG but matches
   the DemoSVG router API). Renders each part as a colored chip with
   '+' separators; the current step's chip gets a glow filter.
   Ported from artifacts/vocabulario_medico_v4.html lines 826-852. */

function WordSVG(props) {
  var step = props.step, p = props.p;
  return e("div", {
    style:{display:"flex", alignItems:"center", justifyContent:"center",
           flexWrap:"wrap", gap:"8px", padding:"40px 20px", minHeight:"200px"}
  },
    p.map(function(pt, i){
      var act = step >= (i + 1);
      return e(F, {key:i},
        e("div", {style:{
          padding:"14px 18px",
          background: act ? pt.c+"22" : "rgba(26,32,64,.3)",
          border: "2px solid " + (act ? pt.c : "#1a2040"),
          borderRadius:"14px",
          textAlign:"center",
          transform: act ? "scale(1)" : "scale(.9)",
          opacity: act ? 1 : .4,
          transition:"all .5s cubic-bezier(.4,0,.2,1)",
          filter: step === (i + 1) ? "drop-shadow(0 0 15px "+pt.c+"66)" : "none",
          minWidth:"90px"
        }},
          e("div", {style:{fontFamily:"'JetBrains Mono',monospace",
                           fontSize:"14px", fontWeight:800,
                           color:pt.c, marginBottom:"4px"}}, pt.s),
          e("div", {style:{fontSize:"11px", color:"#e2e8f0",
                           fontWeight:600}}, pt.m)
        ),
        i < p.length - 1 && e("div", {
          style:{color: act ? "#60a5fa" : "#64748b",
                 fontSize:"22px", fontWeight:800,
                 transition:"color .5s"}
        }, "+")
      );
    })
  );
}
