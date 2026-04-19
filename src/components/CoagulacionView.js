// ══════════════════════════════════════════════════════════════
// COMPONENT: CoagulacionView — Fisiología · cascade + pearls
// ══════════════════════════════════════════════════════════════
function CoagulacionView(){
  return e("div",{style:{paddingBottom:"40px"}},
    // Header
    e("div",{style:{textAlign:"center",marginBottom:"22px"}},
      e("div",{style:{fontSize:"40px",marginBottom:"4px"}},"🩸"),
      e("h1",{style:{fontFamily:"'Playfair Display',serif",fontSize:"26px",fontWeight:900,
        background:"linear-gradient(135deg,#dc2626 0%,#ef4444 50%,#f59e0b 100%)",
        WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"-0.5px"}},
        "Cascada de Coagulación"),
      e("p",{style:{color:C.dm,fontSize:"12px",letterSpacing:"1px",textTransform:"uppercase",marginTop:"4px"}},
        "Vía extrínseca · intrínseca · común")
    ),

    // Cross-link back to the factors table in Generalidades
    e("div",{onClick:function(){go("general")},
      style:{display:"inline-flex",alignItems:"center",gap:"8px",
        padding:"8px 14px",marginBottom:"20px",
        background:C.cd,border:"1px solid "+C.bd,borderRadius:"10px",
        cursor:"pointer",fontSize:"12px",color:C.ac2,fontWeight:600}},
      e("span",null,"📋"),
      e("span",null,"Ver tabla de factores en Generalidades"),
      e("span",{style:{fontSize:"10px"}},"→")
    ),

    // Cascada visual
    e("h4",{style:{fontFamily:"'Playfair Display',serif",fontSize:"16px",fontWeight:700,marginBottom:"12px",color:"#34d399"}},"🌊 Cascada de Coagulación"),
    e("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}},
      // Extrínseca
      e("div",{style:{padding:"14px",borderRadius:"12px",border:"1.5px solid rgba(244,114,182,.3)",background:"rgba(244,114,182,.04)"}},
        e("div",{style:{fontSize:"11px",fontWeight:700,color:"#f472b6",marginBottom:"10px",textTransform:"uppercase",letterSpacing:".1em"}},"🩹 Vía Extrínseca (TP/INR)"),
        COAG_CASCADA.ext.map(function(p,i){return e("div",{key:i},e("div",{style:{padding:"6px 10px",borderRadius:"6px",background:"rgba(244,114,182,.08)",border:"1px solid rgba(244,114,182,.2)",fontSize:"12px",fontWeight:600,color:"#f472b6",textAlign:"center",marginBottom:"4px"}},p.paso),i<COAG_CASCADA.ext.length-1&&e("div",{style:{textAlign:"center",color:C.dm,fontSize:"14px"}},"↓"))})
      ),
      // Intrínseca
      e("div",{style:{padding:"14px",borderRadius:"12px",border:"1.5px solid rgba(96,165,250,.3)",background:"rgba(96,165,250,.04)"}},
        e("div",{style:{fontSize:"11px",fontWeight:700,color:"#60a5fa",marginBottom:"10px",textTransform:"uppercase",letterSpacing:".1em"}},"🩸 Vía Intrínseca (KPTT)"),
        COAG_CASCADA.intr.map(function(p,i){return e("div",{key:i},e("div",{style:{padding:"6px 10px",borderRadius:"6px",background:"rgba(96,165,250,.08)",border:"1px solid rgba(96,165,250,.2)",fontSize:"12px",fontWeight:600,color:"#60a5fa",textAlign:"center",marginBottom:"4px"}},p.paso),i<COAG_CASCADA.intr.length-1&&e("div",{style:{textAlign:"center",color:C.dm,fontSize:"14px"}},"↓"))})
      )
    ),
    // Vía común
    e("div",{style:{padding:"16px",borderRadius:"12px",border:"2px solid rgba(52,211,153,.35)",background:"rgba(52,211,153,.04)",marginBottom:"16px"}},
      e("div",{style:{fontSize:"11px",fontWeight:700,color:"#34d399",marginBottom:"10px",textTransform:"uppercase",letterSpacing:".1em"}},"🔗 Vía Común"),
      COAG_CASCADA.comun.map(function(p,i){return e("div",{key:i,style:{display:"flex",alignItems:"center",gap:"10px",padding:"8px 0",borderBottom:i<COAG_CASCADA.comun.length-1?"1px solid rgba(255,255,255,.05)":"none"}},e("span",{style:{color:"#34d399",fontSize:"16px",flexShrink:0}},["①","②","③","④"][i]),e("span",{style:{fontSize:"13px",color:C.mt}},p.paso))})
    ),
    // Perlas
    e("div",{style:{marginBottom:"16px"}},COAG_PERLAS.map(function(p,i){return e("div",{key:i,style:{display:"flex",gap:"10px",alignItems:"flex-start",padding:"10px 14px",background:"rgba(251,191,36,.06)",borderRadius:"8px",borderLeft:"3px solid #fbbf24",marginBottom:"6px"}},e("span",{style:{fontSize:"14px",flexShrink:0}},"💡"),e("span",{style:{fontSize:"12px",color:C.mt,lineHeight:1.5}},p))})),

    // Link to labs (same as before)
    e("div",{style:{marginTop:"8px"}},e(LinkBadge,{to:"lab_coag",go:go}))
  );
}
