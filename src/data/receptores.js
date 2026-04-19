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
