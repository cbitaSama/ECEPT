// ══════════════════════════════════════════════════════════════
// DATOS GENERALIDADES — FACTORES DE COAGULACIÓN
// ══════════════════════════════════════════════════════════════
var COAG_FACTORES=[
  { num:'I',   nombre:'Fibrinógeno',                              alt:'',                                              vk:false },
  { num:'II',  nombre:'Protrombina',                             alt:'',                                              vk:true  },
  { num:'III', nombre:'Factor Tisular',                          alt:'Tromboplastina tisular',                         vk:false },
  { num:'IV',  nombre:'Calcio',                                  alt:'Ca²⁺',                                          vk:false },
  { num:'V',   nombre:'Proacelerina',                            alt:'Factor lábil',                                  vk:false },
  { num:'VII', nombre:'Proconvertina',                           alt:'Acelerador conversión protrombina sérica · Factor estable', vk:true },
  { num:'VIII',nombre:'Factor Antihemofílico A',                 alt:'',                                              vk:false },
  { num:'IX',  nombre:'Factor Antihemofílico B',                 alt:'Componente tromboplastínico del plasma',         vk:true  },
  { num:'X',   nombre:'Factor de Stuart',                        alt:'Factor de Stuart-Prower',                       vk:true  },
  { num:'XI',  nombre:'Antihemofílico C',                        alt:'PTA',                                           vk:false },
  { num:'XII', nombre:'Factor de Hageman',                       alt:'Factor contacto',                               vk:false },
  { num:'XIII',nombre:'Factor Estabilizador de Fibrina',         alt:'Fibrinasa',                                     vk:false },
];
var COAG_QUIZ=[
  {
    q:'¿Cuáles son los factores de coagulación dependientes de vitamina K?',
    opts:['I, V, VIII, XI','II, VII, IX, X','III, IV, XII, XIII','I, II, III, IV'],
    r:1,
    x:'Los factores vitamina K-dependientes son II (protrombina), VII (proconvertina), IX (antihemofílico B) y X (Stuart). La warfarina actúa bloqueando su síntesis.'
  },
  {
    q:'¿Qué factor inicia la vía extrínseca y cuál es su estímulo?',
    opts:['Factor XII — contacto con colágeno','Factor X — lesión vascular','Factor III (tisular) — tejido traumatizado','Factor VIII — activación por trombina'],
    r:2,
    x:'La vía extrínseca se inicia cuando un tejido traumatizado libera Factor III (Factor Tisular / Tromboplastina). Este activa al Factor VII, que con Ca²⁺ activa al Factor X.'
  },
  {
    q:'¿Qué mide el TP (Tiempo de Protrombina) y qué vía evalúa?',
    opts:['Vía intrínseca — XII, XI, IX, VIII','Vía común — X, V, II, I','Vía extrínseca — III, VII + vía común','Solo los factores vitamina K-dependientes'],
    r:2,
    x:'El TP evalúa la vía extrínseca (Factor III y VII) más la vía común (X, V, II, I). Se alarga en déficit de vitamina K, warfarina, insuficiencia hepática.'
  },
  {
    q:'En la vía intrínseca, ¿qué factor se activa primero por exposición al colágeno?',
    opts:['Factor XI','Factor IX','Factor VIII','Factor XII (Hageman)'],
    r:3,
    x:'La vía intrínseca comienza con el traumatismo de la sangre o exposición al colágeno, que activa el Factor XII (Factor de Hageman). XII → XI → IX → (IXa + VIIIa + Ca²⁺) → X.'
  },
  {
    q:'¿Cuál es el complejo que convierte protrombina (II) en trombina (IIa)?',
    opts:['Complejo tenasa (IXa+VIIIa+Ca²⁺)','Complejo protrombinasa (Xa+Va+Ca²⁺)','Complejo Factor III + VII','Complejo fibrina + XIII'],
    r:1,
    x:'El complejo Protrombinasa = Xa + Va + Ca²⁺ (Factor IV). Este complejo convierte la Protrombina (II) en Trombina (IIa). La trombina luego activa el Fibrinógeno (I) → Fibrina (Ia).'
  },
  {
    q:'¿De dónde derivan las plaquetas y cuál es su tiempo de vida normal?',
    opts:['De linfocitos B · 30 días','De megacariocitos por fragmentación · 10 días','De monocitos · 7 días','De eritrocitos · 120 días'],
    r:1,
    x:'Las plaquetas (trombocitos) derivan de los megacariocitos por fragmentación citoplasmática. Su concentración normal es 150.000-450.000/μL y su vida media es aproximadamente 10 días.'
  },
];
var COAG_PERLAS=[
"Factores vitamina K-dependientes: II, VII, IX y X (mnemotecnia: 1972)",
"Warfarina/acenocumarol bloquean los factores Vit K-dependientes",
"TP/INR mide vía extrínseca + común. KPTT mide vía intrínseca + común",
"Hemofilia A = déficit VIII, Hemofilia B = déficit IX",
"AAS inhibe COX-1 plaquetaria → ↓ TXA2 → efecto irreversible (10 días)",
"Plaquetas: 150-450k/μL, vida media 10 días, origen: megacariocito",
"Complejo Protrombinasa = Xa + Va + Ca²⁺ → convierte protrombina en trombina",
"Factor XIII estabiliza la fibrina (coágulo firme final)"
];
var COAG_CASCADA={
ext:[{paso:"Tejido traumatizado",nota:"libera →"},{paso:"Factor III (Tisular)",nota:"activa →"},{paso:"Factor VII → VIIa + Ca²⁺",nota:"→"},{paso:"Factor X ✓",nota:"→ Vía Común"}],
intr:[{paso:"Traumatismo / Colágeno",nota:"activa →"},{paso:"Factor XII (Hageman) → XIIa",nota:"→"},{paso:"Factor XI → XIa",nota:"→"},{paso:"Factor IX → IXa + VIIIa + Ca²⁺",nota:"→"},{paso:"Factor X ✓",nota:"→ Vía Común"}],
comun:[{paso:"Xa + Va + Ca²⁺ = Complejo Protrombinasa",nota:""},{paso:"Protrombina (II) → Trombina (IIa)",nota:""},{paso:"Fibrinógeno (I) → Fibrina (Ia)",nota:""},{paso:"Fibrina + Factor XIII → Coágulo estabilizado ✓",nota:""}]
};
