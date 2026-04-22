function OCDView(p){
  var c=C.toc;
  var diseases=[
    {
      n:"01",name:"Trastorno obsesivo-compulsivo (TOC)",
      blurb:"Obsesiones (pensamientos intrusivos) + compulsiones (rituales)",
      sections:{
        def:e("div",null,
          e(Def,{c:c},e("b",null,"Obsesión:")," pensamiento, impulso o imagen ",e("b",null,"recurrente y persistente"),", vivido como ",e("b",null,"intrusivo y no deseado"),", que genera ansiedad/malestar marcados. El paciente intenta ",e("b",null,"ignorarlos, suprimirlos o neutralizarlos")," con otro pensamiento o acción."),
          e(Def,{c:c},e("b",null,"Compulsión:")," conducta (lavarse, comprobar, ordenar) o acto mental (contar, rezar, repetir palabras en silencio) que el paciente realiza ",e("b",null,"en respuesta a una obsesión")," o siguiendo reglas rígidas. Buscan ",e("b",null,"reducir la ansiedad")," o ",e("b",null,"evitar un suceso temido"),", pero ",e("b",null,"no están conectadas de forma realista")," con lo que intentan neutralizar, o son claramente excesivas.")
        ),
        cli:e("div",null,
          e(H3,{c:c},"Epidemiología"),
          e(P,null,"Prevalencia de por vida ~2–3%. Ligeramente más frecuente en mujeres en adultos; en niños, más en varones. Doble pico de inicio: ~10 años (más grave, asociado a tics) y ~20 años. Curso crónico con fluctuaciones. Comorbilidad con depresión (>60%), otros trastornos de ansiedad, Tourette."),
          e(H3,{c:c,mt:14},"Especificadores de introspección"),
          e(Table,{
            headers:[{t:"Nivel",c:c},{t:"Cómo vive sus creencias",c:c}],
            rows:[
              ["Con buena / aceptable introspección","Reconoce que sus creencias son probablemente NO ciertas o pueden serlo"],
              ["Con poca introspección","Piensa que sus creencias son probablemente SÍ ciertas"],
              ["Con ausencia / creencias delirantes","Está completamente convencido de la veracidad de sus creencias"],
              ["Relacionado con tics","Antecedente actual o pasado de tics (paciente o su historia personal)"]
            ]
          }),
          e(H3,{c:c,mt:14},"Las 4 dimensiones clínicas (subtipos sintomáticos)"),
          e(P,null,"La mayoría de pacientes tienen síntomas de más de una dimensión. No son categorías formales pero orientan la terapia de exposición."),
          e(Table,{
            headers:[{t:"Dimensión",c:c},{t:"Obsesión típica",c:c},{t:"Compulsión típica",c:c}],
            rows:[
              ["Contaminación","Miedo a gérmenes, suciedad, enfermedades, tóxicos","Lavado de manos prolongado, limpieza ritual, evitar tocar objetos"],
              ["Simetría / orden / 'just right'","Malestar intolerable si las cosas están desordenadas o asimétricas","Ordenar, alinear, repetir acciones hasta que se 'sienta bien'"],
              ["Daño / responsabilidad","Miedo a causar daño sin querer (atropellar, dejar gas abierto, incendio)","Comprobación compulsiva (puertas, enchufes, volver al lugar a verificar)"],
              ["Contenido prohibido / tabú","Pensamientos intrusivos sexuales, religiosos, violentos","Actos mentales, rezar, pedir reaseguro, evitar situaciones"]
            ]
          })
        ),
        dx:e(CritBlock,{title:"TOC",c:c},
          e(Crit,{crit:"A",c:c},"Presencia de ",e("b",null,"obsesiones, compulsiones, o ambas"),"."),
          e(Crit,{crit:"B",c:c},"Las obsesiones o compulsiones requieren ",e("b",null,"mucho tiempo")," (>1 h/día) o causan malestar o deterioro clínicamente significativos."),
          e(Crit,{crit:"C",c:c},"No atribuibles a sustancia ni enfermedad médica."),
          e(Crit,{crit:"D",c:c},"No se explican mejor por otro trastorno mental (preocupaciones del TAG, imagen corporal del TDC, acumulación, arrancarse pelo, etc.).")
        ),
        tx:e("div",null,
          e(H3,{c:c},"Regla de oro"),
          e(P,null,e("b",null,"ISRS a dosis ALTAS (doble que en depresión)")," + ",e("b",null,"TCC con EPR"),". La respuesta completa tarda ",e("b",null,"10–12 semanas"),", no 4–6 como en depresión. Objetivo: reducir síntomas 25–35% — no 'curar'."),
          e(H3,{c:c,mt:14},"Farmacología por línea"),
          e(Table,{
            headers:[{t:"Línea",c:c},{t:"Fármaco",c:c},{t:"Dosis para TOC",c:c}],
            rows:[
              ["1ª línea · ISRS","Fluoxetina","40–80 mg/día"],
              ["1ª línea","Sertralina","100–200 mg/día"],
              ["1ª línea","Fluvoxamina","100–300 mg/día"],
              ["1ª línea","Paroxetina","40–60 mg/día"],
              ["1ª línea","Escitalopram","20–40 mg/día"],
              ["2ª línea · ADT","Clomipramina","25–250 mg/día (máxima eficacia histórica, peor tolerancia)"],
              ["3ª línea · augmentación","Risperidona","0.5–3 mg/día (añadir a ISRS)"],
              ["3ª línea · augmentación","Aripiprazol","5–15 mg/día (especialmente si tics)"],
              ["Refractario","EMT, ECT, estimulación cerebral profunda","Cápsula interna anterior / núcleo accumbens"]
            ]
          }),
          e(H3,{c:c,mt:14},"Psicoterapia: la EPR"),
          e(Def,{c:c},e("b",null,"Exposición y Prevención de Respuesta (EPR):")," exposición gradual al disparador obsesivo + ",e("b",null,"impedir la compulsión"),". Con el tiempo la ansiedad baja sola por habituación. Es el ",e("b",null,"gold standard")," psicoterapéutico, equivalente o superior a fármacos aislados."),
          e(Alert,{c:C.warn,label:"🔑 Puntos clave"},
            e("ol",{style:{margin:0,paddingLeft:20,lineHeight:1.8,fontSize:13}},
              e("li",null,"Dosis ",e("b",null,"ALTAS")," (doble que depresión)."),
              e("li",null,"Respuesta tarda ",e("b",null,"10–12 semanas"),". NO cambies antes si hay mejoría parcial a las 6 sem."),
              e("li",null,"Mantener ",e("b",null,"1–2 años")," mínimo tras remisión."),
              e("li",null,"Combinar con EPR SIEMPRE que sea posible."),
              e("li",null,"BZD NO son de primera línea y NO tratan las obsesiones.")
            )
          )
        )
      }
    },
    {
      n:"02",name:"Trastorno dismórfico corporal (TDC)",
      blurb:"Preocupación por defecto físico no observable",
      sections:{
        def:e(Def,{c:c},"Preocupación por ",e("b",null,"defectos o imperfecciones percibidos en la apariencia física")," que son ",e("b",null,"no observables o aparecen leves")," a otras personas. El paciente realiza comportamientos repetitivos (mirarse al espejo, acicalarse excesivamente, pellizcarse la piel, compararse) o actos mentales (comparar su apariencia con otros)."),
        cli:e("div",null,
          e(H3,{c:c},"Áreas típicas y subtipo especial"),
          e(Table,{
            headers:[{t:"Aspecto",c:c},{t:"Detalle",c:c}],
            rows:[
              ["Áreas más frecuentes","Piel (acné, cicatrices) · pelo · nariz · dientes · peso · cara · músculos"],
              ["Subtipo dismorfia muscular","Predominio en varones. Creencia de cuerpo insuficientemente musculoso. Asociado a ejercicio excesivo, anabólicos, dieta restrictiva"],
              ["Introspección","Especificar: con buena/aceptable · con poca · con ausente/delirante (mayoría tiene poca o nula)"],
              ["Comorbilidad","Depresión mayor, trastornos por uso de sustancias, ansiedad social, TOC"]
            ]
          }),
          e(Alert,{c:C.bad,label:"⚠️ Trampa CRÍTICA"},"El paciente con TDC ",e("b",null,"SIEMPRE pide cirugía cosmética"),". ",e("b",null,"Nunca autorizarla"),". La cirugía EMPEORA el cuadro: el cerebro reinterpreta el nuevo aspecto como otro defecto. Riesgo suicida ~4× mayor — ",e("b",null,"screening obligatorio"),".")
        ),
        dx:e(CritBlock,{title:"Trastorno dismórfico corporal",c:c},
          e(Crit,{crit:"A",c:c},"Preocupación por ≥1 defectos o imperfecciones percibidos en la apariencia física que no son observables o parecen sin importancia a otras personas."),
          e(Crit,{crit:"B",c:c},"En algún momento, el individuo ha realizado comportamientos repetitivos (mirarse al espejo, acicalarse en exceso, pellizcarse la piel, buscar reaseguro) o actos mentales (compararse con otros)."),
          e(Crit,{crit:"C",c:c},"La preocupación causa malestar o deterioro clínicamente significativo."),
          e(Crit,{crit:"D",c:c},"La preocupación NO se explica mejor por inquietud por el peso o grasa corporal en un paciente con trastorno de la conducta alimentaria.")
        ),
        tx:e("div",null,
          e(P,null,e("b",null,"Idéntico al TOC"),": ISRS a dosis altas (fluoxetina 40–80, sertralina 150–200) + TCC específica para TDC. Fluoxetina es la más estudiada."),
          e(Pearl,{t:"Screening suicidio"},"Riesgo suicida ~4× mayor que población general. Evaluar siempre ideación e intentos previos.")
        )
      }
    },
    {
      n:"03",name:"Trastorno de acumulación (hoarding)",
      blurb:"Dificultad para descartar posesiones · congestión vital",
      sections:{
        def:e(Def,{c:c},"Dificultad persistente de ",e("b",null,"descartar o desprenderse de posesiones"),", independientemente de su valor real, por una necesidad percibida de guardarlas y por malestar asociado a desprenderse. Como consecuencia, se acumulan posesiones que congestionan espacios y alteran el uso funcional de las áreas vivas."),
        cli:e("div",null,
          e(P,null,"Desde DSM-5 es diagnóstico independiente (antes era subtipo de TOC). Prevalencia ~2–6%."),
          e(Note,{c:c,t:"Especificador"},e("b",null,"Con adquisición excesiva:")," ~80–90% también compran, roban o recolectan en exceso objetos que no necesitan.")
        ),
        dx:e(CritBlock,{title:"Trastorno de acumulación",c:c},
          e(Crit,{crit:"A",c:c},"Dificultad persistente de desprenderse o descartar posesiones, independientemente de su valor real."),
          e(Crit,{crit:"B",c:c},"Esta dificultad se debe a una necesidad percibida de guardarlas y al malestar que produce desecharlas."),
          e(Crit,{crit:"C",c:c},"Como consecuencia, ",e("b",null,"se acumulan posesiones que congestionan")," las zonas habitables y comprometen sustancialmente su uso. Si las zonas viven despejadas, es por intervención de terceros."),
          e(Crit,{crit:"D",c:c},"Causa malestar o deterioro clínicamente significativos."),
          e(Crit,{crit:"E",c:c},"No atribuible a afección médica (ej: lesión cerebral, Prader-Willi)."),
          e(Crit,{crit:"F",c:c},"No se explica mejor por otro trastorno mental (obsesiones del TOC, depresión, delirios, demencia).")
        ),
        tx:e("div",null,
          e(Pearl,{t:"Respuesta a ISRS pobre"},"La respuesta a ISRS es ",e("b",null,"muy inferior")," a la del TOC clásico. Mejor respuesta a ",e("b",null,"TCC específica para acumulación"),": entrenamiento en toma de decisiones, exposición a descarte, reestructuración cognitiva sobre el valor de los objetos.")
        )
      }
    },
    {
      n:"04",name:"Tricotilomanía",
      blurb:"Arrancarse el pelo recurrente con alopecia",
      sections:{
        def:e(Def,{c:c},"Arrancarse el cabello de forma ",e("b",null,"recurrente"),", con la consiguiente pérdida de cabello. El paciente ha intentado repetidamente ",e("b",null,"reducir o abandonar")," la conducta."),
        cli:e("div",null,
          e(P,null,"Áreas típicas: cuero cabelludo, cejas, pestañas, zona púbica. Puede haber ",e("b",null,"tricofagia")," (ingerir pelo) y rara vez ",e("b",null,"tricobezoar")," (masa de pelo en tracto GI que puede requerir cirugía). Inicio típico en pubertad.")
        ),
        dx:e(CritBlock,{title:"Tricotilomanía",c:c},
          e(Crit,{crit:"A",c:c},"Arrancarse el cabello de forma recurrente, con pérdida consecuente."),
          e(Crit,{crit:"B",c:c},"Intentos repetidos de disminuir o detener la conducta."),
          e(Crit,{crit:"C",c:c},"Malestar o deterioro clínico."),
          e(Crit,{crit:"D",c:c},"No atribuible a otra afección médica (ej: dermatológica)."),
          e(Crit,{crit:"E",c:c},"No se explica mejor por síntomas de otro trastorno mental (ej: TDC).")
        ),
        tx:e("div",null,
          e(SxList,{c:c,items:[
            "1ª línea: Terapia de Reversión de Hábito (TRH)",
            "N-acetilcisteína 1200–2400 mg/día — modulación glutamatérgica, buena evidencia y tolerancia",
            "ISRS eficacia limitada comparada con TRH",
            "Clomipramina como alternativa"
          ]})
        )
      }
    },
    {
      n:"05",name:"Trastorno de excoriación",
      blurb:"Pellizcarse la piel con lesiones",
      sections:{
        def:e(Def,{c:c},"Dañarse la piel de forma recurrente (rascarse, pellizcarse) produciendo lesiones cutáneas. El paciente ha intentado repetidamente reducir la conducta."),
        cli:e(P,null,"Áreas típicas: cara, brazos, manos. Alta comorbilidad con TOC. El paciente siente urgencia previa y alivio o gratificación al realizar la conducta."),
        dx:e(CritBlock,{title:"Trastorno de excoriación",c:c},
          e(Crit,{crit:"A",c:c},"Dañarse la piel de forma recurrente produciendo lesiones."),
          e(Crit,{crit:"B",c:c},"Intentos repetidos de reducir o detener la conducta."),
          e(Crit,{crit:"C",c:c},"Malestar o deterioro clínico."),
          e(Crit,{crit:"D",c:c},"No atribuible a sustancia (cocaína produce picor) ni afección médica (sarna, dermatitis)."),
          e(Crit,{crit:"E",c:c},"No se explica mejor por otro trastorno mental (delirio parasitario, TDC, autolesión no suicida, estereotipias).")
        ),
        tx:e(P,null,"TRH · N-acetilcisteína 1200–2400 mg/día · ISRS. Patrón similar a tricotilomanía.")
      }
    },
    {
      n:"06",name:"Inducido por sustancia o medicamento",
      blurb:"Obsesiones/compulsiones en contexto de consumo",
      sections:{
        def:e(Def,{c:c},"Síntomas obsesivo-compulsivos que aparecen durante o poco después de la intoxicación o abstinencia de una sustancia."),
        cli:e(P,null,"Principales causas: estimulantes (cocaína, anfetaminas), cannabis crónico, algunos antipsicóticos paradójicos. El cuadro remite al retirar la sustancia."),
        dx:e(P,null,"Relación temporal clara con el consumo. Los síntomas superan lo esperable para la intoxicación aislada. No se explica mejor por un TOC primario preexistente."),
        tx:e(P,null,"Suspender o ajustar la sustancia causal. Manejo sintomático si corresponde. No se trata como TOC primario.")
      }
    },
    {
      n:"07",name:"Debido a otra afección médica",
      blurb:"Síntomas secundarios a enfermedad orgánica",
      sections:{
        def:e(Def,{c:c},"Síntomas obsesivo-compulsivos como ",e("b",null,"consecuencia fisiopatológica directa")," de una enfermedad neurológica o médica."),
        cli:e(Table,{
          headers:[{t:"Causa",c:c},{t:"Detalle",c:c}],
          rows:[
            ["PANDAS","TOC pediátrico de inicio SÚBITO post-faringitis estreptocócica (P.A.N.D.A.S.)"],
            ["Corea de Sydenham","Asociación clásica con TOC en infancia"],
            ["Lesiones de ganglios basales","ACV, tumores, encefalitis que afectan circuito frontoestriado"],
            ["Esclerosis múltiple","Placas en regiones frontales/estriadas"],
            ["TCE","Trauma que afecte frontal/estriado"]
          ]
        }),
        dx:e(P,null,"Evidencia clara por historia, examen físico o pruebas complementarias de que el trastorno es consecuencia directa de la enfermedad. Descartar causas primarias antes."),
        tx:e("div",null,
          e(P,null,"Tratar la causa subyacente. En PANDAS: antibiótico (penicilina) + manejo estándar del TOC."),
          e(Pearl,{t:"PANDAS"},"Siglas: ",e("b",null,"P"),"ediatric ",e("b",null,"A"),"utoimmune ",e("b",null,"N"),"europsychiatric ",e("b",null,"D"),"isorders ",e("b",null,"A"),"ssociated with ",e("b",null,"S"),"treptococcus. Pregunta casi garantizada en examen si ves niño con TOC súbito post-faringitis.")
        )
      }
    }
  ];

  var s1=useState(null);var openGen=s1[0],setOpenGen=s1[1];
  var general=[
    {id:"conceptos",ic:"🧭",t:"Conceptos generales",sub:"Del capítulo TOC y espectro",c:c,
     content:e("div",null,
       e(P,null,"Este capítulo fue creado en DSM-5 (antes el TOC estaba en ansiedad). Se agrupan aquí porque comparten neurobiología (circuito órbito-fronto-estriatal hiperactivo), fenomenología (pensamientos/preocupaciones repetitivos + conductas repetitivas) y respuesta a tratamiento (ISRS a dosis altas, TCC con EPR). Son ",e("b",null,"7 entidades"),"."),
       e(H3,{c:c,mt:14},"Las 7 entidades"),
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"Núcleo fenomenológico",c:c},{t:"Conducta repetitiva",c:c}],
         rows:[
           ["TOC","Obsesiones (pensamientos intrusivos)","Compulsiones (conductas/actos mentales)"],
           ["TDC","Preocupación por defecto físico percibido","Mirarse al espejo, comparar, retoques"],
           ["Hoarding","Dificultad para descartar posesiones","Adquisición y retención excesivas"],
           ["Tricotilomanía","Urgencia de arrancarse el pelo","Arrancarse el cabello recurrente"],
           ["Excoriación","Urgencia de pellizcarse la piel","Rascarse/pellizcarse hasta lesionar"],
           ["Inducido por sustancia","Secundario a consumo/abstinencia","—"],
           ["Por afección médica","Secundario a enfermedad (PANDAS, lesión estriatal)","—"]
         ]
       })
     )},
    {id:"ddx",ic:"🧭",t:"Diagnóstico diferencial",sub:"Cómo distinguir el TOC",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Pista clave",c:c},{t:"Dx probable",c:c}],
         rows:[
           ["Preocupación por enfermedad grave + síntomas somáticos leves/ausentes","IAD (capítulo somáticos), no TOC"],
           ["Rumiaciones tristes + anhedonia","Depresión mayor con rumiaciones, no TOC"],
           ["Pensamientos sobre apariencia + mirarse al espejo","TDC, no TOC"],
           ["Preocupaciones excesivas sobre múltiples temas reales, no ritualizadas","TAG, no TOC"],
           ["Pensamientos intrusivos tras trauma + re-experimentación","TEPT, no TOC"],
           ["Estereotipias motoras sin obsesión subyacente","Trastorno de movimientos estereotipados"],
           ["Creencias bizarras fijas sin ego-distonía","Trastorno delirante / psicosis"]
         ]
       })
     )},
    {id:"tx",ic:"💊",t:"Tratamiento · resumen del tema",sub:"ISRS dosis altas + EPR",c:c,
     content:e("div",null,
       e(H3,{c:c},"Dosis de ISRS para TOC (doble que depresión)"),
       e(Table,{
         headers:[{t:"Fármaco",c:c},{t:"TOC",c:c},{t:"Depresión (referencia)",c:c}],
         rows:[
           ["Fluoxetina","40–80 mg/día","20 mg/día"],
           ["Sertralina","100–200 mg/día","50 mg/día"],
           ["Fluvoxamina","100–300 mg/día","—"],
           ["Paroxetina","40–60 mg/día","20 mg/día"],
           ["Escitalopram","20–40 mg/día","10 mg/día"],
           ["Clomipramina (ADT)","25–250 mg/día","—"]
         ]
       }),
       e(Alert,{c:C.warn,label:"🔑 Reglas de oro"},
         e("ol",{style:{margin:0,paddingLeft:20,lineHeight:1.8,fontSize:13}},
           e("li",null,"Dosis ALTAS (doble que depresión)."),
           e("li",null,"Respuesta completa ",e("b",null,"10–12 semanas"),". No cambies antes."),
           e("li",null,"Mantener ",e("b",null,"1–2 años")," mínimo tras remisión."),
           e("li",null,"Combinar con EPR SIEMPRE que sea posible."),
           e("li",null,"Refractarios: augmentación con risperidona 0.5–3 mg o aripiprazol 5–15 mg. Si tics, preferir aripiprazol.")
         )
       )
     )},
    {id:"perlas",ic:"📌",t:"Perlas de examen",sub:"Alto rendimiento",c:c,
     content:e("div",null,
       e(Pearl,{t:"Dosis TOC = doble que depresión"},"Sertralina depresión: 50–100 mg. Sertralina TOC: 150–200 mg. Fluoxetina depresión: 20 mg. Fluoxetina TOC: 40–80 mg."),
       e(Pearl,{t:"Respuesta tarda 10–12 semanas"},"No cambies de fármaco a las 6 semanas si hay mejoría parcial. Espera 12 semanas con dosis máxima tolerada."),
       e(Pearl,{t:"EPR es el gold standard psicoterapéutico"},"Exposición + Prevención de Respuesta. Mejor o igual que fármacos aislados; la combinación es la ideal."),
       e(Pearl,{t:"PANDAS"},"TOC de inicio SÚBITO en niño post-faringitis estreptocócica. Tratar la infección + manejo estándar del TOC."),
       e(Pearl,{t:"TDC ≠ trastorno delirante"},"En TDC la introspección puede ser ausente (delirante) pero la creencia es ",e("b",null,"sobre la apariencia"),". En trastorno delirante somático la creencia es sobre enfermedad."),
       e(Pearl,{t:"Hoarding — respuesta farmacológica pobre"},"Desde DSM-5 es dx independiente. ISRS funciona menos que en TOC clásico. Mejor respuesta a TCC específica."),
       e(Pearl,{t:"N-acetilcisteína"},"Útil en tricotilomanía y excoriación (modulación glutamatérgica). Dosis 1200–2400 mg/día."),
       e(Pearl,{t:"Augmentación con antipsicótico"},"Risperidona o aripiprazol se añaden al ISRS tras fracaso de 2 ISRS + clomipramina. Aripiprazol se prefiere si hay tics."),
       e(Pearl,{t:"TDC y cirugía"},"NUNCA autorizar cirugía cosmética — empeora el cuadro. Screening de suicidio obligatorio (riesgo ~4×).")
     )},
    {id:"resumen",ic:"📊",t:"Resumen comparativo",sub:"Las 7 entidades en una tabla",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"Núcleo",c:c},{t:"Tratamiento de elección",c:c}],
         rows:[
           ["TOC","Obsesiones + compulsiones >1h/día","ISRS dosis altas + EPR (10–12 sem)"],
           ["TDC","Preocupación por defecto físico no observable","ISRS dosis altas + TCC · NO cirugía"],
           ["Hoarding","Dificultad para descartar + congestión vital","TCC específica (mejor que ISRS)"],
           ["Tricotilomanía","Arrancarse pelo con alopecia","TRH + N-acetilcisteína 1200–2400 mg"],
           ["Excoriación","Pellizcarse piel con lesiones","TRH + N-acetilcisteína + ISRS"],
           ["Inducido sustancia","Temporalmente ligado al consumo","Suspender sustancia"],
           ["Por afección médica","Secundario a PANDAS, lesión estriatal, etc.","Tratar causa + manejo del TOC"]
         ]
       })
     )},
    {id:"flash",ic:"🃏",t:"Flashcards",sub:"12 preguntas + las tuyas",c:c,
     content:e("div",null,
       e(P,null,"Tarjetas de repaso de TOC y espectro. Toca para revelar la respuesta. Puedes añadir tus propias."),
       e(FlashDeck,{c:c,deckId:"toc",items:getAllCards("toc")})
     )},
    {id:"quiz",ic:"❓",t:"Quiz · 6 casos clínicos",sub:"Prueba tus conocimientos",c:c,
     content:e(Quiz,{c:c,items:getAllQuiz("toc")})}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Tema 2 · Neurosis · DSM-5-TR",title:"TOC y trastornos relacionados"},
      "Capítulo creado en DSM-5 (antes el TOC estaba en ansiedad). Comparten neurobiología (circuito órbito-fronto-estriatal hiperactivo), fenomenología (pensamientos/preocupaciones repetitivos + conductas repetitivas) y respuesta a tratamiento. Son ",e("b",null,"7 entidades"),"."
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.3),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Información general + Flashcards + Quiz")
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
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Las 7 enfermedades"),
      e("div",{style:{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Toca cualquier enfermedad para abrir su ficha"),
      e("div",{style:{fontSize:12,color:C.mt,marginTop:4,lineHeight:1.45}},"Cada ficha tiene tabs: Definición · Clínica · Diagnóstico · Tratamiento")
    ),
    e(DzGrid,{c:c,items:diseases,onOpen:p&&p.onOpen}),

    e(Abbrev,{c:c,items:[
      {a:"TOC",d:"Trastorno Obsesivo-Compulsivo"},
      {a:"TDC",d:"Trastorno Dismórfico Corporal"},
      {a:"Hoarding",d:"Trastorno de acumulación"},
      {a:"EPR",d:"Exposición y Prevención de Respuesta"},
      {a:"TRH",d:"Terapia de Reversión de Hábito"},
      {a:"ISRS",d:"Inhibidores Selectivos de la Recaptación de Serotonina"},
      {a:"ADT",d:"Antidepresivos Tricíclicos (clomipramina)"},
      {a:"EMT",d:"Estimulación Magnética Transcraneal"},
      {a:"ECT",d:"Terapia Electroconvulsiva"},
      {a:"DBS",d:"Estimulación Cerebral Profunda"},
      {a:"PANDAS",d:"TOC pediátrico autoinmune asociado a estreptococo"},
      {a:"NAC",d:"N-Acetilcisteína"}
    ]})
  );
}

