// ══════════════════════════════════════════════════════════════
// TEMA 6 · TRASTORNOS DEL SUEÑO-VIGILIA
// ══════════════════════════════════════════════════════════════

function SueView(p){
  var c=C.sue;
  var diseases=[
    {
      n:"01",name:"Trastorno de insomnio",c:c,
      blurb:"Dificultad para iniciar/mantener el sueño · ≥3 noches/sem · ≥3 meses",
      sections:{
        def:e(Def,{c:c},"Insatisfacción predominante con la cantidad o calidad del sueño, asociada con ",e("b",null,"dificultad para iniciar el sueño, para mantenerlo")," (despertares nocturnos con dificultad para volver a dormir), o con ",e("b",null,"despertar precoz")," sin capacidad de volver a dormir. Causa malestar o deterioro diurno significativo."),
        cli:e("div",null,
          e(H3,{c:c},"Epidemiología"),
          e(SxList,{c:c,items:[
            "Prevalencia ~10–15% como trastorno (síntomas ocasionales ~30%)",
            "Más frecuente en mujeres (~1.4:1) y adultos mayores",
            "Alta comorbilidad con depresión, ansiedad, dolor crónico, enfermedad médica",
            "Curso crónico en ~50% de los casos"
          ]}),
          e(H3,{c:c,mt:14},"Especificadores"),
          e(SxList,{c:c,items:[
            "Con comorbilidad mental no relacionada con el sueño (p. ej., depresión)",
            "Con otra comorbilidad médica",
            "Con otro trastorno del sueño",
            "Episódico (1–3 meses) · Persistente (≥3 meses) · Recurrente (≥2 episodios en 1 año)"
          ]}),
          e(H3,{c:c,mt:14},"Factores perpetuadores (Modelo 3P de Spielman)"),
          e(Table,{
            headers:[{t:"Factor",c:c},{t:"Descripción",c:c}],
            rows:[
              ["Predisponentes","Genética, rasgo ansioso, edad, sexo femenino"],
              ["Precipitantes","Estresor vital, duelo, cambio de turno, enfermedad aguda"],
              ["Perpetuadores","Hábitos de sueño disfuncionales (siesta larga, permanecer en cama despierto, consumo de cafeína, ansiedad anticipatoria)"]
            ]
          })
        ),
        dx:e(CritBlock,{title:"Trastorno de insomnio (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Queja predominante de insatisfacción con la cantidad o calidad del sueño, con ≥1 de: (1) dificultad para iniciar el sueño, (2) dificultad para mantenerlo, (3) despertar precoz sin capacidad para volver a dormir."),
          e(Crit,{crit:"B",c:c},"La alteración causa malestar clínicamente significativo o deterioro."),
          e(Crit,{crit:"C",c:c},"La dificultad del sueño se produce al menos ",e("b",null,"3 noches por semana"),"."),
          e(Crit,{crit:"D",c:c},"La dificultad persiste durante al menos ",e("b",null,"3 meses"),"."),
          e(Crit,{crit:"E",c:c},"La dificultad se produce a pesar de oportunidades adecuadas para dormir."),
          e(Crit,{crit:"F",c:c},"No se explica mejor por otro trastorno del sueño."),
          e(Crit,{crit:"G",c:c},"No atribuible a sustancias."),
          e(Crit,{crit:"H",c:c},"Los trastornos mentales y afecciones médicas coexistentes no explican adecuadamente la queja predominante de insomnio.")
        ),
        tx:e("div",null,
          e(H3,{c:c},"1ª línea: TCC-I (TCC para insomnio)"),
          e(SxList,{c:c,items:[
            "Educación sobre higiene del sueño",
            "Control de estímulos (cama = dormir + sexo · no TV, no comida, no trabajo)",
            "Restricción de sueño (acortar tiempo en cama para aumentar eficiencia)",
            "Reestructuración cognitiva sobre creencias disfuncionales",
            "Relajación (respiración, imaginería)"
          ]}),
          e(H3,{c:c,mt:14},"Farmacoterapia"),
          e(Table,{
            headers:[{t:"Grupo",c:c},{t:"Fármacos",c:c},{t:"Notas",c:c}],
            rows:[
              ["Antagonistas de orexina","Suvorexant, lemborexant, daridorexant","Nuevos · poco riesgo de dependencia"],
              ["Agonistas de melatonina","Ramelteón, melatonina","Útil para inicio del sueño · sin dependencia"],
              ["Z-drugs (BZRA no BZD)","Zolpidem, zaleplón, eszopiclona","Efectivos pero riesgo de sonambulismo, caídas"],
              ["BZD","Temazepam, triazolam","Uso CORTO · riesgo de dependencia"],
              ["Sedantes atípicos","Doxepina dosis baja (3–6 mg), mirtazapina","Si comorbilidad depresiva"],
              ["No recomendados rutinariamente","Difenhidramina, quetiapina","Efectos adversos anticolinérgicos · riesgo de caídas"]
            ]
          }),
          e(Alert,{c:C.warn,label:"🔑 Regla de oro"},"TCC-I es ",e("b",null,"1ª línea"),", equivalente o superior a fármacos a largo plazo. Fármacos preferentemente para uso corto (≤4 semanas) o puente.")
        )
      }
    },
    {
      n:"02",name:"Hipersomnia (trastorno de hipersomnolencia)",c:c,
      blurb:"Somnolencia diurna excesiva pese a sueño nocturno ≥7h",
      sections:{
        def:e(Def,{c:c},"Somnolencia excesiva a pesar de un período principal de sueño de ≥7 horas, con ≥1 de: episodios recurrentes de sueño o lapsos de sueño en el mismo día, un período principal de sueño prolongado (≥9 h) no reparador, dificultad para estar plenamente despierto tras un despertar abrupto."),
        cli:e("div",null,
          e(P,null,"Prevalencia ~1%. Inicio típico en adolescencia/adultez temprana. Debe diferenciarse de insomnio con ",e("i",null,"percepción")," de cansancio — aquí el dato clave es el deseo imperioso de dormir más."),
          e(Note,{c:c,t:"Hallazgos PSG"},"Polisomnografía: latencia de sueño corta + ausencia de SOREMPs (inicios REM tempranos). Prueba de latencia múltiple del sueño (MSLT): latencia media ≤8 min.")
        ),
        dx:e(CritBlock,{title:"Hipersomnia (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Somnolencia excesiva autorreportada a pesar de ≥7 h de sueño, con ≥1 de los 3 síntomas descritos."),
          e(Crit,{crit:"B",c:c},"Se produce ≥3 veces/semana durante ≥3 meses."),
          e(Crit,{crit:"C",c:c},"Acompañada de malestar o deterioro."),
          e(Crit,{crit:"D",c:c},"No se explica mejor por otro trastorno del sueño (narcolepsia, apnea)."),
          e(Crit,{crit:"E",c:c},"No atribuible a sustancias."),
          e(Crit,{crit:"F",c:c},"Los trastornos mentales y médicos coexistentes no explican la somnolencia predominante.")
        ),
        tx:e(P,null,e("b",null,"Modafinilo o armodafinilo")," son 1ª línea (estimulantes promotores de alerta, sin la adicción clásica de anfetaminas). Metilfenidato o anfetaminas en casos refractarios. Higiene del sueño estricta. Evitar conducir si hay somnolencia no controlada.")
      }
    },
    {
      n:"03",name:"Narcolepsia",c:c,
      blurb:"Ataques irresistibles de sueño · con o sin cataplejía",
      sections:{
        def:e(Def,{c:c},"Ataques recurrentes de necesidad irresistible de dormir o siestas involuntarias ",e("b",null,"≥3 veces por semana durante los últimos 3 meses"),". Se asocia con fenómenos de ",e("b",null,"disociación sueño-vigilia")," y en su forma clásica con ",e("b",null,"cataplejía")," (pérdida súbita y bilateral del tono muscular desencadenada por emoción, con conciencia preservada)."),
        cli:e("div",null,
          e(H3,{c:c},"Tétrada clásica"),
          e(Table,{
            headers:[{t:"Síntoma",c:c},{t:"Descripción",c:c}],
            rows:[
              ["Ataques de sueño","Somnolencia diurna extrema con ataques irresistibles"],
              ["Cataplejía ★","Pérdida súbita y bilateral del tono muscular (cae mandíbula, flexión de rodillas) precipitada por emoción (risa, sorpresa). Dura seg-min · conciencia preservada"],
              ["Alucinaciones hipnagógicas / hipnopómpicas","Experiencias vívidas al dormirse o despertarse"],
              ["Parálisis del sueño","Incapacidad temporal para moverse al dormirse o despertarse"]
            ]
          }),
          e(H3,{c:c,mt:14},"Fisiopatología"),
          e(P,null,"Pérdida autoinmune de neuronas hipotalámicas productoras de ",e("b",null,"orexina (hipocretina)"),". Asociación con HLA-DQB1*06:02. Hipocretina en LCR ",e("b",null,"disminuida")," o indetectable en tipo 1 (con cataplejía)."),
          e(H3,{c:c,mt:14},"PSG y MSLT"),
          e(SxList,{c:c,items:[
            "Latencia media de sueño ≤8 min en MSLT",
            "≥2 SOREMPs (inicios REM en los primeros 15 min de un episodio de sueño)",
            "PSG previa descarta otras causas"
          ]})
        ),
        dx:e(CritBlock,{title:"Narcolepsia (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Episodios de necesidad irrefrenable de dormir, lapsos de sueño o siestas en el mismo día, ≥3 veces/sem × 3 meses."),
          e(Crit,{crit:"B",c:c},"Presencia de ≥1: (1) episodios de cataplejía, (2) deficiencia de hipocretina en LCR, (3) PSG/MSLT con ≥2 SOREMPs y latencia ≤8 min.")
        ),
        tx:e("div",null,
          e(Table,{
            headers:[{t:"Diana",c:c},{t:"Fármaco",c:c}],
            rows:[
              ["Somnolencia","Modafinilo, armodafinilo (1ª línea) · metilfenidato, anfetaminas (2ª)"],
              ["Cataplejía","Oxibato de sodio (gold standard) · pitolisant · venlafaxina, atomoxetina, clomipramina"],
              ["Consolidar sueño nocturno","Oxibato de sodio"]
            ]
          }),
          e(Note,{c:c,t:"Medidas no farmacológicas"},"Siestas programadas de 15–20 min 2–3 veces al día, buena higiene del sueño, evitar conducción/máquinas peligrosas si no está controlada.")
        )
      }
    },
    {
      n:"04",name:"Apnea obstructiva del sueño (AOS)",c:c,
      blurb:"Pausas respiratorias · ronquido · somnolencia · índice AH ≥5",
      sections:{
        def:e(Def,{c:c},"Trastorno caracterizado por episodios repetitivos de ",e("b",null,"obstrucción parcial o total de la vía aérea superior durante el sueño"),", con desaturación arterial y fragmentación del sueño. Es el más frecuente de los trastornos respiratorios relacionados con el sueño."),
        cli:e("div",null,
          e(H3,{c:c},"Tríada clásica"),
          e(SxList,{c:c,items:[
            "Ronquido fuerte, intermitente, con pausas respiratorias presenciadas",
            "Somnolencia diurna excesiva",
            "Sueño no reparador con despertares con sensación de ahogo"
          ]}),
          e(H3,{c:c,mt:14},"Factores de riesgo"),
          e(SxList,{c:c,items:[
            "Obesidad (IMC >30)",
            "Sexo masculino",
            "Edad >50 años (mujeres posmenopáusicas)",
            "Cuello grande (>43 cm varones, >40 cm mujeres)",
            "Anomalías craneofaciales (retrognatia, micrognatia)",
            "Hipotiroidismo, acromegalia",
            "Consumo de alcohol, tabaco, sedantes"
          ]}),
          e(H3,{c:c,mt:14},"Complicaciones"),
          e(SxList,{c:c,items:[
            "HTA resistente",
            "Arritmias (FA especialmente)",
            "Insuficiencia cardíaca",
            "ACV",
            "Diabetes tipo 2",
            "Accidentes de tránsito (por somnolencia)"
          ]}),
          e(Pearl,{t:"Escala de Epworth"},"Instrumento de tamizaje: 8 situaciones en las que el paciente evalúa su probabilidad de dormirse (0–3 puntos cada una). ",e("b",null,"Puntuación >10 = somnolencia excesiva"),".")
        ),
        dx:e(CritBlock,{title:"Apnea obstructiva del sueño (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Evidencia en polisomnografía de ≥5 apneas o hipopneas obstructivas por hora, junto con ≥1 de: (1) alteraciones respiratorias nocturnas (ronquidos, resoplidos/jadeos, pausas), (2) somnolencia diurna, fatiga o sueño no reparador no explicados por otra causa. ",e("b",null,"O")," evidencia de ≥15 apneas o hipopneas obstructivas por hora (independiente de síntomas)."),
          e(Crit,{crit:"Gravedad",c:c},"Leve: IAH 5–14 · Moderada: IAH 15–30 · Grave: IAH >30.")
        ),
        tx:e("div",null,
          e(Table,{
            headers:[{t:"Intervención",c:c},{t:"Indicación",c:c}],
            rows:[
              ["CPAP nasal ★","1ª línea en AOS moderada-grave · gold standard"],
              ["Pérdida de peso","Todos los pacientes con sobrepeso/obesidad"],
              ["Higiene del sueño","Evitar alcohol y sedantes · dormir de lado"],
              ["Dispositivos orales de avance mandibular","AOS leve-moderada o intolerancia a CPAP"],
              ["Cirugía (uvulopalatofaringoplastia, maxilar)","Casos seleccionados refractarios"]
            ]
          }),
          e(Alert,{c:C.bad,label:"⚠️ CONTRAINDICADOS"},e("b",null,"BZD y opioides están contraindicados")," en AOS — deprimen aún más la ventilación.")
        )
      }
    },
    {
      n:"05",name:"Trastornos del ritmo circadiano",c:c,
      blurb:"Desfase entre el reloj interno y el horario deseado",
      sections:{
        def:e(Def,{c:c},"Patrón persistente de alteración del sueño debido a ",e("b",null,"desalineación")," entre el ritmo circadiano endógeno y el horario de sueño-vigilia requerido por el entorno del individuo."),
        cli:e("div",null,
          e(H3,{c:c},"Subtipos"),
          e(Table,{
            headers:[{t:"Subtipo",c:c},{t:"Característica",c:c}],
            rows:[
              ["Tipo fase retrasada","Sueño se inicia MUY TARDE · despertar también tardío · frecuente en adolescentes y adultos jóvenes"],
              ["Tipo fase avanzada","Sueño se inicia MUY TEMPRANO y despertar temprano · frecuente en adultos mayores"],
              ["Tipo sueño-vigilia irregular","Sueño fragmentado en 3+ periodos cortos al día · frecuente en demencia"],
              ["Tipo ciclo sueño-vigilia no de 24 h","Típico en personas ciegas (falta de zeitgeber fótico)"],
              ["Tipo turnos laborales","Cambios de turno que desalinean el ritmo"],
              ["Tipo jet-lag","Transitorio por cambio de huso horario"]
            ]
          })
        ),
        dx:e(CritBlock,{title:"Ritmo circadiano (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Patrón persistente o recurrente de alteración del sueño debido a desalineación circadiana."),
          e(Crit,{crit:"B",c:c},"La alteración produce síntomas de insomnio, somnolencia excesiva o ambos."),
          e(Crit,{crit:"C",c:c},"Causa malestar o deterioro.")
        ),
        tx:e("div",null,
          e(Table,{
            headers:[{t:"Subtipo",c:c},{t:"Manejo",c:c}],
            rows:[
              ["Fase retrasada","Melatonina vespertina (3–5 h antes de DLMO) · fototerapia matutina · cronoterapia"],
              ["Fase avanzada","Fototerapia vespertina"],
              ["Jet-lag","Melatonina 0.5–3 mg al horario de destino · fototerapia"],
              ["Turnos","Siestas estratégicas · fototerapia durante trabajo · modafinilo en casos graves"]
            ]
          })
        )
      }
    },
    {
      n:"06",name:"Síndrome de piernas inquietas (SPI / Willis-Ekbom)",c:c,
      blurb:"Urgencia de mover piernas con disestesias · peor en reposo y noche",
      sections:{
        def:e(Def,{c:c},"Urgencia de mover las piernas, habitualmente acompañada o causada por sensaciones incómodas en ellas (hormigueo, picazón, ardor, 'algo que camina por dentro'). Se alivia con el movimiento y empeora en reposo y al caer la noche."),
        cli:e("div",null,
          e(H3,{c:c},"Los 5 criterios URGE"),
          e(SxList,{c:c,items:[
            "U — Urgencia de mover piernas (+/- disestesias)",
            "R — Reposo la empeora",
            "G — El movimiento la alivia (Getting up)",
            "E — Empeora por la noche (Evening)",
            "No explicado por otra condición"
          ]}),
          e(H3,{c:c,mt:14},"Asociaciones clave"),
          e(SxList,{c:c,items:[
            "Déficit de hierro (ferritina <75 ng/mL es factor precipitante clave)",
            "Insuficiencia renal terminal · hemodiálisis",
            "Embarazo (3er trimestre)",
            "Diabetes · neuropatía periférica",
            "Fármacos que empeoran SPI: ISRS/IRSN, antipsicóticos, antihistamínicos, metoclopramida"
          ]}),
          e(Pearl,{t:"Ferritina siempre"},"En todo SPI medir ferritina. Si <75 ng/mL, suplementar ",e("b",null,"hierro oral")," mejora el cuadro significativamente.")
        ),
        dx:e(CritBlock,{title:"SPI (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Urgencia de mover las piernas con los 4 criterios URGE."),
          e(Crit,{crit:"B",c:c},"Síntomas ≥3 veces/semana por ≥3 meses."),
          e(Crit,{crit:"C",c:c},"Malestar o deterioro clínicamente significativo."),
          e(Crit,{crit:"D",c:c},"No atribuibles a otra afección médica (neuropatía, artritis, edema, calambres)."),
          e(Crit,{crit:"E",c:c},"No se explican por sustancia o medicamento.")
        ),
        tx:e("div",null,
          e(Table,{
            headers:[{t:"Línea",c:c},{t:"Opción",c:c}],
            rows:[
              ["1ª (SI ferritina baja)","Hierro oral o IV (hasta ferritina >75)"],
              ["1ª farmacológica","Gabapentinoides: gabapentina enacarbil, pregabalina"],
              ["Alternativa","Agonistas dopaminérgicos (pramipexol, ropinirol, rotigotina)"],
              ["Casos refractarios","Oxicodona-naloxona o metadona a bajas dosis"]
            ]
          }),
          e(Alert,{c:C.bad,label:"⚠️ Fenómeno de aumentación"},"Efecto adverso clásico de agonistas dopaminérgicos: el tratamiento empeora el SPI (aparece antes, más intenso, en más partes del cuerpo). Por eso ",e("b",null,"gabapentinoides desplazaron a los agonistas como 1ª línea farmacológica"),".")
        )
      }
    },
    {
      n:"07",name:"Trastornos del despertar NREM (sonambulismo / terror nocturno)",c:c,
      blurb:"Parasomnias de ondas lentas · 1ª mitad noche · amnesia",
      sections:{
        def:e(Def,{c:c},"Episodios recurrentes de despertar incompleto desde el ",e("b",null,"sueño profundo N3 (ondas lentas)"),", generalmente en el primer tercio del periodo principal de sueño. Dos subtipos: sonambulismo y terror nocturno."),
        cli:e("div",null,
          e(Table,{
            headers:[{t:"Subtipo",c:c},{t:"Descripción",c:c}],
            rows:[
              ["Sonambulismo","El paciente se levanta, camina, puede realizar conductas complejas. Cara en blanco, no responde. Difícil de despertar. AMNESIA del episodio"],
              ["Terror nocturno","Despertar con grito de pánico, miedo intenso, taquicardia, sudoración, midriasis. Dura 1–10 min. AMNESIA del episodio · no recuerda pesadillas"]
            ]
          }),
          e(Note,{c:c,t:"Clave: diferenciación con pesadillas"},"Terror nocturno: 1ª mitad de la noche · sueño N3 · amnesia · no relato de sueño. Pesadilla: 2ª mitad de la noche · sueño REM · recuerdo vívido · despertar completo.")
        ),
        dx:e(CritBlock,{title:"Trastornos del despertar NREM (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Episodios recurrentes de despertar incompleto desde el sueño, con sonambulismo o terror nocturno."),
          e(Crit,{crit:"B",c:c},"Ausencia o escaso recuerdo de imágenes oníricas."),
          e(Crit,{crit:"C",c:c},"Amnesia del episodio."),
          e(Crit,{crit:"D",c:c},"Malestar o deterioro clínico."),
          e(Crit,{crit:"E",c:c},"No atribuible a sustancia ni afección médica."),
          e(Crit,{crit:"F",c:c},"No se explican por otro trastorno mental.")
        ),
        tx:e("div",null,
          e(SxList,{c:c,items:[
            "Tranquilización + educación (frecuente en niños, suele resolver con la edad)",
            "Seguridad del entorno (cerrar ventanas, bajar altura de camas)",
            "Tratar desencadenantes: privación de sueño, fiebre, alcohol, estrés",
            "Clonazepam a dosis baja en casos severos o con riesgo",
            "NO despertar bruscamente al sonámbulo — guiarlo suavemente de vuelta a la cama"
          ]})
        )
      }
    },
    {
      n:"08",name:"Trastorno de pesadillas",c:c,
      blurb:"Pesadillas recurrentes · sueño REM · 2ª mitad · despertar completo",
      sections:{
        def:e(Def,{c:c},"Aparición repetida de sueños disfóricos extensos y muy bien recordados, que implican esfuerzos para evitar amenazas a la supervivencia, seguridad o integridad física. Ocurren típicamente en la ",e("b",null,"segunda mitad")," del periodo de sueño (sueño REM)."),
        cli:e("div",null,
          e(P,null,"Al despertar el individuo está ",e("b",null,"orientado y alerta"),", puede describir el sueño con detalle. Muy relacionado con TEPT (el 'trauma de pesadilla' del TEPT entra aquí como síntoma, no como diagnóstico principal)."),
          e(Note,{c:c,t:"Especificadores"},e("b",null,"Aguda:")," <1 mes · ",e("b",null,"Subaguda:")," 1–6 meses · ",e("b",null,"Persistente:")," ≥6 meses.")
        ),
        dx:e(CritBlock,{title:"Trastorno de pesadillas (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Aparición repetida de sueños disfóricos extensos y bien recordados que implican amenazas."),
          e(Crit,{crit:"B",c:c},"Al despertar, el individuo se orienta rápidamente."),
          e(Crit,{crit:"C",c:c},"Malestar clínico o deterioro."),
          e(Crit,{crit:"D",c:c},"No atribuibles a sustancia ni afección médica."),
          e(Crit,{crit:"E",c:c},"Coexistentes trastornos mentales no explican adecuadamente la queja.")
        ),
        tx:e("div",null,
          e(SxList,{c:c,items:[
            "Terapia de ensayo por imágenes (IRT) — 1ª línea · el paciente reescribe el final del sueño con contenido no amenazante y lo ensaya diurnamente",
            "TCC para pesadillas",
            "Prazosina 1–10 mg nocturnos (especialmente si TEPT comórbido)",
            "Tratar TEPT subyacente si corresponde"
          ]})
        )
      }
    },
    {
      n:"09",name:"Trastorno de conducta del sueño REM (TCSR)",c:c,
      blurb:"Ausencia de atonía REM · actúa sus sueños · riesgo Parkinson",
      sections:{
        def:e(Def,{c:c},"Episodios repetidos de vocalización o comportamientos motores complejos que ocurren durante el sueño REM. El paciente ",e("b",null,"'actúa' sus sueños")," por falla de la atonía fisiológica del REM. Alta asociación con sinucleinopatías (Parkinson, demencia con cuerpos de Lewy, atrofia multisistémica)."),
        cli:e("div",null,
          e(SxList,{c:c,items:[
            "Más frecuente en varones >50 años",
            "El paciente puede gritar, reírse, patear, pegar al compañero de cama",
            "Recuerdo vívido del sueño tras despertar (sueños frecuentemente agresivos o de persecución)",
            "Alto valor predictivo: ~80% desarrollará enfermedad neurodegenerativa en 10–15 años",
            "Descartar sustancias (ISRS, venlafaxina, BZD pueden inducirlo o empeorarlo)"
          ]})
        ),
        dx:e(CritBlock,{title:"TCSR (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Episodios repetidos de vocalización o conductas motoras complejas durante el sueño."),
          e(Crit,{crit:"B",c:c},"Los episodios ocurren durante sueño REM (>90 min tras inicio, más frecuentes en últimas horas)."),
          e(Crit,{crit:"C",c:c},"Al despertar el paciente está alerta y no confuso."),
          e(Crit,{crit:"D",c:c},"≥1 de: (1) hallazgos PSG de REM sin atonía, (2) diagnóstico clínico y antecedentes de enfermedad neurodegenerativa."),
          e(Crit,{crit:"E",c:c},"Malestar o deterioro."),
          e(Crit,{crit:"F",c:c},"No atribuible a sustancia ni afección médica.")
        ),
        tx:e(P,null,e("b",null,"Clonazepam 0.25–2 mg nocturno")," (1ª línea) o ",e("b",null,"melatonina 3–12 mg nocturno")," (alternativa preferida en adultos mayores por mejor perfil). Seguridad del entorno (retirar objetos peligrosos, separar camas si hay agresión). Seguimiento neurológico para detectar aparición de sinucleinopatía.")
      }
    }
  ];

  var s1=useState(null);var openGen=s1[0],setOpenGen=s1[1];
  var general=[
    {id:"conceptos",ic:"🧭",t:"Conceptos generales",sub:"Arquitectura del sueño",c:c,
     content:e("div",null,
       e(P,null,"El sueño se organiza en ciclos de ~90 min con fases NREM (N1, N2, N3) y REM. Cada ciclo se repite 4–6 veces por noche."),
       e(H3,{c:c,mt:14},"Fases del sueño"),
       e(Table,{
         headers:[{t:"Fase",c:c},{t:"% del sueño",c:c},{t:"EEG",c:c},{t:"Característica",c:c}],
         rows:[
           ["N1 (transición)","5%","Theta","Transición a sueño · mioclonías"],
           ["N2","50%","Husos de sueño + complejos K","Sueño ligero"],
           ["N3 (profundo)","13–23%","Ondas lentas delta","Reparador · ondas lentas · sonambulismo y terror nocturno AQUÍ"],
           ["REM","20–25%","Beta (similar vigilia) + atonía","Ensueños · PESADILLAS · atonía · TCSR si falla"]
         ]
       }),
       e(H3,{c:c,mt:14},"Distribución durante la noche"),
       e(P,null,e("b",null,"Primer tercio:")," predomina N3 (aquí parasomnias NREM). ",e("b",null,"Último tercio:")," predomina REM (aquí pesadillas y TCSR)."),
       e(H3,{c:c,mt:14},"Requerimiento por edad"),
       e(Table,{
         headers:[{t:"Edad",c:c},{t:"Horas recomendadas",c:c}],
         rows:[
           ["Recién nacido","14–17 h"],
           ["1–2 años","11–14 h"],
           ["3–5 años","10–13 h"],
           ["6–13 años","9–11 h"],
           ["14–17 años","8–10 h"],
           ["Adulto","7–9 h"],
           ["Adulto mayor","7–8 h"]
         ]
       })
     )},
    {id:"ddx_nrem_rem",ic:"🌙",t:"NREM vs REM · parasomnias",sub:"Pregunta de examen clásica",c:c,
     content:e("div",null,
       e(P,null,"La distinción entre parasomnias NREM y REM es una de las preguntas más frecuentes del capítulo."),
       e(Table,{
         headers:[{t:"Característica",c:c},{t:"Parasomnia NREM",c:c},{t:"Parasomnia REM",c:c}],
         rows:[
           ["Fase","N3 (sueño profundo)","REM"],
           ["Momento de la noche","1ª mitad","2ª mitad"],
           ["Ejemplos","Sonambulismo · terror nocturno","Pesadillas · TCSR"],
           ["Despertar","Difícil, confuso, amnesia","Fácil, orientado, recuerdo del sueño"],
           ["Recuerdo del sueño","NO","SÍ, vívido"],
           ["Movimiento","Complejo (caminar)","Con TCSR: patea, grita"],
           ["Edad típica","Niños","Adultos mayores (TCSR) · cualquier edad (pesadillas)"]
         ]
       })
     )},
    {id:"tx",ic:"💊",t:"Tratamiento · resumen del tema",sub:"Fármacos por indicación",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Cuadro",c:c},{t:"Fármaco de elección",c:c}],
         rows:[
           ["Insomnio","TCC-I (1ª línea) · suvorexant · ramelteón · doxepina baja · z-drugs corto plazo"],
           ["Hipersomnia","Modafinilo, armodafinilo"],
           ["Narcolepsia · somnolencia","Modafinilo, armodafinilo"],
           ["Narcolepsia · cataplejía","Oxibato de sodio · pitolisant · venlafaxina"],
           ["AOS","CPAP (gold standard) · no fármacos"],
           ["Ritmo circadiano · fase retrasada","Melatonina vespertina + fototerapia matutina"],
           ["Jet-lag","Melatonina 0.5–3 mg"],
           ["SPI","Hierro si ferritina baja · gabapentinoides (1ª) · agonistas dopa (alternativa)"],
           ["Sonambulismo / terror nocturno","Seguridad + clonazepam si severo"],
           ["Pesadillas","Terapia ensayo por imágenes · prazosina si TEPT"],
           ["TCSR","Clonazepam o melatonina · seguimiento neurológico"]
         ]
       }),
       e(Alert,{c:C.bad,label:"⚠️ Contraindicaciones clave"},
         e("ol",{style:{margin:0,paddingLeft:20,lineHeight:1.8,fontSize:13}},
           e("li",null,e("b",null,"BZD y opioides")," → contraindicados en AOS (depresión respiratoria)"),
           e("li",null,e("b",null,"Agonistas dopaminérgicos en SPI")," → riesgo de aumentación"),
           e("li",null,e("b",null,"ISRS/venlafaxina")," → pueden inducir o empeorar TCSR")
         )
       )
     )},
    {id:"perlas",ic:"📌",t:"Perlas de examen",sub:"Alto rendimiento",c:c,
     content:e("div",null,
       e(Pearl,{t:"TCC-I es 1ª línea para insomnio"},"No fármacos. Superior a largo plazo. Debe ofrecerse siempre antes que medicación crónica."),
       e(Pearl,{t:"Narcolepsia tipo 1"},"Con cataplejía + hipocretina en LCR baja. HLA-DQB1*06:02. Oxibato de sodio es gold standard."),
       e(Pearl,{t:"AOS + CPAP"},"CPAP es el gold standard en AOS moderada-grave. Reduce eventos cardiovasculares, HTA, somnolencia."),
       e(Pearl,{t:"SPI · ferritina <75"},"Siempre medir ferritina. Si <75, suplementar hierro mejora el SPI significativamente."),
       e(Pearl,{t:"Aumentación en SPI"},"Efecto paradójico de agonistas dopaminérgicos: el tto empeora el cuadro. Por eso gabapentinoides son ahora 1ª línea farmacológica."),
       e(Pearl,{t:"Parasomnias NREM = 1ª mitad"},"Sonambulismo y terror nocturno en sueño N3, primera mitad de la noche, con amnesia del episodio."),
       e(Pearl,{t:"Pesadillas = REM = 2ª mitad"},"Despertar completo con recuerdo vívido del sueño."),
       e(Pearl,{t:"TCSR predice sinucleinopatía"},"~80% de pacientes con TCSR desarrolla Parkinson, DLB o atrofia multisistémica en 10–15 años."),
       e(Pearl,{t:"Terror nocturno ≠ pesadilla"},"Terror nocturno: N3, 1ª mitad, sin recuerdo, amnesia. Pesadilla: REM, 2ª mitad, recuerdo claro, despertar orientado."),
       e(Pearl,{t:"Prazosina en pesadillas"},"Útil especialmente en pesadillas asociadas a TEPT. Antagonista α1-adrenérgico.")
     )},
    {id:"resumen",ic:"📊",t:"Resumen comparativo",sub:"Las 9 entidades en una tabla",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Entidad",c:c},{t:"Duración / clave",c:c},{t:"Tx 1ª línea",c:c}],
         rows:[
           ["Insomnio","≥3 noches/sem × 3 meses","TCC-I · suvorexant/ramelteón"],
           ["Hipersomnia","≥3 veces/sem × 3 meses","Modafinilo"],
           ["Narcolepsia","Ataques + ≥2 SOREMPs o hipocretina ↓","Modafinilo + oxibato para cataplejía"],
           ["AOS","IAH ≥5 con síntomas o ≥15 sin","CPAP + pérdida de peso"],
           ["Ritmo circadiano","Desfase persistente","Fototerapia + melatonina"],
           ["SPI","URGE + ≥3/sem × 3 m","Hierro si ferritina baja · gabapentinoides"],
           ["Sonambulismo/Terror nocturno","Parasomnia NREM (N3, 1ª mitad)","Seguridad + clonazepam si severo"],
           ["Pesadillas","REM, 2ª mitad, recuerdo","Terapia ensayo imágenes · prazosina"],
           ["TCSR","REM sin atonía · actúa sueños","Clonazepam o melatonina"]
         ]
       })
     )},
    {id:"flash",ic:"🃏",t:"Flashcards",sub:"15 preguntas + las tuyas",c:c,
     content:e("div",null,
       e(P,null,"Tarjetas de repaso de sueño-vigilia. Añade las tuyas."),
       e(FlashDeck,{c:c,deckId:"sueno",items:getAllCards("sueno")})
     )},
    {id:"quiz",ic:"❓",t:"Quiz · 6 casos clínicos",sub:"Prueba tus conocimientos",c:c,
     content:e(Quiz,{c:c,items:getAllQuiz("sueno")})}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Tema 6 · Neurosis · DSM-5-TR",title:"Trastornos del sueño-vigilia"},
      "Alteraciones persistentes de la cantidad, calidad o momento del sueño que causan malestar o deterioro diurno. El capítulo DSM-5 incluye ",e("b",null,"múltiples entidades")," — cubrimos las 9 más relevantes para el examen, desde el insomnio (el más frecuente) hasta el TCSR (predictor de enfermedad neurodegenerativa)."
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.3),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Conceptos · NREM vs REM · Tratamiento · Flashcards · Quiz")
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
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Las 9 enfermedades"),
      e("div",{style:{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Toca cualquier enfermedad para abrir su ficha"),
      e("div",{style:{fontSize:12,color:C.mt,marginTop:4,lineHeight:1.45}},"Cada ficha tiene tabs: Definición · Clínica · Diagnóstico · Tratamiento")
    ),
    e(DzGrid,{c:c,items:diseases,onOpen:p&&p.onOpen}),

    e(Abbrev,{c:c,items:[
      {a:"TCC-I",d:"Terapia Cognitivo-Conductual para Insomnio"},
      {a:"PSG",d:"Polisomnografía"},
      {a:"MSLT",d:"Multiple Sleep Latency Test (latencia múltiple del sueño)"},
      {a:"SOREMP",d:"Sleep Onset REM Period (inicio REM temprano)"},
      {a:"REM",d:"Rapid Eye Movement (sueño con movimientos oculares rápidos)"},
      {a:"NREM",d:"Non-REM (sueño sin REM · N1, N2, N3)"},
      {a:"AOS",d:"Apnea Obstructiva del Sueño"},
      {a:"IAH",d:"Índice de Apnea-Hipopnea"},
      {a:"CPAP",d:"Continuous Positive Airway Pressure"},
      {a:"SPI",d:"Síndrome de Piernas Inquietas (Willis-Ekbom)"},
      {a:"TCSR",d:"Trastorno de Conducta del Sueño REM"},
      {a:"IRT",d:"Imagery Rehearsal Therapy (terapia de ensayo por imágenes)"},
      {a:"DLB",d:"Dementia with Lewy Bodies (demencia con cuerpos de Lewy)"},
      {a:"DLMO",d:"Dim Light Melatonin Onset (inicio de melatonina con luz tenue)"}
    ]})
  );
}



