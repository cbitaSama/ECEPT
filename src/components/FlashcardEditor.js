// ══════════════════════════════════════════════════════════════
// FLASHCARD EDITOR — crear/editar tarjetas básicas y cloze
// ──────────────────────────────────────────────────────────────
// ES5 estricto: solo declaraciones var y function. Nada de ES6+.
// React.createElement vía el alias global `e`. Sin JSX.
// Globales internos con prefijo FE_ para evitar colisiones.
// Props: user, deck, card, onSaved, onClose
// ══════════════════════════════════════════════════════════════
var FE_styleInjected=false;

function FE_buildClozePreview(text,hidden){
  var parts=[];
  var re=/\{\{c\d+::(.*?)\}\}/g;
  var last=0,match,idx=0;
  while((match=re.exec(text))!==null){
    if(match.index>last) parts.push(e("span",{key:"t"+idx++},text.slice(last,match.index)));
    if(hidden){
      parts.push(e("span",{key:"c"+idx++,style:{
        display:"inline-block",padding:"1px 10px",borderRadius:"6px",
        background:"rgba(251,191,36,.18)",border:"1px solid rgba(251,191,36,.4)",
        color:"#fbbf24",fontWeight:700,margin:"0 2px"
      }},"[...]"));
    } else {
      parts.push(e("span",{key:"r"+idx++,style:{color:"#34d399",fontWeight:700}},match[1]));
    }
    last=re.lastIndex;
  }
  if(last<text.length) parts.push(e("span",{key:"t"+idx++},text.slice(last)));
  return parts.length ? e("span",null,parts) : e("span",null,text||"");
}

function FlashcardEditor(props){
  var user=props.user;
  var deck=props.deck;
  var isCreate=!props.card;
  var initCard=props.card||null;
  var initType=(initCard&&initCard.card_type)||"basic";
  var initFront=(initCard&&initType!=="cloze"&&initCard.front)||"";
  var initBack=(initCard&&initType!=="cloze"&&initCard.back)||"";
  var initCloze=(initCard&&initType==="cloze"&&initCard.front)||"";
  var initTags=(initCard&&Array.isArray(initCard.tags)&&initCard.tags)||[];
  var s;

  s=useState(initType);   var FE_type=s[0],     FE_setType=s[1];
  s=useState(initFront);  var FE_front=s[0],    FE_setFront=s[1];
  s=useState(initBack);   var FE_back=s[0],     FE_setBack=s[1];
  s=useState(initCloze);  var FE_cloze=s[0],    FE_setCloze=s[1];
  s=useState(initTags);   var FE_tags=s[0],     FE_setTags=s[1];
  s=useState("");         var FE_tagIn=s[0],    FE_setTagIn=s[1];
  s=useState([]);         var FE_sugg=s[0],     FE_setSugg=s[1];
  s=useState(false);      var FE_saving=s[0],   FE_setSaving=s[1];
  s=useState("");         var FE_err=s[0],      FE_setErr=s[1];
  s=useState(false);      var FE_ok=s[0],       FE_setOk=s[1];
  s=useState(false);      var FE_prevOn=s[0],   FE_setPrevOn=s[1];
  s=useState(false);      var FE_prevFlip=s[0], FE_setPrevFlip=s[1];
  s=useState(false);      var FE_draftAsk=s[0], FE_setDraftAsk=s[1];
  s=useState(null);       var FE_draftSnap=s[0],FE_setDraftSnap=s[1];
  var FE_snapRef=useRef({});

  // Keep ref current every render (stale-closure-safe auto-save)
  FE_snapRef.current={type:FE_type,front:FE_front,back:FE_back,cloze:FE_cloze,tags:FE_tags};

  // ── Inject CSS once ──
  useEffect(function(){
    if(FE_styleInjected) return;
    var st=document.createElement("style");
    st.textContent=
      ".fe-bg{animation:fadeIn .18s ease-out}" +
      ".fe-modal{animation:slideUp .25s ease-out}" +
      ".fe-pill{transition:left .2s cubic-bezier(.4,0,.2,1)}" +
      ".fe-flip{position:relative;width:100%;height:100%;transition:transform .45s ease;transform-style:preserve-3d}" +
      ".fe-face{position:absolute;width:100%;height:100%;backface-visibility:hidden;-webkit-backface-visibility:hidden}";
    document.head.appendChild(st);
    FE_styleInjected=true;
  },[]);

  // ── Check draft on mount (create mode only) ──
  useEffect(function(){
    if(!isCreate||!deck) return;
    var key="ECEPT_FC_DRAFT_"+deck.id;
    try{
      var raw=localStorage.getItem(key);
      if(!raw) return;
      var d=JSON.parse(raw);
      if(d&&(d.front||d.back||d.cloze)){
        FE_setDraftSnap(d);
        FE_setDraftAsk(true);
      }
    }catch(ex){}
  },[]);

  // ── Auto-save draft every 5 s (create mode only) ──
  useEffect(function(){
    if(!isCreate||!deck) return;
    var key="ECEPT_FC_DRAFT_"+deck.id;
    var t=setInterval(function(){
      var sn=FE_snapRef.current;
      if(sn&&(sn.front||sn.back||sn.cloze)){
        try{ localStorage.setItem(key,JSON.stringify(sn)); }catch(ex){}
      }
    },5000);
    return function(){ clearInterval(t); };
  },[]);

  // ── Load tag suggestions ──
  useEffect(function(){
    if(!deck||!window.ECEPT_SUPABASE) return;
    window.ECEPT_SUPABASE
      .from("flashcards").select("tags").eq("deck_id",deck.id)
      .then(function(res){
        if(!res||res.error) return;
        var tc={};
        var rows=(res.data)||[];
        for(var i=0;i<rows.length;i++){
          var ts=rows[i].tags;
          if(Array.isArray(ts)){
            for(var j=0;j<ts.length;j++){
              if(ts[j]) tc[ts[j]]=(tc[ts[j]]||0)+1;
            }
          }
        }
        var sorted=Object.keys(tc).sort(function(a,b){ return tc[b]-tc[a]; });
        FE_setSugg(sorted.slice(0,5));
      }).catch(function(){});
  },[]);

  // ── Draft helpers ──
  function FE_clearDraft(){
    if(!deck) return;
    try{ localStorage.removeItem("ECEPT_FC_DRAFT_"+deck.id); }catch(ex){}
  }

  function FE_applyDraft(){
    var d=FE_draftSnap;
    if(!d) return;
    FE_setType(d.type||"basic");
    FE_setFront(d.front||"");
    FE_setBack(d.back||"");
    FE_setCloze(d.cloze||"");
    FE_setTags(Array.isArray(d.tags)?d.tags:[]);
    FE_setDraftAsk(false);
    FE_setDraftSnap(null);
  }

  function FE_dismissDraft(){
    FE_clearDraft();
    FE_setDraftAsk(false);
    FE_setDraftSnap(null);
  }

  // ── Tag helpers ──
  function FE_addTag(raw){
    var t=raw.trim().toLowerCase().replace(/[^a-z0-9\-_áéíóúñü]/g,"");
    if(!t||FE_tags.indexOf(t)!==-1) return;
    FE_setTags(FE_tags.concat([t]));
  }

  function FE_tagKeyDown(ev){
    if(ev.key==="Enter"||ev.key===","){
      ev.preventDefault();
      FE_addTag(FE_tagIn);
      FE_setTagIn("");
    } else if(ev.key==="Backspace"&&!FE_tagIn&&FE_tags.length>0){
      FE_setTags(FE_tags.slice(0,-1));
    }
  }

  function FE_removeTag(i){
    var next=FE_tags.slice();
    next.splice(i,1);
    FE_setTags(next);
  }

  // ── Auto-grow textarea ──
  function FE_grow(ev){
    ev.target.style.height="auto";
    ev.target.style.height=ev.target.scrollHeight+"px";
  }

  // ── Save ──
  function FE_save(){
    if(FE_saving) return;
    FE_setErr("");
    var err="";
    if(FE_type==="basic"){
      if(!FE_front.trim()) err="El frente es obligatorio.";
      else if(!FE_back.trim()) err="El dorso es obligatorio.";
    } else {
      if(!FE_cloze.trim()) err="El texto es obligatorio.";
      else if(!/\{\{c\d+::.*?\}\}/.test(FE_cloze)) err="Agrega al menos un marcador {{c1::...}}.";
    }
    if(err){ FE_setErr(err); return; }
    if(!user||!window.ECEPT_SUPABASE){ FE_setErr("Servicio no disponible."); return; }
    FE_setSaving(true);
    var payload={
      card_type:FE_type,
      front:FE_type==="basic"?FE_front.trim():FE_cloze.trim(),
      back:FE_type==="basic"?FE_back.trim():"",
      tags:FE_tags
    };
    var p;
    if(isCreate){
      payload.deck_id=deck.id;
      payload.user_id=user.id;
      payload.is_official=false;
      p=window.ECEPT_SUPABASE.from("flashcards").insert(payload);
    } else {
      p=window.ECEPT_SUPABASE.from("flashcards").update(payload).eq("id",props.card.id);
    }
    p.then(function(res){
      FE_setSaving(false);
      if(res&&res.error){ FE_setErr("No se pudo guardar la tarjeta."); return; }
      FE_clearDraft();
      FE_setOk(true);
      setTimeout(function(){
        if(typeof props.onSaved==="function") props.onSaved();
        if(typeof props.onClose==="function") props.onClose();
      },700);
    }).catch(function(){
      FE_setSaving(false);
      FE_setErr("Error de conexión.");
    });
  }

  function FE_cancel(){
    FE_clearDraft();
    if(typeof props.onClose==="function") props.onClose();
  }

  // ── Guard: no user ──
  if(!user){
    return e("div",{
      className:"fe-bg",
      style:{
        position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:250,
        background:"rgba(6,10,20,.85)",
        backdropFilter:"blur(4px)",WebkitBackdropFilter:"blur(4px)",
        display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"
      }
    },
      e("div",{style:{
        background:C.cd,border:"1px solid "+C.bd,borderRadius:"16px",
        padding:"28px 24px",maxWidth:"340px",width:"100%",textAlign:"center"
      }},
        e("div",{style:{fontSize:"36px",marginBottom:"10px"}},"🔒"),
        e("p",{style:{color:C.tx,fontSize:"14px",fontWeight:600,marginBottom:"14px"}},"Necesitás una cuenta para crear tarjetas."),
        e("button",{onClick:FE_cancel,style:{
          padding:"10px 20px",borderRadius:"10px",
          background:"none",border:"1px solid "+C.bd,
          color:C.tx,fontSize:"13px",fontWeight:600,cursor:"pointer",minHeight:"44px"
        }},"Cerrar")
      )
    );
  }

  // ── Computed ──
  var deckCol=(deck&&deck.color)||"#a78bfa";

  // ── Shared style helpers ──
  var inputSt={
    width:"100%",padding:"10px 12px",
    borderRadius:"10px",border:"1px solid "+C.bd,
    background:C.bg,color:C.tx,fontSize:"13px",
    outline:"none",boxSizing:"border-box",fontFamily:"inherit",
    resize:"none",lineHeight:1.6
  };
  var labelSt={
    display:"block",color:C.mt,fontSize:"11px",fontWeight:700,
    textTransform:"uppercase",letterSpacing:"1px",marginBottom:"6px"
  };
  var hintSt={fontSize:"11px",color:C.dm,marginTop:"4px",lineHeight:1.4};

  return e("div",{
    className:"fe-bg",
    onClick:function(ev){ if(ev.target===ev.currentTarget&&!FE_saving) FE_cancel(); },
    style:{
      position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:250,
      background:"rgba(6,10,20,.85)",
      backdropFilter:"blur(4px)",WebkitBackdropFilter:"blur(4px)",
      display:"flex",alignItems:"flex-start",justifyContent:"center",
      padding:"16px",overflowY:"auto"
    }
  },
    e("div",{
      className:"fe-modal",
      onClick:function(ev){ ev.stopPropagation(); },
      style:{
        width:"100%",maxWidth:"640px",
        background:C.cd,border:"1px solid "+C.bd,
        borderRadius:"18px",
        boxShadow:"0 16px 48px rgba(0,0,0,.7)",
        padding:"22px 20px 20px",
        boxSizing:"border-box",
        marginTop:"20px",marginBottom:"20px"
      }
    },

      // ── Draft recovery banner ──
      FE_draftAsk && e("div",{style:{
        background:"rgba(167,139,250,.12)",
        border:"1px solid rgba(167,139,250,.35)",
        borderRadius:"10px",padding:"12px 14px",marginBottom:"16px",
        display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"
      }},
        e("span",{style:{fontSize:"13px",color:C.tx,flex:1,lineHeight:1.4}},
          "💾 Hay un borrador sin guardar para esta baraja."
        ),
        e("button",{onClick:FE_applyDraft,style:{
          padding:"6px 14px",borderRadius:"8px",minHeight:"36px",
          background:"linear-gradient(135deg,#a78bfa,#60a5fa)",
          color:"#fff",border:"none",fontSize:"12px",fontWeight:700,cursor:"pointer"
        }},"Recuperar"),
        e("button",{onClick:FE_dismissDraft,style:{
          padding:"6px 12px",borderRadius:"8px",minHeight:"36px",
          background:"none",border:"1px solid "+C.bd,
          color:C.mt,fontSize:"12px",cursor:"pointer"
        }},"Descartar")
      ),

      // ── Header ──
      e("div",{style:{
        display:"flex",alignItems:"flex-start",
        justifyContent:"space-between",marginBottom:"16px"
      }},
        e("div",null,
          e("h2",{style:{fontSize:"17px",fontWeight:800,color:C.tx,margin:0}},
            isCreate?"Nueva tarjeta":"Editar tarjeta"
          ),
          deck && e("p",{style:{fontSize:"11px",color:C.dm,marginTop:"3px",margin:"3px 0 0"}},
            (deck.icon||"🎴")+"  "+deck.name
          )
        ),
        e("button",{
          onClick:FE_cancel,"aria-label":"Cerrar",disabled:FE_saving,
          style:{
            background:"none",border:"none",color:C.mt,fontSize:"24px",
            cursor:FE_saving?"default":"pointer",
            minWidth:"44px",minHeight:"44px",
            display:"flex",alignItems:"center",justifyContent:"center",
            borderRadius:"8px",flexShrink:0,opacity:FE_saving?0.5:1
          }
        },"×")
      ),

      // ── Card type segmented control (sliding pill) ──
      e("div",{style:{
        position:"relative",display:"flex",
        border:"1px solid "+C.bd,borderRadius:"12px",
        overflow:"hidden",height:"46px",marginBottom:"20px"
      }},
        e("div",{className:"fe-pill",style:{
          position:"absolute",top:"2px",bottom:"2px",
          left:FE_type==="basic"?"2px":"calc(50% + 2px)",
          width:"calc(50% - 4px)",
          background:"linear-gradient(135deg,"+deckCol+",#60a5fa)",
          borderRadius:"9px",zIndex:1
        }}),
        e("button",{
          onClick:function(){ FE_setType("basic"); FE_setErr(""); },
          style:{
            flex:1,position:"relative",zIndex:2,
            background:"none",border:"none",
            color:FE_type==="basic"?"#fff":C.dm,
            fontSize:"13px",fontWeight:700,cursor:"pointer"
          }
        },"📝 Básica"),
        e("button",{
          onClick:function(){ FE_setType("cloze"); FE_setErr(""); },
          style:{
            flex:1,position:"relative",zIndex:2,
            background:"none",border:"none",
            color:FE_type==="cloze"?"#fff":C.dm,
            fontSize:"13px",fontWeight:700,cursor:"pointer"
          }
        },"✂️ Cloze")
      ),

      // ── Preview toggle button ──
      e("div",{style:{display:"flex",justifyContent:"flex-end",marginBottom:"16px"}},
        e("button",{
          onClick:function(){ FE_setPrevOn(!FE_prevOn); FE_setPrevFlip(false); },
          style:{
            padding:"6px 14px",borderRadius:"8px",minHeight:"34px",
            background:FE_prevOn?"rgba(167,139,250,.15)":"none",
            border:"1px solid "+(FE_prevOn?"rgba(167,139,250,.45)":C.bd),
            color:FE_prevOn?"#a78bfa":C.dm,
            fontSize:"12px",fontWeight:600,cursor:"pointer"
          }
        },FE_prevOn?"📝 Editor":"👁 Vista previa")
      ),

      // ══════════ PREVIEW MODE ══════════
      FE_prevOn && e("div",{style:{marginBottom:"20px"}},
        e("p",{style:{fontSize:"11px",color:C.mt,textAlign:"center",marginBottom:"14px"}},"Toca la tarjeta para voltear"),
        e("div",{
          onClick:function(){ FE_setPrevFlip(!FE_prevFlip); },
          style:{height:"180px",perspective:"800px",cursor:"pointer"}
        },
          e("div",{
            className:"fe-flip",
            style:{transform:FE_prevFlip?"rotateY(180deg)":"rotateY(0deg)"}
          },
            e("div",{className:"fe-face",style:{
              background:"linear-gradient(135deg,"+C.cd+","+deckCol+"12)",
              border:"1px solid "+deckCol+"30",borderRadius:"14px",
              display:"flex",alignItems:"center",justifyContent:"center",
              padding:"20px",boxSizing:"border-box"
            }},
              FE_type==="cloze"
                ? e("p",{style:{fontSize:"14px",color:C.tx,textAlign:"center",lineHeight:1.6,margin:0}},
                    FE_cloze.trim()
                      ? FE_buildClozePreview(FE_cloze,true)
                      : e("span",{style:{color:C.dm}},"(escribe el texto cloze arriba)")
                  )
                : e("p",{style:{fontSize:"14px",color:C.tx,textAlign:"center",lineHeight:1.6,margin:0}},
                    FE_front.trim()||e("span",{style:{color:C.dm}},"(escribe el frente arriba)")
                  )
            ),
            e("div",{className:"fe-face",style:{
              transform:"rotateY(180deg)",
              background:C.cd,border:"1px solid "+C.bd,borderRadius:"14px",
              display:"flex",alignItems:"center",justifyContent:"center",
              padding:"20px",boxSizing:"border-box"
            }},
              FE_type==="cloze"
                ? e("p",{style:{fontSize:"14px",color:C.tx,textAlign:"center",lineHeight:1.6,margin:0}},
                    FE_cloze.trim()
                      ? FE_buildClozePreview(FE_cloze,false)
                      : e("span",{style:{color:C.dm}},"(respuesta revelada)")
                  )
                : e("p",{style:{fontSize:"14px",color:C.tx,textAlign:"center",lineHeight:1.6,margin:0}},
                    FE_back.trim()||e("span",{style:{color:C.dm}},"(escribe el dorso arriba)")
                  )
            )
          )
        )
      ),

      // ══════════ EDITOR MODE ══════════
      !FE_prevOn && e("div",null,

        // BASIC: frente + dorso
        FE_type==="basic" && e("div",null,
          e("div",{style:{marginBottom:"14px"}},
            e("label",{style:labelSt},"Frente"),
            e("textarea",{
              value:FE_front,rows:3,disabled:FE_saving,
              placeholder:"La pregunta o concepto...",
              onChange:function(ev){ FE_setFront(ev.target.value); FE_setErr(""); FE_grow(ev); },
              style:inputSt
            }),
            e("p",{style:hintSt},"La pregunta o concepto")
          ),
          e("div",{style:{marginBottom:"14px"}},
            e("label",{style:labelSt},"Dorso"),
            e("textarea",{
              value:FE_back,rows:3,disabled:FE_saving,
              placeholder:"La respuesta o explicación...",
              onChange:function(ev){ FE_setBack(ev.target.value); FE_setErr(""); FE_grow(ev); },
              style:inputSt
            }),
            e("p",{style:hintSt},"La respuesta o explicación")
          )
        ),

        // CLOZE: texto + live preview
        FE_type==="cloze" && e("div",{style:{marginBottom:"14px"}},
          e("label",{style:labelSt},"Texto"),
          e("textarea",{
            value:FE_cloze,rows:5,disabled:FE_saving,
            placeholder:"La inflamación de las meninges se llama {{c1::meningitis}}.",
            onChange:function(ev){ FE_setCloze(ev.target.value); FE_setErr(""); FE_grow(ev); },
            style:inputSt
          }),
          e("p",{style:hintSt},
            "Usá ",
            e("code",{style:{background:"rgba(251,191,36,.15)",color:"#fbbf24",padding:"1px 5px",borderRadius:"4px"}},"{{c1::texto}}"),
            " para ocultar partes."
          ),
          FE_cloze.trim() && e("div",{style:{
            marginTop:"12px",padding:"12px",borderRadius:"10px",
            background:"rgba(255,255,255,.03)",border:"1px solid "+C.bd
          }},
            e("p",{style:{fontSize:"11px",fontWeight:700,color:C.mt,
              marginBottom:"10px",textTransform:"uppercase",letterSpacing:"1px"
            }},"Vista previa"),
            e("div",{style:{marginBottom:"8px",display:"flex",alignItems:"baseline",gap:"8px",flexWrap:"wrap"}},
              e("span",{style:{fontSize:"10px",color:C.dm,flexShrink:0}},"Pregunta:"),
              e("span",{style:{fontSize:"13px",color:C.tx,lineHeight:1.6}},
                FE_buildClozePreview(FE_cloze,true)
              )
            ),
            e("div",{style:{display:"flex",alignItems:"baseline",gap:"8px",flexWrap:"wrap"}},
              e("span",{style:{fontSize:"10px",color:C.dm,flexShrink:0}},"Respuesta:"),
              e("span",{style:{fontSize:"13px",color:"#34d399",lineHeight:1.6}},
                FE_buildClozePreview(FE_cloze,false)
              )
            )
          )
        )
      ),

      // ── Tags ──
      e("div",{style:{marginBottom:"16px",marginTop:FE_prevOn?0:"4px"}},
        e("label",{style:labelSt},"Etiquetas"),
        e("div",{style:{
          display:"flex",flexWrap:"wrap",gap:"6px",alignItems:"center",
          minHeight:"44px",padding:"6px 10px",
          borderRadius:"10px",border:"1px solid "+C.bd,background:C.bg
        }},
          FE_tags.map(function(t,i){
            return e("span",{key:i,style:{
              display:"inline-flex",alignItems:"center",gap:"4px",
              padding:"3px 6px 3px 10px",borderRadius:"999px",
              background:"rgba(167,139,250,.15)",border:"1px solid rgba(167,139,250,.3)",
              color:"#a78bfa",fontSize:"11px",fontWeight:600
            }},
              "#"+t,
              e("button",{
                onClick:function(){ FE_removeTag(i); },
                style:{
                  background:"none",border:"none",color:"#a78bfa",
                  cursor:"pointer",padding:"0 2px",lineHeight:1,fontSize:"13px"
                }
              },"×")
            );
          }),
          e("input",{
            type:"text",value:FE_tagIn,disabled:FE_saving,
            onChange:function(ev){ FE_setTagIn(ev.target.value); },
            onKeyDown:FE_tagKeyDown,
            placeholder:FE_tags.length===0?"Agregar etiqueta...":"",
            style:{
              flex:1,minWidth:"100px",border:"none",background:"none",
              color:C.tx,fontSize:"12px",outline:"none",padding:"2px 0"
            }
          })
        ),
        FE_sugg.filter(function(t){ return FE_tags.indexOf(t)===-1; }).length>0 &&
          e("div",{style:{display:"flex",flexWrap:"wrap",gap:"5px",marginTop:"7px"}},
            FE_sugg.filter(function(t){ return FE_tags.indexOf(t)===-1; }).map(function(t){
              return e("button",{key:t,onClick:function(){ FE_addTag(t); },style:{
                padding:"3px 10px",borderRadius:"999px",minHeight:"28px",
                background:"rgba(255,255,255,.04)",border:"1px solid "+C.bd,
                color:C.dm,fontSize:"11px",cursor:"pointer"
              }},"#"+t);
            })
          )
      ),

      // ── Error ──
      FE_err && e("div",{style:{
        color:"#fca5a5",background:"rgba(239,68,68,.10)",
        border:"1px solid rgba(239,68,68,.28)",borderRadius:"10px",
        padding:"10px 12px",fontSize:"13px",marginBottom:"12px"
      }},FE_err),

      // ── Success toast ──
      FE_ok && e("div",{style:{
        color:"#34d399",background:"rgba(52,211,153,.10)",
        border:"1px solid rgba(52,211,153,.28)",borderRadius:"10px",
        padding:"10px 12px",fontSize:"13px",marginBottom:"12px",
        display:"flex",alignItems:"center",gap:"8px"
      }},
        e("span",null,"✓"),
        e("span",null,"Tarjeta guardada")
      ),

      // ── Action bar ──
      e("div",{style:{display:"flex",gap:"8px",marginTop:"4px"}},
        e("button",{
          onClick:FE_cancel,disabled:FE_saving,
          style:{
            flex:"0 0 auto",minHeight:"48px",padding:"12px 20px",
            borderRadius:"12px",background:"none",border:"1px solid "+C.bd,
            color:C.mt,fontSize:"14px",fontWeight:600,
            cursor:FE_saving?"default":"pointer",opacity:FE_saving?0.5:1
          }
        },"Cancelar"),
        e("button",{
          onClick:FE_save,disabled:FE_saving||FE_ok,
          style:{
            flex:1,minHeight:"48px",padding:"12px 20px",borderRadius:"12px",
            background:(FE_saving||FE_ok)?C.bd:"linear-gradient(135deg,#a78bfa,#60a5fa)",
            color:"#fff",border:"none",fontSize:"14px",fontWeight:700,
            cursor:(FE_saving||FE_ok)?"default":"pointer",
            boxShadow:(FE_saving||FE_ok)?"none":"0 4px 14px rgba(167,139,250,.35)"
          }
        },FE_saving?"Guardando...":FE_ok?"¡Guardado!":"Guardar")
      )

    )
  );
}

window.FlashcardEditor=FlashcardEditor;
