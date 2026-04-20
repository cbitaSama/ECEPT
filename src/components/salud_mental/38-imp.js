// ══════════════════════════════════════════════════════════════
// TEMA 8 · TRASTORNOS DISRUPTIVOS, DEL CONTROL DE IMPULSOS Y DE LA CONDUCTA
// ══════════════════════════════════════════════════════════════

function ImpView(){
  var c=C.imp;
  var diseases=[
    {
      n:"01",name:"Trastorno negativista desafiante",c:c,
      blurb:"Niños · patrón enfadado/desafiante/vengativo · ≥6 meses",
      sections:{
        def:e(Def,{c:c},"Patrón de ",e("b",null,"enfado/irritabilidad"),", ",e("b",null,"actitud discutidora/desafiante")," o ",e("b",null,"vengatividad")," que dura ",e("b",null,"≥6 meses"),". Frecuente precursor del trastorno de la conducta en algunos niños."),
        cli:e("div",null,
          e(H3,{c:c},"Criterios · ≥4 síntomas de 3 categorías"),
          e(Table,{
            headers:[{t:"Categoría",c:c},{t:"Síntomas",c:c}],
            rows:[
              ["Enfado / irritabilidad","A menudo pierde la calma · susceptible y se molesta con facilidad · enfadado y resentido"],
              ["Actitud discutidora / desafiante","Discute con figuras de autoridad · desafía activamente o rechaza cumplir reglas · molesta deliberadamente a otros · acusa a otros de sus errores"],
              ["Vengatividad","Rencoroso o vengativo (al menos 2 veces en los últimos 6 meses)"]
            ]
          }),
          e(Note,{c:c,t:"Frecuencia y edad"},"En niños <5 años: síntomas casi todos los días durante ≥6 meses. En ≥5 años: al menos 1 vez/semana durante ≥6 meses. Los síntomas deben ser desproporcionados al nivel de desarrollo.")
        ),
        dx:e(CritBlock,{title:"Negativista desafiante (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Patrón de enfado/irritabilidad, actitud discutidora/desafiante o vengatividad durante ≥6 meses, con ≥4 síntomas de las 3 categorías."),
          e(Crit,{crit:"B",c:c},"Los síntomas causan malestar en el individuo u otros o tienen impacto negativo social, educativo, laboral u otras áreas."),
          e(Crit,{crit:"C",c:c},"Los síntomas NO aparecen exclusivamente en el curso de un trastorno psicótico, por uso de sustancias, depresivo o bipolar. Tampoco se cumplen los criterios de trastorno de desregulación disruptiva del ánimo.")
        ),
        tx:e(P,null,e("b",null,"Terapia conductual con padres")," (Parent Management Training, PMT) — 1ª línea. Terapia familiar. TCC en niños mayores. Manejo de comorbilidades (TDAH es muy frecuente — estimulantes pueden mejorar ambos cuadros).")
      }
    },
    {
      n:"02",name:"Trastorno explosivo intermitente (TEI)",c:c,
      blurb:"Arrebatos agresivos recurrentes desproporcionados",
      sections:{
        def:e(Def,{c:c},"Arrebatos recurrentes que reflejan una ",e("b",null,"falta de control de los impulsos agresivos"),". Los arrebatos son impulsivos o basados en la ira (no premeditados para obtener algo tangible)."),
        cli:e("div",null,
          e(H3,{c:c},"Los 2 patrones (cumplir UNO)"),
          e(Table,{
            headers:[{t:"Patrón",c:c},{t:"Criterio",c:c}],
            rows:[
              ["A1 · Frecuentes y de baja intensidad","Agresiones verbales (rabietas, riñas, discusiones) o física sin daño, a personas/animales/propiedad, ≥2 veces/semana durante ≥3 meses"],
              ["A2 · Infrecuentes y de alta intensidad","≥3 arrebatos con daño/destrucción a propiedad o agresión física con lesión, en los últimos 12 meses"]
            ]
          }),
          e(Note,{c:c,t:"Criterios adicionales"},"B: Magnitud desproporcionada a la provocación. C: No premeditados ni con objetivo tangible. D: Malestar o deterioro. E: Edad ≥6 años. F: No explicado mejor por otro trastorno ni por sustancia/afección médica.")
        ),
        dx:e(P,null,"Al menos un patrón A cumplido + criterios B–F."),
        tx:e("div",null,
          e(SxList,{c:c,items:[
            "TCC con manejo de la ira (1ª línea)",
            "ISRS (fluoxetina tiene mejor evidencia)",
            "Estabilizadores del ánimo (valproato, litio)",
            "Antipsicóticos atípicos en casos graves",
            "Relajación + reestructuración cognitiva"
          ]})
        )
      }
    },
    {
      n:"03",name:"Trastorno de conducta (CC)",c:c,
      blurb:"Menores · transgresión grave de derechos/normas · ≥12 meses",
      sections:{
        def:e(Def,{c:c},"Patrón repetitivo y persistente de comportamiento en el que NO se respetan los derechos básicos de otros ni las normas sociales apropiadas a la edad. Precursor del trastorno antisocial de personalidad cuando persiste en la adultez."),
        cli:e("div",null,
          e(H3,{c:c},"Las 4 categorías · ≥3 síntomas en últimos 12 meses (≥1 en últimos 6)"),
          e(Table,{
            headers:[{t:"Categoría",c:c},{t:"Ejemplos",c:c}],
            rows:[
              ["Agresión a personas/animales","Intimidar, pelear, usar armas, crueldad con personas o animales, robo con confrontación, violación"],
              ["Destrucción de la propiedad","Provocar incendios · destruir propiedad"],
              ["Engaño o robo","Entrar en casa/edificio ajeno, mentir, robar sin confrontación (hurtos en tiendas)"],
              ["Violaciones graves de las normas","Salir por la noche (antes de los 13), escaparse de casa, ausentismo escolar (antes de los 13)"]
            ]
          }),
          e(H3,{c:c,mt:14},"Especificadores clave"),
          e(SxList,{c:c,items:[
            "Tipo de inicio: infantil (≥1 síntoma antes de los 10 años, peor pronóstico) o adolescente",
            "Con emociones prosociales limitadas (rasgos 'callous-unemotional' → mayor riesgo de antisocial adulto)",
            "Gravedad: leve · moderado · grave"
          ]})
        ),
        dx:e(CritBlock,{title:"Trastorno de la conducta (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Patrón ≥3 síntomas de las 4 categorías en últimos 12 meses, con ≥1 en últimos 6 meses."),
          e(Crit,{crit:"B",c:c},"Causa deterioro clínicamente significativo en lo social, académico o laboral."),
          e(Crit,{crit:"C",c:c},"Si ≥18 años, no se cumplen criterios de trastorno antisocial de personalidad.")
        ),
        tx:e(P,null,"Multimodal: terapia familiar (parent management training), terapia multisistémica, TCC individual. Manejo de comorbilidades (TDAH, sustancias, depresión). Cuando hay síntomas severos, contener y manejar impulsividad con antipsicóticos atípicos o estabilizadores.")
      }
    },
    {
      n:"04",name:"Piromanía",c:c,
      blurb:"Provocación deliberada de incendios con fascinación",
      sections:{
        def:e(Def,{c:c},"Provocación ",e("b",null,"deliberada e intencional")," de incendios en ",e("b",null,"más de una ocasión"),", con ",e("b",null,"tensión previa")," y ",e("b",null,"fascinación/atracción/curiosidad")," por el fuego y lo relacionado, y ",e("b",null,"placer/alivio")," al encenderlo o atestiguarlo."),
        cli:e("div",null,
          e(P,null,"Raro como dx primario; mucho más frecuente en contexto de otros trastornos (antisocial, intoxicación, esquizofrenia, discapacidad intelectual)."),
          e(Pearl,{t:"Ojo: NO es piromanía si…"},"1) El incendio tiene motivación económica, venganza, ideología política, ocultar otro delito, o mejorar circunstancias. 2) Ocurre en respuesta a delirios/alucinaciones. 3) Es producto de alteración del juicio (demencia, intoxicación). 4) Es manifestación de trastorno de la conducta o antisocial.")
        ),
        dx:e(CritBlock,{title:"Piromanía (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Provocación deliberada e intencional de incendios en más de una ocasión."),
          e(Crit,{crit:"B",c:c},"Tensión o excitación afectiva antes del acto."),
          e(Crit,{crit:"C",c:c},"Fascinación, interés, curiosidad o atracción por el fuego y las situaciones asociadas (materiales, usos, consecuencias)."),
          e(Crit,{crit:"D",c:c},"Placer, gratificación o alivio al provocar el incendio o al presenciar/participar en sus consecuencias."),
          e(Crit,{crit:"E",c:c},"NO se provoca por motivación económica, ideológica, vengativa, para ocultar otro delito, ni como respuesta a delirio/alucinación o alteración del juicio."),
          e(Crit,{crit:"F",c:c},"NO mejor explicada por trastorno de la conducta, episodio maníaco o trastorno antisocial de personalidad.")
        ),
        tx:e(P,null,"Muy pobre respuesta a farmacoterapia. TCC con manejo de impulsos. Supervisión y contención. Tratar trastornos comórbidos.")
      }
    },
    {
      n:"05",name:"Cleptomanía",c:c,
      blurb:"Impulso recurrente de robar sin necesidad · no por valor",
      sections:{
        def:e(Def,{c:c},"Fracaso ",e("b",null,"recurrente")," en el control del impulso de ",e("b",null,"robar objetos")," que NO son necesarios para el uso personal o por su valor económico. Tensión previa + placer/gratificación/alivio al cometer el robo."),
        cli:e("div",null,
          e(P,null,"Mucho más frecuente en mujeres (~3:1). Inicio típico en adolescencia. Los objetos robados suelen ser abandonados, regalados, devueltos o acumulados. Alta comorbilidad con trastornos del ánimo, ansiedad, conducta alimentaria, sustancias."),
          e(Note,{c:c,t:"Clave diferencial"},"En el robo 'común' hay motivación económica o uso del objeto. En cleptomanía el robo es impulsivo y el objeto no tiene valor para el paciente.")
        ),
        dx:e(CritBlock,{title:"Cleptomanía (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Fracaso recurrente del impulso de robar objetos que no son necesarios para uso personal ni por valor económico."),
          e(Crit,{crit:"B",c:c},"Tensión creciente inmediatamente antes del robo."),
          e(Crit,{crit:"C",c:c},"Placer, gratificación o alivio al cometer el robo."),
          e(Crit,{crit:"D",c:c},"El robo NO se comete para expresar rabia o venganza, ni en respuesta a delirios/alucinaciones."),
          e(Crit,{crit:"E",c:c},"NO mejor explicado por trastorno de la conducta, episodio maníaco o trastorno antisocial de personalidad.")
        ),
        tx:e(P,null,"TCC con desensibilización encubierta. ISRS (fluoxetina) + naltrexona tienen evidencia de utilidad (modulación del sistema de recompensa).")
      }
    }
  ];

  var s1=useState(null);var openGen=s1[0],setOpenGen=s1[1];
  var general=[
    {id:"conceptos",ic:"🧭",t:"Conceptos generales",sub:"Organización del capítulo",c:c,
     content:e("div",null,
       e(P,null,"Capítulo del DSM-5 que agrupa trastornos caracterizados por problemas en el control del comportamiento emocional y conductual, con violación de los derechos de los demás o conflicto con autoridades/normas."),
       e(H3,{c:c,mt:14},"Las 5 entidades principales"),
       e(Table,{
         headers:[{t:"Entidad",c:c},{t:"Núcleo",c:c},{t:"Edad típica",c:c}],
         rows:[
           ["Negativista desafiante","Enfado/desafío/vengatividad ≥6 m","Niños · adolescentes"],
           ["Explosivo intermitente (TEI)","Arrebatos agresivos desproporcionados","≥6 años (usualmente adultos jóvenes)"],
           ["Trastorno de la conducta","Transgresión grave de derechos/normas","Niños/adolescentes"],
           ["Piromanía","Incendios deliberados con fascinación","Variable · raro"],
           ["Cleptomanía","Robo impulsivo de objetos sin valor","Adolescencia/adultez · mujeres"]
         ]
       }),
       e(Note,{c:c,t:"Relación con antisocial"},"El trastorno de la conducta es el equivalente en menores al trastorno antisocial de personalidad adulto. Un niño con CC severo tiene alto riesgo de desarrollar antisocial al adultecer; el CC antes de los 15 años es prerrequisito para diagnosticar antisocial.")
     )},
    {id:"trampas",ic:"🎯",t:"Diagnósticos diferenciales clave",sub:"Separar entidades",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Par",c:c},{t:"Diferencia clave",c:c}],
         rows:[
           ["Negativista vs Conducta","Negativista: desafío, no violación grave de derechos. Conducta: agresión, destrucción, robo, violación de normas graves"],
           ["Conducta (<18) vs Antisocial (≥18)","Misma fenomenología, diferente edad. Conducta antes de 15 años es criterio para antisocial"],
           ["TEI vs Antisocial","TEI: arrebatos IMPULSIVOS sin propósito. Antisocial: conducta PLANEADA y sin remordimiento, patrón pervasivo"],
           ["Piromanía vs incendios instrumentales","Piromanía: fascinación + placer con el fuego. Incendiario común: busca cobrar seguro, vengarse, ocultar delito"],
           ["Cleptomanía vs robo común","Cleptomanía: objetos sin valor, impulso no planeado. Robo común: motivación económica"],
           ["TEI vs manía","Manía tiene euforia/ánimo elevado + otros síntomas. TEI es solo los arrebatos"]
         ]
       })
     )},
    {id:"tx",ic:"💊",t:"Tratamiento · resumen del tema",sub:"Mayoritariamente conductual",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"1ª línea",c:c},{t:"Farmacoterapia",c:c}],
         rows:[
           ["Negativista desafiante","Parent Management Training + terapia familiar","Tratar comorbilidades (TDAH, depresión)"],
           ["TEI","TCC manejo de ira","ISRS (fluoxetina) · valproato · litio"],
           ["Conducta","Terapia multisistémica + familiar","Antipsicóticos atípicos si agresión severa"],
           ["Piromanía","TCC · supervisión","Pobre respuesta farmacológica"],
           ["Cleptomanía","TCC con desensibilización","ISRS + naltrexona"]
         ]
       })
     )},
    {id:"perlas",ic:"📌",t:"Perlas de examen",sub:"Alto rendimiento",c:c,
     content:e("div",null,
       e(Pearl,{t:"CC <15 años → antisocial adulto"},"El trastorno de la conducta antes de los 15 años es criterio OBLIGATORIO para diagnosticar antisocial de personalidad en ≥18 años. Sin este antecedente, no se diagnostica antisocial."),
       e(Pearl,{t:"TEI es IMPULSIVO"},"Los arrebatos en TEI son IMPULSIVOS y DESPROPORCIONADOS, no planeados ni con objetivo tangible. Diferencia con antisocial (planeación, explotación)."),
       e(Pearl,{t:"Piromanía rara"},"Dx primario raro. Antes de diagnosticarlo descartar motivación económica, vengativa, ideológica, o que sea manifestación de otro trastorno."),
       e(Pearl,{t:"Cleptomanía + mujer"},"~3:1 mujeres. Inicio en adolescencia. Objetos robados no tienen valor para el paciente."),
       e(Pearl,{t:"'Callous-unemotional'"},"Especificador 'con emociones prosociales limitadas' en CC. Rasgos de frialdad, poca culpa, afecto superficial. Predictor fuerte de antisocial adulto + peor respuesta a tratamiento."),
       e(Pearl,{t:"Negativista + TDAH"},"Muy alta comorbilidad (~40%). Tratar el TDAH con estimulantes frecuentemente mejora también el negativismo."),
       e(Pearl,{t:"Parent Management Training (PMT)"},"Intervención de 1ª línea para negativista desafiante y CC en niños. Enseña a padres a usar reforzamiento positivo, consecuencias consistentes, y gestión de límites.")
     )},
    {id:"resumen",ic:"📊",t:"Resumen comparativo",sub:"5 entidades en tabla",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"Duración / criterio clave",c:c},{t:"Tx 1ª línea",c:c}],
         rows:[
           ["Negativista desafiante","≥4 síntomas × ≥6 meses (en niños)","PMT + terapia familiar"],
           ["TEI","Arrebatos ≥2/sem × 3 m (A1) o ≥3 graves/año (A2) · edad ≥6","TCC manejo ira · ISRS/valproato"],
           ["Trastorno de la conducta","≥3 síntomas últimos 12m · ≥1 últimos 6m","Terapia multisistémica"],
           ["Piromanía","Incendios deliberados + fascinación","TCC · pobre respuesta"],
           ["Cleptomanía","Robo impulsivo sin valor","TCC + ISRS + naltrexona"]
         ]
       })
     )},
    {id:"flash",ic:"🃏",t:"Flashcards",sub:"12 preguntas + las tuyas",c:c,
     content:e("div",null,
       e(P,null,"Tarjetas de repaso de control de impulsos. Añade las tuyas."),
       e(FlashDeck,{c:c,deckId:"impulsos",items:getAllCards("impulsos")})
     )},
    {id:"quiz",ic:"❓",t:"Quiz · 6 casos clínicos",sub:"Prueba tus conocimientos",c:c,
     content:e(Quiz,{c:c,items:getAllQuiz("impulsos")})}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Tema 8 · Neurosis · DSM-5-TR",title:"Control de impulsos y conducta"},
      "Capítulo del DSM-5 que agrupa trastornos caracterizados por ",e("b",null,"dificultad en el control de emociones y comportamiento"),", con transgresión de derechos ajenos o conflicto con autoridades/normas. Incluye entidades infantiles (negativista, conducta) y del adulto (TEI, piromanía, cleptomanía). Son ",e("b",null,"5 entidades principales"),"."
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.3),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Conceptos · DDx · Flashcards · Quiz")
    ),
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginTop:10}},
      general.map(function(g,i){
        return e("button",{key:g.id,onClick:function(){setOpenGen(i);},style:{padding:"14px 12px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:10,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:4,minHeight:90}},
          e("div",{style:{fontSize:22,marginBottom:4}},g.ic),
          e("div",{style:{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Playfair Display"}},g.t),
          e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.4,marginTop:2}},g.sub)
        );
      })
    ),
    openGen!==null?e(DzModal,{c:general[openGen].c,name:general[openGen].t,kicker:"Sección del tema",single:general[openGen].content,onClose:function(){setOpenGen(null);}}):null,

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.15)+","+ax(c,.04)+" 90%)",border:"1px solid "+ax(c,.35),borderRadius:14,margin:"18px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Las 5 entidades"),
      e("div",{style:{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Toca cualquier entidad para abrir su ficha")
    ),
    e(DzGrid,{c:c,items:diseases}),

    e(Abbrev,{c:c,items:[
      {a:"CC",d:"Conduct Disorder (trastorno de la conducta)"},
      {a:"TEI",d:"Trastorno Explosivo Intermitente"},
      {a:"PMT",d:"Parent Management Training"},
      {a:"TDAH",d:"Trastorno por Déficit de Atención e Hiperactividad"},
      {a:"TCC",d:"Terapia Cognitivo-Conductual"},
      {a:"ISRS",d:"Inhibidores Selectivos de la Recaptación de Serotonina"}
    ]})
  );
}



