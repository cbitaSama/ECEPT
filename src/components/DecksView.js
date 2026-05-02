// ══════════════════════════════════════════════════════════════
// DECKS VIEW — lista de barajas de flashcards
// ──────────────────────────────────────────────────────────────
// ES5 estricto: solo declaraciones var y function. Nada de ES6+.
// React.createElement vía el alias global `e`. Sin JSX.
// Globales internos con prefijo DV_ para evitar colisiones.
// Props: user, onBack, go, onLoginRequest
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
  s=useState(false); var DV_guestMode=s[0],   DV_setGuestMode=s[1];

  // Modal state: null | "create" | {mode:"edit", deck:...}
  s=useState(null);    var DV_modalMode=s[0], DV_setModalMode=s[1];
  s=useState("");      var DV_mName=s[0],     DV_setMName=s[1];
  s=useState("");      var DV_mDesc=s[0],     DV_setMDesc=s[1];
  s=useState("🎴");    var DV_mIcon=s[0],     DV_setMIcon=s[1];
  s=useState("#a78bfa"); var DV_mColor=s[0],  DV_setMColor=s[1];
  s=useState(false);   var DV_mLoading=s[0],  DV_setMLoading=s[1];
  s=useState("");      var DV_mErr=s[0],      DV_setMErr=s[1];

  // Card menu / delete confirm
  s=useState(null);  var DV_menuOpenId=s[0],     DV_setMenuOpenId=s[1];
  s=useState(null);  var DV_deleteConfirmId=s[0], DV_setDeleteConfirmId=s[1];
  s=useState(false); var DV_tagMgrOpen=s[0],     DV_setTagMgrOpen=s[1];
  s=useState(null);  var DV_dragIdx=s[0],         DV_setDragIdx=s[1];
  s=useState(null);  var DV_dragOverIdx=s[0],     DV_setDragOverIdx=s[1];
  var DV_dragRef=useRef({idx:null,overIdx:null});
  s=useState(false); var DV_importOpen=s[0],    DV_setImportOpen=s[1];
  s=useState(null);  var DV_importData=s[0],    DV_setImportData=s[1];
  s=useState("");    var DV_importError=s[0],   DV_setImportError=s[1];
  s=useState(false); var DV_importLoading=s[0], DV_setImportLoading=s[1];
  s=useState({open:false,deckId:null,mode:null}); var DV_elionFlow=s[0], DV_setElionFlow=s[1];

  // ── Inject CSS once ──
  useEffect(function(){
    if(!DV_styleInjected){
      var st=document.createElement("style");
      st.textContent=
        "@keyframes DV_shimmer{0%{background-position:-300px 0}100%{background-position:300px 0}}" +
        ".dv-card{transition:transform 240ms cubic-bezier(0.32,0.72,0,1),border-color 240ms cubic-bezier(0.32,0.72,0,1),box-shadow 240ms ease-out}" +
        ".dv-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.30), 0 2px 8px rgba(0,0,0,0.20)}" +
        ".dv-skel{background:linear-gradient(90deg,rgba(255,255,255,.03) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.03) 75%);background-size:600px 100%;animation:DV_shimmer 1.4s ease-in-out infinite;border-radius:6px}";
      document.head.appendChild(st);
      DV_styleInjected=true;
    }
  },[]);

  function DV_loadData(){
    if((!user&&!DV_guestMode)||!window.ECEPT_SUPABASE){ DV_setLoading(false); return; }
    DV_setLoading(true); DV_setLoadErr("");

    var deckPromise;
    if(user&&!DV_guestMode){
      deckPromise=window.ECEPT_SUPABASE
        .from("decks")
        .select("id,name,description,color,icon,is_official,user_id,created_at,sort_order")
        .or("is_official.eq.true,user_id.eq."+user.id)
        .order("is_official",{ascending:false})
        .order("sort_order",{ascending:true,nullsFirst:false})
        .order("name",{ascending:true});
    } else {
      deckPromise=window.ECEPT_SUPABASE
        .from("decks")
        .select("id,name,description,color,icon,is_official,user_id,created_at")
        .eq("is_official",true)
        .order("created_at",{ascending:false});
    }

    var cardsPromise=window.ECEPT_SUPABASE
      .from("flashcards")
      .select("deck_id");

    var nowIso=new Date().toISOString();
    var duePromise=user
      ? window.ECEPT_SUPABASE
          .from("flashcard_progress")
          .select("flashcard_id",{count:"exact",head:true})
          .eq("user_id",user.id)
          .lte("next_review",nowIso)
      : Promise.resolve({data:null,count:0,error:null});

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
  useEffect(function(){ if(DV_guestMode) DV_loadData(); },[DV_guestMode]);

  // ── Close deck menu on click-outside (avoids stacking-context bug with animated card) ──
  useEffect(function(){
    if(!DV_menuOpenId) return;
    function DV_docClose(){ DV_setMenuOpenId(null); }
    document.addEventListener("click", DV_docClose);
    return function(){ document.removeEventListener("click", DV_docClose); };
  },[DV_menuOpenId]);

  function DV_openCreate(){
    DV_setMName(""); DV_setMDesc("");
    DV_setMIcon("🎴"); DV_setMColor("#a78bfa");
    DV_setMErr(""); DV_setMLoading(false);
    DV_setModalMode("create");
  }

  function DV_handleImportFile(ev){
    var file=ev.target.files&&ev.target.files[0];
    if(!file) return;
    DV_setImportError(""); DV_setImportData(null);
    var reader=new FileReader();
    reader.onload=function(e2){
      try{
        var parsed=JSON.parse(e2.target.result);
        if(!parsed.version||!parsed.deck||!parsed.deck.name||!Array.isArray(parsed.cards)){
          DV_setImportError("Archivo inválido. Usá un JSON exportado desde ECEPT.");
          return;
        }
        DV_setImportData(parsed);
      }catch(ex){
        DV_setImportError("Archivo inválido. Usá un JSON exportado desde ECEPT.");
      }
    };
    reader.readAsText(file);
  }

  async function DV_exportDeck(deck){
    if(!user||!window.ECEPT_SUPABASE) return;
    var res=await window.ECEPT_SUPABASE.from("flashcards")
      .select("card_type,front,back,tags")
      .eq("deck_id",deck.id).eq("user_id",user.id);
    if(res.error||!res.data) return;
    var exportData={
      version:1,
      exportedAt:new Date().toISOString(),
      deck:{name:deck.name,description:deck.description||"",color:deck.color||"#3b82f6",icon:deck.icon||"📚"},
      cards:res.data
    };
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

  async function DV_importDeck(){
    if(!DV_importData||!user||!window.ECEPT_SUPABASE) return;
    DV_setImportLoading(true); DV_setImportError("");
    try{
      var deckRes=await window.ECEPT_SUPABASE.from("decks")
        .insert({
          user_id:user.id,
          name:DV_importData.deck.name,
          description:DV_importData.deck.description||"",
          color:DV_importData.deck.color||"#3b82f6",
          icon:DV_importData.deck.icon||"📚",
          is_official:false
        })
        .select("id")
        .single();
      if(deckRes.error) throw deckRes.error;
      var newDeckId=deckRes.data.id;
      var allCards=[];
      for(var ici=0;ici<DV_importData.cards.length;ici++){
        var ic=DV_importData.cards[ici];
        allCards.push({
          deck_id:newDeckId,user_id:user.id,is_official:false,
          card_type:ic.card_type||"basic",
          front:ic.front||"",back:ic.back||"",tags:ic.tags||[]
        });
      }
      var chunkSize=50;
      for(var ics=0;ics<allCards.length;ics+=chunkSize){
        var chunk=allCards.slice(ics,ics+chunkSize);
        var res=await window.ECEPT_SUPABASE.from("flashcards").insert(chunk);
        if(res.error) throw res.error;
      }
      DV_setImportOpen(false);
      DV_setImportData(null);
      DV_setImportError("");
      DV_loadData();
    }catch(err){
      console.error("import error",err);
      DV_setImportError("Error al importar. Intentá de nuevo.");
    }finally{
      DV_setImportLoading(false);
    }
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

  function DV_persistOrder(orderedDecks){
    if(!window.ECEPT_SUPABASE||!user) return;
    try{
      for(var pi=0;pi<orderedDecks.length;pi++){
        (function(d,idx){
          window.ECEPT_SUPABASE.from("decks").update({sort_order:idx}).eq("id",d.id)
            .then(function(res){
              if(res&&res.error) console.error("[DecksView] sort_order:",res.error);
            }).catch(function(err){ console.error("[DecksView] sort_order catch:",err); });
        })(orderedDecks[pi],pi);
      }
    }catch(ex){
      console.error("[DecksView] persistOrder:",ex);
    }
  }

  // ── Gate: sin sesión activa ──
  if(!user&&!DV_guestMode){
    return e("div",{style:{maxWidth:"540px",margin:"0 auto",padding:"20px 20px 60px"}},
      e("div",{style:{textAlign:"center",padding:"20px 0"}},
        e("div",{style:{fontSize:"56px",marginBottom:"16px"}},"🎴"),
        e("h2",{style:{fontSize:"22px",fontWeight:800,color:C.tx,fontFamily:"'Playfair Display',serif",marginBottom:"12px"}},"Flashcards"),
        e("p",{style:{fontSize:"14px",color:C.dm,lineHeight:1.6,maxWidth:"300px",margin:"0 auto 28px"}},"Iniciá sesión para crear tus barajas personales, guardar tu progreso y acceder a todas las funciones."),
        e("button",{
          onClick:function(){ if(typeof props.onLoginRequest==="function") props.onLoginRequest(); },
          style:{
            display:"block",width:"100%",maxWidth:"300px",minHeight:"52px",padding:"14px 20px",
            borderRadius:"14px",background:"linear-gradient(135deg,#a78bfa,#60a5fa)",
            color:"#fff",border:"none",fontSize:"15px",fontWeight:700,cursor:"pointer",
            margin:"0 auto 14px",boxShadow:"0 4px 18px rgba(167,139,250,.35)"
          }
        },"Iniciar sesión / Registrarse"),
        e("button",{
          onClick:function(){ DV_setGuestMode(true); },
          style:{
            background:"none",border:"none",color:C.mt,fontSize:"13px",cursor:"pointer",
            textDecoration:"underline",minHeight:"44px",padding:"8px 12px"
          }
        },"Ver de todos modos")
      )
    );
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

  function DV_userDeckCard(deck,i){
    var col=deck.color||"#a78bfa";
    var icon=deck.icon||"🎴";
    var count=DV_counts[deck.id]||0;
    var isMenuOpen=DV_menuOpenId===deck.id;
    var isDragging=DV_dragIdx===i;
    var isDropTarget=DV_dragOverIdx===i&&DV_dragIdx!==null&&DV_dragIdx!==i;
    return e("div",{
      key:deck.id,
      "data-drag-idx":String(i),
      className:"dv-card",
      onClick:function(){ if(!isMenuOpen&&DV_dragIdx===null) DV_openDeck(deck); },
      style:{
        position:"relative",
        background:"linear-gradient(135deg,"+C.cd+","+col+"0a)",
        border:"1px solid "+col+"38",
        borderRadius:"16px",padding:"18px 20px",
        minHeight:"160px",
        cursor:isDragging?"grabbing":"pointer",
        animation:"slideUp .4s ease-out "+(i*0.05)+"s both",
        opacity:isDragging?0.4:1,
        transition:"opacity .15s",
        boxSizing:"border-box",
        display:"flex",
        flexDirection:"column",
        boxShadow:isDropTarget?"inset 0 3px 0 #a78bfa":"none"
      }
    },
      e("div",{style:{display:"flex",alignItems:"flex-start",gap:"8px",marginBottom:"10px"}},
        e("div",{
          onPointerDown:function(ev){
            ev.stopPropagation();
            ev.currentTarget.setPointerCapture(ev.pointerId);
            DV_dragRef.current={idx:i,overIdx:i};
            DV_setDragIdx(i);
            DV_setDragOverIdx(i);
          },
          onPointerMove:function(ev){
            if(DV_dragRef.current.idx===null) return;
            var el=document.elementFromPoint(ev.clientX,ev.clientY);
            if(!el) return;
            var card=el.closest?el.closest("[data-drag-idx]"):null;
            if(!card) return;
            var oi=parseInt(card.getAttribute("data-drag-idx"),10);
            if(!isNaN(oi)&&oi!==DV_dragRef.current.overIdx){
              DV_dragRef.current.overIdx=oi;
              DV_setDragOverIdx(oi);
            }
          },
          onPointerUp:function(){
            var from=DV_dragRef.current.idx;
            var to=DV_dragRef.current.overIdx!==null?DV_dragRef.current.overIdx:from;
            DV_dragRef.current={idx:null,overIdx:null};
            DV_setDragIdx(null);
            DV_setDragOverIdx(null);
            if(from===null||from===to) return;
            var next=userDecks.slice();
            var moved=next.splice(from,1)[0];
            next.splice(to,0,moved);
            var offs=DV_decks.filter(function(d){ return d.is_official; });
            DV_setDecks(offs.concat(next));
            DV_persistOrder(next);
          },
          onPointerCancel:function(){
            DV_dragRef.current={idx:null,overIdx:null};
            DV_setDragIdx(null);
            DV_setDragOverIdx(null);
          },
          style:{
            cursor:"grab",color:C.dm,fontSize:"13px",letterSpacing:"1px",
            minWidth:"44px",minHeight:"44px",
            display:"flex",alignItems:"center",justifyContent:"center",
            flexShrink:0,marginLeft:"-8px",
            touchAction:"none",userSelect:"none",WebkitUserSelect:"none",
            borderRadius:"8px"
          }
        },"⋮⋮"),
        e("div",{style:{
          fontSize:"24px",width:"46px",height:"46px",flexShrink:0,
          display:"flex",alignItems:"center",justifyContent:"center",
          borderRadius:"12px",background:col+"15"
        }},icon),
        e("div",{style:{flex:1,minWidth:0,paddingTop:"4px"}},
          e("h3",{style:{fontSize:"14px",fontWeight:700,color:C.tx,marginBottom:"2px",
            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},deck.name||"Sin nombre")
        ),
        e("button",{
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
      deck.description&&e("p",{style:{fontSize:"12px",color:C.dm,lineHeight:1.5,marginBottom:"10px"}},deck.description),
      e("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontSize:"11px",color:col,fontWeight:600}},
        e("span",null,"🎴"),
        e("span",null,count+" tarjeta"+(count===1?"":"s"))
      ),
      isMenuOpen&&e("div",{
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
          onClick:function(ev){
            ev.stopPropagation();
            DV_setMenuOpenId(null);
            setTimeout(function(){ DV_openEdit(deck); },0);
          },
          style:{display:"block",width:"100%",minHeight:"44px",
            padding:"10px 14px",textAlign:"left",
            background:"none",border:"none",color:C.tx,
            fontSize:"13px",fontWeight:600,cursor:"pointer"}
        },"✏️  Editar"),
        e("div",{style:{height:"1px",background:C.bd}}),
        e("button",{
          onClick:function(ev){
            ev.stopPropagation();
            DV_setMenuOpenId(null);
            DV_exportDeck(deck);
          },
          style:{display:"block",width:"100%",minHeight:"44px",
            padding:"10px 14px",textAlign:"left",
            background:"none",border:"none",color:C.tx,
            fontSize:"13px",fontWeight:600,cursor:"pointer"}
        },"⬇  Exportar"),
        e("div",{style:{height:"1px",background:C.bd}}),
        e("button",{
          onClick:function(ev){
            ev.stopPropagation();
            DV_setMenuOpenId(null);
            setTimeout(function(){ DV_setDeleteConfirmId(deck.id); },0);
          },
          style:{display:"block",width:"100%",minHeight:"44px",
            padding:"10px 14px",textAlign:"left",
            background:"none",border:"none",color:"#fca5a5",
            fontSize:"13px",fontWeight:600,cursor:"pointer"}
        },"🗑  Eliminar")
      )
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
        background:"linear-gradient(135deg,"+C.cd+","+col+"0a)",
        border:"1px solid "+col+"38",
        borderRadius:"16px",padding:"18px 20px",cursor:"pointer",
        minHeight:"160px",
        animation:"slideUp .4s ease-out "+(i*0.05)+"s both",
        display:"flex",flexDirection:"column",boxSizing:"border-box"
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
          onClick:function(ev){
            ev.stopPropagation();
            DV_setMenuOpenId(null);
            setTimeout(function(){ DV_openEdit(deck); },0);
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
            DV_setMenuOpenId(null);
            setTimeout(function(){ DV_setDeleteConfirmId(deck.id); },0);
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

  // Split decks
  var officialDecks=DV_decks.filter(function(d){ return d.is_official; });
  var userDecks=DV_decks.filter(function(d){ return !d.is_official; });

  return e("div",{style:{width:"100%",maxWidth:"1400px",margin:"0 auto",padding:"24px max(16px, calc((100vw - 1400px) / 2 + 24px)) 80px",position:"relative",boxSizing:"border-box"}},

    // ── Header ──
    e("div",{style:{marginBottom:"4px"}},
      e("div",{style:{fontSize:"22px",fontWeight:800,color:C.tx,fontFamily:"'Playfair Display',serif"}},"🎴 Flashcards")
    ),
    e("div",{style:{fontSize:"13px",color:C.dm,marginLeft:"54px",marginBottom:"22px"}},DV_guestMode?"Barajas oficiales":"Tus barajas de estudio"),

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

    // ── Action buttons ──
    e("div",{style:{display:"flex",gap:"10px",marginBottom:"28px",flexWrap:"wrap"}},
      e("button",{
        onClick:function(){
          window.ECEPT_DECK_SELECTED=null;
          if(typeof go==="function") go("flashcards_study");
        },
        style:{
          flex:"1 1 160px",minHeight:"52px",padding:"14px 20px",
          borderRadius:"14px",
          background:"linear-gradient(135deg,#a78bfa,#60a5fa)",
          color:"#fff",border:"none",
          fontSize:"14px",fontWeight:700,cursor:"pointer",
          boxShadow:"0 4px 18px rgba(167,139,250,.35)"
        }
      },"🎯 Estudiar todo"),
      user&&e("button",{
        onClick:DV_openCreate,
        style:{
          flex:"1 1 160px",minHeight:"52px",padding:"14px 20px",
          borderRadius:"14px",
          background:"none",
          border:"1.5px solid rgba(167,139,250,.4)",
          color:"#a78bfa",
          fontSize:"14px",fontWeight:700,cursor:"pointer"
        }
      },"+ Crear baraja"),
      user&&e("button",{
        onClick:function(){ DV_setTagMgrOpen(true); },
        style:{
          flex:"0 0 auto",minHeight:"52px",padding:"14px 18px",
          borderRadius:"14px",
          background:"none",
          border:"1.5px solid rgba(167,139,250,.25)",
          color:C.dm,
          fontSize:"14px",fontWeight:700,cursor:"pointer"
        }
      },"🏷️ Etiquetas"),
      user&&e("button",{
        onClick:function(){ DV_setImportOpen(true); DV_setImportData(null); DV_setImportError(""); },
        style:{
          flex:"0 0 auto",minHeight:"52px",padding:"14px 18px",
          borderRadius:"14px",
          background:"none",
          border:"1.5px solid rgba(167,139,250,.25)",
          color:C.dm,
          fontSize:"14px",fontWeight:700,cursor:"pointer"
        }
      },"⬆ Importar"),
      user&&e("button",{
        onClick:function(){ DV_setElionFlow({open:true,deckId:null,mode:"new"}); },
        style:{
          flex:"0 0 auto",minHeight:"52px",padding:"14px 18px",
          borderRadius:"14px",
          background:"linear-gradient(135deg,#a78bfa,#60a5fa)",
          border:"none",color:"#fff",
          fontSize:"14px",fontWeight:700,cursor:"pointer",
          boxShadow:"0 4px 12px rgba(167,139,250,0.3)"
        }
      },"✨ Crear con IA")
    ),

    // ── Load error ──
    DV_loadErr && e("div",{style:{
      color:"#fca5a5",background:"rgba(239,68,68,.12)",
      border:"1px solid rgba(239,68,68,.35)",borderRadius:"10px",
      padding:"10px 12px",fontSize:"13px",marginBottom:"16px"
    }},DV_loadErr),

    // ── Loading skeletons (premium SkeletonList) ──
    DV_loading && e(window.SkeletonList || "div",{count:6,grid:true,minWidth:280,minHeight:160}),

    // ── Official decks section ──
    !DV_loading && officialDecks.length>0 && e("div",{style:{marginBottom:"28px"}},
      e("h2",{style:sectionTitleStyle},"Barajas oficiales de ECEPT"),
      e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"16px"}},
        officialDecks.map(function(d,i){ return DV_deckCard(d,i); })
      )
    ),

    // ── User decks section ──
    !DV_loading && e("div",{style:{marginBottom:"24px"}},
      e("h2",{style:sectionTitleStyle},"Tus barajas"),
      DV_guestMode
        ? e("div",{style:{
            background:C.cd,border:"1px dashed "+C.bd,
            borderRadius:"14px",padding:"32px 20px",textAlign:"center"
          }},
            e("div",{style:{fontSize:"40px",marginBottom:"10px"}},"🔐"),
            e("p",{style:{fontSize:"14px",color:C.tx,fontWeight:600,marginBottom:"6px"}},"Iniciá sesión para ver tus barajas."),
            e("button",{
              onClick:function(){ if(typeof props.onLoginRequest==="function") props.onLoginRequest(); },
              style:{
                marginTop:"8px",padding:"10px 20px",borderRadius:"10px",
                background:"linear-gradient(135deg,#a78bfa,#60a5fa)",
                color:"#fff",border:"none",fontSize:"13px",fontWeight:700,
                cursor:"pointer",minHeight:"44px"
              }
            },"Iniciar sesión / Registrarse")
          )
        : (userDecks.length===0
            ? e("div",{style:{
                background:C.cd,border:"1px dashed "+C.bd,
                borderRadius:"14px",padding:"32px 20px",textAlign:"center"
              }},
                e("div",{style:{fontSize:"40px",marginBottom:"10px"}},"📋"),
                e("p",{style:{fontSize:"14px",color:C.tx,fontWeight:600,marginBottom:"4px"}},"Aún no creaste ninguna baraja."),
                e("p",{style:{fontSize:"12px",color:C.dm,lineHeight:1.5}},"¡Empezá ahora! Tocá «+ Crear baraja» arriba.")
              )
            : e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"16px"}},
                userDecks.map(function(d,i){ return DV_userDeckCard(d,i); })
              )
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
    ),

    DV_tagMgrOpen && e(TagManager,{
      user:user,
      supabase:window.ECEPT_SUPABASE,
      onClose:function(){ DV_setTagMgrOpen(false); }
    }),

    DV_importOpen&&ReactDOM.createPortal(
      e("div",{
        onClick:function(){ if(!DV_importLoading){ DV_setImportOpen(false); DV_setImportData(null); DV_setImportError(""); } },
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
            e("span",{style:{fontSize:"14px",color:C.tx,fontWeight:700}},"⬆ Importar baraja"),
            e("button",{
              onClick:function(){ DV_setImportOpen(false); DV_setImportData(null); DV_setImportError(""); },
              disabled:DV_importLoading,
              style:{background:"none",border:"none",color:C.dm,fontSize:"20px",
                cursor:"pointer",lineHeight:1,padding:"4px 8px"}
            },"×")
          ),
          e("div",{style:{padding:"18px"}},
            !DV_importData
              ?e("div",null,
                  e("p",{style:{fontSize:"13px",color:C.dm,marginBottom:"14px",lineHeight:1.5}},
                    "Seleccioná un archivo .json exportado desde ECEPT."
                  ),
                  e("label",{style:{
                    display:"flex",alignItems:"center",justifyContent:"center",
                    minHeight:"80px",borderRadius:"12px",cursor:"pointer",
                    border:"2px dashed "+C.bd,background:"rgba(255,255,255,.02)",
                    fontSize:"13px",color:C.dm,fontWeight:600,gap:"8px"
                  }},
                    e("span",null,"📂 Elegir archivo .json"),
                    e("input",{
                      type:"file",accept:".json",
                      onChange:DV_handleImportFile,
                      style:{display:"none"}
                    })
                  ),
                  DV_importError&&e("div",{style:{marginTop:"10px",fontSize:"12px",
                    color:"#fca5a5",fontWeight:600}},DV_importError)
                )
              :e("div",null,
                  e("div",{style:{
                    display:"flex",alignItems:"center",gap:"12px",
                    padding:"14px 16px",borderRadius:"12px",
                    background:"linear-gradient(135deg,"+C.cd+","+(DV_importData.deck.color||"#3b82f6")+"10)",
                    border:"1px solid "+(DV_importData.deck.color||C.bd)+"40",
                    marginBottom:"14px"
                  }},
                    e("div",{style:{
                      fontSize:"26px",width:"48px",height:"48px",flexShrink:0,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      borderRadius:"10px",
                      background:(DV_importData.deck.color||"#3b82f6")+"18"
                    }},(DV_importData.deck.icon||"📚")),
                    e("div",{style:{flex:1,minWidth:0}},
                      e("div",{style:{fontSize:"15px",color:C.tx,fontWeight:700,
                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:"3px"}},
                        DV_importData.deck.name
                      ),
                      DV_importData.deck.description&&e("div",{style:{
                        fontSize:"11px",color:C.mt,lineHeight:1.4,marginBottom:"5px",
                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"
                      }},DV_importData.deck.description),
                      e("span",{style:{
                        fontSize:"10px",fontWeight:700,padding:"3px 8px",borderRadius:"999px",
                        background:(C.ac||"#60a5fa")+"18",color:(C.ac||"#60a5fa"),
                        border:"1px solid "+(C.ac||"#60a5fa")+"30"
                      }},DV_importData.cards.length+" card"+(DV_importData.cards.length===1?"":"s"))
                    )
                  ),
                  e("div",{style:{display:"flex",flexDirection:"column",gap:"6px",marginBottom:"6px"}},
                    DV_importData.cards.slice(0,3).map(function(c,ci){
                      var front=c.front||"";
                      var isCloze=c.card_type==="cloze";
                      var typCol=isCloze?"#fbbf24":"#60a5fa";
                      return e("div",{key:ci,style:{
                        padding:"8px 10px",borderRadius:"8px",
                        background:C.cd,border:"1px solid "+C.bd
                      }},
                        e("div",{style:{display:"flex",alignItems:"center",gap:"7px",marginBottom:Array.isArray(c.tags)&&c.tags.length?"5px":0}},
                          e("span",{style:{
                            fontSize:"9px",fontWeight:700,padding:"2px 6px",borderRadius:"4px",
                            background:typCol+"18",color:typCol,flexShrink:0
                          }},isCloze?"CLOZE":"BASIC"),
                          e("span",{style:{
                            fontSize:"12px",color:C.tx,
                            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"
                          }},front.length>60?front.slice(0,60)+"…":front)
                        ),
                        Array.isArray(c.tags)&&c.tags.length>0&&e("div",{style:{display:"flex",flexWrap:"wrap",gap:"3px"}},
                          c.tags.map(function(t,ti){
                            return e("span",{key:ti,style:{
                              fontSize:"9px",fontWeight:700,padding:"1px 5px",borderRadius:"999px",
                              background:"rgba(255,255,255,.04)",border:"1px solid "+C.bd,color:C.dm
                            }},"#"+t);
                          })
                        )
                      );
                    })
                  ),
                  DV_importData.cards.length>3&&e("div",{style:{
                    fontSize:"11px",color:C.mt,padding:"2px 10px",marginBottom:"4px"
                  }},"… y "+(DV_importData.cards.length-3)+" card"+(DV_importData.cards.length-3===1?"":"s")+" más"),
                  DV_importError&&e("div",{style:{marginTop:"10px",fontSize:"12px",
                    color:"#fca5a5",fontWeight:600}},DV_importError)
                )
          ),
          e("div",{style:{
            padding:"14px 18px",borderTop:"1px solid "+C.bd,
            display:"flex",gap:"8px"
          }},
            DV_importData&&e("button",{
              onClick:DV_importDeck,
              disabled:DV_importLoading,
              style:{
                flex:1,minHeight:"44px",padding:"12px",borderRadius:"12px",
                border:"none",
                background:DV_importLoading?"rgba(255,255,255,.08)":"#3b82f6",
                color:DV_importLoading?C.mt:"#fff",
                fontSize:"14px",fontWeight:700,
                cursor:DV_importLoading?"default":"pointer"
              }
            },DV_importLoading?"Importando...":"Importar"),
            e("button",{
              onClick:function(){ DV_setImportOpen(false); DV_setImportData(null); DV_setImportError(""); },
              disabled:DV_importLoading,
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
    ),
    DV_elionFlow.open&&user&&e(ElionGenerator,{
      user:user,
      supabase:window.ECEPT_SUPABASE,
      deckId:DV_elionFlow.deckId||null,
      onImport:async function(cards,sourceName){
        var targetDeckId=DV_elionFlow.deckId;
        if(!targetDeckId){
          var deckRes=await window.ECEPT_SUPABASE.from("decks").insert({
            user_id:user.id,
            name:sourceName||"Generado con IA",
            is_official:false,
            color:"#a78bfa",
            icon:"✨"
          }).select("id").single();
          if(deckRes.error) return;
          targetDeckId=deckRes.data.id;
        }
        var inserts=[];
        for(var ni=0;ni<cards.length;ni++){
          inserts.push({
            deck_id:targetDeckId,
            user_id:user.id,
            is_official:false,
            card_type:cards[ni].card_type,
            front:cards[ni].front,
            back:cards[ni].back||"",
            tags:cards[ni].tags||[]
          });
        }
        await window.ECEPT_SUPABASE.from("flashcards").insert(inserts);
        DV_setElionFlow({open:false,deckId:null,mode:null});
        DV_loadData();
      },
      onClose:function(){ DV_setElionFlow({open:false,deckId:null,mode:null}); }
    })
  );
}

window.DecksView = DecksView;
