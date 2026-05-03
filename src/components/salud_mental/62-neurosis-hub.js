// ══════════════════════════════════════════════════════════════
// HUB NEUROSIS · los 4 temas
// ══════════════════════════════════════════════════════════════

function NeurosisHub(p){
  var temas=[
    {id:"anx",c:C.anx,n:"01",ic:"🫀",t:"Trastornos de ansiedad",d:"9 entidades · Pánico, TAG, Fobias, Agorafobia, Ansiedad por separación, Mutismo selectivo",sub:"Criterios DSM-5-TR · Tratamiento con dosis · Quiz 6 casos"},
    {id:"toc",c:C.toc,n:"02",ic:"🔁",t:"TOC y trastornos relacionados",d:"7 entidades · TOC, TDC, Hoarding, Tricotilomanía, Excoriación",sub:"ISRS a dosis altas · EPR · PANDAS · Quiz 6 casos"},
    {id:"trm",c:C.trm,n:"03",ic:"⚡",t:"Trauma y estrés",d:"6 entidades · TEPT, TEA, Adaptación, Duelo prolongado, Apego reactivo y desinhibido",sub:"4 criterios del TEPT detallados · Prazosina · EMDR · Quiz 6 casos"},
    {id:"som",c:C.som,n:"04",ic:"🧬",t:"Somáticos y disociativos",d:"9 entidades · TSS, IAD, Conversión, Facticio + TID, Amnesia, Despersonalización",sub:"Signo de Hoover · Tabla conversión vs facticio vs simulación · Quiz 6 casos"},
    {id:"tca",c:C.tca,n:"05",ic:"🍽️",t:"Conducta alimentaria",d:"6 entidades · Anorexia, Bulimia, Atracón, ARFID, Pica, Rumiación",sub:"Criterios DSM-5 · Riesgo médico · Fluoxetina en bulimia · Quiz 6 casos"},
    {id:"sue",c:C.sue,n:"06",ic:"🌙",t:"Sueño-vigilia",d:"9 entidades · Insomnio, Narcolepsia, AOS, SPI, Parasomnias, TCSR",sub:"NREM vs REM · CPAP · Cataplejía · Quiz 6 casos"},
    {id:"per",c:C.per,n:"07",ic:"🎭",t:"Trastornos de la personalidad",d:"10 entidades · 3 clusters (A: raros · B: dramáticos · C: ansiosos)",sub:"DBT para TLP · TOCP vs TOC · Quiz 6 casos"},
    {id:"imp",c:C.imp,n:"08",ic:"🎯",t:"Control de impulsos",d:"5 entidades · Negativista, TEI, Conducta, Piromanía, Cleptomanía",sub:"CC <15 → antisocial adulto · PMT · Quiz 6 casos"},
    {id:"dpr",c:C.dpr,n:"09",ic:"💧",t:"Trastornos depresivos",d:"4 entidades · TDM, Distimia, TDPM, TDDD",sub:"SIGECAPS · ISRS 1ª línea · TEC en refractario · Quiz 6 casos"}
  ];
  return e("div",{style:{padding:"16px 14px 90px",maxWidth:640,margin:"0 auto"}},
    e("div",{style:{padding:"22px 20px",background:"linear-gradient(135deg,"+ax(C.anx,.15)+","+C.cd+" 90%)",border:"1px solid "+ax(C.anx,.4),borderRadius:16,marginBottom:20,marginTop:8,animation:"fadeIn .3s"}},
      e("div",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:10}},
        e("div",{style:{fontSize:30}},"🌀"),
        e("div",null,
          e("div",{style:{fontSize:10,fontWeight:800,color:C.anx,letterSpacing:2,textTransform:"uppercase",marginBottom:2}},"60 entidades DSM-5-TR"),
          e("h1",{style:{fontSize:26,fontWeight:900,color:"#fff",letterSpacing:.15,lineHeight:1.1,fontFamily:"Inter,DM Sans"}},"Neurosis")
        )
      ),
      e("div",{className:"prose",style:{fontSize:13.5}},"Grupo clásico de trastornos mentales donde la ",e("b",null,"prueba de realidad está conservada"),". El paciente reconoce que sus síntomas son parte de sí mismo y le generan sufrimiento. En DSM-5-TR ya no se usa el término 'neurosis' formalmente, pero clínicamente sigue siendo útil para agrupar estos 4 capítulos.")
    ),
    temas.map(function(t,i){
      return e("button",{key:t.id,onClick:function(){p.go(t.id);},style:{width:"100%",padding:16,background:"linear-gradient(135deg,"+ax(t.c,.12)+" 0%,"+C.cd+" 85%)",border:"1px solid "+ax(t.c,.35),borderRadius:14,margin:"0 0 12px",cursor:"pointer",textAlign:"left",display:"block",animation:"fadeIn .3s "+(i*.06)+"s both"}},
        e("div",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:10}},
          e("div",{style:{fontSize:26,width:48,height:48,borderRadius:12,background:ax(t.c,.2),border:"1px solid "+ax(t.c,.4),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},t.ic),
          e("div",{style:{flex:1,minWidth:0}},
            e("div",{style:{fontSize:10,fontWeight:800,color:t.c,letterSpacing:1.8,textTransform:"uppercase",marginBottom:2}},"Tema "+t.n),
            e("div",{style:{fontSize:17,fontWeight:800,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Inter,DM Sans"}},t.t)
          ),
          e("div",{style:{fontSize:22,color:t.c,fontWeight:300}},"›")
        ),
        e("div",{style:{fontSize:13,color:C.tx,lineHeight:1.5,marginBottom:5}},t.d),
        e("div",{style:{fontSize:11.5,color:C.mt,lineHeight:1.5,fontStyle:"italic"}},t.sub)
      );
    })
  );
}

