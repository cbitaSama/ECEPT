// ══════════════════════════════════════════════════════════════
// TEMA 0 · PSIQUIATRÍA (introducción común)
// ══════════════════════════════════════════════════════════════



// ══════════════════════════════════════════════════════════════
// RETROALIMENTACIÓN · flashcards y quiz adicionales por deck
// Mezcla conceptos + casos clínicos · confusiones típicas de examen
// ══════════════════════════════════════════════════════════════

var EXTRA_CARDS={
  // ═════ PSICOSIS ═════
  psicosis:[
    {q:"¿Cuál es la duración EXACTA para diferenciar trastorno psicótico breve, esquizofreniforme y esquizofrenia?",r:"Psicótico breve: ≥1 día pero <1 mes · Esquizofreniforme: ≥1 mes pero <6 meses · Esquizofrenia: ≥6 meses. La única diferencia es el tiempo."},
    {q:"¿Qué regla define esquizoafectivo vs esquizofrenia con síntomas afectivos?",r:"En esquizoafectivo debe haber ≥2 semanas de delirios o alucinaciones SIN síntomas afectivos mayores durante el curso de la enfermedad. Si siempre coexisten, es un trastorno del ánimo con síntomas psicóticos, no esquizoafectivo."},
    {q:"¿Cuáles son las 4 vías dopaminérgicas y qué pasa si cada una falla?",r:"Mesolímbica: hiperactiva → síntomas positivos. Mesocortical: hipoactiva → síntomas negativos/cognitivos. Nigroestriada: bloqueada → extrapiramidalismo. Tuberoinfundibular: bloqueada → hiperprolactinemia."},
    {q:"Paciente con esquizofrenia presenta rigidez muscular severa, hiperpirexia, diaforesis y CPK elevada tras iniciar haloperidol. ¿Dx y manejo?",r:"Síndrome neuroléptico maligno (SNM). Urgencia. Suspender el antipsicótico, enfriamiento, hidratación, dantroleno o bromocriptina. Mortalidad hasta 10% si no se trata."},
    {q:"¿Cuál es la única indicación DEFINITIVA de clozapina?",r:"Esquizofrenia resistente (falla a ≥2 antipsicóticos) y riesgo suicida alto. Requiere monitoreo hematológico por riesgo de agranulocitosis."},
    {q:"¿Qué diferencia el delirio 'bizarro' del no bizarro y por qué importa?",r:"Delirio bizarro: contenido imposible físicamente (ej: 'me implantaron un chip que lee mis pensamientos'). No bizarro: posible aunque falso (ej: 'mi esposa me es infiel'). Delirante no bizarro → favorece trastorno delirante; bizarro → favorece esquizofrenia."},
    {q:"Mujer de 45 años convencida de que su vecino está enamorado de ella, sin evidencia, hace 4 meses. Funciona bien en el trabajo, sin alucinaciones. ¿Dx?",r:"Trastorno delirante tipo erotomaníaco. Criterios: delirios ≥1 mes, personalidad preservada, funciona bien. No cumple esquizofrenia (no hay deterioro ni síntomas negativos)."},
    {q:"¿En qué paciente con bipolar hay que tener MÁS cuidado con antidepresivos?",r:"Bipolar I sin cobertura estabilizadora → riesgo de viraje maníaco. En bipolar II también, pero el riesgo es menor. NUNCA antidepresivo solo en bipolaridad — siempre con estabilizador del ánimo."},
    {q:"¿Cuánto tiempo tarda el litio en mostrar efecto en manía aguda y qué nivel terapéutico se busca?",r:"Inicio de efecto: 6-8 semanas para respuesta sostenida. Nivel terapéutico: 0.6-1.2 mEq/L. Por encima de 1.5 hay riesgo de toxicidad. Monitoreo por función renal y tiroidea."},
    {q:"¿Cuál es la diferencia entre manía e hipomanía en duración y severidad?",r:"Manía: ≥1 semana + deterioro marcado o psicosis o hospitalización. Hipomanía: ≥4 días + cambio observable pero SIN deterioro marcado ni psicosis. Si hay psicosis, POR DEFINICIÓN es manía."}
  ],

  // ═════ ANSIEDAD ═════
  anxiety:[
    {q:"¿Cuál es la duración mínima para diagnosticar TAG?",r:"≥6 meses de preocupación excesiva sobre múltiples áreas, difícil de controlar, con ≥3 síntomas físicos (en niños basta 1)."},
    {q:"Varón de 28 años con episodios recurrentes de palpitaciones, disnea, miedo a morir, que duran 10 min. ¿Dx y manejo agudo vs mantenimiento?",r:"Trastorno de pánico. Agudo: BZD de vida corta (alprazolam) y técnicas de respiración. Mantenimiento: ISRS (sertralina, paroxetina) + TCC — NUNCA BZD como mantenimiento."},
    {q:"¿Qué diferencia la agorafobia del trastorno de pánico?",r:"Pánico: ataques recurrentes inesperados. Agorafobia: miedo a ≥2 situaciones (transporte, espacios abiertos/cerrados, multitud, fuera de casa solo) por temor a no poder escapar o recibir ayuda. Pueden coexistir."},
    {q:"¿Por qué no se usan BZD como tratamiento de mantenimiento en ansiedad?",r:"Riesgo de dependencia, tolerancia, deterioro cognitivo, síndrome de abstinencia. Solo para crisis agudas o como puente (≤4 semanas) mientras el ISRS hace efecto."},
    {q:"Niño de 6 años que se niega a ir a la escuela por miedo de que le pase algo a su mamá. Ansiedad marcada al separarse. ¿Dx?",r:"Trastorno de ansiedad por separación. ≥4 semanas en niños, ≥6 meses en adultos. Dx diferencial con fobia escolar (miedo a la escuela en sí) y mutismo selectivo."},
    {q:"¿Cuál es la dosis efectiva de sertralina en ansiedad vs depresión?",r:"Ambas: 50-200 mg/día. En ansiedad se empieza con dosis más bajas (25 mg) por sensibilidad inicial a efectos de activación. Subir gradualmente."}
  ],

  // ═════ TOC ═════
  toc:[
    {q:"¿Por qué se necesitan dosis más ALTAS de ISRS en TOC que en depresión?",r:"TOC requiere dosis máximas o cercanas al máximo (ej. fluoxetina 60-80 mg, sertralina 200 mg, fluvoxamina 300 mg) y al menos 10-12 semanas para ver respuesta completa. Depresión: dosis menores y respuesta en 4-6 semanas."},
    {q:"¿Qué es PANDAS y cuándo se sospecha?",r:"Pediatric Autoimmune Neuropsychiatric Disorders Associated with Streptococcal infections. Aparición súbita o exacerbación abrupta de TOC/tics en niño tras infección por estreptococo. Serología positiva confirma."},
    {q:"¿Qué es la 'exposición con prevención de respuesta' (EPR) y para qué trastorno es 1ª línea?",r:"EPR: exposición gradual al estímulo ansiógeno sin permitir la compulsión. Es la 1ª línea psicoterapéutica para TOC. También útil en TDC (trastorno dismórfico corporal)."},
    {q:"Mujer 35 años se arranca el pelo de la cabeza y cejas hace 2 años, experimenta alivio. ¿Dx y tx?",r:"Tricotilomanía. Tx: habit reversal training (1ª línea) + N-acetilcisteína + ISRS si comorbilidad. Derivado del capítulo TOC y trastornos relacionados."},
    {q:"¿Cuál es la diferencia entre TOC y TOCP (personalidad)?",r:"TOC: obsesiones y compulsiones EGO-DISTÓNICAS (el paciente sabe que son absurdas). TOCP: rasgo de personalidad EGO-SINTÓNICO (cree que su perfeccionismo es correcto). Dos entidades distintas en capítulos diferentes."}
  ],

  // ═════ TRAUMA ═════
  trauma:[
    {q:"¿Cuál es el criterio A del TEPT y por qué es tan específico?",r:"Exposición a muerte real o amenaza, lesión grave o violencia sexual, ya sea directa, presenciada, conocida por familiar cercano, o exposición profesional repetida (policía, rescatistas). Otros estresores vitales NO cumplen criterio A — van a trastorno adaptativo."},
    {q:"¿Qué diferencia TEA del TEPT en duración?",r:"TEA (Trastorno de Estrés Agudo): 3 días - 1 mes tras trauma. TEPT: ≥1 mes. Si persiste más de 1 mes, pasa a TEPT. Ambos requieren criterio A de exposición a trauma severo."},
    {q:"¿En qué paciente con TEPT tiene especial utilidad la prazosina?",r:"En TEPT con pesadillas y alteración del sueño. Antagonista α1-adrenérgico. Dosis 1-15 mg nocturnos. También útil en HTA y HBP (mismo mecanismo)."},
    {q:"Mujer 70 años con pérdida de su hija hace 18 meses, persiste con anhelo intenso y pensamientos intrusivos diarios sobre ella, con deterioro funcional. ¿Dx?",r:"Trastorno de duelo prolongado (DSM-5-TR añadido en 2022). Criterios: ≥12 meses adultos (6 meses niños) con anhelo intenso y ≥3 síntomas adicionales (shock, ira, evitación, etc.) + deterioro."},
    {q:"¿Qué psicoterapias tienen mejor evidencia en TEPT?",r:"TCC centrada en trauma, EMDR (desensibilización y reprocesamiento por movimientos oculares), terapia de exposición prolongada. Todas superiores a medicación sola."}
  ],

  // ═════ SOMÁTICOS ═════
  somaticos:[
    {q:"Diferencia clave: ¿cómo distinguir TSS de IAD?",r:"TSS: hay síntomas físicos REALES (dolor, fatiga, etc.) + preocupación/pensamientos/tiempo excesivos sobre ellos. IAD: preocupación por ENFERMEDAD con síntomas físicos AUSENTES o leves. En ambos: ≥6 meses."},
    {q:"En conversión, ¿qué signos indican que es funcional y no orgánico?",r:"Incompatibilidad con neuroanatomía: signo de Hoover (debilidad de pierna cede con maniobra contralateral), anestesia en guante/media (no sigue dermatomas), fuerza variable durante exploración. Pruebas complementarias normales."},
    {q:"¿Qué diferencia facticio de simulación?",r:"Facticio: motivación INTERNA (ser el enfermo). Simulación: motivación EXTERNA clara (beneficio económico, evadir cárcel/trabajo). Simulación no es trastorno mental, es código V."},
    {q:"¿Qué alteraciones neurológicas mimica la conversión más frecuentemente?",r:"Parálisis no anatómicas, crisis no epilépticas psicógenas (PNES), ceguera funcional, afonía, alteraciones sensitivas. Signos positivos (Hoover, distractibilidad de crisis) confirman."},
    {q:"¿Cuál es la diferencia clave entre amnesia disociativa y olvido normal o demencia?",r:"Disociativa: pérdida súbita de información autobiográfica importante, generalmente de un periodo específico traumático, con función cognitiva intacta. Demencia: pérdida gradual de múltiples dominios cognitivos."}
  ],

  // ═════ TCA ═════
  tca:[
    {q:"¿Cuáles son los dos subtipos de anorexia nerviosa?",r:"Restrictivo (pérdida de peso por dieta y ejercicio, sin atracones ni purgas en 3 meses) y con atracones/purgas (episodios recurrentes de atracón o conductas purgativas en 3 meses)."},
    {q:"¿Cuál es el riesgo médico AGUDO más importante en bulimia con purgas?",r:"Hipocalemia por pérdida de K⁺ en vómito → arritmias ventriculares. También alcalosis metabólica hipoclorémica (pérdida de HCl) y deshidratación."},
    {q:"Adolescente 15 años, IMC 14, amenorrea, bradicardia, restricción alimentaria severa con miedo intenso a engordar. ¿Tx 1ª línea?",r:"Terapia Familiar Basada en Maudsley (TFB-M) — 1ª línea en adolescentes con AN. Padres asumen responsabilidad de realimentación. No fármacos como 1ª línea (ISRS no eficaces en cuadro central)."},
    {q:"¿Cuál es el ÚNICO medicamento con aprobación FDA para bulimia y a qué dosis?",r:"Fluoxetina 60 mg/día (dosis mayor que en depresión). Reduce atracones y conductas compensatorias. Siempre junto con TCC."},
    {q:"Paciente con anorexia severa inicia realimentación agresiva → hipofosfatemia, edema, arritmias. ¿Qué es y cómo prevenir?",r:"Síndrome de realimentación. Prevención: iniciar con pocas calorías (5-10 kcal/kg/día), suplementar fosfato/potasio/magnesio/tiamina previo, monitoreo electrolitos diario x 7 días. Mortal si no se trata."}
  ],

  // ═════ SUEÑO ═════
  sueno:[
    {q:"¿Qué caracteriza los eventos del sueño REM vs NREM desde el punto de vista clínico?",r:"NREM (1ª mitad noche): terrores nocturnos, sonambulismo, sin recuerdo del evento. REM (2ª mitad noche): pesadillas con recuerdo vívido, TCSR (paciente actúa sus sueños)."},
    {q:"Varón 65 años patea y grita durante el sueño, su esposa lo denuncia. Recuerda pesadillas violentas. ¿Dx y riesgo a largo plazo?",r:"Trastorno de conducta del sueño REM (TCSR). Alto riesgo de enfermedad neurodegenerativa: 80% desarrollará Parkinson o DCL en 10-15 años. Tx: clonazepam o melatonina + seguimiento neurológico."},
    {q:"¿Cuál es el tratamiento 1ª línea del síndrome de piernas inquietas y por qué los agonistas dopaminérgicos ya no son la elección principal?",r:"1ª línea: corregir ferritina (<75 → hierro oral/IV) + gabapentinoides (gabapentina, pregabalina). Agonistas dopaminérgicos (pramipexol, ropinirol) causan 'aumentación' (empeoramiento paradójico), por eso están relegados."},
    {q:"¿Cuáles son los componentes de la tétrada clásica de narcolepsia?",r:"1) Somnolencia diurna excesiva, 2) cataplejía (pérdida súbita del tono con emoción), 3) alucinaciones hipnagógicas/hipnopómpicas, 4) parálisis del sueño. Deficiencia de orexina/hipocretina."},
    {q:"¿Por qué los BZD NO son de elección en insomnio crónico?",r:"Tolerancia, dependencia, deterioro cognitivo, caídas en adultos mayores, insomnio de rebote al suspender. 1ª línea: TCC para insomnio (TCC-I). Si fármaco, preferir antagonistas de orexina (suvorexant) o agonistas melatonina (ramelteón)."}
  ],

  // ═════ PERSONALIDAD ═════
  personalidad:[
    {q:"¿Cuál es el tratamiento 1ª línea para TLP y por qué se diseñó específicamente para este trastorno?",r:"Terapia Dialéctico-Conductual (DBT) de Marsha Linehan. Combina mindfulness + tolerancia al malestar + regulación emocional + efectividad interpersonal. Diseñada específicamente para TLP por la inestabilidad emocional intensa."},
    {q:"Paciente 28 años con patrón de relaciones intensas e inestables (idealización/devaluación), autolesiones, sensación crónica de vacío, miedo al abandono. ¿Dx?",r:"Trastorno límite de personalidad (TLP). Requiere ≥5 de 9 criterios, inicio en adultez temprana, patrón persistente y pervasivo. Alta comorbilidad con TEPT, TCA, sustancias."},
    {q:"¿Cómo diferenciar personalidad esquizoide de esquizotípica?",r:"Esquizoide: desapego social, frialdad emocional, prefiere estar solo, sin distorsiones cognitivas. Esquizotípica: además, EXCENTRICIDAD + ideas de referencia + pensamiento mágico + ansiedad social. Esquizotípica está en el espectro esquizofrénico."},
    {q:"¿Qué rasgos distinguen la personalidad antisocial de un criminal común?",r:"Antisocial requiere: ≥18 años, evidencia de trastorno de conducta antes de 15 años, patrón pervasivo de violación de derechos, SIN remordimiento, impulsividad, engaño. Un criminal que planea por beneficio económico no necesariamente tiene antisocial."},
    {q:"¿En qué cluster están los trastornos 'ansiosos o temerosos' y cuáles son?",r:"Cluster C: Evitativa (desea vínculo pero miedo rechazo), Dependiente (necesita que la cuiden), Obsesivo-compulsiva de personalidad (TOCP, perfeccionismo rígido)."}
  ],

  // ═════ IMPULSOS ═════
  impulsos:[
    {q:"¿Qué antecedente es OBLIGATORIO para diagnosticar trastorno antisocial de personalidad?",r:"Evidencia de trastorno de la conducta antes de los 15 años. Sin ese antecedente, aunque el paciente tenga conducta antisocial adulta, NO se diagnostica como personalidad antisocial."},
    {q:"¿Cuáles son las 4 categorías de síntomas del trastorno de la conducta?",r:"1) Agresión a personas/animales, 2) destrucción de propiedad, 3) engaño o robo, 4) violaciones graves de normas. Se requieren ≥3 síntomas en 12 meses, con ≥1 en los últimos 6."},
    {q:"Niño 7 años con rabietas explosivas, irritabilidad crónica, desafío a autoridad. ¿Cómo diferenciar negativista desafiante de TDDD?",r:"Negativista: desafío e ira. TDDD (Trastorno de Desregulación Disruptiva del Ánimo): rabietas severas ≥3/sem + irritabilidad crónica entre rabietas. TDDD se creó para NO sobrediagnosticar bipolar pediátrico."},
    {q:"¿Qué diferencia piromanía de un pirómano por otros motivos?",r:"Piromanía: incendios deliberados + fascinación por el fuego + alivio/placer al prenderlo, SIN motivación instrumental (dinero, venganza, ocultar otro delito). Si hay motivación externa, NO es piromanía."},
    {q:"Mujer 30 años con episodios de robo de objetos que NO necesita, alivio tras el acto, sin ganancia económica. ¿Dx y tx?",r:"Cleptomanía. Tx: ISRS + naltrexona + TCC. Impulso recurrente de robar objetos sin utilidad ni valor monetario, con sensación de tensión que se alivia al robar."}
  ],

  // ═════ DEPRESIVOS ═════
  depresivos:[
    {q:"¿Qué es la nemotecnia SIGECAPS y qué debe incluir obligatoriamente un episodio depresivo mayor?",r:"SIGECAPS: Sueño, Interés (anhedonia), Guilt (culpa), Energía, Concentración, Apetito, Psicomotor, Suicidio. ≥5 de 9 síntomas × ≥2 semanas, con al menos UNO siendo ánimo deprimido O anhedonia."},
    {q:"¿Cuánto tiempo debe mantenerse un antidepresivo tras el primer episodio depresivo mayor?",r:"6-9 meses tras la remisión completa para prevenir recaída. Si es ≥2 episodios o episodio severo/psicótico, considerar mantenimiento ≥2 años o indefinido."},
    {q:"Mujer 32 años con síntomas premenstruales severos de ira, ansiedad y depresión los 7 días antes de menstruar, que desaparecen tras el sangrado. ¿Dx y criterio clave?",r:"Trastorno Disfórico Premenstrual (TDPM). Criterio clave: confirmación prospectiva en ≥2 ciclos sintomáticos (no basta retrospectivo). Tx: ISRS (continuo o solo fase luteal), ACO combinado."},
    {q:"¿Cuándo está indicada la TEC (terapia electroconvulsiva) en depresión?",r:"Depresión psicótica, catatonia, refractaria a múltiples fármacos, riesgo suicida agudo, embarazo con depresión severa, rechazo alimentario. NO es 'último recurso' — en estas condiciones es 1ª línea por respuesta rápida."},
    {q:"¿Qué fármaco tiene efecto rápido (horas-días) en depresión refractaria y suicidalidad aguda?",r:"Ketamina IV o esketamina intranasal. Actúa sobre receptores NMDA. Efecto en horas, útil como puente mientras otros tratamientos hacen efecto. Alternativa a TEC cuando se requiere respuesta rápida."}
  ]
};

var EXTRA_QUIZ={
  psicosis:[
    {p:"Paciente 24 años con 3 semanas de delirios y alucinaciones tras consumo de metanfetamina. Sin antecedentes psiquiátricos. ¿Dx más probable?",
     o:["Esquizofrenia","Trastorno psicótico inducido por sustancias","Trastorno psicótico breve","Esquizofreniforme"],r:1,
     x:"Cronología clara con sustancia + duración breve + antecedente reciente = trastorno psicótico inducido por sustancias. No es esquizofrenia (requiere ≥6 meses) ni breve (requiere que NO sea por sustancia)."},
    {p:"Varón 35 años con ≥3 meses de delirio celotípico (cree que su esposa le es infiel sin evidencia). Conserva su empleo y trato social normal. ¿Dx?",
     o:["Esquizofrenia paranoide","Trastorno delirante tipo celotípico","TLP","Bipolar I con psicosis"],r:1,
     x:"Delirio ≥1 mes + personalidad preservada + funcionamiento conservado (excepto por el impacto directo del delirio) = trastorno delirante. El tipo celotípico es uno de los 5 subtipos."},
    {p:"Mujer 28 años con 4 meses de síntomas: episodios maníacos y depresivos, PERO durante 3 semanas del periodo total tuvo SOLO delirios sin síntomas afectivos. ¿Dx?",
     o:["Trastorno bipolar con psicosis","Esquizoafectivo","Esquizofrenia","Trastorno delirante"],r:1,
     x:"Criterio clave del esquizoafectivo: ≥2 semanas de psicosis SIN síntomas afectivos mayores durante el curso total. Si siempre coexisten psicosis + ánimo, es bipolar con síntomas psicóticos."}
  ],
  anxiety:[
    {p:"Varón 32 años con 8 meses de preocupación excesiva por múltiples áreas (trabajo, salud, familia), insomnio de conciliación, tensión muscular, fatiga. No cumple criterios de pánico. ¿Dx y 1ª línea?",
     o:["Trastorno de pánico · alprazolam","TAG · ISRS + TCC","Distimia · fluoxetina","Adaptación · psicoterapia"],r:1,
     x:"Preocupación excesiva ≥6 meses sobre múltiples áreas + ≥3 síntomas físicos = TAG. 1ª línea: ISRS (escitalopram, sertralina) o IRSN (venlafaxina) + TCC. BZD solo puente."},
    {p:"Niño 7 años que habla normalmente en casa pero NO habla en la escuela hace 6 meses, sin déficit de lenguaje. ¿Dx?",
     o:["Autismo","Mutismo selectivo","Fobia social","Ansiedad por separación"],r:1,
     x:"Mutismo selectivo: fallo persistente en hablar en situaciones específicas (escuela) pese a capacidad normal. ≥1 mes (excluye primer mes escolar). Alta comorbilidad con ansiedad."}
  ],
  toc:[
    {p:"Adolescente 14 años con aparición súbita de obsesiones de contaminación y compulsiones de lavado, 2 semanas tras faringitis estreptocócica. ¿Dx y manejo?",
     o:["TOC primario · ISRS dosis alta","PANDAS · ATB + ISRS","Hipocondría · TCC","Trastorno de adaptación"],r:1,
     x:"PANDAS: inicio súbito de TOC/tics tras infección estreptocócica en niño. Tx: ATB para erradicar estreptococo + ISRS si síntomas persisten. Serología confirma."},
    {p:"Mujer 40 años con acumulación compulsiva de objetos, hogar con espacios inhabitables. Dificultad para desechar por ansiedad. ¿Dx y 1ª línea?",
     o:["TOC por obsesiones de simetría","Trastorno de acumulación (Hoarding) · TCC","Demencia frontotemporal","Trastorno de personalidad esquizotípica"],r:1,
     x:"Trastorno de acumulación es dx propio en DSM-5 (antes subtipo de TOC). Tx: TCC específica (organización + desecho gradual + toma de decisiones). ISRS evidencia limitada."}
  ],
  trauma:[
    {p:"Mujer 30 años, asaltada hace 3 semanas. Flashbacks, evitación, insomnio, hipervigilancia. Cumple criterios diagnósticos. ¿Dx?",
     o:["TEPT · iniciar ISRS","Trastorno de estrés agudo (TEA)","Adaptativo con ansiedad","Fobia específica"],r:1,
     x:"3 semanas tras trauma (entre 3 días y 1 mes) = TEA. Si persiste más de 1 mes, pasa a TEPT. Tx: TCC centrada en trauma, puede prevenir progresión a TEPT."},
    {p:"Paciente con TEPT + pesadillas recurrentes. Ya toma ISRS y TCC. ¿Qué agregar específicamente para pesadillas?",
     o:["BZD nocturna","Prazosina","Quetiapina","Melatonina"],r:1,
     x:"Prazosina (α1-bloqueador) tiene mejor evidencia para pesadillas en TEPT. Dosis 1-15 mg nocturnos. BZD empeoran memoria del trauma; quetiapina no primera línea."}
  ],
  somaticos:[
    {p:"Varón 35 años con múltiples síntomas (dolor abdominal, cefalea, mareo) desde hace 2 años, sin causa orgánica, genera gran preocupación y búsqueda constante de atención médica. ¿Dx?",
     o:["IAD (ansiedad por enfermedad)","Trastorno de síntomas somáticos (TSS)","Facticio","Conversión"],r:1,
     x:"TSS: síntomas físicos REALES + preocupación/tiempo excesivos sobre ellos ≥6 meses. IAD sería si la preocupación fuera por tener 'una enfermedad' con síntomas físicos mínimos o ausentes."},
    {p:"Paciente con ceguera bilateral súbita tras conflicto interpersonal. Examen neurológico normal, potenciales evocados visuales normales. ¿Dx y manejo?",
     o:["Conversión · fisioterapia + TCC","Simulación · confrontar","Ceguera orgánica no identificada","Psicosis histérica"],r:1,
     x:"Conversión: síntoma neurológico incompatible con anatomía + pruebas normales. NO es simulación (no hay ganancia clara externa). Manejo: validación + fisioterapia + TCC."}
  ],
  tca:[
    {p:"Adolescente 16 años, IMC 14, amenorrea, bradicardia 45 lpm, hipotensión. Miedo intenso a engordar y distorsión corporal. ¿Dónde se atiende inicialmente?",
     o:["Ambulatorio con TCC","Hospitalización médica primero","Solo psicoterapia","Iniciar fluoxetina 60 mg"],r:1,
     x:"Criterios de hospitalización médica en AN: IMC <15, FC <50, hipotensión severa, alteración electrolítica, síncope. Primero estabilizar médicamente, luego tratamiento psicoterapéutico (Maudsley en adolescentes)."},
    {p:"Mujer 22 años, IMC 22, atracones 3 veces/semana con vómitos autoinducidos hace 8 meses. Signo de Russell positivo, erosión dental. ¿Dx y 1ª línea?",
     o:["AN subtipo purgativo","Bulimia nerviosa · fluoxetina 60 mg + TCC","Trastorno por atracón","ARFID"],r:1,
     x:"Peso normal + atracones + conductas compensatorias (vómito) + signos físicos de purga = bulimia. Fluoxetina 60 mg es el único ISRS aprobado por FDA. Bupropión CONTRAINDICADO (riesgo convulsivo)."}
  ],
  sueno:[
    {p:"Varón 45 años con somnolencia diurna excesiva, roncador, esposa reporta pausas respiratorias. IMC 35. Polisomnografía: IAH 28. ¿Dx y 1ª línea?",
     o:["Insomnio · zolpidem","Apnea obstructiva del sueño · CPAP","Narcolepsia · modafinilo","Hipersomnia idiopática"],r:1,
     x:"AOS moderada (IAH 15-30). 1ª línea: CPAP nocturno + pérdida de peso. Evitar alcohol y sedantes. Cirugía o dispositivos intraorales solo si falla CPAP."},
    {p:"Mujer 60 años, al dormirse siente disestesias en piernas que la obligan a moverlas, mejora con movimiento, peor de noche. Ferritina 28 ng/mL. ¿Dx y primer paso?",
     o:["Neuropatía periférica · gabapentina","SPI · suplementar hierro","Ansiedad nocturna","TCSR"],r:1,
     x:"SPI clásico + ferritina baja. Primer paso: corregir ferritina con hierro oral o IV (objetivo >75). Si persiste: gabapentinoides. Evitar agonistas dopaminérgicos por fenómeno de aumentación."}
  ],
  personalidad:[
    {p:"Mujer 25 años con múltiples relaciones intensas e inestables, autolesiones recurrentes, miedo intenso al abandono, sensación crónica de vacío. ¿Tx 1ª línea?",
     o:["ISRS como monoterapia","TCC estándar","Terapia Dialéctico-Conductual (DBT)","Litio"],r:2,
     x:"TLP: DBT de Marsha Linehan es 1ª línea. Fármacos solo sintomáticos: lamotrigina para labilidad afectiva, antipsicóticos bajos para ideación paranoide. BZD CONTRAINDICADAS (desinhibición + adicción)."},
    {p:"Varón 45 años, ingeniero, perfeccionista, rígido, devoto al trabajo, no delega, guarda todo. Cree que su forma de ser es correcta. ¿Dx?",
     o:["TOC","TOCP (personalidad)","Narcisista","Paranoide"],r:1,
     x:"TOCP: rasgo EGO-SINTÓNICO de perfeccionismo y rigidez. Sin obsesiones/compulsiones propias del TOC. El paciente NO ve problema en su forma de ser. Tx: psicoterapia (TCC); fármacos solo si comorbilidad."}
  ],
  impulsos:[
    {p:"Varón 25 años con múltiples arrestos, sin trabajo fijo, miente habitualmente, sin remordimiento. Antecedente de vandalismo, peleas y robos desde los 12 años. ¿Dx?",
     o:["TLP","Trastorno antisocial de personalidad","Trastorno explosivo intermitente","Trastorno de la conducta (aún)"],r:1,
     x:"≥18 años + trastorno de la conducta antes de los 15 años + patrón persistente = antisocial. Sin el antecedente de conducta, aunque tenga conducta adulta, NO se diagnostica antisocial."},
    {p:"Niño 8 años con rabietas explosivas severas 4 veces/semana, irritable entre rabietas, en casa y escuela, 14 meses de evolución. Sin episodios maníacos discretos. ¿Dx?",
     o:["Bipolar pediátrico","TDDD (Desregulación Disruptiva del Ánimo)","Negativista desafiante","TDAH"],r:1,
     x:"TDDD: irritabilidad crónica + rabietas severas ≥3/sem × ≥12m + edad 6-18 (inicio antes de 10). Se creó para evitar sobrediagnosticar bipolar pediátrico en niños con irritabilidad crónica."}
  ],
  depresivos:[
    {p:"Mujer 35 años con 3 semanas de ánimo deprimido, anhedonia, insomnio, fatiga, culpa excesiva, pensamientos de muerte. Deterioro funcional. ¿Dx y 1ª línea?",
     o:["Distimia · sertralina","TDM · ISRS + TCC","Adaptativo · psicoterapia","Bipolar II"],r:1,
     x:"≥5 síntomas (ánimo bajo + anhedonia + 4 más) × ≥2 semanas + deterioro = TDM. 1ª línea: ISRS + TCC. Respuesta en 4-6 semanas. Mantener 6-9 meses tras remisión."},
    {p:"Paciente con TDM refractario a 3 ensayos de antidepresivos diferentes. Riesgo suicida agudo. ¿Opción con efecto MÁS RÁPIDO?",
     o:["Agregar litio","Ketamina IV o esketamina intranasal","Cambiar a otro ISRS","EMT ambulatoria"],r:1,
     x:"Ketamina/esketamina tienen efecto en horas-días. Ideal en depresión refractaria con riesgo suicida agudo. TEC también rápida pero requiere anestesia. EMT tarda semanas."}
  ]
};

// Función que combina cards oficiales + extras
function getAllCards(deckKey){
  var base=(DECKS[deckKey]&&DECKS[deckKey].flash)?DECKS[deckKey].flash:[];
  var extra=EXTRA_CARDS[deckKey]||[];
  return base.concat(extra);
}
function getAllQuiz(deckKey){
  var base=(DECKS[deckKey]&&DECKS[deckKey].quiz)?DECKS[deckKey].quiz:[];
  var extra=EXTRA_QUIZ[deckKey]||[];
  return base.concat(extra);
}

