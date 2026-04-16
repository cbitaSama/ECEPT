/* Trauma · Unidad 1 — native data
   Mirrors artifacts/trauma_unidad_1.html byte-for-byte (Spanish content sacred).
   Bloque schema:
     {k:"p",       html}
     {k:"h3",      text}
     {k:"list",    ordered?, items:[]}             // items may contain HTML
     {k:"table",   compact?, headers:[], rows:[[..],..], hi?:[rowIdx]}
     {k:"callout", tone:"blue|green|purple|yellow|red|orange", title?, html?, items?}
     {k:"pearl",   ico?, html}
     {k:"danger",  ico?, html}
     {k:"trap",    ico?, html}
     {k:"cards",   layout:"drug|lesion|anat|triage|step", items:[]}
     {k:"widget",  name:"glasgow|hemorrhage|ett|abcdefg|lethal|anat_pts"}
     {k:"link",    to:"sec_id"|jump:"topic", label}
*/

var TRAUMA_TOPICS = [
  {id:"gen",   num:"00", chip:"GENERALIDADES",   title:"Conceptos Base y Deontología",          accent:"#94a3b8", desc:"Emergencia vs urgencia, definiciones clave, responsabilidad profesional, curva trimodal y triage con códigos de color.", chips:["Policontuso","Iatrogenia","START"]},
  {id:"via",   num:"01", chip:"VÍA AÉREA",       title:"Manejo de la Vía Aérea",                accent:"#60a5fa", desc:"La \"A\" del ABCDE. Maniobras, cánulas, intubación, SIR y vía aérea quirúrgica.",                                       chips:["SIR","Mallampati","Cormack","Confirmación"]},
  {id:"poli",  num:"02", chip:"POLITRAUMATIZADO",title:"Manejo Inicial del Politraumatizado",   accent:"#f472b6", desc:"Hora de oro, ABCDEFG, Glasgow interactivo, AMPLE y traslado en bloque.",                                              chips:["ABCDEFG","Glasgow","AMPLE","Log-roll"]},
  {id:"shock", num:"03", chip:"SHOCK",           title:"Shock",                                  accent:"#ef4444", desc:"4 tipos, tríada letal, grados de hemorragia con calculadora y trampas clínicas clásicas.",                            chips:["4 tipos","Neurogénico","Tríada letal"]},
  {id:"torax", num:"04", chip:"TÓRAX",           title:"Trauma de Tórax",                        accent:"#a78bfa", desc:"Las 6 lesiones letales con detalle interactivo y la tabla unificada de puntos anatómicos.",                          chips:["6 letales","Beck","Puntos anatómicos"]}
];

var TRAUMA_HUB = {
  eyebrow: "Emergenciología · Unidad 1",
  title: "Trauma",
  sub: "Todo lo que necesitás saber para dominar el manejo del paciente traumatizado: desde las definiciones y principios deontológicos hasta las 6 lesiones letales del tórax. Con calculadoras integradas, trampas de examen destacadas y modo repaso de alto rendimiento.",
  stats: [
    {ico:"📚", label:"5 temas"},
    {ico:"🧮", label:"3 calculadoras"},
    {ico:"📐", label:"Tabla de puntos anatómicos"},
    {ico:"⚡", label:"Repaso en 1 toque"}
  ]
};

/* ETT data — 9 entries, copied verbatim from artifact */
var TRAUMA_ETT = [
  {l:"Mujer adulta", s:"7.0 – 7.5", b:"Con balón", p:"23 cm",       r:"3 recta o curva"},
  {l:"Hombre adulto",s:"7.5 – 8.0", b:"Con balón", p:"23 cm",       r:"3 recta o curva"},
  {l:"Adolescente",  s:"6.5 – 7.0", b:"Con balón", p:"20 – 23 cm",  r:"3 recta o curva"},
  {l:"Escolar",      s:"5.5 – 6.5", b:"Sin balón", p:"14 – 20 cm",  r:"2 recta"},
  {l:"Preescolar",   s:"5.0 – 5.5", b:"Sin balón", p:"12.5 – 14 cm",r:"2 recta"},
  {l:"Deambulante",  s:"4.0 – 5.0", b:"Sin balón", p:"11 – 12.5 cm",r:"1 – 2 recta"},
  {l:"0 – 1 año",    s:"3.5 – 4.0", b:"Sin balón", p:"9.5 – 11 cm", r:"1 recta"},
  {l:"A término",    s:"3.0 – 3.5", b:"Sin balón", p:"8 – 9.5 cm",  r:"1 recta"},
  {l:"Prematuro",    s:"2.5 – 3.0", b:"Sin balón", p:"8 cm",        r:"0 recta"}
];

/* ABCDEFG steps — 5 entries, body has structured bloques (replaces inline HTML) */
var TRAUMA_ABCD = [
  {letter:"A", title:"Vía aérea + control de columna cervical", body:[
    {k:"list", items:[
      "Paciente <strong>consciente con respuesta verbal</strong>: vía aérea permeable, ventilación intacta, cerebro perfundido",
      "Paciente <strong>inconsciente</strong>: riesgo por caída de la lengua y broncoaspiración (causa más frecuente de obstrucción)",
      "<strong>O₂ a alto flujo</strong>: FiO₂ 50%, 8–10 lpm con mascarilla",
      "Si hay obstrucción: elevación del mentón o subluxación mandibular, <strong>cuello en posición neutra</strong>",
      "Limpieza bucal (aspiración con sonda rígida) + cánula orofaríngea",
      "Colocar collar cervical en todo politraumatizado hasta descartar lesión"
    ]},
    {k:"link", jump:"via", label:"Ver Vía Aérea completa"}
  ]},
  {letter:"B", title:"Respiración y ventilación", body:[
    {k:"list", items:[
      "Evaluar <strong>simetría torácica</strong> y ritmo",
      "Buscar enfisema subcutáneo, fracturas costales",
      "Auscultar ruidos respiratorios en ambos campos",
      "Descomprimir neumotórax a tensión (dx clínico, no radiológico)",
      "Sellar neumotórax abierto con apósito de 3 lados",
      "Neumotórax a tensión: <strong>bránula N°14 en 2° EIC línea medioclavicular</strong> → luego tubo de tórax bajo sello de agua en 5° EIC línea axilar media"
    ]},
    {k:"link", jump:"torax", label:"Ver 6 lesiones letales"}
  ]},
  {letter:"C", title:"Circulación + control de hemorragias", body:[
    {k:"list", items:[
      "Compresión directa de hemorragias externas",
      "<strong>2 vías periféricas</strong> (teflón 14–16) e iniciar cristaloide tibio",
      "Ringer Lactato 39°C: <strong>bolo 1–2 L en 15–20 min (20 ml/kg en niños)</strong>",
      "Relación cristaloide:sangre = <strong>3:1</strong>",
      "Transfundir hemoderivados a <strong>37 °C</strong> (tras 3 L sin respuesta)"
    ]},
    {k:"h4", text:"Signos clínicos"},
    {k:"list", items:[
      "<strong>Taquicardia = 1° signo de hipovolemia</strong>",
      "Hipotensión → signo <strong>TARDÍO</strong> (aparece en G III: 30–40% de pérdida)",
      "Color de piel, perfusión distal y llenado capilar",
      "Nivel de conciencia (perfusión cerebral, si no hay TCE)"
    ]},
    {k:"h4", text:"Pulso palpable y PAS estimada"},
    {k:"list", items:[
      "<strong>Radial</strong>: ≥ 80 mmHg",
      "<strong>Femoral</strong>: ≥ 70 mmHg",
      "<strong>Carotídeo</strong>: ≥ 60 mmHg"
    ]},
    {k:"h4", text:"AESP en trauma — causas"},
    {k:"list", items:["Taponamiento cardíaco","Neumotórax a tensión","Hipovolemia profunda","Ruptura cardíaca"]},
    {k:"link", jump:"shock", label:"Ver Shock completo"}
  ]},
  {letter:"D", title:"Déficit neurológico", body:[
    {k:"list", items:[
      "<strong>AVDN</strong>: Alerta / Verbal / Dolor / No responde",
      "Tamaño y respuesta pupilar",
      "Escala de Coma de Glasgow (3 parámetros: O, V, M — total 3 a 15)",
      "<strong>Glasgow ≤ 8 → intubar</strong>"
    ]},
    {k:"link", to:"poli-5", label:"Calculadora Glasgow"}
  ]},
  {letter:"E / F / G", title:"Exposición / Fracturas / Ambiente", body:[
    {k:"list", items:[
      "Desvestir completamente al paciente",
      "Buscar lesiones ocultas en dorso y perineo",
      "Identificar fracturas y alineación de extremidades",
      "<strong>Prevenir hipotermia</strong> (mantas térmicas, líquidos calientes, ambiente cálido)",
      "La hipotermia es uno de los tres componentes de la tríada letal"
    ]}
  ]}
];

/* 6 LETHAL lesions — bodies converted from inline HTML to bloque arrays */
var TRAUMA_LETHAL = [
  {n:1, t:"Obstrucción de la vía aérea", body:[
    {k:"p", html:"Por trauma directo de laringe/tráquea o secundario (coma, aspiración)."},
    {k:"list", items:[
      "Lesión laríngea (poco frecuente): <strong>ronquera + enfisema subcutáneo</strong>",
      "Causa más frecuente en inconsciente: caída de la lengua",
      "Tratamiento: <strong>intubación orotraqueal o traqueostomía</strong>"
    ]},
    {k:"link", jump:"via", label:"Ver manejo de vía aérea"}
  ]},
  {n:2, t:"Neumotórax a tensión", body:[
    {k:"p", html:"Aire entra al espacio pleural a presión positiva sin salida → colapsa el pulmón y comprime el mediastino."},
    {k:"danger", ico:"⚠️", html:"<strong>Diagnóstico CLÍNICO, no radiológico.</strong> No esperar Rx para descomprimir."},
    {k:"table", headers:["Signos clínicos","Tratamiento"], rows:[[
      "<ul><li>Dolor torácico + disnea</li><li>Taquicardia + hipotensión</li><li><strong>Desviación traqueal contralateral</strong> (mediastino al lado opuesto)</li><li><strong>Timpanismo / hiperresonancia</strong> a la percusión</li><li>Ausencia de MV ipsilateral</li><li>Ingurgitación de venas del cuello</li><li>Cianosis (tardío)</li></ul>",
      "<strong>1.</strong> Descompresión <strong>INMEDIATA</strong>: bránula 14 o 16 en <strong>2° EIC, línea medioclavicular, sobre la costilla</strong> (borde superior de la costilla inferior) del lado afectado.<br><br><strong>2.</strong> Tubo de tórax: <strong>5° EIC entre línea axilar anterior y media, sobre la costilla</strong>."
    ]]},
    {k:"link", to:"tx-4", label:"Ver puntos anatómicos"}
  ]},
  {n:3, t:"Neumotórax abierto (lesión aspirante)", body:[
    {k:"list", items:[
      "Defecto de pared <strong>&gt; 2/3 del diámetro de la tráquea</strong>",
      "Aire iguala presiones intratorácica y ambiental → impide ventilar"
    ]},
    {k:"h4", text:"Tratamiento"},
    {k:"list", ordered:true, items:[
      "Cubrir el defecto con <strong>apósito de 3 lados</strong> (válvula unidireccional)",
      "Tubo de tórax (<strong>no a través de la herida</strong>)",
      "Cirugía definitiva"
    ]}
  ]},
  {n:4, t:"Hemotórax masivo", body:[
    {k:"p", html:"Pérdida ≥ <strong>1500 ml</strong> de sangre en cavidad pleural por lesión de vasos sistémicos y/o pulmonares."},
    {k:"table", headers:["Clínica","Hallazgos","Tratamiento"], rows:[[
      "Shock + ausencia de ruidos respiratorios",
      "Yugulares colapsadas o ingurgitadas + <strong>matidez a la percusión</strong> · velamiento del hemitórax en Rx",
      "<ol><li>Restaurar volumen rápidamente</li><li>Descompresión torácica + Rx control</li><li>Autotransfusión</li><li><strong>Toracotomía si: &gt; 1500 ml al drenaje inicial · O · &gt; 200 ml/h × 3–4 h</strong></li></ol>"
    ]]},
    {k:"h4", text:"Clasificación por volumen"},
    {k:"table", compact:true, headers:["Grado","Volumen","Manejo"], rows:[
      ["<strong>I</strong>","&lt; 350 ml","Observación / drenaje menor"],
      ["<strong>II</strong>","350 – 1500 ml","Tubo de tórax"],
      ["<strong>III</strong>","&gt; 1500 ml","<strong>Toracotomía / cirugía urgente</strong>"]
    ], hi:[2]}
  ]},
  {n:5, t:"Tórax volante (volet costal)", body:[
    {k:"list", items:[
      "Fractura de <strong>≥ 3 costillas consecutivas en ≥ 2 lugares</strong> → segmento libre con <strong>movimiento paradójico</strong> (se hunde en inspiración, sale en espiración)",
      "<strong>El verdadero problema fisiopatológico es la contusión pulmonar subyacente</strong> — causa principal de la hipoxemia",
      "Manejo: <strong>O₂, analgesia (fundamental para permitir respirar)</strong>, intubación si es grave",
      "Reposición de líquidos con criterio (riesgo de edema pulmonar)"
    ]}
  ]},
  {n:6, t:"Taponamiento cardíaco", body:[
    {k:"p", html:"Acumulación de sangre en el pericardio (<strong>60 – 100 ml</strong> pueden ser suficientes) que impide la expansión ventricular y reduce el GC."},
    {k:"table", headers:["Tríada de Beck","Fisiopatología"], rows:[[
      "<ol><li>Hipotensión arterial</li><li>Ingurgitación yugular (distensión venas del cuello)</li><li>Ruidos cardíacos apagados</li></ol>",
      "Sangre en pericardio → ↑ presión llenado AD → ↓ llenado VD → ↓ llenado VI → ↓ GC → hipotensión → acidosis metabólica → isquemia cardíaca"
    ]]},
    {k:"h4", text:"Tratamiento"},
    {k:"list", items:[
      "<strong>Pericardiocentesis</strong> de emergencia (punción evacuadora)",
      "<strong>Ventana pericárdica</strong> (definitiva)",
      "Toracotomía de resucitación (casos extremos)"
    ]},
    {k:"link", to:"tx-4", label:"Ver punto anatómico de pericardiocentesis"},
    {k:"h4", text:"Toracotomía de resucitación"},
    {k:"table", headers:["Indicaciones","Contraindicaciones"], rows:[[
      "<ul><li>Disponibilidad de cirujano</li><li>Lesión penetrante en tórax</li><li>AESP / disociación electromecánica</li></ul>",
      "<ul><li>Sin actividad eléctrica Y sin pulso</li><li>Lesión contusa de tórax</li></ul>"
    ]]}
  ]}
];

/* REPASO modal — 5 blocks of key-value pairs, verbatim from artifact */
var TRAUMA_REPASO = [
  {accent:"#94a3b8", title:"Generalidades", pairs:[
    ["Emergencia","Grave, Tx/cirugía <strong>inmediata</strong>, riesgo vital"],
    ["Urgencia","Necesidad de consulta; el médico define si es emergencia"],
    ["Policontuso","≥ 2 lesiones, ninguna vital"],
    ["Politraumatizado","≥ 2 lesiones, al menos una puede matar"],
    ["Impericia","NO sabe"],
    ["Negligencia","Sabe y NO hace"],
    ["Imprudencia","Hace sin pensar"],
    ["Iatrogenia","Daño sin culpa"],
    ["Consentimiento implícito","Paciente inconsciente sin familiares"],
    ["Curva trimodal","1°: ~50% inmediato · 2°: ~30% hora de oro · 3°: ~20% días"],
    ["START rojo","Inconsciente · FR &lt;10 o &gt;30 · sin pulso radial / LC &gt;2s"],
    ["START amarillo","Consciente, lesiones que requieren atención"],
    ["START verde","Camina · FR ~16 · pulso ~72"],
    ["START negro","Fallecido o no recuperable"]
  ]},
  {accent:"#60a5fa", title:"Vía aérea", pairs:[
    ["Obstrucción #1","Caída de la lengua hacia atrás (inconsciente)"],
    ["Maniobra si trauma cervical","Esmarch o subluxación mandibular"],
    ["Cánula Mayo","Inconsciente sin reflejo nauseoso · medir comisura-lóbulo"],
    ["Cánula Robertazzi","Consciente · CI: fractura nasal / base de cráneo"],
    ["Intubar si","Apnea · Glasgow ≤8 · PaO₂ &lt;60 · PaCO₂ &gt;50 · pH &lt;7.3"],
    ["Tiempo máx/intento","30 segundos"],
    ["Confirma IOT","Paso por cuerdas · empañamiento · capnografía · MV bilateral"],
    ["NO confirma","Ruidos en epigastrio · reflejo tosígeno"],
    ["Complicación clásica","Selectiva en bronquio derecho → colapso pulmón izq"],
    ["Macintosh","Curva · valécula · adulto"],
    ["Miller","Recta · bajo epiglotis · pediátrico"],
    ["Mallampati IV","Solo paladar óseo → vía aérea difícil severa"],
    ["SIR — sedante","Midazolam 2.5 mg IV (total 3.5–7.5 mg) · antídoto flumazenil 0.3 mg"],
    ["SIR — paralizante","Succinilcolina 1–1.5 mg/kg IV · inicio 30s · dura 3 min"],
    ["Opioide — antídoto","Naloxona 0.4–0.8 mg IV (paro: 2 mg)"],
    ["Cricotiroidotomía","Membrana cricotiroidea · CI pediatría"]
  ]},
  {accent:"#f472b6", title:"Politraumatizado", pairs:[
    ["Hora de oro","2° pico · ~30% mortalidad · causas tratables"],
    ["ABCDE","Vía aérea+cervical · Ventilación · Circulación · Neurológico · Exposición"],
    ["O₂ inicial","FiO₂ 50% · 8–10 lpm con mascarilla"],
    ["Vías","2 periféricas teflón 14–16 · intraósea si falla en niños · <strong>arterial NO hidrata</strong>"],
    ["Líquido inicial","Ringer Lactato tibio 39°C · 1–2 L bolo (20 ml/kg niños)"],
    ["Transfusión","Tras 3 L Ringer sin respuesta · O Rh(–) si emergencia · <strong>37°C</strong>"],
    ["Relación cristaloide:sangre","3 : 1"],
    ["Pulso radial","PAS ≥ 80 · femoral ≥ 70 · carotídeo ≥ 60"],
    ["Glasgow rango","3 – 15 puntos"],
    ["Glasgow ≤ 8","Intubar"],
    ["Glasgow verbal 3","Palabras inapropiadas"],
    ["Glasgow verbal 2","Sonidos incomprensibles"],
    ["Rx primaria","Cervical lateral · Tórax AP · Pelvis AP"],
    ["AMPLE","Alergias · Meds · Patologías · Libaciones · Eventos"],
    ["Sonda gástrica","Fractura lámina cribosa → ORAL"],
    ["Sonda vesical CI","Sangre en meato · próstata elevada · equimosis perineal · fractura pélvica · sangre escroto"],
    ["Diuresis adulto","&gt; 0.5 ml/kg/h"],
    ["Traslado","Decúbito dorsal neutro · tabla larga · collar · log-roll"],
    ["Orden múltiples lesiones","VA → hemorragia externa → fracturas → quemaduras → conmoción"]
  ]},
  {accent:"#ef4444", title:"Shock", pairs:[
    ["Común a todos","Mala oxigenación celular de tejidos vitales"],
    ["Tríada letal","Hipotermia (&lt;35°) + Acidosis (pH &lt;7.30) + Coagulopatía"],
    ["Primer signo","TAQUICARDIA · hipotensión = signo TARDÍO (G III, 30–40%)"],
    ["Oliguria adulto","&lt; 0.5 ml/kg/h"],
    ["Objetivos","PAM ≥ 60 · SatO₂ ≥ 92% · diuresis &gt; 0.5 ml/kg/h · lactato normal"],
    ["Cristaloide","1000 ml → solo 200 ml intravasculares"],
    ["Coloide (HES)","1000 ml → ~800 ml intravasculares"],
    ["PVC baja","&lt; 2–3 cm H₂O → hipovolémico / distributivo"],
    ["PVC alta","&gt; 10–12 cm H₂O → obstructivo / cardiogénico"],
    ["Hemorragia G III","1500–2000 ml · 30–40% · aquí baja la PA"],
    ["Hemorragia G IV","&gt; 2000 ml · &gt; 40% · cirugía inmediata + HD"],
    ["Fémur","~1500 ml secuestrados (3 U sangre)"],
    ["Pelvis","&gt; 2 L"],
    ["Neurogénico","<strong>Hipotensión SIN taquicardia</strong> · piel caliente y seca · lesión medular"],
    ["Shock medular","Flacidez + arreflexia temporal (no es cardiovascular)"],
    ["Hemotórax 1000 ml","Taquicardia, NO bradicardia"],
    ["Cardiogénico","GC ↓ · presiones llenado ↑ · RVS ↑ · yugulares ingurgitadas + rales"],
    ["NO hacer","Inotrópicos en hipovolémico · saltar A/B · enviar a Rx en shock"]
  ]},
  {accent:"#a78bfa", title:"Trauma de tórax", pairs:[
    ["1era medida oxigenación","O₂ suplementario"],
    ["6 letales","Obstrucción VA · Neumo tensión · Neumo abierto · Hemotórax masivo · Volet costal · Taponamiento"],
    ["Neumo a tensión","Dx <strong>CLÍNICO</strong> (no Rx) · desviación traqueal contralateral · timpanismo"],
    ["Neumo tensión Tx","Bránula 14/16 en <strong>2° EIC LMC, sobre la costilla</strong> → tubo 5° EIC LAM"],
    ["Neumo abierto","Apósito de 3 lados + tubo de tórax (no por la herida)"],
    ["Volet costal","≥3 costillas en ≥2 lugares · problema real = contusión pulmonar · analgesia"],
    ["Hemotórax masivo","≥ 1500 ml · matidez · yugulares colapsadas/ingurgitadas"],
    ["Toracotomía si","&gt; 1500 ml al drenar · O · &gt; 200 ml/h × 3–4 h"],
    ["Tríada de Beck","Hipotensión + ingurgitación yugular + ruidos cardíacos apagados"],
    ["Taponamiento","60–100 ml en pericardio bastan"],
    ["Pericardiocentesis","Debajo xifoides · borde costal <strong>izquierdo</strong> · hacia hombro izq"],
    ["Toracocentesis","2° EIC LMC, sobre la costilla"],
    ["Toracostomía","5° EIC entre LAA y LAM, sobre la costilla"],
    ["Cricotiroidotomía","Entre tiroides y cricoides · CI pediatría"],
    ["Contusión pulmonar","Más frecuente · Rx tardía (6h) · no sobrehidratar · sin corticoides"],
    ["Mediastino &gt; 8 cm","Sospechar aorta → angio-TC · desaceleración"],
    ["Neumo simple + ARM","Puede convertirse en hipertensivo"],
    ["Lesión traqueal","Dx: endoscopia (broncoscopia)"],
    ["Asfixia traumática","Compresión torácica · petequiado facial · consciente"],
    ["Sello de agua","Tubo DENTRO del líquido · frasco bajo el tórax"]
  ]}
];

/* ============= SECCIONES — 31 total across 5 topics ============= */
var TRAUMA_SECCIONES = [];

/* === GENERALIDADES (gen-1 .. gen-4) === */
TRAUMA_SECCIONES.push(
  {id:"gen-1", topic:"gen", title:"Definiciones clave", bloques:[
    {k:"h3", text:"Emergencia vs urgencia médica"},
    {k:"table", headers:["Concepto","Definición"], rows:[
      ["<strong>Emergencia</strong>","Situación grave que requiere tratamiento o cirugía <strong>inmediata</strong>; pone en riesgo la vida del paciente."],
      ["<strong>Urgencia</strong>","Necesidad de acudir al médico, quien define si constituye o no una emergencia. No necesariamente compromete la vida de forma inmediata."]
    ]},
    {k:"h3", text:"Trauma"},
    {k:"callout", tone:"blue", title:"Definición", html:"Lesión general del organismo tras la aplicación de una fuerza externa que <strong>supera la capacidad de absorción de energía</strong> de los tejidos."},
    {k:"h3", text:"Policontuso vs politraumatizado"},
    {k:"table", headers:["Concepto","Definición"], rows:[
      ["<strong>Policontuso</strong>","Paciente con <strong>≥ 2 lesiones</strong>, <span class=\"tag-ok\">ninguna compromete la vida</span>."],
      ["<strong>Politraumatizado</strong>","Paciente con <strong>≥ 2 lesiones</strong>, <span class=\"tag-bad\">al menos una afecta un sistema y puede causar la muerte</span>."]
    ]},
    {k:"pearl", ico:"💡", html:"La diferencia está en el <strong>riesgo vital</strong>. Policontuso = múltiples lesiones leves. Politraumatizado = al menos una pone la vida en juego."}
  ]},

  {id:"gen-2", topic:"gen", title:"Deontología médica en emergencias", bloques:[
    {k:"h3", text:"Consentimiento informado"},
    {k:"table", headers:["Tipo","Situación"], rows:[
      ["<strong>Explícito</strong>","El paciente o su familiar <strong>autoriza</strong> el procedimiento de forma expresa (verbal o escrita)."],
      ["<strong>Implícito</strong>","Paciente <strong>inconsciente sin familiares presentes</strong>. El médico actúa bajo <strong>responsabilidad profesional</strong> para salvar la vida."]
    ]},
    {k:"h3", text:"Responsabilidad profesional — 4 conceptos a diferenciar"},
    {k:"table", headers:["Concepto","Definición","Clave"], rows:[
      ["<strong>Impericia</strong>","Falta de conocimientos y práctica, pero actúa igual.","<span class=\"tag-bad\">NO sabe</span>"],
      ["<strong>Negligencia</strong>","Tiene conocimiento y práctica, pero <strong>no actúa oportunamente</strong>.","<span class=\"tag-bad\">Sabe y NO hace</span>"],
      ["<strong>Imprudencia</strong>","Actúa sin la previsión o cautela debida.","<span class=\"tag-bad\">Hace sin pensar</span>"],
      ["<strong>Iatrogenia</strong>","Daño causado por el acto médico <strong>sin culpa</strong> del profesional.","<span class=\"tag-ok\">Sin culpa</span>"]
    ]},
    {k:"pearl", ico:"🧠", html:"<strong>Mnemotecnia rápida:</strong> Impericia = no sabe · Negligencia = sabe y no hace · Imprudencia = hace sin pensar · Iatrogenia = hace bien y hay daño igual."}
  ]},

  {id:"gen-3", topic:"gen", title:"Curva trimodal de la mortalidad por trauma", bloques:[
    {k:"p", html:"La muerte por trauma no es un evento único: ocurre en <strong>3 picos temporales distintos</strong> con causas diferentes. Entender esta curva es entender dónde se salvan vidas."},
    {k:"table", headers:["Pico","%","Momento","Causas principales","Estrategia de prevención"], rows:[
      ["<strong>1°</strong>","<strong>~ 50 %</strong>","Inmediato (<em>in situ</em>)","Obstrucción de vía aérea / hipoxia, lesiones incompatibles con la vida (TEC severo, lesión medular alta, lesión cardíaca o de grandes vasos)","Prevención primaria (cinturón, cascos, velocidad)"],
      ["<strong>2°</strong> <span class=\"tag-bad\">Hora de oro</span>","<strong>~ 30 %</strong>","Primeros minutos a horas","Hemorragia intracraneal, neumohemotórax masivo, ruptura esplénica / hepática, shock hipovolémico","Sistema integral de atención rápida (ambulancias, trauma centers)"],
      ["<strong>3°</strong>","<strong>~ 20 %</strong>","Días a semanas","Sepsis, falla multiorgánica","Calidad de la reanimación inicial + cuidados en UTI"]
    ], hi:[1]},
    {k:"pearl", ico:"⏱️", html:"<strong>La \"hora de oro\" es el pico donde más vidas podemos salvar.</strong> Casi todas sus causas son <em>tratables</em> si se identifican rápido. Por eso el entrenamiento en ABCDEFG se enfoca acá."}
  ]},

  {id:"gen-4", topic:"gen", title:"Triage", bloques:[
    {k:"p", html:"Método de <strong>selección y clasificación</strong> de pacientes según necesidades terapéuticas y recursos disponibles. Responde a una pregunta simple: <em>¿a quién atiendo primero?</em>"},
    {k:"h3", text:"Momentos de aplicación"},
    {k:"list", items:[
      "<em>In situ</em> (lugar del accidente)",
      "Al subir a la ambulancia",
      "A la llegada al hospital"
    ]},
    {k:"h3", text:"Estrategia según recursos disponibles"},
    {k:"table", headers:["Escenario","Estrategia"], rows:[
      ["<strong>Sin superación</strong> (víctimas ≤ recursos)","Atender primero al <strong>más grave</strong> siguiendo ABCDE"],
      ["<strong>Con superación</strong> (víctimas &gt; recursos)","Atender primero al <strong>potencialmente recuperable</strong> (mayor posibilidad de sobrevivir)"]
    ]},
    {k:"h3", text:"Método START — Simple Triage And Rapid Treatment"},
    {k:"p", html:"Sistema de 4 códigos de color que valora <strong>respiración, circulación (pulso radial / llenado capilar) y nivel de conciencia</strong>."},
    {k:"cards", layout:"triage", items:[
      {color:"#ef4444", code:"Rojo (I)",      cat:"Crítico / Inmediato",        crit:"Inconsciente · FR &lt; 10 o &gt; 30 · ausencia de pulso radial o llenado capilar &gt; 2 seg"},
      {color:"#fbbf24", code:"Amarillo (II)", cat:"Diferible",                  crit:"Consciente, respira bien, pulso palpable. Lesiones que requieren atención pero pueden esperar"},
      {color:"#34d399", code:"Verde (III)",   cat:"Leve / Ambulatorio",         crit:"Consciente, FR ~ 16/min, pulso radial ~ 72/min. Herido leve, camina"},
      {color:"#64748b", code:"Negro (0)",     cat:"Fallecido / No recuperable", crit:"Lesiones incompatibles con la vida o paciente sin signos vitales"}
    ]},
    {k:"h3", text:"Pasos operativos del START"},
    {k:"list", ordered:true, items:[
      "Asegurar la escena",
      "Pedir a todo aquel que pueda caminar que lo haga (esos van a VERDE)",
      "Valorar a los que quedan: respiración → circulación → conciencia"
    ]}
  ]}
);
