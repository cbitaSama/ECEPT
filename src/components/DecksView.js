// ══════════════════════════════════════════════════════════════
// DECKS VIEW — lista de barajas de flashcards
// ──────────────────────────────────────────────────────────────
// ES5 estricto: solo declaraciones var y function. Nada de ES6+.
// React.createElement vía el alias global `e`. Sin JSX.
// Globales internos con prefijo DV_ para evitar colisiones.
// Props: user, onBack, go
// ══════════════════════════════════════════════════════════════
var DV_styleInjected=false;
var DV_ICON_OPTS=["🎴","🩺","🧠","❤️","🫁","🦴","💊","🧬","📚","🔬","🩻","⚗️"];
var DV_COLOR_OPTS=["#a78bfa","#60a5fa","#34d399","#fbbf24","#f472b6","#ef4444"];

function DecksView(props){
  var user=props.user;
  var go=props.go;
  var s;

  s=useState(true);  var DV_loading=s[0],     DV_setLoading=s[1];
  s=useState([]);    var DV_decks=s[0],       DV_setDecks=s[1];
  s=useState({});    var DV_counts=s[0],      DV_setCounts=s[1];
  s=useState(0);     var DV_dueToday=s[0],    DV_setDueToday=s[1];
  s=useState("");    var DV_loadErr=s[0],     DV_setLoadErr=s[1];

  // Modal state: null | "create" | {mode:"edit", deck:...}
  s=useState(null);    var DV_modalMode=s[0], DV_setModalMode=s[1];
  s=useState("");      var DV_mName=s[0],     DV_setMName=s[1];
  s=useState("");      var DV_mDesc=s[0],     DV_setMDesc=s[1];
  s=useState("🎴");    var DV_mIcon=s[0],     DV_setMIcon=s[1];
  s=useState("#a78bfa"); var DV_mColor=s[0],  DV_setMColor=s[1];
  s=useState(false);   var DV_mLoading=s[0],  DV_setMLoading=s[1];
  s=useState("");      var DV_mErr=s[0],      DV_setMErr=s[1];

  // Card menu / delete confirm
  s=useState(null); var DV_menuOpenId=s[0],     DV_setMenuOpenId=s[1];
  s=useState(null); var DV_deleteConfirmId=s[0], DV_setDeleteConfirmId=s[1];

  // ── Inject CSS once ──
  useEffect(function(){
    if(!DV_styleInjected){
      var st=document.createElement("style");
      st.textContent=
        "@keyframes DV_shimmer{0%{background-position:-300px 0}100%{background-position:300px 0}}" +
        ".dv-card{transition:transform .15s ease-out,border-color .15s ease-out}" +
        ".dv-card:hover{transform:translateY(-2px)}" +
        ".dv-skel{background:linear-gradient(90deg,rgba(255,255,255,.03) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.03) 75%);background-size:600px 100%;animation:DV_shimmer 1.4s ease-in-out infinite;border-radius:6px}";
      document.head.appendChild(st);
      DV_styleInjected=true;
    }
  },[]);

  function DV_loadData(){
    if(!user||!window.ECEPT_SUPABASE){ DV_setLoading(false); return; }
    DV_setLoading(true); DV_setLoadErr("");

    var deckPromise=window.ECEPT_SUPABASE
      .from("decks")
      .select("id,name,description,color,icon,is_official,user_id,created_at")
      .or("is_official.eq.true,user_id.eq."+user.id)
      .order("is_official",{ascending:false})
      .order("created_at",{ascending:false});

    var cardsPromise=window.ECEPT_SUPABASE
      .from("flashcards")
      .select("deck_id");

    var nowIso=new Date().toISOString();
    var duePromise=window.ECEPT_SUPABASE
      .from("flashcard_progress")
      .select("flashcard_id",{count:"exact",head:true})
      .eq("user_id",user.id)
      .lte("next_review",nowIso);

    Promise.all([deckPromise,cardsPromise,duePromise]).then(function(results){
      var deckRes=results[0], cardRes=results[1], dueRes=results[2];
      if(deckRes&&deckRes.error){
        DV_setLoading(false);
        DV_setLoadErr("No se pudieron cargar las barajas.");
        return;
      }
      DV_setDecks((deckRes&&deckRes.data)||[]);

      var counts={};
      var cards=(cardRes&&cardRes.data)?cardRes.data:[];
      for(var i=0;i<cards.length;i++){
        var did=cards[i].deck_id;
        counts[did]=(counts[did]||0)+1;
      }
      DV_setCounts(counts);
      DV_setDueToday((dueRes&&typeof dueRes.count==="number")?dueRes.count:0);
      DV_setLoading(false);
    }).catch(function(){
      DV_setLoading(false);
      DV_setLoadErr("Error de conexión.");
    });
  }

  useEffect(function(){ DV_loadData(); },[]);

  function DV_openCreate(){
    DV_setMName(""); DV_setMDesc("");
    DV_setMIcon("🎴"); DV_setMColor("#a78bfa");
    DV_setMErr(""); DV_setMLoading(false);
    DV_setModalMode("create");
  }

  function DV_openEdit(deck){
    DV_setMName(deck.name||"");
    DV_setMDesc(deck.description||"");
    DV_setMIcon(deck.icon||"🎴");
    DV_setMColor(deck.color||"#a78bfa");
    DV_setMErr(""); DV_setMLoading(false);
    DV_setMenuOpenId(null);
    DV_setModalMode({mode:"edit",deck:deck});
  }

  function DV_closeModal(){ if(!DV_mLoading) DV_setModalMode(null); }

  function DV_handleSubmit(){
    if(DV_mLoading) return;
    var name=DV_mName.trim();
    if(!name){ DV_setMErr("El nombre es obligatorio."); return; }
    if(!user||!window.ECEPT_SUPABASE){ DV_setMErr("Servicio no disponible."); return; }
    DV_setMErr(""); DV_setMLoading(true);

    var payload={
      name:name,
      description:DV_mDesc.trim()||null,
      icon:DV_mIcon,
      color:DV_mColor
    };

    var p;
    if(DV_modalMode==="create"){
      payload.user_id=user.id;
      payload.is_official=false;
      p=window.ECEPT_SUPABASE.from("decks").insert(payload);
    } else {
      p=window.ECEPT_SUPABASE.from("decks").update(payload).eq("id",DV_modalMode.deck.id);
    }

    p.then(function(res){
      DV_setMLoading(false);
      if(res&&res.error){ DV_setMErr("No se pudo guardar la baraja."); return; }
      DV_setModalMode(null);
      DV_loadData();
    }).catch(function(){
      DV_setMLoading(false);
      DV_setMErr("Error de conexión.");
    });
  }

  function DV_handleDelete(deckId){
    if(!user||!window.ECEPT_SUPABASE) return;
    window.ECEPT_SUPABASE.from("decks").delete().eq("id",deckId).then(function(){
      DV_setDeleteConfirmId(null);
      DV_setMenuOpenId(null);
      DV_loadData();
    }).catch(function(){
      DV_setDeleteConfirmId(null);
      DV_setMenuOpenId(null);
    });
  }

  function DV_openDeck(deck){
    window.ECEPT_DECK_SELECTED=deck;
    if(typeof go==="function") go("flashcards_deck");
  }

  // ── Helpers / shared styles ──
  var sectionTitleStyle={
    fontSize:"11px",fontWeight:800,color:C.mt,
    textTransform:"uppercase",letterSpacing:"1.5px",
    marginBottom:"12px",marginTop:"4px"
  };

  function DV_skeletonCard(key){
    return e("div",{key:key,style:{
      background:C.cd,border:"1px solid "+C.bd,borderRadius:"12px",padding:"16px"
    }},
      e("div",{className:"dv-skel",style:{width:"46px",height:"46px",borderRadius:"12px",marginBottom:"12px"}}),
      e("div",{className:"dv-skel",style:{width:"60%",height:"14px",marginBottom:"8px"}}),
      e("div",{className:"dv-skel",style:{width:"90%",height:"10px",marginBottom:"4px"}}),
      e("div",{className:"dv-skel",style:{width:"40%",height:"10px"}})
    );
  }

  function DV_deckCard(deck,i){
    var col=deck.color||"#a78bfa";
    var icon=deck.icon||"🎴";
    var count=DV_counts[deck.id]||0;
    var isMenuOpen=DV_menuOpenId===deck.id;
    return e("div",{
      key:deck.id,
      className:"dv-card",
      onClick:function(){ if(!isMenuOpen) DV_openDeck(deck); },
      style:{
        position:"relative",
        background:"linear-gradient(135deg,"+C.cd+","+col+"08)",
        border:"1px solid "+col+"35",
        borderRadius:"12px",padding:"16px",cursor:"pointer",
        animation:"slideUp .4s ease-out "+(i*0.05)+"s both"
      }
    },
      // Header row: icon + name + (menu OR badge)
      e("div",{style:{display:"flex",alignItems:"flex-start",gap:"12px",marginBottom:"10px"}},
        e("div",{style:{
          fontSize:"24px",width:"46px",height:"46px",flexShrink:0,
          display:"flex",alignItems:"center",justifyContent:"center",
          borderRadius:"12px",background:col+"15"
        }},icon),
        e("div",{style:{flex:1,minWidth:0,paddingTop:"4px"}},
          e("h3",{style:{fontSize:"14px",fontWeight:700,color:C.tx,marginBottom:"2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},deck.name||"Sin nombre")
        ),
        deck.is_official
          ? e("span",{style:{
              fontSize:"9px",padding:"3px 8px",borderRadius:"6px",
              background:col+"20",color:col,fontWeight:700,
              flexShrink:0,whiteSpace:"nowrap"
            }},"Oficial")
          : e("button",{
              onClick:function(ev){ ev.stopPropagation(); DV_setMenuOpenId(isMenuOpen?null:deck.id); },
              "aria-label":"Opciones",
              style:{
                background:"none",border:"none",color:C.dm,
                fontSize:"18px",cursor:"pointer",
                width:"44px",height:"44px",flexShrink:0,
                display:"flex",alignItems:"center",justifyContent:"center",
                borderRadius:"8px",marginTop:"-8px",marginRight:"-8px"
              }
            },"⋮")
      ),
      // Description
      deck.description && e("p",{style:{fontSize:"12px",color:C.dm,lineHeight:1.5,marginBottom:"10px"}},deck.description),
      // Footer: card count
      e("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontSize:"11px",color:col,fontWeight:600}},
        e("span",null,"🎴"),
        e("span",null,count+" tarjeta"+(count===1?"":"s"))
      ),
      // Dropdown menu (user decks only)
      isMenuOpen && e("div",{
        onClick:function(ev){ ev.stopPropagation(); },
        style:{
          position:"absolute",top:"50px",right:"12px",
          background:C.cd,border:"1px solid "+C.bd,
          borderRadius:"10px",overflow:"hidden",
          boxShadow:"0 8px 24px rgba(0,0,0,.5)",
          zIndex:5,minWidth:"140px"
        }
      },
        e("button",{
          onClick:function(){ DV_openEdit(deck); },
          style:{
            display:"block",width:"100%",minHeight:"44px",
            padding:"10px 14px",textAlign:"left",
            background:"none",border:"none",color:C.tx,
            fontSize:"13px",fontWeight:600,cursor:"pointer"
          }
        },"✏️  Editar"),
        e("div",{style:{height:"1px",background:C.bd}}),
        e("button",{
          onClick:function(){ DV_setMenuOpenId(null); DV_setDeleteConfirmId(deck.id); },
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

  // Split decks
  var officialDecks=DV_decks.filter(function(d){ return d.is_official; });
  var userDecks=DV_decks.filter(function(d){ return !d.is_official; });

  return e("div",{style:{maxWidth:"960px",margin:"0 auto",padding:"20px 16px 80px",position:"relative"}},

    // ── Click-outside backdrop for card menu ──
    DV_menuOpenId && e("div",{
      onClick:function(){ DV_setMenuOpenId(null); },
      style:{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:4}
    }),

    // ── Header ──
    e("div",{style:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"4px"}},
      e("button",{
        onClick:props.onBack,
        "aria-label":"Volver",
        style:{
          background:"none",border:"none",color:C.mt,
          fontSize:"20px",cursor:"pointer",
          minWidth:"44px",minHeight:"44px",
          display:"flex",alignItems:"center",justifyContent:"center",
          borderRadius:"10px"
        }
      },"←"),
      e("div",{style:{fontSize:"22px",fontWeight:800,color:C.tx,fontFamily:"'Playfair Display',serif"}},"🎴 Flashcards")
    ),
    e("div",{style:{fontSize:"13px",color:C.dm,marginLeft:"54px",marginBottom:"22px"}},"Tus barajas de estudio"),

    // ── Stats bar ──
    e("div",{style:{
      display:"flex",gap:"10px",
      overflowX:"auto",WebkitOverflowScrolling:"touch",
      marginBottom:"22px",paddingBottom:"4px"
    }},
      e("div",{style:{
        flex:"0 0 auto",minWidth:"140px",
        background:C.cd,border:"1px solid "+C.bd,
        borderRadius:"12px",padding:"14px 16px"
      }},
        e("div",{style:{fontSize:"22px",fontWeight:800,color:"#a78bfa",lineHeight:1.1}},DV_loading?"—":String(DV_decks.length)),
        e("div",{style:{fontSize:"11px",color:C.dm,marginTop:"2px"}},"Barajas")
      ),
      e("div",{style:{
        flex:"0 0 auto",minWidth:"140px",
        background:C.cd,border:"1px solid "+C.bd,
        borderRadius:"12px",padding:"14px 16px"
      }},
        e("div",{style:{fontSize:"22px",fontWeight:800,color:DV_dueToday>0?"#fbbf24":"#34d399",lineHeight:1.1}},DV_loading?"—":String(DV_dueToday)),
        e("div",{style:{fontSize:"11px",color:C.dm,marginTop:"2px"}},"Para repasar hoy")
      ),
      e("div",{style:{
        flex:"0 0 auto",minWidth:"140px",
        background:C.cd,border:"1px solid "+C.bd,
        borderRadius:"12px",padding:"14px 16px",opacity:.6
      }},
        e("div",{style:{fontSize:"22px",fontWeight:800,color:C.dm,lineHeight:1.1}},"—"),
        e("div",{style:{fontSize:"11px",color:C.dm,marginTop:"2px"}},"Racha · Próximamente")
      )
    ),

    // ── Create button ──
    e("button",{
      onClick:DV_openCreate,
      style:{
        width:"100%",minHeight:"52px",padding:"14px 20px",
        borderRadius:"14px",
        background:"linear-gradient(135deg,#a78bfa,#60a5fa)",
        color:"#fff",border:"none",
        fontSize:"15px",fontWeight:700,cursor:"pointer",
        marginBottom:"28px",
        boxShadow:"0 4px 18px rgba(167,139,250,.35)"
      }
    },"+ Crear baraja"),

    // ── Load error ──
    DV_loadErr && e("div",{style:{
      color:"#fca5a5",background:"rgba(239,68,68,.12)",
      border:"1px solid rgba(239,68,68,.35)",borderRadius:"10px",
      padding:"10px 12px",fontSize:"13px",marginBottom:"16px"
    }},DV_loadErr),

    // ── Loading skeletons ──
    DV_loading && e("div",{style:{
      display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"12px"
    }},
      DV_skeletonCard("sk1"),DV_skeletonCard("sk2"),
      DV_skeletonCard("sk3"),DV_skeletonCard("sk4")
    ),

    // ── Official decks section ──
    !DV_loading && officialDecks.length>0 && e("div",{style:{marginBottom:"28px"}},
      e("h2",{style:sectionTitleStyle},"Barajas oficiales de ECEPT"),
      e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"12px"}},
        officialDecks.map(function(d,i){ return DV_deckCard(d,i); })
      )
    ),

    // ── User decks section ──
    !DV_loading && e("div",{style:{marginBottom:"24px"}},
      e("h2",{style:sectionTitleStyle},"Tus barajas"),
      userDecks.length===0
        ? e("div",{style:{
            background:C.cd,border:"1px dashed "+C.bd,
            borderRadius:"14px",padding:"32px 20px",textAlign:"center"
          }},
            e("div",{style:{fontSize:"40px",marginBottom:"10px"}},"📋"),
            e("p",{style:{fontSize:"14px",color:C.tx,fontWeight:600,marginBottom:"4px"}},"Aún no creaste ninguna baraja."),
            e("p",{style:{fontSize:"12px",color:C.dm,lineHeight:1.5}},"¡Empezá ahora! Tocá «+ Crear baraja» arriba.")
          )
        : e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"12px"}},
            userDecks.map(function(d,i){ return DV_deckCard(d,officialDecks.length+i); })
          )
    ),

    // ══════════ CREATE / EDIT MODAL ══════════
    DV_modalMode && e("div",{
      onClick:DV_closeModal,
      style:{
        position:"fixed",top:0,left:0,right:0,bottom:0,
        background:"rgba(6,10,20,.78)",
        backdropFilter:"blur(4px)",WebkitBackdropFilter:"blur(4px)",
        display:"flex",alignItems:"center",justifyContent:"center",
        padding:"16px",zIndex:300,
        animation:"fadeIn .18s ease-out"
      }
    },
      e("div",{
        onClick:function(ev){ ev.stopPropagation(); },
        style:{
          width:"100%",maxWidth:"420px",
          background:C.cd,border:"1px solid "+C.bd,
          borderRadius:"16px",
          boxShadow:"0 12px 40px rgba(0,0,0,.6)",
          padding:"20px 18px 18px",
          animation:"slideUp .25s ease-out",
          boxSizing:"border-box",
          maxHeight:"calc(100vh - 32px)",overflow:"auto"
        }
      },
        // Modal header
        e("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px"}},
          e("div",{style:{fontSize:"16px",fontWeight:700,color:C.tx}},
            DV_modalMode==="create"?"Nueva baraja":"Editar baraja"
          ),
          e("button",{
            onClick:DV_closeModal,
            "aria-label":"Cerrar",
            disabled:DV_mLoading,
            style:{
              background:"none",border:"none",color:C.mt,fontSize:"24px",
              cursor:DV_mLoading?"default":"pointer",
              minWidth:"44px",minHeight:"44px",
              display:"flex",alignItems:"center",justifyContent:"center",
              borderRadius:"8px",opacity:DV_mLoading?0.5:1
            }
          },"×")
        ),

        // Preview
        e("div",{style:{
          display:"flex",alignItems:"center",gap:"12px",
          padding:"12px",borderRadius:"12px",
          background:"linear-gradient(135deg,"+C.bg+","+DV_mColor+"15)",
          border:"1px solid "+DV_mColor+"35",
          marginBottom:"16px"
        }},
          e("div",{style:{
            fontSize:"24px",width:"46px",height:"46px",flexShrink:0,
            display:"flex",alignItems:"center",justifyContent:"center",
            borderRadius:"12px",background:DV_mColor+"25"
          }},DV_mIcon),
          e("div",{style:{flex:1,minWidth:0}},
            e("div",{style:{fontSize:"14px",fontWeight:700,color:C.tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},DV_mName||"Nombre de la baraja"),
            e("div",{style:{fontSize:"11px",color:C.dm,marginTop:"2px"}},DV_mDesc||"Sin descripción")
          )
        ),

        // Name field
        e("div",{style:{marginBottom:"12px"}},
          e("label",{style:{display:"block",color:C.mt,fontSize:"12px",fontWeight:600,marginBottom:"6px"}},"Nombre"),
          e("input",{
            type:"text",value:DV_mName,
            onChange:function(ev){ DV_setMName(ev.target.value); DV_setMErr(""); },
            placeholder:"Cardiología, Anatomía...",
            disabled:DV_mLoading,
            maxLength:80,
            style:{
              width:"100%",padding:"12px 14px",minHeight:"44px",
              borderRadius:"10px",border:"1px solid "+C.bd,
              background:C.bg,color:C.tx,fontSize:"14px",
              outline:"none",boxSizing:"border-box"
            }
          })
        ),

        // Description field
        e("div",{style:{marginBottom:"14px"}},
          e("label",{style:{display:"block",color:C.mt,fontSize:"12px",fontWeight:600,marginBottom:"6px"}},"Descripción (opcional)"),
          e("textarea",{
            value:DV_mDesc,
            onChange:function(ev){ DV_setMDesc(ev.target.value); },
            placeholder:"Una breve descripción...",
            disabled:DV_mLoading,
            maxLength:200,
            rows:2,
            style:{
              width:"100%",padding:"10px 14px",
              borderRadius:"10px",border:"1px solid "+C.bd,
              background:C.bg,color:C.tx,fontSize:"13px",
              outline:"none",boxSizing:"border-box",
              resize:"vertical",fontFamily:"inherit"
            }
          })
        ),

        // Icon picker
        e("div",{style:{marginBottom:"14px"}},
          e("label",{style:{display:"block",color:C.mt,fontSize:"12px",fontWeight:600,marginBottom:"8px"}},"Icono"),
          e("div",{style:{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"6px"}},
            DV_ICON_OPTS.map(function(ic){
              var sel=ic===DV_mIcon;
              return e("button",{
                key:ic,
                onClick:function(){ DV_setMIcon(ic); },
                disabled:DV_mLoading,
                style:{
                  minHeight:"44px",fontSize:"22px",cursor:"pointer",
                  background:sel?DV_mColor+"25":C.bg,
                  border:"1.5px solid "+(sel?DV_mColor:C.bd),
                  borderRadius:"10px",
                  display:"flex",alignItems:"center",justifyContent:"center"
                }
              },ic);
            })
          )
        ),

        // Color picker
        e("div",{style:{marginBottom:"14px"}},
          e("label",{style:{display:"block",color:C.mt,fontSize:"12px",fontWeight:600,marginBottom:"8px"}},"Color"),
          e("div",{style:{display:"flex",gap:"10px",alignItems:"center"}},
            DV_COLOR_OPTS.map(function(co){
              var sel=co===DV_mColor;
              return e("button",{
                key:co,
                onClick:function(){ DV_setMColor(co); },
                disabled:DV_mLoading,
                "aria-label":"Color "+co,
                style:{
                  width:"36px",height:"36px",
                  minWidth:"44px",minHeight:"44px",
                  padding:"4px",
                  background:"none",border:"none",
                  cursor:"pointer",
                  display:"flex",alignItems:"center",justifyContent:"center"
                }
              },
                e("div",{style:{
                  width:"28px",height:"28px",borderRadius:"50%",
                  background:co,
                  boxShadow:sel?"0 0 0 3px "+co+"40, 0 0 0 5px "+co:"none",
                  transition:"box-shadow .15s"
                }})
              );
            })
          )
        ),

        // Error
        DV_mErr && e("div",{style:{
          color:"#fca5a5",background:"rgba(239,68,68,.12)",
          border:"1px solid rgba(239,68,68,.35)",borderRadius:"10px",
          padding:"10px 12px",fontSize:"13px",marginBottom:"12px"
        }},DV_mErr),

        // Submit
        e("button",{
          onClick:DV_handleSubmit,
          disabled:DV_mLoading,
          style:{
            width:"100%",minHeight:"44px",padding:"12px 14px",
            borderRadius:"10px",
            background:DV_mLoading?C.bd:"linear-gradient(135deg,"+DV_mColor+",#60a5fa)",
            color:"#fff",border:"none",
            cursor:DV_mLoading?"default":"pointer",
            fontSize:"14px",fontWeight:700
          }
        },DV_mLoading?"Guardando...":(DV_modalMode==="create"?"Crear baraja":"Guardar cambios"))
      )
    ),

    // ══════════ DELETE CONFIRM ══════════
    DV_deleteConfirmId && e("div",{
      onClick:function(){ DV_setDeleteConfirmId(null); },
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
        e("p",{style:{fontSize:"14px",color:C.tx,fontWeight:600,textAlign:"center",marginBottom:"6px"}},"¿Eliminar esta baraja?"),
        e("p",{style:{fontSize:"12px",color:C.dm,textAlign:"center",lineHeight:1.5,marginBottom:"18px"}},"Se eliminarán también todas sus tarjetas. Esta acción no se puede deshacer."),
        e("div",{style:{display:"flex",gap:"8px"}},
          e("button",{
            onClick:function(){ DV_setDeleteConfirmId(null); },
            style:{
              flex:1,minHeight:"44px",padding:"10px",
              borderRadius:"10px",
              background:"none",border:"1px solid "+C.bd,
              color:C.mt,fontSize:"13px",fontWeight:600,cursor:"pointer"
            }
          },"Cancelar"),
          e("button",{
            onClick:function(){ DV_handleDelete(DV_deleteConfirmId); },
            style:{
              flex:1,minHeight:"44px",padding:"10px",
              borderRadius:"10px",
              background:"#ef4444",border:"none",
              color:"#fff",fontSize:"13px",fontWeight:700,cursor:"pointer"
            }
          },"Eliminar")
        )
      )
    )
  );
}

window.DecksView = DecksView;
