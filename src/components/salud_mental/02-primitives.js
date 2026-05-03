// ══════════════════════════════════════════════════════════════
// PRIMITIVAS — orientadas a lectura densa y explícita
// ══════════════════════════════════════════════════════════════

// Título de sección principal (H2)
function H2(p){
  var c=p.c||C.tx;
  return e("h2",{style:{fontSize:23,fontWeight:800,color:c,marginTop:p.mt||32,marginBottom:12,letterSpacing:.2,lineHeight:1.2,paddingBottom:8,borderBottom:"2px solid "+ax(c,.12)}},p.children);
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
  return e("div",{style:{padding:"14px 16px",background:"linear-gradient(135deg,"+ax(c,.1)+","+C.cd+" 90%)",border:"1px solid "+ax(c,.12),borderLeft:"4px solid "+c,borderRadius:10,margin:"8px 0 14px"}},
    e("div",{style:{fontSize:10.5,fontWeight:800,color:c,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}},"📖 Definición"),
    e("div",{className:"prose",style:{fontSize:14}},p.children)
  );
}

// Fila explícita de criterio DSM (estática, sin interactividad)
function Crit(p){
  var c=p.c||C.anx;
  return e("div",{style:{display:"flex",gap:12,padding:"11px 13px",background:C.cd,border:"1px solid "+C.bd,borderLeft:"4px solid "+c,borderRadius:8,margin:"6px 0",alignItems:"flex-start"}},
    e("div",{style:{minWidth:34,height:34,borderRadius:7,background:ax(c,.18),color:c,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,border:"1px solid "+ax(c,.12)}},p.crit),
    e("div",{style:{fontSize:13.5,lineHeight:1.55,color:C.tx,flex:1,paddingTop:4}},p.children)
  );
}

// Bloque de criterios con título "Criterios DSM-5-TR"
function CritBlock(p){
  var c=p.c||C.anx;
  return e("div",{style:{margin:"10px 0 14px"}},
    e("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:8,padding:"8px 12px",background:ax(c,.12),border:"1px solid "+ax(c,.12),borderRadius:8}},
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
      p.dur?e("div",{style:{fontSize:10.5,fontWeight:700,color:c,background:ax(c,.14),padding:"3px 8px",borderRadius:5,border:"1px solid "+ax(c,.12),letterSpacing:.3,whiteSpace:"nowrap"}},"⏱ "+p.dur):null
    ),
    e("div",{style:{fontSize:13.5,lineHeight:1.55,color:C.tx}},p.children)
  );
}


