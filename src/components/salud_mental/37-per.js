// ══════════════════════════════════════════════════════════════
// TEMA 7 · TRASTORNOS DE LA PERSONALIDAD
// ══════════════════════════════════════════════════════════════

function PerView(p){
  var c=C.per;
  var diseases=[
    // ═══ CLUSTER A · Raros/excéntricos ═══
    {
      n:"A1",name:"Paranoide de la personalidad",c:c,
      blurb:"Cluster A · Desconfianza y suspicacia generalizadas",
      sections:{
        def:e(Def,{c:c},"Patrón de ",e("b",null,"desconfianza y suspicacia generalizadas")," hacia los demás, interpretando sus motivos como malintencionados. Inicia en la adultez temprana y se presenta en diversos contextos."),
        cli:e("div",null,
          e(SxList,{title:"Criterios clínicos · ≥4 de 7",c:c,items:[
            "Sospechas sin base suficiente de que los demás le engañan, hacen daño o se aprovechan",
            "Preocupación por dudas injustificadas sobre la lealtad o fidelidad de amigos o socios",
            "Reticencia a confiar en otros por miedo injustificado a que la información se use maliciosamente",
            "Lectura de significados humillantes o amenazantes en observaciones o sucesos benignos",
            "Rencoroso · guarda agravios durante mucho tiempo",
            "Percibe ataques a su carácter o reputación que no son evidentes para los demás · responde con rabia o contraataque",
            "Sospechas recurrentes, sin base, sobre la fidelidad del cónyuge o pareja"
          ]}),
          e(Note,{c:c,t:"DDx con trastorno delirante y esquizofrenia"},"La ",e("b",null,"personalidad paranoide no tiene delirios ni alucinaciones"),". La desconfianza es una ",e("b",null,"actitud rasgo")," persistente, no una convicción delirante fija.")
        ),
        dx:e(P,null,"Diagnóstico por ≥4 de 7 criterios clínicos + criterios generales de trastorno de personalidad: patrón persistente que se desvía de expectativas culturales, inflexible, inicia en adolescencia/adultez temprana, causa malestar o deterioro, no atribuible a otro trastorno ni a sustancias."),
        tx:e(P,null,"Psicoterapia individual cuidando mucho la alianza terapéutica (es difícil de construir). TCC centrada en atribuciones. Fármacos solo sintomáticos: antipsicóticos a dosis bajas si hay ideación cercana al umbral psicótico.")
      }
    },
    {
      n:"A2",name:"Esquizoide de la personalidad",c:c,
      blurb:"Cluster A · Desapego de relaciones · afectividad restringida",
      sections:{
        def:e(Def,{c:c},"Patrón general de ",e("b",null,"desapego de las relaciones sociales")," y una ",e("b",null,"restricción en la expresión de las emociones")," en las relaciones interpersonales."),
        cli:e("div",null,
          e(SxList,{title:"Criterios · ≥4 de 7",c:c,items:[
            "Ni desea ni disfruta las relaciones íntimas (incluida la familia)",
            "Casi siempre elige actividades solitarias",
            "Tiene poco o nulo interés por las relaciones sexuales con otra persona",
            "Disfruta poco o nada de actividades",
            "No tiene amigos íntimos ni confidentes, aparte de familiares de primer grado",
            "Indiferente a los elogios o a las críticas",
            "Frialdad emocional, desapego o afectividad plana"
          ]}),
          e(Note,{c:c,t:"DDx con espectro autista"},"El esquizoide ",e("b",null,"prefiere")," la soledad (no tiene déficit social). El TEA ",e("b",null,"no entiende")," las señales sociales y tiene restricciones/repeticiones.")
        ),
        dx:e(P,null,"≥4 de los 7 criterios listados, patrón persistente e inflexible."),
        tx:e(P,null,"Psicoterapia de apoyo respetando la necesidad de distancia. Muy difícil de adherir porque el paciente pocas veces busca ayuda. Sin farmacoterapia específica.")
      }
    },
    {
      n:"A3",name:"Esquizotípica de la personalidad",c:c,
      blurb:"Cluster A · Excentricidad + distorsiones cognitivas",
      sections:{
        def:e(Def,{c:c},"Patrón de ",e("b",null,"déficits sociales e interpersonales")," con malestar agudo y capacidad reducida para las relaciones estrechas, además de ",e("b",null,"distorsiones cognitivas o perceptivas y excentricidades")," del comportamiento. Considerado parte del espectro esquizofrénico."),
        cli:e(SxList,{title:"Criterios · ≥5 de 9",c:c,items:[
          "Ideas de referencia (no delirantes)",
          "Creencias raras o pensamiento mágico (telepatía, supersticiones marcadas, 'sexto sentido') que influye en el comportamiento e incongruente con normas culturales",
          "Experiencias perceptivas inusuales, incluidas ilusiones corporales",
          "Pensamiento y lenguaje extraños (vagos, metafóricos, elaborados, estereotipados)",
          "Suspicacia o ideación paranoide",
          "Afectividad inapropiada o restringida",
          "Aspecto o comportamiento raro, excéntrico o peculiar",
          "Carece de amigos íntimos o confidentes, aparte de familiares de primer grado",
          "Ansiedad social excesiva que NO disminuye con la familiaridad y se asocia más con temores paranoides que con juicios negativos sobre uno mismo"
        ]}),
        dx:e(P,null,"≥5 de los 9 criterios. DDx con esquizofrenia (la esquizotípica NO tiene síntomas positivos francos ni deterioro tan marcado)."),
        tx:e(P,null,"TCC + entrenamiento en habilidades sociales. ",e("b",null,"Antipsicóticos atípicos a dosis bajas")," (risperidona 1–2 mg, olanzapina) si hay distorsiones perceptivas severas, suspicacia o ansiedad. ISRS si comorbilidad depresiva/ansiosa.")
      }
    },
    // ═══ CLUSTER B · Dramáticos/emocionales ═══
    {
      n:"B1",name:"Antisocial de la personalidad",c:c,
      blurb:"Cluster B · Desprecio + transgresión de derechos ajenos",
      sections:{
        def:e(Def,{c:c},"Patrón de ",e("b",null,"desprecio y violación de los derechos de los demás")," que se produce desde los 15 años. Requiere antecedentes de ",e("b",null,"trastorno de la conducta antes de los 15 años"),". Se diagnostica a partir de los 18 años."),
        cli:e("div",null,
          e(SxList,{title:"Criterios · ≥3 de 7 (criterio A)",c:c,items:[
            "Incumplimiento de las normas sociales respecto a los comportamientos legales (actos susceptibles de arresto reiterados)",
            "Engaño (mentir repetidamente, uso de apodos falsos, estafar a otros por beneficio propio o placer)",
            "Impulsividad o fracaso para planear el futuro",
            "Irritabilidad y agresividad (peleas físicas o agresiones repetidas)",
            "Desprecio imprudente por la seguridad propia y de los demás",
            "Irresponsabilidad persistente (fracaso para mantener trabajo o cumplir obligaciones económicas)",
            "Falta de remordimiento (indiferencia o racionalización del daño a otros)"
          ]}),
          e(Note,{c:c,t:"Criterios adicionales"},"B: ≥18 años · C: evidencia de trastorno de conducta antes de los 15 años · D: no ocurre exclusivamente en el curso de esquizofrenia o trastorno bipolar."),
          e(Pearl,{t:"Psicopatía ≠ antisocial"},"'Psicopatía' es un término no-DSM (checklist de Hare) que se solapa pero es más específico. Todos los psicópatas cumplen antisocial, pero no todos los antisociales son psicópatas (faltan rasgos de frialdad emocional y encanto superficial).")
        ),
        dx:e(P,null,"≥3 de 7 criterios de A + criterios B, C, D. El antecedente de trastorno de conducta antes de los 15 años es clave."),
        tx:e(P,null,"Pronóstico pobre. Psicoterapia con estructura firme (límites claros, contrato terapéutico). ",e("b",null,"NO hay fármaco específico"),"; manejar impulsividad y agresión con estabilizadores del ánimo o antipsicóticos atípicos en dosis bajas. Muy mala respuesta. Alto riesgo de consumo de sustancias.")
      }
    },
    {
      n:"B2",name:"Límite de la personalidad (TLP)",c:c,
      blurb:"Cluster B · Inestabilidad afectiva + miedo al abandono · autolesión",
      sections:{
        def:e(Def,{c:c},"Patrón de ",e("b",null,"inestabilidad en las relaciones, la autoimagen y los afectos"),", con marcada ",e("b",null,"impulsividad"),". Es el TP más frecuente en consultas y el que más frecuentemente presenta conductas autolesivas y suicidas."),
        cli:e("div",null,
          e(SxList,{title:"Criterios · ≥5 de 9",c:c,items:[
            "Esfuerzos frenéticos por evitar el abandono real o imaginado",
            "Patrón de relaciones interpersonales inestables e intensas, con alternancia entre idealización y devaluación (la 'escisión')",
            "Alteración de la identidad — autoimagen o sentido de sí mismo inestables",
            "Impulsividad en ≥2 áreas potencialmente autodestructivas (gasto, sexo, sustancias, comida atracones, conducción imprudente)",
            "Amenazas, gestos o intentos suicidas recurrentes, o conductas autolesivas (cortes, quemaduras)",
            "Inestabilidad afectiva debida a reactividad marcada del ánimo (disforia intensa de horas, rara vez más de días)",
            "Sentimientos crónicos de vacío",
            "Ira inapropiada e intensa o dificultad para controlarla (muestras de mal genio, peleas físicas)",
            "Ideación paranoide transitoria relacionada con el estrés o síntomas disociativos graves"
          ]}),
          e(H3,{c:c,mt:14},"Asociaciones clave"),
          e(SxList,{c:c,items:[
            "~75% mujeres",
            "~70% tiene antecedentes de trauma infantil (abuso sexual, negligencia)",
            "Tasa de suicidio consumado: ~10% (alta)",
            "Comorbilidad con depresión, TEPT, TCA, sustancias"
          ]})
        ),
        dx:e(P,null,"≥5 de los 9 criterios + patrón persistente e inflexible. Con frecuencia se diagnostica en adolescencia tardía o adultez temprana."),
        tx:e("div",null,
          e(H3,{c:c},"Psicoterapia (1ª línea)"),
          e(Table,{
            headers:[{t:"Modalidad",c:c},{t:"Características",c:c}],
            rows:[
              ["DBT (Terapia dialéctica conductual) ★","1ª línea · Marsha Linehan · mindfulness + regulación emocional + tolerancia al malestar + efectividad interpersonal"],
              ["MBT (Mentalización)","Fomenta capacidad de entender estados mentales propios y ajenos"],
              ["Terapia focalizada en esquemas","Identifica y modifica esquemas tempranos desadaptativos"],
              ["Terapia focalizada en la transferencia","Psicoanalítica · foco en relación terapéutica"]
            ]
          }),
          e(H3,{c:c,mt:14},"Farmacoterapia (sintomática)"),
          e(SxList,{c:c,items:[
            "NO hay fármaco aprobado para TLP per se",
            "Estabilizadores (lamotrigina, valproato) — inestabilidad afectiva, impulsividad",
            "Antipsicóticos atípicos a dosis bajas (aripiprazol, quetiapina) — ideación paranoide, agresividad",
            "ISRS — depresión comórbida (evidencia limitada en síntomas nucleares)"
          ]}),
          e(Alert,{c:C.bad,label:"⚠️ Evitar BZD"},"Riesgo de desinhibición paradójica + alta tasa de adicción en esta población. Evitar.")
        )
      }
    },
    {
      n:"B3",name:"Histriónica de la personalidad",c:c,
      blurb:"Cluster B · Búsqueda de atención + emocionalidad excesiva",
      sections:{
        def:e(Def,{c:c},"Patrón general de ",e("b",null,"emotividad excesiva y búsqueda de atención"),". Prototipo: la persona que 'no puede no ser el centro'."),
        cli:e(SxList,{title:"Criterios · ≥5 de 8",c:c,items:[
          "Se siente incómodo en situaciones donde no es el centro de atención",
          "Interacción con otros a menudo caracterizada por un comportamiento sexualmente seductor o provocativo inapropiado",
          "Muestra expresión emocional cambiante y superficial",
          "Usa sistemáticamente el aspecto físico para atraer la atención",
          "Discurso excesivamente impresionista y falto de detalles (forma dramática sobre contenido)",
          "Autodramatización, teatralidad y expresión exagerada de la emoción",
          "Sugestionabilidad (fácilmente influido por otros o por las circunstancias)",
          "Considera sus relaciones más íntimas de lo que en realidad son"
        ]}),
        dx:e(P,null,"≥5 de los 8 criterios. DDx con TLP (el límite tiene miedo al abandono y autolesión; el histriónico no)."),
        tx:e(P,null,"Psicoterapia psicodinámica o TCC. Fármacos solo sintomáticos (ISRS para depresión comórbida).")
      }
    },
    {
      n:"B4",name:"Narcisista de la personalidad",c:c,
      blurb:"Cluster B · Grandiosidad · necesidad de admiración · falta de empatía",
      sections:{
        def:e(Def,{c:c},"Patrón de ",e("b",null,"grandiosidad")," (en la fantasía o conducta), ",e("b",null,"necesidad de admiración")," y ",e("b",null,"falta de empatía"),"."),
        cli:e(SxList,{title:"Criterios · ≥5 de 9",c:c,items:[
          "Sentido grandioso de la propia importancia (exagera logros, espera ser reconocido como superior sin logros que lo justifiquen)",
          "Fantasías de éxito, poder, brillantez, belleza o amor ideal ilimitados",
          "Se cree 'especial' y único, comprensible solo por personas especiales o de alto estatus",
          "Necesidad excesiva de admiración",
          "Sentido de privilegio (expectativas irrazonables de trato favorable especial)",
          "Explota interpersonalmente (se aprovecha de otros para sus propios fines)",
          "Carece de empatía · no reconoce ni se identifica con los sentimientos de los demás",
          "Con frecuencia envidia a los demás o cree que los demás le envidian",
          "Actitudes o comportamientos arrogantes, de superioridad"
        ]}),
        dx:e(P,null,"≥5 de los 9 criterios. Muy resistente al tratamiento (el paciente pocas veces consulta por sí mismo)."),
        tx:e(P,null,"Psicoterapia individual enfocada en la autoestima frágil subyacente. Los fracasos y desafíos narcisísticos frecuentemente precipitan depresión, lo que los lleva a consulta.")
      }
    },
    // ═══ CLUSTER C · Ansiosos/temerosos ═══
    {
      n:"C1",name:"Evitativa de la personalidad",c:c,
      blurb:"Cluster C · Inhibición social + sentimientos de inadecuación",
      sections:{
        def:e(Def,{c:c},"Patrón de ",e("b",null,"inhibición social, sentimientos de inadecuación e hipersensibilidad a la evaluación negativa"),". El paciente DESEA relaciones pero las evita por miedo al rechazo (diferente del esquizoide, que no las desea)."),
        cli:e(SxList,{title:"Criterios · ≥4 de 7",c:c,items:[
          "Evita actividades laborales que impliquen contacto interpersonal por miedo a la crítica, la desaprobación o el rechazo",
          "Reticencia a implicarse con la gente a menos que esté seguro de agradar",
          "Muestra restricción en las relaciones íntimas por miedo a ser avergonzado o ridiculizado",
          "Preocupación por ser criticado o rechazado en situaciones sociales",
          "Inhibido en situaciones interpersonales nuevas por sentimientos de inadecuación",
          "Se ve a sí mismo como socialmente inepto, sin atractivo personal o inferior",
          "Extremadamente reacio a asumir riesgos personales o actividades nuevas porque pueden resultar embarazosos"
        ]}),
        dx:e("div",null,
          e(P,null,"≥4 de los 7 criterios."),
          e(Note,{c:c,t:"DDx con fobia social generalizada"},"Hay superposición significativa. La ",e("b",null,"personalidad evitativa")," es un patrón pervasivo de toda la vida; la ",e("b",null,"fobia social")," puede ser más circunscrita. Pueden coexistir.")
        ),
        tx:e(P,null,"TCC con exposición gradual + entrenamiento asertivo. ISRS útiles (sertralina, escitalopram) — similar a fobia social generalizada.")
      }
    },
    {
      n:"C2",name:"Dependiente de la personalidad",c:c,
      blurb:"Cluster C · Necesidad excesiva de que lo cuiden",
      sections:{
        def:e(Def,{c:c},"Necesidad ",e("b",null,"excesiva y generalizada")," de que otros lo cuiden, que conlleva un comportamiento ",e("b",null,"sumiso y pegadizo"),", y temores de separación."),
        cli:e(SxList,{title:"Criterios · ≥5 de 8",c:c,items:[
          "Dificultad para tomar decisiones cotidianas sin consejo o tranquilización excesiva de otros",
          "Necesidad de que otros asuman responsabilidades en las principales áreas de su vida",
          "Dificultad para expresar desacuerdo con otros por miedo a perder su apoyo (NO miedo realista a represalias)",
          "Dificultad para iniciar proyectos o hacer cosas por su cuenta (por falta de confianza, no de motivación)",
          "Exageradas cosas para obtener protección y apoyo de otros, hasta el punto de ofrecerse voluntario para hacer cosas desagradables",
          "Se siente incómodo o desamparado cuando está solo por miedos exagerados de ser incapaz de cuidar de sí mismo",
          "Cuando una relación termina, busca urgentemente otra relación como fuente de cuidado y apoyo",
          "Preocupación no realista por ser abandonado a su propio cuidado"
        ]}),
        dx:e(P,null,"≥5 de los 8 criterios."),
        tx:e(P,null,"Psicoterapia individual centrada en autonomía y asertividad. TCC. Evitar fomentar la dependencia al terapeuta.")
      }
    },
    {
      n:"C3",name:"Obsesivo-compulsiva de la personalidad (TOCP)",c:c,
      blurb:"Cluster C · Perfeccionismo rígido · ≠ TOC",
      sections:{
        def:e(Def,{c:c},"Patrón de ",e("b",null,"preocupación por el orden, el perfeccionismo y el control mental e interpersonal"),", a expensas de la flexibilidad, la espontaneidad y la eficiencia."),
        cli:e("div",null,
          e(SxList,{title:"Criterios · ≥4 de 8",c:c,items:[
            "Se preocupa por los detalles, las normas, las listas, el orden, la organización o los horarios hasta perder el punto esencial de la actividad",
            "Perfeccionismo que interfiere con la finalización de tareas",
            "Devoción excesiva por el trabajo y la productividad, excluyendo el ocio y las amistades",
            "Excesivamente concienzudo, escrupuloso e inflexible en cuestiones de moralidad o ética (no explicable por cultura/religión)",
            "Incapaz de deshacerse de objetos gastados o inútiles, incluso cuando no tienen valor sentimental",
            "Reacio a delegar tareas a menos que otros se sometan a su exacta forma de hacer las cosas",
            "Avaro consigo mismo y con los demás (dinero como algo que hay que atesorar para el futuro)",
            "Rigidez y terquedad"
          ]}),
          e(Alert,{c:C.bad,label:"⚠️ TOCP ≠ TOC"},e("b",null,"TOCP:")," rasgo de personalidad EGO-SINTÓNICO (el paciente cree que su rigidez es correcta). ",e("b",null,"TOC:")," obsesiones y compulsiones EGO-DISTÓNICAS (el paciente sabe que son absurdas y quiere librarse de ellas). Son entidades distintas.")
        ),
        dx:e(P,null,"≥4 de los 8 criterios."),
        tx:e(P,null,"Psicoterapia individual (TCC, psicodinámica). Los pacientes consultan generalmente por depresión/ansiedad comórbidas, no por los rasgos nucleares.")
      }
    }
  ];

  var s1=useState(null);var openGen=s1[0],setOpenGen=s1[1];
  var general=[
    {id:"conceptos",ic:"🧭",t:"Conceptos generales",sub:"Definición y organización",c:c,
     content:e("div",null,
       e(Def,{c:c},"Un trastorno de la personalidad es un ",e("b",null,"patrón persistente de experiencia interna y de comportamiento")," que se aparta de forma notable de las expectativas de la cultura del sujeto, es inflexible y generalizado, comienza en la adolescencia o adultez temprana, es estable en el tiempo y causa malestar o deterioro."),
       e(H3,{c:c,mt:14},"Criterios generales DSM-5 (todos deben cumplirse)"),
       e(Table,{
         headers:[{t:"Criterio",c:c},{t:"Descripción",c:c}],
         rows:[
           ["A","Patrón persistente que se desvía de las expectativas culturales, en ≥2 de: cognición, afectividad, funcionamiento interpersonal, control de impulsos"],
           ["B","Patrón inflexible y pervasivo en amplio rango de situaciones personales y sociales"],
           ["C","Causa malestar clínicamente significativo o deterioro social, laboral u otros"],
           ["D","Estable y de larga duración · inicio en adolescencia o adultez temprana"],
           ["E","No se explica mejor por otro trastorno mental"],
           ["F","No atribuible a sustancias ni a otra afección médica"]
         ]
       }),
       e(H3,{c:c,mt:14},"Los 3 clusters"),
       e(Table,{
         headers:[{t:"Cluster",c:c},{t:"Rasgo común",c:c},{t:"Entidades",c:c}],
         rows:[
           ["A · 'Raros o excéntricos'","Pensamiento y conducta extraños","Paranoide · Esquizoide · Esquizotípica"],
           ["B · 'Dramáticos o emocionales'","Inestabilidad afectiva · impulsividad · transgresión","Antisocial · Límite · Histriónica · Narcisista"],
           ["C · 'Ansiosos o temerosos'","Ansiedad · inhibición","Evitativa · Dependiente · Obsesivo-compulsiva"]
         ]
       })
     )},
    {id:"trampas",ic:"🎯",t:"Diagnósticos diferenciales clave",sub:"Para no confundirlos",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Par a diferenciar",c:c},{t:"Clave",c:c}],
         rows:[
           ["Paranoide vs trastorno delirante","Paranoide: actitud desconfiada sin delirios fijos. Delirante: creencia delirante específica ≥1 mes"],
           ["Esquizoide vs TEA","Esquizoide: PREFIERE la soledad. TEA: no entiende las señales sociales + restricciones/repeticiones"],
           ["Esquizotípica vs esquizofrenia","Esquizotípica: excentricidad + distorsiones sin síntomas positivos francos ni deterioro severo"],
           ["Antisocial vs adicción / conducta","Antisocial requiere antecedentes de trastorno de conducta antes de los 15 años"],
           ["Límite vs bipolar II","Límite: inestabilidad afectiva de HORAS, reactiva. Bipolar: episodios de días-semanas, no reactivos"],
           ["Histriónica vs narcisista","Histriónica: busca atención por emocionalidad. Narcisista: busca admiración por superioridad"],
           ["Evitativa vs fobia social","Evitativa: patrón de toda la vida pervasivo. Fobia social: más circunscrita"],
           ["Evitativa vs esquizoide","Evitativa: DESEA pero evita por miedo. Esquizoide: NO DESEA"],
           ["TOCP vs TOC","TOCP: rasgo egosintónico, sin obsesiones/compulsiones clásicas. TOC: obsesiones/compulsiones egodistónicas"]
         ]
       })
     )},
    {id:"tx",ic:"💊",t:"Tratamiento · resumen del tema",sub:"Psicoterapia > farmacología",c:c,
     content:e("div",null,
       e(H3,{c:c},"Psicoterapias específicas"),
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"Psicoterapia de elección",c:c}],
         rows:[
           ["Límite (TLP)","DBT (Linehan) ★ · MBT · esquemas · focalizada en transferencia"],
           ["Antisocial","Muy pobre respuesta · estructura firme · contrato terapéutico"],
           ["Evitativa","TCC con exposición gradual + entrenamiento asertivo"],
           ["Dependiente","TCC enfocada en autonomía"],
           ["Otros","Psicoterapia individual (TCC, psicodinámica)"]
         ]
       }),
       e(H3,{c:c,mt:14},"Farmacoterapia (solo sintomática)"),
       e(Table,{
         headers:[{t:"Diana sintomática",c:c},{t:"Fármaco",c:c}],
         rows:[
           ["Inestabilidad afectiva en TLP","Lamotrigina, valproato"],
           ["Ideación paranoide / agresividad en TLP","Aripiprazol, quetiapina"],
           ["Distorsiones perceptivas en esquizotípica","Risperidona, olanzapina a dosis bajas"],
           ["Ansiedad en evitativa","ISRS (sertralina, escitalopram)"],
           ["Depresión comórbida","ISRS (evidencia limitada en síntomas nucleares)"]
         ]
       }),
       e(Alert,{c:C.bad,label:"⚠️ Evitar BZD en TLP"},"Alta tasa de dependencia y desinhibición paradójica.")
     )},
    {id:"perlas",ic:"📌",t:"Perlas de examen",sub:"Alto rendimiento",c:c,
     content:e("div",null,
       e(Pearl,{t:"3 clusters · ABC"},"A: raros/excéntricos (paranoide, esquizoide, esquizotípica). B: dramáticos/emocionales (antisocial, límite, histriónica, narcisista). C: ansiosos/temerosos (evitativa, dependiente, obsesivo-compulsiva)."),
       e(Pearl,{t:"TLP — tratamiento 1ª línea"},"DBT (terapia dialéctica conductual) de Marsha Linehan es el estándar de oro. Mindfulness + regulación emocional + tolerancia al malestar + efectividad interpersonal."),
       e(Pearl,{t:"TOCP ≠ TOC"},"TOCP: rasgo de personalidad EGO-SINTÓNICO (la persona cree que su perfeccionismo es correcto). TOC: obsesiones y compulsiones EGO-DISTÓNICAS (sabe que son absurdas). Dos entidades distintas."),
       e(Pearl,{t:"Antisocial requiere antecedente"},"Para diagnosticar trastorno antisocial se necesita evidencia de trastorno de la conducta antes de los 15 años. Sin eso, no se diagnostica."),
       e(Pearl,{t:"Evitativa vs esquizoide"},"Evitativa: DESEA las relaciones pero las evita por miedo al rechazo. Esquizoide: NO DESEA las relaciones, prefiere estar solo."),
       e(Pearl,{t:"Escisión en TLP"},"Mecanismo defensivo nuclear: alternancia brusca entre idealización ('eres el mejor') y devaluación ('eres horrible') del mismo objeto/persona. Genera relaciones interpersonales inestables."),
       e(Pearl,{t:"TLP y trauma"},"~70% tiene antecedentes de trauma infantil (abuso sexual, negligencia). No es 'causa única' pero es factor clave."),
       e(Pearl,{t:"Tasa de suicidio en TLP"},"~10% consuma suicidio. La autolesión NO es equivalente a suicidio (regula afecto, no busca morir), pero el riesgo suicida es real y alto."),
       e(Pearl,{t:"Inicio en adultez"},"Todos los TP inician en adolescencia o adultez temprana y son estables en el tiempo. Un cambio súbito en personalidad adulta sugiere causa orgánica (tumor frontal, demencia, enfermedad médica)."),
       e(Pearl,{t:"Narcisismo + depresión"},"Los pacientes narcisistas consultan frecuentemente tras una 'herida narcisista' (fracaso, rechazo, pérdida de estatus) que precipita depresión.")
     )},
    {id:"resumen",ic:"📊",t:"Resumen comparativo",sub:"Los 10 trastornos en tabla",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Cluster",c:c},{t:"Trastorno",c:c},{t:"Rasgo central",c:c}],
         rows:[
           ["A","Paranoide","Desconfianza y suspicacia"],
           ["A","Esquizoide","Desapego · prefiere soledad"],
           ["A","Esquizotípica","Excentricidad + distorsiones cognitivas"],
           ["B","Antisocial","Transgresión de derechos · CC <15 años"],
           ["B","Límite (TLP)","Inestabilidad + miedo abandono · autolesión"],
           ["B","Histriónica","Emotividad + búsqueda de atención"],
           ["B","Narcisista","Grandiosidad + falta de empatía"],
           ["C","Evitativa","Inhibición social · desea pero evita"],
           ["C","Dependiente","Necesidad de ser cuidado · sumisión"],
           ["C","Obsesivo-compulsiva (TOCP)","Perfeccionismo rígido · egosintónico"]
         ]
       })
     )},
    {id:"flash",ic:"🃏",t:"Flashcards",sub:"15 preguntas + las tuyas",c:c,
     content:e("div",null,
       e(P,null,"Tarjetas de repaso de trastornos de personalidad. Añade las tuyas."),
       e(FlashDeck,{c:c,deckId:"personalidad",items:getAllCards("personalidad")})
     )},
    {id:"quiz",ic:"❓",t:"Quiz · 6 casos clínicos",sub:"Prueba tus conocimientos",c:c,
     content:e(Quiz,{c:c,items:getAllQuiz("personalidad")})}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Tema 7 · Neurosis · DSM-5-TR",title:"Trastornos de la personalidad"},
      "Patrones persistentes de experiencia interna y comportamiento que se apartan notablemente de las expectativas culturales, son inflexibles y generalizados, inician en la adolescencia/adultez temprana y son estables en el tiempo. Se organizan en ",e("b",null,"3 clusters")," (A, B y C) y son en total ",e("b",null,"10 entidades"),"."
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.3),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Conceptos · Clusters · DDx · Flashcards · Quiz")
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
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Los 10 trastornos"),
      e("div",{style:{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Toca cualquier trastorno para abrir su ficha"),
      e("div",{style:{fontSize:12,color:C.mt,marginTop:4,lineHeight:1.45}},"Prefijo A/B/C indica el cluster · cada ficha tiene tabs: Definición · Clínica · Diagnóstico · Tratamiento")
    ),
    e(DzGrid,{c:c,items:diseases,onOpen:p&&p.onOpen}),

    e(Abbrev,{c:c,items:[
      {a:"TP",d:"Trastorno de Personalidad"},
      {a:"TLP",d:"Trastorno Límite de Personalidad (borderline)"},
      {a:"TOCP",d:"Trastorno Obsesivo-Compulsivo de la Personalidad"},
      {a:"DBT",d:"Terapia Dialéctico-Conductual (Marsha Linehan)"},
      {a:"MBT",d:"Mentalization-Based Treatment"},
      {a:"TCC",d:"Terapia Cognitivo-Conductual"},
      {a:"CC",d:"Trastorno de la Conducta (conduct disorder, en menores)"},
      {a:"TEA",d:"Trastorno del Espectro Autista"}
    ]})
  );
}



