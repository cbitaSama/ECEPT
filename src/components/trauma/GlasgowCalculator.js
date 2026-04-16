/* GlasgowCalculator — interactive GCS scoring.
   3 selects (O/V/M) → total, severity badge, clinical interpretation.
   Preserves color thresholds + wording from artifact calcGCS(). */

function GlasgowCalculator() {
  var sO = useState(4); var o = sO[0], setO = sO[1];
  var sV = useState(5); var v = sV[0], setV = sV[1];
  var sM = useState(6); var m = sM[0], setM = sM[1];
  var total = o + v + m;

  var sev, color, interp;
  if (total >= 14) {
    sev = "Leve"; color = "#34d399";
    interp = "<strong>TEC leve (14\u201315).</strong> Observaci\u00f3n cl\u00ednica. La mayor\u00eda se recupera bien.";
  } else if (total >= 9) {
    sev = "Moderado"; color = "#fbbf24";
    interp = "<strong>TEC moderado (9\u201313).</strong> TAC obligado, observaci\u00f3n cerrada. Evaluar intubaci\u00f3n si hay deterioro.";
  } else {
    sev = "Grave"; color = "#ef4444";
    interp = "<strong>TEC grave (\u2264 8). INTUBAR.</strong> Manejo en UCI. Considerar monitoreo de PIC.";
  }

  var fieldStyle = {display:"block"};
  var labelStyle = {display:"block", fontSize:"11.5px", fontWeight:700,
                    letterSpacing:".06em", textTransform:"uppercase",
                    color:"#94a3b8", marginBottom:"6px"};
  var selectStyle = {width:"100%", padding:"11px 12px", borderRadius:"9px",
                     background:"#060a14", border:"1px solid #1a2040",
                     color:"#e2e8f0", fontFamily:"inherit", fontSize:"14px",
                     minHeight:"44px", appearance:"none",
                     WebkitAppearance:"none"};

  function opts(arr) {
    return arr.map(function(row){
      return e("option", {key:row[0], value:row[0]}, row[0] + " \u2014 " + row[1]);
    });
  }

  return e("div", {
    style:{padding:"18px", borderRadius:"14px",
           background:"linear-gradient(135deg,#0f1530,#0d1224)",
           border:"1px solid #1a2040", marginBottom:"18px"}
  },
    e("div", {style:{display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px"}},
      e("span", {style:{width:"32px", height:"32px", borderRadius:"8px",
                        background:"rgba(59,130,246,.15)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        color:"#60a5fa", fontSize:"16px"}}, "\ud83e\udde0"),
      e("h3", {style:{margin:0, fontSize:"16px", fontWeight:700, color:"#fff",
                      fontFamily:"'DM Sans',sans-serif"}}, "Calculadora interactiva")
    ),

    e("div", {style:{display:"grid",
                     gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
                     gap:"12px", marginBottom:"14px"}},
      e("div", {style:fieldStyle},
        e("label", {style:labelStyle}, "Apertura ocular"),
        e("select", {value:o, style:selectStyle,
                     onChange: function(ev){ setO(parseInt(ev.target.value,10)); }},
          opts([[4,"Espont\u00e1nea"],[3,"A la voz"],[2,"Al dolor"],[1,"Ninguna"]]))
      ),
      e("div", {style:fieldStyle},
        e("label", {style:labelStyle}, "Respuesta verbal"),
        e("select", {value:v, style:selectStyle,
                     onChange: function(ev){ setV(parseInt(ev.target.value,10)); }},
          opts([[5,"Orientado"],[4,"Confuso"],[3,"Palabras inapropiadas"],
                [2,"Sonidos incomprensibles"],[1,"No responde"]]))
      ),
      e("div", {style:fieldStyle},
        e("label", {style:labelStyle}, "Respuesta motora"),
        e("select", {value:m, style:selectStyle,
                     onChange: function(ev){ setM(parseInt(ev.target.value,10)); }},
          opts([[6,"Obedece \u00f3rdenes"],[5,"Localiza el dolor"],[4,"Retira al dolor"],
                [3,"Flexi\u00f3n anormal (decorticaci\u00f3n)"],
                [2,"Extensi\u00f3n anormal (descerebraci\u00f3n)"],[1,"Ninguna"]]))
      )
    ),

    e("div", {style:{padding:"14px 16px", borderRadius:"11px",
                     background:"#060a14", border:"1px solid #1a2040"}},
      e("div", {style:{display:"flex", alignItems:"baseline",
                       gap:"14px", flexWrap:"wrap"}},
        e("div", null,
          e("span", {style:{fontFamily:"'Playfair Display',serif",
                            fontSize:"40px", fontWeight:900, lineHeight:1,
                            color: color}}, total),
          e("span", {style:{color:"#64748b", fontSize:"18px", fontWeight:700}}, " / 15"),
          e("div", {style:{fontSize:"11px", fontWeight:700,
                           letterSpacing:".12em", textTransform:"uppercase",
                           color:"#94a3b8", marginTop:"4px"}}, "Glasgow total")
        ),
        e("div", {style:{marginLeft:"auto"}},
          e("span", {
            style:{display:"inline-block", padding:"3px 10px", borderRadius:"6px",
                   fontSize:"11px", fontWeight:800, letterSpacing:".06em",
                   textTransform:"uppercase",
                   background: color + "25", color: color,
                   border: "1px solid " + color + "55"}
          }, sev)
        )
      ),
      e("div", {style:{marginTop:"10px", fontSize:"13.5px",
                       color:"#cbd5e1", lineHeight:"1.5"},
        dangerouslySetInnerHTML:{__html: interp + " \u00b7 <span style=\"color:#94a3b8\">O="+o+" V="+v+" M="+m+"</span>"}})
    )
  );
}
