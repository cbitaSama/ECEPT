// Physiology: adrenergic receptors
var FISIO_RECEPTORS=[
  {
    id: 'a1',
    symbol: 'α₁',
    letter: 'α',
    sub: '1',
    name: 'Alfa-1',
    color: '#f472b6',
    colorBg: 'rgba(244,114,182,.08)',
    protein: 'Gq',
    messenger: ['↑ IP₃', '↑ DAG', '↑ Ca²⁺'],
    net: 'Excitatorio / Contracción',
    pathway: [
      { label: 'NE / Epi' },
      { label: 'Receptor α₁' },
      { label: 'Gq' },
      { label: '↑ PLC' },
      { label: '↑ IP₃ + DAG' },
      { label: '↑ Ca²⁺ intracelular' },
      { label: 'CONTRACCIÓN' }
    ],
    effects: [
      { tissue: 'Músculo liso vascular', dir: '↑', desc: 'Vasoconstricción → ↑ RVP → ↑ PA' },
      { tissue: 'Músculo liso genitourinario', dir: '↑', desc: 'Contracción (próstata, vejiga) → relevante en HBP' },
      { tissue: 'Músculo liso intestinal', dir: '↓', desc: 'Relajamiento (inhibe peristaltismo)' },
      { tissue: 'Corazón', dir: '↑', desc: '↑ Inotropismo y excitabilidad' },
      { tissue: 'Hígado', dir: '↑', desc: 'Glucogenólisis y gluconeogénesis → ↑ glucemia' },
    ],
    clinical: 'Bloqueadores α₁ (ej. prazosina, tamsulosina): usados en hipertensión y HBP. Prazosina = anti-HTA. Tamsulosina = selectiva próstata (HBP), menor efecto vascular.',
    drugs: [
      { name: 'Prazosina', role: 'Bloqueador α₁', use: 'HTA', color: '#f472b6' },
      { name: 'Tamsulosina', role: 'Bloqueador α₁ selectivo', use: 'HBP', color: '#fb923c' },
      { name: 'Fenilefrina', role: 'Agonista α₁', use: 'Descongestivo / vasopressor', color: '#ef4444' },
    ]
  },
  {
    id: 'a2',
    symbol: 'α₂',
    letter: 'α',
    sub: '2',
    name: 'Alfa-2',
    color: '#fb923c',
    colorBg: 'rgba(251,146,60,.08)',
    protein: 'Gi',
    messenger: ['↓ AMPc', 'Inhibición'],
    net: 'Inhibitorio / Autorreceptor',
    pathway: [
      { label: 'NE / Epi' },
      { label: 'Receptor α₂' },
      { label: 'Gi' },
      { label: '↓ Adenilato ciclasa' },
      { label: '↓ AMPc' },
      { label: 'INHIBICIÓN' }
    ],
    effects: [
      { tissue: 'Nervio presináptico', dir: '↓', desc: 'Autorreceptor: ↓ liberación de norepinefrina (feedback negativo)' },
      { tissue: 'Células β pancreáticas', dir: '↓', desc: '↓ Secreción de insulina' },
      { tissue: 'Plaquetas', dir: '↑', desc: 'Agregación plaquetaria' },
      { tissue: 'Músculo liso vascular', dir: '↑', desc: 'Contracción (vasocontricción periférica)' },
      { tissue: 'SNC (locus coeruleus)', dir: '↓', desc: '↓ Tono simpático central → efecto antihipertensivo central' },
    ],
    clinical: 'Agonistas α₂ (ej. clonidina, metildopa): ↓ tono simpático central → usados en hipertensión. Metildopa = ELECCIÓN en HTA del embarazo. Clonidina también útil en abstinencia a opioides y TDAH.',
    drugs: [
      { name: 'Clonidina', role: 'Agonista α₂', use: 'HTA / abstinencia opioides / TDAH', color: '#fb923c' },
      { name: 'Metildopa', role: 'Agonista α₂', use: 'HTA en embarazo (1ª elección)', color: '#f472b6' },
    ]
  },
  {
    id: 'b1',
    symbol: 'β₁',
    letter: 'β',
    sub: '1',
    name: 'Beta-1',
    color: '#60a5fa',
    colorBg: 'rgba(96,165,250,.08)',
    protein: 'Gs',
    messenger: ['↑ AMPc', '↑ Ca²⁺ intracelular'],
    net: 'Excitatorio cardiaco',
    pathway: [
      { label: 'NE / Epi' },
      { label: 'Receptor β₁' },
      { label: 'Gs' },
      { label: '↑ Adenilato ciclasa' },
      { label: '↑ AMPc → PKA' },
      { label: '↑ Ca²⁺ → CONTRACCIÓN' }
    ],
    effects: [
      { tissue: 'Corazón (nódulo SA)', dir: '↑', desc: '↑ Cronotropismo → ↑ FC' },
      { tissue: 'Corazón (miocardio)', dir: '↑', desc: '↑ Inotropismo → ↑ fuerza contráctil' },
      { tissue: 'Corazón (nódulo AV)', dir: '↑', desc: '↑ Dromotropismo → ↑ velocidad de conducción' },
      { tissue: 'Riñón (cel. yuxtaglomerulares)', dir: '↑', desc: '↑ Secreción de renina → ↑ SRAA → ↑ PA' },
    ],
    clinical: 'β₁-bloqueadores (ej. metoprolol, atenolol): ↓ FC, ↓ demanda de O₂. Útiles en IAM, ICC, arritmias. Metoprolol y atenolol = cardioselectivos (β₁ > β₂). Carvedilol = no selectivo (β₁ + β₂ + α₁).',
    drugs: [
      { name: 'Metoprolol', role: 'β₁-bloqueador cardioselectivo', use: 'IAM / ICC / Arritmias / HTA', color: '#60a5fa' },
      { name: 'Atenolol', role: 'β₁-bloqueador cardioselectivo', use: 'HTA / Angina', color: '#38bdf8' },
      { name: 'Carvedilol', role: 'β₁+β₂+α₁ bloqueador', use: 'ICC / Post-IAM', color: '#818cf8' },
      { name: 'Dobutamina', role: 'Agonista β₁', use: 'Shock cardiogénico / Insuficiencia cardíaca aguda', color: '#34d399' },
    ]
  },
  {
    id: 'b2',
    symbol: 'β₂',
    letter: 'β',
    sub: '2',
    name: 'Beta-2',
    color: '#34d399',
    colorBg: 'rgba(52,211,153,.08)',
    protein: 'Gs',
    messenger: ['↑ AMPc', 'Relajación músculo liso'],
    net: 'Broncodilatador / Tocolítico',
    pathway: [
      { label: 'Epi (principalmente)' },
      { label: 'Receptor β₂' },
      { label: 'Gs' },
      { label: '↑ AMPc → PKA' },
      { label: 'Fosforila miosina kinasa' },
      { label: 'RELAJACIÓN músculo liso' }
    ],
    effects: [
      { tissue: 'Músculo liso bronquial', dir: '↓', desc: 'Broncodilatación → tto de asma/EPOC' },
      { tissue: 'Músculo liso uterino', dir: '↓', desc: 'Relajación → efecto tocolítico (frena contracciones)' },
      { tissue: 'Músculo liso vascular', dir: '↓', desc: 'Vasodilatación (musculoesquelético, coronario)' },
      { tissue: 'Hígado', dir: '↑', desc: 'Glucogenólisis y gluconeogénesis → ↑ glucemia' },
      { tissue: 'Músculo esquelético', dir: '↑', desc: 'Glucogenólisis + ↑ captación de K⁺ (K⁺ entra a células → ↓ K⁺ sérico)' },
    ],
    clinical: 'Agonistas β₂ (ej. salbutamol, terbutalina): SABA — usados en asma aguda, EPOC. Formoterol/Salmeterol = LABA (larga duración). Efecto secundario: hipokalemia, temblor, taquicardia refleja.',
    drugs: [
      { name: 'Salbutamol', role: 'Agonista β₂ (SABA)', use: 'Asma aguda / EPOC / Tocolítico', color: '#34d399' },
      { name: 'Terbutalina', role: 'Agonista β₂', use: 'Asma / Tocolítico (inhibe contracciones parto prematuro)', color: '#10b981' },
      { name: 'Formoterol', role: 'Agonista β₂ (LABA)', use: 'Asma crónica / EPOC', color: '#6ee7b7' },
    ]
  },
  {
    id: 'b3',
    symbol: 'β₃',
    letter: 'β',
    sub: '3',
    name: 'Beta-3',
    color: '#a78bfa',
    colorBg: 'rgba(167,139,250,.08)',
    protein: 'Gs',
    messenger: ['↑ AMPc'],
    net: 'Lipólisis / Vejiga',
    pathway: [
      { label: 'NE / Epi' },
      { label: 'Receptor β₃' },
      { label: 'Gs' },
      { label: '↑ AMPc → PKA' },
      { label: 'Activa lipasa hormonosensible' },
      { label: 'LIPÓLISIS' }
    ],
    effects: [
      { tissue: 'Tejido adiposo', dir: '↑', desc: 'Lipólisis → liberación de ácidos grasos libres' },
      { tissue: 'Músculo detrusor (vejiga)', dir: '↓', desc: 'Relajación del detrusor → ↑ capacidad vesical' },
      { tissue: 'Músculo liso vascular', dir: '↓', desc: 'Vasodilatación (efecto menor vs β₂)' },
    ],
    clinical: 'β₃ agonistas (ej. mirabegrón): usados en vejiga hiperactiva (urgencia, frecuencia, incontinencia). Ventaja vs antimuscarínicos: menor boca seca y retención urinaria.',
    drugs: [
      { name: 'Mirabegrón', role: 'Agonista β₃ selectivo', use: 'Vejiga hiperactiva', color: '#a78bfa' },
    ]
  }
];
var FISIO_QUIZ=[
  {
    q: '¿Qué proteína G está acoplada al receptor α₁ adrenérgico?',
    opts: ['Gi (inhibe AMPc)', 'Gs (activa AMPc)', 'Gq (activa PLC/IP₃)', 'G12/13 (Rho)'],
    r: 2,
    x: 'α₁ → Gq → ↑PLC → ↑IP₃ + DAG → ↑Ca²⁺ intracelular → contracción. Esta es la vía clásica de vasoconstricción.'
  },
  {
    q: '¿Cuál es el mecanismo de acción de la metildopa en la hipertensión arterial?',
    opts: ['Bloquea α₁ periférico reduciendo vasoconstricción', 'Es agonista α₂ central que reduce el tono simpático', 'Inhibe la enzima convertidora de angiotensina', 'Bloquea β₁ reduciendo el gasto cardíaco'],
    r: 1,
    x: 'Metildopa → agonista α₂ central (locus coeruleus) → ↓ tono simpático → ↓ PA. Es el antihipertensivo de elección en el embarazo.'
  },
  {
    q: 'Un paciente con asma aguda recibe salbutamol. ¿Cuál es el receptor y vía exacta que produce broncodilatación?',
    opts: ['β₁ → Gs → ↑AMPc → contracción bronquial', 'β₂ → Gs → ↑AMPc → relajación músculo liso bronquial', 'α₂ → Gi → ↓AMPc → broncodilatación', 'β₂ → Gq → ↑Ca²⁺ → relajación'],
    r: 1,
    x: 'Salbutamol activa β₂ → Gs → ↑AMPc → PKA → fosforila miosina kinasa → relajación músculo liso bronquial = broncodilatación. Es un SABA (Short-Acting Beta Agonist).'
  },
  {
    q: '¿Por qué los β₁-bloqueadores como metoprolol son "cardioselectivos"?',
    opts: ['Porque bloquean exclusivamente α₁ en el corazón', 'Porque tienen mayor afinidad por β₁ (corazón/riñón) que por β₂ (pulmón)', 'Porque son agonistas parciales de β₂ que protegen el pulmón', 'Porque inhiben la síntesis de catecolaminas en la médula adrenal'],
    r: 1,
    x: 'Cardioselectivos = mayor afinidad β₁ vs β₂. β₁ está principalmente en corazón y riñón. Así se evita broncoespasmo (β₂ pulmonar). PERO no son 100% selectivos a dosis altas. Atenolol y metoprolol son los ejemplos clásicos.'
  },
  {
    q: '¿Por qué el agonismo β₂ puede producir hipokalemia?',
    opts: ['Porque activa aldosterona que excreta K⁺ renal', 'Porque estimula la Na/K-ATPasa en músculo esquelético llevando K⁺ al interior celular', 'Porque inhibe la reabsorción de K⁺ en el túbulo distal renal', 'Porque aumenta la pérdida de K⁺ por sudoración'],
    r: 1,
    x: 'β₂ → ↑AMPc → activa Na/K-ATPasa en músculo esquelético → K⁺ entra a la célula → ↓ K⁺ sérico (hipokalemia). Efecto adverso relevante del salbutamol a altas dosis o vía IV.'
  },
  {
    q: '¿Cuál es el receptor adrenérgico cuyos agonistas se usan para vejiga hiperactiva?',
    opts: ['α₁', 'α₂', 'β₁', 'β₃'],
    r: 3,
    x: 'β₃ → Gs → ↑AMPc → relajación del músculo detrusor vesical → ↑ capacidad vesical. Mirabegrón es el agonista β₃ aprobado para vejiga hiperactiva, con ventajas sobre antimuscarínicos.'
  }
];
var FISIO_PERLAS=[
{t:"Regla de los 3 Gs (memorizar proteínas)",ic:"⚡",items:["Gq → Q de Quema (activa, Ca²⁺ → contracción) → α₁, M₁, M₃, H₁","Gi → i de inhibe (↓AMPc) → α₂, M₂, D₂, opioides","Gs → s de Sube (↑AMPc) → β₁, β₂, β₃, D₁, H₂"]},
{t:"α₁-Bloqueadores: prazosina vs tamsulosina",ic:"💊",items:["Prazosina → antihipertensivo (NO selectiva próstata) → hipotensión 1ª dosis","Tamsulosina → uroSelectiva (próstata) → HBP, MENOS efecto vascular","📌 Pregunta frecuente: ¿cuál usás si tiene HBP? → Tamsulosina"]},
{t:"Metildopa = HTA en embarazo",ic:"🤰",items:["Metildopa es la primera línea en HTA del embarazo por perfil de seguridad","Mecanismo: agonista α₂ central → ↓ tono simpático","📌 Segunda opción: labetalol IV (emergencia hipertensiva obstétrica)"]},
{t:"β₂ agonistas: SABA vs LABA",ic:"🫁",items:["SABA (Short-Acting): Salbutamol, Terbutalina — inicio rápido, ~4-6h — RESCATE","LABA (Long-Acting): Formoterol, Salmeterol — 12h — MANTENIMIENTO (NO usar solos en asma)","📌 Efecto adverso importante: hipokalemia (β₂ → K⁺ entra a célula)"]},
{t:"β₁-bloqueadores cardioselectivos vs no selectivos",ic:"❤️",items:["Cardioselectivos (β₁ > β₂): Metoprolol, Atenolol, Bisoprolol","No selectivos (β₁ + β₂): Propranolol, Carvedilol (+ α₁), Labetalol (+ α₁)","⚠️ β-bloqueadores NO selectivos → broncoespasmo en asmáticos"]},
{t:"Autorreceptor α₂: feedback negativo simpático",ic:"🧠",items:["α₂ presináptico = freno automático: mucha NE → activa α₂ → Gi → ↓AMPc → ↓ liberación de más NE","Clonidina lo activa centralmente → ↓ tono simpático global","📌 Retiro abrupto de clonidina → HTA de rebote (crisis hipertensiva)"]},
{t:"Mirabegrón (β₃): ventaja vs antimuscarínicos",ic:"🫧",items:["Vejiga hiperactiva: antes solo antimuscarínicos (oxibutinina) → boca seca, constipación, confusión ancianos","Mirabegrón (β₃ agonista) → relaja detrusor sin bloquear muscarínicos → menos efectos adversos"]}
];
var FISIO_COMPARISON=[
{receptor:"α₁",prot:"Gq",msg:"↑ IP₃, DAG, Ca²⁺",efecto:"Vasoconstricción",farmacos:["Prazosina","Tamsulosina"],col:"#f472b6"},
{receptor:"α₂",prot:"Gi",msg:"↓ AMPc",efecto:"Autorreceptor / ↓ tono simpático",farmacos:["Clonidina","Metildopa"],col:"#fb923c"},
{receptor:"β₁",prot:"Gs",msg:"↑ AMPc, ↑ Ca²⁺",efecto:"↑ FC, ↑ contractilidad, ↑ renina",farmacos:["Metoprolol","Atenolol"],col:"#60a5fa"},
{receptor:"β₂",prot:"Gs",msg:"↑ AMPc",efecto:"Broncodilatación, tocolisis",farmacos:["Salbutamol","Terbutalina"],col:"#34d399"},
{receptor:"β₃",prot:"Gs",msg:"↑ AMPc",efecto:"Lipólisis, relajación detrusor",farmacos:["Mirabegrón"],col:"#a78bfa"}
];
var FISIO_PROTEINAS_G=[
{name:"Gq",color:"#f472b6",desc:"Activa PLC",result:"↑ IP₃ → ↑ Ca²⁺ intracelular",receptors:"α₁, H₁, M₁, M₃"},
{name:"Gi",color:"#fb923c",desc:"Inhibe adenilato ciclasa",result:"↓ AMPc",receptors:"α₂, M₂, D₂, μ-opioide"},
{name:"Gs",color:"#60a5fa",desc:"Activa adenilato ciclasa",result:"↑ AMPc → PKA",receptors:"β₁, β₂, β₃, D₁, H₂"}
];


