
function RootHub(p){
  var COLOR_PSI="#ef4444";
  var COLOR_NEU=C.anx;
  var ramas=[
    {id:"intro",c:C.intro,ic:"📘",t:"Psiquiatría",n:"00",d:"Introducción común a toda la materia. Definiciones, historia, psicosis vs neurosis, causas, tratamientos.",sub:"7 secciones conceptuales · base para ambos bloques",count:"introducción"},
    {id:"psicosis",c:COLOR_PSI,ic:"🔺",t:"Psicosis y ánimo",n:"01",d:"Trastornos con prueba de realidad ALTERADA. Delirios, alucinaciones, cuadros afectivos graves.",sub:"Espectro esquizofrénico · Delirante · Bipolares (con depresión mayor como componente)",count:"8 enfermedades"},
    {id:"neurosis",c:COLOR_NEU,ic:"🌀",t:"Neurosis",n:"02",d:"Trastornos con prueba de realidad CONSERVADA. El paciente sabe que algo está mal.",sub:"9 temas completos",count:"60 enfermedades"}
  ];
  // Sin header local (ni logo, ni título, ni buscador interno): el cromo
  // de ECEPT (top bar + breadcrumb) provee la identidad y navegación.
  // La búsqueda global de ECEPT ya indexa SM vía SM_SEARCH_INDEX.
  return e("div",{style:{padding:"16px 14px 90px",maxWidth:640,margin:"0 auto"}},
    e("div",{style:{padding:"13px 15px",background:C.cd,border:"1px solid "+C.bd,borderRadius:12,marginBottom:16,fontSize:12.5,lineHeight:1.6,color:C.mt}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:C.pearl,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}},"🔑 Regla clínica clave"),
      "La ",e("b",{style:{color:"#fff"}},"prueba de realidad")," divide ambos grupos: si el paciente reconoce que sus síntomas son internos y patológicos → ",e("b",{style:{color:"#fff"}},"neurosis"),". Si cree que son reales y externos → ",e("b",{style:{color:"#fff"}},"psicosis"),"."
    ),
    ramas.map(function(r,i){
      return e("button",{key:r.id,onClick:function(){p.go(r.id);},style:{width:"100%",padding:18,background:"linear-gradient(135deg,"+ax(r.c,.15)+" 0%,"+C.cd+" 85%)",border:"1px solid "+ax(r.c,.4),borderRadius:16,margin:"0 0 14px",cursor:"pointer",textAlign:"left",display:"block",animation:"fadeIn .3s "+(i*.08)+"s both"}},
        e("div",{style:{display:"flex",alignItems:"center",gap:14,marginBottom:12}},
          e("div",{style:{fontSize:30,width:56,height:56,borderRadius:14,background:ax(r.c,.22),border:"1px solid "+ax(r.c,.45),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},r.ic),
          e("div",{style:{flex:1,minWidth:0}},
            e("div",{style:{fontSize:10,fontWeight:800,color:r.c,letterSpacing:1.8,textTransform:"uppercase",marginBottom:2}},r.count),
            e("div",{style:{fontSize:22,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.15,fontFamily:"Playfair Display"}},r.t)
          ),
          e("div",{style:{fontSize:24,color:r.c,fontWeight:300}},"›")
        ),
        e("div",{style:{fontSize:13.5,color:C.tx,lineHeight:1.55,marginBottom:6}},r.d),
        e("div",{style:{fontSize:11.5,color:C.mt,lineHeight:1.5,fontStyle:"italic"}},r.sub)
      );
    }),

    // === REPASO GLOBAL DE TODO SALUD MENTAL ===
    e("div",{style:{padding:"13px 15px",background:"linear-gradient(135deg,"+ax(C.pearl,.12)+","+ax(C.pearl,.02)+" 90%)",border:"1px solid "+ax(C.pearl,.35),borderRadius:14,margin:"8px 0 12px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:C.pearl,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Repaso combinado"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Toda Salud Mental II"),
      e("div",{style:{fontSize:12,color:C.mt,marginTop:4,lineHeight:1.45}},"Psicosis + Neurosis · filtra por tema, busca, añade las tuyas")
    ),
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:10,marginBottom:18}},
      e("button",{onClick:function(){p.go("flash-all");},style:{padding:"16px 14px",background:"linear-gradient(135deg,"+ax(C.pearl,.18)+","+C.cd+" 90%)",border:"1px solid "+ax(C.pearl,.4),borderLeft:"4px solid "+C.pearl,borderRadius:12,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:5,minHeight:95}},
        e("div",{style:{fontSize:22,marginBottom:3}},"🃏"),
        e("div",{style:{fontSize:13.5,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Playfair Display"}},"Flashcards globales"),
        e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.4}},"Todas las flashcards oficiales + las tuyas, filtros por tema")
      ),
      e("button",{onClick:function(){p.go("quiz-all");},style:{padding:"16px 14px",background:"linear-gradient(135deg,"+ax(C.pearl,.18)+","+C.cd+" 90%)",border:"1px solid "+ax(C.pearl,.4),borderLeft:"4px solid "+C.pearl,borderRadius:12,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:5,minHeight:95}},
        e("div",{style:{fontSize:22,marginBottom:3}},"❓"),
        e("div",{style:{fontSize:13.5,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Playfair Display"}},"Quiz global"),
        e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.4}},"Todos los casos clínicos · modo tarjeta o lista")
      )
    ),

    e("div",{style:{textAlign:"center",padding:"22px 0 0",fontSize:11,color:C.dm,lineHeight:1.7}},
      e("div",{style:{fontSize:18,marginBottom:5}},"📚"),
      e("div",null,"DSM-5-TR (2022) · ECEPT · Sebas · 2025")
    )
  );
}

