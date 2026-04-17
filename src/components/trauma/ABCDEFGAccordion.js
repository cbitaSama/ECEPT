/* ABCDEFGAccordion — 5 step cards (A/B/C/D/EFG).
   Each step contains a bloque array; clicking header toggles body.
   Body is rendered with BloqueRenderer so nested linkbadges work. */

function ABCDEFGAccordion(props) {
  var sOpen = useState({}); var open = sOpen[0], setOpen = sOpen[1];

  function toggle(i) {
    var next = {};
    for (var k in open) if (open.hasOwnProperty(k)) next[k] = open[k];
    next[i] = !open[i];
    setOpen(next);
  }

  return e("div", {style:{display:"flex", flexDirection:"column",
                          gap:"8px", marginBottom:"14px"}},
    TRAUMA_ABCD.map(function(s, i){
      var isOpen = !!open[i];
      return e("div", {key:i,
        style:{padding:"14px 16px", borderRadius:"12px",
               background:"#0d1224",
               border:"1px solid " + (isOpen ? "#f472b6" : "#1a2040")}
      },
        e("button", {onClick: function(){ toggle(i); },
          style:{display:"flex", alignItems:"center", gap:"12px",
                 minHeight:"36px", cursor:"pointer", width:"100%",
                 background:"none", border:"none", padding:0,
                 color:"inherit", textAlign:"left", fontFamily:"inherit"}
        },
          e("div", {style:{flex:"none", width:"38px", height:"38px",
                           borderRadius:"10px",
                           background:"rgba(244,114,182,.15)",
                           color:"#f9a8d4", display:"flex",
                           alignItems:"center", justifyContent:"center",
                           fontWeight:900,
                           fontFamily:"'Playfair Display',serif",
                           fontSize:"18px"}}, s.letter),
          e("div", {style:{fontWeight:700, fontSize:"14px",
                           color:"#e2e8f0", flex:"1",
                           lineHeight:"1.25"}}, s.title),
          e("div", {style:{color: isOpen ? "#f472b6" : "#64748b",
                           fontSize:"18px",
                           transform: isOpen ? "rotate(90deg)" : "none",
                           transition:"transform .2s"}}, "\u203a")
        ),
        isOpen && e("div", {style:{marginTop:"14px", paddingTop:"14px",
                                   borderTop:"1px solid #1a2040",
                                   fontSize:"14px", color:"#cbd5e1",
                                   animation:"fadeUp .2s"}},
          e(BloqueRenderer, {bloques: s.body,
                             onJump: props.onJump,
                             onSecJump: props.onSecJump})
        )
      );
    })
  );
}
