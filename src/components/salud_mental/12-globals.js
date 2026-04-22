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
              if(isCorrect){bg=ax(C.ok,.15);bd=C.ok;color=C.ok;}
              else if(isPicked){bg=ax(C.bad,.15);bd=C.bad;color=C.bad;}
            }
            return e("button",{key:i,onClick:function(){sel(i);},disabled:pick!==null,style:{padding:"10px 12px",background:bg,border:"1px solid "+bd,color:color,borderRadius:8,textAlign:"left",fontSize:13,fontWeight:isPicked||isCorrect?700:500,cursor:pick===null?"pointer":"default",lineHeight:1.45}},
              String.fromCharCode(65+i)+". "+opt
            );
          })
        ),
        pick!==null?e("div",{style:{marginTop:12,padding:"11px 13px",background:ax(C.ok,.1),border:"1px solid "+ax(C.ok,.3),borderRadius:8}},
          e("div",{style:{fontSize:10,fontWeight:800,color:C.ok,letterSpacing:1.4,textTransform:"uppercase",marginBottom:5}},"💡 Explicación"),
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
            showAllAns?e("div",{style:{marginTop:9,padding:"8px 11px",background:ax(C.ok,.1),border:"1px solid "+ax(C.ok,.3),borderRadius:7}},
              e("span",{style:{fontSize:9.5,fontWeight:800,color:C.ok,letterSpacing:1.3,textTransform:"uppercase",marginRight:6}},"✓ Respuesta"),
              e("span",{style:{fontSize:12.5,color:C.tx,lineHeight:1.5}},correctAnswer)
            ):null
          );
        })
      )
    ):null
  );
}



