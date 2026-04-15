// ══════════════════════════════════════════════════════════════
// DATOS ANATOMÍA — CONDUCTO INGUINAL
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

// ══════════════════════════════════════════════════════════════
// DATOS GENERALIDADES — NERVIOS CRANEALES (12 pares)
// ══════════════════════════════════════════════════════════════
var NERVES=[
  {
    id:"I", name:"Nervio Olfatorio (I)", latin:"N. olfactorius", color:"#c084fc",
    tipos:["Sensitivo"],
    real:"Mucosa nasal — células bipolares del epitelio olfatorio",
    origen_aparente:"Bulbo olfatorio (cara inferior del lóbulo frontal)",
    nivel:"No pasa por tronco encefálico",
    nivelShort:"Nariz / Bulbo olfatorio",
    funcion:"El nervio olfatorio transmite la información del olfato desde la cavidad nasal hasta el cerebro. Las neuronas bipolares del epitelio olfatorio envían sus axones (filetes olfatorios) a través de la lámina cribosa del etmoides, haciendo sinapsis en el bulbo olfatorio con las células mitrales. Desde allí, la cintilla olfatoria conduce la información hacia la corteza piriforme y la amígdala, sin pasar por el tálamo — característica única entre los pares craneales. Es uno de los pocos nervios con capacidad de regeneración a lo largo de la vida.",
    lesion:"Anosmia"
  },
  {
    id:"II", name:"Nervio Óptico (II)", latin:"N. opticus", color:"#60a5fa",
    tipos:["Sensitivo"],
    real:"Retina — células ganglionares de la capa interna retiniana",
    origen_aparente:"Ángulo anterior del quiasma óptico",
    nivel:"Técnicamente es tracto del SNC (mielina oligodendroglial)",
    nivelShort:"Retina → Quiasma → Tálamo",
    funcion:"El nervio óptico conduce la información visual desde la retina hasta el cerebro. Las células ganglionares de la retina envían sus axones que se agrupan en el disco óptico (papila), atraviesan el canal óptico y convergen en el quiasma óptico, donde las fibras nasales se decusan mientras las temporales continúan ipsilateralmente. Tras el quiasma, los tractos ópticos se dirigen al cuerpo geniculado lateral del tálamo y desde allí las radiaciones ópticas alcanzan la corteza visual primaria (V1) en el lóbulo occipital. Técnicamente no es un nervio periférico sino una extensión del sistema nervioso central, ya que está mielinizado por oligodendrocitos y rodeado por meninges.",
    lesion:"Ceguera / hemianopsia"
  },
  {
    id:"III", name:"Nervio Oculomotor (III)", latin:"N. oculomotorius", color:"#34d399",
    tipos:["Motor"],
    real:"Núcleo motor (mesencéfalo, colículo superior) + núcleo de Edinger-Westphal (parasimpático)",
    origen_aparente:"Fosa interpeduncular del mesencéfalo",
    nivel:"Mesencéfalo — colículo superior",
    nivelShort:"Mesencéfalo sup.",
    funcion:"El nervio oculomotor es el principal motor de los movimientos oculares, controlando cuatro de los seis músculos extrínsecos del ojo: recto superior, recto inferior, recto medial y oblicuo inferior. Además inerva el músculo elevador del párpado superior, responsable de mantener el ojo abierto. Su componente parasimpático, originado en el núcleo de Edinger-Westphal, viaja hasta el ganglio ciliar y desde allí inerva el músculo ciliar (acomodación del cristalino) y el esfínter pupilar (miosis). Sale del mesencéfalo por la fosa interpeduncular, pasa entre las arterias cerebral posterior y cerebelosa superior, y atraviesa el seno cavernoso antes de entrar a la órbita por la fisura orbitaria superior.",
    lesion:"Ptosis + midriasis + ojo abajo-afuera"
  },
  {
    id:"IV", name:"Nervio Troclear (IV)", latin:"N. trochlearis · Patético", color:"#fbbf24",
    tipos:["Motor"],
    real:"Núcleo del troclear (mesencéfalo, colículo inferior)",
    origen_aparente:"Cara DORSAL del mesencéfalo (ÚNICO par que emerge por la cara posterior)",
    nivel:"Mesencéfalo — colículo inferior",
    nivelShort:"Mesencéfalo inf. (DORSAL)",
    funcion:"El nervio troclear inerva exclusivamente el músculo oblicuo superior del ojo, cuya función principal es la depresión del globo ocular cuando está en aducción (mirar hacia abajo y adentro), como al leer o bajar escaleras. También contribuye a la intorsión del ojo. Es el par craneal más singular por varias razones: es el único que emerge por la cara dorsal del tronco encefálico, el único que se decusa completamente antes de emerger, posee el trayecto intracraneal más largo (7-8 cm) y es el más delgado de todos los pares craneales.",
    lesion:"Diplopía vertical, cabeza inclinada"
  },
  {
    id:"V", name:"Trigémino", latin:"N. trigeminus", color:"#fb923c",
    tipos:["Motor","Sensitivo"],
    real:"Sensitivo: ganglio de Gasser → núcleos pontino, espinal y mesencefálico. Motor: núcleo motor del trigémino (puente)",
    aparente:"Cara anterolateral del puente (el más voluminoso)",
    nivel:"Puente — el par más voluminoso",
    nivelShort:"Puente (cara ant-lat)",
    funcion:"V1 Oftálmica: frente, párpado sup., ojo, dorso nasal. V2 Maxilar: mejilla, labio sup., dientes sup., paladar. V3 Mandibular: mandíbula, dientes inf., labio inf., lengua (general). Motor (solo V3): masticadores (masetero, temporal, pterigoideos).",
    pearl:"Neuralgia del trigémino: dolor lancinante en zona gatillo V2-V3. Causa principal: compresión vascular. Reflejos: corneal (V1 aferente + VII eferente), maseterino (monosináptico pontino). Herpes zóster oftálmico = V1 → signo de Hutchinson.",
    mnemo:"\"V = cinCo dedos de la cara\" — V1 (arriba), V2 (medio), V3 (abajo). Solo V3 tiene motor.",
    lesion:"Neuralgia del trigémino, anestesia facial"
  },
  {
    id:"VI", name:"Abducens", latin:"N. abducens", color:"#f472b6",
    tipos:["Motor somático"],
    real:"Núcleo del abducens — puente, bajo el colículo facial",
    aparente:"Surco bulbopontino (entre puente y médula)",
    nivel:"Puente inferior",
    nivelShort:"Puente inf. / Surco bulbopontino",
    funcion:"Inerva exclusivamente el recto lateral → abducción del ojo (mirada lateral). Fundamental para la mirada conjugada horizontal con el III contralateral.",
    pearl:"Parálisis VI: estrabismo convergente + diplopía horizontal al mirar al lado afectado. Trayecto largo por base del cráneo → \"falso signo localizador\" en HIC. Núcleo del VI contiene neuronas del FLM que coordinan mirada horizontal conjugada.",
    mnemo:"\"VI ABDuce = ABDuce el ojo hacia AFUERA\" (ABD = alejarse del cuerpo).",
    lesion:"Estrabismo convergente, diplopía horizontal"
  },
  {
    id:"VII", name:"Facial", latin:"N. facialis", color:"#e879f9",
    tipos:["Motor","Sensitivo","Parasimpático"],
    real:"Motor: núcleo motor del facial (puente). Sensitivo: ganglio geniculado → núcleo del tracto solitario. Parasimpático: núcleos salival superior y lacrimal",
    aparente:"Surco bulbopontino (lateral al VI, medial al VIII)",
    nivel:"Puente",
    nivelShort:"Puente — surco bulbopontino",
    funcion:"Motor: músculos de expresión facial + estapedio + digástrico posterior + estilohioideo. Sensitivo especial: gusto 2/3 anteriores de la lengua (cuerda del tímpano). Parasimpático: glándula lacrimal, sublingual, submandibular.",
    pearl:"CLAVE: Central RESPETA frente (inervación bilateral). Periférica (Bell, Ramsay-Hunt) afecta TODA la hemiface. Fenómeno de Bell: al cerrar el ojo, globo se desvía arriba y afuera. Ramsay-Hunt: parálisis facial + vesículas en pabellón auricular (VZV ganglio geniculado).",
    mnemo:"\"VII = siete = cara = muchas expresiones.\" Central respeta frente, periférica no.",
    lesion:"Parálisis facial (Bell)"
  },
  {
    id:"VIII", name:"Vestibulococlear", latin:"N. vestibulocochlearis", color:"#38bdf8",
    tipos:["Sensitivo especial"],
    real:"Rama vestibular: ganglio de Scarpa. Rama coclear: ganglio espiral de Corti",
    aparente:"Surco bulbopontino (lateral al VII) — ángulo pontocerebeloso",
    nivel:"Puente — ángulo pontocerebeloso",
    nivelShort:"Puente — ángulo pontocerebeloso",
    funcion:"Coclear: audición — células ciliadas del órgano de Corti → núcleos cocleares → colículo inferior → cuerpo geniculado medial → corteza auditiva (Heschl, T1). Vestibular: equilibrio — utrículo, sáculo, canales semicirculares → núcleos vestibulares → cerebelo.",
    pearl:"Schwannoma del VIII: hipoacusia neurosensorial unilateral + acúfenos + vértigo → comprime VII. Ménière: tríada hipoacusia fluctuante + acúfenos + vértigo episódico. Weber y Rinne: conductiva (Weber al afectado) vs neurosensorial (Weber al sano).",
    mnemo:"\"VIII = VESTIBULOcoclear = VESTÍBULO = equilibrio. COCLEAR = caracol = audición.\"",
    lesion:"Hipoacusia, vértigo (schwannoma)"
  },
  {
    id:"IX", name:"Glosofaríngeo", latin:"N. glossopharyngeus", color:"#4ade80",
    tipos:["Motor","Sensitivo","Parasimpático"],
    real:"Motor: núcleo ambiguo. Sensitivo: ganglios superior/inferior → núcleo del tracto solitario. Parasimpático: núcleo salival inferior",
    aparente:"Surco retroolivar superior (médula oblongada)",
    nivel:"Médula oblongada",
    nivelShort:"Médula oblongada — retroolivar sup",
    funcion:"Motor: estilofaríngeo (eleva faringe). Sensitivo: orofaringe, amígdala, 1/3 posterior lengua (gusto y sensibilidad general), oído medio, seno carotídeo (barorreceptores), cuerpo carotídeo (quimiorreceptores). Parasimpático: parótida (vía ganglio ótico).",
    pearl:"Reflejo nauseoso: IX aferente + X eferente. Reflejo del seno carotídeo: barorreceptores IX → X → bradicardia. Neuralgia del IX: dolor en orofaringe y oído al tragar. Sale por foramen yugular con X y XI → síndrome de Vernet (IX+X+XI).",
    mnemo:"\"IX GLOSOfaríngeo = GLOSa = lengua + FARINge.\" Gusto del 1/3 posterior.",
    lesion:"Disfagia, pérdida gusto 1/3 post."
  },
  {
    id:"X", name:"Vago", latin:"N. vagus · Neumogástrico", color:"#86efac",
    tipos:["Motor","Sensitivo","Parasimpático"],
    real:"Motor: núcleo ambiguo. Sensitivo: ganglios superior (yugular) e inferior (nodoso) → núcleo del tracto solitario. Parasimpático: núcleo motor dorsal del vago",
    aparente:"Surco retroolivar medio (por debajo del IX)",
    nivel:"Médula oblongada — mayor distribución",
    nivelShort:"Médula oblongada — retroolivar medio",
    funcion:"Parasimpático: corazón (↓FC), bronquios (broncoconstricción), TGI hasta ángulo esplénico. Motor: faringe (deglución), laringe (fonación — cuerdas vocales). Sensitivo: vísceras toracoabdominales, mucosa laringe/faringe, pabellón auricular (rama de Arnold).",
    pearl:"Lesión X unilateral: disfonía + disfagia + úvula al lado SANO. N. laríngeo recurrente izquierdo rodea arco aórtico → compresión por aneurisma/tumor mediastínico = disfonía. El X = 75% de toda la actividad parasimpática del cuerpo.",
    mnemo:"\"X = Vago = VAGA por todo el cuerpo\" — desde cuello hasta abdomen.",
    lesion:"Disfonía, úvula al lado sano"
  },
  {
    id:"XI", name:"Accesorio", latin:"N. accessorius · Espinal", color:"#fde68a",
    tipos:["Motor somático"],
    real:"Raíz bulbar: núcleo ambiguo. Raíz espinal: asta anterior C1-C5 (asciende por foramen magno)",
    aparente:"Surco retroolivar inferior + raíces espinales C1-C5",
    nivel:"Médula oblongada + médula espinal C1-C5",
    nivelShort:"M. oblongada + C1-C5 (ÚNICO espinal)",
    funcion:"Raíz espinal: ECM (gira cabeza al lado CONTRARIO) + trapecio (eleva hombro ipsilateral). Raíz bulbar: se une al X para inervar laringe y faringe.",
    pearl:"Lesión XI: dificultad girar cabeza al lado contrario (ECM) + hombro caído ipsilateral (trapecio). VULNERABLE en disección radical de cuello → hombro caído iatrogénico. ÚNICO par craneal con origen medular verdadero.",
    mnemo:"\"XI Accesorio del X\" — raíz bulbar se añade al vago. XI Espinal = ECM + Trapecio.",
    lesion:"Hombro caído, dif. girar cabeza"
  },
  {
    id:"XII", name:"Hipogloso", latin:"N. hypoglossus", color:"#fca5a5",
    tipos:["Motor somático"],
    real:"Núcleo del hipogloso — médula oblongada, piso del IV ventrículo (triángulo del hipogloso)",
    aparente:"Surco preolivar (entre oliva bulbar y pirámide)",
    nivel:"Médula oblongada",
    nivelShort:"Médula oblongada — surco preolivar",
    funcion:"Todos los músculos intrínsecos de la lengua (longitudinal, transverso, vertical) y extrínsecos (geniogloso, hiogloso, estilogloso). Excepción: palatogloso (inervado por X). Fundamental para articulación, masticación y deglución.",
    pearl:"NMI: lengua desvía al lado AFECTADO + atrofia + fasciculaciones. NMS: lengua al lado CONTRARIO a la lesión. ELA afecta ambas → fasciculaciones + espasticidad. Sale entre oliva y pirámide.",
    mnemo:"\"XII HIPOgloso = debajo de la lengua.\" Sale entre oliva y pirámide.",
    lesion:"Desviación lengua al lado afectado (NMI)"
  }
];
