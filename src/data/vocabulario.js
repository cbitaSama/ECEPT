/* Vocabulario Médico v4 — native data
   Mirrors artifacts/vocabulario_medico_v4.html byte-for-byte
   (Spanish medical content is sacred).

   Arrays:
     VOC   — 256 morpheme entries (14 categories)
     CATS  — 13 category definitions
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
