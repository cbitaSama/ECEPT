// ══════════════════════════════════════════════════════════════
// SALUD MENTAL II — integrated module (IIFE-scoped)
// ══════════════════════════════════════════════════════════════
// Source of truth: artifacts/salud_mental.html (Alpha13).
// All SM internals (var C, function App, function TraumaView, DECKS,
// EXTRA_CARDS/QUIZ, SEARCH_INDEX, view components) live inside an IIFE
// so their names cannot collide with ECEPT globals. The IIFE exposes:
//   window.SaludMentalView  — SM's App component (renders RootHub)
//   window.SM_SEARCH_INDEX  — for ECEPT's globalSearch integration
//   window._smFocus(route)  — deep-link from ECEPT search → SM sub-view
// localStorage keys (flashcards_<theme>, flashcards_global_<group>) are
// preserved verbatim so students keep their saved cards.
// ══════════════════════════════════════════════════════════════
(function(){
var e=React.createElement,F=React.Fragment;
var useState=React.useState,useEffect=React.useEffect;

var C={
  bg:"#060a14",cd:"#0d1224",cd2:"#141a33",bd:"#1a2040",bd2:"#2a3358",
  tx:"#e2e8f0",mt:"#94a3b8",dm:"#64748b",
  anx:"#60a5fa",toc:"#a78bfa",trm:"#fb923c",som:"#34d399",dis:"#f472b6",
  psi:"#ef4444",bip:"#fbbf24",esq:"#a855f7",del:"#f87171",dep:"#38bdf8",
  tca:"#ec4899",sue:"#22d3ee",per:"#facc15",imp:"#f97316",dpr:"#818cf8",
  intro:"#94a3b8",
  ok:"#34d399",bad:"#f87171",warn:"#fbbf24",info:"#60a5fa",pearl:"#fb923c",dng:"#ef4444"
};
function ax(hex,a){var r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return"rgba("+r+","+g+","+b+","+a+")";}

// ══════════════════════════════════════════════════════════════
// PRIMITIVAS — orientadas a lectura densa y explícita
// ══════════════════════════════════════════════════════════════

// Título de sección principal (H2)
function H2(p){
  var c=p.c||C.tx;
  return e("h2",{style:{fontSize:23,fontWeight:800,color:c,marginTop:p.mt||32,marginBottom:12,letterSpacing:.2,lineHeight:1.2,paddingBottom:8,borderBottom:"2px solid "+ax(c,.3)}},p.children);
}

// Subsección (H3)
function H3(p){
  var c=p.c||C.tx;
  return e("h3",{style:{fontSize:17,fontWeight:800,color:c,marginTop:p.mt||22,marginBottom:10,letterSpacing:.1,lineHeight:1.25}},p.children);
}

// Párrafo de lectura
function P(p){
  return e("p",{className:"prose",style:{marginBottom:10}},p.children);
}

// Etiqueta pequeña
function Tag(p){
  var c=p.c||C.mt;
  return e("span",{style:{fontSize:10,fontWeight:800,color:c,letterSpacing:1.8,textTransform:"uppercase",opacity:.85}},p.children);
}

// Caja de definición clara
function Def(p){
  var c=p.c||C.anx;
  return e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.1)+","+C.cd+" 90%)",border:"1px solid "+ax(c,.3),borderLeft:"4px solid "+c,borderRadius:10,margin:"8px 0 14px"}},
    e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}},"📖 Definición"),
    e("div",{className:"prose",style:{fontSize:14}},p.children)
  );
}

// Fila explícita de criterio DSM (estática, sin interactividad)
function Crit(p){
  var c=p.c||C.anx;
  return e("div",{style:{display:"flex",gap:12,padding:"11px 13px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:8,margin:"6px 0",alignItems:"flex-start"}},
    e("div",{style:{minWidth:34,height:34,borderRadius:7,background:ax(c,.18),color:c,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,border:"1px solid "+ax(c,.3)}},p.crit),
    e("div",{style:{fontSize:13.5,lineHeight:1.55,color:C.tx,flex:1,paddingTop:4}},p.children)
  );
}

// Bloque de criterios con título "Criterios DSM-5-TR"
function CritBlock(p){
  var c=p.c||C.anx;
  return e("div",{style:{margin:"10px 0 14px"}},
    e("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:8,padding:"8px 12px",background:ax(c,.12),border:"1px solid "+ax(c,.3),borderRadius:8}},
      e("div",{style:{fontSize:11,fontWeight:800,color:c,letterSpacing:1,textTransform:"uppercase"}},"📋 Criterios DSM-5-TR · "+(p.title||""))
    ),
    p.children
  );
}

// Lista de síntomas numerada
function SxList(p){
  var c=p.c||C.anx;
  return e("div",{style:{margin:"8px 0 14px"}},
    p.title?e("div",{style:{fontSize:11,fontWeight:800,color:c,letterSpacing:1,textTransform:"uppercase",marginBottom:8}},"🔸 "+p.title):null,
    e("ol",{style:{listStyle:"none",counterReset:"sx",margin:0,padding:0}},
      p.items.map(function(it,i){
        var text=typeof it==="string"?it:it.t;
        var note=typeof it==="object"?it.n:null;
        return e("li",{key:i,style:{counterIncrement:"sx",display:"flex",gap:10,padding:"9px 12px",background:C.cd,border:"1px solid "+C.bd,borderRadius:7,margin:"5px 0",alignItems:"flex-start"}},
          e("span",{style:{minWidth:22,height:22,borderRadius:5,background:ax(c,.2),color:c,fontWeight:800,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},i+1),
          e("div",{style:{flex:1,fontSize:13.5,lineHeight:1.5,color:C.tx}},
            text,
            note?e("div",{style:{fontSize:12,color:C.mt,marginTop:3,fontStyle:"italic"}},note):null
          )
        );
      })
    )
  );
}

// Nota / aclaración
function Note(p){
  var c=p.c||C.pearl;
  return e("div",{style:{padding:"11px 14px",background:ax(c,.08),border:"1px solid "+ax(c,.25),borderLeft:"3px solid "+c,borderRadius:8,margin:"8px 0",fontSize:13,lineHeight:1.5,color:C.tx}},
    p.t?e("b",{style:{color:c,marginRight:6}},p.t+":"):null,
    p.children
  );
}

// Alerta (para trampas de examen)
function Alert(p){
  var c=p.c||C.bad;
  return e("div",{style:{padding:"12px 14px",background:ax(c,.1),border:"1px solid "+ax(c,.35),borderLeft:"4px solid "+c,borderRadius:10,margin:"10px 0"}},
    e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:1.3,textTransform:"uppercase",marginBottom:5}},(p.label||"⚠️ Trampa de examen")),
    e("div",{style:{fontSize:13.5,lineHeight:1.55,color:C.tx}},p.children)
  );
}

// Tabla comparativa (HTML table nativa)
function Table(p){
  // p.headers = [{t, c}], p.rows = [[cell,cell,...]]
  return e("div",{style:{margin:"10px 0 14px",border:"1px solid "+C.bd,borderRadius:10,overflow:"hidden",overflowX:"auto"}},
    e("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:12.5,minWidth:500}},
      e("thead",null,
        e("tr",{style:{background:ax(C.anx,.12)}},
          p.headers.map(function(h,i){
            var c=h.c||C.anx;
            return e("th",{key:i,style:{padding:"10px 11px",textAlign:"left",fontSize:10.5,fontWeight:800,color:c,letterSpacing:.8,textTransform:"uppercase",borderBottom:"1px solid "+C.bd,borderRight:i<p.headers.length-1?"1px solid "+C.bd:"none",whiteSpace:"nowrap"}},h.t);
          })
        )
      ),
      e("tbody",null,
        p.rows.map(function(row,i){
          return e("tr",{key:i,style:{background:i%2===0?"transparent":ax(C.cd2,.5),borderBottom:i<p.rows.length-1?"1px solid "+C.bd:"none"}},
            row.map(function(cell,j){
              return e("td",{key:j,style:{padding:"9px 11px",color:C.tx,lineHeight:1.45,verticalAlign:"top",borderRight:j<row.length-1?"1px solid "+C.bd:"none",fontWeight:j===0?600:400}},cell);
            })
          );
        })
      )
    )
  );
}

// Resumen / perla
function Pearl(p){
  return e("div",{style:{padding:"12px 14px",background:"linear-gradient(135deg,"+ax(C.pearl,.1)+","+ax(C.pearl,.02)+")",border:"1px solid "+ax(C.pearl,.3),borderLeft:"4px solid "+C.pearl,borderRadius:9,margin:"7px 0",display:"flex",gap:10}},
    e("div",{style:{fontSize:20,flexShrink:0,lineHeight:1}},"📌"),
    e("div",{style:{flex:1}},
      p.t?e("div",{style:{fontSize:13,fontWeight:800,color:C.pearl,marginBottom:3}},p.t):null,
      e("div",{style:{fontSize:13.5,lineHeight:1.5,color:C.tx}},p.children)
    )
  );
}

// Tarjeta de trastorno — explícito con cabecera
function TrCard(p){
  var c=p.c||C.anx;
  return e("div",{style:{background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:11,padding:14,margin:"10px 0"}},
    e("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:8,paddingBottom:8,borderBottom:"1px solid "+C.bd}},
      e("div",{style:{fontWeight:800,fontSize:15,color:c,flex:1}},p.n),
      p.dur?e("div",{style:{fontSize:10.5,fontWeight:700,color:c,background:ax(c,.14),padding:"3px 8px",borderRadius:5,border:"1px solid "+ax(c,.3),letterSpacing:.3,whiteSpace:"nowrap"}},"⏱ "+p.dur):null
    ),
    e("div",{style:{fontSize:13.5,lineHeight:1.55,color:C.tx}},p.children)
  );
}


// ══════════════════════════════════════════════════════════════
// REGISTRY · Flashcards y Quiz indexados por tema · Para hubs globales
// ══════════════════════════════════════════════════════════════

var DECKS={
  anxiety:{
    meta:{name:"anxiety",label:"Ansiedad",icon:"🫀",color:C.anx},
    flash:[
         {q:"¿Cuándo la ansiedad se convierte en trastorno?",r:"Cuando es excesiva, sin causa real proporcional, persiste en el tiempo (generalmente ≥ 6 meses) e interfiere con el funcionamiento diario."},
         {q:"¿Cuál es la diferencia entre un ataque de pánico y el trastorno de pánico?",r:"El ataque de pánico es un episodio aislado (puede ocurrir en cualquier trastorno). El trastorno de pánico requiere ataques recurrentes inesperados con ≥ 1 mes de consecuencias psicológicas o conductuales."},
         {q:"¿Qué es el mutismo selectivo y cómo se diferencia de la timidez?",r:"Es la incapacidad de hablar en situaciones sociales específicas pese a poder hacerlo en otros contextos. La timidez es normal y no impide la comunicación; el mutismo selectivo sí lo hace de forma persistente (≥ 1 mes)."},
         {q:"¿Cuántos síntomas del ataque de pánico se requieren para diagnosticarlo?",r:"Al menos 4 de los 13 síntomas descritos en el DSM-5, de inicio abrupto y que alcanzan la máxima intensidad en minutos."},
         {q:"¿Por qué los pacientes con trastorno de pánico suelen consultar primero a cardiólogos, neumólogos y neurólogos?",r:"Porque los síntomas físicos (palpitaciones, disnea, dolor precordial, parestesias) son prominentes y simulan enfermedades orgánicas antes de que se identifique el origen ansioso."},
         {q:"¿Cuál es el rol del locus coeruleus en el trastorno de pánico?",r:"Es el centro de alarma del tronco encefálico, regulador de noradrenalina. En el trastorno de pánico está hipersensible, lo que facilita la activación del sistema de alerta ante estímulos mínimos."},
         {q:"¿Qué es la teoría de la 'falsa sofocación' en el trastorno de pánico?",r:"Una hipersensibilidad al CO₂: el cerebro interpreta erróneamente señales de asfixia → desencadena hiperventilación y pánico incluso sin peligro real."},
         {q:"¿Cuántos síntomas se requieren para el diagnóstico del TAG y durante cuánto tiempo?",r:"Al menos 3 de 6 síntomas (en adultos; 1 en niños) presentes la mayoría de los días por ≥ 6 meses."},
         {q:"¿Cuáles son los ISRS de primera línea para los trastornos de ansiedad?",r:"Fluoxetina, paroxetina y sertralina. Para el TAG se prefiere paroxetina o escitalopram."},
         {q:"¿Qué diferencia a la fobia específica de la fobia social?",r:"En la fobia específica el miedo se dirige a un objeto/situación concreta (animales, alturas). En la fobia social el miedo es al escrutinio y evaluación negativa por parte de otros en situaciones sociales."},
         {q:"¿Por qué se desaconseja el consumo de cafeína en el trastorno de pánico?",r:"La cafeína es un estimulante del SNC que puede desencadenar o intensificar ataques de pánico al activar el sistema adrenérgico."},
         {q:"¿Qué comorbilidades son más frecuentes en el trastorno de ansiedad generalizada?",r:"Depresión mayor y trastorno por uso de sustancias."},
         {q:"¿Cuál es la duración mínima recomendada del tratamiento farmacológico en el trastorno de pánico?",r:"Mínimo 1 año tras la remisión de los síntomas, para evitar recaídas."},
         {q:"¿Qué diferencia al TAG del trastorno de pánico?",r:"En el TAG la ansiedad es crónica, difusa y sobre múltiples temas. En el TP hay episodios agudos e inesperados de terror máximo con síntomas físicos intensos."},
         {q:"¿Cuántas situaciones de los 5 grupos deben temerse para diagnosticar agorafobia?",r:"Al menos 2 de las 5 situaciones (transporte público, espacios abiertos, lugares cerrados, multitudes, salir solo de casa)."}
       ],
    quiz:[
       {p:"Hombre de 28 años con 4 episodios en el último mes de palpitaciones súbitas, disnea, temblor y miedo a morir. Pico en 8 min, duración 25 min. Inicia a evitar el metro. TSH y ECG normales. ¿Dx más probable?",
        o:["TAG","Trastorno de pánico (+ agorafobia a codiagnosticar)","Fobia específica situacional","Hipertiroidismo subclínico"],r:1,
        x:"Crisis inesperadas recurrentes + >1 mes de cambio conductual (evitación del metro) → trastorno de pánico. La evitación activa de transporte público cumple agorafobia, que desde DSM-5 se codiagnostica de forma independiente."},
       {p:"Mujer de 35 años con 8 meses de preocupación excesiva por trabajo, hijos y dinero, con tensión muscular, fatiga, irritabilidad y sueño no reparador. TSH normal. ¿Tratamiento de primera línea?",
        o:["Clonazepam 1 mg BID crónico","Escitalopram 10 mg/día (titular a 20)","Propranolol 40 mg BID","Buspirona como monoterapia"],r:1,
        x:"TAG. Primera línea: ISRS o IRSN (escitalopram o sertralina, venlafaxina, duloxetina). BZD solo como puente corto. Buspirona es coadyuvante, no monoterapia habitual. Propranolol no tiene rol."},
       {p:"¿Tratamiento de elección para fobia específica a las arañas?",
        o:["Sertralina 100 mg/día","Exposición in vivo (TCC)","Clonazepam a demanda","Propranolol pre-exposición"],r:1,
        x:"Las fobias específicas NO tienen farmacoterapia de primera línea. El tratamiento de elección es la exposición in vivo (terapia cognitivo-conductual)."},
       {p:"Niña de 7 años se marea, se pone pálida y se desmaya cada vez que se le saca sangre. ¿Fobia y técnica de manejo?",
        o:["Situacional · respiración diafragmática","Sangre-inyección-daño · tensión aplicada","TAG · relajación muscular progresiva","Social · entrenamiento asertivo"],r:1,
        x:"Fobia SID = única con respuesta vasovagal bifásica (taquicardia → bradicardia → hipotensión → síncope). La tensión aplicada (tensar músculos grandes durante 15 s) eleva la PA y previene el síncope."},
       {p:"Paciente con pánico inicia sertralina 50 mg/día. A los 10 días refiere estar PEOR, con más crisis de pánico. ¿Conducta correcta?",
        o:["Suspender y cambiar a paroxetina","Explicar que es activación inicial esperable y eventualmente añadir BZD como puente corto","Subir a 200 mg/día ya","Cambiar a buspirona"],r:1,
        x:"Activación inicial: aumento de síntomas ansiosos en los primeros 7–14 días de ISRS, esperable en ansiosos. Por eso se recomienda iniciar a MITAD de dosis. Puente con BZD si es muy intensa. No es fracaso terapéutico."},
       {p:"Mujer de 45 con miedo intenso a hablar en reuniones de trabajo (casi se desmaya). No tiene problemas en situaciones sociales informales. ¿Opción con mejor relación costo-beneficio?",
        o:["Sertralina 100 mg/día crónica","Propranolol 20 mg tomado 45 min antes de cada reunión","Clonazepam crónico","Exposición in vivo sola"],r:1,
        x:"Fobia social tipo ACTUACIÓN (performance only). Propranolol a demanda 30–60 min antes es muy efectivo para este subtipo. ISRS se reserva para fobia social generalizada."}
     ]
  },
  psicosis:{
    meta:{name:"psicosis",label:"Psicosis",icon:"🔺",color:C.psi},
    flash:[
         {q:"¿Cuál es la diferencia fundamental entre psicosis y neurosis?",r:"La prueba de realidad. En psicosis hay PÉRDIDA del contacto con la realidad (alucinaciones, delirios). En neurosis se mantiene (ansiedad, depresión, obsesiones)."},
         {q:"¿Cómo se distinguen psicosis breve, esquizofreniforme y esquizofrenia?",r:"Solo por duración. Psicótico breve: ≥1 día pero <1 mes, con retorno al estado previo. Esquizofreniforme: ≥1 mes, <6 meses. Esquizofrenia: ≥6 meses. La clínica es la misma."},
         {q:"¿Cuál es la diferencia clave entre esquizoafectivo y trastorno del ánimo con psicosis?",r:"En esquizoafectivo debe haber ≥2 SEMANAS de delirios o alucinaciones SIN síntomas afectivos mayores a lo largo de la enfermedad. Si la psicosis aparece SOLO dentro del episodio afectivo, es trastorno bipolar/depresivo con psicosis, no esquizoafectivo."},
         {q:"¿Cuáles son los 2 subtipos del trastorno esquizoafectivo?",r:"Tipo bipolar (con episodios maníacos, con o sin depresión mayor) y tipo depresivo (solo con episodios depresivos mayores). El bipolar tiene mejor pronóstico."},
         {q:"¿Qué porcentaje del trastorno esquizofreniforme progresa a esquizofrenia?",r:"Aproximadamente dos tercios (~⅔). El pronóstico mejora con las características favorables: inicio rápido de síntomas prominentes, confusión/perplejidad, buen funcionamiento previo, ausencia de aplanamiento afectivo."},
         {q:"¿Cuántos síntomas se requieren para un episodio maníaco y durante cuánto tiempo?",r:"≥3 de 7 síntomas (≥4 si el ánimo es solo irritable) durante ≥1 semana. O cualquier duración si requiere hospitalización o hay psicosis."},
         {q:"¿Qué diferencia la hipomanía de la manía?",r:"Hipomanía: ≥4 días, sin deterioro marcado, sin psicosis, no requiere hospitalización. Manía: ≥1 semana, con deterioro o psicosis. Si hay psicosis, por definición es manía."},
         {q:"¿Cuál es la forma más grave de bipolaridad?",r:"Bipolar tipo I. Requiere solo un episodio maníaco (la depresión no es necesaria, aunque es frecuente)."},
         {q:"¿Cuál es el tratamiento de elección para la depresión bipolar?",r:"Lamotrigina (prevención), litio, quetiapina. Los antidepresivos solo se usan con estabilizador de base por riesgo de viraje maníaco."},
         {q:"¿Cuántos síntomas se requieren para el diagnóstico de depresión mayor y durante cuánto tiempo?",r:"≥5 de 10 síntomas durante ≥2 semanas, casi todos los días. Al menos uno debe ser ánimo deprimido o anhedonia."},
         {q:"¿Cuáles son los 5 tipos de trastorno delirante?",r:"Persecutorio (el más común · puede ser hostil), erotomaníaco, grandeza, celotípico (puede ser hostil) y somático."},
         {q:"¿Qué diferencia el delirante somático de la hipocondría?",r:"En el trastorno delirante somático, el delirio NO desaparece con pruebas médicas normales (la convicción es fija). En la hipocondría/IAD, la preocupación persiste pero puede haber dudas."},
         {q:"¿Qué tipo de esquizofrenia tiene peor pronóstico?",r:"La desorganizada (hebefrénica): comienzo precoz y grave, afecta las emociones."},
         {q:"¿Qué subtipo de esquizofrenia es el más frecuente?",r:"El paranoide: predominan los síntomas positivos, afecta el pensamiento, pronóstico favorable."},
         {q:"Menciona las 4 vías dopaminérgicas y qué pasa si fallan.",r:"Mesolímbica → síntomas positivos de esquizofrenia. Mesocortical → síntomas negativos. Nigroestriada → Parkinson/extrapiramidalismo. Tuberoinfundibular → hiperprolactinemia."},
         {q:"¿Cuáles son los síntomas positivos y negativos de la esquizofrenia?",r:"Positivos: alucinaciones, delirios, pensamiento desorganizado. Negativos: aplanamiento afectivo, abulia, anhedonia, alogia (↓ habla), aislamiento social."},
         {q:"¿Cuál es la duración mínima para diagnosticar esquizofrenia?",r:"≥1 mes de síntomas activos del criterio A (al menos uno debe ser delirio, alucinación o discurso desorganizado) + signos continuos del trastorno durante ≥6 meses."},
         {q:"¿Cuál es el único antipsicótico eficaz en esquizofrenia refractaria y qué riesgo tiene?",r:"Clozapina. Riesgo de agranulocitosis fatal. Requiere hemograma semanal los primeros 6 meses, luego mensual."},
         {q:"¿Cuáles son los factores de riesgo de suicidio en esquizofrenia?",r:"Sexo masculino, menor de 30 años, desempleo, depresión previa, antecedentes de abuso de sustancias, internación reciente."},
         {q:"¿Qué precipitantes pueden causar recaídas en bipolaridad?",r:"Mala adherencia al tratamiento, alteraciones del sueño (dormir mucho o poco), drogas y automedicación (café, THC, alcohol), mala medicación por diagnóstico incorrecto."}
       ],
    quiz:[
       {p:"Varón de 45 años convencido hace 8 meses de que su esposa lo engaña. Ha contratado detectives sin encontrar evidencia pero su convicción se mantiene. Trabaja normalmente, no hay alucinaciones ni otros síntomas. ¿Dx más probable?",
        o:["Esquizofrenia paranoide","Trastorno delirante celotípico","Bipolar I con síntomas psicóticos","Trastorno de personalidad paranoide"],r:1,
        x:"Delirio ≥1 mes + personalidad preservada + funcional + sin alucinaciones prominentes = trastorno delirante. El celotípico es uno de los subtipos hostiles."},
       {p:"Mujer de 26 años con 10 días de ánimo elevado, solo duerme 3 horas, habla sin parar, ha gastado $15,000 en compras compulsivas y dice tener 'un mensaje divino'. Requirió hospitalización. ¿Dx?",
        o:["Hipomanía en bipolar II","Episodio maníaco en bipolar I","Esquizofrenia paranoide","Trastorno ciclotímico"],r:1,
        x:"Duración >1 semana + deterioro marcado (compras, hospitalización) + síntomas psicóticos (mensaje divino) = episodio MANÍACO. La presencia de psicosis por definición hace que sea manía, no hipomanía. Esto clasifica el cuadro como bipolar I."},
       {p:"Varón de 30 años con 3 semanas de ánimo deprimido, anhedonia, insomnio, fatiga, pensamientos de muerte, pérdida de peso y sentimientos de inutilidad. Sin antecedentes de manía ni hipomanía. ¿Dx y primera línea?",
        o:["Distimia · psicoterapia","Trastorno depresivo mayor · ISRS + TCC","Ciclotimia · lamotrigina","Duelo complicado · apoyo"],r:1,
        x:"≥5 de 10 síntomas durante ≥2 semanas + anhedonia = depresión mayor. 1ª línea: ISRS (sertralina, escitalopram, fluoxetina) combinado con TCC."},
       {p:"Mujer de 22 años con alucinaciones auditivas, delirios de persecución, discurso desorganizado y aplanamiento afectivo durante los últimos 8 meses. Dejó los estudios y se aisló. ¿Dx?",
        o:["Psicosis breve","Esquizofrenia","Trastorno delirante","Episodio psicótico inducido por sustancias"],r:1,
        x:"≥2 síntomas del criterio A (alucinaciones, delirios, discurso desorganizado) + duración ≥6 meses + deterioro funcional marcado + síntomas negativos (aplanamiento) = esquizofrenia."},
       {p:"Paciente bipolar I sin respuesta a 2 antipsicóticos. Se considera clozapina. ¿Qué monitoreo es obligatorio?",
        o:["Función tiroidea mensual","Hemograma semanal los primeros 6 meses, luego mensual","ECG con QT cada 3 meses","Niveles plasmáticos quincenales"],r:1,
        x:"Clozapina tiene riesgo de AGRANULOCITOSIS fatal. Protocolo: hemograma semanal los primeros 6 meses, luego mensual mientras dure el tratamiento."},
       {p:"¿Cuál de las siguientes NO es una vía dopaminérgica afectada en esquizofrenia?",
        o:["Mesolímbica","Mesocortical","Nigroestriada","Tuberoinfundibular"],r:2,
        x:"La nigroestriada (sustancia nigra → cuerpo estriado) NO está afectada en esquizofrenia sino en Parkinson. Su bloqueo por antipsicóticos típicos causa extrapiramidalismo. Las vías afectadas en esquizofrenia son mesolímbica (síntomas positivos) y mesocortical (síntomas negativos)."}
     ]
  },
  toc:{
    meta:{name:"toc",label:"TOC",icon:"🔁",color:C.toc},
    flash:[
         {q:"¿Cuál es la diferencia entre obsesión y compulsión?",r:"Obsesión: pensamiento/imagen/impulso intrusivo recurrente que genera ansiedad. Compulsión: conducta o acto mental que el paciente realiza para reducir la ansiedad o prevenir un suceso temido."},
         {q:"¿Cuánto tiempo debe durar una obsesión/compulsión al día para diagnosticar TOC?",r:"Más de 1 hora al día, o que cause malestar o deterioro clínicamente significativo."},
         {q:"¿Cuáles son las 4 dimensiones clínicas del TOC?",r:"1) Contaminación + lavado, 2) Simetría/orden + 'just right', 3) Daño/responsabilidad + comprobación, 4) Contenido prohibido/tabú + actos mentales."},
         {q:"¿Cuál es la dosis de sertralina para TOC vs depresión?",r:"TOC: 150–200 mg/día. Depresión: 50–100 mg/día. El TOC requiere el DOBLE de dosis."},
         {q:"¿En cuánto tiempo se espera respuesta completa al ISRS en TOC?",r:"10–12 semanas (no 4–6 como en depresión). No cambies de fármaco antes si hay mejoría parcial a las 6 semanas."},
         {q:"¿Cuál es el gold standard psicoterapéutico del TOC?",r:"Exposición y Prevención de Respuesta (EPR): exposición gradual al disparador + impedir la compulsión. Equivalente o superior a fármacos aislados."},
         {q:"¿Qué es PANDAS?",r:"Pediatric Autoimmune Neuropsychiatric Disorders Associated with Streptococcus. TOC de inicio SÚBITO en niño post-faringitis estreptocócica. Tratamiento: antibiótico + manejo estándar del TOC."},
         {q:"¿Por qué NUNCA se debe autorizar cirugía cosmética en TDC?",r:"Empeora el cuadro: el cerebro reinterpreta el nuevo aspecto como otro defecto. Riesgo suicida 4× mayor en TDC — screening de suicidio obligatorio."},
         {q:"¿Cuál es el tratamiento de 1ª línea en tricotilomanía?",r:"Terapia de Reversión de Hábito (TRH). N-acetilcisteína 1200–2400 mg/día tiene buena evidencia. ISRS eficacia limitada."},
         {q:"¿Qué antipsicótico se prefiere para augmentar un ISRS en TOC con tics?",r:"Aripiprazol 5–15 mg/día. Risperidona 0.5–3 mg sin tics."},
         {q:"¿Cuánto tiempo se mantiene el tratamiento tras remisión del TOC?",r:"Mínimo 1–2 años tras remisión total. El riesgo de recaída es alto al suspender."},
         {q:"¿Cuál es la diferencia entre TDC y trastorno delirante somático?",r:"En TDC la creencia es sobre la APARIENCIA (defecto físico percibido). En el delirante somático la creencia es sobre ENFERMEDAD, defecto funcional o infestación."}
       ],
    quiz:[
       {p:"Paciente con TOC inicia sertralina 50 mg/día. A las 6 semanas refiere leve mejoría. ¿Conducta más apropiada?",
        o:["Cambiar a fluoxetina","Escalar a dosis altas (150–200 mg) y completar 10–12 semanas","Añadir clonazepam","Declarar refractario y pasar a clomipramina"],r:1,
        x:"TOC requiere dosis ALTAS (sertralina 150–200 mg en TOC vs 50–100 mg en depresión) y la respuesta completa tarda 10–12 semanas. No se cambia a las 6 semanas si hay mejoría; se escala la dosis y se espera."},
       {p:"¿Cuál es la psicoterapia de elección en TOC?",
        o:["TCC genérica","Exposición y Prevención de Respuesta (EPR)","Terapia psicodinámica","EMDR"],r:1,
        x:"EPR es el gold standard. Equivalente o superior a fármacos aislados; la combinación (ISRS + EPR) es lo óptimo."},
       {p:"Niño de 8 años previamente sano desarrolla SÚBITAMENTE rituales de lavado de manos 2 semanas después de faringitis estreptocócica. ¿Sospecha?",
        o:["TOC de inicio infantil clásico","PANDAS","Trastorno de adaptación","Encefalitis autoinmune anti-NMDA"],r:1,
        x:"PANDAS: TOC de inicio BRUSCO post-infección estreptocócica. Tratar la infección (antibiótico) + manejo estándar del TOC."},
       {p:"Varón de 22 años convencido de que su nariz es 'grotesca' (objetivamente normal). Pasa 4 h/día frente al espejo. Pide consulta con cirugía plástica. ¿Conducta?",
        o:["Derivarlo a cirugía plástica","Diagnosticar TDC · ISRS dosis altas + TCC · NO cirugía","Tranquilizarlo y alta","Iniciar antipsicótico por creencia delirante"],r:1,
        x:"TDC. La cirugía cosmética EMPEORA el cuadro. Tratamiento: ISRS dosis altas + TCC específica. Screening de suicidio obligatorio (riesgo ~4×)."},
       {p:"Paciente con TOC severo sin respuesta a 2 ISRS a dosis máximas ni a clomipramina. ¿Siguiente paso?",
        o:["Psicoterapia psicodinámica","Augmentación con risperidona 1–3 mg/día","BZD a dosis alta","Litio"],r:1,
        x:"Augmentación con antipsicótico atípico (risperidona o aripiprazol, este último si hay tics) es la 3ª línea. Refractarios verdaderos: EMT, ECT, DBS."},
       {p:"Mujer de 30 años se arranca pelos de cejas y pestañas desde hace 2 años, con alopecia visible. Refiere urgencia previa y alivio después. ¿Dx?",
        o:["TOC","Tricotilomanía","TDC","Trastorno de estereotipias motoras"],r:1,
        x:"Tricotilomanía. Tratamiento: Terapia de Reversión de Hábito (TRH) como primera línea. N-acetilcisteína 1200–2400 mg/d tiene evidencia. ISRS limitada."}
     ]
  },
  trauma:{
    meta:{name:"trauma",label:"Trauma",icon:"⚡",color:C.trm},
    flash:[
         {q:"¿Cuál es la duración mínima de síntomas para diagnosticar TEPT?",r:"≥1 mes desde el evento traumático. Si es de 3 días a 1 mes, el diagnóstico es trastorno de estrés agudo (TEA)."},
         {q:"¿Cuáles son los 4 grupos de síntomas del TEPT?",r:"B) Intrusión (≥1 de 5) — recuerdos, sueños, flashbacks, malestar ante claves, reacciones fisiológicas. C) Evitación (≥1 de 2). D) Alteraciones negativas de cognición/ánimo (≥2 de 7). E) Hiperactivación (≥2 de 6)."},
         {q:"¿Qué ISRS tienen aprobación FDA específica para TEPT?",r:"Sertralina y paroxetina. Son los únicos con indicación oficial. Venlafaxina XR es alternativa de primera línea."},
         {q:"¿Por qué están contraindicadas las BZD en TEPT?",r:"No tratan los síntomas nucleares, interfieren con el procesamiento del trauma en psicoterapia, empeoran la disociación y tienen alto riesgo de dependencia en esta población."},
         {q:"¿Para qué sirve la prazosina en TEPT y a qué dosis?",r:"Reduce pesadillas e hiperactivación nocturna. Antagonista α1-adrenérgico. Iniciar 1 mg nocturno, titular hasta 10 mg."},
         {q:"¿Qué es EMDR?",r:"Eye Movement Desensitization and Reprocessing. Psicoterapia basada en movimientos oculares bilaterales durante la evocación del recuerdo traumático. Eficacia equivalente a TCC centrada en trauma."},
         {q:"¿Cuál es la diferencia entre trastorno de adaptación y TEPT?",r:"El criterio A. TEPT requiere exposición a trauma estricto (muerte/lesión grave/violencia sexual). Adaptación: estresor identificable NO traumático (divorcio, desempleo, mudanza)."},
         {q:"¿Cuándo aparecen y resuelven los síntomas del trastorno de adaptación?",r:"Aparecen dentro de los 3 meses del estresor. Resuelven dentro de los 6 meses tras su cese (salvo que el estresor sea crónico)."},
         {q:"¿Cuál es la duración mínima para diagnosticar trastorno de duelo prolongado?",r:"≥12 meses tras la muerte en adultos. ≥6 meses en niños y adolescentes. Nuevo diagnóstico del DSM-5-TR (2022)."},
         {q:"¿En qué se diferencia el apego reactivo del desinhibido?",r:"Ambos por cuidado patogénico. Apego reactivo: niño INHIBIDO, no busca consuelo, no responde emocionalmente. Desinhibido: niño con conductas excesivamente familiares e indiscriminadas con adultos desconocidos."},
         {q:"¿Qué condiciones debe cumplir una muerte para contar como trauma en el criterio A?",r:"Si el paciente se enteró (no presenció), la muerte debe haber sido VIOLENTA O ACCIDENTAL. Una muerte esperada por cáncer, por ejemplo, no cumple criterio A."},
         {q:"¿Cuántos síntomas se necesitan para el TEA?",r:"≥9 síntomas de cualquier categoría (intrusión, ánimo negativo, disociación, evitación, activación), durante 3 días a 1 mes tras el trauma."},
         {q:"¿Cuál es la edad de presentación típica del trastorno de apego reactivo?",r:"Antes de los 5 años (criterio F). El niño debe tener edad de desarrollo ≥9 meses."},
         {q:"¿Qué especificador del TEPT se aplica si los criterios se cumplen tardíamente?",r:"Con expresión retardada: cuando los criterios completos no se cumplen hasta al menos 6 meses tras el evento traumático."}
       ],
    quiz:[
       {p:"Veterano de guerra con 3 meses de pesadillas sobre combate, evitación de multitudes, hipervigilancia y sueño fragmentado. ¿Fármaco ideal para las pesadillas?",
        o:["Diazepam 5 mg nocturno","Prazosina 1–10 mg nocturno","Quetiapina 100 mg","Zolpidem 10 mg"],r:1,
        x:"Prazosina (antagonista α1) reduce pesadillas e hiperactivación nocturna en TEPT. Las BZD están contraindicadas en TEPT."},
       {p:"Mujer 35 años, 2 meses tras accidente de tránsito grave: flashbacks, evita conducir, insomnio, hiperreactividad. TSH normal. ¿Dx y 1ª línea?",
        o:["TEA · BZD","TEPT · Sertralina + TCC-CT","Adaptación · apoyo","Trastorno de pánico · ISRS"],r:1,
        x:"Síntomas >1 mes + cumple criterio A (accidente con amenaza real) + 4 grupos de síntomas = TEPT. Sertralina (FDA) + TCC centrada en trauma."},
       {p:"Hombre 40 años, una semana tras robo con violencia: pesadillas, evitación, disociación, hiperreactividad. ¿Dx?",
        o:["TEPT","TEA (trastorno de estrés agudo)","Adaptación","Psicosis breve"],r:1,
        x:"Duración 3 días–1 mes tras trauma = TEA. Si persiste >1 mes pasa a TEPT."},
       {p:"Mujer divorciada hace 2 meses, ánimo bajo, llanto, irritabilidad, dificultad para funcionar. Sin antecedentes. ¿Dx más probable?",
        o:["TEPT","Depresión mayor","Trastorno de adaptación con ánimo deprimido","Duelo"],r:2,
        x:"Estresor NO traumático (divorcio) + síntomas <3 m tras inicio + no cumple otro trastorno = trastorno de adaptación. Subtipo con ánimo deprimido."},
       {p:"Mujer de 58 años, 14 meses tras muerte de esposo. Anhelo intenso persistente, evita cosas que lo recuerden, siente que la vida no tiene sentido, no ha podido volver a trabajar. ¿Dx?",
        o:["Duelo normal","Depresión mayor","Trastorno de duelo prolongado","TEPT"],r:2,
        x:"Duración ≥12 meses + anhelo persistente + ≥3 síntomas adicionales + deterioro = trastorno de duelo prolongado (DSM-5-TR). La depresión mayor tendría más autodevaluación no relacionada con la pérdida."},
       {p:"Niño de 4 años criado en orfanato hasta los 2 años. Adoptado hace 2. Muy retraído, no busca consuelo cuando se lastima, poca respuesta emocional, respuestas irritables aisladas. ¿Dx?",
        o:["TEA (autismo)","Trastorno de apego reactivo","Trastorno de relación social desinhibida","Trastorno de adaptación"],r:1,
        x:"Patrón inhibido + antecedente de cuidado patogénico (institución) + edad <5 años = trastorno de apego reactivo. El autismo tendría déficits sociales independientes del cuidado y comportamientos restringidos/repetitivos."}
     ]
  },
  somaticos:{
    meta:{name:"somaticos",label:"Somáticos",icon:"🧬",color:C.som},
    flash:[
         {q:"¿Cuál es la diferencia entre TSS e IAD?",r:"TSS: síntomas físicos REALES y angustiantes + respuesta psicológica desproporcionada. IAD (hipocondría): preocupación por enfermar con síntomas físicos AUSENTES o LEVES."},
         {q:"¿Qué es el signo de Hoover y qué indica?",r:"En una 'parálisis' conversiva de pierna: al pedir al paciente levantar la pierna SANA, se detecta contracción involuntaria (extensión) en la 'parética'. Es un signo POSITIVO de conversión (incompatibilidad con lesión)."},
         {q:"¿Cuál es la diferencia entre trastorno facticio y simulación?",r:"Ambos producen síntomas conscientemente. Facticio: motivación INTERNA (asumir rol de enfermo). Simulación: motivación EXTERNA (dinero, licencia, droga, evadir). Simulación no es trastorno mental."},
         {q:"¿Qué diferencia hay entre conversión, facticio y simulación?",r:"Conversión: síntomas INVOLUNTARIOS, el paciente no es consciente de producirlos. Facticio: CONSCIENTE, motivación interna. Simulación: CONSCIENTE, motivación externa clara."},
         {q:"¿Qué es el trastorno facticio impuesto a otro?",r:"Antes llamado Munchausen por poderes. Un cuidador produce o induce síntomas en un tercero (típicamente hijo). Es una forma de MALTRATO INFANTIL. Requiere protección del menor."},
         {q:"¿Cuál es la duración mínima para diagnosticar IAD?",r:"≥6 meses de preocupación por tener o adquirir una enfermedad grave."},
         {q:"¿Cuáles son los 3 tipos de amnesia disociativa?",r:"Localizada (más común: pérdida de un evento o periodo), selectiva (recuerdo parcial del evento) y generalizada (rara, pérdida total de memoria autobiográfica)."},
         {q:"¿Cómo se diferencia amnesia disociativa de amnesia orgánica (Korsakoff, TCE)?",r:"Disociativa: sin alteración de conciencia, sin confabulación, información RECUPERABLE con el tiempo. Orgánica: déficit de tiamina (Korsakoff), confabulación, déficits cognitivos asociados."},
         {q:"¿Qué es la fuga disociativa?",r:"Especificador de la amnesia disociativa: viaje o deambulación aparentemente intencionada + amnesia de identidad u otra información autobiográfica. El paciente puede asumir una nueva identidad temporal."},
         {q:"¿Cuál es el criterio clave del trastorno de despersonalización / desrealización?",r:"La prueba de realidad permanece INTACTA. El paciente sabe que es una sensación, no una realidad. Es el rasgo que distingue de la psicosis."},
         {q:"¿Cuál es el tratamiento base del TID?",r:"Psicoterapia trauma-informada en 3 fases: estabilización → procesamiento del trauma → integración. NO hay fármaco con indicación específica. ISRS para depresión/ansiedad, prazosina para pesadillas."},
         {q:"¿Por qué se debe evitar BZD en pacientes disociativos?",r:"Pueden empeorar la disociación y tienen alto riesgo de dependencia en esta población (alta comorbilidad con TEPT y uso de sustancias)."},
         {q:"¿Qué porcentaje de adultos sanos ha experimentado despersonalización transitoria?",r:"Aproximadamente 50%, especialmente en contextos de fatiga, estrés agudo, alcohol o cannabis. Solo es trastorno cuando es persistente/recurrente y causa malestar o deterioro."},
         {q:"¿Por qué se renombró 'histeria' a 'trastorno de conversión'?",r:"Porque 'histeria' era un término estigmatizante y culturalmente cargado. El DSM-5 lo renombró 'síntomas neurológicos funcionales' y el diagnóstico ahora se basa en signos positivos de incompatibilidad con lesión, no en la búsqueda de conflicto psicológico."}
       ],
    quiz:[
       {p:"Mujer 40 años, 3 años de múltiples síntomas (dolor abdominal, cefalea, fatiga, parestesias). Consulta a 8 médicos, exige exámenes. Síntomas reales pero pruebas normales o benignas. ¿Dx?",
        o:["Simulación","TSS (trastorno de síntomas somáticos)","IAD (ansiedad por enfermedad)","Facticio"],r:1,
        x:"Síntomas físicos reales + tiempo/energía/pensamientos excesivos + ≥6 meses = TSS. En IAD no habría síntomas físicos marcados."},
       {p:"Varón 30 años sin síntomas físicos relevantes, convencido de tener cáncer. Se palpa constantemente, se hace múltiples TAC. Pruebas normales. ¿Dx?",
        o:["TSS","Trastorno de ansiedad por enfermedad (IAD)","Trastorno delirante somático","TOC"],r:1,
        x:"Preocupación por enfermar con síntomas ausentes o leves + alta ansiedad + comportamientos excesivos + ≥6 meses = IAD. Reemplazó a 'hipocondría' en DSM-5."},
       {p:"Mujer 25 años con parálisis aguda de pierna tras discusión familiar. Al pedirle levantar la pierna sana, la 'parética' hace extensión. EMG normal. ¿Dx?",
        o:["ACV","Síndrome de Guillain-Barré","Trastorno de conversión","Simulación"],r:2,
        x:"Signo de Hoover positivo = incompatibilidad con lesión anatómica = conversión. No es simulación porque no hay ganancia externa identificable."},
       {p:"Enfermera de 35 años con múltiples hospitalizaciones por síntomas autoinducidos (inyectarse insulina sin ser diabética). No hay ganancia externa. ¿Dx?",
        o:["Trastorno de conversión","Trastorno facticio","Simulación","Síndrome de Cotard"],r:1,
        x:"Producción INTENCIONAL de síntomas + motivación INTERNA (rol de enfermo) + sin ganancia externa = facticio. Clásica presentación (Munchausen)."},
       {p:"Varón 28 años reporta no recordar los últimos 3 meses tras suicidio de su hermano. Conservado, orientado, sin lesión ni tóxicos. ¿Dx?",
        o:["Amnesia por TCE","Amnesia disociativa localizada","Demencia","Korsakoff"],r:1,
        x:"Fallo para recordar un periodo específico asociado a trauma/estrés, sin alteración de conciencia, sin lesión = amnesia disociativa localizada (la más común)."},
       {p:"¿Cuál es el tratamiento base del TID?",
        o:["Clozapina","Psicoterapia trauma-informada en 3 fases","ECT","Haloperidol"],r:1,
        x:"Psicoterapia trauma-informada (estabilización → procesamiento → integración). No hay fármaco específico. ISRS para comorbilidades, prazosina para pesadillas."}
     ]
  },
  tca:{
    meta:{name:"tca",label:"TCA",icon:"🍽️",color:C.tca},
    flash:[
         {q:"¿Cuál es el TCA con la mortalidad más alta de todos los trastornos psiquiátricos?",r:"Anorexia nerviosa. Mortalidad ~5–10% a 10 años. Causa: arritmias, desnutrición y suicidio."},
         {q:"¿Cuáles son los 2 subtipos de anorexia nerviosa?",r:"Restrictivo (sin atracones/purgas en 3 meses) y con atracones/purgas (vómito, laxantes, diuréticos, enemas en 3 meses)."},
         {q:"¿Qué es el signo de Russell y en qué cuadro aparece?",r:"Callosidades en el dorso de los nudillos por el contacto repetido con los dientes al inducir el vómito. Aparece en bulimia y en anorexia subtipo con purgas."},
         {q:"¿Cuál es la frecuencia mínima de atracones para diagnosticar bulimia?",r:"≥1 atracón + conducta compensatoria por semana durante al menos 3 meses. Misma frecuencia para trastorno por atracón (sin conducta compensatoria)."},
         {q:"¿Cuál es la dosis de fluoxetina para bulimia nerviosa y por qué es especial?",r:"60 mg/día. Es el ÚNICO ISRS con aprobación FDA específica para bulimia. Dosis MAYOR que en depresión (20 mg)."},
         {q:"¿Qué fármaco tiene aprobación FDA específica para el trastorno por atracón y a qué dosis?",r:"Lisdexanfetamina 50–70 mg/día en adultos. Único aprobado específicamente."},
         {q:"¿Por qué está contraindicado el bupropión en anorexia y bulimia?",r:"Reduce el umbral convulsivo. En pacientes con alteraciones electrolíticas por purgas, el riesgo de convulsiones aumenta significativamente."},
         {q:"¿Qué es el síndrome de realimentación y cómo se previene?",r:"Complicación al iniciar nutrición en paciente muy desnutrido: la insulina desplaza fosfato, potasio y magnesio al intracelular → arritmias, ICC, edema pulmonar. Prevención: tiamina 100–200 mg IV previa, iniciar a 20 kcal/kg/día, suplementar electrolitos, monitoreo diario de electrolitos x 7 días."},
         {q:"¿Cuáles son los umbrales de IMC para la gravedad de la anorexia en adultos?",r:"Leve ≥17 · Moderada 16–16.99 · Grave 15–15.99 · Extrema <15 kg/m²."},
         {q:"¿Qué diferencia ARFID de anorexia nerviosa?",r:"ARFID tiene evitación/restricción alimentaria SIN preocupación por la imagen corporal ni miedo a engordar. Comparte el bajo peso pero no la psicopatología central de la anorexia."},
         {q:"¿Qué diagnóstico se debe sospechar en una persona que come hielo compulsivamente?",r:"Pagofagia — fuertemente asociada a anemia ferropénica. Medir ferritina y hemograma. Suele mejorar al corregir el déficit de hierro."},
         {q:"¿Cuál es la psicoterapia de primera línea para anorexia nerviosa en adolescentes?",r:"Terapia familiar basada en Maudsley (TFB-M). Los padres son los 'agentes del cambio' al inicio del tratamiento, encargados de la realimentación."},
         {q:"¿Qué trastornos electrolítico-ácido-base son típicos del vómito autoinducido?",r:"Alcalosis metabólica hipoclorémica, con hipocalemia. Pérdida de HCl por el vómito."},
         {q:"¿Qué trastorno ácido-base es típico del abuso de laxantes?",r:"Acidosis metabólica hiperclorémica (pérdida de bicarbonato intestinal). También hipocalemia por pérdida de K+ en heces."}
       ],
    quiz:[
       {p:"Adolescente de 16 años, IMC 16 kg/m², amenorrea, lanugo, bradicardia, hipotensión. Restringe la comida, hace ejercicio 3 h/día, se ve 'gorda'. ¿Dx y terapia de 1ª línea?",
        o:["Anorexia nerviosa restrictiva · TCC individual","Anorexia nerviosa restrictiva · TFB-Maudsley","Bulimia nerviosa · fluoxetina 60 mg","ARFID · exposición gradual"],r:1,
        x:"AN restrictiva en adolescente. 1ª línea: Terapia Familiar Basada en Maudsley (TFB-M). Los padres actúan como agentes del cambio en la realimentación."},
       {p:"Mujer 22 años, peso normal (IMC 23), atracones 3 veces/sem + vómito autoprovocado x 5 meses. Callosidades en nudillos, erosión dental. K+ 2.8 mEq/L. ¿Dx y fármaco de 1ª línea?",
        o:["Anorexia nerviosa con purgas · olanzapina","Bulimia nerviosa · fluoxetina 60 mg","Trastorno por atracón · lisdexanfetamina","Rumiación · biofeedback"],r:1,
        x:"Peso normal + atracones + purgas ≥1 sem x 3 meses = BN. Signo de Russell + erosión dental. Fluoxetina 60 mg es el ÚNICO ISRS con aprobación FDA para BN. Corregir hipocalemia es prioridad aguda."},
       {p:"Hombre 35 años, IMC 35, atracones 2 veces/sem x 6 meses sin conductas compensatorias, gran culpa tras comer. ¿Fármaco de 1ª línea?",
        o:["Sertralina 100 mg","Lisdexanfetamina 50–70 mg","Fluoxetina 60 mg","Bupropión 300 mg"],r:1,
        x:"Trastorno por atracón. Lisdexanfetamina es el único fármaco con aprobación FDA específica para TpA. Bupropión NUNCA en cuadros con purgas o restricciones."},
       {p:"Paciente con AN severa (IMC 13) inicia realimentación. A las 48 h aparece edema, taquicardia, debilidad. P 1.2 mg/dL, K+ 2.5. ¿Qué pasó?",
        o:["Sepsis","Síndrome de realimentación","Hipertiroidismo","Pancreatitis"],r:1,
        x:"Clásico síndrome de realimentación: insulina ↑ desplaza P, K, Mg al intracelular → hipofosfatemia, hipocalemia, riesgo de arritmias e ICC. Prevenir con 20 kcal/kg/día inicial + tiamina + suplementos electrolíticos + monitoreo diario."},
       {p:"Niño de 5 años con espectro autista que solo acepta 4 alimentos específicos, vomita con otros por su textura. Pérdida de peso. No le preocupa su imagen corporal. ¿Dx?",
        o:["Anorexia infantil","ARFID","Pica","Rumiación"],r:1,
        x:"ARFID subtipo sensorial: evitación basada en textura/olor/sabor, sin distorsión de imagen corporal. Muy frecuente en niños con espectro autista."},
       {p:"Mujer embarazada con anemia ferropénica refiere comer hielo compulsivamente. ¿Dx y manejo?",
        o:["Pica · corregir deficiencia de hierro","Bulimia · fluoxetina","TOC · ISRS","Trastorno delirante · antipsicótico"],r:0,
        x:"Pagofagia (comer hielo) es una forma de pica fuertemente asociada a ferropenia. Suele resolver con la corrección del déficit de hierro."}
     ]
  },
  sueno:{
    meta:{name:"sueno",label:"Sueño",icon:"🌙",color:C.sue},
    flash:[
         {q:"¿Cuál es el tratamiento de primera línea del trastorno de insomnio?",r:"Terapia cognitivo-conductual para el insomnio (TCC-I). Superior o equivalente a fármacos a largo plazo. Incluye higiene del sueño, control de estímulos, restricción de sueño y reestructuración cognitiva."},
         {q:"¿Cuáles son los componentes de la tétrada clásica de narcolepsia?",r:"1) Ataques de sueño, 2) cataplejía (pérdida súbita bilateral del tono muscular desencadenada por emoción), 3) alucinaciones hipnagógicas/hipnopómpicas, 4) parálisis del sueño."},
         {q:"¿Cuál es el gold standard de tratamiento para la cataplejía en narcolepsia?",r:"Oxibato de sodio. Alternativas: pitolisant, venlafaxina, atomoxetina, clomipramina."},
         {q:"¿Cuál es el neurotransmisor deficiente en narcolepsia tipo 1 y la asociación HLA?",r:"Deficiencia de orexina (hipocretina) por pérdida autoinmune de neuronas hipotalámicas. Asociación con HLA-DQB1*06:02. Hipocretina en LCR disminuida o indetectable."},
         {q:"¿Cuál es el tratamiento de 1ª línea para la apnea obstructiva del sueño moderada-grave?",r:"CPAP nasal. Gold standard. Reduce somnolencia, HTA y eventos cardiovasculares."},
         {q:"¿Por qué se deben evitar BZD y opioides en AOS?",r:"Deprimen la ventilación y empeoran las apneas. Son contraindicación relativa."},
         {q:"¿Qué parámetro de laboratorio es clave investigar en el síndrome de piernas inquietas?",r:"Ferritina. Si es <75 ng/mL, suplementar con hierro oral o IV mejora significativamente el cuadro."},
         {q:"¿Qué es el fenómeno de aumentación en SPI?",r:"Efecto paradójico de los agonistas dopaminérgicos: con el tiempo, el tratamiento empeora el SPI (síntomas aparecen antes, son más intensos, se extienden a otras partes del cuerpo). Por eso gabapentinoides son ahora 1ª línea farmacológica."},
         {q:"¿En qué fase del sueño y momento de la noche ocurren las parasomnias NREM?",r:"En sueño N3 (ondas lentas), en la PRIMERA mitad de la noche. Ejemplos: sonambulismo y terror nocturno. Hay amnesia del episodio."},
         {q:"¿En qué fase del sueño y momento ocurren las pesadillas?",r:"En sueño REM, en la SEGUNDA mitad de la noche. El paciente despierta completamente orientado y recuerda el sueño con detalle."},
         {q:"¿Cómo diferencias un terror nocturno de una pesadilla?",r:"Terror nocturno: N3, 1ª mitad, amnesia, sin relato del sueño. Pesadilla: REM, 2ª mitad, recuerdo vívido del sueño, despertar orientado."},
         {q:"¿Cuál es el tratamiento de 1ª línea para pesadillas, especialmente si hay TEPT comórbido?",r:"Terapia de ensayo por imágenes (IRT). En TEPT: prazosina 1–10 mg nocturnos, antagonista α1-adrenérgico."},
         {q:"¿Qué enfermedades neurodegenerativas predice el trastorno de conducta del sueño REM (TCSR)?",r:"Sinucleinopatías: Parkinson, demencia con cuerpos de Lewy, atrofia multisistémica. ~80% desarrolla una en 10–15 años."},
         {q:"¿Cuál es el tratamiento de 1ª línea del TCSR?",r:"Clonazepam 0.25–2 mg nocturno o melatonina 3–12 mg nocturno (preferida en adultos mayores). Seguridad del entorno es clave."},
         {q:"¿Cuál es el manejo del jet-lag?",r:"Melatonina 0.5–3 mg al horario de destino + fototerapia. Ajuste gradual en viajes largos."}
       ],
    quiz:[
       {p:"Mujer 38 años, 5 meses con dificultad para conciliar el sueño y despertares nocturnos, 4 noches/semana. Fatiga diurna. TSH normal. ¿Tratamiento 1ª línea?",
        o:["Zolpidem 10 mg nocturno crónico","TCC para insomnio","Clonazepam 1 mg","Quetiapina 25 mg"],r:1,
        x:"TCC-I es 1ª línea para trastorno de insomnio. Superior o equivalente a fármacos a largo plazo y sin los riesgos de dependencia. Los fármacos son puente corto."},
       {p:"Hombre 22 años con ataques irresistibles de sueño durante el día, con episodios de debilidad al reírse. ¿Dx y manejo cataplejía?",
        o:["Hipersomnia · modafinilo","Narcolepsia · oxibato de sodio para cataplejía","AOS · CPAP","TCSR · clonazepam"],r:1,
        x:"Narcolepsia tipo 1 con cataplejía. Oxibato de sodio es el gold standard para cataplejía. Modafinilo para la somnolencia diurna."},
       {p:"Hombre 55 años, obeso, con ronquidos fuertes y pausas respiratorias presenciadas, somnolencia diurna (Epworth 15). PSG: IAH 28. ¿Manejo?",
        o:["Zolpidem nocturno","CPAP nasal + pérdida de peso","Modafinilo solo","Agonistas dopaminérgicos"],r:1,
        x:"AOS moderada-grave. CPAP es gold standard. Asociar pérdida de peso y evitar alcohol y BZD (deprimen ventilación)."},
       {p:"Mujer 60 años refiere urgencia de mover piernas con hormigueo, peor de noche, mejora con movimiento. Ferritina 45 ng/mL. ¿Primer paso?",
        o:["Pramipexol","Suplementación con hierro","Gabapentina enacarbil","Clonazepam"],r:1,
        x:"SPI + ferritina <75 ng/mL → suplementación con hierro es primer paso. Si persiste con ferritina corregida, gabapentinoides son 1ª línea farmacológica (evitar aumentación de agonistas dopa)."},
       {p:"Niño de 7 años con episodios 2h tras dormirse: se sienta, grita, suda, no responde a padres, no recuerda al día siguiente. ¿Dx?",
        o:["Pesadillas","Terror nocturno","Epilepsia nocturna","Narcolepsia"],r:1,
        x:"Terror nocturno: parasomnia NREM (N3) en 1ª mitad de la noche, con amnesia del episodio. Diferente de pesadilla (REM, 2ª mitad, con recuerdo)."},
       {p:"Hombre 65 años grita y patea durante el sueño, le pega a su esposa. Recuerda sueños de persecución. ¿Dx y riesgo futuro?",
        o:["Sonambulismo · bajo riesgo","TCSR · alto riesgo de Parkinson/DLB","Terror nocturno · benigno","SPI · neuropatía"],r:1,
        x:"TCSR: actúa sueños durante REM por pérdida de atonía. ~80% desarrolla sinucleinopatía (Parkinson, DLB, MSA) en 10–15 años. Tratar con clonazepam o melatonina + seguimiento neurológico."}
     ]
  },
  personalidad:{
    meta:{name:"personalidad",label:"Personalidad",icon:"🎭",color:C.per},
    flash:[
         {q:"¿Cuáles son los 3 clusters de trastornos de personalidad?",r:"A (raros/excéntricos): paranoide, esquizoide, esquizotípica. B (dramáticos/emocionales): antisocial, límite, histriónica, narcisista. C (ansiosos/temerosos): evitativa, dependiente, obsesivo-compulsiva."},
         {q:"¿Cuál es el tratamiento de primera línea para el trastorno límite de personalidad?",r:"DBT (terapia dialéctica conductual) de Marsha Linehan. Incluye: mindfulness, regulación emocional, tolerancia al malestar y efectividad interpersonal."},
         {q:"¿Cuál es la diferencia entre TOCP y TOC?",r:"TOCP: rasgo de personalidad EGO-SINTÓNICO (la persona cree que su perfeccionismo es correcto y bueno). TOC: obsesiones y compulsiones EGO-DISTÓNICAS (la persona sabe que son absurdas y quiere librarse)."},
         {q:"¿Qué antecedente es necesario para diagnosticar trastorno antisocial de personalidad?",r:"Evidencia de trastorno de la conducta antes de los 15 años. Sin este antecedente, no puede diagnosticarse. Además, el paciente debe tener ≥18 años."},
         {q:"¿Cómo se diferencia el trastorno esquizoide del esquizotípico?",r:"Esquizoide: desapego e indiferencia, prefiere la soledad. Esquizotípica: además, tiene distorsiones cognitivas/perceptivas y excentricidad (pensamiento mágico, ideas de referencia)."},
         {q:"¿Cómo se diferencia el trastorno evitativo del esquizoide?",r:"Evitativa: DESEA relaciones pero las evita por miedo al rechazo. Esquizoide: NO DESEA relaciones, prefiere estar solo."},
         {q:"¿Qué es la 'escisión' en el TLP?",r:"Mecanismo defensivo nuclear del TLP: alternancia entre idealización ('eres perfecto') y devaluación ('eres horrible') del mismo objeto. Genera relaciones interpersonales inestables e intensas."},
         {q:"¿Cuáles son los 9 criterios del TLP (DSM-5)?",r:"1) Esfuerzos por evitar abandono, 2) relaciones inestables con escisión, 3) alteración de identidad, 4) impulsividad en ≥2 áreas, 5) conductas suicidas/autolesivas, 6) inestabilidad afectiva, 7) vacío crónico, 8) ira intensa, 9) ideación paranoide o disociación transitorias. Se requieren ≥5 de 9."},
         {q:"¿Cuál es la tasa de suicidio consumado en el TLP?",r:"Aproximadamente 10%. Alto riesgo — el screening suicida y el manejo de crisis son claves."},
         {q:"¿Qué porcentaje de pacientes con TLP tiene antecedentes de trauma infantil?",r:"Aproximadamente 70%. Abuso sexual, físico o negligencia. No es 'causa única' pero es factor de riesgo central."},
         {q:"¿Qué fármacos se pueden usar sintomáticamente en TLP?",r:"Estabilizadores (lamotrigina, valproato) para inestabilidad afectiva e impulsividad. Antipsicóticos atípicos bajos (aripiprazol, quetiapina) para ideación paranoide y agresividad. ISRS para depresión comórbida. EVITAR BZD (desinhibición + adicción)."},
         {q:"¿Cuál es el núcleo del trastorno narcisista de personalidad?",r:"Grandiosidad + necesidad de admiración + falta de empatía. Sentido de privilegio, explotación interpersonal, arrogancia."},
         {q:"¿Qué caracteriza al trastorno histriónico de personalidad?",r:"Emotividad excesiva y búsqueda de atención. Necesita ser el centro. Comportamiento seductor, expresión emocional superficial y cambiante, sugestionabilidad."},
         {q:"¿Qué caracteriza al trastorno dependiente de personalidad?",r:"Necesidad excesiva de ser cuidado, conducta sumisa y pegadiza, miedo a la separación. Dificultad para tomar decisiones sin tranquilización, dificultad para estar solo, busca urgentemente una nueva relación cuando una termina."},
         {q:"¿Por qué un cambio súbito de personalidad en un adulto debe alertar sobre causa orgánica?",r:"Los trastornos de personalidad inician en adolescencia o adultez temprana y son estables. Un cambio abrupto en adulto sugiere causa orgánica: tumor frontal, demencia, infección del SNC, enfermedad médica o sustancia."}
       ],
    quiz:[
       {p:"Mujer 24 años con múltiples relaciones intensas que duran semanas, alterna entre idealizar y odiar a sus parejas, autolesiones superficiales repetidas, impulsividad en compras y sexo, sensación crónica de vacío. ¿Dx y terapia 1ª línea?",
        o:["Bipolar II · litio","TLP · DBT","Histriónica · TCC","Depresión mayor · ISRS"],r:1,
        x:"TLP clásico: escisión, autolesiones, impulsividad, vacío crónico. DBT (Linehan) es terapia de elección. Diferenciar de bipolar II por la inestabilidad afectiva de horas (reactiva) vs episodios de días-semanas."},
       {p:"Hombre 32 años con múltiples arrestos, no mantiene trabajo, miente sistemáticamente, sin remordimiento. Antecedente de vandalismo y conductas agresivas desde los 12 años. ¿Dx?",
        o:["Trastorno explosivo intermitente","Trastorno antisocial de personalidad","Trastorno narcisista","Trastorno límite"],r:1,
        x:"Transgresión persistente de derechos ajenos + antecedente de trastorno de conducta antes de los 15 años + edad ≥18 = antisocial. Sin el antecedente antes de los 15, no se diagnostica."},
       {p:"Varón 45 años, ingeniero, muy perfeccionista, trabaja 70h/semana, no delega, guarda todo, rígido moralmente. CREE que es lo correcto y necesario. No hay obsesiones ni compulsiones específicas. ¿Dx?",
        o:["TOC","TOCP (trastorno obsesivo-compulsivo de personalidad)","Narcisista","Ansiedad generalizada"],r:1,
        x:"TOCP: rasgo de personalidad ego-sintónico de perfeccionismo y rigidez. Sin obsesiones ni compulsiones específicas. El paciente cree que su forma de ser es correcta (a diferencia del TOC donde la persona sabe que sus síntomas son absurdos)."},
       {p:"Mujer 28 años con sentimientos persistentes de inadecuación, muy tímida, rechaza trabajos con trato a público, desea relaciones pero no las inicia por miedo al rechazo. ¿Dx más probable?",
        o:["Fobia social","Esquizoide","Evitativa","TAG"],r:2,
        x:"Patrón pervasivo de inhibición social + sentimientos de inadecuación + DESEA relaciones pero evita por miedo al rechazo = evitativa. Diferencia con esquizoide (no desea) y fobia social (puede ser más circunscrita)."},
       {p:"Hombre 50 años con desconfianza generalizada, cree que colegas le conspiran, guarda rencores, hipersensible a la crítica. NO hay delirios fijos ni alucinaciones. Funciona en el trabajo pero es conflictivo. ¿Dx?",
        o:["Trastorno delirante persecutorio","Personalidad paranoide","Esquizofrenia paranoide","Personalidad esquizotípica"],r:1,
        x:"Desconfianza y suspicacia pervasivas SIN delirios fijos ni alucinaciones = personalidad paranoide. El trastorno delirante requiere creencia delirante específica ≥1 mes. La esquizofrenia requiere síntomas positivos."},
       {p:"Paciente con TLP severo. Se considera añadir fármaco sintomático. Presenta alta impulsividad e inestabilidad afectiva. ¿Mejor opción?",
        o:["BZD crónica","Lamotrigina o valproato","Paroxetina a dosis altas","Olanzapina 20 mg"],r:1,
        x:"Estabilizadores del ánimo (lamotrigina, valproato) tienen mejor evidencia para impulsividad e inestabilidad afectiva en TLP. BZD CONTRAINDICADA por desinhibición y adicción. Antipsicóticos para ideación paranoide o agresividad marcada."}
     ]
  },
  impulsos:{
    meta:{name:"impulsos",label:"Impulsos",icon:"🎯",color:C.imp},
    flash:[
         {q:"¿Qué antecedente se necesita para diagnosticar trastorno antisocial en un adulto?",r:"Evidencia de trastorno de la conducta antes de los 15 años. Sin este antecedente, no se diagnostica antisocial en ≥18 años."},
         {q:"¿Cuáles son las 4 categorías de síntomas del trastorno de la conducta?",r:"1) Agresión a personas/animales, 2) destrucción de propiedad, 3) engaño o robo, 4) violaciones graves de normas. Se requieren ≥3 síntomas en últimos 12 meses, ≥1 en últimos 6."},
         {q:"¿Cómo se diferencia el trastorno negativista desafiante del trastorno de la conducta?",r:"Negativista: enfado, desafío, vengatividad — sin violación grave de derechos. Conducta: agresión, destrucción, robo, violaciones graves de normas sociales."},
         {q:"¿Cuáles son los dos patrones (A1 y A2) del trastorno explosivo intermitente?",r:"A1: Arrebatos de baja intensidad (verbales o físicos sin daño) ≥2 veces/semana × ≥3 meses. A2: Arrebatos de alta intensidad (daño a propiedad o lesión física) ≥3 en últimos 12 meses. Basta uno."},
         {q:"¿Cuáles son los criterios de piromanía?",r:"A) Incendios deliberados ≥1 ocasión. B) Tensión previa. C) Fascinación/atracción por el fuego. D) Placer al prenderlo o presenciarlo. E) NO por motivación económica/vengativa/ideológica/ocultar delito/respuesta a delirio. F) No explicado por CC, manía o antisocial."},
         {q:"¿Qué caracteriza a la cleptomanía?",r:"Impulso recurrente de robar objetos que NO son necesarios para uso personal ni por valor económico. Tensión previa + placer/alivio al robar. No es por rabia, venganza, delirios. ~3:1 mujeres."},
         {q:"¿Cuál es el tratamiento de 1ª línea del trastorno negativista desafiante?",r:"Parent Management Training (PMT) — terapia conductual con los padres, que aprenden reforzamiento positivo, consecuencias consistentes y manejo de límites. Terapia familiar. Tratar comorbilidades (TDAH muy frecuente)."},
         {q:"¿Qué fármacos tienen evidencia en trastorno explosivo intermitente?",r:"ISRS (fluoxetina con mejor evidencia). Estabilizadores del ánimo (valproato, litio). Antipsicóticos atípicos en casos graves. TCC con manejo de ira es 1ª línea."},
         {q:"¿Qué es el especificador 'con emociones prosociales limitadas' (callous-unemotional)?",r:"Especificador del trastorno de la conducta: rasgos de falta de remordimiento, poca empatía, afecto superficial, despreocupación por el rendimiento. Predice peor pronóstico y mayor riesgo de antisocial adulto."},
         {q:"¿Por qué un robo motivado por necesidad económica no es cleptomanía?",r:"La cleptomanía requiere que los objetos robados NO sean necesarios ni tengan valor económico para el paciente. Si hay motivación económica, es robo común (no trastorno mental)."},
         {q:"¿Qué fármacos pueden ayudar en cleptomanía?",r:"ISRS (fluoxetina) y naltrexona (antagonista opioide que modula sistema de recompensa). Ambos con evidencia moderada. TCC con desensibilización encubierta es 1ª línea."},
         {q:"¿Cuál es la comorbilidad más frecuente del trastorno negativista desafiante?",r:"TDAH (alrededor del 40%). Tratar el TDAH con estimulantes frecuentemente mejora también el negativismo."}
       ],
    quiz:[
       {p:"Niño de 9 años que pierde la calma fácilmente, discute con maestros y padres, se molesta deliberadamente a sus hermanos. No hay agresión física, no hay robos. Desde hace 8 meses. ¿Dx?",
        o:["Trastorno de la conducta","Trastorno negativista desafiante","TDAH","Trastorno explosivo intermitente"],r:1,
        x:"Patrón de enfado/desafío ≥6 meses sin violación grave de derechos = negativista desafiante. Conducta requiere agresión, destrucción, robo o violaciones graves."},
       {p:"Varón de 19 años con arrebatos explosivos con daño a propiedad varias veces al año, desproporcionados al estímulo, sin planeación, se arrepiente después. No patrón antisocial. ¿Dx?",
        o:["Trastorno antisocial","TEI (trastorno explosivo intermitente)","Trastorno bipolar","Conducta"],r:1,
        x:"Arrebatos IMPULSIVOS y desproporcionados (patrón A2: ≥3 con daño en 12m) sin premeditación ni patrón pervasivo = TEI. Antisocial tiene conducta planeada y sin remordimiento."},
       {p:"Niño de 14 años: peleas, robó en tiendas 3 veces, mintió repetidamente, incendió basurero, escaparse de casa. Inicio hace 2 años. ¿Dx?",
        o:["Trastorno negativista","Trastorno de la conducta","Antisocial (está en tiempo)","Trastorno bipolar I"],r:1,
        x:"≥3 síntomas de las 4 categorías (agresión, destrucción, engaño/robo, violaciones graves) en ≥12 meses en menor de 18 años = trastorno de la conducta. Antisocial solo se diagnostica ≥18 años con CC previo."},
       {p:"Mujer 30 años con múltiples episodios de robar cosmética que no necesita (los regala después). Sensación de tensión previa + alivio al robarlos. Sin antisocial ni manía. ¿Dx y tratamiento?",
        o:["Antisocial · no hay manejo","Cleptomanía · TCC + ISRS/naltrexona","TEI · fluoxetina","Trastorno de la conducta · terapia multisistémica"],r:1,
        x:"Robo impulsivo de objetos sin valor para el paciente + tensión/alivio + sin motivación económica/rabia = cleptomanía. TCC con desensibilización + ISRS o naltrexona."},
       {p:"Varón de 16 años incendia escuela tras reprobar. Se benefició (no tuvo que dar examen). ¿Dx?",
        o:["Piromanía","Trastorno de la conducta","TEI","Antisocial (edad)"],r:1,
        x:"Incendio con motivación instrumental (evadir examen) = NO piromanía. Entra en trastorno de la conducta (destrucción de propiedad). Piromanía requiere fascinación pura por el fuego, sin motivación instrumental."},
       {p:"Paciente con TEI severo sin respuesta inicial a TCC. ¿Opción farmacológica con mejor evidencia?",
        o:["BZD diaria","Fluoxetina","Quetiapina sola","Paroxetina a dosis bajas"],r:1,
        x:"Fluoxetina (ISRS) tiene la mejor evidencia en TEI. Valproato y litio como estabilizadores también son opciones. Antipsicóticos atípicos en casos muy graves."}
     ]
  },
  depresivos:{
    meta:{name:"depresivos",label:"Depresivos",icon:"💧",color:C.dpr},
    flash:[
         {q:"¿Cuál es la duración mínima de síntomas para diagnosticar un episodio depresivo mayor?",r:"Dos semanas con ≥5 de 9 síntomas, al menos uno siendo ánimo depresivo o anhedonia."},
         {q:"¿Qué significa la nemotecnia SIGECAPS?",r:"Los 9 síntomas del TDM: Sleep (sueño), Interest (interés/anhedonia), Guilt (culpa), Energy (energía), Concentration (concentración), Appetite (apetito), Psychomotor (psicomotor), Suicide (ideación suicida), más el ánimo bajo como ancla."},
         {q:"¿Cuál es el tratamiento de 1ª línea farmacológico del TDM?",r:"ISRS (sertralina, escitalopram, fluoxetina) + psicoterapia (TCC o TIP). Si falla: optimizar dosis, cambiar a otro ISRS/IRSN o atípico, aumentar (litio, T3, antipsicótico atípico)."},
         {q:"¿Cuánto tarda un ISRS en hacer efecto?",r:"Respuesta inicial en 2–4 semanas, efecto completo en 6–8 semanas. No cambiar antes de 4–6 semanas."},
         {q:"¿Cuánto debe durar el tratamiento antidepresivo tras la remisión?",r:"Primer episodio: 6–9 meses tras remisión. Dos o más episodios o episodio grave/psicótico: 2 años o indefinido."},
         {q:"¿Cuál es la duración mínima del trastorno depresivo persistente (distimia)?",r:"≥2 años en adultos, ≥1 año en niños/adolescentes (donde puede presentarse como irritabilidad). No más de 2 meses sin síntomas durante ese periodo."},
         {q:"¿Qué es la 'depresión doble'?",r:"Paciente con distimia crónica que además desarrolla episodios depresivos mayores superpuestos. Peor pronóstico."},
         {q:"¿Cuáles son los 4 síntomas afectivos nucleares del TDPM?",r:"1) Labilidad afectiva marcada, 2) irritabilidad o conflictos interpersonales, 3) ánimo deprimido/desesperanza, 4) ansiedad/tensión. Se requiere ≥1 de estos + totales ≥5 síntomas."},
         {q:"¿Cómo se confirma el diagnóstico de TDPM?",r:"Con registro diario PROSPECTIVO durante ≥2 ciclos sintomáticos. Los síntomas deben mejorar tras el inicio del sangrado y estar ausentes/mínimos en la semana posmenstrual."},
         {q:"¿Cuál es la edad mínima y máxima para diagnosticar TDDD?",r:"Mínimo 6 años, máximo 18 años. Inicio de síntomas antes de los 10 años es criterio obligatorio."},
         {q:"¿Por qué se creó el diagnóstico de TDDD?",r:"Para reducir el sobre-diagnóstico de trastorno bipolar pediátrico. Niños con irritabilidad crónica sin episodios maníacos discretos entran aquí, no en bipolar, evitando uso inapropiado de estabilizadores del ánimo."},
         {q:"¿Cuándo está indicada la TEC en depresión?",r:"Riesgo suicida agudo, depresión psicótica, catatonia, embarazo (1er trimestre especialmente), refractaria a múltiples fármacos, rechazo alimentario severo."},
         {q:"¿Qué ISRS se prefiere en embarazo y cuál evitar?",r:"Preferir sertralina. EVITAR paroxetina (asociada a defectos cardíacos)."},
         {q:"¿Qué fármaco tiene efecto rápido en depresión con suicidalidad aguda?",r:"Ketamina IV o esketamina intranasal (efecto en horas-días). Alternativa urgente junto con TEC."},
         {q:"¿En qué pacientes NO debe usarse bupropión?",r:"Antecedente de convulsiones, TCA activo con purgas (↓ umbral convulsivo), abstinencia aguda de alcohol o BZD. También no es ideal para ansiedad marcada."}
       ],
    quiz:[
       {p:"Mujer 35 años con 3 semanas de ánimo bajo, anhedonia, insomnio, fatiga, culpa y pensamientos de muerte. Sin episodios previos de manía. ¿Dx y 1ª línea?",
        o:["Distimia · TCC","TDM · ISRS + TCC","Bipolar I depresivo · quetiapina","Duelo · esperar"],r:1,
        x:"Episodio depresivo mayor (≥5 síntomas, ≥2 semanas, con ánimo bajo y anhedonia). Sin historia de manía → TDM, no bipolar. 1ª línea: ISRS + psicoterapia."},
       {p:"Paciente con TDM refractario a 2 ensayos de ISRS y 1 de IRSN. Actualmente con riesgo suicida alto y rechazo alimentario. ¿Mejor opción?",
        o:["Tercer ISRS","IMAO","TEC","Tricíclico"],r:2,
        x:"TEC está indicada en depresión refractaria + riesgo suicida agudo + rechazo alimentario. Efecto rápido, gold standard en estas situaciones."},
       {p:"Mujer 28 años con ánimo bajo persistente, fatiga, baja autoestima y desesperanza los últimos 3 años, sin periodos libres de síntomas mayores a un mes. No cumple criterios de episodio depresivo mayor. ¿Dx?",
        o:["TDM recurrente","Trastorno depresivo persistente (distimia)","Bipolar II","Adaptación"],r:1,
        x:"≥2 años de ánimo depresivo + ≥2 síntomas (fatiga, baja autoestima, desesperanza) sin periodos libres >2 meses = distimia."},
       {p:"Mujer 30 años con 1 año de irritabilidad severa, ansiedad y labilidad emocional los 7 días previos a su menstruación, que desaparece tras el sangrado. Registro diario en 2 ciclos confirma el patrón. ¿Dx y 1ª línea?",
        o:["TDM con patrón estacional · fototerapia","TDPM · ISRS (continuo o luteal)","Ansiedad generalizada · sertralina","Distimia · TCC"],r:1,
        x:"TDPM: síntomas severos cíclicos premenstruales + mejoría tras sangrado + confirmación prospectiva en ≥2 ciclos. ISRS es 1ª línea, puede usarse continuo o solo en fase luteal."},
       {p:"Niño de 8 años con rabietas severas 4 veces/semana, ánimo irritable persistente entre rabietas, en casa y escuela, durante 14 meses. Inicio a los 7 años. Sin episodios maníacos. ¿Dx?",
        o:["Trastorno bipolar pediátrico","Trastorno de desregulación disruptiva del ánimo (TDDD)","Trastorno negativista desafiante","TDAH"],r:1,
        x:"TDDD: rabietas severas ≥3/sem + irritabilidad crónica entre rabietas + ≥12 meses + ≥2 contextos + edad 6–18 con inicio antes de los 10. Se creó específicamente para evitar diagnosticar bipolar pediátrico en estos casos."},
       {p:"Paciente en tratamiento con ISRS 4 semanas, parcial mejoría pero disfunción sexual importante lo hace considerar abandonar. ¿Mejor opción?",
        o:["Agregar BZD","Cambiar a bupropión","Aumentar dosis del ISRS","Suspender todo antidepresivo"],r:1,
        x:"Bupropión es la mejor alternativa porque NO produce disfunción sexual (actúa sobre dopamina/noradrenalina, no serotonina). Mirtazapina es otra alternativa con bajo riesgo sexual."}
     ]
  }
};

// Agrupaciones por rama (psicosis vs neurosis)
var DECK_GROUPS={
  neurosis:["anxiety","toc","trauma","somaticos","tca","sueno","personalidad","impulsos","depresivos"],
  psicosis:["psicosis"],
  all:["psicosis","anxiety","toc","trauma","somaticos","tca"]
};

// Flashcards de estudio · tarjeta con pregunta, toca para voltear y ver respuesta
// Soporta añadir/editar/eliminar tarjetas del usuario con persistencia en localStorage
function FlashDeck(p){
  var c=p.c||C.anx;
  var storageKey=p.storageKey||("flashcards_"+(p.deckId||"default"));

  // Cargar tarjetas del usuario desde localStorage
  function loadUserCards(){
    try{
      var raw=window.localStorage.getItem(storageKey);
      if(!raw)return [];
      var parsed=JSON.parse(raw);
      if(!Array.isArray(parsed))return [];
      return parsed.filter(function(x){return x&&x.q&&x.r;});
    }catch(err){return [];}
  }
  function saveUserCards(cards){
    try{window.localStorage.setItem(storageKey,JSON.stringify(cards));}catch(err){}
  }

  var s0=useState(loadUserCards());var userCards=s0[0],setUserCards=s0[1];
  var s1=useState(0);var ix=s1[0],setIx=s1[1];
  var s2=useState(false);var revealed=s2[0],setRevealed=s2[1];
  var s3=useState(false);var editorOpen=s3[0],setEditorOpen=s3[1];
  var s4=useState(null);var editingIdx=s4[0],setEditingIdx=s4[1];
  var s5=useState("");var qDraft=s5[0],setQDraft=s5[1];
  var s6=useState("");var rDraft=s6[0],setRDraft=s6[1];

  // Tarjetas combinadas: oficiales + del usuario (marcadas)
  var officialCards=p.items.map(function(x){return {q:x.q,r:x.r,own:false};});
  var myCards=userCards.map(function(x){return {q:x.q,r:x.r,own:true};});
  var allCards=officialCards.concat(myCards);
  var total=allCards.length;
  var card=allCards[ix]||{q:"",r:"",own:false};

  function next(){if(ix+1<total){setIx(ix+1);setRevealed(false);}}
  function prev(){if(ix>0){setIx(ix-1);setRevealed(false);}}
  function toggle(){setRevealed(!revealed);}

  function openNew(){setEditingIdx(null);setQDraft("");setRDraft("");setEditorOpen(true);}
  function openEdit(userIdx){
    var cd=userCards[userIdx];if(!cd)return;
    setEditingIdx(userIdx);setQDraft(cd.q);setRDraft(cd.r);setEditorOpen(true);
  }
  function save(){
    var q=qDraft.trim(),r=rDraft.trim();
    if(!q||!r)return;
    var nextCards=userCards.slice();
    if(editingIdx===null){nextCards.push({q:q,r:r});}
    else{nextCards[editingIdx]={q:q,r:r};}
    setUserCards(nextCards);saveUserCards(nextCards);
    setEditorOpen(false);
    if(editingIdx===null){setIx(officialCards.length+nextCards.length-1);setRevealed(false);}
  }
  function del(){
    if(editingIdx===null)return;
    var nextCards=userCards.slice();nextCards.splice(editingIdx,1);
    setUserCards(nextCards);saveUserCards(nextCards);
    setEditorOpen(false);
    if(ix>=officialCards.length+nextCards.length){setIx(Math.max(0,officialCards.length+nextCards.length-1));}
    setRevealed(false);
  }

  if(total===0){
    return e("div",{style:{padding:20,textAlign:"center",color:C.mt}},
      e("div",{style:{fontSize:32,marginBottom:8}},"🃏"),
      e("div",{style:{fontSize:13,marginBottom:14}},"Aún no hay tarjetas. Crea la primera."),
      e("button",{onClick:openNew,style:{padding:"10px 20px",background:c,color:"#fff",border:"none",borderRadius:9,fontWeight:800,fontSize:13,cursor:"pointer"}},"➕ Crear flashcard")
    );
  }

  return e("div",null,
    // Barra de progreso
    e("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:14}},
      e("div",{style:{flex:1,height:6,background:C.bd,borderRadius:99}},
        e("div",{style:{height:"100%",width:((ix+1)/total*100)+"%",background:c,borderRadius:99,transition:"width .3s"}})
      ),
      e("span",{style:{fontSize:11.5,color:C.mt,fontWeight:700,minWidth:50,textAlign:"right"}},(ix+1)+" / "+total)
    ),
    // Tarjeta
    e("div",{style:{position:"relative"}},
      e("button",{onClick:toggle,style:{width:"100%",minHeight:220,padding:"26px 20px",background:revealed?"linear-gradient(135deg,"+ax(c,.14)+","+C.cd+" 90%)":C.cd,border:"1px solid "+(revealed?ax(c,.4):C.bd),borderLeft:"4px solid "+c,borderRadius:14,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:12,animation:"fadeIn .25s",transition:"all .2s"}},
        e("div",{style:{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}},
          e("div",{style:{fontSize:10,fontWeight:800,color:c,letterSpacing:1.8,textTransform:"uppercase",padding:"3px 9px",background:ax(c,.15),borderRadius:5,border:"1px solid "+ax(c,.3)}},revealed?"✓ Respuesta":"❓ Pregunta"),
          card.own?e("div",{style:{fontSize:9.5,fontWeight:800,color:C.pearl,letterSpacing:1.3,textTransform:"uppercase",padding:"3px 8px",background:ax(C.pearl,.15),borderRadius:5,border:"1px solid "+ax(C.pearl,.3)}},"✦ Mía"):null,
          e("div",{style:{flex:1,textAlign:"right",fontSize:10.5,color:C.mt,fontStyle:"italic"}},"Toca para "+(revealed?"volver":"revelar"))
        ),
        e("div",{style:{flex:1,fontSize:15.5,lineHeight:1.5,color:"#fff",fontWeight:revealed?400:600,paddingTop:4}},revealed?card.r:card.q)
      ),
      // Botón editar (solo en tarjetas mías)
      card.own?e("button",{onClick:function(){openEdit(ix-officialCards.length);},style:{position:"absolute",top:10,right:10,padding:"5px 9px",background:ax(C.pearl,.2),border:"1px solid "+ax(C.pearl,.4),color:C.pearl,borderRadius:7,fontSize:10.5,fontWeight:700,cursor:"pointer"}},"✎ Editar"):null
    ),
    // Controles
    e("div",{style:{display:"flex",gap:8,marginTop:12,alignItems:"center"}},
      e("button",{onClick:prev,disabled:ix===0,style:{padding:"10px 14px",background:ix===0?C.cd:ax(c,.15),border:"1px solid "+(ix===0?C.bd:ax(c,.35)),color:ix===0?C.dm:c,borderRadius:9,fontWeight:700,fontSize:13,cursor:ix===0?"not-allowed":"pointer",opacity:ix===0?.5:1}},"←"),
      e("button",{onClick:toggle,style:{flex:1,padding:"10px 16px",background:revealed?ax(c,.12):c,border:"1px solid "+(revealed?ax(c,.35):c),color:revealed?c:"#fff",borderRadius:9,fontWeight:800,fontSize:13,cursor:"pointer"}},revealed?"🔙 Ocultar":"👁 Revelar"),
      e("button",{onClick:next,disabled:ix+1>=total,style:{padding:"10px 14px",background:ix+1>=total?C.cd:c,border:"1px solid "+(ix+1>=total?C.bd:c),color:ix+1>=total?C.dm:"#fff",borderRadius:9,fontWeight:700,fontSize:13,cursor:ix+1>=total?"not-allowed":"pointer",opacity:ix+1>=total?.5:1}},"→")
    ),
    // Añadir nueva
    e("button",{onClick:openNew,style:{width:"100%",padding:"11px 14px",background:"linear-gradient(135deg,"+ax(C.pearl,.12)+","+C.cd+")",border:"1px dashed "+ax(C.pearl,.5),color:C.pearl,borderRadius:10,fontSize:13,fontWeight:700,marginTop:12,cursor:"pointer"}},"➕ Añadir mi flashcard"),
    // Navegación directa por número
    e("div",{style:{display:"flex",flexWrap:"wrap",gap:5,marginTop:16,paddingTop:12,borderTop:"1px solid "+C.bd}},
      e("div",{style:{fontSize:10,fontWeight:800,color:c,letterSpacing:1.5,textTransform:"uppercase",width:"100%",marginBottom:6}},"Saltar a pregunta:"),
      allCards.map(function(it,i){
        var isMine=it.own;
        return e("button",{key:i,onClick:function(){setIx(i);setRevealed(false);},style:{width:28,height:28,borderRadius:6,background:i===ix?c:(isMine?ax(C.pearl,.12):ax(c,.1)),border:"1px solid "+(i===ix?c:(isMine?ax(C.pearl,.35):ax(c,.25))),color:i===ix?"#fff":(isMine?C.pearl:c),fontSize:11,fontWeight:700,cursor:"pointer"}},i+1);
      })
    ),
    // Leyenda
    userCards.length>0?e("div",{style:{marginTop:10,fontSize:11,color:C.mt,lineHeight:1.5}},
      e("b",{style:{color:C.pearl}},"✦ Amarillas:")," tus flashcards (",userCards.length,") · Se guardan en este dispositivo."
    ):null,
    // Editor modal
    editorOpen?e("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(6,10,20,.85)",backdropFilter:"blur(8px)",zIndex:150,display:"flex",alignItems:"center",justifyContent:"center",padding:14,animation:"fadeIn .15s"}},
      e("div",{style:{background:C.cd,border:"1px solid "+ax(C.pearl,.4),borderLeft:"4px solid "+C.pearl,borderRadius:14,padding:18,maxWidth:500,width:"100%",maxHeight:"90vh",overflowY:"auto"}},
        e("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:14}},
          e("div",{style:{fontSize:20}},"✦"),
          e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",fontFamily:"Playfair Display",flex:1}},editingIdx===null?"Nueva flashcard":"Editar flashcard"),
          e("button",{onClick:function(){setEditorOpen(false);},style:{padding:"5px 9px",background:C.bd,border:"1px solid "+C.bd2,color:C.mt,borderRadius:7,fontSize:11,fontWeight:700,cursor:"pointer"}},"✕")
        ),
        e("label",{style:{display:"block",fontSize:10.5,fontWeight:800,color:C.pearl,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}},"❓ Pregunta"),
        e("textarea",{value:qDraft,onChange:function(ev){setQDraft(ev.target.value);},placeholder:"Ej: ¿Cuál es el tratamiento de elección para...?",rows:3,style:{width:"100%",padding:"10px 12px",background:C.bg,border:"1px solid "+C.bd,borderRadius:8,color:C.tx,fontSize:14,fontFamily:"inherit",marginBottom:14,resize:"vertical",minHeight:70}}),
        e("label",{style:{display:"block",fontSize:10.5,fontWeight:800,color:C.pearl,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}},"✓ Respuesta"),
        e("textarea",{value:rDraft,onChange:function(ev){setRDraft(ev.target.value);},placeholder:"Ej: ISRS a dosis altas + TCC con EPR.",rows:4,style:{width:"100%",padding:"10px 12px",background:C.bg,border:"1px solid "+C.bd,borderRadius:8,color:C.tx,fontSize:14,fontFamily:"inherit",marginBottom:14,resize:"vertical",minHeight:90}}),
        e("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},
          e("button",{onClick:save,disabled:!qDraft.trim()||!rDraft.trim(),style:{flex:1,minWidth:120,padding:"10px 16px",background:(!qDraft.trim()||!rDraft.trim())?C.bd:C.pearl,color:(!qDraft.trim()||!rDraft.trim())?C.dm:"#fff",border:"none",borderRadius:9,fontWeight:800,fontSize:13,cursor:(!qDraft.trim()||!rDraft.trim())?"not-allowed":"pointer"}},editingIdx===null?"💾 Guardar":"💾 Actualizar"),
          editingIdx!==null?e("button",{onClick:del,style:{padding:"10px 14px",background:ax(C.bad,.15),border:"1px solid "+ax(C.bad,.4),color:C.bad,borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}},"🗑 Eliminar"):null,
          e("button",{onClick:function(){setEditorOpen(false);},style:{padding:"10px 14px",background:C.bd,border:"1px solid "+C.bd2,color:C.mt,borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}},"Cancelar")
        ),
        e("div",{style:{marginTop:12,fontSize:11,color:C.mt,lineHeight:1.5,fontStyle:"italic"}},"💡 Tus flashcards se guardan en este dispositivo. Si borras el navegador o cambias de dispositivo, se perderán.")
      )
    ):null
  );
}

// Quiz — útil, no decorativo
function Quiz(p){
  var s1=useState(0);var ix=s1[0],setIx=s1[1];
  var s2=useState(null);var pick=s2[0],setPick=s2[1];
  var s3=useState(0);var score=s3[0],setScore=s3[1];
  var s4=useState(false);var done=s4[0],setDone=s4[1];
  var c=p.c||C.anx;
  var q=p.items[ix];
  function sel(i){if(pick!==null)return;setPick(i);if(i===q.r)setScore(score+1);}
  function next(){if(ix+1>=p.items.length){setDone(true);return;}setIx(ix+1);setPick(null);}
  function reset(){setIx(0);setPick(null);setScore(0);setDone(false);}

  if(done){
    var pct=Math.round(score/p.items.length*100);
    var msg=pct>=80?"🏆 Dominas el tema":pct>=60?"💪 Bien, repasa lo fallado":"📚 Toca releer";
    return e("div",{style:{padding:24,background:"linear-gradient(135deg,"+ax(c,.15)+","+ax(c,.04)+")",border:"1px solid "+ax(c,.4),borderRadius:14,textAlign:"center"}},
      e("div",{style:{fontSize:42,marginBottom:8}},pct>=80?"🏆":pct>=60?"💪":"📚"),
      e("div",{style:{fontFamily:"Playfair Display",fontSize:28,fontWeight:900,color:c,marginBottom:4}},score+" / "+p.items.length),
      e("div",{style:{fontSize:13,color:C.mt,marginBottom:18}},msg),
      e("button",{onClick:reset,style:{padding:"10px 22px",background:c,color:"#fff",border:"none",borderRadius:9,fontWeight:700,fontSize:13,letterSpacing:.3}},"🔄 Reintentar")
    );
  }
  return e("div",null,
    e("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:12}},
      e("div",{style:{flex:1,height:5,background:C.bd,borderRadius:99}},
        e("div",{style:{height:"100%",width:((ix+1)/p.items.length*100)+"%",background:c,borderRadius:99,transition:"width .3s"}})
      ),
      e("span",{style:{fontSize:11,color:C.mt,fontWeight:700}},(ix+1)+"/"+p.items.length)
    ),
    e("div",{style:{padding:15,background:C.cd,border:"1px solid "+C.bd,borderRadius:11,marginBottom:10}},
      e("div",{style:{fontSize:10,fontWeight:800,color:c,letterSpacing:1.3,textTransform:"uppercase",marginBottom:7}},"Caso clínico"),
      e("div",{style:{fontSize:14,lineHeight:1.55,color:C.tx,fontWeight:500}},q.p)
    ),
    q.o.map(function(op,i){
      var isPick=pick===i,isRight=i===q.r;
      var bg=C.cd,bd=C.bd;
      if(pick!==null){
        if(isRight){bg=ax(C.ok,.15);bd=C.ok;}
        else if(isPick){bg=ax(C.bad,.15);bd=C.bad;}
      }
      return e("button",{key:i,onClick:function(){sel(i);},disabled:pick!==null,style:{width:"100%",padding:"11px 13px",background:bg,border:"1px solid "+bd,borderRadius:9,margin:"5px 0",textAlign:"left",fontSize:13.5,color:C.tx,lineHeight:1.45,cursor:pick===null?"pointer":"default",display:"flex",gap:10,alignItems:"flex-start"}},
        e("div",{style:{minWidth:24,height:24,borderRadius:6,background:pick!==null?(isRight?C.ok:(isPick?C.bad:C.bd)):C.bd,color:pick!==null&&(isRight||isPick)?"#fff":C.mt,fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},
          pick!==null?(isRight?"✓":(isPick?"✗":String.fromCharCode(65+i))):String.fromCharCode(65+i)),
        e("div",{style:{flex:1}},op)
      );
    }),
    pick!==null?e("div",{style:{marginTop:10,padding:13,background:ax(c,.08),border:"1px solid "+ax(c,.3),borderLeft:"4px solid "+c,borderRadius:9,animation:"fadeIn .25s"}},
      e("div",{style:{fontSize:10,fontWeight:800,color:c,letterSpacing:1,marginBottom:5,textTransform:"uppercase"}},pick===q.r?"✓ Correcto":"✗ Explicación"),
      e("div",{style:{fontSize:13,lineHeight:1.55,color:C.tx}},q.x),
      e("button",{onClick:next,style:{marginTop:11,padding:"8px 18px",background:c,color:"#fff",border:"none",borderRadius:7,fontWeight:700,fontSize:12.5}},ix+1>=p.items.length?"Ver resultado":"Siguiente →")
    ):null
  );
}

// ══════════════════════════════════════════════════════════════
// HUBS GLOBALES · Flashcards y Quiz con filtros por tema
// ══════════════════════════════════════════════════════════════

// FlashDeck global con filtros · usa DECKS + DECK_GROUPS
function GlobalFlashDeck(p){
  var group=p.group;
  var groupColor=group==="psicosis"?C.psi:(group==="all"?C.pearl:C.anx);
  var allDecks=group==="all"?(DECK_GROUPS.psicosis.concat(DECK_GROUPS.neurosis)):DECK_GROUPS[group];
  var storageKey="flashcards_global_"+group;

  // Cargar tarjetas globales del usuario
  function loadMine(){
    try{
      var raw=window.localStorage.getItem(storageKey);
      if(!raw)return [];
      var parsed=JSON.parse(raw);
      if(!Array.isArray(parsed))return [];
      return parsed.filter(function(x){return x&&x.q&&x.r;});
    }catch(err){return [];}
  }
  function saveMine(arr){
    try{window.localStorage.setItem(storageKey,JSON.stringify(arr));}catch(err){}
  }

  var s1=useState(loadMine());var mine=s1[0],setMine=s1[1];
  var s2=useState(allDecks.slice());var activeThemes=s2[0],setActiveThemes=s2[1];
  var s3=useState("");var search=s3[0],setSearch=s3[1];
  var s4=useState("all");var origin=s4[0],setOrigin=s4[1];
  var s5=useState("card");var viewMode=s5[0],setViewMode=s5[1];
  var s6=useState(0);var ix=s6[0],setIx=s6[1];
  var s7=useState(false);var revealed=s7[0],setRevealed=s7[1];
  var s8=useState(false);var showAllAns=s8[0],setShowAllAns=s8[1];
  var s9=useState(false);var editorOpen=s9[0],setEditorOpen=s9[1];
  var s10=useState(null);var editingIdx=s10[0],setEditingIdx=s10[1];
  var s11=useState("");var qDraft=s11[0],setQDraft=s11[1];
  var s12=useState("");var rDraft=s12[0],setRDraft=s12[1];
  var s13=useState(allDecks[0]);var themeDraft=s13[0],setThemeDraft=s13[1];

  // Construir el pool filtrado
  var officialCards=[];
  allDecks.forEach(function(dk){
    var meta=DECKS[dk].meta;
    getAllCards(dk).forEach(function(card){
      officialCards.push({q:card.q,r:card.r,source:dk,meta:meta,own:false});
    });
  });
  var myCards=mine.map(function(x){
    var src=(x.source&&DECKS[x.source])?x.source:allDecks[0];
    return {q:x.q,r:x.r,source:src,meta:DECKS[src].meta,own:true,_mineIdx:mine.indexOf(x)};
  });

  var pool=[];
  if(origin==="all"||origin==="official")pool=pool.concat(officialCards);
  if(origin==="all"||origin==="mine")pool=pool.concat(myCards);

  var searchLow=search.toLowerCase();
  var filtered=pool.filter(function(cd){
    if(activeThemes.indexOf(cd.source)<0)return false;
    if(searchLow){
      var inQ=cd.q.toLowerCase().indexOf(searchLow)>=0;
      var inR=cd.r.toLowerCase().indexOf(searchLow)>=0;
      if(!inQ && !inR)return false;
    }
    return true;
  });

  // Clamp ix si el pool filtrado cambia
  if(ix>=filtered.length && filtered.length>0){ix=filtered.length-1;}
  var card=filtered[ix];

  function toggleTheme(dk){
    var next=activeThemes.slice();
    var i=next.indexOf(dk);
    if(i<0)next.push(dk);
    else next.splice(i,1);
    setActiveThemes(next);
    setIx(0);setRevealed(false);
  }
  function selectAll(){setActiveThemes(allDecks.slice());setIx(0);setRevealed(false);}
  function clearAll(){setActiveThemes([]);setIx(0);setRevealed(false);}
  function next(){if(ix+1<filtered.length){setIx(ix+1);setRevealed(false);}}
  function prev(){if(ix>0){setIx(ix-1);setRevealed(false);}}
  function toggle(){setRevealed(!revealed);}

  function openNew(){setEditingIdx(null);setQDraft("");setRDraft("");setThemeDraft(allDecks[0]);setEditorOpen(true);}
  function openEdit(mineIdx){
    var cd=mine[mineIdx];if(!cd)return;
    setEditingIdx(mineIdx);setQDraft(cd.q);setRDraft(cd.r);setThemeDraft(cd.source||allDecks[0]);setEditorOpen(true);
  }
  function save(){
    var q=qDraft.trim(),r=rDraft.trim();
    if(!q||!r)return;
    var nextArr=mine.slice();
    var entry={q:q,r:r,source:themeDraft};
    if(editingIdx===null)nextArr.push(entry);
    else nextArr[editingIdx]=entry;
    setMine(nextArr);saveMine(nextArr);
    setEditorOpen(false);
  }
  function del(){
    if(editingIdx===null)return;
    var nextArr=mine.slice();nextArr.splice(editingIdx,1);
    setMine(nextArr);saveMine(nextArr);
    setEditorOpen(false);
  }

  var hasFilter=activeThemes.length<allDecks.length || origin!=="all" || search.length>0;

  return e("div",null,
    // ====== BARRA DE FILTROS ======
    e("div",{style:{padding:"12px 12px 14px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+groupColor,borderRadius:12,marginBottom:14}},
      // Origen: oficiales / mías / todas
      e("div",{style:{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}},
        [["all","Todas"],["official","Oficiales"],["mine","Mías"]].map(function(o){
          var active=origin===o[0];
          return e("button",{key:o[0],onClick:function(){setOrigin(o[0]);setIx(0);setRevealed(false);},style:{padding:"6px 10px",fontSize:11.5,fontWeight:700,background:active?groupColor:ax(groupColor,.1),color:active?"#fff":groupColor,border:"1px solid "+(active?groupColor:ax(groupColor,.3)),borderRadius:7,cursor:"pointer"}},o[1]);
        })
      ),
      // Buscador
      e("input",{type:"text",value:search,onChange:function(ev){setSearch(ev.target.value);setIx(0);setRevealed(false);},placeholder:"🔎 Buscar en la pregunta o respuesta...",style:{width:"100%",padding:"8px 11px",background:C.bg,border:"1px solid "+C.bd,borderRadius:8,color:C.tx,fontSize:13,fontFamily:"inherit",marginBottom:10,boxSizing:"border-box"}}),
      // Chips de temas
      e("div",{style:{fontSize:10,fontWeight:800,color:groupColor,letterSpacing:1.4,textTransform:"uppercase",marginBottom:6}},"Temas · toca para filtrar"),
      e("div",{style:{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}},
        allDecks.map(function(dk){
          var meta=DECKS[dk].meta;
          var count=getAllCards(dk).length;
          var active=activeThemes.indexOf(dk)>=0;
          return e("button",{key:dk,onClick:function(){toggleTheme(dk);},style:{padding:"6px 10px",fontSize:11,fontWeight:700,background:active?ax(meta.color,.18):ax(meta.color,.04),color:active?meta.color:ax(meta.color,.6),border:"1px solid "+(active?meta.color:ax(meta.color,.25)),borderRadius:20,cursor:"pointer",display:"flex",alignItems:"center",gap:5}},
            e("span",{style:{opacity:active?1:.5}},meta.icon),
            e("span",null,meta.label),
            e("span",{style:{opacity:.7,fontWeight:600}},"("+count+")")
          );
        })
      ),
      // Acciones rápidas
      e("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},
        e("button",{onClick:selectAll,style:{padding:"5px 9px",fontSize:10.5,fontWeight:700,background:"transparent",color:C.mt,border:"1px solid "+C.bd,borderRadius:6,cursor:"pointer"}},"✓ Todos"),
        e("button",{onClick:clearAll,style:{padding:"5px 9px",fontSize:10.5,fontWeight:700,background:"transparent",color:C.mt,border:"1px solid "+C.bd,borderRadius:6,cursor:"pointer"}},"✕ Ninguno"),
        e("div",{style:{flex:1}}),
        // Toggle card/list
        e("button",{onClick:function(){setViewMode(viewMode==="card"?"list":"card");},style:{padding:"5px 10px",fontSize:11,fontWeight:800,background:ax(groupColor,.15),color:groupColor,border:"1px solid "+ax(groupColor,.35),borderRadius:6,cursor:"pointer"}},viewMode==="card"?"📋 Ver lista":"🃏 Ver tarjetas")
      )
    ),

    // ====== CONTADOR + ESTADO VACÍO ======
    e("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:12,fontSize:12,color:C.mt}},
      e("div",{style:{flex:1}},
        e("b",{style:{color:groupColor}},filtered.length)," ",filtered.length===1?"tarjeta":"tarjetas",
        hasFilter?e("span",null," (filtradas)"):null,
        mine.length>0?e("span",{style:{color:C.pearl,marginLeft:8}},"· ✦ "+mine.length+" mías"):null
      ),
      hasFilter?e("button",{onClick:function(){selectAll();setOrigin("all");setSearch("");},style:{padding:"4px 9px",fontSize:10.5,fontWeight:700,background:"transparent",color:groupColor,border:"1px solid "+ax(groupColor,.35),borderRadius:6,cursor:"pointer"}},"🗘 Limpiar"):null
    ),

    filtered.length===0?e("div",{style:{padding:28,textAlign:"center",background:C.cd,border:"1px dashed "+C.bd2,borderRadius:10}},
      e("div",{style:{fontSize:30,marginBottom:8,opacity:.6}},"🔍"),
      e("div",{style:{fontSize:13,color:C.mt,marginBottom:14,lineHeight:1.5}},"No hay tarjetas con estos filtros. Ajusta la selección o añade una tuya."),
      e("button",{onClick:openNew,style:{padding:"9px 16px",background:C.pearl,color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:800,cursor:"pointer"}},"➕ Añadir mi flashcard")
    ):null,

    // ====== MODO TARJETA ======
    (filtered.length>0 && viewMode==="card")?e("div",null,
      e("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:14}},
        e("div",{style:{flex:1,height:6,background:C.bd,borderRadius:99}},
          e("div",{style:{height:"100%",width:((ix+1)/filtered.length*100)+"%",background:groupColor,borderRadius:99,transition:"width .3s"}})
        ),
        e("span",{style:{fontSize:11.5,color:C.mt,fontWeight:700,minWidth:50,textAlign:"right"}},(ix+1)+" / "+filtered.length)
      ),
      e("div",{style:{position:"relative"}},
        e("button",{onClick:toggle,style:{width:"100%",minHeight:220,padding:"24px 20px",background:revealed?"linear-gradient(135deg,"+ax(card.meta.color,.14)+","+C.cd+" 90%)":C.cd,border:"1px solid "+(revealed?ax(card.meta.color,.4):C.bd),borderLeft:"4px solid "+card.meta.color,borderRadius:14,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:10,animation:"fadeIn .25s"}},
          e("div",{style:{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}},
            e("div",{style:{fontSize:10,fontWeight:800,color:card.meta.color,letterSpacing:1.6,textTransform:"uppercase",padding:"3px 8px",background:ax(card.meta.color,.15),borderRadius:5,border:"1px solid "+ax(card.meta.color,.3)}},card.meta.icon+" "+card.meta.label),
            e("div",{style:{fontSize:10,fontWeight:800,color:groupColor,letterSpacing:1.6,textTransform:"uppercase",padding:"3px 8px",background:ax(groupColor,.12),borderRadius:5}},revealed?"✓ Respuesta":"❓ Pregunta"),
            card.own?e("div",{style:{fontSize:9.5,fontWeight:800,color:C.pearl,letterSpacing:1.3,textTransform:"uppercase",padding:"3px 8px",background:ax(C.pearl,.15),borderRadius:5,border:"1px solid "+ax(C.pearl,.3)}},"✦ Mía"):null,
            e("div",{style:{flex:1,textAlign:"right",fontSize:10.5,color:C.mt,fontStyle:"italic"}},"Toca para "+(revealed?"volver":"revelar"))
          ),
          e("div",{style:{flex:1,fontSize:15.5,lineHeight:1.5,color:"#fff",fontWeight:revealed?400:600,paddingTop:3}},revealed?card.r:card.q)
        ),
        card.own?e("button",{onClick:function(){openEdit(card._mineIdx);},style:{position:"absolute",top:10,right:10,padding:"5px 9px",background:ax(C.pearl,.2),border:"1px solid "+ax(C.pearl,.4),color:C.pearl,borderRadius:7,fontSize:10.5,fontWeight:700,cursor:"pointer"}},"✎ Editar"):null
      ),
      e("div",{style:{display:"flex",gap:8,marginTop:12,alignItems:"center"}},
        e("button",{onClick:prev,disabled:ix===0,style:{padding:"10px 14px",background:ix===0?C.cd:ax(groupColor,.15),border:"1px solid "+(ix===0?C.bd:ax(groupColor,.35)),color:ix===0?C.dm:groupColor,borderRadius:9,fontWeight:700,fontSize:13,cursor:ix===0?"not-allowed":"pointer",opacity:ix===0?.5:1}},"←"),
        e("button",{onClick:toggle,style:{flex:1,padding:"10px 16px",background:revealed?ax(groupColor,.12):groupColor,border:"1px solid "+(revealed?ax(groupColor,.35):groupColor),color:revealed?groupColor:"#fff",borderRadius:9,fontWeight:800,fontSize:13,cursor:"pointer"}},revealed?"🔙 Ocultar":"👁 Revelar"),
        e("button",{onClick:next,disabled:ix+1>=filtered.length,style:{padding:"10px 14px",background:ix+1>=filtered.length?C.cd:groupColor,border:"1px solid "+(ix+1>=filtered.length?C.bd:groupColor),color:ix+1>=filtered.length?C.dm:"#fff",borderRadius:9,fontWeight:700,fontSize:13,cursor:ix+1>=filtered.length?"not-allowed":"pointer",opacity:ix+1>=filtered.length?.5:1}},"→")
      )
    ):null,

    // ====== MODO LISTA ======
    (filtered.length>0 && viewMode==="list")?e("div",null,
      e("div",{style:{display:"flex",gap:8,alignItems:"center",marginBottom:12}},
        e("button",{onClick:function(){setShowAllAns(!showAllAns);},style:{flex:1,padding:"11px 14px",background:showAllAns?ax(groupColor,.15):groupColor,border:"1px solid "+(showAllAns?ax(groupColor,.35):groupColor),color:showAllAns?groupColor:"#fff",borderRadius:9,fontWeight:800,fontSize:13,cursor:"pointer"}},showAllAns?"🙈 Ocultar todas las respuestas":"👁 Mostrar todas las respuestas")
      ),
      mine.length>0?e("div",{style:{fontSize:11,color:C.mt,fontStyle:"italic",marginBottom:10,lineHeight:1.5}},"💡 Toca una tarjeta amarilla (",e("span",{style:{color:C.pearl}},"✦ Mía"),") para editarla o eliminarla."):null,
      e("div",{style:{display:"flex",flexDirection:"column",gap:10}},
        filtered.map(function(cd,i){
          var isMine=cd.own;
          return e(isMine?"button":"div",{key:i,onClick:isMine?function(){openEdit(cd._mineIdx);}:null,style:{padding:"13px 14px",background:C.cd,border:"1px solid "+(isMine?ax(C.pearl,.35):C.bd),borderLeft:"3px solid "+cd.meta.color,borderRadius:10,textAlign:"left",cursor:isMine?"pointer":"default",width:"100%",fontFamily:"inherit",color:"inherit",display:"block"}},
            e("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:7,flexWrap:"wrap"}},
              e("div",{style:{fontSize:9.5,fontWeight:800,color:groupColor,letterSpacing:1.5,minWidth:24}},"#"+(i+1)),
              e("div",{style:{fontSize:9.5,fontWeight:800,color:cd.meta.color,letterSpacing:1.4,textTransform:"uppercase",padding:"2px 7px",background:ax(cd.meta.color,.12),borderRadius:4}},cd.meta.icon+" "+cd.meta.label),
              cd.own?e("div",{style:{fontSize:9,fontWeight:800,color:C.pearl,letterSpacing:1.2,textTransform:"uppercase",padding:"2px 6px",background:ax(C.pearl,.12),borderRadius:4}},"✦ Mía · ✎"):null
            ),
            e("div",{style:{fontSize:13.5,color:"#fff",fontWeight:600,lineHeight:1.5,marginBottom:showAllAns?10:0}},cd.q),
            showAllAns?e("div",{style:{fontSize:12.5,color:C.tx,lineHeight:1.55,paddingTop:10,borderTop:"1px dashed "+C.bd2}},
              e("span",{style:{fontSize:9.5,fontWeight:800,color:groupColor,letterSpacing:1.4,textTransform:"uppercase",marginRight:6}},"R:"),
              cd.r
            ):null
          );
        })
      )
    ):null,

    // ====== BOTÓN AÑADIR ======
    e("button",{onClick:openNew,style:{width:"100%",padding:"11px 14px",background:"linear-gradient(135deg,"+ax(C.pearl,.12)+","+C.cd+")",border:"1px dashed "+ax(C.pearl,.5),color:C.pearl,borderRadius:10,fontSize:13,fontWeight:700,marginTop:14,cursor:"pointer"}},"➕ Añadir mi flashcard"),

    // ====== EDITOR MODAL ======
    editorOpen?e("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(6,10,20,.85)",backdropFilter:"blur(8px)",zIndex:150,display:"flex",alignItems:"center",justifyContent:"center",padding:14,animation:"fadeIn .15s"}},
      e("div",{style:{background:C.cd,border:"1px solid "+ax(C.pearl,.4),borderLeft:"4px solid "+C.pearl,borderRadius:14,padding:18,maxWidth:500,width:"100%",maxHeight:"90vh",overflowY:"auto"}},
        e("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:14}},
          e("div",{style:{fontSize:20}},"✦"),
          e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",fontFamily:"Playfair Display",flex:1}},editingIdx===null?"Nueva flashcard":"Editar flashcard"),
          e("button",{onClick:function(){setEditorOpen(false);},style:{padding:"5px 9px",background:C.bd,border:"1px solid "+C.bd2,color:C.mt,borderRadius:7,fontSize:11,fontWeight:700,cursor:"pointer"}},"✕")
        ),
        e("label",{style:{display:"block",fontSize:10.5,fontWeight:800,color:C.pearl,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}},"Tema"),
        e("div",{style:{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}},
          allDecks.map(function(dk){
            var meta=DECKS[dk].meta;
            var active=themeDraft===dk;
            return e("button",{key:dk,onClick:function(){setThemeDraft(dk);},style:{padding:"5px 10px",fontSize:11,fontWeight:700,background:active?ax(meta.color,.2):"transparent",color:active?meta.color:C.mt,border:"1px solid "+(active?meta.color:C.bd),borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",gap:4}},
              e("span",null,meta.icon),
              e("span",null,meta.label)
            );
          })
        ),
        e("label",{style:{display:"block",fontSize:10.5,fontWeight:800,color:C.pearl,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}},"❓ Pregunta"),
        e("textarea",{value:qDraft,onChange:function(ev){setQDraft(ev.target.value);},placeholder:"Ej: ¿Cuál es el tratamiento de elección para...?",rows:3,style:{width:"100%",padding:"10px 12px",background:C.bg,border:"1px solid "+C.bd,borderRadius:8,color:C.tx,fontSize:14,fontFamily:"inherit",marginBottom:14,resize:"vertical",minHeight:70,boxSizing:"border-box"}}),
        e("label",{style:{display:"block",fontSize:10.5,fontWeight:800,color:C.pearl,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}},"✓ Respuesta"),
        e("textarea",{value:rDraft,onChange:function(ev){setRDraft(ev.target.value);},placeholder:"Ej: ISRS a dosis altas + TCC con EPR.",rows:4,style:{width:"100%",padding:"10px 12px",background:C.bg,border:"1px solid "+C.bd,borderRadius:8,color:C.tx,fontSize:14,fontFamily:"inherit",marginBottom:14,resize:"vertical",minHeight:90,boxSizing:"border-box"}}),
        e("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},
          e("button",{onClick:save,disabled:!qDraft.trim()||!rDraft.trim(),style:{flex:1,minWidth:120,padding:"10px 16px",background:(!qDraft.trim()||!rDraft.trim())?C.bd:C.pearl,color:(!qDraft.trim()||!rDraft.trim())?C.dm:"#fff",border:"none",borderRadius:9,fontWeight:800,fontSize:13,cursor:(!qDraft.trim()||!rDraft.trim())?"not-allowed":"pointer"}},editingIdx===null?"💾 Guardar":"💾 Actualizar"),
          editingIdx!==null?e("button",{onClick:del,style:{padding:"10px 14px",background:ax(C.bad,.15),border:"1px solid "+ax(C.bad,.4),color:C.bad,borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}},"🗑 Eliminar"):null,
          e("button",{onClick:function(){setEditorOpen(false);},style:{padding:"10px 14px",background:C.bd,border:"1px solid "+C.bd2,color:C.mt,borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}},"Cancelar")
        ),
        e("div",{style:{marginTop:12,fontSize:11,color:C.mt,lineHeight:1.5,fontStyle:"italic"}},"💡 Tus flashcards se guardan en este dispositivo.")
      )
    ):null
  );
}

// Quiz global con filtros · mismo modelo que GlobalFlashDeck
function GlobalQuiz(p){
  var group=p.group;
  var groupColor=group==="psicosis"?C.psi:(group==="all"?C.pearl:C.anx);
  var allDecks=group==="all"?(DECK_GROUPS.psicosis.concat(DECK_GROUPS.neurosis)):DECK_GROUPS[group];

  var s1=useState(allDecks.slice());var activeThemes=s1[0],setActiveThemes=s1[1];
  var s2=useState("");var search=s2[0],setSearch=s2[1];
  var s3=useState("card");var viewMode=s3[0],setViewMode=s3[1];
  var s4=useState(0);var ix=s4[0],setIx=s4[1];
  var s5=useState(null);var pick=s5[0],setPick=s5[1];
  var s6=useState(false);var showAllAns=s6[0],setShowAllAns=s6[1];

  var pool=[];
  allDecks.forEach(function(dk){
    var meta=DECKS[dk].meta;
    getAllQuiz(dk).forEach(function(q){
      pool.push({p:q.p,o:q.o,r:q.r,x:q.x,source:dk,meta:meta});
    });
  });
  var searchLow=search.toLowerCase();
  var filtered=pool.filter(function(q){
    if(activeThemes.indexOf(q.source)<0)return false;
    if(searchLow && q.p.toLowerCase().indexOf(searchLow)<0)return false;
    return true;
  });

  if(ix>=filtered.length && filtered.length>0){ix=filtered.length-1;}
  var q=filtered[ix];

  function toggleTheme(dk){
    var next=activeThemes.slice();
    var i=next.indexOf(dk);
    if(i<0)next.push(dk);
    else next.splice(i,1);
    setActiveThemes(next);
    setIx(0);setPick(null);
  }
  function selectAll(){setActiveThemes(allDecks.slice());setIx(0);setPick(null);}
  function clearAll(){setActiveThemes([]);setIx(0);setPick(null);}
  function sel(i){if(pick===null)setPick(i);}
  function goNext(){if(ix+1<filtered.length){setIx(ix+1);setPick(null);}}
  function goPrev(){if(ix>0){setIx(ix-1);setPick(null);}}

  var hasFilter=activeThemes.length<allDecks.length || search.length>0;

  return e("div",null,
    // ====== FILTROS ======
    e("div",{style:{padding:"12px 12px 14px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+groupColor,borderRadius:12,marginBottom:14}},
      e("input",{type:"text",value:search,onChange:function(ev){setSearch(ev.target.value);setIx(0);setPick(null);},placeholder:"🔎 Buscar en la pregunta...",style:{width:"100%",padding:"8px 11px",background:C.bg,border:"1px solid "+C.bd,borderRadius:8,color:C.tx,fontSize:13,fontFamily:"inherit",marginBottom:10,boxSizing:"border-box"}}),
      e("div",{style:{fontSize:10,fontWeight:800,color:groupColor,letterSpacing:1.4,textTransform:"uppercase",marginBottom:6}},"Temas · toca para filtrar"),
      e("div",{style:{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}},
        allDecks.map(function(dk){
          var meta=DECKS[dk].meta;
          var count=getAllQuiz(dk).length;
          var active=activeThemes.indexOf(dk)>=0;
          return e("button",{key:dk,onClick:function(){toggleTheme(dk);},style:{padding:"6px 10px",fontSize:11,fontWeight:700,background:active?ax(meta.color,.18):ax(meta.color,.04),color:active?meta.color:ax(meta.color,.6),border:"1px solid "+(active?meta.color:ax(meta.color,.25)),borderRadius:20,cursor:"pointer",display:"flex",alignItems:"center",gap:5}},
            e("span",{style:{opacity:active?1:.5}},meta.icon),
            e("span",null,meta.label),
            e("span",{style:{opacity:.7,fontWeight:600}},"("+count+")")
          );
        })
      ),
      e("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},
        e("button",{onClick:selectAll,style:{padding:"5px 9px",fontSize:10.5,fontWeight:700,background:"transparent",color:C.mt,border:"1px solid "+C.bd,borderRadius:6,cursor:"pointer"}},"✓ Todos"),
        e("button",{onClick:clearAll,style:{padding:"5px 9px",fontSize:10.5,fontWeight:700,background:"transparent",color:C.mt,border:"1px solid "+C.bd,borderRadius:6,cursor:"pointer"}},"✕ Ninguno"),
        e("div",{style:{flex:1}}),
        e("button",{onClick:function(){setViewMode(viewMode==="card"?"list":"card");},style:{padding:"5px 10px",fontSize:11,fontWeight:800,background:ax(groupColor,.15),color:groupColor,border:"1px solid "+ax(groupColor,.35),borderRadius:6,cursor:"pointer"}},viewMode==="card"?"📋 Ver lista":"🃏 Ver preguntas")
      )
    ),

    e("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:12,fontSize:12,color:C.mt}},
      e("div",{style:{flex:1}},
        e("b",{style:{color:groupColor}},filtered.length)," ",filtered.length===1?"pregunta":"preguntas",
        hasFilter?e("span",null," (filtradas)"):null
      ),
      hasFilter?e("button",{onClick:function(){selectAll();setSearch("");},style:{padding:"4px 9px",fontSize:10.5,fontWeight:700,background:"transparent",color:groupColor,border:"1px solid "+ax(groupColor,.35),borderRadius:6,cursor:"pointer"}},"🗘 Limpiar"):null
    ),

    filtered.length===0?e("div",{style:{padding:28,textAlign:"center",background:C.cd,border:"1px dashed "+C.bd2,borderRadius:10}},
      e("div",{style:{fontSize:30,marginBottom:8,opacity:.6}},"🔍"),
      e("div",{style:{fontSize:13,color:C.mt,lineHeight:1.5}},"No hay preguntas con estos filtros.")
    ):null,

    // ====== MODO TARJETA ======
    (filtered.length>0 && viewMode==="card")?e("div",null,
      e("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:12}},
        e("div",{style:{flex:1,height:6,background:C.bd,borderRadius:99}},
          e("div",{style:{height:"100%",width:((ix+1)/filtered.length*100)+"%",background:groupColor,borderRadius:99,transition:"width .3s"}})
        ),
        e("span",{style:{fontSize:11.5,color:C.mt,fontWeight:700,minWidth:50,textAlign:"right"}},(ix+1)+" / "+filtered.length)
      ),
      e("div",{style:{padding:"16px 16px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+q.meta.color,borderRadius:12}},
        e("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:10,flexWrap:"wrap"}},
          e("div",{style:{fontSize:10,fontWeight:800,color:q.meta.color,letterSpacing:1.5,textTransform:"uppercase",padding:"3px 8px",background:ax(q.meta.color,.15),borderRadius:5,border:"1px solid "+ax(q.meta.color,.3)}},q.meta.icon+" "+q.meta.label)
        ),
        e("div",{style:{fontSize:14,color:"#fff",fontWeight:600,lineHeight:1.55,marginBottom:12}},q.p),
        e("div",{style:{display:"flex",flexDirection:"column",gap:7}},
          q.o.map(function(opt,i){
            var isCorrect=i===q.r;
            var isPicked=i===pick;
            var bg=C.cd,bd=C.bd,color="#fff";
            if(pick!==null){
              if(isCorrect){bg=ax(C.good,.15);bd=C.good;color=C.good;}
              else if(isPicked){bg=ax(C.bad,.15);bd=C.bad;color=C.bad;}
            }
            return e("button",{key:i,onClick:function(){sel(i);},disabled:pick!==null,style:{padding:"10px 12px",background:bg,border:"1px solid "+bd,color:color,borderRadius:8,textAlign:"left",fontSize:13,fontWeight:isPicked||isCorrect?700:500,cursor:pick===null?"pointer":"default",lineHeight:1.45}},
              String.fromCharCode(65+i)+". "+opt
            );
          })
        ),
        pick!==null?e("div",{style:{marginTop:12,padding:"11px 13px",background:ax(C.good,.1),border:"1px solid "+ax(C.good,.3),borderRadius:8}},
          e("div",{style:{fontSize:10,fontWeight:800,color:C.good,letterSpacing:1.4,textTransform:"uppercase",marginBottom:5}},"💡 Explicación"),
          e("div",{style:{fontSize:12.5,color:C.tx,lineHeight:1.5}},q.x)
        ):null
      ),
      e("div",{style:{display:"flex",gap:8,marginTop:12}},
        e("button",{onClick:goPrev,disabled:ix===0,style:{padding:"10px 14px",background:ix===0?C.cd:ax(groupColor,.15),border:"1px solid "+(ix===0?C.bd:ax(groupColor,.35)),color:ix===0?C.dm:groupColor,borderRadius:9,fontWeight:700,fontSize:13,cursor:ix===0?"not-allowed":"pointer",opacity:ix===0?.5:1}},"← Anterior"),
        e("button",{onClick:goNext,disabled:ix+1>=filtered.length,style:{flex:1,padding:"10px 14px",background:ix+1>=filtered.length?C.cd:groupColor,border:"1px solid "+(ix+1>=filtered.length?C.bd:groupColor),color:ix+1>=filtered.length?C.dm:"#fff",borderRadius:9,fontWeight:800,fontSize:13,cursor:ix+1>=filtered.length?"not-allowed":"pointer",opacity:ix+1>=filtered.length?.5:1}},"Siguiente →")
      )
    ):null,

    // ====== MODO LISTA ======
    (filtered.length>0 && viewMode==="list")?e("div",null,
      e("button",{onClick:function(){setShowAllAns(!showAllAns);},style:{width:"100%",padding:"11px 14px",background:showAllAns?ax(groupColor,.15):groupColor,border:"1px solid "+(showAllAns?ax(groupColor,.35):groupColor),color:showAllAns?groupColor:"#fff",borderRadius:9,fontWeight:800,fontSize:13,cursor:"pointer",marginBottom:12}},showAllAns?"🙈 Ocultar respuestas":"👁 Mostrar respuestas correctas"),
      e("div",{style:{display:"flex",flexDirection:"column",gap:10}},
        filtered.map(function(qq,i){
          var correctAnswer="";
          if(qq && qq.o && typeof qq.r==="number" && qq.o[qq.r]){correctAnswer=qq.o[qq.r];}
          return e("div",{key:i,style:{padding:"13px 14px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"3px solid "+qq.meta.color,borderRadius:10}},
            e("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:7,flexWrap:"wrap"}},
              e("div",{style:{fontSize:9.5,fontWeight:800,color:groupColor,letterSpacing:1.5,minWidth:24}},"#"+(i+1)),
              e("div",{style:{fontSize:9.5,fontWeight:800,color:qq.meta.color,letterSpacing:1.4,textTransform:"uppercase",padding:"2px 7px",background:ax(qq.meta.color,.12),borderRadius:4}},qq.meta.icon+" "+qq.meta.label)
            ),
            e("div",{style:{fontSize:13.5,color:"#fff",fontWeight:600,lineHeight:1.5}},qq.p),
            showAllAns?e("div",{style:{marginTop:9,padding:"8px 11px",background:ax(C.good,.1),border:"1px solid "+ax(C.good,.3),borderRadius:7}},
              e("span",{style:{fontSize:9.5,fontWeight:800,color:C.good,letterSpacing:1.3,textTransform:"uppercase",marginRight:6}},"✓ Respuesta"),
              e("span",{style:{fontSize:12.5,color:C.tx,lineHeight:1.5}},correctAnswer)
            ):null
          );
        })
      )
    ):null
  );
}



// Hero de tema
function Hero(p){
  var c=p.c;
  return e("div",{style:{padding:22,background:"linear-gradient(135deg,"+ax(c,.18)+" 0%,"+C.cd+" 80%)",border:"1px solid "+ax(c,.4),borderRadius:16,marginBottom:18}},
    e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:6}},p.kicker),
    e("h1",{style:{fontSize:28,fontWeight:900,color:c,letterSpacing:.15,lineHeight:1.15,marginBottom:10}},p.title),
    e("div",{className:"prose",style:{fontSize:14}},p.children)
  );
}

// Glosario de abreviaturas
function Abbrev(p){
  var c=p.c||C.anx;
  return e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.08)+","+C.cd+" 80%)",border:"1px solid "+ax(c,.3),borderRadius:12,margin:"12px 0 20px"}},
    e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:6}},"🔤 Abreviaturas de este tema"),
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:8}},
      p.items.map(function(it,i){
        return e("div",{key:i,style:{display:"flex",gap:10,padding:"8px 10px",background:ax(c,.05),border:"1px solid "+ax(c,.15),borderRadius:7}},
          e("div",{style:{fontWeight:800,color:c,fontSize:12,minWidth:60,flexShrink:0,letterSpacing:.3}},it.a),
          e("div",{style:{fontSize:12.5,color:C.tx,lineHeight:1.4}},it.d)
        );
      })
    )
  );
}

// Índice navegable de sub-secciones (anclas internas)
function TOCNav(p){
  var c=p.c||C.anx;
  function scrollTo(id){
    var el=document.getElementById(id);
    if(el){
      var y=el.getBoundingClientRect().top+window.scrollY-70;
      window.scrollTo({top:y,behavior:"smooth"});
    }
  }
  return e("div",{style:{padding:"14px 16px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:12,margin:"12px 0 22px"}},
    e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:6}},"📑 Índice del tema · toca para saltar"),
    e("div",{style:{display:"flex",flexDirection:"column",gap:6}},
      p.items.map(function(it,i){
        return e("button",{key:i,onClick:function(){scrollTo(it.id);},style:{padding:"9px 11px",background:ax(c,.06),border:"1px solid "+ax(c,.2),borderRadius:7,textAlign:"left",cursor:"pointer",display:"flex",alignItems:"center",gap:10,color:C.tx,fontSize:13,lineHeight:1.35,width:"100%"}},
          it.n?e("span",{style:{minWidth:26,height:26,borderRadius:6,background:ax(c,.2),color:c,fontSize:11.5,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},it.n):null,
          e("span",{style:{flex:1}},it.t),
          e("span",{style:{color:c,fontSize:15,opacity:.6}},"→")
        );
      })
    )
  );
}

// Ancla (destino invisible del índice)
function Anchor(p){
  return e("div",{id:p.id,style:{height:1,marginTop:-1}});
}

// Bloque de enfermedad — marco visual que agrupa TODO lo de una entidad
function DiseaseBlock(p){
  var c=p.c||C.anx;
  return e("div",{style:{margin:"18px 0",padding:"2px 0"}},
    p.id?e(Anchor,{id:p.id}):null,
    // Header de enfermedad
    e("div",{style:{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.2)+","+ax(c,.05)+" 80%)",border:"1px solid "+ax(c,.4),borderRadius:"12px 12px 0 0",borderBottom:"none"}},
      e("div",{style:{minWidth:42,height:42,borderRadius:10,background:ax(c,.25),border:"1px solid "+ax(c,.4),color:c,fontSize:17,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"Playfair Display"}},p.n),
      e("div",{style:{flex:1,minWidth:0}},
        e("div",{style:{fontSize:10,fontWeight:800,color:c,letterSpacing:1.5,textTransform:"uppercase",marginBottom:1,opacity:.8}},p.kicker||"Enfermedad"),
        e("div",{style:{fontSize:18,fontWeight:800,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},p.name)
      )
    ),
    // Contenido
    e("div",{style:{padding:"14px 16px 16px",background:ax(c,.03),border:"1px solid "+ax(c,.3),borderRadius:"0 0 12px 12px",borderTop:"none"}},
      p.children
    )
  );
}

// Banner de sección compartida (ej: "TRATAMIENTO COMÚN DEL TEMA")
function SharedBanner(p){
  var c=p.c||C.anx;
  return e("div",{style:{padding:"16px 18px",background:"linear-gradient(135deg,"+ax(c,.2)+","+ax(c,.06)+" 90%)",border:"2px solid "+ax(c,.5),borderRadius:14,margin:"26px 0 14px",textAlign:"center"}},
    e("div",{style:{fontSize:24,marginBottom:4}},p.icon||"🎯"),
    e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:4}},p.kicker||"Sección compartida"),
    e("div",{style:{fontSize:20,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.15,fontFamily:"Playfair Display"}},p.title),
    p.subtitle?e("div",{style:{fontSize:12.5,color:C.mt,marginTop:5,lineHeight:1.5}},p.subtitle):null
  );
}

// Sub-sección dentro de una enfermedad · Definición / Clínica / Diagnóstico / Tratamiento
// Acordeón: Definición abierta por defecto. Clínica, Dx y Tx colapsadas.
// Todas son colapsables al tocar el header.
function Sub(p){
  var c=p.c||C.anx;
  var icons={def:"📖",cli:"🩺",dx:"📋",tx:"💊"};
  var labels={def:"Definición",cli:"Clínica",dx:"Diagnóstico",tx:"Tratamiento"};
  var key=p.k||"def";
  var defaultOpen=key==="def";
  var s1=useState(defaultOpen);var open=s1[0],setOpen=s1[1];

  function toggle(){setOpen(!open);}

  return e("div",{style:{margin:"8px 0",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:10,overflow:"hidden"}},
    // Header clickeable
    e("button",{onClick:toggle,style:{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"11px 13px",background:open?ax(c,.1):"transparent",border:"none",cursor:"pointer",textAlign:"left",transition:"background .15s"}},
      e("div",{style:{width:30,height:30,borderRadius:8,background:ax(c,.2),border:"1px solid "+ax(c,.35),display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}},icons[key]),
      e("div",{style:{flex:1,fontSize:11,fontWeight:800,color:c,letterSpacing:1.8,textTransform:"uppercase"}},p.t||labels[key]),
      e("div",{style:{fontSize:18,color:c,fontWeight:300,transition:"transform .2s",transform:open?"rotate(90deg)":"rotate(0deg)"}},"›")
    ),
    // Content
    open?e("div",{style:{padding:"2px 14px 14px",animation:"fadeIn .2s"}},p.children):null
  );
}

// Header compacto de enfermedad (inicio de cada entidad)
function DzCard(p){
  var c=p.c||C.anx;
  return e("div",{style:{margin:"22px 0 8px",padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.22)+","+ax(c,.06)+" 80%)",border:"1px solid "+ax(c,.45),borderRadius:12,display:"flex",alignItems:"center",gap:12}},
    p.n?e("div",{style:{width:40,height:40,borderRadius:10,background:ax(c,.25),color:c,fontSize:16,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"Playfair Display",border:"1px solid "+ax(c,.4)}},p.n):null,
    e("div",{style:{flex:1,minWidth:0}},
      p.kicker?e("div",{style:{fontSize:10,fontWeight:800,color:c,letterSpacing:1.5,textTransform:"uppercase",marginBottom:1,opacity:.85}},p.kicker):null,
      e("div",{style:{fontSize:18,fontWeight:800,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},p.name)
    )
  );
}

// Modal pantalla completa para una enfermedad · usa tabs internos
function DzModal(p){
  var c=p.c||C.anx;
  var isSingle=!!p.single;
  var s1=useState("def");var tab=s1[0],setTab=s1[1];
  var tabs=[
    {k:"def",l:"Definición",ic:"📖"},
    {k:"cli",l:"Clínica",ic:"🩺"},
    {k:"dx",l:"Diagnóstico",ic:"📋"},
    {k:"tx",l:"Tratamiento",ic:"💊"}
  ];
  useEffect(function(){
    document.body.style.overflow="hidden";
    return function(){document.body.style.overflow="";};
  },[]);
  return e("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:C.bg,zIndex:100,overflowY:"auto",animation:"fadeIn .2s"}},
    // Header sticky con botón cerrar
    e("div",{style:{position:"sticky",top:0,zIndex:10,background:"rgba(6,10,20,.94)",backdropFilter:"blur(12px)",borderBottom:"1px solid "+C.bd,padding:"10px 14px"}},
      e("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:isSingle?0:10}},
        e("button",{onClick:p.onClose,style:{padding:"8px 12px",background:ax(c,.15),border:"1px solid "+ax(c,.35),color:c,borderRadius:8,fontSize:12.5,fontWeight:700,cursor:"pointer"}},"← Cerrar"),
        e("div",{style:{flex:1,minWidth:0}},
          e("div",{style:{fontSize:9.5,fontWeight:800,color:c,letterSpacing:1.8,textTransform:"uppercase",marginBottom:1,opacity:.85}},p.kicker||"Enfermedad"),
          e("div",{style:{fontSize:15,fontWeight:800,color:"#fff",lineHeight:1.2,fontFamily:"Playfair Display",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},p.name)
        )
      ),
      // Tabs (solo si no es single)
      isSingle?null:e("div",{style:{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}},
        tabs.map(function(t){
          var active=tab===t.k;
          return e("button",{key:t.k,onClick:function(){setTab(t.k);window.scrollTo({top:0,behavior:"instant"});},style:{padding:"7px 12px",background:active?c:ax(c,.1),border:"1px solid "+(active?c:ax(c,.3)),color:active?"#fff":c,borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap",flexShrink:0}},
            e("span",null,t.ic),
            e("span",null,t.l)
          );
        })
      )
    ),
    // Content
    e("div",{style:{padding:"14px 14px 40px",maxWidth:720,margin:"0 auto",animation:"fadeIn .2s"}},
      isSingle?p.single:(p.sections&&p.sections[tab]?p.sections[tab]:e(P,null,"(sin contenido)"))
    )
  );
}

// Grid de tarjetas de enfermedades, cada una abre modal
function DzGrid(p){
  var c=p.c||C.anx;
  var s1=useState(null);var open=s1[0],setOpen=s1[1];
  return e("div",null,
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10,margin:"14px 0 10px"}},
      p.items.map(function(it,i){
        return e("button",{key:i,onClick:function(){setOpen(i);},style:{padding:"14px 12px",background:"linear-gradient(135deg,"+ax(c,.15)+","+ax(c,.04)+" 85%)",border:"1px solid "+ax(c,.35),borderRadius:12,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:4,minHeight:110,transition:"transform .15s"}},
          e("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:5}},
            e("div",{style:{minWidth:28,height:28,borderRadius:7,background:ax(c,.25),color:c,fontSize:13,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Playfair Display",border:"1px solid "+ax(c,.4)}},it.n),
            e("div",{style:{fontSize:9,fontWeight:800,color:c,letterSpacing:1.3,textTransform:"uppercase"}},it.kicker||"Enfermedad")
          ),
          e("div",{style:{fontSize:13.5,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Playfair Display",flex:1}},it.name),
          it.blurb?e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.35,marginTop:3}},it.blurb):null,
          e("div",{style:{fontSize:10.5,fontWeight:700,color:c,marginTop:4,opacity:.8}},"Ver ficha →")
        );
      })
    ),
    open!==null?e(DzModal,{c:c,name:p.items[open].name,kicker:p.items[open].kicker||"Enfermedad",sections:p.items[open].sections,onClose:function(){setOpen(null);}}):null
  );
}

// ══════════════════════════════════════════════════════════════
// TEMA 1 · TRASTORNOS DE ANSIEDAD

// ══════════════════════════════════════════════════════════════

function AnxView(){
  var c=C.anx;
  // Datos estructurados de las 9 enfermedades
  var diseases=[
    {
      n:"01",name:"Trastorno de pánico",
      blurb:"Crisis inesperadas recurrentes + ≥1 mes de preocupación",
      sections:{
        def:e(Def,{c:c},"Presencia de ",e("b",null,"crisis de pánico inesperadas recurrentes"),", seguidas de al menos un mes de ",e("b",null,"preocupación por nuevas crisis")," o ",e("b",null,"cambio de conducta desadaptativo")," para evitarlas (ej: evitar ejercicio, evitar salir)."),
        cli:e("div",null,
          e(P,null,e("b",null,"Epidemiología:")," prevalencia anual ~2–3%. Predominio en mujeres (2:1). Edad típica de inicio entre 20–24 años. Curso crónico con exacerbaciones. Comorbilidad con depresión >50%."),
          e(H3,{c:c,mt:14},"Etiología y fisiopatología"),
          e(P,null,"Los familiares de primer grado tienen un riesgo ",e("b",null,"10× mayor")," (20% vs 2%). Tres enfoques complementarios explican el cuadro:"),
          e(Table,{
            headers:[{t:"Enfoque",c:c},{t:"Mecanismo",c:c}],
            rows:[
              ["Biológico · Genética","Riesgo 10× mayor en familiares de primer grado (20% vs 2% población general)"],
              ["Biológico · Locus coeruleus","'Núcleo azul' del tronco encefálico que regula noradrenalina. Hipersensible → dispara sistema de alerta sin amenaza real"],
              ["Biológico · Falsa sofocación","Hipersensibilidad al CO₂: el cerebro interpreta erróneamente señales de asfixia → hiperventilación → pánico"],
              ["Biológico · Neurotransmisores","Alteraciones en GABA (inhibidor) y serotonina"],
              ["Psicoanalítico","Los ataques son irrupciones de energía psíquica de pensamientos/deseos inaceptables que la represión no puede contener"],
              ["Conductista","El pánico es una respuesta aprendida por condicionamiento clásico. Ej: accidente con taquicardia → cualquier taquicardia (ejercicio) dispara pánico por asociación"]
            ]
          }),
          e(H3,{c:c,mt:14},"El 'viacrucis' del paciente"),
          e(P,null,"Por los síntomas físicos, el paciente con pánico consulta a múltiples especialistas antes de llegar al psiquiatra. En atención primaria la prevalencia se ",e("b",null,"triplica"),"; en cardiología, cuando el dolor torácico tiene arterias sanas, la tasa de trastorno de pánico ",e("b",null,"supera el 50%"),"."),
          e(Table,{
            headers:[{t:"Especialista",c:c},{t:"Síntoma por el que consulta",c:c}],
            rows:[
              ["Cardiólogo","Palpitaciones, dolor precordial"],
              ["Neumólogo","Disnea, sensación de sofocamiento"],
              ["Gastroenterólogo","Náuseas, diarrea, malestar abdominal"],
              ["Neurólogo","Parestesias, temblor, mareo"]
            ]
          })
        ),
        dx:e("div",null,
          e(CritBlock,{title:"Trastorno de pánico",c:c},
            e(Crit,{crit:"A",c:c},"Crisis de pánico inesperadas ",e("b",null,"recurrentes"),". (Al menos 2)"),
            e(Crit,{crit:"B",c:c},"Al menos UNA crisis seguida de ",e("b",null,"≥1 mes")," de uno o ambos: ",e("br"),"(1) ",e("b",null,"Preocupación persistente")," por nuevas crisis o sus consecuencias ('me voy a morir', 'me voy a volver loco'). ",e("br"),"(2) ",e("b",null,"Cambio de conducta significativo desadaptativo")," (evitar ejercicio, cafeína, situaciones similares)."),
            e(Crit,{crit:"C",c:c},"No atribuible a efectos de sustancia (cocaína, cafeína) ni a enfermedad médica (hipertiroidismo, arritmia)."),
            e(Crit,{crit:"D",c:c},"No se explica mejor por otro trastorno mental (las crisis en fobia social son desencadenadas, no inesperadas; en TOC por obsesiones; en TEPT por recuerdos traumáticos).")
          ),
          e(Pearl,{t:"DSM-5 separó pánico de agorafobia"},"Antes eran un solo diagnóstico (pánico con/sin agorafobia). Desde DSM-5 son diagnósticos ",e("b",null,"independientes"),". Pueden codiagnosticarse si cumplen criterios ambos.")
        ),
        tx:e("div",null,
          e(P,null,"1ª línea: ",e("b",null,"ISRS o IRSN")," (sertralina, escitalopram, venlafaxina XR). Iniciar a ",e("b",null,"mitad de dosis")," por la ",e("b",null,"activación inicial")," (peor antes de mejor, 7–14 días). Respuesta completa en 6–12 semanas. Mantener ≥12 meses tras remisión."),
          e(P,null,e("b",null,"Puente corto (≤4–6 sem):")," clonazepam 0.5–2 mg/día o alprazolam 0.25–3 mg/día. ",e("b",null,"Psicoterapia:")," TCC con respiración + reestructuración cognitiva (entender que el dolor torácico NO es un infarto)."),
          e(Pearl,{t:"Factor dietético clave"},"Evitar ",e("b",null,"cafeína")," (café, té, colas, chocolate, energizantes). Potente inductor de crisis.")
        )
      }
    },
    {
      n:"02",name:"Agorafobia",
      blurb:"Miedo a ≥2 de 5 situaciones por imposibilidad de escape",
      sections:{
        def:e(Def,{c:c},"Miedo o ansiedad marcados ante ",e("b",null,"≥2 de las 5 situaciones")," siguientes, porque el paciente teme que en ellas ",e("b",null,"no podría escapar")," o ",e("b",null,"no recibiría auxilio")," si tuviera síntomas incapacitantes."),
        cli:e("div",null,
          e(SxList,{title:"Las 5 situaciones de agorafobia (≥2)",c:c,items:[
            "Uso de transporte público (autobús, tren, avión, barco)",
            "Estar en espacios abiertos (plazas, estacionamientos, puentes)",
            "Estar en espacios cerrados (tiendas, cines, teatros)",
            "Hacer fila o estar entre multitudes",
            "Estar fuera de casa solo"
          ]}),
          e(P,null,e("b",null,"Ejemplos típicos:")," evitan centros comerciales, cines e iglesias por las multitudes · miedo a cruzar puentes o túneles · cuesta conducir lejos de casa · solo salen acompañados. En casos graves no pueden salir de casa. Más frecuente en mujeres y suele coexistir con trastorno de pánico.")
        ),
        dx:e(CritBlock,{title:"Agorafobia",c:c},
          e(Crit,{crit:"A",c:c},"Miedo o ansiedad marcados ante ≥2 de las 5 situaciones descritas."),
          e(Crit,{crit:"B",c:c},"El paciente teme esas situaciones porque escapar sería difícil o no habría ayuda si apareciera una crisis de pánico u otros síntomas incapacitantes."),
          e(Crit,{crit:"C",c:c},"Las situaciones agorafóbicas casi siempre provocan miedo o ansiedad."),
          e(Crit,{crit:"D",c:c},"Se evitan activamente, requieren acompañante o se soportan con mucho malestar."),
          e(Crit,{crit:"E",c:c},"El miedo es desproporcionado al peligro real."),
          e(Crit,{crit:"F",c:c},"Persistente, ",e("b",null,"≥6 meses"),"."),
          e(Crit,{crit:"G",c:c},"Causa malestar o deterioro clínicamente significativo."),
          e(Crit,{crit:"H",c:c},"No mejor explicado por otra enfermedad médica."),
          e(Crit,{crit:"I",c:c},"No mejor explicado por otro trastorno mental.")
        ),
        tx:e(P,null,"Mismos fármacos que el trastorno de pánico: ISRS/IRSN de 1ª línea. ",e("b",null,"Terapia de exposición gradual")," (in vivo) es el pilar — enfrentarse progresivamente a las situaciones temidas para perder el miedo.")
      }
    },
    {
      n:"03",name:"Trastorno de ansiedad generalizada (TAG)",
      blurb:"Preocupación crónica ≥6 meses + ≥3 síntomas físicos",
      sections:{
        def:e(Def,{c:c},"Ansiedad y preocupación ",e("b",null,"excesivas"),", ",e("b",null,"difíciles de controlar"),", sobre ",e("b",null,"múltiples temas")," (trabajo, familia, salud, dinero, etc.), presentes la mayoría de los días durante ",e("b",null,"al menos 6 meses"),", acompañadas de síntomas físicos de tensión."),
        cli:e("div",null,
          e(SxList,{title:"Los 6 síntomas físicos (criterio C · ≥3 en adultos, ≥1 en niños)",c:c,items:[
            "Inquietud o sensación de estar atrapado o con los nervios de punta",
            "Fatigabilidad fácil",
            "Dificultad para concentrarse o sensación de mente en blanco",
            "Irritabilidad",
            "Tensión muscular",
            "Alteraciones del sueño (dificultad para iniciar o mantener, o sueño inquieto no reparador)"
          ]}),
          e(Pearl,{t:"Regla mnemotécnica TAG"},e("b",null,"F-I-C-T-I-S:")," ",e("b",null,"F"),"atiga · ",e("b",null,"I"),"nquietud · ",e("b",null,"C"),"oncentración (dificultad) · ",e("b",null,"T"),"ensión muscular · ",e("b",null,"I"),"rritabilidad · ",e("b",null,"S"),"ueño alterado."),
          e(H3,{c:c,mt:14},"Epidemiología"),
          e(P,null,"Prevalencia anual ~3%. 2:1 en mujeres. Edad media de inicio ~30 años (más tardío que otros trastornos de ansiedad). Curso crónico con fluctuaciones. Comorbilidad con depresión >60%."),
          e(H3,{c:c,mt:14},"Fisiopatología"),
          e(P,null,"Componente hereditario claro (agrega familias, estudios de gemelos). Los cambios principales se localizan en el ",e("b",null,"lóbulo frontal y sistema límbico"),"."),
          e(Table,{
            headers:[{t:"Neurotransmisor",c:c},{t:"Rol en TAG",c:c}],
            rows:[
              ["Noradrenalina","Aumenta el estado de alerta de base"],
              ["GABA","Inhibidor principal — disminuido funcionalmente"],
              ["Serotonina","Regula estado de ánimo y pensamientos rumiativos"]
            ]
          })
        ),
        dx:e(CritBlock,{title:"TAG",c:c},
          e(Crit,{crit:"A",c:c},"Ansiedad y preocupación excesivas, la mayoría de los días, durante ",e("b",null,"≥6 meses"),", sobre diversos sucesos o actividades."),
          e(Crit,{crit:"B",c:c},"Al individuo le resulta ",e("b",null,"difícil controlar la preocupación"),"."),
          e(Crit,{crit:"C",c:c},"La ansiedad se asocia con ",e("b",null,"≥3 de 6 síntomas")," (",e("b",null,"≥1 en niños"),")."),
          e(Crit,{crit:"D",c:c},"Causa malestar o deterioro clínicamente significativo."),
          e(Crit,{crit:"E",c:c},"No atribuible a sustancia o enfermedad médica."),
          e(Crit,{crit:"F",c:c},"No mejor explicada por otro trastorno mental.")
        ),
        tx:e("div",null,
          e(P,null,"1ª línea: ",e("b",null,"ISRS")," (sertralina, escitalopram) o ",e("b",null,"IRSN")," (venlafaxina XR, duloxetina — duloxetina solo en TAG). Pueden combinarse con ",e("b",null,"buspirona")," (coadyuvante exclusivo de TAG, 15–60 mg/día, sin dependencia). ",e("b",null,"Pregabalina")," 150–600 mg/día como 2ª línea."),
          e(P,null,e("b",null,"Psicoterapia:")," TCC con relajación, reinhalación, meditación.")
        )
      }
    },
    {
      n:"04",name:"Fobia específica",
      blurb:"Miedo a UN objeto o situación concreta, ≥6 meses",
      sections:{
        def:e(Def,{c:c},"Miedo o ansiedad intensos ante un ",e("b",null,"objeto o situación específicos")," (estímulo fóbico), que ",e("b",null,"casi siempre")," provocan reacción inmediata y son ",e("b",null,"activamente evitados"),"."),
        cli:e("div",null,
          e(P,null,e("b",null,"Epidemiología:")," prevalencia de por vida ~11%. Más común en mujeres. Inicio típico antes de los 12 años. Las fobias específicas tienden a ceder con la edad."),
          e(H3,{c:c,mt:14},"Los 5 subtipos (especificadores)"),
          e(Table,{
            headers:[{t:"Subtipo",c:c},{t:"Ejemplos",c:c},{t:"Respuesta fisiológica",c:c}],
            rows:[
              ["Animal","Arañas, serpientes, perros, insectos","Taquicardia, hiperventilación"],
              ["Ambiente natural","Alturas, tormentas, agua","Taquicardia"],
              ["Sangre-inyección-daño (SID)","Agujas, sangre, heridas, procedimientos médicos","🩸 Respuesta VASOVAGAL bifásica (taquicardia → bradicardia → síncope)"],
              ["Situacional","Aviones, ascensores, espacios cerrados","Taquicardia, sensación de asfixia"],
              ["Otros","Atragantamiento, vómito, ruidos fuertes, personajes disfrazados en niños","Variable"]
            ]
          }),
          e(Alert,{c:C.bad,label:"⚠️ Trampa clásica: fobia SID"},"Es la ",e("b",null,"ÚNICA fobia")," con respuesta vasovagal. El paciente primero taquicardiza, luego ",e("b",null,"bradicardiza → hipotensión → síncope"),". La técnica conductual específica es la ",e("b",null,"tensión aplicada")," (tensar músculos grandes — piernas, glúteos, brazos — durante 15 segundos para elevar la PA y evitar el síncope).")
        ),
        dx:e(CritBlock,{title:"Fobia específica",c:c},
          e(Crit,{crit:"A",c:c},"Miedo o ansiedad intensos por un objeto o situación específicos (en niños puede manifestarse como llanto, rabietas, parálisis o aferramiento)."),
          e(Crit,{crit:"B",c:c},"El objeto o situación fóbicos casi siempre provocan miedo o ansiedad inmediatos."),
          e(Crit,{crit:"C",c:c},"El objeto o situación se evitan activamente o se soportan con miedo o ansiedad intensos."),
          e(Crit,{crit:"D",c:c},"El miedo es desproporcionado al peligro real."),
          e(Crit,{crit:"E",c:c},"Persistente, ",e("b",null,"≥6 meses"),"."),
          e(Crit,{crit:"F",c:c},"Causa malestar o deterioro clínico."),
          e(Crit,{crit:"G",c:c},"No mejor explicado por otro trastorno.")
        ),
        tx:e(P,null,"NO hay tratamiento farmacológico de primera línea. El tratamiento de elección es la ",e("b",null,"exposición in vivo (TCC)")," con técnicas de desensibilización sistemática y saturación. BZD puntual solo para situaciones aisladas (ej: un vuelo anual).")
      }
    },
    {
      n:"05",name:"Trastorno de ansiedad social",
      blurb:"Miedo al escrutinio / evaluación negativa por otros",
      sections:{
        def:e(Def,{c:c},"Miedo o ansiedad intensos en situaciones sociales donde el sujeto está ",e("b",null,"expuesto al posible escrutinio de otros")," (conversar, comer en público, hablar, actuar). Teme actuar de forma que sea ",e("b",null,"humillado"),", ",e("b",null,"rechazado")," u ",e("b",null,"ofenda a otros"),"."),
        cli:e("div",null,
          e(P,null,e("b",null,"Epidemiología:")," prevalencia ~13%, afecta ambos sexos, se inicia en la adolescencia (antes de los 25 años). Curso crónico, desarrollo lento sin precipitantes obvios. ⅛ desarrollan trastorno por uso de sustancias y la mitad cumplen criterios de otro trastorno psiquiátrico."),
          e(H3,{c:c,mt:14},"Especificador: 'solo actuación' (performance only)"),
          e(P,null,"Se aplica cuando el miedo se limita a ",e("b",null,"hablar o actuar en público"),". Este subtipo responde bien a ",e("b",null,"propranolol")," tomado 30–60 min antes de la actuación. El subtipo generalizado requiere ISRS + TCC.")
        ),
        dx:e(CritBlock,{title:"Trastorno de ansiedad social",c:c},
          e(Crit,{crit:"A",c:c},"Miedo o ansiedad intensos en ≥1 situaciones sociales con posible escrutinio."),
          e(Crit,{crit:"B",c:c},"Teme actuar de un modo o mostrar síntomas de ansiedad que serán evaluados negativamente."),
          e(Crit,{crit:"C",c:c},"Las situaciones sociales casi siempre provocan miedo/ansiedad."),
          e(Crit,{crit:"D",c:c},"Se evitan o soportan con miedo intenso."),
          e(Crit,{crit:"E",c:c},"Miedo desproporcionado a la amenaza real."),
          e(Crit,{crit:"F",c:c},"Persistente, ",e("b",null,"≥6 meses"),"."),
          e(Crit,{crit:"G",c:c},"Malestar o deterioro clínicamente significativo."),
          e(Crit,{crit:"H",c:c},"No por sustancia, enfermedad, ni otro trastorno mental."),
          e(Crit,{crit:"I",c:c},"Si hay enfermedad médica, el miedo no guarda relación o es excesivo respecto a ella.")
        ),
        tx:e("div",null,
          e(P,null,e("b",null,"Generalizada (1ª línea):")," ISRS (sertralina, paroxetina 20–50 mg/día, escitalopram, fluoxetina 10–30 mg/día) o IRSN (venlafaxina 75–225 mg/día)."),
          e(P,null,e("b",null,"Solo actuación:")," ",e("b",null,"propranolol 10–40 mg")," puntual 30–60 min antes."),
          e(P,null,e("b",null,"Psicoterapia:")," TCC + terapia conductual con exposición (desensibilización sistemática, saturación).")
        )
      }
    },
    {
      n:"06",name:"Ansiedad por separación",
      blurb:"Miedo a separarse de la figura de apego",
      sections:{
        def:e(Def,{c:c},"Miedo o ansiedad excesivos e inapropiados para el nivel del desarrollo relacionados con la ",e("b",null,"separación de las figuras de apego")," (mamá, papá, pareja). Antes del DSM-5 se diagnosticaba solo en niños; ahora puede diagnosticarse en adultos."),
        cli:e("div",null,
          e(SxList,{title:"Síntomas (≥3 de 8)",c:c,items:[
            "Malestar excesivo y recurrente al anticipar o vivir la separación",
            "Preocupación persistente por perder a las figuras de apego",
            "Preocupación persistente por experimentar un suceso que provoque la separación",
            "Resistencia o rechazo a salir (ir al colegio, trabajo) por miedo a separarse",
            "Miedo o rechazo excesivo a estar solo o sin las figuras de apego",
            "Rechazo a dormir fuera de casa o sin esa persona cerca",
            "Pesadillas repetidas sobre separación",
            "Quejas repetidas de síntomas físicos (cefaleas, dolor abdominal, náuseas, vómitos)"
          ]}),
          e(Note,{c:c,t:"Duración"},e("b",null,"≥4 semanas en niños/adolescentes")," y ",e("b",null,"≥6 meses en adultos"),".")
        ),
        dx:e(P,null,"Diagnóstico clínico por los síntomas listados + duración mínima. Causa malestar o deterioro (problemas en escuela, trabajo, relaciones sociales)."),
        tx:e(P,null,e("b",null,"1ª línea:")," terapia cognitivo-conductual + terapia familiar. ",e("b",null,"ISRS")," (fluoxetina, sertralina) en casos graves.")
      }
    },
    {
      n:"07",name:"Mutismo selectivo",
      blurb:"No habla en situaciones sociales específicas; sí habla en casa",
      sections:{
        def:e(Def,{c:c},"Fracaso constante para ",e("b",null,"hablar en situaciones sociales específicas")," (típicamente la escuela) donde se espera que hable, a pesar de hacerlo ",e("b",null,"normalmente en otros contextos")," (como en casa con familia cercana)."),
        cli:e("div",null,
          e(P,null,"Poco frecuente. Afecta principalmente a niños pequeños. En lugares como la escuela o con personas desconocidas, el niño no inicia conversación ni responde. Pero en casa o con personas de confianza habla normalmente."),
          e(Note,{c:c,t:"Diagnóstico diferencial importante"},"NO es lo mismo que timidez normal ni desconocimiento del idioma. El niño SÍ sabe hablar, pero no habla en ciertas situaciones sociales.")
        ),
        dx:e(CritBlock,{title:"Mutismo selectivo",c:c},
          e(Crit,{crit:"A",c:c},"Fracaso constante de hablar en situaciones sociales específicas donde existe expectativa de hablar, a pesar de hacerlo en otras."),
          e(Crit,{crit:"B",c:c},"Interfiere en los logros educativos, laborales o en la comunicación social."),
          e(Crit,{crit:"C",c:c},"Duración ",e("b",null,"≥1 mes")," (no limitado al primer mes del curso escolar)."),
          e(Crit,{crit:"D",c:c},"El fracaso no se debe a desconocimiento del idioma."),
          e(Crit,{crit:"E",c:c},"No se explica mejor por un trastorno de la comunicación o del espectro autista.")
        ),
        tx:e(P,null,"Trastorno difícil de tratar. ",e("b",null,"ISRS")," + ",e("b",null,"terapia conductual")," con reforzamiento positivo, desensibilización y entrenamiento en habilidades sociales.")
      }
    },
    {
      n:"08",name:"Inducido por sustancia",
      blurb:"Relación temporal clara con consumo o abstinencia",
      sections:{
        def:e(Def,{c:c},"Síntomas de ansiedad que aparecen durante o poco después de la ",e("b",null,"intoxicación o abstinencia")," de una sustancia."),
        cli:e(Table,{
          headers:[{t:"Mecanismo",c:c},{t:"Sustancias típicas",c:c}],
          rows:[
            ["Ansiedad por intoxicación","Cafeína (>250 mg), cocaína, anfetaminas, alucinógenos, cannabis, nicotina"],
            ["Ansiedad por abstinencia","Alcohol, benzodiacepinas, opioides, nicotina"],
            ["Medicamentos","Corticoides, hormonas tiroideas, broncodilatadores β-agonistas, descongestivos, levodopa, antihipertensivos"]
          ]
        }),
        dx:e(P,null,"Relación temporal clara con el consumo o abstinencia. Los síntomas remiten al retirar la sustancia o completar la desintoxicación. Descartar siempre antes de diagnosticar un trastorno primario de ansiedad."),
        tx:e(P,null,"Suspender o ajustar la sustancia causal. Manejo sintomático de la abstinencia si corresponde (benzodiacepinas por alcohol, clonidina por opioides). No se trata como ansiedad primaria.")
      }
    },
    {
      n:"09",name:"Por afección médica",
      blurb:"Ansiedad secundaria a enfermedad (tiroides, feocromocitoma, arritmia)",
      sections:{
        def:e(Def,{c:c},"Los síntomas son ",e("b",null,"consecuencia fisiopatológica directa")," de una enfermedad. Siempre descartar antes de diagnosticar un trastorno primario de ansiedad."),
        cli:e(Table,{
          headers:[{t:"Causa médica",c:c},{t:"Cómo sospecharla",c:c}],
          rows:[
            ["Hipertiroidismo","Temblor fino, taquicardia, pérdida de peso, intolerancia al calor · TSH ↓, T4 libre ↑"],
            ["Feocromocitoma","Crisis paroxísticas con HTA severa + cefalea + sudoración · metanefrinas en orina 24h"],
            ["Arritmias (TSV, FA paroxística)","Inicio y cese súbitos · ECG/Holter"],
            ["Hipoglucemia","Relación con ayuno · glucemia capilar durante crisis"],
            ["EPOC / asma","Disnea como síntoma primario · espirometría"],
            ["Insuficiencia cardíaca","Disnea de esfuerzo + edemas · eco"]
          ]
        }),
        dx:e(Pearl,{t:"Regla de oro"},"En TODO paciente con ansiedad ",e("b",null,"nueva en adulto mayor")," o ",e("b",null,"atípica"),", solicitar al menos: ",e("b",null,"TSH, ECG, glucemia y tóxicos en orina")," antes de diagnosticar un trastorno primario."),
        tx:e(P,null,"Tratar la causa médica subyacente resuelve la ansiedad en la mayoría de los casos. Puede añadirse manejo sintomático breve con ansiolíticos si el control de la causa es lento.")
      }
    }
  ];

  // Secciones generales del tema (cada una también modal)
  var s1=useState(null);var openGen=s1[0],setOpenGen=s1[1];
  var general=[
    {id:"conceptos",ic:"🧭",t:"Conceptos generales",sub:"Ansiedad normal vs trastorno",c:c,
     content:e("div",null,
       e(Def,{c:c},"La ansiedad es una ",e("b",null,"respuesta emocional normal")," ante una amenaza real o percibida que prepara al organismo para reaccionar (respuesta de ",e("b",null,"lucha o huida"),"). Se convierte en trastorno cuando es ",e("b",null,"excesiva"),", carece de causa real proporcional, ",e("b",null,"persiste en el tiempo")," e ",e("b",null,"interfiere con el funcionamiento diario"),"."),
       e(H3,{c:c},"Ansiedad normal vs trastorno"),
       e(Table,{
         headers:[{t:"Característica",c:c},{t:"Descripción",c:c}],
         rows:[
           ["Ansiedad normal","Respuesta adaptativa ante un estímulo real. Proporcional al peligro. Transitoria y autolimitada"],
           ["Trastorno de ansiedad","Excesiva, desproporcionada o sin causa real. Persistente (semanas a meses). Interfiere con la vida diaria"],
           ["Criterio de duración general","Generalmente ≥ 6 meses en adultos (varía según el trastorno específico)"],
           ["Síntomas físicos comunes","Palpitaciones, sudoración, temblor, tensión muscular, disnea, mareo, sensación de peligro inminente"]
         ]
       }),
       e(Alert,{c:C.warn,label:"⚠️ Concepto clave"},"La ansiedad se vuelve ",e("b",null,"PATOLÓGICA")," cuando es excesiva, no tiene causa real proporcional, dura mucho tiempo y ",e("b",null,"DETERIORA")," el funcionamiento social, laboral o familiar del paciente."),
       e(H3,{c:c,mt:18},"Las 10 entidades DSM-5"),
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"Característica central",c:c}],
         rows:[
           ["Ansiedad por separación","Miedo excesivo e inapropiado a separarse de la figura de apego"],
           ["Mutismo selectivo","Incapacidad para hablar en situaciones sociales específicas pese a poder hacerlo en otros contextos"],
           ["Fobia específica","Temor irracional, intenso y desproporcionado a un objeto o situación concreta"],
           ["Ansiedad social (fobia social)","Miedo intenso a situaciones de escrutinio social; temor a la humillación"],
           ["Trastorno de pánico","Ataques de pánico inesperados y recurrentes con repercusión psicológica o conductual"],
           ["Agorafobia","Miedo a situaciones donde escapar sería difícil; a menudo asociada al trastorno de pánico"],
           ["TAG","Preocupación excesiva y difícil de controlar sobre múltiples áreas, ≥ 6 meses"],
           ["Inducido por sustancias","Ansiedad secundaria a intoxicación o abstinencia de sustancias o medicamentos"],
           ["Por afección médica","Ansiedad directamente causada por una enfermedad orgánica"],
           ["Otro / No especificado","Cuadros que no cumplen criterios completos para ninguna categoría anterior"]
         ]
       })
     )},
    {id:"crisis",ic:"💥",t:"Crisis de pánico",sub:"Especificador · 13 síntomas por sistema",c:c,
     content:e("div",null,
       e(Def,{c:c},"Aparición súbita de miedo o malestar intensos que alcanza su pico en pocos minutos (<10 min) y cede en <30 min. Para contarla, deben aparecer ",e("b",null,"≥ 4 de 13 síntomas"),"."),
       e(Alert,{c:C.bad,label:"⚠️ Punto clave"},"La crisis de pánico ",e("b",null,"NO es un trastorno")," por sí sola. Es un ",e("b",null,"especificador")," que se puede añadir a cualquier diagnóstico. SOLO cuando son ",e("b",null,"inesperadas y recurrentes")," se diagnostica trastorno de pánico."),
       e(H3,{c:c},"Los 13 síntomas (≥4) organizados por sistema"),
       e(Table,{
         headers:[{t:"Sistema",c:c},{t:"Síntoma",c:c},{t:"Descripción",c:c}],
         rows:[
           ["Cardiovascular","Palpitaciones / pulso saltón","Taquicardia o sensación de latidos fuertes"],
           ["Tegumentario","Sudoración","Diaforesis generalizada"],
           ["Motor","Temblores o sacudidas","Temblor fino o grueso de extremidades"],
           ["Respiratorio","Disnea / sofocamiento","Dificultad para respirar, sensación de ahogo"],
           ["Respiratorio","Sensación de ahogamiento","Opresión o cierre de garganta"],
           ["Cardíaco","Dolor precordial","Dolor en el pecho que simula cardiopatía"],
           ["Gastrointestinal","Náuseas / malestar abdominal","Sensación de mariposas o dolor difuso"],
           ["Neurológico","Mareo / inestabilidad / desmayo","Presíncope, sensación de flotar"],
           ["Térmico","Escalofríos o calor","Oleadas de frío o calor intenso"],
           ["Sensorial","Parestesias","Entumecimiento u hormigueo en extremidades o cara"],
           ["Perceptivo","Desrealización / despersonalización","Sensación de que el mundo es irreal o de estar separado de uno mismo"],
           ["Cognitivo","Miedo a perder el control","Temor a 'volverse loco'"],
           ["Cognitivo","Miedo a morir","Convicción de muerte inminente"]
         ]
       }),
       e(Note,{c:c,t:"Tipos de crisis"},e("b",null,"Inesperada (espontánea):")," sin disparador · definen el trastorno de pánico. · ",e("b",null,"Esperada (situacional):")," en respuesta a estímulo fóbico conocido · fobias, TEPT, etc.")
     )},
    {id:"rx",ic:"💊",t:"Tratamiento · resumen del tema",sub:"Dosis + reglas de oro",c:c,
     content:e("div",null,
       e(P,null,"Resumen compacto. El detalle por enfermedad está en cada ficha."),
       e(H3,{c:c},"TAG y Trastorno de pánico"),
       e(Table,{
         headers:[{t:"Línea",c:c},{t:"Fármaco",c:c},{t:"Dosis",c:c}],
         rows:[
           ["1ª línea","Sertralina (ISRS)","50–200 mg/día"],
           ["1ª línea","Escitalopram (ISRS)","10–20 mg/día"],
           ["1ª línea","Venlafaxina XR (IRSN)","75–225 mg/día"],
           ["1ª línea","Duloxetina (IRSN · solo TAG)","60–120 mg/día"],
           ["2ª línea / coadyuvante","Pregabalina","150–600 mg/día"],
           ["2ª línea / coadyuvante","Buspirona (solo TAG)","15–60 mg/día"],
           ["Puente ≤4–6 sem","Clonazepam","0.5–2 mg/día"],
           ["Puente ≤4–6 sem","Alprazolam","0.25–3 mg/día"]
         ]
       }),
       e(H3,{c:c},"Fobia social"),
       e(Table,{
         headers:[{t:"Situación",c:c},{t:"Fármaco",c:c},{t:"Dosis",c:c}],
         rows:[
           ["Generalizada (1ª línea)","Sertralina, paroxetina, escitalopram","Igual que en pánico/TAG"],
           ["Generalizada (alternativa)","Venlafaxina XR","75–225 mg/día"],
           ["Solo actuación","Propranolol (30–60 min antes)","10–40 mg puntual"]
         ]
       }),
       e(H3,{c:c},"Fobia específica"),
       e(P,null,"NO hay tratamiento farmacológico de primera línea. El tratamiento de elección es la ",e("b",null,"exposición in vivo (TCC)"),"."),
       e(Alert,{c:C.warn,label:"🔑 Reglas de oro"},
         e("ol",{style:{margin:0,paddingLeft:20,lineHeight:1.8,fontSize:13}},
           e("li",null,"Iniciar ISRS a ",e("b",null,"MITAD de dosis")," → la 'activación inicial' (↑ansiedad 7–14 días) es lo que más los hace abandonar."),
           e("li",null,"Respuesta completa: ",e("b",null,"6–12 semanas"),". No cambies antes."),
           e("li",null,"Mantener ≥12 meses después de remisión total. Retirar gradualmente (25% cada 2–4 sem)."),
           e("li",null,"BZD: solo como ",e("b",null,"puente corto (≤4–6 sem)"),". Evitar en: consumo previo, SAOS, adultos mayores, embarazo."),
           e("li",null,"TCC es equivalente o superior a fármacos en ansiedad — ofrecerla siempre.")
         )
       )
     )},
    {id:"ddx",ic:"🧭",t:"Diagnóstico diferencial",sub:"Orden de descarte",c:c,
     content:e("div",null,
       e(P,null,"Antes de diagnosticar un trastorno primario, descartar en orden:"),
       e(Table,{
         headers:[{t:"Prioridad",c:c},{t:"A descartar",c:c},{t:"Cómo",c:c}],
         rows:[
           ["1","Causa médica","TSH, ECG, glucemia, metanefrinas si HTA paroxística"],
           ["2","Sustancias","Tóxicos en orina · historia de consumo · cafeína"],
           ["3","Medicamentos","Revisar lista (corticoides, β-agonistas, levodopa)"],
           ["4","Otro trastorno mental","TEPT (trauma), TOC (obsesiones), depresión, psicosis"],
           ["5","Recién, diagnosticar","Trastorno de ansiedad primario"]
         ]
       })
     )},
    {id:"perlas",ic:"📌",t:"Perlas para el examen",sub:"Alto rendimiento",c:c,
     content:e("div",null,
       e(Pearl,{t:"Pánico ≠ agorafobia desde DSM-5"},"En CIE-10 eran un solo diagnóstico. En DSM-5 son ",e("b",null,"independientes"),". Pueden codiagnosticarse."),
       e(Pearl,{t:"SID = bradicardia"},"Única fobia con respuesta vasovagal bifásica. Técnica: ",e("b",null,"tensión aplicada"),"."),
       e(Pearl,{t:"Paroxetina — el villano discreto"},"ISRS más sedante y con ",e("b",null,"peor síndrome de discontinuación"),". Evitarla en embarazo (clase D FDA)."),
       e(Pearl,{t:"Propranolol"},"Útil SOLO en fobia social tipo actuación. NO sirve en fobia social generalizada ni en TAG ni en pánico."),
       e(Pearl,{t:"TAG + depresión"},"Comorbilidad >60%. Un solo ISRS o IRSN trata ambas."),
       e(Pearl,{t:"Buspirona"},"Coadyuvante SOLO en TAG. Sin utilidad en pánico ni fobias. No produce dependencia."),
       e(Pearl,{t:"Mutismo selectivo"},"Se mudó de 'trastornos de la infancia' a este capítulo en DSM-5 porque se reconoce su naturaleza ansiosa.")
     )},
    {id:"quiz",ic:"❓",t:"Quiz · 6 casos clínicos",sub:"Prueba tus conocimientos",c:c,
     content:e(Quiz,{c:c,items:getAllQuiz("anxiety")})},
    {id:"resumen",ic:"📊",t:"Resumen comparativo",sub:"Todas las entidades en una tabla",c:c,
     content:e("div",null,
       e(P,null,"Tabla de repaso final. Si aprendes solo esto, sabes diferenciar las 7 grandes entidades del capítulo."),
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"Característica central",c:c},{t:"Tratamiento de elección",c:c}],
         rows:[
           ["Ansiedad por separación","Miedo a separarse de la figura de apego. Niños ≥4 sem; adultos ≥6 m","ISRS (fluoxetina, sertralina) en casos moderados-graves"],
           ["Mutismo selectivo","No habla en situaciones sociales específicas. Duración ≥1 mes","ISRS + terapia conductual"],
           ["Fobia específica","Temor irracional a objeto/situación concreta. Prevalencia ~11%. Inicio <12 años","TCC con exposición (1ª línea). No suele requerir fármacos"],
           ["Fobia social","Miedo al escrutinio social. Prevalencia ~13%. Crónico","ISRS/IRSN + TCC. β-bloqueadores a corto plazo (subtipo actuación)"],
           ["Trastorno de pánico","Ataques inesperados recurrentes + ≥1 mes de repercusión. Prevalencia 2–5%","ISRS/IRSN ≥1 año. TCC. BZD de rescate"],
           ["Agorafobia","Miedo a situaciones de difícil escape. A menudo con pánico. ≥6 m","Igual que pánico + terapia de exposición gradual"],
           ["TAG","Preocupación excesiva, múltiple, ≥6 m. Prevalencia 4–7%","ISRS, IRSN, buspirona. BZD solo a corto plazo"]
         ]
       })
     )},
    {id:"flash",ic:"🃏",t:"Flashcards",sub:"15 preguntas de estudio",c:c,
     content:e("div",null,
       e(P,null,"Tarjetas de repaso estilo examen. Toca la tarjeta o el botón para revelar la respuesta. Navega con los controles o salta a cualquier pregunta desde la cuadrícula inferior."),
       e(FlashDeck,{c:c,deckId:"anxiety",items:getAllCards("anxiety")})
     )}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Tema 1 · DSM-5-TR",title:"Trastornos de ansiedad"},
      "El ",e("b",null,"miedo")," es la respuesta emocional a una amenaza ",e("i",null,"real o inminente"),". La ",e("b",null,"ansiedad")," es la anticipación de una amenaza ",e("i",null,"futura"),". Cuando son desproporcionadas, persistentes y limitan la vida, hablamos de trastorno. En DSM-5-TR este capítulo incluye ",e("b",null,"9 entidades"),"."
    ),

    // === LAS 9 ENFERMEDADES COMO GRID ===
    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.3),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Información general + Quiz")
    ),
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginTop:10}},
      general.map(function(g,i){
        return e("button",{key:g.id,onClick:function(){setOpenGen(i);},style:{padding:"14px 12px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:10,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:4,minHeight:90}},
          e("div",{style:{fontSize:22,marginBottom:4}},g.ic),
          e("div",{style:{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Playfair Display"}},g.t),
          e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.4,marginTop:2}},g.sub)
        );
      })
    ),
    openGen!==null?e(DzModal,{c:general[openGen].c,name:general[openGen].t,kicker:"Sección del tema",single:general[openGen].content,onClose:function(){setOpenGen(null);}}):null,

    // === SECCIONES GENERALES DEL TEMA ===
    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.15)+","+ax(c,.04)+" 90%)",border:"1px solid "+ax(c,.35),borderRadius:14,margin:"18px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Las 9 enfermedades"),
      e("div",{style:{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Toca cualquier enfermedad para abrir su ficha"),
      e("div",{style:{fontSize:12,color:C.mt,marginTop:4,lineHeight:1.45}},"Cada ficha tiene tabs: Definición · Clínica · Diagnóstico · Tratamiento")
    ),
    e(DzGrid,{c:c,items:diseases}),

    e(Abbrev,{c:c,items:[
      {a:"DSM-5-TR",d:"Manual Diagnóstico y Estadístico, 5ª ed., revisión de texto (2022)"},
      {a:"TAG",d:"Trastorno de Ansiedad Generalizada"},
      {a:"SID",d:"Sangre-Inyección-Daño (subtipo de fobia específica)"},
      {a:"ISRS",d:"Inhibidores Selectivos de la Recaptación de Serotonina"},
      {a:"IRSN",d:"Inhibidores de Recaptación de Serotonina y Noradrenalina"},
      {a:"BZD",d:"Benzodiacepinas"},
      {a:"TCC",d:"Terapia Cognitivo-Conductual"},
      {a:"DDx",d:"Diagnóstico diferencial"},
      {a:"TSH",d:"Hormona estimulante del tiroides (tirotropina)"},
      {a:"ECG",d:"Electrocardiograma"},
      {a:"TDM",d:"Trastorno Depresivo Mayor"}
    ]})
  );
}


// ══════════════════════════════════════════════════════════════
// PSICOSIS · Esquizofrenia, T. delirante, Bipolar, Depresión mayor
// ══════════════════════════════════════════════════════════════

function PsicosisView(){
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
          e(Alert,{c:C.bad,label:"⚠️ Trampa"},"La ",e("b",null,"clozapina")," es el único antipsicótico eficaz en esquizofrenia resistente pero tiene riesgo de ",e("b",null,"agranulocitosis fatal"),". Requiere hemograma semanal inicial luego mensual.")
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

  var s1=useState(null);var openGen=s1[0],setOpenGen=s1[1];
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
    e(Hero,{c:c,kicker:"Psicosis · Salud Mental II",title:"Trastornos psicóticos"},
      "Grupo de trastornos caracterizados por ",e("b",null,"pérdida del contacto con la realidad"),": delirios, alucinaciones, pensamiento desorganizado. El ",e("b",null,"espectro esquizofrénico")," se distingue principalmente por la ",e("b",null,"duración")," de los síntomas. Incluye también los trastornos del estado de ánimo graves (bipolar y depresión mayor) en la clasificación clínica que seguimos."
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.3),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Conceptos, fármacos + Quiz + Flashcards")
    ),
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginTop:10}},
      general.map(function(g,i){
        return e("button",{key:g.id,onClick:function(){setOpenGen(i);},style:{padding:"14px 12px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:10,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:4,minHeight:90}},
          e("div",{style:{fontSize:22,marginBottom:4}},g.ic),
          e("div",{style:{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Playfair Display"}},g.t),
          e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.4,marginTop:2}},g.sub)
        );
      })
    ),
    openGen!==null?e(DzModal,{c:general[openGen].c,name:general[openGen].t,kicker:"Sección del tema",single:general[openGen].content,onClose:function(){setOpenGen(null);}}):null,

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
      e("div",{style:{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Toca cualquier enfermedad para abrir su ficha"),
      e("div",{style:{fontSize:12,color:C.mt,marginTop:4,lineHeight:1.45}},"Cada ficha tiene tabs: Definición · Clínica · Diagnóstico · Tratamiento")
    ),
    e(DzGrid,{c:c,items:diseases}),

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


function OCDView(){
  var c=C.toc;
  var diseases=[
    {
      n:"01",name:"Trastorno obsesivo-compulsivo (TOC)",
      blurb:"Obsesiones (pensamientos intrusivos) + compulsiones (rituales)",
      sections:{
        def:e("div",null,
          e(Def,{c:c},e("b",null,"Obsesión:")," pensamiento, impulso o imagen ",e("b",null,"recurrente y persistente"),", vivido como ",e("b",null,"intrusivo y no deseado"),", que genera ansiedad/malestar marcados. El paciente intenta ",e("b",null,"ignorarlos, suprimirlos o neutralizarlos")," con otro pensamiento o acción."),
          e(Def,{c:c},e("b",null,"Compulsión:")," conducta (lavarse, comprobar, ordenar) o acto mental (contar, rezar, repetir palabras en silencio) que el paciente realiza ",e("b",null,"en respuesta a una obsesión")," o siguiendo reglas rígidas. Buscan ",e("b",null,"reducir la ansiedad")," o ",e("b",null,"evitar un suceso temido"),", pero ",e("b",null,"no están conectadas de forma realista")," con lo que intentan neutralizar, o son claramente excesivas.")
        ),
        cli:e("div",null,
          e(H3,{c:c},"Epidemiología"),
          e(P,null,"Prevalencia de por vida ~2–3%. Ligeramente más frecuente en mujeres en adultos; en niños, más en varones. Doble pico de inicio: ~10 años (más grave, asociado a tics) y ~20 años. Curso crónico con fluctuaciones. Comorbilidad con depresión (>60%), otros trastornos de ansiedad, Tourette."),
          e(H3,{c:c,mt:14},"Especificadores de introspección"),
          e(Table,{
            headers:[{t:"Nivel",c:c},{t:"Cómo vive sus creencias",c:c}],
            rows:[
              ["Con buena / aceptable introspección","Reconoce que sus creencias son probablemente NO ciertas o pueden serlo"],
              ["Con poca introspección","Piensa que sus creencias son probablemente SÍ ciertas"],
              ["Con ausencia / creencias delirantes","Está completamente convencido de la veracidad de sus creencias"],
              ["Relacionado con tics","Antecedente actual o pasado de tics (paciente o su historia personal)"]
            ]
          }),
          e(H3,{c:c,mt:14},"Las 4 dimensiones clínicas (subtipos sintomáticos)"),
          e(P,null,"La mayoría de pacientes tienen síntomas de más de una dimensión. No son categorías formales pero orientan la terapia de exposición."),
          e(Table,{
            headers:[{t:"Dimensión",c:c},{t:"Obsesión típica",c:c},{t:"Compulsión típica",c:c}],
            rows:[
              ["Contaminación","Miedo a gérmenes, suciedad, enfermedades, tóxicos","Lavado de manos prolongado, limpieza ritual, evitar tocar objetos"],
              ["Simetría / orden / 'just right'","Malestar intolerable si las cosas están desordenadas o asimétricas","Ordenar, alinear, repetir acciones hasta que se 'sienta bien'"],
              ["Daño / responsabilidad","Miedo a causar daño sin querer (atropellar, dejar gas abierto, incendio)","Comprobación compulsiva (puertas, enchufes, volver al lugar a verificar)"],
              ["Contenido prohibido / tabú","Pensamientos intrusivos sexuales, religiosos, violentos","Actos mentales, rezar, pedir reaseguro, evitar situaciones"]
            ]
          })
        ),
        dx:e(CritBlock,{title:"TOC",c:c},
          e(Crit,{crit:"A",c:c},"Presencia de ",e("b",null,"obsesiones, compulsiones, o ambas"),"."),
          e(Crit,{crit:"B",c:c},"Las obsesiones o compulsiones requieren ",e("b",null,"mucho tiempo")," (>1 h/día) o causan malestar o deterioro clínicamente significativos."),
          e(Crit,{crit:"C",c:c},"No atribuibles a sustancia ni enfermedad médica."),
          e(Crit,{crit:"D",c:c},"No se explican mejor por otro trastorno mental (preocupaciones del TAG, imagen corporal del TDC, acumulación, arrancarse pelo, etc.).")
        ),
        tx:e("div",null,
          e(H3,{c:c},"Regla de oro"),
          e(P,null,e("b",null,"ISRS a dosis ALTAS (doble que en depresión)")," + ",e("b",null,"TCC con EPR"),". La respuesta completa tarda ",e("b",null,"10–12 semanas"),", no 4–6 como en depresión. Objetivo: reducir síntomas 25–35% — no 'curar'."),
          e(H3,{c:c,mt:14},"Farmacología por línea"),
          e(Table,{
            headers:[{t:"Línea",c:c},{t:"Fármaco",c:c},{t:"Dosis para TOC",c:c}],
            rows:[
              ["1ª línea · ISRS","Fluoxetina","40–80 mg/día"],
              ["1ª línea","Sertralina","100–200 mg/día"],
              ["1ª línea","Fluvoxamina","100–300 mg/día"],
              ["1ª línea","Paroxetina","40–60 mg/día"],
              ["1ª línea","Escitalopram","20–40 mg/día"],
              ["2ª línea · ADT","Clomipramina","25–250 mg/día (máxima eficacia histórica, peor tolerancia)"],
              ["3ª línea · augmentación","Risperidona","0.5–3 mg/día (añadir a ISRS)"],
              ["3ª línea · augmentación","Aripiprazol","5–15 mg/día (especialmente si tics)"],
              ["Refractario","EMT, ECT, estimulación cerebral profunda","Cápsula interna anterior / núcleo accumbens"]
            ]
          }),
          e(H3,{c:c,mt:14},"Psicoterapia: la EPR"),
          e(Def,{c:c},e("b",null,"Exposición y Prevención de Respuesta (EPR):")," exposición gradual al disparador obsesivo + ",e("b",null,"impedir la compulsión"),". Con el tiempo la ansiedad baja sola por habituación. Es el ",e("b",null,"gold standard")," psicoterapéutico, equivalente o superior a fármacos aislados."),
          e(Alert,{c:C.warn,label:"🔑 Puntos clave"},
            e("ol",{style:{margin:0,paddingLeft:20,lineHeight:1.8,fontSize:13}},
              e("li",null,"Dosis ",e("b",null,"ALTAS")," (doble que depresión)."),
              e("li",null,"Respuesta tarda ",e("b",null,"10–12 semanas"),". NO cambies antes si hay mejoría parcial a las 6 sem."),
              e("li",null,"Mantener ",e("b",null,"1–2 años")," mínimo tras remisión."),
              e("li",null,"Combinar con EPR SIEMPRE que sea posible."),
              e("li",null,"BZD NO son de primera línea y NO tratan las obsesiones.")
            )
          )
        )
      }
    },
    {
      n:"02",name:"Trastorno dismórfico corporal (TDC)",
      blurb:"Preocupación por defecto físico no observable",
      sections:{
        def:e(Def,{c:c},"Preocupación por ",e("b",null,"defectos o imperfecciones percibidos en la apariencia física")," que son ",e("b",null,"no observables o aparecen leves")," a otras personas. El paciente realiza comportamientos repetitivos (mirarse al espejo, acicalarse excesivamente, pellizcarse la piel, compararse) o actos mentales (comparar su apariencia con otros)."),
        cli:e("div",null,
          e(H3,{c:c},"Áreas típicas y subtipo especial"),
          e(Table,{
            headers:[{t:"Aspecto",c:c},{t:"Detalle",c:c}],
            rows:[
              ["Áreas más frecuentes","Piel (acné, cicatrices) · pelo · nariz · dientes · peso · cara · músculos"],
              ["Subtipo dismorfia muscular","Predominio en varones. Creencia de cuerpo insuficientemente musculoso. Asociado a ejercicio excesivo, anabólicos, dieta restrictiva"],
              ["Introspección","Especificar: con buena/aceptable · con poca · con ausente/delirante (mayoría tiene poca o nula)"],
              ["Comorbilidad","Depresión mayor, trastornos por uso de sustancias, ansiedad social, TOC"]
            ]
          }),
          e(Alert,{c:C.bad,label:"⚠️ Trampa CRÍTICA"},"El paciente con TDC ",e("b",null,"SIEMPRE pide cirugía cosmética"),". ",e("b",null,"Nunca autorizarla"),". La cirugía EMPEORA el cuadro: el cerebro reinterpreta el nuevo aspecto como otro defecto. Riesgo suicida ~4× mayor — ",e("b",null,"screening obligatorio"),".")
        ),
        dx:e(CritBlock,{title:"Trastorno dismórfico corporal",c:c},
          e(Crit,{crit:"A",c:c},"Preocupación por ≥1 defectos o imperfecciones percibidos en la apariencia física que no son observables o parecen sin importancia a otras personas."),
          e(Crit,{crit:"B",c:c},"En algún momento, el individuo ha realizado comportamientos repetitivos (mirarse al espejo, acicalarse en exceso, pellizcarse la piel, buscar reaseguro) o actos mentales (compararse con otros)."),
          e(Crit,{crit:"C",c:c},"La preocupación causa malestar o deterioro clínicamente significativo."),
          e(Crit,{crit:"D",c:c},"La preocupación NO se explica mejor por inquietud por el peso o grasa corporal en un paciente con trastorno de la conducta alimentaria.")
        ),
        tx:e("div",null,
          e(P,null,e("b",null,"Idéntico al TOC"),": ISRS a dosis altas (fluoxetina 40–80, sertralina 150–200) + TCC específica para TDC. Fluoxetina es la más estudiada."),
          e(Pearl,{t:"Screening suicidio"},"Riesgo suicida ~4× mayor que población general. Evaluar siempre ideación e intentos previos.")
        )
      }
    },
    {
      n:"03",name:"Trastorno de acumulación (hoarding)",
      blurb:"Dificultad para descartar posesiones · congestión vital",
      sections:{
        def:e(Def,{c:c},"Dificultad persistente de ",e("b",null,"descartar o desprenderse de posesiones"),", independientemente de su valor real, por una necesidad percibida de guardarlas y por malestar asociado a desprenderse. Como consecuencia, se acumulan posesiones que congestionan espacios y alteran el uso funcional de las áreas vivas."),
        cli:e("div",null,
          e(P,null,"Desde DSM-5 es diagnóstico independiente (antes era subtipo de TOC). Prevalencia ~2–6%."),
          e(Note,{c:c,t:"Especificador"},e("b",null,"Con adquisición excesiva:")," ~80–90% también compran, roban o recolectan en exceso objetos que no necesitan.")
        ),
        dx:e(CritBlock,{title:"Trastorno de acumulación",c:c},
          e(Crit,{crit:"A",c:c},"Dificultad persistente de desprenderse o descartar posesiones, independientemente de su valor real."),
          e(Crit,{crit:"B",c:c},"Esta dificultad se debe a una necesidad percibida de guardarlas y al malestar que produce desecharlas."),
          e(Crit,{crit:"C",c:c},"Como consecuencia, ",e("b",null,"se acumulan posesiones que congestionan")," las zonas habitables y comprometen sustancialmente su uso. Si las zonas viven despejadas, es por intervención de terceros."),
          e(Crit,{crit:"D",c:c},"Causa malestar o deterioro clínicamente significativos."),
          e(Crit,{crit:"E",c:c},"No atribuible a afección médica (ej: lesión cerebral, Prader-Willi)."),
          e(Crit,{crit:"F",c:c},"No se explica mejor por otro trastorno mental (obsesiones del TOC, depresión, delirios, demencia).")
        ),
        tx:e("div",null,
          e(Pearl,{t:"Respuesta a ISRS pobre"},"La respuesta a ISRS es ",e("b",null,"muy inferior")," a la del TOC clásico. Mejor respuesta a ",e("b",null,"TCC específica para acumulación"),": entrenamiento en toma de decisiones, exposición a descarte, reestructuración cognitiva sobre el valor de los objetos.")
        )
      }
    },
    {
      n:"04",name:"Tricotilomanía",
      blurb:"Arrancarse el pelo recurrente con alopecia",
      sections:{
        def:e(Def,{c:c},"Arrancarse el cabello de forma ",e("b",null,"recurrente"),", con la consiguiente pérdida de cabello. El paciente ha intentado repetidamente ",e("b",null,"reducir o abandonar")," la conducta."),
        cli:e("div",null,
          e(P,null,"Áreas típicas: cuero cabelludo, cejas, pestañas, zona púbica. Puede haber ",e("b",null,"tricofagia")," (ingerir pelo) y rara vez ",e("b",null,"tricobezoar")," (masa de pelo en tracto GI que puede requerir cirugía). Inicio típico en pubertad.")
        ),
        dx:e(CritBlock,{title:"Tricotilomanía",c:c},
          e(Crit,{crit:"A",c:c},"Arrancarse el cabello de forma recurrente, con pérdida consecuente."),
          e(Crit,{crit:"B",c:c},"Intentos repetidos de disminuir o detener la conducta."),
          e(Crit,{crit:"C",c:c},"Malestar o deterioro clínico."),
          e(Crit,{crit:"D",c:c},"No atribuible a otra afección médica (ej: dermatológica)."),
          e(Crit,{crit:"E",c:c},"No se explica mejor por síntomas de otro trastorno mental (ej: TDC).")
        ),
        tx:e("div",null,
          e(SxList,{c:c,items:[
            "1ª línea: Terapia de Reversión de Hábito (TRH)",
            "N-acetilcisteína 1200–2400 mg/día — modulación glutamatérgica, buena evidencia y tolerancia",
            "ISRS eficacia limitada comparada con TRH",
            "Clomipramina como alternativa"
          ]})
        )
      }
    },
    {
      n:"05",name:"Trastorno de excoriación",
      blurb:"Pellizcarse la piel con lesiones",
      sections:{
        def:e(Def,{c:c},"Dañarse la piel de forma recurrente (rascarse, pellizcarse) produciendo lesiones cutáneas. El paciente ha intentado repetidamente reducir la conducta."),
        cli:e(P,null,"Áreas típicas: cara, brazos, manos. Alta comorbilidad con TOC. El paciente siente urgencia previa y alivio o gratificación al realizar la conducta."),
        dx:e(CritBlock,{title:"Trastorno de excoriación",c:c},
          e(Crit,{crit:"A",c:c},"Dañarse la piel de forma recurrente produciendo lesiones."),
          e(Crit,{crit:"B",c:c},"Intentos repetidos de reducir o detener la conducta."),
          e(Crit,{crit:"C",c:c},"Malestar o deterioro clínico."),
          e(Crit,{crit:"D",c:c},"No atribuible a sustancia (cocaína produce picor) ni afección médica (sarna, dermatitis)."),
          e(Crit,{crit:"E",c:c},"No se explica mejor por otro trastorno mental (delirio parasitario, TDC, autolesión no suicida, estereotipias).")
        ),
        tx:e(P,null,"TRH · N-acetilcisteína 1200–2400 mg/día · ISRS. Patrón similar a tricotilomanía.")
      }
    },
    {
      n:"06",name:"Inducido por sustancia o medicamento",
      blurb:"Obsesiones/compulsiones en contexto de consumo",
      sections:{
        def:e(Def,{c:c},"Síntomas obsesivo-compulsivos que aparecen durante o poco después de la intoxicación o abstinencia de una sustancia."),
        cli:e(P,null,"Principales causas: estimulantes (cocaína, anfetaminas), cannabis crónico, algunos antipsicóticos paradójicos. El cuadro remite al retirar la sustancia."),
        dx:e(P,null,"Relación temporal clara con el consumo. Los síntomas superan lo esperable para la intoxicación aislada. No se explica mejor por un TOC primario preexistente."),
        tx:e(P,null,"Suspender o ajustar la sustancia causal. Manejo sintomático si corresponde. No se trata como TOC primario.")
      }
    },
    {
      n:"07",name:"Debido a otra afección médica",
      blurb:"Síntomas secundarios a enfermedad orgánica",
      sections:{
        def:e(Def,{c:c},"Síntomas obsesivo-compulsivos como ",e("b",null,"consecuencia fisiopatológica directa")," de una enfermedad neurológica o médica."),
        cli:e(Table,{
          headers:[{t:"Causa",c:c},{t:"Detalle",c:c}],
          rows:[
            ["PANDAS","TOC pediátrico de inicio SÚBITO post-faringitis estreptocócica (P.A.N.D.A.S.)"],
            ["Corea de Sydenham","Asociación clásica con TOC en infancia"],
            ["Lesiones de ganglios basales","ACV, tumores, encefalitis que afectan circuito frontoestriado"],
            ["Esclerosis múltiple","Placas en regiones frontales/estriadas"],
            ["TCE","Trauma que afecte frontal/estriado"]
          ]
        }),
        dx:e(P,null,"Evidencia clara por historia, examen físico o pruebas complementarias de que el trastorno es consecuencia directa de la enfermedad. Descartar causas primarias antes."),
        tx:e("div",null,
          e(P,null,"Tratar la causa subyacente. En PANDAS: antibiótico (penicilina) + manejo estándar del TOC."),
          e(Pearl,{t:"PANDAS"},"Siglas: ",e("b",null,"P"),"ediatric ",e("b",null,"A"),"utoimmune ",e("b",null,"N"),"europsychiatric ",e("b",null,"D"),"isorders ",e("b",null,"A"),"ssociated with ",e("b",null,"S"),"treptococcus. Pregunta casi garantizada en examen si ves niño con TOC súbito post-faringitis.")
        )
      }
    }
  ];

  var s1=useState(null);var openGen=s1[0],setOpenGen=s1[1];
  var general=[
    {id:"conceptos",ic:"🧭",t:"Conceptos generales",sub:"Del capítulo TOC y espectro",c:c,
     content:e("div",null,
       e(P,null,"Este capítulo fue creado en DSM-5 (antes el TOC estaba en ansiedad). Se agrupan aquí porque comparten neurobiología (circuito órbito-fronto-estriatal hiperactivo), fenomenología (pensamientos/preocupaciones repetitivos + conductas repetitivas) y respuesta a tratamiento (ISRS a dosis altas, TCC con EPR). Son ",e("b",null,"7 entidades"),"."),
       e(H3,{c:c,mt:14},"Las 7 entidades"),
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"Núcleo fenomenológico",c:c},{t:"Conducta repetitiva",c:c}],
         rows:[
           ["TOC","Obsesiones (pensamientos intrusivos)","Compulsiones (conductas/actos mentales)"],
           ["TDC","Preocupación por defecto físico percibido","Mirarse al espejo, comparar, retoques"],
           ["Hoarding","Dificultad para descartar posesiones","Adquisición y retención excesivas"],
           ["Tricotilomanía","Urgencia de arrancarse el pelo","Arrancarse el cabello recurrente"],
           ["Excoriación","Urgencia de pellizcarse la piel","Rascarse/pellizcarse hasta lesionar"],
           ["Inducido por sustancia","Secundario a consumo/abstinencia","—"],
           ["Por afección médica","Secundario a enfermedad (PANDAS, lesión estriatal)","—"]
         ]
       })
     )},
    {id:"ddx",ic:"🧭",t:"Diagnóstico diferencial",sub:"Cómo distinguir el TOC",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Pista clave",c:c},{t:"Dx probable",c:c}],
         rows:[
           ["Preocupación por enfermedad grave + síntomas somáticos leves/ausentes","IAD (capítulo somáticos), no TOC"],
           ["Rumiaciones tristes + anhedonia","Depresión mayor con rumiaciones, no TOC"],
           ["Pensamientos sobre apariencia + mirarse al espejo","TDC, no TOC"],
           ["Preocupaciones excesivas sobre múltiples temas reales, no ritualizadas","TAG, no TOC"],
           ["Pensamientos intrusivos tras trauma + re-experimentación","TEPT, no TOC"],
           ["Estereotipias motoras sin obsesión subyacente","Trastorno de movimientos estereotipados"],
           ["Creencias bizarras fijas sin ego-distonía","Trastorno delirante / psicosis"]
         ]
       })
     )},
    {id:"tx",ic:"💊",t:"Tratamiento · resumen del tema",sub:"ISRS dosis altas + EPR",c:c,
     content:e("div",null,
       e(H3,{c:c},"Dosis de ISRS para TOC (doble que depresión)"),
       e(Table,{
         headers:[{t:"Fármaco",c:c},{t:"TOC",c:c},{t:"Depresión (referencia)",c:c}],
         rows:[
           ["Fluoxetina","40–80 mg/día","20 mg/día"],
           ["Sertralina","100–200 mg/día","50 mg/día"],
           ["Fluvoxamina","100–300 mg/día","—"],
           ["Paroxetina","40–60 mg/día","20 mg/día"],
           ["Escitalopram","20–40 mg/día","10 mg/día"],
           ["Clomipramina (ADT)","25–250 mg/día","—"]
         ]
       }),
       e(Alert,{c:C.warn,label:"🔑 Reglas de oro"},
         e("ol",{style:{margin:0,paddingLeft:20,lineHeight:1.8,fontSize:13}},
           e("li",null,"Dosis ALTAS (doble que depresión)."),
           e("li",null,"Respuesta completa ",e("b",null,"10–12 semanas"),". No cambies antes."),
           e("li",null,"Mantener ",e("b",null,"1–2 años")," mínimo tras remisión."),
           e("li",null,"Combinar con EPR SIEMPRE que sea posible."),
           e("li",null,"Refractarios: augmentación con risperidona 0.5–3 mg o aripiprazol 5–15 mg. Si tics, preferir aripiprazol.")
         )
       )
     )},
    {id:"perlas",ic:"📌",t:"Perlas de examen",sub:"Alto rendimiento",c:c,
     content:e("div",null,
       e(Pearl,{t:"Dosis TOC = doble que depresión"},"Sertralina depresión: 50–100 mg. Sertralina TOC: 150–200 mg. Fluoxetina depresión: 20 mg. Fluoxetina TOC: 40–80 mg."),
       e(Pearl,{t:"Respuesta tarda 10–12 semanas"},"No cambies de fármaco a las 6 semanas si hay mejoría parcial. Espera 12 semanas con dosis máxima tolerada."),
       e(Pearl,{t:"EPR es el gold standard psicoterapéutico"},"Exposición + Prevención de Respuesta. Mejor o igual que fármacos aislados; la combinación es la ideal."),
       e(Pearl,{t:"PANDAS"},"TOC de inicio SÚBITO en niño post-faringitis estreptocócica. Tratar la infección + manejo estándar del TOC."),
       e(Pearl,{t:"TDC ≠ trastorno delirante"},"En TDC la introspección puede ser ausente (delirante) pero la creencia es ",e("b",null,"sobre la apariencia"),". En trastorno delirante somático la creencia es sobre enfermedad."),
       e(Pearl,{t:"Hoarding — respuesta farmacológica pobre"},"Desde DSM-5 es dx independiente. ISRS funciona menos que en TOC clásico. Mejor respuesta a TCC específica."),
       e(Pearl,{t:"N-acetilcisteína"},"Útil en tricotilomanía y excoriación (modulación glutamatérgica). Dosis 1200–2400 mg/día."),
       e(Pearl,{t:"Augmentación con antipsicótico"},"Risperidona o aripiprazol se añaden al ISRS tras fracaso de 2 ISRS + clomipramina. Aripiprazol se prefiere si hay tics."),
       e(Pearl,{t:"TDC y cirugía"},"NUNCA autorizar cirugía cosmética — empeora el cuadro. Screening de suicidio obligatorio (riesgo ~4×).")
     )},
    {id:"resumen",ic:"📊",t:"Resumen comparativo",sub:"Las 7 entidades en una tabla",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"Núcleo",c:c},{t:"Tratamiento de elección",c:c}],
         rows:[
           ["TOC","Obsesiones + compulsiones >1h/día","ISRS dosis altas + EPR (10–12 sem)"],
           ["TDC","Preocupación por defecto físico no observable","ISRS dosis altas + TCC · NO cirugía"],
           ["Hoarding","Dificultad para descartar + congestión vital","TCC específica (mejor que ISRS)"],
           ["Tricotilomanía","Arrancarse pelo con alopecia","TRH + N-acetilcisteína 1200–2400 mg"],
           ["Excoriación","Pellizcarse piel con lesiones","TRH + N-acetilcisteína + ISRS"],
           ["Inducido sustancia","Temporalmente ligado al consumo","Suspender sustancia"],
           ["Por afección médica","Secundario a PANDAS, lesión estriatal, etc.","Tratar causa + manejo del TOC"]
         ]
       })
     )},
    {id:"flash",ic:"🃏",t:"Flashcards",sub:"12 preguntas + las tuyas",c:c,
     content:e("div",null,
       e(P,null,"Tarjetas de repaso de TOC y espectro. Toca para revelar la respuesta. Puedes añadir tus propias."),
       e(FlashDeck,{c:c,deckId:"toc",items:getAllCards("toc")})
     )},
    {id:"quiz",ic:"❓",t:"Quiz · 6 casos clínicos",sub:"Prueba tus conocimientos",c:c,
     content:e(Quiz,{c:c,items:getAllQuiz("toc")})}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Tema 2 · Neurosis · DSM-5-TR",title:"TOC y trastornos relacionados"},
      "Capítulo creado en DSM-5 (antes el TOC estaba en ansiedad). Comparten neurobiología (circuito órbito-fronto-estriatal hiperactivo), fenomenología (pensamientos/preocupaciones repetitivos + conductas repetitivas) y respuesta a tratamiento. Son ",e("b",null,"7 entidades"),"."
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.3),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Información general + Flashcards + Quiz")
    ),
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginTop:10}},
      general.map(function(g,i){
        return e("button",{key:g.id,onClick:function(){setOpenGen(i);},style:{padding:"14px 12px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:10,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:4,minHeight:90}},
          e("div",{style:{fontSize:22,marginBottom:4}},g.ic),
          e("div",{style:{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Playfair Display"}},g.t),
          e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.4,marginTop:2}},g.sub)
        );
      })
    ),
    openGen!==null?e(DzModal,{c:general[openGen].c,name:general[openGen].t,kicker:"Sección del tema",single:general[openGen].content,onClose:function(){setOpenGen(null);}}):null,

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.15)+","+ax(c,.04)+" 90%)",border:"1px solid "+ax(c,.35),borderRadius:14,margin:"18px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Las 7 enfermedades"),
      e("div",{style:{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Toca cualquier enfermedad para abrir su ficha"),
      e("div",{style:{fontSize:12,color:C.mt,marginTop:4,lineHeight:1.45}},"Cada ficha tiene tabs: Definición · Clínica · Diagnóstico · Tratamiento")
    ),
    e(DzGrid,{c:c,items:diseases}),

    e(Abbrev,{c:c,items:[
      {a:"TOC",d:"Trastorno Obsesivo-Compulsivo"},
      {a:"TDC",d:"Trastorno Dismórfico Corporal"},
      {a:"Hoarding",d:"Trastorno de acumulación"},
      {a:"EPR",d:"Exposición y Prevención de Respuesta"},
      {a:"TRH",d:"Terapia de Reversión de Hábito"},
      {a:"ISRS",d:"Inhibidores Selectivos de la Recaptación de Serotonina"},
      {a:"ADT",d:"Antidepresivos Tricíclicos (clomipramina)"},
      {a:"EMT",d:"Estimulación Magnética Transcraneal"},
      {a:"ECT",d:"Terapia Electroconvulsiva"},
      {a:"DBS",d:"Estimulación Cerebral Profunda"},
      {a:"PANDAS",d:"TOC pediátrico autoinmune asociado a estreptococo"},
      {a:"NAC",d:"N-Acetilcisteína"}
    ]})
  );
}

function TraumaView(){
  var c=C.trm;
  var diseases=[
    {
      n:"01",name:"Trastorno de estrés postraumático (TEPT)",
      blurb:"Evento traumático + 4 grupos de síntomas ≥1 mes",
      sections:{
        def:e(Def,{c:c},"Trastorno que se desarrolla tras la exposición a un evento ",e("b",null,"traumático extremo")," (amenaza real de muerte, lesión grave, violencia sexual — ya sea vivida directamente, presenciada, o supiera de ella en familiar/amigo cercano, o por exposición repetida en el trabajo). Se caracteriza por ",e("b",null,"4 grupos de síntomas durante ≥1 mes")," que causan malestar o deterioro significativo."),
        cli:e("div",null,
          e(H3,{c:c},"Los 4 grupos de síntomas"),
          e(Table,{
            headers:[{t:"Criterio",c:c},{t:"Grupo",c:c},{t:"Requiere",c:c}],
            rows:[
              ["B","Síntomas de intrusión / re-experimentación","≥1 de 5"],
              ["C","Evitación persistente de estímulos asociados","≥1 de 2"],
              ["D","Alteraciones negativas de cognición y ánimo","≥2 de 7"],
              ["E","Alteraciones de alerta y reactividad (hiperactivación)","≥2 de 6"]
            ]
          }),
          e(H3,{c:c,mt:14},"B · Intrusión (≥1 de 5)"),
          e(SxList,{c:c,items:[
            "Recuerdos angustiosos recurrentes, involuntarios e intrusivos del trauma",
            "Sueños angustiosos recurrentes relacionados con el trauma",
            "Reacciones disociativas (flashbacks) — el individuo siente que revive el trauma",
            "Malestar psicológico intenso ante claves internas o externas que simbolizan el trauma",
            "Reacciones fisiológicas marcadas (taquicardia, sudoración) ante dichas claves"
          ]}),
          e(H3,{c:c,mt:14},"C · Evitación (≥1 de 2)"),
          e(SxList,{c:c,items:[
            "Evitación de recuerdos, pensamientos o sentimientos angustiosos sobre el trauma",
            "Evitación de recordatorios externos (personas, lugares, conversaciones, actividades, objetos, situaciones)"
          ]}),
          e(H3,{c:c,mt:14},"D · Alteraciones negativas de cognición/ánimo (≥2 de 7)"),
          e(SxList,{c:c,items:[
            "Incapacidad para recordar aspectos importantes del trauma (amnesia disociativa)",
            "Creencias negativas persistentes y exageradas sobre uno mismo, los demás o el mundo",
            "Cogniciones distorsionadas sobre la causa o consecuencias del trauma → autoculparse",
            "Estado emocional negativo persistente (miedo, horror, rabia, culpa, vergüenza)",
            "Disminución del interés en actividades significativas",
            "Desapego o extrañamiento de los demás",
            "Incapacidad para experimentar emociones positivas (anhedonia)"
          ]}),
          e(H3,{c:c,mt:14},"E · Hiperactivación (≥2 de 6)"),
          e(SxList,{c:c,items:[
            "Irritabilidad o ataques de ira con poca o ninguna provocación",
            "Comportamiento temerario o autodestructivo",
            "Hipervigilancia",
            "Respuesta de sobresalto exagerada",
            "Problemas de concentración",
            "Alteración del sueño"
          ]}),
          e(H3,{c:c,mt:14},"Especificadores"),
          e(SxList,{c:c,items:[
            "Con síntomas disociativos (despersonalización / desrealización)",
            "Con expresión retardada: si los criterios completos no se cumplen hasta al menos 6 meses tras el evento"
          ]}),
          e(H3,{c:c,mt:14},"Epidemiología"),
          e(P,null,"Prevalencia anual ~3.5%. Prevalencia de por vida ~7–9%. 2:1 mujeres (tipos de trauma diferentes: varones→combate/accidentes; mujeres→violencia sexual/doméstica). Comorbilidad con depresión, sustancias, otros ansiosos, dolor crónico.")
        ),
        dx:e(CritBlock,{title:"TEPT (DSM-5 adultos)",c:c},
          e(Crit,{crit:"A",c:c},e("b",null,"Exposición")," a muerte, lesión grave o violencia sexual, real o amenazada, de una o más formas: (1) vivenciar directamente, (2) presenciar, (3) saber que le ocurrió a familiar cercano o amigo (si muerte violenta/accidental), (4) exposición repetida a detalles desagradables del evento (primeros respondedores, forenses)."),
          e(Crit,{crit:"B",c:c},"Síntomas de INTRUSIÓN (≥1 de 5)."),
          e(Crit,{crit:"C",c:c},"EVITACIÓN persistente de estímulos asociados al trauma (≥1 de 2)."),
          e(Crit,{crit:"D",c:c},"ALTERACIONES NEGATIVAS de cognición y ánimo (≥2 de 7)."),
          e(Crit,{crit:"E",c:c},"Alteraciones de ALERTA y REACTIVIDAD — hiperactivación (≥2 de 6)."),
          e(Crit,{crit:"F",c:c},"Duración ",e("b",null,"≥1 mes"),"."),
          e(Crit,{crit:"G",c:c},"Causa malestar clínico o deterioro significativo."),
          e(Crit,{crit:"H",c:c},"No atribuible a sustancia ni afección médica.")
        ),
        tx:e("div",null,
          e(H3,{c:c},"Psicoterapia (1ª línea)"),
          e(P,null,"Las psicoterapias centradas en el trauma son ",e("b",null,"de primera línea"),", equivalentes o superiores a la farmacoterapia:"),
          e(SxList,{c:c,items:[
            "TCC centrada en trauma (TCC-CT)",
            "Terapia de Exposición Prolongada",
            "Terapia de Procesamiento Cognitivo",
            "EMDR (Eye Movement Desensitization and Reprocessing)"
          ]}),
          e(H3,{c:c,mt:14},"Farmacoterapia"),
          e(Table,{
            headers:[{t:"Fármaco",c:c},{t:"Indicación",c:c},{t:"Dosis",c:c}],
            rows:[
              ["Sertralina ★","1ª línea · aprobación FDA","50–200 mg/día"],
              ["Paroxetina ★","1ª línea · aprobación FDA","20–60 mg/día"],
              ["Venlafaxina XR","1ª línea alternativa","75–300 mg/día"],
              ["Prazosina ★","Pesadillas e hiperactivación nocturna","1–10 mg antes de dormir"],
              ["Mirtazapina","Depresión comórbida + insomnio","15–45 mg nocturno"]
            ]
          }),
          e(Alert,{c:C.bad,label:"⚠️ CONTRAINDICADAS"},"Las ",e("b",null,"benzodiacepinas están CONTRAINDICADAS")," en TEPT: no tratan los síntomas nucleares, interfieren con el procesamiento del trauma en psicoterapia, empeoran la disociación y tienen alto riesgo de dependencia en esta población.")
        )
      }
    },
    {
      n:"02",name:"Trastorno de estrés agudo (TEA)",
      blurb:"Síntomas 3 días – 1 mes tras trauma",
      sections:{
        def:e(Def,{c:c},"Cuadro idéntico al TEPT en cuanto a exposición al trauma, pero con duración ",e("b",null,"entre 3 días y 1 mes")," tras el evento. Si los síntomas persisten >1 mes, se convierte en TEPT."),
        cli:e("div",null,
          e(P,null,"Los criterios B-E del TEPT (intrusión, evitación, alteraciones negativas, hiperactivación) aparecen aquí ",e("b",null,"combinados como una lista única de 14 síntomas")," de los cuales se requieren ",e("b",null,"≥9"),". Incluye también ",e("b",null,"síntomas disociativos")," como criterio destacado."),
          e(Note,{c:c,t:"Predictor de TEPT"},"Tener TEA NO predice bien el desarrollo de TEPT (muchos con TEA se recuperan y muchos con TEPT no tuvieron TEA franco). Pero sigue siendo útil para iniciar intervención precoz.")
        ),
        dx:e(CritBlock,{title:"TEA (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Exposición al trauma (mismo criterio A del TEPT)."),
          e(Crit,{crit:"B",c:c},e("b",null,"≥9 síntomas")," entre cualquier categoría (intrusión, ánimo negativo, disociación, evitación, activación)."),
          e(Crit,{crit:"C",c:c},"Duración: ",e("b",null,"de 3 días a 1 mes")," tras el trauma."),
          e(Crit,{crit:"D",c:c},"Malestar o deterioro clínico."),
          e(Crit,{crit:"E",c:c},"No por sustancia, afección médica ni trastorno psicótico breve.")
        ),
        tx:e(P,null,e("b",null,"TCC centrada en trauma")," precoz (dentro del mes) es lo más efectivo. Farmacoterapia no es de primera línea a menos que haya síntomas severos. Las ",e("b",null,"BZD siguen contraindicadas")," — el mismo argumento del TEPT.")
      }
    },
    {
      n:"03",name:"Trastorno de adaptación",
      blurb:"Síntomas tras estresor NO traumático · <6 meses",
      sections:{
        def:e(Def,{c:c},"Respuesta emocional o conductual desproporcionada a un estresor ",e("b",null,"identificable NO traumático")," (divorcio, problemas laborales, enfermedad, mudanza). Aparece ",e("b",null,"dentro de los 3 meses")," del estresor y se resuelve ",e("b",null,"dentro de los 6 meses")," tras su cese (salvo que el estresor sea crónico)."),
        cli:e("div",null,
          e(H3,{c:c},"Los 6 subtipos por síntoma predominante"),
          e(Table,{
            headers:[{t:"Subtipo",c:c},{t:"Predominan",c:c}],
            rows:[
              ["Con ánimo deprimido","Tristeza, llanto, desesperanza"],
              ["Con ansiedad","Nerviosismo, preocupación, miedo"],
              ["Mixto con ansiedad y ánimo deprimido","Ambos"],
              ["Con alteración de la conducta","Violación de derechos ajenos, normas sociales"],
              ["Mixto con alteración de emociones y conducta","Combinación"],
              ["Sin especificar","Reacciones desadaptativas que no encajan en los demás"]
            ]
          })
        ),
        dx:e(CritBlock,{title:"Trastorno de adaptación",c:c},
          e(Crit,{crit:"A",c:c},"Desarrollo de síntomas emocionales o conductuales en respuesta a un estresor identificable, dentro de los ",e("b",null,"3 meses")," tras el estresor."),
          e(Crit,{crit:"B",c:c},"Los síntomas son clínicamente significativos (malestar desproporcionado O deterioro social/laboral)."),
          e(Crit,{crit:"C",c:c},"No cumple criterios para otro trastorno mental ni es exacerbación de uno preexistente."),
          e(Crit,{crit:"D",c:c},"No representa duelo normal."),
          e(Crit,{crit:"E",c:c},"Una vez terminado el estresor (o sus consecuencias), los síntomas no persisten >6 meses.")
        ),
        tx:e(P,null,"Psicoterapia de apoyo / resolución de problemas / TCC. Farmacoterapia solo sintomática (ansiolíticos puntuales, ISRS si deriva en episodio depresivo mayor).")
      }
    },
    {
      n:"04",name:"Trastorno de duelo prolongado",
      blurb:"Duelo intenso ≥12 meses (≥6 en niños)",
      sections:{
        def:e(Def,{c:c},"Duelo patológico en adultos que persiste con intensidad ",e("b",null,"≥12 meses")," tras la muerte de un ser querido (≥6 meses en niños/adolescentes). Caracterizado por anhelo intenso persistente del fallecido + preocupación con pensamientos o recuerdos sobre él."),
        cli:e("div",null,
          e(P,null,"Diagnóstico añadido al DSM-5-TR (2022). Presenta síntomas adicionales como confusión identitaria, sensación de irrealidad, evitación de recordatorios, entumecimiento emocional, soledad intensa, sensación de que la vida carece de sentido."),
          e(Note,{c:c,t:"DDx clave"},"Duelo normal: ondulante, con momentos de bienestar. Duelo prolongado: paralizante, continuo, con deterioro funcional marcado. Depresión mayor: los síntomas no se enfocan exclusivamente en la pérdida.")
        ),
        dx:e(CritBlock,{title:"Duelo prolongado (DSM-5-TR)",c:c},
          e(Crit,{crit:"A",c:c},"Muerte de una persona cercana hace ≥12 meses (≥6 en niños)."),
          e(Crit,{crit:"B",c:c},"≥1 de: anhelo persistente del fallecido · preocupación con pensamientos/recuerdos de él."),
          e(Crit,{crit:"C",c:c},"≥3 de 8 síntomas adicionales (confusión identitaria, incredulidad, evitación, dolor emocional intenso, dificultad para reintegrarse, entumecimiento, sinsentido, soledad intensa)."),
          e(Crit,{crit:"D",c:c},"Malestar o deterioro clínicamente significativo."),
          e(Crit,{crit:"E",c:c},"La duración y gravedad exceden claramente las normas culturales o religiosas."),
          e(Crit,{crit:"F",c:c},"No se explica mejor por otro trastorno mental.")
        ),
        tx:e(P,null,e("b",null,"Terapia específica de duelo complicado")," (Complicated Grief Therapy, M.K. Shear) + TCC. Evidencia moderada para ISRS. No usar BZD más allá de periodos muy cortos.")
      }
    },
    {
      n:"05",name:"Trastorno de apego reactivo",
      blurb:"Niños <5 años · Apego inhibido por negligencia grave",
      sections:{
        def:e(Def,{c:c},"Patrón de comportamiento inhibido y emocionalmente retraído hacia cuidadores en niños, asociado a ",e("b",null,"cuidado patogénico grave")," (negligencia afectiva, cambios repetidos de cuidadores que impiden formar apegos estables, crianza en instituciones con altos ratios niño/cuidador)."),
        cli:e("div",null,
          e(SxList,{c:c,items:[
            "El niño raramente busca consuelo cuando está angustiado",
            "Raramente responde al consuelo cuando se le ofrece",
            "Respuesta social y emocional mínima hacia otros",
            "Afecto positivo limitado",
            "Episodios de irritabilidad, tristeza o miedo inexplicables en interacciones no amenazantes con cuidadores"
          ]})
        ),
        dx:e(CritBlock,{title:"Apego reactivo (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Patrón persistente de comportamiento inhibido y retraído hacia cuidadores (los 2 criterios del síntoma)."),
          e(Crit,{crit:"B",c:c},"Alteración social y emocional persistente (≥2 de 3)."),
          e(Crit,{crit:"C",c:c},"Experiencia de cuidado insuficiente (negligencia, cambios repetidos, institución)."),
          e(Crit,{crit:"D",c:c},"El criterio C es el responsable del A."),
          e(Crit,{crit:"E",c:c},"No cumple criterios de espectro autista."),
          e(Crit,{crit:"F",c:c},"Aparente antes de los 5 años."),
          e(Crit,{crit:"G",c:c},"Edad de desarrollo ≥9 meses.")
        ),
        tx:e(P,null,"Restablecer un ",e("b",null,"cuidador estable y sensible")," es la intervención más eficaz. Psicoterapia enfocada en apego, intervenciones diádicas padre-hijo. No hay farmacoterapia específica.")
      }
    },
    {
      n:"06",name:"Trastorno de relación social desinhibida",
      blurb:"Niños · Sociabilidad indiscriminada con extraños",
      sections:{
        def:e(Def,{c:c},"Opuesto fenomenológico del apego reactivo: el niño presenta conductas ",e("b",null,"excesivamente familiares e indiscriminadas")," con adultos desconocidos, también asociado a cuidado patogénico."),
        cli:e(SxList,{c:c,items:[
          "Reducción o ausencia de reticencia al acercarse a adultos desconocidos",
          "Comportamiento verbal o físico excesivamente familiar (inapropiado para la edad y contexto cultural)",
          "Disminución o ausencia de chequeo con el cuidador adulto al alejarse, incluso en entornos desconocidos",
          "Disposición a irse con adultos desconocidos sin o con mínima vacilación"
        ]}),
        dx:e(CritBlock,{title:"Relación social desinhibida (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Patrón de comportamiento en el que el niño se acerca e interactúa activamente con adultos desconocidos (≥2 de 4 síntomas)."),
          e(Crit,{crit:"B",c:c},"Los comportamientos no se limitan a impulsividad (como en TDAH) sino que incluyen comportamientos desinhibidos socialmente."),
          e(Crit,{crit:"C",c:c},"Experiencia de cuidado insuficiente."),
          e(Crit,{crit:"D",c:c},"El criterio C es presumiblemente responsable del A."),
          e(Crit,{crit:"E",c:c},"Edad de desarrollo ≥9 meses.")
        ),
        tx:e(P,null,"Cuidador estable y sensible. Psicoterapia de apoyo al cuidador e intervenciones diádicas. Puede persistir en la adolescencia como impulsividad social.")
      }
    }
  ];

  var s1=useState(null);var openGen=s1[0],setOpenGen=s1[1];
  var general=[
    {id:"conceptos",ic:"🧭",t:"Conceptos generales",sub:"Organización del capítulo",c:c,
     content:e("div",null,
       e(P,null,"Capítulo creado en DSM-5 como separado de los trastornos de ansiedad. Reúne cuadros en los que la ",e("b",null,"exposición a un evento estresante o traumático")," es un criterio ",e("b",null,"explícito")," (criterio A) para el diagnóstico. Son ",e("b",null,"6 entidades"),"."),
       e(H3,{c:c,mt:14},"Resumen de las 6 entidades"),
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"Gatillo",c:c},{t:"Duración",c:c}],
         rows:[
           ["TEPT","Trauma (criterio A)","≥1 mes"],
           ["TEA (estrés agudo)","Trauma (criterio A)","3 días – 1 mes"],
           ["Adaptación","Estresor NO traumático","<6 meses tras cese"],
           ["Duelo prolongado","Muerte de ser querido","≥12 meses (≥6 niños)"],
           ["Apego reactivo","Cuidado patogénico","Niños <5 años"],
           ["Relación social desinhibida","Cuidado patogénico","Niños"]
         ]
       })
     )},
    {id:"criterioa",ic:"⚡",t:"El criterio A · qué es trauma",sub:"Clave para separar TEPT de adaptación",c:c,
     content:e("div",null,
       e(Def,{c:c},"El ",e("b",null,"criterio A de TEPT/TEA")," define qué cuenta como 'trauma'. Si no cumple A, el diagnóstico apropiado puede ser trastorno de adaptación u otro."),
       e(H3,{c:c},"Cumple criterio A (4 formas)"),
       e(SxList,{c:c,items:[
         "Vivir directamente el evento (amenaza de muerte, lesión grave, violencia sexual)",
         "Presenciar el evento en persona (NO por TV/películas/redes, salvo en contexto laboral)",
         "Saber que le ocurrió a un familiar cercano o amigo (en muerte: debe ser violenta o accidental)",
         "Exposición repetida a detalles desagradables del evento (primeros respondedores, forenses, policías que investigan abuso)"
       ]}),
       e(Alert,{c:C.bad,label:"⚠️ NO cumplen criterio A"},"Ver noticias por TV · enterarse de enfermedad grave de un familiar (no muerte violenta) · divorcio · problemas laborales · desempleo · estrés financiero. Estos pueden ir a ",e("b",null,"trastorno de adaptación"),", no a TEPT.")
     )},
    {id:"ddx",ic:"🧭",t:"Diagnóstico diferencial",sub:"Dentro y fuera del capítulo",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Cuadro",c:c},{t:"Clave diferencial",c:c}],
         rows:[
           ["TEPT vs TEA","Duración: <1 mes = TEA · ≥1 mes = TEPT"],
           ["TEPT vs Adaptación","Criterio A estricto · el estresor en adaptación NO es traumático en el sentido del DSM"],
           ["TEPT vs Depresión mayor","TEPT tiene re-experimentación + evitación + hiperactivación · no solo ánimo"],
           ["TEPT vs TOC","Las intrusiones del TEPT son memorias · las obsesiones del TOC son ideas/impulsos no basados en memoria"],
           ["Duelo prolongado vs Depresión","Duelo: anhelo + pensamientos sobre el fallecido · Depresión: autodevaluación, culpa no relacionada con muerte"],
           ["Apego reactivo vs TEA (autismo)","Apego responde a cuidador estable · autismo tiene déficits sociales y restricciones independientes del cuidado"]
         ]
       })
     )},
    {id:"tx",ic:"💊",t:"Tratamiento · resumen del tema",sub:"Psicoterapia > farmacoterapia",c:c,
     content:e("div",null,
       e(H3,{c:c},"TEPT — fármacos con aprobación FDA"),
       e(Table,{
         headers:[{t:"Línea",c:c},{t:"Fármaco",c:c},{t:"Dosis",c:c}],
         rows:[
           ["1ª línea · FDA","Sertralina","50–200 mg/día"],
           ["1ª línea · FDA","Paroxetina","20–60 mg/día"],
           ["1ª línea alt","Venlafaxina XR","75–300 mg/día"],
           ["Pesadillas","Prazosina","1–10 mg nocturno (titular)"],
           ["Depresión + insomnio","Mirtazapina","15–45 mg nocturno"]
         ]
       }),
       e(H3,{c:c,mt:14},"Psicoterapia centrada en trauma (1ª línea)"),
       e(SxList,{c:c,items:[
         "TCC centrada en trauma (TCC-CT)",
         "Terapia de Exposición Prolongada",
         "Terapia de Procesamiento Cognitivo",
         "EMDR (Eye Movement Desensitization and Reprocessing)"
       ]}),
       e(Alert,{c:C.bad,label:"⚠️ BZD CONTRAINDICADAS en TEPT"},"No tratan síntomas nucleares, interfieren con el procesamiento del trauma en psicoterapia, empeoran disociación y tienen alto riesgo de dependencia en esta población.")
     )},
    {id:"perlas",ic:"📌",t:"Perlas de examen",sub:"Alto rendimiento",c:c,
     content:e("div",null,
       e(Pearl,{t:"⏱ TEPT vs TEA · regla temporal"},"TEA: 3 días a 1 mes. TEPT: ≥1 mes. Si un paciente tiene síntomas de trauma al día siguiente no es TEA (se necesitan ≥3 días)."),
       e(Pearl,{t:"Criterio A · muerte violenta/accidental"},"Para que contar como trauma saber que un familiar murió, la muerte debe haber sido ",e("b",null,"violenta o accidental"),". Muerte por cáncer de un familiar → NO cumple criterio A de TEPT."),
       e(Pearl,{t:"Prazosina"},"Antagonista α1-adrenérgico. Reduce ",e("b",null,"pesadillas")," y ",e("b",null,"hiperactivación nocturna")," en TEPT. Dosis: iniciar 1 mg nocturno, titular hasta 10 mg."),
       e(Pearl,{t:"BZD contraindicadas en TEPT"},"Esta es una pregunta de examen frecuente. NO prescribir BZD en TEPT."),
       e(Pearl,{t:"Sertralina y paroxetina"},"Son los ÚNICOS ISRS con aprobación FDA específica para TEPT. Sertralina suele preferirse por mejor perfil."),
       e(Pearl,{t:"EMDR"},"Psicoterapia basada en movimientos oculares bilaterales durante la evocación del recuerdo traumático. Eficacia equivalente a TCC-CT."),
       e(Pearl,{t:"Adaptación · 3 y 6 meses"},"Aparición dentro de ",e("b",null,"3 meses")," del estresor · resolución dentro de ",e("b",null,"6 meses")," tras su cese."),
       e(Pearl,{t:"Duelo prolongado"},"Nuevo en DSM-5-TR (2022). Criterio temporal ≥12 meses en adultos, ≥6 en niños. Cuidado: no patologizar duelo normal."),
       e(Pearl,{t:"Apego reactivo vs desinhibida"},"Ambos por cuidado patogénico. Reactivo: niño INHIBIDO (no busca consuelo). Desinhibida: niño TE ABRAZA sin conocerte.")
     )},
    {id:"resumen",ic:"📊",t:"Resumen comparativo",sub:"Las 6 entidades en una tabla",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"Criterio de inicio",c:c},{t:"Duración clave",c:c},{t:"Tx de elección",c:c}],
         rows:[
           ["TEPT","Trauma · cumple criterio A","≥1 mes","Sertralina/paroxetina + psicoterapia trauma (EMDR, TCC-CT)"],
           ["TEA","Trauma · cumple criterio A","3 días a 1 mes","TCC-CT precoz"],
           ["Adaptación","Estresor no traumático","<6 m tras cese","Psicoterapia de apoyo"],
           ["Duelo prolongado","Muerte ser querido","≥12 m (≥6 niños)","Terapia de duelo complicado"],
           ["Apego reactivo","Cuidado patogénico","Niños <5 años","Cuidador estable + terapia diádica"],
           ["Relación social desinhibida","Cuidado patogénico","Niños","Cuidador estable + terapia diádica"]
         ]
       })
     )},
    {id:"flash",ic:"🃏",t:"Flashcards",sub:"14 preguntas + las tuyas",c:c,
     content:e("div",null,
       e(P,null,"Tarjetas de repaso de trauma y estrés. Puedes añadir tus propias."),
       e(FlashDeck,{c:c,deckId:"trauma",items:getAllCards("trauma")})
     )},
    {id:"quiz",ic:"❓",t:"Quiz · 6 casos clínicos",sub:"Prueba tus conocimientos",c:c,
     content:e(Quiz,{c:c,items:getAllQuiz("trauma")})}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Tema 3 · Neurosis · DSM-5-TR",title:"Trauma y estrés"},
      "Capítulo creado en DSM-5. Reúne trastornos en los que la ",e("b",null,"exposición a un evento estresante o traumático")," es un criterio ",e("b",null,"explícito y necesario")," para el diagnóstico. Son ",e("b",null,"6 entidades"),"."
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.3),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Conceptos · Criterio A · Flashcards · Quiz")
    ),
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginTop:10}},
      general.map(function(g,i){
        return e("button",{key:g.id,onClick:function(){setOpenGen(i);},style:{padding:"14px 12px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:10,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:4,minHeight:90}},
          e("div",{style:{fontSize:22,marginBottom:4}},g.ic),
          e("div",{style:{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Playfair Display"}},g.t),
          e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.4,marginTop:2}},g.sub)
        );
      })
    ),
    openGen!==null?e(DzModal,{c:general[openGen].c,name:general[openGen].t,kicker:"Sección del tema",single:general[openGen].content,onClose:function(){setOpenGen(null);}}):null,

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.15)+","+ax(c,.04)+" 90%)",border:"1px solid "+ax(c,.35),borderRadius:14,margin:"18px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Las 6 enfermedades"),
      e("div",{style:{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Toca cualquier enfermedad para abrir su ficha"),
      e("div",{style:{fontSize:12,color:C.mt,marginTop:4,lineHeight:1.45}},"Cada ficha tiene tabs: Definición · Clínica · Diagnóstico · Tratamiento")
    ),
    e(DzGrid,{c:c,items:diseases}),

    e(Abbrev,{c:c,items:[
      {a:"TEPT",d:"Trastorno de Estrés Postraumático"},
      {a:"TEA",d:"Trastorno de Estrés Agudo"},
      {a:"EMDR",d:"Eye Movement Desensitization and Reprocessing"},
      {a:"TCC-CT",d:"Terapia Cognitivo-Conductual Centrada en Trauma"},
      {a:"ISRS",d:"Inhibidores Selectivos de la Recaptación de Serotonina"},
      {a:"IRSN",d:"Inhibidores de Recaptación de Serotonina y Noradrenalina"},
      {a:"BZD",d:"Benzodiacepinas"}
    ]})
  );
}

function SomView(){
  var c=C.som;
  var cd=C.dis;
  var diseases=[
    // ═══ SECCIÓN A · SOMÁTICOS ═══
    {
      n:"01",name:"Trastorno de síntomas somáticos (TSS)",c:c,
      blurb:"Síntomas físicos reales + pensamientos/ansiedad desproporcionados",
      sections:{
        def:e(Def,{c:c},"Uno o más síntomas físicos ",e("b",null,"reales, angustiantes o que alteran la vida diaria"),", acompañados de pensamientos, sentimientos o comportamientos ",e("b",null,"desproporcionados"),". Lo clave no es la presencia o ausencia del síntoma físico, sino la ",e("b",null,"respuesta psicológica")," al mismo."),
        cli:e("div",null,
          e(P,null,"Prevalencia ~5–7%. Más frecuente en mujeres. Alta comorbilidad con depresión y ansiedad. Curso crónico con fluctuaciones."),
          e(H3,{c:c,mt:14},"Especificadores"),
          e(SxList,{c:c,items:[
            "Con dolor predominante (antes 'trastorno de dolor')",
            "Persistente: curso de >6 meses con síntomas graves y deterioro marcado",
            "Leve / moderado / grave según número de síntomas del criterio B"
          ]}),
          e(Note,{c:c,t:"Diferencia con IAD"},"En TSS hay síntomas físicos REALES que preocupan. En IAD (hipocondría) la preocupación es por enfermar, con síntomas físicos LEVES o AUSENTES.")
        ),
        dx:e(CritBlock,{title:"TSS (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Uno o más síntomas somáticos angustiantes o que alteran significativamente la vida diaria."),
          e(Crit,{crit:"B",c:c},"Pensamientos, sentimientos o comportamientos excesivos relacionados con los síntomas, manifestados por ",e("b",null,"≥1 de 3"),": (1) pensamientos desproporcionados sobre la gravedad, (2) ansiedad persistente elevada sobre la salud o los síntomas, (3) tiempo y energía excesivos dedicados a los síntomas o la preocupación."),
          e(Crit,{crit:"C",c:c},"Aunque cualquier síntoma individual no esté siempre presente, el estado de estar sintomático es persistente (típicamente ",e("b",null,"≥6 meses"),").")
        ),
        tx:e("div",null,
          e(H3,{c:c},"Manejo clínico"),
          e(SxList,{c:c,items:[
            "Consulta FIJA con UN médico de cabecera (evita doctor-shopping)",
            "Visitas breves y regulares — NO 'por demanda'",
            "Validar el sufrimiento sin reforzar creencias catastróficas",
            "Exámenes solo los justificados por hallazgos nuevos",
            "TCC específica para TSS (evidencia sólida)",
            "ISRS si depresión o ansiedad comórbida marcada"
          ]}),
          e(Alert,{c:C.warn,label:"🔑 Regla de oro"},"NO repetir exámenes ya hechos. Cada 'examen normal' alivia al paciente unos días y luego reinicia la búsqueda. Un solo médico + visitas programadas breves es más efectivo que cualquier fármaco.")
        )
      }
    },
    {
      n:"02",name:"Trastorno de ansiedad por enfermedad (IAD)",c:c,
      blurb:"Preocupación por enfermar · Síntomas físicos leves/ausentes",
      sections:{
        def:e(Def,{c:c},"Preocupación por ",e("b",null,"tener o adquirir una enfermedad grave"),", con síntomas físicos ",e("b",null,"leves o ausentes"),". El paciente tiene alta ansiedad sobre su salud y realiza comportamientos excesivos (buscar reaseguro, revisarse) o ",e("b",null,"evita")," la atención médica. Reemplazó a la 'hipocondría' del DSM-IV."),
        cli:e("div",null,
          e(H3,{c:c},"Los 2 subtipos"),
          e(Table,{
            headers:[{t:"Tipo",c:c},{t:"Comportamiento",c:c}],
            rows:[
              ["Con solicitud de asistencia","Busca exámenes, consulta con múltiples médicos, exige pruebas"],
              ["Con evitación de asistencia","Evita consultas médicas por miedo a que confirmen la enfermedad"]
            ]
          }),
          e(Note,{c:c,t:"Diferencia con TSS"},"IAD: preocupación por enfermar, síntomas físicos ",e("b",null,"ausentes o leves"),". TSS: síntomas físicos ",e("b",null,"reales y angustiantes")," con respuesta desproporcionada.")
        ),
        dx:e(CritBlock,{title:"IAD (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Preocupación por padecer o adquirir una enfermedad grave."),
          e(Crit,{crit:"B",c:c},"Los síntomas somáticos no están presentes o si lo están son de intensidad leve."),
          e(Crit,{crit:"C",c:c},"Alto nivel de ansiedad acerca de la salud; el individuo se alarma fácilmente por su estado de salud."),
          e(Crit,{crit:"D",c:c},"Comportamientos excesivos relacionados con la salud (revisarse el cuerpo) o evitación desadaptativa (evita citas y hospitales)."),
          e(Crit,{crit:"E",c:c},"Duración ",e("b",null,"≥6 meses"),"."),
          e(Crit,{crit:"F",c:c},"No se explica mejor por otro trastorno mental (TSS, TOC, TDC, TAG, trastorno delirante somático).")
        ),
        tx:e(P,null,"Mismo enfoque que TSS: consulta fija, exámenes justificados, ",e("b",null,"TCC")," específica para ansiedad por salud (1ª línea). ",e("b",null,"ISRS")," si depresión/ansiedad comórbida marcada.")
      }
    },
    {
      n:"03",name:"Trastorno de conversión (síntomas neurológicos funcionales)",c:c,
      blurb:"Déficit neurológico sin causa orgánica · signos positivos",
      sections:{
        def:e(Def,{c:c},"Síntomas motores o sensitivos (",e("b",null,"parálisis, ceguera, afonía, crisis no epilépticas, ataxia, parestesias"),") que imitan trastornos neurológicos pero son ",e("b",null,"incompatibles")," con la exploración clínica o las pruebas complementarias. No son simulados — el paciente los vive como reales."),
        cli:e("div",null,
          e(H3,{c:c},"Signos 'positivos' clave"),
          e(Table,{
            headers:[{t:"Signo",c:c},{t:"Qué muestra",c:c}],
            rows:[
              ["Signo de Hoover ★","Paciente con 'parálisis' de una pierna no puede hacer extensión voluntaria, pero SÍ hay contracción contralateral involuntaria cuando intenta levantar la pierna sana"],
              ["Debilidad del pronador","Al sostener brazos en supinación, el brazo 'parético' pronará sin caer (en lesión real, caería)"],
              ["Crisis no epilépticas","Ojos cerrados con resistencia activa, pelvis thrust, movimientos asíncronos, no mordedura lateral de lengua, consciencia preservada con acción bilateral"],
              ["'La belle indifférence'","Aparente indiferencia emocional al déficit — no es específica ni sensible, ya no se considera criterio"]
            ]
          }),
          e(Alert,{c:C.bad,label:"⚠️ Trampa"},"La conversión NO es simulación. No requiere identificar un 'conflicto psicológico'. Basta con que los signos de exploración sean incompatibles con una lesión anatómica. Ya no se llama 'histeria'.")
        ),
        dx:e(CritBlock,{title:"Conversión (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Uno o más síntomas de alteración de la función motora o sensitiva voluntaria."),
          e(Crit,{crit:"B",c:c},"Los hallazgos clínicos aportan pruebas de la ",e("b",null,"incompatibilidad")," entre el síntoma y las afecciones neurológicas o médicas reconocidas."),
          e(Crit,{crit:"C",c:c},"El síntoma no se explica mejor por otro trastorno médico o mental."),
          e(Crit,{crit:"D",c:c},"Causa malestar o deterioro significativo, o exige una evaluación médica.")
        ),
        tx:e(P,null,"Comunicar el diagnóstico con claridad (',es real pero funcional, no hay lesión estructural'). ",e("b",null,"Fisioterapia"),", ",e("b",null,"TCC"),", técnicas de retroalimentación. NO es 'que se lo está inventando'. El pronóstico es mejor cuando el paciente acepta el diagnóstico temprano.")
      }
    },
    {
      n:"04",name:"Factores psicológicos que afectan otras afecciones médicas",c:c,
      blurb:"Enfermedad REAL + factores psicológicos que la empeoran",
      sections:{
        def:e(Def,{c:c},"Presencia de una enfermedad médica establecida + factores psicológicos o conductuales que afectan negativamente su curso (estrés laboral que exacerba el asma, ansiedad que descompensa diabetes, negación que impide adherencia)."),
        cli:e(P,null,"Es un diagnóstico útil cuando los factores psicológicos son clínicamente significativos en una enfermedad médica documentada. Los factores deben influir en el curso, tratamiento, recuperación, o constituir riesgos adicionales."),
        dx:e(CritBlock,{title:"Factores psicológicos en afección médica",c:c},
          e(Crit,{crit:"A",c:c},"Síntoma o afección médica (distinta a trastorno mental) presente."),
          e(Crit,{crit:"B",c:c},"Factores psicológicos o conductuales afectan adversamente la afección médica de las siguientes formas: (1) influyen en el curso, (2) interfieren con el tratamiento, (3) constituyen riesgos adicionales para la salud, (4) exacerban la fisiopatología.")
        ),
        tx:e(P,null,"Psicoterapia dirigida a los factores específicos (TCC para estrés, intervenciones motivacionales para adherencia). Colaboración estrecha con el equipo médico tratante de la enfermedad orgánica.")
      }
    },
    {
      n:"05",name:"Trastorno facticio",c:c,
      blurb:"PRODUCE síntomas intencionalmente sin ganancia externa",
      sections:{
        def:e(Def,{c:c},"El paciente ",e("b",null,"falsifica, produce o induce")," síntomas físicos o psicológicos en sí mismo (o en otro → 'impuesto a otro', antes Munchausen por poderes) con ",e("b",null,"motivación interna de asumir el rol de enfermo"),". NO hay recompensa externa evidente (a diferencia de la simulación)."),
        cli:e("div",null,
          e(H3,{c:c},"Trampa clásica: facticio vs conversión vs simulación"),
          e(Table,{
            headers:[{t:"Cuadro",c:c},{t:"Produce síntomas?",c:c},{t:"Conciencia",c:c},{t:"Motivación",c:c}],
            rows:[
              ["Conversión","NO (aparecen involuntariamente)","No consciente","No aplica — no los produce"],
              ["Facticio","SÍ los produce","CONSCIENTE","Rol de enfermo (interna)"],
              ["Simulación","SÍ los produce","CONSCIENTE","Ganancia externa clara (dinero, droga, evadir)"]
            ]
          }),
          e(Note,{c:c,t:"Síndrome de Munchausen"},"Término histórico para la forma más grave del facticio. El subtipo ",e("b",null,"'impuesto a otro'")," (antes Munchausen por poderes) es un cuadro grave en el que un cuidador produce síntomas en un tercero (típicamente hijo).")
        ),
        dx:e(CritBlock,{title:"Trastorno facticio (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Falsificación de signos o síntomas físicos/psicológicos, o inducción de lesión o enfermedad, asociada a engaño identificado."),
          e(Crit,{crit:"B",c:c},"El individuo se presenta a sí mismo (o a otro) como enfermo, incapacitado o lesionado."),
          e(Crit,{crit:"C",c:c},"El comportamiento engañoso es evidente ",e("b",null,"incluso en ausencia de recompensas externas evidentes"),"."),
          e(Crit,{crit:"D",c:c},"El comportamiento no se explica mejor por otro trastorno mental (delirio, trastorno psicótico).")
        ),
        tx:e("div",null,
          e(P,null,"Manejo difícil. Confrontación directa suele romper la relación. ",e("b",null,"Estrategia no punitiva"),": ofrecer salida del rol con 'salvar cara' (ej., 'a veces estas cosas mejoran con psicoterapia'). Coordinación entre servicios para evitar procedimientos innecesarios."),
          e(Alert,{c:C.bad,label:"⚠️ Facticio impuesto a otro"},"Emergencia — es una forma de ",e("b",null,"maltrato infantil")," (o del adulto dependiente). Involucrar servicios de protección. El cuidador perpetrador requiere evaluación y tratamiento psiquiátrico.")
        )
      }
    },
    // ═══ SECCIÓN B · DISOCIATIVOS ═══
    {
      n:"06",name:"Trastorno de identidad disociativo (TID)",c:cd,
      blurb:"≥2 estados de personalidad + lagunas de memoria",
      sections:{
        def:e(Def,{c:cd},"Presencia de ",e("b",null,"dos o más estados de personalidad distintos")," (o experiencia de posesión) con discontinuidades marcadas en el sentido del yo y de la agencia, acompañadas de ",e("b",null,"amnesia recurrente")," de acontecimientos cotidianos, información personal importante o eventos traumáticos. Antiguamente 'personalidad múltiple'."),
        cli:e("div",null,
          e(P,null,"Muy fuerte asociación con ",e("b",null,"trauma infantil severo y temprano")," (abuso sexual, negligencia). Prevalencia real discutida pero probable ~1%. Enorme comorbilidad con TEPT, depresión, autolesión, trastornos por sustancias, somatización."),
          e(Note,{c:cd,t:"Alters"},"Los distintos estados ('alters') pueden tener edad, género, afectos y memorias diferentes. El 'huésped' suele desconocer o conocer parcialmente a los otros. El cambio entre ellos se denomina 'switch'.")
        ),
        dx:e(CritBlock,{title:"TID (DSM-5)",c:cd},
          e(Crit,{crit:"A",c:cd},"Perturbación de la identidad con dos o más estados de personalidad bien definidos (en algunas culturas, experiencia de posesión)."),
          e(Crit,{crit:"B",c:cd},"Lagunas recurrentes en el recuerdo de acontecimientos cotidianos, información personal importante o eventos traumáticos."),
          e(Crit,{crit:"C",c:cd},"Causa malestar o deterioro clínicamente significativo."),
          e(Crit,{crit:"D",c:cd},"No forma parte normal de prácticas culturales o religiosas aceptadas."),
          e(Crit,{crit:"E",c:cd},"No atribuible a sustancias ni afección médica (crisis epilépticas complejas, etc.).")
        ),
        tx:e(P,null,"Psicoterapia trauma-informada en 3 fases: ",e("b",null,"estabilización → procesamiento del trauma → integración y rehabilitación"),". No hay fármaco específico; ISRS para síntomas depresivos/ansiosos comórbidos, prazosina para pesadillas. Evitar BZD por la disociación.")
      }
    },
    {
      n:"07",name:"Amnesia disociativa",c:cd,
      blurb:"Incapacidad para recordar info autobiográfica importante",
      sections:{
        def:e(Def,{c:cd},"Incapacidad para recordar ",e("b",null,"información autobiográfica importante"),", usualmente de naturaleza traumática o estresante, que excede el olvido normal. La información está almacenada (no destruida) y puede recuperarse con el tiempo o en contexto adecuado."),
        cli:e("div",null,
          e(H3,{c:cd},"Los 3 tipos"),
          e(Table,{
            headers:[{t:"Tipo",c:cd},{t:"Descripción",c:cd}],
            rows:[
              ["Localizada","Fallo para recordar un evento o periodo específico (el más común)"],
              ["Selectiva","Fallo parcial: recuerda algunos aspectos del evento pero no otros"],
              ["Generalizada","Fallo total de memoria autobiográfica · rara y muy grave"]
            ]
          }),
          e(H3,{c:cd,mt:14},"Fuga disociativa (especificador)"),
          e(P,null,"Viaje o deambulación aparentemente intencionada + amnesia de identidad o de otra información autobiográfica. El paciente puede asumir una nueva identidad temporal."),
          e(Alert,{c:C.bad,label:"⚠️ DDx crucial"},"Descartar SIEMPRE: ",e("b",null,"amnesia global transitoria")," (AGT · benigna, horas), ",e("b",null,"TCE"),", ",e("b",null,"Korsakoff")," (alcohol · confabulación), ",e("b",null,"ACV"),", ",e("b",null,"crisis epilépticas complejas"),". La amnesia disociativa NO tiene alteración de conciencia ni confabulación.")
        ),
        dx:e(CritBlock,{title:"Amnesia disociativa (DSM-5)",c:cd},
          e(Crit,{crit:"A",c:cd},"Incapacidad para recordar información autobiográfica importante, generalmente de naturaleza traumática o estresante, inconsistente con el olvido normal."),
          e(Crit,{crit:"B",c:cd},"Malestar o deterioro clínico."),
          e(Crit,{crit:"C",c:cd},"No atribuible a sustancias, trastorno neurológico u otra afección médica."),
          e(Crit,{crit:"D",c:cd},"No se explica mejor por otro trastorno disociativo, TEPT, trastorno neurocognitivo mayor, etc.")
        ),
        tx:e(P,null,"Psicoterapia. La recuperación de memoria suele ser espontánea con el tiempo o en contexto seguro. Evitar presionar al paciente a 'recordar'. Tratar comorbilidades (ansiedad, depresión).")
      }
    },
    {
      n:"08",name:"Trastorno de despersonalización / desrealización",c:cd,
      blurb:"Sentirse irreal o percibir el mundo como irreal",
      sections:{
        def:e(Def,{c:cd},"Experiencias persistentes o recurrentes de ",e("b",null,"despersonalización")," (sentirse irreal, separado de sí mismo, observador externo) y/o ",e("b",null,"desrealización")," (el mundo parece irreal, como en un sueño, vidrioso). La prueba de realidad permanece intacta — el paciente SABE que es una sensación."),
        cli:e("div",null,
          e(Note,{c:cd,t:"Despersonalización vs desrealización"},e("b",null,"Despersonalización:")," 'yo no soy yo', 'me veo desde afuera'. ",e("b",null,"Desrealización:")," 'el mundo no es real', 'como si estuviera en una película'."),
          e(Pearl,{t:"Experiencia transitoria vs trastorno"},"~50% de adultos sanos ha experimentado despersonalización alguna vez (fatiga, estrés agudo, alcohol, cannabis). Solo es patológico cuando es persistente, recurrente y causa malestar o deterioro.")
        ),
        dx:e(CritBlock,{title:"Despersonalización / desrealización (DSM-5)",c:cd},
          e(Crit,{crit:"A",c:cd},"Presencia de experiencias persistentes o recurrentes de despersonalización y/o desrealización."),
          e(Crit,{crit:"B",c:cd},e("b",null,"Prueba de realidad intacta")," durante las experiencias."),
          e(Crit,{crit:"C",c:cd},"Malestar o deterioro clínico."),
          e(Crit,{crit:"D",c:cd},"No atribuible a sustancia o afección médica (crisis, migraña)."),
          e(Crit,{crit:"E",c:cd},"No se explica mejor por esquizofrenia, pánico, depresión mayor, TEA, TID u otro trastorno disociativo.")
        ),
        tx:e(P,null,"Psicoterapia (TCC para despersonalización · psicoeducación · mindfulness). Los ISRS tienen evidencia limitada. Tratar comorbilidades (pánico, depresión). Evitar sustancias que disparen episodios (cannabis, alucinógenos).")
      }
    }
  ];

  var s1=useState(null);var openGen=s1[0],setOpenGen=s1[1];
  var general=[
    {id:"conceptos",ic:"🧭",t:"Conceptos generales",sub:"Somáticos · Disociativos",c:c,
     content:e("div",null,
       e(P,null,"Dos capítulos del DSM-5 que se presentan juntos por afinidad clínica y diagnóstico diferencial frecuente."),
       e(H3,{c:c,mt:14},"Somáticos · 5 entidades"),
       e(P,null,"Los síntomas físicos son el centro del sufrimiento. DSM-5 reorganizó drásticamente este capítulo eliminando el requisito de 'sin explicación médica'. Ahora lo clave es la ",e("b",null,"respuesta psicológica")," al síntoma."),
       e(H3,{c:cd,mt:14},"Disociativos · 3 entidades"),
       e(P,null,"Discontinuidad en la conciencia, memoria, identidad o percepción. Frecuentemente asociados a trauma infantil. La prueba de realidad suele estar conservada.")
     )},
    {id:"tabla_som",ic:"🧭",t:"Los 3 grandes del somático",sub:"TSS vs IAD vs conversión",c:c,
     content:e(Table,{
       headers:[{t:"Trastorno",c:c},{t:"Síntomas físicos",c:c},{t:"Foco psicológico",c:c}],
       rows:[
         ["TSS","REALES + angustiantes","Pensamientos/ansiedad desproporcionados"],
         ["IAD","Ausentes o leves","Preocupación por ENFERMAR"],
         ["Conversión","REALES pero funcionales (incompatibles con lesión)","Pérdida de función neurológica sin causa orgánica"]
       ]
     })},
    {id:"tabla_enga",ic:"🎭",t:"Facticio vs Conversión vs Simulación",sub:"Tabla oro de examen",c:c,
     content:e("div",null,
       e(P,null,"Pregunta clásica que casi siempre cae. La clave son dos ejes: ",e("b",null,"si el paciente produce los síntomas intencionadamente")," y ",e("b",null,"la motivación"),"."),
       e(Table,{
         headers:[{t:"Cuadro",c:c},{t:"Produce síntomas?",c:c},{t:"Conciencia",c:c},{t:"Motivación",c:c}],
         rows:[
           ["Conversión","NO (involuntarios)","No consciente","Ninguna · vive los síntomas como reales"],
           ["Facticio","SÍ","CONSCIENTE","INTERNA — asumir el rol de enfermo"],
           ["Simulación","SÍ","CONSCIENTE","EXTERNA — ganancia clara (dinero, evadir trabajo, obtener droga)"]
         ]
       }),
       e(Note,{c:c,t:"Simulación NO es trastorno mental"},"Está en el DSM-5 como 'código adicional' (no trastorno). Requiere sospecha clínica + contexto (juicios, beneficios secundarios).")
     )},
    {id:"tx_som",ic:"💊",t:"Tx general de somáticos",sub:"Principios compartidos",c:c,
     content:e("div",null,
       e(SxList,{c:c,items:[
         "Consulta FIJA con UN médico — evita doctor-shopping",
         "Visitas breves, regulares, programadas (no 'por demanda')",
         "Validar el sufrimiento sin reforzar creencias catastróficas",
         "No repetir exámenes ya hechos; solo los justificados por hallazgos nuevos",
         "TCC específica — 1ª línea psicoterapéutica",
         "ISRS si hay comorbilidad depresiva o ansiosa"
       ]})
     )},
    {id:"tx_dis",ic:"💊",t:"Tx de los disociativos",sub:"Psicoterapia trauma-informada",c:cd,
     content:e("div",null,
       e(P,null,"No hay fármaco con indicación específica. La ",e("b",null,"psicoterapia trauma-informada")," es la base. Tres fases:"),
       e(SxList,{c:cd,items:[
         "Estabilización (seguridad, habilidades para regular afecto y disociación)",
         "Procesamiento del trauma (cuando el paciente esté estable)",
         "Integración y rehabilitación (reconectar identidad, relaciones, vida cotidiana)"
       ]}),
       e(P,null,e("b",null,"Farmacoterapia sintomática:")," ISRS para depresión/ansiedad · prazosina para pesadillas · evitar BZD por riesgo de disociación."),
       e(Alert,{c:C.bad,label:"⚠️ Trampas"},"NO presionar a 'recordar' en amnesia disociativa — el recuerdo suele volver solo en contexto seguro. NO tratar los 'alters' del TID como entidades separadas; el objetivo es la integración.")
     )},
    {id:"perlas",ic:"📌",t:"Perlas de examen",sub:"Alto rendimiento",c:c,
     content:e("div",null,
       e(Pearl,{t:"TSS ≠ IAD"},"TSS: síntomas físicos REALES + respuesta psicológica excesiva. IAD: preocupación por ENFERMAR con síntomas físicos ausentes o leves."),
       e(Pearl,{t:"Signo de Hoover"},"Conversión con 'parálisis' de pierna: al intentar levantar la pierna sana, la 'parética' hace contracción INVOLUNTARIA por acoplamiento contralateral. Signo 'positivo' → conversión."),
       e(Pearl,{t:"Facticio: motivación INTERNA"},"Diferencia clave con simulación. En facticio el paciente quiere el rol de enfermo; en simulación quiere dinero, licencia, droga o evadir algo."),
       e(Pearl,{t:"Munchausen por poderes (facticio impuesto a otro)"},"Es ABUSO. Requiere protección del niño/dependiente y tratamiento del perpetrador."),
       e(Pearl,{t:"La belle indifférence"},"Término histórico. NO es específica ni sensible de conversión. Ya no es criterio DSM, pero aparece en preguntas."),
       e(Pearl,{t:"Amnesia disociativa vs orgánica"},"Disociativa: preserva conciencia, sin confabulación, información recuperable. Korsakoff: confabulación + déficit ejecutivo + déficits de tiamina."),
       e(Pearl,{t:"Despersonalización transitoria es NORMAL"},"~50% de adultos sanos la ha experimentado alguna vez (fatiga, estrés, cannabis). Solo es trastorno cuando es persistente + deterioro."),
       e(Pearl,{t:"TID y trauma infantil"},"La asociación con trauma severo temprano es casi constante. Evaluar comorbilidad con TEPT, autolesión, sustancias."),
       e(Pearl,{t:"Conversión · no se llama histeria"},"Término obsoleto. El DSM-5 lo renombró 'síntomas neurológicos funcionales'. Los signos positivos reemplazan la búsqueda de 'conflicto psicológico'.")
     )},
    {id:"resumen",ic:"📊",t:"Resumen comparativo",sub:"Las 8 entidades",c:c,
     content:e("div",null,
       e(H3,{c:c},"Somáticos"),
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"Núcleo",c:c},{t:"Tx",c:c}],
         rows:[
           ["TSS","Síntomas físicos REALES + respuesta desproporcionada","Consulta fija + TCC ± ISRS"],
           ["IAD","Preocupación por enfermar, síntomas ausentes/leves","TCC + ISRS si comorbilidad"],
           ["Conversión","Déficit neurológico funcional · signos positivos","Comunicación clara + fisioterapia + TCC"],
           ["Factores psicológicos en afección médica","Enfermedad real + factores psico que la empeoran","Intervenciones específicas + coord médica"],
           ["Facticio","Produce síntomas · motivación INTERNA","Estrategia no punitiva + salida con 'salvar cara'"]
         ]
       }),
       e(H3,{c:cd,mt:14},"Disociativos"),
       e(Table,{
         headers:[{t:"Trastorno",c:cd},{t:"Núcleo",c:cd},{t:"Tx",c:cd}],
         rows:[
           ["TID","≥2 estados de personalidad + amnesia","Psicoterapia trauma-informada 3 fases"],
           ["Amnesia disociativa","Incapacidad de recordar info autobiográfica","Psicoterapia · recuperación espontánea"],
           ["Despersonalización/desrealización","Sensación de irrealidad · prueba de realidad intacta","TCC + psicoeducación"]
         ]
       })
     )},
    {id:"flash",ic:"🃏",t:"Flashcards",sub:"14 preguntas + las tuyas",c:c,
     content:e("div",null,
       e(P,null,"Tarjetas de repaso de somáticos y disociativos. Añade las tuyas."),
       e(FlashDeck,{c:c,deckId:"somaticos",items:getAllCards("somaticos")})
     )},
    {id:"quiz",ic:"❓",t:"Quiz · 6 casos clínicos",sub:"Prueba tus conocimientos",c:c,
     content:e(Quiz,{c:c,items:getAllQuiz("somaticos")})}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Tema 4 · Neurosis · DSM-5-TR",title:"Somáticos y disociativos"},
      "Dos capítulos del DSM-5 que se presentan juntos por afinidad clínica y diagnóstico diferencial frecuente. ",e("b",null,"5 trastornos somáticos")," (síntomas físicos como centro del sufrimiento) + ",e("b",null,"3 disociativos")," (discontinuidad en conciencia, memoria, identidad o percepción). Total: ",e("b",null,"8 entidades"),"."
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.3),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Conceptos · DDx claves · Flashcards · Quiz")
    ),
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginTop:10}},
      general.map(function(g,i){
        return e("button",{key:g.id,onClick:function(){setOpenGen(i);},style:{padding:"14px 12px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:10,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:4,minHeight:90}},
          e("div",{style:{fontSize:22,marginBottom:4}},g.ic),
          e("div",{style:{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Playfair Display"}},g.t),
          e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.4,marginTop:2}},g.sub)
        );
      })
    ),
    openGen!==null?e(DzModal,{c:general[openGen].c,name:general[openGen].t,kicker:"Sección del tema",single:general[openGen].content,onClose:function(){setOpenGen(null);}}):null,

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.15)+","+ax(c,.04)+" 90%)",border:"1px solid "+ax(c,.35),borderRadius:14,margin:"18px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Las 8 enfermedades"),
      e("div",{style:{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Toca cualquier enfermedad para abrir su ficha"),
      e("div",{style:{fontSize:12,color:C.mt,marginTop:4,lineHeight:1.45}},"Las primeras 5 son somáticas (verde) · las últimas 3 disociativas (rosa)")
    ),
    e(DzGrid,{c:c,items:diseases}),

    e(Abbrev,{c:c,items:[
      {a:"TSS",d:"Trastorno de Síntomas Somáticos"},
      {a:"IAD",d:"Illness Anxiety Disorder (ansiedad por enfermedad)"},
      {a:"TID",d:"Trastorno de Identidad Disociativo"},
      {a:"ISRS",d:"Inhibidores Selectivos de la Recaptación de Serotonina"},
      {a:"TCC",d:"Terapia Cognitivo-Conductual"},
      {a:"BZD",d:"Benzodiacepinas"},
      {a:"AGT",d:"Amnesia Global Transitoria"}
    ]})
  );
}

// ══════════════════════════════════════════════════════════════
// HUB RAÍZ · Psicosis vs Neurosis
// ══════════════════════════════════════════════════════════════


// ══════════════════════════════════════════════════════════════
// TEMA 5 · TRASTORNOS DE LA CONDUCTA ALIMENTARIA (TCA)
// ══════════════════════════════════════════════════════════════

function TCAView(){
  var c=C.tca;
  var diseases=[
    {
      n:"01",name:"Anorexia nerviosa (AN)",c:c,
      blurb:"Restricción + IMC bajo + miedo a engordar + distorsión corporal",
      sections:{
        def:e(Def,{c:c},"Restricción persistente de la ingesta energética que lleva a un ",e("b",null,"peso corporal significativamente bajo")," para edad, sexo, curso del desarrollo y salud física. Se acompaña de ",e("b",null,"miedo intenso a ganar peso")," (incluso cuando el paciente está por debajo del peso saludable) y de ",e("b",null,"alteración en la percepción del peso o la forma corporal"),"."),
        cli:e("div",null,
          e(H3,{c:c},"Los 2 subtipos"),
          e(Table,{
            headers:[{t:"Subtipo",c:c},{t:"Característica",c:c}],
            rows:[
              ["Restrictivo","Pérdida de peso solo por dieta, ayuno y/o ejercicio excesivo. SIN atracones ni purgas en los últimos 3 meses"],
              ["Con atracones/purgas","En los últimos 3 meses hay episodios recurrentes de atracones y/o purgas (vómito autoprovocado, laxantes, diuréticos, enemas)"]
            ]
          }),
          e(H3,{c:c,mt:14},"Gravedad · IMC (adultos)"),
          e(Table,{
            headers:[{t:"Nivel",c:c},{t:"IMC (kg/m²)",c:c}],
            rows:[
              ["Leve","≥ 17"],
              ["Moderada","16 – 16.99"],
              ["Grave","15 – 15.99"],
              ["Extrema","< 15"]
            ]
          }),
          e(H3,{c:c,mt:14},"Epidemiología"),
          e(SxList,{c:c,items:[
            "Prevalencia de por vida ~0.6% (mujeres ~0.9%, hombres ~0.3%)",
            "Inicio típico en adolescencia (13–18 años)",
            "Ratio mujeres:hombres aproximadamente 10:1",
            "Mortalidad más alta de todos los trastornos psiquiátricos (~5–10% a 10 años)",
            "Muerte por complicaciones médicas (arritmias, desnutrición) o por suicidio"
          ]}),
          e(H3,{c:c,mt:14},"Complicaciones médicas"),
          e(Table,{
            headers:[{t:"Sistema",c:c},{t:"Hallazgos",c:c}],
            rows:[
              ["Cardiovascular","Bradicardia, hipotensión, prolongación del QT, arritmias, pericarditis, atrofia miocárdica"],
              ["Endocrino","Amenorrea, hipogonadismo, osteopenia/osteoporosis, hipotiroidismo eutiroideo-enfermo (T3 ↓)"],
              ["Hematológico","Anemia, leucopenia, trombocitopenia (pancitopenia en casos graves)"],
              ["Metabólico","Hipocalemia, hipofosfatemia, hiponatremia, hipoglucemia, deshidratación"],
              ["GI","Retraso del vaciamiento gástrico, estreñimiento, elevación de transaminasas"],
              ["Dermatológico","Lanugo (vello fino en cara, espalda, brazos), piel seca, caída de pelo, acrocianosis"],
              ["Signo de Russell (si purgas)","Callosidades en nudillos por inducir el vómito"]
            ]
          }),
          e(Alert,{c:C.bad,label:"⚠️ Síndrome de realimentación"},"Al iniciar realimentación en paciente severamente desnutrido hay entrada masiva de glucosa, insulina y desplazamiento intracelular de ",e("b",null,"fósforo, potasio y magnesio"),". Riesgo de ",e("b",null,"arritmias fatales, insuficiencia cardíaca y edema pulmonar"),". Prevenir con: aporte calórico ",e("b",null,"inicial BAJO")," (~20 kcal/kg/día), avance lento, suplementos de tiamina, fosfato, potasio y magnesio, monitoreo diario de electrolitos los primeros 7 días.")
        ),
        dx:e(CritBlock,{title:"Anorexia nerviosa (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Restricción de la ingesta energética relativa a los requerimientos que lleva a un peso corporal ",e("b",null,"significativamente bajo")," en el contexto de edad, sexo, curso del desarrollo y salud física."),
          e(Crit,{crit:"B",c:c},"Miedo intenso a ganar peso o a engordar, o comportamiento persistente que interfiere con la ganancia de peso, incluso cuando el peso está significativamente bajo."),
          e(Crit,{crit:"C",c:c},"Alteración en la forma en que se experimenta el peso o la silueta corporal, influencia indebida del peso/silueta en la autoevaluación, o falta persistente de reconocimiento de la gravedad del bajo peso actual.")
        ),
        tx:e("div",null,
          e(H3,{c:c},"Manejo"),
          e(SxList,{c:c,items:[
            "Restablecimiento nutricional y del peso — PRIORIDAD",
            "Hospitalización médica si: IMC <15, bradicardia <40, hipotensión severa, alteración electrolítica, síncope, inestabilidad hemodinámica, falla del tratamiento ambulatorio",
            "Terapia familiar basada en Maudsley (TFB-M) — 1ª línea en adolescentes",
            "TCC-E (terapia cognitivo-conductual mejorada) — 1ª línea en adultos",
            "Olanzapina baja dosis (2.5–10 mg) puede ayudar con ansiedad ante comida y ganancia de peso",
            "Evitar bupropión (↓ umbral convulsivo en pacientes con purgas)",
            "ISRS NO son eficaces en el cuadro central de AN; solo tratan comorbilidades (depresión, TOC)"
          ]}),
          e(Alert,{c:C.warn,label:"🔑 Reglas de oro"},"1) El peso es lo PRIMERO: sin nutrición no hay respuesta a psicoterapia. 2) En adolescentes, FAMILIA como aliada (Maudsley). 3) ISRS solo si depresión o TOC comórbidos — no cura la AN. 4) Vigilancia de realimentación los primeros 7 días.")
        )
      }
    },
    {
      n:"02",name:"Bulimia nerviosa (BN)",c:c,
      blurb:"Atracones + conductas compensatorias · 1/semana x 3 meses · Peso normal",
      sections:{
        def:e(Def,{c:c},"Episodios recurrentes de ",e("b",null,"atracones")," (ingesta en poco tiempo de una cantidad de comida claramente mayor de la que la mayoría de personas comerían, con sensación de ",e("b",null,"pérdida de control"),") seguidos de ",e("b",null,"conductas compensatorias inapropiadas")," para evitar ganar peso (vómito autoprovocado, laxantes, diuréticos, ayuno, ejercicio excesivo). El peso suele estar ",e("b",null,"normal o con sobrepeso"),", no bajo como en anorexia."),
        cli:e("div",null,
          e(H3,{c:c},"Gravedad · promedio semanal de conductas compensatorias"),
          e(Table,{
            headers:[{t:"Nivel",c:c},{t:"Episodios/semana",c:c}],
            rows:[
              ["Leve","1–3"],
              ["Moderado","4–7"],
              ["Grave","8–13"],
              ["Extremo","≥14"]
            ]
          }),
          e(H3,{c:c,mt:14},"Epidemiología"),
          e(SxList,{c:c,items:[
            "Prevalencia de por vida ~1–1.5% (mujeres) · ~0.5% (hombres)",
            "Inicio típico en adolescencia tardía o adultez temprana (18–22 años)",
            "Ratio mujeres:hombres aproximadamente 10:1",
            "Frecuente comorbilidad con depresión, ansiedad, uso de sustancias, trastorno límite de personalidad",
            "Mortalidad menor que en anorexia pero significativa"
          ]}),
          e(H3,{c:c,mt:14},"Signos clínicos clave"),
          e(Table,{
            headers:[{t:"Signo",c:c},{t:"Por qué aparece",c:c}],
            rows:[
              ["Signo de Russell","Callosidades en nudillos por usar los dedos para inducir el vómito"],
              ["Erosión dental del esmalte palatino","Contacto repetido de ácido gástrico con los dientes"],
              ["Hipertrofia parotídea bilateral","Estimulación repetida por vómito · 'cara de ardilla'"],
              ["Alcalosis metabólica hipoclorémica","Pérdida de HCl por vómito · K+ ↓, Cl- ↓"],
              ["Acidosis metabólica","Si abuso de laxantes (pérdida de HCO3- intestinal)"],
              ["Desgarro de Mallory-Weiss","Vómito violento repetido"],
              ["Arritmias","Por hipocalemia secundaria a vómito o diuréticos"]
            ]
          }),
          e(Alert,{c:C.bad,label:"⚠️ Riesgo cardiaco"},"La hipocalemia grave (K+ <3 mEq/L) puede precipitar ",e("b",null,"arritmias ventriculares y paro cardíaco"),". Siempre medir electrolitos y ECG en BN con purgas frecuentes.")
        ),
        dx:e(CritBlock,{title:"Bulimia nerviosa (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Episodios recurrentes de atracones, caracterizados por: (1) ingesta en un periodo determinado (p. ej., 2h) de una cantidad claramente mayor de la que la mayoría de las personas comerían; (2) sensación de falta de control durante el episodio."),
          e(Crit,{crit:"B",c:c},"Comportamientos compensatorios inapropiados recurrentes para evitar ganar peso (vómito, laxantes, diuréticos, ayuno, ejercicio excesivo)."),
          e(Crit,{crit:"C",c:c},"Los atracones y las conductas compensatorias ocurren, en promedio, ",e("b",null,"≥1 vez por semana durante 3 meses"),"."),
          e(Crit,{crit:"D",c:c},"La autoevaluación está indebidamente influida por la silueta y el peso corporal."),
          e(Crit,{crit:"E",c:c},"La alteración no ocurre exclusivamente durante episodios de anorexia nerviosa.")
        ),
        tx:e("div",null,
          e(H3,{c:c},"1ª línea psicoterapéutico"),
          e(P,null,e("b",null,"TCC-E (cognitivo-conductual mejorada)")," · evidencia de primera línea. Terapia interpersonal (TIP) como alternativa."),
          e(H3,{c:c,mt:14},"1ª línea farmacológico"),
          e(Table,{
            headers:[{t:"Fármaco",c:c},{t:"Dosis",c:c},{t:"Notas",c:c}],
            rows:[
              ["Fluoxetina ★","60 mg/día","ÚNICO ISRS con aprobación FDA para BN · dosis mayor que en depresión"],
              ["Sertralina","50–200 mg","Alternativa"],
              ["Topiramato","25–400 mg","Reduce atracones · cuidado con pérdida cognitiva"],
              ["Lisdexanfetamina","No aprobado en BN","Solo aprobado para trastorno por atracón"]
            ]
          }),
          e(Alert,{c:C.bad,label:"⚠️ CONTRAINDICADO"},e("b",null,"Bupropión NUNCA en BN/AN")," — reduce el umbral convulsivo en pacientes con alteraciones electrolíticas por purgas.")
        )
      }
    },
    {
      n:"03",name:"Trastorno por atracón (TpA)",c:c,
      blurb:"Atracones SIN compensación · 1/semana x 3 meses · Obesidad frecuente",
      sections:{
        def:e(Def,{c:c},"Episodios recurrentes de atracones (mismo concepto que en bulimia — ingesta excesiva + pérdida de control) ",e("b",null,"SIN conductas compensatorias")," inapropiadas. Es el TCA más frecuente. Fuerte asociación con ",e("b",null,"obesidad"),"."),
        cli:e("div",null,
          e(H3,{c:c},"Características del atracón"),
          e(SxList,{c:c,items:[
            "Comer mucho más rápidamente de lo normal",
            "Comer hasta sentirse desagradablemente lleno",
            "Comer grandes cantidades sin sentir hambre física",
            "Comer a solas debido a vergüenza",
            "Sentirse disgustado, deprimido o muy culpable después"
          ]}),
          e(H3,{c:c,mt:14},"Gravedad · atracones/semana"),
          e(Table,{
            headers:[{t:"Nivel",c:c},{t:"Atracones/semana",c:c}],
            rows:[
              ["Leve","1–3"],
              ["Moderado","4–7"],
              ["Grave","8–13"],
              ["Extremo","≥14"]
            ]
          }),
          e(H3,{c:c,mt:14},"Epidemiología"),
          e(SxList,{c:c,items:[
            "Prevalencia de por vida ~2–3% · es el TCA más frecuente",
            "Mujeres 2:1 (ratio menos pronunciado que AN o BN)",
            "Pico de inicio en adultez temprana (20s)",
            "~40–50% de los pacientes con obesidad que buscan tratamiento para perder peso tienen TpA",
            "Alta comorbilidad con depresión, ansiedad, trastornos por sustancias"
          ]})
        ),
        dx:e(CritBlock,{title:"Trastorno por atracón (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Episodios recurrentes de atracones (mismos criterios que BN criterio A)."),
          e(Crit,{crit:"B",c:c},"Los atracones se asocian a ≥3 de 5 características listadas arriba."),
          e(Crit,{crit:"C",c:c},"Malestar marcado por los atracones."),
          e(Crit,{crit:"D",c:c},"Los atracones ocurren en promedio ",e("b",null,"≥1 vez/semana durante 3 meses"),"."),
          e(Crit,{crit:"E",c:c},"NO se asocia con conductas compensatorias inapropiadas recurrentes y no ocurre exclusivamente durante BN o AN.")
        ),
        tx:e("div",null,
          e(H3,{c:c},"1ª línea psicoterapéutico"),
          e(P,null,e("b",null,"TCC específica para TpA")," o TCC-E. Terapia interpersonal como alternativa."),
          e(H3,{c:c,mt:14},"Farmacoterapia"),
          e(Table,{
            headers:[{t:"Fármaco",c:c},{t:"Dosis",c:c},{t:"Notas",c:c}],
            rows:[
              ["Lisdexanfetamina ★","50–70 mg/día","ÚNICO con aprobación FDA específica para TpA en adultos"],
              ["Topiramato","100–400 mg/día","Reduce atracones y peso"],
              ["Fluoxetina","60 mg/día","Evidencia moderada"],
              ["Sertralina","50–200 mg/día","Alternativa"]
            ]
          }),
          e(Pearl,{t:"Manejo de la obesidad"},"Combinar manejo del TpA con intervenciones para pérdida de peso (no dietas muy restrictivas, que pueden perpetuar el ciclo). Actividad física regular. Si el paciente busca cirugía bariátrica, tratar el TpA ANTES y durante.")
        )
      }
    },
    {
      n:"04",name:"ARFID (trastorno de evitación/restricción)",c:c,
      blurb:"Evitación alimentaria SIN preocupación por imagen corporal",
      sections:{
        def:e(Def,{c:c},"ARFID = ",e("b",null,"Avoidant/Restrictive Food Intake Disorder"),". Evitación o restricción de la ingesta con pérdida de peso significativa, déficit nutricional, dependencia de suplementación o interferencia psicosocial, ",e("b",null,"SIN")," la preocupación por el peso o la imagen corporal típica de AN o BN."),
        cli:e("div",null,
          e(H3,{c:c},"Las 3 presentaciones principales"),
          e(Table,{
            headers:[{t:"Presentación",c:c},{t:"Características",c:c}],
            rows:[
              ["Sensorial","Aversión a texturas, sabores, olores, aspectos visuales. Frecuente en niños neurodiversos (espectro autista, TDAH)"],
              ["Falta de interés por la comida","Poco apetito · olvida comer · no disfruta comer · saciedad temprana"],
              ["Miedo a consecuencias aversivas","Tras atragantamiento, vómito, reacción alérgica previa · miedo condicionado"]
            ]
          }),
          e(H3,{c:c,mt:14},"Epidemiología"),
          e(SxList,{c:c,items:[
            "Sustituyó al 'trastorno de la ingestión alimentaria en la infancia' del DSM-IV",
            "Puede aparecer a cualquier edad — no es solo infantil",
            "Sin predominio de género claro",
            "Alta comorbilidad con trastornos de ansiedad, TOC, espectro autista, TDAH"
          ]})
        ),
        dx:e(CritBlock,{title:"ARFID (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Trastorno de la alimentación manifestado por fracaso persistente para satisfacer las necesidades nutricionales/energéticas, con ≥1 de: pérdida de peso significativa (o fallo en el crecimiento), deficiencia nutricional significativa, dependencia de nutrición enteral o de suplementos, interferencia marcada con el funcionamiento psicosocial."),
          e(Crit,{crit:"B",c:c},"NO se explica por falta de disponibilidad de alimento ni por una práctica culturalmente sancionada."),
          e(Crit,{crit:"C",c:c},"NO ocurre exclusivamente durante AN o BN, ni hay alteración de la percepción del peso o la forma corporal."),
          e(Crit,{crit:"D",c:c},"No se explica mejor por otra afección médica u otro trastorno mental. Si coexiste con otra afección, la alteración alimentaria excede lo atribuible a ella.")
        ),
        tx:e(P,null,"Equipo multidisciplinar: nutrición + pediatría/medicina + terapeuta ocupacional (para integración sensorial) + TCC. Si hay ansiedad comórbida marcada, ISRS. La exposición gradual a nuevos alimentos es clave. No hay fármaco con indicación específica.")
      }
    },
    {
      n:"05",name:"Pica",c:c,
      blurb:"Ingestión de sustancias no nutritivas por ≥1 mes",
      sections:{
        def:e(Def,{c:c},"Ingestión persistente de ",e("b",null,"sustancias no nutritivas y no alimentarias")," durante ",e("b",null,"≥1 mes"),", inapropiada para el nivel de desarrollo y no culturalmente aceptada. Ejemplos: tierra, hielo (pagofagia), tiza, papel, jabón, pelo, pintura, metal."),
        cli:e("div",null,
          e(P,null,"Frecuente en niños pequeños, embarazadas, personas con déficits nutricionales (anemia ferropénica, deficiencia de zinc), discapacidad intelectual o autismo."),
          e(H3,{c:c,mt:14},"Complicaciones"),
          e(SxList,{c:c,items:[
            "Intoxicación por plomo (comer pintura antigua)",
            "Obstrucción o perforación intestinal",
            "Infecciones parasitarias (geofagia)",
            "Bezoares (tricobezoar si come pelo · fitobezoar si fibras vegetales)",
            "Daño dental"
          ]}),
          e(Pearl,{t:"Pagofagia y anemia ferropénica"},"Comer hielo compulsivamente se asocia fuertemente a ",e("b",null,"déficit de hierro"),". Mejora al corregir la anemia. Siempre medir ferritina en estos pacientes.")
        ),
        dx:e(CritBlock,{title:"Pica (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Ingestión persistente de sustancias no nutritivas y no alimentarias durante ≥1 mes."),
          e(Crit,{crit:"B",c:c},"La ingestión es inapropiada para el nivel de desarrollo del individuo."),
          e(Crit,{crit:"C",c:c},"El comportamiento NO forma parte de una práctica culturalmente aceptada o socialmente normativa."),
          e(Crit,{crit:"D",c:c},"Si ocurre en el contexto de otro trastorno mental o afección médica (ej., autismo, embarazo), debe ser suficientemente grave para justificar atención clínica adicional.")
        ),
        tx:e(P,null,"Evaluar y corregir deficiencias nutricionales (hierro, zinc). Manejar complicaciones médicas. Terapia conductual (análisis funcional, reforzamiento diferencial) en discapacidad intelectual. Revisar y asegurar el entorno (retirar sustancias peligrosas).")
      }
    },
    {
      n:"06",name:"Trastorno de rumiación",c:c,
      blurb:"Regurgitación repetida del alimento · ≥1 mes",
      sections:{
        def:e(Def,{c:c},"Regurgitación repetida del alimento durante ",e("b",null,"≥1 mes"),", que puede ser remasticado, retragado o escupido. NO es atribuible a condiciones gastrointestinales (reflujo, estenosis pilórica) ni ocurre exclusivamente dentro de otro TCA."),
        cli:e("div",null,
          e(P,null,"Aparece en lactantes, niños (especialmente con discapacidad intelectual) y adultos (con o sin discapacidad). En lactantes puede relacionarse con estimulación deficitaria o trastorno del vínculo. En adultos se asocia a estrés y ansiedad."),
          e(Note,{c:c,t:"DDx"},"Diferenciar de ERGE (reflujo patológico con acidez, esofagitis) y de vómito en BN (con conductas compensatorias y preocupación por el peso).")
        ),
        dx:e(CritBlock,{title:"Trastorno de rumiación (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Regurgitación repetida de los alimentos durante ≥1 mes. Los alimentos regurgitados pueden ser remasticados, retragados o escupidos."),
          e(Crit,{crit:"B",c:c},"La regurgitación NO se puede atribuir a una afección GI asociada u otra afección médica (ej., ERGE, estenosis pilórica)."),
          e(Crit,{crit:"C",c:c},"No ocurre exclusivamente en el curso de AN, BN, TpA o ARFID."),
          e(Crit,{crit:"D",c:c},"Si ocurre en otro trastorno mental (p. ej., discapacidad intelectual), debe ser suficientemente grave para justificar atención clínica adicional.")
        ),
        tx:e(P,null,"Terapia conductual (respiración diafragmática, entrenamiento en hábitos), biofeedback. Tratar ansiedad o estrés subyacente. En niños pequeños, mejorar el entorno de alimentación y el vínculo.")
      }
    }
  ];

  var s1=useState(null);var openGen=s1[0],setOpenGen=s1[1];
  var general=[
    {id:"conceptos",ic:"🧭",t:"Conceptos generales",sub:"Del capítulo TCA",c:c,
     content:e("div",null,
       e(P,null,"Los trastornos de la conducta alimentaria son cuadros con alteraciones persistentes de la conducta de alimentación que resultan en un consumo o absorción alterada de los alimentos, con deterioro significativo de la salud física o del funcionamiento psicosocial."),
       e(H3,{c:c,mt:14},"Las 6 entidades del DSM-5"),
       e(Table,{
         headers:[{t:"Entidad",c:c},{t:"Núcleo",c:c}],
         rows:[
           ["Anorexia nerviosa","Restricción + IMC bajo + miedo a engordar + distorsión corporal"],
           ["Bulimia nerviosa","Atracón + conducta compensatoria · peso normal o sobrepeso"],
           ["Trastorno por atracón","Atracón sin conducta compensatoria · frecuente obesidad"],
           ["ARFID","Evitación/restricción SIN preocupación por imagen corporal"],
           ["Pica","Ingestión de sustancias no nutritivas ≥1 mes"],
           ["Trastorno de rumiación","Regurgitación repetida ≥1 mes"]
         ]
       }),
       e(Note,{c:c,t:"Regla jerárquica"},"AN tiene prioridad sobre BN cuando ambos criterios se cumplen. BN tiene prioridad sobre TpA. Pica puede diagnosticarse en presencia de otro trastorno si es clínicamente significativa.")
     )},
    {id:"ddx",ic:"🧭",t:"Diagnóstico diferencial",sub:"AN vs BN vs TpA · lo esencial",c:c,
     content:e("div",null,
       e(P,null,"Tabla más preguntada en el examen. La distinción clave es: ¿hay restricción con IMC bajo? → AN. ¿Hay atracones + purgas y peso normal? → BN. ¿Hay atracones sin purgas? → TpA."),
       e(Table,{
         headers:[{t:"Característica",c:c},{t:"Anorexia",c:c},{t:"Bulimia",c:c},{t:"Por atracón",c:c}],
         rows:[
           ["Peso","BAJO (IMC < normal)","Normal o sobrepeso","Sobrepeso u obesidad"],
           ["Atracones","Posibles (subtipo)","Presentes","Presentes"],
           ["Conductas compensatorias","Posibles (subtipo)","Presentes","AUSENTES"],
           ["Distorsión imagen corporal","Marcada","Presente","Menos marcada"],
           ["Miedo a engordar","Intenso","Intenso","Menos intenso"],
           ["Tratamiento psicoterapia 1ª línea","TFB-Maudsley (ados) · TCC-E (adultos)","TCC-E","TCC específica TpA"],
           ["Tratamiento farmacológico","Olanzapina (adyuvante)","Fluoxetina 60 mg","Lisdexanfetamina"]
         ]
       })
     )},
    {id:"tx",ic:"💊",t:"Tratamiento · resumen del tema",sub:"Dosis + aprobaciones FDA",c:c,
     content:e("div",null,
       e(H3,{c:c},"Farmacología por entidad"),
       e(Table,{
         headers:[{t:"Entidad",c:c},{t:"Fármaco",c:c},{t:"Dosis",c:c}],
         rows:[
           ["Anorexia","Olanzapina (adyuvante)","2.5–10 mg/día · ayuda ansiedad y peso"],
           ["Bulimia ★","Fluoxetina (FDA)","60 mg/día · única aprobación específica"],
           ["Bulimia alt.","Topiramato","25–400 mg/día"],
           ["Por atracón ★","Lisdexanfetamina (FDA)","50–70 mg/día · única aprobación específica"],
           ["Por atracón alt.","Topiramato · fluoxetina","Similar"],
           ["Comorbilidades","ISRS","Depresión, ansiedad, TOC"]
         ]
       }),
       e(Alert,{c:C.bad,label:"⚠️ CONTRAINDICADOS"},
         e("ol",{style:{margin:0,paddingLeft:20,lineHeight:1.8,fontSize:13}},
           e("li",null,e("b",null,"Bupropión")," — ↓ umbral convulsivo en pacientes con purgas · evitarlo en AN y BN."),
           e("li",null,e("b",null,"Anfetaminas en AN")," — no hay indicación · solo en TpA."),
           e("li",null,e("b",null,"ISRS como 'cura' de AN")," — no tratan el núcleo · solo comorbilidades.")
         )
       ),
       e(H3,{c:c,mt:14},"Psicoterapia"),
       e(Table,{
         headers:[{t:"Modalidad",c:c},{t:"Mejor para",c:c}],
         rows:[
           ["TFB-Maudsley (basada en familia)","Anorexia en adolescentes — 1ª línea"],
           ["TCC-E (enhanced)","BN y AN en adultos"],
           ["TCC específica TpA","Trastorno por atracón"],
           ["Terapia interpersonal","Alternativa en BN y TpA"]
         ]
       })
     )},
    {id:"realim",ic:"⚠️",t:"Síndrome de realimentación",sub:"La emergencia médica del tema",c:c,
     content:e("div",null,
       e(Def,{c:c},"Complicación potencialmente fatal al iniciar nutrición en un paciente severamente desnutrido (IMC <15 o pérdida >15% en 3 meses)."),
       e(H3,{c:c,mt:14},"Fisiopatología"),
       e(P,null,"Durante la desnutrición, el metabolismo se adapta a usar grasa y proteína como fuente de energía; los depósitos de fósforo, potasio y magnesio intracelulares están disminuidos pese a niveles séricos normales. Al introducir glucosa → ",e("b",null,"insulina ↑")," → desplazamiento masivo intracelular de fósforo, potasio y magnesio → ",e("b",null,"hipofosfatemia, hipocalemia, hipomagnesemia graves"),"."),
       e(H3,{c:c,mt:14},"Manifestaciones"),
       e(SxList,{c:c,items:[
         "Arritmias (fibrilación ventricular, torsades por hipoK+ y hipoMg2+)",
         "Insuficiencia cardíaca congestiva aguda",
         "Edema pulmonar",
         "Debilidad muscular grave, rabdomiólisis",
         "Encefalopatía de Wernicke si no se suplementa tiamina",
         "Insuficiencia respiratoria (fosfato es clave para ATP diafragmático)"
       ]}),
       e(Alert,{c:C.warn,label:"🔑 Prevención"},
         e("ol",{style:{margin:0,paddingLeft:20,lineHeight:1.8,fontSize:13}},
           e("li",null,e("b",null,"Tiamina")," 100–200 mg IV/IM ANTES de iniciar alimentación."),
           e("li",null,"Iniciar con ",e("b",null,"20 kcal/kg/día")," (bajo) y avanzar 10–20% cada 2 días."),
           e("li",null,"Suplementar ",e("b",null,"fosfato, potasio, magnesio")," profilácticamente."),
           e("li",null,"Monitoreo diario de electrolitos los primeros 7 días."),
           e("li",null,"Función cardíaca (ECG, FC, peso diario, balance).")
         )
       )
     )},
    {id:"perlas",ic:"📌",t:"Perlas de examen",sub:"Alto rendimiento",c:c,
     content:e("div",null,
       e(Pearl,{t:"Mortalidad de AN"},"Es el trastorno psiquiátrico con la ",e("b",null,"mortalidad más alta")," (~5–10% a 10 años). Causa: arritmias, desnutrición, suicidio."),
       e(Pearl,{t:"Signo de Russell"},"Callosidades en dorso de los nudillos por el contacto repetido con los dientes al provocar el vómito. Patognomónico de ",e("b",null,"purgas")," (BN o AN subtipo con purgas)."),
       e(Pearl,{t:"Hipertrofia parotídea"},"Cara redonda/'de ardilla' en BN por estimulación repetida de las parótidas al vomitar."),
       e(Pearl,{t:"Alcalosis vs acidosis"},"Vómito → alcalosis metabólica hipoclorémica (K+ ↓, Cl- ↓). Abuso de laxantes → acidosis metabólica hiperclorémica (pérdida de HCO3- intestinal)."),
       e(Pearl,{t:"Fluoxetina en BN"},e("b",null,"60 mg/día")," — dosis MAYOR que en depresión (20 mg). Única aprobación FDA para BN."),
       e(Pearl,{t:"Lisdexanfetamina en TpA"},"Único fármaco con aprobación FDA para trastorno por atracón en adultos. Dosis 50–70 mg/día."),
       e(Pearl,{t:"Bupropión contraindicado"},"NUNCA en AN ni BN — reduce el umbral convulsivo y el paciente con purgas tiene alteraciones electrolíticas que aumentan el riesgo de convulsiones."),
       e(Pearl,{t:"ARFID ≠ AN"},"ARFID también tiene restricción y bajo peso, pero ",e("b",null,"SIN preocupación por imagen corporal ni miedo a engordar"),". Muy frecuente en niños con espectro autista."),
       e(Pearl,{t:"Pagofagia"},"Comer hielo compulsivamente → pensar en ",e("b",null,"anemia ferropénica"),". Medir ferritina."),
       e(Pearl,{t:"Maudsley"},"Terapia familiar basada en Maudsley = 1ª línea para anorexia en ",e("b",null,"adolescentes"),". Los padres son los 'agentes del cambio' al inicio."),
       e(Pearl,{t:"Atracón — definición"},"Dos requisitos: (1) cantidad mucho mayor que otros en el mismo tiempo, (2) ",e("b",null,"pérdida de control"),". Sin el segundo no es atracón, aunque la cantidad sea grande.")
     )},
    {id:"resumen",ic:"📊",t:"Resumen comparativo",sub:"Las 6 entidades en una tabla",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Entidad",c:c},{t:"Duración/umbral",c:c},{t:"Tx farmacológico",c:c}],
         rows:[
           ["Anorexia nerviosa","Cualquiera · peso bajo significativo","Olanzapina (adyuvante) · ISRS solo si comorbilidades"],
           ["Bulimia nerviosa","≥1/semana x 3 meses","Fluoxetina 60 mg/día (FDA)"],
           ["Trastorno por atracón","≥1/semana x 3 meses","Lisdexanfetamina 50–70 mg (FDA)"],
           ["ARFID","Cualquiera · deterioro nutricional","Sintomático · ISRS si ansiedad"],
           ["Pica","≥1 mes","Corregir deficiencias (Fe, Zn)"],
           ["Rumiación","≥1 mes","Terapia conductual · biofeedback"]
         ]
       })
     )},
    {id:"flash",ic:"🃏",t:"Flashcards",sub:"14 preguntas + las tuyas",c:c,
     content:e("div",null,
       e(P,null,"Tarjetas de repaso de TCA. Añade las tuyas."),
       e(FlashDeck,{c:c,deckId:"tca",items:getAllCards("tca")})
     )},
    {id:"quiz",ic:"❓",t:"Quiz · 6 casos clínicos",sub:"Prueba tus conocimientos",c:c,
     content:e(Quiz,{c:c,items:getAllQuiz("tca")})}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Tema 5 · Neurosis · DSM-5",title:"Trastornos de la conducta alimentaria"},
      "Cuadros con alteraciones persistentes en la conducta de alimentación. Incluyen desde la anorexia nerviosa — el trastorno psiquiátrico con ",e("b",null,"mortalidad más alta")," — hasta entidades de presentación más sutil como ARFID y pica. Son ",e("b",null,"6 entidades DSM-5"),"."
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.3),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Conceptos · Tratamiento · Realimentación · Flashcards · Quiz")
    ),
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginTop:10}},
      general.map(function(g,i){
        return e("button",{key:g.id,onClick:function(){setOpenGen(i);},style:{padding:"14px 12px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:10,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:4,minHeight:90}},
          e("div",{style:{fontSize:22,marginBottom:4}},g.ic),
          e("div",{style:{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Playfair Display"}},g.t),
          e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.4,marginTop:2}},g.sub)
        );
      })
    ),
    openGen!==null?e(DzModal,{c:general[openGen].c,name:general[openGen].t,kicker:"Sección del tema",single:general[openGen].content,onClose:function(){setOpenGen(null);}}):null,

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.15)+","+ax(c,.04)+" 90%)",border:"1px solid "+ax(c,.35),borderRadius:14,margin:"18px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Las 6 enfermedades"),
      e("div",{style:{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Toca cualquier enfermedad para abrir su ficha"),
      e("div",{style:{fontSize:12,color:C.mt,marginTop:4,lineHeight:1.45}},"Cada ficha tiene tabs: Definición · Clínica · Diagnóstico · Tratamiento")
    ),
    e(DzGrid,{c:c,items:diseases}),

    e(Abbrev,{c:c,items:[
      {a:"AN",d:"Anorexia Nerviosa"},
      {a:"BN",d:"Bulimia Nerviosa"},
      {a:"TpA",d:"Trastorno por Atracón"},
      {a:"ARFID",d:"Avoidant/Restrictive Food Intake Disorder"},
      {a:"IMC",d:"Índice de Masa Corporal"},
      {a:"TCC-E",d:"Terapia Cognitivo-Conductual mejorada (enhanced)"},
      {a:"TFB-M",d:"Terapia Familiar Basada en Maudsley"},
      {a:"ERGE",d:"Enfermedad por Reflujo Gastroesofágico"},
      {a:"FDA",d:"Food and Drug Administration (EE.UU.)"},
      {a:"QT",d:"Intervalo QT del ECG"}
    ]})
  );
}



// ══════════════════════════════════════════════════════════════
// TEMA 6 · TRASTORNOS DEL SUEÑO-VIGILIA
// ══════════════════════════════════════════════════════════════

function SueView(){
  var c=C.sue;
  var diseases=[
    {
      n:"01",name:"Trastorno de insomnio",c:c,
      blurb:"Dificultad para iniciar/mantener el sueño · ≥3 noches/sem · ≥3 meses",
      sections:{
        def:e(Def,{c:c},"Insatisfacción predominante con la cantidad o calidad del sueño, asociada con ",e("b",null,"dificultad para iniciar el sueño, para mantenerlo")," (despertares nocturnos con dificultad para volver a dormir), o con ",e("b",null,"despertar precoz")," sin capacidad de volver a dormir. Causa malestar o deterioro diurno significativo."),
        cli:e("div",null,
          e(H3,{c:c},"Epidemiología"),
          e(SxList,{c:c,items:[
            "Prevalencia ~10–15% como trastorno (síntomas ocasionales ~30%)",
            "Más frecuente en mujeres (~1.4:1) y adultos mayores",
            "Alta comorbilidad con depresión, ansiedad, dolor crónico, enfermedad médica",
            "Curso crónico en ~50% de los casos"
          ]}),
          e(H3,{c:c,mt:14},"Especificadores"),
          e(SxList,{c:c,items:[
            "Con comorbilidad mental no relacionada con el sueño (p. ej., depresión)",
            "Con otra comorbilidad médica",
            "Con otro trastorno del sueño",
            "Episódico (1–3 meses) · Persistente (≥3 meses) · Recurrente (≥2 episodios en 1 año)"
          ]}),
          e(H3,{c:c,mt:14},"Factores perpetuadores (Modelo 3P de Spielman)"),
          e(Table,{
            headers:[{t:"Factor",c:c},{t:"Descripción",c:c}],
            rows:[
              ["Predisponentes","Genética, rasgo ansioso, edad, sexo femenino"],
              ["Precipitantes","Estresor vital, duelo, cambio de turno, enfermedad aguda"],
              ["Perpetuadores","Hábitos de sueño disfuncionales (siesta larga, permanecer en cama despierto, consumo de cafeína, ansiedad anticipatoria)"]
            ]
          })
        ),
        dx:e(CritBlock,{title:"Trastorno de insomnio (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Queja predominante de insatisfacción con la cantidad o calidad del sueño, con ≥1 de: (1) dificultad para iniciar el sueño, (2) dificultad para mantenerlo, (3) despertar precoz sin capacidad para volver a dormir."),
          e(Crit,{crit:"B",c:c},"La alteración causa malestar clínicamente significativo o deterioro."),
          e(Crit,{crit:"C",c:c},"La dificultad del sueño se produce al menos ",e("b",null,"3 noches por semana"),"."),
          e(Crit,{crit:"D",c:c},"La dificultad persiste durante al menos ",e("b",null,"3 meses"),"."),
          e(Crit,{crit:"E",c:c},"La dificultad se produce a pesar de oportunidades adecuadas para dormir."),
          e(Crit,{crit:"F",c:c},"No se explica mejor por otro trastorno del sueño."),
          e(Crit,{crit:"G",c:c},"No atribuible a sustancias."),
          e(Crit,{crit:"H",c:c},"Los trastornos mentales y afecciones médicas coexistentes no explican adecuadamente la queja predominante de insomnio.")
        ),
        tx:e("div",null,
          e(H3,{c:c},"1ª línea: TCC-I (TCC para insomnio)"),
          e(SxList,{c:c,items:[
            "Educación sobre higiene del sueño",
            "Control de estímulos (cama = dormir + sexo · no TV, no comida, no trabajo)",
            "Restricción de sueño (acortar tiempo en cama para aumentar eficiencia)",
            "Reestructuración cognitiva sobre creencias disfuncionales",
            "Relajación (respiración, imaginería)"
          ]}),
          e(H3,{c:c,mt:14},"Farmacoterapia"),
          e(Table,{
            headers:[{t:"Grupo",c:c},{t:"Fármacos",c:c},{t:"Notas",c:c}],
            rows:[
              ["Antagonistas de orexina","Suvorexant, lemborexant, daridorexant","Nuevos · poco riesgo de dependencia"],
              ["Agonistas de melatonina","Ramelteón, melatonina","Útil para inicio del sueño · sin dependencia"],
              ["Z-drugs (BZRA no BZD)","Zolpidem, zaleplón, eszopiclona","Efectivos pero riesgo de sonambulismo, caídas"],
              ["BZD","Temazepam, triazolam","Uso CORTO · riesgo de dependencia"],
              ["Sedantes atípicos","Doxepina dosis baja (3–6 mg), mirtazapina","Si comorbilidad depresiva"],
              ["No recomendados rutinariamente","Difenhidramina, quetiapina","Efectos adversos anticolinérgicos · riesgo de caídas"]
            ]
          }),
          e(Alert,{c:C.warn,label:"🔑 Regla de oro"},"TCC-I es ",e("b",null,"1ª línea"),", equivalente o superior a fármacos a largo plazo. Fármacos preferentemente para uso corto (≤4 semanas) o puente.")
        )
      }
    },
    {
      n:"02",name:"Hipersomnia (trastorno de hipersomnolencia)",c:c,
      blurb:"Somnolencia diurna excesiva pese a sueño nocturno ≥7h",
      sections:{
        def:e(Def,{c:c},"Somnolencia excesiva a pesar de un período principal de sueño de ≥7 horas, con ≥1 de: episodios recurrentes de sueño o lapsos de sueño en el mismo día, un período principal de sueño prolongado (≥9 h) no reparador, dificultad para estar plenamente despierto tras un despertar abrupto."),
        cli:e("div",null,
          e(P,null,"Prevalencia ~1%. Inicio típico en adolescencia/adultez temprana. Debe diferenciarse de insomnio con ",e("i",null,"percepción")," de cansancio — aquí el dato clave es el deseo imperioso de dormir más."),
          e(Note,{c:c,t:"Hallazgos PSG"},"Polisomnografía: latencia de sueño corta + ausencia de SOREMPs (inicios REM tempranos). Prueba de latencia múltiple del sueño (MSLT): latencia media ≤8 min.")
        ),
        dx:e(CritBlock,{title:"Hipersomnia (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Somnolencia excesiva autorreportada a pesar de ≥7 h de sueño, con ≥1 de los 3 síntomas descritos."),
          e(Crit,{crit:"B",c:c},"Se produce ≥3 veces/semana durante ≥3 meses."),
          e(Crit,{crit:"C",c:c},"Acompañada de malestar o deterioro."),
          e(Crit,{crit:"D",c:c},"No se explica mejor por otro trastorno del sueño (narcolepsia, apnea)."),
          e(Crit,{crit:"E",c:c},"No atribuible a sustancias."),
          e(Crit,{crit:"F",c:c},"Los trastornos mentales y médicos coexistentes no explican la somnolencia predominante.")
        ),
        tx:e(P,null,e("b",null,"Modafinilo o armodafinilo")," son 1ª línea (estimulantes promotores de alerta, sin la adicción clásica de anfetaminas). Metilfenidato o anfetaminas en casos refractarios. Higiene del sueño estricta. Evitar conducir si hay somnolencia no controlada.")
      }
    },
    {
      n:"03",name:"Narcolepsia",c:c,
      blurb:"Ataques irresistibles de sueño · con o sin cataplejía",
      sections:{
        def:e(Def,{c:c},"Ataques recurrentes de necesidad irresistible de dormir o siestas involuntarias ",e("b",null,"≥3 veces por semana durante los últimos 3 meses"),". Se asocia con fenómenos de ",e("b",null,"disociación sueño-vigilia")," y en su forma clásica con ",e("b",null,"cataplejía")," (pérdida súbita y bilateral del tono muscular desencadenada por emoción, con conciencia preservada)."),
        cli:e("div",null,
          e(H3,{c:c},"Tétrada clásica"),
          e(Table,{
            headers:[{t:"Síntoma",c:c},{t:"Descripción",c:c}],
            rows:[
              ["Ataques de sueño","Somnolencia diurna extrema con ataques irresistibles"],
              ["Cataplejía ★","Pérdida súbita y bilateral del tono muscular (cae mandíbula, flexión de rodillas) precipitada por emoción (risa, sorpresa). Dura seg-min · conciencia preservada"],
              ["Alucinaciones hipnagógicas / hipnopómpicas","Experiencias vívidas al dormirse o despertarse"],
              ["Parálisis del sueño","Incapacidad temporal para moverse al dormirse o despertarse"]
            ]
          }),
          e(H3,{c:c,mt:14},"Fisiopatología"),
          e(P,null,"Pérdida autoinmune de neuronas hipotalámicas productoras de ",e("b",null,"orexina (hipocretina)"),". Asociación con HLA-DQB1*06:02. Hipocretina en LCR ",e("b",null,"disminuida")," o indetectable en tipo 1 (con cataplejía)."),
          e(H3,{c:c,mt:14},"PSG y MSLT"),
          e(SxList,{c:c,items:[
            "Latencia media de sueño ≤8 min en MSLT",
            "≥2 SOREMPs (inicios REM en los primeros 15 min de un episodio de sueño)",
            "PSG previa descarta otras causas"
          ]})
        ),
        dx:e(CritBlock,{title:"Narcolepsia (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Episodios de necesidad irrefrenable de dormir, lapsos de sueño o siestas en el mismo día, ≥3 veces/sem × 3 meses."),
          e(Crit,{crit:"B",c:c},"Presencia de ≥1: (1) episodios de cataplejía, (2) deficiencia de hipocretina en LCR, (3) PSG/MSLT con ≥2 SOREMPs y latencia ≤8 min.")
        ),
        tx:e("div",null,
          e(Table,{
            headers:[{t:"Diana",c:c},{t:"Fármaco",c:c}],
            rows:[
              ["Somnolencia","Modafinilo, armodafinilo (1ª línea) · metilfenidato, anfetaminas (2ª)"],
              ["Cataplejía","Oxibato de sodio (gold standard) · pitolisant · venlafaxina, atomoxetina, clomipramina"],
              ["Consolidar sueño nocturno","Oxibato de sodio"]
            ]
          }),
          e(Note,{c:c,t:"Medidas no farmacológicas"},"Siestas programadas de 15–20 min 2–3 veces al día, buena higiene del sueño, evitar conducción/máquinas peligrosas si no está controlada.")
        )
      }
    },
    {
      n:"04",name:"Apnea obstructiva del sueño (AOS)",c:c,
      blurb:"Pausas respiratorias · ronquido · somnolencia · índice AH ≥5",
      sections:{
        def:e(Def,{c:c},"Trastorno caracterizado por episodios repetitivos de ",e("b",null,"obstrucción parcial o total de la vía aérea superior durante el sueño"),", con desaturación arterial y fragmentación del sueño. Es el más frecuente de los trastornos respiratorios relacionados con el sueño."),
        cli:e("div",null,
          e(H3,{c:c},"Tríada clásica"),
          e(SxList,{c:c,items:[
            "Ronquido fuerte, intermitente, con pausas respiratorias presenciadas",
            "Somnolencia diurna excesiva",
            "Sueño no reparador con despertares con sensación de ahogo"
          ]}),
          e(H3,{c:c,mt:14},"Factores de riesgo"),
          e(SxList,{c:c,items:[
            "Obesidad (IMC >30)",
            "Sexo masculino",
            "Edad >50 años (mujeres posmenopáusicas)",
            "Cuello grande (>43 cm varones, >40 cm mujeres)",
            "Anomalías craneofaciales (retrognatia, micrognatia)",
            "Hipotiroidismo, acromegalia",
            "Consumo de alcohol, tabaco, sedantes"
          ]}),
          e(H3,{c:c,mt:14},"Complicaciones"),
          e(SxList,{c:c,items:[
            "HTA resistente",
            "Arritmias (FA especialmente)",
            "Insuficiencia cardíaca",
            "ACV",
            "Diabetes tipo 2",
            "Accidentes de tránsito (por somnolencia)"
          ]}),
          e(Pearl,{t:"Escala de Epworth"},"Instrumento de tamizaje: 8 situaciones en las que el paciente evalúa su probabilidad de dormirse (0–3 puntos cada una). ",e("b",null,"Puntuación >10 = somnolencia excesiva"),".")
        ),
        dx:e(CritBlock,{title:"Apnea obstructiva del sueño (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Evidencia en polisomnografía de ≥5 apneas o hipopneas obstructivas por hora, junto con ≥1 de: (1) alteraciones respiratorias nocturnas (ronquidos, resoplidos/jadeos, pausas), (2) somnolencia diurna, fatiga o sueño no reparador no explicados por otra causa. ",e("b",null,"O")," evidencia de ≥15 apneas o hipopneas obstructivas por hora (independiente de síntomas)."),
          e(Crit,{crit:"Gravedad",c:c},"Leve: IAH 5–14 · Moderada: IAH 15–30 · Grave: IAH >30.")
        ),
        tx:e("div",null,
          e(Table,{
            headers:[{t:"Intervención",c:c},{t:"Indicación",c:c}],
            rows:[
              ["CPAP nasal ★","1ª línea en AOS moderada-grave · gold standard"],
              ["Pérdida de peso","Todos los pacientes con sobrepeso/obesidad"],
              ["Higiene del sueño","Evitar alcohol y sedantes · dormir de lado"],
              ["Dispositivos orales de avance mandibular","AOS leve-moderada o intolerancia a CPAP"],
              ["Cirugía (uvulopalatofaringoplastia, maxilar)","Casos seleccionados refractarios"]
            ]
          }),
          e(Alert,{c:C.bad,label:"⚠️ CONTRAINDICADOS"},e("b",null,"BZD y opioides están contraindicados")," en AOS — deprimen aún más la ventilación.")
        )
      }
    },
    {
      n:"05",name:"Trastornos del ritmo circadiano",c:c,
      blurb:"Desfase entre el reloj interno y el horario deseado",
      sections:{
        def:e(Def,{c:c},"Patrón persistente de alteración del sueño debido a ",e("b",null,"desalineación")," entre el ritmo circadiano endógeno y el horario de sueño-vigilia requerido por el entorno del individuo."),
        cli:e("div",null,
          e(H3,{c:c},"Subtipos"),
          e(Table,{
            headers:[{t:"Subtipo",c:c},{t:"Característica",c:c}],
            rows:[
              ["Tipo fase retrasada","Sueño se inicia MUY TARDE · despertar también tardío · frecuente en adolescentes y adultos jóvenes"],
              ["Tipo fase avanzada","Sueño se inicia MUY TEMPRANO y despertar temprano · frecuente en adultos mayores"],
              ["Tipo sueño-vigilia irregular","Sueño fragmentado en 3+ periodos cortos al día · frecuente en demencia"],
              ["Tipo ciclo sueño-vigilia no de 24 h","Típico en personas ciegas (falta de zeitgeber fótico)"],
              ["Tipo turnos laborales","Cambios de turno que desalinean el ritmo"],
              ["Tipo jet-lag","Transitorio por cambio de huso horario"]
            ]
          })
        ),
        dx:e(CritBlock,{title:"Ritmo circadiano (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Patrón persistente o recurrente de alteración del sueño debido a desalineación circadiana."),
          e(Crit,{crit:"B",c:c},"La alteración produce síntomas de insomnio, somnolencia excesiva o ambos."),
          e(Crit,{crit:"C",c:c},"Causa malestar o deterioro.")
        ),
        tx:e("div",null,
          e(Table,{
            headers:[{t:"Subtipo",c:c},{t:"Manejo",c:c}],
            rows:[
              ["Fase retrasada","Melatonina vespertina (3–5 h antes de DLMO) · fototerapia matutina · cronoterapia"],
              ["Fase avanzada","Fototerapia vespertina"],
              ["Jet-lag","Melatonina 0.5–3 mg al horario de destino · fototerapia"],
              ["Turnos","Siestas estratégicas · fototerapia durante trabajo · modafinilo en casos graves"]
            ]
          })
        )
      }
    },
    {
      n:"06",name:"Síndrome de piernas inquietas (SPI / Willis-Ekbom)",c:c,
      blurb:"Urgencia de mover piernas con disestesias · peor en reposo y noche",
      sections:{
        def:e(Def,{c:c},"Urgencia de mover las piernas, habitualmente acompañada o causada por sensaciones incómodas en ellas (hormigueo, picazón, ardor, 'algo que camina por dentro'). Se alivia con el movimiento y empeora en reposo y al caer la noche."),
        cli:e("div",null,
          e(H3,{c:c},"Los 5 criterios URGE"),
          e(SxList,{c:c,items:[
            "U — Urgencia de mover piernas (+/- disestesias)",
            "R — Reposo la empeora",
            "G — El movimiento la alivia (Getting up)",
            "E — Empeora por la noche (Evening)",
            "No explicado por otra condición"
          ]}),
          e(H3,{c:c,mt:14},"Asociaciones clave"),
          e(SxList,{c:c,items:[
            "Déficit de hierro (ferritina <75 ng/mL es factor precipitante clave)",
            "Insuficiencia renal terminal · hemodiálisis",
            "Embarazo (3er trimestre)",
            "Diabetes · neuropatía periférica",
            "Fármacos que empeoran SPI: ISRS/IRSN, antipsicóticos, antihistamínicos, metoclopramida"
          ]}),
          e(Pearl,{t:"Ferritina siempre"},"En todo SPI medir ferritina. Si <75 ng/mL, suplementar ",e("b",null,"hierro oral")," mejora el cuadro significativamente.")
        ),
        dx:e(CritBlock,{title:"SPI (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Urgencia de mover las piernas con los 4 criterios URGE."),
          e(Crit,{crit:"B",c:c},"Síntomas ≥3 veces/semana por ≥3 meses."),
          e(Crit,{crit:"C",c:c},"Malestar o deterioro clínicamente significativo."),
          e(Crit,{crit:"D",c:c},"No atribuibles a otra afección médica (neuropatía, artritis, edema, calambres)."),
          e(Crit,{crit:"E",c:c},"No se explican por sustancia o medicamento.")
        ),
        tx:e("div",null,
          e(Table,{
            headers:[{t:"Línea",c:c},{t:"Opción",c:c}],
            rows:[
              ["1ª (SI ferritina baja)","Hierro oral o IV (hasta ferritina >75)"],
              ["1ª farmacológica","Gabapentinoides: gabapentina enacarbil, pregabalina"],
              ["Alternativa","Agonistas dopaminérgicos (pramipexol, ropinirol, rotigotina)"],
              ["Casos refractarios","Oxicodona-naloxona o metadona a bajas dosis"]
            ]
          }),
          e(Alert,{c:C.bad,label:"⚠️ Fenómeno de aumentación"},"Efecto adverso clásico de agonistas dopaminérgicos: el tratamiento empeora el SPI (aparece antes, más intenso, en más partes del cuerpo). Por eso ",e("b",null,"gabapentinoides desplazaron a los agonistas como 1ª línea farmacológica"),".")
        )
      }
    },
    {
      n:"07",name:"Trastornos del despertar NREM (sonambulismo / terror nocturno)",c:c,
      blurb:"Parasomnias de ondas lentas · 1ª mitad noche · amnesia",
      sections:{
        def:e(Def,{c:c},"Episodios recurrentes de despertar incompleto desde el ",e("b",null,"sueño profundo N3 (ondas lentas)"),", generalmente en el primer tercio del periodo principal de sueño. Dos subtipos: sonambulismo y terror nocturno."),
        cli:e("div",null,
          e(Table,{
            headers:[{t:"Subtipo",c:c},{t:"Descripción",c:c}],
            rows:[
              ["Sonambulismo","El paciente se levanta, camina, puede realizar conductas complejas. Cara en blanco, no responde. Difícil de despertar. AMNESIA del episodio"],
              ["Terror nocturno","Despertar con grito de pánico, miedo intenso, taquicardia, sudoración, midriasis. Dura 1–10 min. AMNESIA del episodio · no recuerda pesadillas"]
            ]
          }),
          e(Note,{c:c,t:"Clave: diferenciación con pesadillas"},"Terror nocturno: 1ª mitad de la noche · sueño N3 · amnesia · no relato de sueño. Pesadilla: 2ª mitad de la noche · sueño REM · recuerdo vívido · despertar completo.")
        ),
        dx:e(CritBlock,{title:"Trastornos del despertar NREM (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Episodios recurrentes de despertar incompleto desde el sueño, con sonambulismo o terror nocturno."),
          e(Crit,{crit:"B",c:c},"Ausencia o escaso recuerdo de imágenes oníricas."),
          e(Crit,{crit:"C",c:c},"Amnesia del episodio."),
          e(Crit,{crit:"D",c:c},"Malestar o deterioro clínico."),
          e(Crit,{crit:"E",c:c},"No atribuible a sustancia ni afección médica."),
          e(Crit,{crit:"F",c:c},"No se explican por otro trastorno mental.")
        ),
        tx:e("div",null,
          e(SxList,{c:c,items:[
            "Tranquilización + educación (frecuente en niños, suele resolver con la edad)",
            "Seguridad del entorno (cerrar ventanas, bajar altura de camas)",
            "Tratar desencadenantes: privación de sueño, fiebre, alcohol, estrés",
            "Clonazepam a dosis baja en casos severos o con riesgo",
            "NO despertar bruscamente al sonámbulo — guiarlo suavemente de vuelta a la cama"
          ]})
        )
      }
    },
    {
      n:"08",name:"Trastorno de pesadillas",c:c,
      blurb:"Pesadillas recurrentes · sueño REM · 2ª mitad · despertar completo",
      sections:{
        def:e(Def,{c:c},"Aparición repetida de sueños disfóricos extensos y muy bien recordados, que implican esfuerzos para evitar amenazas a la supervivencia, seguridad o integridad física. Ocurren típicamente en la ",e("b",null,"segunda mitad")," del periodo de sueño (sueño REM)."),
        cli:e("div",null,
          e(P,null,"Al despertar el individuo está ",e("b",null,"orientado y alerta"),", puede describir el sueño con detalle. Muy relacionado con TEPT (el 'trauma de pesadilla' del TEPT entra aquí como síntoma, no como diagnóstico principal)."),
          e(Note,{c:c,t:"Especificadores"},e("b",null,"Aguda:")," <1 mes · ",e("b",null,"Subaguda:")," 1–6 meses · ",e("b",null,"Persistente:")," ≥6 meses.")
        ),
        dx:e(CritBlock,{title:"Trastorno de pesadillas (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Aparición repetida de sueños disfóricos extensos y bien recordados que implican amenazas."),
          e(Crit,{crit:"B",c:c},"Al despertar, el individuo se orienta rápidamente."),
          e(Crit,{crit:"C",c:c},"Malestar clínico o deterioro."),
          e(Crit,{crit:"D",c:c},"No atribuibles a sustancia ni afección médica."),
          e(Crit,{crit:"E",c:c},"Coexistentes trastornos mentales no explican adecuadamente la queja.")
        ),
        tx:e("div",null,
          e(SxList,{c:c,items:[
            "Terapia de ensayo por imágenes (IRT) — 1ª línea · el paciente reescribe el final del sueño con contenido no amenazante y lo ensaya diurnamente",
            "TCC para pesadillas",
            "Prazosina 1–10 mg nocturnos (especialmente si TEPT comórbido)",
            "Tratar TEPT subyacente si corresponde"
          ]})
        )
      }
    },
    {
      n:"09",name:"Trastorno de conducta del sueño REM (TCSR)",c:c,
      blurb:"Ausencia de atonía REM · actúa sus sueños · riesgo Parkinson",
      sections:{
        def:e(Def,{c:c},"Episodios repetidos de vocalización o comportamientos motores complejos que ocurren durante el sueño REM. El paciente ",e("b",null,"'actúa' sus sueños")," por falla de la atonía fisiológica del REM. Alta asociación con sinucleinopatías (Parkinson, demencia con cuerpos de Lewy, atrofia multisistémica)."),
        cli:e("div",null,
          e(SxList,{c:c,items:[
            "Más frecuente en varones >50 años",
            "El paciente puede gritar, reírse, patear, pegar al compañero de cama",
            "Recuerdo vívido del sueño tras despertar (sueños frecuentemente agresivos o de persecución)",
            "Alto valor predictivo: ~80% desarrollará enfermedad neurodegenerativa en 10–15 años",
            "Descartar sustancias (ISRS, venlafaxina, BZD pueden inducirlo o empeorarlo)"
          ]})
        ),
        dx:e(CritBlock,{title:"TCSR (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Episodios repetidos de vocalización o conductas motoras complejas durante el sueño."),
          e(Crit,{crit:"B",c:c},"Los episodios ocurren durante sueño REM (>90 min tras inicio, más frecuentes en últimas horas)."),
          e(Crit,{crit:"C",c:c},"Al despertar el paciente está alerta y no confuso."),
          e(Crit,{crit:"D",c:c},"≥1 de: (1) hallazgos PSG de REM sin atonía, (2) diagnóstico clínico y antecedentes de enfermedad neurodegenerativa."),
          e(Crit,{crit:"E",c:c},"Malestar o deterioro."),
          e(Crit,{crit:"F",c:c},"No atribuible a sustancia ni afección médica.")
        ),
        tx:e(P,null,e("b",null,"Clonazepam 0.25–2 mg nocturno")," (1ª línea) o ",e("b",null,"melatonina 3–12 mg nocturno")," (alternativa preferida en adultos mayores por mejor perfil). Seguridad del entorno (retirar objetos peligrosos, separar camas si hay agresión). Seguimiento neurológico para detectar aparición de sinucleinopatía.")
      }
    }
  ];

  var s1=useState(null);var openGen=s1[0],setOpenGen=s1[1];
  var general=[
    {id:"conceptos",ic:"🧭",t:"Conceptos generales",sub:"Arquitectura del sueño",c:c,
     content:e("div",null,
       e(P,null,"El sueño se organiza en ciclos de ~90 min con fases NREM (N1, N2, N3) y REM. Cada ciclo se repite 4–6 veces por noche."),
       e(H3,{c:c,mt:14},"Fases del sueño"),
       e(Table,{
         headers:[{t:"Fase",c:c},{t:"% del sueño",c:c},{t:"EEG",c:c},{t:"Característica",c:c}],
         rows:[
           ["N1 (transición)","5%","Theta","Transición a sueño · mioclonías"],
           ["N2","50%","Husos de sueño + complejos K","Sueño ligero"],
           ["N3 (profundo)","13–23%","Ondas lentas delta","Reparador · ondas lentas · sonambulismo y terror nocturno AQUÍ"],
           ["REM","20–25%","Beta (similar vigilia) + atonía","Ensueños · PESADILLAS · atonía · TCSR si falla"]
         ]
       }),
       e(H3,{c:c,mt:14},"Distribución durante la noche"),
       e(P,null,e("b",null,"Primer tercio:")," predomina N3 (aquí parasomnias NREM). ",e("b",null,"Último tercio:")," predomina REM (aquí pesadillas y TCSR)."),
       e(H3,{c:c,mt:14},"Requerimiento por edad"),
       e(Table,{
         headers:[{t:"Edad",c:c},{t:"Horas recomendadas",c:c}],
         rows:[
           ["Recién nacido","14–17 h"],
           ["1–2 años","11–14 h"],
           ["3–5 años","10–13 h"],
           ["6–13 años","9–11 h"],
           ["14–17 años","8–10 h"],
           ["Adulto","7–9 h"],
           ["Adulto mayor","7–8 h"]
         ]
       })
     )},
    {id:"ddx_nrem_rem",ic:"🌙",t:"NREM vs REM · parasomnias",sub:"Pregunta de examen clásica",c:c,
     content:e("div",null,
       e(P,null,"La distinción entre parasomnias NREM y REM es una de las preguntas más frecuentes del capítulo."),
       e(Table,{
         headers:[{t:"Característica",c:c},{t:"Parasomnia NREM",c:c},{t:"Parasomnia REM",c:c}],
         rows:[
           ["Fase","N3 (sueño profundo)","REM"],
           ["Momento de la noche","1ª mitad","2ª mitad"],
           ["Ejemplos","Sonambulismo · terror nocturno","Pesadillas · TCSR"],
           ["Despertar","Difícil, confuso, amnesia","Fácil, orientado, recuerdo del sueño"],
           ["Recuerdo del sueño","NO","SÍ, vívido"],
           ["Movimiento","Complejo (caminar)","Con TCSR: patea, grita"],
           ["Edad típica","Niños","Adultos mayores (TCSR) · cualquier edad (pesadillas)"]
         ]
       })
     )},
    {id:"tx",ic:"💊",t:"Tratamiento · resumen del tema",sub:"Fármacos por indicación",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Cuadro",c:c},{t:"Fármaco de elección",c:c}],
         rows:[
           ["Insomnio","TCC-I (1ª línea) · suvorexant · ramelteón · doxepina baja · z-drugs corto plazo"],
           ["Hipersomnia","Modafinilo, armodafinilo"],
           ["Narcolepsia · somnolencia","Modafinilo, armodafinilo"],
           ["Narcolepsia · cataplejía","Oxibato de sodio · pitolisant · venlafaxina"],
           ["AOS","CPAP (gold standard) · no fármacos"],
           ["Ritmo circadiano · fase retrasada","Melatonina vespertina + fototerapia matutina"],
           ["Jet-lag","Melatonina 0.5–3 mg"],
           ["SPI","Hierro si ferritina baja · gabapentinoides (1ª) · agonistas dopa (alternativa)"],
           ["Sonambulismo / terror nocturno","Seguridad + clonazepam si severo"],
           ["Pesadillas","Terapia ensayo por imágenes · prazosina si TEPT"],
           ["TCSR","Clonazepam o melatonina · seguimiento neurológico"]
         ]
       }),
       e(Alert,{c:C.bad,label:"⚠️ Contraindicaciones clave"},
         e("ol",{style:{margin:0,paddingLeft:20,lineHeight:1.8,fontSize:13}},
           e("li",null,e("b",null,"BZD y opioides")," → contraindicados en AOS (depresión respiratoria)"),
           e("li",null,e("b",null,"Agonistas dopaminérgicos en SPI")," → riesgo de aumentación"),
           e("li",null,e("b",null,"ISRS/venlafaxina")," → pueden inducir o empeorar TCSR")
         )
       )
     )},
    {id:"perlas",ic:"📌",t:"Perlas de examen",sub:"Alto rendimiento",c:c,
     content:e("div",null,
       e(Pearl,{t:"TCC-I es 1ª línea para insomnio"},"No fármacos. Superior a largo plazo. Debe ofrecerse siempre antes que medicación crónica."),
       e(Pearl,{t:"Narcolepsia tipo 1"},"Con cataplejía + hipocretina en LCR baja. HLA-DQB1*06:02. Oxibato de sodio es gold standard."),
       e(Pearl,{t:"AOS + CPAP"},"CPAP es el gold standard en AOS moderada-grave. Reduce eventos cardiovasculares, HTA, somnolencia."),
       e(Pearl,{t:"SPI · ferritina <75"},"Siempre medir ferritina. Si <75, suplementar hierro mejora el SPI significativamente."),
       e(Pearl,{t:"Aumentación en SPI"},"Efecto paradójico de agonistas dopaminérgicos: el tto empeora el cuadro. Por eso gabapentinoides son ahora 1ª línea farmacológica."),
       e(Pearl,{t:"Parasomnias NREM = 1ª mitad"},"Sonambulismo y terror nocturno en sueño N3, primera mitad de la noche, con amnesia del episodio."),
       e(Pearl,{t:"Pesadillas = REM = 2ª mitad"},"Despertar completo con recuerdo vívido del sueño."),
       e(Pearl,{t:"TCSR predice sinucleinopatía"},"~80% de pacientes con TCSR desarrolla Parkinson, DLB o atrofia multisistémica en 10–15 años."),
       e(Pearl,{t:"Terror nocturno ≠ pesadilla"},"Terror nocturno: N3, 1ª mitad, sin recuerdo, amnesia. Pesadilla: REM, 2ª mitad, recuerdo claro, despertar orientado."),
       e(Pearl,{t:"Prazosina en pesadillas"},"Útil especialmente en pesadillas asociadas a TEPT. Antagonista α1-adrenérgico.")
     )},
    {id:"resumen",ic:"📊",t:"Resumen comparativo",sub:"Las 9 entidades en una tabla",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Entidad",c:c},{t:"Duración / clave",c:c},{t:"Tx 1ª línea",c:c}],
         rows:[
           ["Insomnio","≥3 noches/sem × 3 meses","TCC-I · suvorexant/ramelteón"],
           ["Hipersomnia","≥3 veces/sem × 3 meses","Modafinilo"],
           ["Narcolepsia","Ataques + ≥2 SOREMPs o hipocretina ↓","Modafinilo + oxibato para cataplejía"],
           ["AOS","IAH ≥5 con síntomas o ≥15 sin","CPAP + pérdida de peso"],
           ["Ritmo circadiano","Desfase persistente","Fototerapia + melatonina"],
           ["SPI","URGE + ≥3/sem × 3 m","Hierro si ferritina baja · gabapentinoides"],
           ["Sonambulismo/Terror nocturno","Parasomnia NREM (N3, 1ª mitad)","Seguridad + clonazepam si severo"],
           ["Pesadillas","REM, 2ª mitad, recuerdo","Terapia ensayo imágenes · prazosina"],
           ["TCSR","REM sin atonía · actúa sueños","Clonazepam o melatonina"]
         ]
       })
     )},
    {id:"flash",ic:"🃏",t:"Flashcards",sub:"15 preguntas + las tuyas",c:c,
     content:e("div",null,
       e(P,null,"Tarjetas de repaso de sueño-vigilia. Añade las tuyas."),
       e(FlashDeck,{c:c,deckId:"sueno",items:getAllCards("sueno")})
     )},
    {id:"quiz",ic:"❓",t:"Quiz · 6 casos clínicos",sub:"Prueba tus conocimientos",c:c,
     content:e(Quiz,{c:c,items:getAllQuiz("sueno")})}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Tema 6 · Neurosis · DSM-5-TR",title:"Trastornos del sueño-vigilia"},
      "Alteraciones persistentes de la cantidad, calidad o momento del sueño que causan malestar o deterioro diurno. El capítulo DSM-5 incluye ",e("b",null,"múltiples entidades")," — cubrimos las 9 más relevantes para el examen, desde el insomnio (el más frecuente) hasta el TCSR (predictor de enfermedad neurodegenerativa)."
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.3),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Conceptos · NREM vs REM · Tratamiento · Flashcards · Quiz")
    ),
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginTop:10}},
      general.map(function(g,i){
        return e("button",{key:g.id,onClick:function(){setOpenGen(i);},style:{padding:"14px 12px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:10,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:4,minHeight:90}},
          e("div",{style:{fontSize:22,marginBottom:4}},g.ic),
          e("div",{style:{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Playfair Display"}},g.t),
          e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.4,marginTop:2}},g.sub)
        );
      })
    ),
    openGen!==null?e(DzModal,{c:general[openGen].c,name:general[openGen].t,kicker:"Sección del tema",single:general[openGen].content,onClose:function(){setOpenGen(null);}}):null,

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.15)+","+ax(c,.04)+" 90%)",border:"1px solid "+ax(c,.35),borderRadius:14,margin:"18px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Las 9 enfermedades"),
      e("div",{style:{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Toca cualquier enfermedad para abrir su ficha"),
      e("div",{style:{fontSize:12,color:C.mt,marginTop:4,lineHeight:1.45}},"Cada ficha tiene tabs: Definición · Clínica · Diagnóstico · Tratamiento")
    ),
    e(DzGrid,{c:c,items:diseases}),

    e(Abbrev,{c:c,items:[
      {a:"TCC-I",d:"Terapia Cognitivo-Conductual para Insomnio"},
      {a:"PSG",d:"Polisomnografía"},
      {a:"MSLT",d:"Multiple Sleep Latency Test (latencia múltiple del sueño)"},
      {a:"SOREMP",d:"Sleep Onset REM Period (inicio REM temprano)"},
      {a:"REM",d:"Rapid Eye Movement (sueño con movimientos oculares rápidos)"},
      {a:"NREM",d:"Non-REM (sueño sin REM · N1, N2, N3)"},
      {a:"AOS",d:"Apnea Obstructiva del Sueño"},
      {a:"IAH",d:"Índice de Apnea-Hipopnea"},
      {a:"CPAP",d:"Continuous Positive Airway Pressure"},
      {a:"SPI",d:"Síndrome de Piernas Inquietas (Willis-Ekbom)"},
      {a:"TCSR",d:"Trastorno de Conducta del Sueño REM"},
      {a:"IRT",d:"Imagery Rehearsal Therapy (terapia de ensayo por imágenes)"},
      {a:"DLB",d:"Dementia with Lewy Bodies (demencia con cuerpos de Lewy)"},
      {a:"DLMO",d:"Dim Light Melatonin Onset (inicio de melatonina con luz tenue)"}
    ]})
  );
}



// ══════════════════════════════════════════════════════════════
// TEMA 7 · TRASTORNOS DE LA PERSONALIDAD
// ══════════════════════════════════════════════════════════════

function PerView(){
  var c=C.per;
  var diseases=[
    // ═══ CLUSTER A · Raros/excéntricos ═══
    {
      n:"A1",name:"Paranoide de la personalidad",c:c,
      blurb:"Cluster A · Desconfianza y suspicacia generalizadas",
      sections:{
        def:e(Def,{c:c},"Patrón de ",e("b",null,"desconfianza y suspicacia generalizadas")," hacia los demás, interpretando sus motivos como malintencionados. Inicia en la adultez temprana y se presenta en diversos contextos."),
        cli:e("div",null,
          e(SxList,{title:"Criterios clínicos · ≥4 de 7",c:c,items:[
            "Sospechas sin base suficiente de que los demás le engañan, hacen daño o se aprovechan",
            "Preocupación por dudas injustificadas sobre la lealtad o fidelidad de amigos o socios",
            "Reticencia a confiar en otros por miedo injustificado a que la información se use maliciosamente",
            "Lectura de significados humillantes o amenazantes en observaciones o sucesos benignos",
            "Rencoroso · guarda agravios durante mucho tiempo",
            "Percibe ataques a su carácter o reputación que no son evidentes para los demás · responde con rabia o contraataque",
            "Sospechas recurrentes, sin base, sobre la fidelidad del cónyuge o pareja"
          ]}),
          e(Note,{c:c,t:"DDx con trastorno delirante y esquizofrenia"},"La ",e("b",null,"personalidad paranoide no tiene delirios ni alucinaciones"),". La desconfianza es una ",e("b",null,"actitud rasgo")," persistente, no una convicción delirante fija.")
        ),
        dx:e(P,null,"Diagnóstico por ≥4 de 7 criterios clínicos + criterios generales de trastorno de personalidad: patrón persistente que se desvía de expectativas culturales, inflexible, inicia en adolescencia/adultez temprana, causa malestar o deterioro, no atribuible a otro trastorno ni a sustancias."),
        tx:e(P,null,"Psicoterapia individual cuidando mucho la alianza terapéutica (es difícil de construir). TCC centrada en atribuciones. Fármacos solo sintomáticos: antipsicóticos a dosis bajas si hay ideación cercana al umbral psicótico.")
      }
    },
    {
      n:"A2",name:"Esquizoide de la personalidad",c:c,
      blurb:"Cluster A · Desapego de relaciones · afectividad restringida",
      sections:{
        def:e(Def,{c:c},"Patrón general de ",e("b",null,"desapego de las relaciones sociales")," y una ",e("b",null,"restricción en la expresión de las emociones")," en las relaciones interpersonales."),
        cli:e("div",null,
          e(SxList,{title:"Criterios · ≥4 de 7",c:c,items:[
            "Ni desea ni disfruta las relaciones íntimas (incluida la familia)",
            "Casi siempre elige actividades solitarias",
            "Tiene poco o nulo interés por las relaciones sexuales con otra persona",
            "Disfruta poco o nada de actividades",
            "No tiene amigos íntimos ni confidentes, aparte de familiares de primer grado",
            "Indiferente a los elogios o a las críticas",
            "Frialdad emocional, desapego o afectividad plana"
          ]}),
          e(Note,{c:c,t:"DDx con espectro autista"},"El esquizoide ",e("b",null,"prefiere")," la soledad (no tiene déficit social). El TEA ",e("b",null,"no entiende")," las señales sociales y tiene restricciones/repeticiones.")
        ),
        dx:e(P,null,"≥4 de los 7 criterios listados, patrón persistente e inflexible."),
        tx:e(P,null,"Psicoterapia de apoyo respetando la necesidad de distancia. Muy difícil de adherir porque el paciente pocas veces busca ayuda. Sin farmacoterapia específica.")
      }
    },
    {
      n:"A3",name:"Esquizotípica de la personalidad",c:c,
      blurb:"Cluster A · Excentricidad + distorsiones cognitivas",
      sections:{
        def:e(Def,{c:c},"Patrón de ",e("b",null,"déficits sociales e interpersonales")," con malestar agudo y capacidad reducida para las relaciones estrechas, además de ",e("b",null,"distorsiones cognitivas o perceptivas y excentricidades")," del comportamiento. Considerado parte del espectro esquizofrénico."),
        cli:e(SxList,{title:"Criterios · ≥5 de 9",c:c,items:[
          "Ideas de referencia (no delirantes)",
          "Creencias raras o pensamiento mágico (telepatía, supersticiones marcadas, 'sexto sentido') que influye en el comportamiento e incongruente con normas culturales",
          "Experiencias perceptivas inusuales, incluidas ilusiones corporales",
          "Pensamiento y lenguaje extraños (vagos, metafóricos, elaborados, estereotipados)",
          "Suspicacia o ideación paranoide",
          "Afectividad inapropiada o restringida",
          "Aspecto o comportamiento raro, excéntrico o peculiar",
          "Carece de amigos íntimos o confidentes, aparte de familiares de primer grado",
          "Ansiedad social excesiva que NO disminuye con la familiaridad y se asocia más con temores paranoides que con juicios negativos sobre uno mismo"
        ]}),
        dx:e(P,null,"≥5 de los 9 criterios. DDx con esquizofrenia (la esquizotípica NO tiene síntomas positivos francos ni deterioro tan marcado)."),
        tx:e(P,null,"TCC + entrenamiento en habilidades sociales. ",e("b",null,"Antipsicóticos atípicos a dosis bajas")," (risperidona 1–2 mg, olanzapina) si hay distorsiones perceptivas severas, suspicacia o ansiedad. ISRS si comorbilidad depresiva/ansiosa.")
      }
    },
    // ═══ CLUSTER B · Dramáticos/emocionales ═══
    {
      n:"B1",name:"Antisocial de la personalidad",c:c,
      blurb:"Cluster B · Desprecio + transgresión de derechos ajenos",
      sections:{
        def:e(Def,{c:c},"Patrón de ",e("b",null,"desprecio y violación de los derechos de los demás")," que se produce desde los 15 años. Requiere antecedentes de ",e("b",null,"trastorno de la conducta antes de los 15 años"),". Se diagnostica a partir de los 18 años."),
        cli:e("div",null,
          e(SxList,{title:"Criterios · ≥3 de 7 (criterio A)",c:c,items:[
            "Incumplimiento de las normas sociales respecto a los comportamientos legales (actos susceptibles de arresto reiterados)",
            "Engaño (mentir repetidamente, uso de apodos falsos, estafar a otros por beneficio propio o placer)",
            "Impulsividad o fracaso para planear el futuro",
            "Irritabilidad y agresividad (peleas físicas o agresiones repetidas)",
            "Desprecio imprudente por la seguridad propia y de los demás",
            "Irresponsabilidad persistente (fracaso para mantener trabajo o cumplir obligaciones económicas)",
            "Falta de remordimiento (indiferencia o racionalización del daño a otros)"
          ]}),
          e(Note,{c:c,t:"Criterios adicionales"},"B: ≥18 años · C: evidencia de trastorno de conducta antes de los 15 años · D: no ocurre exclusivamente en el curso de esquizofrenia o trastorno bipolar."),
          e(Pearl,{t:"Psicopatía ≠ antisocial"},"'Psicopatía' es un término no-DSM (checklist de Hare) que se solapa pero es más específico. Todos los psicópatas cumplen antisocial, pero no todos los antisociales son psicópatas (faltan rasgos de frialdad emocional y encanto superficial).")
        ),
        dx:e(P,null,"≥3 de 7 criterios de A + criterios B, C, D. El antecedente de trastorno de conducta antes de los 15 años es clave."),
        tx:e(P,null,"Pronóstico pobre. Psicoterapia con estructura firme (límites claros, contrato terapéutico). ",e("b",null,"NO hay fármaco específico"),"; manejar impulsividad y agresión con estabilizadores del ánimo o antipsicóticos atípicos en dosis bajas. Muy mala respuesta. Alto riesgo de consumo de sustancias.")
      }
    },
    {
      n:"B2",name:"Límite de la personalidad (TLP)",c:c,
      blurb:"Cluster B · Inestabilidad afectiva + miedo al abandono · autolesión",
      sections:{
        def:e(Def,{c:c},"Patrón de ",e("b",null,"inestabilidad en las relaciones, la autoimagen y los afectos"),", con marcada ",e("b",null,"impulsividad"),". Es el TP más frecuente en consultas y el que más frecuentemente presenta conductas autolesivas y suicidas."),
        cli:e("div",null,
          e(SxList,{title:"Criterios · ≥5 de 9",c:c,items:[
            "Esfuerzos frenéticos por evitar el abandono real o imaginado",
            "Patrón de relaciones interpersonales inestables e intensas, con alternancia entre idealización y devaluación (la 'escisión')",
            "Alteración de la identidad — autoimagen o sentido de sí mismo inestables",
            "Impulsividad en ≥2 áreas potencialmente autodestructivas (gasto, sexo, sustancias, comida atracones, conducción imprudente)",
            "Amenazas, gestos o intentos suicidas recurrentes, o conductas autolesivas (cortes, quemaduras)",
            "Inestabilidad afectiva debida a reactividad marcada del ánimo (disforia intensa de horas, rara vez más de días)",
            "Sentimientos crónicos de vacío",
            "Ira inapropiada e intensa o dificultad para controlarla (muestras de mal genio, peleas físicas)",
            "Ideación paranoide transitoria relacionada con el estrés o síntomas disociativos graves"
          ]}),
          e(H3,{c:c,mt:14},"Asociaciones clave"),
          e(SxList,{c:c,items:[
            "~75% mujeres",
            "~70% tiene antecedentes de trauma infantil (abuso sexual, negligencia)",
            "Tasa de suicidio consumado: ~10% (alta)",
            "Comorbilidad con depresión, TEPT, TCA, sustancias"
          ]})
        ),
        dx:e(P,null,"≥5 de los 9 criterios + patrón persistente e inflexible. Con frecuencia se diagnostica en adolescencia tardía o adultez temprana."),
        tx:e("div",null,
          e(H3,{c:c},"Psicoterapia (1ª línea)"),
          e(Table,{
            headers:[{t:"Modalidad",c:c},{t:"Características",c:c}],
            rows:[
              ["DBT (Terapia dialéctica conductual) ★","1ª línea · Marsha Linehan · mindfulness + regulación emocional + tolerancia al malestar + efectividad interpersonal"],
              ["MBT (Mentalización)","Fomenta capacidad de entender estados mentales propios y ajenos"],
              ["Terapia focalizada en esquemas","Identifica y modifica esquemas tempranos desadaptativos"],
              ["Terapia focalizada en la transferencia","Psicoanalítica · foco en relación terapéutica"]
            ]
          }),
          e(H3,{c:c,mt:14},"Farmacoterapia (sintomática)"),
          e(SxList,{c:c,items:[
            "NO hay fármaco aprobado para TLP per se",
            "Estabilizadores (lamotrigina, valproato) — inestabilidad afectiva, impulsividad",
            "Antipsicóticos atípicos a dosis bajas (aripiprazol, quetiapina) — ideación paranoide, agresividad",
            "ISRS — depresión comórbida (evidencia limitada en síntomas nucleares)"
          ]}),
          e(Alert,{c:C.bad,label:"⚠️ Evitar BZD"},"Riesgo de desinhibición paradójica + alta tasa de adicción en esta población. Evitar.")
        )
      }
    },
    {
      n:"B3",name:"Histriónica de la personalidad",c:c,
      blurb:"Cluster B · Búsqueda de atención + emocionalidad excesiva",
      sections:{
        def:e(Def,{c:c},"Patrón general de ",e("b",null,"emotividad excesiva y búsqueda de atención"),". Prototipo: la persona que 'no puede no ser el centro'."),
        cli:e(SxList,{title:"Criterios · ≥5 de 8",c:c,items:[
          "Se siente incómodo en situaciones donde no es el centro de atención",
          "Interacción con otros a menudo caracterizada por un comportamiento sexualmente seductor o provocativo inapropiado",
          "Muestra expresión emocional cambiante y superficial",
          "Usa sistemáticamente el aspecto físico para atraer la atención",
          "Discurso excesivamente impresionista y falto de detalles (forma dramática sobre contenido)",
          "Autodramatización, teatralidad y expresión exagerada de la emoción",
          "Sugestionabilidad (fácilmente influido por otros o por las circunstancias)",
          "Considera sus relaciones más íntimas de lo que en realidad son"
        ]}),
        dx:e(P,null,"≥5 de los 8 criterios. DDx con TLP (el límite tiene miedo al abandono y autolesión; el histriónico no)."),
        tx:e(P,null,"Psicoterapia psicodinámica o TCC. Fármacos solo sintomáticos (ISRS para depresión comórbida).")
      }
    },
    {
      n:"B4",name:"Narcisista de la personalidad",c:c,
      blurb:"Cluster B · Grandiosidad · necesidad de admiración · falta de empatía",
      sections:{
        def:e(Def,{c:c},"Patrón de ",e("b",null,"grandiosidad")," (en la fantasía o conducta), ",e("b",null,"necesidad de admiración")," y ",e("b",null,"falta de empatía"),"."),
        cli:e(SxList,{title:"Criterios · ≥5 de 9",c:c,items:[
          "Sentido grandioso de la propia importancia (exagera logros, espera ser reconocido como superior sin logros que lo justifiquen)",
          "Fantasías de éxito, poder, brillantez, belleza o amor ideal ilimitados",
          "Se cree 'especial' y único, comprensible solo por personas especiales o de alto estatus",
          "Necesidad excesiva de admiración",
          "Sentido de privilegio (expectativas irrazonables de trato favorable especial)",
          "Explota interpersonalmente (se aprovecha de otros para sus propios fines)",
          "Carece de empatía · no reconoce ni se identifica con los sentimientos de los demás",
          "Con frecuencia envidia a los demás o cree que los demás le envidian",
          "Actitudes o comportamientos arrogantes, de superioridad"
        ]}),
        dx:e(P,null,"≥5 de los 9 criterios. Muy resistente al tratamiento (el paciente pocas veces consulta por sí mismo)."),
        tx:e(P,null,"Psicoterapia individual enfocada en la autoestima frágil subyacente. Los fracasos y desafíos narcisísticos frecuentemente precipitan depresión, lo que los lleva a consulta.")
      }
    },
    // ═══ CLUSTER C · Ansiosos/temerosos ═══
    {
      n:"C1",name:"Evitativa de la personalidad",c:c,
      blurb:"Cluster C · Inhibición social + sentimientos de inadecuación",
      sections:{
        def:e(Def,{c:c},"Patrón de ",e("b",null,"inhibición social, sentimientos de inadecuación e hipersensibilidad a la evaluación negativa"),". El paciente DESEA relaciones pero las evita por miedo al rechazo (diferente del esquizoide, que no las desea)."),
        cli:e(SxList,{title:"Criterios · ≥4 de 7",c:c,items:[
          "Evita actividades laborales que impliquen contacto interpersonal por miedo a la crítica, la desaprobación o el rechazo",
          "Reticencia a implicarse con la gente a menos que esté seguro de agradar",
          "Muestra restricción en las relaciones íntimas por miedo a ser avergonzado o ridiculizado",
          "Preocupación por ser criticado o rechazado en situaciones sociales",
          "Inhibido en situaciones interpersonales nuevas por sentimientos de inadecuación",
          "Se ve a sí mismo como socialmente inepto, sin atractivo personal o inferior",
          "Extremadamente reacio a asumir riesgos personales o actividades nuevas porque pueden resultar embarazosos"
        ]}),
        dx:e("div",null,
          e(P,null,"≥4 de los 7 criterios."),
          e(Note,{c:c,t:"DDx con fobia social generalizada"},"Hay superposición significativa. La ",e("b",null,"personalidad evitativa")," es un patrón pervasivo de toda la vida; la ",e("b",null,"fobia social")," puede ser más circunscrita. Pueden coexistir.")
        ),
        tx:e(P,null,"TCC con exposición gradual + entrenamiento asertivo. ISRS útiles (sertralina, escitalopram) — similar a fobia social generalizada.")
      }
    },
    {
      n:"C2",name:"Dependiente de la personalidad",c:c,
      blurb:"Cluster C · Necesidad excesiva de que lo cuiden",
      sections:{
        def:e(Def,{c:c},"Necesidad ",e("b",null,"excesiva y generalizada")," de que otros lo cuiden, que conlleva un comportamiento ",e("b",null,"sumiso y pegadizo"),", y temores de separación."),
        cli:e(SxList,{title:"Criterios · ≥5 de 8",c:c,items:[
          "Dificultad para tomar decisiones cotidianas sin consejo o tranquilización excesiva de otros",
          "Necesidad de que otros asuman responsabilidades en las principales áreas de su vida",
          "Dificultad para expresar desacuerdo con otros por miedo a perder su apoyo (NO miedo realista a represalias)",
          "Dificultad para iniciar proyectos o hacer cosas por su cuenta (por falta de confianza, no de motivación)",
          "Exageradas cosas para obtener protección y apoyo de otros, hasta el punto de ofrecerse voluntario para hacer cosas desagradables",
          "Se siente incómodo o desamparado cuando está solo por miedos exagerados de ser incapaz de cuidar de sí mismo",
          "Cuando una relación termina, busca urgentemente otra relación como fuente de cuidado y apoyo",
          "Preocupación no realista por ser abandonado a su propio cuidado"
        ]}),
        dx:e(P,null,"≥5 de los 8 criterios."),
        tx:e(P,null,"Psicoterapia individual centrada en autonomía y asertividad. TCC. Evitar fomentar la dependencia al terapeuta.")
      }
    },
    {
      n:"C3",name:"Obsesivo-compulsiva de la personalidad (TOCP)",c:c,
      blurb:"Cluster C · Perfeccionismo rígido · ≠ TOC",
      sections:{
        def:e(Def,{c:c},"Patrón de ",e("b",null,"preocupación por el orden, el perfeccionismo y el control mental e interpersonal"),", a expensas de la flexibilidad, la espontaneidad y la eficiencia."),
        cli:e("div",null,
          e(SxList,{title:"Criterios · ≥4 de 8",c:c,items:[
            "Se preocupa por los detalles, las normas, las listas, el orden, la organización o los horarios hasta perder el punto esencial de la actividad",
            "Perfeccionismo que interfiere con la finalización de tareas",
            "Devoción excesiva por el trabajo y la productividad, excluyendo el ocio y las amistades",
            "Excesivamente concienzudo, escrupuloso e inflexible en cuestiones de moralidad o ética (no explicable por cultura/religión)",
            "Incapaz de deshacerse de objetos gastados o inútiles, incluso cuando no tienen valor sentimental",
            "Reacio a delegar tareas a menos que otros se sometan a su exacta forma de hacer las cosas",
            "Avaro consigo mismo y con los demás (dinero como algo que hay que atesorar para el futuro)",
            "Rigidez y terquedad"
          ]}),
          e(Alert,{c:C.bad,label:"⚠️ TOCP ≠ TOC"},e("b",null,"TOCP:")," rasgo de personalidad EGO-SINTÓNICO (el paciente cree que su rigidez es correcta). ",e("b",null,"TOC:")," obsesiones y compulsiones EGO-DISTÓNICAS (el paciente sabe que son absurdas y quiere librarse de ellas). Son entidades distintas.")
        ),
        dx:e(P,null,"≥4 de los 8 criterios."),
        tx:e(P,null,"Psicoterapia individual (TCC, psicodinámica). Los pacientes consultan generalmente por depresión/ansiedad comórbidas, no por los rasgos nucleares.")
      }
    }
  ];

  var s1=useState(null);var openGen=s1[0],setOpenGen=s1[1];
  var general=[
    {id:"conceptos",ic:"🧭",t:"Conceptos generales",sub:"Definición y organización",c:c,
     content:e("div",null,
       e(Def,{c:c},"Un trastorno de la personalidad es un ",e("b",null,"patrón persistente de experiencia interna y de comportamiento")," que se aparta de forma notable de las expectativas de la cultura del sujeto, es inflexible y generalizado, comienza en la adolescencia o adultez temprana, es estable en el tiempo y causa malestar o deterioro."),
       e(H3,{c:c,mt:14},"Criterios generales DSM-5 (todos deben cumplirse)"),
       e(Table,{
         headers:[{t:"Criterio",c:c},{t:"Descripción",c:c}],
         rows:[
           ["A","Patrón persistente que se desvía de las expectativas culturales, en ≥2 de: cognición, afectividad, funcionamiento interpersonal, control de impulsos"],
           ["B","Patrón inflexible y pervasivo en amplio rango de situaciones personales y sociales"],
           ["C","Causa malestar clínicamente significativo o deterioro social, laboral u otros"],
           ["D","Estable y de larga duración · inicio en adolescencia o adultez temprana"],
           ["E","No se explica mejor por otro trastorno mental"],
           ["F","No atribuible a sustancias ni a otra afección médica"]
         ]
       }),
       e(H3,{c:c,mt:14},"Los 3 clusters"),
       e(Table,{
         headers:[{t:"Cluster",c:c},{t:"Rasgo común",c:c},{t:"Entidades",c:c}],
         rows:[
           ["A · 'Raros o excéntricos'","Pensamiento y conducta extraños","Paranoide · Esquizoide · Esquizotípica"],
           ["B · 'Dramáticos o emocionales'","Inestabilidad afectiva · impulsividad · transgresión","Antisocial · Límite · Histriónica · Narcisista"],
           ["C · 'Ansiosos o temerosos'","Ansiedad · inhibición","Evitativa · Dependiente · Obsesivo-compulsiva"]
         ]
       })
     )},
    {id:"trampas",ic:"🎯",t:"Diagnósticos diferenciales clave",sub:"Para no confundirlos",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Par a diferenciar",c:c},{t:"Clave",c:c}],
         rows:[
           ["Paranoide vs trastorno delirante","Paranoide: actitud desconfiada sin delirios fijos. Delirante: creencia delirante específica ≥1 mes"],
           ["Esquizoide vs TEA","Esquizoide: PREFIERE la soledad. TEA: no entiende las señales sociales + restricciones/repeticiones"],
           ["Esquizotípica vs esquizofrenia","Esquizotípica: excentricidad + distorsiones sin síntomas positivos francos ni deterioro severo"],
           ["Antisocial vs adicción / conducta","Antisocial requiere antecedentes de trastorno de conducta antes de los 15 años"],
           ["Límite vs bipolar II","Límite: inestabilidad afectiva de HORAS, reactiva. Bipolar: episodios de días-semanas, no reactivos"],
           ["Histriónica vs narcisista","Histriónica: busca atención por emocionalidad. Narcisista: busca admiración por superioridad"],
           ["Evitativa vs fobia social","Evitativa: patrón de toda la vida pervasivo. Fobia social: más circunscrita"],
           ["Evitativa vs esquizoide","Evitativa: DESEA pero evita por miedo. Esquizoide: NO DESEA"],
           ["TOCP vs TOC","TOCP: rasgo egosintónico, sin obsesiones/compulsiones clásicas. TOC: obsesiones/compulsiones egodistónicas"]
         ]
       })
     )},
    {id:"tx",ic:"💊",t:"Tratamiento · resumen del tema",sub:"Psicoterapia > farmacología",c:c,
     content:e("div",null,
       e(H3,{c:c},"Psicoterapias específicas"),
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"Psicoterapia de elección",c:c}],
         rows:[
           ["Límite (TLP)","DBT (Linehan) ★ · MBT · esquemas · focalizada en transferencia"],
           ["Antisocial","Muy pobre respuesta · estructura firme · contrato terapéutico"],
           ["Evitativa","TCC con exposición gradual + entrenamiento asertivo"],
           ["Dependiente","TCC enfocada en autonomía"],
           ["Otros","Psicoterapia individual (TCC, psicodinámica)"]
         ]
       }),
       e(H3,{c:c,mt:14},"Farmacoterapia (solo sintomática)"),
       e(Table,{
         headers:[{t:"Diana sintomática",c:c},{t:"Fármaco",c:c}],
         rows:[
           ["Inestabilidad afectiva en TLP","Lamotrigina, valproato"],
           ["Ideación paranoide / agresividad en TLP","Aripiprazol, quetiapina"],
           ["Distorsiones perceptivas en esquizotípica","Risperidona, olanzapina a dosis bajas"],
           ["Ansiedad en evitativa","ISRS (sertralina, escitalopram)"],
           ["Depresión comórbida","ISRS (evidencia limitada en síntomas nucleares)"]
         ]
       }),
       e(Alert,{c:C.bad,label:"⚠️ Evitar BZD en TLP"},"Alta tasa de dependencia y desinhibición paradójica.")
     )},
    {id:"perlas",ic:"📌",t:"Perlas de examen",sub:"Alto rendimiento",c:c,
     content:e("div",null,
       e(Pearl,{t:"3 clusters · ABC"},"A: raros/excéntricos (paranoide, esquizoide, esquizotípica). B: dramáticos/emocionales (antisocial, límite, histriónica, narcisista). C: ansiosos/temerosos (evitativa, dependiente, obsesivo-compulsiva)."),
       e(Pearl,{t:"TLP — tratamiento 1ª línea"},"DBT (terapia dialéctica conductual) de Marsha Linehan es el estándar de oro. Mindfulness + regulación emocional + tolerancia al malestar + efectividad interpersonal."),
       e(Pearl,{t:"TOCP ≠ TOC"},"TOCP: rasgo de personalidad EGO-SINTÓNICO (la persona cree que su perfeccionismo es correcto). TOC: obsesiones y compulsiones EGO-DISTÓNICAS (sabe que son absurdas). Dos entidades distintas."),
       e(Pearl,{t:"Antisocial requiere antecedente"},"Para diagnosticar trastorno antisocial se necesita evidencia de trastorno de la conducta antes de los 15 años. Sin eso, no se diagnostica."),
       e(Pearl,{t:"Evitativa vs esquizoide"},"Evitativa: DESEA las relaciones pero las evita por miedo al rechazo. Esquizoide: NO DESEA las relaciones, prefiere estar solo."),
       e(Pearl,{t:"Escisión en TLP"},"Mecanismo defensivo nuclear: alternancia brusca entre idealización ('eres el mejor') y devaluación ('eres horrible') del mismo objeto/persona. Genera relaciones interpersonales inestables."),
       e(Pearl,{t:"TLP y trauma"},"~70% tiene antecedentes de trauma infantil (abuso sexual, negligencia). No es 'causa única' pero es factor clave."),
       e(Pearl,{t:"Tasa de suicidio en TLP"},"~10% consuma suicidio. La autolesión NO es equivalente a suicidio (regula afecto, no busca morir), pero el riesgo suicida es real y alto."),
       e(Pearl,{t:"Inicio en adultez"},"Todos los TP inician en adolescencia o adultez temprana y son estables en el tiempo. Un cambio súbito en personalidad adulta sugiere causa orgánica (tumor frontal, demencia, enfermedad médica)."),
       e(Pearl,{t:"Narcisismo + depresión"},"Los pacientes narcisistas consultan frecuentemente tras una 'herida narcisista' (fracaso, rechazo, pérdida de estatus) que precipita depresión.")
     )},
    {id:"resumen",ic:"📊",t:"Resumen comparativo",sub:"Los 10 trastornos en tabla",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Cluster",c:c},{t:"Trastorno",c:c},{t:"Rasgo central",c:c}],
         rows:[
           ["A","Paranoide","Desconfianza y suspicacia"],
           ["A","Esquizoide","Desapego · prefiere soledad"],
           ["A","Esquizotípica","Excentricidad + distorsiones cognitivas"],
           ["B","Antisocial","Transgresión de derechos · CC <15 años"],
           ["B","Límite (TLP)","Inestabilidad + miedo abandono · autolesión"],
           ["B","Histriónica","Emotividad + búsqueda de atención"],
           ["B","Narcisista","Grandiosidad + falta de empatía"],
           ["C","Evitativa","Inhibición social · desea pero evita"],
           ["C","Dependiente","Necesidad de ser cuidado · sumisión"],
           ["C","Obsesivo-compulsiva (TOCP)","Perfeccionismo rígido · egosintónico"]
         ]
       })
     )},
    {id:"flash",ic:"🃏",t:"Flashcards",sub:"15 preguntas + las tuyas",c:c,
     content:e("div",null,
       e(P,null,"Tarjetas de repaso de trastornos de personalidad. Añade las tuyas."),
       e(FlashDeck,{c:c,deckId:"personalidad",items:getAllCards("personalidad")})
     )},
    {id:"quiz",ic:"❓",t:"Quiz · 6 casos clínicos",sub:"Prueba tus conocimientos",c:c,
     content:e(Quiz,{c:c,items:getAllQuiz("personalidad")})}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Tema 7 · Neurosis · DSM-5-TR",title:"Trastornos de la personalidad"},
      "Patrones persistentes de experiencia interna y comportamiento que se apartan notablemente de las expectativas culturales, son inflexibles y generalizados, inician en la adolescencia/adultez temprana y son estables en el tiempo. Se organizan en ",e("b",null,"3 clusters")," (A, B y C) y son en total ",e("b",null,"10 entidades"),"."
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.3),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Conceptos · Clusters · DDx · Flashcards · Quiz")
    ),
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginTop:10}},
      general.map(function(g,i){
        return e("button",{key:g.id,onClick:function(){setOpenGen(i);},style:{padding:"14px 12px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:10,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:4,minHeight:90}},
          e("div",{style:{fontSize:22,marginBottom:4}},g.ic),
          e("div",{style:{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Playfair Display"}},g.t),
          e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.4,marginTop:2}},g.sub)
        );
      })
    ),
    openGen!==null?e(DzModal,{c:general[openGen].c,name:general[openGen].t,kicker:"Sección del tema",single:general[openGen].content,onClose:function(){setOpenGen(null);}}):null,

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.15)+","+ax(c,.04)+" 90%)",border:"1px solid "+ax(c,.35),borderRadius:14,margin:"18px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Los 10 trastornos"),
      e("div",{style:{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Toca cualquier trastorno para abrir su ficha"),
      e("div",{style:{fontSize:12,color:C.mt,marginTop:4,lineHeight:1.45}},"Prefijo A/B/C indica el cluster · cada ficha tiene tabs: Definición · Clínica · Diagnóstico · Tratamiento")
    ),
    e(DzGrid,{c:c,items:diseases}),

    e(Abbrev,{c:c,items:[
      {a:"TP",d:"Trastorno de Personalidad"},
      {a:"TLP",d:"Trastorno Límite de Personalidad (borderline)"},
      {a:"TOCP",d:"Trastorno Obsesivo-Compulsivo de la Personalidad"},
      {a:"DBT",d:"Terapia Dialéctico-Conductual (Marsha Linehan)"},
      {a:"MBT",d:"Mentalization-Based Treatment"},
      {a:"TCC",d:"Terapia Cognitivo-Conductual"},
      {a:"CC",d:"Trastorno de la Conducta (conduct disorder, en menores)"},
      {a:"TEA",d:"Trastorno del Espectro Autista"}
    ]})
  );
}



// ══════════════════════════════════════════════════════════════
// TEMA 8 · TRASTORNOS DISRUPTIVOS, DEL CONTROL DE IMPULSOS Y DE LA CONDUCTA
// ══════════════════════════════════════════════════════════════

function ImpView(){
  var c=C.imp;
  var diseases=[
    {
      n:"01",name:"Trastorno negativista desafiante",c:c,
      blurb:"Niños · patrón enfadado/desafiante/vengativo · ≥6 meses",
      sections:{
        def:e(Def,{c:c},"Patrón de ",e("b",null,"enfado/irritabilidad"),", ",e("b",null,"actitud discutidora/desafiante")," o ",e("b",null,"vengatividad")," que dura ",e("b",null,"≥6 meses"),". Frecuente precursor del trastorno de la conducta en algunos niños."),
        cli:e("div",null,
          e(H3,{c:c},"Criterios · ≥4 síntomas de 3 categorías"),
          e(Table,{
            headers:[{t:"Categoría",c:c},{t:"Síntomas",c:c}],
            rows:[
              ["Enfado / irritabilidad","A menudo pierde la calma · susceptible y se molesta con facilidad · enfadado y resentido"],
              ["Actitud discutidora / desafiante","Discute con figuras de autoridad · desafía activamente o rechaza cumplir reglas · molesta deliberadamente a otros · acusa a otros de sus errores"],
              ["Vengatividad","Rencoroso o vengativo (al menos 2 veces en los últimos 6 meses)"]
            ]
          }),
          e(Note,{c:c,t:"Frecuencia y edad"},"En niños <5 años: síntomas casi todos los días durante ≥6 meses. En ≥5 años: al menos 1 vez/semana durante ≥6 meses. Los síntomas deben ser desproporcionados al nivel de desarrollo.")
        ),
        dx:e(CritBlock,{title:"Negativista desafiante (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Patrón de enfado/irritabilidad, actitud discutidora/desafiante o vengatividad durante ≥6 meses, con ≥4 síntomas de las 3 categorías."),
          e(Crit,{crit:"B",c:c},"Los síntomas causan malestar en el individuo u otros o tienen impacto negativo social, educativo, laboral u otras áreas."),
          e(Crit,{crit:"C",c:c},"Los síntomas NO aparecen exclusivamente en el curso de un trastorno psicótico, por uso de sustancias, depresivo o bipolar. Tampoco se cumplen los criterios de trastorno de desregulación disruptiva del ánimo.")
        ),
        tx:e(P,null,e("b",null,"Terapia conductual con padres")," (Parent Management Training, PMT) — 1ª línea. Terapia familiar. TCC en niños mayores. Manejo de comorbilidades (TDAH es muy frecuente — estimulantes pueden mejorar ambos cuadros).")
      }
    },
    {
      n:"02",name:"Trastorno explosivo intermitente (TEI)",c:c,
      blurb:"Arrebatos agresivos recurrentes desproporcionados",
      sections:{
        def:e(Def,{c:c},"Arrebatos recurrentes que reflejan una ",e("b",null,"falta de control de los impulsos agresivos"),". Los arrebatos son impulsivos o basados en la ira (no premeditados para obtener algo tangible)."),
        cli:e("div",null,
          e(H3,{c:c},"Los 2 patrones (cumplir UNO)"),
          e(Table,{
            headers:[{t:"Patrón",c:c},{t:"Criterio",c:c}],
            rows:[
              ["A1 · Frecuentes y de baja intensidad","Agresiones verbales (rabietas, riñas, discusiones) o física sin daño, a personas/animales/propiedad, ≥2 veces/semana durante ≥3 meses"],
              ["A2 · Infrecuentes y de alta intensidad","≥3 arrebatos con daño/destrucción a propiedad o agresión física con lesión, en los últimos 12 meses"]
            ]
          }),
          e(Note,{c:c,t:"Criterios adicionales"},"B: Magnitud desproporcionada a la provocación. C: No premeditados ni con objetivo tangible. D: Malestar o deterioro. E: Edad ≥6 años. F: No explicado mejor por otro trastorno ni por sustancia/afección médica.")
        ),
        dx:e(P,null,"Al menos un patrón A cumplido + criterios B–F."),
        tx:e("div",null,
          e(SxList,{c:c,items:[
            "TCC con manejo de la ira (1ª línea)",
            "ISRS (fluoxetina tiene mejor evidencia)",
            "Estabilizadores del ánimo (valproato, litio)",
            "Antipsicóticos atípicos en casos graves",
            "Relajación + reestructuración cognitiva"
          ]})
        )
      }
    },
    {
      n:"03",name:"Trastorno de conducta (CC)",c:c,
      blurb:"Menores · transgresión grave de derechos/normas · ≥12 meses",
      sections:{
        def:e(Def,{c:c},"Patrón repetitivo y persistente de comportamiento en el que NO se respetan los derechos básicos de otros ni las normas sociales apropiadas a la edad. Precursor del trastorno antisocial de personalidad cuando persiste en la adultez."),
        cli:e("div",null,
          e(H3,{c:c},"Las 4 categorías · ≥3 síntomas en últimos 12 meses (≥1 en últimos 6)"),
          e(Table,{
            headers:[{t:"Categoría",c:c},{t:"Ejemplos",c:c}],
            rows:[
              ["Agresión a personas/animales","Intimidar, pelear, usar armas, crueldad con personas o animales, robo con confrontación, violación"],
              ["Destrucción de la propiedad","Provocar incendios · destruir propiedad"],
              ["Engaño o robo","Entrar en casa/edificio ajeno, mentir, robar sin confrontación (hurtos en tiendas)"],
              ["Violaciones graves de las normas","Salir por la noche (antes de los 13), escaparse de casa, ausentismo escolar (antes de los 13)"]
            ]
          }),
          e(H3,{c:c,mt:14},"Especificadores clave"),
          e(SxList,{c:c,items:[
            "Tipo de inicio: infantil (≥1 síntoma antes de los 10 años, peor pronóstico) o adolescente",
            "Con emociones prosociales limitadas (rasgos 'callous-unemotional' → mayor riesgo de antisocial adulto)",
            "Gravedad: leve · moderado · grave"
          ]})
        ),
        dx:e(CritBlock,{title:"Trastorno de la conducta (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Patrón ≥3 síntomas de las 4 categorías en últimos 12 meses, con ≥1 en últimos 6 meses."),
          e(Crit,{crit:"B",c:c},"Causa deterioro clínicamente significativo en lo social, académico o laboral."),
          e(Crit,{crit:"C",c:c},"Si ≥18 años, no se cumplen criterios de trastorno antisocial de personalidad.")
        ),
        tx:e(P,null,"Multimodal: terapia familiar (parent management training), terapia multisistémica, TCC individual. Manejo de comorbilidades (TDAH, sustancias, depresión). Cuando hay síntomas severos, contener y manejar impulsividad con antipsicóticos atípicos o estabilizadores.")
      }
    },
    {
      n:"04",name:"Piromanía",c:c,
      blurb:"Provocación deliberada de incendios con fascinación",
      sections:{
        def:e(Def,{c:c},"Provocación ",e("b",null,"deliberada e intencional")," de incendios en ",e("b",null,"más de una ocasión"),", con ",e("b",null,"tensión previa")," y ",e("b",null,"fascinación/atracción/curiosidad")," por el fuego y lo relacionado, y ",e("b",null,"placer/alivio")," al encenderlo o atestiguarlo."),
        cli:e("div",null,
          e(P,null,"Raro como dx primario; mucho más frecuente en contexto de otros trastornos (antisocial, intoxicación, esquizofrenia, discapacidad intelectual)."),
          e(Pearl,{t:"Ojo: NO es piromanía si…"},"1) El incendio tiene motivación económica, venganza, ideología política, ocultar otro delito, o mejorar circunstancias. 2) Ocurre en respuesta a delirios/alucinaciones. 3) Es producto de alteración del juicio (demencia, intoxicación). 4) Es manifestación de trastorno de la conducta o antisocial.")
        ),
        dx:e(CritBlock,{title:"Piromanía (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Provocación deliberada e intencional de incendios en más de una ocasión."),
          e(Crit,{crit:"B",c:c},"Tensión o excitación afectiva antes del acto."),
          e(Crit,{crit:"C",c:c},"Fascinación, interés, curiosidad o atracción por el fuego y las situaciones asociadas (materiales, usos, consecuencias)."),
          e(Crit,{crit:"D",c:c},"Placer, gratificación o alivio al provocar el incendio o al presenciar/participar en sus consecuencias."),
          e(Crit,{crit:"E",c:c},"NO se provoca por motivación económica, ideológica, vengativa, para ocultar otro delito, ni como respuesta a delirio/alucinación o alteración del juicio."),
          e(Crit,{crit:"F",c:c},"NO mejor explicada por trastorno de la conducta, episodio maníaco o trastorno antisocial de personalidad.")
        ),
        tx:e(P,null,"Muy pobre respuesta a farmacoterapia. TCC con manejo de impulsos. Supervisión y contención. Tratar trastornos comórbidos.")
      }
    },
    {
      n:"05",name:"Cleptomanía",c:c,
      blurb:"Impulso recurrente de robar sin necesidad · no por valor",
      sections:{
        def:e(Def,{c:c},"Fracaso ",e("b",null,"recurrente")," en el control del impulso de ",e("b",null,"robar objetos")," que NO son necesarios para el uso personal o por su valor económico. Tensión previa + placer/gratificación/alivio al cometer el robo."),
        cli:e("div",null,
          e(P,null,"Mucho más frecuente en mujeres (~3:1). Inicio típico en adolescencia. Los objetos robados suelen ser abandonados, regalados, devueltos o acumulados. Alta comorbilidad con trastornos del ánimo, ansiedad, conducta alimentaria, sustancias."),
          e(Note,{c:c,t:"Clave diferencial"},"En el robo 'común' hay motivación económica o uso del objeto. En cleptomanía el robo es impulsivo y el objeto no tiene valor para el paciente.")
        ),
        dx:e(CritBlock,{title:"Cleptomanía (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Fracaso recurrente del impulso de robar objetos que no son necesarios para uso personal ni por valor económico."),
          e(Crit,{crit:"B",c:c},"Tensión creciente inmediatamente antes del robo."),
          e(Crit,{crit:"C",c:c},"Placer, gratificación o alivio al cometer el robo."),
          e(Crit,{crit:"D",c:c},"El robo NO se comete para expresar rabia o venganza, ni en respuesta a delirios/alucinaciones."),
          e(Crit,{crit:"E",c:c},"NO mejor explicado por trastorno de la conducta, episodio maníaco o trastorno antisocial de personalidad.")
        ),
        tx:e(P,null,"TCC con desensibilización encubierta. ISRS (fluoxetina) + naltrexona tienen evidencia de utilidad (modulación del sistema de recompensa).")
      }
    }
  ];

  var s1=useState(null);var openGen=s1[0],setOpenGen=s1[1];
  var general=[
    {id:"conceptos",ic:"🧭",t:"Conceptos generales",sub:"Organización del capítulo",c:c,
     content:e("div",null,
       e(P,null,"Capítulo del DSM-5 que agrupa trastornos caracterizados por problemas en el control del comportamiento emocional y conductual, con violación de los derechos de los demás o conflicto con autoridades/normas."),
       e(H3,{c:c,mt:14},"Las 5 entidades principales"),
       e(Table,{
         headers:[{t:"Entidad",c:c},{t:"Núcleo",c:c},{t:"Edad típica",c:c}],
         rows:[
           ["Negativista desafiante","Enfado/desafío/vengatividad ≥6 m","Niños · adolescentes"],
           ["Explosivo intermitente (TEI)","Arrebatos agresivos desproporcionados","≥6 años (usualmente adultos jóvenes)"],
           ["Trastorno de la conducta","Transgresión grave de derechos/normas","Niños/adolescentes"],
           ["Piromanía","Incendios deliberados con fascinación","Variable · raro"],
           ["Cleptomanía","Robo impulsivo de objetos sin valor","Adolescencia/adultez · mujeres"]
         ]
       }),
       e(Note,{c:c,t:"Relación con antisocial"},"El trastorno de la conducta es el equivalente en menores al trastorno antisocial de personalidad adulto. Un niño con CC severo tiene alto riesgo de desarrollar antisocial al adultecer; el CC antes de los 15 años es prerrequisito para diagnosticar antisocial.")
     )},
    {id:"trampas",ic:"🎯",t:"Diagnósticos diferenciales clave",sub:"Separar entidades",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Par",c:c},{t:"Diferencia clave",c:c}],
         rows:[
           ["Negativista vs Conducta","Negativista: desafío, no violación grave de derechos. Conducta: agresión, destrucción, robo, violación de normas graves"],
           ["Conducta (<18) vs Antisocial (≥18)","Misma fenomenología, diferente edad. Conducta antes de 15 años es criterio para antisocial"],
           ["TEI vs Antisocial","TEI: arrebatos IMPULSIVOS sin propósito. Antisocial: conducta PLANEADA y sin remordimiento, patrón pervasivo"],
           ["Piromanía vs incendios instrumentales","Piromanía: fascinación + placer con el fuego. Incendiario común: busca cobrar seguro, vengarse, ocultar delito"],
           ["Cleptomanía vs robo común","Cleptomanía: objetos sin valor, impulso no planeado. Robo común: motivación económica"],
           ["TEI vs manía","Manía tiene euforia/ánimo elevado + otros síntomas. TEI es solo los arrebatos"]
         ]
       })
     )},
    {id:"tx",ic:"💊",t:"Tratamiento · resumen del tema",sub:"Mayoritariamente conductual",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"1ª línea",c:c},{t:"Farmacoterapia",c:c}],
         rows:[
           ["Negativista desafiante","Parent Management Training + terapia familiar","Tratar comorbilidades (TDAH, depresión)"],
           ["TEI","TCC manejo de ira","ISRS (fluoxetina) · valproato · litio"],
           ["Conducta","Terapia multisistémica + familiar","Antipsicóticos atípicos si agresión severa"],
           ["Piromanía","TCC · supervisión","Pobre respuesta farmacológica"],
           ["Cleptomanía","TCC con desensibilización","ISRS + naltrexona"]
         ]
       })
     )},
    {id:"perlas",ic:"📌",t:"Perlas de examen",sub:"Alto rendimiento",c:c,
     content:e("div",null,
       e(Pearl,{t:"CC <15 años → antisocial adulto"},"El trastorno de la conducta antes de los 15 años es criterio OBLIGATORIO para diagnosticar antisocial de personalidad en ≥18 años. Sin este antecedente, no se diagnostica antisocial."),
       e(Pearl,{t:"TEI es IMPULSIVO"},"Los arrebatos en TEI son IMPULSIVOS y DESPROPORCIONADOS, no planeados ni con objetivo tangible. Diferencia con antisocial (planeación, explotación)."),
       e(Pearl,{t:"Piromanía rara"},"Dx primario raro. Antes de diagnosticarlo descartar motivación económica, vengativa, ideológica, o que sea manifestación de otro trastorno."),
       e(Pearl,{t:"Cleptomanía + mujer"},"~3:1 mujeres. Inicio en adolescencia. Objetos robados no tienen valor para el paciente."),
       e(Pearl,{t:"'Callous-unemotional'"},"Especificador 'con emociones prosociales limitadas' en CC. Rasgos de frialdad, poca culpa, afecto superficial. Predictor fuerte de antisocial adulto + peor respuesta a tratamiento."),
       e(Pearl,{t:"Negativista + TDAH"},"Muy alta comorbilidad (~40%). Tratar el TDAH con estimulantes frecuentemente mejora también el negativismo."),
       e(Pearl,{t:"Parent Management Training (PMT)"},"Intervención de 1ª línea para negativista desafiante y CC en niños. Enseña a padres a usar reforzamiento positivo, consecuencias consistentes, y gestión de límites.")
     )},
    {id:"resumen",ic:"📊",t:"Resumen comparativo",sub:"5 entidades en tabla",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Trastorno",c:c},{t:"Duración / criterio clave",c:c},{t:"Tx 1ª línea",c:c}],
         rows:[
           ["Negativista desafiante","≥4 síntomas × ≥6 meses (en niños)","PMT + terapia familiar"],
           ["TEI","Arrebatos ≥2/sem × 3 m (A1) o ≥3 graves/año (A2) · edad ≥6","TCC manejo ira · ISRS/valproato"],
           ["Trastorno de la conducta","≥3 síntomas últimos 12m · ≥1 últimos 6m","Terapia multisistémica"],
           ["Piromanía","Incendios deliberados + fascinación","TCC · pobre respuesta"],
           ["Cleptomanía","Robo impulsivo sin valor","TCC + ISRS + naltrexona"]
         ]
       })
     )},
    {id:"flash",ic:"🃏",t:"Flashcards",sub:"12 preguntas + las tuyas",c:c,
     content:e("div",null,
       e(P,null,"Tarjetas de repaso de control de impulsos. Añade las tuyas."),
       e(FlashDeck,{c:c,deckId:"impulsos",items:getAllCards("impulsos")})
     )},
    {id:"quiz",ic:"❓",t:"Quiz · 6 casos clínicos",sub:"Prueba tus conocimientos",c:c,
     content:e(Quiz,{c:c,items:getAllQuiz("impulsos")})}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Tema 8 · Neurosis · DSM-5-TR",title:"Control de impulsos y conducta"},
      "Capítulo del DSM-5 que agrupa trastornos caracterizados por ",e("b",null,"dificultad en el control de emociones y comportamiento"),", con transgresión de derechos ajenos o conflicto con autoridades/normas. Incluye entidades infantiles (negativista, conducta) y del adulto (TEI, piromanía, cleptomanía). Son ",e("b",null,"5 entidades principales"),"."
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.3),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Conceptos · DDx · Flashcards · Quiz")
    ),
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginTop:10}},
      general.map(function(g,i){
        return e("button",{key:g.id,onClick:function(){setOpenGen(i);},style:{padding:"14px 12px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:10,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:4,minHeight:90}},
          e("div",{style:{fontSize:22,marginBottom:4}},g.ic),
          e("div",{style:{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Playfair Display"}},g.t),
          e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.4,marginTop:2}},g.sub)
        );
      })
    ),
    openGen!==null?e(DzModal,{c:general[openGen].c,name:general[openGen].t,kicker:"Sección del tema",single:general[openGen].content,onClose:function(){setOpenGen(null);}}):null,

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.15)+","+ax(c,.04)+" 90%)",border:"1px solid "+ax(c,.35),borderRadius:14,margin:"18px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Las 5 entidades"),
      e("div",{style:{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Toca cualquier entidad para abrir su ficha")
    ),
    e(DzGrid,{c:c,items:diseases}),

    e(Abbrev,{c:c,items:[
      {a:"CC",d:"Conduct Disorder (trastorno de la conducta)"},
      {a:"TEI",d:"Trastorno Explosivo Intermitente"},
      {a:"PMT",d:"Parent Management Training"},
      {a:"TDAH",d:"Trastorno por Déficit de Atención e Hiperactividad"},
      {a:"TCC",d:"Terapia Cognitivo-Conductual"},
      {a:"ISRS",d:"Inhibidores Selectivos de la Recaptación de Serotonina"}
    ]})
  );
}



// ══════════════════════════════════════════════════════════════
// TEMA 9 · TRASTORNOS DEPRESIVOS (PUROS)
// ══════════════════════════════════════════════════════════════

function DprView(){
  var c=C.dpr;
  var diseases=[
    {
      n:"01",name:"Trastorno depresivo mayor (TDM)",c:c,
      blurb:"≥5 síntomas · ≥2 semanas · deterioro · ánimo bajo o anhedonia",
      sections:{
        def:e("div",null,
          e("div",{style:{padding:"12px 14px",background:ax(C.bip,.08),border:"1px solid "+ax(C.bip,.3),borderLeft:"3px solid "+C.bip,borderRadius:10,marginBottom:12}},
            e("div",{style:{fontSize:10,fontWeight:800,color:C.bip,letterSpacing:1.6,textTransform:"uppercase",marginBottom:5}},"🔗 Referencia cruzada"),
            e("div",{style:{fontSize:12.5,color:C.tx,lineHeight:1.55}},"Los ",e("b",null,"9 criterios del episodio depresivo mayor")," también se estudian como ",e("b",null,"componente interno")," del trastorno bipolar (I y II) en ",e("b",{style:{color:C.psi}},"Psicosis → Bipolar I / II"),". Aquí lo vemos como trastorno ",e("b",null,"crónico o recurrente")," sin antecedente maníaco.")
          ),
          e(Def,{c:c},"Al menos un episodio depresivo mayor. Un episodio requiere ",e("b",null,"≥5 síntomas (de 9)"),", presentes la mayor parte del día casi todos los días durante ",e("b",null,"≥2 semanas"),", con al menos uno de ellos siendo ",e("b",null,"estado de ánimo depresivo"),", o ",e("b",null,"anhedonia"),".")
        ),
        cli:e("div",null,
          e(H3,{c:c},"Los 9 síntomas · nemotecnia SIGECAPS"),
          e(Table,{
            headers:[{t:"Letra",c:c},{t:"Síntoma",c:c}],
            rows:[
              ["S · Sleep","Insomnio o hipersomnia"],
              ["I · Interest","Anhedonia (pérdida de interés/placer) ★"],
              ["G · Guilt","Culpa o sensación de inutilidad"],
              ["E · Energy","Fatiga o pérdida de energía"],
              ["C · Concentration","Disminución de concentración o indecisión"],
              ["A · Appetite","Cambio de apetito o peso (≥5% en 1 mes)"],
              ["P · Psychomotor","Agitación o retardo psicomotor"],
              ["S · Suicide","Pensamientos recurrentes de muerte o suicidio"],
              ["Ánimo ★","Estado de ánimo depresivo la mayor parte del día"]
            ]
          }),
          e(Note,{c:c,t:"Requisito obligatorio"},"Al menos uno de los ≥5 síntomas debe ser ",e("b",null,"ánimo depresivo")," o ",e("b",null,"anhedonia"),". Sin uno de esos dos, no hay episodio depresivo mayor."),
          e(H3,{c:c,mt:14},"Especificadores del TDM"),
          e(SxList,{c:c,items:[
            "Con ansiedad (leve/moderada/grave)",
            "Con características mixtas (síntomas maníacos/hipomaníacos sin cumplir episodio)",
            "Con características melancólicas (anhedonia severa, despertar precoz, peor en la mañana, pérdida de peso, culpa excesiva)",
            "Con características atípicas (reactividad del ánimo, hiperfagia, hipersomnia, parálisis plúmbea, sensibilidad al rechazo)",
            "Con características psicóticas (congruentes o incongruentes con el ánimo)",
            "Con catatonia",
            "Con inicio en el periparto (durante embarazo o 4 semanas tras el parto)",
            "Con patrón estacional (recurrencia en una estación específica · típico en invierno)"
          ]}),
          e(H3,{c:c,mt:14},"Epidemiología"),
          e(SxList,{c:c,items:[
            "Prevalencia de por vida ~16–17%",
            "Mujeres 2:1 hombres",
            "Inicio típico adultez temprana (20–30 años)",
            "Alta comorbilidad con ansiedad, TUS, TLP, enfermedad médica",
            "Tasa de suicidio consumado: riesgo vital ~3–4% (mayor si psicosis, antecedente familiar, comorbilidad con TUS)"
          ]})
        ),
        dx:e(CritBlock,{title:"Episodio depresivo mayor (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"≥5 de los 9 síntomas durante un periodo de 2 semanas, con cambio respecto al funcionamiento previo. Al menos uno debe ser (1) ánimo depresivo o (2) pérdida de interés/placer."),
          e(Crit,{crit:"B",c:c},"Los síntomas causan malestar clínicamente significativo o deterioro."),
          e(Crit,{crit:"C",c:c},"El episodio no se puede atribuir a efectos de una sustancia ni a otra afección médica."),
          e(Crit,{crit:"D",c:c},"El episodio no se explica mejor por un trastorno del espectro esquizofrénico u otro trastorno psicótico."),
          e(Crit,{crit:"E",c:c},"Nunca ha habido un episodio maníaco o hipomaníaco.")
        ),
        tx:e("div",null,
          e(H3,{c:c},"Farmacoterapia"),
          e(Table,{
            headers:[{t:"Grupo",c:c},{t:"Fármacos representativos",c:c},{t:"Cuándo elegirlos",c:c}],
            rows:[
              ["ISRS (1ª línea)","Sertralina 50–200 mg · escitalopram 10–20 mg · fluoxetina 20–80 mg · paroxetina 20–60 mg","Casi cualquier paciente"],
              ["IRSN","Venlafaxina 75–225 mg · duloxetina 30–120 mg","Si dolor comórbido · falla con ISRS"],
              ["Atípicos","Mirtazapina 15–45 mg · bupropión 150–450 mg · vortioxetina","Mirtazapina si insomnio/pérdida peso · bupropión si no disfunción sexual o fatiga"],
              ["Tricíclicos","Amitriptilina · nortriptilina","Melancólica · dolor · 2ª/3ª línea por perfil de efectos adversos"],
              ["IMAOs","Fenelzina · tranilcipromina","Atípica · refractaria · requieren dieta baja en tiramina"]
            ]
          }),
          e(Alert,{c:C.warn,label:"🔑 Reglas de oro"},
            e("ol",{style:{margin:0,paddingLeft:20,lineHeight:1.8,fontSize:13}},
              e("li",null,e("b",null,"Respuesta:")," 2–4 semanas. Efecto completo: 6–8 semanas."),
              e("li",null,e("b",null,"Duración del tratamiento:")," mínimo 6–9 meses tras remisión en primer episodio; 2 años o indefinido si ≥2 episodios o episodio grave/psicótico."),
              e("li",null,e("b",null,"Descontinuar:")," reducir gradualmente en 2–4 semanas para evitar síndrome de discontinuación (especialmente paroxetina, venlafaxina)."),
              e("li",null,e("b",null,"Warning")," suicidalidad: aumento transitorio de ideación suicida en <25 años al iniciar · vigilancia estrecha las primeras semanas.")
            )
          ),
          e(H3,{c:c,mt:14},"Psicoterapia"),
          e(SxList,{c:c,items:[
            "TCC — 1ª línea psicoterapéutica · sólida evidencia",
            "Terapia interpersonal (TIP)",
            "Activación conductual",
            "Terapia psicodinámica (moderada evidencia)"
          ]}),
          e(H3,{c:c,mt:14},"Tratamientos físicos / refractarios"),
          e(SxList,{c:c,items:[
            "TEC (terapia electroconvulsiva) — gold standard en depresión refractaria, psicótica, riesgo suicida alto, catatonia, embarazo",
            "EMT (estimulación magnética transcraneal) — en falla ≥1 ISRS",
            "Ketamina IV / esketamina intranasal — efecto rápido (horas-días) en refractaria/suicidalidad aguda",
            "Fototerapia — patrón estacional"
          ]})
        )
      }
    },
    {
      n:"02",name:"Trastorno depresivo persistente (distimia)",c:c,
      blurb:"Ánimo depresivo crónico ≥2 años (≥1 año niños)",
      sections:{
        def:e(Def,{c:c},"Ánimo depresivo crónico la mayor parte del día, la mayoría de los días, durante ",e("b",null,"≥2 años")," en adultos (o ",e("b",null,"≥1 año")," en niños y adolescentes, en quienes puede presentarse como irritabilidad). DSM-5 consolidó distimia + depresión mayor crónica en esta entidad."),
        cli:e("div",null,
          e(H3,{c:c},"≥2 síntomas asociados"),
          e(SxList,{c:c,items:[
            "Alteración del apetito (aumento o disminución)",
            "Insomnio o hipersomnia",
            "Baja energía o fatiga",
            "Baja autoestima",
            "Dificultad para concentrarse o tomar decisiones",
            "Sentimientos de desesperanza"
          ]}),
          e(Note,{c:c,t:"'Depresión doble'"},"Paciente con distimia crónica que además desarrolla episodios depresivos mayores superpuestos. Peor pronóstico.")
        ),
        dx:e(CritBlock,{title:"Trastorno depresivo persistente (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Estado de ánimo deprimido la mayor parte del día, la mayoría de los días, según el propio paciente u observadores, durante ≥2 años (≥1 año en menores)."),
          e(Crit,{crit:"B",c:c},"Durante la depresión, ≥2 de los 6 síntomas listados."),
          e(Crit,{crit:"C",c:c},"Durante los 2 años (1 en menores), el paciente no ha estado sin los síntomas del criterio A/B durante más de 2 meses seguidos."),
          e(Crit,{crit:"D",c:c},"Pueden cumplirse continuamente criterios de depresión mayor durante 2 años."),
          e(Crit,{crit:"E",c:c},"Nunca ha habido episodio maníaco o hipomaníaco."),
          e(Crit,{crit:"F",c:c},"No se explica mejor por trastorno esquizoafectivo, esquizofrenia u otros psicóticos."),
          e(Crit,{crit:"G",c:c},"No atribuible a sustancia o afección médica."),
          e(Crit,{crit:"H",c:c},"Causa malestar o deterioro.")
        ),
        tx:e(P,null,"Mismos fármacos que TDM (ISRS 1ª línea). La respuesta suele ser más lenta y la combinación ",e("b",null,"antidepresivo + psicoterapia (TCC o TIP)")," es especialmente efectiva en depresión crónica.")
      }
    },
    {
      n:"03",name:"Trastorno disfórico premenstrual (TDPM)",c:c,
      blurb:"Síntomas afectivos severos la semana previa a la menstruación",
      sections:{
        def:e(Def,{c:c},"Expresión severa de síndrome premenstrual con ",e("b",null,"síntomas afectivos marcados")," que aparecen en la ",e("b",null,"semana antes de la menstruación"),", mejoran a los pocos días tras el inicio del sangrado, y son ",e("b",null,"mínimos o ausentes")," en la semana posmenstrual. Debe confirmarse con ",e("b",null,"registro diario prospectivo durante ≥2 ciclos"),"."),
        cli:e("div",null,
          e(H3,{c:c},"Requisitos sintomáticos"),
          e(P,null,"En los ≥5 síntomas totales, debe haber ≥1 de los 4 ",e("b",null,"síntomas afectivos nucleares"),":"),
          e(SxList,{title:"Nucleares (≥1)",c:c,items:[
            "Labilidad afectiva marcada (cambios de humor, sensibilidad al rechazo)",
            "Irritabilidad marcada o aumento de conflictos interpersonales",
            "Ánimo deprimido, desesperanza o autodesvalorización",
            "Ansiedad, tensión, sensación de 'estar al límite'"
          ]}),
          e(SxList,{title:"Otros (para llegar a ≥5)",c:c,items:[
            "Disminución del interés por actividades habituales",
            "Dificultad de concentración",
            "Letargia, fatigabilidad fácil, falta de energía",
            "Cambio marcado del apetito, antojos",
            "Hipersomnia o insomnio",
            "Sensación subjetiva de agobio o descontrol",
            "Síntomas físicos (mamalgia, hinchazón, artralgias, aumento de peso)"
          ]})
        ),
        dx:e(CritBlock,{title:"Trastorno disfórico premenstrual (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"≥5 síntomas en la semana antes de la menstruación, mejorando tras inicio del sangrado, mínimos o ausentes en la semana posmenstrual."),
          e(Crit,{crit:"B",c:c},"≥1 de los 4 síntomas afectivos nucleares."),
          e(Crit,{crit:"C",c:c},"≥1 de los otros síntomas (para llegar a 5 totales con B)."),
          e(Crit,{crit:"D",c:c},"Los síntomas causan malestar clínico o deterioro."),
          e(Crit,{crit:"E",c:c},"No es mera exacerbación de otro trastorno (aunque puede coexistir)."),
          e(Crit,{crit:"F",c:c},"El criterio A debe confirmarse con ≥2 ciclos sintomáticos por registro diario prospectivo."),
          e(Crit,{crit:"G",c:c},"No atribuible a sustancia ni afección médica.")
        ),
        tx:e("div",null,
          e(SxList,{c:c,items:[
            "ISRS (1ª línea) · fluoxetina, sertralina, escitalopram · pueden usarse continuamente o solo en fase luteal",
            "Anticonceptivos orales combinados (drospirenona con etinilestradiol)",
            "Manejo del estilo de vida (ejercicio, sueño, reducción de cafeína)",
            "Suplementos: calcio, vitamina B6 (evidencia moderada)",
            "TCC"
          ]}),
          e(Pearl,{t:"Régimen luteal de ISRS"},"Solo en la fase luteal (desde ovulación hasta menstruación, ~14 días). Ventaja: menos exposición total, menos efectos adversos, efecto puede ser casi inmediato al tratar el patrón cíclico.")
        )
      }
    },
    {
      n:"04",name:"Trastorno de desregulación disruptiva del ánimo (TDDD)",c:c,
      blurb:"Niños 6–18 · irritabilidad crónica + rabietas severas",
      sections:{
        def:e(Def,{c:c},"Patrón crónico de ",e("b",null,"irritabilidad severa")," con ",e("b",null,"rabietas explosivas")," recurrentes desproporcionadas en intensidad o duración, ",e("b",null,"≥3 veces por semana durante ≥12 meses"),", presente en ≥2 escenarios (casa, escuela, con pares) y severas en ≥1. Diagnóstico solo en niños/adolescentes de ",e("b",null,"6–18 años"),", con inicio antes de los 10."),
        cli:e("div",null,
          e(P,null,"Fue creado en DSM-5 para reducir el sobre-diagnóstico de trastorno bipolar pediátrico. Un niño con irritabilidad crónica sin episodios maníacos discretos entra aquí, no en bipolar."),
          e(H3,{c:c,mt:14},"Características clave"),
          e(SxList,{c:c,items:[
            "Rabietas severas (verbales y/o físicas) desproporcionadas",
            "Entre las rabietas, ánimo persistentemente IRRITABLE o ENFADADO (no 'normal')",
            "Presencia en ≥2 contextos, severa en ≥1",
            "Edad de diagnóstico: 6–18 años",
            "Inicio antes de los 10 años (criterio obligatorio)",
            "NO se diagnostica simultáneamente con trastorno negativista desafiante, TEI o bipolar (si cumple TDDD, se diagnostica TDDD en lugar de negativista)"
          ]})
        ),
        dx:e(CritBlock,{title:"TDDD (DSM-5)",c:c},
          e(Crit,{crit:"A",c:c},"Rabietas graves y recurrentes (verbales o conductuales) desproporcionadas en intensidad o duración."),
          e(Crit,{crit:"B",c:c},"Inconsistentes con el nivel de desarrollo."),
          e(Crit,{crit:"C",c:c},"≥3 rabietas/semana en promedio."),
          e(Crit,{crit:"D",c:c},"Entre las rabietas, ánimo persistentemente irritable/enfadado la mayor parte del día, casi todos los días, observable por otros."),
          e(Crit,{crit:"E",c:c},"Criterios A–D presentes durante ≥12 meses, sin periodos libres >3 meses."),
          e(Crit,{crit:"F",c:c},"Presentes en ≥2 escenarios, severos en ≥1."),
          e(Crit,{crit:"G",c:c},"Diagnóstico no debe hacerse antes de los 6 años ni después de los 18 años."),
          e(Crit,{crit:"H",c:c},"Inicio antes de los 10 años (por historia o documentación)."),
          e(Crit,{crit:"I",c:c},"No ha habido un periodo diferenciado >1 día con criterios completos de episodio maníaco/hipomaníaco."),
          e(Crit,{crit:"J",c:c},"No ocurre exclusivamente durante TDM ni se explica por TEA, TEPT, ansiedad separación, distimia."),
          e(Crit,{crit:"K",c:c},"No atribuible a sustancia ni afección médica o neurológica.")
        ),
        tx:e("div",null,
          e(SxList,{c:c,items:[
            "Psicoterapia conductual (PMT, terapia dialéctico-conductual adaptada a niños)",
            "Estimulantes si hay TDAH comórbido (muy frecuente)",
            "ISRS si irritabilidad y ánimo depresivo marcados",
            "Antipsicóticos atípicos (risperidona, aripiprazol) en casos severos/refractarios",
            "Evitar sobrediagnóstico como bipolar — NO dar estabilizadores del ánimo rutinariamente"
          ]}),
          e(Note,{c:c,t:"Por qué se creó"},"Antes, muchos niños con irritabilidad crónica + rabietas recibían diagnóstico de bipolar pediátrico y litio/antipsicóticos de forma inapropiada. El TDDD los redirige a un manejo conductual/psicosocial + tratar comorbilidades.")
        )
      }
    }
  ];

  var s1=useState(null);var openGen=s1[0],setOpenGen=s1[1];
  var general=[
    {id:"conceptos",ic:"🧭",t:"Conceptos generales",sub:"Del capítulo depresivos",c:c,
     content:e("div",null,
       e(P,null,"El capítulo DSM-5 de 'Trastornos depresivos' separó los cuadros puramente depresivos del bipolar. Se centra en episodios de ánimo bajo sin antecedente maníaco. ",e("b",null,"El trastorno depresivo mayor (TDM)")," con su espectro de episodios es la entidad central."),
       e(H3,{c:c,mt:14},"Las 4 entidades principales"),
       e(Table,{
         headers:[{t:"Entidad",c:c},{t:"Duración / clave",c:c},{t:"Población",c:c}],
         rows:[
           ["TDM","Episodio ≥2 semanas + ≥5 síntomas","Cualquier edad"],
           ["Depresivo persistente (distimia)","≥2 años (≥1 en menores) + ≥2 síntomas","Cualquier edad"],
           ["TDPM","Semana premenstrual · ≥5 síntomas con ≥1 nuclear · ≥2 ciclos confirmados","Mujeres en edad fértil"],
           ["TDDD","Irritabilidad crónica + rabietas ≥3/sem × 12m · 6–18 años","Niños/adolescentes 6–18"]
         ]
       }),
       e(H3,{c:c,mt:14},"Especificadores transversales"),
       e(P,null,"Todos estos trastornos pueden especificarse con: ansiedad, características mixtas, melancólicas, atípicas, psicóticas, catatonia, inicio periparto, patrón estacional (algunos aplican solo a TDM).")
     )},
    {id:"ddx",ic:"🎯",t:"Diagnósticos diferenciales clave",sub:"Las trampas del capítulo",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Par",c:c},{t:"Clave para diferenciarlos",c:c}],
         rows:[
           ["TDM vs Bipolar","Si alguna vez hubo episodio maníaco/hipomaníaco → bipolar (aunque actualmente esté deprimido). Historia completa es fundamental"],
           ["TDM vs distimia","TDM: episodios discretos ≥2 sem. Distimia: curso crónico ≥2 años. Pueden coexistir ('depresión doble')"],
           ["TDM vs duelo normal","Duelo: ondas reactivas al pensar en la pérdida, autoestima conservada, pensamientos en el fallecido. TDM: ánimo persistente, inutilidad, suicidalidad no relacionada con la pérdida"],
           ["TDM vs depresión por sustancia/médica","Cronología: síntomas inician tras uso/enfermedad y mejoran al resolverse"],
           ["TDDD vs bipolar pediátrico","TDDD: irritabilidad CRÓNICA sin episodios maníacos discretos. Bipolar: episodios maníacos de ≥1 día con cambio claro respecto al basal"],
           ["TDPM vs SPM","SPM: síntomas premenstruales leves/moderados que no deterioran. TDPM: síntomas SEVEROS con deterioro + confirmación prospectiva en 2 ciclos"],
           ["TDM con mixtas vs bipolar","Mixtas: síntomas maníacos pocos/breves dentro del episodio depresivo. Bipolar I/II: episodio completo maníaco/hipomaníaco"]
         ]
       })
     )},
    {id:"tx",ic:"💊",t:"Tratamiento · resumen del tema",sub:"Farmacoterapia y algoritmo",c:c,
     content:e("div",null,
       e(H3,{c:c},"Algoritmo general de TDM"),
       e(Table,{
         headers:[{t:"Paso",c:c},{t:"Opción",c:c}],
         rows:[
           ["1","ISRS (sertralina, escitalopram, fluoxetina) · o IRSN · + psicoterapia (TCC o TIP)"],
           ["2 (no respuesta 4–6 sem)","Optimizar dosis"],
           ["3 (no respuesta)","Cambio a otro ISRS o IRSN · o atípico (mirtazapina, bupropión)"],
           ["4 (refractaria ≥2 fallos)","Aumentación: litio, T3, antipsicótico atípico (aripiprazol, quetiapina XR, brexpiprazol)"],
           ["5 (refractaria persistente)","IMAO · TEC · EMT · ketamina/esketamina"]
         ]
       }),
       e(H3,{c:c,mt:14},"Cuándo usar TEC"),
       e(SxList,{c:c,items:[
         "Riesgo suicida inminente que requiere respuesta rápida",
         "Depresión psicótica",
         "Depresión catatónica",
         "Embarazo (especialmente 1er trimestre)",
         "Refractaria a múltiples ensayos farmacológicos",
         "Desnutrición severa por rechazo alimentario"
       ]}),
       e(H3,{c:c,mt:14},"Consideraciones específicas"),
       e(Table,{
         headers:[{t:"Población/comorbilidad",c:c},{t:"Preferencia",c:c}],
         rows:[
           ["Embarazo/lactancia","Sertralina (mejor perfil) · evitar paroxetina (defectos cardiacos)"],
           ["Adulto mayor","Sertralina, escitalopram · evitar paroxetina (anticolinérgica), tricíclicos"],
           ["Dolor comórbido","Duloxetina, venlafaxina, amitriptilina"],
           ["Insomnio/pérdida de peso","Mirtazapina (sedante, aumenta apetito)"],
           ["Disfunción sexual por ISRS","Cambiar a bupropión o mirtazapina"],
           ["Fatiga","Bupropión"],
           ["TDAH comórbido","Bupropión · o ISRS + estimulante"],
           ["Riesgo suicida agudo","TEC o ketamina IV/esketamina intranasal"]
         ]
       }),
       e(Alert,{c:C.bad,label:"⚠️ Contraindicaciones/trampas"},
         e("ol",{style:{margin:0,paddingLeft:20,lineHeight:1.8,fontSize:13}},
           e("li",null,e("b",null,"Bupropión")," contraindicado en TCA con purgas o convulsiones (↓ umbral convulsivo)."),
           e("li",null,e("b",null,"IMAO + tiramina")," → crisis hipertensiva. Requiere dieta estricta."),
           e("li",null,e("b",null,"IMAO + ISRS")," (washout de 2–6 semanas) → síndrome serotoninérgico. Fluoxetina requiere 5 semanas."),
           e("li",null,e("b",null,"Paroxetina")," en embarazo → defectos cardíacos."),
           e("li",null,e("b",null,"Warning pediátrico/joven:")," aumento de ideación suicida en <25 años al iniciar ISRS · vigilancia estrecha.")
         )
       )
     )},
    {id:"perlas",ic:"📌",t:"Perlas de examen",sub:"Alto rendimiento",c:c,
     content:e("div",null,
       e(Pearl,{t:"SIGECAPS + ánimo o anhedonia"},"Para diagnóstico de TDM: ≥5 de 9 síntomas en ≥2 semanas, con AL MENOS uno siendo ánimo bajo o anhedonia. Sin uno de los dos, no hay episodio."),
       e(Pearl,{t:"Ex maniaco = bipolar, no TDM"},"Un solo episodio maníaco/hipomaníaco previo basta para reclasificar como bipolar, incluso si el episodio actual es depresivo. Siempre buscar antecedente."),
       e(Pearl,{t:"Tiempo de respuesta"},"ISRS: respuesta en 2–4 semanas, efecto completo en 6–8 semanas. No cambiar demasiado pronto."),
       e(Pearl,{t:"Duración del tratamiento"},"1er episodio: mínimo 6–9 meses tras remisión. ≥2 episodios o episodio grave/psicótico: 2 años o indefinido."),
       e(Pearl,{t:"TEC no es 'último recurso' en depresión psicótica"},"Es gold standard. También en suicidalidad aguda, catatonia, embarazo con depresión severa."),
       e(Pearl,{t:"Fluoxetina y washout para IMAO"},"Lavar 5 SEMANAS antes de iniciar IMAO por su vida media larga (no 2 semanas como los demás)."),
       e(Pearl,{t:"Bupropión contraindicaciones"},"Antecedente de convulsiones, TCA activo con purgas, TUS por alcohol con riesgo de abstinencia (↓ umbral convulsivo)."),
       e(Pearl,{t:"TDDD existe para no sobre-diagnosticar bipolar en niños"},"Irritabilidad CRÓNICA sin episodios discretos de manía = TDDD, no bipolar. Manejo es conductual, no con estabilizadores rutinariamente."),
       e(Pearl,{t:"TDPM requiere confirmación prospectiva"},"≥2 ciclos con registro diario antes de diagnosticar. Los síntomas deben ser severos (no solo SPM) y mínimos en semana posmenstrual."),
       e(Pearl,{t:"TDPM · régimen luteal"},"ISRS solo desde ovulación hasta menstruación (~14 días). Efecto casi inmediato al tratar el patrón cíclico."),
       e(Pearl,{t:"Atípica · parálisis plúmbea"},"Sensación de pesadez en brazos/piernas, reactividad del ánimo, hiperfagia, hipersomnia, sensibilidad al rechazo. IMAOs particularmente efectivos en este especificador."),
       e(Pearl,{t:"Melancolía · despertar precoz"},"Patrón clásico: anhedonia severa + peor en la mañana + despertar precoz + pérdida de peso + culpa excesiva. Buena respuesta a ADT y TEC.")
     )},
    {id:"resumen",ic:"📊",t:"Resumen comparativo",sub:"4 entidades en tabla",c:c,
     content:e("div",null,
       e(Table,{
         headers:[{t:"Entidad",c:c},{t:"Duración mínima",c:c},{t:"Tx 1ª línea",c:c}],
         rows:[
           ["TDM","≥2 semanas · ≥5 síntomas","ISRS + TCC/TIP"],
           ["Depresivo persistente","≥2 años adultos · ≥1 año menores · ≥2 síntomas","ISRS + TCC/TIP"],
           ["TDPM","Semana premenstrual · ≥2 ciclos confirmados","ISRS continuo o luteal · ACO combinado"],
           ["TDDD","≥12 meses · niños 6–18","Psicoterapia conductual + ISRS/estimulantes por comorbilidad"]
         ]
       })
     )},
    {id:"flash",ic:"🃏",t:"Flashcards",sub:"15 preguntas + las tuyas",c:c,
     content:e("div",null,
       e(P,null,"Tarjetas de repaso de trastornos depresivos puros. Añade las tuyas."),
       e(FlashDeck,{c:c,deckId:"depresivos",items:getAllCards("depresivos")})
     )},
    {id:"quiz",ic:"❓",t:"Quiz · 6 casos clínicos",sub:"Prueba tus conocimientos",c:c,
     content:e(Quiz,{c:c,items:getAllQuiz("depresivos")})}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Tema 9 · Neurosis · DSM-5-TR",title:"Trastornos depresivos puros"},
      "Capítulo del DSM-5 separado del bipolar. Incluye entidades con episodios de ánimo bajo SIN antecedente maníaco/hipomaníaco. El ",e("b",null,"trastorno depresivo mayor (TDM)")," es el más común, pero el capítulo incluye también distimia, TDPM y TDDD. Son ",e("b",null,"4 entidades principales"),"."
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.3),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Conceptos · DDx · Tratamiento · Perlas · Flashcards · Quiz")
    ),
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginTop:10}},
      general.map(function(g,i){
        return e("button",{key:g.id,onClick:function(){setOpenGen(i);},style:{padding:"14px 12px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:10,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:4,minHeight:90}},
          e("div",{style:{fontSize:22,marginBottom:4}},g.ic),
          e("div",{style:{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Playfair Display"}},g.t),
          e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.4,marginTop:2}},g.sub)
        );
      })
    ),
    openGen!==null?e(DzModal,{c:general[openGen].c,name:general[openGen].t,kicker:"Sección del tema",single:general[openGen].content,onClose:function(){setOpenGen(null);}}):null,

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.15)+","+ax(c,.04)+" 90%)",border:"1px solid "+ax(c,.35),borderRadius:14,margin:"18px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Las 4 entidades"),
      e("div",{style:{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Toca cualquier entidad para abrir su ficha")
    ),
    e(DzGrid,{c:c,items:diseases}),

    e(Abbrev,{c:c,items:[
      {a:"TDM",d:"Trastorno Depresivo Mayor"},
      {a:"TDPM",d:"Trastorno Disfórico Premenstrual"},
      {a:"TDDD",d:"Trastorno de Desregulación Disruptiva del Ánimo"},
      {a:"SPM",d:"Síndrome Premenstrual"},
      {a:"ISRS",d:"Inhibidores Selectivos de la Recaptación de Serotonina"},
      {a:"IRSN",d:"Inhibidores de Recaptación de Serotonina y Noradrenalina"},
      {a:"IMAO",d:"Inhibidores de la Monoaminooxidasa"},
      {a:"ADT",d:"Antidepresivos Tricíclicos"},
      {a:"TEC",d:"Terapia Electroconvulsiva"},
      {a:"EMT",d:"Estimulación Magnética Transcraneal"},
      {a:"TIP",d:"Terapia Interpersonal"},
      {a:"PMT",d:"Parent Management Training"},
      {a:"ACO",d:"Anticonceptivo Oral Combinado"}
    ]})
  );
}



// ══════════════════════════════════════════════════════════════
// TEMA 0 · PSIQUIATRÍA (introducción común)
// ══════════════════════════════════════════════════════════════



// ══════════════════════════════════════════════════════════════
// RETROALIMENTACIÓN · flashcards y quiz adicionales por deck
// Mezcla conceptos + casos clínicos · confusiones típicas de examen
// ══════════════════════════════════════════════════════════════

var EXTRA_CARDS={
  // ═════ PSICOSIS ═════
  psicosis:[
    {q:"¿Cuál es la duración EXACTA para diferenciar trastorno psicótico breve, esquizofreniforme y esquizofrenia?",r:"Psicótico breve: ≥1 día pero <1 mes · Esquizofreniforme: ≥1 mes pero <6 meses · Esquizofrenia: ≥6 meses. La única diferencia es el tiempo."},
    {q:"¿Qué regla define esquizoafectivo vs esquizofrenia con síntomas afectivos?",r:"En esquizoafectivo debe haber ≥2 semanas de delirios o alucinaciones SIN síntomas afectivos mayores durante el curso de la enfermedad. Si siempre coexisten, es un trastorno del ánimo con síntomas psicóticos, no esquizoafectivo."},
    {q:"¿Cuáles son las 4 vías dopaminérgicas y qué pasa si cada una falla?",r:"Mesolímbica: hiperactiva → síntomas positivos. Mesocortical: hipoactiva → síntomas negativos/cognitivos. Nigroestriada: bloqueada → extrapiramidalismo. Tuberoinfundibular: bloqueada → hiperprolactinemia."},
    {q:"Paciente con esquizofrenia presenta rigidez muscular severa, hiperpirexia, diaforesis y CPK elevada tras iniciar haloperidol. ¿Dx y manejo?",r:"Síndrome neuroléptico maligno (SNM). Urgencia. Suspender el antipsicótico, enfriamiento, hidratación, dantroleno o bromocriptina. Mortalidad hasta 10% si no se trata."},
    {q:"¿Cuál es la única indicación DEFINITIVA de clozapina?",r:"Esquizofrenia resistente (falla a ≥2 antipsicóticos) y riesgo suicida alto. Requiere monitoreo hematológico por riesgo de agranulocitosis."},
    {q:"¿Qué diferencia el delirio 'bizarro' del no bizarro y por qué importa?",r:"Delirio bizarro: contenido imposible físicamente (ej: 'me implantaron un chip que lee mis pensamientos'). No bizarro: posible aunque falso (ej: 'mi esposa me es infiel'). Delirante no bizarro → favorece trastorno delirante; bizarro → favorece esquizofrenia."},
    {q:"Mujer de 45 años convencida de que su vecino está enamorado de ella, sin evidencia, hace 4 meses. Funciona bien en el trabajo, sin alucinaciones. ¿Dx?",r:"Trastorno delirante tipo erotomaníaco. Criterios: delirios ≥1 mes, personalidad preservada, funciona bien. No cumple esquizofrenia (no hay deterioro ni síntomas negativos)."},
    {q:"¿En qué paciente con bipolar hay que tener MÁS cuidado con antidepresivos?",r:"Bipolar I sin cobertura estabilizadora → riesgo de viraje maníaco. En bipolar II también, pero el riesgo es menor. NUNCA antidepresivo solo en bipolaridad — siempre con estabilizador del ánimo."},
    {q:"¿Cuánto tiempo tarda el litio en mostrar efecto en manía aguda y qué nivel terapéutico se busca?",r:"Inicio de efecto: 6-8 semanas para respuesta sostenida. Nivel terapéutico: 0.6-1.2 mEq/L. Por encima de 1.5 hay riesgo de toxicidad. Monitoreo por función renal y tiroidea."},
    {q:"¿Cuál es la diferencia entre manía e hipomanía en duración y severidad?",r:"Manía: ≥1 semana + deterioro marcado o psicosis o hospitalización. Hipomanía: ≥4 días + cambio observable pero SIN deterioro marcado ni psicosis. Si hay psicosis, POR DEFINICIÓN es manía."}
  ],

  // ═════ ANSIEDAD ═════
  anxiety:[
    {q:"¿Cuál es la duración mínima para diagnosticar TAG?",r:"≥6 meses de preocupación excesiva sobre múltiples áreas, difícil de controlar, con ≥3 síntomas físicos (en niños basta 1)."},
    {q:"Varón de 28 años con episodios recurrentes de palpitaciones, disnea, miedo a morir, que duran 10 min. ¿Dx y manejo agudo vs mantenimiento?",r:"Trastorno de pánico. Agudo: BZD de vida corta (alprazolam) y técnicas de respiración. Mantenimiento: ISRS (sertralina, paroxetina) + TCC — NUNCA BZD como mantenimiento."},
    {q:"¿Qué diferencia la agorafobia del trastorno de pánico?",r:"Pánico: ataques recurrentes inesperados. Agorafobia: miedo a ≥2 situaciones (transporte, espacios abiertos/cerrados, multitud, fuera de casa solo) por temor a no poder escapar o recibir ayuda. Pueden coexistir."},
    {q:"¿Por qué no se usan BZD como tratamiento de mantenimiento en ansiedad?",r:"Riesgo de dependencia, tolerancia, deterioro cognitivo, síndrome de abstinencia. Solo para crisis agudas o como puente (≤4 semanas) mientras el ISRS hace efecto."},
    {q:"Niño de 6 años que se niega a ir a la escuela por miedo de que le pase algo a su mamá. Ansiedad marcada al separarse. ¿Dx?",r:"Trastorno de ansiedad por separación. ≥4 semanas en niños, ≥6 meses en adultos. Dx diferencial con fobia escolar (miedo a la escuela en sí) y mutismo selectivo."},
    {q:"¿Cuál es la dosis efectiva de sertralina en ansiedad vs depresión?",r:"Ambas: 50-200 mg/día. En ansiedad se empieza con dosis más bajas (25 mg) por sensibilidad inicial a efectos de activación. Subir gradualmente."}
  ],

  // ═════ TOC ═════
  toc:[
    {q:"¿Por qué se necesitan dosis más ALTAS de ISRS en TOC que en depresión?",r:"TOC requiere dosis máximas o cercanas al máximo (ej. fluoxetina 60-80 mg, sertralina 200 mg, fluvoxamina 300 mg) y al menos 10-12 semanas para ver respuesta completa. Depresión: dosis menores y respuesta en 4-6 semanas."},
    {q:"¿Qué es PANDAS y cuándo se sospecha?",r:"Pediatric Autoimmune Neuropsychiatric Disorders Associated with Streptococcal infections. Aparición súbita o exacerbación abrupta de TOC/tics en niño tras infección por estreptococo. Serología positiva confirma."},
    {q:"¿Qué es la 'exposición con prevención de respuesta' (EPR) y para qué trastorno es 1ª línea?",r:"EPR: exposición gradual al estímulo ansiógeno sin permitir la compulsión. Es la 1ª línea psicoterapéutica para TOC. También útil en TDC (trastorno dismórfico corporal)."},
    {q:"Mujer 35 años se arranca el pelo de la cabeza y cejas hace 2 años, experimenta alivio. ¿Dx y tx?",r:"Tricotilomanía. Tx: habit reversal training (1ª línea) + N-acetilcisteína + ISRS si comorbilidad. Derivado del capítulo TOC y trastornos relacionados."},
    {q:"¿Cuál es la diferencia entre TOC y TOCP (personalidad)?",r:"TOC: obsesiones y compulsiones EGO-DISTÓNICAS (el paciente sabe que son absurdas). TOCP: rasgo de personalidad EGO-SINTÓNICO (cree que su perfeccionismo es correcto). Dos entidades distintas en capítulos diferentes."}
  ],

  // ═════ TRAUMA ═════
  trauma:[
    {q:"¿Cuál es el criterio A del TEPT y por qué es tan específico?",r:"Exposición a muerte real o amenaza, lesión grave o violencia sexual, ya sea directa, presenciada, conocida por familiar cercano, o exposición profesional repetida (policía, rescatistas). Otros estresores vitales NO cumplen criterio A — van a trastorno adaptativo."},
    {q:"¿Qué diferencia TEA del TEPT en duración?",r:"TEA (Trastorno de Estrés Agudo): 3 días - 1 mes tras trauma. TEPT: ≥1 mes. Si persiste más de 1 mes, pasa a TEPT. Ambos requieren criterio A de exposición a trauma severo."},
    {q:"¿En qué paciente con TEPT tiene especial utilidad la prazosina?",r:"En TEPT con pesadillas y alteración del sueño. Antagonista α1-adrenérgico. Dosis 1-15 mg nocturnos. También útil en HTA y HBP (mismo mecanismo)."},
    {q:"Mujer 70 años con pérdida de su hija hace 18 meses, persiste con anhelo intenso y pensamientos intrusivos diarios sobre ella, con deterioro funcional. ¿Dx?",r:"Trastorno de duelo prolongado (DSM-5-TR añadido en 2022). Criterios: ≥12 meses adultos (6 meses niños) con anhelo intenso y ≥3 síntomas adicionales (shock, ira, evitación, etc.) + deterioro."},
    {q:"¿Qué psicoterapias tienen mejor evidencia en TEPT?",r:"TCC centrada en trauma, EMDR (desensibilización y reprocesamiento por movimientos oculares), terapia de exposición prolongada. Todas superiores a medicación sola."}
  ],

  // ═════ SOMÁTICOS ═════
  somaticos:[
    {q:"Diferencia clave: ¿cómo distinguir TSS de IAD?",r:"TSS: hay síntomas físicos REALES (dolor, fatiga, etc.) + preocupación/pensamientos/tiempo excesivos sobre ellos. IAD: preocupación por ENFERMEDAD con síntomas físicos AUSENTES o leves. En ambos: ≥6 meses."},
    {q:"En conversión, ¿qué signos indican que es funcional y no orgánico?",r:"Incompatibilidad con neuroanatomía: signo de Hoover (debilidad de pierna cede con maniobra contralateral), anestesia en guante/media (no sigue dermatomas), fuerza variable durante exploración. Pruebas complementarias normales."},
    {q:"¿Qué diferencia facticio de simulación?",r:"Facticio: motivación INTERNA (ser el enfermo). Simulación: motivación EXTERNA clara (beneficio económico, evadir cárcel/trabajo). Simulación no es trastorno mental, es código V."},
    {q:"¿Qué alteraciones neurológicas mimica la conversión más frecuentemente?",r:"Parálisis no anatómicas, crisis no epilépticas psicógenas (PNES), ceguera funcional, afonía, alteraciones sensitivas. Signos positivos (Hoover, distractibilidad de crisis) confirman."},
    {q:"¿Cuál es la diferencia clave entre amnesia disociativa y olvido normal o demencia?",r:"Disociativa: pérdida súbita de información autobiográfica importante, generalmente de un periodo específico traumático, con función cognitiva intacta. Demencia: pérdida gradual de múltiples dominios cognitivos."}
  ],

  // ═════ TCA ═════
  tca:[
    {q:"¿Cuáles son los dos subtipos de anorexia nerviosa?",r:"Restrictivo (pérdida de peso por dieta y ejercicio, sin atracones ni purgas en 3 meses) y con atracones/purgas (episodios recurrentes de atracón o conductas purgativas en 3 meses)."},
    {q:"¿Cuál es el riesgo médico AGUDO más importante en bulimia con purgas?",r:"Hipocalemia por pérdida de K⁺ en vómito → arritmias ventriculares. También alcalosis metabólica hipoclorémica (pérdida de HCl) y deshidratación."},
    {q:"Adolescente 15 años, IMC 14, amenorrea, bradicardia, restricción alimentaria severa con miedo intenso a engordar. ¿Tx 1ª línea?",r:"Terapia Familiar Basada en Maudsley (TFB-M) — 1ª línea en adolescentes con AN. Padres asumen responsabilidad de realimentación. No fármacos como 1ª línea (ISRS no eficaces en cuadro central)."},
    {q:"¿Cuál es el ÚNICO medicamento con aprobación FDA para bulimia y a qué dosis?",r:"Fluoxetina 60 mg/día (dosis mayor que en depresión). Reduce atracones y conductas compensatorias. Siempre junto con TCC."},
    {q:"Paciente con anorexia severa inicia realimentación agresiva → hipofosfatemia, edema, arritmias. ¿Qué es y cómo prevenir?",r:"Síndrome de realimentación. Prevención: iniciar con pocas calorías (5-10 kcal/kg/día), suplementar fosfato/potasio/magnesio/tiamina previo, monitoreo electrolitos diario x 7 días. Mortal si no se trata."}
  ],

  // ═════ SUEÑO ═════
  sueno:[
    {q:"¿Qué caracteriza los eventos del sueño REM vs NREM desde el punto de vista clínico?",r:"NREM (1ª mitad noche): terrores nocturnos, sonambulismo, sin recuerdo del evento. REM (2ª mitad noche): pesadillas con recuerdo vívido, TCSR (paciente actúa sus sueños)."},
    {q:"Varón 65 años patea y grita durante el sueño, su esposa lo denuncia. Recuerda pesadillas violentas. ¿Dx y riesgo a largo plazo?",r:"Trastorno de conducta del sueño REM (TCSR). Alto riesgo de enfermedad neurodegenerativa: 80% desarrollará Parkinson o DCL en 10-15 años. Tx: clonazepam o melatonina + seguimiento neurológico."},
    {q:"¿Cuál es el tratamiento 1ª línea del síndrome de piernas inquietas y por qué los agonistas dopaminérgicos ya no son la elección principal?",r:"1ª línea: corregir ferritina (<75 → hierro oral/IV) + gabapentinoides (gabapentina, pregabalina). Agonistas dopaminérgicos (pramipexol, ropinirol) causan 'aumentación' (empeoramiento paradójico), por eso están relegados."},
    {q:"¿Cuáles son los componentes de la tétrada clásica de narcolepsia?",r:"1) Somnolencia diurna excesiva, 2) cataplejía (pérdida súbita del tono con emoción), 3) alucinaciones hipnagógicas/hipnopómpicas, 4) parálisis del sueño. Deficiencia de orexina/hipocretina."},
    {q:"¿Por qué los BZD NO son de elección en insomnio crónico?",r:"Tolerancia, dependencia, deterioro cognitivo, caídas en adultos mayores, insomnio de rebote al suspender. 1ª línea: TCC para insomnio (TCC-I). Si fármaco, preferir antagonistas de orexina (suvorexant) o agonistas melatonina (ramelteón)."}
  ],

  // ═════ PERSONALIDAD ═════
  personalidad:[
    {q:"¿Cuál es el tratamiento 1ª línea para TLP y por qué se diseñó específicamente para este trastorno?",r:"Terapia Dialéctico-Conductual (DBT) de Marsha Linehan. Combina mindfulness + tolerancia al malestar + regulación emocional + efectividad interpersonal. Diseñada específicamente para TLP por la inestabilidad emocional intensa."},
    {q:"Paciente 28 años con patrón de relaciones intensas e inestables (idealización/devaluación), autolesiones, sensación crónica de vacío, miedo al abandono. ¿Dx?",r:"Trastorno límite de personalidad (TLP). Requiere ≥5 de 9 criterios, inicio en adultez temprana, patrón persistente y pervasivo. Alta comorbilidad con TEPT, TCA, sustancias."},
    {q:"¿Cómo diferenciar personalidad esquizoide de esquizotípica?",r:"Esquizoide: desapego social, frialdad emocional, prefiere estar solo, sin distorsiones cognitivas. Esquizotípica: además, EXCENTRICIDAD + ideas de referencia + pensamiento mágico + ansiedad social. Esquizotípica está en el espectro esquizofrénico."},
    {q:"¿Qué rasgos distinguen la personalidad antisocial de un criminal común?",r:"Antisocial requiere: ≥18 años, evidencia de trastorno de conducta antes de 15 años, patrón pervasivo de violación de derechos, SIN remordimiento, impulsividad, engaño. Un criminal que planea por beneficio económico no necesariamente tiene antisocial."},
    {q:"¿En qué cluster están los trastornos 'ansiosos o temerosos' y cuáles son?",r:"Cluster C: Evitativa (desea vínculo pero miedo rechazo), Dependiente (necesita que la cuiden), Obsesivo-compulsiva de personalidad (TOCP, perfeccionismo rígido)."}
  ],

  // ═════ IMPULSOS ═════
  impulsos:[
    {q:"¿Qué antecedente es OBLIGATORIO para diagnosticar trastorno antisocial de personalidad?",r:"Evidencia de trastorno de la conducta antes de los 15 años. Sin ese antecedente, aunque el paciente tenga conducta antisocial adulta, NO se diagnostica como personalidad antisocial."},
    {q:"¿Cuáles son las 4 categorías de síntomas del trastorno de la conducta?",r:"1) Agresión a personas/animales, 2) destrucción de propiedad, 3) engaño o robo, 4) violaciones graves de normas. Se requieren ≥3 síntomas en 12 meses, con ≥1 en los últimos 6."},
    {q:"Niño 7 años con rabietas explosivas, irritabilidad crónica, desafío a autoridad. ¿Cómo diferenciar negativista desafiante de TDDD?",r:"Negativista: desafío e ira. TDDD (Trastorno de Desregulación Disruptiva del Ánimo): rabietas severas ≥3/sem + irritabilidad crónica entre rabietas. TDDD se creó para NO sobrediagnosticar bipolar pediátrico."},
    {q:"¿Qué diferencia piromanía de un pirómano por otros motivos?",r:"Piromanía: incendios deliberados + fascinación por el fuego + alivio/placer al prenderlo, SIN motivación instrumental (dinero, venganza, ocultar otro delito). Si hay motivación externa, NO es piromanía."},
    {q:"Mujer 30 años con episodios de robo de objetos que NO necesita, alivio tras el acto, sin ganancia económica. ¿Dx y tx?",r:"Cleptomanía. Tx: ISRS + naltrexona + TCC. Impulso recurrente de robar objetos sin utilidad ni valor monetario, con sensación de tensión que se alivia al robar."}
  ],

  // ═════ DEPRESIVOS ═════
  depresivos:[
    {q:"¿Qué es la nemotecnia SIGECAPS y qué debe incluir obligatoriamente un episodio depresivo mayor?",r:"SIGECAPS: Sueño, Interés (anhedonia), Guilt (culpa), Energía, Concentración, Apetito, Psicomotor, Suicidio. ≥5 de 9 síntomas × ≥2 semanas, con al menos UNO siendo ánimo deprimido O anhedonia."},
    {q:"¿Cuánto tiempo debe mantenerse un antidepresivo tras el primer episodio depresivo mayor?",r:"6-9 meses tras la remisión completa para prevenir recaída. Si es ≥2 episodios o episodio severo/psicótico, considerar mantenimiento ≥2 años o indefinido."},
    {q:"Mujer 32 años con síntomas premenstruales severos de ira, ansiedad y depresión los 7 días antes de menstruar, que desaparecen tras el sangrado. ¿Dx y criterio clave?",r:"Trastorno Disfórico Premenstrual (TDPM). Criterio clave: confirmación prospectiva en ≥2 ciclos sintomáticos (no basta retrospectivo). Tx: ISRS (continuo o solo fase luteal), ACO combinado."},
    {q:"¿Cuándo está indicada la TEC (terapia electroconvulsiva) en depresión?",r:"Depresión psicótica, catatonia, refractaria a múltiples fármacos, riesgo suicida agudo, embarazo con depresión severa, rechazo alimentario. NO es 'último recurso' — en estas condiciones es 1ª línea por respuesta rápida."},
    {q:"¿Qué fármaco tiene efecto rápido (horas-días) en depresión refractaria y suicidalidad aguda?",r:"Ketamina IV o esketamina intranasal. Actúa sobre receptores NMDA. Efecto en horas, útil como puente mientras otros tratamientos hacen efecto. Alternativa a TEC cuando se requiere respuesta rápida."}
  ]
};

var EXTRA_QUIZ={
  psicosis:[
    {p:"Paciente 24 años con 3 semanas de delirios y alucinaciones tras consumo de metanfetamina. Sin antecedentes psiquiátricos. ¿Dx más probable?",
     o:["Esquizofrenia","Trastorno psicótico inducido por sustancias","Trastorno psicótico breve","Esquizofreniforme"],r:1,
     x:"Cronología clara con sustancia + duración breve + antecedente reciente = trastorno psicótico inducido por sustancias. No es esquizofrenia (requiere ≥6 meses) ni breve (requiere que NO sea por sustancia)."},
    {p:"Varón 35 años con ≥3 meses de delirio celotípico (cree que su esposa le es infiel sin evidencia). Conserva su empleo y trato social normal. ¿Dx?",
     o:["Esquizofrenia paranoide","Trastorno delirante tipo celotípico","TLP","Bipolar I con psicosis"],r:1,
     x:"Delirio ≥1 mes + personalidad preservada + funcionamiento conservado (excepto por el impacto directo del delirio) = trastorno delirante. El tipo celotípico es uno de los 5 subtipos."},
    {p:"Mujer 28 años con 4 meses de síntomas: episodios maníacos y depresivos, PERO durante 3 semanas del periodo total tuvo SOLO delirios sin síntomas afectivos. ¿Dx?",
     o:["Trastorno bipolar con psicosis","Esquizoafectivo","Esquizofrenia","Trastorno delirante"],r:1,
     x:"Criterio clave del esquizoafectivo: ≥2 semanas de psicosis SIN síntomas afectivos mayores durante el curso total. Si siempre coexisten psicosis + ánimo, es bipolar con síntomas psicóticos."}
  ],
  anxiety:[
    {p:"Varón 32 años con 8 meses de preocupación excesiva por múltiples áreas (trabajo, salud, familia), insomnio de conciliación, tensión muscular, fatiga. No cumple criterios de pánico. ¿Dx y 1ª línea?",
     o:["Trastorno de pánico · alprazolam","TAG · ISRS + TCC","Distimia · fluoxetina","Adaptación · psicoterapia"],r:1,
     x:"Preocupación excesiva ≥6 meses sobre múltiples áreas + ≥3 síntomas físicos = TAG. 1ª línea: ISRS (escitalopram, sertralina) o IRSN (venlafaxina) + TCC. BZD solo puente."},
    {p:"Niño 7 años que habla normalmente en casa pero NO habla en la escuela hace 6 meses, sin déficit de lenguaje. ¿Dx?",
     o:["Autismo","Mutismo selectivo","Fobia social","Ansiedad por separación"],r:1,
     x:"Mutismo selectivo: fallo persistente en hablar en situaciones específicas (escuela) pese a capacidad normal. ≥1 mes (excluye primer mes escolar). Alta comorbilidad con ansiedad."}
  ],
  toc:[
    {p:"Adolescente 14 años con aparición súbita de obsesiones de contaminación y compulsiones de lavado, 2 semanas tras faringitis estreptocócica. ¿Dx y manejo?",
     o:["TOC primario · ISRS dosis alta","PANDAS · ATB + ISRS","Hipocondría · TCC","Trastorno de adaptación"],r:1,
     x:"PANDAS: inicio súbito de TOC/tics tras infección estreptocócica en niño. Tx: ATB para erradicar estreptococo + ISRS si síntomas persisten. Serología confirma."},
    {p:"Mujer 40 años con acumulación compulsiva de objetos, hogar con espacios inhabitables. Dificultad para desechar por ansiedad. ¿Dx y 1ª línea?",
     o:["TOC por obsesiones de simetría","Trastorno de acumulación (Hoarding) · TCC","Demencia frontotemporal","Trastorno de personalidad esquizotípica"],r:1,
     x:"Trastorno de acumulación es dx propio en DSM-5 (antes subtipo de TOC). Tx: TCC específica (organización + desecho gradual + toma de decisiones). ISRS evidencia limitada."}
  ],
  trauma:[
    {p:"Mujer 30 años, asaltada hace 3 semanas. Flashbacks, evitación, insomnio, hipervigilancia. Cumple criterios diagnósticos. ¿Dx?",
     o:["TEPT · iniciar ISRS","Trastorno de estrés agudo (TEA)","Adaptativo con ansiedad","Fobia específica"],r:1,
     x:"3 semanas tras trauma (entre 3 días y 1 mes) = TEA. Si persiste más de 1 mes, pasa a TEPT. Tx: TCC centrada en trauma, puede prevenir progresión a TEPT."},
    {p:"Paciente con TEPT + pesadillas recurrentes. Ya toma ISRS y TCC. ¿Qué agregar específicamente para pesadillas?",
     o:["BZD nocturna","Prazosina","Quetiapina","Melatonina"],r:1,
     x:"Prazosina (α1-bloqueador) tiene mejor evidencia para pesadillas en TEPT. Dosis 1-15 mg nocturnos. BZD empeoran memoria del trauma; quetiapina no primera línea."}
  ],
  somaticos:[
    {p:"Varón 35 años con múltiples síntomas (dolor abdominal, cefalea, mareo) desde hace 2 años, sin causa orgánica, genera gran preocupación y búsqueda constante de atención médica. ¿Dx?",
     o:["IAD (ansiedad por enfermedad)","Trastorno de síntomas somáticos (TSS)","Facticio","Conversión"],r:1,
     x:"TSS: síntomas físicos REALES + preocupación/tiempo excesivos sobre ellos ≥6 meses. IAD sería si la preocupación fuera por tener 'una enfermedad' con síntomas físicos mínimos o ausentes."},
    {p:"Paciente con ceguera bilateral súbita tras conflicto interpersonal. Examen neurológico normal, potenciales evocados visuales normales. ¿Dx y manejo?",
     o:["Conversión · fisioterapia + TCC","Simulación · confrontar","Ceguera orgánica no identificada","Psicosis histérica"],r:1,
     x:"Conversión: síntoma neurológico incompatible con anatomía + pruebas normales. NO es simulación (no hay ganancia clara externa). Manejo: validación + fisioterapia + TCC."}
  ],
  tca:[
    {p:"Adolescente 16 años, IMC 14, amenorrea, bradicardia 45 lpm, hipotensión. Miedo intenso a engordar y distorsión corporal. ¿Dónde se atiende inicialmente?",
     o:["Ambulatorio con TCC","Hospitalización médica primero","Solo psicoterapia","Iniciar fluoxetina 60 mg"],r:1,
     x:"Criterios de hospitalización médica en AN: IMC <15, FC <50, hipotensión severa, alteración electrolítica, síncope. Primero estabilizar médicamente, luego tratamiento psicoterapéutico (Maudsley en adolescentes)."},
    {p:"Mujer 22 años, IMC 22, atracones 3 veces/semana con vómitos autoinducidos hace 8 meses. Signo de Russell positivo, erosión dental. ¿Dx y 1ª línea?",
     o:["AN subtipo purgativo","Bulimia nerviosa · fluoxetina 60 mg + TCC","Trastorno por atracón","ARFID"],r:1,
     x:"Peso normal + atracones + conductas compensatorias (vómito) + signos físicos de purga = bulimia. Fluoxetina 60 mg es el único ISRS aprobado por FDA. Bupropión CONTRAINDICADO (riesgo convulsivo)."}
  ],
  sueno:[
    {p:"Varón 45 años con somnolencia diurna excesiva, roncador, esposa reporta pausas respiratorias. IMC 35. Polisomnografía: IAH 28. ¿Dx y 1ª línea?",
     o:["Insomnio · zolpidem","Apnea obstructiva del sueño · CPAP","Narcolepsia · modafinilo","Hipersomnia idiopática"],r:1,
     x:"AOS moderada (IAH 15-30). 1ª línea: CPAP nocturno + pérdida de peso. Evitar alcohol y sedantes. Cirugía o dispositivos intraorales solo si falla CPAP."},
    {p:"Mujer 60 años, al dormirse siente disestesias en piernas que la obligan a moverlas, mejora con movimiento, peor de noche. Ferritina 28 ng/mL. ¿Dx y primer paso?",
     o:["Neuropatía periférica · gabapentina","SPI · suplementar hierro","Ansiedad nocturna","TCSR"],r:1,
     x:"SPI clásico + ferritina baja. Primer paso: corregir ferritina con hierro oral o IV (objetivo >75). Si persiste: gabapentinoides. Evitar agonistas dopaminérgicos por fenómeno de aumentación."}
  ],
  personalidad:[
    {p:"Mujer 25 años con múltiples relaciones intensas e inestables, autolesiones recurrentes, miedo intenso al abandono, sensación crónica de vacío. ¿Tx 1ª línea?",
     o:["ISRS como monoterapia","TCC estándar","Terapia Dialéctico-Conductual (DBT)","Litio"],r:2,
     x:"TLP: DBT de Marsha Linehan es 1ª línea. Fármacos solo sintomáticos: lamotrigina para labilidad afectiva, antipsicóticos bajos para ideación paranoide. BZD CONTRAINDICADAS (desinhibición + adicción)."},
    {p:"Varón 45 años, ingeniero, perfeccionista, rígido, devoto al trabajo, no delega, guarda todo. Cree que su forma de ser es correcta. ¿Dx?",
     o:["TOC","TOCP (personalidad)","Narcisista","Paranoide"],r:1,
     x:"TOCP: rasgo EGO-SINTÓNICO de perfeccionismo y rigidez. Sin obsesiones/compulsiones propias del TOC. El paciente NO ve problema en su forma de ser. Tx: psicoterapia (TCC); fármacos solo si comorbilidad."}
  ],
  impulsos:[
    {p:"Varón 25 años con múltiples arrestos, sin trabajo fijo, miente habitualmente, sin remordimiento. Antecedente de vandalismo, peleas y robos desde los 12 años. ¿Dx?",
     o:["TLP","Trastorno antisocial de personalidad","Trastorno explosivo intermitente","Trastorno de la conducta (aún)"],r:1,
     x:"≥18 años + trastorno de la conducta antes de los 15 años + patrón persistente = antisocial. Sin el antecedente de conducta, aunque tenga conducta adulta, NO se diagnostica antisocial."},
    {p:"Niño 8 años con rabietas explosivas severas 4 veces/semana, irritable entre rabietas, en casa y escuela, 14 meses de evolución. Sin episodios maníacos discretos. ¿Dx?",
     o:["Bipolar pediátrico","TDDD (Desregulación Disruptiva del Ánimo)","Negativista desafiante","TDAH"],r:1,
     x:"TDDD: irritabilidad crónica + rabietas severas ≥3/sem × ≥12m + edad 6-18 (inicio antes de 10). Se creó para evitar sobrediagnosticar bipolar pediátrico en niños con irritabilidad crónica."}
  ],
  depresivos:[
    {p:"Mujer 35 años con 3 semanas de ánimo deprimido, anhedonia, insomnio, fatiga, culpa excesiva, pensamientos de muerte. Deterioro funcional. ¿Dx y 1ª línea?",
     o:["Distimia · sertralina","TDM · ISRS + TCC","Adaptativo · psicoterapia","Bipolar II"],r:1,
     x:"≥5 síntomas (ánimo bajo + anhedonia + 4 más) × ≥2 semanas + deterioro = TDM. 1ª línea: ISRS + TCC. Respuesta en 4-6 semanas. Mantener 6-9 meses tras remisión."},
    {p:"Paciente con TDM refractario a 3 ensayos de antidepresivos diferentes. Riesgo suicida agudo. ¿Opción con efecto MÁS RÁPIDO?",
     o:["Agregar litio","Ketamina IV o esketamina intranasal","Cambiar a otro ISRS","EMT ambulatoria"],r:1,
     x:"Ketamina/esketamina tienen efecto en horas-días. Ideal en depresión refractaria con riesgo suicida agudo. TEC también rápida pero requiere anestesia. EMT tarda semanas."}
  ]
};

// Función que combina cards oficiales + extras
function getAllCards(deckKey){
  var base=(DECKS[deckKey]&&DECKS[deckKey].flash)?DECKS[deckKey].flash:[];
  var extra=EXTRA_CARDS[deckKey]||[];
  return base.concat(extra);
}
function getAllQuiz(deckKey){
  var base=(DECKS[deckKey]&&DECKS[deckKey].quiz)?DECKS[deckKey].quiz:[];
  var extra=EXTRA_QUIZ[deckKey]||[];
  return base.concat(extra);
}


// ══════════════════════════════════════════════════════════════
// BUSCADOR GLOBAL · índice de enfermedades/temas
// ══════════════════════════════════════════════════════════════

// Índice de búsqueda — enfermedades, temas y conceptos clave
var SEARCH_INDEX=[
  // Psicosis
  {q:"psicótico breve trastorno",label:"Trastorno psicótico breve",bloc:"Psicosis",route:"psicosis",icon:"🔺",color:"#ef4444"},
  {q:"esquizofreniforme",label:"Trastorno esquizofreniforme",bloc:"Psicosis",route:"psicosis",icon:"🔺",color:"#a855f7"},
  {q:"esquizofrenia",label:"Esquizofrenia",bloc:"Psicosis",route:"psicosis",icon:"🧠",color:"#a855f7"},
  {q:"esquizoafectivo",label:"Trastorno esquizoafectivo",bloc:"Psicosis",route:"psicosis",icon:"🔺",color:"#a855f7"},
  {q:"delirante paranoide",label:"Trastorno delirante",bloc:"Psicosis",route:"psicosis",icon:"🎭",color:"#f87171"},
  {q:"bipolar tipo 1 manía",label:"Trastorno bipolar I",bloc:"Psicosis",route:"psicosis",icon:"⚡",color:"#fbbf24"},
  {q:"bipolar tipo 2 hipomanía",label:"Trastorno bipolar II",bloc:"Psicosis",route:"psicosis",icon:"⚡",color:"#fbbf24"},
  {q:"ciclotímico ciclotimia",label:"Trastorno ciclotímico",bloc:"Psicosis",route:"psicosis",icon:"🌊",color:"#fbbf24"},
  {q:"depresión mayor episodio",label:"Episodio depresivo mayor (en Bipolar)",bloc:"Psicosis",route:"psicosis",icon:"💧",color:"#38bdf8"},
  {q:"clozapina olanzapina risperidona antipsicótico",label:"Antipsicóticos atípicos",bloc:"Psicosis",route:"psicosis",icon:"💊",color:"#ef4444"},
  {q:"haloperidol clorpromazina neuroléptico típico",label:"Antipsicóticos típicos",bloc:"Psicosis",route:"psicosis",icon:"💊",color:"#ef4444"},
  {q:"litio estabilizador",label:"Litio (estabilizador)",bloc:"Psicosis",route:"psicosis",icon:"💊",color:"#fbbf24"},
  {q:"dopamina vías mesolímbica nigroestriada",label:"4 vías dopaminérgicas",bloc:"Psicosis",route:"psicosis",icon:"🧠",color:"#ef4444"},

  // Intro
  {q:"psiquiatría oms salud mental definición",label:"Definiciones OMS",bloc:"Psiquiatría",route:"intro",icon:"🏥",color:"#94a3b8"},
  {q:"psicosis vs neurosis diferencia",label:"Psicosis vs Neurosis",bloc:"Psiquiatría",route:"intro",icon:"⚖️",color:"#94a3b8"},
  {q:"historia psiquiatría clorpromazina",label:"Historia de la psiquiatría",bloc:"Psiquiatría",route:"intro",icon:"📜",color:"#94a3b8"},
  {q:"causas biopsicosocial",label:"Causas de trastornos mentales",bloc:"Psiquiatría",route:"intro",icon:"🔬",color:"#94a3b8"},
  {q:"tratamiento pilares psicoterapia",label:"3 pilares del tratamiento",bloc:"Psiquiatría",route:"intro",icon:"💊",color:"#94a3b8"},

  // Neurosis · Ansiedad
  {q:"ansiedad pánico ataque",label:"Trastorno de pánico",bloc:"Ansiedad",route:"anx",icon:"🫀",color:"#60a5fa"},
  {q:"agorafobia",label:"Agorafobia",bloc:"Ansiedad",route:"anx",icon:"🫀",color:"#60a5fa"},
  {q:"TAG ansiedad generalizada",label:"Trastorno de ansiedad generalizada",bloc:"Ansiedad",route:"anx",icon:"🫀",color:"#60a5fa"},
  {q:"fobia específica",label:"Fobia específica",bloc:"Ansiedad",route:"anx",icon:"🫀",color:"#60a5fa"},
  {q:"fobia social ansiedad social",label:"Ansiedad social",bloc:"Ansiedad",route:"anx",icon:"🫀",color:"#60a5fa"},
  {q:"mutismo selectivo",label:"Mutismo selectivo",bloc:"Ansiedad",route:"anx",icon:"🫀",color:"#60a5fa"},

  // TOC
  {q:"TOC obsesivo compulsivo obsesión",label:"TOC (Trastorno obsesivo-compulsivo)",bloc:"TOC",route:"toc",icon:"🔁",color:"#a78bfa"},
  {q:"TDC dismórfico corporal",label:"Trastorno dismórfico corporal",bloc:"TOC",route:"toc",icon:"🔁",color:"#a78bfa"},
  {q:"hoarding acumulación",label:"Trastorno de acumulación",bloc:"TOC",route:"toc",icon:"🔁",color:"#a78bfa"},
  {q:"tricotilomanía pelo",label:"Tricotilomanía",bloc:"TOC",route:"toc",icon:"🔁",color:"#a78bfa"},
  {q:"excoriación piel",label:"Excoriación",bloc:"TOC",route:"toc",icon:"🔁",color:"#a78bfa"},
  {q:"PANDAS streptococo",label:"PANDAS",bloc:"TOC",route:"toc",icon:"🦠",color:"#a78bfa"},

  // Trauma
  {q:"TEPT estrés postraumático trauma",label:"Trastorno de estrés postraumático (TEPT)",bloc:"Trauma",route:"trm",icon:"⚡",color:"#fb923c"},
  {q:"TEA estrés agudo",label:"Trastorno de estrés agudo (TEA)",bloc:"Trauma",route:"trm",icon:"⚡",color:"#fb923c"},
  {q:"adaptación trastorno",label:"Trastorno adaptativo",bloc:"Trauma",route:"trm",icon:"⚡",color:"#fb923c"},
  {q:"duelo prolongado complicado",label:"Duelo prolongado",bloc:"Trauma",route:"trm",icon:"⚡",color:"#fb923c"},
  {q:"prazosina pesadillas",label:"Prazosina (pesadillas TEPT)",bloc:"Trauma",route:"trm",icon:"💊",color:"#fb923c"},
  {q:"EMDR desensibilización",label:"EMDR",bloc:"Trauma",route:"trm",icon:"⚡",color:"#fb923c"},

  // Somáticos
  {q:"TSS síntomas somáticos",label:"Trastorno de síntomas somáticos",bloc:"Somáticos",route:"som",icon:"🧬",color:"#34d399"},
  {q:"IAD hipocondría enfermedad ansiedad",label:"IAD (ansiedad por enfermedad)",bloc:"Somáticos",route:"som",icon:"🧬",color:"#34d399"},
  {q:"conversión funcional neurológico",label:"Trastorno de conversión",bloc:"Somáticos",route:"som",icon:"🧬",color:"#34d399"},
  {q:"Hoover signo parálisis",label:"Signo de Hoover",bloc:"Somáticos",route:"som",icon:"🧬",color:"#34d399"},
  {q:"facticio Munchausen",label:"Trastorno facticio",bloc:"Somáticos",route:"som",icon:"🧬",color:"#34d399"},
  {q:"TID identidad disociativo múltiple personalidad",label:"Trastorno de identidad disociativo",bloc:"Disociativos",route:"som",icon:"🧬",color:"#f472b6"},
  {q:"amnesia disociativa fuga",label:"Amnesia disociativa",bloc:"Disociativos",route:"som",icon:"🧬",color:"#f472b6"},
  {q:"despersonalización desrealización",label:"Despersonalización / desrealización",bloc:"Disociativos",route:"som",icon:"🧬",color:"#f472b6"},

  // TCA
  {q:"anorexia nerviosa AN IMC",label:"Anorexia nerviosa",bloc:"TCA",route:"tca",icon:"🍽️",color:"#ec4899"},
  {q:"bulimia atracón purga vómito",label:"Bulimia nerviosa",bloc:"TCA",route:"tca",icon:"🍽️",color:"#ec4899"},
  {q:"trastorno atracón binge",label:"Trastorno por atracón",bloc:"TCA",route:"tca",icon:"🍽️",color:"#ec4899"},
  {q:"ARFID evitación restricción",label:"ARFID",bloc:"TCA",route:"tca",icon:"🍽️",color:"#ec4899"},
  {q:"pica pagofagia hielo ferritina",label:"Pica",bloc:"TCA",route:"tca",icon:"🍽️",color:"#ec4899"},
  {q:"rumiación regurgitación",label:"Trastorno de rumiación",bloc:"TCA",route:"tca",icon:"🍽️",color:"#ec4899"},
  {q:"Russell signo nudillos vómito",label:"Signo de Russell",bloc:"TCA",route:"tca",icon:"🍽️",color:"#ec4899"},
  {q:"fluoxetina bulimia",label:"Fluoxetina en bulimia",bloc:"TCA",route:"tca",icon:"💊",color:"#ec4899"},
  {q:"Maudsley terapia familiar",label:"Terapia Maudsley (AN adolescentes)",bloc:"TCA",route:"tca",icon:"💊",color:"#ec4899"},

  // Sueño
  {q:"insomnio dificultad dormir",label:"Trastorno de insomnio",bloc:"Sueño",route:"sue",icon:"🌙",color:"#22d3ee"},
  {q:"hipersomnia somnolencia diurna",label:"Hipersomnia",bloc:"Sueño",route:"sue",icon:"🌙",color:"#22d3ee"},
  {q:"narcolepsia cataplejía orexina",label:"Narcolepsia",bloc:"Sueño",route:"sue",icon:"🌙",color:"#22d3ee"},
  {q:"apnea obstructiva AOS CPAP",label:"Apnea obstructiva del sueño",bloc:"Sueño",route:"sue",icon:"🌙",color:"#22d3ee"},
  {q:"SPI piernas inquietas Willis Ekbom",label:"Síndrome de piernas inquietas",bloc:"Sueño",route:"sue",icon:"🌙",color:"#22d3ee"},
  {q:"sonambulismo terror nocturno NREM",label:"Sonambulismo / terror nocturno",bloc:"Sueño",route:"sue",icon:"🌙",color:"#22d3ee"},
  {q:"pesadillas REM",label:"Trastorno de pesadillas",bloc:"Sueño",route:"sue",icon:"🌙",color:"#22d3ee"},
  {q:"TCSR REM conducta actúa sueños",label:"TCSR (conducta del sueño REM)",bloc:"Sueño",route:"sue",icon:"🌙",color:"#22d3ee"},
  {q:"ritmo circadiano melatonina",label:"Ritmo circadiano",bloc:"Sueño",route:"sue",icon:"🌙",color:"#22d3ee"},

  // Personalidad
  {q:"paranoide personalidad desconfianza",label:"Paranoide (Cluster A)",bloc:"Personalidad",route:"per",icon:"🎭",color:"#facc15"},
  {q:"esquizoide solo aislado",label:"Esquizoide (Cluster A)",bloc:"Personalidad",route:"per",icon:"🎭",color:"#facc15"},
  {q:"esquizotípica excéntrico",label:"Esquizotípica (Cluster A)",bloc:"Personalidad",route:"per",icon:"🎭",color:"#facc15"},
  {q:"antisocial psicópata",label:"Antisocial (Cluster B)",bloc:"Personalidad",route:"per",icon:"🎭",color:"#facc15"},
  {q:"TLP límite borderline escisión autolesión",label:"TLP (Cluster B)",bloc:"Personalidad",route:"per",icon:"🎭",color:"#facc15"},
  {q:"histriónica atención",label:"Histriónica (Cluster B)",bloc:"Personalidad",route:"per",icon:"🎭",color:"#facc15"},
  {q:"narcisista grandiosidad",label:"Narcisista (Cluster B)",bloc:"Personalidad",route:"per",icon:"🎭",color:"#facc15"},
  {q:"evitativa fobia social tímida",label:"Evitativa (Cluster C)",bloc:"Personalidad",route:"per",icon:"🎭",color:"#facc15"},
  {q:"dependiente sumisa",label:"Dependiente (Cluster C)",bloc:"Personalidad",route:"per",icon:"🎭",color:"#facc15"},
  {q:"TOCP obsesivo compulsiva perfeccionista",label:"TOCP (Cluster C)",bloc:"Personalidad",route:"per",icon:"🎭",color:"#facc15"},
  {q:"DBT Linehan dialéctica",label:"DBT (1ª línea TLP)",bloc:"Personalidad",route:"per",icon:"💊",color:"#facc15"},

  // Impulsos
  {q:"negativista desafiante niño",label:"Trastorno negativista desafiante",bloc:"Impulsos",route:"imp",icon:"🎯",color:"#f97316"},
  {q:"TEI explosivo intermitente ira",label:"Trastorno explosivo intermitente",bloc:"Impulsos",route:"imp",icon:"🎯",color:"#f97316"},
  {q:"conducta trastorno CC violación normas",label:"Trastorno de la conducta",bloc:"Impulsos",route:"imp",icon:"🎯",color:"#f97316"},
  {q:"piromanía fuego incendio",label:"Piromanía",bloc:"Impulsos",route:"imp",icon:"🎯",color:"#f97316"},
  {q:"cleptomanía robo impulso",label:"Cleptomanía",bloc:"Impulsos",route:"imp",icon:"🎯",color:"#f97316"},

  // Depresivos
  {q:"TDM depresión mayor SIGECAPS",label:"Trastorno depresivo mayor (TDM)",bloc:"Depresivos",route:"dpr",icon:"💧",color:"#818cf8"},
  {q:"distimia persistente crónica",label:"Depresivo persistente (distimia)",bloc:"Depresivos",route:"dpr",icon:"💧",color:"#818cf8"},
  {q:"TDPM premenstrual disfórico",label:"TDPM (disfórico premenstrual)",bloc:"Depresivos",route:"dpr",icon:"💧",color:"#818cf8"},
  {q:"TDDD desregulación disruptiva niño",label:"TDDD (niños)",bloc:"Depresivos",route:"dpr",icon:"💧",color:"#818cf8"},
  {q:"ISRS sertralina fluoxetina escitalopram",label:"ISRS (1ª línea depresión)",bloc:"Depresivos",route:"dpr",icon:"💊",color:"#818cf8"},
  {q:"TEC electroconvulsiva refractaria",label:"TEC (terapia electroconvulsiva)",bloc:"Depresivos",route:"dpr",icon:"💊",color:"#818cf8"},
  {q:"ketamina refractaria suicidalidad",label:"Ketamina / esketamina",bloc:"Depresivos",route:"dpr",icon:"💊",color:"#818cf8"}
];

function GlobalSearch(p){
  var s1=useState("");var query=s1[0],setQuery=s1[1];
  var s2=useState(false);var focused=s2[0],setFocused=s2[1];

  var qLow=query.trim().toLowerCase();
  var results=qLow.length<2?[]:SEARCH_INDEX.filter(function(it){
    return it.q.toLowerCase().indexOf(qLow)>=0 || it.label.toLowerCase().indexOf(qLow)>=0 || it.bloc.toLowerCase().indexOf(qLow)>=0;
  }).slice(0,12);

  function handleClick(route){
    setQuery("");
    setFocused(false);
    if(p.go)p.go(route);
  }

  return e("div",{style:{position:"relative",marginBottom:18}},
    e("div",{style:{position:"relative"}},
      e("div",{style:{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16,pointerEvents:"none",opacity:.6}},"🔍"),
      e("input",{
        type:"text",value:query,
        onChange:function(ev){setQuery(ev.target.value);},
        onFocus:function(){setFocused(true);},
        onBlur:function(){setTimeout(function(){setFocused(false);},200);},
        placeholder:"Buscar enfermedad, fármaco, concepto...",
        style:{width:"100%",padding:"12px 14px 12px 40px",background:C.cd,border:"1px solid "+(focused?ax(C.anx,.5):C.bd),borderRadius:12,color:C.tx,fontSize:13.5,fontFamily:"inherit",boxSizing:"border-box",transition:"border-color .15s ease"}
      }),
      query?e("button",{
        onClick:function(){setQuery("");},
        style:{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",padding:"4px 8px",background:"transparent",color:C.mt,fontSize:14,borderRadius:6,cursor:"pointer"}
      },"✕"):null
    ),
    (focused && results.length>0)?e("div",{style:{position:"absolute",top:"100%",left:0,right:0,marginTop:6,background:C.cd,border:"1px solid "+C.bd,borderRadius:12,maxHeight:380,overflowY:"auto",zIndex:90,boxShadow:"0 10px 30px rgba(0,0,0,.4)",animation:"fadeIn .15s"}},
      results.map(function(r,i){
        return e("button",{
          key:i,
          onMouseDown:function(ev){ev.preventDefault();handleClick(r.route);},
          style:{width:"100%",padding:"10px 14px",background:"transparent",border:"none",borderBottom:i<results.length-1?"1px solid "+C.bd:"none",color:C.tx,textAlign:"left",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"background .1s ease"}
        },
          e("span",{style:{fontSize:18,flexShrink:0}},r.icon),
          e("div",{style:{flex:1,minWidth:0}},
            e("div",{style:{fontSize:13,fontWeight:700,color:"#fff",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},r.label),
            e("div",{style:{fontSize:10.5,color:r.color,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}},r.bloc)
          ),
          e("span",{style:{fontSize:13,color:r.color,fontWeight:300}},"›")
        );
      })
    ):null,
    (focused && qLow.length>=2 && results.length===0)?e("div",{style:{position:"absolute",top:"100%",left:0,right:0,marginTop:6,background:C.cd,border:"1px solid "+C.bd,borderRadius:12,padding:"16px 14px",textAlign:"center",zIndex:90,boxShadow:"0 10px 30px rgba(0,0,0,.4)"}},
      e("div",{style:{fontSize:20,marginBottom:6,opacity:.5}},"🔍"),
      e("div",{style:{fontSize:12,color:C.mt}},"Sin resultados para \"",query,"\"")
    ):null
  );
}


function IntroView(){
  var c=C.intro;

  var s1=useState(null);var openGen=s1[0],setOpenGen=s1[1];
  var secciones=[
    {id:"oms",ic:"🏥",t:"Definiciones de la OMS",sub:"Salud · Salud mental · Psiquiatría",c:c,
     content:e("div",null,
       e("div",{style:{padding:"16px 18px",background:"linear-gradient(135deg,"+ax(c,.15)+","+C.cd+" 85%)",border:"1px solid "+ax(c,.35),borderLeft:"4px solid "+c,borderRadius:12,marginBottom:14}},
         e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:1.8,textTransform:"uppercase",marginBottom:6}},"🌐 Salud · OMS"),
         e("div",{style:{fontSize:14,color:C.tx,lineHeight:1.6,fontStyle:"italic"}},"Estado de completo bienestar ",e("b",null,"físico, mental y social"),", y no solamente la ausencia de afecciones o enfermedades.")
       ),
       e("div",{style:{padding:"16px 18px",background:"linear-gradient(135deg,"+ax(c,.12)+","+C.cd+" 85%)",border:"1px solid "+ax(c,.3),borderLeft:"4px solid "+c,borderRadius:12,marginBottom:14}},
         e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:1.8,textTransform:"uppercase",marginBottom:6}},"🧠 Salud mental · OMS"),
         e("div",{style:{fontSize:14,color:C.tx,lineHeight:1.6,fontStyle:"italic"}},"Estado de bienestar en el que el individuo es consciente de ",e("b",null,"sus capacidades"),", puede afrontar el ",e("b",null,"estrés"),", puede ",e("b",null,"trabajar de forma productiva")," y ",e("b",null,"contribuir a la comunidad"),".")
       ),
       e("div",{style:{padding:"16px 18px",background:"linear-gradient(135deg,"+ax(c,.1)+","+C.cd+" 85%)",border:"1px solid "+ax(c,.28),borderLeft:"4px solid "+c,borderRadius:12}},
         e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:1.8,textTransform:"uppercase",marginBottom:6}},"⚕️ Psiquiatría · etimología"),
         e("div",{style:{fontSize:13.5,color:C.tx,lineHeight:1.6}},"Del griego ",e("b",null,"psyche")," (mente, alma) + ",e("b",null,"iatreia")," (curación). Ciencia que se dedica al ",e("b",null,"estudio y tratamiento de las enfermedades mentales"),".")
       )
     )},
    {id:"historia",ic:"📜",t:"Historia de la psiquiatría",sub:"De la antigüedad a la actualidad",c:c,
     content:e("div",null,
       e(P,null,"Evolución de la comprensión y tratamiento del sufrimiento mental a lo largo de los siglos."),
       e(Table,{
         headers:[{t:"Época",c:c},{t:"Concepción y abordaje",c:c}],
         rows:[
           ["Antigüedad y Edad Media","Enfermedad mental entendida como posesión demoníaca o castigo divino · reclusión en instituciones · tratamientos rudimentarios"],
           ["Siglo XIX","Surge el concepto de 'enfermedad mental' · la psiquiatría se integra en la medicina · manicomios · 'tratamientos morales' para reinsertar pacientes"],
           ["Siglo XX","Introducción de la psicofarmacología (clorpromazina) · electroshock · lobotomía (controversial)"],
           ["Actualidad","Enfoque integral: evaluación clínica + psicoterapia + fármacos cuando es necesario + factores sociales/ambientales"]
         ]
       }),
       e(Note,{c:c,t:"Hitos históricos"},"La ",e("b",null,"clorpromazina (1952)"),", primer antipsicótico, marcó un antes y un después — permitió el cierre progresivo de los manicomios y la psiquiatría comunitaria. Antes de ella, los pacientes con esquizofrenia o manía solían pasar décadas en asilos.")
     )},
    {id:"trastorno",ic:"🧩",t:"¿Qué es un trastorno mental?",sub:"Definición y características",c:c,
     content:e("div",null,
       e(Def,{c:c},"Afección que impacta el ",e("b",null,"pensamiento, las emociones, el estado de ánimo y el comportamiento")," de una persona. Pueden ser de ",e("b",null,"corta duración o crónicos"),", y afectan la capacidad de la persona para ",e("b",null,"relacionarse con otros y funcionar en la vida diaria"),"."),
       e(H3,{c:c,mt:14},"4 ejes sobre los que actúa"),
       e(SxList,{c:c,items:[
         "Pensamiento (cogniciones, juicio, atención)",
         "Emociones (afecto, regulación)",
         "Estado de ánimo (predominante y sostenido)",
         "Comportamiento (conducta observable)"
       ]}),
       e(Note,{c:c,t:"Criterios transversales"},"Para considerar algo un trastorno mental se requiere: (1) ",e("b",null,"disfunción")," en uno o más de los 4 ejes, (2) ",e("b",null,"malestar")," o ",e("b",null,"deterioro")," en la vida social, laboral u otras áreas, (3) ",e("b",null,"no atribuible")," a efectos de sustancias ni otra afección médica.")
     )},
    {id:"psi_neu",ic:"⚖️",t:"Psicosis vs Neurosis",sub:"Tabla fundamental · Dra. Justiniano",c:c,
     content:e("div",null,
       e(P,null,"División clínica clásica — aunque el DSM-5 no la usa formalmente, sigue siendo ",e("b",null,"fundamental pedagógicamente")," y es la base de los dos grandes bloques de la materia."),
       e(Table,{
         headers:[{t:"Característica",c:c},{t:"🔺 Psicosis",c:C.psi},{t:"🌀 Neurosis",c:C.anx}],
         rows:[
           ["Contacto con realidad",e("b",{style:{color:C.psi}},"PÉRDIDA")+" del contacto con la realidad",e("b",{style:{color:C.anx}},"NO se desconecta")+" de la realidad"],
           ["Síntomas principales","Alucinaciones · delirios","Ansiedad · depresión · angustia · obsesión"],
           ["Conciencia del problema","El paciente NO suele reconocer su enfermedad","El paciente reconoce su sufrimiento"],
           ["Tratamiento de base","Medicación (antipsicóticos) + terapia","Terapia psicológica predominante ± fármacos"]
         ]
       }),
       e(H3,{c:c,mt:14},"Qué entidades estudiamos en cada bloque"),
       e(Table,{
         headers:[{t:"Bloque",c:c},{t:"Entidades de la materia",c:c}],
         rows:[
           [e("span",{style:{color:C.psi,fontWeight:800}},"🔺 Psicosis y ánimo"),"Espectro esquizofrénico (psicótico breve, esquizofreniforme, esquizofrenia, esquizoafectivo) · trastorno delirante · trastornos bipolares (I, II, ciclotímico) — el episodio depresivo mayor entra como componente del bipolar"],
           [e("span",{style:{color:C.anx,fontWeight:800}},"🌀 Neurosis"),"Ansiedad · TOC · trauma y estrés · somáticos y disociativos · conducta alimentaria · sueño-vigilia · personalidad · control de impulsos · depresivos puros"]
         ]
       }),
       e(Note,{c:c,t:"Por qué importa"},"Cada bloque tiene un ",e("b",null,"enfoque terapéutico distinto"),". Psicosis requiere cobertura farmacológica primero (antipsicóticos, estabilizadores) porque el paciente pierde contacto con la realidad. Neurosis privilegia psicoterapia — el paciente está consciente y puede trabajar sobre sus síntomas.")
     )},
    {id:"causas",ic:"🔬",t:"Causas de los trastornos mentales",sub:"3 factores: biológico · psicológico · social",c:c,
     content:e("div",null,
       e(P,null,"Los trastornos mentales son ",e("b",null,"multicausales"),". Ningún factor por sí solo los explica. Se combinan factores de los 3 dominios siguientes:"),
       e("div",{style:{display:"grid",gridTemplateColumns:"1fr",gap:10,marginTop:14}},
         e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(C.psi,.1)+","+C.cd+" 85%)",border:"1px solid "+ax(C.psi,.3),borderLeft:"4px solid "+C.psi,borderRadius:10}},
           e("div",{style:{fontSize:10.5,fontWeight:800,color:C.psi,letterSpacing:1.6,textTransform:"uppercase",marginBottom:6}},"1 · Factor biológico"),
           e(SxList,{c:C.psi,items:[
             "Genética (historia familiar, heredabilidad)",
             "Química cerebral (neurotransmisores: dopamina, serotonina, GABA, glutamato)",
             "Estructura cerebral (atrofia, crecimiento ventricular en esquizofrenia, etc.)"
           ]})
         ),
         e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(C.anx,.1)+","+C.cd+" 85%)",border:"1px solid "+ax(C.anx,.3),borderLeft:"4px solid "+C.anx,borderRadius:10}},
           e("div",{style:{fontSize:10.5,fontWeight:800,color:C.anx,letterSpacing:1.6,textTransform:"uppercase",marginBottom:6}},"2 · Factor psicológico"),
           e(SxList,{c:C.anx,items:[
             "Experiencias vitales (trauma, duelo, abuso)",
             "Relaciones interpersonales (apego, familia, pareja)",
             "Habilidades emocionales (regulación, afrontamiento)"
           ]})
         ),
         e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(C.som,.1)+","+C.cd+" 85%)",border:"1px solid "+ax(C.som,.3),borderLeft:"4px solid "+C.som,borderRadius:10}},
           e("div",{style:{fontSize:10.5,fontWeight:800,color:C.som,letterSpacing:1.6,textTransform:"uppercase",marginBottom:6}},"3 · Factor social"),
           e(SxList,{c:C.som,items:[
             "Pobreza y acceso limitado a recursos",
             "Desigualdad y exclusión social",
             "Estigma (impide consultar y genera aislamiento)"
           ]})
         )
       ),
       e(Note,{c:c,t:"Modelo biopsicosocial"},"Este es el enfoque que predomina en la psiquiatría actual. Ningún trastorno mental se entiende adecuadamente mirando solo uno de los 3 factores — siempre se evalúan los tres al planificar tratamiento.")
     )},
    {id:"tratamiento",ic:"💊",t:"Los 3 pilares del tratamiento",sub:"Psicoterapia · Farmacología · Somático",c:c,
     content:e("div",null,
       e(P,null,"Todo trastorno mental se aborda con una combinación de las siguientes modalidades, ajustada al cuadro específico."),
       e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(C.anx,.1)+","+C.cd+" 85%)",border:"1px solid "+ax(C.anx,.3),borderLeft:"4px solid "+C.anx,borderRadius:10,marginBottom:10}},
         e("div",{style:{fontSize:10.5,fontWeight:800,color:C.anx,letterSpacing:1.6,textTransform:"uppercase",marginBottom:6}},"1 · Psicoterapia"),
         e(Table,{
           headers:[{t:"Modalidad",c:C.anx},{t:"Para qué es útil",c:C.anx}],
           rows:[
             ["Cognitivo-conductual (TCC)","1ª línea en ansiedad, depresión, TOC, TEPT, TCA"],
             ["Sistémica","Problemas familiares/pareja · trastornos de conducta en menores"],
             ["Racional emotiva","Creencias irracionales · ansiedad · depresión leve-moderada"],
             ["Centrada en soluciones","Cuadros agudos · duelo · adaptación · enfocada en el presente"]
           ]
         })
       ),
       e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(C.psi,.1)+","+C.cd+" 85%)",border:"1px solid "+ax(C.psi,.3),borderLeft:"4px solid "+C.psi,borderRadius:10,marginBottom:10}},
         e("div",{style:{fontSize:10.5,fontWeight:800,color:C.psi,letterSpacing:1.6,textTransform:"uppercase",marginBottom:6}},"2 · Farmacológico · las 4 grandes familias"),
         e(Table,{
           headers:[{t:"Familia",c:C.psi},{t:"Para qué",c:C.psi},{t:"Ejemplos",c:C.psi}],
           rows:[
             ["Antidepresivos","Depresión · ansiedad · TOC · TCA","ISRS (sertralina, fluoxetina) · IRSN (venlafaxina, duloxetina)"],
             ["Ansiolíticos","Ansiedad aguda · insomnio","BZD (alprazolam, clonazepam) — uso corto"],
             ["Antipsicóticos","Psicosis · manía · agitación","Típicos (haloperidol) · atípicos (risperidona, olanzapina, clozapina)"],
             ["Estabilizadores del ánimo","Bipolar · esquizoafectivo","Litio · valproato · carbamazepina · lamotrigina"]
           ]
         })
       ),
       e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(C.trm,.1)+","+C.cd+" 85%)",border:"1px solid "+ax(C.trm,.3),borderLeft:"4px solid "+C.trm,borderRadius:10}},
         e("div",{style:{fontSize:10.5,fontWeight:800,color:C.trm,letterSpacing:1.6,textTransform:"uppercase",marginBottom:6}},"3 · Tratamientos somáticos"),
         e(Table,{
           headers:[{t:"Técnica",c:C.trm},{t:"Indicaciones clave",c:C.trm}],
           rows:[
             ["ECT (terapia electroconvulsiva)","Depresión refractaria · depresión psicótica · catatonia · riesgo suicida agudo · embarazo"],
             ["EMT (estimulación magnética transcraneal)","Depresión refractaria · alternativa a ECT sin anestesia"],
             ["Ketamina / esketamina","Depresión refractaria · respuesta rápida en horas-días · suicidalidad aguda"],
             ["Fototerapia","Depresión estacional"]
           ]
         })
       ),
       e(Alert,{c:C.good,label:"🔑 Principio terapéutico"},"Siempre ",e("b",null,"enfoque integral"),": combinar psicoterapia + farmacoterapia cuando sea necesario + intervención social (familia, red de apoyo, recursos). La monoterapia raramente es suficiente en cuadros moderados-severos.")
     )},
    {id:"preliminar",ic:"🗺️",t:"Cómo usar este módulo",sub:"Guía rápida de navegación",c:c,
     content:e("div",null,
       e(P,null,"Bienvenido a Salud Mental II. Este módulo organiza toda la materia en ",e("b",null,"2 grandes bloques")," con el mismo formato visual:"),
       e("div",{style:{display:"flex",gap:10,marginTop:14,flexWrap:"wrap"}},
         e("div",{style:{flex:1,minWidth:200,padding:"14px",background:"linear-gradient(135deg,"+ax(C.psi,.12)+","+C.cd+" 85%)",border:"1px solid "+ax(C.psi,.35),borderRadius:12}},
           e("div",{style:{fontSize:22,marginBottom:4}},"🔺"),
           e("div",{style:{fontSize:14,fontWeight:800,color:C.psi,marginBottom:4}},"Psicosis y ánimo"),
           e("div",{style:{fontSize:12,color:C.tx,lineHeight:1.5}},"8 enfermedades · espectro esquizofrénico + delirante + bipolares. La depresión mayor aparece como componente interno del bipolar.")
         ),
         e("div",{style:{flex:1,minWidth:200,padding:"14px",background:"linear-gradient(135deg,"+ax(C.anx,.12)+","+C.cd+" 85%)",border:"1px solid "+ax(C.anx,.35),borderRadius:12}},
           e("div",{style:{fontSize:22,marginBottom:4}},"🌀"),
           e("div",{style:{fontSize:14,fontWeight:800,color:C.anx,marginBottom:4}},"Neurosis"),
           e("div",{style:{fontSize:12,color:C.tx,lineHeight:1.5}},"9 temas · 60 enfermedades · ansiedad, TOC, trauma, somáticos, TCA, sueño, personalidad, impulsos, depresivos puros.")
         )
       ),
       e(H3,{c:c,mt:18},"Cómo está organizada cada enfermedad"),
       e(SxList,{c:c,items:[
         "📖 Definición · concepto claro y rápido",
         "🩺 Clínica · síntomas, epidemiología, subtipos",
         "📋 Diagnóstico · criterios DSM-5 con tus letras",
         "💊 Tratamiento · 1ª línea, dosis, trampas de examen"
       ]}),
       e(H3,{c:c,mt:14},"Herramientas de estudio"),
       e(SxList,{c:c,items:[
         "🃏 Flashcards — puedes añadir las tuyas y se guardan en tu dispositivo",
         "❓ Quiz — casos clínicos con explicación",
         "🔍 Filtros globales — estudia solo el tema que necesites, o combínalos",
         "📋 Modo lista — ver todas las preguntas o flashcards de corrido"
       ]}),
       e(Alert,{c:c,label:"💡 Recomendación"},"Empieza por este Tema 0 para tener el marco conceptual. Luego elige el bloque que vas a estudiar (Psicosis o Neurosis). Usa las flashcards y quiz globales al final para repasar.")
     )}
  ];

  return e("div",null,
    e(Hero,{c:c,kicker:"Tema 0 · Salud Mental II",title:"Introducción a la psiquiatría"},
      "Marco conceptual común a toda la materia. Definiciones de la OMS, historia, qué es un trastorno mental, la división clínica ",e("b",null,"psicosis vs neurosis"),", causas multicausales y los 3 pilares del tratamiento. Toca cada tarjeta para profundizar."
    ),

    e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.12)+","+ax(c,.03)+" 90%)",border:"1px solid "+ax(c,.3),borderRadius:14,margin:"22px 0 4px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Secciones del tema"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Conceptos fundamentales"),
      e("div",{style:{fontSize:12,color:C.mt,marginTop:4,lineHeight:1.45}},"OMS · Historia · Psicosis vs Neurosis · Causas · Tratamientos · Navegación")
    ),
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginTop:10}},
      secciones.map(function(g,i){
        return e("button",{key:g.id,onClick:function(){setOpenGen(i);},style:{padding:"14px 12px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:10,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:4,minHeight:100}},
          e("div",{style:{fontSize:22,marginBottom:4}},g.ic),
          e("div",{style:{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Playfair Display"}},g.t),
          e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.4,marginTop:2}},g.sub)
        );
      })
    ),
    openGen!==null?e(DzModal,{c:secciones[openGen].c,name:secciones[openGen].t,kicker:"Sección del tema",single:secciones[openGen].content,onClose:function(){setOpenGen(null);}}):null,

    e(Abbrev,{c:c,items:[
      {a:"OMS",d:"Organización Mundial de la Salud"},
      {a:"DSM-5",d:"Manual Diagnóstico y Estadístico, 5ª edición (APA)"},
      {a:"TCC",d:"Terapia Cognitivo-Conductual"},
      {a:"ECT",d:"Terapia Electroconvulsiva"},
      {a:"EMT",d:"Estimulación Magnética Transcraneal"},
      {a:"BZD",d:"Benzodiacepinas"},
      {a:"ISRS",d:"Inhibidores Selectivos de la Recaptación de Serotonina"},
      {a:"IRSN",d:"Inhibidores de la Recaptación de Serotonina y Noradrenalina"},
      {a:"TDM",d:"Trastorno Depresivo Mayor"}
    ]})
  );
}


function RootHub(p){
  var COLOR_PSI="#ef4444";
  var COLOR_NEU=C.anx;
  var ramas=[
    {id:"intro",c:C.intro,ic:"📘",t:"Psiquiatría",n:"00",d:"Introducción común a toda la materia. Definiciones, historia, psicosis vs neurosis, causas, tratamientos.",sub:"7 secciones conceptuales · base para ambos bloques",count:"introducción"},
    {id:"psicosis",c:COLOR_PSI,ic:"🔺",t:"Psicosis y ánimo",n:"01",d:"Trastornos con prueba de realidad ALTERADA. Delirios, alucinaciones, cuadros afectivos graves.",sub:"Espectro esquizofrénico · Delirante · Bipolares (con depresión mayor como componente)",count:"8 enfermedades"},
    {id:"neurosis",c:COLOR_NEU,ic:"🌀",t:"Neurosis",n:"02",d:"Trastornos con prueba de realidad CONSERVADA. El paciente sabe que algo está mal.",sub:"9 temas completos",count:"60 enfermedades"}
  ];
  return e("div",{style:{padding:"16px 14px 90px",maxWidth:640,margin:"0 auto"}},
    e("div",{style:{textAlign:"center",padding:"32px 10px 22px"}},
      e("div",{style:{fontSize:46,marginBottom:8}},"🧠"),
      e("div",{style:{fontSize:10.5,fontWeight:800,color:C.anx,letterSpacing:2.5,textTransform:"uppercase",marginBottom:4}},"ECEPT · El Conocimiento Es Para Todos"),
      e("h1",{style:{fontSize:32,fontWeight:900,color:"#fff",letterSpacing:.2,lineHeight:1.1,marginBottom:8,fontFamily:"Playfair Display"}},"Salud Mental II"),
      e("div",{style:{fontSize:13.5,color:C.mt,lineHeight:1.55,maxWidth:460,margin:"0 auto"}},"Apunte completo de psiquiatría. Organizado por la división clásica: ",e("b",{style:{color:"#fff"}},"psicosis vs neurosis"),".")
    ),
    e("div",{style:{padding:"13px 15px",background:C.cd,border:"1px solid "+C.bd,borderRadius:12,marginBottom:16,fontSize:12.5,lineHeight:1.6,color:C.mt}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:C.pearl,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}},"🔑 Regla clínica clave"),
      "La ",e("b",{style:{color:"#fff"}},"prueba de realidad")," divide ambos grupos: si el paciente reconoce que sus síntomas son internos y patológicos → ",e("b",{style:{color:"#fff"}},"neurosis"),". Si cree que son reales y externos → ",e("b",{style:{color:"#fff"}},"psicosis"),"."
    ),
    e(GlobalSearch,{go:p.go}),
    ramas.map(function(r,i){
      return e("button",{key:r.id,onClick:function(){p.go(r.id);},style:{width:"100%",padding:18,background:"linear-gradient(135deg,"+ax(r.c,.15)+" 0%,"+C.cd+" 85%)",border:"1px solid "+ax(r.c,.4),borderRadius:16,margin:"0 0 14px",cursor:"pointer",textAlign:"left",display:"block",animation:"fadeIn .3s "+(i*.08)+"s both"}},
        e("div",{style:{display:"flex",alignItems:"center",gap:14,marginBottom:12}},
          e("div",{style:{fontSize:30,width:56,height:56,borderRadius:14,background:ax(r.c,.22),border:"1px solid "+ax(r.c,.45),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},r.ic),
          e("div",{style:{flex:1,minWidth:0}},
            e("div",{style:{fontSize:10,fontWeight:800,color:r.c,letterSpacing:1.8,textTransform:"uppercase",marginBottom:2}},r.count),
            e("div",{style:{fontSize:22,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.15,fontFamily:"Playfair Display"}},r.t)
          ),
          e("div",{style:{fontSize:24,color:r.c,fontWeight:300}},"›")
        ),
        e("div",{style:{fontSize:13.5,color:C.tx,lineHeight:1.55,marginBottom:6}},r.d),
        e("div",{style:{fontSize:11.5,color:C.mt,lineHeight:1.5,fontStyle:"italic"}},r.sub)
      );
    }),

    // === REPASO GLOBAL DE TODO SALUD MENTAL ===
    e("div",{style:{padding:"13px 15px",background:"linear-gradient(135deg,"+ax(C.pearl,.12)+","+ax(C.pearl,.02)+" 90%)",border:"1px solid "+ax(C.pearl,.35),borderRadius:14,margin:"8px 0 12px",textAlign:"center"}},
      e("div",{style:{fontSize:10.5,fontWeight:800,color:C.pearl,letterSpacing:2,textTransform:"uppercase",marginBottom:3}},"Repaso combinado"),
      e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},"Toda Salud Mental II"),
      e("div",{style:{fontSize:12,color:C.mt,marginTop:4,lineHeight:1.45}},"Psicosis + Neurosis · filtra por tema, busca, añade las tuyas")
    ),
    e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:10,marginBottom:18}},
      e("button",{onClick:function(){p.go("flash-all");},style:{padding:"16px 14px",background:"linear-gradient(135deg,"+ax(C.pearl,.18)+","+C.cd+" 90%)",border:"1px solid "+ax(C.pearl,.4),borderLeft:"4px solid "+C.pearl,borderRadius:12,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:5,minHeight:95}},
        e("div",{style:{fontSize:22,marginBottom:3}},"🃏"),
        e("div",{style:{fontSize:13.5,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Playfair Display"}},"Flashcards globales"),
        e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.4}},"Todas las flashcards oficiales + las tuyas, filtros por tema")
      ),
      e("button",{onClick:function(){p.go("quiz-all");},style:{padding:"16px 14px",background:"linear-gradient(135deg,"+ax(C.pearl,.18)+","+C.cd+" 90%)",border:"1px solid "+ax(C.pearl,.4),borderLeft:"4px solid "+C.pearl,borderRadius:12,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:5,minHeight:95}},
        e("div",{style:{fontSize:22,marginBottom:3}},"❓"),
        e("div",{style:{fontSize:13.5,fontWeight:800,color:"#fff",lineHeight:1.25,fontFamily:"Playfair Display"}},"Quiz global"),
        e("div",{style:{fontSize:11,color:C.mt,lineHeight:1.4}},"Todos los casos clínicos · modo tarjeta o lista")
      )
    ),

    e("div",{style:{textAlign:"center",padding:"22px 0 0",fontSize:11,color:C.dm,lineHeight:1.7}},
      e("div",{style:{fontSize:18,marginBottom:5}},"📚"),
      e("div",null,"DSM-5-TR (2022) · ECEPT · Sebas · 2025")
    )
  );
}

// ══════════════════════════════════════════════════════════════
// HUB NEUROSIS · los 4 temas
// ══════════════════════════════════════════════════════════════

function NeurosisHub(p){
  var temas=[
    {id:"anx",c:C.anx,n:"01",ic:"🫀",t:"Trastornos de ansiedad",d:"9 entidades · Pánico, TAG, Fobias, Agorafobia, Ansiedad por separación, Mutismo selectivo",sub:"Criterios DSM-5-TR · Tratamiento con dosis · Quiz 6 casos"},
    {id:"toc",c:C.toc,n:"02",ic:"🔁",t:"TOC y trastornos relacionados",d:"7 entidades · TOC, TDC, Hoarding, Tricotilomanía, Excoriación",sub:"ISRS a dosis altas · EPR · PANDAS · Quiz 6 casos"},
    {id:"trm",c:C.trm,n:"03",ic:"⚡",t:"Trauma y estrés",d:"6 entidades · TEPT, TEA, Adaptación, Duelo prolongado, Apego reactivo y desinhibido",sub:"4 criterios del TEPT detallados · Prazosina · EMDR · Quiz 6 casos"},
    {id:"som",c:C.som,n:"04",ic:"🧬",t:"Somáticos y disociativos",d:"9 entidades · TSS, IAD, Conversión, Facticio + TID, Amnesia, Despersonalización",sub:"Signo de Hoover · Tabla conversión vs facticio vs simulación · Quiz 6 casos"},
    {id:"tca",c:C.tca,n:"05",ic:"🍽️",t:"Conducta alimentaria",d:"6 entidades · Anorexia, Bulimia, Atracón, ARFID, Pica, Rumiación",sub:"Criterios DSM-5 · Riesgo médico · Fluoxetina en bulimia · Quiz 6 casos"},
    {id:"sue",c:C.sue,n:"06",ic:"🌙",t:"Sueño-vigilia",d:"9 entidades · Insomnio, Narcolepsia, AOS, SPI, Parasomnias, TCSR",sub:"NREM vs REM · CPAP · Cataplejía · Quiz 6 casos"},
    {id:"per",c:C.per,n:"07",ic:"🎭",t:"Trastornos de la personalidad",d:"10 entidades · 3 clusters (A: raros · B: dramáticos · C: ansiosos)",sub:"DBT para TLP · TOCP vs TOC · Quiz 6 casos"},
    {id:"imp",c:C.imp,n:"08",ic:"🎯",t:"Control de impulsos",d:"5 entidades · Negativista, TEI, Conducta, Piromanía, Cleptomanía",sub:"CC <15 → antisocial adulto · PMT · Quiz 6 casos"},
    {id:"dpr",c:C.dpr,n:"09",ic:"💧",t:"Trastornos depresivos",d:"4 entidades · TDM, Distimia, TDPM, TDDD",sub:"SIGECAPS · ISRS 1ª línea · TEC en refractario · Quiz 6 casos"}
  ];
  return e("div",{style:{padding:"16px 14px 90px",maxWidth:640,margin:"0 auto"}},
    e("div",{style:{padding:"22px 20px",background:"linear-gradient(135deg,"+ax(C.anx,.15)+","+C.cd+" 90%)",border:"1px solid "+ax(C.anx,.4),borderRadius:16,marginBottom:20,marginTop:8,animation:"fadeIn .3s"}},
      e("div",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:10}},
        e("div",{style:{fontSize:30}},"🌀"),
        e("div",null,
          e("div",{style:{fontSize:10,fontWeight:800,color:C.anx,letterSpacing:2,textTransform:"uppercase",marginBottom:2}},"60 entidades DSM-5-TR"),
          e("h1",{style:{fontSize:26,fontWeight:900,color:"#fff",letterSpacing:.15,lineHeight:1.1,fontFamily:"Playfair Display"}},"Neurosis")
        )
      ),
      e("div",{className:"prose",style:{fontSize:13.5}},"Grupo clásico de trastornos mentales donde la ",e("b",null,"prueba de realidad está conservada"),". El paciente reconoce que sus síntomas son parte de sí mismo y le generan sufrimiento. En DSM-5-TR ya no se usa el término 'neurosis' formalmente, pero clínicamente sigue siendo útil para agrupar estos 4 capítulos.")
    ),
    temas.map(function(t,i){
      return e("button",{key:t.id,onClick:function(){p.go(t.id);},style:{width:"100%",padding:16,background:"linear-gradient(135deg,"+ax(t.c,.12)+" 0%,"+C.cd+" 85%)",border:"1px solid "+ax(t.c,.35),borderRadius:14,margin:"0 0 12px",cursor:"pointer",textAlign:"left",display:"block",animation:"fadeIn .3s "+(i*.06)+"s both"}},
        e("div",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:10}},
          e("div",{style:{fontSize:26,width:48,height:48,borderRadius:12,background:ax(t.c,.2),border:"1px solid "+ax(t.c,.4),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},t.ic),
          e("div",{style:{flex:1,minWidth:0}},
            e("div",{style:{fontSize:10,fontWeight:800,color:t.c,letterSpacing:1.8,textTransform:"uppercase",marginBottom:2}},"Tema "+t.n),
            e("div",{style:{fontSize:17,fontWeight:800,color:"#fff",letterSpacing:.1,lineHeight:1.2,fontFamily:"Playfair Display"}},t.t)
          ),
          e("div",{style:{fontSize:22,color:t.c,fontWeight:300}},"›")
        ),
        e("div",{style:{fontSize:13,color:C.tx,lineHeight:1.5,marginBottom:5}},t.d),
        e("div",{style:{fontSize:11.5,color:C.mt,lineHeight:1.5,fontStyle:"italic"}},t.sub)
      );
    })
  );
}

// ══════════════════════════════════════════════════════════════
// APP SHELL — 3 niveles: root → neurosis → view
// ══════════════════════════════════════════════════════════════

function App(){
  var s1=useState("root");var view=s1[0],setView=s1[1];
  var s2=useState(false);var showTop=s2[0],setShowTop=s2[1];

  useEffect(function(){
    function onScroll(){setShowTop(window.scrollY>400);}
    window.addEventListener("scroll",onScroll);
    return function(){window.removeEventListener("scroll",onScroll);};
  },[]);

  // Deep-link hook: ECEPT's globalSearch calls window._smFocus(route) after
  // navigating to the salud_mental view, to jump straight into a specific
  // SM sub-view (e.g. "anx", "toc", "intro"). Cleared on unmount.
  useEffect(function(){
    window._smFocus=function(v){if(v)setView(v);};
    return function(){window._smFocus=null;};
  },[]);

  useEffect(function(){
    window.scrollTo({top:0,behavior:"instant"});
  },[view]);

  function go(v){setView(v);}
  function back(){
    if(view==="neurosis"||view==="psicosis"||view==="intro")setView("root");
    else if(view==="flash-psicosis"||view==="quiz-psicosis")setView("psicosis");
    else if(view==="flash-neurosis"||view==="quiz-neurosis")setView("neurosis");
    else if(view==="flash-all"||view==="quiz-all")setView("root");
    else setView("neurosis");
  }
  function top(){window.scrollTo({top:0,behavior:"smooth"});}

  var views={anx:AnxView,toc:OCDView,trm:TraumaView,som:SomView,tca:TCAView,sue:SueView,per:PerView,imp:ImpView,dpr:DprView};
  var titles={anx:"Tema 1 · Ansiedad",toc:"Tema 2 · TOC",trm:"Tema 3 · Trauma",som:"Tema 4 · Somáticos / Disociativos",tca:"Tema 5 · Conducta alimentaria",sue:"Tema 6 · Sueño-vigilia",per:"Tema 7 · Personalidad",imp:"Tema 8 · Control de impulsos",dpr:"Tema 9 · Trastornos depresivos"};
  var colors={anx:C.anx,toc:C.toc,trm:C.trm,som:C.som,tca:C.tca,sue:C.sue,per:C.per,imp:C.imp,dpr:C.dpr};

  if(view==="root"){
    return e("div",null,e(RootHub,{go:go}));
  }

  if(view==="intro"){
    return e("div",null,
      e("div",{style:{position:"sticky",top:0,zIndex:50,padding:"10px 14px",background:"rgba(6,10,20,.92)",backdropFilter:"blur(10px)",borderBottom:"1px solid "+C.bd,display:"flex",alignItems:"center",gap:10}},
        e("button",{onClick:back,style:{padding:"8px 12px",background:ax(C.intro,.15),border:"1px solid "+ax(C.intro,.35),color:C.intro,borderRadius:8,fontSize:12.5,fontWeight:700,cursor:"pointer"}},"← Inicio"),
        e("div",{style:{flex:1,fontSize:12.5,fontWeight:800,color:C.intro,letterSpacing:.5,textAlign:"center"}},"📘 Psiquiatría")
      ),
      e("div",{style:{padding:"14px 14px 90px",maxWidth:720,margin:"0 auto",animation:"fadeIn .3s"}},
        e(IntroView,null)
      ),
      showTop?e("button",{onClick:top,style:{position:"fixed",bottom:22,right:18,width:46,height:46,borderRadius:"50%",background:C.intro,color:"#fff",border:"none",fontSize:18,cursor:"pointer",boxShadow:"0 8px 20px "+ax(C.intro,.45),zIndex:60}},"↑"):null
    );
  }

  if(view==="neurosis"){
    return e("div",null,
      e("div",{style:{position:"sticky",top:0,zIndex:50,padding:"10px 14px",background:"rgba(6,10,20,.92)",backdropFilter:"blur(10px)",borderBottom:"1px solid "+C.bd,display:"flex",alignItems:"center",gap:10}},
        e("button",{onClick:back,style:{padding:"8px 12px",background:ax(C.anx,.15),border:"1px solid "+ax(C.anx,.35),color:C.anx,borderRadius:8,fontSize:12.5,fontWeight:700,cursor:"pointer"}},"← Inicio"),
        e("div",{style:{flex:1,fontSize:12.5,fontWeight:800,color:C.anx,letterSpacing:.5,textAlign:"center"}},"🌀 Neurosis")
      ),
      e(NeurosisHub,{go:go}),
      showTop?e("button",{onClick:top,style:{position:"fixed",bottom:22,right:18,width:46,height:46,borderRadius:"50%",background:C.anx,color:"#fff",border:"none",fontSize:18,cursor:"pointer",boxShadow:"0 8px 20px "+ax(C.anx,.45),zIndex:60}},"↑"):null
    );
  }

  if(view==="psicosis"){
    return e("div",null,
      e("div",{style:{position:"sticky",top:0,zIndex:50,padding:"10px 14px",background:"rgba(6,10,20,.92)",backdropFilter:"blur(10px)",borderBottom:"1px solid "+C.bd,display:"flex",alignItems:"center",gap:10}},
        e("button",{onClick:back,style:{padding:"8px 12px",background:ax(C.psi,.15),border:"1px solid "+ax(C.psi,.35),color:C.psi,borderRadius:8,fontSize:12.5,fontWeight:700,cursor:"pointer"}},"← Inicio"),
        e("div",{style:{flex:1,fontSize:12.5,fontWeight:800,color:C.psi,letterSpacing:.5,textAlign:"center"}},"🔺 Psicosis")
      ),
      e("div",{style:{padding:"14px 14px 90px",maxWidth:720,margin:"0 auto",animation:"fadeIn .3s"}},
        e(PsicosisView,{go:go})
      ),
      showTop?e("button",{onClick:top,style:{position:"fixed",bottom:22,right:18,width:46,height:46,borderRadius:"50%",background:C.psi,color:"#fff",border:"none",fontSize:18,cursor:"pointer",boxShadow:"0 8px 20px "+ax(C.psi,.45),zIndex:60}},"↑"):null
    );
  }

  // Hubs globales: flashcards y quiz con filtros
  if(view==="flash-psicosis"||view==="quiz-psicosis"||view==="flash-neurosis"||view==="quiz-neurosis"||view==="flash-all"||view==="quiz-all"){
    var isFlash=view.indexOf("flash-")===0;
    var group=view.indexOf("psicosis")>=0?"psicosis":(view.indexOf("all")>=0?"all":"neurosis");
    var hc=group==="psicosis"?C.psi:(group==="all"?C.pearl:C.anx);
    var hicon=group==="psicosis"?"🔺":(group==="all"?"🧠":"🌀");
    var hbackLabel=group==="psicosis"?"← Psicosis":(group==="all"?"← Inicio":"← Neurosis");
    var groupLabel=group==="psicosis"?"Psicosis":(group==="all"?"toda Salud Mental":"Neurosis");
    var htitle=(isFlash?"🃏 Flashcards":"❓ Quiz")+" · "+(group==="all"?"Todo":groupLabel);
    return e("div",null,
      e("div",{style:{position:"sticky",top:0,zIndex:50,padding:"10px 14px",background:"rgba(6,10,20,.92)",backdropFilter:"blur(10px)",borderBottom:"1px solid "+C.bd,display:"flex",alignItems:"center",gap:10}},
        e("button",{onClick:back,style:{padding:"8px 12px",background:ax(hc,.15),border:"1px solid "+ax(hc,.35),color:hc,borderRadius:8,fontSize:12.5,fontWeight:700,cursor:"pointer"}},hbackLabel),
        e("div",{style:{flex:1,fontSize:12.5,fontWeight:800,color:hc,letterSpacing:.5,textAlign:"center"}},htitle)
      ),
      e("div",{style:{padding:"16px 14px 90px",maxWidth:720,margin:"0 auto",animation:"fadeIn .3s"}},
        e("div",{style:{padding:"18px 18px",background:"linear-gradient(135deg,"+ax(hc,.15)+","+C.cd+" 85%)",border:"1px solid "+ax(hc,.35),borderLeft:"4px solid "+hc,borderRadius:14,marginBottom:18}},
          e("div",{style:{fontSize:10.5,fontWeight:800,color:hc,letterSpacing:2,textTransform:"uppercase",marginBottom:4}},isFlash?"Flashcards globales":"Quiz global"),
          e("div",{style:{fontSize:18,fontWeight:900,color:"#fff",lineHeight:1.2,fontFamily:"Playfair Display",marginBottom:5}},isFlash?"Repaso combinado":"Casos clínicos combinados"),
          e("div",{style:{fontSize:12,color:C.tx,lineHeight:1.5}},
            isFlash?"Todas las flashcards oficiales de "+groupLabel+" + las que tú añadas. Filtra por tema, busca texto, alterna entre modo tarjeta y modo lista.":"Todos los casos clínicos de "+groupLabel+". Filtra por tema, alterna entre modo tarjeta (interactivo) y modo lista (vista rápida con respuestas)."
          )
        ),
        isFlash?e(GlobalFlashDeck,{group:group}):e(GlobalQuiz,{group:group})
      ),
      showTop?e("button",{onClick:top,style:{position:"fixed",bottom:22,right:18,width:46,height:46,borderRadius:"50%",background:hc,color:"#fff",border:"none",fontSize:18,cursor:"pointer",boxShadow:"0 8px 20px "+ax(hc,.45),zIndex:60}},"↑"):null
    );
  }

  var V=views[view];
  var tc=colors[view];
  return e("div",null,
    e("div",{style:{position:"sticky",top:0,zIndex:50,padding:"10px 14px",background:"rgba(6,10,20,.92)",backdropFilter:"blur(10px)",borderBottom:"1px solid "+C.bd,display:"flex",alignItems:"center",gap:10}},
      e("button",{onClick:back,style:{padding:"8px 12px",background:ax(tc,.15),border:"1px solid "+ax(tc,.35),color:tc,borderRadius:8,fontSize:12.5,fontWeight:700,cursor:"pointer"}},"← Neurosis"),
      e("div",{style:{flex:1,fontSize:12.5,fontWeight:800,color:tc,letterSpacing:.5,textAlign:"center"}},titles[view])
    ),
    e("div",{style:{padding:"14px 14px 90px",maxWidth:720,margin:"0 auto",animation:"fadeIn .3s"}},
      e(V,null)
    ),
    showTop?e("button",{onClick:top,style:{position:"fixed",bottom:22,right:18,width:46,height:46,borderRadius:"50%",background:tc,color:"#fff",border:"none",fontSize:18,cursor:"pointer",boxShadow:"0 8px 20px "+ax(tc,.45),zIndex:60}},"↑"):null
  );
}



// ─── ECEPT integration exposures ───
window.SaludMentalView = App;
window.SM_SEARCH_INDEX = SEARCH_INDEX;
})();
