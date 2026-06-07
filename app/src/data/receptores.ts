// ══════════════════════════════════════════════════════════════
// DATOS FISIOLOGÍA — RECEPTORES CELULARES (10 familias, 34 subtipos)
// Identifiers renamed: FAMILIES→RECEPTOR_FAMILIES, QUIZZES→RECEPTOR_QUIZZES,
//                      PEARLS→RECEPTOR_PEARLS, PROT_G→RECEPTOR_PROT_G
// ══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════

export const ADR = [
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

export const MUSC = [
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

export const NIC = [
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

export const DOP = [
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

export const SEROT = [
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

export const HIST = [
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

export const OPI = [
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

export const GLU = [
  {id:'nmda',symbol:'NMDA',letter:'NMDA',name:'NMDA',color:'#60a5fa',colorBg:'rgba(96,165,250,.08)',
    protein:'Canal iónico',messenger:['↑ Ca²⁺ (clave LTP)'],net:'Plasticidad / Excitotoxicidad',
    pathway:['Glu + Glicina','Receptor NMDA (Mg²⁺)','Despolarización retira Mg²⁺','↑ Ca²⁺','LTP / Excitotoxicidad'],
    effects:[
      {t:'Hipocampo (CA1)',d:'↑',x:'LTP = aprendizaje, memoria'},
      {t:'Corteza cerebral',d:'↑',x:'Cognición, procesamiento'},
      {t:'Neuronas dañadas',d:'↑',x:'Excitotoxicidad (ACV, TCE, Alzheimer)'}
    ],
    clinical:'Memantina → Alzheimer. Ketamina → anestesia + antidepresivo rápido (depresión resistente). Esketamina nasal FDA 2019.',
    drugs:[
      {n:'Memantina',r:'Antagonista NMDA',u:'Alzheimer moderado-severo',c:'#60a5fa'},
      {n:'Ketamina',r:'Antagonista NMDA',u:'Anestesia / Depresión / Dolor',c:'#3b82f6'},
      {n:'Esketamina',r:'Antagonista NMDA (nasal)',u:'Depresión resistente (FDA 2019)',c:'#2563eb'},
      {n:'Dextrometorfano',r:'Antagonista NMDA',u:'Antitusivo / Auvelity',c:'#1d4ed8'}
    ]},
  {id:'ampa',symbol:'AMPA',letter:'AMPA',name:'AMPA',color:'#3b82f6',colorBg:'rgba(59,130,246,.08)',
    protein:'Canal iónico',messenger:['↑ Na⁺ → despolarización'],net:'Transmisión excitatoria rápida',
    pathway:['Glutamato','Receptor AMPA','↑ Na⁺ (rápido)','DESPOLARIZACIÓN → EPSP'],
    effects:[
      {t:'Sinapsis glutamatérgicas',d:'↑',x:'Principal transmisión excitatoria rápida'},
      {t:'Focos epileptógenos',d:'↑',x:'Génesis y propagación de descargas'}
    ],
    clinical:'Perampanel = antagonista AMPA → epilepsia refractaria.',
    drugs:[
      {n:'Perampanel',r:'Antagonista AMPA',u:'Epilepsia refractaria',c:'#3b82f6'}
    ]},
  {id:'kainato',symbol:'Kainato',letter:'KA',name:'Kainato',color:'#1d4ed8',colorBg:'rgba(29,78,216,.08)',
    protein:'Canal iónico',messenger:['↑ Na⁺/Ca²⁺'],net:'Modulación sináptica',
    pathway:['Glutamato','Receptor Kainato','Modulación pre/post'],
    effects:[
      {t:'Interneuronas GABA',d:'↑',x:'Modulación de circuitos inhibitorios'},
      {t:'Hipocampo',d:'↑',x:'Regulación de plasticidad'}
    ],
    clinical:'Topiramato tiene actividad kainato parcial (epilepsia, migraña).',
    drugs:[{n:'Topiramato',r:'Múltiples dianas',u:'Epilepsia / Migraña',c:'#1d4ed8'}]}
];

export const GABA = [
  {id:'gabaa',symbol:'GABAᴀ',letter:'GABA',name:'GABA-A (ionotrópico)',color:'#8b5cf6',colorBg:'rgba(139,92,246,.08)',
    protein:'Canal Cl⁻',messenger:['↑ Cl⁻ → hiperpolariza'],net:'Inhibición rápida',
    pathway:['GABA','Receptor GABAᴀ','Apertura canal','↑ Cl⁻','HIPERPOLARIZACIÓN'],
    effects:[
      {t:'SNC (ubicuo)',d:'↓',x:'Principal inhibición rápida del cerebro'},
      {t:'Médula espinal',d:'↓',x:'Modulación refleja, tono muscular'}
    ],
    clinical:'BENZODIAZEPINAS potencian GABAᴀ → ansiolíticos. FLUMAZENIL = antídoto BZD. Barbitúricos, alcohol, propofol también aquí.',
    drugs:[
      {n:'Diazepam',r:'BZD',u:'Ansiedad / Status epiléptico / Abstinencia OH',c:'#8b5cf6'},
      {n:'Lorazepam',r:'BZD intermedia',u:'Ansiedad / Convulsiones',c:'#7c3aed'},
      {n:'Midazolam',r:'BZD corta',u:'Sedación procedimental',c:'#6d28d9'},
      {n:'Zolpidem',r:'Z-drug α1',u:'Insomnio',c:'#a78bfa'},
      {n:'Fenobarbital',r:'Barbitúrico',u:'Epilepsia / Status',c:'#5b21b6'},
      {n:'Flumazenil',r:'Antagonista BZD',u:'Antídoto intoxicación BZD',c:'#c4b5fd'},
      {n:'Propofol',r:'GABAᴀ',u:'Anestesia IV',c:'#4c1d95'}
    ]},
  {id:'gabab',symbol:'GABAʙ',letter:'GABA',name:'GABA-B (metabotrópico)',color:'#7c3aed',colorBg:'rgba(124,58,237,.08)',
    protein:'Gi/o',messenger:['↓ AMPc','↑ K⁺'],net:'Inhibición lenta / Espasticidad',
    pathway:['GABA','Receptor GABAʙ','Gi/o','↑ K⁺, ↓ Ca²⁺','Inhibición lenta'],
    effects:[
      {t:'Presináptico',d:'↓',x:'↓ Liberación de NT'},
      {t:'Médula espinal',d:'↓',x:'↓ Tono muscular'}
    ],
    clinical:'BACLOFENO = agonista GABAʙ → espasticidad (EM, lesión medular).',
    drugs:[
      {n:'Baclofeno',r:'Agonista GABAʙ',u:'Espasticidad (EM, lesión medular)',c:'#7c3aed'}
    ]}
];

export const CB = [
  {id:'cb1',symbol:'CB₁',letter:'CB',name:'Cannabinoide 1',color:'#10b981',colorBg:'rgba(16,185,129,.08)',
    protein:'Gi/o',messenger:['↓ AMPc'],net:'Psicoactivo / Modulador SNC',
    pathway:['Anandamida / THC','Receptor CB₁','Gi/o','↓ AMPc','↓ Liberación NT (retrógrada)'],
    effects:[
      {t:'SNC (corteza, hipocampo)',d:'↓',x:'Euforia, ↓ memoria, ↓ coordinación'},
      {t:'Hipotálamo',d:'↑',x:'↑ Apetito'},
      {t:'Sistema nociceptivo',d:'↓',x:'Analgesia'}
    ],
    clinical:'Nabiximols para espasticidad EM. Rimonabant retirado (suicidio). Cannabis medicinal: dolor crónico, náusea quimio.',
    drugs:[
      {n:'Nabiximols',r:'Agonista CB₁/CB₂',u:'Espasticidad EM / Dolor',c:'#10b981'},
      {n:'Dronabinol',r:'THC sintético',u:'Caquexia VIH / Náusea',c:'#059669'}
    ]},
  {id:'cb2',symbol:'CB₂',letter:'CB',name:'Cannabinoide 2',color:'#059669',colorBg:'rgba(5,150,105,.08)',
    protein:'Gi/o',messenger:['↓ AMPc'],net:'Inmunomodulación',
    pathway:['2-AG / CBD','Receptor CB₂','Gi/o','↓ AMPc','Antiinflamatorio'],
    effects:[
      {t:'Células inmunes',d:'↓',x:'Antiinflamación, ↓ citocinas'},
      {t:'Hueso',d:'↑',x:'Formación ósea (investigación)'}
    ],
    clinical:'CBD (Epidiolex) aprobado para epilepsia refractaria (Dravet, Lennox-Gastaut).',
    drugs:[
      {n:'Cannabidiol (Epidiolex)',r:'Agonista parcial CB₂',u:'Epilepsia (Dravet, Lennox)',c:'#059669'}
    ]}
];

export const RECEPTOR_FAMILIES = [
  {id:'adr',name:'Adrenérgicos',icon:'⚡',col:'#ec4899',desc:'α₁, α₂, β₁, β₂, β₃ · Simpático',receptors:ADR,nt:'Noradrenalina / Adrenalina'},
  {id:'musc',name:'Muscarínicos',icon:'🌿',col:'#14b8a6',desc:'M₁–M₅ · Parasimpático',receptors:MUSC,nt:'Acetilcolina'},
  {id:'nic',name:'Nicotínicos',icon:'🧬',col:'#a78bfa',desc:'Nm · Nn',receptors:NIC,nt:'Acetilcolina'},
  {id:'dop',name:'Dopaminérgicos',icon:'🎯',col:'#f59e0b',desc:'D1-like · D2-like',receptors:DOP,nt:'Dopamina'},
  {id:'sero',name:'Serotoninérgicos',icon:'💫',col:'#ec4899',desc:'5-HT₁–5-HT₇',receptors:SEROT,nt:'Serotonina (5-HT)'},
  {id:'hist',name:'Histaminérgicos',icon:'🔥',col:'#fbbf24',desc:'H₁, H₂, H₃, H₄',receptors:HIST,nt:'Histamina'},
  {id:'opi',name:'Opioides',icon:'☯️',col:'#06b6d4',desc:'μ · κ · δ',receptors:OPI,nt:'Endorfinas / Encefalinas'},
  {id:'glu',name:'Glutamatérgicos',icon:'🧠',col:'#60a5fa',desc:'NMDA, AMPA, Kainato',receptors:GLU,nt:'Glutamato'},
  {id:'gaba',name:'GABAérgicos',icon:'😴',col:'#8b5cf6',desc:'GABAᴀ · GABAʙ',receptors:GABA,nt:'GABA'},
  {id:'cb',name:'Cannabinoides',icon:'🌱',col:'#10b981',desc:'CB₁ · CB₂',receptors:CB,nt:'Anandamida / 2-AG'}
];

// ═══════════════════════════════════════════════════════
// QUIZZES
// ═══════════════════════════════════════════════════════
export const RECEPTOR_QUIZZES = {
  adr:[
    {q:'¿Qué proteína G está acoplada al receptor α₁?',opts:['Gi','Gs','Gq','G12/13'],r:2,x:'α₁ → Gq → ↑PLC → ↑IP₃+DAG → ↑Ca²⁺ → contracción. Vía clásica de vasoconstricción.'},
    {q:'Mecanismo de la metildopa en HTA:',opts:['Bloquea α₁ periférico','Agonista α₂ central','Inhibe ECA','Bloquea β₁'],r:1,x:'Agonista α₂ central → ↓ tono simpático → ↓ PA. Primera elección en HTA del embarazo.'},
    {q:'Salbutamol produce broncodilatación por:',opts:['β₁ → contracción','β₂ → Gs → ↑AMPc → relajación','α₂ → Gi','β₂ → Gq'],r:1,x:'β₂ → Gs → ↑AMPc → PKA → fosforila miosina kinasa → relajación músculo liso bronquial.'},
    {q:'¿Por qué metoprolol es "cardioselectivo"?',opts:['Solo α₁ cardíaco','Mayor afinidad β₁ vs β₂','Agonista parcial β₂','Inhibe catecolaminas'],r:1,x:'Cardioselectivos = mayor afinidad β₁. Evita broncoespasmo. NO son 100% selectivos a dosis altas.'},
    {q:'¿Por qué salbutamol produce hipokalemia?',opts:['↑ aldosterona','Activa Na/K-ATPasa, K⁺ entra a célula','↓ reabsorción K⁺','↑ sudor'],r:1,x:'β₂ → ↑AMPc → activa Na/K-ATPasa en músculo → K⁺ entra → ↓K⁺ sérico.'},
    {q:'Receptor adrenérgico para vejiga hiperactiva:',opts:['α₁','α₂','β₁','β₃'],r:3,x:'β₃ → Gs → ↑AMPc → relajación detrusor → ↑ capacidad. Mirabegrón.'},
    {q:'Retiro abrupto de clonidina causa:',opts:['Hipokalemia','HTA de rebote','Bradicardia','Broncoespasmo'],r:1,x:'Crisis hipertensiva por dependencia neuroadaptativa. Retirar gradualmente.'},
    {q:'¿Por qué carvedilol es útil en ICC?',opts:['Solo β₁','Solo α₁','β₁+β₂+α₁','Agonista β₂'],r:2,x:'Bloqueo β₁ (↓FC, ↓remodelación) + α₁ (↓postcarga) = mejora supervivencia.'}
  ],
  musc:[
    {q:'¿Qué receptor muscarínico produce bradicardia?',opts:['M₁','M₂','M₃','M₄'],r:1,x:'M₂ → Gi → ↑K⁺ nodo SA/AV → hiperpolarización → bradicardia. Receptor del vago cardíaco.'},
    {q:'Tiotropio (EPOC) actúa en:',opts:['M₂','M₃ bronquial','β₂','H₁'],r:1,x:'Tiotropio = antagonista M₃ de larga duración (LAMA) → broncodilatación.'},
    {q:'Antídoto de intoxicación por organofosforados:',opts:['Naloxona','Flumazenil','Atropina + pralidoxima','Dexmedetomidina'],r:2,x:'Organofosforados inhiben AChE → exceso ACh. Atropina bloquea muscarínicos; pralidoxima regenera AChE.'},
    {q:'Receptor M en células parietales gástricas:',opts:['M₁','M₂','M₃','Todos'],r:0,x:'M₁ → ↑HCl. Pirenzepina (antagonista) se usaba para úlcera, hoy IBP.'},
    {q:'Oxibutinina trata vejiga hiperactiva bloqueando:',opts:['M₁','M₂','M₃','β₃'],r:2,x:'M₃ en detrusor → contracción. Antagonistas M₃ → ↓ micción.'},
    {q:'Receptor colinérgico clave en Alzheimer:',opts:['M₁','M₂','M₃','M₄'],r:0,x:'M₁ en corteza/hipocampo → aprendizaje. Donepezilo ↑ACh → estimula M₁.'},
    {q:'Xanomelina-trospio (2024) trata esquizofrenia sin bloquear D₂ porque activa:',opts:['M₁/M₄','M₂/M₃','D₁','5-HT₂ₐ'],r:0,x:'Agonista M₁/M₄ = primer antipsicótico sin bloqueo dopaminérgico.'}
  ],
  nic:[
    {q:'Receptor de la placa neuromuscular:',opts:['Nm','Nn','M₃','GABAᴀ'],r:0,x:'Nm → canal iónico → Na⁺ → despolarización → contracción muscular.'},
    {q:'Succinilcolina produce:',opts:['Bloqueo no despolarizante','Bloqueo despolarizante (fasciculaciones)','Antagonismo muscarínico','Agonismo β₂'],r:1,x:'Agonista Nm persistente → despolariza y luego músculo no responde. Intubación rápida.'},
    {q:'Miastenia gravis: anticuerpos contra:',opts:['D₂','Nm','GABAᴀ','M₃'],r:1,x:'Anti-Nm → ↓ receptores → debilidad fluctuante. Neostigmina mejora síntomas.'},
    {q:'Vareniclina (cesación tabáquica) es:',opts:['Antagonista Nm','Agonista parcial Nn α4β2','Agonista μ','Bloqueo β₂'],r:1,x:'↓ ansia + ↓ placer si fuma.'},
    {q:'Nn ganglionar transmite con:',opts:['EPSP lento','EPSP rápido','Inhibición','Hiperpolarización'],r:1,x:'Nicotínicos = canales iónicos → EPSP rápido (ms). M₁ = EPSP lento (G-proteína).'},
    {q:'Neostigmina en reverso de BNM:',opts:['Bloquea Nm','Inhibe AChE (↑ACh)','Agoniza Nn','Relajante'],r:1,x:'↑ ACh en placa → desplaza al BNM no-despolarizante. Combinar con glicopirrolato.'}
  ],
  dop:[
    {q:'D1-like incluye:',opts:['D₁ y D₅','D₂, D₃, D₄','Solo D₁','Todos'],r:0,x:'D1-like = D₁ + D₅ (Gs). D2-like = D₂, D₃, D₄ (Gi).'},
    {q:'SEP por antipsicóticos se debe a:',opts:['Bloqueo D₁','Bloqueo D₂ nigroestriado','↑ dopamina','Bloqueo M₁'],r:1,x:'Bloqueo D₂ vía nigroestriada → parkinsonismo, distonía, acatisia, disquinesia tardía.'},
    {q:'¿Por qué domperidona produce menos SEP que metoclopramida?',opts:['Es D₁','No cruza BHE','Es agonista','No actúa en D₂'],r:1,x:'Domperidona bloquea D₂ periférico pero NO cruza BHE → menos efectos centrales.'},
    {q:'Prolactinoma se trata con:',opts:['Haloperidol','Cabergolina (agonista D₂)','Metoclopramida','Clozapina'],r:1,x:'D₂ en hipófisis inhibe prolactina. Cabergolina → ↓ prolactina → ↓ tumor.'},
    {q:'Dopamina dosis bajas (1-3 μg/kg/min) activan:',opts:['β₁','α₁','D₁ (vasodilatación renal)','β₂'],r:2,x:'D₁ → vasodilatación renal. Dosis β₁ (3-10). Dosis α₁ (>10).'},
    {q:'Parkinson se trata con:',opts:['Antagonistas D₂','Agonistas D₂ + L-DOPA','Bloqueo M₁','Antagonistas NMDA'],r:1,x:'Déficit dopaminérgico → L-DOPA + agonistas D₂ directos (pramipexol).'},
    {q:'Hiperprolactinemia por antipsicóticos es por bloqueo de:',opts:['Vía nigroestriada','Vía tuberoinfundibular','Vía mesolímbica','Vía mesocortical'],r:1,x:'Tuberoinfundibular: DA inhibe prolactina. Bloqueo D₂ → ↑prolactina.'}
  ],
  sero:[
    {q:'Triptanes (migraña) actúan en:',opts:['5-HT₁ₐ','5-HT₁B/D','5-HT₂ₐ','5-HT₃'],r:1,x:'Agonistas 5-HT₁B/D → vasoconstricción craneal + ↓CGRP. Contraindicados en cardiopatía.'},
    {q:'Ondansetrón bloquea:',opts:['5-HT₁ₐ','5-HT₂ₐ','5-HT₃','5-HT₄'],r:2,x:'Setrones = antagonistas 5-HT₃ → antieméticos de elección en NVPQ.'},
    {q:'Buspirona (ansiolítico) es:',opts:['BZD','Agonista parcial 5-HT₁ₐ','ISRS','Antagonista β'],r:1,x:'5-HT₁ₐ → ansiolítico sin dependencia (vs BZD).'},
    {q:'LSD y psilocibina actúan en:',opts:['5-HT₁ₐ','5-HT₂ₐ','5-HT₃','5-HT₇'],r:1,x:'5-HT₂ₐ cortical → efectos psicodélicos. En investigación para depresión resistente.'},
    {q:'Síndrome serotoninérgico por combinar:',opts:['ISRS + IMAO + tramadol','Solo ISRS','Antagonistas 5-HT','BZD'],r:0,x:'Exceso 5-HT (principalmente 5-HT₂ₐ). Tríada: mental, autonómica, neuromuscular.'},
    {q:'Prucaloprida (constipación) es:',opts:['Antagonista 5-HT₁','Antagonista 5-HT₃','Agonista 5-HT₄','Antagonista H₁'],r:2,x:'5-HT₄ en plexo mientérico → ↑ACh → ↑motilidad GI.'},
    {q:'Mirtazapina causa ↑ apetito por bloquear:',opts:['5-HT₁','5-HT₂c + H₁','D₂','M₃'],r:1,x:'Bloqueo 5-HT₂c (saciedad) + H₁ → útil en depresión con anorexia.'},
    {q:'Atípicos tienen menos SEP que típicos porque bloquean:',opts:['Solo D₂','D₂ + 5-HT₂ₐ','Solo 5-HT₃','5-HT₄'],r:1,x:'Bloqueo 5-HT₂ₐ atenúa efectos del bloqueo D₂ nigroestriado.'}
  ],
  hist:[
    {q:'Anafilaxia activa principalmente:',opts:['H₁ + H₂','H₃','H₄','Solo H₁'],r:0,x:'H₁ (vasodilatación, broncoespasmo) + H₂ (hipotensión). Adrenalina revierte.'},
    {q:'Loratadina no causa sedación porque:',opts:['No bloquea H₁','Bloquea H₂','No cruza BHE','Bloquea H₄'],r:2,x:'2ª gen → poca penetración SNC. No sedantes.'},
    {q:'Famotidina trata ERGE bloqueando:',opts:['H₁','H₂ parietales','H₃','Bomba de protones'],r:1,x:'H₂ → Gs → ↑AMPc → bomba H⁺/K⁺ → HCl. IBP son más potentes.'},
    {q:'Difenhidramina (1ª gen) tiene usos off-label en:',opts:['Solo alergias','Alergias + sedante + antimareo','HTA','Antiinflamatorio'],r:1,x:'Cruza BHE → sedación + anti-M₃ adicional.'},
    {q:'Pitolisant (narcolepsia) actúa en:',opts:['H₁','H₂','H₃','H₄'],r:2,x:'H₃ es autorreceptor presináptico. Antagonismo → ↑ histamina → ↑ vigilia.'},
    {q:'H₁ vs H₂: ¿cuál causa broncoconstricción?',opts:['H₁','H₂','Ambos','Ninguno'],r:0,x:'H₁ → broncoconstricción. H₂ → secreción gástrica.'},
    {q:'H₄ es objetivo emergente en:',opts:['HTA','Asma / dermatitis atópica','Parkinson','Esquizofrenia'],r:1,x:'En eosinófilos/mastocitos. Antagonistas en investigación para patología alérgica.'}
  ],
  opi:[
    {q:'Receptor principal de la morfina:',opts:['μ (MOR)','κ','δ','ORL1'],r:0,x:'μ = analgesia, euforia, depresión respiratoria, constipación. Clave en adicción.'},
    {q:'Naloxona revierte sobredosis porque es:',opts:['Agonista μ','Antagonista μ','Agonista κ','Inhibidor AChE'],r:1,x:'Antagonista μ → desplaza al opioide y restaura respiración. Vida media corta → re-dosis.'},
    {q:'Depresión respiratoria por opioides es por:',opts:['κ central','μ en bulbo','δ','5-HT₃'],r:1,x:'μ en centro respiratorio → ↓ sensibilidad a CO₂ → bradipnea/apnea.'},
    {q:'Metadona (tto adicción) es:',opts:['Agonista μ larga duración','Antagonista μ','Agonista κ','Inhibidor'],r:0,x:'Vida media larga → elimina abstinencia sin picos de euforia.'},
    {q:'Miosis puntiforme en intoxicación opioide es por:',opts:['β₁','μ en núcleo Edinger-Westphal','α₁','M₃'],r:1,x:'μ central → ↑ tono parasimpático ocular → miosis. Signo clínico clave.'},
    {q:'Tramadol actúa por:',opts:['Solo μ','Agonista μ débil + IRSN','Antagonista μ','κ puro'],r:1,x:'Doble mecanismo: μ + inhibición recaptación 5-HT/NE.'},
    {q:'Buprenorfina es:',opts:['Agonista μ pleno','Agonista parcial μ','Antagonista μ','Agonista κ'],r:1,x:'Agonista parcial μ (efecto techo) → tto adicción (Suboxone).'},
    {q:'Naltrexona en adicción alcohol/opioide:',opts:['Agonista μ','Antagonista μ VO','Inhibidor AChE','Agonista GABAᴀ'],r:1,x:'Antagonista μ VO → bloquea placer + modula refuerzo alcohólico.'}
  ],
  glu:[
    {q:'Ketamina es:',opts:['Agonista NMDA','Antagonista NMDA','Agonista GABAᴀ','Antagonista AMPA'],r:1,x:'Antagonista NMDA → anestesia disociativa + antidepresivo rápido.'},
    {q:'Memantina (Alzheimer) actúa en:',opts:['AChE','NMDA','GABAᴀ','D₂'],r:1,x:'Antagonista NMDA moderado → ↓ excitotoxicidad.'},
    {q:'LTP (potenciación largo plazo) requiere:',opts:['NMDA + ↑Ca²⁺','Solo AMPA','GABAᴀ','Kainato'],r:0,x:'NMDA se activa con despolarización (retira Mg²⁺) → ↑Ca²⁺ → plasticidad = base de memoria.'},
    {q:'Excitotoxicidad en ACV involucra:',opts:['↓ Glu','Exceso Glu → NMDA → ↑Ca²⁺','GABA excesivo','DA baja'],r:1,x:'Isquemia → glutamato masivo → NMDA → Ca²⁺ → muerte neuronal.'},
    {q:'Perampanel (epilepsia) bloquea:',opts:['NMDA','AMPA','Kainato','GABAᴀ'],r:1,x:'Antagonista AMPA no competitivo → epilepsia refractaria.'},
    {q:'Receptor glutamatérgico bloqueado por Mg²⁺ en reposo:',opts:['AMPA','Kainato','NMDA','mGluR'],r:2,x:'NMDA bloqueado por Mg²⁺. Necesita despolarización + Glu + glicina → coincidencia.'}
  ],
  gaba:[
    {q:'Benzodiazepinas potencian:',opts:['GABAᴀ (↑ frecuencia apertura Cl⁻)','GABAʙ','NMDA','5-HT₁ₐ'],r:0,x:'BZD = moduladores alostéricos GABAᴀ → ↑ frecuencia apertura → hiperpolarización.'},
    {q:'Flumazenil revierte intoxicación por:',opts:['Opioides','BZD','Barbitúricos','Alcohol'],r:1,x:'Antagonista competitivo BZD en GABAᴀ. NO revierte barbitúricos ni OH.'},
    {q:'Baclofeno (espasticidad) es:',opts:['Agonista GABAᴀ','Agonista GABAʙ','Antagonista NMDA','Opioide'],r:1,x:'Agonista GABAʙ → ↓ tono muscular. EM, lesión medular.'},
    {q:'¿Por qué zolpidem causa menos dependencia que diazepam?',opts:['No afecta GABAᴀ','Selectivo α1 (sedante puro)','Es antagonista','Vida media larga'],r:1,x:'Z-drug selectivo α1 → solo sedación, menos efectos multidimensionales.'},
    {q:'Barbitúricos actúan en:',opts:['GABAʙ','GABAᴀ (↑ duración apertura)','NMDA','μ'],r:1,x:'↑ duración de apertura (vs BZD que ↑ frecuencia). Dosis altas = letal.'},
    {q:'Abstinencia alcohólica causa convulsiones porque:',opts:['↑ GABA','Al retirar OH hay ↓GABA + ↑NMDA','↑ NMDA directo','↑ μ'],r:1,x:'Adaptación crónica: ↓GABAᴀ + ↑NMDA → hiperexcitabilidad al retirar. Tto: BZD.'}
  ],
  cb:[
    {q:'CB₁ está principalmente en:',opts:['Hígado','SNC','Pulmón','Células inmunes'],r:1,x:'CB₁ en SNC (corteza, hipocampo, cerebelo). Mediador efectos psicoactivos THC.'},
    {q:'CB₂ está principalmente en:',opts:['SNC','Células inmunes y periferia','Corazón','Riñón'],r:1,x:'CB₂ en macrófagos, linfocitos. Antiinflamación. CBD preferencial aquí.'},
    {q:'Epidiolex (CBD) está aprobado para:',opts:['Depresión','Epilepsia refractaria','HTA','Diabetes'],r:1,x:'FDA 2018 para síndromes de Dravet y Lennox-Gastaut.'},
    {q:'Rimonabant fue retirado porque:',opts:['Inefectivo','↑ ideación suicida','Cáncer','Hepatotoxicidad'],r:1,x:'Bloqueo CB₁ → ↑ depresión, suicidio. Muestra rol endocannabinoide en humor.'},
    {q:'Endocannabinoides (anandamida, 2-AG) actúan como:',opts:['NT anterogrades','Mensajeros retrógrados','Hormonas','Factores de crecimiento'],r:1,x:'Síntesis postsináptica → activan CB₁ presináptico → ↓ liberación NT. Único mecanismo.'}
  ]
};

// ═══════════════════════════════════════════════════════
// PEARLS (Perlas Clínicas)
// ═══════════════════════════════════════════════════════
export const RECEPTOR_PEARLS = {
  adr:[
    {t:'⚡ Regla de los 3 Gs',i:['Gq → "Q de Quema" (Ca²⁺ → contracción) → α₁','Gi → "i de inhibe" (↓AMPc) → α₂','Gs → "s de Sube" (↑AMPc) → β₁, β₂, β₃']},
    {t:'💊 α₁-bloqueadores: prazosina vs tamsulosina',i:['Prazosina → antihipertensivo (hipotensión 1ª dosis)','Tamsulosina → uroSelectiva (HBP, menos efecto vascular)','📌 HBP → tamsulosina']},
    {t:'🤰 Metildopa = HTA embarazo',i:['Agonista α₂ central → ↓ tono simpático','Primera elección por seguridad fetal','Segunda: labetalol IV en emergencia']},
    {t:'🫁 β₂: SABA vs LABA',i:['SABA (salbutamol) — RESCATE 4-6h','LABA (formoterol, salmeterol) — MANTENIMIENTO 12h','NO usar LABA solo en asma','Adverso: hipokalemia, temblor']},
    {t:'❤️ β-bloqueadores',i:['Cardioselectivos (β₁): metoprolol, atenolol, bisoprolol','No selectivos: propranolol, carvedilol (+α₁), labetalol','⚠️ No selectivos → broncoespasmo en asmáticos']},
    {t:'🧠 Clonidina — retirada abrupta',i:['α₂ agonista central','Retiro brusco → HTA de rebote','Retirar SIEMPRE gradualmente']}
  ],
  musc:[
    {t:'🌿 Regla básica muscarínica',i:['M₁ → SNC + gástrico (Gq)','M₂ → corazón: bradicardia (Gi)','M₃ → liso + glándulas (Gq)','M₄ → motora basal (Gi)','M₅ → cerebrovascular (Gq)']},
    {t:'💊 Atropina: bloqueo muscarínico global',i:['Taquicardia (bloqueo M₂)','Midriasis + cicloplejía (M₃ ocular)','Boca/piel seca (M₃ glandular)','Retención urinaria (M₃ detrusor)','🆘 Antídoto organofosforados: atropina + pralidoxima']},
    {t:'🫁 Tiotropio (LAMA) vs Ipratropio (SAMA)',i:['Ambos bloquean M₃ bronquial','Tiotropio: 1x/día, EPOC crónico','Ipratropio: 4x/día, asma/EPOC aguda']},
    {t:'🧠 Demencia y muscarínicos',i:['Déficit colinérgico en Alzheimer','Donepezilo/rivastigmina inhiben AChE → ↑ACh','Estimulan M₁ → mejora leve cognición']},
    {t:'🆕 Xanomelina-trospio (2024)',i:['Primer antipsicótico M₁/M₄ agonista','No bloquea D₂ → NO causa SEP','Revolución en esquizofrenia — FDA sept 2024']}
  ],
  nic:[
    {t:'🧬 Nm vs Nn',i:['Nm → placa neuromuscular (esquelético)','Nn → ganglios + suprarrenal + SNC','Ambos canales iónicos (EPSP rápido)']},
    {t:'💊 Bloqueantes Nm en anestesia',i:['Despolarizantes: succinilcolina (fasciculaciones, corta)','No despolarizantes: rocuronio, vecuronio','Reverso: neostigmina + glicopirrolato']},
    {t:'🔴 Miastenia gravis',i:['Ac anti-Nm en placa neuromuscular','Debilidad fluctuante, empeora con ejercicio','Tto: piridostigmina, corticoides, timectomía']},
    {t:'🚬 Cesación tabáquica',i:['Vareniclina = agonista parcial Nn α4β2','↓ ansia + bloquea refuerzo si fuma','Mayor éxito que TRN sola']}
  ],
  dop:[
    {t:'🎯 D1-like vs D2-like',i:['D1-like (D₁, D₅) → Gs → ↑AMPc','D2-like (D₂, D₃, D₄) → Gi → ↓AMPc','D₂ = blanco principal en antipsicóticos']},
    {t:'💊 SEP por antipsicóticos',i:['Bloqueo D₂ vía nigroestriada','Parkinsonismo, distonía, acatisia, disquinesia tardía','Haloperidol > risperidona > olanzapina','Atípicos bloquean 5-HT₂ₐ → menos SEP']},
    {t:'💊 Hiperprolactinemia',i:['Vía tuberoinfundibular: DA inhibe PRL','Bloqueo D₂ → galactorrea, amenorrea','Risperidona, haloperidol alto riesgo','Aripiprazol bajo riesgo']},
    {t:'🫀 Dopamina según dosis',i:['1-3 μg/kg/min → D₁: vasodilatación renal','3-10 → β₁: inotrópico','>10 → α₁: vasoconstrictor','Hoy se prefiere NE en shock séptico']},
    {t:'🔄 Parkinson',i:['L-DOPA + carbidopa (bloquea DDC periférica)','Pramipexol, ropinirol = agonistas D₂/D₃','iMAO-B (selegilina) → ↓ degradación','Problemas: fluctuaciones, disquinesias']},
    {t:'🤢 Domperidona vs metoclopramida',i:['Ambas bloquean D₂ en ZQT','Domperidona NO cruza BHE → menos SEP','Ambas prolongan QT → precaución']}
  ],
  sero:[
    {t:'💫 Familia 5-HT',i:['5-HT₁ → Gi (autorreceptor)','5-HT₂ → Gq (alucinógenos, saciedad)','5-HT₃ → canal iónico (vómito)','5-HT₄/6/7 → Gs (procinético)']},
    {t:'🤕 Triptanes en migraña',i:['Agonistas 5-HT₁B/D → vasoconstricción craneal','Sumatriptán, rizatriptán, eletriptán','Contraindicados: cardiopatía isquémica','Adversos: opresión torácica, parestesias']},
    {t:'🤢 Setrones en quimioterapia',i:['Antagonistas 5-HT₃ → previenen NVPQ','Ondansetrón 8 mg, granisetrón, palonosetrón','Combinar con dexametasona + aprepitant']},
    {t:'😰 Síndrome serotoninérgico',i:['Exceso 5-HT: ISRS + IMAO + tramadol','Tríada: mental + autonómica + neuromuscular','Tto: suspender, BZD, ciproheptadina']},
    {t:'💊 Antipsicóticos atípicos',i:['Bloqueo D₂ + 5-HT₂ₐ → menos SEP','Clozapina: resistentes (agranulocitosis)','Aripiprazol: agonista parcial D₂']},
    {t:'🍽️ 5-HT₂c y apetito',i:['Activación → saciedad (lorcaserina retirada)','Bloqueo (mirtazapina) → ↑apetito','Útil en depresión con anorexia']}
  ],
  hist:[
    {t:'🔥 H₁ 1ª vs 2ª generación',i:['1ª gen (difenhidramina, clorfeniramina) → cruzan BHE → sedación','2ª gen (loratadina, cetirizina) → no cruzan → no sedantes','Hidroxizina: sedación deliberada']},
    {t:'🆘 Anafilaxia',i:['H₁ + H₂ + mastocitos → vasodilatación + broncoespasmo','ADRENALINA IM = tto fundamental','Adyuvantes: corticoides, antihistamínicos','Oxígeno + líquidos IV']},
    {t:'🔥 H₂ y ácido gástrico',i:['H₂ → Gs → ↑AMPc → bomba H⁺/K⁺ → HCl','Famotidina (ranitidina retirada por NDMA)','IBP más potentes']},
    {t:'😴 H₃ y narcolepsia',i:['H₃ autorreceptor','Pitolisant → ↑ histamina → ↑ vigilia','Alternativa a modafinilo']},
    {t:'🔬 H₄ en investigación',i:['En células inmunes','Antagonistas en estudio: asma, dermatitis atópica','Sin fármacos aprobados aún']}
  ],
  opi:[
    {t:'☯️ Los 3 principales',i:['μ (MOR) → analgesia + euforia + depresión respiratoria','κ (KOR) → analgesia espinal + DISFORIA','δ (DOR) → modulación afectiva, investigación']},
    {t:'🆘 Intoxicación opioide',i:['Tríada: miosis + depresión respiratoria + coma','Naloxona IV/IM/nasal → revierte en 1-2 min','Vida media naloxona < morfina → re-dosificar']},
    {t:'💊 Dolor crónico oncológico',i:['Escalera OMS: paracetamol → tramadol → morfina','Parches fentanilo: dolor estable','Metadona: tolerancia, cuidado QT','Siempre laxantes (constipación)']},
    {t:'🔄 Tratamiento de adicción',i:['Metadona: agonista μ larga duración','Buprenorfina/naloxona (Suboxone)','Naltrexona (VO o LAI)','Todas reducen mortalidad']},
    {t:'🌡️ Tramadol: cuidados',i:['μ débil + IRSN','Riesgo: síndrome serotoninérgico','Convulsiones en dosis altas']}
  ],
  glu:[
    {t:'🧠 Principal excitador del SNC',i:['Glutamato = NT más abundante','Ionotrópicos: NMDA, AMPA, Kainato','Metabotrópicos: mGluR I-III','Exceso → excitotoxicidad']},
    {t:'💊 Ketamina',i:['Antagonista NMDA','Anestesia disociativa sin depresión respiratoria','Esketamina nasal FDA 2019 para depresión resistente']},
    {t:'🧠 LTP y memoria',i:['NMDA bloqueado por Mg²⁺ en reposo','Despolarización + Glu + glicina → abre','↑Ca²⁺ → plasticidad sináptica']},
    {t:'🧓 Memantina en Alzheimer',i:['Antagonista NMDA moderado','Bloquea excitotoxicidad','Combina con donepezilo']},
    {t:'⚡ Excitotoxicidad',i:['ACV, TCE → glutamato masivo','Ca²⁺ masivo → muerte neuronal','Perampanel (AMPA) → epilepsia']}
  ],
  gaba:[
    {t:'😴 Principal inhibidor del SNC',i:['GABAᴀ → canal Cl⁻ (rápida)','GABAʙ → Gi (lenta)','Balance Glu/GABA crítico']},
    {t:'💊 Benzodiazepinas',i:['Moduladores alostéricos GABAᴀ','Ansiolítico + sedante + anticonvulsivo + relajante','Corta (midazolam), intermedia (lorazepam), larga (diazepam)','Antídoto: FLUMAZENIL']},
    {t:'⚠️ Barbitúricos',i:['↑ duración apertura GABAᴀ','Dosis altas activan canal sin GABA → letal','Usos: fenobarbital (epilepsia), tiopental (anestesia)']},
    {t:'💊 Baclofeno',i:['Agonista GABAʙ','EM, lesión medular','Intratecal en refractarios']},
    {t:'🍺 Abstinencia alcohólica',i:['Alcohol potencia GABAᴀ crónicamente','Al retirar: ↓GABA + ↑NMDA → hiperexcitabilidad','Temblor → convulsiones → delirium tremens','Tto: BZD, tiamina']}
  ],
  cb:[
    {t:'🌱 CB₁ (SNC) vs CB₂ (periferia)',i:['CB₁: cerebro → psicoactivo','CB₂: inmunes, piel, hueso → antiinflamatorio','THC ambos; CBD preferencial CB₂']},
    {t:'💊 Endocannabinoides',i:['Anandamida, 2-AG','Síntesis postsináptica "on demand"','Mensajeros RETRÓGRADOS (único)','Modulan dolor, apetito, humor']},
    {t:'💊 Epidiolex (CBD)',i:['Primera aprobación FDA (2018) de cannabis','Dravet, Lennox-Gastaut, esclerosis tuberosa','Epilepsias infantiles refractarias']},
    {t:'⚠️ Rimonabant',i:['Antagonista CB₁ aprobado para obesidad (2006)','Retirado 2008: ideación suicida','Rol del endocannabinoide en humor']},
    {t:'🇧🇴 Cannabis medicinal',i:['Nabiximols (Sativex): espasticidad EM','Dronabinol: caquexia VIH, náusea quimio','Bolivia: no aprobado aún']}
  ]
};

// ═══════════════════════════════════════════════════════
// PROTEIN G SUMMARY
// ═══════════════════════════════════════════════════════
export const RECEPTOR_PROT_G = [
  {name:'Gq',color:'#f472b6',desc:'Activa PLC',result:'↑ IP₃ → ↑ Ca²⁺ + DAG',receptors:'α₁ · M₁ · M₃ · M₅ · H₁ · 5-HT₂'},
  {name:'Gi/o',color:'#fb923c',desc:'Inhibe adenilato ciclasa',result:'↓ AMPc + ↑K⁺ + ↓Ca²⁺',receptors:'α₂ · M₂ · M₄ · D₂ · μ · κ · δ · H₃ · H₄ · GABAʙ · 5-HT₁ · CB'},
  {name:'Gs',color:'#60a5fa',desc:'Activa adenilato ciclasa',result:'↑ AMPc → PKA',receptors:'β₁ · β₂ · β₃ · D₁ · H₂ · 5-HT₄'},
  {name:'Canal iónico',color:'#34d399',desc:'Ionotrópico directo',result:'Flujo iónico rápido',receptors:'Nm · Nn · 5-HT₃ · NMDA · AMPA · GABAᴀ'}
];

