// ══════════════════════════════════════════════════════════════
// BÚSQUEDA GLOBAL
// ══════════════════════════════════════════════════════════════
function stripAccents(str){
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function globalSearch(q){
  if(!q||q.length<2) return [];
  var l=stripAccents(q.toLowerCase());var res=[];
  RD.forEach(function(d){
    var txt=stripAccents([d.n,d.cc.t].concat(d.cc.p||[]).concat(d.pe||[]).concat(d.ex.l||[]).concat([d.tx.p||"",d.tx.q||"",d.tx.b||""]).join(" ").toLowerCase());
    if(txt.indexOf(l)>-1) res.push({type:"enf",id:d.id,sec:d.s,name:"🦴 "+d.n,sub:"Reumatología",go:"reuma_dis"});
  });
  TR.forEach(function(t,i){
    var txt=stripAccents([t.nm,t.en].concat(t.cp).concat([t.dt]).join(" ").toLowerCase());
    if(txt.indexOf(l)>-1) res.push({type:"tri",idx:i,name:"🔺 "+t.nm,sub:t.en,go:"triadas"});
  });
  ABD_DATA.forEach(function(a){
    var txt=stripAccents([a.name,a.def].join(" ").toLowerCase());
    if(txt.indexOf(l)>-1) res.push({type:"abd",id:a.id,name:"🔪 "+a.name,sub:"Cirugía — Abdomen Agudo",go:"cir_abd"});
  });
  QUEM_PASOS.forEach(function(p){
    var txt=stripAccents([p.t].concat(p.items).join(" ").toLowerCase());
    if(txt.indexOf(l)>-1) res.push({type:"quem",name:"🔥 "+p.t,sub:"Emergenciología — Quemaduras",go:"cir_quem"});
  });
  ESTUDIOS.forEach(function(est){
    var txt=stripAccents([est.nombre,est.def,est.tipo].join(" ").toLowerCase());
    if(txt.indexOf(l)>-1) res.push({type:"epid",name:"📊 "+est.nombre,sub:"Epidemiología",go:"epid"});
  });
  SESGOS.forEach(function(sg){
    var txt=stripAccents([sg.nombre,sg.def].join(" ").toLowerCase());
    if(txt.indexOf(l)>-1) res.push({type:"epid",name:"📊 "+sg.nombre,sub:"Epidemiología — Sesgos",go:"epid"});
  });
  PIRAMIDE.forEach(function(p){
    var txt=stripAccents([p.nombre,p.desc,p.para,p.medida,p.ejemplo].join(" ").toLowerCase());
    if(txt.indexOf(l)>-1) res.push({type:"epid",name:"🔺 "+p.nombre,sub:"Epidemiología — Pirámide de Evidencia",go:"epid"});
  });
  MEDIDAS_EPI.forEach(function(m){
    var txt=stripAccents([m.nombre,m.formula,m.desc,m.regla].join(" ").toLowerCase());
    if(txt.indexOf(l)>-1) res.push({type:"epid",name:"📐 "+m.nombre,sub:"Epidemiología — Medidas",go:"epid"});
  });
  CHECKLIST_LC.forEach(function(ck){
    var txt=stripAccents([ck.pregunta,ck.detalle].join(" ").toLowerCase());
    if(txt.indexOf(l)>-1) res.push({type:"epid",name:"✅ "+ck.pregunta,sub:"Epidemiología — Lectura Crítica",go:"epid"});
  });
  LAB_SECTIONS.forEach(function(ls){
    var txt=stripAccents([ls.label,ls.subtitle].join(" ").toLowerCase());
    ls.analytes.forEach(function(an){txt+=stripAccents((" "+an.name+" "+an.range+" "+(an.note||"")).toLowerCase())});
    if(txt.indexOf(l)>-1) res.push({type:"lab",name:"📊 "+ls.label,sub:"Laboratorios",go:"labs"});
  });
  NERVES.forEach(function(n){
    var txt=stripAccents([n.name,n.latin,n.funcion,n.lesion].join(" ").toLowerCase());
    if(txt.indexOf(l)>-1) res.push({type:"nc",name:"🧠 Par "+n.id+" — "+n.name,sub:"Anatomía — Pares Craneales",go:"anatomia"});
  });
  var ingTxt=stripAccents([].concat(ING_PAREDES.map(function(w){return w.nombre+" "+w.estructura+" "+w.detalle})).concat([ING_SUPERFICIAL.formacion,ING_SUPERFICIAL.clinica]).concat(ING_SUPERFICIAL.pilares.map(function(p){return p.n+" "+p.d})).concat([ING_PROFUNDO.formacion,ING_PROFUNDO.ubicacion,ING_PROFUNDO.clinica]).concat(ING_PROFUNDO.componentes.map(function(c){return c.n+" "+c.d})).concat(ING_CORDON.elementos.map(function(el){return el.n+" "+el.d})).concat([ING_CORDON.nota_mujer,"conducto inguinal anillo inguinal cordón espermático hernia inguinal"]).join(" ").toLowerCase());
  if(ingTxt.indexOf(l)>-1) res.push({type:"ing",name:"🧱 Conducto Inguinal",sub:"Anatomía — Conducto Inguinal",go:"cir_ing"});
  COAG_FACTORES.forEach(function(cf){
    var txt=stripAccents([cf.num,cf.nombre,cf.alt||""].join(" ").toLowerCase());
    if(txt.indexOf(l)>-1) res.push({type:"coag",name:"🩸 Factor "+cf.num+" — "+cf.nombre,sub:"Generalidades — Coagulación",go:"general"});
  });
  FISIO_RECEPTORS.forEach(function(r){
    var txt=stripAccents([r.name,r.symbol,r.protein,r.clinical].concat(r.effects.map(function(ef){return ef.desc})).join(" ").toLowerCase());
    if(txt.indexOf(l)>-1) res.push({type:"fisio",name:"🔬 "+r.symbol+" "+r.name,sub:"Fisiología — Receptores",go:"fisio"});
  });
  FISIO_PERLAS.forEach(function(fp){
    var txt=stripAccents([fp.t].concat(fp.items).join(" ").toLowerCase());
    if(txt.indexOf(l)>-1) res.push({type:"fisio",name:"🔬 "+fp.t,sub:"Fisiología — Perlas",go:"fisio"});
  });
  INT.s.forEach(function(s){
    var txt=stripAccents([s.t,s.x||""].concat(s.p).join(" ").toLowerCase());
    if(txt.indexOf(l)>-1) res.push({type:"inm",name:"🛡️ "+s.t,sub:"Generalidades — Inmunología",go:"general"});
  });
  // ── Trauma Unidad 1: sub-topic search entries ──
  var TRAUMA_SEARCH=[
    // Generalidades
    {name:"Generalidades y Deontología",sub:"Trauma · Generalidades",kw:"emergencia urgencia definiciones trauma policontuso politraumatizado deontologia"},
    {name:"Consentimiento Informado",sub:"Trauma · Generalidades",kw:"consentimiento informado explicito implicito deontologia autonomia"},
    {name:"Responsabilidad Profesional",sub:"Trauma · Generalidades",kw:"impericia negligencia imprudencia iatrogenia responsabilidad"},
    {name:"Curva Trimodal de Mortalidad",sub:"Trauma · Generalidades",kw:"curva trimodal mortalidad hora de oro inmediata precoz tardia"},
    {name:"Triage START",sub:"Trauma · Generalidades",kw:"triage start colores rojo amarillo verde negro victimas masivas manchester extrahospitalario intrahospitalario"},
    // Vía Aérea
    {name:"Manejo de la Vía Aérea",sub:"Trauma · Vía Aérea",kw:"via aerea obstruccion lengua manejo apertura"},
    {name:"Maniobras Manuales",sub:"Trauma · Vía Aérea",kw:"subluxacion hiperextension traccion mandibular esmarch maniobra manual"},
    {name:"Cánulas Faríngeas",sub:"Trauma · Vía Aérea",kw:"canula guedel berman mayo orofaringea nasofaringea faringea"},
    {name:"Intubación Endotraqueal",sub:"Trauma · Vía Aérea",kw:"intubacion endotraqueal tubo laringoscopio macintosh miller magill murphy hi-lo"},
    {name:"Secuencia Rápida de Intubación — SIR",sub:"Trauma · Vía Aérea",kw:"sir secuencia rapida intubacion midazolam succinilcolina fentanilo propofol ketamina"},
    {name:"Cricotiroidotomía",sub:"Trauma · Vía Aérea",kw:"cricotiroidotomia via aerea quirurgica membrana cricotiroidea"},
    {name:"Mallampati y Cormack-Lehane",sub:"Trauma · Vía Aérea",kw:"mallampati cormack lehane clasificacion via aerea dificil"},
    // Politraumatizado
    {name:"ABCDE del Trauma",sub:"Trauma · Politraumatizado",kw:"abcde abcdefg revision primaria primary survey airway breathing circulation disability exposure"},
    {name:"Escala de Glasgow",sub:"Trauma · Politraumatizado",kw:"glasgow coma escala puntaje gcs apertura ocular respuesta motora verbal tec"},
    {name:"Revisión Secundaria y AMPLE",sub:"Trauma · Politraumatizado",kw:"revision secundaria ample alergias medicamentos antecedentes ultima comida"},
    {name:"Sonda Nasogástrica y Vesical",sub:"Trauma · Politraumatizado",kw:"sonda nasogastrica vesical lamina cribosa foley"},
    {name:"Radiografías de Revisión Primaria",sub:"Trauma · Politraumatizado",kw:"radiografia rx cervical torax pelvis revision primaria"},
    {name:"Traslado y Log-Roll",sub:"Trauma · Politraumatizado",kw:"traslado log roll tabla espinal collar cervical inmovilizacion"},
    // Shock
    {name:"Tipos de Shock",sub:"Trauma · Shock",kw:"shock hipovolemico distributivo cardiogenico obstructivo tipos clasificacion"},
    {name:"Shock Neurogénico",sub:"Trauma · Shock",kw:"shock neurogenico hipotension bradicardia medular espinal vasodilatacion"},
    {name:"Clasificación Hemorrágica",sub:"Trauma · Shock",kw:"hemorragia clasificacion hemorrágica grados sangrado taquicardia clase i ii iii iv perdida sanguinea"},
    {name:"Tríada Letal del Trauma",sub:"Trauma · Shock",kw:"triada letal hipotermia acidosis coagulopatia"},
    {name:"Reanimación con Líquidos",sub:"Trauma · Shock",kw:"reanimacion liquidos cristaloides ringer lactato transfusion volumen"},
    {name:"Parámetros Hemodinámicos",sub:"Trauma · Shock",kw:"hemodinamico precarga pvc gasto cardiaco postcarga"},
    // Tórax
    {name:"Lesiones Letales del Tórax",sub:"Trauma · Tórax",kw:"lesiones letales torax seis seis letales"},
    {name:"Neumotórax a Tensión",sub:"Trauma · Tórax",kw:"neumotorax tension desviacion traqueal timpanismo aguja descompresion segundo espacio intercostal"},
    {name:"Neumotórax Abierto",sub:"Trauma · Tórax",kw:"neumotorax abierto aspirante aposito tres lados herida soplante"},
    {name:"Hemotórax Masivo",sub:"Trauma · Tórax",kw:"hemotorax masivo toracotomia drenaje 1500 sangre"},
    {name:"Volet Costal",sub:"Trauma · Tórax",kw:"volet costal torax inestable contusion pulmonar respiracion paradojica fracturas costales"},
    {name:"Taponamiento Cardíaco",sub:"Trauma · Tórax",kw:"taponamiento cardiaco beck pericardiocentesis triada ingurgitacion yugular ruidos hipotension"},
    {name:"Contusión Pulmonar",sub:"Trauma · Tórax",kw:"contusion pulmonar trauma torax parenquima"},
    {name:"Asfixia Traumática",sub:"Trauma · Tórax",kw:"asfixia traumatica petequias compresion toracica cianosis"},
    {name:"Puntos Anatómicos de Emergencia",sub:"Trauma · Tórax",kw:"puntos anatomicos toracocentesis toracostomia pericardiocentesis cricotiroidotomia 2 eic 5 eic xifoides linea medio clavicular"},
    {name:"Drenaje Bajo Sello de Agua",sub:"Trauma · Tórax",kw:"drenaje sello de agua tubo toracico pleurevac"},
    {name:"Toracotomía de Resucitación",sub:"Trauma · Tórax",kw:"toracotomia resucitacion anterolateral clampeo aorta"},
    {name:"Lesión Aórtica",sub:"Trauma · Tórax",kw:"lesion aortica mediastino desaceleracion ensanchamiento"}
  ];
  // ── Vocabulario Médico: sub-topic search entries ──
  var VOCAB_SEARCH=[
    {name:"Vocabulario Médico",sub:"Generalidades",kw:"vocabulario medico raices prefijos sufijos etimologia"},
    {name:"Acción Quirúrgica — Sufijos",sub:"Vocabulario · Quirúrgica",kw:"tomia ectomia stomia rrafia plastia pexia desis tripsia lisis centesis scopia"},
    {name:"Diagnóstico — Sufijos",sub:"Vocabulario · Diagnóstico",kw:"scopia grafia grama metria"},
    {name:"Patología — Raíces",sub:"Vocabulario · Patología",kw:"itis osis oma emia penia algia dinia astenia plegia paresia fobia"},
    {name:"Colores Celulares",sub:"Vocabulario · Colores",kw:"leuco eritro melano ciano cloro xanto polio cromo"},
    {name:"Sangre y Vasos",sub:"Vocabulario · Sangre",kw:"hemo hemato angio vaso flebos arterio trombo"},
    {name:"Raíces de Órganos",sub:"Vocabulario · Órganos",kw:"cardio neumo hepato nefro gastro entero osteo mio dermato oftalmo oto rino"},
    {name:"Genitourinario",sub:"Vocabulario · GU",kw:"nefro cistro uretro litro orqui colpo histero salpingo ooforo"},
    {name:"Endocrino",sub:"Vocabulario · Endocrino",kw:"adeno tiro insulino gluco cortico"},
    {name:"Decodificador de Palabras",sub:"Vocabulario · Herramienta",kw:"decodificador decoder descomponer palabra medica raiz"},
    {name:"Quiz de Vocabulario",sub:"Vocabulario · Quiz",kw:"quiz vocabulario practica examen raices"},
    {name:"Demos Anatómicos",sub:"Vocabulario · Demos",kw:"demo anatomico cuello corazon abdomen interactivo svg"}
  ];
  VOCAB_SEARCH.forEach(function(vv){
    var txt=stripAccents([vv.name,vv.sub,vv.kw].join(" ").toLowerCase());
    if(txt.indexOf(l)>-1) res.push({type:"vocab",name:"📖 "+vv.name,sub:vv.sub,go:"vocabulario"});
  });
  TRAUMA_SEARCH.forEach(function(tt){
    var txt=stripAccents([tt.name,tt.sub,tt.kw].join(" ").toLowerCase());
    if(txt.indexOf(l)>-1) res.push({type:"trauma",name:"🩸 "+tt.name,sub:tt.sub,go:"trauma-u1"});
  });
  // Remove duplicates by name
  var seen={};var unique=[];
  res.forEach(function(r){if(!seen[r.name]){seen[r.name]=true;unique.push(r)}});
  return unique.slice(0,12);
}
