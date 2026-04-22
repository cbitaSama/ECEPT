// ══════════════════════════════════════════════════════════════
// CHATBOT — Asistente IA con gate de acceso
// ──────────────────────────────────────────────────────────────
// ES5 estricto: solo declaraciones var y function. Nada de ES6+.
// React.createElement vía el alias global `e`. Sin JSX.
// Todos los globales nuevos van con prefijo CB_ para evitar colisiones.
// ══════════════════════════════════════════════════════════════
var CB_CODE="210419";
var CB_MAX_MSGS=4;

function ChatBot(){
  var s;
  s=useState(false); var CB_open=s[0], CB_setOpen=s[1];
  s=useState(function(){
    try{ return localStorage.getItem("CB_auth")==="1"; }catch(e2){ return false; }
  });
  var CB_authed=s[0], CB_setAuthed=s[1];
  s=useState(""); var CB_code=s[0], CB_setCode=s[1];
  s=useState(false); var CB_codeErr=s[0], CB_setCodeErr=s[1];
  s=useState([]); var CB_msgs=s[0], CB_setMsgs=s[1];
  s=useState(""); var CB_input=s[0], CB_setInput=s[1];
  s=useState(false); var CB_loading=s[0], CB_setLoading=s[1];
  s=useState(false); var CB_connErr=s[0], CB_setConnErr=s[1];

  var CB_scrollRef=useRef(null);
  useEffect(function(){
    if(CB_scrollRef.current){
      CB_scrollRef.current.scrollTop=CB_scrollRef.current.scrollHeight;
    }
  },[CB_msgs,CB_loading]);

  function CB_submitCode(){
    if(CB_code===CB_CODE){
      try{ localStorage.setItem("CB_auth","1"); }catch(e2){}
      CB_setAuthed(true);
      CB_setCodeErr(false);
      CB_setCode("");
    } else {
      CB_setCodeErr(true);
      CB_setCode("");
    }
  }

  function CB_send(){
    var txt=CB_input.trim();
    if(!txt||CB_loading) return;
    CB_setInput("");
    CB_setConnErr(false);
    var userMsg={role:"user",text:txt};
    var next=CB_msgs.concat([userMsg]);
    if(next.length>CB_MAX_MSGS) next=next.slice(next.length-CB_MAX_MSGS);
    CB_setMsgs(next);
    CB_setLoading(true);

    var apiMsgs=next.map(function(m){ return {role:m.role,content:m.text}; });
    var idx=(typeof window!=="undefined" && window.SEARCH_INDEX) || [];

    fetch("/api/chat",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({messages:apiMsgs, searchIndex:idx})
    }).then(function(r){ return r.json(); })
      .then(function(data){
        CB_setLoading(false);
        if(data && typeof data.answer==="string"){
          CB_setMsgs(function(prev){
            var arr=prev.concat([{role:"assistant",text:data.answer,go:data.go||null}]);
            if(arr.length>CB_MAX_MSGS) arr=arr.slice(arr.length-CB_MAX_MSGS);
            return arr;
          });
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
      "aria-label":"Abrir asistente",
      style:{
        position:"fixed", bottom:"20px", right:"20px",
        width:"52px", height:"52px",
        minWidth:"44px", minHeight:"44px",
        borderRadius:"50%",
        background:"#3b82f6", border:"none", color:"#fff",
        fontSize:"24px", cursor:"pointer",
        boxShadow:"0 4px 20px rgba(59,130,246,.4)",
        zIndex:95,
        display:"flex", alignItems:"center", justifyContent:"center"
      }
    },"🤖"),

    // ── Panel ──
    CB_open && e("div",{
      style:{
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
      // header
      e("div",{style:{padding:"10px 12px 10px 16px", borderBottom:"1px solid "+C.bd, display:"flex", alignItems:"center", justifyContent:"space-between", background:C.bg}},
        e("div",{style:{display:"flex",alignItems:"center",gap:"8px"}},
          e("span",{style:{fontSize:"18px"}},"🤖"),
          e("div",{style:{fontWeight:700, color:C.tx, fontSize:"14px"}},"Asistente ECEPT")
        ),
        e("button",{
          onClick:function(){ CB_setOpen(false); },
          "aria-label":"Cerrar",
          style:{background:"none", border:"none", color:C.mt, fontSize:"22px", cursor:"pointer", minWidth:"44px", minHeight:"44px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"8px"}
        },"×")
      ),

      !CB_authed ?
        // ── Gate de acceso ──
        e("div",{style:{flex:1, display:"flex", flexDirection:"column", alignItems:"stretch", justifyContent:"center", padding:"20px", gap:"12px"}},
          e("div",{style:{color:C.tx, fontSize:"13px", textAlign:"center", lineHeight:1.5, fontWeight:600}},"Acceso restringido"),
          e("div",{style:{color:C.mt, fontSize:"12px", textAlign:"center", lineHeight:1.5}},"Ingresa el código para usar el asistente."),
          e("input",{
            type:"password",
            value:CB_code,
            onChange:function(ev){ CB_setCode(ev.target.value); if(CB_codeErr) CB_setCodeErr(false); },
            onKeyDown:function(ev){ if(ev.key==="Enter") CB_submitCode(); },
            placeholder:"Código",
            "aria-label":"Código de acceso",
            style:{
              padding:"12px 14px",
              minHeight:"44px",
              borderRadius:"10px",
              border:"1px solid "+(CB_codeErr?"#ef4444":C.bd),
              background:C.bg,
              color:C.tx,
              fontSize:"14px",
              outline:"none",
              textAlign:"center",
              letterSpacing:"4px"
            }
          }),
          CB_codeErr && e("div",{style:{color:"#ef4444", fontSize:"12px", textAlign:"center"}},"Código incorrecto"),
          e("button",{
            onClick:CB_submitCode,
            style:{
              minHeight:"44px",
              padding:"12px 14px",
              borderRadius:"10px",
              background:"#3b82f6",
              color:"#fff",
              border:"none",
              cursor:"pointer",
              fontSize:"14px",
              fontWeight:700
            }
          },"Entrar")
        )
      :
        // ── Chat ──
        e(F,null,
          e("div",{ref:CB_scrollRef, style:{flex:1, overflowY:"auto", padding:"12px 14px", display:"flex", flexDirection:"column", gap:"10px"}},
            CB_msgs.length===0 && !CB_loading && e("div",{style:{color:C.dm, fontSize:"12px", textAlign:"center", marginTop:"20px", lineHeight:1.5, padding:"0 8px"}},"Pregúntame sobre medicina o sobre el contenido de ECEPT."),
            CB_msgs.map(function(m,i){
              var isUser = m.role==="user";
              return e("div",{key:i, style:{display:"flex", flexDirection:"column", alignItems:(isUser?"flex-end":"flex-start"), gap:"6px"}},
                e("div",{style:{
                  maxWidth:"85%",
                  padding:"10px 12px",
                  borderRadius:"12px",
                  background: isUser ? "#3b82f6" : C.bg,
                  color: isUser ? "#fff" : C.tx,
                  fontSize:"13px",
                  lineHeight:1.5,
                  border: isUser ? "none" : ("1px solid "+C.bd),
                  wordBreak:"break-word",
                  whiteSpace:"pre-wrap"
                }}, m.text),
                !isUser && m.go && e("button",{
                  onClick:function(){ CB_onGo(m.go); },
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
                    alignSelf:"flex-start"
                  }
                },"→ Ir a sección")
              );
            }),
            CB_loading && e("div",{style:{color:C.dm, fontSize:"12px", fontStyle:"italic"}},"escribiendo..."),
            CB_connErr && e("div",{style:{color:"#ef4444", fontSize:"12px", padding:"8px 10px", background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.25)", borderRadius:"8px"}},"Error de conexión. Intenta de nuevo.")
          ),
          // input bar
          e("div",{style:{padding:"10px 12px", borderTop:"1px solid "+C.bd, display:"flex", gap:"8px", background:C.bg}},
            e("input",{
              type:"text",
              value:CB_input,
              onChange:function(ev){ CB_setInput(ev.target.value); },
              onKeyDown:function(ev){ if(ev.key==="Enter" && !ev.shiftKey){ ev.preventDefault(); CB_send(); } },
              placeholder:"Escribe tu mensaje...",
              disabled: CB_loading,
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
              disabled: CB_loading || !CB_input.trim(),
              "aria-label":"Enviar",
              style:{
                minWidth:"44px",
                minHeight:"44px",
                padding:"0 14px",
                borderRadius:"10px",
                background: (CB_loading||!CB_input.trim()) ? C.dm : "#3b82f6",
                color:"#fff",
                border:"none",
                cursor: (CB_loading||!CB_input.trim()) ? "default" : "pointer",
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
