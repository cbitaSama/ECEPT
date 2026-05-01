// ══════════════════════════════════════════════════════════════
// CHATBOT — Asistente IA con acceso por cuenta
// ──────────────────────────────────────────────────────────────
// ES5 estricto: solo declaraciones var y function. Nada de ES6+.
// React.createElement vía el alias global `e`. Sin JSX.
// Todos los globales nuevos van con prefijo CB_ para evitar colisiones.
// ══════════════════════════════════════════════════════════════
var CB_MAX_MSGS=4;
// API endpoint: relativa cuando la app se sirve desde Vercel (mismo host),
// absoluta cuando se sirve desde GitHub Pages u otro host.
var CB_API=(typeof window!=="undefined" && window.location.hostname.indexOf("vercel.app")!==-1)
  ? "/api/chat"
  : "https://ecept.vercel.app/api/chat";
var CB_LIMITS={student:40,premium:999,admin:999};
var CB_MODEL_BY_ROLE={student:"gemini-2.0-flash",premium:"gemini-2.5-pro-exp-03-25",admin:"gemini-2.5-pro-exp-03-25"};
var CB_styleInjected=false;

function CB_elionAvatar(sz){
  return e("div",{style:{
    width:sz+"px",height:sz+"px",flexShrink:0,
    borderRadius:"50%",
    background:"linear-gradient(135deg,#60a5fa,#a78bfa)",
    display:"flex",alignItems:"center",justifyContent:"center",
    fontSize:Math.round(sz*0.48)+"px",fontWeight:700,color:"#fff"
  }},"E");
}

function ChatBot(props){
  var s;
  s=useState(false); var CB_open=s[0], CB_setOpen=s[1];
  s=useState(null); var CB_session=s[0], CB_setSession=s[1];
  s=useState(null); var CB_role=s[0], CB_setRole=s[1];
  s=useState(null); var CB_uid=s[0], CB_setUid=s[1];
  s=useState(0); var CB_usageCount=s[0], CB_setUsageCount=s[1];
  s=useState(false); var CB_fullscreen=s[0], CB_setFullscreen=s[1];
  s=useState([]); var CB_msgs=s[0], CB_setMsgs=s[1];
  s=useState(""); var CB_input=s[0], CB_setInput=s[1];
  s=useState(false); var CB_loading=s[0], CB_setLoading=s[1];
  s=useState(false); var CB_connErr=s[0], CB_setConnErr=s[1];

  var CB_scrollRef=useRef(null);

  // Inject CSS keyframes once on mount
  useEffect(function(){
    if(!CB_styleInjected){
      var st=document.createElement("style");
      st.textContent=
        "@keyframes CB_expandIn{from{opacity:.7;transform:scale(.97)}to{opacity:1;transform:scale(1)}}" +
        "@keyframes CB_dotBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}";
      document.head.appendChild(st);
      CB_styleInjected=true;
    }
  },[]);

  useEffect(function(){
    if(CB_scrollRef.current){
      CB_scrollRef.current.scrollTop=CB_scrollRef.current.scrollHeight;
    }
  },[CB_msgs,CB_loading]);

  // On mount: check session; if active, fetch role + today's usage count.
  useEffect(function(){
    if(!window.ECEPT_SUPABASE){ CB_setSession(false); return; }
    try{
      window.ECEPT_SUPABASE.auth.getSession().then(function(res){
        if(res&&res.data&&res.data.session){
          CB_setSession(true);
          var uid=res.data.session.user.id;
          CB_setUid(uid);
          // fetch role
          window.ECEPT_SUPABASE
            .from("profiles")
            .select("role")
            .eq("id",uid)
            .single()
            .then(function(prof){
              CB_setRole((prof&&prof.data&&prof.data.role)?prof.data.role:"student");
            })
            .catch(function(){ CB_setRole("student"); });
          // fetch today's usage count
          var today=new Date().toISOString().split("T")[0];
          window.ECEPT_SUPABASE
            .from("chat_usage")
            .select("message_count")
            .eq("user_id",uid)
            .eq("date",today)
            .single()
            .then(function(usage){
              CB_setUsageCount((usage&&usage.data&&typeof usage.data.message_count==="number")?usage.data.message_count:0);
            })
            .catch(function(){ CB_setUsageCount(0); }); // PGRST116 = no row yet
        } else {
          CB_setSession(false);
        }
      }).catch(function(){ CB_setSession(false); });
    }catch(e2){ CB_setSession(false); }
  },[]);

  function CB_send(){
    var txt=CB_input.trim();
    if(!txt||CB_loading) return;
    var CB_limit=CB_LIMITS[CB_role]!==undefined?CB_LIMITS[CB_role]:40;
    if(CB_role==="student"&&CB_usageCount>=CB_limit) return;
    CB_setInput("");
    CB_setConnErr(false);
    var userMsg={role:"user",text:txt};
    var next=CB_msgs.concat([userMsg]);
    if(next.length>CB_MAX_MSGS) next=next.slice(next.length-CB_MAX_MSGS);
    CB_setMsgs(next);
    CB_setLoading(true);

    var apiMsgs=next.map(function(m){ return {role:m.role,content:m.text}; });
    var idx=(typeof window!=="undefined" && window.SEARCH_INDEX) || [];
    var CB_model=CB_MODEL_BY_ROLE[CB_role]||"gemini-2.0-flash";
    var CB_sendUid=CB_uid;
    var CB_sendCount=CB_usageCount;
    var CB_sendRole=CB_role;

    fetch(CB_API,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({messages:apiMsgs,searchIndex:idx,model:CB_model})
    }).then(function(r){ return r.json(); })
      .then(function(data){
        CB_setLoading(false);
        if(data && typeof data.answer==="string"){
          CB_setMsgs(function(prev){
            var arr=prev.concat([{role:"assistant",text:data.answer,links:Array.isArray(data.links)?data.links:[]}]);
            if(arr.length>CB_MAX_MSGS) arr=arr.slice(arr.length-CB_MAX_MSGS);
            return arr;
          });
          // upsert usage for student tier
          if(CB_sendRole==="student"&&CB_sendUid&&window.ECEPT_SUPABASE){
            var today=new Date().toISOString().split("T")[0];
            var newCount=CB_sendCount+1;
            window.ECEPT_SUPABASE.from("chat_usage").upsert({
              user_id:CB_sendUid,
              date:today,
              message_count:newCount
            },{onConflict:"user_id,date"})
              .then(function(){ CB_setUsageCount(newCount); })
              .catch(function(){ CB_setUsageCount(newCount); });
          }
        } else {
          CB_setConnErr(true);
        }
      })
      .catch(function(err){
        CB_setLoading(false);
        CB_setConnErr(true);
      });
  }

  function CB_onGo(g){
    if(!g) return;
    if(window.CB_go) window.CB_go(g.vista, g.sec||null);
    CB_setOpen(false);
  }

  // responsive: ancho completo en móviles <480px
  var isMobile = (typeof window!=="undefined" && window.innerWidth<480);
  var panelWidth = isMobile ? "calc(100vw - 24px)" : "320px";

  return e("div",null,
    // ── Botón flotante ──
    !CB_open && e("button",{
      onClick:function(){ CB_setOpen(true); CB_setConnErr(false); },
      "aria-label":"Abrir asistente Elion",
      style:{
        position:"fixed", bottom:"20px", right:"20px",
        width:"52px", height:"52px",
        minWidth:"44px", minHeight:"44px",
        borderRadius:"50%",
        background:"linear-gradient(135deg,#60a5fa,#a78bfa)", border:"none", color:"#fff",
        fontSize:"18px", fontWeight:700, cursor:"pointer",
        boxShadow:"0 4px 20px rgba(96,165,250,.45)",
        zIndex:95,
        display:"flex", alignItems:"center", justifyContent:"center"
      }
    },"E"),

    // ── Panel ──
    CB_open && e("div",{
      style: CB_fullscreen ? {
        position:"fixed",
        top:0, left:0, right:0, bottom:0,
        width:"100vw", height:"100vh",
        background:C.bg,
        border:"none",
        borderRadius:0,
        margin:0,
        boxShadow:"none",
        zIndex:300,
        display:"flex", flexDirection:"column",
        overflow:"hidden",
        animation:"CB_expandIn 250ms ease-out"
      } : {
        position:"fixed",
        bottom:"20px",
        right: isMobile ? "12px" : "20px",
        left:  isMobile ? "12px" : "auto",
        width: panelWidth,
        height:"440px",
        maxHeight:"calc(100vh - 40px)",
        background:C.cd,
        border:"1px solid "+C.bd,
        borderRadius:"16px",
        boxShadow:"0 12px 40px rgba(0,0,0,.6)",
        zIndex:96,
        display:"flex", flexDirection:"column",
        overflow:"hidden",
        animation:"slideUp .25s ease-out"
      }
    },
      // ── Header ──
      e("div",{style:{padding:"10px 12px 10px 16px", borderBottom:"1px solid "+C.bd, display:"flex", alignItems:"center", justifyContent:"space-between", background:C.bg}},
        e("div",{style:{display:"flex",alignItems:"center",gap:"8px",overflow:"hidden",minWidth:0}},
          CB_elionAvatar(24),
          e("div",{style:{display:"flex",flexDirection:"column",gap:"1px",overflow:"hidden",minWidth:0}},
            e("div",{style:{fontWeight:700,color:C.tx,fontSize:"14px",lineHeight:"1.2",flexShrink:0}},"Elion"),
            e("div",{style:{fontSize:"10px",color:C.dm,lineHeight:"1.2",whiteSpace:"nowrap"}},"Asistente de estudio · ECEPT")
          ),
          CB_session===true&&(
            CB_role==="student"
              ? e("span",{style:{
                  fontSize:"11px",fontWeight:700,
                  color:CB_usageCount<=30?"#34d399":CB_usageCount<=38?"#fbbf24":"#ef4444",
                  flexShrink:0,marginLeft:"4px"
                }},CB_usageCount+" / "+CB_LIMITS.student)
              : e("div",{style:{display:"flex",alignItems:"center",gap:"4px",flexShrink:0,marginLeft:"4px"}},
                  e("span",{style:{
                    fontSize:"13px",fontWeight:800,
                    color:CB_role==="admin"?"#60a5fa":"#fbbf24"
                  }},"∞"),
                  e("span",{style:{
                    fontSize:"10px",fontWeight:700,padding:"2px 6px",borderRadius:"6px",
                    background:CB_role==="admin"?"rgba(59,130,246,.18)":"rgba(251,191,36,.18)",
                    color:CB_role==="admin"?"#60a5fa":"#fbbf24"
                  }},CB_role==="admin"?"Admin 🔧":"Premium ⭐")
                )
          )
        ),
        e("div",{style:{display:"flex",alignItems:"center",flexShrink:0}},
          e("button",{
            onClick:function(){ CB_setFullscreen(function(f){ return !f; }); },
            "aria-label":CB_fullscreen?"Salir de pantalla completa":"Pantalla completa",
            style:{background:"none",border:"none",color:C.mt,fontSize:"15px",cursor:"pointer",minWidth:"44px",minHeight:"44px",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"8px"}
          },CB_fullscreen?"↙":"⛶"),
          e("button",{
            onClick:function(){ CB_setOpen(false); CB_setFullscreen(false); },
            "aria-label":"Cerrar",
            style:{background:"none",border:"none",color:C.mt,fontSize:"22px",cursor:"pointer",minWidth:"44px",minHeight:"44px",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"8px"}
          },"×")
        )
      ),

      CB_session===null ?
        // ── Verificando sesión ──
        e("div",{style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}},
          e("div",{style:{color:C.dm,fontSize:"13px"}},"Verificando sesión...")
        )
      : CB_session===false ?
        // ── Sin sesión — pedir cuenta ──
        e("div",{style:{flex:1,display:"flex",flexDirection:"column",alignItems:"stretch",justifyContent:"center",padding:"20px",gap:"12px"}},
          e("div",{style:{textAlign:"center",fontSize:"28px",marginBottom:"4px"}},"🔒"),
          e("div",{style:{color:C.tx,fontSize:"13px",textAlign:"center",lineHeight:1.5,fontWeight:600}},"Necesitás una cuenta"),
          e("div",{style:{color:C.mt,fontSize:"12px",textAlign:"center",lineHeight:1.5}},"El asistente está disponible para usuarios registrados."),
          e("button",{
            onClick:function(){
              CB_setOpen(false);
              if(typeof props.onLoginRequest==="function") props.onLoginRequest();
            },
            style:{minHeight:"44px",padding:"12px 14px",borderRadius:"10px",background:"#3b82f6",color:"#fff",border:"none",cursor:"pointer",fontSize:"14px",fontWeight:700}
          },"Crear cuenta / Iniciar sesión")
        )
      :
        // ── Chat ──
        e(F,null,
          e("div",{ref:CB_scrollRef, style:{flex:1, overflowY:"auto", padding:"12px 14px", display:"flex", flexDirection:"column", gap:"10px"}},
            CB_msgs.length===0 && !CB_loading && e("div",{style:{color:C.dm, fontSize:"12px", textAlign:"center", marginTop:"20px", lineHeight:1.5, padding:"0 8px"}},"Pregúntame sobre medicina o sobre el contenido de ECEPT."),
            CB_msgs.map(function(m,i){
              var isUser = m.role==="user";
              return e("div",{key:i, style:{display:"flex", flexDirection:"column", alignItems:(isUser?"flex-end":"flex-start"), gap:"6px"}},
                isUser
                  ? e("div",{style:{
                      maxWidth:"85%",
                      padding:"10px 12px",
                      borderRadius:"12px",
                      background:"#3b82f6",
                      color:"#fff",
                      fontSize:"13px",
                      lineHeight:1.5,
                      wordBreak:"break-word",
                      whiteSpace:"pre-wrap"
                    }}, m.text)
                  : e("div",{style:{display:"flex",alignItems:"flex-start",gap:"6px",maxWidth:"92%"}},
                      CB_elionAvatar(28),
                      e("div",{style:{
                        padding:"10px 12px",
                        borderRadius:"12px",
                        background:C.bg,
                        color:C.tx,
                        fontSize:"13px",
                        lineHeight:1.5,
                        border:"1px solid "+C.bd,
                        wordBreak:"break-word",
                        whiteSpace:"pre-wrap"
                      }}, m.text)
                    ),
                !isUser && Array.isArray(m.links) && m.links.length>0 && e("div",{style:{display:"flex", flexWrap:"wrap", gap:"6px", alignSelf:"flex-start", maxWidth:"100%", paddingLeft:"34px"}},
                  m.links.map(function(lk,li){
                    return e("button",{
                      key:li,
                      onClick:function(){ CB_onGo({vista:lk.vista, sec:lk.sec||null}); },
                      style:{
                        minHeight:"44px",
                        padding:"8px 14px",
                        borderRadius:"999px",
                        background:"rgba(59,130,246,.12)",
                        border:"1px solid rgba(59,130,246,.35)",
                        color:"#60a5fa",
                        fontSize:"12px",
                        fontWeight:700,
                        cursor:"pointer",
                        textAlign:"left"
                      }
                    }, "→ "+(lk.label||lk.vista));
                  })
                )
              );
            }),
            // ── Typing indicator ──
            CB_loading && e("div",{style:{display:"flex",alignItems:"flex-start",gap:"6px"}},
              CB_elionAvatar(28),
              e("div",{style:{
                padding:"10px 14px",
                borderRadius:"12px",
                background:C.bg,
                border:"1px solid "+C.bd,
                display:"flex",alignItems:"center",gap:"5px"
              }},
                e("span",{style:{display:"inline-block",fontSize:"8px",color:C.dm,animation:"CB_dotBounce .8s ease-in-out infinite",animationDelay:"0s"}},"●"),
                e("span",{style:{display:"inline-block",fontSize:"8px",color:C.dm,animation:"CB_dotBounce .8s ease-in-out infinite",animationDelay:"0.15s"}},"●"),
                e("span",{style:{display:"inline-block",fontSize:"8px",color:C.dm,animation:"CB_dotBounce .8s ease-in-out infinite",animationDelay:"0.3s"}},"●")
              )
            ),
            CB_connErr && e("div",{style:{color:"#ef4444", fontSize:"12px", padding:"8px 10px", background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.25)", borderRadius:"8px"}},"Error de conexión. Intenta de nuevo."),
            CB_role==="student"&&CB_usageCount>=CB_LIMITS.student&&e("div",{style:{color:"#fbbf24",fontSize:"12px",padding:"8px 10px",background:"rgba(251,191,36,.08)",border:"1px solid rgba(251,191,36,.25)",borderRadius:"8px"}},"Alcanzaste el límite de 40 mensajes diarios del plan gratuito. Próximamente podrás actualizar tu plan.")
          ),
          // ── Input bar ──
          e("div",{style:{padding:"10px 12px", borderTop:"1px solid "+C.bd, display:"flex", gap:"8px", background:C.bg}},
            e("input",{
              type:"text",
              value:CB_input,
              onChange:function(ev){ CB_setInput(ev.target.value); },
              onKeyDown:function(ev){ if(ev.key==="Enter" && !ev.shiftKey){ ev.preventDefault(); CB_send(); } },
              placeholder:"Escribe tu mensaje...",
              disabled: CB_loading||(CB_role==="student"&&CB_usageCount>=CB_LIMITS.student),
              "aria-label":"Mensaje",
              style:{
                flex:1,
                minHeight:"44px",
                padding:"10px 12px",
                borderRadius:"10px",
                border:"1px solid "+C.bd,
                background:C.cd,
                color:C.tx,
                fontSize:"14px",
                outline:"none"
              }
            }),
            e("button",{
              onClick:CB_send,
              disabled: CB_loading||!CB_input.trim()||(CB_role==="student"&&CB_usageCount>=CB_LIMITS.student),
              "aria-label":"Enviar",
              style:{
                minWidth:"44px",
                minHeight:"44px",
                padding:"0 14px",
                borderRadius:"10px",
                background:(CB_loading||!CB_input.trim()||(CB_role==="student"&&CB_usageCount>=CB_LIMITS.student))?C.dm:"#3b82f6",
                color:"#fff",
                border:"none",
                cursor:(CB_loading||!CB_input.trim()||(CB_role==="student"&&CB_usageCount>=CB_LIMITS.student))?"default":"pointer",
                fontSize:"16px",
                fontWeight:700
              }
            },"➤")
          )
        )
    )
  );
}
window.ChatBot = ChatBot;
