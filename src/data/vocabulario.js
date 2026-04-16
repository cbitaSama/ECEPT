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

/* === VOC batch 3: org (70 entries — organ roots) === */
VOCAB_VOC.push.apply(VOCAB_VOC, [
{cat:"org",t:"p",tx:"cardio-",or:"Griego: kardía (corazón)",sig:"Corazón.",ej:["Cardiología","Cardiomegalia → corazón agrandado","Cardiomiopatía","Pericardio → alrededor","Endocardio → dentro","Miocardio → músculo","Taquicardia / Bradicardia","Cardioversión"],tip:"❤️ Corazón."},
{cat:"org",t:"p",tx:"pneumo- / neumo-",or:"Griego: pneúmōn (pulmón) / pneûma (aire)",sig:"Pulmón o aire.",ej:["Neumonía → infección pulmonar","Neumotórax → aire en pleura","Neumología","Pneumoconiosis → polvo pulmonar","Neumoperitoneo → aire en abdomen","Neumovax"],tip:"🫁 Pulmón / aire."},
{cat:"org",t:"p",tx:"hepato-",or:"Griego: hêpar (hígado)",sig:"Hígado.",ej:["Hepatitis","Hepatomegalia","Hepatocito → célula hepática","Hepatocarcinoma","Hepatopatía","Hepatograma"],tip:"🫀 Hígado."},
{cat:"org",t:"p",tx:"gastro-",or:"Griego: gastḗr (estómago)",sig:"Estómago.",ej:["Gastritis","Gastrectomía","Gastroenterología","Gastrostomía","Gastroparesia","Gastroesofágico"],tip:"🍽️ Estómago."},
{cat:"org",t:"p",tx:"entero-",or:"Griego: énteron (intestino)",sig:"Intestino (especialmente delgado).",ej:["Enteritis","Enterocolitis","Gastroenteritis","Parenteral → 'fuera del intestino'","Enterorragia","Disentería"],tip:"🧬 Intestino."},
{cat:"org",t:"p",tx:"colo- / colono-",or:"Griego: kólon",sig:"Colon / intestino grueso.",ej:["Colonoscopia","Colitis","Colectomía","Megacolon","Coloproctología","Dolicocolon → colon alargado"],tip:"Intestino grueso."},
{cat:"org",t:"p",tx:"procto-",or:"Griego: prōktós (ano)",sig:"Ano y recto.",ej:["Proctología","Proctitis","Proctoscopia","Coloproctología","Proctalgia"],tip:"Ano/recto."},
{cat:"org",t:"p",tx:"cole- / colecisto-",or:"Griego: cholḗ (bilis) / kýstis (saco)",sig:"Cole- = bilis · Colecisto- = vesícula biliar.",ej:["Colecistitis → inflamación vesicular","Colecistectomía → retirar vesícula","Colelitiasis → cálculos biliares","Colangitis → vía biliar","Coledocolitiasis → cálculo en colédoco","Colecistocinina (CCK)"],tip:"🟡 Bilis / vesícula."},
{cat:"org",t:"p",tx:"colangi-",or:"Griego: cholḗ + angeîon",sig:"Vía biliar (conductos).",ej:["Colangitis → inflamación","Colangiografía","Colangiopancreatografía retrógrada (CPRE)","Colangiocarcinoma"],tip:"Tuberías de la bilis."},
{cat:"org",t:"p",tx:"cisto-",or:"Griego: kýstis (saco/vejiga)",sig:"Vejiga o saco/quiste.",ej:["Cistitis → vejiga","Cistoscopia","Colecistitis → vesícula biliar","Cistectomía","Cistocele"],tip:"🎈 Saco lleno."},
{cat:"org",t:"p",tx:"oftalmo- / oculo-",or:"Griego: ophthalmós / Latín: oculus (ojo)",sig:"Ojo.",ej:["Oftalmología","Oftalmoplejia","Xeroftalmia → ojo seco","Exoftalmos → protrusión","Ocular"],tip:"👁️ Ojo."},
{cat:"org",t:"p",tx:"oto-",or:"Griego: oûs/ōtós (oído)",sig:"Oído.",ej:["Otitis","Otorragia","Otoscopia","Otorrinolaringología (ORL)","Otorrea","Otoplastia"],tip:"👂 Oído."},
{cat:"org",t:"p",tx:"rino- / naso-",or:"Griego: rhís / Latín: nasus (nariz)",sig:"Nariz.",ej:["Rinitis","Rinoplastia","Nasogástrica → sonda","Rinorrea → moco","Rinorragia → sangrado","Nasofaringe"],tip:"👃 Nariz."},
{cat:"org",t:"p",tx:"neuro-",or:"Griego: neûron (nervio)",sig:"Nervio o sistema nervioso.",ej:["Neurología","Neuralgia","Neurona","Neuropatía","Neuritis","Neurorrafia","Neurocirugía"],tip:"🧠 Nervio."},
{cat:"org",t:"p",tx:"mielo-",or:"Griego: myelós (médula)",sig:"Médula (ósea o espinal).",ej:["Mielograma → médula ósea","Mieloma múltiple","Mielitis → inflamación medular","Osteomielitis → médula ósea infectada","Mielopatía","Mielinización"],tip:"⚠️ Contexto define cuál."},
{cat:"org",t:"p",tx:"osteo-",or:"Griego: ostéon (hueso)",sig:"Hueso.",ej:["Osteología","Osteítis","Osteoporosis","Osteomielitis","Osteosarcoma","Osteopenia","Osteomalacia","Osteófito"],tip:"🦴 Hueso."},
{cat:"org",t:"p",tx:"artro-",or:"Griego: árthron (articulación)",sig:"Articulación.",ej:["Artritis","Artrosis","Artroscopia","Artroplastia","Artralgia","Artrodesis","Artrocentesis"],tip:"🦿 Articulación."},
{cat:"org",t:"p",tx:"condro-",or:"Griego: chóndros (cartílago)",sig:"Cartílago.",ej:["Condritis","Condromalacia","Condrosarcoma","Condrocito","Perióndrio","Hipocondrio → bajo el cartílago (costal)"],tip:"Cartílago."},
{cat:"org",t:"p",tx:"dermato- / derm-",or:"Griego: dérma (piel)",sig:"Piel.",ej:["Dermatología","Dermatitis","Epidermis → sobre dermis","Hipodermis → debajo","Piodermia → con pus","Dermatoma","Escleroderma"],tip:"🩹 Piel."},
{cat:"org",t:"p",tx:"tricho-",or:"Griego: thríx (pelo)",sig:"Pelo.",ej:["Tricotilomanía → arrancarse pelo","Tricosis → exceso de pelo","Hipertricosis"],tip:"💇 Pelo."},
{cat:"org",t:"p",tx:"onico-",or:"Griego: ónyx (uña)",sig:"Uña.",ej:["Onicomicosis → hongos en uñas","Paroniquia → infección periungueal","Onicofagia → comerse uñas","Onicólisis"],tip:"💅 Uña."},
{cat:"org",t:"p",tx:"mio-",or:"Griego: mŷs (músculo)",sig:"Músculo.",ej:["Miocardio","Miopatía","Mialgia","Miositis","Mioma","Miastenia → debilidad","Miocito","Miofibrilla"],tip:"💪 Músculo."},
{cat:"org",t:"p",tx:"teno-",or:"Griego: ténōn (tendón)",sig:"Tendón.",ej:["Tendinitis","Tenosinovitis","Tenorrafia","Tenodesis"],tip:"Tendón."},
{cat:"org",t:"p",tx:"cefalo- / encefalo-",or:"Griego: kephalḗ / enképhalos",sig:"Cefalo- = cabeza · Encefalo- = cerebro.",ej:["Cefalea → dolor de cabeza","Cefalalgia","Encefalitis → cerebro","Encefalopatía","Hidrocefalia → ↑LCR","Anencefalia → sin cerebro","Cefalohematoma"],tip:"🧠 Cabeza / cerebro."},
{cat:"org",t:"p",tx:"odonto-",or:"Griego: odoús (diente)",sig:"Diente.",ej:["Odontología","Odontalgia → dolor","Endodoncia → interior del diente","Ortodoncia","Odontoma","Exodoncia → extracción dental"],tip:"🦷 Diente."},
{cat:"org",t:"p",tx:"glosso- / lingu-",or:"Griego: glôssa / Latín: lingua",sig:"Lengua.",ej:["Glositis","Glosodinia","Macroglosia","Hipogloso → nervio XII","Sublingual"],tip:"👅 Lengua."},
{cat:"org",t:"p",tx:"faringo-",or:"Griego: phárynx",sig:"Faringe.",ej:["Faringitis","Faringoamigdalitis","Rinofaringe","Disfagia","Orofaringe"],tip:"Garganta."},
{cat:"org",t:"p",tx:"laringo-",or:"Griego: lárynx",sig:"Laringe.",ej:["Laringitis","Laringoscopia","Laringoespasmo","Laringomalacia","Laringotomía"],tip:"Caja de voz."},
{cat:"org",t:"p",tx:"traqueo-",or:"Griego: tracheîa (áspera)",sig:"Tráquea.",ej:["Traqueítis","Traqueotomía","Traqueostomía","Traqueomalacia"],tip:"Vía aérea principal."},
{cat:"org",t:"p",tx:"broncho- / bronquio-",or:"Griego: brónchos",sig:"Bronquios.",ej:["Bronquitis","Broncoscopia","Broncoespasmo","Bronquiectasia","Broncopulmonar","Broncoaspiración"],tip:"Vía aérea inferior."},
{cat:"org",t:"p",tx:"pleuro-",or:"Griego: pleurá (costilla/lado)",sig:"Pleura.",ej:["Pleuritis","Pleurodesis","Pleurodinia → dolor","Derrame pleural","Neumotórax"],tip:"Membrana pulmón."},
{cat:"org",t:"p",tx:"esplen-",or:"Griego: splḗn (bazo)",sig:"Bazo.",ej:["Esplenomegalia → bazo grande","Esplenectomía","Hipoesplenismo","Hiperesplenismo","Esplenorragia"],tip:"Bazo."},
{cat:"org",t:"p",tx:"péanc-/ pancreas-",or:"Griego: pân (todo) + kréas (carne)",sig:"Páncreas.",ej:["Pancreatitis","Pancreatectomía","Hemopancreático","CPRE → colangiopancreatografía"],tip:"Páncreas (pan = todo carne)."},
{cat:"org",t:"p",tx:"colpo- / vagino-",or:"Griego: kólpos / Latín: vagina",sig:"Vagina.",ej:["Colposcopia","Colpocele → prolapso","Colpopexia","Vaginitis","Vaginoplastia"],tip:"Vagina."},
{cat:"org",t:"p",tx:"peri-tone",or:"Griego: perí + teínō",sig:"Peritoneo.",ej:["Peritonitis","Peritoneo parietal/visceral","Retroperitoneo","Peritoneal"],tip:"Membrana que recubre."},
{cat:"org",t:"p",tx:"espondilo- / vertebr-",or:"Griego: spóndylos / Latín: vertebra",sig:"Vértebra / columna vertebral.",ej:["Espondilitis anquilosante","Espondilodiscitis","Espondilólisis → defecto en pars interarticularis","Espondilolistesis → desplazamiento vertebral","Vertebroplastia"],tip:"🦴 Columna."},
{cat:"org",t:"p",tx:"costo-",or:"Latín: costa (costilla)",sig:"Costilla.",ej:["Costocondritis → inflamación cartilaginosa","Intercostal → entre costillas","Subcostal → debajo de costillas","Costoesternal"],tip:"Costilla."},
{cat:"org",t:"p",tx:"mast- / mamo-",or:"Griego: mastós / Latín: mamma",sig:"Mama.",ej:["Mastitis → inflamación mamaria","Mastectomía","Mamografía","Mastalgia","Ginecomastia → mama en varón"],tip:"🤱 Mama."},
{cat:"org",t:"p",tx:"mandíbulo- / maxilo-",or:"Latín: mandibula / maxilla",sig:"Mandíbula inferior / maxilar superior.",ej:["Mandibulectomía","Maxilar superior vs inferior","Craneomandibular","Maxilofacial"],tip:"Huesos de la cara."},
{cat:"org",t:"p",tx:"bursa-",or:"Latín: bursa (bolsa)",sig:"Bursa (bolsa serosa articular).",ej:["Bursitis → inflamación","Bursectomía","Bursa olecraniana","Bursa trocantérica"],tip:"💧 Cojín articular."},
{cat:"org",t:"p",tx:"sinov-",or:"Griego: sýn + Latín: ovum",sig:"Membrana sinovial / líquido articular.",ej:["Sinovitis → inflamación","Sinoviectomía","Tenosinovitis → tendón + sinovial","Líquido sinovial"],tip:"Membrana articular."},
{cat:"org",t:"p",tx:"ligament-",or:"Latín: ligamentum",sig:"Ligamento.",ej:["Ligamentosis → degeneración","Esguince ligamentario","Plastia ligamentaria","Ligamento cruzado anterior (LCA)"],tip:"Une hueso con hueso."},
{cat:"org",t:"p",tx:"fascia-",or:"Latín: fascia (banda)",sig:"Fascia (tejido conectivo envolvente).",ej:["Fascitis plantar","Fasciotomía → descompresión","Fascitis necrotizante","Fasciectomía"],tip:"Envoltura muscular."},
{cat:"org",t:"p",tx:"conjuntiv- / cornea-",or:"Latín: conjunctivus / cornea",sig:"Conjuntiva / córnea.",ej:["Conjuntivitis","Queratoconjuntivitis → córnea + conjuntiva","Conjuntivoplastia","Queratitis"],tip:"Estructuras del ojo."},
{cat:"org",t:"p",tx:"queratO- / querato-",or:"Griego: kéras (cuerno)",sig:"Córnea o queratina (tejido córneo).",ej:["Queratitis → inflamación corneal","Queratocono","Queratosis → engrosamiento córneo","Queratoplastia → trasplante corneal","Hiperqueratosis"],tip:"Córnea / queratina."},
{cat:"org",t:"p",tx:"iris- / irid-",or:"Griego: îris",sig:"Iris del ojo.",ej:["Iritis / Iridociclitis","Iridectomía","Heterocromía del iris"],tip:"El diafragma del ojo."},
{cat:"org",t:"p",tx:"retin-",or:"Latín: rete (red)",sig:"Retina.",ej:["Retinopatía diabética","Retinoblastoma","Desprendimiento de retina","Retinitis pigmentaria"],tip:"Tejido neurosensorial del ojo."},
{cat:"org",t:"p",tx:"timpan-",or:"Griego: týmpanon (tambor)",sig:"Tímpano / membrana timpánica.",ej:["Timpanitis","Miringotomía → incisión timpánica","Timpanoplastia","Timpanometría"],tip:"🥁 Tambor del oído."},
{cat:"org",t:"p",tx:"coclea-",or:"Latín: cochlea (caracol)",sig:"Cóclea (órgano auditivo interno).",ej:["Coclear","Implante coclear","Cocleitis","Neuritis coclear"],tip:"🐌 Oído interno."},
{cat:"org",t:"p",tx:"vestibul-",or:"Latín: vestibulum",sig:"Aparato vestibular / del equilibrio.",ej:["Vestibulitis","Vértigo vestibular","Neuronitis vestibular"],tip:"⚖️ Equilibrio."},
{cat:"org",t:"p",tx:"aurícul-",or:"Latín: auricula (orejita)",sig:"Aurícula cardíaca.",ej:["Fibrilación auricular (FA)","Flutter auricular","Aurícula derecha/izquierda","Apéndice auricular"],tip:"Cavidades superiores del corazón."},
{cat:"org",t:"p",tx:"ventricul-",or:"Latín: ventriculus",sig:"Ventrículo (cardíaco o cerebral).",ej:["Hipertrofia ventricular izquierda (HVI)","Fibrilación ventricular (FV)","Ventriculografía","Ventriculomegalia cerebral"],tip:"Cavidad bombea."},
{cat:"org",t:"p",tx:"valv-",or:"Latín: valva (hoja)",sig:"Válvula cardíaca.",ej:["Valvulopatía","Valvuloplastia","Insuficiencia valvular","Estenosis valvular"],tip:"Puerta del flujo sanguíneo."},
{cat:"org",t:"p",tx:"coron-",or:"Latín: corona",sig:"Coronario (arterias del corazón).",ej:["Enfermedad arterial coronaria (EAC)","Síndrome coronario agudo (SCA)","Angiografía coronaria","Revascularización coronaria"],tip:"👑 Arterias del corazón."},
{cat:"org",t:"p",tx:"menin-",or:"Griego: mḗninx (membrana)",sig:"Meninges.",ej:["Meningitis → infección","Meningioma → tumor","Meningocele","Meningocócico","Meningoencefalitis"],tip:"Membranas del SNC."},
{cat:"org",t:"p",tx:"cerebel-",or:"Latín: cerebellum",sig:"Cerebelo.",ej:["Ataxia cerebelosa","Síndrome cerebeloso","Cerebelitis","Hipoplasia cerebelosa"],tip:"Coordinación y equilibrio."},
{cat:"org",t:"p",tx:"tálamo-",or:"Griego: thálamos (cámara)",sig:"Tálamo.",ej:["Talamotomía","Síndrome talámico","Hipotálamo → debajo del tálamo","Epitálamo"],tip:"Relé sensorial cerebral."},
{cat:"org",t:"p",tx:"radic- / radicul-",or:"Latín: radix (raíz)",sig:"Raíz nerviosa.",ej:["Radiculopatía → dolor radicular","Radiculitis","Poliradiculopatía","Ciática → radiculopatía L5-S1"],tip:"Raíz del nervio espinal."},
{cat:"org",t:"p",tx:"plexo-",or:"Latín: plexus (trenzado)",sig:"Plexo (red de nervios).",ej:["Plexopatía braquial","Plexitis","Plexo solar","Plexo lumbosacro"],tip:"Red nerviosa."},
{cat:"org",t:"p",tx:"omo- / escapulo-",or:"Griego: ōmos (hombro) / Latín: scapula",sig:"Hombro / omóplato (escápula).",ej:["Omohioideo → escápula + hioides","Omalgia → dolor de hombro","Escapulalgia","Periescapular"],tip:"Hombro / escápula."},
{cat:"org",t:"p",tx:"humero-",or:"Latín: humerus",sig:"Húmero (hueso del brazo).",ej:["Fractura humeral","Articulación glenohumeral","Humerorradial"],tip:"Hueso del brazo."},
{cat:"org",t:"p",tx:"radio- / ulna- / cubito-",or:"Latín: radius / ulna",sig:"Radio (lateral) y cúbito/ulna (medial) del antebrazo.",ej:["Fractura de radio distal (Colles)","Radial → arteria radial","Cubital → nervio cubital","Radiocubital → articulación"],tip:"Huesos del antebrazo."},
{cat:"org",t:"p",tx:"femor-",or:"Latín: femur",sig:"Fémur (hueso del muslo).",ej:["Arteria femoral","Hernia femoral","Fractura femoral","Cabeza del fémur"],tip:"Hueso del muslo."},
{cat:"org",t:"p",tx:"tibi- / peron- / fibul-",or:"Latín: tibia / fibula",sig:"Tibia (medial) y peroné/fíbula (lateral) de la pierna.",ej:["Fractura tibial","Peroneal → nervio","Tibial anterior (músculo)","Fracturas bimaleolares"],tip:"Huesos de la pierna."},
{cat:"org",t:"p",tx:"sacro- / coccig-",or:"Latín: os sacrum / coccyx",sig:"Sacro (hueso triangular base de columna) y cóccix (coxis).",ej:["Sacroileítis → articulación sacroilíaca","Sacralización → L5 fusionada al sacro","Coccigodinia → dolor de cóccix"],tip:"Base de la columna."},
{cat:"org",t:"p",tx:"pelvi-",or:"Latín: pelvis (palangana)",sig:"Pelvis ósea.",ej:["Pelvimetría → medir pelvis (obstetricia)","Pelviectasia → dilatación pélvica","Piso pélvico","Fractura de pelvis"],tip:"Palangana ósea."},
{cat:"org",t:"p",tx:"hioideo",or:"Griego: hyoeidḗs (forma de U)",sig:"Hueso hioides. Único hueso que no articula con otro. Base de la lengua.",ej:["Hueso hioides → forma de U","Omohioideo","Esternohioideo","Tirohioideo","Fractura del hioides → indicador forense de estrangulamiento"],tip:"El hueso 'suelto' del cuello."},
{cat:"org",t:"p",tx:"coraco-",or:"Griego: kórax (cuervo)",sig:"Apófisis coracoides de la escápula (forma de pico de cuervo).",ej:["Coracobraquial → músculo","Ligamento coracoacromial","Ligamento coracoclavicular","Proceso coracoides"],tip:"🐦 Pico de cuervo."},
{cat:"org",t:"p",tx:"glenoideo-",or:"Griego: glḗnē (cavidad)",sig:"Cavidad glenoidea de la escápula (donde articula el húmero).",ej:["Articulación glenohumeral","Labrum glenoideo","Fractura glenoidea"],tip:"Encaje del hombro."},
{cat:"org",t:"p",tx:"acromio-",or:"Griego: ákron + ōmos (extremo del hombro)",sig:"Acromion: extensión de la escápula que forma el techo del hombro.",ej:["Acromioclavicular → articulación","Acromionectomía","Espacio subacromial → pinzamiento"],tip:"Techo del hombro."},
]);

/* === VOC batch 4: gu (14) + endo (9) + func (28) = 51 entries === */
VOCAB_VOC.push.apply(VOCAB_VOC, [
/* gu */
{cat:"gu",t:"p",tx:"nefro- / ren-",or:"Griego: nephrós / Latín: ren (riñón)",sig:"Riñón.",ej:["Nefrología / Nefritis","Nefrectomía","Nefropatía","Hidronefrosis → dilatación","Renal","Suprarrenal → encima","Pielonefritis"],tip:"🫘 Riñón (gr.+lat.)."},
{cat:"gu",t:"p",tx:"pielo-",or:"Griego: pýelos (pelvis)",sig:"Pelvis renal.",ej:["Pielonefritis → pelvis + riñón","Pielografía","Pielolitotomía","Pielograma"],tip:"Pelvis renal."},
{cat:"gu",t:"p",tx:"uretero-",or:"Griego: ourētḗr",sig:"Uréter (riñón→vejiga).",ej:["Ureterolitiasis → cálculo","Ureterostomía","Hidrouréter","Ureteroscopia"],tip:"Conducto al riñón."},
{cat:"gu",t:"p",tx:"uretro-",or:"Griego: ourḗthra",sig:"Uretra (vejiga→exterior).",ej:["Uretritis","Uretroscopia","Uretroplastia","Hipospadias → uretra mal ubicada"],tip:"Uretra (no confundir con uréter)."},
{cat:"gu",t:"p",tx:"cisto- (vej)",or:"Griego: kýstis (vejiga)",sig:"Vejiga urinaria.",ej:["Cistitis → infección urinaria baja","Cistoscopia","Cistectomía","Cistocele → prolapso"],tip:"Vejiga."},
{cat:"gu",t:"p",tx:"uro-",or:"Griego: oûron (orina)",sig:"Orina / tracto urinario.",ej:["Urología","Urografía","Uropatía obstructiva","Urea","Urolitiasis","Ureasa"],tip:"💦 Orina."},
{cat:"gu",t:"p",tx:"hister- / metro-",or:"Griego: hystéra / mētrá (útero)",sig:"Útero.",ej:["Histerectomía","Histeroscopia","Endometrio → interno","Miometrio → muscular","Perimetrio","Metrorragia → sangrado uterino"],tip:"Útero."},
{cat:"gu",t:"p",tx:"oofor- / ovario-",or:"Griego: ōón (huevo) / Latín: ovarium",sig:"Ovario.",ej:["Ooforitis","Ooforectomía","Salpingooforectomía","Ovarios poliquísticos (SOP)"],tip:"🥚 Ovario."},
{cat:"gu",t:"p",tx:"salpingo-",or:"Griego: sálpinx (trompeta)",sig:"Trompa (uterina o auditiva).",ej:["Salpingitis → trompa de Falopio","Salpingectomía","Salpingooforectomía","Salpingoscopia"],tip:"🎺 Trompa."},
{cat:"gu",t:"p",tx:"orquido- / testiculo-",or:"Griego: órchis (testículo)",sig:"Testículo.",ej:["Orquitis → inflamación","Orquiectomía","Orquidopexia → criptorquidia","Orquialgia"],tip:"Testículo."},
{cat:"gu",t:"p",tx:"espermato-",or:"Griego: spérma (semilla)",sig:"Esperma / espermatozoide.",ej:["Espermatogénesis","Oligospermia → poco esperma","Azoospermia → sin esperma","Espermatocele"],tip:"Esperma."},
{cat:"gu",t:"p",tx:"balano-",or:"Griego: bálanos (glande)",sig:"Glande del pene.",ej:["Balanitis","Balanopostitis → glande + prepucio"],tip:"Glande."},
{cat:"gu",t:"p",tx:"prostato-",or:"Griego: prostátēs (protector)",sig:"Próstata.",ej:["Prostatitis","Prostatectomía","Hiperplasia prostática benigna (HPB)","Adenocarcinoma prostático"],tip:"Próstata."},
{cat:"gu",t:"p",tx:"meno-",or:"Griego: mḗn (mes)",sig:"Menstruación.",ej:["Menorragia → abundante","Amenorrea → sin menstruación","Dismenorrea → dolorosa","Menopausia → cese","Oligomenorrea → escasa"],tip:"🌙 Ciclo menstrual."},
/* endo */
{cat:"endo",t:"p",tx:"adeno-",or:"Griego: adḗn (glándula)",sig:"Glándula o ganglio.",ej:["Adenoma → tumor glandular benigno","Adenocarcinoma → maligno","Adenopatía → ganglio","Adenitis","Adenoides","Linfadenitis"],tip:"⚗️ Glándula."},
{cat:"endo",t:"p",tx:"tiro- / tiroido-",or:"Griego: thyreoeidḗs (escudo)",sig:"Tiroides.",ej:["Tiroiditis","Tiroidectomía","Hipotiroidismo","Hipertiroidismo","Tirotoxicosis","Tiromegalia / Bocio"],tip:"Tiroides."},
{cat:"endo",t:"p",tx:"parato-",or:"Griego: pará + thyreoeidḗs",sig:"Paratiroides (al lado de tiroides).",ej:["Hiperparatiroidismo","Hipoparatiroidismo","Paratiroidectomía"],tip:"Glándulas calcio."},
{cat:"endo",t:"p",tx:"adreno- / suprarrenal",or:"Latín: ad- + ren",sig:"Glándula suprarrenal.",ej:["Adrenalina → epinefrina","Adrenérgico → receptores","Insuficiencia suprarrenal","Adrenalectomía"],tip:"Encima del riñón."},
{cat:"endo",t:"p",tx:"insulino-",or:"Latín: insula (isla) (de Langerhans)",sig:"Insulina / células β.",ej:["Insulinoma → tumor","Insulinorresistencia","Hiperinsulinismo","Insulinopenia"],tip:"Hormona del azúcar."},
{cat:"endo",t:"p",tx:"tim-",or:"Griego: thýmos (timo)",sig:"Timo.",ej:["Timoma → tumor del timo","Timectomía","Timitis"],tip:"Órgano linfoide."},
{cat:"endo",t:"p",tx:"hipofiso- / pituitar-",or:"Griego: hypó + phýō",sig:"Hipófisis / pituitaria.",ej:["Hipopituitarismo","Hiperpituitarismo","Adenoma hipofisario","Panhipopituitarismo"],tip:"Glándula maestra."},
{cat:"endo",t:"p",tx:"gluco- / glic-",or:"Griego: glykýs (dulce)",sig:"Glucosa / azúcar.",ej:["Glucemia → glucosa en sangre","Glucosuria → glucosa en orina","Glucogénesis → producir glucosa","Glucagón → hormona pancreática","Hipoglucemia","Hiperglicemia"],tip:"🍬 Azúcar."},
{cat:"endo",t:"p",tx:"cortico-",or:"Latín: cortex (corteza)",sig:"Corteza (suprarrenal o cerebral).",ej:["Corticoesteroides","Corticotropina (ACTH)","Hipercorticismo → Cushing","Corticoadrenal"],tip:"Corteza."},
/* func */
{cat:"func",t:"s",tx:"-stasis",or:"Griego: stásis (detención)",sig:"Detención, estancamiento o equilibrio.",ej:["Hemostasia → detener sangrado","Homeostasis → equilibrio interno","Colestasis → estancamiento biliar","Metástasis → cambio de lugar (tumor)","Bacteriostático → detiene bacterias","Urostasis"],tip:"⏸️ Se detiene / equilibra."},
{cat:"func",t:"s",tx:"-plasia",or:"Griego: plásis (formación)",sig:"Formación celular.",ej:["Hiperplasia → ↑nº de células","Displasia → anormal","Aplasia → ausencia","Metaplasia → cambio de tipo","Hipoplasia → pobre","Neoplasia → tumor","Anaplasia → indiferenciado"],tip:"🌱 Crecimiento."},
{cat:"func",t:"s",tx:"-trofia",or:"Griego: trophḗ (nutrición)",sig:"Nutrición / tamaño tisular.",ej:["Hipertrofia → ↑tamaño","Atrofia → ↓tamaño","Distrofia → anormal","Hipotrofia","Eutrofia → normal"],tip:"🌿 Tamaño por nutrición."},
{cat:"func",t:"s",tx:"-cinesia / -cinesis",or:"Griego: kínēsis (movimiento)",sig:"Movimiento.",ej:["Discinesia → anormal","Acinesia → ausente","Bradicinesia → lenta (Parkinson)","Hipercinesia → excesiva","Cinesiología"],tip:"🏃 Movimiento."},
{cat:"func",t:"s",tx:"-fagia",or:"Griego: phageîn (comer)",sig:"Deglutir o comer.",ej:["Disfagia → dificultad","Odinofagia → dolor al tragar","Polifagia → hambre excesiva","Afagia","Aerofagia → tragar aire","Coprofagia"],tip:"🍽️ Tragar."},
{cat:"func",t:"s",tx:"-pnea",or:"Griego: pnéō (respirar)",sig:"Respiración.",ej:["Disnea → dificultad","Apnea → cese","Taquipnea → rápida","Bradipnea → lenta","Ortopnea → en decúbito","Polipnea → profunda rápida","Hiperpnea / Hipopnea"],tip:"🫁 Respirar."},
{cat:"func",t:"s",tx:"-uria",or:"Griego: oûron (orina)",sig:"Relativo a orina.",ej:["Hematuria → sangre","Proteinuria → proteínas","Poliuria → ↑","Oliguria → ↓","Anuria → ausencia","Disuria → dolor","Glucosuria → glucosa","Piuria → pus","Nicturia → nocturna","Polaquiuria → frecuente"],tip:"💦 Orina."},
{cat:"func",t:"s",tx:"-penia",or:"Griego: penía (pobreza)",sig:"Disminución.",ej:["Leucopenia","Trombocitopenia","Neutropenia","Osteopenia","Linfopenia","Sarcopenia → músculo"],tip:"📉 Escasez."},
{cat:"func",t:"s",tx:"-citosis",or:"Griego: kýtos + -osis",sig:"Aumento de células específicas.",ej:["Leucocitosis","Linfocitosis","Eosinofilia","Eritrocitosis","Trombocitosis","Monocitosis"],tip:"📈 Opuesto a -penia."},
{cat:"func",t:"s",tx:"-filia",or:"Griego: philía (afinidad)",sig:"Afinidad o aumento específico.",ej:["Hemofilia → tendencia al sangrado","Eosinofilia → ↑eosinófilos","Basofilia → tinción","Neutrofilia","Termofilia"],tip:"❤️ Atracción / más de."},
{cat:"func",t:"s",tx:"-fobia",or:"Griego: phóbos (miedo)",sig:"Miedo o rechazo.",ej:["Fotofobia → luz","Hidrofobia → rabia","Acrofobia → alturas","Claustrofobia → encierro","Xenofobia","Aracnofobia"],tip:"😱 Rechazo."},
{cat:"func",t:"s",tx:"-génesis",or:"Griego: génesis (origen)",sig:"Origen / producción.",ej:["Patogénesis","Oncogénesis → tumor","Osteogénesis","Espermatogénesis","Gametogénesis","Angiogénesis"],tip:"🌱 Cómo nace."},
{cat:"func",t:"s",tx:"-poyesis",or:"Griego: poíēsis (producir)",sig:"Producción / formación.",ej:["Hematopoyesis → sangre","Eritropoyesis → rojos","Leucopoyesis → blancos","Trombopoyesis → plaquetas","Uropoyesis → orina"],tip:"🏭 Fabricar."},
{cat:"func",t:"s",tx:"-tropo / -trópico",or:"Griego: trépō (dirigir)",sig:"Que dirige la acción hacia.",ej:["Cardiotrópico","Hepatotrópico","Psicotrópico","Gonadotropina","Corticotropina (ACTH)","Tirotrópina (TSH)","Somatotrópica (GH)"],tip:"🎯 Dirigido a."},
{cat:"func",t:"s",tx:"-lepsia",or:"Griego: lēpsis (crisis/tomar)",sig:"Crisis, ataque o convulsión.",ej:["Epilepsia → sobre-crisis","Narcolepsia → sueño súbito","Catalepsia → rigidez"],tip:"Crisis súbita."},
{cat:"func",t:"s",tx:"-mnesia",or:"Griego: mnḗmē (memoria)",sig:"Memoria.",ej:["Amnesia → pérdida","Hipermnesia → ↑memoria","Paramnesia → falsificación","Dismnesia"],tip:"🧠 Memoria."},
{cat:"func",t:"s",tx:"-praxia",or:"Griego: prâxis (acción)",sig:"Ejecución de movimiento voluntario.",ej:["Apraxia → incapacidad","Dispraxia → trastorno"],tip:"Planear movimiento."},
{cat:"func",t:"s",tx:"-tonia",or:"Griego: tónos (tensión)",sig:"Tensión o tono muscular.",ej:["Hipertonía → ↑tono","Hipotonía → ↓tono","Distonía → anormal","Atonía → sin tono","Miotonía","Tonicoclónica"],tip:"Tono muscular."},
{cat:"func",t:"s",tx:"-lalia",or:"Griego: laliá (habla)",sig:"Trastorno del habla.",ej:["Ecolalia → repetir como eco","Coprolalia → palabrotas involuntarias (Tourette)","Glosolalia → hablar incoherente"],tip:"🗣️ Alteración del habla."},
{cat:"func",t:"s",tx:"-artria",or:"Griego: arthroun (articular)",sig:"Articulación del habla.",ej:["Disartria → habla mal articulada","Anartria → incapacidad total","Disartria bulbar / pseudobulbar"],tip:"Pronunciar."},
{cat:"func",t:"s",tx:"-grafia (psi)",or:"Griego: gráphō",sig:"Escritura.",ej:["Agrafía → no puede escribir","Disgrafía → dificultad","Caligrafía"],tip:"✍️ Escribir."},
{cat:"func",t:"s",tx:"-lexia",or:"Griego: léxis (palabra)",sig:"Lectura.",ej:["Dislexia","Alexia → no puede leer","Hiperlexia → lectura precoz (TEA)"],tip:"📖 Leer."},
{cat:"func",t:"s",tx:"-tanasia",or:"Griego: thánatos (muerte)",sig:"Muerte.",ej:["Eutanasia → 'buena muerte'","Distanasia → prolongación artificial","Ortotanasia → muerte natural sin prolongar"],tip:"💀 Muerte."},
{cat:"func",t:"s",tx:"-flexión",or:"Latín: flexio (doblar)",sig:"Doblar / disminuir ángulo articular.",ej:["Flexión de codo","Dorsiflexión → levantar el pie","Flexión plantar → apuntar el pie","Flexión cervical → barbilla al pecho"],tip:"Doblar."},
{cat:"func",t:"s",tx:"-extensión",or:"Latín: extensio (estirar)",sig:"Estirar / aumentar ángulo articular.",ej:["Extensión de rodilla","Hiperextensión → más allá de 180°","Extensión cervical → mirar arriba"],tip:"Estirar."},
{cat:"func",t:"s",tx:"-ducción",or:"Latín: ducere (conducir)",sig:"Ab-ducción = alejar de la línea media. Ad-ducción = acercar.",ej:["Abducción → abrir brazos","Aducción → cerrar brazos","Abductor / Aductor","Abducción de cadera"],tip:"Ab = alejar · Ad = acercar."},
{cat:"func",t:"s",tx:"-rotación",or:"Latín: rotare (girar)",sig:"Giro sobre el eje longitudinal.",ej:["Rotación interna → hacia adentro","Rotación externa → hacia afuera","Pronación → palma abajo (rotación)","Supinación → palma arriba (rotación)"],tip:"🔄 Girar."},
{cat:"func",t:"s",tx:"-versión",or:"Latín: vertere (girar)",sig:"Giro como unidad o posición relativa.",ej:["Anteversión → inclinado adelante","Retroversión → inclinado atrás","Inversión → planta hacia adentro","Eversión → planta hacia afuera","Conversión → transformar"],tip:"Giro de posición."},
]);

/* === VOC batch 5: loc (29) + med (21) = 50 entries === */
VOCAB_VOC.push.apply(VOCAB_VOC, [
/* loc */
{cat:"loc",t:"p",tx:"dextro-",or:"Latín: dexter (derecho)",sig:"Derecha.",ej:["Dextrocardia","Dextrógiro","Situs inversus"],tip:"➡️ Derecha."},
{cat:"loc",t:"p",tx:"levo- / sinistro-",or:"Latín: laevus / sinister",sig:"Izquierda.",ej:["Levocardia","Levógiro","Sinistrocardia"],tip:"⬅️ Izquierda."},
{cat:"loc",t:"p",tx:"ecto-",or:"Griego: ektós (fuera)",sig:"Fuera / externo.",ej:["Ectópico → fuera de lugar (embarazo)","Ectodermo","Ectoparásito"],tip:"🚪 Fuera."},
{cat:"loc",t:"p",tx:"endo-",or:"Griego: éndon (dentro)",sig:"Dentro / interno.",ej:["Endocardio","Endoscopia","Endógeno","Endometrio","Endocrino","Endotelio"],tip:"🏠 Dentro."},
{cat:"loc",t:"p",tx:"epi-",or:"Griego: epí (sobre)",sig:"Sobre, encima.",ej:["Epidermis → sobre dermis","Epicardio","Epigastrio","Epiglotis","Epilepsia → 'ataque sobre'"],tip:"⬆️ Encima."},
{cat:"loc",t:"p",tx:"hipo-",or:"Griego: hypó (debajo)",sig:"Debajo O disminuido.",ej:["Hipoglucemia","Hipogastrio","Hipotensión","Hipodermis","Hipotiroidismo","Hipoxia"],tip:"⬇️ Abajo / poco."},
{cat:"loc",t:"p",tx:"hiper-",or:"Griego: hypér (sobre)",sig:"Exceso / aumentado.",ej:["Hipertensión","Hiperglucemia","Hipertrofia","Hipertiroidismo","Hiperemesis","Hiperoxia"],tip:"⬆️ Mucho."},
{cat:"loc",t:"p",tx:"peri-",or:"Griego: perí (alrededor)",sig:"Alrededor.",ej:["Pericardio","Periorbitario","Peritoneo","Periostio → alrededor del hueso","Perianal","Perinatal"],tip:"🔄 Alrededor."},
{cat:"loc",t:"p",tx:"meso-",or:"Griego: mésos (medio)",sig:"En el medio.",ej:["Mesogastrio","Mesodermo","Mesenterio","Mesocolon"],tip:"⏺️ Medio."},
{cat:"loc",t:"p",tx:"para-",or:"Griego: pará (al lado)",sig:"Al lado de.",ej:["Paratiroides","Paraumbilical","Paravertebral","Paranasal","Parenteral → al lado del intestino"],tip:"↔️ Junto a."},
{cat:"loc",t:"p",tx:"retro-",or:"Latín: retro (atrás)",sig:"Detrás.",ej:["Retroperitoneal","Retroesternal","Retrógrado","Retrofaríngeo"],tip:"⏪ Detrás."},
{cat:"loc",t:"p",tx:"ante- / pre-",or:"Latín: ante / prae",sig:"Delante / antes.",ej:["Anteversión","Prenatal","Premenstrual","Preoperatorio"],tip:"➡️ Adelante/antes."},
{cat:"loc",t:"p",tx:"post-",or:"Latín: post (después)",sig:"Después / detrás.",ej:["Postparto","Postoperatorio","Postprandial → tras comer"],tip:"Después."},
{cat:"loc",t:"p",tx:"sub-",or:"Latín: sub (debajo)",sig:"Debajo (eq. latino de hipo-).",ej:["Subcutáneo","Sublingual","Subdural","Subescapular","Subcostal"],tip:"🔽 Debajo."},
{cat:"loc",t:"p",tx:"supra-",or:"Latín: supra (encima)",sig:"Encima (eq. latino de epi-).",ej:["Suprarrenal","Supraclavicular","Supraescapular","Supraventricular"],tip:"🔼 Encima."},
{cat:"loc",t:"p",tx:"inter-",or:"Latín: inter (entre)",sig:"Entre.",ej:["Intercostal","Interfalángico","Intervertebral","Interoseo"],tip:"↔️ Entre."},
{cat:"loc",t:"p",tx:"intra-",or:"Latín: intra (dentro)",sig:"Dentro de.",ej:["Intravenoso (IV)","Intraarticular","Intramuscular (IM)","Intratecal → saco dural","Intracraneal"],tip:"🎯 Adentro."},
{cat:"loc",t:"p",tx:"extra-",or:"Latín: extra (fuera)",sig:"Fuera de.",ej:["Extracelular","Extrahepático","Extrapiramidal","Extrauterino"],tip:"🚪 Fuera (latino)."},
{cat:"loc",t:"p",tx:"trans-",or:"Latín: trans (a través)",sig:"A través / al otro lado.",ej:["Transvaginal","Transuretral","Transabdominal","Transfusión","Transplante"],tip:"🌉 A través."},
{cat:"loc",t:"p",tx:"dia-",or:"Griego: diá (a través)",sig:"A través / entre (gr.).",ej:["Diarrea → fluir a través","Diaforesis → sudar","Diagnóstico → conocer a través","Diálisis"],tip:"🌉 A través (gr.)."},
{cat:"loc",t:"p",tx:"circum-",or:"Latín: circum (alrededor)",sig:"Alrededor (lat.).",ej:["Circumcisión → cortar alrededor","Circunvalación","Circunferencia"],tip:"🔄 Latino de peri."},
{cat:"loc",t:"p",tx:"ipsi- / contra-",or:"Latín: ipse (mismo) / contra (opuesto)",sig:"Mismo lado / lado opuesto.",ej:["Ipsilateral → mismo lado","Contralateral → opuesto","Bilateral → ambos","Unilateral → uno solo"],tip:"Lados."},
{cat:"loc",t:"p",tx:"ana-",or:"Griego: aná (arriba/hacia arriba)",sig:"Hacia arriba / de nuevo.",ej:["Anabolismo → construir","Anabólico","Anamnesis → recuerdo","Anatomía → cortar arriba (por capas)"],tip:"⬆️ Hacia arriba."},
{cat:"loc",t:"p",tx:"cata-",or:"Griego: katá (hacia abajo)",sig:"Hacia abajo / destruir.",ej:["Catabolismo → destruir","Catatonia → 'abajo'","Catarata → 'caída'"],tip:"⬇️ Hacia abajo."},
{cat:"loc",t:"p",tx:"proximal / distal",or:"Latín: proximus / distare",sig:"Proximal = más cerca del tronco. Distal = más lejos del tronco.",ej:["Falange proximal → más cercana","Falange distal → punta del dedo","Fractura distal del radio (Colles)","Obstrucción proximal vs distal"],tip:"Cerca vs lejos del centro."},
{cat:"loc",t:"p",tx:"lateral / medial",or:"Latín: latus / medius",sig:"Lateral = hacia afuera. Medial = hacia la línea media.",ej:["Menisco lateral vs medial","Ligamento colateral lateral/medial","Epicóndilo lateral → codo de tenista","Epicóndilo medial → codo de golfista"],tip:"Fuera vs dentro."},
{cat:"loc",t:"p",tx:"ventral / dorsal",or:"Latín: venter / dorsum",sig:"Ventral = anterior (frente). Dorsal = posterior (espalda).",ej:["Cara ventral de la mano → palma","Cara dorsal → dorso","Decúbito ventral = prono","Decúbito dorsal = supino"],tip:"Frente vs espalda."},
{cat:"loc",t:"p",tx:"superior / inferior",or:"Latín: superus / inferus",sig:"Superior = craneal (arriba). Inferior = caudal (abajo).",ej:["Vena cava superior/inferior","Miembro superior/inferior","Mesentérica superior/inferior"],tip:"Arriba vs abajo."},
{cat:"loc",t:"p",tx:"superficial / profundo",or:"Latín: superficialis / profundus",sig:"Superficial = cerca de la piel. Profundo = más interno.",ej:["Venas superficiales → safena","Venas profundas → femoral","Quemadura superficial vs profunda","Fascia superficial/profunda"],tip:"Piel vs interior."},
/* med */
{cat:"med",t:"p",tx:"poli-",or:"Griego: polýs (mucho)",sig:"Mucho.",ej:["Poliuria","Polidipsia → mucha sed","Polifagia","Policitemia","Polimiositis","Poliquístico","Polineuropatía"],tip:"➕ Muchos."},
{cat:"med",t:"p",tx:"oligo-",or:"Griego: olígos (poco)",sig:"Poco, escaso.",ej:["Oliguria","Oligomenorrea","Oligodendrocito","Oligofrenia (histórico)","Oligoespermia"],tip:"➖ Poco."},
{cat:"med",t:"p",tx:"a- / an-",or:"Griego: a- (sin)",sig:"Ausencia, sin.",ej:["Anuria / Apnea / Afebril","Asintomático","Atrofia","Ageusia → sin gusto","Anosmia → sin olfato","Acianótico","Anencefalia","Aplasia"],tip:"🚫 Negación."},
{cat:"med",t:"p",tx:"macro-",or:"Griego: makrós (grande)",sig:"Grande.",ej:["Macrocefalia","Macroglosia","Macrocítico","Macrosomía → bebé grande","Macrófago"],tip:"🔍 Grande."},
{cat:"med",t:"p",tx:"micro-",or:"Griego: mikrós (pequeño)",sig:"Pequeño.",ej:["Microcefalia","Microcítico","Microcirugía","Microscopio","Microbiología"],tip:"🔬 Pequeño."},
{cat:"med",t:"p",tx:"mega- / megalo-",or:"Griego: mégas (grande)",sig:"Muy grande.",ej:["Megacolon","Hepatomegalia","Esplenomegalia","Cardiomegalia","Acromegalia → extremidades","Megaloblasto"],tip:"📏 MUY grande."},
{cat:"med",t:"p",tx:"brady-",or:"Griego: bradýs (lento)",sig:"Lento.",ej:["Bradicardia → FC<60","Bradipnea","Bradicinesia","Bradipsiquia","Bradilalia"],tip:"🐢 Lento."},
{cat:"med",t:"p",tx:"taqui-",or:"Griego: tachýs (rápido)",sig:"Rápido.",ej:["Taquicardia → FC>100","Taquipnea","Taquiarritmia","Taquipsiquia","Taquilalia"],tip:"⚡ Rápido."},
{cat:"med",t:"p",tx:"iso-",or:"Griego: ísos (igual)",sig:"Igual.",ej:["Isocoria → pupilas iguales","Isotónico","Isométrico","Isovolumétrico"],tip:"= Iguales."},
{cat:"med",t:"p",tx:"aniso-",or:"Griego: an- + ísos",sig:"Desigual.",ej:["Anisocoria → pupilas desiguales","Anisocitosis → hematíes distintos tamaños","Anisotrópico"],tip:"≠ Desiguales."},
{cat:"med",t:"p",tx:"di- / bi-",or:"Griego: dís / Latín: bis (dos)",sig:"Dos, doble.",ej:["Diplopía → visión doble","Bilateral","Bifurcación","Bicúspide","Diplacusia"],tip:"2️⃣ Dos."},
{cat:"med",t:"p",tx:"tri-",or:"Griego: treîs / Latín: tres (tres)",sig:"Tres.",ej:["Tricúspide → 3 valvas","Triglicérido","Trimestre","Trigémino → nervio V (3 ramas)"],tip:"3️⃣ Tres."},
{cat:"med",t:"p",tx:"tetra- / cuadri-",or:"Griego: téttares / Latín: quattuor",sig:"Cuatro.",ej:["Tetraplejia → 4 extremidades","Cuadriplejia","Tétrada → 4 elementos","Cuadrante"],tip:"4️⃣ Cuatro."},
{cat:"med",t:"p",tx:"hemi-",or:"Griego: hēmi- (mitad)",sig:"Mitad.",ej:["Hemiplejia","Hemicránea","Hemisferio","Hemitórax","Hemianopsia"],tip:"½ Mitad."},
{cat:"med",t:"p",tx:"semi-",or:"Latín: semi (mitad)",sig:"Mitad (eq. latino de hemi-).",ej:["Semiología","Semicomatoso","Semilunar"],tip:"½ Mitad (lat.)."},
{cat:"med",t:"p",tx:"auto-",or:"Griego: autós (propio)",sig:"Propio / sí mismo.",ej:["Autoinmune","Autotransplante","Autolisis","Autosómico"],tip:"🪞 Uno mismo."},
{cat:"med",t:"p",tx:"hetero-",or:"Griego: héteros (otro)",sig:"Distinto.",ej:["Heterogéneo","Heterotrasplante → de otra especie","Heterotopia → tejido fuera de lugar","Heterocigoto"],tip:"🔀 Distinto."},
{cat:"med",t:"p",tx:"homo-",or:"Griego: homós (igual)",sig:"Igual / mismo.",ej:["Homogéneo","Homocigoto","Homotermia","Homosexual"],tip:"= Igual."},
{cat:"med",t:"p",tx:"normo-",or:"Latín: norma (regla)",sig:"Normal.",ej:["Normoglucemia","Normotensión","Normocítico","Normocrómico"],tip:"✓ Dentro del rango."},
{cat:"med",t:"p",tx:"eu-",or:"Griego: eû (bien/bueno)",sig:"Normal / bien.",ej:["Eupnea → respiración normal","Eutrofia → bien nutrido","Eucórico → pupilas normales","Eutanasia → buena muerte"],tip:"😊 Bien."},
{cat:"med",t:"p",tx:"dis-",or:"Griego: dys- (mal)",sig:"Mal, difícil, anormal.",ej:["Disnea → respirar mal","Disfagia","Disuria","Displasia","Disritmia","Disartria"],tip:"❌ Mal / difícil."},
]);
