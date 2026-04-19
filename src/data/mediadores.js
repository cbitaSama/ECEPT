// ══════════════════════════════════════════════════════════════
// DATOS GENERALIDADES — MEDIADORES DE LA INFLAMACIÓN
// Cada mediador: {id, fam, n(ombre), r(ol), o(rigen), f(unción), k(ey points[]), t(erapia?), p(earl?)}
// ══════════════════════════════════════════════════════════════

var MED_ROLES={
  pro:{c:"#ef4444",bg:"rgba(239,68,68,.08)",bd:"rgba(239,68,68,.25)",l:"Pro-inflamatorio",i:"🔥"},
  anti:{c:"#34d399",bg:"rgba(52,211,153,.08)",bd:"rgba(52,211,153,.25)",l:"Anti-inflamatorio",i:"🧊"},
  dual:{c:"#fbbf24",bg:"rgba(251,191,36,.08)",bd:"rgba(251,191,36,.25)",l:"Dual / Regulador",i:"⚖️"},
  vaso:{c:"#f472b6",bg:"rgba(244,114,182,.08)",bd:"rgba(244,114,182,.25)",l:"Vasoactivo",i:"💨"},
  quim:{c:"#a78bfa",bg:"rgba(167,139,250,.08)",bd:"rgba(167,139,250,.25)",l:"Quimiotáctico",i:"🧭"}
};

var MED_FAMILIES=[
  {id:"citok", n:"Citocinas & Interleucinas", i:"🧬", c:"#3b82f6",
    d:"Proteínas de señalización entre células inmunitarias. IL=interleucinas (entre leucocitos), TNF=necrosis tumoral, IFN=interferones."},
  {id:"eico", n:"Eicosanoides", i:"🔄", c:"#f472b6",
    d:"Derivados del ácido araquidónico (AA). Vía COX → prostaglandinas/tromboxanos. Vía LOX → leucotrienos."},
  {id:"comp", n:"Complemento", i:"💎", c:"#a78bfa",
    d:"Cascada de ~30 proteínas plasmáticas. 3 vías: clásica (Ag-Ac), alternativa (patógenos), lectinas (manosa)."},
  {id:"amin", n:"Aminas Vasoactivas", i:"💨", c:"#e879f9",
    d:"Preformadas en gránulos. Liberación inmediata ante estímulo. Histamina y serotonina."},
  {id:"pept", n:"Péptidos & Quininas", i:"🧩", c:"#fbbf24",
    d:"Sistema calicreína-quinina. Bradicinina es el prototipo: dolor + vasodilatación + edema."},
  {id:"nit",  n:"Radicales & Gases", i:"⚡", c:"#22d3ee",
    d:"ROS, NO y gas H₂S. Mediadores difusibles con vida media muy corta."}
];

var MED_LIST=[
  // ───────── CITOCINAS / INTERLEUCINAS ─────────
  {id:"il1", fam:"citok", n:"IL-1 (α y β)", r:"pro", o:"Macrófagos, monocitos, células endoteliales",
    f:"Pirógeno endógeno principal. Induce fiebre, activa linfocitos T, ↑ moléculas de adhesión endoteliales.",
    k:["Junto con TNF-α y IL-6 = la TRIADA PROINFLAMATORIA","Induce fiebre actuando sobre el hipotálamo (vía PGE₂)","Activa COX-2 y iNOS","IL-1β requiere procesamiento por el inflamasoma (caspasa-1)"],
    t:"Anakinra (antagonista del receptor), Canakinumab (anti-IL-1β). Usos: artritis reumatoide, Still, fiebres periódicas.",
    p:"La fiebre de la gota, pseudogota y enfermedad de Still es mediada principalmente por IL-1."},

  {id:"il2", fam:"citok", n:"IL-2", r:"pro", o:"Linfocitos T CD4+ (Th1)",
    f:"Factor de crecimiento de linfocitos T. Expande clonalmente células T activadas y NK.",
    k:["Clave en la respuesta adaptativa temprana","Diana del inmunosupresor ciclosporina y tacrolimus (bloquean calcineurina → ↓ IL-2)","Aldesleukin (IL-2 recombinante) se usó en melanoma y cáncer renal"],
    t:"Basiliximab (anti-CD25/receptor de IL-2) para rechazo de trasplante.",
    p:"Ciclosporina, tacrolimus y sirolimus → todos terminan bloqueando la vía de IL-2."},

  {id:"il4", fam:"citok", n:"IL-4", r:"anti", o:"Linfocitos Th2, mastocitos, basófilos",
    f:"Diferenciación a Th2. Switch de isotipo a IgE. INHIBE la respuesta Th1 y macrófagos M1.",
    k:["⭐ SUPRIME IL-6 e IL-11 y otras citocinas proinflamatorias","Promueve alergia (IgE) y defensa antiparasitaria","Polariza macrófagos al fenotipo M2 (reparador)","Antagonista funcional de IFN-γ"],
    t:"Dupilumab bloquea IL-4Rα (comparte con IL-13) — dermatitis atópica, asma eosinofílico.",
    p:"IL-4/IL-13/IL-5 = eje Th2 (alergia). IL-4 es la 'pacificadora' que baja IL-6/11."},

  {id:"il5", fam:"citok", n:"IL-5", r:"pro", o:"Th2, mastocitos",
    f:"Diferenciación y activación de EOSINÓFILOS. Prolonga su supervivencia tisular.",
    k:["Elevada en asma eosinofílico, poliangeítis eosinofílica con granulomatosis (EGPA)","También en parasitosis tisulares (helmintos)","Sin IL-5 → sin eosinofilia significativa"],
    t:"Mepolizumab, Reslizumab (anti-IL-5). Benralizumab (anti-IL-5Rα, depleta eosinófilos)."},

  {id:"il6", fam:"citok", n:"IL-6", r:"pro", o:"Macrófagos, fibroblastos, células T y endoteliales",
    f:"Principal inductor de la respuesta de fase aguda hepática (PCR, fibrinógeno, hepcidina). Diferenciación de Th17.",
    k:["⭐ PRINCIPAL inductor de PCR — por eso PCR es marcador indirecto de IL-6","Pirógeno (sube fiebre con IL-1 y TNF)","Hepcidina ↑ → secuestro de hierro → ANEMIA DE TRASTORNOS CRÓNICOS","Tormenta de citocinas (COVID grave, CAR-T): IL-6 es protagonista","IL-4 la BAJA"],
    t:"Tocilizumab, Sarilumab (anti-IL-6R). AR, arteritis células gigantes, síndrome de liberación de citocinas.",
    p:"Anemia en AR/LES crónico = hepcidina ↑ por IL-6. No dar hierro, tratar la inflamación."},

  {id:"il8", fam:"citok", n:"IL-8 (CXCL8)", r:"quim", o:"Macrófagos, endotelio",
    f:"Quimiocina prototipo: atrae y activa NEUTRÓFILOS al sitio de inflamación.",
    k:["Es la quimiocina por excelencia para PMN","↑ en infecciones bacterianas, IAM, IBD","Induce degranulación y burst oxidativo"],
    p:"Si hay pus (PMN), IL-8 estuvo en la escena."},

  {id:"il10", fam:"citok", n:"IL-10", r:"anti", o:"Treg, macrófagos M2, Th2",
    f:"Inmunosupresora potente. Apaga a los macrófagos y células dendríticas. Fin de la respuesta inflamatoria.",
    k:["Junto con TGF-β = las principales ANTIINFLAMATORIAS","Su déficit → enfermedad inflamatoria intestinal grave pediátrica","Inhibe IL-1, IL-6, IL-12, TNF-α e IFN-γ"],
    p:"IL-10 es el 'apaga-fuegos' del sistema. Déficit = inflamación descontrolada."},

  {id:"il11", fam:"citok", n:"IL-11", r:"pro", o:"Estroma medular, fibroblastos",
    f:"Familia de IL-6 (comparte receptor gp130). Trombopoyetina secundaria. Reparación tisular (pero puede inducir fibrosis).",
    k:["⭐ Sube junto con IL-6, y IL-4 también la SUPRIME","Estimula plaquetas (oprelvekin para trombocitopenia por QT)","Crecientes datos en fibrosis cardíaca, renal y pulmonar"]},

  {id:"il12", fam:"citok", n:"IL-12", r:"pro", o:"Células dendríticas, macrófagos",
    f:"Polariza linfocitos T vírgenes hacia Th1 (defensa intracelular). Activa NK → IFN-γ.",
    k:["Eje IL-12/IFN-γ = defensa contra micobacterias, Listeria, Leishmania","Déficit de receptor → susceptibilidad a micobacterias no tuberculosas"],
    t:"Ustekinumab bloquea p40 (subunidad compartida con IL-23) — psoriasis, Crohn."},

  {id:"il13", fam:"citok", n:"IL-13", r:"pro", o:"Th2, mastocitos",
    f:"Hermana funcional de IL-4. Hiperreactividad bronquial, producción de moco, fibrosis.",
    k:["Clave en el asma alérgico y la dermatitis atópica","Comparte receptor con IL-4 (IL-4Rα)"],
    t:"Dupilumab (bloquea IL-4Rα → también bloquea IL-13). Tralokinumab (anti-IL-13)."},

  {id:"il17", fam:"citok", n:"IL-17", r:"pro", o:"Linfocitos Th17",
    f:"Reclutamiento de neutrófilos. Defensa antifúngica (Candida) y contra bacterias extracelulares.",
    k:["Eje IL-23/IL-17 patogénico en psoriasis, espondilitis anquilosante, EII","Déficit (hiper-IgE / Job) → candidiasis mucocutánea crónica"],
    t:"Secukinumab, Ixekizumab (anti-IL-17A). Brodalumab (anti-IL-17R)."},

  {id:"il23", fam:"citok", n:"IL-23", r:"pro", o:"Células dendríticas",
    f:"Mantiene y expande la línea Th17. Sin IL-23, Th17 no se perpetúa.",
    k:["Diana moderna en psoriasis (más selectiva que anti-p40)","Comparte subunidad p40 con IL-12"],
    t:"Guselkumab, Risankizumab, Tildrakizumab (anti-p19 específicos de IL-23)."},

  {id:"tnfa", fam:"citok", n:"TNF-α", r:"pro", o:"Macrófagos activados, células T, NK",
    f:"Master-regulator proinflamatorio. Activa endotelio, induce apoptosis, media shock séptico y caquexia.",
    k:["⭐ Junto con IL-1 e IL-6 = triada proinflamatoria","Caquexia neoplásica y de infecciones crónicas","Induce ↑ moléculas de adhesión (ICAM, VCAM, E-selectina)","Granuloma se DESARMA sin TNF (riesgo de reactivar TBC con anti-TNF)"],
    t:"Infliximab, Adalimumab, Etanercept, Golimumab, Certolizumab. AR, espondilitis, psoriasis, Crohn.",
    p:"Antes de iniciar anti-TNF → PPD/IGRA obligatorio. Reactivación de TBC."},

  {id:"tgfb", fam:"citok", n:"TGF-β", r:"dual", o:"Plaquetas, macrófagos, Treg",
    f:"Antiinflamatorio e inmunosupresor, PERO también induce fibrosis y diferenciación a Th17/Treg según contexto.",
    k:["Induce diferenciación de Treg (junto con IL-2) y Th17 (junto con IL-6)","Clave en fibrosis pulmonar idiopática, cirrosis, esclerodermia","Promueve cicatrización pero también cicatriz patológica"],
    p:"TGF-β es ambiguo: apaga inflamación pero enciende fibrosis."},

  {id:"ifng", fam:"citok", n:"IFN-γ", r:"pro", o:"Th1, NK, linfocitos T CD8",
    f:"Activa macrófagos (M1), potencia MHC-I y MHC-II. Respuesta contra patógenos INTRACELULARES.",
    k:["Activa el macrófago para fagocitar y formar granulomas","Quantiferon / IGRA se basa en la liberación de IFN-γ","Déficit del receptor → susceptibilidad a micobacterias"]},

  {id:"ifnab", fam:"citok", n:"IFN-α / IFN-β", r:"pro", o:"Leucocitos (α), fibroblastos (β), cualquier célula infectada",
    f:"Antivirales. Inducen estado antiviral celular y activación de NK.",
    k:["Firma de interferones tipo I está elevada en LES","Usados en hepatitis B y C (histórico), esclerosis múltiple (IFN-β)"],
    t:"Anifrolumab (anti-IFN-α/β receptor) aprobado para LES."},

  // ───────── EICOSANOIDES ─────────
  {id:"pge2", fam:"eico", n:"Prostaglandina E₂ (PGE₂)", r:"vaso", o:"COX-1 y COX-2 en casi todas las células",
    f:"Vasodilatación, dolor (hiperalgesia), fiebre, protección gástrica, ovulación, contracción uterina.",
    k:["PGE₂ hipotalámica = causa DIRECTA de fiebre (por eso AINEs bajan fiebre)","Protectora de mucosa gástrica (COX-1) → por eso AINEs producen úlceras","Misoprostol = análogo PGE₁ → úlcera por AINEs, aborto, hemorragia postparto"],
    t:"AINEs bloquean COX-1 y COX-2. Coxibs selectivos COX-2 (celecoxib) respetan mucosa gástrica pero ↑ riesgo CV."},

  {id:"pgi2", fam:"eico", n:"Prostaciclina (PGI₂)", r:"vaso", o:"Endotelio vascular (COX-2)",
    f:"Potente VASODILATADOR e INHIBIDOR de la agregación plaquetaria. Antagonista funcional del TXA₂.",
    k:["Producida por el endotelio sano","Balance PGI₂/TXA₂ = tono vascular y hemostasia","AAS a dosis baja mantiene PGI₂ (endotelio regenera COX) pero inhibe TXA₂ plaquetaria (irreversible)"],
    t:"Epoprostenol, Iloprost, Treprostinil → hipertensión pulmonar."},

  {id:"txa2", fam:"eico", n:"Tromboxano A₂ (TXA₂)", r:"pro", o:"Plaquetas (COX-1)",
    f:"Vasoconstrictor y agregante plaquetario. Antagonista del PGI₂.",
    k:["AAS → inhibición IRREVERSIBLE de COX-1 plaquetaria → efecto antiagregante por 7-10 días (vida plaquetaria)","Las plaquetas son anucleadas → no regeneran COX → por eso AAS basta dosis baja (100 mg)"],
    p:"AAS 100 mg: suficiente para inhibir TXA₂ plaquetaria sin tocar mucho la PGI₂ endotelial."},

  {id:"ltb4", fam:"eico", n:"Leucotrieno B₄ (LTB₄)", r:"quim", o:"Neutrófilos, macrófagos (vía LOX-5)",
    f:"Potente QUIMIOTÁCTICO de neutrófilos. Favorece adhesión y degranulación.",
    k:["Es el LT 'pro-neutrófilo'","Zileuton (inhibidor de 5-LOX) bloquea su síntesis"]},

  {id:"ltcde", fam:"eico", n:"Leucotrienos C₄ / D₄ / E₄ (SRS-A)", r:"pro", o:"Mastocitos, basófilos, eosinófilos (LOX-5)",
    f:"Antiguamente llamados 'sustancia de reacción lenta de la anafilaxia' (SRS-A). Broncoconstricción POTENTE, ↑ permeabilidad, secreción de moco.",
    k:["Mediadores clave del ASMA, sobre todo en asma por AINEs (Samter)","Broncoconstricción 1000x más potente que la histamina","Sí, responden a antileucotrienos"],
    t:"Montelukast, Zafirlukast = antagonistas del receptor CysLT1. Zileuton = inhibidor de síntesis."},

  {id:"samter", fam:"eico", n:"⚠ Tríada de Samter (contexto)", r:"pro", o:"AINEs bloquean COX → acumula AA → se desvía a LOX → ↑ LTs",
    f:"Asma + poliposis nasal + intolerancia a AAS/AINEs. Pseudoalergia mediada por leucotrienos.",
    k:["Mecanismo: inhibición de COX redirige ácido araquidónico a producción de leucotrienos","Evitar TODOS los AINEs","Paracetamol en dosis < 1g suele ser tolerado"],
    p:"Samter = el ejemplo clásico de por qué los leucotrienos importan clínicamente."},

  // ───────── COMPLEMENTO ─────────
  {id:"c3a_c5a", fam:"comp", n:"C3a / C5a (anafilotoxinas)", r:"pro", o:"Escisión de C3 y C5 en las 3 vías",
    f:"Quimiotaxis de neutrófilos (C5a es el más potente), degranulación de mastocitos, ↑ permeabilidad, vasodilatación.",
    k:["C5a = quimiotáctico MÁS potente del sistema","Anafilotoxina: imitan anafilaxia por liberación de histamina","C3a < C5a en potencia"]},

  {id:"c3b", fam:"comp", n:"C3b (opsonina)", r:"pro", o:"Escisión de C3",
    f:"Opsoniza patógenos para fagocitosis por macrófagos y neutrófilos (receptor CR1).",
    k:["Opsonina PRINCIPAL del sistema inmune innato","Déficit de C3 → infecciones piógenas recurrentes (encapsulados)"]},

  {id:"mac", fam:"comp", n:"C5b-9 (MAC)", r:"pro", o:"Ensamblaje terminal (C5b + C6-C9)",
    f:"Complejo de Ataque a la Membrana. Poro transmembrana → lisis osmótica del patógeno (sobre todo Neisseria).",
    k:["⭐ Déficit de C5-C9 → infecciones recurrentes por NEISSERIA (meningitis, gonococemia)","Eculizumab bloquea C5 → HPN y SHUa","Vacuna antimeningocócica obligatoria antes de eculizumab"]},

  {id:"c1inh", fam:"comp", n:"C1-inhibidor (regulador)", r:"anti", o:"Hepático",
    f:"Inhibe C1 (vía clásica), calicreína y factores XII/XI. Controla complemento y bradicinina.",
    k:["⭐ Déficit = ANGIOEDEMA HEREDITARIO (no responde a antihistamínicos ni corticoides)","Icatibant (antagonista bradicinina), C1-INH concentrado, Ecallantide"],
    p:"Angioedema que no cede con adrenalina/antihistamínicos → pensar en déficit de C1-inhibidor."},

  // ───────── AMINAS VASOACTIVAS ─────────
  {id:"hist", fam:"amin", n:"Histamina", r:"vaso", o:"Mastocitos, basófilos (gránulos preformados)",
    f:"PRIMER mediador liberado. Vasodilatación arteriolar, ↑ permeabilidad venular, broncoconstricción, prurito.",
    k:["Receptores: H1 (alergia/inflamación), H2 (ácido gástrico), H3/H4 (SNC/inmunidad)","H1: loratadina, cetirizina, difenhidramina","H2: ranitidina (retirada), famotidina","Liberación triple respuesta de Lewis: eritema, edema, halo"],
    p:"Reacción aguda = histamina. Reacción tardía mantenida = leucotrienos + citocinas."},

  {id:"sero", fam:"amin", n:"Serotonina (5-HT)", r:"vaso", o:"Plaquetas (97% del cuerpo en TGI)",
    f:"Vasoconstricción, agregación plaquetaria secundaria, papel mínimo en inflamación cutánea humana.",
    k:["Clínica inflamatoria menor que histamina en humanos","Clave en síndrome carcinoide (flush, diarrea, broncoespasmo)"]},

  // ───────── PÉPTIDOS / QUININAS ─────────
  {id:"brad", fam:"pept", n:"Bradicinina", r:"vaso", o:"Sistema calicreína-quinina (HMWK → bradicinina)",
    f:"Vasodilatación, ↑ permeabilidad, DOLOR (activa nociceptores), broncoconstricción.",
    k:["⭐ IECA inhiben degradación → acumulación → TOS y ANGIOEDEMA por IECA","Degradada por la ECA (kininasa II)","Los ARAII (losartán) NO causan este efecto"],
    t:"Icatibant (antagonista B2) para angioedema por IECA o hereditario.",
    p:"Paciente con tos seca al tomar enalapril = bradicinina acumulada. Cambiar a ARAII."},

  {id:"sp", fam:"pept", n:"Sustancia P", r:"pro", o:"Fibras C nociceptivas, linfocitos",
    f:"Neuropéptido pro-inflamatorio. Vasodilatación, degranulación mastocitaria, dolor neurogénico.",
    k:["Inflamación neurogénica (migraña, dermatitis por contacto irritativa)","Aprepitant (antagonista NK1) para náuseas/vómitos por QT"]},

  // ───────── RADICALES / GASES ─────────
  {id:"no", fam:"nit", n:"Óxido Nítrico (NO)", r:"dual", o:"eNOS (endotelial), iNOS (inducible, inflamatoria), nNOS (neuronal)",
    f:"Vasodilatador potente (eNOS). En inflamación (iNOS): microbicida, pero en exceso causa shock séptico.",
    k:["Nitratos/nitritos (nitroglicerina) → liberan NO → vasodilatación","iNOS inducido por TNF-α, IL-1 y LPS","Shock séptico: NO masivo → vasoplejía refractaria"],
    t:"Azul de metileno (inhibe guanilato ciclasa) en shock vasopléjico refractario."},

  {id:"ros", fam:"nit", n:"ROS (especies reactivas de O₂)", r:"pro", o:"Neutrófilos (burst oxidativo), macrófagos, mitocondria",
    f:"Microbicidas intracelulares: H₂O₂, OH·, O₂⁻, HOCl.",
    k:["NADPH oxidasa: déficit → ENFERMEDAD GRANULOMATOSA CRÓNICA (Catalasa+: S.aureus, Aspergillus)","Mieloperoxidasa genera HOCl (hipoclorito = lejía biológica)","Daño colateral = lesión tisular inflamatoria"]}
];

var MED_RELATIONS=[
  {from:"IL-4", to:["IL-6","IL-11"], label:"suprime", color:"#34d399"},
  {from:"IL-10", to:["IL-1","IL-6","TNF-α","IFN-γ"], label:"apaga", color:"#34d399"},
  {from:"TNF-α", to:["IL-1","IL-6"], label:"induce", color:"#ef4444"},
  {from:"IL-6", to:["PCR","fibrinógeno","hepcidina"], label:"induce fase aguda", color:"#ef4444"}
];
