// ══════════════════════════════════════════════════════════════
// TEMA 9 · TRASTORNOS DEPRESIVOS (PUROS)
// ══════════════════════════════════════════════════════════════

function DprView(p){
  var c=C.dpr;
  var diseases=[
    {
      n:"01",name:"Trastorno depresivo mayor (TDM)",c:c,
      blurb:"≥5 síntomas · ≥2 semanas · deterioro · ánimo bajo o anhedonia",
      sections:{
        def:e("div",null,
          e("div",{style:{padding:"12px 14px",background:ax(C.bip,.08),border:"1px solid "+ax(C.bip,.3),borderLeft:"3px solid "+C.bip,borderRadius:10,marginBottom:12}},
            e("div",{style:{fontSize:10,fontWeight:800,color:C.bip,letterSpacing:1.6,textTransform:"uppercase",marginBottom:5}},"🔗 Referencia cruzada"),
            e("div",{style:{fontSize:12.5,color:C.tx,lineHeight:1.55}},"Los ",e("b",null,"9 criterios del episodio depresivo mayor")," también se estudian como ",e("b",null,"componente interno")," del trastorno bipolar (I y II) en ",e("b",{style:{color:C.psi}},"Psicosis → Bipolar I / II"),". Aquí lo vemos como trastorno ",e("b",null,"crónico o recurrente")," sin antecedente maníaco.")
          ),
          e(Def,{c:c},"Al menos un episodio depresivo mayor. Un episodio requiere ",e("b",null,"≥5 síntomas (de 9)"),", presentes la mayor parte del día casi todos los días durante ",e("b",null,"≥2 semanas"),", con al menos uno de ellos siendo ",e("b",null,"estado de ánimo depresivo"),", o ",e("b",null,"anhedonia"),".")
        ),
        cli:e("div",null,
          e(H3,{c:c},"Los 9 síntomas · nemotecnia SIGECAPS"),
          e(Table,{
            headers:[{t:"Letra",c:c},{t:"Síntoma",c:c}],
            rows:[
              ["S · Sleep","Insomnio o hipersomnia"],
              ["I · Interest","Anhedonia (pérdida de interés/placer) ★"],
              ["G · Guilt","Culpa o sensación de inutilidad"],
              ["E · Energy","Fatiga o pérdida de energía"],
              ["C · Concentration","Disminución de concentración o indecisión"],
              ["A · Appetite","Cambio de apetito o peso (≥5% en 1 mes)"],
              ["P · Psychomotor","Agitación o retardo psicomotor"],
              ["S · Suicide","Pensamientos recurrentes de muerte o suicidio"],
              ["Ánimo ★","Estado de ánimo depresivo la mayor parte del día"]
            ]
          }),
          e(Note,{c:c,t:"Requisito obligatorio"},"Al menos uno de los ≥5 síntomas debe ser ",e("b",null,"ánimo depresivo")," o ",e("b",null,"anhedonia"),". Sin uno de esos dos, no hay episodio depresivo mayor."),
          e(H3,{c:c,mt:14},"Especificadores del TDM"),
          e(SxList,{c:c,items:[
            "Con ansiedad (leve/moderada/grave)",
            "Con características mixtas (síntomas maníacos/hipomaníacos sin cumplir episodio)",
            "Con características melancólicas (anhedonia severa, despertar precoz, peor en la mañana, pérdida de peso, culpa excesiva)",
            "Con características atípicas (reactividad del ánimo, hiperfagia, hipersomnia, parálisis plúmbea, sensibilidad al rechazo)",
            "Con características psicóticas (congruentes o incongruentes con el ánimo)",
            "Con catatonia",
            "Con inicio en el periparto (durante embarazo o 4 semanas tras el parto)",
            "Con patrón estacional (recurrencia en una estación específica · típico en invierno)"
          ]}),
          e(H3,{c:c,mt:14},"Epidemiología"),
          e(SxList,{c:c,items:[
            "Prevalencia de por vida ~16–17%",
            "Mujeres 2:1 hombres",
            "Inicio típico adultez temprana (20–30 años)",
            "Alta comorbilidad con ansiedad, TUS, TLP, enfermedad médica",
            "Tasa de suicidio consumado: riesgo vital ~3–4% (mayor si psicosis, antecedente familiar, comorbilidad con TUS)"
          ]})
        ),
        dx:e(CritBlock,{title:"Episodio depresivo mayor (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"≥5 de los 9 síntomas durante un periodo de 2 semanas, con cambio respecto al funcionamiento previo. Al menos uno debe ser (1) ánimo depresivo o (2) pérdida de interés/placer."),
          e(Crit,{crit:"B",c:c},"Los síntomas causan malestar clínicamente significativo o deterioro."),
          e(Crit,{crit:"C",c:c},"El episodio no se puede atribuir a efectos de una sustancia ni a otra afección médica."),
          e(Crit,{crit:"D",c:c},"El episodio no se explica mejor por un trastorno del espectro esquizofrénico u otro trastorno psicótico."),
          e(Crit,{crit:"E",c:c},"Nunca ha habido un episodio maníaco o hipomaníaco.")
        ),
        tx:e("div",null,
          e(H3,{c:c},"Farmacoterapia"),
          e(Table,{
            headers:[{t:"Grupo",c:c},{t:"Fármacos representativos",c:c},{t:"Cuándo elegirlos",c:c}],
            rows:[
              ["ISRS (1ª línea)","Sertralina 50–200 mg · escitalopram 10–20 mg · fluoxetina 20–80 mg · paroxetina 20–60 mg","Casi cualquier paciente"],
              ["IRSN","Venlafaxina 75–225 mg · duloxetina 30–120 mg","Si dolor comórbido · falla con ISRS"],
              ["Atípicos","Mirtazapina 15–45 mg · bupropión 150–450 mg · vortioxetina","Mirtazapina si insomnio/pérdida peso · bupropión si no disfunción sexual o fatiga"],
              ["Tricíclicos","Amitriptilina · nortriptilina","Melancólica · dolor · 2ª/3ª línea por perfil de efectos adversos"],
              ["IMAOs","Fenelzina · tranilcipromina","Atípica · refractaria · requieren dieta baja en tiramina"]
            ]
          }),
          e(Alert,{c:C.warn,label:"🔑 Reglas de oro"},
            e("ol",{style:{margin:0,paddingLeft:20,lineHeight:1.8,fontSize:13}},
              e("li",null,e("b",null,"Respuesta:")," 2–4 semanas. Efecto completo: 6–8 semanas."),
              e("li",null,e("b",null,"Duración del tratamiento:")," mínimo 6–9 meses tras remisión en primer episodio; 2 años o indefinido si ≥2 episodios o episodio grave/psicótico."),
              e("li",null,e("b",null,"Descontinuar:")," reducir gradualmente en 2–4 semanas para evitar síndrome de discontinuación (especialmente paroxetina, venlafaxina)."),
              e("li",null,e("b",null,"Warning")," suicidalidad: aumento transitorio de ideación suicida en <25 años al iniciar · vigilancia estrecha las primeras semanas.")
            )
          ),
          e(H3,{c:c,mt:14},"Psicoterapia"),
          e(SxList,{c:c,items:[
            "TCC — 1ª línea psicoterapéutica · sólida evidencia",
            "Terapia interpersonal (TIP)",
            "Activación conductual",
            "Terapia psicodinámica (moderada evidencia)"
          ]}),
          e(H3,{c:c,mt:14},"Tratamientos físicos / refractarios"),
          e(SxList,{c:c,items:[
            "TEC (terapia electroconvulsiva) — gold standard en depresión refractaria, psicótica, riesgo suicida alto, catatonia, embarazo",
            "EMT (estimulación magnética transcraneal) — en falla ≥1 ISRS",
            "Ketamina IV / esketamina intranasal — efecto rápido (horas-días) en refractaria/suicidalidad aguda",
            "Fototerapia — patrón estacional"
          ]})
        )
      }
    },
    {
      n:"02",name:"Trastorno depresivo persistente (distimia)",c:c,
      blurb:"Ánimo depresivo crónico ≥2 años (≥1 año niños)",
      sections:{
        def:e(Def,{c:c},"Ánimo depresivo crónico la mayor parte del día, la mayoría de los días, durante ",e("b",null,"≥2 años")," en adultos (o ",e("b",null,"≥1 año")," en niños y adolescentes, en quienes puede presentarse como irritabilidad). DSM-5 consolidó distimia + depresión mayor crónica en esta entidad."),
        cli:e("div",null,
          e(H3,{c:c},"≥2 síntomas asociados"),
          e(SxList,{c:c,items:[
            "Alteración del apetito (aumento o disminución)",
            "Insomnio o hipersomnia",
            "Baja energía o fatiga",
            "Baja autoestima",
            "Dificultad para concentrarse o tomar decisiones",
            "Sentimientos de desesperanza"
          ]}),
          e(Note,{c:c,t:"'Depresión doble'"},"Paciente con distimia crónica que además desarrolla episodios depresivos mayores superpuestos. Peor pronóstico.")
        ),
        dx:e(CritBlock,{title:"Trastorno depresivo persistente (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Estado de ánimo deprimido la mayor parte del día, la mayoría de los días, según el propio paciente u observadores, durante ≥2 años (≥1 año en menores)."),
          e(Crit,{crit:"B",c:c},"Durante la depresión, ≥2 de los 6 síntomas listados."),
          e(Crit,{crit:"C",c:c},"Durante los 2 años (1 en menores), el paciente no ha estado sin los síntomas del criterio A/B durante más de 2 meses seguidos."),
          e(Crit,{crit:"D",c:c},"Pueden cumplirse continuamente criterios de depresión mayor durante 2 años."),
          e(Crit,{crit:"E",c:c},"Nunca ha habido episodio maníaco o hipomaníaco."),
          e(Crit,{crit:"F",c:c},"No se explica mejor por trastorno esquizoafectivo, esquizofrenia u otros psicóticos."),
          e(Crit,{crit:"G",c:c},"No atribuible a sustancia o afección médica."),
          e(Crit,{crit:"H",c:c},"Causa malestar o deterioro.")
        ),
        tx:e(P,null,"Mismos fármacos que TDM (ISRS 1ª línea). La respuesta suele ser más lenta y la combinación ",e("b",null,"antidepresivo + psicoterapia (TCC o TIP)")," es especialmente efectiva en depresión crónica.")
      }
    },
    {
      n:"03",name:"Trastorno disfórico premenstrual (TDPM)",c:c,
      blurb:"Síntomas afectivos severos la semana previa a la menstruación",
      sections:{
        def:e(Def,{c:c},"Expresión severa de síndrome premenstrual con ",e("b",null,"síntomas afectivos marcados")," que aparecen en la ",e("b",null,"semana antes de la menstruación"),", mejoran a los pocos días tras el inicio del sangrado, y son ",e("b",null,"mínimos o ausentes")," en la semana posmenstrual. Debe confirmarse con ",e("b",null,"registro diario prospectivo durante ≥2 ciclos"),"."),
        cli:e("div",null,
          e(H3,{c:c},"Requisitos sintomáticos"),
          e(P,null,"En los ≥5 síntomas totales, debe haber ≥1 de los 4 ",e("b",null,"síntomas afectivos nucleares"),":"),
          e(SxList,{title:"Nucleares (≥1)",c:c,items:[
            "Labilidad afectiva marcada (cambios de humor, sensibilidad al rechazo)",
            "Irritabilidad marcada o aumento de conflictos interpersonales",
            "Ánimo deprimido, desesperanza o autodesvalorización",
            "Ansiedad, tensión, sensación de 'estar al límite'"
          ]}),
          e(SxList,{title:"Otros (para llegar a ≥5)",c:c,items:[
            "Disminución del interés por actividades habituales",
            "Dificultad de concentración",
            "Letargia, fatigabilidad fácil, falta de energía",
            "Cambio marcado del apetito, antojos",
            "Hipersomnia o insomnio",
            "Sensación subjetiva de agobio o descontrol",
            "Síntomas físicos (mamalgia, hinchazón, artralgias, aumento de peso)"
          ]})
        ),
        dx:e(CritBlock,{title:"Trastorno disfórico premenstrual (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"≥5 síntomas en la semana antes de la menstruación, mejorando tras inicio del sangrado, mínimos o ausentes en la semana posmenstrual."),
          e(Crit,{crit:"B",c:c},"≥1 de los 4 síntomas afectivos nucleares."),
          e(Crit,{crit:"C",c:c},"≥1 de los otros síntomas (para llegar a 5 totales con B)."),
          e(Crit,{crit:"D",c:c},"Los síntomas causan malestar clínico o deterioro."),
          e(Crit,{crit:"E",c:c},"No es mera exacerbación de otro trastorno (aunque puede coexistir)."),
          e(Crit,{crit:"F",c:c},"El criterio A debe confirmarse con ≥2 ciclos sintomáticos por registro diario prospectivo."),
          e(Crit,{crit:"G",c:c},"No atribuible a sustancia ni afección médica.")
        ),
        tx:e("div",null,
          e(SxList,{c:c,items:[
            "ISRS (1ª línea) · fluoxetina, sertralina, escitalopram · pueden usarse continuamente o solo en fase luteal",
            "Anticonceptivos orales combinados (drospirenona con etinilestradiol)",
            "Manejo del estilo de vida (ejercicio, sueño, reducción de cafeína)",
            "Suplementos: calcio, vitamina B6 (evidencia moderada)",
            "TCC"
          ]}),
          e(Pearl,{t:"Régimen luteal de ISRS"},"Solo en la fase luteal (desde ovulación hasta menstruación, ~14 días). Ventaja: menos exposición total, menos efectos adversos, efecto puede ser casi inmediato al tratar el patrón cíclico.")
        )
      }
    },
    {
      n:"04",name:"Trastorno de desregulación disruptiva del ánimo (TDDD)",c:c,
      blurb:"Niños 6–18 · irritabilidad crónica + rabietas severas",
      sections:{
        def:e(Def,{c:c},"Patrón crónico de ",e("b",null,"irritabilidad severa")," con ",e("b",null,"rabietas explosivas")," recurrentes desproporcionadas en intensidad o duración, ",e("b",null,"≥3 veces por semana durante ≥12 meses"),", presente en ≥2 escenarios (casa, escuela, con pares) y severas en ≥1. Diagnóstico solo en niños/adolescentes de ",e("b",null,"6–18 años"),", con inicio antes de los 10."),
        cli:e("div",null,
          e(P,null,"Fue creado en DSM-5 para reducir el sobre-diagnóstico de trastorno bipolar pediátrico. Un niño con irritabilidad crónica sin episodios maníacos discretos entra aquí, no en bipolar."),
          e(H3,{c:c,mt:14},"Características clave"),
          e(SxList,{c:c,items:[
            "Rabietas severas (verbales y/o físicas) desproporcionadas",
            "Entre las rabietas, ánimo persistentemente IRRITABLE o ENFADADO (no 'normal')",
            "Presencia en ≥2 contextos, severa en ≥1",
            "Edad de diagnóstico: 6–18 años",
            "Inicio antes de los 10 años (criterio obligatorio)",
            "NO se diagnostica simultáneamente con trastorno negativista desafiante, TEI o bipolar (si cumple TDDD, se diagnostica TDDD en lugar de negativista)"
          ]})
        ),
        dx:e(CritBlock,{title:"TDDD (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Rabietas graves y recurrentes (verbales o conductuales) desproporcionadas en intensidad o duración."),
          e(Crit,{crit:"B",c:c},"Inconsistentes con el nivel de desarrollo."),
          e(Crit,{crit:"C",c:c},"≥3 rabietas/semana en promedio."),
          e(Crit,{crit:"D",c:c},"Entre las rabietas, ánimo persistentemente irritable/enfadado la mayor parte del día, casi todos los días, observable por otros."),
          e(Crit,{crit:"E",c:c},"Criterios A–D presentes durante ≥12 meses, sin periodos libres >3 meses."),
          e(Crit,{crit:"F",c:c},"Presentes en ≥2 escenarios, severos en ≥1."),
          e(Crit,{crit:"G",c:c},"Diagnóstico no debe hacerse antes de los 6 años ni después de los 18 años."),
          e(Crit,{crit:"H",c:c},"Inicio antes de los 10 años (por historia o documentación)."),
          e(Crit,{crit:"I",c:c},"No ha habido un periodo diferenciado >1 día con criterios completos de episodio maníaco/hipomaníaco."),
          e(Crit,{crit:"J",c:c},"No ocurre exclusivamente durante TDM ni se explica por TEA, TEPT, ansiedad separación, distimia."),
          e(Crit,{crit:"K",c:c},"No atribuible a sustancia ni afección médica o neurológica.")
        ),
        tx:e("div",null,
          e(SxList,{c:c,items:[
            "Psicoterapia conductual (PMT, terapia dialéctico-conductual adaptada a niños)",
            "Estimulantes si hay TDAH comórbido (muy frecuente)",
            "ISRS si irritabilidad y ánimo depresivo marcados",
            "Antipsicóticos atípicos (risperidona, aripiprazol) en casos severos/refractarios",
            "Evitar sobrediagnóstico como bipolar — NO dar estabilizadores del ánimo rutinariamente"
          ]}),
          e(Note,{c:c,t:"Por qué se creó"},"Antes, muchos niños con irritabilidad crónica + rabietas recibían diagnóstico de bipolar pediátrico y litio/antipsicóticos de forma inapropiada. El TDDD los redirige a un manejo conductual/psicosocial + tratar comorbilidades.")
        )
      }
    }
  ];

  // Section tiles delegate to p.onOpenSection (SM App promotes them to
  // view="section" as a full inline page — no inline DzModal here).
  var general=[
    {id:"conceptos",ic:"🧭",t:"Conceptos generales",sub:"Del capítulo depresivos",c:c,
     content:e("div",null,
       e(P,null,"El capítulo DSM-5 de 'Trastornos depresivos' separó los cuadros puramente depresivos del bipolar. Se centra en episodios de ánimo bajo sin antecedente maníaco. ",e("b",null,"El trastorno depresivo mayor (TDM)")," con su espectro de episodios es la entidad central."),
       e(H3,{c:c,mt:14},"Las 4 entidades principales"),
       e(Table,{
         headers:[{t:"Entidad",c:c},{t:"Duración / clave",c:c},{t:"Población",c:c}],
         rows:[
           ["TDM","Episodio ≥2 semanas + ≥5 síntomas","Cualquier edad"],
           ["Depresivo persistente (distimia)","≥2 años (≥1 en menores) + ≥2 síntomas","Cualquier edad"],
           ["TDPM","Semana premenstrual · ≥5 síntomas con ≥1 nuclear · ≥2 ciclos confirmados","Mujeres en edad fértil"],
           ["TDDD","Irritabilidad crónica + rabietas ≥3/sem × 12m · 6–18 años","Niños/adolescentes 6–18"]
         ]
       }),
       e(H3,{c:c,mt:14},"Especificadores transversales"),
       e(P,null,"Todos estos trastornos pueden especificarse con: ansiedad, características mixtas, melancólicas, atípicas, psicóticas, catatonia, inicio periparto, patrón estacional (algunos aplican solo a TDM).")
     )},
    {id:"ddx",ic:"🎯",t:"Diagnósticos diferenciales clave",sub:"Las trampas del capítulo",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Par",c:c},{t:"Clave para diferenciarlos",c:c}],
         rows:[
           ["TDM vs Bipolar","Si alguna vez hubo episodio maníaco/hipomaníaco → bipolar (aunque actualmente esté deprimido). Historia completa es fundamental"],
           ["TDM vs distimia","TDM: episodios discretos ≥2 sem. Distimia: curso crónico ≥2 años. Pueden coexistir ('depresión doble')"],
           ["TDM vs duelo normal","Duelo: ondas reactivas al pensar en la pérdida, autoestima conservada, pensamientos en el fallecido. TDM: ánimo persistente, inutilidad, suicidalidad no relacionada con la pérdida"],
           ["TDM vs depresión por sustancia/médica","Cronología: síntomas inician tras uso/enfermedad y mejoran al resolverse"],
           ["TDDD vs bipolar pediátrico","TDDD: irritabilidad CRÓNICA sin episodios maníacos discretos. Bipolar: episodios maníacos de ≥1 día con cambio claro respecto al basal"],
           ["TDPM vs SPM","SPM: síntomas premenstruales leves/moderados que no deterioran. TDPM: síntomas SEVEROS con deterioro + confirmación prospectiva en 2 ciclos"],
           ["TDM con mixtas vs bipolar","Mixtas: síntomas maníacos pocos/breves dentro del episodio depresivo. Bipolar I/II: episodio completo maníaco/hipomaníaco"]
         ]
       })
     )},
    {id:"tx",ic:"💊",t:"Tratamiento · resumen del tema",sub:"Farmacoterapia y algoritmo",c:c,
     content:e("div",null,
       e(H3,{c:c},"Algoritmo general de TDM"),
       e(Table,{
         headers:[{t:"Paso",c:c},{t:"Opción",c:c}],
         rows:[
           ["1","ISRS (sertralina, escitalopram, fluoxetina) · o IRSN · + psicoterapia (TCC o TIP)"],
           ["2 (no respuesta 4–6 sem)","Optimizar dosis"],
           ["3 (no respuesta)","Cambio a otro ISRS o IRSN · o atípico (mirtazapina, bupropión)"],
           ["4 (refractaria ≥2 fallos)","Aumentación: litio, T3, antipsicótico atípico (aripiprazol, quetiapina XR, brexpiprazol)"],
           ["5 (refractaria persistente)","IMAO · TEC · EMT · ketamina/esketamina"]
         ]
       }),
       e(H3,{c:c,mt:14},"Cuándo usar TEC"),
       e(SxList,{c:c,items:[
         "Riesgo suicida inminente que requiere respuesta rápida",
         "Depresión psicótica",
         "Depresión catatónica",
         "Embarazo (especialmente 1er trimestre)",
         "Refractaria a múltiples ensayos farmacológicos",
         "Desnutrición severa por rechazo alimentario"
       ]}),
       e(H3,{c:c,mt:14},"Consideraciones específicas"),
       e(Table,{
         headers:[{t:"Población/comorbilidad",c:c},{t:"Preferencia",c:c}],
         rows:[
           ["Embarazo/lactancia","Sertralina (mejor perfil) · evitar paroxetina (defectos cardiacos)"],
           ["Adulto mayor","Sertralina, escitalopram · evitar paroxetina (anticolinérgica), tricíclicos"],
           ["Dolor comórbido","Duloxetina, venlafaxina, amitriptilina"],
           ["Insomnio/pérdida de peso","Mirtazapina (sedante, aumenta apetito)"],
           ["Disfunción sexual por ISRS","Cambiar a bupropión o mirtazapina"],
           ["Fatiga","Bupropión"],
           ["TDAH comórbido","Bupropión · o ISRS + estimulante"],
           ["Riesgo suicida agudo","TEC o ketamina IV/esketamina intranasal"]
         ]
       }),
       e(Alert,{c:C.bad,label:"⚠️ Contraindicaciones/trampas"},
         e("ol",{style:{margin:0,paddingLeft:20,lineHeight:1.8,fontSize:13}},
           e("li",null,e("b",null,"Bupropión")," contraindicado en TCA con purgas o convulsiones (↓ umbral convulsivo)."),
           e("li",null,e("b",null,"IMAO + tiramina")," → crisis hipertensiva. Requiere dieta estricta."),
           e("li",null,e("b",null,"IMAO + ISRS")," (washout de 2–6 semanas) → síndrome serotoninérgico. Fluoxetina requiere 5 semanas."),
           e("li",null,e("b",null,"Paroxetina")," en embarazo → defectos cardíacos."),
           e("li",null,e("b",null,"Warning pediátrico/joven:")," aumento de ideación suicida en <25 años al iniciar ISRS · vigilancia estrecha.")
         )
       )
     )},
    {id:"perlas",ic:"📌",t:"Perlas de examen",sub:"Alto rendimiento",c:c,
     content:e("div",null,
       e(Pearl,{t:"SIGECAPS + ánimo o anhedonia"},"Para diagnóstico de TDM: ≥5 de 9 síntomas en ≥2 semanas, con AL MENOS uno siendo ánimo bajo o anhedonia. Sin uno de los dos, no hay episodio."),
       e(Pearl,{t:"Ex maniaco = bipolar, no TDM"},"Un solo episodio maníaco/hipomaníaco previo basta para reclasificar como bipolar, incluso si el episodio actual es depresivo. Siempre buscar antecedente."),
       e(Pearl,{t:"Tiempo de respuesta"},"ISRS: respuesta en 2–4 semanas, efecto completo en 6–8 semanas. No cambiar demasiado pronto."),
       e(Pearl,{t:"Duración del tratamiento"},"1er episodio: mínimo 6–9 meses tras remisión. ≥2 episodios o episodio grave/psicótico: 2 años o indefinido."),
       e(Pearl,{t:"TEC no es 'último recurso' en depresión psicótica"},"Es gold standard. También en suicidalidad aguda, catatonia, embarazo con depresión severa."),
       e(Pearl,{t:"Fluoxetina y washout para IMAO"},"Lavar 5 SEMANAS antes de iniciar IMAO por su vida media larga (no 2 semanas como los demás)."),
       e(Pearl,{t:"Bupropión contraindicaciones"},"Antecedente de convulsiones, TCA activo con purgas, TUS por alcohol con riesgo de abstinencia (↓ umbral convulsivo)."),
       e(Pearl,{t:"TDDD existe para no sobre-diagnosticar bipolar en niños"},"Irritabilidad CRÓNICA sin episodios discretos de manía = TDDD, no bipolar. Manejo es conductual, no con estabilizadores rutinariamente."),
       e(Pearl,{t:"TDPM requiere confirmación prospectiva"},"≥2 ciclos con registro diario antes de diagnosticar. Los síntomas deben ser severos (no solo SPM) y mínimos en semana posmenstrual."),
       e(Pearl,{t:"TDPM · régimen luteal"},"ISRS solo desde ovulación hasta menstruación (~14 días). Efecto casi inmediato al tratar el patrón cíclico."),
       e(Pearl,{t:"Atípica · parálisis plúmbea"},"Sensación de pesadez en brazos/piernas, reactividad del ánimo, hiperfagia, hipersomnia, sensibilidad al rechazo. IMAOs particularmente efectivos en este especificador."),
       e(Pearl,{t:"Melancolía · despertar precoz"},"Patrón clásico: anhedonia severa + peor en la mañana + despertar precoz + pérdida de peso + culpa excesiva. Buena respuesta a ADT y TEC.")
     )},
    {id:"resumen",ic:"📊",t:"Resumen comparativo",sub:"4 entidades en tabla",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Entidad",c:c},{t:"Duración mínima",c:c},{t:"Tx 1ª línea",c:c}],
         rows:[
           ["TDM","≥2 semanas · ≥5 síntomas","ISRS + TCC/TIP"],
           ["Depresivo persistente","≥2 años adultos · ≥1 año menores · ≥2 síntomas","ISRS + TCC/TIP"],
           ["TDPM","Semana premenstrual · ≥2 ciclos confirmados","ISRS continuo o luteal · ACO combinado"],
           ["TDDD","≥12 meses · niños 6–18","Psicoterapia conductual + ISRS/estimulantes por comorbilidad"]
         ]
       })
     )},
    {id:"flash",ic:"🃏",t:"Flashcards",sub:"15 preguntas + las tuyas",c:c,
     content:e("div",null,
       e(P,null,"Tarjetas de repaso de trastornos depresivos puros. Añade las tuyas."),
       e(FlashDeck,{c:c,deckId:"depresivos",items:getAllCards("depresivos")})
     )},
    {id:"quiz",ic:"❓",t:"Quiz · 6 casos clínicos",sub:"Prueba tus conocimientos",c:c,
     content:e(Quiz,{c:c,items:getAllQuiz("depresivos")})}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Tema 9 · Neurosis · DSM-5-TR",title:"Trastornos depresivos puros"},
      "Capítulo del DSM-5 separado del bipolar. Incluye entidades con episodios de ánimo bajo SIN antecedente maníaco/hipomaníaco. El ",e("b",null,"trastorno depresivo mayor (TDM)")," es el más común, pero el capítulo incluye también distimia, TDPM y TDDD. Son ",e("b",null,"4 entidades principales"),"."
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.3),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Inter,DM Sans"}},"Conceptos · DDx · Tratamiento · Perlas · Flashcards · Quiz")
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
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Las 4 entidades"),
      e("div",{style:{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Inter,DM Sans"}},"Toca cualquier entidad para abrir su ficha")
    ),
    e(DzGrid,{c:c,items:diseases,onOpen:p&&p.onOpen}),

    e(Abbrev,{c:c,items:[
      {a:"TDM",d:"Trastorno Depresivo Mayor"},
      {a:"TDPM",d:"Trastorno Disfórico Premenstrual"},
      {a:"TDDD",d:"Trastorno de Desregulación Disruptiva del Ánimo"},
      {a:"SPM",d:"Síndrome Premenstrual"},
      {a:"ISRS",d:"Inhibidores Selectivos de la Recaptación de Serotonina"},
      {a:"IRSN",d:"Inhibidores de Recaptación de Serotonina y Noradrenalina"},
      {a:"IMAO",d:"Inhibidores de la Monoaminooxidasa"},
      {a:"ADT",d:"Antidepresivos Tricíclicos"},
      {a:"TEC",d:"Terapia Electroconvulsiva"},
      {a:"EMT",d:"Estimulación Magnética Transcraneal"},
      {a:"TIP",d:"Terapia Interpersonal"},
      {a:"PMT",d:"Parent Management Training"},
      {a:"ACO",d:"Anticonceptivo Oral Combinado"}
    ]})
  );
}



