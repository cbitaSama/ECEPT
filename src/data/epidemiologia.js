// ══════════════════════════════════════════════════════════════
// DATOS GENERALIDADES — LECTURA CRÍTICA (resumen clave)
// ══════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════
// DATOS EPIDEMIOLOGÍA — PIRÁMIDE DE EVIDENCIA
// ══════════════════════════════════════════════════════════════
var PIRAMIDE=[
{nivel:1,nombre:"Meta-análisis / Revisión Sistemática",color:"#22d3ee",ancho:"30%",desc:"Síntesis estadística de MÚLTIPLES ECAs. Máxima evidencia.",para:"Confirmar eficacia de tratamientos con alta potencia estadística",medida:"Tamaño del efecto combinado (pooled), IC 95%, heterogeneidad (I²)",ejemplo:"Cochrane: ¿Los corticoides reducen mortalidad en sepsis?",icono:"👑"},
{nivel:2,nombre:"Ensayo Clínico Aleatorizado (ECA)",color:"#3b82f6",ancho:"42%",desc:"Gold Standard experimental. Aleatorización + cegamiento.",para:"Demostrar CAUSALIDAD entre intervención y resultado",medida:"RR, RRA, NNT, p-value, IC 95%",ejemplo:"RECOVERY: dexametasona en COVID → ↓mortalidad 35%",icono:"🏆"},
{nivel:3,nombre:"Estudio de Cohorte",color:"#8b5cf6",ancho:"54%",desc:"Sigue expuestos vs no-expuestos en el TIEMPO. Prospectivo o retrospectivo.",para:"Evaluar factores de riesgo/protección, incidencia, pronóstico",medida:"RR (Riesgo Relativo), HR (Hazard Ratio), Incidencia",ejemplo:"Framingham: tabaco → riesgo CV. Seguimiento por décadas.",icono:"📈"},
{nivel:4,nombre:"Casos y Controles",color:"#a78bfa",ancho:"66%",desc:"Compara enfermos (casos) vs sanos (controles). RETROSPECTIVO siempre.",para:"Enfermedades RARAS o con largo período de latencia",medida:"OR (Odds Ratio) — aproxima al RR si enfermedad rara (<10%)",ejemplo:"Talidomida → focomelia. Se parte del enfermo y se busca atrás.",icono:"🔍"},
{nivel:5,nombre:"Estudio Transversal (Cross-sectional)",color:"#f472b6",ancho:"78%",desc:"Fotografía de un momento. Mide exposición y enfermedad SIMULTÁNEAMENTE.",para:"Determinar PREVALENCIA, generar hipótesis",medida:"Prevalencia, Razón de prevalencias, OR de prevalencia",ejemplo:"¿Cuántos diabéticos hay en La Paz ahora?",icono:"📸"},
{nivel:6,nombre:"Serie de Casos / Reporte de Caso",color:"#fb923c",ancho:"88%",desc:"Descripción de uno o varios pacientes. Sin grupo control.",para:"Describir enfermedades nuevas, efectos adversos raros, presentaciones atípicas",medida:"Descriptiva — no calcula asociación",ejemplo:"Primeros casos de SIDA (1981) → 5 neumonías por Pneumocystis en LA.",icono:"📋"},
{nivel:7,nombre:"Opinión de Expertos",color:"#64748b",ancho:"100%",desc:"Basada en experiencia clínica, no en datos empíricos.",para:"Cuando no hay estudios. Guías de consenso en áreas sin evidencia.",medida:"Ninguna formal",ejemplo:"Recomendaciones de comités cuando no hay ECAs disponibles.",icono:"💬"}
];

// DATOS EPIDEMIOLOGÍA — TIPOS DE ESTUDIO DETALLADOS
var ESTUDIOS=[
{nombre:"Ensayo Clínico Aleatorizado",tipo:"Experimental",temporal:"Prospectivo",ic:"🏆",col:"#3b82f6",
 def:"Participantes asignados ALEATORIAMENTE a intervención vs control. Puede ser ciego, doble ciego o triple ciego.",
 ventajas:["Controla sesgos por aleatorización","Demuestra CAUSALIDAD","Máxima validez interna"],
 limitaciones:["Costoso y largo","Problemas éticos si hay daño conocido","Validez externa limitada (población seleccionada)"],
 medidas:"RR, RRA, RRR, NNT, IC 95%",
 pregunta:"¿La intervención X causa el resultado Y?"},
{nombre:"Estudio de Cohorte",tipo:"Observacional analítico",temporal:"Prospectivo o Retrospectivo",ic:"📈",col:"#8b5cf6",
 def:"Grupo de personas seguidas en el tiempo según exposición a un factor. Se compara incidencia de enfermedad.",
 ventajas:["Calcula incidencia y RR","Establece temporalidad","Múltiples outcomes"],
 limitaciones:["Largo y costoso si prospectivo","Pérdidas de seguimiento","No sirve para enfermedades raras"],
 medidas:"RR (Riesgo Relativo), Incidencia, HR",
 pregunta:"¿Los expuestos a X tienen más riesgo de Y?"},
{nombre:"Casos y Controles",tipo:"Observacional analítico",temporal:"Siempre Retrospectivo",ic:"🔍",col:"#a78bfa",
 def:"Se seleccionan ENFERMOS (casos) y SANOS (controles), y se investiga exposición previa.",
 ventajas:["Rápido y barato","Ideal para enfermedades raras","Múltiples exposiciones"],
 limitaciones:["NO calcula incidencia ni RR directo","Sesgo de recuerdo","Difícil selección de controles"],
 medidas:"OR (Odds Ratio)",
 pregunta:"¿Los enfermos de Y estuvieron más expuestos a X?"},
{nombre:"Estudio Transversal",tipo:"Observacional descriptivo/analítico",temporal:"Un momento en el tiempo",ic:"📸",col:"#f472b6",
 def:"Mide exposición y enfermedad en el MISMO momento. Foto instantánea de la población.",
 ventajas:["Rápido y económico","Calcula prevalencia","Genera hipótesis"],
 limitaciones:["NO establece temporalidad ni causalidad","Sesgo de supervivencia","Solo prevalencia, no incidencia"],
 medidas:"Prevalencia, Razón de prevalencias",
 pregunta:"¿Cuántos tienen Y ahora? ¿Se asocia con X?"},
{nombre:"Serie de Casos",tipo:"Observacional descriptivo",temporal:"Variable",ic:"📋",col:"#fb923c",
 def:"Descripción detallada de un grupo de pacientes con la misma enfermedad. Sin grupo control.",
 ventajas:["Describe enfermedades nuevas","Genera hipótesis","Fácil de realizar"],
 limitaciones:["Sin grupo control","No calcula asociación","Sesgo de selección total"],
 medidas:"Descriptiva (frecuencias, medias)",
 pregunta:"¿Cómo se presenta esta enfermedad?"}
];

// DATOS EPIDEMIOLOGÍA — SESGOS
var SESGOS=[
{nombre:"Sesgo de Selección",def:"La muestra NO representa a la población blanco.",ejemplo:"Estudiar hipertensión solo en pacientes hospitalizados (excluye leves).",solucion:"Aleatorización, muestreo probabilístico.",col:"#ef4444",ic:"🎯"},
{nombre:"Sesgo de Información",def:"Error en la MEDICIÓN de la exposición o el resultado.",ejemplo:"Balanza mal calibrada, preguntas ambiguas en encuesta.",solucion:"Instrumentos validados, cegamiento, protocolos estandarizados.",col:"#f59e0b",ic:"📏"},
{nombre:"Sesgo de Confusión",def:"Una TERCERA variable distorsiona la relación real entre X e Y.",ejemplo:"Café → cáncer de pulmón (confusor: tabaco, los que toman más café fuman más).",solucion:"Aleatorización, estratificación, análisis multivariado, emparejamiento.",col:"#8b5cf6",ic:"🔀"},
{nombre:"Sesgo de Recuerdo",def:"Los ENFERMOS recuerdan mejor sus exposiciones que los sanos.",ejemplo:"En casos y controles: madres de niños con malformaciones recuerdan más los fármacos del embarazo.",solucion:"Usar registros médicos, verificación objetiva.",col:"#3b82f6",ic:"🧠"},
{nombre:"Sesgo de Publicación",def:"Se publican más estudios con resultados POSITIVOS/significativos.",ejemplo:"10 ECAs sobre droga X: 3 positivos se publican, 7 negativos no.",solucion:"Registro previo de protocolos (ClinicalTrials.gov), funnel plot.",col:"#10b981",ic:"📰"},
{nombre:"Sesgo del Observador (Hawthorne)",def:"Los participantes cambian su comportamiento al saberse observados.",ejemplo:"Pacientes que toman mejor su medicación durante el estudio.",solucion:"Cegamiento (simple, doble, triple).",col:"#06b6d4",ic:"👁️"}
];

// DATOS EPIDEMIOLOGÍA — MEDIDAS
var MEDIDAS_EPI=[
{nombre:"Sensibilidad",formula:"VP / (VP + FN)",desc:"Capacidad de DETECTAR enfermos. Alta S → pocos falsos negativos.",regla:"SnNout: alta Sensibilidad + resultado Negativo = descarta",col:"#34d399"},
{nombre:"Especificidad",formula:"VN / (VN + FP)",desc:"Capacidad de DETECTAR sanos. Alta E → pocos falsos positivos.",regla:"SpPin: alta eSpecificidad + resultado Positivo = confirma",col:"#3b82f6"},
{nombre:"VPP",formula:"VP / (VP + FP)",desc:"Si da positivo, ¿probabilidad real de estar enfermo? DEPENDE de prevalencia.",regla:"↑Prevalencia → ↑VPP",col:"#f59e0b"},
{nombre:"VPN",formula:"VN / (VN + FN)",desc:"Si da negativo, ¿probabilidad real de estar sano? DEPENDE de prevalencia.",regla:"↓Prevalencia → ↑VPN",col:"#8b5cf6"},
{nombre:"RR (Riesgo Relativo)",formula:"Incidencia expuestos / Incidencia no expuestos",desc:"¿Cuántas veces más riesgo tienen los expuestos? Solo en COHORTES.",regla:"RR=1 nulo | RR>1 riesgo | RR<1 protector",col:"#ef4444"},
{nombre:"OR (Odds Ratio)",formula:"(a×d) / (b×c) de tabla 2×2",desc:"Aproxima al RR en Casos y Controles. Válido si enfermedad rara (<10%).",regla:"OR=1 nulo | OR>1 riesgo | OR<1 protector",col:"#a78bfa"},
{nombre:"NNT",formula:"1 / RRA (Reducción Absoluta del Riesgo)",desc:"Número de pacientes que hay que tratar para evitar 1 evento.",regla:"NNT bajo = tratamiento más efectivo. NNT=1 sería perfecto.",col:"#06b6d4"},
{nombre:"Prevalencia",formula:"Casos existentes / Población total",desc:"Proporción de enfermos en un MOMENTO dado. Foto.",regla:"Estudios transversales",col:"#f472b6"},
{nombre:"Incidencia",formula:"Casos NUEVOS / Población en riesgo × tiempo",desc:"Velocidad de aparición de casos nuevos. Película.",regla:"Estudios de cohorte",col:"#fb923c"}
];

// DATOS EPIDEMIOLOGÍA — LECTURA CRÍTICA CHECKLIST
var CHECKLIST_LC=[
{paso:"1",pregunta:"¿La pregunta es clara? (PICO)",detalle:"Paciente/Población, Intervención, Comparador, Outcome. Si no hay PICO claro, el estudio no tiene rumbo.",col:"#3b82f6"},
{paso:"2",pregunta:"¿El diseño es apropiado?",detalle:"¿La pregunta de causalidad se responde con un ECA? ¿La de pronóstico con una cohorte? Diseño inadecuado = conclusiones inválidas.",col:"#8b5cf6"},
{paso:"3",pregunta:"¿La muestra es representativa?",detalle:"¿Cómo se seleccionaron los participantes? ¿Hay sesgo de selección? ¿El tamaño muestral es suficiente (cálculo de poder)?",col:"#a78bfa"},
{paso:"4",pregunta:"¿Se controlaron los sesgos?",detalle:"Aleatorización, cegamiento, análisis por intención de tratar, control de confusores.",col:"#f472b6"},
{paso:"5",pregunta:"¿Los resultados son significativos?",detalle:"p < 0.05 (significancia estadística). IC 95% que no cruce el valor nulo (1 para RR/OR, 0 para diferencias).",col:"#ef4444"},
{paso:"6",pregunta:"¿Son clínicamente relevantes?",detalle:"Un p=0.001 con NNT=500 no es útil en la práctica. ¿El efecto es grande como para cambiar la conducta?",col:"#f59e0b"},
{paso:"7",pregunta:"¿Se aplica a MI paciente?",detalle:"¿Mi paciente cumple los criterios del estudio? ¿El contexto (recursos, comorbilidades) es similar?",col:"#10b981"}
];
