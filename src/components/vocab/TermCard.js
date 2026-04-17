/* TermCard — collapsible VOC entry card. Ported from artifact lines 1089-1128. */

function VocabTermCard(props) {
  var x = props.x, cat = props.cat, open = props.open, toggle = props.toggle;
  return e("div", {
    style:{background:"linear-gradient(135deg, rgba(13,18,36,.95) 0%, rgba(13,18,36,.65) 100%)",
           border:"1px solid " + (open ? cat.c+"55" : C.bd),
           borderRadius:"14px", overflow:"hidden", transition:"all .3s",
           boxShadow: open ? "0 8px 24px -8px "+cat.c+"40" : "none"}
  },
    e("div", {onClick:toggle,
      style:{padding:"14px 16px", cursor:"pointer",
             display:"flex", alignItems:"flex-start",
             justifyContent:"space-between", gap:"10px"}
    },
      e("div", {style:{flex:1, minWidth:0}},
        e("div", {style:{display:"flex", alignItems:"center",
                         gap:"8px", marginBottom:"5px", flexWrap:"wrap"}},
          e("span", {style:{fontFamily:"'JetBrains Mono',monospace",
                            fontSize:"15px", fontWeight:700,
                            color: VOCAB_TIPO[x.t].c,
                            letterSpacing:"-.3px"}}, x.tx),
          e("span", {style:{fontSize:"9px", padding:"2px 6px",
                            background: VOCAB_TIPO[x.t].c+"22",
                            color: VOCAB_TIPO[x.t].c, borderRadius:"5px",
                            fontWeight:700, textTransform:"uppercase",
                            letterSpacing:".5px"}}, VOCAB_TIPO[x.t].l)
        ),
        e("div", {style:{fontSize:"10px", color:C.dm,
                         fontStyle:"italic", marginBottom:"5px"}},
          "⟨ " + x.or + " ⟩"),
        !open && e("div", {style:{fontSize:"12px", color:C.mt, lineHeight:"1.4"}},
          x.sig.length > 80 ? x.sig.slice(0, 80) + "..." : x.sig)
      ),
      e("div", {style:{fontSize:"18px", color:cat.c,
                       transform: open ? "rotate(180deg)" : "rotate(0)",
                       transition:"transform .3s"}}, "▾")
    ),
    open && e("div", {style:{padding:"0 16px 16px",
                             borderTop:"1px solid "+C.bd,
                             animation:"fadeIn .3s"}},
      e("div", {style:{paddingTop:"12px", marginBottom:"12px",
                       fontSize:"13px", color:C.tx, lineHeight:"1.5"}}, x.sig),
      e("div", {style:{marginBottom:"12px"}},
        e("div", {style:{fontSize:"10px", color:cat.c, fontWeight:700,
                         letterSpacing:"1.5px", textTransform:"uppercase",
                         marginBottom:"7px"}}, "◆ Ejemplos"),
        e("div", {style:{display:"flex", flexDirection:"column", gap:"5px"}},
          x.ej.map(function(ej, i) {
            return e("div", {key:i,
              style:{padding:"8px 11px", background:"rgba(6,10,20,.5)",
                     border:"1px solid "+C.bd, borderLeft:"3px solid "+cat.c,
                     borderRadius:"7px", fontSize:"12px", color:C.tx,
                     lineHeight:"1.4"}}, ej);
          })
        )
      ),
      e("div", {style:{padding:"9px 11px",
                       background:"linear-gradient(135deg, "+cat.c+"15 0%, "+cat.c+"05 100%)",
                       border:"1px solid "+cat.c+"33", borderRadius:"9px",
                       fontSize:"11px", color:C.tx, lineHeight:"1.4",
                       fontWeight:500}}, x.tip)
    )
  );
}
