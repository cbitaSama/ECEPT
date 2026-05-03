function DzCard(p){
  var c=p.c||C.anx;
  return e("div",{style:{margin:"22px 0 8px",padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.22)+","+ax(c,.06)+" 80%)",border:"1px solid "+ax(c,.45),borderRadius:12,display:"flex",alignItems:"center",gap:12}},
    p.n?e("div",{style:{width:40,height:40,borderRadius:10,background:ax(c,.25),color:c,fontSize:16,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"Inter,DM Sans",border:"1px solid "+ax(c,.14)}},p.n):null,
    e("div",{style:{flex:1,minWidth:0}},
      p.kicker?e("div",{style:{fontSize:10,fontWeight:800,color:c,letterSpacing:1.5,textTransform:"uppercase",marginBottom:1,opacity:.85}},p.kicker):null,
      e("div",{style:{fontSize:18,fontWeight:800,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Inter,DM Sans"}},p.name)
    )
  );
}

// Grid de tarjetas de enfermedades. El host (SM App) provee onOpen; al tocar
// una tarjeta delegamos — la App promueve la enfermedad a ruta de primer
// nivel (view="disease") y la vista del hub es reemplazada por DzDetail.
// Mismo patrón que reuma_dis en ECEPT: una sola vista activa a la vez, sin
// acordeón ni modal anidado, sin botón "Cerrar".
function DzGrid(p){
  var c=p.c||C.anx;
  return e("div",null,
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10,margin:"14px 0 10px"}},
      p.items.map(function(it,i){
        return e("button",{key:i,onClick:function(){if(p&&p.onOpen)p.onOpen(it);},style:{padding:"14px 12px",background:"linear-gradient(135deg,"+ax(c,.15)+","+ax(c,.04)+" 85%)",border:"1px solid "+ax(c,.35),borderRadius:12,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:4,minHeight:110,transition:"transform .15s"}},
          e("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:5}},
            e("div",{style:{minWidth:28,height:28,borderRadius:7,background:ax(c,.25),color:c,fontSize:13,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Inter,DM Sans",border:"1px solid "+ax(c,.14)}},it.n),
            e("div",{style:{fontSize:9,fontWeight:800,color:c,letterSpacing:1.3,textTransform:"uppercase"}},it.kicker||"Enfermedad")
          ),
          e("div",{style:{fontSize:13.5,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Inter,DM Sans",flex:1}},it.name),
          it.blurb?e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.35,marginTop:3}},it.blurb):null,
          e("div",{style:{fontSize:10.5,fontWeight:700,color:c,marginTop:4,opacity:.8}},"Ver ficha →")
        );
      })
    )
  );
}

// Vista inline de una "sección general" de un hub (perlas, resumen,
// flashcards, quiz, conceptos del tema 0, etc.) — ruta de primer nivel
// en SM. Sin tabs (el contenido es un bloque único) y sin botón "Cerrar":
// volver al hub es responsabilidad del FAB ← de ECEPT vía smBackRef.
function DzSectionView(p){
  var c=p.c||C.anx;
  useEffect(function(){
    window.scrollTo({top:0,behavior:"instant"});
  },[p.name]);
  return e("div",{style:{background:C.bg,animation:"fadeIn .2s"}},
    e("div",{style:{position:"sticky",top:62,zIndex:10,background:"rgba(6,10,20,.94)",backdropFilter:"blur(12px)",borderBottom:"1px solid "+C.bd,padding:"10px 14px"}},
      e("div",{style:{fontSize:9.5,fontWeight:800,color:c,letterSpacing:1.8,textTransform:"uppercase",marginBottom:1,opacity:.85}},p.kicker||"Sección del tema"),
      e("div",{style:{fontSize:15,fontWeight:800,color:"#fff",lineHeight:1.2,fontFamily:"Inter,DM Sans"}},p.name)
    ),
    e("div",{style:{padding:"14px 14px 40px",maxWidth:1200,margin:"0 auto",animation:"fadeIn .2s"}},
      p.content
    )
  );
}

// Vista inline de enfermedad — renderizada por SM App cuando view="disease".
// Es una "página" completa dentro del flujo de ECEPT: el hub que la lanzó
// queda fuera del árbol y sólo queda DzDetail visible, con el chrome de
// ECEPT (top bar + breadcrumb + FAB ←) como única navegación. NO tiene
// botón "Cerrar": volver al hub es responsabilidad del FAB ← que invoca
// smBackRef → popStack → vista anterior.
function DzDetail(p){
  var c=p.c||C.anx;
  var s1=useState("def");var tab=s1[0],setTab=s1[1];
  var tabs=[
    {k:"def",l:"Definición",ic:"📖"},
    {k:"cli",l:"Clínica",ic:"🩺"},
    {k:"dx",l:"Diagnóstico",ic:"📋"},
    {k:"tx",l:"Tratamiento",ic:"💊"}
  ];
  useEffect(function(){
    window.scrollTo({top:0,behavior:"instant"});
  },[p.name]);
  return e("div",{style:{background:C.bg,animation:"fadeIn .2s"}},
    // Header sticky con nombre de enfermedad + tabs (sin botón Cerrar).
    e("div",{style:{position:"sticky",top:62,zIndex:10,background:"rgba(6,10,20,.94)",backdropFilter:"blur(12px)",borderBottom:"1px solid "+C.bd,padding:"10px 14px"}},
      e("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:10}},
        e("div",{style:{flex:1,minWidth:0}},
          e("div",{style:{fontSize:9.5,fontWeight:800,color:c,letterSpacing:1.8,textTransform:"uppercase",marginBottom:1,opacity:.85}},p.kicker||"Enfermedad"),
          e("div",{style:{fontSize:15,fontWeight:800,color:"#fff",lineHeight:1.2,fontFamily:"Inter,DM Sans"}},p.name)
        )
      ),
      e("div",{style:{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}},
        tabs.map(function(t){
          var active=tab===t.k;
          return e("button",{key:t.k,onClick:function(){setTab(t.k);window.scrollTo({top:0,behavior:"instant"});},style:{padding:"7px 12px",background:active?c:ax(c,.1),border:"1px solid "+(active?c:ax(c,.12)),color:active?"#fff":c,borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap",flexShrink:0}},
            e("span",null,t.ic),
            e("span",null,t.l)
          );
        })
      )
    ),
    e("div",{style:{padding:"14px 14px 40px",maxWidth:1200,margin:"0 auto",animation:"fadeIn .2s"}},
      p.sections&&p.sections[tab]?p.sections[tab]:e(P,null,"(sin contenido)")
    )
  );
}
