/* HeartSVG — 3 cardiac layers (peri/mio/endo) animation.
   Ported from artifacts/vocabulario_medico_v4.html lines 789-802. */

function HeartSVG(props) {
  var step = props.step, p = props.p;
  return e("svg", {viewBox:"0 0 300 300",
                   style:{width:"100%", height:"100%",
                          filter:"drop-shadow(0 0 15px rgba(96,165,250,.15))"}},
    e("path", {d:"M 150 70 Q 60 65 55 140 Q 55 220 150 270 Q 245 220 245 140 Q 240 65 150 70 Z",
               fill: step>=1 ? p[0].c+"33" : "rgba(26,32,64,.2)",
               stroke: step>=1 ? p[0].c : "#1a2040",
               strokeWidth:"3", style:{transition:"all .6s"}}),
    e("path", {d:"M 150 90 Q 80 90 75 145 Q 75 210 150 255 Q 225 210 225 145 Q 220 90 150 90 Z",
               fill: step>=2 ? p[1].c+"44" : "rgba(26,32,64,.15)",
               stroke: step>=2 ? p[1].c : "#1a2040",
               strokeWidth:"3", style:{transition:"all .6s"}}),
    e("path", {d:"M 150 110 Q 100 110 100 150 Q 100 200 150 235 Q 200 200 200 150 Q 200 110 150 110 Z",
               fill: step>=3 ? p[2].c+"33" : "rgba(6,10,20,.4)",
               stroke: step>=3 ? p[2].c : "#1a2040",
               strokeWidth:"3", style:{transition:"all .6s"}}),
    e("line", {x1:"150", y1:"120", x2:"150", y2:"225",
               stroke: step>=3 ? p[2].c : "#1a2040",
               strokeWidth:"1.5", opacity:".5", strokeDasharray:"4,4"}),
    step>=1 && e("text", {x:"150", y:"55", fill:p[0].c,
                          fontSize:"11", fontWeight:"700",
                          fontFamily:"DM Sans", textAnchor:"middle"}, "Pericardio"),
    step>=2 && e("text", {x:"150", y:"85", fill:p[1].c,
                          fontSize:"10", fontWeight:"700",
                          fontFamily:"DM Sans", textAnchor:"middle"}, "Miocardio"),
    step>=3 && e("text", {x:"150", y:"175", fill:p[2].c,
                          fontSize:"10", fontWeight:"700",
                          fontFamily:"DM Sans", textAnchor:"middle"}, "Endocardio"),
    step>=3 && e("circle", {cx:"150", cy:"290", r:"4", fill:"#ef4444",
                             style:{animation:"pulse 1.2s infinite"}})
  );
}
