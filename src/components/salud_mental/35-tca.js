// ══════════════════════════════════════════════════════════════
// TEMA 5 · TRASTORNOS DE LA CONDUCTA ALIMENTARIA (TCA)
// ══════════════════════════════════════════════════════════════

function TCAView(p){
  var c=C.tca;
  var diseases=[
    {
      n:"01",name:"Anorexia nerviosa (AN)",c:c,
      blurb:"Restricción + IMC bajo + miedo a engordar + distorsión corporal",
      sections:{
        def:e(Def,{c:c},"Restricción persistente de la ingesta energética que lleva a un ",e("b",null,"peso corporal significativamente bajo")," para edad, sexo, curso del desarrollo y salud física. Se acompaña de ",e("b",null,"miedo intenso a ganar peso")," (incluso cuando el paciente está por debajo del peso saludable) y de ",e("b",null,"alteración en la percepción del peso o la forma corporal"),"."),
        cli:e("div",null,
          e(H3,{c:c},"Los 2 subtipos"),
          e(Table,{
            headers:[{t:"Subtipo",c:c},{t:"Característica",c:c}],
            rows:[
              ["Restrictivo","Pérdida de peso solo por dieta, ayuno y/o ejercicio excesivo. SIN atracones ni purgas en los últimos 3 meses"],
              ["Con atracones/purgas","En los últimos 3 meses hay episodios recurrentes de atracones y/o purgas (vómito autoprovocado, laxantes, diuréticos, enemas)"]
            ]
          }),
          e(H3,{c:c,mt:14},"Gravedad · IMC (adultos)"),
          e(Table,{
            headers:[{t:"Nivel",c:c},{t:"IMC (kg/m²)",c:c}],
            rows:[
              ["Leve","≥ 17"],
              ["Moderada","16 – 16.99"],
              ["Grave","15 – 15.99"],
              ["Extrema","< 15"]
            ]
          }),
          e(H3,{c:c,mt:14},"Epidemiología"),
          e(SxList,{c:c,items:[
            "Prevalencia de por vida ~0.6% (mujeres ~0.9%, hombres ~0.3%)",
            "Inicio típico en adolescencia (13–18 años)",
            "Ratio mujeres:hombres aproximadamente 10:1",
            "Mortalidad más alta de todos los trastornos psiquiátricos (~5–10% a 10 años)",
            "Muerte por complicaciones médicas (arritmias, desnutrición) o por suicidio"
          ]}),
          e(H3,{c:c,mt:14},"Complicaciones médicas"),
          e(Table,{
            headers:[{t:"Sistema",c:c},{t:"Hallazgos",c:c}],
            rows:[
              ["Cardiovascular","Bradicardia, hipotensión, prolongación del QT, arritmias, pericarditis, atrofia miocárdica"],
              ["Endocrino","Amenorrea, hipogonadismo, osteopenia/osteoporosis, hipotiroidismo eutiroideo-enfermo (T3 ↓)"],
              ["Hematológico","Anemia, leucopenia, trombocitopenia (pancitopenia en casos graves)"],
              ["Metabólico","Hipocalemia, hipofosfatemia, hiponatremia, hipoglucemia, deshidratación"],
              ["GI","Retraso del vaciamiento gástrico, estreñimiento, elevación de transaminasas"],
              ["Dermatológico","Lanugo (vello fino en cara, espalda, brazos), piel seca, caída de pelo, acrocianosis"],
              ["Signo de Russell (si purgas)","Callosidades en nudillos por inducir el vómito"]
            ]
          }),
          e(Alert,{c:C.bad,label:"⚠️ Síndrome de realimentación"},"Al iniciar realimentación en paciente severamente desnutrido hay entrada masiva de glucosa, insulina y desplazamiento intracelular de ",e("b",null,"fósforo, potasio y magnesio"),". Riesgo de ",e("b",null,"arritmias fatales, insuficiencia cardíaca y edema pulmonar"),". Prevenir con: aporte calórico ",e("b",null,"inicial BAJO")," (~20 kcal/kg/día), avance lento, suplementos de tiamina, fosfato, potasio y magnesio, monitoreo diario de electrolitos los primeros 7 días.")
        ),
        dx:e(CritBlock,{title:"Anorexia nerviosa (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Restricción de la ingesta energética relativa a los requerimientos que lleva a un peso corporal ",e("b",null,"significativamente bajo")," en el contexto de edad, sexo, curso del desarrollo y salud física."),
          e(Crit,{crit:"B",c:c},"Miedo intenso a ganar peso o a engordar, o comportamiento persistente que interfiere con la ganancia de peso, incluso cuando el peso está significativamente bajo."),
          e(Crit,{crit:"C",c:c},"Alteración en la forma en que se experimenta el peso o la silueta corporal, influencia indebida del peso/silueta en la autoevaluación, o falta persistente de reconocimiento de la gravedad del bajo peso actual.")
        ),
        tx:e("div",null,
          e(H3,{c:c},"Manejo"),
          e(SxList,{c:c,items:[
            "Restablecimiento nutricional y del peso — PRIORIDAD",
            "Hospitalización médica si: IMC <15, bradicardia <40, hipotensión severa, alteración electrolítica, síncope, inestabilidad hemodinámica, falla del tratamiento ambulatorio",
            "Terapia familiar basada en Maudsley (TFB-M) — 1ª línea en adolescentes",
            "TCC-E (terapia cognitivo-conductual mejorada) — 1ª línea en adultos",
            "Olanzapina baja dosis (2.5–10 mg) puede ayudar con ansiedad ante comida y ganancia de peso",
            "Evitar bupropión (↓ umbral convulsivo en pacientes con purgas)",
            "ISRS NO son eficaces en el cuadro central de AN; solo tratan comorbilidades (depresión, TOC)"
          ]}),
          e(Alert,{c:C.warn,label:"🔑 Reglas de oro"},"1) El peso es lo PRIMERO: sin nutrición no hay respuesta a psicoterapia. 2) En adolescentes, FAMILIA como aliada (Maudsley). 3) ISRS solo si depresión o TOC comórbidos — no cura la AN. 4) Vigilancia de realimentación los primeros 7 días.")
        )
      }
    },
    {
      n:"02",name:"Bulimia nerviosa (BN)",c:c,
      blurb:"Atracones + conductas compensatorias · 1/semana x 3 meses · Peso normal",
      sections:{
        def:e(Def,{c:c},"Episodios recurrentes de ",e("b",null,"atracones")," (ingesta en poco tiempo de una cantidad de comida claramente mayor de la que la mayoría de personas comerían, con sensación de ",e("b",null,"pérdida de control"),") seguidos de ",e("b",null,"conductas compensatorias inapropiadas")," para evitar ganar peso (vómito autoprovocado, laxantes, diuréticos, ayuno, ejercicio excesivo). El peso suele estar ",e("b",null,"normal o con sobrepeso"),", no bajo como en anorexia."),
        cli:e("div",null,
          e(H3,{c:c},"Gravedad · promedio semanal de conductas compensatorias"),
          e(Table,{
            headers:[{t:"Nivel",c:c},{t:"Episodios/semana",c:c}],
            rows:[
              ["Leve","1–3"],
              ["Moderado","4–7"],
              ["Grave","8–13"],
              ["Extremo","≥14"]
            ]
          }),
          e(H3,{c:c,mt:14},"Epidemiología"),
          e(SxList,{c:c,items:[
            "Prevalencia de por vida ~1–1.5% (mujeres) · ~0.5% (hombres)",
            "Inicio típico en adolescencia tardía o adultez temprana (18–22 años)",
            "Ratio mujeres:hombres aproximadamente 10:1",
            "Frecuente comorbilidad con depresión, ansiedad, uso de sustancias, trastorno límite de personalidad",
            "Mortalidad menor que en anorexia pero significativa"
          ]}),
          e(H3,{c:c,mt:14},"Signos clínicos clave"),
          e(Table,{
            headers:[{t:"Signo",c:c},{t:"Por qué aparece",c:c}],
            rows:[
              ["Signo de Russell","Callosidades en nudillos por usar los dedos para inducir el vómito"],
              ["Erosión dental del esmalte palatino","Contacto repetido de ácido gástrico con los dientes"],
              ["Hipertrofia parotídea bilateral","Estimulación repetida por vómito · 'cara de ardilla'"],
              ["Alcalosis metabólica hipoclorémica","Pérdida de HCl por vómito · K+ ↓, Cl- ↓"],
              ["Acidosis metabólica","Si abuso de laxantes (pérdida de HCO3- intestinal)"],
              ["Desgarro de Mallory-Weiss","Vómito violento repetido"],
              ["Arritmias","Por hipocalemia secundaria a vómito o diuréticos"]
            ]
          }),
          e(Alert,{c:C.bad,label:"⚠️ Riesgo cardiaco"},"La hipocalemia grave (K+ <3 mEq/L) puede precipitar ",e("b",null,"arritmias ventriculares y paro cardíaco"),". Siempre medir electrolitos y ECG en BN con purgas frecuentes.")
        ),
        dx:e(CritBlock,{title:"Bulimia nerviosa (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Episodios recurrentes de atracones, caracterizados por: (1) ingesta en un periodo determinado (p. ej., 2h) de una cantidad claramente mayor de la que la mayoría de las personas comerían; (2) sensación de falta de control durante el episodio."),
          e(Crit,{crit:"B",c:c},"Comportamientos compensatorios inapropiados recurrentes para evitar ganar peso (vómito, laxantes, diuréticos, ayuno, ejercicio excesivo)."),
          e(Crit,{crit:"C",c:c},"Los atracones y las conductas compensatorias ocurren, en promedio, ",e("b",null,"≥1 vez por semana durante 3 meses"),"."),
          e(Crit,{crit:"D",c:c},"La autoevaluación está indebidamente influida por la silueta y el peso corporal."),
          e(Crit,{crit:"E",c:c},"La alteración no ocurre exclusivamente durante episodios de anorexia nerviosa.")
        ),
        tx:e("div",null,
          e(H3,{c:c},"1ª línea psicoterapéutico"),
          e(P,null,e("b",null,"TCC-E (cognitivo-conductual mejorada)")," · evidencia de primera línea. Terapia interpersonal (TIP) como alternativa."),
          e(H3,{c:c,mt:14},"1ª línea farmacológico"),
          e(Table,{
            headers:[{t:"Fármaco",c:c},{t:"Dosis",c:c},{t:"Notas",c:c}],
            rows:[
              ["Fluoxetina ★","60 mg/día","ÚNICO ISRS con aprobación FDA para BN · dosis mayor que en depresión"],
              ["Sertralina","50–200 mg","Alternativa"],
              ["Topiramato","25–400 mg","Reduce atracones · cuidado con pérdida cognitiva"],
              ["Lisdexanfetamina","No aprobado en BN","Solo aprobado para trastorno por atracón"]
            ]
          }),
          e(Alert,{c:C.bad,label:"⚠️ CONTRAINDICADO"},e("b",null,"Bupropión NUNCA en BN/AN")," — reduce el umbral convulsivo en pacientes con alteraciones electrolíticas por purgas.")
        )
      }
    },
    {
      n:"03",name:"Trastorno por atracón (TpA)",c:c,
      blurb:"Atracones SIN compensación · 1/semana x 3 meses · Obesidad frecuente",
      sections:{
        def:e(Def,{c:c},"Episodios recurrentes de atracones (mismo concepto que en bulimia — ingesta excesiva + pérdida de control) ",e("b",null,"SIN conductas compensatorias")," inapropiadas. Es el TCA más frecuente. Fuerte asociación con ",e("b",null,"obesidad"),"."),
        cli:e("div",null,
          e(H3,{c:c},"Características del atracón"),
          e(SxList,{c:c,items:[
            "Comer mucho más rápidamente de lo normal",
            "Comer hasta sentirse desagradablemente lleno",
            "Comer grandes cantidades sin sentir hambre física",
            "Comer a solas debido a vergüenza",
            "Sentirse disgustado, deprimido o muy culpable después"
          ]}),
          e(H3,{c:c,mt:14},"Gravedad · atracones/semana"),
          e(Table,{
            headers:[{t:"Nivel",c:c},{t:"Atracones/semana",c:c}],
            rows:[
              ["Leve","1–3"],
              ["Moderado","4–7"],
              ["Grave","8–13"],
              ["Extremo","≥14"]
            ]
          }),
          e(H3,{c:c,mt:14},"Epidemiología"),
          e(SxList,{c:c,items:[
            "Prevalencia de por vida ~2–3% · es el TCA más frecuente",
            "Mujeres 2:1 (ratio menos pronunciado que AN o BN)",
            "Pico de inicio en adultez temprana (20s)",
            "~40–50% de los pacientes con obesidad que buscan tratamiento para perder peso tienen TpA",
            "Alta comorbilidad con depresión, ansiedad, trastornos por sustancias"
          ]})
        ),
        dx:e(CritBlock,{title:"Trastorno por atracón (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Episodios recurrentes de atracones (mismos criterios que BN criterio A)."),
          e(Crit,{crit:"B",c:c},"Los atracones se asocian a ≥3 de 5 características listadas arriba."),
          e(Crit,{crit:"C",c:c},"Malestar marcado por los atracones."),
          e(Crit,{crit:"D",c:c},"Los atracones ocurren en promedio ",e("b",null,"≥1 vez/semana durante 3 meses"),"."),
          e(Crit,{crit:"E",c:c},"NO se asocia con conductas compensatorias inapropiadas recurrentes y no ocurre exclusivamente durante BN o AN.")
        ),
        tx:e("div",null,
          e(H3,{c:c},"1ª línea psicoterapéutico"),
          e(P,null,e("b",null,"TCC específica para TpA")," o TCC-E. Terapia interpersonal como alternativa."),
          e(H3,{c:c,mt:14},"Farmacoterapia"),
          e(Table,{
            headers:[{t:"Fármaco",c:c},{t:"Dosis",c:c},{t:"Notas",c:c}],
            rows:[
              ["Lisdexanfetamina ★","50–70 mg/día","ÚNICO con aprobación FDA específica para TpA en adultos"],
              ["Topiramato","100–400 mg/día","Reduce atracones y peso"],
              ["Fluoxetina","60 mg/día","Evidencia moderada"],
              ["Sertralina","50–200 mg/día","Alternativa"]
            ]
          }),
          e(Pearl,{t:"Manejo de la obesidad"},"Combinar manejo del TpA con intervenciones para pérdida de peso (no dietas muy restrictivas, que pueden perpetuar el ciclo). Actividad física regular. Si el paciente busca cirugía bariátrica, tratar el TpA ANTES y durante.")
        )
      }
    },
    {
      n:"04",name:"ARFID (trastorno de evitación/restricción)",c:c,
      blurb:"Evitación alimentaria SIN preocupación por imagen corporal",
      sections:{
        def:e(Def,{c:c},"ARFID = ",e("b",null,"Avoidant/Restrictive Food Intake Disorder"),". Evitación o restricción de la ingesta con pérdida de peso significativa, déficit nutricional, dependencia de suplementación o interferencia psicosocial, ",e("b",null,"SIN")," la preocupación por el peso o la imagen corporal típica de AN o BN."),
        cli:e("div",null,
          e(H3,{c:c},"Las 3 presentaciones principales"),
          e(Table,{
            headers:[{t:"Presentación",c:c},{t:"Características",c:c}],
            rows:[
              ["Sensorial","Aversión a texturas, sabores, olores, aspectos visuales. Frecuente en niños neurodiversos (espectro autista, TDAH)"],
              ["Falta de interés por la comida","Poco apetito · olvida comer · no disfruta comer · saciedad temprana"],
              ["Miedo a consecuencias aversivas","Tras atragantamiento, vómito, reacción alérgica previa · miedo condicionado"]
            ]
          }),
          e(H3,{c:c,mt:14},"Epidemiología"),
          e(SxList,{c:c,items:[
            "Sustituyó al 'trastorno de la ingestión alimentaria en la infancia' del DSM-IV",
            "Puede aparecer a cualquier edad — no es solo infantil",
            "Sin predominio de género claro",
            "Alta comorbilidad con trastornos de ansiedad, TOC, espectro autista, TDAH"
          ]})
        ),
        dx:e(CritBlock,{title:"ARFID (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Trastorno de la alimentación manifestado por fracaso persistente para satisfacer las necesidades nutricionales/energéticas, con ≥1 de: pérdida de peso significativa (o fallo en el crecimiento), deficiencia nutricional significativa, dependencia de nutrición enteral o de suplementos, interferencia marcada con el funcionamiento psicosocial."),
          e(Crit,{crit:"B",c:c},"NO se explica por falta de disponibilidad de alimento ni por una práctica culturalmente sancionada."),
          e(Crit,{crit:"C",c:c},"NO ocurre exclusivamente durante AN o BN, ni hay alteración de la percepción del peso o la forma corporal."),
          e(Crit,{crit:"D",c:c},"No se explica mejor por otra afección médica u otro trastorno mental. Si coexiste con otra afección, la alteración alimentaria excede lo atribuible a ella.")
        ),
        tx:e(P,null,"Equipo multidisciplinar: nutrición + pediatría/medicina + terapeuta ocupacional (para integración sensorial) + TCC. Si hay ansiedad comórbida marcada, ISRS. La exposición gradual a nuevos alimentos es clave. No hay fármaco con indicación específica.")
      }
    },
    {
      n:"05",name:"Pica",c:c,
      blurb:"Ingestión de sustancias no nutritivas por ≥1 mes",
      sections:{
        def:e(Def,{c:c},"Ingestión persistente de ",e("b",null,"sustancias no nutritivas y no alimentarias")," durante ",e("b",null,"≥1 mes"),", inapropiada para el nivel de desarrollo y no culturalmente aceptada. Ejemplos: tierra, hielo (pagofagia), tiza, papel, jabón, pelo, pintura, metal."),
        cli:e("div",null,
          e(P,null,"Frecuente en niños pequeños, embarazadas, personas con déficits nutricionales (anemia ferropénica, deficiencia de zinc), discapacidad intelectual o autismo."),
          e(H3,{c:c,mt:14},"Complicaciones"),
          e(SxList,{c:c,items:[
            "Intoxicación por plomo (comer pintura antigua)",
            "Obstrucción o perforación intestinal",
            "Infecciones parasitarias (geofagia)",
            "Bezoares (tricobezoar si come pelo · fitobezoar si fibras vegetales)",
            "Daño dental"
          ]}),
          e(Pearl,{t:"Pagofagia y anemia ferropénica"},"Comer hielo compulsivamente se asocia fuertemente a ",e("b",null,"déficit de hierro"),". Mejora al corregir la anemia. Siempre medir ferritina en estos pacientes.")
        ),
        dx:e(CritBlock,{title:"Pica (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Ingestión persistente de sustancias no nutritivas y no alimentarias durante ≥1 mes."),
          e(Crit,{crit:"B",c:c},"La ingestión es inapropiada para el nivel de desarrollo del individuo."),
          e(Crit,{crit:"C",c:c},"El comportamiento NO forma parte de una práctica culturalmente aceptada o socialmente normativa."),
          e(Crit,{crit:"D",c:c},"Si ocurre en el contexto de otro trastorno mental o afección médica (ej., autismo, embarazo), debe ser suficientemente grave para justificar atención clínica adicional.")
        ),
        tx:e(P,null,"Evaluar y corregir deficiencias nutricionales (hierro, zinc). Manejar complicaciones médicas. Terapia conductual (análisis funcional, reforzamiento diferencial) en discapacidad intelectual. Revisar y asegurar el entorno (retirar sustancias peligrosas).")
      }
    },
    {
      n:"06",name:"Trastorno de rumiación",c:c,
      blurb:"Regurgitación repetida del alimento · ≥1 mes",
      sections:{
        def:e(Def,{c:c},"Regurgitación repetida del alimento durante ",e("b",null,"≥1 mes"),", que puede ser remasticado, retragado o escupido. NO es atribuible a condiciones gastrointestinales (reflujo, estenosis pilórica) ni ocurre exclusivamente dentro de otro TCA."),
        cli:e("div",null,
          e(P,null,"Aparece en lactantes, niños (especialmente con discapacidad intelectual) y adultos (con o sin discapacidad). En lactantes puede relacionarse con estimulación deficitaria o trastorno del vínculo. En adultos se asocia a estrés y ansiedad."),
          e(Note,{c:c,t:"DDx"},"Diferenciar de ERGE (reflujo patológico con acidez, esofagitis) y de vómito en BN (con conductas compensatorias y preocupación por el peso).")
        ),
        dx:e(CritBlock,{title:"Trastorno de rumiación (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Regurgitación repetida de los alimentos durante ≥1 mes. Los alimentos regurgitados pueden ser remasticados, retragados o escupidos."),
          e(Crit,{crit:"B",c:c},"La regurgitación NO se puede atribuir a una afección GI asociada u otra afección médica (ej., ERGE, estenosis pilórica)."),
          e(Crit,{crit:"C",c:c},"No ocurre exclusivamente en el curso de AN, BN, TpA o ARFID."),
          e(Crit,{crit:"D",c:c},"Si ocurre en otro trastorno mental (p. ej., discapacidad intelectual), debe ser suficientemente grave para justificar atención clínica adicional.")
        ),
        tx:e(P,null,"Terapia conductual (respiración diafragmática, entrenamiento en hábitos), biofeedback. Tratar ansiedad o estrés subyacente. En niños pequeños, mejorar el entorno de alimentación y el vínculo.")
      }
    }
  ];

  // Section tiles delegate to p.onOpenSection (SM App promotes them to
  // view="section" as a full inline page — no inline DzModal here).
  var general=[
    {id:"conceptos",ic:"🧭",t:"Conceptos generales",sub:"Del capítulo TCA",c:c,
     content:e("div",null,
       e(P,null,"Los trastornos de la conducta alimentaria son cuadros con alteraciones persistentes de la conducta de alimentación que resultan en un consumo o absorción alterada de los alimentos, con deterioro significativo de la salud física o del funcionamiento psicosocial."),
       e(H3,{c:c,mt:14},"Las 6 entidades del DSM-5"),
       e(Table,{
         headers:[{t:"Entidad",c:c},{t:"Núcleo",c:c}],
         rows:[
           ["Anorexia nerviosa","Restricción + IMC bajo + miedo a engordar + distorsión corporal"],
           ["Bulimia nerviosa","Atracón + conducta compensatoria · peso normal o sobrepeso"],
           ["Trastorno por atracón","Atracón sin conducta compensatoria · frecuente obesidad"],
           ["ARFID","Evitación/restricción SIN preocupación por imagen corporal"],
           ["Pica","Ingestión de sustancias no nutritivas ≥1 mes"],
           ["Trastorno de rumiación","Regurgitación repetida ≥1 mes"]
         ]
       }),
       e(Note,{c:c,t:"Regla jerárquica"},"AN tiene prioridad sobre BN cuando ambos criterios se cumplen. BN tiene prioridad sobre TpA. Pica puede diagnosticarse en presencia de otro trastorno si es clínicamente significativa.")
     )},
    {id:"ddx",ic:"🧭",t:"Diagnóstico diferencial",sub:"AN vs BN vs TpA · lo esencial",c:c,
     content:e("div",null,
       e(P,null,"Tabla más preguntada en el examen. La distinción clave es: ¿hay restricción con IMC bajo? → AN. ¿Hay atracones + purgas y peso normal? → BN. ¿Hay atracones sin purgas? → TpA."),
       e(Table,{
         headers:[{t:"Característica",c:c},{t:"Anorexia",c:c},{t:"Bulimia",c:c},{t:"Por atracón",c:c}],
         rows:[
           ["Peso","BAJO (IMC < normal)","Normal o sobrepeso","Sobrepeso u obesidad"],
           ["Atracones","Posibles (subtipo)","Presentes","Presentes"],
           ["Conductas compensatorias","Posibles (subtipo)","Presentes","AUSENTES"],
           ["Distorsión imagen corporal","Marcada","Presente","Menos marcada"],
           ["Miedo a engordar","Intenso","Intenso","Menos intenso"],
           ["Tratamiento psicoterapia 1ª línea","TFB-Maudsley (ados) · TCC-E (adultos)","TCC-E","TCC específica TpA"],
           ["Tratamiento farmacológico","Olanzapina (adyuvante)","Fluoxetina 60 mg","Lisdexanfetamina"]
         ]
       })
     )},
    {id:"tx",ic:"💊",t:"Tratamiento · resumen del tema",sub:"Dosis + aprobaciones FDA",c:c,
     content:e("div",null,
       e(H3,{c:c},"Farmacología por entidad"),
       e(Table,{
         headers:[{t:"Entidad",c:c},{t:"Fármaco",c:c},{t:"Dosis",c:c}],
         rows:[
           ["Anorexia","Olanzapina (adyuvante)","2.5–10 mg/día · ayuda ansiedad y peso"],
           ["Bulimia ★","Fluoxetina (FDA)","60 mg/día · única aprobación específica"],
           ["Bulimia alt.","Topiramato","25–400 mg/día"],
           ["Por atracón ★","Lisdexanfetamina (FDA)","50–70 mg/día · única aprobación específica"],
           ["Por atracón alt.","Topiramato · fluoxetina","Similar"],
           ["Comorbilidades","ISRS","Depresión, ansiedad, TOC"]
         ]
       }),
       e(Alert,{c:C.bad,label:"⚠️ CONTRAINDICADOS"},
         e("ol",{style:{margin:0,paddingLeft:20,lineHeight:1.8,fontSize:13}},
           e("li",null,e("b",null,"Bupropión")," — ↓ umbral convulsivo en pacientes con purgas · evitarlo en AN y BN."),
           e("li",null,e("b",null,"Anfetaminas en AN")," — no hay indicación · solo en TpA."),
           e("li",null,e("b",null,"ISRS como 'cura' de AN")," — no tratan el núcleo · solo comorbilidades.")
         )
       ),
       e(H3,{c:c,mt:14},"Psicoterapia"),
       e(Table,{
         headers:[{t:"Modalidad",c:c},{t:"Mejor para",c:c}],
         rows:[
           ["TFB-Maudsley (basada en familia)","Anorexia en adolescentes — 1ª línea"],
           ["TCC-E (enhanced)","BN y AN en adultos"],
           ["TCC específica TpA","Trastorno por atracón"],
           ["Terapia interpersonal","Alternativa en BN y TpA"]
         ]
       })
     )},
    {id:"realim",ic:"⚠️",t:"Síndrome de realimentación",sub:"La emergencia médica del tema",c:c,
     content:e("div",null,
       e(Def,{c:c},"Complicación potencialmente fatal al iniciar nutrición en un paciente severamente desnutrido (IMC <15 o pérdida >15% en 3 meses)."),
       e(H3,{c:c,mt:14},"Fisiopatología"),
       e(P,null,"Durante la desnutrición, el metabolismo se adapta a usar grasa y proteína como fuente de energía; los depósitos de fósforo, potasio y magnesio intracelulares están disminuidos pese a niveles séricos normales. Al introducir glucosa → ",e("b",null,"insulina ↑")," → desplazamiento masivo intracelular de fósforo, potasio y magnesio → ",e("b",null,"hipofosfatemia, hipocalemia, hipomagnesemia graves"),"."),
       e(H3,{c:c,mt:14},"Manifestaciones"),
       e(SxList,{c:c,items:[
         "Arritmias (fibrilación ventricular, torsades por hipoK+ y hipoMg2+)",
         "Insuficiencia cardíaca congestiva aguda",
         "Edema pulmonar",
         "Debilidad muscular grave, rabdomiólisis",
         "Encefalopatía de Wernicke si no se suplementa tiamina",
         "Insuficiencia respiratoria (fosfato es clave para ATP diafragmático)"
       ]}),
       e(Alert,{c:C.warn,label:"🔑 Prevención"},
         e("ol",{style:{margin:0,paddingLeft:20,lineHeight:1.8,fontSize:13}},
           e("li",null,e("b",null,"Tiamina")," 100–200 mg IV/IM ANTES de iniciar alimentación."),
           e("li",null,"Iniciar con ",e("b",null,"20 kcal/kg/día")," (bajo) y avanzar 10–20% cada 2 días."),
           e("li",null,"Suplementar ",e("b",null,"fosfato, potasio, magnesio")," profilácticamente."),
           e("li",null,"Monitoreo diario de electrolitos los primeros 7 días."),
           e("li",null,"Función cardíaca (ECG, FC, peso diario, balance).")
         )
       )
     )},
    {id:"perlas",ic:"📌",t:"Perlas de examen",sub:"Alto rendimiento",c:c,
     content:e("div",null,
       e(Pearl,{t:"Mortalidad de AN"},"Es el trastorno psiquiátrico con la ",e("b",null,"mortalidad más alta")," (~5–10% a 10 años). Causa: arritmias, desnutrición, suicidio."),
       e(Pearl,{t:"Signo de Russell"},"Callosidades en dorso de los nudillos por el contacto repetido con los dientes al provocar el vómito. Patognomónico de ",e("b",null,"purgas")," (BN o AN subtipo con purgas)."),
       e(Pearl,{t:"Hipertrofia parotídea"},"Cara redonda/'de ardilla' en BN por estimulación repetida de las parótidas al vomitar."),
       e(Pearl,{t:"Alcalosis vs acidosis"},"Vómito → alcalosis metabólica hipoclorémica (K+ ↓, Cl- ↓). Abuso de laxantes → acidosis metabólica hiperclorémica (pérdida de HCO3- intestinal)."),
       e(Pearl,{t:"Fluoxetina en BN"},e("b",null,"60 mg/día")," — dosis MAYOR que en depresión (20 mg). Única aprobación FDA para BN."),
       e(Pearl,{t:"Lisdexanfetamina en TpA"},"Único fármaco con aprobación FDA para trastorno por atracón en adultos. Dosis 50–70 mg/día."),
       e(Pearl,{t:"Bupropión contraindicado"},"NUNCA en AN ni BN — reduce el umbral convulsivo y el paciente con purgas tiene alteraciones electrolíticas que aumentan el riesgo de convulsiones."),
       e(Pearl,{t:"ARFID ≠ AN"},"ARFID también tiene restricción y bajo peso, pero ",e("b",null,"SIN preocupación por imagen corporal ni miedo a engordar"),". Muy frecuente en niños con espectro autista."),
       e(Pearl,{t:"Pagofagia"},"Comer hielo compulsivamente → pensar en ",e("b",null,"anemia ferropénica"),". Medir ferritina."),
       e(Pearl,{t:"Maudsley"},"Terapia familiar basada en Maudsley = 1ª línea para anorexia en ",e("b",null,"adolescentes"),". Los padres son los 'agentes del cambio' al inicio."),
       e(Pearl,{t:"Atracón — definición"},"Dos requisitos: (1) cantidad mucho mayor que otros en el mismo tiempo, (2) ",e("b",null,"pérdida de control"),". Sin el segundo no es atracón, aunque la cantidad sea grande."),
       e(Pearl,{t:"Atracón subjetivo vs objetivo"},"El ",e("b",null,"atracón OBJETIVO")," (el que cuenta para DSM-5) requiere cantidad claramente mayor que la mayoría + pérdida de control. El ",e("b",null,"atracón SUBJETIVO")," es la ",e("b",null,"sensación")," de haberse excedido aunque la cantidad sea normal o incluso pequeña. El subjetivo es clínicamente relevante (genera culpa, purgas) pero ",e("b",null,"NO cuenta como criterio DSM")," para BN ni TpA.")
     )},
    {id:"resumen",ic:"📊",t:"Resumen comparativo",sub:"Las 6 entidades en una tabla",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Entidad",c:c},{t:"Duración/umbral",c:c},{t:"Tx farmacológico",c:c}],
         rows:[
           ["Anorexia nerviosa","Cualquiera · peso bajo significativo","Olanzapina (adyuvante) · ISRS solo si comorbilidades"],
           ["Bulimia nerviosa","≥1/semana x 3 meses","Fluoxetina 60 mg/día (FDA)"],
           ["Trastorno por atracón","≥1/semana x 3 meses","Lisdexanfetamina 50–70 mg (FDA)"],
           ["ARFID","Cualquiera · deterioro nutricional","Sintomático · ISRS si ansiedad"],
           ["Pica","≥1 mes","Corregir deficiencias (Fe, Zn)"],
           ["Rumiación","≥1 mes","Terapia conductual · biofeedback"]
         ]
       })
     )},
    {id:"flash",ic:"🃏",t:"Flashcards",sub:"14 preguntas + las tuyas",c:c,
     content:e("div",null,
       e(P,null,"Tarjetas de repaso de TCA. Añade las tuyas."),
       e(FlashDeck,{c:c,deckId:"tca",items:getAllCards("tca")})
     )},
    {id:"quiz",ic:"❓",t:"Quiz · 6 casos clínicos",sub:"Prueba tus conocimientos",c:c,
     content:e(Quiz,{c:c,items:getAllQuiz("tca")})}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Tema 5 · Neurosis · DSM-5",title:"Trastornos de la conducta alimentaria"},
      "Cuadros con alteraciones persistentes en la conducta de alimentación. Incluyen desde la anorexia nerviosa — el trastorno psiquiátrico con ",e("b",null,"mortalidad más alta")," — hasta entidades de presentación más sutil como ARFID y pica. Son ",e("b",null,"6 entidades DSM-5"),"."
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.3),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Conceptos · Tratamiento · Realimentación · Flashcards · Quiz")
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

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.15)+","+ax(c,.04)+" 90%)",border:"1px solid "+ax(c,.35),borderRadius:14,margin:"18px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Las 6 enfermedades"),
      e("div",{style:{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Toca cualquier enfermedad para abrir su ficha"),
      e("div",{style:{fontSize:12,color:C.mt,marginTop:4,lineHeight:1.45}},"Cada ficha tiene tabs: Definición · Clínica · Diagnóstico · Tratamiento")
    ),
    e(DzGrid,{c:c,items:diseases,onOpen:p&&p.onOpen}),

    e(Abbrev,{c:c,items:[
      {a:"AN",d:"Anorexia Nerviosa"},
      {a:"BN",d:"Bulimia Nerviosa"},
      {a:"TpA",d:"Trastorno por Atracón"},
      {a:"ARFID",d:"Avoidant/Restrictive Food Intake Disorder"},
      {a:"IMC",d:"Índice de Masa Corporal"},
      {a:"TCC-E",d:"Terapia Cognitivo-Conductual mejorada (enhanced)"},
      {a:"TFB-M",d:"Terapia Familiar Basada en Maudsley"},
      {a:"ERGE",d:"Enfermedad por Reflujo Gastroesofágico"},
      {a:"FDA",d:"Food and Drug Administration (EE.UU.)"},
      {a:"QT",d:"Intervalo QT del ECG"}
    ]})
  );
}



