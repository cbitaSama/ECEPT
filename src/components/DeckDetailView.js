// ══════════════════════════════════════════════════════════════
// DECK DETAIL VIEW — listado de flashcards de una baraja
// ──────────────────────────────────────────────────────────────
// ES5 estricto: solo declaraciones var y function. Nada de ES6+.
// React.createElement vía el alias global `e`. Sin JSX.
// Globales internos con prefijo DD_ para evitar colisiones.
// Props: user, deck, onBack, go
// ══════════════════════════════════════════════════════════════
var DD_styleInjected=false;

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
  var DD_showAnswers=s[0], DD_setShowAnswers=s[1];

  // ── Inject CSS once ──
  useEffect(function(){
    if(!DD_styleInjected){
      var st=document.createElement("style");
      st.textContent=
        "@keyframes DD_shimmer{0%{background-position:-300px 0}100%{background-position:300px 0}}" +
        ".dd-skel{background:linear-gradient(90deg,rgba(255,255,255,.03) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.03) 75%);background-size:600px 100%;animation:DD_shimmer 1.4s ease-in-out infinite;border-radius:6px}" +
        ".dd-card-item{transition:box-shadow .15s ease,background .15s ease}" +
        ".dd-card-item:hover{background:#111827!important;box-shadow:0 4px 18px rgba(0,0,0,.35)}";
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
        DD_setLoading(false);
        DD_setLoadErr("No se pudieron cargar las tarjetas.");
        return;
      }
      var allCards=(cardRes&&cardRes.data)||[];
      DD_setCards(allCards);

      var progMap={};
      var progRows=(progRes&&progRes.data)||[];
      for(var i=0;i<progRows.length;i++){
        progMap[progRows[i].flashcard_id]=progRows[i];
      }
      DD_setProgress(progMap);
      // Para barajas oficiales con sesión: cargar user_tags + user_card_tags
      if(deck.is_official&&user&&window.ECEPT_SUPABASE){
        var cids=[];
        for(var uci=0;uci<allCards.length;uci++){ cids.push(allCards[uci].id); }
        var utP=window.ECEPT_SUPABASE.from("user_tags").select("id,name,color").eq("user_id",user.id).order("name");
        var uctP=cids.length>0
          ?window.ECEPT_SUPABASE.from("user_card_tags").select("flashcard_id,tag").eq("user_id",user.id).in("flashcard_id",cids)
          :Promise.resolve({data:[],error:null});
        Promise.all([utP,uctP]).then(function(r2){
          DD_setUserTagsList((r2[0]&&!r2[0].error)?(r2[0].data||[]):[]);
          var uctMap={};
          var uctRows=(r2[1]&&!r2[1].error)?(r2[1].data||[]):[];
          for(var j=0;j<uctRows.length;j++){
            var fid2=uctRows[j].flashcard_id;
            if(!uctMap[fid2]) uctMap[fid2]=[];
            uctMap[fid2].push(uctRows[j].tag);
          }
          DD_setUserCardTags(uctMap);
          DD_setLoading(false);
        }).catch(function(){ DD_setLoading(false); });
      } else {
        DD_setLoading(false);
      }
    }).catch(function(){
      DD_setLoading(false);
      DD_setLoadErr("Error de conexión.");
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
  var deckCol=deck.color||"#a78bfa";
  var deckIcon=deck.icon||"🎴";
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

    return e("div",{
      key:c.id,
      className:"dd-card-item",
      onClick:function(){ DD_setPreviewIdx(i); DD_setPreviewFlipped(false); },
      style:{
        position:"relative",cursor:"pointer",
        background:C.cd,border:"1px solid "+C.bd,
        borderRadius:"12px",padding:"14px 14px 12px",
        marginBottom:"8px"
      }
    },
      // Main row: icon + content + menu button
      e("div",{style:{display:"flex",gap:"12px",alignItems:"flex-start"}},
        // Type icon circle
        e("div",{style:{
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
        canEdit
          ? e("button",{
              onClick:function(ev){ ev.stopPropagation(); DD_setMenuOpenId(isMenuOpen?null:c.id); },
              "aria-label":"Opciones",
              style:{
                background:"none",border:"none",color:C.dm,fontSize:"16px",cursor:"pointer",
                width:"32px",height:"32px",flexShrink:0,
                display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"6px",marginTop:"-2px"
              }
            },"⋮")
          : isOfficial&&e("span",{style:{fontSize:"9px",color:C.dm,fontWeight:600,flexShrink:0,paddingTop:"2px"}},"⭐")
      ),
      // ⋮ Dropdown
      isMenuOpen&&e("div",{
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
    e("div",{style:{maxWidth:"760px",margin:"0 auto",padding:"20px 16px 80px",position:"relative"}},

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
          }},deck.name||"Sin nombre"),
          isOfficial && e("span",{style:{
            fontSize:"9px",padding:"3px 8px",borderRadius:"6px",
            background:deckCol+"22",color:deckCol,fontWeight:700,
            flexShrink:0,whiteSpace:"nowrap"
          }},"Oficial ⭐")
        ),
        deck.description && e("p",{style:{fontSize:"12px",color:C.dm,lineHeight:1.4,margin:0}},deck.description)
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
    e("div",{style:{display:"flex",gap:"8px",marginBottom:"22px",flexWrap:"wrap"}},
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
      },"+ Nueva tarjeta")
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
        },DD_showAnswers?"👁 Ocultar respuestas":"👁 Mostrar respuestas")
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

    // ── Loading skeletons ──
    DD_loading && e("div",null,
      DD_skeletonCard("dsk1"),DD_skeletonCard("dsk2"),DD_skeletonCard("dsk3")
    ),

    // ── Card list / empty states ──
    !DD_loading && DD_cards.length===0 && e("div",{style:{
      background:C.cd,border:"1px dashed "+C.bd,
      borderRadius:"14px",padding:"40px 24px",textAlign:"center"
    }},
      e("div",{style:{fontSize:"48px",marginBottom:"12px"}},"🎴"),
      e("p",{style:{fontSize:"14px",color:C.tx,fontWeight:600,marginBottom:"6px"}},"Esta baraja está vacía."),
      e("p",{style:{fontSize:"12px",color:C.dm,lineHeight:1.5}},
        canEdit?"¡Agrega tu primera tarjeta!":"Aún no se cargaron tarjetas oficiales."
      )
    ),

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

    !DD_loading && filteredCards.length>0 && e("div",null,
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
    })()
  ));
}

window.DeckDetailView = DeckDetailView;
