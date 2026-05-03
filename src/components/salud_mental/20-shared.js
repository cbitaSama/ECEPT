// Hero de tema
function Hero(p){
  var c=p.c;
  return e("div",{style:{padding:22,background:"linear-gradient(135deg,"+ax(c,.18)+" 0%,"+C.cd+" 80%)",border:"1px solid "+ax(c,.14),borderRadius:16,marginBottom:18}},
    e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:6}},p.kicker),
    e("h1",{style:{fontSize:28,fontWeight:900,color:c,letterSpacing:.15,lineHeight:1.15,marginBottom:10}},p.title),
    e("div",{className:"prose",style:{fontSize:14}},p.children)
  );
}

// Glosario de abreviaturas
function Abbrev(p){
  var c=p.c||C.anx;
  return e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.08)+","+C.cd+" 80%)",border:"1px solid "+ax(c,.12),borderRadius:12,margin:"12px 0 20px"}},
    e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:6}},"🔤 Abreviaturas de este tema"),
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:8}},
      p.items.map(function(it,i){
        return e("div",{key:i,style:{display:"flex",gap:10,padding:"8px 10px",background:ax(c,.05),border:"1px solid "+ax(c,.15),borderRadius:7}},
          e("div",{style:{fontWeight:800,color:c,fontSize:12,minWidth:60,flexShrink:0,letterSpacing:.3}},it.a),
          e("div",{style:{fontSize:12.5,color:C.tx,lineHeight:1.4}},it.d)
        );
      })
    )
  );
}

// Índice navegable de sub-secciones (anclas internas)
function TOCNav(p){
  var c=p.c||C.anx;
  function scrollTo(id){
    var el=document.getElementById(id);
    if(el){
      var y=el.getBoundingClientRect().top+window.scrollY-70;
      window.scrollTo({top:y,behavior:"smooth"});
    }
  }
  return e("div",{style:{padding:"14px 16px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:12,margin:"12px 0 22px"}},
    e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:6}},"📑 Índice del tema · toca para saltar"),
    e("div",{style:{display:"flex",flexDirection:"column",gap:6}},
      p.items.map(function(it,i){
        return e("button",{key:i,onClick:function(){scrollTo(it.id);},style:{padding:"9px 11px",background:ax(c,.06),border:"1px solid "+ax(c,.2),borderRadius:7,textAlign:"left",cursor:"pointer",display:"flex",alignItems:"center",gap:10,color:C.tx,fontSize:13,lineHeight:1.35,width:"100%"}},
          it.n?e("span",{style:{minWidth:26,height:26,borderRadius:6,background:ax(c,.2),color:c,fontSize:11.5,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},it.n):null,
          e("span",{style:{flex:1}},it.t),
          e("span",{style:{color:c,fontSize:15,opacity:.6}},"→")
        );
      })
    )
  );
}

// Ancla (destino invisible del índice)
function Anchor(p){
  return e("div",{id:p.id,style:{height:1,marginTop:-1}});
}

// Bloque de enfermedad — marco visual que agrupa TODO lo de una entidad
function DiseaseBlock(p){
  var c=p.c||C.anx;
  return e("div",{style:{margin:"18px 0",padding:"2px 0"}},
    p.id?e(Anchor,{id:p.id}):null,
    // Header de enfermedad
    e("div",{style:{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.2)+","+ax(c,.05)+" 80%)",border:"1px solid "+ax(c,.14),borderRadius:"12px 12px 0 0",borderBottom:"none"}},
      e("div",{style:{minWidth:42,height:42,borderRadius:10,background:ax(c,.25),border:"1px solid "+ax(c,.14),color:c,fontSize:17,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"Inter,DM Sans"}},p.n),
      e("div",{style:{flex:1,minWidth:0}},
        e("div",{style:{fontSize:10,fontWeight:800,color:c,letterSpacing:1.5,textTransform:"uppercase",marginBottom:1,opacity:.8}},p.kicker||"Enfermedad"),
        e("div",{style:{fontSize:18,fontWeight:800,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Inter,DM Sans"}},p.name)
      )
    ),
    // Contenido
    e("div",{style:{padding:"14px 16px 16px",background:ax(c,.03),border:"1px solid "+ax(c,.12),borderRadius:"0 0 12px 12px",borderTop:"none"}},
      p.children
    )
  );
}

// Banner de sección compartida (ej: "TRATAMIENTO COMÚN DEL TEMA")
function SharedBanner(p){
  var c=p.c||C.anx;
  return e("div",{style:{padding:"16px 18px",background:"linear-gradient(135deg,"+ax(c,.2)+","+ax(c,.06)+" 90%)",border:"2px solid "+ax(c,.5),borderRadius:14,margin:"26px 0 14px",textAlign:"center"}},
    e("div",{style:{fontSize:24,marginBottom:4}},p.icon||"🎯"),
    e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:4}},p.kicker||"Sección compartida"),
    e("div",{style:{fontSize:20,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.15,fontFamily:"Inter,DM Sans"}},p.title),
    p.subtitle?e("div",{style:{fontSize:12.5,color:C.mt,marginTop:5,lineHeight:1.5}},p.subtitle):null
  );
}

// Sub-sección dentro de una enfermedad · Definición / Clínica / Diagnóstico / Tratamiento
// Acordeón: Definición abierta por defecto. Clínica, Dx y Tx colapsadas.
// Todas son colapsables al tocar el header.
function Sub(p){
  var c=p.c||C.anx;
  var icons={def:"📖",cli:"🩺",dx:"📋",tx:"💊"};
  var labels={def:"Definición",cli:"Clínica",dx:"Diagnóstico",tx:"Tratamiento"};
  var key=p.k||"def";
  var defaultOpen=key==="def";
  var s1=useState(defaultOpen);var open=s1[0],setOpen=s1[1];

  function toggle(){setOpen(!open);}

  return e("div",{style:{margin:"8px 0",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:10,overflow:"hidden"}},
    // Header clickeable
    e("button",{onClick:toggle,style:{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"11px 13px",background:open?ax(c,.1):"transparent",border:"none",cursor:"pointer",textAlign:"left",transition:"background .15s"}},
      e("div",{style:{width:30,height:30,borderRadius:8,background:ax(c,.2),border:"1px solid "+ax(c,.35),display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}},icons[key]),
      e("div",{style:{flex:1,fontSize:11,fontWeight:800,color:c,letterSpacing:1.8,textTransform:"uppercase"}},p.t||labels[key]),
      e("div",{style:{fontSize:18,color:c,fontWeight:300,transition:"transform .2s",transform:open?"rotate(90deg)":"rotate(0deg)"}},"›")
    ),
    // Content
    open?e("div",{style:{padding:"2px 14px 14px",animation:"fadeIn .2s"}},p.children):null
  );
}

// Header compacto de enfermedad (inicio de cada entidad)
