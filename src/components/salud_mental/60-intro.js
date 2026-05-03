
function IntroView(p){
  var c=C.intro;
  // onOpenSection: provided by SM App. Delega el tap de cada tile a la
  // ruta de primer nivel view="section" en lugar de abrir un modal inline.
  var secciones=[
    {id:"oms",ic:"🏥",t:"Definiciones de la OMS",sub:"Salud · Salud mental · Psiquiatría",c:c,
     content:e("div",null,
       e("div",{style:{padding:"16px 18px",background:"linear-gradient(135deg,"+ax(c,.15)+","+C.cd+" 85%)",border:"1px solid "+ax(c,.35),borderLeft:"4px solid "+c,borderRadius:12,marginBottom:14}},
         e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:1.8,textTransform:"uppercase",marginBottom:6}},"🌐 Salud · OMS"),
         e("div",{style:{fontSize:14,color:C.tx,lineHeight:1.6,fontStyle:"italic"}},"Estado de completo bienestar ",e("b",null,"físico, mental y social"),", y no solamente la ausencia de afecciones o enfermedades.")
       ),
       e("div",{style:{padding:"16px 18px",background:"linear-gradient(135deg,"+ax(c,.12)+","+C.cd+" 85%)",border:"1px solid "+ax(c,.12),borderLeft:"4px solid "+c,borderRadius:12,marginBottom:14}},
         e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:1.8,textTransform:"uppercase",marginBottom:6}},"🧠 Salud mental · OMS"),
         e("div",{style:{fontSize:14,color:C.tx,lineHeight:1.6,fontStyle:"italic"}},"Estado de bienestar en el que el individuo es consciente de ",e("b",null,"sus capacidades"),", puede afrontar el ",e("b",null,"estrés"),", puede ",e("b",null,"trabajar de forma productiva")," y ",e("b",null,"contribuir a la comunidad"),".")
       ),
       e("div",{style:{padding:"16px 18px",background:"linear-gradient(135deg,"+ax(c,.1)+","+C.cd+" 85%)",border:"1px solid "+ax(c,.28),borderLeft:"4px solid "+c,borderRadius:12}},
         e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:1.8,textTransform:"uppercase",marginBottom:6}},"⚕️ Psiquiatría · etimología"),
         e("div",{style:{fontSize:13.5,color:C.tx,lineHeight:1.6}},"Del griego ",e("b",null,"psyche")," (mente, alma) + ",e("b",null,"iatreia")," (curación). Ciencia que se dedica al ",e("b",null,"estudio y tratamiento de las enfermedades mentales"),".")
       )
     )},
    {id:"historia",ic:"📜",t:"Historia de la psiquiatría",sub:"De la antigüedad a la actualidad",c:c,
     content:e("div",null,
       e(P,null,"Evolución de la comprensión y tratamiento del sufrimiento mental a lo largo de los siglos."),
       e(Table,{
         headers:[{t:"Época",c:c},{t:"Concepción y abordaje",c:c}],
         rows:[
           ["Antigüedad y Edad Media","Enfermedad mental entendida como posesión demoníaca o castigo divino · reclusión en instituciones · tratamientos rudimentarios"],
           ["Siglo XIX","Surge el concepto de 'enfermedad mental' · la psiquiatría se integra en la medicina · manicomios · 'tratamientos morales' para reinsertar pacientes"],
           ["Siglo XX","Introducción de la psicofarmacología (clorpromazina) · electroshock · lobotomía (controversial)"],
           ["Actualidad","Enfoque integral: evaluación clínica + psicoterapia + fármacos cuando es necesario + factores sociales/ambientales"]
         ]
       }),
       e(Note,{c:c,t:"Hitos históricos"},"La ",e("b",null,"clorpromazina (1952)"),", primer antipsicótico, marcó un antes y un después — permitió el cierre progresivo de los manicomios y la psiquiatría comunitaria. Antes de ella, los pacientes con esquizofrenia o manía solían pasar décadas en asilos.")
     )},
    {id:"trastorno",ic:"🧩",t:"¿Qué es un trastorno mental?",sub:"Definición y características",c:c,
     content:e("div",null,
       e(Def,{c:c},"Afección que impacta el ",e("b",null,"pensamiento, las emociones, el estado de ánimo y el comportamiento")," de una persona. Pueden ser de ",e("b",null,"corta duración o crónicos"),", y afectan la capacidad de la persona para ",e("b",null,"relacionarse con otros y funcionar en la vida diaria"),"."),
       e(H3,{c:c,mt:14},"4 ejes sobre los que actúa"),
       e(SxList,{c:c,items:[
         "Pensamiento (cogniciones, juicio, atención)",
         "Emociones (afecto, regulación)",
         "Estado de ánimo (predominante y sostenido)",
         "Comportamiento (conducta observable)"
       ]}),
       e(Note,{c:c,t:"Criterios transversales"},"Para considerar algo un trastorno mental se requiere: (1) ",e("b",null,"disfunción")," en uno o más de los 4 ejes, (2) ",e("b",null,"malestar")," o ",e("b",null,"deterioro")," en la vida social, laboral u otras áreas, (3) ",e("b",null,"no atribuible")," a efectos de sustancias ni otra afección médica."),
       e(Note,{c:c,t:"Sistemas de clasificación"},"La psiquiatría actual se apoya en dos manuales principales: ",e("b",null,"DSM-5-TR")," (Asociación Psiquiátrica Americana · 2022), de referencia clínica e investigadora; y ",e("b",null,"CIE-11")," (Organización Mundial de la Salud · vigente desde 2022), usado con fines estadísticos y administrativos a nivel mundial. En Latinoamérica la ",e("b",null,"CIE-10")," sigue en uso amplio durante la transición. Los dos manuales comparten la mayoría de las categorías diagnósticas, con pequeñas diferencias de umbral y nomenclatura.")
     )},
    {id:"psi_neu",ic:"⚖️",t:"Psicosis vs Neurosis",sub:"Tabla fundamental · Dra. Justiniano",c:c,
     content:e("div",null,
       e(P,null,"División clínica clásica — aunque el DSM-5 no la usa formalmente, sigue siendo ",e("b",null,"fundamental pedagógicamente")," y es la base de los dos grandes bloques de la materia."),
       e(Table,{
         headers:[{t:"Característica",c:c},{t:"🔺 Psicosis",c:C.psi},{t:"🌀 Neurosis",c:C.anx}],
         rows:[
           ["Contacto con realidad",e("b",{style:{color:C.psi}},"PÉRDIDA")+" del contacto con la realidad",e("b",{style:{color:C.anx}},"NO se desconecta")+" de la realidad"],
           ["Síntomas principales","Alucinaciones · delirios","Ansiedad · depresión · angustia · obsesión"],
           ["Conciencia del problema","El paciente NO suele reconocer su enfermedad","El paciente reconoce su sufrimiento"],
           ["Tratamiento de base","Medicación (antipsicóticos) + terapia","Terapia psicológica predominante ± fármacos"]
         ]
       }),
       e(H3,{c:c,mt:14},"Qué entidades estudiamos en cada bloque"),
       e(Table,{
         headers:[{t:"Bloque",c:c},{t:"Entidades de la materia",c:c}],
         rows:[
           [e("span",{style:{color:C.psi,fontWeight:800}},"🔺 Psicosis y ánimo"),"Espectro esquizofrénico (psicótico breve, esquizofreniforme, esquizofrenia, esquizoafectivo) · trastorno delirante · trastornos bipolares (I, II, ciclotímico) — el episodio depresivo mayor entra como componente del bipolar"],
           [e("span",{style:{color:C.anx,fontWeight:800}},"🌀 Neurosis"),"Ansiedad · TOC · trauma y estrés · somáticos y disociativos · conducta alimentaria · sueño-vigilia · personalidad · control de impulsos · depresivos puros"]
         ]
       }),
       e(Note,{c:c,t:"Por qué importa"},"Cada bloque tiene un ",e("b",null,"enfoque terapéutico distinto"),". Psicosis requiere cobertura farmacológica primero (antipsicóticos, estabilizadores) porque el paciente pierde contacto con la realidad. Neurosis privilegia psicoterapia — el paciente está consciente y puede trabajar sobre sus síntomas.")
     )},
    {id:"causas",ic:"🔬",t:"Causas de los trastornos mentales",sub:"3 factores: biológico · psicológico · social",c:c,
     content:e("div",null,
       e(P,null,"Los trastornos mentales son ",e("b",null,"multicausales"),". Ningún factor por sí solo los explica. Se combinan factores de los 3 dominios siguientes:"),
       e("div",{style:{display:"grid",gridTemplateColumns:"1fr",gap:10,marginTop:14}},
         e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(C.psi,.1)+","+C.cd+" 85%)",border:"1px solid "+ax(C.psi,.3),borderLeft:"4px solid "+C.psi,borderRadius:10}},
           e("div",{style:{fontSize:10.5,fontWeight:800,color:C.psi,letterSpacing:1.6,textTransform:"uppercase",marginBottom:6}},"1 · Factor biológico"),
           e(SxList,{c:C.psi,items:[
             "Genética (historia familiar, heredabilidad)",
             "Química cerebral (neurotransmisores: dopamina, serotonina, GABA, glutamato)",
             "Estructura cerebral (atrofia, crecimiento ventricular en esquizofrenia, etc.)"
           ]})
         ),
         e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(C.anx,.1)+","+C.cd+" 85%)",border:"1px solid "+ax(C.anx,.3),borderLeft:"4px solid "+C.anx,borderRadius:10}},
           e("div",{style:{fontSize:10.5,fontWeight:800,color:C.anx,letterSpacing:1.6,textTransform:"uppercase",marginBottom:6}},"2 · Factor psicológico"),
           e(SxList,{c:C.anx,items:[
             "Experiencias vitales (trauma, duelo, abuso)",
             "Relaciones interpersonales (apego, familia, pareja)",
             "Habilidades emocionales (regulación, afrontamiento)"
           ]})
         ),
         e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(C.som,.1)+","+C.cd+" 85%)",border:"1px solid "+ax(C.som,.3),borderLeft:"4px solid "+C.som,borderRadius:10}},
           e("div",{style:{fontSize:10.5,fontWeight:800,color:C.som,letterSpacing:1.6,textTransform:"uppercase",marginBottom:6}},"3 · Factor social"),
           e(SxList,{c:C.som,items:[
             "Pobreza y acceso limitado a recursos",
             "Desigualdad y exclusión social",
             "Estigma (impide consultar y genera aislamiento)"
           ]})
         )
       ),
       e(Note,{c:c,t:"Modelo biopsicosocial"},"Este es el enfoque que predomina en la psiquiatría actual. Ningún trastorno mental se entiende adecuadamente mirando solo uno de los 3 factores — siempre se evalúan los tres al planificar tratamiento.")
     )},
    {id:"tratamiento",ic:"💊",t:"Los 3 pilares del tratamiento",sub:"Psicoterapia · Farmacología · Somático",c:c,
     content:e("div",null,
       e(P,null,"Todo trastorno mental se aborda con una combinación de las siguientes modalidades, ajustada al cuadro específico."),
       e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(C.anx,.1)+","+C.cd+" 85%)",border:"1px solid "+ax(C.anx,.3),borderLeft:"4px solid "+C.anx,borderRadius:10,marginBottom:10}},
         e("div",{style:{fontSize:10.5,fontWeight:800,color:C.anx,letterSpacing:1.6,textTransform:"uppercase",marginBottom:6}},"1 · Psicoterapia"),
         e(Table,{
           headers:[{t:"Modalidad",c:C.anx},{t:"Para qué es útil",c:C.anx}],
           rows:[
             ["Cognitivo-conductual (TCC)","1ª línea en ansiedad, depresión, TOC, TEPT, TCA"],
             ["Sistémica","Problemas familiares/pareja · trastornos de conducta en menores"],
             ["Racional emotiva","Creencias irracionales · ansiedad · depresión leve-moderada"],
             ["Centrada en soluciones","Cuadros agudos · duelo · adaptación · enfocada en el presente"]
           ]
         })
       ),
       e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(C.psi,.1)+","+C.cd+" 85%)",border:"1px solid "+ax(C.psi,.3),borderLeft:"4px solid "+C.psi,borderRadius:10,marginBottom:10}},
         e("div",{style:{fontSize:10.5,fontWeight:800,color:C.psi,letterSpacing:1.6,textTransform:"uppercase",marginBottom:6}},"2 · Farmacológico · las 4 grandes familias"),
         e(Table,{
           headers:[{t:"Familia",c:C.psi},{t:"Para qué",c:C.psi},{t:"Ejemplos",c:C.psi}],
           rows:[
             ["Antidepresivos","Depresión · ansiedad · TOC · TCA","ISRS (sertralina, fluoxetina) · IRSN (venlafaxina, duloxetina)"],
             ["Ansiolíticos","Ansiedad aguda · insomnio","BZD (alprazolam, clonazepam) — uso corto"],
             ["Antipsicóticos","Psicosis · manía · agitación","Típicos (haloperidol) · atípicos (risperidona, olanzapina, clozapina)"],
             ["Estabilizadores del ánimo","Bipolar · esquizoafectivo","Litio · valproato · carbamazepina · lamotrigina"]
           ]
         })
       ),
       e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(C.trm,.1)+","+C.cd+" 85%)",border:"1px solid "+ax(C.trm,.3),borderLeft:"4px solid "+C.trm,borderRadius:10}},
         e("div",{style:{fontSize:10.5,fontWeight:800,color:C.trm,letterSpacing:1.6,textTransform:"uppercase",marginBottom:6}},"3 · Tratamientos somáticos"),
         e(Table,{
           headers:[{t:"Técnica",c:C.trm},{t:"Indicaciones clave",c:C.trm}],
           rows:[
             ["ECT (terapia electroconvulsiva)","Depresión refractaria · depresión psicótica · catatonia · riesgo suicida agudo · embarazo"],
             ["EMT (estimulación magnética transcraneal)","Depresión refractaria · alternativa a ECT sin anestesia"],
             ["Ketamina / esketamina","Depresión refractaria · respuesta rápida en horas-días · suicidalidad aguda"],
             ["Fototerapia","Depresión estacional"]
           ]
         })
       ),
       e(Alert,{c:C.ok,label:"🔑 Principio terapéutico"},"Siempre ",e("b",null,"enfoque integral"),": combinar psicoterapia + farmacoterapia cuando sea necesario + intervención social (familia, red de apoyo, recursos). La monoterapia raramente es suficiente en cuadros moderados-severos.")
     )},
    {id:"preliminar",ic:"🗺️",t:"Cómo usar este módulo",sub:"Guía rápida de navegación",c:c,
     content:e("div",null,
       e(P,null,"Bienvenido a Salud Mental. Este módulo organiza toda la materia en ",e("b",null,"2 grandes bloques")," con el mismo formato visual:"),
       e("div",{style:{display:"flex",gap:10,marginTop:14,flexWrap:"wrap"}},
         e("div",{style:{flex:1,minWidth:200,padding:"14px",background:"linear-gradient(135deg,"+ax(C.psi,.12)+","+C.cd+" 85%)",border:"1px solid "+ax(C.psi,.35),borderRadius:12}},
           e("div",{style:{fontSize:22,marginBottom:4}},"🔺"),
           e("div",{style:{fontSize:14,fontWeight:800,color:C.psi,marginBottom:4}},"Psicosis y ánimo"),
           e("div",{style:{fontSize:12,color:C.tx,lineHeight:1.5}},"8 enfermedades · espectro esquizofrénico + delirante + bipolares. La depresión mayor aparece como componente interno del bipolar.")
         ),
         e("div",{style:{flex:1,minWidth:200,padding:"14px",background:"linear-gradient(135deg,"+ax(C.anx,.12)+","+C.cd+" 85%)",border:"1px solid "+ax(C.anx,.35),borderRadius:12}},
           e("div",{style:{fontSize:22,marginBottom:4}},"🌀"),
           e("div",{style:{fontSize:14,fontWeight:800,color:C.anx,marginBottom:4}},"Neurosis"),
           e("div",{style:{fontSize:12,color:C.tx,lineHeight:1.5}},"9 temas · 60 enfermedades · ansiedad, TOC, trauma, somáticos, TCA, sueño, personalidad, impulsos, depresivos puros.")
         )
       ),
       e(H3,{c:c,mt:18},"Cómo está organizada cada enfermedad"),
       e(SxList,{c:c,items:[
         "📖 Definición · concepto claro y rápido",
         "🩺 Clínica · síntomas, epidemiología, subtipos",
         "📋 Diagnóstico · criterios DSM-5 con tus letras",
         "💊 Tratamiento · 1ª línea, dosis, trampas de examen"
       ]}),
       e(H3,{c:c,mt:14},"Herramientas de estudio"),
       e(SxList,{c:c,items:[
         "🃏 Flashcards — puedes añadir las tuyas y se guardan en tu dispositivo",
         "❓ Quiz — casos clínicos con explicación",
         "🔍 Filtros globales — estudia solo el tema que necesites, o combínalos",
         "📋 Modo lista — ver todas las preguntas o flashcards de corrido"
       ]}),
       e(Alert,{c:c,label:"💡 Recomendación"},"Empieza por este Tema 0 para tener el marco conceptual. Luego elige el bloque que vas a estudiar (Psicosis o Neurosis). Usa las flashcards y quiz globales al final para repasar.")
     )}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Tema 0 · Salud Mental",title:"Introducción a la psiquiatría"},
      "Marco conceptual común a toda la materia. Definiciones de la OMS, historia, qué es un trastorno mental, la división clínica ",e("b",null,"psicosis vs neurosis"),", causas multicausales y los 3 pilares del tratamiento. Toca cada tarjeta para profundizar."
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.12),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Inter,DM Sans"}},"Conceptos fundamentales"),
      e("div",{style:{fontSize:12,color:C.mt,marginTop:4,lineHeight:1.45}},"OMS · Historia · Psicosis vs Neurosis · Causas · Tratamientos · Navegación")
    ),
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginTop:10}},
      secciones.map(function(g,i){
        return e("button",{key:g.id,onClick:function(){if(p&&p.onOpenSection)p.onOpenSection(g);},style:{padding:"14px 12px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:10,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:4,minHeight:100}},
          e("div",{style:{fontSize:22,marginBottom:4}},g.ic),
          e("div",{style:{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Inter,DM Sans"}},g.t),
          e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.4,marginTop:2}},g.sub)
        );
      })
    ),

    e(Abbrev,{c:c,items:[
      {a:"OMS",d:"Organización Mundial de la Salud"},
      {a:"DSM-5",d:"Manual Diagnóstico y Estadístico, 5ª edición (APA)"},
      {a:"TCC",d:"Terapia Cognitivo-Conductual"},
      {a:"ECT",d:"Terapia Electroconvulsiva"},
      {a:"EMT",d:"Estimulación Magnética Transcraneal"},
      {a:"BZD",d:"Benzodiacepinas"},
      {a:"ISRS",d:"Inhibidores Selectivos de la Recaptación de Serotonina"},
      {a:"IRSN",d:"Inhibidores de la Recaptación de Serotonina y Noradrenalina"},
      {a:"TDM",d:"Trastorno Depresivo Mayor"}
    ]})
  );
}

