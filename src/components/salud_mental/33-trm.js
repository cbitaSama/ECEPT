function TraumaView(p){
  var c=C.trm;
  var diseases=[
    {
      n:"01",name:"Trastorno de estrés postraumático (TEPT)",
      blurb:"Evento traumático + 4 grupos de síntomas ≥1 mes",
      sections:{
        def:e(Def,{c:c},"Trastorno que se desarrolla tras la exposición a un evento ",e("b",null,"traumático extremo")," (amenaza real de muerte, lesión grave, violencia sexual — ya sea vivida directamente, presenciada, o supiera de ella en familiar/amigo cercano, o por exposición repetida en el trabajo). Se caracteriza por ",e("b",null,"4 grupos de síntomas durante ≥1 mes")," que causan malestar o deterioro significativo."),
        cli:e("div",null,
          e(H3,{c:c},"Los 4 grupos de síntomas"),
          e(Table,{
            headers:[{t:"Criterio",c:c},{t:"Grupo",c:c},{t:"Requiere",c:c}],
            rows:[
              ["B","Síntomas de intrusión / re-experimentación","≥1 de 5"],
              ["C","Evitación persistente de estímulos asociados","≥1 de 2"],
              ["D","Alteraciones negativas de cognición y ánimo","≥2 de 7"],
              ["E","Alteraciones de alerta y reactividad (hiperactivación)","≥2 de 6"]
            ]
          }),
          e(H3,{c:c,mt:14},"B · Intrusión (≥1 de 5)"),
          e(SxList,{c:c,items:[
            "Recuerdos angustiosos recurrentes, involuntarios e intrusivos del trauma",
            "Sueños angustiosos recurrentes relacionados con el trauma",
            "Reacciones disociativas (flashbacks) — el individuo siente que revive el trauma",
            "Malestar psicológico intenso ante claves internas o externas que simbolizan el trauma",
            "Reacciones fisiológicas marcadas (taquicardia, sudoración) ante dichas claves"
          ]}),
          e(H3,{c:c,mt:14},"C · Evitación (≥1 de 2)"),
          e(SxList,{c:c,items:[
            "Evitación de recuerdos, pensamientos o sentimientos angustiosos sobre el trauma",
            "Evitación de recordatorios externos (personas, lugares, conversaciones, actividades, objetos, situaciones)"
          ]}),
          e(H3,{c:c,mt:14},"D · Alteraciones negativas de cognición/ánimo (≥2 de 7)"),
          e(SxList,{c:c,items:[
            "Incapacidad para recordar aspectos importantes del trauma (amnesia disociativa)",
            "Creencias negativas persistentes y exageradas sobre uno mismo, los demás o el mundo",
            "Cogniciones distorsionadas sobre la causa o consecuencias del trauma → autoculparse",
            "Estado emocional negativo persistente (miedo, horror, rabia, culpa, vergüenza)",
            "Disminución del interés en actividades significativas",
            "Desapego o extrañamiento de los demás",
            "Incapacidad para experimentar emociones positivas (anhedonia)"
          ]}),
          e(H3,{c:c,mt:14},"E · Hiperactivación (≥2 de 6)"),
          e(SxList,{c:c,items:[
            "Irritabilidad o ataques de ira con poca o ninguna provocación",
            "Comportamiento temerario o autodestructivo",
            "Hipervigilancia",
            "Respuesta de sobresalto exagerada",
            "Problemas de concentración",
            "Alteración del sueño"
          ]}),
          e(H3,{c:c,mt:14},"Especificadores"),
          e(SxList,{c:c,items:[
            "Con síntomas disociativos (despersonalización / desrealización)",
            "Con expresión retardada: si los criterios completos no se cumplen hasta al menos 6 meses tras el evento"
          ]}),
          e(H3,{c:c,mt:14},"Epidemiología"),
          e(P,null,"Prevalencia anual ~3.5%. Prevalencia de por vida ~7–9%. 2:1 mujeres (tipos de trauma diferentes: varones→combate/accidentes; mujeres→violencia sexual/doméstica). Comorbilidad con depresión, sustancias, otros ansiosos, dolor crónico.")
        ),
        dx:e(CritBlock,{title:"TEPT (DSM-5 adultos)",c:c},
          e(Crit,{crit:"A",c:c},e("b",null,"Exposición")," a muerte, lesión grave o violencia sexual, real o amenazada, de una o más formas: (1) vivenciar directamente, (2) presenciar, (3) saber que le ocurrió a familiar cercano o amigo (si muerte violenta/accidental), (4) exposición repetida a detalles desagradables del evento (primeros respondedores, forenses)."),
          e(Crit,{crit:"B",c:c},"Síntomas de INTRUSIÓN (≥1 de 5)."),
          e(Crit,{crit:"C",c:c},"EVITACIÓN persistente de estímulos asociados al trauma (≥1 de 2)."),
          e(Crit,{crit:"D",c:c},"ALTERACIONES NEGATIVAS de cognición y ánimo (≥2 de 7)."),
          e(Crit,{crit:"E",c:c},"Alteraciones de ALERTA y REACTIVIDAD — hiperactivación (≥2 de 6)."),
          e(Crit,{crit:"F",c:c},"Duración ",e("b",null,"≥1 mes"),"."),
          e(Crit,{crit:"G",c:c},"Causa malestar clínico o deterioro significativo."),
          e(Crit,{crit:"H",c:c},"No atribuible a sustancia ni afección médica.")
        ),
        tx:e("div",null,
          e(H3,{c:c},"Psicoterapia (1ª línea)"),
          e(P,null,"Las psicoterapias centradas en el trauma son ",e("b",null,"de primera línea"),", equivalentes o superiores a la farmacoterapia:"),
          e(SxList,{c:c,items:[
            "TCC centrada en trauma (TCC-CT)",
            "Terapia de Exposición Prolongada",
            "Terapia de Procesamiento Cognitivo",
            "EMDR (Eye Movement Desensitization and Reprocessing)"
          ]}),
          e(H3,{c:c,mt:14},"Farmacoterapia"),
          e(Table,{
            headers:[{t:"Fármaco",c:c},{t:"Indicación",c:c},{t:"Dosis",c:c}],
            rows:[
              ["Sertralina ★","1ª línea · aprobación FDA","50–200 mg/día"],
              ["Paroxetina ★","1ª línea · aprobación FDA","20–60 mg/día"],
              ["Venlafaxina XR","1ª línea alternativa","75–300 mg/día"],
              ["Prazosina ★","Pesadillas e hiperactivación nocturna","1–10 mg antes de dormir"],
              ["Mirtazapina","Depresión comórbida + insomnio","15–45 mg nocturno"]
            ]
          }),
          e(Alert,{c:C.bad,label:"⚠️ CONTRAINDICADAS"},"Las ",e("b",null,"benzodiacepinas están CONTRAINDICADAS")," en TEPT: no tratan los síntomas nucleares, interfieren con el procesamiento del trauma en psicoterapia, empeoran la disociación y tienen alto riesgo de dependencia en esta población.")
        )
      }
    },
    {
      n:"02",name:"Trastorno de estrés agudo (TEA)",
      blurb:"Síntomas 3 días – 1 mes tras trauma",
      sections:{
        def:e(Def,{c:c},"Cuadro idéntico al TEPT en cuanto a exposición al trauma, pero con duración ",e("b",null,"entre 3 días y 1 mes")," tras el evento. Si los síntomas persisten >1 mes, se convierte en TEPT."),
        cli:e("div",null,
          e(P,null,"Los criterios B-E del TEPT (intrusión, evitación, alteraciones negativas, hiperactivación) aparecen aquí ",e("b",null,"combinados como una lista única de 14 síntomas")," de los cuales se requieren ",e("b",null,"≥9"),". Incluye también ",e("b",null,"síntomas disociativos")," como criterio destacado."),
          e(Note,{c:c,t:"Predictor de TEPT"},"Tener TEA NO predice bien el desarrollo de TEPT (muchos con TEA se recuperan y muchos con TEPT no tuvieron TEA franco). Pero sigue siendo útil para iniciar intervención precoz.")
        ),
        dx:e(CritBlock,{title:"TEA (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Exposición al trauma (mismo criterio A del TEPT)."),
          e(Crit,{crit:"B",c:c},e("b",null,"≥9 síntomas")," entre cualquier categoría (intrusión, ánimo negativo, disociación, evitación, activación)."),
          e(Crit,{crit:"C",c:c},"Duración: ",e("b",null,"de 3 días a 1 mes")," tras el trauma."),
          e(Crit,{crit:"D",c:c},"Malestar o deterioro clínico."),
          e(Crit,{crit:"E",c:c},"No por sustancia, afección médica ni trastorno psicótico breve.")
        ),
        tx:e(P,null,e("b",null,"TCC centrada en trauma")," precoz (dentro del mes) es lo más efectivo. Farmacoterapia no es de primera línea a menos que haya síntomas severos. Las ",e("b",null,"BZD siguen contraindicadas")," — el mismo argumento del TEPT.")
      }
    },
    {
      n:"03",name:"Trastorno de adaptación",
      blurb:"Síntomas tras estresor NO traumático · <6 meses",
      sections:{
        def:e(Def,{c:c},"Respuesta emocional o conductual desproporcionada a un estresor ",e("b",null,"identificable NO traumático")," (divorcio, problemas laborales, enfermedad, mudanza). Aparece ",e("b",null,"dentro de los 3 meses")," del estresor y se resuelve ",e("b",null,"dentro de los 6 meses")," tras su cese (salvo que el estresor sea crónico)."),
        cli:e("div",null,
          e(H3,{c:c},"Los 6 subtipos por síntoma predominante"),
          e(Table,{
            headers:[{t:"Subtipo",c:c},{t:"Predominan",c:c}],
            rows:[
              ["Con ánimo deprimido","Tristeza, llanto, desesperanza"],
              ["Con ansiedad","Nerviosismo, preocupación, miedo"],
              ["Mixto con ansiedad y ánimo deprimido","Ambos"],
              ["Con alteración de la conducta","Violación de derechos ajenos, normas sociales"],
              ["Mixto con alteración de emociones y conducta","Combinación"],
              ["Sin especificar","Reacciones desadaptativas que no encajan en los demás"]
            ]
          })
        ),
        dx:e(CritBlock,{title:"Trastorno de adaptación",c:c},
          e(Crit,{crit:"A",c:c},"Desarrollo de síntomas emocionales o conductuales en respuesta a un estresor identificable, dentro de los ",e("b",null,"3 meses")," tras el estresor."),
          e(Crit,{crit:"B",c:c},"Los síntomas son clínicamente significativos (malestar desproporcionado O deterioro social/laboral)."),
          e(Crit,{crit:"C",c:c},"No cumple criterios para otro trastorno mental ni es exacerbación de uno preexistente."),
          e(Crit,{crit:"D",c:c},"No representa duelo normal."),
          e(Crit,{crit:"E",c:c},"Una vez terminado el estresor (o sus consecuencias), los síntomas no persisten >6 meses.")
        ),
        tx:e(P,null,"Psicoterapia de apoyo / resolución de problemas / TCC. Farmacoterapia solo sintomática (ansiolíticos puntuales, ISRS si deriva en episodio depresivo mayor).")
      }
    },
    {
      n:"04",name:"Trastorno de duelo prolongado",
      blurb:"Duelo intenso ≥12 meses (≥6 en niños)",
      sections:{
        def:e(Def,{c:c},"Duelo patológico en adultos que persiste con intensidad ",e("b",null,"≥12 meses")," tras la muerte de un ser querido (≥6 meses en niños/adolescentes). Caracterizado por anhelo intenso persistente del fallecido + preocupación con pensamientos o recuerdos sobre él."),
        cli:e("div",null,
          e(P,null,"Diagnóstico añadido al DSM-5-TR (2022). Presenta síntomas adicionales como confusión identitaria, sensación de irrealidad, evitación de recordatorios, entumecimiento emocional, soledad intensa, sensación de que la vida carece de sentido."),
          e(Note,{c:c,t:"DDx clave"},"Duelo normal: ondulante, con momentos de bienestar. Duelo prolongado: paralizante, continuo, con deterioro funcional marcado. Depresión mayor: los síntomas no se enfocan exclusivamente en la pérdida.")
        ),
        dx:e(CritBlock,{title:"Duelo prolongado (DSM-5-TR)",c:c},
          e(Crit,{crit:"A",c:c},"Muerte de una persona cercana hace ≥12 meses (≥6 en niños)."),
          e(Crit,{crit:"B",c:c},"≥1 de: anhelo persistente del fallecido · preocupación con pensamientos/recuerdos de él."),
          e(Crit,{crit:"C",c:c},"≥3 de 8 síntomas adicionales (confusión identitaria, incredulidad, evitación, dolor emocional intenso, dificultad para reintegrarse, entumecimiento, sinsentido, soledad intensa)."),
          e(Crit,{crit:"D",c:c},"Malestar o deterioro clínicamente significativo."),
          e(Crit,{crit:"E",c:c},"La duración y gravedad exceden claramente las normas culturales o religiosas."),
          e(Crit,{crit:"F",c:c},"No se explica mejor por otro trastorno mental.")
        ),
        tx:e(P,null,e("b",null,"Terapia específica de duelo complicado")," (Complicated Grief Therapy, M.K. Shear) + TCC. Evidencia moderada para ISRS. No usar BZD más allá de periodos muy cortos.")
      }
    },
    {
      n:"05",name:"Trastorno de apego reactivo",
      blurb:"Niños <5 años · Apego inhibido por negligencia grave",
      sections:{
        def:e(Def,{c:c},"Patrón de comportamiento inhibido y emocionalmente retraído hacia cuidadores en niños, asociado a ",e("b",null,"cuidado patogénico grave")," (negligencia afectiva, cambios repetidos de cuidadores que impiden formar apegos estables, crianza en instituciones con altos ratios niño/cuidador)."),
        cli:e("div",null,
          e(SxList,{c:c,items:[
            "El niño raramente busca consuelo cuando está angustiado",
            "Raramente responde al consuelo cuando se le ofrece",
            "Respuesta social y emocional mínima hacia otros",
            "Afecto positivo limitado",
            "Episodios de irritabilidad, tristeza o miedo inexplicables en interacciones no amenazantes con cuidadores"
          ]})
        ),
        dx:e(CritBlock,{title:"Apego reactivo (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Patrón persistente de comportamiento inhibido y retraído hacia cuidadores (los 2 criterios del síntoma)."),
          e(Crit,{crit:"B",c:c},"Alteración social y emocional persistente (≥2 de 3)."),
          e(Crit,{crit:"C",c:c},"Experiencia de cuidado insuficiente (negligencia, cambios repetidos, institución)."),
          e(Crit,{crit:"D",c:c},"El criterio C es el responsable del A."),
          e(Crit,{crit:"E",c:c},"No cumple criterios de espectro autista."),
          e(Crit,{crit:"F",c:c},"Aparente antes de los 5 años."),
          e(Crit,{crit:"G",c:c},"Edad de desarrollo ≥9 meses.")
        ),
        tx:e(P,null,"Restablecer un ",e("b",null,"cuidador estable y sensible")," es la intervención más eficaz. Psicoterapia enfocada en apego, intervenciones diádicas padre-hijo. No hay farmacoterapia específica.")
      }
    },
    {
      n:"06",name:"Trastorno de relación social desinhibida",
      blurb:"Niños · Sociabilidad indiscriminada con extraños",
      sections:{
        def:e(Def,{c:c},"Opuesto fenomenológico del apego reactivo: el niño presenta conductas ",e("b",null,"excesivamente familiares e indiscriminadas")," con adultos desconocidos, también asociado a cuidado patogénico."),
        cli:e(SxList,{c:c,items:[
          "Reducción o ausencia de reticencia al acercarse a adultos desconocidos",
          "Comportamiento verbal o físico excesivamente familiar (inapropiado para la edad y contexto cultural)",
          "Disminución o ausencia de chequeo con el cuidador adulto al alejarse, incluso en entornos desconocidos",
          "Disposición a irse con adultos desconocidos sin o con mínima vacilación"
        ]}),
        dx:e(CritBlock,{title:"Relación social desinhibida (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Patrón de comportamiento en el que el niño se acerca e interactúa activamente con adultos desconocidos (≥2 de 4 síntomas)."),
          e(Crit,{crit:"B",c:c},"Los comportamientos no se limitan a impulsividad (como en TDAH) sino que incluyen comportamientos desinhibidos socialmente."),
          e(Crit,{crit:"C",c:c},"Experiencia de cuidado insuficiente."),
          e(Crit,{crit:"D",c:c},"El criterio C es presumiblemente responsable del A."),
          e(Crit,{crit:"E",c:c},"Edad de desarrollo ≥9 meses.")
        ),
        tx:e(P,null,"Cuidador estable y sensible. Psicoterapia de apoyo al cuidador e intervenciones diádicas. Puede persistir en la adolescencia como impulsividad social.")
      }
    }
  ];

  // Section tiles delegate to p.onOpenSection (SM App promotes them to
  // view="section" as a full inline page — no inline DzModal here).
  var general=[
    {id:"conceptos",ic:"🧭",t:"Conceptos generales",sub:"Organización del capítulo",c:c,
     content:e("div",null,
       e(P,null,"Capítulo creado en DSM-5 como separado de los trastornos de ansiedad. Reúne cuadros en los que la ",e("b",null,"exposición a un evento estresante o traumático")," es un criterio ",e("b",null,"explícito")," (criterio A) para el diagnóstico. Son ",e("b",null,"6 entidades"),"."),
       e(H3,{c:c,mt:14},"Resumen de las 6 entidades"),
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"Gatillo",c:c},{t:"Duración",c:c}],
         rows:[
           ["TEPT","Trauma (criterio A)","≥1 mes"],
           ["TEA (estrés agudo)","Trauma (criterio A)","3 días – 1 mes"],
           ["Adaptación","Estresor NO traumático","<6 meses tras cese"],
           ["Duelo prolongado","Muerte de ser querido","≥12 meses (≥6 niños)"],
           ["Apego reactivo","Cuidado patogénico","Niños <5 años"],
           ["Relación social desinhibida","Cuidado patogénico","Niños"]
         ]
       })
     )},
    {id:"criterioa",ic:"⚡",t:"El criterio A · qué es trauma",sub:"Clave para separar TEPT de adaptación",c:c,
     content:e("div",null,
       e(Def,{c:c},"El ",e("b",null,"criterio A de TEPT/TEA")," define qué cuenta como 'trauma'. Si no cumple A, el diagnóstico apropiado puede ser trastorno de adaptación u otro."),
       e(H3,{c:c},"Cumple criterio A (4 formas)"),
       e(SxList,{c:c,items:[
         "Vivir directamente el evento (amenaza de muerte, lesión grave, violencia sexual)",
         "Presenciar el evento en persona (NO por TV/películas/redes, salvo en contexto laboral)",
         "Saber que le ocurrió a un familiar cercano o amigo (en muerte: debe ser violenta o accidental)",
         "Exposición repetida a detalles desagradables del evento (primeros respondedores, forenses, policías que investigan abuso)"
       ]}),
       e(Alert,{c:C.bad,label:"⚠️ NO cumplen criterio A"},"Ver noticias por TV · enterarse de enfermedad grave de un familiar (no muerte violenta) · divorcio · problemas laborales · desempleo · estrés financiero. Estos pueden ir a ",e("b",null,"trastorno de adaptación"),", no a TEPT.")
     )},
    {id:"ddx",ic:"🧭",t:"Diagnóstico diferencial",sub:"Dentro y fuera del capítulo",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Cuadro",c:c},{t:"Clave diferencial",c:c}],
         rows:[
           ["TEPT vs TEA","Duración: <1 mes = TEA · ≥1 mes = TEPT"],
           ["TEPT vs Adaptación","Criterio A estricto · el estresor en adaptación NO es traumático en el sentido del DSM"],
           ["TEPT vs Depresión mayor","TEPT tiene re-experimentación + evitación + hiperactivación · no solo ánimo"],
           ["TEPT vs TOC","Las intrusiones del TEPT son memorias · las obsesiones del TOC son ideas/impulsos no basados en memoria"],
           ["Duelo prolongado vs Depresión","Duelo: anhelo + pensamientos sobre el fallecido · Depresión: autodevaluación, culpa no relacionada con muerte"],
           ["Apego reactivo vs TEA (autismo)","Apego responde a cuidador estable · autismo tiene déficits sociales y restricciones independientes del cuidado"]
         ]
       })
     )},
    {id:"tx",ic:"💊",t:"Tratamiento · resumen del tema",sub:"Psicoterapia > farmacoterapia",c:c,
     content:e("div",null,
       e(H3,{c:c},"TEPT — fármacos con aprobación FDA"),
       e(Table,{
         headers:[{t:"Línea",c:c},{t:"Fármaco",c:c},{t:"Dosis",c:c}],
         rows:[
           ["1ª línea · FDA","Sertralina","50–200 mg/día"],
           ["1ª línea · FDA","Paroxetina","20–60 mg/día"],
           ["1ª línea alt","Venlafaxina XR","75–300 mg/día"],
           ["Pesadillas","Prazosina","1–10 mg nocturno (titular)"],
           ["Depresión + insomnio","Mirtazapina","15–45 mg nocturno"]
         ]
       }),
       e(H3,{c:c,mt:14},"Psicoterapia centrada en trauma (1ª línea)"),
       e(SxList,{c:c,items:[
         "TCC centrada en trauma (TCC-CT)",
         "Terapia de Exposición Prolongada",
         "Terapia de Procesamiento Cognitivo",
         "EMDR (Eye Movement Desensitization and Reprocessing)"
       ]}),
       e(Alert,{c:C.bad,label:"⚠️ BZD CONTRAINDICADAS en TEPT"},"No tratan síntomas nucleares, interfieren con el procesamiento del trauma en psicoterapia, empeoran disociación y tienen alto riesgo de dependencia en esta población.")
     )},
    {id:"perlas",ic:"📌",t:"Perlas de examen",sub:"Alto rendimiento",c:c,
     content:e("div",null,
       e(Pearl,{t:"⏱ TEPT vs TEA · regla temporal"},"TEA: 3 días a 1 mes. TEPT: ≥1 mes. Si un paciente tiene síntomas de trauma al día siguiente no es TEA (se necesitan ≥3 días)."),
       e(Pearl,{t:"Criterio A · muerte violenta/accidental"},"Para que contar como trauma saber que un familiar murió, la muerte debe haber sido ",e("b",null,"violenta o accidental"),". Muerte por cáncer de un familiar → NO cumple criterio A de TEPT."),
       e(Pearl,{t:"Prazosina"},"Antagonista α1-adrenérgico. Reduce ",e("b",null,"pesadillas")," y ",e("b",null,"hiperactivación nocturna")," en TEPT. Dosis: iniciar 1 mg nocturno, titular hasta 10 mg."),
       e(Pearl,{t:"BZD contraindicadas en TEPT"},"Esta es una pregunta de examen frecuente. NO prescribir BZD en TEPT."),
       e(Pearl,{t:"Sertralina y paroxetina"},"Son los ÚNICOS ISRS con aprobación FDA específica para TEPT. Sertralina suele preferirse por mejor perfil."),
       e(Pearl,{t:"EMDR"},"Psicoterapia basada en movimientos oculares bilaterales durante la evocación del recuerdo traumático. Eficacia equivalente a TCC-CT."),
       e(Pearl,{t:"Adaptación · 3 y 6 meses"},"Aparición dentro de ",e("b",null,"3 meses")," del estresor · resolución dentro de ",e("b",null,"6 meses")," tras su cese."),
       e(Pearl,{t:"Duelo prolongado"},"Nuevo en DSM-5-TR (2022). Criterio temporal ≥12 meses en adultos, ≥6 en niños. Cuidado: no patologizar duelo normal."),
       e(Pearl,{t:"Apego reactivo vs desinhibida"},"Ambos por cuidado patogénico. Reactivo: niño INHIBIDO (no busca consuelo). Desinhibida: niño TE ABRAZA sin conocerte.")
     )},
    {id:"resumen",ic:"📊",t:"Resumen comparativo",sub:"Las 6 entidades en una tabla",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"Criterio de inicio",c:c},{t:"Duración clave",c:c},{t:"Tx de elección",c:c}],
         rows:[
           ["TEPT","Trauma · cumple criterio A","≥1 mes","Sertralina/paroxetina + psicoterapia trauma (EMDR, TCC-CT)"],
           ["TEA","Trauma · cumple criterio A","3 días a 1 mes","TCC-CT precoz"],
           ["Adaptación","Estresor no traumático","<6 m tras cese","Psicoterapia de apoyo"],
           ["Duelo prolongado","Muerte ser querido","≥12 m (≥6 niños)","Terapia de duelo complicado"],
           ["Apego reactivo","Cuidado patogénico","Niños <5 años","Cuidador estable + terapia diádica"],
           ["Relación social desinhibida","Cuidado patogénico","Niños","Cuidador estable + terapia diádica"]
         ]
       })
     )},
    {id:"flash",ic:"🃏",t:"Flashcards",sub:"14 preguntas + las tuyas",c:c,
     content:e("div",null,
       e(P,null,"Tarjetas de repaso de trauma y estrés. Puedes añadir tus propias."),
       e(FlashDeck,{c:c,deckId:"trauma",items:getAllCards("trauma")})
     )},
    {id:"quiz",ic:"❓",t:"Quiz · 6 casos clínicos",sub:"Prueba tus conocimientos",c:c,
     content:e(Quiz,{c:c,items:getAllQuiz("trauma")})}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Tema 3 · Neurosis · DSM-5-TR",title:"Trauma y estrés"},
      "Capítulo creado en DSM-5. Reúne trastornos en los que la ",e("b",null,"exposición a un evento estresante o traumático")," es un criterio ",e("b",null,"explícito y necesario")," para el diagnóstico. Son ",e("b",null,"6 entidades"),"."
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.12),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Inter,DM Sans"}},"Conceptos · Criterio A · Flashcards · Quiz")
    ),
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginTop:10}},
      general.map(function(g,i){
        return e("button",{key:g.id,onClick:function(){if(p&&p.onOpenSection)p.onOpenSection(g);},style:{padding:"14px 12px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:10,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:4,minHeight:90}},
          e("div",{style:{fontSize:22,marginBottom:4}},g.ic),
          e("div",{style:{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Inter,DM Sans"}},g.t),
          e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.4,marginTop:2}},g.sub)
        );
      })
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.15)+","+ax(c,.04)+" 90%)",border:"1px solid "+ax(c,.35),borderRadius:14,margin:"18px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Las 6 enfermedades"),
      e("div",{style:{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Inter,DM Sans"}},"Toca cualquier enfermedad para abrir su ficha"),
      e("div",{style:{fontSize:12,color:C.mt,marginTop:4,lineHeight:1.45}},"Cada ficha tiene tabs: Definición · Clínica · Diagnóstico · Tratamiento")
    ),
    e(DzGrid,{c:c,items:diseases,onOpen:p&&p.onOpen}),

    e(Abbrev,{c:c,items:[
      {a:"TEPT",d:"Trastorno de Estrés Postraumático"},
      {a:"TEA",d:"Trastorno de Estrés Agudo"},
      {a:"EMDR",d:"Eye Movement Desensitization and Reprocessing"},
      {a:"TCC-CT",d:"Terapia Cognitivo-Conductual Centrada en Trauma"},
      {a:"ISRS",d:"Inhibidores Selectivos de la Recaptación de Serotonina"},
      {a:"IRSN",d:"Inhibidores de Recaptación de Serotonina y Noradrenalina"},
      {a:"BZD",d:"Benzodiacepinas"}
    ]})
  );
}

