/* ETTSelector — age → ETT size/cuff/depth/blade picker.
   Reads from TRAUMA_ETT data (9 entries). */

function ETTSelector() {
  var sIdx = useState(0); var idx = sIdx[0], setIdx = sIdx[1];
  var row = idx > 0 ? TRAUMA_ETT[idx - 1] : null;

  var labelStyle = {display:"block", fontSize:"11.5px", fontWeight:700,
                    letterSpacing:".06em", textTransform:"uppercase",
                    color:"#94a3b8", marginBottom:"6px"};
  var selectStyle = {width:"100%", padding:"11px 12px", borderRadius:"9px",
                     background:"#060a14", border:"1px solid #1a2040",
                     color:"#e2e8f0", fontFamily:"inherit", fontSize:"14px",
                     minHeight:"44px", appearance:"none", WebkitAppearance:"none"};

  return e("div", {
    style:{padding:"18px", borderRadius:"14px",
           background:"linear-gradient(135deg,#0f1530,#0d1224)",
           border:"1px solid #1a2040", marginBottom:"18px"}
  },
    e("div", {style:{display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px"}},
      e("span", {style:{width:"32px", height:"32px", borderRadius:"8px",
                        background:"rgba(59,130,246,.15)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        color:"#60a5fa", fontSize:"16px"}}, "\ud83d\udccf"),
      e("h3", {style:{margin:0, fontSize:"16px", fontWeight:700, color:"#fff",
                      fontFamily:"'DM Sans',sans-serif"}},
               "Selector de tubo endotraqueal por edad")
    ),

    e("div", {style:{marginBottom:"14px"}},
      e("label", {style:labelStyle}, "Paciente"),
      e("select", {value:idx, style:selectStyle,
                   onChange: function(ev){ setIdx(parseInt(ev.target.value,10)); }},
        e("option", {value:0}, "\u2014 Eleg\u00ed una edad \u2014"),
        TRAUMA_ETT.map(function(r, i){
          return e("option", {key:i+1, value:i+1}, r.l);
        })
      )
    ),

    row && e("div", {style:{padding:"14px 16px", borderRadius:"11px",
                            background:"#060a14", border:"1px solid #1a2040"}},
      e("dl", {style:{display:"grid", gridTemplateColumns:"max-content 1fr",
                      gap:"6px 16px", fontSize:"13.5px", margin:0,
                      color:"#e2e8f0"}},
        e("dt", {style:{color:"#94a3b8", fontWeight:600}}, "Tama\u00f1o"),
        e("dd", {style:{margin:0}}, row.s + " mm"),
        e("dt", {style:{color:"#94a3b8", fontWeight:600}}, "Bal\u00f3n"),
        e("dd", {style:{margin:0}}, row.b),
        e("dt", {style:{color:"#94a3b8", fontWeight:600}}, "Profundidad"),
        e("dd", {style:{margin:0}}, row.p),
        e("dt", {style:{color:"#94a3b8", fontWeight:600}}, "Rama laringoscopio"),
        e("dd", {style:{margin:0}}, row.r)
      )
    ),

    e("h3", {style:{fontSize:"16.5px", margin:"22px 0 10px",
                    fontWeight:700, color:"#e2e8f0",
                    fontFamily:"'DM Sans',sans-serif",
                    letterSpacing:".01em"}}, "Tabla completa de medidas"),
    e("div", {style:{overflowX:"auto", margin:"0 -4px 14px", padding:"0 4px"}},
      e("table", {style:{width:"100%", borderCollapse:"separate",
                         borderSpacing:"0", fontSize:"12.5px", minWidth:"480px"}},
        e("thead", null,
          e("tr", null,
            ["Edad","Tama\u00f1o (mm)","Bal\u00f3n","Profundidad","Rama"].map(function(h,i){
              return e("th", {key:i, style:{padding:"8px 10px", textAlign:"left",
                                            borderBottom:"1px solid #1a2040",
                                            background:"#0a0f1f", color:"#94a3b8",
                                            fontWeight:700, fontSize:"11.5px",
                                            letterSpacing:".04em",
                                            textTransform:"uppercase"}}, h);
            })
          )
        ),
        e("tbody", null,
          TRAUMA_ETT.map(function(r, i){
            return e("tr", {key:i},
              e("td", {style:{padding:"8px 10px", borderBottom:"1px solid #1a2040"}},
                e("strong", {style:{color:"#f1f5f9"}}, r.l)),
              e("td", {style:{padding:"8px 10px", borderBottom:"1px solid #1a2040"}}, r.s),
              e("td", {style:{padding:"8px 10px", borderBottom:"1px solid #1a2040"}}, r.b),
              e("td", {style:{padding:"8px 10px", borderBottom:"1px solid #1a2040"}}, r.p),
              e("td", {style:{padding:"8px 10px", borderBottom:"1px solid #1a2040"}}, r.r)
            );
          })
        )
      )
    )
  );
}
