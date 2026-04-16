/* Vocabulario Médico v4 — native data
   Mirrors artifacts/vocabulario_medico_v4.html byte-for-byte
   (Spanish medical content is sacred).

   Arrays:
     VOC   — 373 morpheme entries (14 categories)
     CATS  — 14 category definitions
     DEMOS — 10 decomposition demos (Neck, Heart, Abd, + 7 word demos)
     TIPO  — prefix/suffix/term type → label+color mapping
*/

var VOCAB_CATS = [
  {id:"quir", n:"Acción Quirúrgica",        i:"🔪", c:"#f472b6", d:"Qué se le hace al tejido"},
  {id:"diag", n:"Diagnóstico & Observación",i:"🔬", c:"#60a5fa", d:"Ver, medir, evaluar"},
  {id:"pato", n:"Patología & Lesión",       i:"🧬", c:"#a78bfa", d:"Tipos de enfermedad"},
  {id:"col",  n:"Colores Celulares",        i:"🎨", c:"#06b6d4", d:"Leuco, eritro, melano..."},
  {id:"sang", n:"Sangre & Vasos",           i:"🩸", c:"#ef4444", d:"Hematología y vascular"},
  {id:"org",  n:"Raíces de Órganos",        i:"🫀", c:"#fb7185", d:"Prefijos anatómicos"},
  {id:"gu",   n:"Genitourinario",           i:"💧", c:"#0891b2", d:"Riñón, vejiga, genitales"},
  {id:"endo", n:"Endocrino & Glándulas",    i:"⚗️", c:"#d946ef", d:"Adeno, tiro, insulino..."},
  {id:"func", n:"Función & Estado",         i:"⚖️", c:"#fbbf24", d:"Cómo funciona algo"},
  {id:"loc",  n:"Localización & Dirección", i:"🧭", c:"#34d399", d:"Dónde y hacia dónde"},
  {id:"med",  n:"Medición & Cantidad",      i:"📊", c:"#fb923c", d:"Mucho, poco, grande, chico"},
  {id:"cel",  n:"Células & Tejidos",        i:"🦠", c:"#84cc16", d:"-cito, -blasto, -fito"},
  {id:"quim", n:"Moléculas & Química",      i:"💠", c:"#8b5cf6", d:"Lip, glic, sacar, proteo..."},
  {id:"term", n:"Términos Clínicos",        i:"📖", c:"#e879f9", d:"Palabras médicas completas"}
];

var VOCAB_TIPO = {
  s: {l:"Sufijo",  c:"#60a5fa"},
  p: {l:"Prefijo", c:"#fbbf24"},
  w: {l:"Término", c:"#e879f9"}
};

/* DEMOS — 10 interactive decomposition examples with SVG renderers */
var VOCAB_DEMOS = [
  {id:"ecm", w:"Esternocleidomastoideo",
   sub:"Las 3 inserciones del músculo, escritas en el nombre",
   type:"neck",
   p:[
     {s:"Esterno-",   m:"Esternón",                c:"#f472b6", d:"Inserción inferior medial"},
     {s:"-cleido-",   m:"Clavícula (gr. kleís)",    c:"#fbbf24", d:"Inserción inferior lateral"},
     {s:"-mastoideo", m:"Apófisis mastoides",       c:"#60a5fa", d:"Inserción superior"}
   ],
   rev:"Un músculo que va del esternón y la clavícula hasta la mastoides. El nombre TE DICE dónde se inserta. No memorizas: deduces."},

  {id:"heart", w:"Peri·mio·endo·cardio",
   sub:"Las 3 capas del corazón de fuera hacia dentro",
   type:"heart",
   p:[
     {s:"Peri-", m:"Alrededor (fuera)", c:"#f472b6", d:"Saco pericárdico"},
     {s:"Mio-",  m:"Músculo (medio)",   c:"#ef4444", d:"Capa muscular cardíaca"},
     {s:"Endo-", m:"Dentro (interior)", c:"#60a5fa", d:"Capa endotelial interna"}
   ],
   rev:"Peri = afuera. Mio = músculo. Endo = adentro. Mismo prefijo, distintas capas: pericardio, miocardio, endocardio."},

  {id:"abd", w:"Hipo·gastrio / Meso·gastrio / Epi·gastrio",
   sub:"Las 3 regiones del abdomen según la altura del estómago",
   type:"abd",
   p:[
     {s:"Epi-",  m:"Sobre (arriba)", c:"#60a5fa", d:"Por encima del estómago"},
     {s:"Meso-", m:"En medio",       c:"#fbbf24", d:"Zona umbilical"},
     {s:"Hipo-", m:"Debajo",         c:"#ef4444", d:"Debajo del estómago"}
   ],
   rev:"Gastrio = estómago. Con un prefijo de localización ya nombras las 3 regiones centrales del abdomen."},

  {id:"colecist", w:"Cole·cist·ectomía",
   sub:"La cirugía más común de abdomen, decodificada",
   type:"word",
   p:[
     {s:"Cole-",    m:"Bilis",        c:"#fbbf24", d:"Órgano relacionado con la bilis"},
     {s:"-cist-",   m:"Saco / vejiga",c:"#a78bfa", d:"El saco de la bilis = vesícula"},
     {s:"-ectomía", m:"Extirpación",  c:"#f472b6", d:"Sacar el órgano"}
   ],
   rev:"Extirpación del saco de la bilis → retirar la vesícula biliar."},

  {id:"eeg", w:"Electro·encefalo·grafía",
   sub:"Palabra larga, lógica clara",
   type:"word",
   p:[
     {s:"Electro-",  m:"Eléctrico", c:"#fbbf24", d:"Señal eléctrica"},
     {s:"-encefalo-",m:"Cerebro",   c:"#a78bfa", d:"Ubicación de la señal"},
     {s:"-grafía",   m:"Registrar", c:"#60a5fa", d:"Técnica de registro"}
   ],
   rev:"Técnica que registra la actividad eléctrica del cerebro → EEG."},

  {id:"pielo", w:"Pielo·nefr·itis",
   sub:"Con la raíz sabes qué órgano está infectado",
   type:"word",
   p:[
     {s:"Pielo-", m:"Pelvis renal", c:"#34d399", d:"La pelvis del riñón"},
     {s:"-nefr-", m:"Riñón",        c:"#fb7185", d:"El parénquima renal"},
     {s:"-itis",  m:"Inflamación",  c:"#ef4444", d:"Proceso inflamatorio"}
   ],
   rev:"Inflamación/infección que afecta pelvis + riñón → pielonefritis aguda. Por eso duele el flanco y da fiebre."},

  {id:"hepato", w:"Hepato·espleno·megalia",
   sub:"Tres partes, un solo hallazgo",
   type:"word",
   p:[
     {s:"Hepato-",  m:"Hígado",        c:"#fb7185", d:"Órgano 1"},
     {s:"-espleno-",m:"Bazo",          c:"#a78bfa", d:"Órgano 2"},
     {s:"-megalia", m:"Agrandamiento", c:"#fbbf24", d:"Ambos aumentados de tamaño"}
   ],
   rev:"Hígado + bazo aumentados. Se palpa en mononucleosis, cirrosis, linfoma, leishmaniasis."},

  {id:"otorhino", w:"Oto·rino·laringo·logía",
   sub:"La especialidad cuyo nombre es su mapa",
   type:"word",
   p:[
     {s:"Oto-",     m:"Oído",    c:"#60a5fa", d:"👂"},
     {s:"-rino-",   m:"Nariz",   c:"#fbbf24", d:"👃"},
     {s:"-laringo-",m:"Laringe", c:"#ef4444", d:"Garganta / voz"},
     {s:"-logía",   m:"Estudio", c:"#34d399", d:"La ciencia"}
   ],
   rev:"Una sola palabra te dice: es el médico del oído + nariz + laringe. ORL."},

  {id:"oligo", w:"Oligo·uria / Poli·uria / An·uria",
   sub:"Tres cantidades de orina con un cambio de prefijo",
   type:"word",
   p:[
     {s:"Oligo-", m:"Poco",    c:"#fbbf24", d:"<400 ml/día"},
     {s:"Poli-",  m:"Mucho",   c:"#34d399", d:">3000 ml/día"},
     {s:"An-",    m:"Ninguno", c:"#ef4444", d:"<100 ml/día"}
   ],
   rev:"La raíz -uria (orina) no cambia. Cambias el prefijo y nombras las 3 alteraciones del volumen urinario."},

  {id:"hemi", w:"Hemi·plejia / Hemi·paresia / Hemi·anopsia",
   sub:"'La mitad' define la semiología neurológica",
   type:"word",
   p:[
     {s:"Hemi-",    m:"Mitad",           c:"#a78bfa", d:"Un lado del cuerpo"},
     {s:"-plejia",  m:"Parálisis total", c:"#ef4444", d:"No se mueve"},
     {s:"-paresia", m:"Debilidad",       c:"#fbbf24", d:"Se mueve pero flojo"},
     {s:"-anopsia", m:"Pérdida visual",  c:"#60a5fa", d:"No ve ese lado"}
   ],
   rev:"Hemi = mitad. Un ACV produce hemiplejia, hemiparesia o hemianopsia según qué afecta y cuánto."}
];

/* VOC array — populated by category-batch appends in subsequent commits */
var VOCAB_VOC = [];

/* === VOC batch 1: quir (12) + diag (10) + pato (32) = 54 entries === */
VOCAB_VOC.push.apply(VOCAB_VOC, [
/* quir */
{cat:"quir",t:"s",tx:"-tomía",or:"Griego: tomḗ (corte)",sig:"Corte o incisión. Abrir para acceder sin extirpar.",ej:["Laparotomía → apertura del abdomen","Craneotomía → apertura del cráneo","Toracotomía → tórax","Traqueotomía → incisión traqueal","Flebotomía → incisión venosa","Queratotomía → córnea","Esternotomía → esternón"],tip:"⚡ Solo CORTA. No saca."},
{cat:"quir",t:"s",tx:"-ectomía",or:"Griego: ektomḗ (extirpación)",sig:"Extirpación quirúrgica de un órgano o estructura completa.",ej:["Apendicectomía → apéndice","Colecistectomía → vesícula biliar","Histerectomía → útero","Mastectomía → mama","Nefrectomía → riñón","Esplenectomía → bazo","Tiroidectomía → tiroides","Lobectomía → lóbulo (pulmón/hígado)"],tip:"💡 -ec- = fuera. Lo QUITA."},
{cat:"quir",t:"s",tx:"-stomía",or:"Griego: stóma (boca)",sig:"Crear una boca/abertura artificial permanente o temporal.",ej:["Colostomía → colon a la piel","Gastrostomía → acceso al estómago","Traqueostomía → tráquea","Ureterostomía → derivación urinaria","Ileostomía → abocar íleon","Yeyunostomía → yeyuno"],tip:"⚠️ NO confundir con -tomía. Aquí queda una BOCA."},
{cat:"quir",t:"s",tx:"-rrafia",or:"Griego: rhaphḗ (costura)",sig:"Sutura o costura quirúrgica para unir tejidos.",ej:["Herniorrafia → sutura de hernia","Gastrorrafia → sutura gástrica","Perineorrafia → periné","Tenorrafia → tendón","Neurorrafia → nervio","Enterorrafia → intestino"],tip:"🪡 Aguja + hilo."},
{cat:"quir",t:"s",tx:"-plastia",or:"Griego: plastikós (modelar)",sig:"Reparación o reconstrucción quirúrgica.",ej:["Rinoplastia → nariz","Angioplastia → vaso","Artroplastia → articulación","Mamoplastia → mama","Otoplastia → oreja","Blefaroplastia → párpado","Vaginoplastia → vagina"],tip:"🛠️ Repara la FORMA."},
{cat:"quir",t:"s",tx:"-pexia",or:"Griego: pêxis (fijación)",sig:"Fijación quirúrgica en su posición correcta.",ej:["Orquidopexia → testículo","Nefropexia → riñón descendido","Histeropexia → útero","Colpopexia → vagina (prolapso)","Retinopexia → retina","Sacrocolpopexia"],tip:"📌 Lo ANCLA."},
{cat:"quir",t:"s",tx:"-desis",or:"Griego: désis (atadura)",sig:"Fusión permanente de dos superficies.",ej:["Artrodesis → fusión articular","Espondilodesis → fusión vertebral","Pleurodesis → adherir pleuras","Tenodesis → fijación tendinosa"],tip:"🔒 Inmoviliza fusionando."},
{cat:"quir",t:"s",tx:"-centesis",or:"Griego: kéntēsis (punción)",sig:"Punción para extraer líquido.",ej:["Paracentesis → ascitis","Toracocentesis → derrame pleural","Pericardiocentesis → taponamiento","Amniocentesis → líquido amniótico","Artrocentesis → articular","Culdocentesis → fondo de saco"],tip:"💉 Punción + aspiración."},
{cat:"quir",t:"s",tx:"-tripsia",or:"Griego: tríbein (triturar)",sig:"Trituración o fragmentación de cálculos.",ej:["Litotripsia → fragmentar cálculos","LEOC → extracorpórea con ondas de choque","Neurotripsia → aplastar nervio (histórico)"],tip:"💥 Rompe en pedazos."},
{cat:"quir",t:"s",tx:"-clasia",or:"Griego: klásis (fractura)",sig:"Fractura intencional para corrección.",ej:["Osteoclasia → fractura ósea quirúrgica","Onicoclasia → fractura ungueal"],tip:"🔨 Rompe para realinear."},
{cat:"quir",t:"s",tx:"-lisis",or:"Griego: lýsis (disolución)",sig:"Liberación, destrucción o disolución.",ej:["Adherenciólisis → liberar bridas","Hemólisis → destrucción eritrocitaria","Fibrinólisis → lisar coágulo","Electrólisis → con corriente","Trombólisis → disolver trombo","Osteólisis → destrucción ósea"],tip:"🧊→💧 Disolver / liberar."},
{cat:"quir",t:"s",tx:"-ectasia",or:"Griego: éktasis (dilatación)",sig:"Dilatación anormal o terapéutica.",ej:["Bronquiectasia → dilatación bronquial","Linfangiectasia → vasos linfáticos","Telangiectasia → capilares finos","Atelectasia → 'a-'+-ectasia = sin dilatación (colapso)"],tip:"🎈 Se ensancha (atel- = incompleto)."},
/* diag */
{cat:"diag",t:"s",tx:"-scopia",or:"Griego: skopéō (observar)",sig:"Exploración visual con instrumento óptico.",ej:["Endoscopia → ver por dentro","Laparoscopia → abdomen","Colonoscopia → colon","Broncoscopia → bronquios","Artroscopia → articulación","Otoscopia → oído","Cistoscopia → vejiga","Histeroscopia → útero"],tip:"👁️ Cámara + luz."},
{cat:"diag",t:"s",tx:"-grafía",or:"Griego: graphḗ (escritura)",sig:"Técnica de imagen: 'escribe' una imagen.",ej:["Radiografía → rayos X","Ecografía → ultrasonido","Mamografía → Rx mama","Angiografía → vasos","Tomografía → cortes","Urografía → vía urinaria","Resonancia magnética","Venografía","Linfografía"],tip:"📸 La TÉCNICA."},
{cat:"diag",t:"s",tx:"-grama",or:"Griego: grámma (dibujo/registro)",sig:"El resultado o registro gráfico.",ej:["Electrocardiograma (ECG)","Electroencefalograma (EEG)","Electromiograma (EMG)","Mielograma → médula ósea","Hemograma → recuento","Leucograma → leucocitos","Coagulograma","Ionograma → electrolitos"],tip:"📄 El PAPEL / resultado."},
{cat:"diag",t:"s",tx:"-metría",or:"Griego: métron (medida)",sig:"Medición cuantitativa.",ej:["Espirometría → pulmón","Audiometría → audición","Pelvimetría → pelvis","Optometría → visión","Densitometría → densidad ósea","Oximetría → SatO₂","Capnometría → CO₂","Calorimetría"],tip:"📏 Cuantifica."},
{cat:"diag",t:"s",tx:"-logía",or:"Griego: lógos (estudio)",sig:"Ciencia o estudio.",ej:["Cardiología","Neurología","Patología","Histología","Citología","Hematología","Reumatología","Semiología","Epidemiología"],tip:"📚 La especialidad."},
{cat:"diag",t:"s",tx:"-gnosis",or:"Griego: gnōsis (conocimiento)",sig:"Conocer / identificar.",ej:["Diagnóstico → a través del conocimiento","Pronóstico → conocimiento anticipado","Agnosia → incapacidad de reconocer"],tip:"🧠 Saber qué es."},
{cat:"diag",t:"s",tx:"-opsia",or:"Griego: ópsis (visión/vista)",sig:"Visión o examen visual.",ej:["Biopsia → examen de tejido vivo","Necropsia → examen de cadáver","Autopsia → 'verse a sí mismo'","Hemianopsia → pérdida de medio campo visual","Diplopía → doble visión"],tip:"👁️ Ver."},
{cat:"diag",t:"p",tx:"palp-",or:"Latín: palpare (tocar suavemente)",sig:"Palpación: exploración con las manos.",ej:["Palpación abdominal","Palpación tiroidea","Palpable vs no palpable","Masas palpables"],tip:"🤚 Tocar con las manos."},
{cat:"diag",t:"p",tx:"percu-",or:"Latín: percutere (golpear)",sig:"Percusión: golpear para escuchar resonancia.",ej:["Percusión torácica","Matidez → líquido o masa","Timpanismo → aire","Percusión hepática → borde superior"],tip:"🥁 Golpear para escuchar."},
{cat:"diag",t:"p",tx:"auscult-",or:"Latín: auscultare (escuchar)",sig:"Auscultación: escuchar con estetoscopio.",ej:["Auscultación cardíaca → 4 focos","Auscultación pulmonar → murmullo vesicular","Ruidos hidroaéreos (RHA)","Auscultar soplos"],tip:"🩺 Escuchar."},
/* pato */
{cat:"pato",t:"s",tx:"-itis",or:"Griego: -îtis (inflamación)",sig:"Inflamación de una estructura.",ej:["Apendicitis","Meningitis","Gastritis","Artritis","Pancreatitis","Tiroiditis","Flebitis","Tendinitis","Otitis","Conjuntivitis"],tip:"🔥 Dolor+rubor+calor+tumor."},
{cat:"pato",t:"s",tx:"-osis",or:"Griego: -ōsis (condición/proceso)",sig:"Proceso patológico NO inflamatorio, crónico o degenerativo.",ej:["Artrosis → degeneración","Cirrosis → fibrosis hepática","Necrosis → muerte celular","Fibrosis","Estenosis → estrechamiento","Trombosis","Acidosis → pH bajo","Alcalosis → pH alto","Psicosis"],tip:"⚙️ Proceso, NO inflamación."},
{cat:"pato",t:"s",tx:"-oma",or:"Griego: -ōma (tumor/masa)",sig:"Tumor, masa o tumefacción (no siempre cáncer).",ej:["Hematoma → sangre","Lipoma → graso benigno","Linfoma → maligno linfoide","Melanoma","Fibroma","Mioma","Adenoma → glandular","Glaucoma → presión ocular","Hepatoma"],tip:"⚠️ NO todo -oma es cáncer."},
{cat:"pato",t:"s",tx:"-blastoma",or:"Griego: blastós (germen) + -oma",sig:"Tumor de células embrionarias/primitivas. Típicamente pediátrico y agresivo.",ej:["Neuroblastoma → neural infantil","Retinoblastoma","Nefroblastoma (Wilms)","Meduloblastoma","Glioblastoma","Hepatoblastoma"],tip:"🧒 Pediátrico / agresivo."},
{cat:"pato",t:"s",tx:"-carcinoma",or:"Griego: karkínos (cangrejo)",sig:"Tumor maligno de origen epitelial.",ej:["Adenocarcinoma → glandular","Ca escamoso → epitelio plano","Hepatocarcinoma","Colangiocarcinoma → vía biliar","Ca basocelular → piel"],tip:"🦀 Cáncer epitelial."},
{cat:"pato",t:"s",tx:"-sarcoma",or:"Griego: sárx (carne)",sig:"Tumor maligno mesenquimal (hueso, músculo, grasa).",ej:["Osteosarcoma","Liposarcoma","Leiomiosarcoma → músculo liso","Condrosarcoma → cartilaginoso","Rabdomiosarcoma → músculo estriado","Angiosarcoma → vascular"],tip:"💪 Cáncer de tejido conectivo."},
{cat:"pato",t:"s",tx:"-patía",or:"Griego: páthos (sufrimiento)",sig:"Enfermedad en general.",ej:["Cardiopatía","Neuropatía","Miopatía","Nefropatía","Retinopatía","Encefalopatía","Adenopatía → ganglio","Coagulopatía"],tip:"❓ Término genérico."},
{cat:"pato",t:"s",tx:"-algia",or:"Griego: álgos (dolor)",sig:"Dolor en una región específica.",ej:["Cefalalgia / Cefalea","Mialgia","Neuralgia","Lumbalgia","Artralgia","Otalgia","Odontalgia","Coxalgia → cadera","Gonalgia → rodilla","Torácica"],tip:"😣 = -dinia."},
{cat:"pato",t:"s",tx:"-dinia",or:"Griego: odýnē (dolor)",sig:"Dolor (sinónimo de -algia, menos común).",ej:["Pleurodinia","Vulvodinia","Glosodinia → lingual","Odinofagia → dolor al tragar"],tip:"= -algia pero más raro."},
{cat:"pato",t:"s",tx:"-cele",or:"Griego: kḗlē (hernia/tumor)",sig:"Hernia, protrusión o dilatación anormal con contenido.",ej:["Hidrocele → líquido en túnica vaginal","Varicocele → pampiniforme","Meningocele → meninges","Rectocele → prolapso rectal","Cistocele → vejiga","Mielocele → médula","Galactocele → leche","Espermatocele"],tip:"🎈 Bolsa o protrusión."},
{cat:"pato",t:"s",tx:"-malacia",or:"Griego: malakía (reblandecimiento)",sig:"Reblandecimiento patológico.",ej:["Osteomalacia","Condromalacia","Encefalomalacia","Traqueomalacia","Laringomalacia"],tip:"🥴 Se vuelve blando."},
{cat:"pato",t:"s",tx:"-esclerosis",or:"Griego: sklērós (duro)",sig:"Endurecimiento patológico.",ej:["Arterioesclerosis","Otoesclerosis → estribo","Esclerosis múltiple","Aterosclerosis → placas","Esclerosis lateral amiotrófica (ELA)"],tip:"🪨 Opuesto a -malacia."},
{cat:"pato",t:"s",tx:"-necrosis",or:"Griego: nekrós (muerto)",sig:"Muerte tisular.",ej:["Osteonecrosis","Necrosis avascular","Necrosis caseosa → TBC","Pancreatitis necrotizante","Necrosis coagulativa → infarto"],tip:"💀 Tejido muerto."},
{cat:"pato",t:"s",tx:"-ptosis",or:"Griego: ptôsis (caída)",sig:"Caída o descenso de un órgano/estructura.",ej:["Blefaroptosis → párpado caído","Nefroptosis → riñón","Gastroptosis → estómago","Mastoptosis → mama","Visceroptosis"],tip:"⬇️ Se cae."},
{cat:"pato",t:"s",tx:"-spasmo",or:"Griego: spasmós (contracción)",sig:"Contracción muscular involuntaria.",ej:["Broncoespasmo","Laringoespasmo","Blefaroespasmo → párpado","Pilorospasmo","Esofagoespasmo","Vasoespasmo"],tip:"⚡ Se contrae solo."},
{cat:"pato",t:"s",tx:"-plejia",or:"Griego: plḗssein (golpear)",sig:"Parálisis motora completa.",ej:["Hemiplejia → mitad del cuerpo","Paraplejia → MMII","Cuadriplejia → 4 extremidades","Oftalmoplejia → músculos oculares","Apoplejía → ACV (histórico)"],tip:"🚫 No se mueve."},
{cat:"pato",t:"s",tx:"-paresia",or:"Griego: páresis (aflojamiento)",sig:"Parálisis PARCIAL / debilidad.",ej:["Hemiparesia","Paraparesia","Monoparesia → un miembro","Tetraparesia → 4 extremidades"],tip:"⚠️ Parcial, no total (vs plejia)."},
{cat:"pato",t:"s",tx:"-edema",or:"Griego: oídēma (hinchazón)",sig:"Hinchazón por acumulación de líquido.",ej:["Edema agudo de pulmón","Linfedema","Papiledema → disco óptico","Angioedema → alérgico","Mixedema → hipotiroidismo"],tip:"💧 Hinchado por agua."},
{cat:"pato",t:"s",tx:"-fagia (pato)",or:"Griego: phageîn (comer)",sig:"Trastorno de deglución.",ej:["Disfagia → dificultad","Odinofagia → dolor","Afagia → imposible","Aerofagia → tragar aire"],tip:"🍽️ Tragar."},
{cat:"pato",t:"p",tx:"sepsi- / septic-",or:"Griego: sêpsis (putrefacción)",sig:"Infección con respuesta sistémica.",ej:["Sepsis → infección + SRIS","Shock séptico","Bacteriemia → bacterias en sangre","Fungemia → hongos en sangre","Asepsia → sin infección"],tip:"💀 Infección grave."},
{cat:"pato",t:"p",tx:"piro-/ pio-",or:"Griego: pŷon (pus)",sig:"Pus.",ej:["Piuria → pus en orina","Piodermia → piel con pus","Pioderma gangrenoso","Empiema → pus en cavidad","Pionefrosis → pus en riñón"],tip:"🟡 Pus."},
{cat:"pato",t:"p",tx:"viru-",or:"Latín: virus (veneno)",sig:"Virus.",ej:["Viremia → virus en sangre","Antiviral","Virulencia → capacidad de causar daño","Provirus"],tip:"Virus."},
{cat:"pato",t:"p",tx:"bacteri-",or:"Griego: baktḗria (bastón)",sig:"Bacteria.",ej:["Bacteriemia","Antibacteriano","Bacteriólogo","Bacteriostático vs bactericida"],tip:"Bacteria."},
{cat:"pato",t:"p",tx:"miceto- / mico-",or:"Griego: mýkēs (hongo)",sig:"Hongo.",ej:["Micosis → infección fúngica","Onicomicosis → uña","Dermatomicosis","Antimicótico","Aspergilosis"],tip:"🍄 Hongo."},
{cat:"pato",t:"p",tx:"parasit-",or:"Griego: parásitos (al lado + comer)",sig:"Parásito.",ej:["Parasitosis","Parasitemia","Antiparasitario","Ectoparásito / Endoparásito"],tip:"Vive de otro."},
{cat:"pato",t:"p",tx:"helmint-",or:"Griego: hélmins (gusano)",sig:"Gusano parásito.",ej:["Helmintiasis","Antihelmíntico","Platelmintos → gusanos planos","Nematodos → redondos"],tip:"🪱 Parásito intestinal."},
{cat:"pato",t:"p",tx:"zoon-",or:"Griego: zôion (animal)",sig:"Zoonosis (enfermedad de animales a humanos).",ej:["Zoonosis","Antropozoonosis","Brucelosis","Rabia → clásica zoonosis"],tip:"🐾 De animal a humano."},
{cat:"pato",t:"p",tx:"neon-",or:"Griego: néos + Latín: natus",sig:"Recién nacido (0-28 días).",ej:["Neonatología","Ictericia neonatal","Sepsis neonatal","Asfixia neonatal","Hemorragia neonatal"],tip:"👶 Primeros 28 días."},
{cat:"pato",t:"p",tx:"lact- (ped)",or:"Latín: lac",sig:"Lactante (1-24 meses).",ej:["Lactante menor → 1-12 meses","Lactante mayor → 12-24 meses","Dermatitis del lactante"],tip:"🍼 Primer-segundo año."},
{cat:"pato",t:"p",tx:"cripto-",or:"Griego: kryptós (oculto)",sig:"Oculto / escondido.",ej:["Criptorquidia → testículo no descendido","Criptogénico → origen oculto","Criptococosis","Criptosporidiosis"],tip:"Escondido."},
{cat:"pato",t:"p",tx:"iso- / aniso- (pato)",or:"Griego: ísos / an-ísos",sig:"Iso = igual. Aniso = desigual. Usado en hematología y oftalmología.",ej:["Anisocitosis → hematíes de distinto tamaño","Poiquilocitosis → distintas formas","Isocoria → pupilas iguales","Anisocoria → pupilas desiguales → pensar en herniación cerebral"],tip:"= vs ≠ en el examen."},
{cat:"pato",t:"p",tx:"poiquilo-",or:"Griego: poikílos (variado)",sig:"Variado, irregular.",ej:["Poiquilocitosis → eritrocitos de distintas formas","Poiquilotermia → no regula temperatura","Poiquilodermia → piel con atrofia + pigmentación"],tip:"Formas irregulares."},
]);

/* === VOC batch 2: col (10) + sang (11) = 21 entries === */
VOCAB_VOC.push.apply(VOCAB_VOC, [
/* col */
{cat:"col",t:"p",tx:"leuco-",or:"Griego: leukós (blanco)",sig:"Blanco. Típicamente células blancas de la sangre.",ej:["Leucocito → glóbulo BLANCO","Leucograma → recuento de leucocitos","Leucemia → leucocitos malignos","Leucopenia → ↓leucocitos","Leucocitosis → ↑leucocitos","Leucorrea → flujo vaginal blanco","Leucoplasia → placa blanca en mucosa","Leucomalacia"],tip:"⚪ Blanco = defensa."},
{cat:"col",t:"p",tx:"eritro-",or:"Griego: erythrós (rojo)",sig:"Rojo. Típicamente glóbulos rojos.",ej:["Eritrocito → glóbulo ROJO","Eritropoyesis → producir hematíes","Eritropoyetina (EPO) → hormona renal","Eritrocitosis → ↑eritrocitos","Eritrocitopenia → ↓","Eritema → enrojecimiento","Eritrodermia → piel roja","Eritrasma → infección"],tip:"🔴 Rojo = oxígeno."},
{cat:"col",t:"p",tx:"melano-",or:"Griego: mélas (negro)",sig:"Negro u oscuro.",ej:["Melanoma → tumor pigmentado","Melanocito → productora de melanina","Melanosis → pigmentación anormal","Melena → heces negras (sangre digerida)","Hipermelanosis"],tip:"⚫ Negro."},
{cat:"col",t:"p",tx:"cian-",or:"Griego: kýanos (azul)",sig:"Azul / azulado.",ej:["Cianosis → coloración azulada (hipoxia)","Cianótico → labios/dedos azules","Acianótico → sin cianosis","Acrocianosis → extremidades azules"],tip:"🔵 Azul por falta de O₂."},
{cat:"col",t:"p",tx:"xanto-",or:"Griego: xanthós (amarillo)",sig:"Amarillo.",ej:["Xantoma → depósito lipídico amarillo","Xantelasma → xantoma palpebral","Xantocromía → LCR amarillo (sangre vieja)","Xantopsia → ver amarillo (digital)"],tip:"🟡 Amarillo."},
{cat:"col",t:"p",tx:"cloro-",or:"Griego: chlōrós (verde)",sig:"Verde pálido / amarillo verdoso.",ej:["Clorosis → anemia ferropénica (histórico)","Cloroma → leucemia con pigmento verde","Cloruro → ion verde-amarillo"],tip:"🟢 Verdoso."},
{cat:"col",t:"p",tx:"rubro- / rubi-",or:"Latín: ruber (rojo)",sig:"Rojo (eq. latino de eritro-).",ej:["Rubor → enrojecimiento (signo inflamación)","Bilirrubina → pigmento biliar rojizo","Rubéola → 'rojito'"],tip:"🔴 Rojo (latín)."},
{cat:"col",t:"p",tx:"cromo-",or:"Griego: chrôma (color)",sig:"Color en general.",ej:["Cromosoma → cuerpo coloreado","Policromasia → varios colores","Acromía → sin color","Hipocromía → color ↓ (anemia)","Hipercromía → color ↑","Cromoforo"],tip:"🎨 Color."},
{cat:"col",t:"p",tx:"albo-",or:"Latín: albus (blanco)",sig:"Blanco (eq. latino de leuco-).",ej:["Albúmina → proteína blanca","Albinismo → sin pigmentación"],tip:"⚪ Blanco (latín)."},
{cat:"col",t:"p",tx:"ictero-",or:"Griego: íkteros (amarillo)",sig:"Amarillento por bilirrubina.",ej:["Ictericia → piel y mucosas amarillas","Ictérico → paciente amarillento","Subictericia → ictericia leve"],tip:"🟡 Amarillo por bilirrubina."},
/* sang */
{cat:"sang",t:"s",tx:"-emia",or:"Griego: haîma (sangre)",sig:"Condición o presencia de algo en sangre.",ej:["Anemia → ↓hematíes/Hb","Leucemia","Hiperglicemia","Uremia","Septicemia","Hipocalcemia","Natremia → sodio","Bacteriemia","Azoemia → urea","Acidemia → pH bajo"],tip:"🩸 Lo más usado en hemato."},
{cat:"sang",t:"s",tx:"-rragia",or:"Griego: rhḗgnymi (romper)",sig:"Sangrado abundante o hemorragia.",ej:["Hemorragia → sangrado","Menorragia → menstruación abundante","Metrorragia → uterino no menstrual","Epistaxis → nasal","Otorragia → oído","Hematemesis → vómito con sangre","Enterorragia → intestinal bajo","Hemoptisis → esputo con sangre","Hematuria → urinario"],tip:"🚨 Flujo INTENSO de sangre."},
{cat:"sang",t:"s",tx:"-rrea",or:"Griego: rhéō (fluir)",sig:"Flujo o secreción (no sanguínea).",ej:["Diarrea → intestinal","Rinorrea → nasal","Otorrea → oído","Leucorrea → vaginal blanca","Galactorrea → lácteo","Esteatorrea → grasa en heces","Seborrea → sebo","Broncorrea → bronquial","Pirorrea → dental con pus"],tip:"💧 Flujo."},
{cat:"sang",t:"p",tx:"hemo- / hemat-",or:"Griego: haîma (sangre)",sig:"Relativo a la sangre.",ej:["Hemorragia","Hematoma","Hematuria","Hemoptisis","Hemólisis","Hemostasia","Hemofilia","Hematocrito","Hemoglobina","Hemorroides","Hemosiderina"],tip:"🩸 Sangre."},
{cat:"sang",t:"p",tx:"angio-",or:"Griego: angeîon (vaso)",sig:"Vaso (sanguíneo o linfático).",ej:["Angiografía","Angiopatía","Angioplastia","Hemangioma","Linfangitis","Angioedema","Angiogénesis"],tip:"🩸 Conducto."},
{cat:"sang",t:"p",tx:"flebo- / veno-",or:"Griego: phléps / Latín: vena",sig:"Vena.",ej:["Flebitis","Flebotomía","Tromboflebitis","Venopunción","Flebolito → cálculo venoso","Varices → vena dilatada","Venoclisis"],tip:"🟦 Vena."},
{cat:"sang",t:"p",tx:"arterio-",or:"Griego: artēría (arteria)",sig:"Arteria.",ej:["Arteriografía","Arteriopatía","Arteriosclerosis","Arteritis","Aneurisma","Endarterectomía"],tip:"🟥 Arteria."},
{cat:"sang",t:"p",tx:"trombo-",or:"Griego: thrómbos (coágulo)",sig:"Coágulo sanguíneo.",ej:["Trombosis","Tromboflebitis","Tromboembolia","Trombocitopenia → ↓plaquetas","Trombolisis","Trombina → enzima"],tip:"🧊 Coágulo."},
{cat:"sang",t:"p",tx:"linfo-",or:"Latín: lympha (agua clara)",sig:"Linfa o tejido linfático.",ej:["Linfoma","Linfadenopatía","Linfocito","Linfedema","Linfangitis","Linfadenitis"],tip:"💧 Linfa."},
{cat:"sang",t:"p",tx:"vaso-",or:"Latín: vas (vaso)",sig:"Vaso (eq. latino).",ej:["Vasoconstrictor → cierra vaso","Vasodilatador → abre vaso","Vasovagal","Vasopresina → ADH","Vasculitis"],tip:"🩸 Vaso (latino)."},
{cat:"sang",t:"p",tx:"embolo-",or:"Griego: émbolos (tapón)",sig:"Émbolo (coágulo móvil, aire, grasa, etc).",ej:["Embolia pulmonar (TEP)","Embolia grasa","Embolia gaseosa","Embolización"],tip:"🧩 Se mueve y tapa."},
]);
