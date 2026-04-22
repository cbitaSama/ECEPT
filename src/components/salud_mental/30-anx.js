
// ══════════════════════════════════════════════════════════════
// TEMA 1 · TRASTORNOS DE ANSIEDAD

// ══════════════════════════════════════════════════════════════

function AnxView(p){
  var c=C.anx;
  // Datos estructurados de las 9 enfermedades
  var diseases=[
    {
      n:"01",name:"Trastorno de pánico",
      blurb:"Crisis inesperadas recurrentes + ≥1 mes de preocupación",
      sections:{
        def:e(Def,{c:c},"Presencia de ",e("b",null,"crisis de pánico inesperadas recurrentes"),", seguidas de al menos un mes de ",e("b",null,"preocupación por nuevas crisis")," o ",e("b",null,"cambio de conducta desadaptativo")," para evitarlas (ej: evitar ejercicio, evitar salir)."),
        cli:e("div",null,
          e(P,null,e("b",null,"Epidemiología:")," prevalencia anual ~2–3%. Predominio en mujeres (2:1). Edad típica de inicio entre 20–24 años. Curso crónico con exacerbaciones. Comorbilidad con depresión >50%."),
          e(H3,{c:c,mt:14},"Etiología y fisiopatología"),
          e(P,null,"Los familiares de primer grado tienen un riesgo ",e("b",null,"10× mayor")," (20% vs 2%). Tres enfoques complementarios explican el cuadro:"),
          e(Table,{
            headers:[{t:"Enfoque",c:c},{t:"Mecanismo",c:c}],
            rows:[
              ["Biológico · Genética","Riesgo 10× mayor en familiares de primer grado (20% vs 2% población general)"],
              ["Biológico · Locus coeruleus","'Núcleo azul' del tronco encefálico que regula noradrenalina. Hipersensible → dispara sistema de alerta sin amenaza real"],
              ["Biológico · Falsa sofocación","Hipersensibilidad al CO₂: el cerebro interpreta erróneamente señales de asfixia → hiperventilación → pánico"],
              ["Biológico · Neurotransmisores","Alteraciones en GABA (inhibidor) y serotonina"],
              ["Psicoanalítico","Los ataques son irrupciones de energía psíquica de pensamientos/deseos inaceptables que la represión no puede contener"],
              ["Conductista","El pánico es una respuesta aprendida por condicionamiento clásico. Ej: accidente con taquicardia → cualquier taquicardia (ejercicio) dispara pánico por asociación"]
            ]
          }),
          e(H3,{c:c,mt:14},"El 'viacrucis' del paciente"),
          e(P,null,"Por los síntomas físicos, el paciente con pánico consulta a múltiples especialistas antes de llegar al psiquiatra. En atención primaria la prevalencia se ",e("b",null,"triplica"),"; en cardiología, cuando el dolor torácico tiene arterias sanas, la tasa de trastorno de pánico ",e("b",null,"supera el 50%"),"."),
          e(Table,{
            headers:[{t:"Especialista",c:c},{t:"Síntoma por el que consulta",c:c}],
            rows:[
              ["Cardiólogo","Palpitaciones, dolor precordial"],
              ["Neumólogo","Disnea, sensación de sofocamiento"],
              ["Gastroenterólogo","Náuseas, diarrea, malestar abdominal"],
              ["Neurólogo","Parestesias, temblor, mareo"]
            ]
          })
        ),
        dx:e("div",null,
          e(CritBlock,{title:"Trastorno de pánico",c:c},
            e(Crit,{crit:"A",c:c},"Crisis de pánico inesperadas ",e("b",null,"recurrentes"),". (Al menos 2)"),
            e(Crit,{crit:"B",c:c},"Al menos UNA crisis seguida de ",e("b",null,"≥1 mes")," de uno o ambos: ",e("br"),"(1) ",e("b",null,"Preocupación persistente")," por nuevas crisis o sus consecuencias ('me voy a morir', 'me voy a volver loco'). ",e("br"),"(2) ",e("b",null,"Cambio de conducta significativo desadaptativo")," (evitar ejercicio, cafeína, situaciones similares)."),
            e(Crit,{crit:"C",c:c},"No atribuible a efectos de sustancia (cocaína, cafeína) ni a enfermedad médica (hipertiroidismo, arritmia)."),
            e(Crit,{crit:"D",c:c},"No se explica mejor por otro trastorno mental (las crisis en fobia social son desencadenadas, no inesperadas; en TOC por obsesiones; en TEPT por recuerdos traumáticos).")
          ),
          e(Pearl,{t:"DSM-5 separó pánico de agorafobia"},"Antes eran un solo diagnóstico (pánico con/sin agorafobia). Desde DSM-5 son diagnósticos ",e("b",null,"independientes"),". Pueden codiagnosticarse si cumplen criterios ambos.")
        ),
        tx:e("div",null,
          e(P,null,"1ª línea: ",e("b",null,"ISRS o IRSN")," (sertralina, escitalopram, venlafaxina XR). Iniciar a ",e("b",null,"mitad de dosis")," por la ",e("b",null,"activación inicial")," (peor antes de mejor, 7–14 días). Respuesta completa en 6–12 semanas. Mantener ≥12 meses tras remisión."),
          e(P,null,e("b",null,"Puente corto (≤4–6 sem):")," clonazepam 0.5–2 mg/día o alprazolam 0.25–3 mg/día. ",e("b",null,"Psicoterapia:")," TCC con respiración + reestructuración cognitiva (entender que el dolor torácico NO es un infarto)."),
          e(Pearl,{t:"Factor dietético clave"},"Evitar ",e("b",null,"cafeína")," (café, té, colas, chocolate, energizantes). Potente inductor de crisis.")
        )
      }
    },
    {
      n:"02",name:"Agorafobia",
      blurb:"Miedo a ≥2 de 5 situaciones por imposibilidad de escape",
      sections:{
        def:e(Def,{c:c},"Miedo o ansiedad marcados ante ",e("b",null,"≥2 de las 5 situaciones")," siguientes, porque el paciente teme que en ellas ",e("b",null,"no podría escapar")," o ",e("b",null,"no recibiría auxilio")," si tuviera síntomas incapacitantes."),
        cli:e("div",null,
          e(SxList,{title:"Las 5 situaciones de agorafobia (≥2)",c:c,items:[
            "Uso de transporte público (autobús, tren, avión, barco)",
            "Estar en espacios abiertos (plazas, estacionamientos, puentes)",
            "Estar en espacios cerrados (tiendas, cines, teatros)",
            "Hacer fila o estar entre multitudes",
            "Estar fuera de casa solo"
          ]}),
          e(P,null,e("b",null,"Ejemplos típicos:")," evitan centros comerciales, cines e iglesias por las multitudes · miedo a cruzar puentes o túneles · cuesta conducir lejos de casa · solo salen acompañados. En casos graves no pueden salir de casa. Más frecuente en mujeres y suele coexistir con trastorno de pánico.")
        ),
        dx:e(CritBlock,{title:"Agorafobia",c:c},
          e(Crit,{crit:"A",c:c},"Miedo o ansiedad marcados ante ≥2 de las 5 situaciones descritas."),
          e(Crit,{crit:"B",c:c},"El paciente teme esas situaciones porque escapar sería difícil o no habría ayuda si apareciera una crisis de pánico u otros síntomas incapacitantes."),
          e(Crit,{crit:"C",c:c},"Las situaciones agorafóbicas casi siempre provocan miedo o ansiedad."),
          e(Crit,{crit:"D",c:c},"Se evitan activamente, requieren acompañante o se soportan con mucho malestar."),
          e(Crit,{crit:"E",c:c},"El miedo es desproporcionado al peligro real."),
          e(Crit,{crit:"F",c:c},"Persistente, ",e("b",null,"≥6 meses"),"."),
          e(Crit,{crit:"G",c:c},"Causa malestar o deterioro clínicamente significativo."),
          e(Crit,{crit:"H",c:c},"No mejor explicado por otra enfermedad médica."),
          e(Crit,{crit:"I",c:c},"No mejor explicado por otro trastorno mental.")
        ),
        tx:e(P,null,"Mismos fármacos que el trastorno de pánico: ISRS/IRSN de 1ª línea. ",e("b",null,"Terapia de exposición gradual")," (in vivo) es el pilar — enfrentarse progresivamente a las situaciones temidas para perder el miedo.")
      }
    },
    {
      n:"03",name:"Trastorno de ansiedad generalizada (TAG)",
      blurb:"Preocupación crónica ≥6 meses + ≥3 síntomas físicos",
      sections:{
        def:e(Def,{c:c},"Ansiedad y preocupación ",e("b",null,"excesivas"),", ",e("b",null,"difíciles de controlar"),", sobre ",e("b",null,"múltiples temas")," (trabajo, familia, salud, dinero, etc.), presentes la mayoría de los días durante ",e("b",null,"al menos 6 meses"),", acompañadas de síntomas físicos de tensión."),
        cli:e("div",null,
          e(SxList,{title:"Los 6 síntomas físicos (criterio C · ≥3 en adultos, ≥1 en niños)",c:c,items:[
            "Inquietud o sensación de estar atrapado o con los nervios de punta",
            "Fatigabilidad fácil",
            "Dificultad para concentrarse o sensación de mente en blanco",
            "Irritabilidad",
            "Tensión muscular",
            "Alteraciones del sueño (dificultad para iniciar o mantener, o sueño inquieto no reparador)"
          ]}),
          e(Pearl,{t:"Regla mnemotécnica TAG"},e("b",null,"F-I-C-T-I-S:")," ",e("b",null,"F"),"atiga · ",e("b",null,"I"),"nquietud · ",e("b",null,"C"),"oncentración (dificultad) · ",e("b",null,"T"),"ensión muscular · ",e("b",null,"I"),"rritabilidad · ",e("b",null,"S"),"ueño alterado."),
          e(H3,{c:c,mt:14},"Epidemiología"),
          e(P,null,"Prevalencia anual ~3%. 2:1 en mujeres. Edad media de inicio ~30 años (más tardío que otros trastornos de ansiedad). Curso crónico con fluctuaciones. Comorbilidad con depresión >60%."),
          e(H3,{c:c,mt:14},"Fisiopatología"),
          e(P,null,"Componente hereditario claro (agrega familias, estudios de gemelos). Los cambios principales se localizan en el ",e("b",null,"lóbulo frontal y sistema límbico"),"."),
          e(Table,{
            headers:[{t:"Neurotransmisor",c:c},{t:"Rol en TAG",c:c}],
            rows:[
              ["Noradrenalina","Aumenta el estado de alerta de base"],
              ["GABA","Inhibidor principal — disminuido funcionalmente"],
              ["Serotonina","Regula estado de ánimo y pensamientos rumiativos"]
            ]
          })
        ),
        dx:e(CritBlock,{title:"TAG",c:c},
          e(Crit,{crit:"A",c:c},"Ansiedad y preocupación excesivas, la mayoría de los días, durante ",e("b",null,"≥6 meses"),", sobre diversos sucesos o actividades."),
          e(Crit,{crit:"B",c:c},"Al individuo le resulta ",e("b",null,"difícil controlar la preocupación"),"."),
          e(Crit,{crit:"C",c:c},"La ansiedad se asocia con ",e("b",null,"≥3 de 6 síntomas")," (",e("b",null,"≥1 en niños"),")."),
          e(Crit,{crit:"D",c:c},"Causa malestar o deterioro clínicamente significativo."),
          e(Crit,{crit:"E",c:c},"No atribuible a sustancia o enfermedad médica."),
          e(Crit,{crit:"F",c:c},"No mejor explicada por otro trastorno mental.")
        ),
        tx:e("div",null,
          e(P,null,"1ª línea: ",e("b",null,"ISRS")," (sertralina, escitalopram) o ",e("b",null,"IRSN")," (venlafaxina XR, duloxetina — duloxetina solo en TAG). Pueden combinarse con ",e("b",null,"buspirona")," (coadyuvante exclusivo de TAG, 15–60 mg/día, sin dependencia). ",e("b",null,"Pregabalina")," 150–600 mg/día como 2ª línea."),
          e(P,null,e("b",null,"Psicoterapia:")," TCC con relajación, reinhalación, meditación.")
        )
      }
    },
    {
      n:"04",name:"Fobia específica",
      blurb:"Miedo a UN objeto o situación concreta, ≥6 meses",
      sections:{
        def:e(Def,{c:c},"Miedo o ansiedad intensos ante un ",e("b",null,"objeto o situación específicos")," (estímulo fóbico), que ",e("b",null,"casi siempre")," provocan reacción inmediata y son ",e("b",null,"activamente evitados"),"."),
        cli:e("div",null,
          e(P,null,e("b",null,"Epidemiología:")," prevalencia de por vida ~11%. Más común en mujeres. Inicio típico antes de los 12 años. Las fobias específicas tienden a ceder con la edad."),
          e(H3,{c:c,mt:14},"Los 5 subtipos (especificadores)"),
          e(Table,{
            headers:[{t:"Subtipo",c:c},{t:"Ejemplos",c:c},{t:"Respuesta fisiológica",c:c}],
            rows:[
              ["Animal","Arañas, serpientes, perros, insectos","Taquicardia, hiperventilación"],
              ["Ambiente natural","Alturas, tormentas, agua","Taquicardia"],
              ["Sangre-inyección-daño (SID)","Agujas, sangre, heridas, procedimientos médicos","🩸 Respuesta VASOVAGAL bifásica (taquicardia → bradicardia → síncope)"],
              ["Situacional","Aviones, ascensores, espacios cerrados","Taquicardia, sensación de asfixia"],
              ["Otros","Atragantamiento, vómito, ruidos fuertes, personajes disfrazados en niños","Variable"]
            ]
          }),
          e(Alert,{c:C.bad,label:"⚠️ Trampa clásica: fobia SID"},"Es la ",e("b",null,"ÚNICA fobia")," con respuesta vasovagal. El paciente primero taquicardiza, luego ",e("b",null,"bradicardiza → hipotensión → síncope"),". La técnica conductual específica es la ",e("b",null,"tensión aplicada")," (tensar músculos grandes — piernas, glúteos, brazos — durante 15 segundos para elevar la PA y evitar el síncope).")
        ),
        dx:e(CritBlock,{title:"Fobia específica",c:c},
          e(Crit,{crit:"A",c:c},"Miedo o ansiedad intensos por un objeto o situación específicos (en niños puede manifestarse como llanto, rabietas, parálisis o aferramiento)."),
          e(Crit,{crit:"B",c:c},"El objeto o situación fóbicos casi siempre provocan miedo o ansiedad inmediatos."),
          e(Crit,{crit:"C",c:c},"El objeto o situación se evitan activamente o se soportan con miedo o ansiedad intensos."),
          e(Crit,{crit:"D",c:c},"El miedo es desproporcionado al peligro real."),
          e(Crit,{crit:"E",c:c},"Persistente, ",e("b",null,"≥6 meses"),"."),
          e(Crit,{crit:"F",c:c},"Causa malestar o deterioro clínico."),
          e(Crit,{crit:"G",c:c},"No mejor explicado por otro trastorno.")
        ),
        tx:e(P,null,"NO hay tratamiento farmacológico de primera línea. El tratamiento de elección es la ",e("b",null,"exposición in vivo (TCC)")," con técnicas de desensibilización sistemática y saturación. BZD puntual solo para situaciones aisladas (ej: un vuelo anual).")
      }
    },
    {
      n:"05",name:"Trastorno de ansiedad social",
      blurb:"Miedo al escrutinio / evaluación negativa por otros",
      sections:{
        def:e(Def,{c:c},"Miedo o ansiedad intensos en situaciones sociales donde el sujeto está ",e("b",null,"expuesto al posible escrutinio de otros")," (conversar, comer en público, hablar, actuar). Teme actuar de forma que sea ",e("b",null,"humillado"),", ",e("b",null,"rechazado")," u ",e("b",null,"ofenda a otros"),"."),
        cli:e("div",null,
          e(P,null,e("b",null,"Epidemiología:")," prevalencia ~13%, afecta ambos sexos, se inicia en la adolescencia (antes de los 25 años). Curso crónico, desarrollo lento sin precipitantes obvios. ⅛ desarrollan trastorno por uso de sustancias y la mitad cumplen criterios de otro trastorno psiquiátrico."),
          e(H3,{c:c,mt:14},"Especificador: 'solo actuación' (performance only)"),
          e(P,null,"Se aplica cuando el miedo se limita a ",e("b",null,"hablar o actuar en público"),". Este subtipo responde bien a ",e("b",null,"propranolol")," tomado 30–60 min antes de la actuación. El subtipo generalizado requiere ISRS + TCC.")
        ),
        dx:e(CritBlock,{title:"Trastorno de ansiedad social",c:c},
          e(Crit,{crit:"A",c:c},"Miedo o ansiedad intensos en ≥1 situaciones sociales con posible escrutinio."),
          e(Crit,{crit:"B",c:c},"Teme actuar de un modo o mostrar síntomas de ansiedad que serán evaluados negativamente."),
          e(Crit,{crit:"C",c:c},"Las situaciones sociales casi siempre provocan miedo/ansiedad."),
          e(Crit,{crit:"D",c:c},"Se evitan o soportan con miedo intenso."),
          e(Crit,{crit:"E",c:c},"Miedo desproporcionado a la amenaza real."),
          e(Crit,{crit:"F",c:c},"Persistente, ",e("b",null,"≥6 meses"),"."),
          e(Crit,{crit:"G",c:c},"Malestar o deterioro clínicamente significativo."),
          e(Crit,{crit:"H",c:c},"No por sustancia, enfermedad, ni otro trastorno mental."),
          e(Crit,{crit:"I",c:c},"Si hay enfermedad médica, el miedo no guarda relación o es excesivo respecto a ella.")
        ),
        tx:e("div",null,
          e(P,null,e("b",null,"Generalizada (1ª línea):")," ISRS (sertralina, paroxetina 20–50 mg/día, escitalopram, fluoxetina 10–30 mg/día) o IRSN (venlafaxina 75–225 mg/día)."),
          e(P,null,e("b",null,"Solo actuación:")," ",e("b",null,"propranolol 10–40 mg")," puntual 30–60 min antes."),
          e(P,null,e("b",null,"Psicoterapia:")," TCC + terapia conductual con exposición (desensibilización sistemática, saturación).")
        )
      }
    },
    {
      n:"06",name:"Ansiedad por separación",
      blurb:"Miedo a separarse de la figura de apego",
      sections:{
        def:e(Def,{c:c},"Miedo o ansiedad excesivos e inapropiados para el nivel del desarrollo relacionados con la ",e("b",null,"separación de las figuras de apego")," (mamá, papá, pareja). Antes del DSM-5 se diagnosticaba solo en niños; ahora puede diagnosticarse en adultos."),
        cli:e("div",null,
          e(SxList,{title:"Síntomas (≥3 de 8)",c:c,items:[
            "Malestar excesivo y recurrente al anticipar o vivir la separación",
            "Preocupación persistente por perder a las figuras de apego",
            "Preocupación persistente por experimentar un suceso que provoque la separación",
            "Resistencia o rechazo a salir (ir al colegio, trabajo) por miedo a separarse",
            "Miedo o rechazo excesivo a estar solo o sin las figuras de apego",
            "Rechazo a dormir fuera de casa o sin esa persona cerca",
            "Pesadillas repetidas sobre separación",
            "Quejas repetidas de síntomas físicos (cefaleas, dolor abdominal, náuseas, vómitos)"
          ]}),
          e(Note,{c:c,t:"Duración"},e("b",null,"≥4 semanas en niños/adolescentes")," y ",e("b",null,"≥6 meses en adultos"),".")
        ),
        dx:e(P,null,"Diagnóstico clínico por los síntomas listados + duración mínima. Causa malestar o deterioro (problemas en escuela, trabajo, relaciones sociales)."),
        tx:e(P,null,e("b",null,"1ª línea:")," terapia cognitivo-conductual + terapia familiar. ",e("b",null,"ISRS")," (fluoxetina, sertralina) en casos graves.")
      }
    },
    {
      n:"07",name:"Mutismo selectivo",
      blurb:"No habla en situaciones sociales específicas; sí habla en casa",
      sections:{
        def:e(Def,{c:c},"Fracaso constante para ",e("b",null,"hablar en situaciones sociales específicas")," (típicamente la escuela) donde se espera que hable, a pesar de hacerlo ",e("b",null,"normalmente en otros contextos")," (como en casa con familia cercana)."),
        cli:e("div",null,
          e(P,null,"Poco frecuente. Afecta principalmente a niños pequeños. En lugares como la escuela o con personas desconocidas, el niño no inicia conversación ni responde. Pero en casa o con personas de confianza habla normalmente."),
          e(Note,{c:c,t:"Diagnóstico diferencial importante"},"NO es lo mismo que timidez normal ni desconocimiento del idioma. El niño SÍ sabe hablar, pero no habla en ciertas situaciones sociales.")
        ),
        dx:e(CritBlock,{title:"Mutismo selectivo",c:c},
          e(Crit,{crit:"A",c:c},"Fracaso constante de hablar en situaciones sociales específicas donde existe expectativa de hablar, a pesar de hacerlo en otras."),
          e(Crit,{crit:"B",c:c},"Interfiere en los logros educativos, laborales o en la comunicación social."),
          e(Crit,{crit:"C",c:c},"Duración ",e("b",null,"≥1 mes")," (no limitado al primer mes del curso escolar)."),
          e(Crit,{crit:"D",c:c},"El fracaso no se debe a desconocimiento del idioma."),
          e(Crit,{crit:"E",c:c},"No se explica mejor por un trastorno de la comunicación o del espectro autista.")
        ),
        tx:e(P,null,"Trastorno difícil de tratar. ",e("b",null,"ISRS")," + ",e("b",null,"terapia conductual")," con reforzamiento positivo, desensibilización y entrenamiento en habilidades sociales.")
      }
    },
    {
      n:"08",name:"Inducido por sustancia",
      blurb:"Relación temporal clara con consumo o abstinencia",
      sections:{
        def:e(Def,{c:c},"Síntomas de ansiedad que aparecen durante o poco después de la ",e("b",null,"intoxicación o abstinencia")," de una sustancia."),
        cli:e(Table,{
          headers:[{t:"Mecanismo",c:c},{t:"Sustancias típicas",c:c}],
          rows:[
            ["Ansiedad por intoxicación","Cafeína (>250 mg), cocaína, anfetaminas, alucinógenos, cannabis, nicotina"],
            ["Ansiedad por abstinencia","Alcohol, benzodiacepinas, opioides, nicotina"],
            ["Medicamentos","Corticoides, hormonas tiroideas, broncodilatadores β-agonistas, descongestivos, levodopa, antihipertensivos"]
          ]
        }),
        dx:e(P,null,"Relación temporal clara con el consumo o abstinencia. Los síntomas remiten al retirar la sustancia o completar la desintoxicación. Descartar siempre antes de diagnosticar un trastorno primario de ansiedad."),
        tx:e(P,null,"Suspender o ajustar la sustancia causal. Manejo sintomático de la abstinencia si corresponde (benzodiacepinas por alcohol, clonidina por opioides). No se trata como ansiedad primaria.")
      }
    },
    {
      n:"09",name:"Por afección médica",
      blurb:"Ansiedad secundaria a enfermedad (tiroides, feocromocitoma, arritmia)",
      sections:{
        def:e(Def,{c:c},"Los síntomas son ",e("b",null,"consecuencia fisiopatológica directa")," de una enfermedad. Siempre descartar antes de diagnosticar un trastorno primario de ansiedad."),
        cli:e(Table,{
          headers:[{t:"Causa médica",c:c},{t:"Cómo sospecharla",c:c}],
          rows:[
            ["Hipertiroidismo","Temblor fino, taquicardia, pérdida de peso, intolerancia al calor · TSH ↓, T4 libre ↑"],
            ["Feocromocitoma","Crisis paroxísticas con HTA severa + cefalea + sudoración · metanefrinas en orina 24h"],
            ["Arritmias (TSV, FA paroxística)","Inicio y cese súbitos · ECG/Holter"],
            ["Hipoglucemia","Relación con ayuno · glucemia capilar durante crisis"],
            ["EPOC / asma","Disnea como síntoma primario · espirometría"],
            ["Insuficiencia cardíaca","Disnea de esfuerzo + edemas · eco"]
          ]
        }),
        dx:e(Pearl,{t:"Regla de oro"},"En TODO paciente con ansiedad ",e("b",null,"nueva en adulto mayor")," o ",e("b",null,"atípica"),", solicitar al menos: ",e("b",null,"TSH, ECG, glucemia y tóxicos en orina")," antes de diagnosticar un trastorno primario."),
        tx:e(P,null,"Tratar la causa médica subyacente resuelve la ansiedad en la mayoría de los casos. Puede añadirse manejo sintomático breve con ansiolíticos si el control de la causa es lento.")
      }
    }
  ];

  // Secciones generales del tema (cada una también modal)
  // Section tiles delegate to p.onOpenSection (SM App promotes them to
  // view="section" as a full inline page — no inline DzModal here).
  var general=[
    {id:"conceptos",ic:"🧭",t:"Conceptos generales",sub:"Ansiedad normal vs trastorno",c:c,
     content:e("div",null,
       e(Def,{c:c},"La ansiedad es una ",e("b",null,"respuesta emocional normal")," ante una amenaza real o percibida que prepara al organismo para reaccionar (respuesta de ",e("b",null,"lucha o huida"),"). Se convierte en trastorno cuando es ",e("b",null,"excesiva"),", carece de causa real proporcional, ",e("b",null,"persiste en el tiempo")," e ",e("b",null,"interfiere con el funcionamiento diario"),"."),
       e(H3,{c:c},"Ansiedad normal vs trastorno"),
       e(Table,{
         headers:[{t:"Característica",c:c},{t:"Descripción",c:c}],
         rows:[
           ["Ansiedad normal","Respuesta adaptativa ante un estímulo real. Proporcional al peligro. Transitoria y autolimitada"],
           ["Trastorno de ansiedad","Excesiva, desproporcionada o sin causa real. Persistente (semanas a meses). Interfiere con la vida diaria"],
           ["Criterio de duración general","Generalmente ≥ 6 meses en adultos (varía según el trastorno específico)"],
           ["Síntomas físicos comunes","Palpitaciones, sudoración, temblor, tensión muscular, disnea, mareo, sensación de peligro inminente"]
         ]
       }),
       e(Alert,{c:C.warn,label:"⚠️ Concepto clave"},"La ansiedad se vuelve ",e("b",null,"PATOLÓGICA")," cuando es excesiva, no tiene causa real proporcional, dura mucho tiempo y ",e("b",null,"DETERIORA")," el funcionamiento social, laboral o familiar del paciente."),
       e(H3,{c:c,mt:18},"Miedo · Ansiedad · Fobia — tres conceptos que se confunden"),
       e(Table,{
         headers:[{t:"Término",c:c},{t:"Definición",c:c},{t:"Ejemplo",c:c}],
         rows:[
           ["Miedo","Respuesta emocional ante una amenaza REAL o INMINENTE. Activa lucha o huida. Adaptativo y proporcional al peligro.","Un perro agresivo se acerca ladrando · el pulso se acelera"],
           ["Ansiedad","ANTICIPACIÓN cognitiva de una amenaza FUTURA. Puede o no tener disparador identificable. Orientada a la preparación y la vigilancia.","Preocuparse por la reunión de trabajo de mañana"],
           ["Fobia","Miedo PERSISTENTE, IRRACIONAL y DESPROPORCIONADO ante un objeto o situación específicos. Provoca evitación activa y deteriora el funcionamiento.","Pánico intenso al ver una araña pequeña · evitar cualquier contexto donde pudiera haberlas"]
         ]
       }),
       e(H3,{c:c,mt:18},"Las 10 entidades DSM-5"),
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"Característica central",c:c}],
         rows:[
           ["Ansiedad por separación","Miedo excesivo e inapropiado a separarse de la figura de apego"],
           ["Mutismo selectivo","Incapacidad para hablar en situaciones sociales específicas pese a poder hacerlo en otros contextos"],
           ["Fobia específica","Temor irracional, intenso y desproporcionado a un objeto o situación concreta"],
           ["Ansiedad social (fobia social)","Miedo intenso a situaciones de escrutinio social; temor a la humillación"],
           ["Trastorno de pánico","Ataques de pánico inesperados y recurrentes con repercusión psicológica o conductual"],
           ["Agorafobia","Miedo a situaciones donde escapar sería difícil; a menudo asociada al trastorno de pánico"],
           ["TAG","Preocupación excesiva y difícil de controlar sobre múltiples áreas, ≥ 6 meses"],
           ["Inducido por sustancias","Ansiedad secundaria a intoxicación o abstinencia de sustancias o medicamentos"],
           ["Por afección médica","Ansiedad directamente causada por una enfermedad orgánica"],
           ["Otro / No especificado","Cuadros que no cumplen criterios completos para ninguna categoría anterior"]
         ]
       })
     )},
    {id:"crisis",ic:"💥",t:"Crisis de pánico",sub:"Especificador · 13 síntomas por sistema",c:c,
     content:e("div",null,
       e(Def,{c:c},"Aparición súbita de miedo o malestar intensos que alcanza su pico en pocos minutos (<10 min) y cede en <30 min. Para contarla, deben aparecer ",e("b",null,"≥ 4 de 13 síntomas"),"."),
       e(Alert,{c:C.bad,label:"⚠️ Punto clave"},"La crisis de pánico ",e("b",null,"NO es un trastorno")," por sí sola. Es un ",e("b",null,"especificador")," que se puede añadir a cualquier diagnóstico. SOLO cuando son ",e("b",null,"inesperadas y recurrentes")," se diagnostica trastorno de pánico."),
       e(H3,{c:c},"Los 13 síntomas (≥4) organizados por sistema"),
       e(Table,{
         headers:[{t:"Sistema",c:c},{t:"Síntoma",c:c},{t:"Descripción",c:c}],
         rows:[
           ["Cardiovascular","Palpitaciones / pulso saltón","Taquicardia o sensación de latidos fuertes"],
           ["Tegumentario","Sudoración","Diaforesis generalizada"],
           ["Motor","Temblores o sacudidas","Temblor fino o grueso de extremidades"],
           ["Respiratorio","Disnea / sofocamiento","Dificultad para respirar, sensación de ahogo"],
           ["Respiratorio","Sensación de ahogamiento","Opresión o cierre de garganta"],
           ["Cardíaco","Dolor precordial","Dolor en el pecho que simula cardiopatía"],
           ["Gastrointestinal","Náuseas / malestar abdominal","Sensación de mariposas o dolor difuso"],
           ["Neurológico","Mareo / inestabilidad / desmayo","Presíncope, sensación de flotar"],
           ["Térmico","Escalofríos o calor","Oleadas de frío o calor intenso"],
           ["Sensorial","Parestesias","Entumecimiento u hormigueo en extremidades o cara"],
           ["Perceptivo","Desrealización / despersonalización","Sensación de que el mundo es irreal o de estar separado de uno mismo"],
           ["Cognitivo","Miedo a perder el control","Temor a 'volverse loco'"],
           ["Cognitivo","Miedo a morir","Convicción de muerte inminente"]
         ]
       }),
       e(Note,{c:c,t:"Tipos de crisis"},e("b",null,"Inesperada (espontánea):")," sin disparador · definen el trastorno de pánico. · ",e("b",null,"Esperada (situacional):")," en respuesta a estímulo fóbico conocido · fobias, TEPT, etc.")
     )},
    {id:"rx",ic:"💊",t:"Tratamiento · resumen del tema",sub:"Dosis + reglas de oro",c:c,
     content:e("div",null,
       e(P,null,"Resumen compacto. El detalle por enfermedad está en cada ficha."),
       e(H3,{c:c},"TAG y Trastorno de pánico"),
       e(Table,{
         headers:[{t:"Línea",c:c},{t:"Fármaco",c:c},{t:"Dosis",c:c}],
         rows:[
           ["1ª línea","Sertralina (ISRS)","50–200 mg/día"],
           ["1ª línea","Escitalopram (ISRS)","10–20 mg/día"],
           ["1ª línea","Venlafaxina XR (IRSN)","75–225 mg/día"],
           ["1ª línea","Duloxetina (IRSN · solo TAG)","60–120 mg/día"],
           ["2ª línea / coadyuvante","Pregabalina","150–600 mg/día"],
           ["2ª línea / coadyuvante","Buspirona (solo TAG)","15–60 mg/día"],
           ["Puente ≤4–6 sem","Clonazepam","0.5–2 mg/día"],
           ["Puente ≤4–6 sem","Alprazolam","0.25–3 mg/día"]
         ]
       }),
       e(H3,{c:c},"Fobia social"),
       e(Table,{
         headers:[{t:"Situación",c:c},{t:"Fármaco",c:c},{t:"Dosis",c:c}],
         rows:[
           ["Generalizada (1ª línea)","Sertralina, paroxetina, escitalopram","Igual que en pánico/TAG"],
           ["Generalizada (alternativa)","Venlafaxina XR","75–225 mg/día"],
           ["Solo actuación","Propranolol (30–60 min antes)","10–40 mg puntual"]
         ]
       }),
       e(H3,{c:c},"Fobia específica"),
       e(P,null,"NO hay tratamiento farmacológico de primera línea. El tratamiento de elección es la ",e("b",null,"exposición in vivo (TCC)"),"."),
       e(Alert,{c:C.warn,label:"🔑 Reglas de oro"},
         e("ol",{style:{margin:0,paddingLeft:20,lineHeight:1.8,fontSize:13}},
           e("li",null,"Iniciar ISRS a ",e("b",null,"MITAD de dosis")," → la 'activación inicial' (↑ansiedad 7–14 días) es lo que más los hace abandonar."),
           e("li",null,"Respuesta completa: ",e("b",null,"6–12 semanas"),". No cambies antes."),
           e("li",null,"Mantener ≥12 meses después de remisión total. Retirar gradualmente (25% cada 2–4 sem)."),
           e("li",null,"BZD: solo como ",e("b",null,"puente corto (≤4–6 sem)"),". Evitar en: consumo previo, SAOS, adultos mayores, embarazo."),
           e("li",null,"TCC es equivalente o superior a fármacos en ansiedad — ofrecerla siempre.")
         )
       )
     )},
    {id:"ddx",ic:"🧭",t:"Diagnóstico diferencial",sub:"Orden de descarte",c:c,
     content:e("div",null,
       e(P,null,"Antes de diagnosticar un trastorno primario, descartar en orden:"),
       e(Table,{
         headers:[{t:"Prioridad",c:c},{t:"A descartar",c:c},{t:"Cómo",c:c}],
         rows:[
           ["1","Causa médica","TSH, ECG, glucemia, metanefrinas si HTA paroxística"],
           ["2","Sustancias","Tóxicos en orina · historia de consumo · cafeína"],
           ["3","Medicamentos","Revisar lista (corticoides, β-agonistas, levodopa)"],
           ["4","Otro trastorno mental","TEPT (trauma), TOC (obsesiones), depresión, psicosis"],
           ["5","Recién, diagnosticar","Trastorno de ansiedad primario"]
         ]
       })
     )},
    {id:"perlas",ic:"📌",t:"Perlas para el examen",sub:"Alto rendimiento",c:c,
     content:e("div",null,
       e(Pearl,{t:"Pánico ≠ agorafobia desde DSM-5"},"En CIE-10 eran un solo diagnóstico. En DSM-5 son ",e("b",null,"independientes"),". Pueden codiagnosticarse."),
       e(Pearl,{t:"SID = bradicardia"},"Única fobia con respuesta vasovagal bifásica. Técnica: ",e("b",null,"tensión aplicada"),"."),
       e(Pearl,{t:"Paroxetina — el villano discreto"},"ISRS más sedante y con ",e("b",null,"peor síndrome de discontinuación"),". Evitarla en embarazo (clase D FDA)."),
       e(Pearl,{t:"Propranolol"},"Útil SOLO en fobia social tipo actuación. NO sirve en fobia social generalizada ni en TAG ni en pánico."),
       e(Pearl,{t:"TAG + depresión"},"Comorbilidad >60%. Un solo ISRS o IRSN trata ambas."),
       e(Pearl,{t:"Buspirona"},"Coadyuvante SOLO en TAG. Sin utilidad en pánico ni fobias. No produce dependencia."),
       e(Pearl,{t:"Mutismo selectivo"},"Se mudó de 'trastornos de la infancia' a este capítulo en DSM-5 porque se reconoce su naturaleza ansiosa.")
     )},
    {id:"quiz",ic:"❓",t:"Quiz · 6 casos clínicos",sub:"Prueba tus conocimientos",c:c,
     content:e(Quiz,{c:c,items:getAllQuiz("anxiety")})},
    {id:"resumen",ic:"📊",t:"Resumen comparativo",sub:"Todas las entidades en una tabla",c:c,
     content:e("div",null,
       e(P,null,"Tabla de repaso final. Si aprendes solo esto, sabes diferenciar las 7 grandes entidades del capítulo."),
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"Característica central",c:c},{t:"Tratamiento de elección",c:c}],
         rows:[
           ["Ansiedad por separación","Miedo a separarse de la figura de apego. Niños ≥4 sem; adultos ≥6 m","ISRS (fluoxetina, sertralina) en casos moderados-graves"],
           ["Mutismo selectivo","No habla en situaciones sociales específicas. Duración ≥1 mes","ISRS + terapia conductual"],
           ["Fobia específica","Temor irracional a objeto/situación concreta. Prevalencia ~11%. Inicio <12 años","TCC con exposición (1ª línea). No suele requerir fármacos"],
           ["Fobia social","Miedo al escrutinio social. Prevalencia ~13%. Crónico","ISRS/IRSN + TCC. β-bloqueadores a corto plazo (subtipo actuación)"],
           ["Trastorno de pánico","Ataques inesperados recurrentes + ≥1 mes de repercusión. Prevalencia 2–5%","ISRS/IRSN ≥1 año. TCC. BZD de rescate"],
           ["Agorafobia","Miedo a situaciones de difícil escape. A menudo con pánico. ≥6 m","Igual que pánico + terapia de exposición gradual"],
           ["TAG","Preocupación excesiva, múltiple, ≥6 m. Prevalencia 4–7%","ISRS, IRSN, buspirona. BZD solo a corto plazo"]
         ]
       })
     )},
    {id:"flash",ic:"🃏",t:"Flashcards",sub:"15 preguntas de estudio",c:c,
     content:e("div",null,
       e(P,null,"Tarjetas de repaso estilo examen. Toca la tarjeta o el botón para revelar la respuesta. Navega con los controles o salta a cualquier pregunta desde la cuadrícula inferior."),
       e(FlashDeck,{c:c,deckId:"anxiety",items:getAllCards("anxiety")})
     )}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Tema 1 · DSM-5-TR",title:"Trastornos de ansiedad"},
      "El ",e("b",null,"miedo")," es la respuesta emocional a una amenaza ",e("i",null,"real o inminente"),". La ",e("b",null,"ansiedad")," es la anticipación de una amenaza ",e("i",null,"futura"),". Cuando son desproporcionadas, persistentes y limitan la vida, hablamos de trastorno. En DSM-5-TR este capítulo incluye ",e("b",null,"9 entidades"),"."
    ),

    // === LAS 9 ENFERMEDADES COMO GRID ===
    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.3),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Información general + Quiz")
    ),
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginTop:10}},
      general.map(function(g,i){
        return e("button",{key:g.id,onClick:function(){if(p&&p.onOpenSection)p.onOpenSection(g);},style:{padding:"14px 12px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:10,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:4,minHeight:90}},
          e("div",{style:{fontSize:22,marginBottom:4}},g.ic),
          e("div",{style:{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Playfair Display"}},g.t),
          e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.4,marginTop:2}},g.sub)
        );
      })
    ),

    // === SECCIONES GENERALES DEL TEMA ===
    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.15)+","+ax(c,.04)+" 90%)",border:"1px solid "+ax(c,.35),borderRadius:14,margin:"18px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Las 9 enfermedades"),
      e("div",{style:{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Toca cualquier enfermedad para abrir su ficha"),
      e("div",{style:{fontSize:12,color:C.mt,marginTop:4,lineHeight:1.45}},"Cada ficha tiene tabs: Definición · Clínica · Diagnóstico · Tratamiento")
    ),
    e(DzGrid,{c:c,items:diseases,onOpen:p&&p.onOpen}),

    e(Abbrev,{c:c,items:[
      {a:"DSM-5-TR",d:"Manual Diagnóstico y Estadístico, 5ª ed., revisión de texto (2022)"},
      {a:"TAG",d:"Trastorno de Ansiedad Generalizada"},
      {a:"SID",d:"Sangre-Inyección-Daño (subtipo de fobia específica)"},
      {a:"ISRS",d:"Inhibidores Selectivos de la Recaptación de Serotonina"},
      {a:"IRSN",d:"Inhibidores de Recaptación de Serotonina y Noradrenalina"},
      {a:"BZD",d:"Benzodiacepinas"},
      {a:"TCC",d:"Terapia Cognitivo-Conductual"},
      {a:"DDx",d:"Diagnóstico diferencial"},
      {a:"TSH",d:"Hormona estimulante del tiroides (tirotropina)"},
      {a:"ECG",d:"Electrocardiograma"},
      {a:"TDM",d:"Trastorno Depresivo Mayor"}
    ]})
  );
}


