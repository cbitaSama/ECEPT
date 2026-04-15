// ══════════════════════════════════════════════════════════════
// DATOS LABORATORIOS — VALORES NORMALES (COMPLETO)
// ══════════════════════════════════════════════════════════════
var LAB_SECTIONS=[
  {
    id: "coag", label: "Coagulación", icon: "🩸", accent: "#e05252",
    subtitle: "Hemostasia primaria y cascada de coagulación",
    analytes: [
      { name: "TP — Tiempo de protrombina", range: "11 – 14 seg",
        note: "<strong>Vía extrínseca</strong> (factores VII, III) + <strong>vía común</strong> (I, II, V, X). Evalúa desde el factor tisular hasta la formación de fibrina. Expresado también como INR para monitoreo de anticoagulación oral.",
        up: ["Cirrosis / insuficiencia hepática grave","Déficit de vitamina K","CID (coagulación intravascular diseminada)","Warfarina / acenocumarol","Hipofibrinogenemia"],
        down: ["Hipercoagulabilidad (poco uso clínico del descenso)","Estados trombofílicos"]
      },
      { name: "TTP — Tiempo de tromboplastina parcial", range: "25 – 35 seg",
        note: "<strong>Vía intrínseca</strong> (factores VIII, IX, XI, XII) + <strong>vía común</strong>. Monitor ideal de heparina no fraccionada. TTP > 2x el control = anticoagulación terapéutica.",
        up: ["Heparina no fraccionada","Hemofilia A (déficit VIII) y B (déficit IX)","Anticoagulante lúpico","CID","Enfermedad de von Willebrand grave","Déficit de factor XII (prolongación sin sangrado)"],
        down: ["Inflamación aguda (reactante de fase aguda negativo)","Hipercoagulabilidad"]
      },
      { name: "Tiempo de coagulación (Lee-White)", range: "8 – 15 min",
        note: "Mide el tiempo total in vitro de coagulación en tubo de vidrio. Método clásico, reemplazado en la práctica moderna por el TTP. Útil para monitoreo de heparina en contextos con laboratorio básico.",
        up: ["Hemofilia","Heparina en altas dosis","Hipofibrinogenemia severa"],
        down: ["Sin valor clínico en el acortamiento"]
      },
      { name: "Tiempo de sangría (Ivy / Duke)", range: "2 – 7 min",
        note: "Evalúa la <strong>hemostasia primaria</strong>: función plaquetaria y factor de von Willebrand. Prolongado en alteración cualitativa de plaquetas, no necesariamente cuantitativa.",
        up: ["Trombocitopenia (<50.000)","Trombocitopatías: aspirina, uremia, Bernard-Soulier","Enfermedad de von Willebrand","Afibrinogenemia"],
        down: ["No tiene significado clínico si se acorta"]
      },
      { name: "Dímero D", range: "< 500 ng/mL",
        note: "<strong>Producto de degradación de la fibrina entrecruzada por la plasmina.</strong> Alta sensibilidad (>95%) y baja especificidad. Ideal para <em>descartar</em> TEP/TVP con baja probabilidad pretest. Un dímero D negativo excluye casi con certeza trombosis activa.",
        up: ["TEP / TVP activa","CID","Embarazo (sube fisiológicamente hasta ~3x)","Infección / inflamación sistémica","Neoplasias","Cirugía reciente","COVID-19 grave","IAM / ACV"],
        down: ["No aplica clínicamente"]
      },
      { name: "Plaquetas", range: "150.000 – 450.000 /mm³",
        note: "Fragmentos anucleados de megacariocitos. Vida media ~10 días. Función: adhesión (GPIb-vWF), activación y agregación (GPIIb/IIIa-fibrinógeno) para formar el tapón plaquetario. Producción regulada por trombopoyetina.",
        up: ["Trombocitosis esencial (>1 millón)","Trombocitosis reactiva: infección, inflamación, déficit de hierro","Post-esplenectomía (transitoriamente puede llegar a 1–2 millones)"],
        down: ["PTI (plaquetas <100.000, inmunomediada)","CID (consumo + destrucción)","PTT (púrpura trombótica trombocitopénica)","Hiperesplenismo","Dengue hemorrágico","Quimioterapia / aplasia medular"]
      }
    ]
  },
  {
    id: "serieroja", label: "Serie roja", icon: "🔴", accent: "#e05252",
    subtitle: "Eritrocitos, hemoglobina e índices eritrocitarios",
    analytes: [
      { name: "Eritrocitos (glóbulos rojos)", range: "H: 4.5–6.0 mill/mm³  ·  M: 4.0–5.5 mill/mm³",
        note: "Células anucleadas bicóncavas. Vida media ~120 días. Producción regulada por <strong>eritropoyetina (EPO)</strong> renal. Biconcavidad maximiza superficie de intercambio gaseoso.",
        up: ["Policitemia vera (mutación JAK2 V617F)","Eritrocitosis secundaria: EPOC, altura, tabaquismo","EPO exógena (doping)","Deshidratación (falso aumento relativo)"],
        down: ["Anemia de cualquier causa","Hemorragia aguda o crónica","Hemólisis","Insuf. renal crónica (↓EPO endógena)","Anemia aplásica"]
      },
      { name: "Hemoglobina (Hb)", range: "H: 13.5–17.5 g/dL  ·  M: 12.0–16.0 g/dL",
        note: "Proteína tetramérica (2α + 2β) con 4 grupos hemo. Transporta O₂. <strong>Anemia definida como Hb &lt; 13 H y &lt; 12 M.</strong> Regla práctica: Hto ≈ Hb × 3.",
        up: ["Policitemia vera","Eritrocitosis secundaria (hipoxia crónica)","Deshidratación (hemoconcentración)"],
        down: ["Anemia ferropénica (causa #1 mundial, hipocrómica microcítica)","Talasemia","Déficit B12/folato (macrocítica megaloblástica)","Hemorragia aguda","Hemólisis","ERC (↓EPO)"]
      },
      { name: "Hematocrito (Hto)", range: "H: 40–50%  ·  M: 35–45%",
        note: "Fracción del volumen sanguíneo ocupado por eritrocitos. En anemia aguda puede ser normal en las primeras horas antes de la hemodilución. Regla: Hto ≈ Hb × 3.",
        up: ["Policitemia","Deshidratación (pseudopolicitemia)","Quemaduras extensas (pérdida de plasma)"],
        down: ["Anemias (todas)","Sobrehidratación","Embarazo (Hto ~33% por hemodilución fisiológica)"]
      },
      { name: "HCM — Hemoglobina corpuscular media", range: "27 – 33 pg",
        note: "Cantidad de hemoglobina por eritrocito. HCM = Hb (g/dL) / eritrocitos (mill/mm³) × 10. Indica si el eritrocito es normocrómico, hipocrómico o hipercrómico.",
        up: ["Anemias macrocíticas (B12, folato)","Esferocitosis hereditaria"],
        down: ["Anemia ferropénica (hipocrómica)","Talasemia α y β","Anemia sideroblástica"]
      },
      { name: "CHCM — Concentración Hb corpuscular media", range: "32 – 36 g/dL",
        note: "Concentración de Hb dentro del eritrocito. CHCM = Hb / Hto. El más estable de los índices. <strong>CHCM > 36 es casi patognomónico de esferocitosis hereditaria.</strong>",
        up: ["Esferocitosis hereditaria (único caso real clínicamente relevante)"],
        down: ["Anemia ferropénica","Talasemia","Anemia sideroblástica"]
      },
      { name: "VCM — Volumen corpuscular medio", range: "80 – 100 fL",
        note: "<strong>Clasifica morfológicamente la anemia:</strong> &lt;80 fL = microcítica; 80–100 = normocítica; >100 = macrocítica. Es el primer paso en el algoritmo diagnóstico de anemia.",
        up: ["Macrocítica (>100): déficit B12 o folato (#1), alcohol, hepatopatía, hipotiroidismo, mielodisplasia, metotrexate"],
        down: ["Microcítica (<80): ferropénica (#1 mundial), talasemia, anemia de enfermedad crónica, sideroblástica"]
      },
      { name: "Reticulocitos", range: "0.5–1.5%  ·  25.000–85.000 /mm³ (valor absoluto)",
        note: "Eritrocitos inmaduros con RNA ribosomal residual. Miden la <strong>actividad eritropoyética medular</strong>. Índice reticulocitario corregido (IRC) = % reticulocitos × (Hto real / 45). IRC >2 = anemia regenerativa; IRC <2 = hipoproliferativa.",
        up: ["Anemia hemolítica (médula compensadora, IRC >2)","Hemorragia aguda (respuesta medular 3–5 días post-sangrado)","Respuesta al tratamiento (hierro, B12, folato, EPO)"],
        down: ["Anemia aplásica (IRC <2)","ERC avanzada (↓EPO)","Infiltración medular (leucemia, metástasis)","Quimio/radioterapia"]
      }
    ]
  },
  {
    id: "serieblanca", label: "Serie blanca", icon: "⚪", accent: "#5b8dee",
    subtitle: "Leucocitos: diferencial y valores absolutos",
    analytes: [
      { name: "Leucocitos totales", range: "5.000 – 10.000 /mm³",
        note: "Incluye granulocitos (neutrófilos, eosinófilos, basófilos), monocitos y linfocitos. El <strong>recuento diferencial</strong> (fórmula leucocitaria) es más informativo que el total.",
        up: ["Leucocitosis: infección bacteriana, inflamación, LMC (>100.000), corticoides, estrés fisiológico, embarazo"],
        down: ["Leucopenia: viral (HIV, dengue, EBV), quimioterapia, aplasia medular, hiperesplenismo, LES, metimazol, clozapina"]
      },
      { name: "Cayados (neutrófilos en banda)", range: "1–5%  ·  150–700 /mm³",
        note: "<strong>Neutrófilos inmaduros</strong> con núcleo en banda (no segmentado). Aumento = 'desviación a la izquierda' = signo clásico de infección bacteriana aguda o respuesta inflamatoria severa. Si >10% → desviación marcada.",
        up: ["Infección bacteriana aguda grave","Sepsis","Inflamación severa / posquirúrgico","Quemaduras extensas","Crisis leucemoide"],
        down: ["Aplasia medular","Pancitopenia por cualquier causa"]
      },
      { name: "Neutrófilos segmentados", range: "40–70%  ·  2.000–7.000 /mm³",
        note: "Primera línea defensiva antibacteriana y antifúngica. Vida media en sangre: 6–10 horas. Fagocitosis y degranulación. <strong>Neutropenia grave &lt;500 /mm³ = riesgo infeccioso crítico (neutropenia febril).</strong>",
        up: ["Neutrofilia: bacterias, inflamación, corticoides, tabaco, embarazo, estrés físico, epinefrina"],
        down: ["Neutropenia: viral, quimioterapia, LES, fármacos (clozapina, propiltiouracilo), Kostmann"]
      },
      { name: "Linfocitos", range: "20–45%  ·  1.000–4.500 /mm³",
        note: "<strong>T</strong> (60–70%, inmunidad celular; CD4 cooperador, CD8 citotóxico) y <strong>B</strong> (20–30%, inmunidad humoral). Relación CD4:CD8 normal ≈ 2:1 (se invierte en HIV avanzado).",
        up: ["Linfocitosis: EBV/mononucleosis (#1 en adultos jóvenes), CMV, hepatitis viral, tos convulsa, LLC"],
        down: ["Linfopenia: HIV (↓CD4), corticoides, inmunosupresores, LES, radioterapia, ERC avanzada"]
      },
      { name: "Monocitos", range: "2–10%  ·  100–1.000 /mm³",
        note: "Precursores circulantes de macrófagos tisulares y células dendríticas. Parte del <strong>sistema fagocítico mononuclear</strong>. Vida en sangre: 1–3 días.",
        up: ["Monocitosis: TBC (#1), brucelosis, sífilis, endocarditis bacteriana subaguda, colitis ulcerosa, Crohn, LMMC"],
        down: ["Monocitopenia: aplasia medular, quimioterapia, corticoides altas dosis, leucemia de células pilosas"]
      },
      { name: "Eosinófilos", range: "1–6%  ·  50–600 /mm³",
        note: "Gránulos con proteína básica mayor (MBP). Modulan inflamación alérgica y combaten helmintos tisulares. <strong>Regla: eosinofilia = alergia o parásito tisular hasta demostrar lo contrario.</strong>",
        up: ["Alergias / asma bronquial (#1)","Parasitosis tisulares (Ascaris, toxocara, filarias, triquinosis)","Sínd. hipereosinofílico (>1500 absoluto)","Addison","ABPA"],
        down: ["Eosinopenia: corticoides, estrés agudo / infección bacteriana, Síndrome de Cushing"]
      },
      { name: "Basófilos", range: "0–1%  ·  0–100 /mm³",
        note: "Gránulos con <strong>histamina y heparina</strong>. Equivalentes circulantes de los mastocitos. <strong>Basofilia >1% es sugestiva de LMC</strong> (leucemia mieloide crónica) → buscar cromosoma Philadelphia.",
        up: ["LMC (marcador importante)","Hipotiroidismo","Mastocitosis sistémica","Policitemia vera"],
        down: ["Anafilaxia (degranulación masiva)","Estrés agudo","Corticoides","Hipertiroidismo"]
      }
    ]
  },
  {
    id: "hepaticas", label: "Enzimas hepáticas", icon: "🟠", accent: "#e8a44a",
    subtitle: "Marcadores de lesión y colestasis hepática",
    analytes: [
      { name: "ALT — Alanina aminotransferasa (TGP)", range: "7 – 56 UI/L",
        note: "<strong>Enzima hepatoespecífica.</strong> Marcador de <strong>citólisis / lesión hepatocelular</strong>. ALT > AST orienta a hepatitis viral o tóxica. Puede superar 1000 UI/L en hepatitis aguda grave. Cofactor: vitamina B6.",
        up: ["Hepatitis viral aguda (A, B, C, E)","Esteatohepatitis (NASH/alcohólica)","Hepatotóxicos: paracetamol, isoniacida, estatinas","Isquemia hepática (hepatitis de shock)","Hepatitis autoinmune"],
        down: ["Déficit de vitamina B6 (cofactor)","Uremia avanzada"]
      },
      { name: "AST — Aspartato aminotransferasa (TGO)", range: "10 – 40 UI/L",
        note: "Presente en hígado, músculo cardíaco, músculo esquelético, riñón y eritrocitos. Menos específica que ALT. <strong>AST/ALT >2:1 sugiere fuertemente hepatopatía alcohólica.</strong>",
        up: ["Hepatitis alcohólica (AST/ALT >2)","IAM (junto a troponina)","Rabdomiólisis","Hepatitis viral aguda","Cirrosis"],
        down: ["Sin relevancia clínica en descenso"]
      },
      { name: "Fosfatasa alcalina (FA)", range: "45 – 150 UI/L",
        note: "Presente en hígado (canalicular biliar), hueso (osteoblastos), intestino, placenta. <strong>Marcador de colestasis</strong> y enfermedades óseas activas. FA ↑ + GGT ↑ = origen hepático; FA ↑ + GGT normal = origen óseo.",
        up: ["Colestasis intra/extrahepática","Metástasis hepáticas","Enfermedad ósea de Paget","Embarazo (3er trimestre)","Hiperparatiroidismo"],
        down: ["Hipotiroidismo","Anemia perniciosa","Déficit de zinc","Hipofosforemia"]
      },
      { name: "GGT — Gamma-glutamiltransferasa", range: "H: 8–61 UI/L  ·  M: 5–36 UI/L",
        note: "Enzima microsomal. Muy sensible para colestasis y consumo crónico de alcohol. <strong>FA ↑ + GGT ↑ = origen hepático confirmado; FA ↑ + GGT normal = origen óseo.</strong>",
        up: ["Alcoholismo crónico (muy sensible incluso sin daño hepático)","Colestasis","Hepatopatía crónica","Inductores enzimáticos: fenitoína, carbamazepina, barbitúricos, rifampicina"],
        down: ["Sin relevancia clínica en descenso"]
      },
      { name: "Bilirrubina total", range: "0.3 – 1.2 mg/dL",
        note: "Producto de degradación del grupo hemo. <strong>Directa</strong> (conjugada): 0–0.3 mg/dL. <strong>Indirecta</strong> (no conjugada): 0.2–0.9 mg/dL. Ictericia clínica visible >2–3 mg/dL (escleras primero).",
        up: ["Bi. indirecta ↑: hemólisis, sínd. Gilbert, Crigler-Najjar, neonatal","Bi. directa ↑: colestasis, hepatitis, cirrosis, obstrucción biliar","Bi. mixta ↑: hepatitis grave, cirrosis avanzada"],
        down: ["Sin relevancia clínica en el descenso"]
      }
    ]
  },
  {
    id: "plasmaticas", label: "Proteínas plasmáticas", icon: "🧬", accent: "#9b7fe8",
    subtitle: "Albúmina y marcadores bioquímicos generales",
    analytes: [
      { name: "Albúmina sérica", range: "3.5 – 5.0 g/dL",
        note: "<strong>Proteína más abundante del plasma</strong> (60% de las proteínas totales). Síntesis hepática exclusiva. Funciones: transporte (bilirrubina, Ca²⁺, fármacos), presión oncótica (75–80%), reserva nitrogenada. <strong>Vida media ~21 días</strong> → marcador de función hepática crónica, no aguda.",
        up: ["Deshidratación (pseudoaumento relativo)"],
        down: ["Cirrosis hepática (↓síntesis)","Síndrome nefrótico (pérdida urinaria)","Desnutrición proteico-calórica / caquexia","Inflamación crónica (reactante negativo)","Grandes quemados","Enteropatía pierde-proteínas"]
      },
      { name: "Glucemia basal (en ayunas)", range: "80 – 110 mg/dL",
        note: "Glucosa plasmática tras ayuno ≥8h. <strong>Criterios ADA:</strong> normal &lt;100 mg/dL, prediabetes 100–125 (GAA), diabetes ≥126 mg/dL en dos ocasiones.",
        up: ["Diabetes mellitus tipo 1 y 2","Pancreatitis aguda (↓insulina)","Síndrome de Cushing","Feocromocitoma","Corticoides exógenos","Glucagonoma"],
        down: ["Insulinoma (hipoglucemia en ayunas)","Insulina exógena","Ayuno prolongado","Sepsis (alto consumo periférico)","Insuficiencia suprarrenal (Addison)"]
      }
    ]
  },
  {
    id: "lipidico", label: "Perfil lipídico", icon: "💛", accent: "#e8a44a",
    subtitle: "Riesgo cardiovascular y metabolismo lipídico",
    analytes: [
      { name: "Colesterol total", range: "< 200 mg/dL (deseable)",
        note: "Lípido estructural esencial. <strong>Borderline: 200–239 mg/dL · Alto: ≥240 mg/dL.</strong> El riesgo CV es un continuo sin punto de corte absoluto.",
        up: ["Hipercolesterolemia familiar","Hipotiroidismo","Síndrome nefrótico","Diabetes mal controlada","Dieta alta en grasas saturadas y trans","Colestasis"],
        down: ["Hipertiroidismo (↑catabolismo)","Desnutrición / caquexia","Hepatopatía grave (↓síntesis)","Estatinas, ezetimibe"]
      },
      { name: "LDL (lipoproteína de baja densidad)", range: "< 130 mg/dL  (óptimo <100, muy alto riesgo <70)",
        note: "<strong>'Colesterol malo'.</strong> Fracción más aterogénica. <strong>Meta individualizada:</strong> &lt;70 en IAM previo/DM2 con daño orgánico; &lt;100 en riesgo alto; &lt;130 en riesgo moderado. Calculado por Friedewald si TG &lt;400.",
        up: ["Hipercolesterolemia familiar","Hipotiroidismo","Síndrome nefrótico","Dieta occidental (saturadas + trans)"],
        down: ["Estatinas (inhiben HMG-CoA reductasa, ↓30–50%)","Hipertiroidismo","PCSK9 inhibidores (↓hasta 60% adicional)"]
      },
      { name: "HDL (lipoproteína de alta densidad)", range: "H: > 40 mg/dL  ·  M: > 50 mg/dL",
        note: "<strong>'Colesterol bueno'.</strong> Transporte reverso del colesterol (tejido → hígado). Factor protector CV independiente. <strong>HDL > 60 = factor protector que neutraliza un factor de riesgo CV.</strong>",
        up: ["Ejercicio aeróbico regular (↑10–20%)","Estrógenos (protección premenopáusica)","Fibratos","Niacina"],
        down: ["Sedentarismo","Tabaquismo","Obesidad abdominal / hiperinsulinismo","Diabetes tipo 2","Hipertrigliceridemia (relación inversa)"]
      },
      { name: "Triglicéridos", range: "< 150 mg/dL (deseable)",
        note: "Principal forma de almacenamiento energético. <strong>Borderline: 150–199 · Alto: 200–499 · Muy alto: ≥500 mg/dL → riesgo de pancreatitis aguda</strong> (ácidos grasos libres tóxicos en el páncreas).",
        up: ["Diabetes descompensada","Alcohol","Hipotiroidismo","Síndrome nefrótico","Dieta hipercalórica / carbohidratos refinados","Pancreatitis aguda si >500 mg/dL"],
        down: ["Desnutrición severa","Fibratos (indicación de elección)","Omega-3 en altas dosis","Dieta baja en carbohidratos"]
      }
    ]
  },
  {
    id: "inflam", label: "Inflamatorios", icon: "🔥", accent: "#e05252",
    subtitle: "Marcadores de fase aguda y perfusión tisular",
    analytes: [
      { name: "PCR — Proteína C reactiva", range: "< 5 mg/L  (< 1 mg/L óptimo cardio)",
        note: "Pentámero sintetizado por el hígado en respuesta a <strong>IL-6, IL-1 y TNF-α</strong>. Sube en 6–12h, pico en 48h. <strong>PCR ultrasensible (usPCR) &lt;1 mg/L = bajo riesgo CV.</strong> Muy sensible, poco específica.",
        up: ["Infección bacteriana (suele >100, puede llegar a >300)","Inflamación autoinmune: LES, AR, vasculitis","IAM","Neoplasias malignas","Trauma / cirugía / quemaduras","Pancreatitis aguda (criterio Ranson: PCR >150)"],
        down: ["Corticoides en dosis altas","Hepatopatía grave terminal (↓síntesis)"]
      },
      { name: "Lactato sérico", range: "0.5 – 2.0 mmol/L  (5–20 mg/dL)",
        note: "<strong>Marcador de metabolismo anaeróbico y perfusión tisular.</strong> <strong>Criterio Sepsis-3: lactato >2 mmol/L.</strong> Lactato >4 = alta mortalidad (30–40%). En UCI: clearance de lactato >10% en 2h = respuesta a resucitación.",
        up: ["Shock séptico, cardiogénico, hipovolémico, obstructivo","Isquemia mesentérica","Hepatopatía grave (↓depuración)","Metformina en insuf. renal (acidosis láctica tipo B)","Crisis convulsivas","Déficit de tiamina (B1)"],
        down: ["No tiene relevancia clínica en descenso"]
      }
    ]
  },
  {
    id: "pancreas", label: "Pancreáticas", icon: "🟡", accent: "#e8a44a",
    subtitle: "Marcadores de lesión acinar pancreática",
    analytes: [
      { name: "Amilasa sérica", range: "30 – 110 UI/L",
        note: "Fuentes: páncreas exocrino (60%) y glándulas salivales (40%). Sube rápido (2–12h), pico 24h, normaliza en 3–5 días. <strong>Menos específica que la lipasa.</strong> >3x el límite = criterio diagnóstico de pancreatitis aguda.",
        up: ["Pancreatitis aguda (>3x LSN + clínica compatible)","Parotiditis (amilasa salival)","Obstrucción intestinal","Colecistitis aguda","Perforación de víscera hueca","Cetoacidosis diabética","Insuf. renal (↓clearance)"],
        down: ["Pancreatitis crónica avanzada (destrucción del parénquima acinar)","Fibrosis quística","Hipertrigliceridemia severa (interfiere en la medición)"]
      },
      { name: "Lipasa sérica", range: "10 – 140 UI/L",
        note: "<strong>Enzima de elección para diagnóstico de pancreatitis aguda.</strong> Más sensible (>85%) y específica (>95%) que la amilasa. Sube 4–8h, permanece elevada 8–14 días (mejor ventana diagnóstica). >3x el límite = diagnóstico confirmado con clínica e imagen.",
        up: ["Pancreatitis aguda (método de elección diagnóstico)","Colecistitis aguda","Obstrucción intestinal","Insuficiencia renal (↓clearance)","Post-CPRE"],
        down: ["Pancreatitis crónica avanzada (destrucción acinar)"]
      }
    ]
  },
  {
    id: "renal", label: "Función renal", icon: "🫘", accent: "#4caf82",
    subtitle: "Filtración glomerular, catabolismo proteico y diuresis",
    analytes: [
      { name: "Urea (BUN — nitrógeno ureico en sangre)", range: "Urea: 15–45 mg/dL  ·  BUN: 10–26 mg/dL",
        note: "Producto final del catabolismo proteico (ciclo de la urea hepático → excreción renal). <strong>BUN = Urea / 2.14.</strong> <strong>Relación BUN/Creatinina: >20 → azotemia prerrenal; 10–20 → normal; <10 → necrosis tubular aguda, diálisis o dieta hipoproteica.</strong>",
        up: ["Azoemia prerrenal: deshidratación, sangrado GI alto (↑catabolismo de proteínas)","IRA y ERC (↓filtración)","Dieta hiperproteica","Hipercatabolismo: sepsis, quemados, politrauma, corticoides"],
        down: ["Hepatopatía grave (↓síntesis de urea en el ciclo)","Dieta hipoproteica severa","Sobrehidratación (dilución)","Insuficiencia suprarrenal"]
      },
      { name: "Creatinina sérica", range: "H: 0.7–1.2 mg/dL  ·  M: 0.5–1.0 mg/dL",
        note: "<strong>Producto del metabolismo muscular</strong> (fosfocreatina → creatinina). Filtración glomerular libre, sin reabsorción significativa. Estima TFG: Cockroft-Gault, CKD-EPI. <strong>Limitación: depende de masa muscular</strong> → puede estar 'normal' en ancianos sarcopénicos con TFG reducida.",
        up: ["IRA / ERC (↑creatinina = ↓TFG)","Rabdomiólisis (también eleva CK masivamente)","Nefrotóxicos: AINES, aminoglucósidos, contraste yodado, cisplatino","Deshidratación (↓flujo renal)"],
        down: ["Sarcopenia / desnutrición muscular severa","Embarazo (hemodilución + ↑TFG fisiológica)","Miopatías crónicas"]
      },
      {
        name: "Diuresis — Gasto urinario horario", range: "Ver tabla por grupo",
        note: "<strong>Marcador clínico esencial de perfusión renal y volumen circulante efectivo.</strong> Es uno de los signos más tempranos y sensibles de hipoperfusión tisular — precede al aumento de creatinina en la IRA. Se monitorea con sonda vesical en pacientes críticos. La corrección guiada por diuresis es clave en la resucitación.",
        diuresisTable: true,
        up: ["Poliuria (>3 L/día o >2 ml/kg/h): diabetes insípida, DM descompensada (glucosuria osmótica), diuréticos, fase poliúrica de IRA en resolución","Forzada terapéuticamente: fluidoterapia agresiva, manitol (rabdomiólisis, hipertensión endocraneana)"],
        down: ["Oliguria (<0.5 ml/kg/h por >6h): criterio KDIGO de IRA; causas: hipovolemia, shock de cualquier tipo, IRA","Anuria (<100 ml/24h): obstrucción bilateral, IRA grave por necrosis cortical, shock refractario","En quemados: oliguria temprana = señal de resucitación con Parkland insuficiente → aumentar tasa de infusión"]
      }
    ]
  },
  {
    id: "ionograma", label: "Ionograma", icon: "⚡", accent: "#9b7fe8",
    subtitle: "Electrolitos séricos y equilibrio hidroelectrolítico",
    analytes: [
      { name: "Sodio (Na⁺)", range: "135 – 145 mEq/L",
        note: "<strong>Principal catión extracelular.</strong> Regula osmolaridad plasmática: Osm = 2Na + glucosa/18 + BUN/2.8 (normal 285–295 mOsm/kg). <strong>Síntomas neurológicos</strong> si cambios bruscos. Corrección rápida de hiponatremia → riesgo de mielinólisis pontina central.",
        up: ["Hipernatremia: deshidratación hipertónica (pérdida de agua libre)","Diabetes insípida (central o nefrogénica)","Hiperaldosteronismo / Síndrome de Conn"],
        down: ["Hiponatremia: SIADH (#1: tumores, neumonía, meningitis, fármacos)","Insuficiencia cardíaca congestiva","Cirrosis hepática (hiponatremia dilucional)","Hipotiroidismo","Hipovolemia con pérdidas hipotónicas"]
      },
      { name: "Potasio (K⁺)", range: "3.5 – 5.5 mEq/L",
        note: "<strong>Principal catión intracelular</strong> (98% intracelular). Crítico para el potencial de reposo de membrana. <strong>Alteraciones → arritmias graves (el ECG es urgente):</strong> hipocalemia → onda U, aplanamiento T; hipercalemia → T picuda, onda sinusoidal, FV.",
        up: ["Hipercalemia: IRA/ERC (#1)","Acidosis metabólica (intercambio H⁺/K⁺)","Hipoaldosteronismo","IECA, ARA-II, heparina","Digitálicos (bloquean Na-K-ATPasa)","Rabdomiólisis"],
        down: ["Hipocalemia: vómitos, diarrea","Diuréticos de asa y tiazídicos (#1 iatrogénica)","Alcalosis metabólica","Hiperaldosteronismo primario o secundario","Síndrome de Cushing"]
      },
      { name: "Cloro (Cl⁻)", range: "102 – 109 mEq/L",
        note: "<strong>Principal anión extracelular.</strong> Calcula el <strong>anión gap</strong>: AG = Na − (Cl + HCO₃). Normal: 8–12. <strong>AG ampliado (>12): MUDPILES</strong> (Metanol, Uremia, DKA, Propilen glicol, Isoniacida, Lactato, Etanol, Salicilatos). AG normal = pérdidas de HCO₃.",
        up: ["Hiperclordemia: acidosis metabólica hiperclorémica (diarrea, RTA, SSN excesiva)","Deshidratación","Hiperparatiroidismo"],
        down: ["Hipoclordemia: vómitos (pérdida de HCl gástrico)","Diuréticos de asa","Alcalosis metabólica","SIADH"]
      }
    ]
  },
  {
    id: "tiroideo", label: "Eje tiroideo", icon: "🦋", accent: "#3db8a8",
    subtitle: "Hormonas tiroideas y eje hipotálamo-hipófiso-tiroideo",
    analytes: [
      { name: "TSH — Tirotropina", range: "0.4 – 4.0 mUI/L",
        note: "<strong>Primer test a solicitar en sospecha de disfunción tiroidea.</strong> Regulación: TRH (hipotálamo) → TSH (hipófisis) → T3/T4 (tiroides, feedback negativo). TSH ↓ + T4L normal = hipertiroidismo subclínico; TSH ↑ + T4L normal = hipotiroidismo subclínico.",
        up: ["Hipotiroidismo primario (Hashimoto #1, postablación, deficiencia de yodo)","Hipotiroidismo subclínico","Amiodarona (rico en yodo)","Litio"],
        down: ["Hipertiroidismo: Graves (#1), bocio multinodular tóxico, adenoma tóxico","Tiroiditis subaguda (fase inicial)","Hipopituitarismo (TSH ↓ + T4L ↓)","T4 exógena en exceso","Corticoides altas dosis / dopamina"]
      },
      { name: "T4 libre (tiroxina libre)", range: "0.8 – 1.8 ng/dL",
        note: "Fracción biológicamente activa de T4. <strong>No afectada por cambios en proteínas transportadoras</strong>. Vida media ~7 días. Prohormona que se convierte en T3 activa periféricamente por desyodinasas.",
        up: ["Hipertiroidismo (primario o por exceso exógeno)","Tiroiditis aguda (liberación de hormona almacenada)","HCG elevada (1er trimestre)"],
        down: ["Hipotiroidismo primario y central","Síndrome eutiroideo del enfermo (enfermedades críticas)","Amiodarona (bloquea conversión), fenitoína (desplaza de TBG)"]
      },
      { name: "T3 libre (triyodotironina libre)", range: "2.3 – 4.2 pg/mL",
        note: "<strong>Hormona más activa</strong> (3–5x más potente que T4). 80% de conversión periférica de T4 por desyodinasa tipo 1. <strong>Vida media corta (~24h)</strong> → primero en caer en enfermedades críticas.",
        up: ["Hipertiroidismo","T3 tirotoxicosis (TSH ↓, T4L normal, T3 ↑: 5% de hipertiroidismos)"],
        down: ["Hipotiroidismo","Síndrome eutiroideo del enfermo: ↓D1 → T3 baja, T3 reversa sube","Deficiencia de selenio (cofactor de desyodinasas)"]
      },
      { name: "T4 total", range: "5 – 12 µg/dL",
        note: "Incluye T4 unida a proteínas (TBG 70%, transtirretina 20%, albúmina 10%). <strong>Afectada por cambios en TBG sin disfunción tiroidea real.</strong> Se prefiere T4 libre en la práctica.",
        up: ["Hipertiroidismo","↑TBG: embarazo (estrógenos), hepatitis aguda, ACO","T4 exógena"],
        down: ["Hipotiroidismo","↓TBG: síndrome nefrótico, cirrosis, desnutrición, andrógenos"]
      },
      { name: "T3 total", range: "80 – 180 ng/dL",
        note: "Refleja T3 libre + unida a proteínas. Menos usado en práctica actual. Puede estar artificialmente bajo en enfermedades crónicas no tiroideas por ↓conversión periférica.",
        up: ["Hipertiroidismo","T3 tirotoxicosis"],
        down: ["Hipotiroidismo","Enfermedades crónicas no tiroideas (↓conversión T4→T3)"]
      }
    ]
  },
  {
    id: "hba1c", label: "Hb glicosilada", icon: "🍬", accent: "#e8a44a",
    subtitle: "Control glucémico promedio de los últimos 2–3 meses",
    analytes: [
      { name: "HbA1c — Hemoglobina A1c", range: "Normal: < 5.7%   ·   Prediabetes: 5.7–6.4%   ·   Diabetes: ≥ 6.5%",
        note: "<strong>Refleja el promedio glucémico de los últimos 2–3 meses</strong> (vida media del eritrocito ~120 días). No requiere ayuno. <strong>Metas en DM:</strong> &lt;7% estándar ADA; &lt;6.5% jóvenes sin hipoglucemias; &lt;8% ancianos o alto riesgo. Cada 1% de ↓HbA1c → ↓21% complicaciones microvasculares (UKPDS).",
        up: ["Diabetes mellitus descompensada","Prediabetes (riesgo de progresión ~10%/año)","Hemoglobinopatías que prolongan vida del eritrocito","Déficit de G6PD","Esplenectomía"],
        down: ["Anemia hemolítica (↓vida media eritrocito → falso ↓)","Embarazo (↑recambio eritrocitario)","Transfusiones recientes","Hemoglobinopatías (HbS, HbC) que interfieren en la medición"]
      }
    ]
  }
];
