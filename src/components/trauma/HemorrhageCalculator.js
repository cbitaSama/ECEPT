/* HemorrhageCalculator — grade I-IV by blood-loss volume.
   Mirrors calcHem() from trauma_unidad_1.html byte-for-byte. */

function HemorrhageCalculator() {
  var sMl = useState(""); var mlStr = sMl[0], setMl = sMl[1];
  var sKg = useState(""); var kgStr = sKg[0], setKg = sKg[1];
  var ml = parseInt(mlStr, 10);
  var kg = parseInt(kgStr, 10);
  var show = !(isNaN(ml) || ml < 0);

  var grade, color, interp, range;
  if (show) {
    if (ml < 750) {
      grade = "I"; color = "#34d399";
      range = "&lt; 750 ml \u00b7 &lt; 15%";
      interp = "<strong>FC &lt; 100 \u00b7 PA normal \u00b7 FR 14\u201320 \u00b7 diuresis &gt; 30 ml/h \u00b7 ansiedad leve.</strong> Reposici\u00f3n con cristaloides.";
    } else if (ml <= 1500) {
      grade = "II"; color = "#fbbf24";
      range = "750\u20131500 ml \u00b7 15\u201330%";
      interp = "<strong>FC &gt; 100 \u00b7 PA normal \u00b7 presi\u00f3n de pulso baja \u00b7 FR 20\u201330 \u00b7 diuresis 20\u201330 ml/h \u00b7 mayor ansiedad.</strong> Cristaloides.";
    } else if (ml <= 2000) {
      grade = "III"; color = "#fb923c";
      range = "1500\u20132000 ml \u00b7 30\u201340%";
      interp = "<strong>FC &gt; 120 \u00b7 PA BAJA (aqu\u00ed aparece la hipotensi\u00f3n) \u00b7 FR 30\u201340 \u00b7 diuresis 5\u201315 ml/h \u00b7 confusi\u00f3n.</strong> Cristaloides + hemoderivados.";
    } else {
      grade = "IV"; color = "#ef4444";
      range = "&gt; 2000 ml \u00b7 &gt; 40%";
      interp = "<strong>FC &gt; 140 \u00b7 PA muy baja \u00b7 FR &gt; 35 \u00b7 diuresis indeterminada \u00b7 letargia.</strong> <span style=\"color:#fca5a5\">Cirug\u00eda inmediata + hemoderivados.</span>";
    }
  }

  var pctText = range || "";
  if (show && !isNaN(kg) && kg > 0) {
    var vol = kg * 70;
    var pct = (ml / vol * 100).toFixed(1);
    pctText = "P\u00e9rdida \u2248 <strong>" + pct + "%</strong> del volumen sangu\u00edneo total (" + vol + " ml estimados) \u00b7 " + range;
  }

  var labelStyle = {display:"block", fontSize:"11.5px", fontWeight:700,
                    letterSpacing:".06em", textTransform:"uppercase",
                    color:"#94a3b8", marginBottom:"6px"};
  var inputStyle = {width:"100%", padding:"11px 12px", borderRadius:"9px",
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
                        color:"#60a5fa", fontSize:"16px"}}, "\ud83e\ude78"),
      e("h3", {style:{margin:0, fontSize:"16px", fontWeight:700, color:"#fff",
                      fontFamily:"'DM Sans',sans-serif"}},
               "Calculadora de grado por volumen perdido")
    ),

    e("div", {style:{display:"grid",
                     gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
                     gap:"12px", marginBottom:"14px"}},
      e("div", null,
        e("label", {style:labelStyle}, "Volumen perdido (ml)"),
        e("input", {type:"number", value:mlStr, placeholder:"Ej. 1200",
                    min:"0", step:"50", style:inputStyle,
                    onChange: function(ev){ setMl(ev.target.value); }})
      ),
      e("div", null,
        e("label", {style:labelStyle}, "Peso del paciente (kg) \u2014 opcional"),
        e("input", {type:"number", value:kgStr, placeholder:"Ej. 70",
                    min:"0", step:"1", style:inputStyle,
                    onChange: function(ev){ setKg(ev.target.value); }})
      )
    ),

    show && e("div", {style:{padding:"14px 16px", borderRadius:"11px",
                              background:"#060a14", border:"1px solid #1a2040"}},
      e("div", {style:{display:"flex", alignItems:"baseline",
                       gap:"14px", flexWrap:"wrap"}},
        e("div", null,
          e("span", {style:{fontFamily:"'Playfair Display',serif",
                            fontSize:"40px", fontWeight:900, lineHeight:1,
                            color: color}}, grade),
          e("div", {style:{fontSize:"11px", fontWeight:700,
                           letterSpacing:".12em", textTransform:"uppercase",
                           color:"#94a3b8", marginTop:"4px"}}, "Grado de shock")
        ),
        e("div", {style:{marginLeft:"auto", color:"#94a3b8", fontSize:"14px"},
                  dangerouslySetInnerHTML:{__html: pctText}})
      ),
      e("div", {style:{marginTop:"10px", fontSize:"13.5px",
                       color:"#cbd5e1", lineHeight:"1.5"},
                dangerouslySetInnerHTML:{__html: interp}})
    )
  );
}
