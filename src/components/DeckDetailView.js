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

  // ── Inject CSS once ──
  useEffect(function(){
    if(!DD_styleInjected){
      var st=document.createElement("style");
      st.textContent=
        "@keyframes DD_shimmer{0%{background-position:-300px 0}100%{background-position:300px 0}}" +
        ".dd-skel{background:linear-gradient(90deg,rgba(255,255,255,.03) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.03) 75%);background-size:600px 100%;animation:DD_shimmer 1.4s ease-in-out infinite;border-radius:6px}";
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
      DD_setLoading(false);
    }).catch(function(){
      DD_setLoading(false);
      DD_setLoadErr("Error de conexión.");
    });
  }

  useEffect(function(){ DD_loadCards(); },[]);

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
      e("p",{style:{color:C.dm,fontSize:"12px",marginBottom:"22px",lineHeight:1.5}},"Volvé a la lista de barajas para elegir una."),
      e("button",{
        onClick:props.onBack,
        style:{
          minWidth:"44px",minHeight:"44px",padding:"12px 18px",
          borderRadius:"10px",
          background:"linear-gradient(135deg,#a78bfa,#60a5fa)",
          color:"#fff",border:"none",fontSize:"14px",fontWeight:700,
          cursor:"pointer"
        }
      },"← Volver a Flashcards")
    );
  }

  // ── Baraja privada sin sesión ──
  if(!user&&!deck.is_official){
    return e("div",{style:{maxWidth:"540px",margin:"0 auto",padding:"20px 20px 60px"}},
      e("div",{style:{marginBottom:"32px"}},
        e("button",{onClick:props.onBack,"aria-label":"Volver",style:{
          background:"none",border:"none",color:C.mt,fontSize:"20px",cursor:"pointer",
          minWidth:"44px",minHeight:"44px",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"10px"
        }},"←")
      ),
      e("div",{style:{textAlign:"center",padding:"20px 0"}},
        e("div",{style:{fontSize:"48px",marginBottom:"12px"}},"🔒"),
        e("p",{style:{fontSize:"15px",color:C.tx,fontWeight:700,marginBottom:"8px"}},"Esta baraja requiere cuenta"),
        e("p",{style:{fontSize:"13px",color:C.dm,lineHeight:1.5,marginBottom:"22px"}},"Iniciá sesión para ver y crear tus barajas personales."),
        e("button",{onClick:props.onBack,style:{
          padding:"10px 20px",borderRadius:"10px",background:"none",
          border:"1px solid "+C.bd,color:C.tx,fontSize:"13px",fontWeight:600,
          cursor:"pointer",minHeight:"44px"
        }},"← Volver a Flashcards")
      )
    );
  }

  // ── Derived ──
  var deckCol=deck.color||"#a78bfa";
  var deckIcon=deck.icon||"🎴";
  var isOfficial=!!deck.is_official;
  var canEdit=!isOfficial && user && deck.user_id===user.id;

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
    var preview=DD_previewText(c.front,c.card_type);
    var hasProgress=!!DD_progress[c.id];
    var pStatus="";
    if(!hasProgress){ pStatus="nueva"; }
    else if(DD_progress[c.id].next_review<=nowIso){ pStatus="hoy"; }
    return e("div",{
      key:c.id,
      style:{
        position:"relative",
        background:C.cd,border:"1px solid "+C.bd,
        borderRadius:"12px",padding:"14px",
        marginBottom:"10px",
        animation:"slideUp .3s ease-out "+(Math.min(i,10)*0.03)+"s both"
      }
    },
      // Top row: type badge + status pill + ⋮
      e("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}},
        DD_typeBadge(c.card_type||"basic"),
        pStatus==="nueva" && e("span",{style:{
          fontSize:"9px",fontWeight:700,padding:"3px 7px",borderRadius:"4px",
          background:"rgba(167,139,250,.15)",color:"#a78bfa",letterSpacing:"0.5px"
        }},"NUEVA"),
        pStatus==="hoy" && e("span",{style:{
          fontSize:"9px",fontWeight:700,padding:"3px 7px",borderRadius:"4px",
          background:"rgba(251,191,36,.15)",color:"#fbbf24",letterSpacing:"0.5px"
        }},"HOY"),
        e("div",{style:{flex:1}}),
        canEdit
          ? e("button",{
              onClick:function(ev){ ev.stopPropagation(); DD_setMenuOpenId(isMenuOpen?null:c.id); },
              "aria-label":"Opciones",
              style:{
                background:"none",border:"none",color:C.dm,
                fontSize:"16px",cursor:"pointer",
                width:"32px",height:"32px",flexShrink:0,
                display:"flex",alignItems:"center",justifyContent:"center",
                borderRadius:"6px"
              }
            },"⋮")
          : isOfficial && e("span",{style:{fontSize:"9px",color:C.dm,fontWeight:600,letterSpacing:"0.5px"}},"⭐ SOLO LECTURA")
      ),
      // Front preview
      e("div",{style:{
        fontSize:"13px",color:C.tx,lineHeight:1.5,
        wordBreak:"break-word",whiteSpace:"pre-wrap",
        marginBottom:Array.isArray(c.tags)&&c.tags.length>0?"8px":0
      }},preview),
      // Tags
      Array.isArray(c.tags)&&c.tags.length>0 && e("div",{style:{display:"flex",flexWrap:"wrap",gap:"4px"}},
        c.tags.map(function(t,ti){
          return e("span",{key:ti,style:{
            fontSize:"10px",fontWeight:600,padding:"2px 7px",
            borderRadius:"999px",background:"rgba(255,255,255,.05)",
            border:"1px solid "+C.bd,color:C.dm
          }},"#"+t);
        })
      ),
      // ⋮ Dropdown
      isMenuOpen && e("div",{
        onClick:function(ev){ ev.stopPropagation(); },
        style:{
          position:"absolute",top:"38px",right:"10px",
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
          style:{
            display:"block",width:"100%",minHeight:"44px",
            padding:"10px 14px",textAlign:"left",
            background:"none",border:"none",color:C.tx,
            fontSize:"13px",fontWeight:600,cursor:"pointer"
          }
        },"✏️  Editar"),
        e("div",{style:{height:"1px",background:C.bd}}),
        e("button",{
          onClick:function(ev){
            ev.stopPropagation();
            DD_setMenuOpenId(null);
            setTimeout(function(){ DD_setDeleteConfirmId(c.id); },0);
          },
          style:{
            display:"block",width:"100%",minHeight:"44px",
            padding:"10px 14px",textAlign:"left",
            background:"none",border:"none",color:"#fca5a5",
            fontSize:"13px",fontWeight:600,cursor:"pointer"
          }
        },"🗑  Eliminar")
      )
    );
  }

  return e(F,null,
    e("div",{style:{maxWidth:"760px",margin:"0 auto",padding:"20px 16px 80px",position:"relative"}},

    // ── Click-outside backdrop ──
    DD_menuOpenId && e("div",{
      onClick:function(){ DD_setMenuOpenId(null); },
      style:{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:4}
    }),

    // ── Header ──
    e("div",{style:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"}},
      e("button",{
        onClick:props.onBack,
        "aria-label":"Volver",
        style:{
          background:"none",border:"none",color:C.mt,
          fontSize:"20px",cursor:"pointer",
          minWidth:"44px",minHeight:"44px",
          display:"flex",alignItems:"center",justifyContent:"center",
          borderRadius:"10px",flexShrink:0
        }
      },"←"),
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
      e("input",{
        type:"text",value:DD_search,
        onChange:function(ev){ DD_setSearch(ev.target.value); },
        placeholder:"Buscar en esta baraja...",
        style:{
          width:"100%",minHeight:"44px",padding:"10px 14px",
          borderRadius:"10px",border:"1px solid "+C.bd,
          background:C.bg,color:C.tx,fontSize:"13px",
          outline:"none",boxSizing:"border-box",
          marginBottom:allTags.length>0?"10px":0
        }
      }),
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
    })
  ));
}

window.DeckDetailView = DeckDetailView;
