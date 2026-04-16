/* LethalLesionsGrid — 6-button grid + detail panel.
   Only one open at a time; detail rendered via BloqueRenderer. */

function LethalLesionsGrid(props) {
  var sSel = useState(-1); var sel = sSel[0], setSel = sSel[1];

  var detail = sel >= 0 ? TRAUMA_LETHAL[sel] : null;

  return e(F, null,
    e("div", {style:{display:"grid",
                     gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",
                     gap:"10px", marginBottom:"18px"}},
      TRAUMA_LETHAL.map(function(L, i){
        var isOpen = i === sel;
        return e("button", {key:i,
          onClick: function(){ setSel(isOpen ? -1 : i); },
          style:{padding:"14px 16px", borderRadius:"12px",
                 background: isOpen ? "#0f1530" : "#0d1224",
                 border: "1px solid " + (isOpen ? "#a78bfa" : "#1a2040"),
                 cursor:"pointer", textAlign:"left",
                 display:"flex", alignItems:"center", gap:"12px",
                 minHeight:"64px", width:"100%",
                 fontFamily:"inherit", color:"inherit"}
        },
          e("div", {style:{flex:"none", width:"34px", height:"34px",
                           borderRadius:"50%",
                           background:"rgba(167,139,250,.15)",
                           color:"#c4b5fd",
                           display:"flex", alignItems:"center",
                           justifyContent:"center",
                           fontWeight:800,
                           fontFamily:"'Playfair Display',serif",
                           fontSize:"16px"}}, L.n),
          e("div", {style:{fontWeight:700, fontSize:"14.5px",
                           color:"#e2e8f0", lineHeight:"1.25",
                           flex:"1"}}, L.t),
          e("div", {style:{color: isOpen ? "#a78bfa" : "#64748b",
                           fontSize:"18px",
                           transform: isOpen ? "rotate(90deg)" : "none",
                           transition:"transform .2s"}}, "\u203a")
        );
      })
    ),

    detail && e("div", {style:{margin:"-6px 0 14px", padding:"16px 18px",
                                borderRadius:"12px",
                                background:"#0a0f1f",
                                border:"1px solid #1a2040",
                                borderTop:"3px solid #a78bfa",
                                animation:"fadeUp .25s"}},
      e("h3", {style:{marginTop:0, color:"#c4b5fd",
                      fontFamily:"'Playfair Display',serif",
                      fontSize:"20px", marginBottom:"12px", fontWeight:800}},
        detail.n + ". " + detail.t),
      e(BloqueRenderer, {bloques: detail.body,
                         onJump: props.onJump,
                         onSecJump: props.onSecJump})
    )
  );
}
