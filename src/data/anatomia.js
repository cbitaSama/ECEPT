// Anatomy: cranial nerves + inguinal canal

// ══════════════════════════════════════════════════════════════
// PARES CRANEALES
// ══════════════════════════════════════════════════════════════
var NERVES=[
  {
    id:"nc1",
    num:"I",
    n:"Nervio Olfatorio (I)",
    tipo:"Sensitivo",
    origen_real:"Mucosa nasal — células bipolares del epitelio olfatorio",
    origen_aparente:"Bulbo olfatorio → cintilla olfatoria → surco olfatorio",
    desc:"Es el nervio encargado del sentido del olfato. Sus fibras nacen en la mucosa nasal, atraviesan la lámina cribosa del etmoides como filetes olfatorios y hacen sinapsis en el bulbo olfatorio, desde donde la información viaja por la cintilla olfatoria hasta la corteza piriforme. Es el único par craneal que no hace relevo en el tálamo.",
    lesion:"Anosmia (pérdida del olfato)"
  },
  {
    id:"nc2",
    num:"II",
    n:"Nervio Óptico (II)",
    tipo:"Sensitivo",
    origen_real:"Retina — células ganglionares de la capa interna retiniana",
    origen_aparente:"Quiasma óptico",
    desc:"Transmite la información visual desde la retina hasta la corteza occipital. Técnicamente es un tracto del sistema nervioso central (su mielina es oligodendroglial, no de células de Schwann). Las fibras nasales se decusan en el quiasma óptico, mientras que las temporales continúan ipsilateralmente hacia el cuerpo geniculado lateral del tálamo.",
    lesion:"Ceguera monocular (pre-quiasma), hemianopsia bitemporal (quiasma), hemianopsia homónima (post-quiasma)"
  },
  {
    id:"nc3",
    num:"III",
    n:"Nervio Oculomotor (III)",
    tipo:"Motor",
    origen_real:"Núcleo motor principal (mesencéfalo, colículo superior) + núcleo de Edinger-Westphal (parasimpático)",
    origen_aparente:"Fosa interpeduncular (mesencéfalo)",
    desc:"Es el principal motor del ojo: inerva cuatro de los seis músculos extrínsecos oculares (recto superior, inferior, medial y oblicuo inferior) además del elevador del párpado superior. Su componente parasimpático (núcleo de Edinger-Westphal) controla la constricción pupilar (miosis) y la acomodación del cristalino. Su parálisis completa produce ptosis, midriasis y desviación del ojo hacia abajo y afuera.",
    lesion:"Ptosis + midriasis + ojo desviado abajo y afuera"
  },
  {
    id:"nc4",
    num:"IV",
    n:"Nervio Troclear (IV)",
    tipo:"Motor",
    origen_real:"Núcleo del troclear (mesencéfalo, colículo inferior)",
    origen_aparente:"Cara posterior del mesencéfalo (único par que sale por la cara dorsal)",
    desc:"Es el nervio craneal más delgado y el único que emerge por la cara posterior (dorsal) del tronco encefálico; además se decusa antes de salir y tiene el trayecto intracraneal más largo (7-8 cm). Inerva exclusivamente el músculo oblicuo superior, encargado de deprimir el ojo en aducción (mirar hacia abajo y adentro, como al leer o bajar escaleras).",
    lesion:"Diplopía vertical, cabeza inclinada al lado contrario (signo de Bielschowsky)"
  },
  {
    id:"nc5",
    num:"V",
    n:"Nervio Trigémino (V)",
    tipo:"Mixto",
    origen_real:"Sensitivo: ganglio de Gasser (trigeminal) → núcleos pontino, espinal y mesencefálico. Motor: núcleo motor del trigémino (puente)",
    origen_aparente:"Cara lateral de la protuberancia",
    desc:"Es el nervio más grueso de los pares craneales. Su función principal es la masticación (porción motora) y la sensibilidad de toda la cara (porción sensitiva). Se divide en tres ramas que cubren territorios faciales distintos; solo la rama mandibular (V3) lleva fibras motoras.",
    ramas:[
      "Rama oftálmica (V1): sensitiva — frente, párpado superior, dorso de la nariz y córnea. Es la aferencia del reflejo corneal.",
      "Rama maxilar (V2): sensitiva — mejilla, labio superior, dientes superiores, paladar y senos paranasales.",
      "Rama mandibular (V3): mixta — sensibilidad del mentón, labio inferior, dientes inferiores y dos tercios anteriores de la lengua (sensibilidad general); además lleva la porción motora para los músculos de la masticación (masetero, temporal, pterigoideos)."
    ],
    lesion:"Neuralgia del trigémino, anestesia facial, pérdida del reflejo corneal"
  },
  {
    id:"nc6",
    num:"VI",
    n:"Nervio Abducens (VI)",
    tipo:"Motor",
    origen_real:"Núcleo del abducens (puente inferior, bajo el colículo facial)",
    origen_aparente:"Surco bulboprotuberancial",
    desc:"Inerva exclusivamente el músculo recto lateral, responsable de la abducción del ojo (mirada lateral). Tiene un trayecto largo por la base del cráneo, lo que lo hace especialmente vulnerable a la hipertensión intracraneal; su parálisis puede aparecer como un \"falso signo localizador\". Es fundamental para la mirada conjugada horizontal junto con el III contralateral.",
    lesion:"Estrabismo convergente (endotropía) + diplopía horizontal"
  },
  {
    id:"nc7",
    num:"VII",
    n:"Nervio Facial (VII)",
    tipo:"Mixto",
    origen_real:"Motor: núcleo motor del facial (puente). Sensitivo: ganglio geniculado → núcleo del tracto solitario. Parasimpático: núcleos salival superior y lacrimal",
    origen_aparente:"Surco bulboprotuberancial (lateral al VI)",
    desc:"Es un nervio mixto con tres funciones principales: motora (músculos de la expresión facial y estapedio), sensitiva especial (gusto de los dos tercios anteriores de la lengua) y parasimpática (glándulas lacrimal, sublingual y submandibular). La distinción clínica clave es que la parálisis central respeta la frente (por inervación cortical bilateral), mientras que la periférica (parálisis de Bell) afecta toda la hemiface.",
    ramas:[
      "Ramas motoras terminales (temporal, cigomática, bucal, marginal mandibular, cervical): inervan los músculos de la expresión facial desde la frente hasta el cuello.",
      "Cuerda del tímpano: lleva el gusto de los 2/3 anteriores de la lengua y fibras parasimpáticas para las glándulas sublingual y submandibular.",
      "Nervio petroso mayor: fibras parasimpáticas para la glándula lacrimal.",
      "Rama del estapedio: inerva el músculo del estribo (protección ante ruidos intensos — su parálisis causa hiperacusia)."
    ],
    lesion:"Parálisis facial periférica (Bell) — toda la hemiface; parálisis central — respeta frente"
  },
  {
    id:"nc8",
    num:"VIII",
    n:"Nervio Vestibulococlear (VIII)",
    tipo:"Sensitivo",
    origen_real:"Rama coclear: ganglio espiral de Corti. Rama vestibular: ganglio de Scarpa (vestibular)",
    origen_aparente:"Surco bulboprotuberancial (lateral al VII) — ángulo pontocerebeloso",
    desc:"Es un nervio exclusivamente sensitivo con dos componentes: el coclear, que transmite la información auditiva desde el órgano de Corti, y el vestibular, que transmite información sobre el equilibrio desde el utrículo, sáculo y canales semicirculares. Discurre por el ángulo pontocerebeloso, donde el schwannoma vestibular es el tumor más frecuente de esa región.",
    ramas:[
      "Rama coclear: audición — órgano de Corti → núcleos cocleares → colículo inferior → cuerpo geniculado medial → corteza auditiva primaria (giro de Heschl).",
      "Rama vestibular: equilibrio — utrículo, sáculo y canales semicirculares → núcleos vestibulares → cerebelo y corteza."
    ],
    lesion:"Hipoacusia neurosensorial, acúfenos, vértigo (schwannoma vestibular)"
  },
  {
    id:"nc9",
    num:"IX",
    n:"Nervio Glosofaríngeo (IX)",
    tipo:"Mixto",
    origen_real:"Motor: núcleo ambiguo. Sensitivo: ganglios superior e inferior → núcleo del tracto solitario. Parasimpático: núcleo salival inferior",
    origen_aparente:"Surco retroolivar (bulbo raquídeo)",
    desc:"Es un nervio mixto que inerva el músculo estilofaríngeo (eleva faringe), recoge el gusto y la sensibilidad del tercio posterior de la lengua y la orofaringe, y estimula la secreción de la glándula parótida vía ganglio ótico. También lleva la aferencia de los barorreceptores del seno carotídeo y los quimiorreceptores del cuerpo carotídeo. Sale del cráneo por el foramen yugular junto con el X y el XI.",
    lesion:"Disfagia leve, pérdida de gusto del tercio posterior de la lengua, ausencia de reflejo nauseoso (aferencia)"
  },
  {
    id:"nc10",
    num:"X",
    n:"Nervio Vago (X)",
    tipo:"Mixto",
    origen_real:"Motor: núcleo ambiguo. Sensitivo: ganglios superior (yugular) e inferior (nodoso) → núcleo del tracto solitario. Parasimpático: núcleo motor dorsal del vago",
    origen_aparente:"Surco retroolivar (bulbo raquídeo, debajo del IX)",
    desc:"Es el nervio craneal con mayor distribución: se extiende desde el cuello hasta el abdomen y lleva el 75% de toda la actividad parasimpática del cuerpo. Su porción motora controla la faringe (deglución) y la laringe (fonación), la parasimpática regula corazón, bronquios y tubo digestivo hasta el ángulo esplénico, y la sensitiva recoge información de las vísceras toracoabdominales.",
    ramas:[
      "Nervio laríngeo superior: rama externa (motor del cricotiroideo) y rama interna (sensibilidad de la laringe supraglótica).",
      "Nervio laríngeo recurrente: motor de todos los músculos intrínsecos de la laringe excepto el cricotiroideo. El izquierdo rodea el arco aórtico (vulnerable en tumores mediastínicos y cirugía tiroidea).",
      "Ramas cardíacas: parasimpáticas — disminuyen la frecuencia cardíaca y la conducción AV.",
      "Ramas abdominales: inervan el tubo digestivo hasta el ángulo esplénico del colon (plexos de Auerbach y Meissner)."
    ],
    lesion:"Disfonía (lesión del laríngeo recurrente), disfagia, úvula desviada al lado sano"
  },
  {
    id:"nc11",
    num:"XI",
    n:"Nervio Accesorio (XI)",
    tipo:"Motor",
    origen_real:"Raíz craneal: núcleo ambiguo. Raíz espinal: asta anterior de la médula cervical C1-C5 (asciende por el foramen magno)",
    origen_aparente:"Surco retroolivar + raíz espinal (médula cervical C1-C5)",
    desc:"Es un nervio motor puro con una particularidad única: es el único par craneal con un componente de origen medular verdadero (raíz espinal de C1-C5 que asciende por el foramen magno). Su raíz espinal inerva el esternocleidomastoideo y el trapecio, mientras que su raíz craneal se une al nervio vago para inervar la laringe y faringe.",
    ramas:[
      "Raíz espinal: se origina en C1-C5, asciende por el foramen magno e inerva el esternocleidomastoideo (gira la cabeza al lado contrario) y el trapecio (eleva el hombro). Vulnerable en disección radical de cuello.",
      "Raíz craneal (bulbar): se une al nervio vago (X) para inervar los músculos de la laringe y faringe."
    ],
    lesion:"Hombro caído ipsilateral (trapecio), dificultad para girar la cabeza al lado contrario (ECM)"
  },
  {
    id:"nc12",
    num:"XII",
    n:"Nervio Hipogloso (XII)",
    tipo:"Motor",
    origen_real:"Núcleo del hipogloso (bulbo raquídeo, piso del IV ventrículo — triángulo del hipogloso)",
    origen_aparente:"Surco preolivar (bulbo raquídeo)",
    desc:"Es el nervio motor de la lengua: inerva todos los músculos intrínsecos (longitudinal, transverso, vertical) y la mayoría de los extrínsecos (geniogloso, hiogloso, estilogloso), excepto el palatogloso que es inervado por el X. Es fundamental para la articulación del lenguaje, la masticación y la deglución.",
    lesion:"Desviación de la lengua al lado afectado (NMI) con atrofia y fasciculaciones; al lado contrario en NMS"
  }
];

// ══════════════════════════════════════════════════════════════
// CONDUCTO INGUINAL
// ══════════════════════════════════════════════════════════════
var ING_PAREDES=[
{nombre:"PARED ANTERIOR",estructura:"Aponeurosis del Oblicuo Mayor",detalle:"Es la más superficial. La primera capa que cortás al operar.",color:"#f59e0b"},
{nombre:"PARED POSTERIOR ⚠️",estructura:"Tendón Conjunto + Fascia Transversalis",detalle:"La más importante quirúrgicamente. Aquí protruye la hernia DIRECTA. Reforzada por el ligamento de Hesselbach.",color:"#ef4444"},
{nombre:"PARED SUPERIOR (TECHO)",estructura:"Tendón Conjunto (Oblicuo menor + Transverso)",detalle:"Los músculos oblicuo menor y transverso se fusionan formando el tendón conjunto.",color:"#3b82f6"},
{nombre:"PARED INFERIOR (PISO)",estructura:"Ligamento Inguinal (de Poupart)",detalle:"Va desde la EIAS hasta la espina del pubis. Divide la región inguinal (arriba) de la crural (abajo).",color:"#10b981"}
];
var ING_SUPERFICIAL={formacion:"Formado por las 3 ramas de inserción del ligamento inguinal en el pubis",pilares:[{n:"Pilar Interno (medial)",d:"Rama que se inserta en la espina del pubis contralateral",c:"#60a5fa"},{n:"Pilar Externo (lateral)",d:"Rama que se inserta en la espina del pubis ipsilateral",c:"#3b82f6"},{n:"Pilar Posterior",d:"Rama posterior de inserción",c:"#1d4ed8"}],clinica:"Por acá sale el cordón espermático (♂) o el ligamento redondo (♀). Es por donde introducís el dedo en la maniobra de Andrews."};
var ING_PROFUNDO={formacion:"Formado por el Tendón Conjunto + Ligamento de Hesselbach",componentes:[{n:"Tendón Conjunto",d:"Unión del oblicuo menor y transverso. Cae como una cortina al hacer esfuerzo.",c:"#f87171"},{n:"Ligamento de Hesselbach",d:"Engrosamiento del peritoneo parietal en forma de U. Viene desde el ombligo.",c:"#ef4444"}],ubicacion:"Se ubica a 2 cm por debajo y 2 cm por dentro de la EIAS",clinica:"La hernia INDIRECTA entra por acá, por fuera de la arteria epigástrica. Si falla el ligamento de Hesselbach o el tendón conjunto → hernia indirecta. Maniobra de Landivar/Conley."};
var ING_CORDON={elementos:[{n:"Conducto Deferente",d:"Transporta espermatozoides desde el epidídimo",c:"#c084fc",ic:"━"},{n:"Arteria Espermática",d:"Rama de la aorta abdominal, irrigación testicular",c:"#ef4444",ic:"→"},{n:"Venas Espermáticas",d:"Drenaje venoso testicular",c:"#3b82f6",ic:"←"},{n:"Plexo Pampiniforme",d:"Red venosa que envuelve la arteria. Termorregulación testicular (1°C menos). Su dilatación = varicocele.",c:"#6366f1",ic:"≋"}],nota_mujer:"En la mujer: solo pasa el ligamento redondo (fijación del útero). Por eso la pared posterior es más resistente en mujeres → hernia directa rara en ♀."};
