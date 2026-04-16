// ══════════════════════════════════════════════════════════════
// BÚSQUEDA GLOBAL
// ══════════════════════════════════════════════════════════════
function globalSearch(q){
  if(!q||q.length<2) return [];
  var l=q.toLowerCase();var res=[];
  RD.forEach(function(d){
    var txt=[d.n,d.cc.t].concat(d.cc.p||[]).concat(d.pe||[]).concat(d.ex.l||[]).concat([d.tx.p||"",d.tx.q||"",d.tx.b||""]).join(" ").toLowerCase();
    if(txt.indexOf(l)>-1) res.push({type:"enf",id:d.id,sec:d.s,name:"🦴 "+d.n,sub:"Reumatología",go:"reuma_dis"});
  });
  TR.forEach(function(t,i){
    var txt=[t.nm,t.en].concat(t.cp).concat([t.dt]).join(" ").toLowerCase();
    if(txt.indexOf(l)>-1) res.push({type:"tri",idx:i,name:"🔺 "+t.nm,sub:t.en,go:"triadas"});
  });
  ABD_DATA.forEach(function(a){
    var txt=[a.name,a.def].join(" ").toLowerCase();
    if(txt.indexOf(l)>-1) res.push({type:"abd",id:a.id,name:"🔪 "+a.name,sub:"Cirugía — Abdomen Agudo",go:"cir_abd"});
  });
  QUEM_PASOS.forEach(function(p){
    var txt=[p.t].concat(p.items).join(" ").toLowerCase();
    if(txt.indexOf(l)>-1) res.push({type:"quem",name:"🔥 "+p.t,sub:"Emergenciología — Quemaduras",go:"cir_quem"});
  });
  ESTUDIOS.forEach(function(est){
    var txt=[est.nombre,est.def,est.tipo].join(" ").toLowerCase();
    if(txt.indexOf(l)>-1) res.push({type:"epid",name:"📊 "+est.nombre,sub:"Epidemiología",go:"epid"});
  });
  SESGOS.forEach(function(sg){
    var txt=[sg.nombre,sg.def].join(" ").toLowerCase();
    if(txt.indexOf(l)>-1) res.push({type:"epid",name:"📊 "+sg.nombre,sub:"Epidemiología — Sesgos",go:"epid"});
  });
  PIRAMIDE.forEach(function(p){
    var txt=[p.nombre,p.desc,p.para,p.medida,p.ejemplo].join(" ").toLowerCase();
    if(txt.indexOf(l)>-1) res.push({type:"epid",name:"🔺 "+p.nombre,sub:"Epidemiología — Pirámide de Evidencia",go:"epid"});
  });
  MEDIDAS_EPI.forEach(function(m){
    var txt=[m.nombre,m.formula,m.desc,m.regla].join(" ").toLowerCase();
    if(txt.indexOf(l)>-1) res.push({type:"epid",name:"📐 "+m.nombre,sub:"Epidemiología — Medidas",go:"epid"});
  });
  CHECKLIST_LC.forEach(function(ck){
    var txt=[ck.pregunta,ck.detalle].join(" ").toLowerCase();
    if(txt.indexOf(l)>-1) res.push({type:"epid",name:"✅ "+ck.pregunta,sub:"Epidemiología — Lectura Crítica",go:"epid"});
  });
  LAB_SECTIONS.forEach(function(ls){
    var txt=[ls.label,ls.subtitle].join(" ").toLowerCase();
    ls.analytes.forEach(function(an){txt+=(" "+an.name+" "+an.range+" "+(an.note||"")).toLowerCase()});
    if(txt.indexOf(l)>-1) res.push({type:"lab",name:"📊 "+ls.label,sub:"Laboratorios",go:"labs"});
  });
  NERVES.forEach(function(n){
    var txt=[n.name,n.latin,n.funcion,n.lesion].join(" ").toLowerCase();
    if(txt.indexOf(l)>-1) res.push({type:"nc",name:"🧠 Par "+n.id+" — "+n.name,sub:"Anatomía — Pares Craneales",go:"anatomia"});
  });
  var ingTxt=[].concat(ING_PAREDES.map(function(w){return w.nombre+" "+w.estructura+" "+w.detalle})).concat([ING_SUPERFICIAL.formacion,ING_SUPERFICIAL.clinica]).concat(ING_SUPERFICIAL.pilares.map(function(p){return p.n+" "+p.d})).concat([ING_PROFUNDO.formacion,ING_PROFUNDO.ubicacion,ING_PROFUNDO.clinica]).concat(ING_PROFUNDO.componentes.map(function(c){return c.n+" "+c.d})).concat(ING_CORDON.elementos.map(function(el){return el.n+" "+el.d})).concat([ING_CORDON.nota_mujer,"conducto inguinal anillo inguinal cordón espermático hernia inguinal"]).join(" ").toLowerCase();
  if(ingTxt.indexOf(l)>-1) res.push({type:"ing",name:"🧱 Conducto Inguinal",sub:"Anatomía — Conducto Inguinal",go:"cir_ing"});
  COAG_FACTORES.forEach(function(cf){
    var txt=[cf.num,cf.nombre,cf.alt||""].join(" ").toLowerCase();
    if(txt.indexOf(l)>-1) res.push({type:"coag",name:"🩸 Factor "+cf.num+" — "+cf.nombre,sub:"Generalidades — Coagulación",go:"general"});
  });
  FISIO_RECEPTORS.forEach(function(r){
    var txt=[r.name,r.symbol,r.protein,r.clinical].concat(r.effects.map(function(ef){return ef.desc})).join(" ").toLowerCase();
    if(txt.indexOf(l)>-1) res.push({type:"fisio",name:"🔬 "+r.symbol+" "+r.name,sub:"Fisiología — Receptores",go:"fisio"});
  });
  FISIO_PERLAS.forEach(function(fp){
    var txt=[fp.t].concat(fp.items).join(" ").toLowerCase();
    if(txt.indexOf(l)>-1) res.push({type:"fisio",name:"🔬 "+fp.t,sub:"Fisiología — Perlas",go:"fisio"});
  });
  INT.s.forEach(function(s){
    var txt=[s.t,s.x||""].concat(s.p).join(" ").toLowerCase();
    if(txt.indexOf(l)>-1) res.push({type:"inm",name:"🛡️ "+s.t,sub:"Generalidades — Inmunología",go:"general"});
  });
  // Trauma Unidad 1 (embedded artifact) — keyword match for module-level entry
  var traumaKw="trauma vía aérea politraumatizado shock tórax glasgow intubación ABCDE ABCDEFG neumotórax hemotórax taponamiento Beck pericardiocentesis triage START lesiones letales deontología curva trimodal Ringer hemorrágico neurogénico cricotiroidotomía volet costal contusión pulmonar asfixia traumática Mallampati Cormack SIR midazolam succinilcolina fentanilo".toLowerCase();
  if(traumaKw.indexOf(l)>-1) res.push({type:"trauma",name:"🩸 Trauma — Unidad 1",sub:"Emergenciología",go:"trauma-u1"});
  // Trauma sub-topics — individual topic search entries
  var traumaTopics=[
    {name:"Glasgow — Escala de Coma",sub:"Trauma · Politraumatizado",kw:"glasgow escala coma gcs apertura ocular respuesta motora verbal"},
    {name:"Shock Hipovolémico",sub:"Trauma · Shock",kw:"shock hipovolémico hemorrágico clase i ii iii iv volumen cristaloides"},
    {name:"Shock Neurogénico",sub:"Trauma · Shock",kw:"shock neurogénico medular bradicardia hipotensión vasodilatación"},
    {name:"Neumotórax a Tensión",sub:"Trauma · Tórax",kw:"neumotórax tensión desviación tráquea aguja descompresión"},
    {name:"Hemotórax Masivo",sub:"Trauma · Tórax",kw:"hemotórax masivo drenaje tubo toracostomía"},
    {name:"Taponamiento Cardíaco",sub:"Trauma · Tórax",kw:"taponamiento cardíaco beck pericardiocentesis"},
    {name:"Tríada de Beck",sub:"Trauma · Tórax",kw:"beck hipotensión ruidos cardíacos ingurgitación yugular"},
    {name:"Tríada Letal del Trauma",sub:"Trauma · Shock",kw:"tríada letal hipotermia acidosis coagulopatía"},
    {name:"ABCDE del Trauma",sub:"Trauma · Politraumatizado",kw:"abcde vía aérea breathing circulación disability exposición"},
    {name:"Intubación Endotraqueal",sub:"Trauma · Vía Aérea",kw:"intubación endotraqueal laringoscopia mallampati cormack"},
    {name:"Cricotiroidotomía",sub:"Trauma · Vía Aérea",kw:"cricotiroidotomía membrana cricotiroidea emergencia vía aérea quirúrgica"},
    {name:"Triage START",sub:"Trauma · Generalidades",kw:"triage start rojo amarillo verde negro víctimas masivas"},
    {name:"Pericardiocentesis",sub:"Trauma · Tórax",kw:"pericardiocentesis subxifoideo punción pericárdica"},
    {name:"Toracocentesis",sub:"Trauma · Tórax",kw:"toracocentesis punción torácica drenaje pleural"},
    {name:"Clasificación Hemorrágica",sub:"Trauma · Shock",kw:"clasificación hemorrágica clase i ii iii iv pérdida sanguínea"},
    {name:"Secuencia Rápida de Intubación",sub:"Trauma · Vía Aérea",kw:"secuencia rápida intubación sir midazolam succinilcolina fentanilo propofol"},
    {name:"Lesiones Letales del Tórax",sub:"Trauma · Tórax",kw:"lesiones letales tórax neumotórax hemotórax taponamiento volet"},
    {name:"Volet Costal",sub:"Trauma · Tórax",kw:"volet costal tórax inestable respiración paradójica fracturas costales"},
    {name:"Curva Trimodal de Mortalidad",sub:"Trauma · Generalidades",kw:"curva trimodal mortalidad inmediata precoz tardía"},
    {name:"Consentimiento Informado",sub:"Trauma · Generalidades",kw:"consentimiento informado deontología ética autonomía"},
    {name:"Puntos Anatómicos de Emergencia",sub:"Trauma · Tórax",kw:"puntos anatómicos emergencia línea medio clavicular segundo espacio"}
  ];
  traumaTopics.forEach(function(tt){
    if(tt.kw.indexOf(l)>-1) res.push({type:"trauma",name:"🩸 "+tt.name,sub:tt.sub,go:"trauma-u1"});
  });
  // Remove duplicates by name
  var seen={};var unique=[];
  res.forEach(function(r){if(!seen[r.name]){seen[r.name]=true;unique.push(r)}});
  return unique.slice(0,12);
}
