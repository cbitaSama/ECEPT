// ══════════════════════════════════════════════════════════════
// PSICOSIS · Esquizofrenia, T. delirante, Bipolar, Depresión mayor
// ══════════════════════════════════════════════════════════════

function PsicosisView(p){
  var c=C.psi;
  var diseases=[
    {
      n:"01",name:"Trastorno psicótico breve",c:C.esq,
      blurb:"Síntomas psicóticos · <1 mes · Remisión completa",
      sections:{
        def:e(Def,{c:C.esq},"Episodio con ",e("b",null,"≥1 síntoma psicótico")," (delirios, alucinaciones, discurso desorganizado, comportamiento gravemente desorganizado/catatónico) de duración ",e("b",null,"≥1 día pero <1 mes"),", con ",e("b",null,"retorno completo")," al nivel previo de funcionamiento."),
        cli:e("div",null,
          e(H3,{c:C.esq},"Especificadores"),
          e(Table,{
            headers:[{t:"Especificador",c:C.esq},{t:"Cuándo aplica",c:C.esq}],
            rows:[
              ["Con factor(es) estresante marcado(s)","Síntomas en respuesta a eventos que serían notablemente estresantes para cualquier persona en circunstancias similares"],
              ["Sin factor estresante","Sin evento identificable"],
              ["Con inicio en posparto","Durante el embarazo o en las primeras 4 semanas posparto"]
            ]
          }),
          e(Note,{c:C.esq,t:"Epidemiología"},"Más frecuente en mujeres jóvenes (20s–30s), en periodo posparto y en culturas con factores estresantes identificables. Prevalencia baja (~0.1%)."),
          e(Pearl,{t:"'Psicosis reactiva breve' clásica"},"La 'psicosis reactiva breve' corresponde al subtipo con factor estresante. Buen pronóstico si es aguda y estresor claro.")
        ),
        dx:e(CritBlock,{title:"Trastorno psicótico breve (DSM-5)",c:C.esq},
          e(Crit,{crit:"A",c:C.esq},"Presencia de ≥1 de los siguientes: (1) delirios, (2) alucinaciones, (3) discurso desorganizado, (4) comportamiento gravemente desorganizado o catatónico. Al menos uno debe ser 1, 2 o 3."),
          e(Crit,{crit:"B",c:C.esq},"Duración del episodio ",e("b",null,"≥ 1 día pero < 1 mes"),", con retorno completo al nivel de funcionamiento previo."),
          e(Crit,{crit:"C",c:C.esq},"No se explica mejor por trastorno depresivo o bipolar con características psicóticas, por otro trastorno psicótico (esquizofrenia, catatonía), y no es atribuible a sustancias o afección médica.")
        ),
        tx:e("div",null,
          e(P,null,e("b",null,"Antipsicótico atípico a corto plazo")," (risperidona, olanzapina, quetiapina) durante el episodio + ",e("b",null,"psicoterapia de apoyo")," si hubo estresor claro. Retirar progresivamente tras la remisión."),
          e(P,null,"La hospitalización puede ser necesaria para seguridad y estabilización. Vigilar riesgo suicida."),
          e(Alert,{c:C.warn,label:"🔑 Riesgo de recurrencia"},"Hasta el ",e("b",null,"50% recurre")," o evoluciona a otro trastorno psicótico (esquizofreniforme, esquizofrenia, bipolar). Seguimiento estrecho es clave.")
        )
      }
    },
    {
      n:"02",name:"Trastorno esquizofreniforme",c:C.esq,
      blurb:"Idéntico a esquizofrenia · 1 a 6 meses",
      sections:{
        def:e(Def,{c:C.esq},"Cuadro ",e("b",null,"clínicamente idéntico a la esquizofrenia")," (mismos síntomas del criterio A), pero con duración ",e("b",null,"≥ 1 mes y < 6 meses"),". Si los síntomas persisten más allá de 6 meses, el diagnóstico cambia a esquizofrenia."),
        cli:e("div",null,
          e(P,null,"Los síntomas son los mismos que en esquizofrenia: delirios, alucinaciones, discurso desorganizado, comportamiento catatónico/desorganizado, síntomas negativos. La diferencia crucial es ",e("b",null,"solo la duración"),"."),
          e(H3,{c:C.esq,mt:14},"Especificadores de pronóstico"),
          e(P,null,e("b",null,"Con características de buen pronóstico")," (≥2 de 4):"),
          e(SxList,{c:C.esq,items:[
            "Aparición de síntomas psicóticos prominentes en las primeras 4 semanas del primer cambio de comportamiento",
            "Confusión o perplejidad durante el episodio",
            "Buen funcionamiento social y laboral previo",
            "Ausencia de aplanamiento afectivo"
          ]}),
          e(P,null,"La presencia de estas características favorece la remisión completa; su ausencia sugiere progresión a esquizofrenia.")
        ),
        dx:e(CritBlock,{title:"Trastorno esquizofreniforme (DSM-5)",c:C.esq},
          e(Crit,{crit:"A",c:C.esq},"≥2 síntomas del criterio A de esquizofrenia (delirios, alucinaciones, discurso desorganizado, comportamiento catatónico/desorganizado, síntomas negativos). Al menos uno debe ser 1, 2 o 3."),
          e(Crit,{crit:"B",c:C.esq},"Duración del episodio (incluye pródromo + fase activa + fase residual) ",e("b",null,"≥1 mes y <6 meses"),". Si aún no se puede esperar la recuperación, calificar como 'provisional'."),
          e(Crit,{crit:"C",c:C.esq},"Se ha descartado trastorno esquizoafectivo, depresivo o bipolar con psicosis."),
          e(Crit,{crit:"D",c:C.esq},"No atribuible a sustancias ni otra afección médica.")
        ),
        tx:e("div",null,
          e(P,null,"Mismo manejo que esquizofrenia: ",e("b",null,"antipsicóticos atípicos")," (risperidona, olanzapina, quetiapina, aripiprazol) + psicoterapia + psicoeducación familiar."),
          e(P,null,"Mantener el tratamiento por lo menos ",e("b",null,"12 meses")," tras la remisión completa."),
          e(Alert,{c:C.warn,label:"🔑 Evolución"},"~⅔ de los casos progresan a esquizofrenia o trastorno esquizoafectivo. El pronóstico mejora si hay características favorables (criterio del especificador).")
        )
      }
    },
    {
      n:"03",name:"Esquizofrenia",c:C.esq,
      blurb:"Síntomas positivos + negativos · Fases prodrómica/crisis/residual",
      sections:{
        def:e(Def,{c:C.esq},"Trastorno psicótico crónico caracterizado por una ",e("b",null,"alteración profunda del pensamiento, percepción y conducta")," que compromete la prueba de realidad. Combina ",e("b",null,"síntomas positivos")," (alucinaciones, delirios), ",e("b",null,"síntomas negativos")," (aplanamiento afectivo, abulia, anhedonia, alogia, aislamiento) y deterioro funcional progresivo."),
        cli:e("div",null,
          e(H3,{c:C.esq},"Epidemiología"),
          e(Table,{
            headers:[{t:"Dato",c:C.esq},{t:"Valor",c:C.esq}],
            rows:[
              ["Prevalencia","0.5 – 1% de la población"],
              ["Inicio","Adolescencia – adultez temprana (20–44 años)"],
              ["Sexo","Similar en ambos (varones antes, mujeres después)"]
            ]
          }),
          e(H3,{c:C.esq,mt:14},"Factores de riesgo de suicidio"),
          e(SxList,{c:C.esq,items:[
            "Sexo masculino",
            "Menor de 30 años",
            "Desempleo",
            "Depresión previa",
            "Antecedentes de abuso de sustancias",
            "Internación reciente"
          ]}),
          e(H3,{c:C.esq,mt:14},"Síntomas"),
          e(Table,{
            headers:[{t:"Categoría",c:C.esq},{t:"Síntomas",c:C.esq}],
            rows:[
              ["Positivos","Alucinaciones (auditivas más frecuentes), delirios, pensamiento desorganizado"],
              ["Negativos","Aplanamiento afectivo, abulia, anhedonia, alogia (↓ habla), aislamiento social"]
            ]
          }),
          e(H3,{c:C.esq,mt:14},"Subtipos clásicos"),
          e(Table,{
            headers:[{t:"Subtipo",c:C.esq},{t:"Características",c:C.esq},{t:"Pronóstico",c:C.esq}],
            rows:[
              ["Paranoide (el más frecuente)","Predominio de síntomas POSITIVOS; afecta el pensamiento","Favorable"],
              ["Desorganizado (hebefrénica)","Afecta emociones; comienzo precoz y grave","PEOR pronóstico"],
              ["Catatónico (muy rara)","Afecta sistema motor; inmovilidad, negativismo, ecolalia, ecopraxia, gestos exagerados","Favorable"],
              ["Indiferenciado","Muy baja frecuencia; no encaja en los otros","Variable"],
              ["Simple","Disminuye rendimiento, dificultad social y laboral","Mal"],
              ["Residual","Forma terminal; predominan síntomas NEGATIVOS","Mal"]
            ]
          }),
          e(Note,{c:C.esq,t:"DSM-5"},"DSM-5 eliminó los subtipos clásicos (paranoide, desorganizado, catatónico) como diagnósticos distintos, pero se siguen usando clínicamente y en la enseñanza."),
          e(H3,{c:C.esq,mt:14},"Fases de la esquizofrenia"),
          e(Table,{
            headers:[{t:"Fase",c:C.esq},{t:"Características",c:C.esq}],
            rows:[
              ["Prodrómica","Síntomas psicóticos atenuados · dura días a años · cambios de personalidad (no siempre)"],
              ["Crisis (activa)","Se desencadena la enfermedad · síntomas POSITIVOS · instauración rápida · la familia suele pedir ayuda médica · puede durar semanas a un año"],
              ["Residual","Desaparecen síntomas positivos · deterioro pre-mórbido frecuente · predominan síntomas NEGATIVOS"]
            ]
          }),
          e(H3,{c:C.esq,mt:14},"Etiología"),
          e(P,null,e("b",null,"Genética:")," 45% de riesgo si ambos padres la padecen · 5% si solo uno. Genes implicados: ",e("b",null,"Neurregulina 1, D-aminoácido oxidasa, receptores de glutamato, factor neurotrófico"),". Requiere factor gatillo ambiental."),
          e(P,null,e("b",null,"Neuroimagen:")," aumento ventricular, aumento de cisuras, atrofia cerebelosa, menos masa cerebral y más líquido, disminución del tálamo."),
          e(P,null,e("b",null,"Mecanismos:")," hipofrontalidad, interrupción del ciclo pontino-cerebeloso-talámico-frontal, lesión encefálica, hiperactividad dopaminérgica, hipofuncionamiento del receptor NMDA."),
          e(H3,{c:C.esq,mt:14},"Las 4 vías dopaminérgicas"),
          e(Table,{
            headers:[{t:"Vía",c:C.esq},{t:"Recorrido",c:C.esq},{t:"Qué pasa si falla",c:C.esq}],
            rows:[
              ["Mesolímbica","Área tegmental ventral (mesencéfalo) → núcleo accumbens (sistema límbico)","ESQUIZOFRENIA (síntomas positivos)"],
              ["Mesocortical","Área tegmental ventral → corteza frontal","ESQUIZOFRENIA (síntomas negativos)"],
              ["Nigroestriada","Sustancia nigra → cuerpo estriado","Parkinson / corea (extrapiramidalismo)"],
              ["Tuberoinfundibular","Hipotálamo → hipófisis","Hiperprolactinemia"]
            ]
          })
        ),
        dx:e("div",null,
          e(CritBlock,{title:"Esquizofrenia (DSM-5)",c:C.esq},
            e(Crit,{crit:"A",c:C.esq},"≥2 síntomas durante una parte significativa del periodo de 1 mes (al menos uno debe ser 1, 2 o 3): (1) delirios, (2) alucinaciones, (3) discurso desorganizado, (4) comportamiento catatónico o muy desorganizado, (5) síntomas negativos."),
            e(Crit,{crit:"B",c:C.esq},"Deterioro significativo en áreas clave (trabajo, relaciones, autocuidado)."),
            e(Crit,{crit:"C",c:C.esq},"Signos continuos del trastorno durante ",e("b",null,"≥6 meses")," (incluye fase prodrómica o residual)."),
            e(Crit,{crit:"D",c:C.esq},"No mejor explicada por trastorno esquizoafectivo ni del ánimo con síntomas psicóticos."),
            e(Crit,{crit:"E",c:C.esq},"No atribuible a sustancia ni otra afección médica."),
            e(Crit,{crit:"F",c:C.esq},"Si hay antecedente de trastorno del espectro autista o de comunicación, se requieren delirios/alucinaciones prominentes ≥1 mes.")
          )
        ),
        tx:e("div",null,
          e(H3,{c:C.esq},"Farmacológico"),
          e(Table,{
            headers:[{t:"Grupo",c:C.esq},{t:"Ejemplos",c:C.esq},{t:"Notas",c:C.esq}],
            rows:[
              ["Antipsicóticos ATÍPICOS (1ª línea)","Risperidona, olanzapina, quetiapina, aripiprazol, paliperidona","Menor riesgo extrapiramidal · mejor tolerabilidad"],
              ["Antipsicóticos TÍPICOS","Haloperidol, clorpromazina, flufenazina","Útiles en crisis aguda · más efectos extrapiramidales"],
              ["Refractarios","Clozapina","★ Única eficaz en resistencia · requiere hemograma por riesgo de agranulocitosis"],
              ["Adyuvante depósito","Risperidona/paliperidona/haloperidol LAI","Útiles si mala adherencia"]
            ]
          }),
          e(H3,{c:C.esq,mt:14},"Psicosocial"),
          e(P,null,"Psicoeducación familiar, rehabilitación cognitiva, TCC para psicosis, empleo protegido, manejo de casos asertivo."),
          e(H3,{c:C.esq,mt:14},"Efectos extrapiramidales (EPS) · efectos adversos clase"),
          e(Table,{
            headers:[{t:"Síndrome",c:C.esq},{t:"Inicio típico",c:C.esq},{t:"Clínica",c:C.esq}],
            rows:[
              ["Distonía aguda","Horas – días","Espasmos musculares sostenidos: tortícolis, crisis oculógira, opistótonos, laringoespasmo"],
              ["Acatisia","Días – semanas","Inquietud motora subjetiva y objetiva; necesidad imperiosa de moverse"],
              ["Parkinsonismo","Semanas – meses","Rigidez, bradicinesia, temblor, facies inexpresiva, sialorrea"],
              ["Discinesia tardía","Meses – años","Movimientos coreoatetósicos involuntarios (orofaciales más frecuentes); puede ser irreversible"]
            ]
          }),
          e(Note,{c:C.esq,t:"Atípicos vs típicos"},"Los antipsicóticos ",e("b",null,"típicos")," (haloperidol, flufenazina) dan más EPS por bloqueo dopaminérgico intenso. Los ",e("b",null,"atípicos")," (risperidona, olanzapina, quetiapina, aripiprazol) los dan con menor frecuencia por su perfil serotoninérgico adicional."),
          e(Alert,{c:C.bad,label:"⚠️ Trampa"},"La ",e("b",null,"clozapina")," es el único antipsicótico eficaz en esquizofrenia resistente pero tiene riesgo de ",e("b",null,"agranulocitosis fatal"),". Requiere hemograma semanal inicial luego mensual."),
          e(Alert,{c:C.bad,label:"⚠️ Síndrome neuroléptico maligno (SNM)"},"Emergencia asociada a antipsicóticos (más frecuente con típicos, pero posible con cualquiera). Tetrada clásica: ",e("b",null,"hipertermia + rigidez muscular tipo \"tubo de plomo\" + inestabilidad autonómica + alteración del nivel de conciencia"),". ",e("b",null,"CPK muy elevada"),". Mortalidad 10–20% si no se reconoce. Conducta: ",e("b",null,"suspender el antipsicótico"),", medidas de soporte (hidratación, control térmico, UCI) y considerar dantroleno o bromocriptina.")
        )
      }
    },
    {
      n:"04",name:"Trastorno esquizoafectivo",c:C.esq,
      blurb:"Esquizofrenia + episodios afectivos · 2 sem de psicosis sin ánimo",
      sections:{
        def:e(Def,{c:C.esq},"Cuadro con ",e("b",null,"síntomas de esquizofrenia")," (criterio A) que coexisten con un ",e("b",null,"episodio mayor del ánimo")," (depresivo o maníaco), pero con la condición clave de que durante la enfermedad haya habido ",e("b",null,"≥2 semanas de delirios o alucinaciones SIN síntomas afectivos mayores"),". Si los síntomas psicóticos aparecen solo dentro de los episodios afectivos, el dx es trastorno del ánimo con psicosis, NO esquizoafectivo."),
        cli:e("div",null,
          e(H3,{c:C.esq},"Los 2 subtipos"),
          e(Table,{
            headers:[{t:"Subtipo",c:C.esq},{t:"Característica",c:C.esq}],
            rows:[
              ["Tipo bipolar","El episodio mayor incluye manía (con o sin depresión mayor)"],
              ["Tipo depresivo","El episodio mayor es solo depresión mayor"]
            ]
          }),
          e(H3,{c:C.esq,mt:14},"Regla del tiempo"),
          e(P,null,"Los episodios afectivos deben estar presentes durante ",e("b",null,"la mayor parte")," de la duración total de la enfermedad (fases activa + residual). Si los episodios afectivos ocupan poco tiempo respecto al total → es ",e("b",null,"esquizofrenia"),", no esquizoafectivo."),
          e(Pearl,{t:"Pronóstico intermedio"},"Pronóstico mejor que esquizofrenia pero peor que trastorno bipolar/depresivo puro. El subtipo bipolar tiene mejor pronóstico que el depresivo.")
        ),
        dx:e(CritBlock,{title:"Trastorno esquizoafectivo (DSM-5)",c:C.esq},
          e(Crit,{crit:"A",c:C.esq},"Periodo ininterrumpido durante el cual hay un episodio mayor del ánimo (depresivo mayor o maníaco) ",e("b",null,"concurrente con el criterio A de esquizofrenia"),"."),
          e(Crit,{crit:"B",c:C.esq},"Delirios o alucinaciones durante ",e("b",null,"≥2 semanas en ausencia de episodio mayor del ánimo"),", a lo largo de la enfermedad. (Punto crítico que lo diferencia del trastorno del ánimo con psicosis.)"),
          e(Crit,{crit:"C",c:C.esq},"Los síntomas que cumplen criterios para un episodio mayor del ánimo están presentes durante la mayor parte de la duración total de las fases activa y residual de la enfermedad."),
          e(Crit,{crit:"D",c:C.esq},"No atribuible a sustancias ni a otra afección médica.")
        ),
        tx:e("div",null,
          e(H3,{c:C.esq},"Por subtipo"),
          e(Table,{
            headers:[{t:"Subtipo",c:C.esq},{t:"Combinación habitual",c:C.esq}],
            rows:[
              ["Bipolar","Antipsicótico atípico + estabilizador del ánimo (litio, valproato, lamotrigina)"],
              ["Depresivo","Antipsicótico atípico + antidepresivo"]
            ]
          }),
          e(P,null,e("b",null,"Paliperidona")," es el único antipsicótico con indicación FDA específica para trastorno esquizoafectivo. ",e("b",null,"Clozapina")," para refractarios (igual que esquizofrenia). Psicoeducación + rehabilitación psicosocial + TCC para psicosis.")
        )
      }
    },
    {
      n:"05",name:"Trastorno delirante",c:C.del,
      blurb:"Delirios ≥1 mes con personalidad preservada",
      sections:{
        def:e(Def,{c:C.del},"Cuadro psicótico en el que los delirios (generalmente no bizarros) están presentes durante ",e("b",null,"≥ 1 mes"),", con ",e("b",null,"personalidad preservada")," y sin deterioro funcional marcado. El paciente ",e("b",null,"NO se comporta de forma extraña")," y es relativamente funcional. Los delirios se acompañan de afectividad apropiada al contenido."),
        cli:e("div",null,
          e(H3,{c:C.del},"Características clínicas"),
          e(SxList,{c:C.del,items:[
            "Personalidad preservada · el paciente mantiene su empleo y una vida relativamente normal",
            "Tienden a aislarse y presentan suspicacia crónica",
            "Alucinaciones: pueden presentarse pero NO son prominentes y SIEMPRE se relacionan con el delirio"
          ]}),
          e(H3,{c:C.del,mt:14},"Epidemiología"),
          e(Table,{
            headers:[{t:"Dato",c:C.del},{t:"Valor",c:C.del}],
            rows:[
              ["Prevalencia","~0.2% de la población"],
              ["Sexo","No tiene preferencia"],
              ["Edad de inicio","Madurez a la vejez"]
            ]
          }),
          e(H3,{c:C.del,mt:14},"Los 5 tipos de delirios"),
          e(Table,{
            headers:[{t:"Tipo",c:C.del},{t:"Características",c:C.del}],
            rows:[
              ["Persecutorio (★ el más común)","Creencia de ser perseguido, espiado, envenenado · pueden llegar a ser HOSTILES"],
              ["Erotomaníaco","Convicción de ser amado en secreto por alguien (típicamente de estatus superior)"],
              ["De grandeza","Creencia de tener talento, identidad o poder especial no reconocido"],
              ["Celotípico","Convicción infidelidad de la pareja sin evidencia · pueden llegar a ser HOSTILES"],
              ["Somático","Creencias falsas sobre el cuerpo (enfermedad, infestación, deformidad) · se diferencia de hipocondría en que el delirio NO desaparece con pruebas médicas normales"]
            ]
          })
        ),
        dx:e("div",null,
          e(CritBlock,{title:"Trastorno delirante (DSM-5)",c:C.del},
            e(Crit,{crit:"A",c:C.del},"Presencia de ≥1 delirios durante ",e("b",null,"≥ 1 mes"),"."),
            e(Crit,{crit:"B",c:C.del},"Nunca se han cumplido criterios de esquizofrenia."),
            e(Crit,{crit:"C",c:C.del},"Excepto por el impacto directo del delirio, el ",e("b",null,"funcionamiento no está deteriorado")," de forma marcada y el comportamiento no es extraño."),
            e(Crit,{crit:"D",c:C.del},"Si hay episodios afectivos, han sido breves respecto a los periodos delirantes."),
            e(Crit,{crit:"E",c:C.del},"No atribuible a sustancias, otra afección médica ni mejor explicado por otro trastorno mental.")
          ),
          e(H3,{c:C.del,mt:14},"Diagnóstico diferencial"),
          e(Table,{
            headers:[{t:"A descartar",c:C.del},{t:"Clave",c:C.del}],
            rows:[
              ["Esquizofrenia","Delirios bizarros, alucinaciones prominentes, síntomas negativos, deterioro funcional"],
              ["Trastornos del estado de ánimo","Los delirios aparecen solo en contexto del episodio afectivo"],
              ["Trastorno de personalidad paranoide","Patrón persistente SIN delirios propiamente dichos"]
            ]
          }),
          e(Alert,{c:C.bad,label:"⚠️ Importante"},"No debe diagnosticarse si el cuadro se explica mejor por trastornos de la personalidad, consumo de sustancias o afecciones médicas.")
        ),
        tx:e("div",null,
          e(P,null,e("b",null,"Farmacológico:")," antipsicóticos ",e("b",null,"típicos y atípicos"),". El tratamiento ayuda con la ",e("b",null,"agitación y ansiedad")," asociadas pero ",e("b",null,"el delirio suele permanecer"),"."),
          e(P,null,e("b",null,"Manejo clínico:")," construir una relación de confianza y cuestionar con ",e("b",null,"mucho cuidado")," sus creencias falsas. Confrontar el delirio de forma directa rompe la alianza terapéutica."),
          e(Alert,{c:C.bad,label:"⚠️ Contraindicada"},"La ",e("b",null,"terapia de grupo NO")," está indicada en trastorno delirante.")
        )
      }
    },
    {
      n:"06",name:"Trastorno bipolar tipo I",c:C.bip,
      blurb:"≥1 episodio maníaco (con o sin depresión)",
      sections:{
        def:e(Def,{c:C.bip},"Forma ",e("b",null,"más grave e incapacitante")," de bipolaridad. Definido por la presencia de ",e("b",null,"al menos UN episodio maníaco")," (o mixto maníaco-depresivo) en la vida. Los episodios depresivos mayores son frecuentes pero ",e("b",null,"NO son necesarios")," para el diagnóstico."),
        cli:e("div",null,
          e(H3,{c:C.bip},"Episodio maníaco (base del dx)"),
          e(P,null,e("b",null,"Estado de ánimo muy elevado, persistente. Dura MÍNIMO 1 semana.")," Requiere ",e("b",null,"≥3 de 7 síntomas")," (≥4 si el ánimo es solo irritable):"),
          e(SxList,{c:C.bip,items:[
            "Grandiosidad",
            "Disminución de la necesidad de sueño",
            "Más conversador (verborreico)",
            "Fuga de ideas o pensamiento acelerado",
            "Distractibilidad",
            "Aumento de actividad dirigida a metas (más ganas de hacer cosas)",
            "Participación en actividades extremas o con consecuencias graves (gastos, sexo, negocios imprudentes)"
          ]}),
          e(Alert,{c:C.bad,label:"⚠️ Regla dura"},"Causa ",e("b",null,"deterioro social o laboral marcado"),", requiere hospitalización, o tiene ",e("b",null,"síntomas psicóticos"),". Si hay síntomas psicóticos → por definición es MANÍACO (no hipomaníaco)."),
          e(H3,{c:C.bip,mt:14},"Curso clínico"),
          e(SxList,{c:C.bip,items:[
            "Episodios de manía y depresión que pueden durar meses o años",
            "La manía suele ser MÁS CORTA que la depresión",
            "Pronóstico favorable pero con recurrencia significativa",
            "Las recaídas son muy comunes y los porcentajes de recuperación completa son bajos"
          ]}),
          e(H3,{c:C.bip,mt:14},"Consecuencias de la manía"),
          e(SxList,{c:C.bip,items:[
            "Cambios en la apariencia (empobrecimiento del juicio)",
            "Hiperactividad improductiva (conductas antiéticas)",
            "Hospitalización involuntaria",
            "Problemas legales y económicos"
          ]}),
          e(H3,{c:C.bip,mt:14},"Epidemiología"),
          e(SxList,{c:C.bip,items:[
            "Aparece en adolescencia o adultez temprana (~25 años)",
            "Más común en mujeres",
            "Puede debutar tras un parto (suele aparecer después del puerperio)"
          ]}),
          e(H3,{c:C.bip,mt:14},"Etiología"),
          e(P,null,"Múltiple; se cree fuertemente ",e("b",null,"hereditaria"),". Factores que precipitan recaídas: mala adherencia al tratamiento, alteraciones del sueño (dormir mucho o poco), drogas y automedicación (incluye café, THC, alcohol), mala medicación por diagnóstico incorrecto."),

          // === EPISODIO DEPRESIVO MAYOR (componente interno) ===
          e("div",{style:{marginTop:18,padding:"14px 16px",background:"linear-gradient(135deg,"+ax(C.dep,.1)+","+C.cd+" 90%)",border:"1px solid "+ax(C.dep,.35),borderLeft:"4px solid "+C.dep,borderRadius:12}},
            e("div",{style:{fontSize:10,fontWeight:800,color:C.dep,letterSpacing:1.8,textTransform:"uppercase",marginBottom:6}},"🌀 Componente · Episodio depresivo mayor"),
            e("div",{style:{fontSize:13,color:C.tx,lineHeight:1.55,marginBottom:12}},"Los episodios de depresión mayor son ",e("b",null,"frecuentes en bipolar I")," pero ",e("b",null,"NO son necesarios")," para el diagnóstico. Aun así, es vital reconocerlos porque aparecen en la mayoría de pacientes y orientan el manejo:"),
            e(SxList,{title:"Los 9 síntomas · ≥5 durante ≥2 semanas · al menos uno debe ser ánimo bajo o anhedonia",c:C.dep,items:[
              "Estado de ánimo deprimido la mayor parte del día, casi todos los días",
              "Pérdida del interés o placer (anhedonia)",
              "Pérdida importante de peso sin dieta (o cambio del apetito)",
              "Insomnio o hipersomnia casi todos los días",
              "Agitación o retraso psicomotor observable",
              "Fatiga o pérdida de la energía casi todos los días",
              "Sentimientos de inutilidad o culpabilidad excesiva",
              "Disminución de la capacidad de pensar o concentrarse",
              "Pensamientos recurrentes de muerte o ideación suicida"
            ]}),
            e("div",{style:{marginTop:10,fontSize:12.5,color:C.mt,lineHeight:1.55}},e("b",{style:{color:C.dep}},"Causa malestar o deterioro")," significativo y no es atribuible a sustancias ni otra afección médica. En bipolar las fases depresivas suelen ser ",e("b",null,"más largas")," que las maníacas.")
          )
        ),
        dx:e("div",null,
          e(CritBlock,{title:"Trastorno bipolar I (DSM-5)",c:C.bip},
            e(Crit,{crit:"A",c:C.bip},"Cumple criterios para ",e("b",null,"al menos un episodio maníaco"),"."),
            e(Crit,{crit:"B",c:C.bip},"La aparición del episodio maníaco y depresivo mayor no se explica mejor por trastorno esquizoafectivo, esquizofrenia, delirante u otro trastorno psicótico.")
          ),
          e(H3,{c:C.bip,mt:14},"Diagnóstico diferencial"),
          e(SxList,{c:C.bip,items:[
            "Esquizofrenia",
            "Psicosis breve inducida por fármacos",
            "Trastorno límite de personalidad (TLP)",
            "Trastorno por uso de sustancias"
          ]})
        ),
        tx:e("div",null,
          e(H3,{c:C.bip},"Por fase del cuadro"),
          e(Table,{
            headers:[{t:"Fase",c:C.bip},{t:"Opciones",c:C.bip}],
            rows:[
              ["Manía aguda / episodio mixto","Litio · antipsicóticos · carbamazepina · valproato"],
              ["Depresión bipolar aguda","Litio · carbamazepina · lamotrigina · antidepresivos (con precaución, siempre con estabilizador)"],
              ["Mantenimiento","Litio · lamotrigina · antidepresivos (solo asociados a estabilizador)"]
            ]
          }),
          e(H3,{c:C.bip,mt:14},"Estabilizadores del ánimo — pilar"),
          e(Table,{
            headers:[{t:"Fármaco",c:C.bip},{t:"Mejor para",c:C.bip}],
            rows:[
              ["Litio","Gold standard · manía y mantenimiento · ↓ suicidio"],
              ["Valproato","Manía aguda · ciclos rápidos"],
              ["Carbamazepina","Mantenimiento a largo plazo"],
              ["Lamotrigina","Fase depresiva y prevención de depresión"]
            ]
          }),
          e(Pearl,{t:"Ciclos rápidos"},"Especificador DSM-5 cuando hay ",e("b",null,"≥4 episodios afectivos (maníaco, hipomaníaco, depresivo o mixto) en 12 meses"),". Predice peor respuesta a litio; el ",e("b",null,"valproato")," suele preferirse en este subgrupo."),
          e(Pearl,{t:"Litio · claves clínicas"},"Ventana terapéutica estrecha: ",e("b",null,"0.6–1.2 mEq/L"),". Signos de toxicidad: temblor grueso, ataxia, disartria, confusión, convulsiones. Monitoreo obligatorio de niveles plasmáticos, función ",e("b",null,"renal")," y ",e("b",null,"tiroidea"),". ",e("b",null,"Contraindicado en embarazo")," por riesgo de ",e("b",null,"anomalía de Ebstein")," (malformación cardíaca de la válvula tricúspide) y en insuficiencia renal avanzada."),
          e(Pearl,{t:"Dato curioso"},"Las personas con bipolaridad suelen ser ",e("b",null,"muy creativas"),". Múltiples artistas, músicos y escritores lo padecen."),
          e(Alert,{c:C.bad,label:"⚠️ Trampa de examen"},"NO iniciar antidepresivos en bipolaridad SIN cobertura de estabilizador del ánimo — riesgo de viraje a manía.")
        )
      }
    },
    {
      n:"07",name:"Trastorno bipolar tipo II",c:C.bip,
      blurb:"≥1 hipomanía + ≥1 depresión mayor · Nunca manía",
      sections:{
        def:e(Def,{c:C.bip},"Requiere ",e("b",null,"al menos 1 episodio hipomaníaco")," y ",e("b",null,"al menos 1 episodio depresivo mayor"),", sin haber tenido nunca un episodio maníaco franco. Paradójicamente es ",e("b",null,"MÁS depresivo")," que el tipo I en carga sintomática a lo largo de la vida."),
        cli:e("div",null,
          e(H3,{c:C.bip},"Episodio hipomaníaco"),
          e(SxList,{c:C.bip,items:[
            "Estado de ánimo elevado, pero MÁS LEVE y BREVE que la manía",
            "Dura MÍNIMO 4 días consecutivos",
            "NO suele requerir hospitalización",
            "NO afecta notablemente la vida laboral o social",
            "Si hay síntomas psicóticos → por definición es MANIACO, no hipomaníaco (pasa a ser bipolar I)"
          ]}),
          e(H3,{c:C.bip,mt:14},"Comorbilidad"),
          e(P,null,"Alta comorbilidad con otras enfermedades, especialmente ",e("b",null,"abuso de sustancias"),". La depresión suele ser la razón de consulta."),

          // === EPISODIO DEPRESIVO MAYOR (componente obligatorio) ===
          e("div",{style:{marginTop:18,padding:"14px 16px",background:"linear-gradient(135deg,"+ax(C.dep,.1)+","+C.cd+" 90%)",border:"1px solid "+ax(C.dep,.35),borderLeft:"4px solid "+C.dep,borderRadius:12}},
            e("div",{style:{fontSize:10,fontWeight:800,color:C.dep,letterSpacing:1.8,textTransform:"uppercase",marginBottom:6}},"🌀 Componente OBLIGATORIO · Episodio depresivo mayor"),
            e("div",{style:{fontSize:13,color:C.tx,lineHeight:1.55,marginBottom:12}},"A diferencia del bipolar I, aquí el episodio depresivo mayor ",e("b",null,"SÍ es necesario para el diagnóstico"),". De hecho, la carga depresiva es mayor en bipolar II que en bipolar I."),
            e(SxList,{title:"Los 9 síntomas · ≥5 durante ≥2 semanas · al menos uno debe ser ánimo bajo o anhedonia",c:C.dep,items:[
              "Estado de ánimo deprimido la mayor parte del día, casi todos los días",
              "Pérdida del interés o placer (anhedonia)",
              "Pérdida importante de peso sin dieta (o cambio del apetito)",
              "Insomnio o hipersomnia casi todos los días",
              "Agitación o retraso psicomotor observable",
              "Fatiga o pérdida de la energía casi todos los días",
              "Sentimientos de inutilidad o culpabilidad excesiva",
              "Disminución de la capacidad de pensar o concentrarse",
              "Pensamientos recurrentes de muerte o ideación suicida"
            ]}),
            e("div",{style:{marginTop:10,fontSize:12.5,color:C.mt,lineHeight:1.55}},e("b",{style:{color:C.dep}},"Causa malestar o deterioro")," significativo y no es atribuible a sustancias ni otra afección médica. En bipolar II la depresión es típicamente la razón de consulta y la fase más larga.")
          )
        ),
        dx:e(CritBlock,{title:"Trastorno bipolar II (DSM-5)",c:C.bip},
          e(Crit,{crit:"A",c:C.bip},"Al menos un ",e("b",null,"episodio hipomaníaco")," (criterios de manía pero ≥4 días y sin deterioro marcado) y al menos un ",e("b",null,"episodio depresivo mayor"),"."),
          e(Crit,{crit:"B",c:C.bip},"Nunca ha habido un episodio maníaco."),
          e(Crit,{crit:"C",c:C.bip},"Los episodios no se explican mejor por trastorno esquizoafectivo, esquizofrenia u otro trastorno psicótico."),
          e(Crit,{crit:"D",c:C.bip},"Los síntomas causan malestar clínicamente significativo (típicamente durante los episodios depresivos).")
        ),
        tx:e("div",null,
          e(P,null,"Similar al bipolar I pero con mayor énfasis en la prevención de la ",e("b",null,"fase depresiva"),"."),
          e(SxList,{c:C.bip,items:[
            "Lamotrigina — de elección para prevenir depresión",
            "Litio — mantenimiento",
            "Quetiapina — una de las pocas opciones con evidencia en depresión bipolar",
            "Antidepresivos SOLO con estabilizador y con precaución por riesgo de viraje"
          ]})
        )
      }
    },
    {
      n:"08",name:"Trastorno ciclotímico",c:C.bip,
      blurb:"Forma más leve · Variaciones leves hipomanía/depresión",
      sections:{
        def:e(Def,{c:C.bip},"Forma ",e("b",null,"MÁS LEVE")," del espectro bipolar. El paciente presenta ",e("b",null,"ligeras variaciones del estado de ánimo")," alternando episodios hipomaníacos y depresivos, ninguno de los cuales cumple criterios completos."),
        cli:e("div",null,
          e(H3,{c:C.bip},"Características"),
          e(SxList,{c:C.bip,items:[
            "Fase hipomaníaca: ánimo elevado, pero no cumple criterios completos y NO afecta la vida profesional/social",
            "Fase depresiva: NO cumple criterios de depresión mayor completa",
            "Las oscilaciones son crónicas y persistentes",
            "Riesgo de progresar a bipolar I o II"
          ]})
        ),
        dx:e(CritBlock,{title:"Ciclotimia (DSM-5)",c:C.bip},
          e(Crit,{crit:"A",c:C.bip},"Durante ≥2 años (≥1 en niños/adolescentes) han existido numerosos periodos con síntomas hipomaníacos que no cumplen criterios de hipomanía y periodos con síntomas depresivos que no cumplen criterios de depresión mayor."),
          e(Crit,{crit:"B",c:C.bip},"Los síntomas han estado presentes al menos la mitad del tiempo y la persona no ha estado sin síntomas por más de 2 meses seguidos."),
          e(Crit,{crit:"C",c:C.bip},"Nunca se han cumplido criterios para depresión mayor, manía o hipomanía."),
          e(Crit,{crit:"D",c:C.bip},"No se explica mejor por trastorno esquizoafectivo, esquizofrenia u otro trastorno psicótico."),
          e(Crit,{crit:"E",c:C.bip},"No atribuible a sustancias ni a afección médica."),
          e(Crit,{crit:"F",c:C.bip},"Causa malestar o deterioro significativo.")
        ),
        tx:e(P,null,"Estabilizadores del ánimo a dosis bajas (litio, valproato, lamotrigina), psicoeducación, TCC para regulación emocional. Pronóstico variable, con tendencia a progresar a formas más graves si no se maneja.")
      }
    }
  ];

  // Section tiles delegate to p.onOpenSection (SM App promotes them to
  // view="section" as a full inline page — no inline DzModal here).
  var general=[
    {id:"conceptos",ic:"🧭",t:"Conceptos generales",sub:"SM · Psiquiatría · Tratamientos",c:c,
     content:e("div",null,
       e(Def,{c:c},e("b",null,"Salud mental:")," estado de bienestar en el que el individuo es consciente de sus capacidades, puede afrontar el estrés, puede trabajar de forma productiva y contribuir a la comunidad."),
       e(Def,{c:c},e("b",null,"Psiquiatría:")," ciencia dedicada al estudio y tratamiento de las enfermedades mentales."),
       e(Def,{c:c},e("b",null,"Trastorno mental:")," afección que afecta emociones, ánimo o comportamiento e interfiere con la vida diaria."),
       e(H3,{c:c},"Tipos de tratamiento"),
       e(Table,{
         headers:[{t:"Modalidad",c:c},{t:"Opciones",c:c}],
         rows:[
           ["Psicoterapia","TCC, sistemática, racional emotiva, centrada en soluciones"],
           ["Farmacológico","Antidepresivos, ansiolíticos, antipsicóticos, estabilizadores del ánimo"],
           ["Somático","Terapia electroconvulsiva (ECT), estimulación magnética transcraneal (EMT)"]
         ]
       })
     )},
    {id:"psivsneu",ic:"⚖️",t:"Psicosis vs Neurosis",sub:"Tabla comparativa fundamental",c:c,
     content:e("div",null,
       e(P,null,"División clásica de los trastornos mentales. La diferencia clave es la ",e("b",null,"prueba de realidad"),"."),
       e(Table,{
         headers:[{t:"Característica",c:c},{t:"Psicosis",c:C.psi},{t:"Neurosis",c:C.anx}],
         rows:[
           ["Contacto con realidad","PÉRDIDA del contacto con la realidad","NO se desconecta de la realidad"],
           ["Síntomas principales","Alucinaciones, delirios","Ansiedad, depresión, angustia, obsesión"],
           ["Tratamiento","Medicación (antipsicóticos) + terapia","Terapia psicológica predominante"]
         ]
       }),
       e(H3,{c:c,mt:14},"Qué entidades entran en cada grupo"),
       e(Table,{
         headers:[{t:"Grupo",c:c},{t:"Entidades",c:c}],
         rows:[
           ["Psicosis","Esquizofrenia y subtipos · trastorno delirante · trastorno psicótico breve · trastorno bipolar (I, II, ciclotímico) · depresión mayor con psicosis"],
           ["Neurosis","Ansiedad · TOC · trauma y estrés · TCA · sueño-vigilia · personalidad · control de impulsos · depresivos · somatomorfos"]
         ]
       }),
       e(Note,{c:c,t:"Nota"},"Esta clasificación es clínica, no DSM. El DSM-5 no usa los términos 'psicosis' y 'neurosis' formalmente, pero siguen siendo útiles pedagógicamente.")
     )},
    {id:"dopamina",ic:"🧠",t:"Las 4 vías dopaminérgicas",sub:"Clave para antipsicóticos",c:c,
     content:e("div",null,
       e(P,null,"Entender estas vías explica por qué los antipsicóticos funcionan y producen los efectos adversos que producen."),
       e(Table,{
         headers:[{t:"Vía",c:c},{t:"Recorrido",c:c},{t:"Qué hace normalmente",c:c},{t:"Qué pasa si falla",c:c}],
         rows:[
           ["Mesolímbica","Área tegmental ventral → núcleo accumbens","Refuerzo, recompensa, motivación","HIPERACTIVA en esquizofrenia → síntomas positivos"],
           ["Mesocortical","Área tegmental ventral → corteza prefrontal","Cognición, ánimo, función ejecutiva","HIPOACTIVA en esquizofrenia → síntomas negativos y cognitivos"],
           ["Nigroestriada","Sustancia nigra → cuerpo estriado","Control motor","Parkinson / corea · extrapiramidalismo de antipsicóticos típicos"],
           ["Tuberoinfundibular","Hipotálamo → hipófisis","Inhibe prolactina","Bloqueo → hiperprolactinemia (galactorrea, amenorrea, disfunción sexual)"]
         ]
       }),
       e(Pearl,{t:"Por qué los atípicos son mejores"},"Los antipsicóticos atípicos bloquean D2 de forma más selectiva en mesolímbica y tienen antagonismo 5-HT2A, por lo que producen ",e("b",null,"menos")," efectos extrapiramidales y menos hiperprolactinemia que los típicos.")
     )},
    {id:"antipsi",ic:"💊",t:"Antipsicóticos · resumen",sub:"Típicos vs atípicos",c:c,
     content:e("div",null,
       e(H3,{c:c},"Antipsicóticos típicos (1ª generación)"),
       e(Table,{
         headers:[{t:"Fármaco",c:c},{t:"Notas",c:c}],
         rows:[
           ["Haloperidol","Alta potencia · útil en agitación aguda · alto riesgo extrapiramidal"],
           ["Clorpromazina","Baja potencia · más sedante · anticolinérgico"],
           ["Flufenazina","Disponible en depósito (LAI)"]
         ]
       }),
       e(H3,{c:c,mt:14},"Antipsicóticos atípicos (2ª generación · 1ª línea actual)"),
       e(Table,{
         headers:[{t:"Fármaco",c:c},{t:"Notas",c:c}],
         rows:[
           ["Risperidona","Muy usado · mayor riesgo hiperprolactinemia que otros atípicos · existe en depósito"],
           ["Olanzapina","Muy eficaz · alto síndrome metabólico (aumento de peso, diabetes)"],
           ["Quetiapina","Menos extrapiramidal · sedante · útil también en depresión bipolar"],
           ["Aripiprazol","Agonista parcial D2 · menos síndrome metabólico · menos hiperprolactinemia"],
           ["Paliperidona","Metabolito activo de risperidona · depósito mensual"],
           ["Clozapina","★ Única eficaz en refractarios · riesgo agranulocitosis · requiere hemograma estricto"]
         ]
       }),
       e(Alert,{c:C.bad,label:"⚠️ Efectos adversos clave"},
         e("ol",{style:{margin:0,paddingLeft:20,lineHeight:1.8,fontSize:13}},
           e("li",null,e("b",null,"Extrapiramidales (EPS):")," distonía aguda, parkinsonismo, acatisia, discinesia tardía (típicos > atípicos)"),
           e("li",null,e("b",null,"Síndrome metabólico:")," aumento de peso, diabetes, dislipidemia (olanzapina, clozapina)"),
           e("li",null,e("b",null,"Hiperprolactinemia:")," galactorrea, amenorrea, disfunción sexual (risperidona, típicos)"),
           e("li",null,e("b",null,"Síndrome neuroléptico maligno:")," emergencia médica · fiebre + rigidez + alteración conciencia + CPK ↑"),
           e("li",null,e("b",null,"QT prolongado:")," riesgo arritmia (haloperidol IV, ziprasidona)")
         )
       )
     )},
    {id:"estab",ic:"⚖️",t:"Estabilizadores del ánimo",sub:"Para bipolaridad",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Fármaco",c:c},{t:"Mejor para",c:c},{t:"Precauciones",c:c}],
         rows:[
           ["Litio","Gold standard · manía y mantenimiento · ↓ suicidio","Índice terapéutico estrecho · monitorizar función renal, tiroidea, niveles plasmáticos · teratogénico (Ebstein)"],
           ["Valproato","Manía aguda · ciclos rápidos","Teratogénico grave (defectos tubo neural) · hepatotoxicidad · aumento de peso"],
           ["Carbamazepina","Mantenimiento a largo plazo","Induce su propio metabolismo · hiponatremia · agranulocitosis · Stevens-Johnson (HLA-B*1502)"],
           ["Lamotrigina","Fase depresiva y prevención de depresión","Titular lentamente por rash grave (Stevens-Johnson)"]
         ]
       }),
       e(Pearl,{t:"Litio — controles"},"Antes de iniciar: función renal, tiroidea, hemograma, ECG, test de embarazo. Niveles plasmáticos: 0.6–1.2 mEq/L (mantenimiento). Toxicidad a partir de >1.5. Temblor, poliuria, hipotiroidismo son frecuentes.")
     )},
    {id:"resumen",ic:"📊",t:"Resumen comparativo",sub:"Las 6 entidades en una tabla",c:c,
     content:e("div",null,
       e(P,null,"Tabla de repaso final con todas las entidades de psicosis organizadas por duración cuando aplica."),
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"Duración clave",c:c},{t:"Característica central",c:c},{t:"Tratamiento de elección",c:c}],
         rows:[
           ["Psicótico breve","≥1 día, <1 mes","Síntomas psicóticos con retorno al estado previo","Antipsicótico atípico corto + apoyo"],
           ["Esquizofreniforme","≥1 mes, <6 meses","Idéntico a esquizofrenia pero más corto","Antipsicótico atípico · mantener ≥12 m"],
           ["Esquizofrenia","≥6 meses","≥2 síntomas + positivos + negativos + deterioro","Atípicos (1ª línea) · clozapina refractarios"],
           ["Esquizoafectivo","Variable","Esquizofrenia + episodios afectivos · ≥2 sem psicosis sin ánimo","Antipsicótico + estabilizador (bipolar) o antidep (depresivo)"],
           ["Trastorno delirante","≥1 mes","Delirios + personalidad preservada + funcional","Antipsicóticos · NO terapia de grupo"],
           ["Bipolar I","Manía ≥1 sem","≥1 episodio maníaco","Litio · atípicos · valproato"],
           ["Bipolar II","Hipomanía ≥4 d","≥1 hipomanía + ≥1 depresión mayor","Lamotrigina · litio · quetiapina"],
           ["Ciclotimia","≥2 años","Oscilaciones leves sin cumplir criterios completos","Estabilizadores bajos · psicoeducación"],
           ["Depresión mayor","≥2 semanas","≥5 de 10 síntomas · anhedonia central","ISRS/IRSN + TCC · ECT refractaria"]
         ]
       })
     )},
    {id:"perlas",ic:"📌",t:"Perlas de examen",sub:"Alto rendimiento",c:c,
     content:e("div",null,
       e(Pearl,{t:"⏱ Espectro por duración"},"Psicótico BREVE <1 mes · ESQUIZOFRENIFORME 1–6 meses · ESQUIZOFRENIA ≥6 meses. Es la misma clínica, solo cambia el tiempo."),
       e(Pearl,{t:"Esquizoafectivo vs trastorno del ánimo con psicosis"},"La clave es que en esquizoafectivo hay ",e("b",null,"≥2 semanas de delirios/alucinaciones SIN síntomas afectivos mayores"),". Si la psicosis aparece SOLO dentro del episodio afectivo → trastorno bipolar/depresivo con psicosis, NO esquizoafectivo."),
       e(Pearl,{t:"Psicosis breve post-parto"},"El especificador 'inicio en posparto' aplica si los síntomas aparecen durante embarazo o en las primeras 4 semanas tras el parto. Buscar siempre en mujeres jóvenes."),
       e(Pearl,{t:"Delirante vs esquizofrenia"},"Delirante: ≥1 mes + ",e("b",null,"personalidad preservada")," + funcional. Esquizofrenia: ≥6 m + síntomas negativos + deterioro marcado."),
       e(Pearl,{t:"Hipomanía vs manía"},"Hipomanía ≥4 días, SIN deterioro marcado, SIN psicosis. Manía ≥1 semana, CON deterioro o psicosis. ",e("b",null,"Si hay psicosis → es manía por definición"),"."),
       e(Pearl,{t:"Bipolar I vs II"},"Bipolar I: necesita SOLO manía. Bipolar II: SI necesita depresión mayor + hipomanía."),
       e(Pearl,{t:"Vía tuberoinfundibular"},"Bloqueo → hiperprolactinemia. Típicos y risperidona > otros atípicos. Genera galactorrea, amenorrea, disfunción sexual."),
       e(Pearl,{t:"Clozapina"},"ÚNICA eficaz en esquizofrenia refractaria (≥2 antipsicóticos sin respuesta). Riesgo de agranulocitosis → hemograma semanal los primeros 6 meses, luego mensual."),
       e(Pearl,{t:"Viraje maniaco"},"NO dar antidepresivos solos en bipolaridad — riesgo de viraje a manía. Siempre con estabilizador."),
       e(Pearl,{t:"Suicidio en esquizofrenia"},"Los factores de riesgo son: sexo masculino, <30 años, desempleo, depresión previa, abuso de sustancias, internación reciente."),
       e(Pearl,{t:"Trastorno delirante — hostilidad"},"Los tipos persecutorio y celotípico son los que más pueden llegar a ser ",e("b",null,"hostiles"),"."),
       e(Pearl,{t:"Somático vs hipocondría"},"En delirante somático, el delirio NO desaparece con pruebas médicas normales. En hipocondría (IAD), la preocupación persiste pero el paciente puede dudar."),
       e(Pearl,{t:"Litio y embarazo"},"Teratogénico: malformación de Ebstein (cardiaca). Valproato: defectos del tubo neural. En embarazo planificado, lamotrigina o antipsicóticos atípicos son más seguros.")
     )},
    {id:"flash",ic:"🃏",t:"Flashcards",sub:"16 preguntas de estudio",c:c,
     content:e("div",null,
       e(P,null,"Tarjetas de repaso de psicosis. Toca para revelar la respuesta."),
       e(FlashDeck,{c:c,deckId:"psicosis",items:getAllCards("psicosis")})
     )},
    {id:"quiz",ic:"❓",t:"Quiz · 6 casos clínicos",sub:"Prueba tus conocimientos",c:c,
     content:e(Quiz,{c:c,items:getAllQuiz("psicosis")})}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Psicosis · Salud Mental",title:"Trastornos psicóticos"},
      "Grupo de trastornos caracterizados por ",e("b",null,"pérdida del contacto con la realidad"),": delirios, alucinaciones, pensamiento desorganizado. El ",e("b",null,"espectro esquizofrénico")," se distingue principalmente por la ",e("b",null,"duración")," de los síntomas. Incluye también los trastornos del estado de ánimo graves (bipolar y depresión mayor) en la clasificación clínica que seguimos."
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.3),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Inter,DM Sans"}},"Conceptos, fármacos + Quiz + Flashcards")
    ),
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginTop:10}},
      general.map(function(g,i){
        return e("button",{key:g.id,onClick:function(){if(p&&p.onOpenSection)p.onOpenSection(g);},style:{padding:"14px 12px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:10,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:4,minHeight:90}},
          e("div",{style:{fontSize:22,marginBottom:4}},g.ic),
          e("div",{style:{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Inter,DM Sans"}},g.t),
          e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.4,marginTop:2}},g.sub)
        );
      })
    ),

    // Línea de tiempo del espectro psicótico (clave anti-confusión)
    e("div",{style:{padding:"16px 14px",background:"linear-gradient(135deg,"+ax(C.esq,.12)+","+C.cd+" 90%)",border:"1px solid "+ax(C.esq,.3),borderRadius:12,margin:"14px 0 4px"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:C.esq,letterSpacing:2,textTransform:"uppercase",marginBottom:8,textAlign:"center"}},"⏱ Línea de tiempo del espectro esquizofrénico"),
      e("div",{style:{fontSize:12.5,color:C.tx,lineHeight:1.55,marginBottom:10,textAlign:"center"}},"La ",e("b",null,"única diferencia")," entre estos tres es la ",e("b",null,"duración"),":"),
      e(Table,{
        headers:[{t:"Duración",c:C.esq},{t:"Diagnóstico",c:C.esq},{t:"Clave",c:C.esq}],
        rows:[
          ["≥1 día, <1 mes","Trastorno psicótico breve","Retorno completo al estado previo"],
          ["≥1 mes, <6 meses","Trastorno esquizofreniforme","Si supera 6 m → esquizofrenia"],
          ["≥6 meses","Esquizofrenia","Diagnóstico definitivo"],
          ["Variable (con ánimo)","Trastorno esquizoafectivo","Esquizofrenia + episodios afectivos mayores · ≥2 sem de psicosis sin ánimo"]
        ]
      })
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.15)+","+ax(c,.04)+" 90%)",border:"1px solid "+ax(c,.35),borderRadius:14,margin:"18px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Las 8 enfermedades"),
      e("div",{style:{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Inter,DM Sans"}},"Toca cualquier enfermedad para abrir su ficha"),
      e("div",{style:{fontSize:12,color:C.mt,marginTop:4,lineHeight:1.45}},"Cada ficha tiene tabs: Definición · Clínica · Diagnóstico · Tratamiento")
    ),
    e(DzGrid,{c:c,items:diseases,onOpen:p&&p.onOpen}),

    // Aclaración sobre depresión mayor en este bloque
    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(C.dep,.08)+","+C.cd+" 90%)",border:"1px solid "+ax(C.dep,.3),borderLeft:"4px solid "+C.dep,borderRadius:12,margin:"18px 0 10px"}},
      e("div",{style:{fontSize:10,fontWeight:800,color:C.dep,letterSpacing:1.8,textTransform:"uppercase",marginBottom:6}},"💡 Nota sobre depresión"),
      e("div",{style:{fontSize:13,color:C.tx,lineHeight:1.55}},"El ",e("b",{style:{color:C.dep}},"episodio depresivo mayor")," no se estudia aquí como enfermedad aparte — es un ",e("b",null,"componente interno")," del trastorno bipolar (I y II) junto con los episodios maníaco e hipomaníaco. Encuentras sus ",e("b",null,"9 criterios completos")," dentro de la ficha de ",e("b",{style:{color:C.bip}},"Bipolar I")," y ",e("b",{style:{color:C.bip}},"Bipolar II"),", en la pestaña ",e("b",null,"Clínica"),". El trastorno depresivo mayor ",e("b",null,"crónico/recurrente")," (sin bipolaridad) se estudia en ",e("b",{style:{color:C.dpr}},"Neurosis → Trastornos depresivos"),".")
    ),

    e(Abbrev,{c:c,items:[
      {a:"DSM-5",d:"Manual Diagnóstico y Estadístico, 5ª edición"},
      {a:"SM",d:"Salud Mental"},
      {a:"TCC",d:"Terapia Cognitivo-Conductual"},
      {a:"ECT",d:"Terapia Electroconvulsiva"},
      {a:"EMT",d:"Estimulación Magnética Transcraneal"},
      {a:"TDM",d:"Trastorno Depresivo Mayor"},
      {a:"TLP",d:"Trastorno Límite de Personalidad"},
      {a:"LAI",d:"Inyección de acción prolongada (Long-Acting Injectable)"},
      {a:"NMDA",d:"Receptor N-metil-D-aspartato del glutamato"},
      {a:"EPS",d:"Síntomas Extrapiramidales"},
      {a:"CPK",d:"Creatinfosfoquinasa"},
      {a:"THC",d:"Tetrahidrocannabinol (cannabis)"}
    ]})
  );
}


