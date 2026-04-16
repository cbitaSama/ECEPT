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
  // ── Trauma Unidad 1: native search entries (1 per sección) ──
  // Generated from TRAUMA_SECCIONES + keyword aliases for high-value topics
  // (e.g., "Neumotórax a Tensión", "Triada de Beck"). Each entry carries a
  // secId so the click handler can route directly into the right sección via
  // window._traumaFocus(secId) after vista flips to "trauma-u1".
  var TRAUMA_TOPIC_LABEL={gen:"Generalidades",via:"Vía Aérea",poli:"Politraumatizado",shock:"Shock",torax:"Tórax"};
  var TRAUMA_SEC_KW={
    "gen-1":"emergencia urgencia trauma policontuso politraumatizado definiciones",
    "gen-2":"deontologia consentimiento informado impericia negligencia imprudencia iatrogenia responsabilidad",
    "gen-3":"curva trimodal mortalidad hora de oro inmediata precoz tardia 50 30 20",
    "gen-4":"triage start colores rojo amarillo verde negro victimas masivas manchester extrahospitalario intrahospitalario",
    "via-1":"via aerea obstruccion lengua signos cianosis estridor tiraje",
    "via-2":"maniobras manuales subluxacion hiperextension traccion mandibular esmarch elevacion menton",
    "via-3":"canula guedel berman mayo orofaringea nasofaringea robertazzi faringea",
    "via-4":"intubacion endotraqueal tubo laringoscopio macintosh miller magill murphy hi-lo cuerdas vocales capnografia sellick complicaciones bronquio derecho",
    "via-5":"sir secuencia rapida intubacion midazolam morfina fentanilo succinilcolina flumazenil naloxona atropina vecuronio etomidato",
    "via-6":"cricotiroidotomia via aerea quirurgica membrana cricotiroidea mascara laringea LMA combitube",
    "via-7":"mallampati cormack lehane clasificacion via aerea dificil paladar uvula glotis",
    "poli-1":"trauma cerrado penetrante 80 20 pronostico evaluacion preparacion fast tac rx columna cervical torax pelvis",
    "poli-2":"distribucion trimodal mortalidad hora de oro picos 50 30 20",
    "poli-3":"prehospitalaria notificar inmovilizacion levanto y corro me quedo y actuo critico",
    "poli-4":"abcde abcdefg revision primaria airway breathing circulation disability exposure neumotorax aposito 3 lados orden multiples lesiones",
    "poli-5":"glasgow coma escala puntaje gcs apertura ocular respuesta motora verbal tec leve moderado grave intubar avdn",
    "poli-6":"revision secundaria ample alergias medicamentos patologias libaciones eventos sondas nasogastrica vesical lamina cribosa foley uretra mapache battle diuresis oximetria",
    "poli-7":"traslado log roll tabla espinal collar cervical inmovilizacion bloque normotermia",
    "sh-1":"shock hipoperfusion tisular oxigenacion celular metabolismo anaerobio lactato acidosis disfuncion bomba ionica",
    "sh-2":"fases shock noxa inicial preshock fom muerte compensada descompensada irreversible",
    "sh-3":"triada letal shock hipotermia acidosis coagulopatia 35 grados ph 730",
    "sh-4":"clasificacion shock tipos hipovolemico distributivo cardiogenico obstructivo septico anafilactico neurogenico iam tep taponamiento parametros hemodinamicos precarga gc rvp rvs",
    "sh-5":"trampas clinicas shock neurogenico medular espinal hipotension bradicardia hemotorax 1000 cardiogenico llenado pvc yugulares",
    "sh-6":"hemorragia clasificacion grados I II III IV taquicardia hipotension cristaloides hemoderivados secuestro sangre fractura femur pelvis tibia humero calculadora",
    "sh-7":"diagnostico shock taquicardia hipotension oliguria pvc presion venosa central pulso radial femoral carotideo PAS estimada",
    "sh-8":"manejo shock pam satO2 diuresis fluidoterapia ringer lactato transfusion 3 a 1 inotropicos vasopresores especifico hipovolemico septico cardiogenico obstructivo",
    "sh-9":"no hacer shock errores rx inestable inotropicos hipovolemico saltar ab sondas prematuras",
    "tx-1":"trauma torax definicion mecanismos cerrado penetrante aceleracion desaceleracion compresion electrocucion ippa caida 6 metros oxigeno suplementario",
    "tx-2":"6 lesiones letales torax obstruccion neumotorax tension neumotorax abierto hemotorax masivo volet costal taponamiento beck Triada de Beck pericardiocentesis 1500 toracotomia",
    "tx-3":"lesiones secundarias contusion pulmonar lesion traqueal neumotorax simple hemotorax mediastino aorta desaceleracion asfixia traumatica",
    "tx-4":"puntos anatomicos toracocentesis toracostomia pericardiocentesis cricotiroidotomia 2 eic 5 eic xifoides linea medio clavicular sello de agua mnemotecnia"
  };
  var TRAUMA_SEARCH=TRAUMA_SECCIONES.map(function(s){
    return {
      secId: s.id,
      name: s.title,
      sub:  "Trauma · " + (TRAUMA_TOPIC_LABEL[s.topic] || s.topic),
      kw:   TRAUMA_SEC_KW[s.id] || ""
    };
  });
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
    if(txt.indexOf(l)>-1) res.push({type:"trauma",name:"🩸 "+tt.name,sub:tt.sub,go:"trauma-u1",secId:tt.secId});
  });
  // Remove duplicates by name
  var seen={};var unique=[];
  res.forEach(function(r){if(!seen[r.name]){seen[r.name]=true;unique.push(r)}});
  return unique.slice(0,12);
}
