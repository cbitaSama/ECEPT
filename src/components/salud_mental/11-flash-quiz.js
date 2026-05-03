// Flashcards de estudio · tarjeta con pregunta, toca para voltear y ver respuesta
// Soporta añadir/editar/eliminar tarjetas del usuario con persistencia en localStorage
function FlashDeck(p){
  if(SM_goFlashcards&&SM_SUPABASE_DECKS&&SM_SUPABASE_DECKS[p.deckId]){
    return e(SM_FlashBridge,{deckId:p.deckId,goFlashcards:SM_goFlashcards});
  }
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
          e("div",{style:{fontSize:16,fontWeight:900,color:"#fff",fontFamily:"Inter,DM Sans",flex:1}},editingIdx===null?"Nueva flashcard":"Editar flashcard"),
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
      e("div",{style:{fontFamily:"Inter,DM Sans",fontSize:28,fontWeight:900,color:c,marginBottom:4}},score+" / "+p.items.length),
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

