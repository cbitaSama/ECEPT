function DzCard(p){
  var c=p.c||C.anx;
  return e("div",{style:{margin:"22px 0 8px",padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.22)+","+ax(c,.06)+" 80%)",border:"1px solid "+ax(c,.45),borderRadius:12,display:"flex",alignItems:"center",gap:12}},
    p.n?e("div",{style:{width:40,height:40,borderRadius:10,background:ax(c,.25),color:c,fontSize:16,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"Playfair Display",border:"1px solid "+ax(c,.4)}},p.n):null,
    e("div",{style:{flex:1,minWidth:0}},
      p.kicker?e("div",{style:{fontSize:10,fontWeight:800,color:c,letterSpacing:1.5,textTransform:"uppercase",marginBottom:1,opacity:.85}},p.kicker):null,
      e("div",{style:{fontSize:18,fontWeight:800,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},p.name)
    )
  );
}

// Pantalla inline de una enfermedad · usa tabs internos.
// Originalmente era un modal full-viewport (position:fixed) porque el
// artefacto standalone tenía scroll propio. Dentro de ECEPT esa estrategia
// peleaba con el contenedor de scroll del host en iPad Safari: el contenido
// se renderizaba pero no podía desplazarse ni los tabs tocarse. Ahora es
// una vista inline en el flujo normal del documento; el header queda sticky
// debajo del top bar de ECEPT (top:62) para que "← Cerrar" y las pestañas
// sigan accesibles mientras el usuario scrollea el contenido.
function DzModal(p){
  var c=p.c||C.anx;
  var isSingle=!!p.single;
  var s1=useState("def");var tab=s1[0],setTab=s1[1];
  var tabs=[
    {k:"def",l:"Definición",ic:"📖"},
    {k:"cli",l:"Clínica",ic:"🩺"},
    {k:"dx",l:"Diagnóstico",ic:"📋"},
    {k:"tx",l:"Tratamiento",ic:"💊"}
  ];
  // Al abrir, saltar al tope de la página para que el usuario aterrice en el
  // header de la enfermedad (no en medio de donde estaba el grid).
  useEffect(function(){
    window.scrollTo({top:0,behavior:"instant"});
  },[]);
  return e("div",{style:{background:C.bg,animation:"fadeIn .2s"}},
    // Header sticky debajo del top bar de ECEPT (top:62) con "← Cerrar" + tabs.
    e("div",{style:{position:"sticky",top:62,zIndex:10,background:"rgba(6,10,20,.94)",backdropFilter:"blur(12px)",borderBottom:"1px solid "+C.bd,padding:"10px 14px"}},
      e("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:isSingle?0:10}},
        e("button",{onClick:p.onClose,style:{padding:"8px 12px",background:ax(c,.15),border:"1px solid "+ax(c,.35),color:c,borderRadius:8,fontSize:12.5,fontWeight:700,cursor:"pointer"}},"← Cerrar"),
        e("div",{style:{flex:1,minWidth:0}},
          e("div",{style:{fontSize:9.5,fontWeight:800,color:c,letterSpacing:1.8,textTransform:"uppercase",marginBottom:1,opacity:.85}},p.kicker||"Enfermedad"),
          e("div",{style:{fontSize:15,fontWeight:800,color:"#fff",lineHeight:1.2,fontFamily:"Playfair Display",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},p.name)
        )
      ),
      // Tabs (solo si no es single)
      isSingle?null:e("div",{style:{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}},
        tabs.map(function(t){
          var active=tab===t.k;
          return e("button",{key:t.k,onClick:function(){setTab(t.k);window.scrollTo({top:0,behavior:"instant"});},style:{padding:"7px 12px",background:active?c:ax(c,.1),border:"1px solid "+(active?c:ax(c,.3)),color:active?"#fff":c,borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap",flexShrink:0}},
            e("span",null,t.ic),
            e("span",null,t.l)
          );
        })
      )
    ),
    // Content
    e("div",{style:{padding:"14px 14px 40px",maxWidth:720,margin:"0 auto",animation:"fadeIn .2s"}},
      isSingle?p.single:(p.sections&&p.sections[tab]?p.sections[tab]:e(P,null,"(sin contenido)"))
    )
  );
}

// Grid de tarjetas de enfermedades. Al abrir una, reemplaza el grid con la
// vista de enfermedad inline (en lugar de overlay), matching ECEPT's "one
// route at a time" pattern (reuma_dis).
function DzGrid(p){
  var c=p.c||C.anx;
  var s1=useState(null);var open=s1[0],setOpen=s1[1];
  if(open!==null){
    var it=p.items[open];
    return e(DzModal,{c:c,name:it.name,kicker:it.kicker||"Enfermedad",sections:it.sections,onClose:function(){setOpen(null);}});
  }
  return e("div",null,
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10,margin:"14px 0 10px"}},
      p.items.map(function(it,i){
        return e("button",{key:i,onClick:function(){setOpen(i);},style:{padding:"14px 12px",background:"linear-gradient(135deg,"+ax(c,.15)+","+ax(c,.04)+" 85%)",border:"1px solid "+ax(c,.35),borderRadius:12,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:4,minHeight:110,transition:"transform .15s"}},
          e("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:5}},
            e("div",{style:{minWidth:28,height:28,borderRadius:7,background:ax(c,.25),color:c,fontSize:13,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Playfair Display",border:"1px solid "+ax(c,.4)}},it.n),
            e("div",{style:{fontSize:9,fontWeight:800,color:c,letterSpacing:1.3,textTransform:"uppercase"}},it.kicker||"Enfermedad")
          ),
          e("div",{style:{fontSize:13.5,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Playfair Display",flex:1}},it.name),
          it.blurb?e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.35,marginTop:3}},it.blurb):null,
          e("div",{style:{fontSize:10.5,fontWeight:700,color:c,marginTop:4,opacity:.8}},"Ver ficha →")
        );
      })
    )
  );
}
