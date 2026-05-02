// ══════════════════════════════════════════════════════════════
// DECK DETAIL VIEW — listado de flashcards de una baraja
// ──────────────────────────────────────────────────────────────
// ES5 estricto: solo declaraciones var y function. Nada de ES6+.
// React.createElement vía el alias global `e`. Sin JSX.
// Globales internos con prefijo DD_ para evitar colisiones.
// Props: user, deck, onBack, go
// ══════════════════════════════════════════════════════════════
var DD_styleInjected=false;
var DD_DECK_COLORS=["#a78bfa","#60a5fa","#34d399","#fbbf24","#f472b6","#ef4444","#06b6d4","#fb923c","#8b5cf6","#10b981","#ec4899","#84cc16"];

function DD_previewText(text,type){
  if(!text) return "";
  var stripped=(type==="cloze") ? text.replace(/\{\{c\d+::(.*?)\}\}/g,"$1") : text;
  if(stripped.length>100) return stripped.substring(0,97)+"...";
  return stripped;
}

function DD_clozeEl(text){
  var parts=[];
  var re=/\{\{c\d+::(.*?)\}\}/g;
  var last=0,match,idx=0;
  while((match=re.exec(text))!==null){
    if(match.index>last) parts.push(e("span",{key:"t"+idx++},text.slice(last,match.index)));
    parts.push(e("span",{key:"c"+idx++,style:{
      display:"inline-block",padding:"1px 6px",borderRadius:"4px",
      background:"rgba(251,191,36,.18)",border:"1px solid rgba(251,191,36,.35)",
      color:"#fbbf24",fontWeight:700,fontSize:"11px",margin:"0 1px"
    }},"..."));
    last=re.lastIndex;
  }
  if(last<text.length) parts.push(e("span",{key:"t"+idx++},text.slice(last)));
  return parts.length ? e("span",null,parts) : e("span",null,text||"");
}

// Preview modal cloze renderer — handles both {{c1::word}} and }}word}} formats.
// hidden=true → blanks shown as [...]  hidden=false → answers revealed in green.
function DD_previewClozeEl(text,hidden){
  if(!text) return e("span",null,"");
  var regex=/\{\{c\d+::(.*?)\}\}|\}\}(.*?)\}\}/g;
  var parts=[]; var lastIndex=0; var match; var idx=0;
  while((match=regex.exec(text))!==null){
    if(match.index>lastIndex) parts.push(text.substring(lastIndex,match.index));
    var answer=match[1]!==undefined?match[1]:match[2];
    if(hidden){
      parts.push(e("span",{key:"cl-"+idx,style:{
        display:"inline-block",padding:"1px 8px",borderRadius:"5px",
        background:"rgba(251,191,36,.2)",border:"1px solid rgba(251,191,36,.4)",
        color:"#fbbf24",fontWeight:700,margin:"0 2px"
      }},"[...]"));
    } else {
      parts.push(e("span",{key:"cl-"+idx,style:{color:"#34d399",fontWeight:700}},answer));
    }
    lastIndex=match.index+match[0].length;
    idx++;
  }
  if(lastIndex<text.length) parts.push(text.substring(lastIndex));
  if(parts.length===0) return e("span",null,text);
  return e("span",null,parts);
}

function DD_clozeReveal(text){
  if(!text) return "";
  return text.replace(/\{\{c\d+::(.*?)\}\}|\}\}(.*?)\}\}/g,function(m,g1,g2){ return g1!==undefined?g1:g2; });
}

function DD_clozeBlank(text){
  if(!text) return "";
  return text.replace(/\{\{c\d+::([^}]+)\}\}|\}\}([^}]+)\}\}/g,"_____");
}

function DeckDetailView(props){
  var user=props.user;
  var deck=props.deck;
  var go=props.go;
  var s;

  s=useState(true);  var DD_loading=s[0],     DD_setLoading=s[1];
  s=useState([]);    var DD_cards=s[0],       DD_setCards=s[1];
  s=useState({});    var DD_progress=s[0],    DD_setProgress=s[1];
  s=useState("");    var DD_loadErr=s[0],     DD_setLoadErr=s[1];
  s=useState("");    var DD_search=s[0],      DD_setSearch=s[1];
  s=useState([]);    var DD_selectedTags=s[0],DD_setSelectedTags=s[1];
  s=useState(null);  var DD_menuOpenId=s[0],  DD_setMenuOpenId=s[1];
  s=useState(null);  var DD_deleteConfirmId=s[0], DD_setDeleteConfirmId=s[1];
  s=useState(false); var DD_showEditor=s[0],  DD_setShowEditor=s[1];
  s=useState(null);  var DD_editCard=s[0],    DD_setEditCard=s[1];
  s=useState({});    var DD_userCardTags=s[0],  DD_setUserCardTags=s[1];
  s=useState([]);    var DD_userTagsList=s[0],   DD_setUserTagsList=s[1];
  s=useState(null);  var DD_addTagCardId=s[0],   DD_setAddTagCardId=s[1];
  s=useState("");    var DD_addTagInput=s[0],    DD_setAddTagInput=s[1];
  s=useState(false); var DD_addTagSaving=s[0],   DD_setAddTagSaving=s[1];
  s=useState(null);  var DD_previewIdx=s[0],     DD_setPreviewIdx=s[1];
  s=useState(false); var DD_previewFlipped=s[0], DD_setPreviewFlipped=s[1];
  var DD_swipeStartY=useRef(null);
  var DD_filteredRef=useRef([]);
  var DD_storageKey=deck?('ECEPT_DECK_'+deck.id+'_SHOW_ANSWERS'):'';
  s=useState(function(){
    try{ return localStorage.getItem(DD_storageKey)==='true'; }catch(ex){ return false; }
  });
  var DD_showAnswers=s[0],   DD_setShowAnswers=s[1];
  s=useState(null);    var DD_copyCard=s[0],      DD_setCopyCard=s[1];
  s=useState([]);      var DD_ownDecks=s[0],      DD_setOwnDecks=s[1];
  s=useState('');      var DD_copyDeckId=s[0],    DD_setCopyDeckId=s[1];
  s=useState('');      var DD_copyNewName=s[0],   DD_setCopyNewName=s[1];
  s=useState('select');var DD_copyMode=s[0],      DD_setCopyMode=s[1];
  s=useState(false);   var DD_copyLoading=s[0],   DD_setCopyLoading=s[1];
  s=useState(false);   var DD_copySuccess=s[0],   DD_setCopySuccess=s[1];
  s=useState(false);   var DD_selectMode=s[0],    DD_setSelectMode=s[1];
  s=useState({});      var DD_selectedIds=s[0],   DD_setSelectedIds=s[1];
  s=useState(false);   var DD_bulkDelConfirm=s[0],DD_setBulkDelConfirm=s[1];
  s=useState("");      var DD_bulkMsg=s[0],        DD_setBulkMsg=s[1];
  s=useState(null);    var DD_bulkAction=s[0],     DD_setBulkAction=s[1];
  s=useState("");      var DD_bulkTargetDeckId=s[0],DD_setBulkTargetDeckId=s[1];
  s=useState(false);   var DD_bulkLoading=s[0],    DD_setBulkLoading=s[1];
  s=useState("");      var DD_bulkErrMsg=s[0],     DD_setBulkErrMsg=s[1];
  s=useState(null);    var DD_deckMeta=s[0],       DD_setDeckMeta=s[1];
  s=useState(false);   var DD_editDeckOpen=s[0],   DD_setEditDeckOpen=s[1];
  s=useState("");      var DD_editDeckName=s[0],   DD_setEditDeckName=s[1];
  s=useState("");      var DD_editDeckDesc=s[0],   DD_setEditDeckDesc=s[1];
  s=useState("#a78bfa");var DD_editDeckColor=s[0], DD_setEditDeckColor=s[1];
  s=useState("📚");   var DD_editDeckIcon=s[0],   DD_setEditDeckIcon=s[1];
  s=useState(false);   var DD_editDeckLoading=s[0],DD_setEditDeckLoading=s[1];
  s=useState("");      var DD_editDeckErr=s[0],    DD_setEditDeckErr=s[1];
  s=useState(false);   var DD_tagBulkOpen=s[0],    DD_setTagBulkOpen=s[1];
  s=useState("");      var DD_tagBulkInput=s[0],   DD_setTagBulkInput=s[1];
  s=useState(false);   var DD_tagBulkLoading=s[0], DD_setTagBulkLoading=s[1];
  s=useState("");      var DD_tagBulkErrMsg=s[0],  DD_setTagBulkErrMsg=s[1];
  s=useState(false);   var DD_elionOpen=s[0],      DD_setElionOpen=s[1];
  var DD_pressTimer=useRef(null);

  // ── Inject CSS once ──
  useEffect(function(){
    if(!DD_styleInjected){
      var st=document.createElement("style");
      st.textContent=
        "@keyframes DD_shimmer{0%{background-position:-300px 0}100%{background-position:300px 0}}" +
        ".dd-skel{background:linear-gradient(90deg,rgba(255,255,255,.03) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.03) 75%);background-size:600px 100%;animation:DD_shimmer 1.4s ease-in-out infinite;border-radius:6px}" +
        ".dd-card-item{transition:transform 220ms cubic-bezier(0.32,0.72,0,1),box-shadow 220ms ease-out,border-color 220ms cubic-bezier(0.32,0.72,0,1)}" +
        ".dd-card-item:hover{transform:translateY(-1px)!important;border-color:rgba(96,165,250,0.35)!important;box-shadow:0 8px 24px rgba(0,0,0,0.30), 0 2px 8px rgba(0,0,0,0.20)!important}";
      document.head.appendChild(st);
      DD_styleInjected=true;
    }
  },[]);

  function DD_loadCards(){
    if(!deck||!deck.id||!window.ECEPT_SUPABASE){
      DD_setLoading(false);
      return;
    }
    DD_setLoading(true); DD_setLoadErr("");
    var DD_loadStart=Date.now();
    function DD_finish(fn){
      var elapsed=Date.now()-DD_loadStart;
      var remaining=Math.max(0,400-elapsed);
      setTimeout(fn,remaining);
    }

    var cardsPromise=window.ECEPT_SUPABASE
      .from("flashcards")
      .select("id,deck_id,user_id,is_official,card_type,front,back,tags,created_at")
      .eq("deck_id",deck.id)
      .order("created_at",{ascending:false});

    var progressPromise=user
      ? window.ECEPT_SUPABASE
          .from("flashcard_progress")
          .select("flashcard_id,next_review,interval_days,repetitions,ease_factor")
          .eq("user_id",user.id)
      : Promise.resolve({data:[],error:null});

    Promise.all([cardsPromise,progressPromise]).then(function(results){
      var cardRes=results[0], progRes=results[1];
      if(cardRes&&cardRes.error){
        DD_finish(function(){
          DD_setLoading(false);
          DD_setLoadErr("No se pudieron cargar las tarjetas.");
        });
        return;
      }
      var allCards=(cardRes&&cardRes.data)||[];

      var progMap={};
      var progRows=(progRes&&progRes.data)||[];
      for(var i=0;i<progRows.length;i++){
        progMap[progRows[i].flashcard_id]=progRows[i];
      }
      // Para barajas oficiales con sesión: cargar user_tags + user_card_tags
      if(deck.is_official&&user&&window.ECEPT_SUPABASE){
        var cids=[];
        for(var uci=0;uci<allCards.length;uci++){ cids.push(allCards[uci].id); }
        var utP=window.ECEPT_SUPABASE.from("user_tags").select("id,name,color").eq("user_id",user.id).order("name");
        var uctP=cids.length>0
          ?window.ECEPT_SUPABASE.from("user_card_tags").select("flashcard_id,tag").eq("user_id",user.id).in("flashcard_id",cids)
          :Promise.resolve({data:[],error:null});
        Promise.all([utP,uctP]).then(function(r2){
          var uTagsList=(r2[0]&&!r2[0].error)?(r2[0].data||[]):[];
          var uctMap={};
          var uctRows=(r2[1]&&!r2[1].error)?(r2[1].data||[]):[];
          for(var j=0;j<uctRows.length;j++){
            var fid2=uctRows[j].flashcard_id;
            if(!uctMap[fid2]) uctMap[fid2]=[];
            uctMap[fid2].push(uctRows[j].tag);
          }
          DD_finish(function(){
            DD_setCards(allCards);
            DD_setProgress(progMap);
            DD_setUserTagsList(uTagsList);
            DD_setUserCardTags(uctMap);
            DD_setLoading(false);
          });
        }).catch(function(){
          DD_finish(function(){
            DD_setCards(allCards);
            DD_setProgress(progMap);
            DD_setLoading(false);
          });
        });
      } else {
        DD_finish(function(){
          DD_setCards(allCards);
          DD_setProgress(progMap);
          DD_setLoading(false);
        });
      }
    }).catch(function(){
      DD_finish(function(){
        DD_setLoading(false);
        DD_setLoadErr("Error de conexión.");
      });
    });
  }

  useEffect(function(){ DD_loadCards(); },[]);

  // ── Close menu on click-outside (document listener, avoids stacking-context race) ──
  useEffect(function(){
    if(!DD_menuOpenId) return;
    function DD_docClose(){ DD_setMenuOpenId(null); }
    document.addEventListener("click", DD_docClose);
    return function(){ document.removeEventListener("click", DD_docClose); };
  },[DD_menuOpenId]);

  useEffect(function(){
    if(DD_previewIdx===null) return;
    function DD_onKeyDown(ev){
      var tot=DD_filteredRef.current.length;
      if(ev.key==="Escape"){ DD_setPreviewIdx(null); DD_setPreviewFlipped(false); }
      else if(ev.key==="ArrowRight"){
        DD_setPreviewIdx(function(pi){ return pi<tot-1?pi+1:0; });
        DD_setPreviewFlipped(false);
      }
      else if(ev.key==="ArrowLeft"){
        DD_setPreviewIdx(function(pi){ return pi>0?pi-1:tot-1; });
        DD_setPreviewFlipped(false);
      }
    }
    document.addEventListener("keydown",DD_onKeyDown);
    return function(){ document.removeEventListener("keydown",DD_onKeyDown); };
  },[DD_previewIdx]);

  useEffect(function(){
    if(!deck||!user||!window.ECEPT_SUPABASE) return;
    window.ECEPT_SUPABASE
      .from("decks")
      .select("id,name,color,icon")
      .eq("user_id",user.id)
      .eq("is_official",false)
      .order("sort_order",{ascending:true,nullsFirst:false})
      .order("name",{ascending:true})
      .then(function(res){ if(!res.error) DD_setOwnDecks(res.data||[]); });
  },[]);

  useEffect(function(){
    if(!user||!window.ECEPT_SUPABASE) return;
    window.ECEPT_SUPABASE.from("user_tags")
      .select("id,name,color").eq("user_id",user.id).order("name")
      .then(function(res){ if(!res.error) DD_setUserTagsList(res.data||[]); });
  },[]);

  function DD_handleDelete(cardId){
    if(!user||!window.ECEPT_SUPABASE) return;
    window.ECEPT_SUPABASE.from("flashcards").delete().eq("id",cardId).then(function(){
      DD_setDeleteConfirmId(null);
      DD_setMenuOpenId(null);
      DD_loadCards();
    }).catch(function(){
      DD_setDeleteConfirmId(null);
      DD_setMenuOpenId(null);
    });
  }

  function DD_toggleTag(t){
    var idx=DD_selectedTags.indexOf(t);
    if(idx===-1){
      DD_setSelectedTags(DD_selectedTags.concat([t]));
    } else {
      var next=DD_selectedTags.slice();
      next.splice(idx,1);
      DD_setSelectedTags(next);
    }
  }

  function DD_clearFilters(){
    DD_setSearch("");
    DD_setSelectedTags([]);
  }

  function DD_toggleAnswers(){
    var next=!DD_showAnswers;
    DD_setShowAnswers(next);
    try{ localStorage.setItem(DD_storageKey,String(next)); }catch(ex){}
  }

  function DD_onPressStart(cardId){
    if(DD_selectMode) return;
    DD_pressTimer.current=setTimeout(function(){
      var sel={};
      sel[cardId]=true;
      DD_setSelectMode(true);
      DD_setSelectedIds(sel);
    },500);
  }
  function DD_onPressEnd(){
    clearTimeout(DD_pressTimer.current);
  }
  function DD_toggleSelect(cardId){
    var next={};
    for(var tsk in DD_selectedIds){ if(DD_selectedIds.hasOwnProperty(tsk)) next[tsk]=true; }
    if(next[cardId]) delete next[cardId];
    else next[cardId]=true;
    DD_setSelectedIds(next);
  }
  function DD_selectAll(){
    var next={};
    for(var sai=0;sai<DD_cards.length;sai++){
      if(!DD_cards[sai].is_official) next[DD_cards[sai].id]=true;
    }
    DD_setSelectedIds(next);
  }
  function DD_cancelSelect(){
    DD_setSelectMode(false);
    DD_setSelectedIds({});
    DD_setBulkDelConfirm(false);
    DD_setBulkMsg("");
  }
  async function DD_bulkDelete(){
    var ids=Object.keys(DD_selectedIds);
    var snap=DD_selectedIds;
    if(!ids.length||!user||!window.ECEPT_SUPABASE) return;
    DD_setBulkMsg("");
    try{
      var res=await window.ECEPT_SUPABASE.from("flashcards")
        .delete().in("id",ids).eq("user_id",user.id);
      if(res.error) throw res.error;
      var next=[];
      for(var bdi=0;bdi<DD_cards.length;bdi++){
        if(!snap[DD_cards[bdi].id]) next.push(DD_cards[bdi]);
      }
      DD_setCards(next);
      DD_cancelSelect();
    }catch(err){
      console.error("bulk delete error",err);
      DD_setBulkMsg("Error al eliminar. Intentá de nuevo.");
    }
  }

  async function DD_execBulkMove(){
    var snap=DD_selectedIds;
    var ids=Object.keys(snap);
    if(!ids.length||!user||!window.ECEPT_SUPABASE||!DD_bulkTargetDeckId) return;
    DD_setBulkLoading(true); DD_setBulkErrMsg("");
    try{
      var res=await window.ECEPT_SUPABASE.from("flashcards")
        .update({deck_id:DD_bulkTargetDeckId})
        .in("id",ids).eq("user_id",user.id);
      if(res.error) throw res.error;
      var next=[];
      for(var bmi=0;bmi<DD_cards.length;bmi++){
        if(!snap[DD_cards[bmi].id]) next.push(DD_cards[bmi]);
      }
      DD_setCards(next);
      DD_setSelectMode(false);
      DD_setSelectedIds({});
      DD_setBulkDelConfirm(false);
      DD_setBulkMsg("");
      DD_setBulkAction(null);
      DD_setBulkTargetDeckId("");
    }catch(err){
      console.error("bulk move error",err);
      DD_setBulkErrMsg("Error al mover. Intentá de nuevo.");
    }finally{
      DD_setBulkLoading(false);
    }
  }
  async function DD_execBulkCopy(){
    var snap=DD_selectedIds;
    if(!Object.keys(snap).length||!user||!window.ECEPT_SUPABASE||!DD_bulkTargetDeckId) return;
    var cardsToCopy=[];
    for(var bci=0;bci<DD_cards.length;bci++){
      if(snap[DD_cards[bci].id]) cardsToCopy.push(DD_cards[bci]);
    }
    var newCards=[];
    for(var bcj=0;bcj<cardsToCopy.length;bcj++){
      var bcc=cardsToCopy[bcj];
      newCards.push({
        deck_id:DD_bulkTargetDeckId,user_id:user.id,is_official:false,
        card_type:bcc.card_type,front:bcc.front,back:bcc.back,tags:bcc.tags||[]
      });
    }
    DD_setBulkLoading(true); DD_setBulkErrMsg("");
    try{
      var res2=await window.ECEPT_SUPABASE.from("flashcards").insert(newCards);
      if(res2.error) throw res2.error;
      var targetDeck=null;
      for(var bck=0;bck<DD_ownDecks.length;bck++){
        if(DD_ownDecks[bck].id===DD_bulkTargetDeckId){ targetDeck=DD_ownDecks[bck]; break; }
      }
      DD_setSelectMode(false);
      DD_setSelectedIds({});
      DD_setBulkDelConfirm(false);
      DD_setBulkAction(null);
      DD_setBulkTargetDeckId("");
      var n=newCards.length;
      DD_setBulkMsg(n+" card"+(n===1?"":"s")+" copiada"+(n===1?"":"s")+(targetDeck?" a "+targetDeck.name:""));
      setTimeout(function(){ DD_setBulkMsg(""); },3000);
    }catch(err){
      console.error("bulk copy error",err);
      DD_setBulkErrMsg("Error al copiar. Intentá de nuevo.");
    }finally{
      DD_setBulkLoading(false);
    }
  }

  async function DD_execBulkTag(){
    var tag=DD_tagBulkInput.trim().toLowerCase().replace(/[^a-z0-9\-_áéíóúñü]/g,"");
    if(!tag||!user||!window.ECEPT_SUPABASE) return;
    var snap=DD_selectedIds;
    var selectedCards=[];
    for(var bti=0;bti<DD_cards.length;bti++){
      if(snap[DD_cards[bti].id]) selectedCards.push(DD_cards[bti]);
    }
    if(!selectedCards.length) return;
    DD_setTagBulkLoading(true); DD_setTagBulkErrMsg("");
    try{
      var promises=[];
      for(var btj=0;btj<selectedCards.length;btj++){
        var btc=selectedCards[btj];
        var curTags=btc.tags||[];
        if(curTags.indexOf(tag)!==-1){ promises.push(Promise.resolve()); continue; }
        promises.push(
          window.ECEPT_SUPABASE.from("flashcards")
            .update({tags:curTags.concat([tag])})
            .eq("id",btc.id).eq("user_id",user.id)
        );
      }
      var results=await Promise.all(promises);
      for(var btr=0;btr<results.length;btr++){
        if(results[btr]&&results[btr].error) throw results[btr].error;
      }
      DD_setCards(function(prev){
        return prev.map(function(c){
          if(!snap[c.id]) return c;
          var cur=c.tags||[];
          if(cur.indexOf(tag)!==-1) return c;
          var updated={};
          updated.id=c.id; updated.deck_id=c.deck_id; updated.user_id=c.user_id;
          updated.is_official=c.is_official; updated.card_type=c.card_type;
          updated.front=c.front; updated.back=c.back; updated.created_at=c.created_at;
          updated.tags=cur.concat([tag]);
          return updated;
        });
      });
      var tagExists=false;
      for(var btk=0;btk<DD_userTagsList.length;btk++){
        if(DD_userTagsList[btk].name===tag){ tagExists=true; break; }
      }
      if(!tagExists&&user){
        try{
          await window.ECEPT_SUPABASE.from("user_tags")
            .insert({user_id:user.id,name:tag,color:"#a78bfa"});
        }catch(e){ console.warn("user_tags insert warn",e); }
      }
      var n=selectedCards.length;
      DD_setTagBulkOpen(false);
      DD_setTagBulkInput("");
      DD_setSelectMode(false);
      DD_setSelectedIds({});
      DD_setBulkDelConfirm(false);
      DD_setBulkMsg("Etiqueta '#"+tag+"' agregada a "+n+" card"+(n===1?"":"s"));
      setTimeout(function(){ DD_setBulkMsg(""); },3000);
    }catch(err){
      console.error("bulk tag error",err);
      DD_setTagBulkErrMsg("Error al etiquetar. Intentá de nuevo.");
    }finally{
      DD_setTagBulkLoading(false);
    }
  }

  async function DD_execCopy(){
    if(!user||!window.ECEPT_SUPABASE||!DD_copyCard) return;
    DD_setCopyLoading(true);
    try{
      var targetDeckId=DD_copyDeckId;
      if(DD_copyMode==='new'){
        var deckRes=await window.ECEPT_SUPABASE
          .from('decks')
          .insert({user_id:user.id,name:DD_copyNewName.trim(),is_official:false,color:'#3b82f6',icon:'📚'})
          .select('id')
          .single();
        if(deckRes.error) throw deckRes.error;
        targetDeckId=deckRes.data.id;
        DD_setOwnDecks(function(prev){ return prev.concat([{id:targetDeckId,name:DD_copyNewName.trim(),color:'#3b82f6',icon:'📚'}]); });
      }
      var insRes=await window.ECEPT_SUPABASE.from('flashcards').insert({
        deck_id:targetDeckId,user_id:user.id,is_official:false,
        card_type:DD_copyCard.card_type,front:DD_copyCard.front,
        back:DD_copyCard.back,tags:[]
      });
      if(insRes.error) throw insRes.error;
      DD_setCopyCard(null);
      DD_setCopySuccess(true);
      setTimeout(function(){ DD_setCopySuccess(false); },2000);
    }catch(err){
      console.error('copy card error',err);
    }finally{
      DD_setCopyLoading(false);
    }
  }

  function DD_addUserCardTag(cardId,tagName){
    var tag=tagName.trim().toLowerCase().replace(/[^a-z0-9\-_áéíóúñü]/g,"");
    if(!tag||!user||!window.ECEPT_SUPABASE) return;
    var existing=DD_userCardTags[cardId]||[];
    if(existing.indexOf(tag)!==-1){ DD_setAddTagCardId(null); DD_setAddTagInput(""); return; }
    DD_setAddTagSaving(true);
    window.ECEPT_SUPABASE.from("user_card_tags")
      .insert({user_id:user.id,flashcard_id:cardId,tag:tag})
      .then(function(res){
        DD_setAddTagSaving(false);
        var next={};
        for(var k in DD_userCardTags){ if(DD_userCardTags.hasOwnProperty(k)) next[k]=DD_userCardTags[k].slice(); }
        if(!next[cardId]) next[cardId]=[];
        if((!res||!res.error)&&next[cardId].indexOf(tag)===-1) next[cardId]=next[cardId].concat([tag]);
        DD_setUserCardTags(next);
        DD_setAddTagCardId(null);
        DD_setAddTagInput("");
      }).catch(function(){ DD_setAddTagSaving(false); });
  }

  function DD_removeUserCardTag(cardId,tagName){
    if(!user||!window.ECEPT_SUPABASE) return;
    window.ECEPT_SUPABASE.from("user_card_tags").delete()
      .eq("user_id",user.id).eq("flashcard_id",cardId).eq("tag",tagName)
      .then(function(){
        var next={};
        for(var k in DD_userCardTags){ if(DD_userCardTags.hasOwnProperty(k)) next[k]=DD_userCardTags[k].slice(); }
        if(next[cardId]){
          var idx=next[cardId].indexOf(tagName);
          if(idx!==-1) next[cardId].splice(idx,1);
        }
        DD_setUserCardTags(next);
      }).catch(function(){});
  }

  function DD_handleNewCard(){
    DD_setEditCard(null);
    DD_setShowEditor(true);
  }

  function DD_handleStudy(){
    window.ECEPT_DECK_SELECTED=deck;
    if(typeof go==="function") go("flashcards_study");
  }

  function DD_exportDeck(){
    var exportData={
      version:1,
      exportedAt:new Date().toISOString(),
      deck:{
        name:deck.name,
        description:deck.description||"",
        color:deck.color||"#3b82f6",
        icon:deck.icon||"📚"
      },
      cards:[]
    };
    for(var ei=0;ei<DD_cards.length;ei++){
      var ec=DD_cards[ei];
      exportData.cards.push({
        card_type:ec.card_type,
        front:ec.front,
        back:ec.back||"",
        tags:ec.tags||[]
      });
    }
    var blob=new Blob([JSON.stringify(exportData,null,2)],{type:"application/json"});
    var url=URL.createObjectURL(blob);
    var a=document.createElement("a");
    a.href=url;
    a.download=(deck.name||"baraja").replace(/[^a-z0-9]/gi,"_")+"_ecept.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function DD_execEditDeck(){
    var name=DD_editDeckName.trim();
    if(!name||!user||!window.ECEPT_SUPABASE) return;
    DD_setEditDeckLoading(true); DD_setEditDeckErr("");
    try{
      var icon=DD_editDeckIcon.trim()||"📚";
      var res=await window.ECEPT_SUPABASE.from("decks")
        .update({name:name,description:DD_editDeckDesc.trim(),color:DD_editDeckColor,icon:icon})
        .eq("id",deck.id).eq("user_id",user.id);
      if(res.error) throw res.error;
      DD_setDeckMeta({name:name,description:DD_editDeckDesc.trim(),color:DD_editDeckColor,icon:icon});
      DD_setEditDeckOpen(false);
    }catch(err){
      console.error("edit deck error",err);
      DD_setEditDeckErr("Error al guardar. Intentá de nuevo.");
    }finally{
      DD_setEditDeckLoading(false);
    }
  }

  // ── Deck no seleccionado: fallback ──
  if(!deck){
    return e("div",{style:{maxWidth:"540px",margin:"0 auto",padding:"40px 20px",textAlign:"center"}},
      e("div",{style:{fontSize:"40px",marginBottom:"12px"}},"🤷"),
      e("p",{style:{color:C.tx,fontSize:"15px",fontWeight:600,marginBottom:"6px"}},"No hay baraja seleccionada"),
      e("p",{style:{color:C.dm,fontSize:"12px",marginBottom:"22px",lineHeight:1.5}},"Volvé a la lista de barajas para elegir una.")
    );
  }

  // ── Baraja privada sin sesión ──
  if(!user&&!deck.is_official){
    return e("div",{style:{maxWidth:"540px",margin:"0 auto",padding:"20px 20px 60px"}},
      e("div",{style:{textAlign:"center",padding:"20px 0"}},
        e("div",{style:{fontSize:"48px",marginBottom:"12px"}},"🔒"),
        e("p",{style:{fontSize:"15px",color:C.tx,fontWeight:700,marginBottom:"8px"}},"Esta baraja requiere cuenta"),
        e("p",{style:{fontSize:"13px",color:C.dm,lineHeight:1.5,marginBottom:"22px"}},"Iniciá sesión para ver y crear tus barajas personales.")
      )
    );
  }

  // ── Derived ──
  var _dm=DD_deckMeta||deck;
  var deckCol=_dm.color||"#a78bfa";
  var deckIcon=_dm.icon||"🎴";
  var _deckName=_dm.name||"Sin nombre";
  var _deckDesc=_dm.description||"";
  var isOfficial=!!deck.is_official;
  var canEdit=!isOfficial && user && deck.user_id===user.id;
  var DD_userTagColorMap={};
  for(var utcm=0;utcm<DD_userTagsList.length;utcm++){
    DD_userTagColorMap[DD_userTagsList[utcm].name]=DD_userTagsList[utcm].color||"#a78bfa";
  }

  // Stats
  var nowIso=new Date().toISOString();
  var dueCount=0, newCount=0;
  for(var ic=0;ic<DD_cards.length;ic++){
    var pp=DD_progress[DD_cards[ic].id];
    if(!pp){ newCount++; }
    else if(pp.next_review && pp.next_review<=nowIso){ dueCount++; }
  }

  // Unique tags
  var tagSet={};
  for(var jt=0;jt<DD_cards.length;jt++){
    var ts=DD_cards[jt].tags;
    if(Array.isArray(ts)){
      for(var kt=0;kt<ts.length;kt++){ if(ts[kt]) tagSet[ts[kt]]=true; }
    }
  }
  var allTags=Object.keys(tagSet).sort();

  // Filter cards
  var q=DD_search.trim().toLowerCase();
  var filteredCards=DD_cards.filter(function(c){
    if(DD_selectedTags.length>0){
      var cardTags=Array.isArray(c.tags)?c.tags:[];
      for(var ti=0;ti<DD_selectedTags.length;ti++){
        if(cardTags.indexOf(DD_selectedTags[ti])===-1) return false;
      }
    }
    if(q){
      var hay=((c.front||"")+" "+(c.back||"")+" "+(Array.isArray(c.tags)?c.tags.join(" "):"")).toLowerCase();
      if(hay.indexOf(q)===-1) return false;
    }
    return true;
  });
  DD_filteredRef.current=filteredCards;

  var hasFilters=q.length>0 || DD_selectedTags.length>0;
  var DD_selectCount=Object.keys(DD_selectedIds).length;

  // ── Helpers ──
  function DD_skeletonCard(key){
    return e("div",{key:key,style:{
      background:C.cd,border:"1px solid "+C.bd,borderRadius:"12px",padding:"14px"
    }},
      e("div",{className:"dd-skel",style:{width:"60px",height:"18px",marginBottom:"10px"}}),
      e("div",{className:"dd-skel",style:{width:"95%",height:"12px",marginBottom:"6px"}}),
      e("div",{className:"dd-skel",style:{width:"70%",height:"12px"}})
    );
  }

  function DD_typeBadge(type){
    var col=type==="cloze"?"#fbbf24":"#60a5fa";
    var label=type==="cloze"?"CLOZE":"BASIC";
    return e("span",{style:{
      display:"inline-block",fontSize:"9px",fontWeight:800,
      letterSpacing:"1px",
      padding:"3px 7px",borderRadius:"4px",
      background:col+"18",color:col,
      flexShrink:0
    }},label);
  }

  function DD_cardItem(c,i){
    var isMenuOpen=DD_menuOpenId===c.id;
    var isCloze=c.card_type==="cloze";
    var prog=DD_progress[c.id];
    var existingUserTags=DD_userCardTags[c.id]||[];
    var isAddingTag=DD_addTagCardId===c.id;
    var filteredSuggs=[];
    if(isAddingTag){
      var q2=DD_addTagInput.toLowerCase().trim();
      for(var si2=0;si2<DD_userTagsList.length;si2++){
        var sn=DD_userTagsList[si2].name;
        if(existingUserTags.indexOf(sn)===-1&&(!q2||sn.indexOf(q2)>=0)){
          filteredSuggs.push(sn);
        }
      }
    }

    // Stats line
    var statsText="";
    if(prog){
      statsText="Vista "+(prog.repetitions||0)+" "+(prog.repetitions===1?"vez":"veces");
      if(prog.next_review){
        var nrd=new Date(prog.next_review);
        var diffMs=nrd-new Date();
        var diffD=Math.round(diffMs/(1000*60*60*24));
        if(diffD<=0) statsText+=" · Hoy";
        else if(diffD===1) statsText+=" · Mañana";
        else statsText+=" · En "+diffD+"d";
      }
    }

    var isSelected=!!DD_selectedIds[c.id];
    return e("div",{
      key:c.id,
      className:"dd-card-item",
      onClick:function(){
        if(DD_selectMode&&!isOfficial){ DD_toggleSelect(c.id); }
        else if(!DD_selectMode){ DD_setPreviewIdx(i); DD_setPreviewFlipped(false); }
      },
      onPointerDown:!isOfficial?function(ev){ ev.stopPropagation(); DD_onPressStart(c.id); }:null,
      onPointerUp:!isOfficial?DD_onPressEnd:null,
      onPointerLeave:!isOfficial?DD_onPressEnd:null,
      onPointerCancel:!isOfficial?DD_onPressEnd:null,
      style:{
        position:"relative",cursor:"pointer",
        background:isSelected?"rgba(167,139,250,.10)":"linear-gradient(180deg,#0d1224 0%,#0a0e1f 100%)",
        border:"1px solid "+(isSelected?"rgba(167,139,250,.50)":C.bd),
        borderRadius:"14px",padding:"16px 18px",
        marginBottom:0,
        minHeight:"110px",
        display:"flex",
        flexDirection:"column",
        boxSizing:"border-box"
      }
    },
      // Main row: icon + content + menu button
      e("div",{style:{display:"flex",gap:"12px",alignItems:"flex-start"}},
        // Type icon circle or selection checkbox
        DD_selectMode&&!isOfficial
          ?e("div",{style:{
              width:"34px",height:"34px",flexShrink:0,
              borderRadius:"50%",marginTop:"1px",
              border:"2px solid "+(isSelected?"#a78bfa":C.bd),
              background:isSelected?"rgba(167,139,250,.20)":"rgba(255,255,255,.04)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",
              color:"#a78bfa"
            }},isSelected?"✓":"")
          :e("div",{style:{
              width:"34px",height:"34px",flexShrink:0,
              borderRadius:"8px",marginTop:"1px",
              background:isCloze?"rgba(251,191,36,.12)":"rgba(96,165,250,.12)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px"
            }},isCloze?"✂️":"📝"),
        // Content
        e("div",{style:{flex:1,minWidth:0}},
          // Front (2 lines max)
          e("div",{style:{
            fontSize:"14px",color:C.tx,fontWeight:600,lineHeight:1.45,
            overflow:"hidden",display:"-webkit-box",
            WebkitLineClamp:2,WebkitBoxOrient:"vertical",
            marginBottom:4
          }},isCloze
            ?(DD_showAnswers?DD_previewClozeEl(c.front||"",false):DD_clozeBlank(c.front||""))
            :(c.front||"")),
          // Back preview (basic only — cloze info is already inline in the front row)
          !isCloze&&e("div",{style:{
            fontSize:"12px",color:C.dm,lineHeight:1.4,
            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"
          }},
            !DD_showAnswers
              ?"→ ●●●●●"
              :c.back?"→ "+(c.back.length>80?c.back.slice(0,77)+"...":c.back):""
          ),
          // Tags oficiales (solid border, color muted)
          Array.isArray(c.tags)&&c.tags.length>0&&e("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px",marginTop:"6px"}},
            c.tags.map(function(t,ti){
              return e("span",{key:ti,style:{
                fontSize:"9px",fontWeight:700,padding:"2px 6px",
                borderRadius:"999px",background:"rgba(255,255,255,.04)",
                border:"1px solid "+C.bd,color:C.dm
              }},"#"+t);
            })
          ),
          // Tags personales en cards oficiales (dashed border, color del tag)
          isOfficial&&user&&e("div",{
            style:{display:"flex",flexWrap:"wrap",gap:"4px",marginTop:"6px",alignItems:"center"}
          },
            existingUserTags.map(function(tag){
              var col=DD_userTagColorMap[tag]||"#a78bfa";
              return e("span",{key:tag,style:{
                display:"inline-flex",alignItems:"center",gap:"3px",
                padding:"2px 6px 2px 8px",borderRadius:"999px",
                background:col+"14",border:"2px dashed "+col,
                color:col,fontSize:"9px",fontWeight:700
              }},
                "#"+tag,
                e("button",{
                  onClick:function(ev){ ev.stopPropagation(); DD_removeUserCardTag(c.id,tag); },
                  style:{background:"none",border:"none",color:col,cursor:"pointer",
                    padding:"0 1px",lineHeight:1,fontSize:"11px"}
                },"×")
              );
            }),
            !isAddingTag&&e("button",{
              onClick:function(ev){ ev.stopPropagation(); DD_setAddTagCardId(c.id); DD_setAddTagInput(""); },
              style:{
                display:"inline-flex",alignItems:"center",gap:"2px",
                padding:"2px 8px",borderRadius:"999px",
                background:"rgba(167,139,250,.08)",border:"1px dashed rgba(167,139,250,.4)",
                color:"#a78bfa",fontSize:"9px",fontWeight:700,cursor:"pointer"
              }
            },"+ 🏷"),
            isAddingTag&&e("div",{
              onClick:function(ev){ ev.stopPropagation(); },
              style:{width:"100%",marginTop:"6px"}
            },
              e("div",{style:{display:"flex",gap:"6px",alignItems:"center"}},
                e("input",{
                  type:"text",value:DD_addTagInput,disabled:DD_addTagSaving,
                  placeholder:"Etiqueta...",
                  onChange:function(ev){ DD_setAddTagInput(ev.target.value); },
                  onKeyDown:function(ev){
                    if(ev.key==="Enter"&&DD_addTagInput.trim()) DD_addUserCardTag(c.id,DD_addTagInput);
                    if(ev.key==="Escape"){ DD_setAddTagCardId(null); DD_setAddTagInput(""); }
                  },
                  style:{flex:1,minHeight:"36px",padding:"6px 10px",borderRadius:"8px",
                    border:"1px solid "+C.bd,background:C.bg,color:C.tx,
                    fontSize:"12px",outline:"none",boxSizing:"border-box"}
                }),
                e("button",{
                  onClick:function(){ if(DD_addTagInput.trim()) DD_addUserCardTag(c.id,DD_addTagInput); },
                  disabled:!DD_addTagInput.trim()||DD_addTagSaving,
                  style:{minHeight:"36px",padding:"6px 12px",borderRadius:"8px",
                    background:(DD_addTagInput.trim()&&!DD_addTagSaving)?"#a78bfa":C.bd,
                    border:"none",color:"#fff",fontSize:"12px",fontWeight:700,
                    cursor:(DD_addTagInput.trim()&&!DD_addTagSaving)?"pointer":"default"}
                },"+"),
                e("button",{
                  onClick:function(){ DD_setAddTagCardId(null); DD_setAddTagInput(""); },
                  disabled:DD_addTagSaving,
                  style:{minHeight:"36px",padding:"6px 10px",borderRadius:"8px",
                    background:"none",border:"1px solid "+C.bd,
                    color:C.mt,fontSize:"12px",cursor:"pointer"}
                },"×")
              ),
              filteredSuggs.length>0&&e("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px",marginTop:"6px"}},
                filteredSuggs.map(function(tag){
                  var col=DD_userTagColorMap[tag]||"#a78bfa";
                  return e("button",{key:tag,
                    onClick:function(){ DD_addUserCardTag(c.id,tag); },
                    style:{padding:"3px 10px",borderRadius:"999px",minHeight:"28px",
                      background:col+"14",border:"1px solid "+col+"38",
                      color:col,fontSize:"11px",cursor:"pointer"}
                  },"#"+tag);
                })
              )
            )
          ),
          // Stats
          statsText&&e("div",{style:{fontSize:"10px",color:C.dm,marginTop:"5px"}},statsText)
        ),
        // ⋮ button or readonly badge
        !DD_selectMode&&(canEdit
          ? e("button",{
              onClick:function(ev){ ev.stopPropagation(); DD_setMenuOpenId(isMenuOpen?null:c.id); },
              "aria-label":"Opciones",
              style:{
                background:"none",border:"none",color:C.dm,fontSize:"16px",cursor:"pointer",
                width:"32px",height:"32px",flexShrink:0,
                display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"6px",marginTop:"-2px"
              }
            },"⋮")
          : isOfficial&&user&&e("button",{
              onClick:function(ev){
                ev.stopPropagation();
                DD_setCopyCard(c);
                DD_setCopyMode('select');
                DD_setCopyDeckId(DD_ownDecks[0]?DD_ownDecks[0].id:'');
              },
              "aria-label":"Agregar a mi baraja",
              style:{
                background:"none",border:"none",color:C.dm,fontSize:"18px",cursor:"pointer",
                minWidth:"44px",minHeight:"44px",flexShrink:0,
                display:"flex",alignItems:"center",justifyContent:"center",
                borderRadius:"6px",marginTop:"-2px"
              }
            },"📥"))
      ),
      // ⋮ Dropdown
      !DD_selectMode&&isMenuOpen&&e("div",{
        onClick:function(ev){ ev.stopPropagation(); },
        style:{
          position:"absolute",top:"44px",right:"10px",
          background:C.cd,border:"1px solid "+C.bd,
          borderRadius:"10px",overflow:"hidden",
          boxShadow:"0 8px 24px rgba(0,0,0,.5)",
          zIndex:5,minWidth:"140px"
        }
      },
        e("button",{
          onClick:function(ev){
            ev.stopPropagation();
            DD_setMenuOpenId(null);
            setTimeout(function(){ DD_setEditCard(c); DD_setShowEditor(true); },0);
          },
          style:{display:"block",width:"100%",minHeight:"44px",padding:"10px 14px",textAlign:"left",
            background:"none",border:"none",color:C.tx,fontSize:"13px",fontWeight:600,cursor:"pointer"}
        },"✏️  Editar"),
        e("div",{style:{height:"1px",background:C.bd}}),
        e("button",{
          onClick:function(ev){
            ev.stopPropagation();
            DD_setMenuOpenId(null);
            setTimeout(function(){ DD_setDeleteConfirmId(c.id); },0);
          },
          style:{display:"block",width:"100%",minHeight:"44px",padding:"10px 14px",textAlign:"left",
            background:"none",border:"none",color:"#fca5a5",fontSize:"13px",fontWeight:600,cursor:"pointer"}
        },"🗑  Eliminar")
      )
    );
  }

  return e(F,null,
    e("div",{style:{width:"100%",maxWidth:"1280px",margin:"0 auto",padding:"24px max(16px, calc((100vw - 1280px) / 2 + 24px)) 80px",position:"relative",boxSizing:"border-box"}},

    // ── Header ──
    e("div",{style:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"}},
      e("div",{style:{
        fontSize:"28px",width:"50px",height:"50px",flexShrink:0,
        display:"flex",alignItems:"center",justifyContent:"center",
        borderRadius:"12px",background:deckCol+"15"
      }},deckIcon),
      e("div",{style:{flex:1,minWidth:0}},
        e("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"2px"}},
          e("h1",{style:{
            fontSize:"18px",fontWeight:800,color:C.tx,
            fontFamily:"'Playfair Display',serif",
            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
            margin:0
          }},_deckName),
          isOfficial && e("span",{style:{
            fontSize:"9px",padding:"3px 8px",borderRadius:"6px",
            background:deckCol+"22",color:deckCol,fontWeight:700,
            flexShrink:0,whiteSpace:"nowrap"
          }},"Oficial ⭐")
        ),
        _deckDesc && e("p",{style:{fontSize:"12px",color:C.dm,lineHeight:1.4,margin:0}},_deckDesc)
      )
    ),

    // ── Stats pills ──
    e("div",{style:{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"18px"}},
      e("div",{style:{
        padding:"6px 12px",borderRadius:"999px",
        background:"rgba(255,255,255,.04)",border:"1px solid "+C.bd,
        fontSize:"11px",fontWeight:700,color:C.tx
      }},
        e("span",{style:{color:C.dm,fontWeight:500}},"Total: "),
        DD_loading?"—":String(DD_cards.length)
      ),
      e("div",{style:{
        padding:"6px 12px",borderRadius:"999px",
        background:dueCount>0?"rgba(251,191,36,.10)":"rgba(255,255,255,.04)",
        border:"1px solid "+(dueCount>0?"rgba(251,191,36,.30)":C.bd),
        fontSize:"11px",fontWeight:700,color:dueCount>0?"#fbbf24":C.tx
      }},
        e("span",{style:{color:dueCount>0?"#fbbf24":C.dm,fontWeight:500}},"Hoy: "),
        DD_loading?"—":String(dueCount)
      ),
      e("div",{style:{
        padding:"6px 12px",borderRadius:"999px",
        background:newCount>0?"rgba(167,139,250,.10)":"rgba(255,255,255,.04)",
        border:"1px solid "+(newCount>0?"rgba(167,139,250,.30)":C.bd),
        fontSize:"11px",fontWeight:700,color:newCount>0?"#a78bfa":C.tx
      }},
        e("span",{style:{color:newCount>0?"#a78bfa":C.dm,fontWeight:500}},"Nuevas: "),
        DD_loading?"—":String(newCount)
      )
    ),

    // ── Guest banner (oficial, sin sesión) ──
    !user&&isOfficial&&e("div",{style:{
      display:"flex",alignItems:"center",gap:"10px",
      padding:"10px 14px",borderRadius:"10px",
      background:"rgba(167,139,250,.10)",
      border:"1px solid rgba(167,139,250,.30)",
      marginBottom:"16px"
    }},
      e("span",{style:{fontSize:"15px",flexShrink:0}},"ℹ️"),
      e("span",{style:{fontSize:"12px",color:"#c4b5fd",lineHeight:1.5}},"Tu progreso no se guarda sin cuenta.")
    ),

    // ── Action bar ──
    DD_selectMode
      ?e("div",{style:{marginBottom:"22px"}},
          // Count row
          e("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}},
            e("span",{style:{flex:1,fontSize:"14px",fontWeight:700,color:C.tx}},
              DD_selectCount+" seleccionada"+(DD_selectCount===1?"":"s")
            ),
            e("button",{
              onClick:DD_selectAll,
              style:{padding:"6px 14px",borderRadius:"8px",background:"none",
                border:"1px solid "+C.bd,color:C.dm,fontSize:"12px",fontWeight:600,cursor:"pointer"}
            },"Todas"),
            e("button",{
              onClick:DD_cancelSelect,
              style:{padding:"6px 14px",borderRadius:"8px",background:"none",
                border:"1px solid "+C.bd,color:C.mt,fontSize:"12px",fontWeight:600,cursor:"pointer"}
            },"Cancelar")
          ),
          // Action buttons or delete confirm
          DD_bulkDelConfirm
            ?e("div",{style:{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}},
                e("span",{style:{fontSize:"13px",color:"#fca5a5",fontWeight:600}},
                  "¿Eliminar "+DD_selectCount+" card"+(DD_selectCount===1?"":"s")+"?"
                ),
                e("button",{
                  onClick:DD_bulkDelete,
                  disabled:!DD_selectCount,
                  style:{padding:"8px 18px",borderRadius:"10px",
                    background:"#ef4444",border:"none",color:"#fff",
                    fontSize:"13px",fontWeight:700,cursor:"pointer"}
                },"Sí"),
                e("button",{
                  onClick:function(){ DD_setBulkDelConfirm(false); DD_setBulkMsg(""); },
                  style:{padding:"8px 18px",borderRadius:"10px",background:"none",
                    border:"1px solid "+C.bd,color:C.mt,
                    fontSize:"13px",fontWeight:700,cursor:"pointer"}
                },"No")
              )
            :e("div",{style:{display:"flex",gap:"8px",flexWrap:"wrap"}},
                e("button",{
                  onClick:function(){ DD_setBulkDelConfirm(true); DD_setBulkMsg(""); },
                  disabled:!DD_selectCount,
                  style:{padding:"10px 18px",borderRadius:"10px",
                    background:DD_selectCount?"rgba(239,68,68,.15)":"rgba(255,255,255,.04)",
                    border:"1px solid "+(DD_selectCount?"rgba(239,68,68,.40)":C.bd),
                    color:DD_selectCount?"#fca5a5":C.dm,
                    fontSize:"13px",fontWeight:700,cursor:DD_selectCount?"pointer":"default"}
                },"🗑 Eliminar"),
                e("button",{
                  onClick:function(){ DD_setBulkAction("move"); DD_setBulkTargetDeckId(""); DD_setBulkErrMsg(""); },
                  disabled:!DD_selectCount,
                  style:{padding:"10px 18px",borderRadius:"10px",background:"none",
                    border:"1px solid "+C.bd,color:DD_selectCount?C.tx:C.dm,
                    fontSize:"13px",fontWeight:700,cursor:DD_selectCount?"pointer":"default"}
                },"📦 Mover"),
                e("button",{
                  onClick:function(){ DD_setBulkAction("copy"); DD_setBulkTargetDeckId(""); DD_setBulkErrMsg(""); },
                  disabled:!DD_selectCount,
                  style:{padding:"10px 18px",borderRadius:"10px",background:"none",
                    border:"1px solid "+C.bd,color:DD_selectCount?C.tx:C.dm,
                    fontSize:"13px",fontWeight:700,cursor:DD_selectCount?"pointer":"default"}
                },"📋 Copiar"),
                e("button",{
                  onClick:function(){ DD_setTagBulkOpen(true); DD_setTagBulkInput(""); DD_setTagBulkErrMsg(""); },
                  disabled:!DD_selectCount,
                  style:{padding:"10px 18px",borderRadius:"10px",background:"none",
                    border:"1px solid "+C.bd,color:DD_selectCount?C.tx:C.dm,
                    fontSize:"13px",fontWeight:700,cursor:DD_selectCount?"pointer":"default"}
                },"🏷 Etiquetar")
              ),
          DD_bulkMsg&&e("div",{style:{marginTop:"8px",fontSize:"12px",
            color:DD_bulkMsg.indexOf("Error")===0?"#fca5a5":"#a78bfa",fontWeight:600}},
            DD_bulkMsg
          )
        )
      :e("div",{style:{display:"flex",gap:"8px",marginBottom:"22px",flexWrap:"wrap"}},
          DD_cards.length>0 && e("button",{
            onClick:DD_handleStudy,
            style:{
              flex:"1 1 200px",minHeight:"52px",padding:"14px 20px",
              borderRadius:"14px",
              background:"linear-gradient(135deg,"+deckCol+",#60a5fa)",
              color:"#fff",border:"none",
              fontSize:"15px",fontWeight:700,cursor:"pointer",
              boxShadow:"0 4px 18px "+deckCol+"55"
            }
          },"🎯 Estudiar"),
          canEdit && e("button",{
            onClick:DD_handleNewCard,
            style:{
              flex:"1 1 160px",minHeight:"52px",padding:"14px 20px",
              borderRadius:"14px",
              background:"none",
              border:"1.5px solid "+C.bd,color:C.tx,
              fontSize:"14px",fontWeight:700,cursor:"pointer"
            }
          },"+ Nueva tarjeta"),
          canEdit&&e("button",{
            onClick:function(){ DD_setElionOpen(true); },
            style:{
              flex:"0 0 auto",minHeight:"52px",padding:"14px 18px",
              borderRadius:"14px",
              background:"linear-gradient(135deg,#a78bfa,#60a5fa)",
              border:"none",color:"#fff",
              fontSize:"14px",fontWeight:700,cursor:"pointer",
              boxShadow:"0 4px 12px rgba(167,139,250,0.3)"
            }
          },"✨ Generar con IA"),
          canEdit&&DD_cards.length>0&&e("button",{
            onClick:function(){ DD_setSelectMode(true); },
            style:{
              minHeight:"52px",padding:"14px 16px",
              borderRadius:"14px",
              background:"none",
              border:"1.5px solid "+C.bd,color:C.dm,
              fontSize:"14px",fontWeight:700,cursor:"pointer",flexShrink:0
            }
          },"☑ Seleccionar"),
          canEdit&&DD_cards.length>0&&e("button",{
            onClick:DD_exportDeck,
            style:{
              minHeight:"52px",padding:"14px 16px",
              borderRadius:"14px",
              background:"none",
              border:"1.5px solid "+C.bd,color:C.dm,
              fontSize:"14px",fontWeight:700,cursor:"pointer",flexShrink:0
            }
          },"⬇ Exportar")
        ),

    // ── Search + tag filter ──
    !DD_loading && DD_cards.length>0 && e("div",{style:{marginBottom:"18px"}},
      e("div",{style:{display:"flex",gap:"8px",alignItems:"center",marginBottom:allTags.length>0?"10px":0}},
        e("input",{
          type:"text",value:DD_search,
          onChange:function(ev){ DD_setSearch(ev.target.value); },
          placeholder:"Buscar en esta baraja...",
          style:{
            flex:1,minHeight:"44px",padding:"10px 14px",
            borderRadius:"10px",border:"1px solid "+C.bd,
            background:C.bg,color:C.tx,fontSize:"13px",
            outline:"none",boxSizing:"border-box"
          }
        }),
        e("button",{
          onClick:DD_toggleAnswers,
          style:{
            flexShrink:0,minHeight:"44px",padding:"8px 14px",
            borderRadius:"10px",background:"none",
            border:"1px solid "+C.bd,
            color:DD_showAnswers?C.ac2:C.mt,
            fontSize:"12px",fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"
          }
        },DD_showAnswers?"👁 Ocultar respuestas":"👁 Mostrar respuestas"),
        canEdit&&e("button",{
          onClick:function(){
            var src=DD_deckMeta||deck;
            DD_setEditDeckName(src.name||"");
            DD_setEditDeckDesc(src.description||"");
            DD_setEditDeckColor(src.color||"#a78bfa");
            DD_setEditDeckIcon(src.icon||"📚");
            DD_setEditDeckErr("");
            DD_setEditDeckOpen(true);
          },
          style:{
            flexShrink:0,minHeight:"44px",padding:"8px 14px",
            borderRadius:"10px",background:"none",
            border:"1px solid "+C.bd,
            color:C.dm,fontSize:"12px",fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"
          }
        },"✏️ Editar baraja")
      ),
      allTags.length>0 && e("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px",alignItems:"center"}},
        allTags.map(function(t){
          var sel=DD_selectedTags.indexOf(t)!==-1;
          return e("button",{
            key:t,
            onClick:function(){ DD_toggleTag(t); },
            style:{
              fontSize:"11px",fontWeight:600,
              padding:"6px 12px",borderRadius:"999px",
              background:sel?deckCol+"22":"rgba(255,255,255,.03)",
              border:"1px solid "+(sel?deckCol:C.bd),
              color:sel?deckCol:C.dm,
              cursor:"pointer",
              minHeight:"32px"
            }
          },"#"+t);
        }),
        hasFilters && e("button",{
          onClick:DD_clearFilters,
          style:{
            fontSize:"11px",fontWeight:600,
            padding:"6px 10px",borderRadius:"8px",
            background:"none",border:"none",color:C.mt,
            cursor:"pointer",textDecoration:"underline",
            minHeight:"32px"
          }
        },"limpiar")
      )
    ),

    // ── Load error ──
    DD_loadErr && e("div",{style:{
      color:"#fca5a5",background:"rgba(239,68,68,.12)",
      border:"1px solid rgba(239,68,68,.35)",borderRadius:"10px",
      padding:"10px 12px",fontSize:"13px",marginBottom:"16px"
    }},DD_loadErr),

    // ── Loading skeletons (premium SkeletonList) ──
    DD_loading && e(window.SkeletonList || "div",{count:6,grid:true,minWidth:320,minHeight:110}),

    // ── Card list / empty states ──
    !DD_loading && DD_cards.length===0 && (canEdit
      ? e(window.EmptyState||"div",{
          icon:"🎴",
          title:"Esta baraja está vacía",
          description:"Empezá creando una tarjeta manualmente o dejá que Elion genere varias a partir de tus apuntes (texto, PDF o imagen).",
          actions:[
            {label:"+ Nueva tarjeta",onClick:function(){ DD_setEditCard(null); DD_setShowEditor(true); },variant:"primary"},
            {label:"✨ Generar con IA",onClick:function(){ DD_setElionOpen(true); },variant:"premium"}
          ]
        })
      : e(window.EmptyState||"div",{
          icon:"🎴",
          title:"Sin tarjetas todavía",
          description:"Aún no se cargaron tarjetas oficiales en esta baraja. Volvé a revisar más tarde."
        })),

    !DD_loading && DD_cards.length>0 && filteredCards.length===0 && e("div",{style:{
      background:C.cd,border:"1px dashed "+C.bd,
      borderRadius:"12px",padding:"28px 20px",textAlign:"center"
    }},
      e("div",{style:{fontSize:"32px",marginBottom:"8px"}},"🔍"),
      e("p",{style:{fontSize:"13px",color:C.tx,fontWeight:600,marginBottom:"4px"}},"Ningún resultado con esos filtros."),
      e("button",{
        onClick:DD_clearFilters,
        style:{
          marginTop:"10px",padding:"8px 14px",
          background:"none",border:"1px solid "+C.bd,
          color:C.ac2,borderRadius:"8px",
          fontSize:"12px",fontWeight:600,cursor:"pointer"
        }
      },"Limpiar filtros")
    ),

    !DD_loading && filteredCards.length>0 && e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))",gap:"14px",width:"100%"}},
      filteredCards.map(function(c,i){ return DD_cardItem(c,i); })
    ),

    // ══════════ DELETE CONFIRM ══════════
    DD_deleteConfirmId && e("div",{
      onClick:function(){ DD_setDeleteConfirmId(null); },
      style:{
        position:"fixed",top:0,left:0,right:0,bottom:0,
        background:"rgba(6,10,20,.78)",
        backdropFilter:"blur(4px)",WebkitBackdropFilter:"blur(4px)",
        display:"flex",alignItems:"center",justifyContent:"center",
        padding:"16px",zIndex:300,animation:"fadeIn .18s ease-out"
      }
    },
      e("div",{
        onClick:function(ev){ ev.stopPropagation(); },
        style:{
          width:"100%",maxWidth:"360px",
          background:C.cd,border:"1px solid "+C.bd,
          borderRadius:"16px",padding:"20px",
          boxShadow:"0 12px 40px rgba(0,0,0,.6)",
          animation:"slideUp .25s ease-out"
        }
      },
        e("div",{style:{fontSize:"32px",textAlign:"center",marginBottom:"10px"}},"🗑"),
        e("p",{style:{fontSize:"14px",color:C.tx,fontWeight:600,textAlign:"center",marginBottom:"6px"}},"¿Eliminar esta tarjeta?"),
        e("p",{style:{fontSize:"12px",color:C.dm,textAlign:"center",lineHeight:1.5,marginBottom:"18px"}},"Se borrará junto con su progreso. Esta acción no se puede deshacer."),
        e("div",{style:{display:"flex",gap:"8px"}},
          e("button",{
            onClick:function(){ DD_setDeleteConfirmId(null); },
            style:{
              flex:1,minHeight:"44px",padding:"10px",
              borderRadius:"10px",
              background:"none",border:"1px solid "+C.bd,
              color:C.mt,fontSize:"13px",fontWeight:600,cursor:"pointer"
            }
          },"Cancelar"),
          e("button",{
            onClick:function(){ DD_handleDelete(DD_deleteConfirmId); },
            style:{
              flex:1,minHeight:"44px",padding:"10px",
              borderRadius:"10px",
              background:"#ef4444",border:"none",
              color:"#fff",fontSize:"13px",fontWeight:700,cursor:"pointer"
            }
          },"Eliminar")
        )
      )
    ),
    DD_showEditor && e(FlashcardEditor,{
      user:user,
      deck:deck,
      card:DD_editCard,
      onSaved:function(){ DD_setShowEditor(false); DD_setEditCard(null); DD_loadCards(); },
      onClose:function(){ DD_setShowEditor(false); DD_setEditCard(null); }
    }),
    DD_previewIdx!==null&&(function(){
      var pc=filteredCards[DD_previewIdx];
      if(!pc) return null;
      var pcIsCloze=pc.card_type==="cloze";
      var pcTotal=filteredCards.length;
      return ReactDOM.createPortal(
        e("div",{
          onPointerDown:function(ev){ DD_swipeStartY.current=ev.clientY; },
          onPointerUp:function(ev){
            if(DD_swipeStartY.current!==null){
              var delta=ev.clientY-DD_swipeStartY.current;
              DD_swipeStartY.current=null;
              if(delta>60){ DD_setPreviewIdx(null); DD_setPreviewFlipped(false); }
            }
          },
          onClick:function(){ DD_setPreviewIdx(null); DD_setPreviewFlipped(false); },
          style:{
            position:"fixed",top:0,left:0,right:0,bottom:0,
            background:"rgba(6,10,20,.88)",
            backdropFilter:"blur(6px)",WebkitBackdropFilter:"blur(6px)",
            display:"flex",alignItems:"center",justifyContent:"center",
            padding:"16px",zIndex:1000
          }
        },
          e("div",{
            onClick:function(ev){ ev.stopPropagation(); },
            style:{
              width:"100%",maxWidth:"520px",
              background:C.cd,border:"1px solid "+C.bd,
              borderRadius:"20px",overflow:"hidden",
              boxShadow:"0 20px 60px rgba(0,0,0,.7)",
              display:"flex",flexDirection:"column"
            }
          },
            e("div",{style:{
              display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"14px 16px",borderBottom:"1px solid "+C.bd
            }},
              e("span",{style:{fontSize:"12px",color:C.dm,fontWeight:600}},
                String(DD_previewIdx+1)+" / "+String(pcTotal)
              ),
              e("button",{
                onClick:function(){ DD_setPreviewIdx(null); DD_setPreviewFlipped(false); },
                style:{background:"none",border:"none",color:C.dm,fontSize:"20px",
                  cursor:"pointer",lineHeight:1,padding:"4px 8px"}
              },"×")
            ),
            e("div",{style:{
              padding:"28px 24px",minHeight:"200px",
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              gap:"20px",textAlign:"center"
            }},
              e("div",{style:{fontSize:"17px",color:C.tx,fontWeight:600,lineHeight:1.5}},
                pcIsCloze
                  ?DD_previewClozeEl(pc.front||"",!DD_previewFlipped)
                  :(pc.front||"")
              ),
              !pcIsCloze&&DD_previewFlipped&&pc.back&&e("div",{style:{
                paddingTop:"16px",borderTop:"1px solid "+C.bd,width:"100%",
                fontSize:"15px",color:C.dm,lineHeight:1.5
              }},pc.back),
              e("button",{
                onClick:function(){ DD_setPreviewFlipped(!DD_previewFlipped); },
                style:{
                  padding:"10px 24px",borderRadius:"10px",
                  background:DD_previewFlipped?"rgba(255,255,255,.06)":"#a78bfa",
                  border:DD_previewFlipped?"1px solid "+C.bd:"none",
                  color:DD_previewFlipped?C.mt:"#fff",
                  fontSize:"13px",fontWeight:700,cursor:"pointer",minHeight:"40px"
                }
              },DD_previewFlipped?"Ocultar respuesta":"Mostrar respuesta")
            ),
            e("div",{style:{
              display:"flex",gap:"8px",
              padding:"14px 16px",borderTop:"1px solid "+C.bd
            }},
              e("button",{
                onClick:function(){
                  DD_setPreviewIdx(DD_previewIdx>0?DD_previewIdx-1:pcTotal-1);
                  DD_setPreviewFlipped(false);
                },
                style:{flex:1,minHeight:"44px",borderRadius:"10px",
                  background:"rgba(255,255,255,.04)",border:"1px solid "+C.bd,
                  color:C.tx,fontSize:"20px",cursor:"pointer"}
              },"◀"),
              e("button",{
                onClick:function(){
                  DD_setPreviewIdx(DD_previewIdx<pcTotal-1?DD_previewIdx+1:0);
                  DD_setPreviewFlipped(false);
                },
                style:{flex:1,minHeight:"44px",borderRadius:"10px",
                  background:"rgba(255,255,255,.04)",border:"1px solid "+C.bd,
                  color:C.tx,fontSize:"20px",cursor:"pointer"}
              },"▶")
            )
          )
        ),
        document.body
      );
    })(),
    DD_copyCard&&(function(){
      var cc=DD_copyCard;
      var frontPreview=(cc.front||"").slice(0,60)+((cc.front||"").length>60?"...":"");
      var showNewForm=DD_copyMode==='new'||(DD_copyMode==='select'&&DD_ownDecks.length===0);
      var canSubmit=!DD_copyLoading&&(showNewForm?DD_copyNewName.trim().length>0:DD_copyDeckId!=='');
      return ReactDOM.createPortal(
        e("div",{
          onClick:function(){ DD_setCopyCard(null); },
          style:{
            position:"fixed",top:0,left:0,right:0,bottom:0,
            background:"rgba(6,10,20,.88)",
            backdropFilter:"blur(6px)",WebkitBackdropFilter:"blur(6px)",
            display:"flex",alignItems:"center",justifyContent:"center",
            padding:"16px",zIndex:1000
          }
        },
          e("div",{
            onClick:function(ev){ ev.stopPropagation(); },
            style:{
              width:"100%",maxWidth:"480px",
              background:C.cd,border:"1px solid "+C.bd,
              borderRadius:"20px",overflow:"hidden",
              boxShadow:"0 20px 60px rgba(0,0,0,.7)",
              display:"flex",flexDirection:"column"
            }
          },
            e("div",{style:{
              display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"16px 18px",borderBottom:"1px solid "+C.bd
            }},
              e("span",{style:{fontSize:"14px",color:C.tx,fontWeight:700}},"📥 Agregar a mi baraja"),
              e("button",{
                onClick:function(){ DD_setCopyCard(null); },
                style:{background:"none",border:"none",color:C.dm,fontSize:"20px",
                  cursor:"pointer",lineHeight:1,padding:"4px 8px"}
              },"×")
            ),
            e("div",{style:{
              margin:"14px 18px",padding:"10px 14px",
              background:"rgba(255,255,255,.04)",border:"1px solid "+C.bd,
              borderRadius:"10px",fontSize:"13px",color:C.dm,lineHeight:1.4
            }},frontPreview),
            e("div",{style:{padding:"0 18px 18px"}},
              showNewForm
                ? e("div",null,
                    DD_copyMode==='new'&&DD_ownDecks.length>0&&e("button",{
                      onClick:function(){ DD_setCopyMode('select'); },
                      style:{background:"none",border:"none",color:C.ac2,fontSize:"12px",
                        cursor:"pointer",padding:"0 0 10px",fontWeight:600}
                    },"← Volver"),
                    e("div",{style:{fontSize:"12px",color:C.dm,marginBottom:"8px",fontWeight:600}},
                      "Nombre de la nueva baraja"),
                    e("input",{
                      type:"text",value:DD_copyNewName,autoFocus:true,
                      placeholder:"Mi baraja...",
                      onChange:function(ev){ DD_setCopyNewName(ev.target.value); },
                      onKeyDown:function(ev){ if(ev.key==="Enter"&&canSubmit) DD_execCopy(); },
                      style:{
                        width:"100%",minHeight:"44px",padding:"10px 14px",
                        borderRadius:"10px",border:"1px solid "+C.bd,
                        background:C.bg,color:C.tx,fontSize:"13px",
                        outline:"none",boxSizing:"border-box"
                      }
                    })
                  )
                : e("div",null,
                    e("div",{style:{fontSize:"12px",color:C.dm,marginBottom:"8px",fontWeight:600,paddingTop:"4px"}},
                      "Seleccionar baraja"),
                    e("div",{style:{display:"flex",flexDirection:"column",gap:"6px",maxHeight:"220px",overflowY:"auto"}},
                      DD_ownDecks.map(function(d){
                        var isSel=DD_copyDeckId===d.id;
                        return e("button",{key:d.id,
                          onClick:function(){ DD_setCopyDeckId(d.id); },
                          style:{
                            display:"flex",alignItems:"center",gap:"10px",
                            padding:"10px 14px",borderRadius:"10px",
                            border:"1px solid "+(isSel?C.ac:C.bd),
                            background:isSel?"rgba(96,165,250,.12)":"rgba(255,255,255,.03)",
                            color:isSel?C.ac:C.tx,fontSize:"13px",fontWeight:600,
                            cursor:"pointer",textAlign:"left"
                          }
                        },
                          e("span",null,(d.icon||"📚")),
                          e("span",{style:{flex:1}},d.name||"Sin nombre")
                        );
                      }),
                      e("button",{
                        onClick:function(){ DD_setCopyMode('new'); DD_setCopyNewName(''); },
                        style:{
                          display:"flex",alignItems:"center",gap:"6px",
                          padding:"10px 14px",borderRadius:"10px",
                          border:"1px dashed "+C.bd,
                          background:"none",color:C.mt,fontSize:"13px",
                          cursor:"pointer"
                        }
                      },"+ Crear nueva baraja")
                    )
                  )
            ),
            e("div",{style:{padding:"14px 18px",borderTop:"1px solid "+C.bd}},
              e("button",{
                onClick:DD_execCopy,
                disabled:!canSubmit,
                style:{
                  width:"100%",minHeight:"44px",padding:"12px",
                  borderRadius:"12px",border:"none",
                  background:canSubmit?"#3b82f6":"rgba(255,255,255,.08)",
                  color:canSubmit?"#fff":C.mt,
                  fontSize:"14px",fontWeight:700,
                  cursor:canSubmit?"pointer":"default"
                }
              },DD_copyLoading?"Agregando...":"Agregar")
            )
          )
        ),
        document.body
      );
    })(),
    DD_editDeckOpen&&ReactDOM.createPortal(
      e("div",{
        onClick:function(){ if(!DD_editDeckLoading){ DD_setEditDeckOpen(false); } },
        style:{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",
          display:"flex",alignItems:"center",justifyContent:"center",
          zIndex:1050,padding:"16px"}
      },
        e("div",{
          onClick:function(ev){ ev.stopPropagation(); },
          style:{width:"100%",maxWidth:"420px",background:C.cd,
            border:"1px solid "+C.bd,borderRadius:"16px",
            boxShadow:"0 12px 40px rgba(0,0,0,.6)",overflow:"hidden"}
        },
          e("div",{style:{
            display:"flex",alignItems:"center",justifyContent:"space-between",
            padding:"16px 18px",borderBottom:"1px solid "+C.bd
          }},
            e("span",{style:{fontSize:"14px",color:C.tx,fontWeight:700}},"✏️ Editar baraja"),
            e("button",{
              onClick:function(){ DD_setEditDeckOpen(false); },
              disabled:DD_editDeckLoading,
              style:{background:"none",border:"none",color:C.dm,fontSize:"20px",
                cursor:"pointer",lineHeight:1,padding:"4px 8px"}
            },"×")
          ),
          e("div",{style:{padding:"18px",display:"flex",flexDirection:"column",gap:"14px"}},
            e("div",null,
              e("div",{style:{fontSize:"12px",color:C.dm,fontWeight:600,marginBottom:"6px"}},"Nombre"),
              e("input",{
                type:"text",value:DD_editDeckName,autoFocus:true,
                disabled:DD_editDeckLoading,
                onChange:function(ev){ DD_setEditDeckName(ev.target.value); },
                onKeyDown:function(ev){ if(ev.key==="Enter"&&DD_editDeckName.trim()) DD_execEditDeck(); },
                style:{width:"100%",minHeight:"42px",padding:"8px 12px",
                  borderRadius:"10px",border:"1px solid "+C.bd,
                  background:C.bg,color:C.tx,fontSize:"13px",
                  outline:"none",boxSizing:"border-box"}
              })
            ),
            e("div",null,
              e("div",{style:{fontSize:"12px",color:C.dm,fontWeight:600,marginBottom:"6px"}},"Descripción"),
              e("input",{
                type:"text",value:DD_editDeckDesc,
                disabled:DD_editDeckLoading,
                placeholder:"Opcional...",
                onChange:function(ev){ DD_setEditDeckDesc(ev.target.value); },
                style:{width:"100%",minHeight:"42px",padding:"8px 12px",
                  borderRadius:"10px",border:"1px solid "+C.bd,
                  background:C.bg,color:C.tx,fontSize:"13px",
                  outline:"none",boxSizing:"border-box"}
              })
            ),
            e("div",null,
              e("div",{style:{fontSize:"12px",color:C.dm,fontWeight:600,marginBottom:"8px"}},"Color"),
              e("div",{style:{display:"flex",flexWrap:"wrap",gap:"8px"}},
                DD_DECK_COLORS.map(function(col){
                  var isSel=DD_editDeckColor===col;
                  return e("button",{key:col,
                    onClick:function(){ DD_setEditDeckColor(col); },
                    style:{
                      width:"28px",height:"28px",borderRadius:"50%",
                      background:col,border:isSel?"3px solid #fff":"2px solid transparent",
                      cursor:"pointer",boxSizing:"border-box",
                      boxShadow:isSel?"0 0 0 2px "+col:""
                    }
                  });
                })
              )
            ),
            e("div",null,
              e("div",{style:{fontSize:"12px",color:C.dm,fontWeight:600,marginBottom:"6px"}},"Ícono (emoji)"),
              e("input",{
                type:"text",value:DD_editDeckIcon,
                disabled:DD_editDeckLoading,
                maxLength:2,
                onChange:function(ev){ DD_setEditDeckIcon(ev.target.value); },
                style:{width:"70px",minHeight:"42px",padding:"8px 12px",
                  borderRadius:"10px",border:"1px solid "+C.bd,
                  background:C.bg,color:C.tx,fontSize:"22px",textAlign:"center",
                  outline:"none",boxSizing:"border-box"}
              })
            ),
            DD_editDeckErr&&e("div",{style:{fontSize:"12px",color:"#fca5a5",fontWeight:600}},DD_editDeckErr)
          ),
          e("div",{style:{
            padding:"14px 18px",borderTop:"1px solid "+C.bd,
            display:"flex",gap:"8px"
          }},
            e("button",{
              onClick:DD_execEditDeck,
              disabled:!DD_editDeckName.trim()||DD_editDeckLoading,
              style:{
                flex:1,minHeight:"44px",padding:"12px",borderRadius:"12px",border:"none",
                background:(DD_editDeckName.trim()&&!DD_editDeckLoading)?"#a78bfa":"rgba(255,255,255,.08)",
                color:(DD_editDeckName.trim()&&!DD_editDeckLoading)?"#fff":C.mt,
                fontSize:"14px",fontWeight:700,
                cursor:(DD_editDeckName.trim()&&!DD_editDeckLoading)?"pointer":"default"
              }
            },DD_editDeckLoading?"Guardando...":"Guardar"),
            e("button",{
              onClick:function(){ DD_setEditDeckOpen(false); },
              disabled:DD_editDeckLoading,
              style:{minHeight:"44px",padding:"12px 18px",borderRadius:"12px",
                background:"none",border:"1px solid "+C.bd,
                color:C.mt,fontSize:"14px",fontWeight:700,cursor:"pointer"}
            },"Cancelar")
          )
        )
      ),
      document.body
    ),
    DD_copySuccess&&ReactDOM.createPortal(
      e("div",{style:{
        position:"fixed",bottom:"80px",left:"50%",transform:"translateX(-50%)",
        background:"rgba(52,211,153,.15)",border:"1px solid rgba(52,211,153,.4)",
        color:"#34d399",borderRadius:"10px",padding:"10px 20px",
        fontSize:"13px",fontWeight:700,zIndex:1100,
        whiteSpace:"nowrap",pointerEvents:"none"
      }},"✓ Card agregada a tu baraja"),
      document.body
    ),
    DD_tagBulkOpen&&(function(){
      var tbTag=DD_tagBulkInput.trim().toLowerCase().replace(/[^a-z0-9\-_áéíóúñü]/g,"");
      var canAdd=!!tbTag&&!DD_tagBulkLoading;
      var tbSuggs=[];
      for(var tbs=0;tbs<DD_userTagsList.length;tbs++){
        var tbsn=DD_userTagsList[tbs].name;
        var tbq=DD_tagBulkInput.trim().toLowerCase();
        if(!tbq||tbsn.indexOf(tbq)>=0) tbSuggs.push(tbsn);
      }
      return ReactDOM.createPortal(
        e("div",{
          onClick:function(){ if(!DD_tagBulkLoading){ DD_setTagBulkOpen(false); DD_setTagBulkInput(""); DD_setTagBulkErrMsg(""); } },
          style:{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",
            display:"flex",alignItems:"center",justifyContent:"center",
            zIndex:1050,padding:"16px"}
        },
          e("div",{
            onClick:function(ev){ ev.stopPropagation(); },
            style:{width:"100%",maxWidth:"400px",background:C.cd,
              border:"1px solid "+C.bd,borderRadius:"16px",
              boxShadow:"0 12px 40px rgba(0,0,0,.6)",overflow:"hidden"}
          },
            e("div",{style:{
              display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"16px 18px",borderBottom:"1px solid "+C.bd
            }},
              e("span",{style:{fontSize:"14px",color:C.tx,fontWeight:700}},
                "🏷 Agregar etiqueta a "+DD_selectCount+" card"+(DD_selectCount===1?"":"s")
              ),
              e("button",{
                onClick:function(){ DD_setTagBulkOpen(false); DD_setTagBulkInput(""); DD_setTagBulkErrMsg(""); },
                disabled:DD_tagBulkLoading,
                style:{background:"none",border:"none",color:C.dm,fontSize:"20px",
                  cursor:"pointer",lineHeight:1,padding:"4px 8px"}
              },"×")
            ),
            e("div",{style:{padding:"14px 18px 0"}},
              e("input",{
                type:"text",value:DD_tagBulkInput,
                autoFocus:true,disabled:DD_tagBulkLoading,
                placeholder:"Nombre del tag...",
                onChange:function(ev){ DD_setTagBulkInput(ev.target.value); },
                onKeyDown:function(ev){
                  if(ev.key==="Enter"&&canAdd) DD_execBulkTag();
                  if(ev.key==="Escape"){ DD_setTagBulkOpen(false); DD_setTagBulkInput(""); DD_setTagBulkErrMsg(""); }
                },
                style:{
                  width:"100%",minHeight:"44px",padding:"10px 14px",
                  borderRadius:"10px",border:"1px solid "+C.bd,
                  background:C.bg,color:C.tx,fontSize:"13px",
                  outline:"none",boxSizing:"border-box"
                }
              }),
              tbSuggs.length>0&&e("div",{style:{
                display:"flex",flexWrap:"wrap",gap:"6px",marginTop:"10px"
              }},
                tbSuggs.map(function(tag){
                  var col=DD_userTagColorMap[tag]||"#a78bfa";
                  return e("button",{key:tag,
                    onClick:function(){ DD_setTagBulkInput(tag); },
                    style:{padding:"4px 12px",borderRadius:"999px",
                      background:col+"14",border:"1px solid "+col+"38",
                      color:col,fontSize:"11px",fontWeight:600,cursor:"pointer",minHeight:"28px"}
                  },"#"+tag);
                })
              )
            ),
            DD_tagBulkErrMsg&&e("div",{style:{margin:"10px 18px 0",fontSize:"12px",
              color:"#fca5a5",fontWeight:600}},DD_tagBulkErrMsg),
            e("div",{style:{
              padding:"14px 18px",borderTop:"1px solid "+C.bd,
              display:"flex",gap:"8px",marginTop:"14px"
            }},
              e("button",{
                onClick:DD_execBulkTag,
                disabled:!canAdd,
                style:{
                  flex:1,minHeight:"44px",padding:"12px",borderRadius:"12px",
                  border:"none",
                  background:canAdd?"#a78bfa":"rgba(255,255,255,.08)",
                  color:canAdd?"#fff":C.mt,
                  fontSize:"14px",fontWeight:700,
                  cursor:canAdd?"pointer":"default"
                }
              },DD_tagBulkLoading?"Agregando...":"Agregar"),
              e("button",{
                onClick:function(){ DD_setTagBulkOpen(false); DD_setTagBulkInput(""); DD_setTagBulkErrMsg(""); },
                disabled:DD_tagBulkLoading,
                style:{
                  minHeight:"44px",padding:"12px 18px",borderRadius:"12px",
                  background:"none",border:"1px solid "+C.bd,
                  color:C.mt,fontSize:"14px",fontWeight:700,cursor:"pointer"
                }
              },"Cancelar")
            )
          )
        ),
        document.body
      );
    })(),
    DD_bulkAction&&(function(){
      var isMove=DD_bulkAction==="move";
      var otherDecks=[];
      for(var bdo=0;bdo<DD_ownDecks.length;bdo++){
        if(DD_ownDecks[bdo].id!==deck.id) otherDecks.push(DD_ownDecks[bdo]);
      }
      var canConfirm=!!DD_bulkTargetDeckId&&!DD_bulkLoading;
      return ReactDOM.createPortal(
        e("div",{
          onClick:function(){ if(!DD_bulkLoading){ DD_setBulkAction(null); DD_setBulkTargetDeckId(""); DD_setBulkErrMsg(""); } },
          style:{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",
            display:"flex",alignItems:"center",justifyContent:"center",
            zIndex:1050,padding:"16px"}
        },
          e("div",{
            onClick:function(ev){ ev.stopPropagation(); },
            style:{width:"100%",maxWidth:"440px",background:C.cd,
              border:"1px solid "+C.bd,borderRadius:"16px",
              boxShadow:"0 12px 40px rgba(0,0,0,.6)",overflow:"hidden"}
          },
            e("div",{style:{
              display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"16px 18px",borderBottom:"1px solid "+C.bd
            }},
              e("span",{style:{fontSize:"14px",color:C.tx,fontWeight:700}},
                (isMove?"📦 Mover ":"📋 Copiar ")+DD_selectCount+" card"+(DD_selectCount===1?"":"s")
              ),
              e("button",{
                onClick:function(){ DD_setBulkAction(null); DD_setBulkTargetDeckId(""); DD_setBulkErrMsg(""); },
                disabled:DD_bulkLoading,
                style:{background:"none",border:"none",color:C.dm,fontSize:"20px",
                  cursor:"pointer",lineHeight:1,padding:"4px 8px"}
              },"×")
            ),
            e("div",{style:{padding:"14px 18px 0"}},
              otherDecks.length===0
                ?e("div",{style:{
                    padding:"20px",textAlign:"center",
                    fontSize:"13px",color:C.dm,lineHeight:1.5
                  }},
                    e("div",{style:{fontSize:"28px",marginBottom:"8px"}},"📭"),
                    "No tenés otras barajas. Creá una desde la pantalla principal."
                  )
                :e("div",null,
                    e("div",{style:{fontSize:"12px",color:C.dm,marginBottom:"8px",fontWeight:600}},
                      "Seleccionar baraja destino"
                    ),
                    e("div",{style:{display:"flex",flexDirection:"column",gap:"6px",maxHeight:"240px",overflowY:"auto"}},
                      otherDecks.map(function(d){
                        var isSel=DD_bulkTargetDeckId===d.id;
                        return e("button",{key:d.id,
                          onClick:function(){ DD_setBulkTargetDeckId(d.id); },
                          style:{
                            display:"flex",alignItems:"center",gap:"10px",
                            padding:"10px 14px",borderRadius:"10px",
                            border:"1px solid "+(isSel?C.ac:C.bd),
                            background:isSel?"rgba(96,165,250,.12)":"rgba(255,255,255,.03)",
                            color:isSel?C.ac:C.tx,fontSize:"13px",fontWeight:600,
                            cursor:"pointer",textAlign:"left"
                          }
                        },
                          e("span",null,(d.icon||"📚")),
                          e("span",{style:{flex:1}},d.name||"Sin nombre")
                        );
                      })
                    )
                  )
            ),
            DD_bulkErrMsg&&e("div",{style:{margin:"10px 18px 0",fontSize:"12px",
              color:"#fca5a5",fontWeight:600}},DD_bulkErrMsg),
            e("div",{style:{
              padding:"14px 18px",borderTop:"1px solid "+C.bd,
              display:"flex",gap:"8px",marginTop:"14px"
            }},
              otherDecks.length>0&&e("button",{
                onClick:isMove?DD_execBulkMove:DD_execBulkCopy,
                disabled:!canConfirm,
                style:{
                  flex:1,minHeight:"44px",padding:"12px",borderRadius:"12px",
                  border:"none",
                  background:canConfirm?"#3b82f6":"rgba(255,255,255,.08)",
                  color:canConfirm?"#fff":C.mt,
                  fontSize:"14px",fontWeight:700,
                  cursor:canConfirm?"pointer":"default"
                }
              },DD_bulkLoading?(isMove?"Moviendo...":"Copiando..."):(isMove?"Mover":"Copiar")),
              e("button",{
                onClick:function(){ DD_setBulkAction(null); DD_setBulkTargetDeckId(""); DD_setBulkErrMsg(""); },
                disabled:DD_bulkLoading,
                style:{
                  minHeight:"44px",padding:"12px 18px",borderRadius:"12px",
                  background:"none",border:"1px solid "+C.bd,
                  color:C.mt,fontSize:"14px",fontWeight:700,cursor:"pointer"
                }
              },"Cancelar")
            )
          )
        ),
        document.body
      );
    })(),
    DD_elionOpen&&user&&deck&&e(ElionGenerator,{
      user:user,
      supabase:window.ECEPT_SUPABASE,
      deckId:deck.id,
      onImport:async function(cards){
        var inserts=[];
        for(var ni=0;ni<cards.length;ni++){
          inserts.push({
            deck_id:deck.id,
            user_id:user.id,
            is_official:false,
            card_type:cards[ni].card_type,
            front:cards[ni].front,
            back:cards[ni].back||"",
            tags:cards[ni].tags||[]
          });
        }
        await window.ECEPT_SUPABASE.from("flashcards").insert(inserts);
        DD_setElionOpen(false);
        DD_loadCards();
      },
      onClose:function(){ DD_setElionOpen(false); }
    })
  ));
}

window.DeckDetailView = DeckDetailView;
