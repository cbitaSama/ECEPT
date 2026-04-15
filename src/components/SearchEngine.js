// Global search across all modules
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
  LAB_SECTIONS.forEach(function(ls){
    var txt=[ls.label,ls.subtitle].join(" ").toLowerCase();
    ls.analytes.forEach(function(an){txt+=(" "+an.name+" "+an.range+" "+(an.note||"")).toLowerCase()});
    if(txt.indexOf(l)>-1) res.push({type:"lab",name:"📊 "+ls.label,sub:"Laboratorios",go:"labs"});
  });
  NERVES.forEach(function(n){
    var txt=[n.n,n.desc,n.lesion,n.origen_real,n.origen_aparente].concat(n.ramas||[]).join(" ").toLowerCase();
    if(txt.indexOf(l)>-1) res.push({type:"nc",name:"🧠 Par "+n.num+" — "+n.n,sub:"Anatomía — Pares Craneales",go:"anat"});
  });
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
  // Remove duplicates by name
  var seen={};var unique=[];
  res.forEach(function(r){if(!seen[r.name]){seen[r.name]=true;unique.push(r)}});
  return unique.slice(0,12);
}
