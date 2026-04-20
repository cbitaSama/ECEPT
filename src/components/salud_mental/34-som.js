function SomView(){
  var c=C.som;
  var cd=C.dis;
  var diseases=[
    // ═══ SECCIÓN A · SOMÁTICOS ═══
    {
      n:"01",name:"Trastorno de síntomas somáticos (TSS)",c:c,
      blurb:"Síntomas físicos reales + pensamientos/ansiedad desproporcionados",
      sections:{
        def:e(Def,{c:c},"Uno o más síntomas físicos ",e("b",null,"reales, angustiantes o que alteran la vida diaria"),", acompañados de pensamientos, sentimientos o comportamientos ",e("b",null,"desproporcionados"),". Lo clave no es la presencia o ausencia del síntoma físico, sino la ",e("b",null,"respuesta psicológica")," al mismo."),
        cli:e("div",null,
          e(P,null,"Prevalencia ~5–7%. Más frecuente en mujeres. Alta comorbilidad con depresión y ansiedad. Curso crónico con fluctuaciones."),
          e(H3,{c:c,mt:14},"Especificadores"),
          e(SxList,{c:c,items:[
            "Con dolor predominante (antes 'trastorno de dolor')",
            "Persistente: curso de >6 meses con síntomas graves y deterioro marcado",
            "Leve / moderado / grave según número de síntomas del criterio B"
          ]}),
          e(Note,{c:c,t:"Diferencia con IAD"},"En TSS hay síntomas físicos REALES que preocupan. En IAD (hipocondría) la preocupación es por enfermar, con síntomas físicos LEVES o AUSENTES.")
        ),
        dx:e(CritBlock,{title:"TSS (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Uno o más síntomas somáticos angustiantes o que alteran significativamente la vida diaria."),
          e(Crit,{crit:"B",c:c},"Pensamientos, sentimientos o comportamientos excesivos relacionados con los síntomas, manifestados por ",e("b",null,"≥1 de 3"),": (1) pensamientos desproporcionados sobre la gravedad, (2) ansiedad persistente elevada sobre la salud o los síntomas, (3) tiempo y energía excesivos dedicados a los síntomas o la preocupación."),
          e(Crit,{crit:"C",c:c},"Aunque cualquier síntoma individual no esté siempre presente, el estado de estar sintomático es persistente (típicamente ",e("b",null,"≥6 meses"),").")
        ),
        tx:e("div",null,
          e(H3,{c:c},"Manejo clínico"),
          e(SxList,{c:c,items:[
            "Consulta FIJA con UN médico de cabecera (evita doctor-shopping)",
            "Visitas breves y regulares — NO 'por demanda'",
            "Validar el sufrimiento sin reforzar creencias catastróficas",
            "Exámenes solo los justificados por hallazgos nuevos",
            "TCC específica para TSS (evidencia sólida)",
            "ISRS si depresión o ansiedad comórbida marcada"
          ]}),
          e(Alert,{c:C.warn,label:"🔑 Regla de oro"},"NO repetir exámenes ya hechos. Cada 'examen normal' alivia al paciente unos días y luego reinicia la búsqueda. Un solo médico + visitas programadas breves es más efectivo que cualquier fármaco.")
        )
      }
    },
    {
      n:"02",name:"Trastorno de ansiedad por enfermedad (IAD)",c:c,
      blurb:"Preocupación por enfermar · Síntomas físicos leves/ausentes",
      sections:{
        def:e(Def,{c:c},"Preocupación por ",e("b",null,"tener o adquirir una enfermedad grave"),", con síntomas físicos ",e("b",null,"leves o ausentes"),". El paciente tiene alta ansiedad sobre su salud y realiza comportamientos excesivos (buscar reaseguro, revisarse) o ",e("b",null,"evita")," la atención médica. Reemplazó a la 'hipocondría' del DSM-IV."),
        cli:e("div",null,
          e(H3,{c:c},"Los 2 subtipos"),
          e(Table,{
            headers:[{t:"Tipo",c:c},{t:"Comportamiento",c:c}],
            rows:[
              ["Con solicitud de asistencia","Busca exámenes, consulta con múltiples médicos, exige pruebas"],
              ["Con evitación de asistencia","Evita consultas médicas por miedo a que confirmen la enfermedad"]
            ]
          }),
          e(Note,{c:c,t:"Diferencia con TSS"},"IAD: preocupación por enfermar, síntomas físicos ",e("b",null,"ausentes o leves"),". TSS: síntomas físicos ",e("b",null,"reales y angustiantes")," con respuesta desproporcionada.")
        ),
        dx:e(CritBlock,{title:"IAD (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Preocupación por padecer o adquirir una enfermedad grave."),
          e(Crit,{crit:"B",c:c},"Los síntomas somáticos no están presentes o si lo están son de intensidad leve."),
          e(Crit,{crit:"C",c:c},"Alto nivel de ansiedad acerca de la salud; el individuo se alarma fácilmente por su estado de salud."),
          e(Crit,{crit:"D",c:c},"Comportamientos excesivos relacionados con la salud (revisarse el cuerpo) o evitación desadaptativa (evita citas y hospitales)."),
          e(Crit,{crit:"E",c:c},"Duración ",e("b",null,"≥6 meses"),"."),
          e(Crit,{crit:"F",c:c},"No se explica mejor por otro trastorno mental (TSS, TOC, TDC, TAG, trastorno delirante somático).")
        ),
        tx:e(P,null,"Mismo enfoque que TSS: consulta fija, exámenes justificados, ",e("b",null,"TCC")," específica para ansiedad por salud (1ª línea). ",e("b",null,"ISRS")," si depresión/ansiedad comórbida marcada.")
      }
    },
    {
      n:"03",name:"Trastorno de conversión (síntomas neurológicos funcionales)",c:c,
      blurb:"Déficit neurológico sin causa orgánica · signos positivos",
      sections:{
        def:e(Def,{c:c},"Síntomas motores o sensitivos (",e("b",null,"parálisis, ceguera, afonía, crisis no epilépticas, ataxia, parestesias"),") que imitan trastornos neurológicos pero son ",e("b",null,"incompatibles")," con la exploración clínica o las pruebas complementarias. No son simulados — el paciente los vive como reales."),
        cli:e("div",null,
          e(H3,{c:c},"Signos 'positivos' clave"),
          e(Table,{
            headers:[{t:"Signo",c:c},{t:"Qué muestra",c:c}],
            rows:[
              ["Signo de Hoover ★","Paciente con 'parálisis' de una pierna no puede hacer extensión voluntaria, pero SÍ hay contracción contralateral involuntaria cuando intenta levantar la pierna sana"],
              ["Debilidad del pronador","Al sostener brazos en supinación, el brazo 'parético' pronará sin caer (en lesión real, caería)"],
              ["Crisis no epilépticas","Ojos cerrados con resistencia activa, pelvis thrust, movimientos asíncronos, no mordedura lateral de lengua, consciencia preservada con acción bilateral"],
              ["'La belle indifférence'","Aparente indiferencia emocional al déficit — no es específica ni sensible, ya no se considera criterio"]
            ]
          }),
          e(Alert,{c:C.bad,label:"⚠️ Trampa"},"La conversión NO es simulación. No requiere identificar un 'conflicto psicológico'. Basta con que los signos de exploración sean incompatibles con una lesión anatómica. Ya no se llama 'histeria'.")
        ),
        dx:e(CritBlock,{title:"Conversión (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Uno o más síntomas de alteración de la función motora o sensitiva voluntaria."),
          e(Crit,{crit:"B",c:c},"Los hallazgos clínicos aportan pruebas de la ",e("b",null,"incompatibilidad")," entre el síntoma y las afecciones neurológicas o médicas reconocidas."),
          e(Crit,{crit:"C",c:c},"El síntoma no se explica mejor por otro trastorno médico o mental."),
          e(Crit,{crit:"D",c:c},"Causa malestar o deterioro significativo, o exige una evaluación médica.")
        ),
        tx:e(P,null,"Comunicar el diagnóstico con claridad (',es real pero funcional, no hay lesión estructural'). ",e("b",null,"Fisioterapia"),", ",e("b",null,"TCC"),", técnicas de retroalimentación. NO es 'que se lo está inventando'. El pronóstico es mejor cuando el paciente acepta el diagnóstico temprano.")
      }
    },
    {
      n:"04",name:"Factores psicológicos que afectan otras afecciones médicas",c:c,
      blurb:"Enfermedad REAL + factores psicológicos que la empeoran",
      sections:{
        def:e(Def,{c:c},"Presencia de una enfermedad médica establecida + factores psicológicos o conductuales que afectan negativamente su curso (estrés laboral que exacerba el asma, ansiedad que descompensa diabetes, negación que impide adherencia)."),
        cli:e(P,null,"Es un diagnóstico útil cuando los factores psicológicos son clínicamente significativos en una enfermedad médica documentada. Los factores deben influir en el curso, tratamiento, recuperación, o constituir riesgos adicionales."),
        dx:e(CritBlock,{title:"Factores psicológicos en afección médica",c:c},
          e(Crit,{crit:"A",c:c},"Síntoma o afección médica (distinta a trastorno mental) presente."),
          e(Crit,{crit:"B",c:c},"Factores psicológicos o conductuales afectan adversamente la afección médica de las siguientes formas: (1) influyen en el curso, (2) interfieren con el tratamiento, (3) constituyen riesgos adicionales para la salud, (4) exacerban la fisiopatología.")
        ),
        tx:e(P,null,"Psicoterapia dirigida a los factores específicos (TCC para estrés, intervenciones motivacionales para adherencia). Colaboración estrecha con el equipo médico tratante de la enfermedad orgánica.")
      }
    },
    {
      n:"05",name:"Trastorno facticio",c:c,
      blurb:"PRODUCE síntomas intencionalmente sin ganancia externa",
      sections:{
        def:e(Def,{c:c},"El paciente ",e("b",null,"falsifica, produce o induce")," síntomas físicos o psicológicos en sí mismo (o en otro → 'impuesto a otro', antes Munchausen por poderes) con ",e("b",null,"motivación interna de asumir el rol de enfermo"),". NO hay recompensa externa evidente (a diferencia de la simulación)."),
        cli:e("div",null,
          e(H3,{c:c},"Trampa clásica: facticio vs conversión vs simulación"),
          e(Table,{
            headers:[{t:"Cuadro",c:c},{t:"Produce síntomas?",c:c},{t:"Conciencia",c:c},{t:"Motivación",c:c}],
            rows:[
              ["Conversión","NO (aparecen involuntariamente)","No consciente","No aplica — no los produce"],
              ["Facticio","SÍ los produce","CONSCIENTE","Rol de enfermo (interna)"],
              ["Simulación","SÍ los produce","CONSCIENTE","Ganancia externa clara (dinero, droga, evadir)"]
            ]
          }),
          e(Note,{c:c,t:"Síndrome de Munchausen"},"Término histórico para la forma más grave del facticio. El subtipo ",e("b",null,"'impuesto a otro'")," (antes Munchausen por poderes) es un cuadro grave en el que un cuidador produce síntomas en un tercero (típicamente hijo).")
        ),
        dx:e(CritBlock,{title:"Trastorno facticio (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Falsificación de signos o síntomas físicos/psicológicos, o inducción de lesión o enfermedad, asociada a engaño identificado."),
          e(Crit,{crit:"B",c:c},"El individuo se presenta a sí mismo (o a otro) como enfermo, incapacitado o lesionado."),
          e(Crit,{crit:"C",c:c},"El comportamiento engañoso es evidente ",e("b",null,"incluso en ausencia de recompensas externas evidentes"),"."),
          e(Crit,{crit:"D",c:c},"El comportamiento no se explica mejor por otro trastorno mental (delirio, trastorno psicótico).")
        ),
        tx:e("div",null,
          e(P,null,"Manejo difícil. Confrontación directa suele romper la relación. ",e("b",null,"Estrategia no punitiva"),": ofrecer salida del rol con 'salvar cara' (ej., 'a veces estas cosas mejoran con psicoterapia'). Coordinación entre servicios para evitar procedimientos innecesarios."),
          e(Alert,{c:C.bad,label:"⚠️ Facticio impuesto a otro"},"Emergencia — es una forma de ",e("b",null,"maltrato infantil")," (o del adulto dependiente). Involucrar servicios de protección. El cuidador perpetrador requiere evaluación y tratamiento psiquiátrico.")
        )
      }
    },
    // ═══ SECCIÓN B · DISOCIATIVOS ═══
    {
      n:"06",name:"Trastorno de identidad disociativo (TID)",c:cd,
      blurb:"≥2 estados de personalidad + lagunas de memoria",
      sections:{
        def:e(Def,{c:cd},"Presencia de ",e("b",null,"dos o más estados de personalidad distintos")," (o experiencia de posesión) con discontinuidades marcadas en el sentido del yo y de la agencia, acompañadas de ",e("b",null,"amnesia recurrente")," de acontecimientos cotidianos, información personal importante o eventos traumáticos. Antiguamente 'personalidad múltiple'."),
        cli:e("div",null,
          e(P,null,"Muy fuerte asociación con ",e("b",null,"trauma infantil severo y temprano")," (abuso sexual, negligencia). Prevalencia real discutida pero probable ~1%. Enorme comorbilidad con TEPT, depresión, autolesión, trastornos por sustancias, somatización."),
          e(Note,{c:cd,t:"Alters"},"Los distintos estados ('alters') pueden tener edad, género, afectos y memorias diferentes. El 'huésped' suele desconocer o conocer parcialmente a los otros. El cambio entre ellos se denomina 'switch'.")
        ),
        dx:e(CritBlock,{title:"TID (DSM-5)",c:cd},
          e(Crit,{crit:"A",c:cd},"Perturbación de la identidad con dos o más estados de personalidad bien definidos (en algunas culturas, experiencia de posesión)."),
          e(Crit,{crit:"B",c:cd},"Lagunas recurrentes en el recuerdo de acontecimientos cotidianos, información personal importante o eventos traumáticos."),
          e(Crit,{crit:"C",c:cd},"Causa malestar o deterioro clínicamente significativo."),
          e(Crit,{crit:"D",c:cd},"No forma parte normal de prácticas culturales o religiosas aceptadas."),
          e(Crit,{crit:"E",c:cd},"No atribuible a sustancias ni afección médica (crisis epilépticas complejas, etc.).")
        ),
        tx:e(P,null,"Psicoterapia trauma-informada en 3 fases: ",e("b",null,"estabilización → procesamiento del trauma → integración y rehabilitación"),". No hay fármaco específico; ISRS para síntomas depresivos/ansiosos comórbidos, prazosina para pesadillas. Evitar BZD por la disociación.")
      }
    },
    {
      n:"07",name:"Amnesia disociativa",c:cd,
      blurb:"Incapacidad para recordar info autobiográfica importante",
      sections:{
        def:e(Def,{c:cd},"Incapacidad para recordar ",e("b",null,"información autobiográfica importante"),", usualmente de naturaleza traumática o estresante, que excede el olvido normal. La información está almacenada (no destruida) y puede recuperarse con el tiempo o en contexto adecuado."),
        cli:e("div",null,
          e(H3,{c:cd},"Los 3 tipos"),
          e(Table,{
            headers:[{t:"Tipo",c:cd},{t:"Descripción",c:cd}],
            rows:[
              ["Localizada","Fallo para recordar un evento o periodo específico (el más común)"],
              ["Selectiva","Fallo parcial: recuerda algunos aspectos del evento pero no otros"],
              ["Generalizada","Fallo total de memoria autobiográfica · rara y muy grave"]
            ]
          }),
          e(H3,{c:cd,mt:14},"Fuga disociativa (especificador)"),
          e(P,null,"Viaje o deambulación aparentemente intencionada + amnesia de identidad o de otra información autobiográfica. El paciente puede asumir una nueva identidad temporal."),
          e(Alert,{c:C.bad,label:"⚠️ DDx crucial"},"Descartar SIEMPRE: ",e("b",null,"amnesia global transitoria")," (AGT · benigna, horas), ",e("b",null,"TCE"),", ",e("b",null,"Korsakoff")," (alcohol · confabulación), ",e("b",null,"ACV"),", ",e("b",null,"crisis epilépticas complejas"),". La amnesia disociativa NO tiene alteración de conciencia ni confabulación.")
        ),
        dx:e(CritBlock,{title:"Amnesia disociativa (DSM-5)",c:cd},
          e(Crit,{crit:"A",c:cd},"Incapacidad para recordar información autobiográfica importante, generalmente de naturaleza traumática o estresante, inconsistente con el olvido normal."),
          e(Crit,{crit:"B",c:cd},"Malestar o deterioro clínico."),
          e(Crit,{crit:"C",c:cd},"No atribuible a sustancias, trastorno neurológico u otra afección médica."),
          e(Crit,{crit:"D",c:cd},"No se explica mejor por otro trastorno disociativo, TEPT, trastorno neurocognitivo mayor, etc.")
        ),
        tx:e(P,null,"Psicoterapia. La recuperación de memoria suele ser espontánea con el tiempo o en contexto seguro. Evitar presionar al paciente a 'recordar'. Tratar comorbilidades (ansiedad, depresión).")
      }
    },
    {
      n:"08",name:"Trastorno de despersonalización / desrealización",c:cd,
      blurb:"Sentirse irreal o percibir el mundo como irreal",
      sections:{
        def:e(Def,{c:cd},"Experiencias persistentes o recurrentes de ",e("b",null,"despersonalización")," (sentirse irreal, separado de sí mismo, observador externo) y/o ",e("b",null,"desrealización")," (el mundo parece irreal, como en un sueño, vidrioso). La prueba de realidad permanece intacta — el paciente SABE que es una sensación."),
        cli:e("div",null,
          e(Note,{c:cd,t:"Despersonalización vs desrealización"},e("b",null,"Despersonalización:")," 'yo no soy yo', 'me veo desde afuera'. ",e("b",null,"Desrealización:")," 'el mundo no es real', 'como si estuviera en una película'."),
          e(Pearl,{t:"Experiencia transitoria vs trastorno"},"~50% de adultos sanos ha experimentado despersonalización alguna vez (fatiga, estrés agudo, alcohol, cannabis). Solo es patológico cuando es persistente, recurrente y causa malestar o deterioro.")
        ),
        dx:e(CritBlock,{title:"Despersonalización / desrealización (DSM-5)",c:cd},
          e(Crit,{crit:"A",c:cd},"Presencia de experiencias persistentes o recurrentes de despersonalización y/o desrealización."),
          e(Crit,{crit:"B",c:cd},e("b",null,"Prueba de realidad intacta")," durante las experiencias."),
          e(Crit,{crit:"C",c:cd},"Malestar o deterioro clínico."),
          e(Crit,{crit:"D",c:cd},"No atribuible a sustancia o afección médica (crisis, migraña)."),
          e(Crit,{crit:"E",c:cd},"No se explica mejor por esquizofrenia, pánico, depresión mayor, TEA, TID u otro trastorno disociativo.")
        ),
        tx:e(P,null,"Psicoterapia (TCC para despersonalización · psicoeducación · mindfulness). Los ISRS tienen evidencia limitada. Tratar comorbilidades (pánico, depresión). Evitar sustancias que disparen episodios (cannabis, alucinógenos).")
      }
    }
  ];

  var s1=useState(null);var openGen=s1[0],setOpenGen=s1[1];
  var general=[
    {id:"conceptos",ic:"🧭",t:"Conceptos generales",sub:"Somáticos · Disociativos",c:c,
     content:e("div",null,
       e(P,null,"Dos capítulos del DSM-5 que se presentan juntos por afinidad clínica y diagnóstico diferencial frecuente."),
       e(H3,{c:c,mt:14},"Somáticos · 5 entidades"),
       e(P,null,"Los síntomas físicos son el centro del sufrimiento. DSM-5 reorganizó drásticamente este capítulo eliminando el requisito de 'sin explicación médica'. Ahora lo clave es la ",e("b",null,"respuesta psicológica")," al síntoma."),
       e(H3,{c:cd,mt:14},"Disociativos · 3 entidades"),
       e(P,null,"Discontinuidad en la conciencia, memoria, identidad o percepción. Frecuentemente asociados a trauma infantil. La prueba de realidad suele estar conservada.")
     )},
    {id:"tabla_som",ic:"🧭",t:"Los 3 grandes del somático",sub:"TSS vs IAD vs conversión",c:c,
     content:e(Table,{
       headers:[{t:"Trastorno",c:c},{t:"Síntomas físicos",c:c},{t:"Foco psicológico",c:c}],
       rows:[
         ["TSS","REALES + angustiantes","Pensamientos/ansiedad desproporcionados"],
         ["IAD","Ausentes o leves","Preocupación por ENFERMAR"],
         ["Conversión","REALES pero funcionales (incompatibles con lesión)","Pérdida de función neurológica sin causa orgánica"]
       ]
     })},
    {id:"tabla_enga",ic:"🎭",t:"Facticio vs Conversión vs Simulación",sub:"Tabla oro de examen",c:c,
     content:e("div",null,
       e(P,null,"Pregunta clásica que casi siempre cae. La clave son dos ejes: ",e("b",null,"si el paciente produce los síntomas intencionadamente")," y ",e("b",null,"la motivación"),"."),
       e(Table,{
         headers:[{t:"Cuadro",c:c},{t:"Produce síntomas?",c:c},{t:"Conciencia",c:c},{t:"Motivación",c:c}],
         rows:[
           ["Conversión","NO (involuntarios)","No consciente","Ninguna · vive los síntomas como reales"],
           ["Facticio","SÍ","CONSCIENTE","INTERNA — asumir el rol de enfermo"],
           ["Simulación","SÍ","CONSCIENTE","EXTERNA — ganancia clara (dinero, evadir trabajo, obtener droga)"]
         ]
       }),
       e(Note,{c:c,t:"Simulación NO es trastorno mental"},"Está en el DSM-5 como 'código adicional' (no trastorno). Requiere sospecha clínica + contexto (juicios, beneficios secundarios).")
     )},
    {id:"tx_som",ic:"💊",t:"Tx general de somáticos",sub:"Principios compartidos",c:c,
     content:e("div",null,
       e(SxList,{c:c,items:[
         "Consulta FIJA con UN médico — evita doctor-shopping",
         "Visitas breves, regulares, programadas (no 'por demanda')",
         "Validar el sufrimiento sin reforzar creencias catastróficas",
         "No repetir exámenes ya hechos; solo los justificados por hallazgos nuevos",
         "TCC específica — 1ª línea psicoterapéutica",
         "ISRS si hay comorbilidad depresiva o ansiosa"
       ]})
     )},
    {id:"tx_dis",ic:"💊",t:"Tx de los disociativos",sub:"Psicoterapia trauma-informada",c:cd,
     content:e("div",null,
       e(P,null,"No hay fármaco con indicación específica. La ",e("b",null,"psicoterapia trauma-informada")," es la base. Tres fases:"),
       e(SxList,{c:cd,items:[
         "Estabilización (seguridad, habilidades para regular afecto y disociación)",
         "Procesamiento del trauma (cuando el paciente esté estable)",
         "Integración y rehabilitación (reconectar identidad, relaciones, vida cotidiana)"
       ]}),
       e(P,null,e("b",null,"Farmacoterapia sintomática:")," ISRS para depresión/ansiedad · prazosina para pesadillas · evitar BZD por riesgo de disociación."),
       e(Alert,{c:C.bad,label:"⚠️ Trampas"},"NO presionar a 'recordar' en amnesia disociativa — el recuerdo suele volver solo en contexto seguro. NO tratar los 'alters' del TID como entidades separadas; el objetivo es la integración.")
     )},
    {id:"perlas",ic:"📌",t:"Perlas de examen",sub:"Alto rendimiento",c:c,
     content:e("div",null,
       e(Pearl,{t:"TSS ≠ IAD"},"TSS: síntomas físicos REALES + respuesta psicológica excesiva. IAD: preocupación por ENFERMAR con síntomas físicos ausentes o leves."),
       e(Pearl,{t:"Signo de Hoover"},"Conversión con 'parálisis' de pierna: al intentar levantar la pierna sana, la 'parética' hace contracción INVOLUNTARIA por acoplamiento contralateral. Signo 'positivo' → conversión."),
       e(Pearl,{t:"Facticio: motivación INTERNA"},"Diferencia clave con simulación. En facticio el paciente quiere el rol de enfermo; en simulación quiere dinero, licencia, droga o evadir algo."),
       e(Pearl,{t:"Munchausen por poderes (facticio impuesto a otro)"},"Es ABUSO. Requiere protección del niño/dependiente y tratamiento del perpetrador."),
       e(Pearl,{t:"La belle indifférence"},"Término histórico. NO es específica ni sensible de conversión. Ya no es criterio DSM, pero aparece en preguntas."),
       e(Pearl,{t:"Amnesia disociativa vs orgánica"},"Disociativa: preserva conciencia, sin confabulación, información recuperable. Korsakoff: confabulación + déficit ejecutivo + déficits de tiamina."),
       e(Pearl,{t:"Despersonalización transitoria es NORMAL"},"~50% de adultos sanos la ha experimentado alguna vez (fatiga, estrés, cannabis). Solo es trastorno cuando es persistente + deterioro."),
       e(Pearl,{t:"TID y trauma infantil"},"La asociación con trauma severo temprano es casi constante. Evaluar comorbilidad con TEPT, autolesión, sustancias."),
       e(Pearl,{t:"Conversión · no se llama histeria"},"Término obsoleto. El DSM-5 lo renombró 'síntomas neurológicos funcionales'. Los signos positivos reemplazan la búsqueda de 'conflicto psicológico'.")
     )},
    {id:"resumen",ic:"📊",t:"Resumen comparativo",sub:"Las 8 entidades",c:c,
     content:e("div",null,
       e(H3,{c:c},"Somáticos"),
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"Núcleo",c:c},{t:"Tx",c:c}],
         rows:[
           ["TSS","Síntomas físicos REALES + respuesta desproporcionada","Consulta fija + TCC ± ISRS"],
           ["IAD","Preocupación por enfermar, síntomas ausentes/leves","TCC + ISRS si comorbilidad"],
           ["Conversión","Déficit neurológico funcional · signos positivos","Comunicación clara + fisioterapia + TCC"],
           ["Factores psicológicos en afección médica","Enfermedad real + factores psico que la empeoran","Intervenciones específicas + coord médica"],
           ["Facticio","Produce síntomas · motivación INTERNA","Estrategia no punitiva + salida con 'salvar cara'"]
         ]
       }),
       e(H3,{c:cd,mt:14},"Disociativos"),
       e(Table,{
         headers:[{t:"Trastorno",c:cd},{t:"Núcleo",c:cd},{t:"Tx",c:cd}],
         rows:[
           ["TID","≥2 estados de personalidad + amnesia","Psicoterapia trauma-informada 3 fases"],
           ["Amnesia disociativa","Incapacidad de recordar info autobiográfica","Psicoterapia · recuperación espontánea"],
           ["Despersonalización/desrealización","Sensación de irrealidad · prueba de realidad intacta","TCC + psicoeducación"]
         ]
       })
     )},
    {id:"flash",ic:"🃏",t:"Flashcards",sub:"14 preguntas + las tuyas",c:c,
     content:e("div",null,
       e(P,null,"Tarjetas de repaso de somáticos y disociativos. Añade las tuyas."),
       e(FlashDeck,{c:c,deckId:"somaticos",items:getAllCards("somaticos")})
     )},
    {id:"quiz",ic:"❓",t:"Quiz · 6 casos clínicos",sub:"Prueba tus conocimientos",c:c,
     content:e(Quiz,{c:c,items:getAllQuiz("somaticos")})}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Tema 4 · Neurosis · DSM-5-TR",title:"Somáticos y disociativos"},
      "Dos capítulos del DSM-5 que se presentan juntos por afinidad clínica y diagnóstico diferencial frecuente. ",e("b",null,"5 trastornos somáticos")," (síntomas físicos como centro del sufrimiento) + ",e("b",null,"3 disociativos")," (discontinuidad en conciencia, memoria, identidad o percepción). Total: ",e("b",null,"8 entidades"),"."
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.3),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Conceptos · DDx claves · Flashcards · Quiz")
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
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Las 8 enfermedades"),
      e("div",{style:{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Toca cualquier enfermedad para abrir su ficha"),
      e("div",{style:{fontSize:12,color:C.mt,marginTop:4,lineHeight:1.45}},"Las primeras 5 son somáticas (verde) · las últimas 3 disociativas (rosa)")
    ),
    e(DzGrid,{c:c,items:diseases}),

    e(Abbrev,{c:c,items:[
      {a:"TSS",d:"Trastorno de Síntomas Somáticos"},
      {a:"IAD",d:"Illness Anxiety Disorder (ansiedad por enfermedad)"},
      {a:"TID",d:"Trastorno de Identidad Disociativo"},
      {a:"ISRS",d:"Inhibidores Selectivos de la Recaptación de Serotonina"},
      {a:"TCC",d:"Terapia Cognitivo-Conductual"},
      {a:"BZD",d:"Benzodiacepinas"},
      {a:"AGT",d:"Amnesia Global Transitoria"}
    ]})
  );
}

// ══════════════════════════════════════════════════════════════
// HUB RAÍZ · Psicosis vs Neurosis
// ══════════════════════════════════════════════════════════════


