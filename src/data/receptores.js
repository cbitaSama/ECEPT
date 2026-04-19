// ══════════════════════════════════════════════════════════════
// RECEPTORES CELULARES — 10 FAMILIAS · 34 SUBTIPOS
// ══════════════════════════════════════════════════════════════
// Replaces legacy FISIO_RECEPTORS / FISIO_QUIZ / FISIO_PERLAS /
// FISIO_COMPARISON / FISIO_PROTEINAS_G (the 5 adrenergic receptors
// are preserved verbatim inside ADR + RECEPTOR_QUIZZES.adr +
// RECEPTOR_PEARLS.adr below).
// Object shape: {id,symbol,letter,name,color,colorBg,protein,
// messenger,net,pathway(string[]),effects({t,d,x}),clinical,drugs({n,r,u,c})}

var ADR=[
  {id:'a1',symbol:'α₁',letter:'α',name:'Alfa-1',color:'#f472b6',colorBg:'rgba(244,114,182,.08)',
    protein:'Gq',messenger:['↑ IP₃','↑ DAG','↑ Ca²⁺'],net:'Excitatorio / Contracción',
    pathway:['NE / Epi','Receptor α₁','Gq','↑ PLC','↑ IP₃ + DAG','↑ Ca²⁺ intracelular','CONTRACCIÓN'],
    effects:[
      {t:'Músculo liso vascular',d:'↑',x:'Vasoconstricción → ↑ RVP → ↑ PA'},
      {t:'Músculo liso GU',d:'↑',x:'Contracción próstata/vejiga → relevante en HBP'},
      {t:'Músculo liso intestinal',d:'↓',x:'Relajamiento (inhibe peristaltismo)'},
      {t:'Corazón',d:'↑',x:'↑ Inotropismo y excitabilidad'},
      {t:'Hígado',d:'↑',x:'Glucogenólisis y gluconeogénesis'}
    ],
    clinical:'Bloqueadores α₁ (prazosina, tamsulosina): HTA y HBP. Prazosina = anti-HTA. Tamsulosina = selectiva próstata (HBP), menor efecto vascular.',
    drugs:[
      {n:'Prazosina',r:'Bloqueador α₁',u:'HTA',c:'#f472b6'},
      {n:'Tamsulosina',r:'Bloqueador α₁ selectivo',u:'HBP',c:'#fb923c'},
      {n:'Fenilefrina',r:'Agonista α₁',u:'Descongestivo / vasopresor',c:'#ef4444'}
    ]},
  {id:'a2',symbol:'α₂',letter:'α',name:'Alfa-2',color:'#fb923c',colorBg:'rgba(251,146,60,.08)',
    protein:'Gi',messenger:['↓ AMPc'],net:'Inhibitorio / Autorreceptor',
    pathway:['NE / Epi','Receptor α₂','Gi','↓ Adenilato ciclasa','↓ AMPc','INHIBICIÓN'],
    effects:[
      {t:'Nervio presináptico',d:'↓',x:'Autorreceptor: ↓ liberación de NE (feedback negativo)'},
      {t:'Células β pancreáticas',d:'↓',x:'↓ Secreción de insulina'},
      {t:'Plaquetas',d:'↑',x:'Agregación plaquetaria'},
      {t:'SNC (locus coeruleus)',d:'↓',x:'↓ Tono simpático central → efecto antihipertensivo'}
    ],
    clinical:'Agonistas α₂ (clonidina, metildopa): ↓ tono simpático → HTA. Metildopa = ELECCIÓN en HTA del embarazo.',
    drugs:[
      {n:'Clonidina',r:'Agonista α₂',u:'HTA / abstinencia opioides / TDAH',c:'#fb923c'},
      {n:'Metildopa',r:'Agonista α₂',u:'HTA en embarazo (1ª elección)',c:'#f472b6'}
    ]},
  {id:'b1',symbol:'β₁',letter:'β',name:'Beta-1',color:'#60a5fa',colorBg:'rgba(96,165,250,.08)',
    protein:'Gs',messenger:['↑ AMPc','↑ Ca²⁺'],net:'Excitatorio cardíaco',
    pathway:['NE / Epi','Receptor β₁','Gs','↑ Adenilato ciclasa','↑ AMPc → PKA','↑ Ca²⁺ → CONTRACCIÓN'],
    effects:[
      {t:'Nódulo SA',d:'↑',x:'↑ Cronotropismo → ↑ FC'},
      {t:'Miocardio',d:'↑',x:'↑ Inotropismo → ↑ fuerza contráctil'},
      {t:'Nódulo AV',d:'↑',x:'↑ Dromotropismo → ↑ conducción'},
      {t:'Riñón (yuxtaglomerular)',d:'↑',x:'↑ Secreción de renina → ↑ SRAA → ↑ PA'}
    ],
    clinical:'β₁-bloqueadores (metoprolol, atenolol): ↓ FC, ↓ demanda O₂. IAM, ICC, arritmias. Metoprolol/atenolol = cardioselectivos. Carvedilol = no selectivo (β₁+β₂+α₁).',
    drugs:[
      {n:'Metoprolol',r:'β₁-bloqueador cardioselectivo',u:'IAM / ICC / Arritmias / HTA',c:'#60a5fa'},
      {n:'Atenolol',r:'β₁-bloqueador cardioselectivo',u:'HTA / Angina',c:'#38bdf8'},
      {n:'Carvedilol',r:'β₁+β₂+α₁ bloqueador',u:'ICC / Post-IAM',c:'#818cf8'},
      {n:'Dobutamina',r:'Agonista β₁',u:'Shock cardiogénico / IC aguda',c:'#34d399'}
    ]},
  {id:'b2',symbol:'β₂',letter:'β',name:'Beta-2',color:'#34d399',colorBg:'rgba(52,211,153,.08)',
    protein:'Gs',messenger:['↑ AMPc','Relajación'],net:'Broncodilatador / Tocolítico',
    pathway:['Epi','Receptor β₂','Gs','↑ AMPc → PKA','Fosforila miosina kinasa','RELAJACIÓN músculo liso'],
    effects:[
      {t:'Músculo liso bronquial',d:'↓',x:'Broncodilatación → asma/EPOC'},
      {t:'Músculo liso uterino',d:'↓',x:'Relajación → efecto tocolítico'},
      {t:'Músculo liso vascular',d:'↓',x:'Vasodilatación'},
      {t:'Hígado',d:'↑',x:'Glucogenólisis → ↑ glucemia'},
      {t:'Músculo esquelético',d:'↑',x:'↑ captación K⁺ (hipokalemia)'}
    ],
    clinical:'Agonistas β₂ (salbutamol): SABA — asma/EPOC. Formoterol/Salmeterol = LABA. Adversos: hipokalemia, temblor.',
    drugs:[
      {n:'Salbutamol',r:'Agonista β₂ (SABA)',u:'Asma aguda / EPOC / Tocolítico',c:'#34d399'},
      {n:'Terbutalina',r:'Agonista β₂',u:'Asma / Tocolítico',c:'#10b981'},
      {n:'Formoterol',r:'Agonista β₂ (LABA)',u:'Asma crónica / EPOC',c:'#6ee7b7'}
    ]},
  {id:'b3',symbol:'β₃',letter:'β',name:'Beta-3',color:'#a78bfa',colorBg:'rgba(167,139,250,.08)',
    protein:'Gs',messenger:['↑ AMPc'],net:'Lipólisis / Vejiga',
    pathway:['NE / Epi','Receptor β₃','Gs','↑ AMPc → PKA','Lipasa hormonosensible','LIPÓLISIS'],
    effects:[
      {t:'Tejido adiposo',d:'↑',x:'Lipólisis → liberación AGL'},
      {t:'Detrusor vesical',d:'↓',x:'Relajación → ↑ capacidad vesical'}
    ],
    clinical:'β₃ agonistas (mirabegrón): vejiga hiperactiva. Ventaja: menos boca seca vs antimuscarínicos.',
    drugs:[
      {n:'Mirabegrón',r:'Agonista β₃ selectivo',u:'Vejiga hiperactiva',c:'#a78bfa'}
    ]}
];

var MUSC=[
  {id:'m1',symbol:'M₁',letter:'M',name:'Muscarínico 1',color:'#34d399',colorBg:'rgba(52,211,153,.08)',
    protein:'Gq',messenger:['↑ IP₃','↑ Ca²⁺'],net:'Excitación SNC / Gástrico',
    pathway:['ACh','Receptor M₁','Gq','↑ PLC','↑ IP₃ + DAG','↑ Ca²⁺','EXCITACIÓN'],
    effects:[
      {t:'SNC (corteza, hipocampo)',d:'↑',x:'Cognición, memoria, aprendizaje'},
      {t:'Ganglios autonómicos',d:'↑',x:'EPSP lento ganglionar'},
      {t:'Células parietales gástricas',d:'↑',x:'↑ Secreción HCl'}
    ],
    clinical:'Déficit M₁ = Alzheimer. Donepezilo ↑ ACh endógena estimulando M₁. Pirenzepina (antagonista) era usada para úlcera (hoy IBP).',
    drugs:[
      {n:'Donepezilo',r:'Inhibidor AChE',u:'Alzheimer (↑ ACh)',c:'#10b981'},
      {n:'Pirenzepina',r:'Antagonista M₁',u:'Úlcera péptica (obsoleto)',c:'#34d399'}
    ]},
  {id:'m2',symbol:'M₂',letter:'M',name:'Muscarínico 2',color:'#2dd4bf',colorBg:'rgba(45,212,191,.08)',
    protein:'Gi',messenger:['↓ AMPc','↑ K⁺'],net:'Inhibición cardíaca',
    pathway:['ACh','Receptor M₂','Gi','↓ AMPc','↑ K⁺ (hiperpolariza)','BRADICARDIA'],
    effects:[
      {t:'Nódulo SA',d:'↓',x:'↓ Cronotropismo → BRADICARDIA'},
      {t:'Nódulo AV',d:'↓',x:'↓ Dromotropismo → enlentece conducción'},
      {t:'Aurícula',d:'↓',x:'↓ Inotropismo auricular'}
    ],
    clinical:'Receptor del vago cardíaco. Bloqueo (atropina) → taquicardia. Tto bradicardias sinusales, bloqueos AV.',
    drugs:[
      {n:'Atropina',r:'Antagonista muscarínico',u:'Bradicardia / Bloqueo AV / Organofosforados',c:'#2dd4bf'}
    ]},
  {id:'m3',symbol:'M₃',letter:'M',name:'Muscarínico 3',color:'#14b8a6',colorBg:'rgba(20,184,166,.08)',
    protein:'Gq',messenger:['↑ IP₃','↑ Ca²⁺'],net:'Secreción / Contracción lisa',
    pathway:['ACh','Receptor M₃','Gq','↑ PLC','↑ IP₃/DAG','↑ Ca²⁺','SECRECIÓN/CONTRACCIÓN'],
    effects:[
      {t:'Músculo liso bronquial',d:'↑',x:'Broncoconstricción'},
      {t:'Músculo liso GI',d:'↑',x:'↑ Peristaltismo, ↑ secreciones'},
      {t:'Detrusor vesical',d:'↑',x:'Contracción (micción)'},
      {t:'Glándulas exocrinas',d:'↑',x:'↑ Salivación, sudor, lágrimas'},
      {t:'Iris esfínter',d:'↑',x:'Miosis'},
      {t:'Músculo ciliar',d:'↑',x:'Acomodación cercana'}
    ],
    clinical:'Antagonistas M₃: tiotropio (EPOC), oxibutinina (vejiga). Adversos clásicos: boca seca, midriasis, retención urinaria, constipación.',
    drugs:[
      {n:'Tiotropio',r:'Antagonista M₃ (LAMA)',u:'EPOC',c:'#14b8a6'},
      {n:'Ipratropio',r:'Antagonista muscarínico (SAMA)',u:'EPOC / Asma aguda',c:'#0d9488'},
      {n:'Oxibutinina',r:'Antagonista M₃',u:'Vejiga hiperactiva',c:'#0f766e'},
      {n:'Pilocarpina',r:'Agonista muscarínico',u:'Glaucoma / Síndrome seco',c:'#2dd4bf'}
    ]},
  {id:'m4',symbol:'M₄',letter:'M',name:'Muscarínico 4',color:'#0d9488',colorBg:'rgba(13,148,136,.08)',
    protein:'Gi',messenger:['↓ AMPc'],net:'Modulación motora SNC',
    pathway:['ACh','Receptor M₄','Gi','↓ AMPc','Modulación dopaminérgica'],
    effects:[
      {t:'Estriado',d:'↓',x:'Balance colinérgico/dopaminérgico motor'},
      {t:'Corteza prefrontal',d:'↓',x:'Cognición, función ejecutiva'}
    ],
    clinical:'Diana emergente en esquizofrenia. Xanomelina-trospio (Cobenfy, FDA 2024): agonista M₁/M₄ → antipsicótico sin bloqueo D₂ (sin SEP).',
    drugs:[
      {n:'Xanomelina-trospio',r:'Agonista M₁/M₄',u:'Esquizofrenia (FDA 2024)',c:'#0d9488'}
    ]},
  {id:'m5',symbol:'M₅',letter:'M',name:'Muscarínico 5',color:'#047857',colorBg:'rgba(4,120,87,.08)',
    protein:'Gq',messenger:['↑ IP₃','↑ Ca²⁺'],net:'Vasodilatación cerebral',
    pathway:['ACh','Receptor M₅','Gq','↑ IP₃','Vasodilatación SNC'],
    effects:[
      {t:'Vasos cerebrales',d:'↓',x:'Vasodilatación cerebral'},
      {t:'Mesencéfalo dopaminérgico',d:'↑',x:'↑ Dopamina (recompensa)'}
    ],
    clinical:'Diana emergente en adicción. Menos estudiado clínicamente.',
    drugs:[{n:'Sin fármacos específicos',r:'Diana en investigación',u:'Adicción',c:'#047857'}]}
];

var NIC=[
  {id:'nm',symbol:'Nm',letter:'N',name:'Nicotínico muscular',color:'#a78bfa',colorBg:'rgba(167,139,250,.08)',
    protein:'Canal iónico',messenger:['↑ Na⁺ → despolarización'],net:'Contracción muscular',
    pathway:['ACh (motoneurona)','Receptor Nm (placa)','Canal iónico abierto','↑ Na⁺','DESPOLARIZACIÓN','CONTRACCIÓN'],
    effects:[
      {t:'Placa neuromuscular',d:'↑',x:'Contracción del músculo esquelético'}
    ],
    clinical:'Bloqueantes Nm = relajantes musculares. Despolarizantes (succinilcolina) vs no-despolarizantes (rocuronio). Miastenia gravis = Ac anti-Nm.',
    drugs:[
      {n:'Succinilcolina',r:'Bloqueante Nm despolarizante',u:'Intubación rápida',c:'#a78bfa'},
      {n:'Rocuronio',r:'No despolarizante',u:'Relajación en cirugía',c:'#8b5cf6'},
      {n:'Neostigmina',r:'Inhibidor AChE',u:'Miastenia / Reverso BNM',c:'#7c3aed'}
    ]},
  {id:'nn',symbol:'Nn',letter:'N',name:'Nicotínico neuronal',color:'#c084fc',colorBg:'rgba(192,132,252,.08)',
    protein:'Canal iónico',messenger:['↑ Na⁺/Ca²⁺'],net:'Transmisión ganglionar / SNC',
    pathway:['ACh preganglionar','Receptor Nn','Canal iónico','↑ Na⁺/Ca²⁺','EPSP rápido'],
    effects:[
      {t:'Ganglios autonómicos',d:'↑',x:'Transmisión sináptica (EPSP rápido)'},
      {t:'Médula suprarrenal',d:'↑',x:'Liberación de adrenalina'},
      {t:'SNC (VTA)',d:'↑',x:'Refuerzo / adicción (nicotina)'}
    ],
    clinical:'Vareniclina (agonista parcial Nn α4β2) = cesación tabáquica.',
    drugs:[
      {n:'Vareniclina',r:'Agonista parcial Nn α4β2',u:'Cesación tabáquica',c:'#c084fc'},
      {n:'Nicotina (parches)',r:'Agonista Nn',u:'TRN',c:'#a78bfa'}
    ]}
];

var DOP=[
  {id:'d1',symbol:'D₁',letter:'D',name:'Dopamina D₁ (D1-like: D₁, D₅)',color:'#fbbf24',colorBg:'rgba(251,191,36,.08)',
    protein:'Gs',messenger:['↑ AMPc'],net:'Excitatorio postsináptico',
    pathway:['Dopamina','Receptor D₁','Gs','↑ Adenilato ciclasa','↑ AMPc → PKA','EXCITACIÓN'],
    effects:[
      {t:'Estriado (vía directa)',d:'↑',x:'Facilita movimiento voluntario'},
      {t:'Corteza prefrontal',d:'↑',x:'Memoria de trabajo, cognición'},
      {t:'Vasos renales/mesentéricos',d:'↓',x:'Vasodilatación (dopamina dosis bajas)'},
      {t:'Túbulo renal',d:'↑',x:'Natriuresis'}
    ],
    clinical:'Dopamina dosis bajas (1-3 μg/kg/min) activa D₁ → vasodilatación renal. Dosis β₁ (3-10) → inotrópico. Dosis α₁ (>10) → vasoconstrictor.',
    drugs:[
      {n:'Dopamina (dosis baja)',r:'Agonista D₁',u:'Vasodilatación renal',c:'#fbbf24'},
      {n:'Fenoldopam',r:'Agonista D₁ selectivo',u:'Crisis hipertensiva',c:'#f59e0b'}
    ]},
  {id:'d2',symbol:'D₂',letter:'D',name:'Dopamina D₂ (D2-like: D₂, D₃, D₄)',color:'#f59e0b',colorBg:'rgba(245,158,11,.08)',
    protein:'Gi',messenger:['↓ AMPc','↑ K⁺','↓ Ca²⁺'],net:'Inhibitorio / Autorreceptor',
    pathway:['Dopamina','Receptor D₂','Gi','↓ AMPc','↑ K⁺ / ↓ Ca²⁺','INHIBICIÓN'],
    effects:[
      {t:'Vía mesolímbica',d:'↑',x:'Refuerzo, recompensa (exceso = psicosis)'},
      {t:'Vía nigroestriada',d:'↑',x:'Control motor (déficit = Parkinson)'},
      {t:'Vía tuberoinfundibular',d:'↓',x:'Inhibe prolactina'},
      {t:'Área postrema (ZQT)',d:'↑',x:'Náuseas/vómitos'},
      {t:'Terminales presinápticos',d:'↓',x:'Autorreceptor: ↓ liberación DA'}
    ],
    clinical:'Bloqueo D₂ = antipsicóticos + antieméticos. Adversos: SEP, hiperprolactinemia, disquinesia tardía. Agonistas D₂ = Parkinson (pramipexol) y prolactinoma (cabergolina).',
    drugs:[
      {n:'Haloperidol',r:'Antagonista D₂',u:'Psicosis (alto SEP)',c:'#f59e0b'},
      {n:'Risperidona',r:'Antagonista D₂/5-HT₂',u:'Antipsicótico atípico',c:'#ea580c'},
      {n:'Metoclopramida',r:'Antagonista D₂',u:'Antiemético / Procinético',c:'#fb923c'},
      {n:'Domperidona',r:'Antagonista D₂ periférico',u:'Antiemético (no BHE)',c:'#f97316'},
      {n:'Pramipexol',r:'Agonista D₂/D₃',u:'Parkinson / Piernas inquietas',c:'#fcd34d'},
      {n:'Cabergolina',r:'Agonista D₂',u:'Prolactinoma',c:'#fde047'}
    ]}
];

var SEROT=[
  {id:'5ht1a',symbol:'5-HT₁ₐ',letter:'5-HT',name:'Serotonina 1A',color:'#f472b6',colorBg:'rgba(244,114,182,.08)',
    protein:'Gi',messenger:['↓ AMPc'],net:'Ansiolítico / Antidepresivo',
    pathway:['5-HT','Receptor 5-HT₁ₐ','Gi','↓ AMPc','Autorreceptor / Postsináptico'],
    effects:[
      {t:'Núcleos del rafe (pre)',d:'↓',x:'Autorreceptor: ↓ liberación 5-HT'},
      {t:'Hipocampo, corteza (post)',d:'↑',x:'Efecto ansiolítico y antidepresivo'}
    ],
    clinical:'Buspirona = agonista parcial → ansiolítico sin dependencia. Vilazodona, vortioxetina = antidepresivos con actividad 5-HT₁ₐ.',
    drugs:[
      {n:'Buspirona',r:'Agonista parcial 5-HT₁ₐ',u:'Ansiedad (sin dependencia)',c:'#f472b6'},
      {n:'Vilazodona',r:'ISRS + 5-HT₁ₐ',u:'Depresión mayor',c:'#ec4899'}
    ]},
  {id:'5ht1bd',symbol:'5-HT₁B/D',letter:'5-HT',name:'Serotonina 1B/1D',color:'#ec4899',colorBg:'rgba(236,72,153,.08)',
    protein:'Gi',messenger:['↓ AMPc'],net:'Vasoconstricción trigeminal',
    pathway:['5-HT','Receptor 5-HT₁B/D','Gi','↓ AMPc','Vasoconstricción + ↓ CGRP'],
    effects:[
      {t:'Vasos cerebrales',d:'↓',x:'Vasoconstricción (revierte la migraña)'},
      {t:'Terminales trigeminales',d:'↓',x:'↓ Liberación CGRP y sustancia P'}
    ],
    clinical:'TRIPTANES = agonistas 5-HT₁B/D → tto agudo de migraña. Contraindicados en cardiopatía isquémica.',
    drugs:[
      {n:'Sumatriptán',r:'Agonista 5-HT₁B/D',u:'Crisis migraña',c:'#ec4899'},
      {n:'Rizatriptán',r:'Agonista 5-HT₁B/D',u:'Migraña aguda',c:'#db2777'},
      {n:'Eletriptán',r:'Agonista 5-HT₁B/D',u:'Migraña aguda',c:'#be185d'}
    ]},
  {id:'5ht2a',symbol:'5-HT₂ₐ',letter:'5-HT',name:'Serotonina 2A',color:'#e84a5f',colorBg:'rgba(232,74,95,.08)',
    protein:'Gq',messenger:['↑ IP₃','↑ DAG','↑ Ca²⁺'],net:'Excitatorio / Psicomimético',
    pathway:['5-HT / LSD','Receptor 5-HT₂ₐ','Gq','↑ IP₃/DAG','↑ Ca²⁺ → Excitación'],
    effects:[
      {t:'Corteza cerebral',d:'↑',x:'Efectos alucinógenos (LSD, psilocibina)'},
      {t:'Plaquetas',d:'↑',x:'Agregación plaquetaria'},
      {t:'Músculo liso vascular',d:'↑',x:'Vasoconstricción'}
    ],
    clinical:'Antagonistas 5-HT₂ₐ en antipsicóticos atípicos (↓SEP). Psilocibina en investigación para depresión resistente.',
    drugs:[
      {n:'Risperidona',r:'Antagonista 5-HT₂ₐ / D₂',u:'Antipsicótico atípico',c:'#e84a5f'},
      {n:'Olanzapina',r:'Antagonista 5-HT₂ₐ / D₂',u:'Esquizofrenia / bipolar',c:'#dc2626'},
      {n:'Trazodona',r:'Antagonista 5-HT₂ₐ + SARI',u:'Insomnio / Depresión',c:'#b91c1c'}
    ]},
  {id:'5ht2c',symbol:'5-HT₂c',letter:'5-HT',name:'Serotonina 2C',color:'#dc2626',colorBg:'rgba(220,38,38,.08)',
    protein:'Gq',messenger:['↑ IP₃','↑ Ca²⁺'],net:'Saciedad / Apetito',
    pathway:['5-HT','Receptor 5-HT₂c','Gq','↑ IP₃','↑ POMC hipotalámica'],
    effects:[
      {t:'Hipotálamo (POMC)',d:'↑',x:'Saciedad, ↓ apetito'},
      {t:'Plexos coroideos',d:'↑',x:'Producción de LCR'}
    ],
    clinical:'Mirtazapina bloquea 5-HT₂c → ↑ apetito (útil en depresión con anorexia). Lorcaserina retirada por cáncer.',
    drugs:[
      {n:'Mirtazapina',r:'Antagonista 5-HT₂c/H₁',u:'Depresión + insomnio + ↑apetito',c:'#dc2626'}
    ]},
  {id:'5ht3',symbol:'5-HT₃',letter:'5-HT',name:'Serotonina 3',color:'#ea580c',colorBg:'rgba(234,88,12,.08)',
    protein:'Canal iónico',messenger:['↑ Na⁺/Ca²⁺'],net:'Náusea / Vómito',
    pathway:['5-HT','Receptor 5-HT₃ (ionotrópico)','Apertura canal','↑ Na⁺/Ca²⁺','DESPOLARIZACIÓN → VÓMITO'],
    effects:[
      {t:'Área postrema (ZQT)',d:'↑',x:'Náuseas y vómitos'},
      {t:'Tracto GI (vago)',d:'↑',x:'Vómito post-quimio/RT'}
    ],
    clinical:'SETRONES = antagonistas 5-HT₃ → antieméticos de elección en NVPQ y postoperatorio.',
    drugs:[
      {n:'Ondansetrón',r:'Antagonista 5-HT₃',u:'NVPQ / postop',c:'#ea580c'},
      {n:'Granisetrón',r:'Antagonista 5-HT₃',u:'Antiemético',c:'#c2410c'},
      {n:'Palonosetrón',r:'Antagonista 5-HT₃ larga',u:'NVPQ retardada',c:'#9a3412'}
    ]},
  {id:'5ht4',symbol:'5-HT₄',letter:'5-HT',name:'Serotonina 4',color:'#f97316',colorBg:'rgba(249,115,22,.08)',
    protein:'Gs',messenger:['↑ AMPc'],net:'Procinético GI',
    pathway:['5-HT','Receptor 5-HT₄','Gs','↑ AMPc','↑ ACh mientérica','↑ MOTILIDAD'],
    effects:[
      {t:'Plexo mientérico GI',d:'↑',x:'↑ Motilidad gastrointestinal'},
      {t:'Hipocampo',d:'↑',x:'Cognición (investigación)'}
    ],
    clinical:'Prucaloprida = agonista 5-HT₄ → constipación crónica. Cisaprida retirada (QT).',
    drugs:[
      {n:'Prucaloprida',r:'Agonista 5-HT₄ selectivo',u:'Constipación crónica',c:'#f97316'}
    ]}
];

var HIST=[
  {id:'h1',symbol:'H₁',letter:'H',name:'Histamina 1',color:'#fbbf24',colorBg:'rgba(251,191,36,.08)',
    protein:'Gq',messenger:['↑ IP₃','↑ Ca²⁺'],net:'Alergia / Inflamación',
    pathway:['Histamina','Receptor H₁','Gq','↑ IP₃/DAG','↑ Ca²⁺','VASODILAT + PRURITO'],
    effects:[
      {t:'Vasos (endotelio)',d:'↓',x:'Vasodilatación → edema, hipotensión (anafilaxia)'},
      {t:'Músculo liso bronquial',d:'↑',x:'Broncoconstricción'},
      {t:'Terminales sensitivas',d:'↑',x:'Prurito, dolor'},
      {t:'SNC (hipotálamo post.)',d:'↑',x:'Vigilia (antagonistas 1ª gen = sedación)'}
    ],
    clinical:'Antihistamínicos H₁: 1ª gen (difenhidramina) cruzan BHE = sedantes. 2ª gen (loratadina, cetirizina) no sedantes.',
    drugs:[
      {n:'Loratadina',r:'Antagonista H₁ 2ª gen',u:'Rinitis alérgica / urticaria',c:'#fbbf24'},
      {n:'Cetirizina',r:'Antagonista H₁ 2ª gen',u:'Alergias',c:'#f59e0b'},
      {n:'Difenhidramina',r:'Antagonista H₁ 1ª gen',u:'Alergias + sedante',c:'#d97706'},
      {n:'Hidroxizina',r:'Antagonista H₁ 1ª gen',u:'Ansiedad / Prurito',c:'#b45309'}
    ]},
  {id:'h2',symbol:'H₂',letter:'H',name:'Histamina 2',color:'#f59e0b',colorBg:'rgba(245,158,11,.08)',
    protein:'Gs',messenger:['↑ AMPc'],net:'Secreción ácida gástrica',
    pathway:['Histamina','Receptor H₂','Gs','↑ AMPc','Bomba H⁺/K⁺','↑ HCl'],
    effects:[
      {t:'Células parietales',d:'↑',x:'↑ Secreción HCl'},
      {t:'Corazón',d:'↑',x:'Inotropismo y cronotropismo (menor que β₁)'}
    ],
    clinical:'Famotidina actual (ranitidina retirada por NDMA). Reemplazada por IBP más potentes.',
    drugs:[
      {n:'Famotidina',r:'Antagonista H₂',u:'ERGE / úlcera péptica',c:'#f59e0b'},
      {n:'Cimetidina',r:'Antagonista H₂',u:'Inhibe CYP450 (hoy poco usada)',c:'#d97706'}
    ]},
  {id:'h3',symbol:'H₃',letter:'H',name:'Histamina 3',color:'#d97706',colorBg:'rgba(217,119,6,.08)',
    protein:'Gi',messenger:['↓ AMPc'],net:'Autorreceptor / Modulación SNC',
    pathway:['Histamina','Receptor H₃ (pre)','Gi','↓ AMPc','↓ Liberación histamina'],
    effects:[
      {t:'Terminales histaminérgicos',d:'↓',x:'Autorreceptor'},
      {t:'Modulación de DA, 5-HT, ACh',d:'↓',x:'Regulación aminérgica'}
    ],
    clinical:'Pitolisant = antagonista/agonista inverso H₃ → narcolepsia.',
    drugs:[
      {n:'Pitolisant',r:'Antagonista/agonista inverso H₃',u:'Narcolepsia',c:'#d97706'}
    ]},
  {id:'h4',symbol:'H₄',letter:'H',name:'Histamina 4',color:'#b45309',colorBg:'rgba(180,83,9,.08)',
    protein:'Gi',messenger:['↓ AMPc'],net:'Inmunomodulación',
    pathway:['Histamina','Receptor H₄','Gi','Quimiotaxis inmune'],
    effects:[
      {t:'Eosinófilos, mastocitos',d:'↑',x:'Quimiotaxis → inflamación'}
    ],
    clinical:'Diana emergente. Antagonistas en investigación para asma, dermatitis atópica.',
    drugs:[{n:'Toreforant (fase clínica)',r:'Antagonista H₄',u:'Inflamación alérgica',c:'#b45309'}]}
];

var OPI=[
  {id:'mu',symbol:'μ (MOR)',letter:'μ',name:'Opioide Mu',color:'#06b6d4',colorBg:'rgba(6,182,212,.08)',
    protein:'Gi/o',messenger:['↓ AMPc','↑ K⁺','↓ Ca²⁺'],net:'Analgesia / Euforia',
    pathway:['β-endorfina','Receptor μ','Gi/o','↓ AMPc','HIPERPOLARIZACIÓN','ANALGESIA'],
    effects:[
      {t:'PAG, asta dorsal',d:'↓',x:'Analgesia potente (supraspinal y espinal)'},
      {t:'Sistema mesolímbico',d:'↑',x:'Euforia, refuerzo (adicción)'},
      {t:'Centro respiratorio bulbar',d:'↓',x:'Depresión respiratoria (muerte en sobredosis)'},
      {t:'Tracto GI',d:'↓',x:'Constipación'},
      {t:'Iris',d:'↑',x:'Miosis puntiforme'}
    ],
    clinical:'MORFINA = prototipo. Fentanilo (epidemia opioide). Metadona = mantenimiento. NALOXONA = antídoto sobredosis.',
    drugs:[
      {n:'Morfina',r:'Agonista μ',u:'Dolor severo (cáncer, postop)',c:'#06b6d4'},
      {n:'Fentanilo',r:'Agonista μ potente',u:'Anestesia / Dolor crónico (parche)',c:'#0891b2'},
      {n:'Tramadol',r:'μ débil + IRSN',u:'Dolor moderado',c:'#0e7490'},
      {n:'Metadona',r:'Agonista μ larga duración',u:'Mantenimiento adicción / Dolor',c:'#155e75'},
      {n:'Naloxona',r:'Antagonista μ',u:'Antídoto sobredosis',c:'#67e8f9'},
      {n:'Naltrexona',r:'Antagonista μ VO',u:'Prevención recaída',c:'#a5f3fc'}
    ]},
  {id:'kappa',symbol:'κ (KOR)',letter:'κ',name:'Opioide Kappa',color:'#0ea5e9',colorBg:'rgba(14,165,233,.08)',
    protein:'Gi/o',messenger:['↓ AMPc'],net:'Analgesia espinal / Disforia',
    pathway:['Dinorfinas','Receptor κ','Gi/o','↓ AMPc','ANALGESIA + DISFORIA'],
    effects:[
      {t:'Médula espinal',d:'↓',x:'Analgesia espinal'},
      {t:'Sistema límbico',d:'↓',x:'Disforia (opuesto a μ)'},
      {t:'Riñón',d:'↑',x:'Diuresis (↓ ADH)'}
    ],
    clinical:'Butorfanol (agonista κ, antagonista μ parcial). Disforia limita uso.',
    drugs:[
      {n:'Butorfanol',r:'Agonista κ',u:'Dolor moderado',c:'#0ea5e9'}
    ]},
  {id:'delta',symbol:'δ (DOR)',letter:'δ',name:'Opioide Delta',color:'#38bdf8',colorBg:'rgba(56,189,248,.08)',
    protein:'Gi/o',messenger:['↓ AMPc'],net:'Modulación afectiva',
    pathway:['Encefalinas','Receptor δ','Gi/o','↓ AMPc','Analgesia + modulación'],
    effects:[
      {t:'SNC límbico',d:'↓',x:'Ansiolítico / antidepresivo'},
      {t:'Médula espinal',d:'↓',x:'Analgesia coadyuvante'}
    ],
    clinical:'Diana emergente. Agonistas δ en investigación para depresión y dolor.',
    drugs:[{n:'En investigación',r:'Agonistas δ',u:'Depresión / Dolor neuropático',c:'#38bdf8'}]}
];
