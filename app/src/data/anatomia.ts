// ══════════════════════════════════════════════════════════════
// DATOS ANATOMÍA — CONDUCTO INGUINAL
// ══════════════════════════════════════════════════════════════
export const ING_PAREDES =[
{nombre:"PARED ANTERIOR",estructura:"Aponeurosis del Oblicuo Mayor",detalle:"Es la más superficial. La primera capa que cortás al operar.",color:"#f59e0b"},
{nombre:"PARED POSTERIOR ⚠️",estructura:"Tendón Conjunto + Fascia Transversalis",detalle:"La más importante quirúrgicamente. Aquí protruye la hernia DIRECTA. Reforzada por el ligamento de Hesselbach.",color:"#ef4444"},
{nombre:"PARED SUPERIOR (TECHO)",estructura:"Tendón Conjunto (Oblicuo menor + Transverso)",detalle:"Los músculos oblicuo menor y transverso se fusionan formando el tendón conjunto.",color:"#3b82f6"},
{nombre:"PARED INFERIOR (PISO)",estructura:"Ligamento Inguinal (de Poupart)",detalle:"Va desde la EIAS hasta la espina del pubis. Divide la región inguinal (arriba) de la crural (abajo).",color:"#10b981"}
];
export const ING_SUPERFICIAL ={formacion:"Formado por las 3 ramas de inserción del ligamento inguinal en el pubis",pilares:[{n:"Pilar Interno (medial)",d:"Rama que se inserta en la espina del pubis contralateral",c:"#60a5fa"},{n:"Pilar Externo (lateral)",d:"Rama que se inserta en la espina del pubis ipsilateral",c:"#3b82f6"},{n:"Pilar Posterior",d:"Rama posterior de inserción",c:"#1d4ed8"}],clinica:"Por acá sale el cordón espermático (♂) o el ligamento redondo (♀). Es por donde introducís el dedo en la maniobra de Andrews."};
export const ING_PROFUNDO ={formacion:"Formado por el Tendón Conjunto + Ligamento de Hesselbach",componentes:[{n:"Tendón Conjunto",d:"Unión del oblicuo menor y transverso. Cae como una cortina al hacer esfuerzo.",c:"#f87171"},{n:"Ligamento de Hesselbach",d:"Engrosamiento del peritoneo parietal en forma de U. Viene desde el ombligo.",c:"#ef4444"}],ubicacion:"Se ubica a 2 cm por debajo y 2 cm por dentro de la EIAS",clinica:"La hernia INDIRECTA entra por acá, por fuera de la arteria epigástrica. Si falla el ligamento de Hesselbach o el tendón conjunto → hernia indirecta. Maniobra de Landivar/Conley."};
export const ING_CORDON ={elementos:[{n:"Conducto Deferente",d:"Transporta espermatozoides desde el epidídimo",c:"#c084fc",ic:"━"},{n:"Arteria Espermática",d:"Rama de la aorta abdominal, irrigación testicular",c:"#ef4444",ic:"→"},{n:"Venas Espermáticas",d:"Drenaje venoso testicular",c:"#3b82f6",ic:"←"},{n:"Plexo Pampiniforme",d:"Red venosa que envuelve la arteria. Termorregulación testicular (1°C menos). Su dilatación = varicocele.",c:"#6366f1",ic:"≋"}],nota_mujer:"En la mujer: solo pasa el ligamento redondo (fijación del útero). Por eso la pared posterior es más resistente en mujeres → hernia directa rara en ♀."};

// ══════════════════════════════════════════════════════════════
// DATOS GENERALIDADES — NERVIOS CRANEALES (12 pares)
// ══════════════════════════════════════════════════════════════
export const NERVES =[
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
    id:"V", name:"Nervio Trigémino (V)", latin:"N. trigeminus", color:"#fb923c",
    tipos:["Mixto"],
    real:"Sensitivo: ganglio de Gasser → núcleos pontino, espinal y mesencefálico. Motor: núcleo motor del trigémino (puente)",
    origen_aparente:"Cara anterolateral del puente (emerge como dos raíces: una sensitiva gruesa y una motora delgada)",
    nivel:"Puente — el par más voluminoso",
    nivelShort:"Puente (cara ant-lat)",
    funcion:"El nervio trigémino es el par craneal más voluminoso y se encarga tanto de la sensibilidad de la cara como de la masticación. Su componente sensitivo recoge información táctil, dolorosa y térmica de toda la cara, la cavidad oral, las meninges y parte de la duramadre, distribuyéndose en tres ramas: oftálmica (V1), maxilar (V2) y mandibular (V3). El componente motor viaja exclusivamente con la rama mandibular (V3) e inerva los músculos masticadores (masetero, temporal, pterigoideos medial y lateral), así como el milohioideo y el vientre anterior del digástrico. El ganglio de Gasser (semilunar), ubicado en la fosa craneal media sobre la impresión trigeminal del peñasco, alberga los cuerpos celulares de las neuronas sensitivas.",
    ramas:[
      {n:"Rama oftálmica (V1)",d:"Puramente sensitiva. Recoge sensibilidad de la frente, párpado superior, dorso de la nariz, córnea y parte de la mucosa nasal. Es la aferente del reflejo corneal."},
      {n:"Rama maxilar (V2)",d:"Puramente sensitiva. Recoge sensibilidad de la mejilla, labio superior, dientes superiores, paladar, seno maxilar y parte de la mucosa nasal."},
      {n:"Rama mandibular (V3)",d:"Rama mixta (sensitiva + motora). Sensibilidad de mandíbula, dientes inferiores, labio inferior, mentón y dos tercios anteriores de la lengua (sensibilidad general, no gusto). Es la ÚNICA rama que lleva fibras motoras para los músculos masticadores."}
    ],
    lesion:"Neuralgia del trigémino, anestesia facial"
  },
  {
    id:"VI", name:"Nervio Abducens (VI)", latin:"N. abducens", color:"#f472b6",
    tipos:["Motor"],
    real:"Núcleo del abducens — puente, bajo el colículo facial",
    origen_aparente:"Surco bulbopontino (entre el borde inferior del puente y la pirámide bulbar)",
    nivel:"Puente inferior",
    nivelShort:"Puente inf. / Surco bulbopontino",
    funcion:"El nervio abducens inerva exclusivamente el músculo recto lateral del ojo, responsable de la abducción ocular (mover el ojo hacia afuera, alejándolo de la línea media). Es fundamental para la mirada conjugada horizontal, coordinándose con el nervio oculomotor (III) contralateral a través del fascículo longitudinal medial. Emerge del surco bulbopontino y recorre un largo trayecto por la base del cráneo, ascendiendo por el clivus y pasando sobre el ápex del peñasco antes de entrar al seno cavernoso y alcanzar la órbita. Este trayecto extenso lo hace especialmente vulnerable a la hipertensión intracraneal, por lo que su parálisis puede ser un falso signo localizador.",
    lesion:"Estrabismo convergente, diplopía horizontal"
  },
  {
    id:"VII", name:"Nervio Facial (VII)", latin:"N. facialis", color:"#e879f9",
    tipos:["Mixto"],
    real:"Motor: núcleo motor del facial (puente). Sensitivo: ganglio geniculado → núcleo del tracto solitario. Parasimpático: núcleos salival superior y lacrimal",
    origen_aparente:"Surco bulbopontino (lateral al VI, medial al VIII)",
    nivel:"Puente",
    nivelShort:"Puente — surco bulbopontino",
    funcion:"El nervio facial es uno de los pares craneales más complejos, con funciones motoras, sensitivas y parasimpáticas. Su componente motor inerva todos los músculos de la expresión facial (frontal, orbicular de los ojos, buccinador, orbicular de los labios, platisma, entre otros), así como el músculo del estribo, el estilohioideo y el vientre posterior del digástrico. A través de la cuerda del tímpano conduce el gusto de los dos tercios anteriores de la lengua y fibras parasimpáticas para las glándulas submandibular y sublingual. El nervio petroso mayor lleva fibras parasimpáticas a la glándula lacrimal y a las glándulas de la mucosa nasal y palatina, haciendo relevo en el ganglio pterigopalatino.",
    ramas:[
      {n:"Ramas motoras terminales (temporofaciales y cervicofaciales)",d:"Se dividen en cinco ramos clásicos: temporal, cigomático, bucal, marginal mandibular y cervical. Inervan todos los músculos de la expresión facial y el platisma."},
      {n:"Nervio cuerda del tímpano",d:"Rama mixta que lleva el gusto de los dos tercios anteriores de la lengua y fibras parasimpáticas para las glándulas submandibular y sublingual (relevo en ganglio submandibular)."},
      {n:"Nervio petroso mayor",d:"Rama parasimpática que inerva la glándula lacrimal y las glándulas de la mucosa nasal y palatina, haciendo relevo en el ganglio pterigopalatino."},
      {n:"Nervio del estribo (estapedio)",d:"Rama motora que inerva el músculo del estribo en el oído medio, modulando la transmisión del sonido (reflejo estapedial)."}
    ],
    lesion:"Parálisis facial (Bell)"
  },
  {
    id:"VIII", name:"Nervio Vestibulococlear (VIII)", latin:"N. vestibulocochlearis", color:"#38bdf8",
    tipos:["Sensitivo"],
    real:"Rama vestibular: ganglio de Scarpa. Rama coclear: ganglio espiral de Corti",
    origen_aparente:"Surco bulbopontino (lateral al VII) — ángulo pontocerebeloso",
    nivel:"Puente — ángulo pontocerebeloso",
    nivelShort:"Puente — ángulo pontocerebeloso",
    funcion:"El nervio vestibulococlear transmite la información auditiva y del equilibrio desde el oído interno hasta el tronco encefálico. Su rama coclear recoge los estímulos sonoros captados por las células ciliadas del órgano de Corti en la cóclea, llevándolos a los núcleos cocleares del puente y de allí a la corteza auditiva primaria (circunvolución de Heschl) en el lóbulo temporal. La rama vestibular transmite información sobre la posición y el movimiento de la cabeza desde el utrículo, sáculo y los tres canales semicirculares, proyectando a los núcleos vestibulares y al cerebelo. Ambas ramas viajan juntas por el conducto auditivo interno, acompañadas del nervio facial (VII).",
    ramas:[
      {n:"Rama coclear (audición)",d:"Transmite estímulos sonoros desde las células ciliadas del órgano de Corti en la cóclea. Cuerpos neuronales en el ganglio espiral de Corti. Proyecta a los núcleos cocleares del puente."},
      {n:"Rama vestibular (equilibrio)",d:"Transmite información de posición y movimiento de la cabeza desde el utrículo, sáculo y los tres canales semicirculares. Cuerpos neuronales en el ganglio de Scarpa. Proyecta a los núcleos vestibulares y al cerebelo."}
    ],
    lesion:"Hipoacusia, vértigo (schwannoma)"
  },
  {
    id:"IX", name:"Nervio Glosofaríngeo (IX)", latin:"N. glossopharyngeus", color:"#4ade80",
    tipos:["Mixto"],
    real:"Motor: núcleo ambiguo. Sensitivo: ganglios superior/inferior → núcleo del tracto solitario. Parasimpático: núcleo salival inferior",
    origen_aparente:"Surco retroolivar (posterolateral) de la médula oblongada, por encima del vago",
    nivel:"Médula oblongada",
    nivelShort:"Médula oblongada — retroolivar sup",
    funcion:"El nervio glosofaríngeo cumple funciones motoras, sensitivas y parasimpáticas que conectan la lengua y la faringe con el tronco encefálico. Su componente motor inerva el músculo estilofaríngeo, que eleva la faringe durante la deglución y la fonación. La porción sensitiva recoge el gusto y la sensibilidad general del tercio posterior de la lengua, la orofaringe, la amígdala palatina, la trompa de Eustaquio, y los barorreceptores del seno carotídeo y quimiorreceptores del cuerpo carotídeo (regulación de la presión arterial y niveles de oxígeno). Su componente parasimpático, a través del núcleo salival inferior, inerva la glándula parótida haciendo relevo en el ganglio ótico.",
    lesion:"Disfagia, pérdida gusto 1/3 post."
  },
  {
    id:"X", name:"Nervio Vago (X)", latin:"N. vagus · Neumogástrico", color:"#86efac",
    tipos:["Mixto"],
    real:"Motor: núcleo ambiguo. Sensitivo: ganglios superior (yugular) e inferior (nodoso) → núcleo del tracto solitario. Parasimpático: núcleo motor dorsal del vago",
    origen_aparente:"Surco retroolivar (posterolateral) de la médula oblongada, por debajo del IX",
    nivel:"Médula oblongada — mayor distribución",
    nivelShort:"Médula oblongada — retroolivar medio",
    funcion:"El nervio vago es el par craneal con mayor distribución, extendiéndose desde la base del cráneo hasta el abdomen y regulando funciones vitales de los sistemas respiratorio, cardiovascular y digestivo. Su componente parasimpático representa aproximadamente el 75% de toda la actividad parasimpática del cuerpo, controlando la frecuencia cardíaca (bradicardia), el tono bronquial (broncoconstricción) y la motilidad y secreción del tracto gastrointestinal desde el esófago hasta el ángulo esplénico del colon. El componente motor somático, desde el núcleo ambiguo, inerva los músculos de la faringe (deglución) y la laringe (fonación mediante las cuerdas vocales). Su porción sensitiva recoge información de las vísceras torácicas y abdominales, la mucosa de la laringe y faringe, y una pequeña zona del pabellón auricular (rama auricular o de Arnold).",
    ramas:[
      {n:"Nervio laríngeo superior",d:"Se divide en rama interna (sensitiva de mucosa laríngea supraglótica) y rama externa (motora del músculo cricotiroideo, tensor de las cuerdas vocales)."},
      {n:"Nervio laríngeo recurrente (inferior)",d:"Inerva todos los músculos intrínsecos de la laringe excepto el cricotiroideo. El izquierdo rodea el arco aórtico, el derecho la arteria subclavia. Su lesión causa disfonía."},
      {n:"Ramas cardíacas",d:"Fibras parasimpáticas que disminuyen la frecuencia cardíaca y la conducción en los nodos sinoauricular y auriculoventricular."},
      {n:"Ramas pulmonares y bronquiales",d:"Fibras parasimpáticas que producen broncoconstricción y aumento de las secreciones bronquiales."},
      {n:"Troncos vagales anterior y posterior (ramas abdominales)",d:"Fibras parasimpáticas que regulan la motilidad y secreción del tracto gastrointestinal desde el esófago hasta el ángulo esplénico del colon."},
      {n:"Rama auricular (de Arnold)",d:"Rama sensitiva que inerva una pequeña zona del pabellón auricular y del conducto auditivo externo. Responsable del reflejo tusígeno al estimular el oído."}
    ],
    lesion:"Disfonía, úvula al lado sano"
  },
  {
    id:"XI", name:"Nervio Accesorio (XI)", latin:"N. accessorius · Espinal", color:"#fde68a",
    tipos:["Motor"],
    real:"Raíz bulbar: núcleo ambiguo. Raíz espinal: asta anterior C1-C5 (asciende por foramen magno)",
    origen_aparente:"Raíz bulbar: surco retroolivar inferior de la médula oblongada. Raíz espinal: cara lateral de la médula espinal entre C1-C5",
    nivel:"Médula oblongada + médula espinal C1-C5",
    nivelShort:"M. oblongada + C1-C5 (ÚNICO espinal)",
    funcion:"El nervio accesorio es el único par craneal con un verdadero origen medular, ya que su raíz espinal se origina en las astas anteriores de los segmentos cervicales C1-C5 y asciende a través del foramen magno para unirse brevemente con la raíz bulbar. La raíz espinal inerva dos músculos importantes: el esternocleidomastoideo (que gira la cabeza hacia el lado contrario) y el trapecio (que eleva el hombro y estabiliza la escápula). La raíz bulbar, originada en el núcleo ambiguo, se separa rápidamente para unirse al nervio vago (X) y contribuye a la inervación motora de la faringe y la laringe. Sale del cráneo por el foramen yugular junto con los nervios IX y X.",
    ramas:[
      {n:"Raíz espinal (nervio accesorio espinal)",d:"Se origina en las astas anteriores de C1-C5, asciende por el canal raquídeo y entra al cráneo por el foramen magno. Inerva el esternocleidomastoideo (gira cabeza al lado contrario) y el trapecio (eleva el hombro)."},
      {n:"Raíz bulbar (accesorio del vago)",d:"Se origina en el núcleo ambiguo de la médula oblongada. Se une al nervio vago (X) y contribuye a la inervación motora de faringe y laringe. No tiene territorio independiente."}
    ],
    lesion:"Hombro caído, dif. girar cabeza"
  },
  {
    id:"XII", name:"Nervio Hipogloso (XII)", latin:"N. hypoglossus", color:"#fca5a5",
    tipos:["Motor"],
    real:"Núcleo del hipogloso — médula oblongada, piso del IV ventrículo (triángulo del hipogloso)",
    origen_aparente:"Surco preolivar (anterolateral) de la médula oblongada, entre la oliva bulbar y la pirámide",
    nivel:"Médula oblongada",
    nivelShort:"Médula oblongada — surco preolivar",
    funcion:"El nervio hipogloso es puramente motor y controla todos los movimientos de la lengua, tanto los intrínsecos (que cambian la forma: longitudinal, transverso y vertical) como la mayoría de los extrínsecos (geniogloso, hiogloso y estilogloso, que mueven la lengua en el espacio). La excepción es el músculo palatogloso, que está inervado por el nervio vago (X). Emerge de la médula oblongada por el surco preolivar, entre la oliva bulbar y la pirámide, y sale del cráneo a través del canal del hipogloso en el hueso occipital. Es fundamental para la articulación del lenguaje, la masticación y la primera fase de la deglución.",
    lesion:"Desviación lengua al lado afectado (NMI)"
  }
];

// ══════════════════════════════════════════════════════════════
// ESQUELETO ANATOMÍA — 4 secciones × 4 sistemas (F5)
// Sebas llenará el contenido. Por ahora solo shape.
// ══════════════════════════════════════════════════════════════

export const ANAT_SECCIONES =[
  {id:"cab_cuello",n:"Cabeza y Cuello",d:"Cráneo, cara, cuello, vías aéreas superiores",i:"🧠",c:"#a78bfa"},
  {id:"torax_abd",n:"Tórax y Abdomen",d:"Caja torácica, vísceras, pared abdominal",i:"🫀",c:"#f472b6"},
  {id:"miembros",n:"Miembros",d:"Superior + inferior — huesos, músculos y vasos",i:"🦴",c:"#60a5fa"},
  {id:"neuro_anat",n:"Sistema Nervioso",d:"SNC + SNP — anatomía estructural",i:"⚡",c:"#34d399"}
];

export const ANAT_SISTEMAS =[
  {id:"huesos",n:"Huesos",i:"🦴",c:"#fbbf24"},
  {id:"musculos",n:"Músculos",i:"💪",c:"#ef4444"},
  {id:"vasos",n:"Vasos",i:"🩸",c:"#f472b6"},
  {id:"nervios",n:"Nervios",i:"⚡",c:"#a78bfa"}
];

// Contenido por sección × sistema. Cada combo retorna array de items.
// Items tendrán shape: {id, n, descripcion, detalles, ...}
export const ANAT_DATA ={
  cab_cuello:{huesos:[],musculos:[],vasos:[],nervios:[]},
  torax_abd: {huesos:[],musculos:[],vasos:[],nervios:[]},
  miembros:  {huesos:[],musculos:[],vasos:[],nervios:[]},
  neuro_anat:{huesos:[],musculos:[],vasos:[],nervios:[]}
};
