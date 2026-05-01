// ══════════════════════════════════════════════════════════════
// AUTH — Modal de inicio de sesión / registro (Supabase)
// ──────────────────────────────────────────────────────────────
// ES5 estricto: solo declaraciones var y function. Nada de ES6+.
// React.createElement vía el alias global `e`. Sin JSX.
// Globales internos con prefijo AU_ para evitar colisiones.
// ══════════════════════════════════════════════════════════════
function AU_translateError(err){
  if(!err) return "Ocurrió un error. Intenta de nuevo.";
  var msg=err.message||String(err);
  var lower=msg.toLowerCase();
  if(lower.indexOf("invalid login")!==-1||lower.indexOf("invalid credentials")!==-1) return "Correo o contraseña incorrectos.";
  if(lower.indexOf("already registered")!==-1||lower.indexOf("already exists")!==-1||lower.indexOf("user already")!==-1) return "Ese correo ya está registrado.";
  if(lower.indexOf("password")!==-1 && (lower.indexOf("short")!==-1||lower.indexOf("characters")!==-1||lower.indexOf("6")!==-1)) return "La contraseña debe tener al menos 6 caracteres.";
  if(lower.indexOf("email")!==-1 && (lower.indexOf("invalid")!==-1||lower.indexOf("valid")!==-1)) return "Correo electrónico inválido.";
  if(lower.indexOf("email not confirmed")!==-1) return "Confirmá tu correo antes de iniciar sesión. Revisá tu bandeja de entrada.";
  if(lower.indexOf("network")!==-1||lower.indexOf("fetch")!==-1||lower.indexOf("failed to")!==-1) return "Error de conexión. Intenta de nuevo.";
  if(lower.indexOf("rate")!==-1||lower.indexOf("too many")!==-1) return "Demasiados intentos. Espera un momento.";
  return "No pudimos completar la solicitud. Intenta de nuevo.";
}

function AuthModal(props){
  var s;
  s=useState("login"); var AU_mode=s[0], AU_setMode=s[1];
  s=useState(""); var AU_email=s[0], AU_setEmail=s[1];
  s=useState(""); var AU_password=s[0], AU_setPassword=s[1];
  s=useState(""); var AU_displayName=s[0], AU_setDisplayName=s[1];
  s=useState(false); var AU_loading=s[0], AU_setLoading=s[1];
  s=useState(""); var AU_error=s[0], AU_setError=s[1];
  s=useState(false); var AU_signupDone=s[0], AU_setSignupDone=s[1];

  function AU_toggleMode(){
    if(AU_loading) return;
    AU_setMode(AU_mode==="login"?"signup":"login");
    AU_setError("");
  }

  function AU_handleResult(res){
    AU_setLoading(false);
    if(res && res.error){ AU_setError(AU_translateError(res.error)); return; }
    if(AU_mode==="signup"){ AU_setSignupDone(true); return; }
    if(typeof props.onSuccess==="function") props.onSuccess();
  }

  function AU_handleReject(err){
    AU_setLoading(false);
    AU_setError(AU_translateError(err));
  }

  function AU_submit(){
    if(AU_loading) return;
    var emailTrim=AU_email.trim();
    if(!emailTrim||!AU_password){ AU_setError("Completa todos los campos."); return; }
    if(AU_mode==="signup" && !AU_displayName.trim()){ AU_setError("Ingresa cómo te llamamos."); return; }
    if(!window.ECEPT_SUPABASE||!window.ECEPT_SUPABASE.auth){ AU_setError("Servicio de autenticación no disponible."); return; }
    AU_setError("");
    AU_setLoading(true);
    if(AU_mode==="signup"){
      var username=emailTrim.split("@")[0];
      window.ECEPT_SUPABASE.auth.signUp({
        email:emailTrim,
        password:AU_password,
        options:{ data:{ display_name:AU_displayName.trim(), username:username } }
      }).then(AU_handleResult, AU_handleReject);
    } else {
      window.ECEPT_SUPABASE.auth.signInWithPassword({
        email:emailTrim,
        password:AU_password
      }).then(AU_handleResult, AU_handleReject);
    }
  }

  function AU_onKeyDown(ev){ if(ev.key==="Enter") AU_submit(); }

  function AU_onClose(){
    if(AU_loading) return;
    if(typeof props.onClose==="function") props.onClose();
  }

  var inputStyle={
    width:"100%",
    padding:"12px 14px",
    minHeight:"44px",
    borderRadius:"10px",
    border:"1px solid "+C.bd,
    background:C.bg,
    color:C.tx,
    fontSize:"14px",
    outline:"none",
    boxSizing:"border-box"
  };

  var labelStyle={
    display:"block",
    color:C.mt,
    fontSize:"12px",
    fontWeight:600,
    marginBottom:"6px"
  };

  var isSignup=AU_mode==="signup";

  return e("div",{
    onClick:AU_onClose,
    style:{
      position:"fixed",
      top:0, left:0, right:0, bottom:0,
      background:"rgba(6,10,20,.78)",
      backdropFilter:"blur(4px)",
      WebkitBackdropFilter:"blur(4px)",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      padding:"16px",
      zIndex:200,
      animation:"fadeIn .18s ease-out"
    }
  },
    e("div",{
      onClick:function(ev){ ev.stopPropagation(); },
      style:{
        minWidth:"320px",
        width:"100%",
        maxWidth:"380px",
        background:C.cd,
        border:"1px solid "+C.bd,
        borderRadius:"16px",
        boxShadow:"0 12px 40px rgba(0,0,0,.6)",
        padding:"20px 18px 18px",
        animation:"slideUp .25s ease-out",
        boxSizing:"border-box"
      }
    },
      // header
      e("div",{style:{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px"}},
        e("div",{style:{fontSize:"16px", fontWeight:700, color:C.tx}}, AU_signupDone?"¡Cuenta creada!":isSignup?"Crear cuenta":"Iniciar sesión"),
        e("button",{
          onClick:AU_onClose,
          "aria-label":"Cerrar",
          disabled:AU_loading,
          style:{
            background:"none", border:"none",
            color:C.mt, fontSize:"24px",
            cursor:AU_loading?"default":"pointer",
            minWidth:"44px", minHeight:"44px",
            display:"flex", alignItems:"center", justifyContent:"center",
            borderRadius:"8px",
            opacity:AU_loading?0.5:1
          }
        },"×")
      ),

      // post-signup confirmation screen OR login/signup form
      AU_signupDone
        ? e("div",{style:{textAlign:"center",padding:"8px 0 4px"}},
            e("div",{style:{fontSize:"40px",marginBottom:"14px"}},"✉️"),
            e("p",{style:{color:C.tx,fontSize:"14px",lineHeight:1.6,marginBottom:"20px"}},
              "¡Cuenta creada! Te enviamos un correo de confirmación. Revisá tu bandeja de entrada y luego iniciá sesión."
            ),
            e("button",{
              onClick:AU_onClose,
              style:{
                width:"100%",minHeight:"44px",padding:"12px 14px",
                borderRadius:"10px",background:C.ac,color:"#fff",
                border:"none",cursor:"pointer",fontSize:"14px",fontWeight:700
              }
            },"Entendido")
          )
        : e(F,null,
            // display_name (signup only)
            isSignup && e("div",{style:{marginBottom:"12px"}},
              e("label",{style:labelStyle, htmlFor:"AU_dn"},"¿Cómo te llamamos?"),
              e("input",{
                id:"AU_dn",
                type:"text",
                value:AU_displayName,
                onChange:function(ev){ AU_setDisplayName(ev.target.value); },
                onKeyDown:AU_onKeyDown,
                placeholder:"Tu nombre",
                autoComplete:"name",
                disabled:AU_loading,
                style:inputStyle
              })
            ),

            // email
            e("div",{style:{marginBottom:"12px"}},
              e("label",{style:labelStyle, htmlFor:"AU_email"},"Correo electrónico"),
              e("input",{
                id:"AU_email",
                type:"email",
                value:AU_email,
                onChange:function(ev){ AU_setEmail(ev.target.value); },
                onKeyDown:AU_onKeyDown,
                placeholder:"tu@correo.com",
                autoComplete:"email",
                autoCapitalize:"none",
                spellCheck:false,
                disabled:AU_loading,
                style:inputStyle
              })
            ),

            // password
            e("div",{style:{marginBottom:"14px"}},
              e("label",{style:labelStyle, htmlFor:"AU_pw"},"Contraseña"),
              e("input",{
                id:"AU_pw",
                type:"password",
                value:AU_password,
                onChange:function(ev){ AU_setPassword(ev.target.value); },
                onKeyDown:AU_onKeyDown,
                placeholder:isSignup?"Mínimo 6 caracteres":"Tu contraseña",
                autoComplete:isSignup?"new-password":"current-password",
                disabled:AU_loading,
                style:inputStyle
              })
            ),

            // error
            AU_error && e("div",{
              role:"alert",
              style:{
                color:"#fca5a5",
                background:"rgba(239,68,68,.12)",
                border:"1px solid rgba(239,68,68,.35)",
                borderRadius:"10px",
                padding:"10px 12px",
                fontSize:"13px",
                lineHeight:1.4,
                marginBottom:"12px"
              }
            }, AU_error),

            // submit
            e("button",{
              onClick:AU_submit,
              disabled:AU_loading,
              style:{
                width:"100%",
                minHeight:"44px",
                padding:"12px 14px",
                borderRadius:"10px",
                background:AU_loading?C.bd:C.ac,
                color:"#fff",
                border:"none",
                cursor:AU_loading?"default":"pointer",
                fontSize:"14px",
                fontWeight:700,
                marginBottom:"12px"
              }
            }, AU_loading?"Cargando...":(isSignup?"Crear cuenta":"Entrar")),

            // toggle link
            e("div",{style:{textAlign:"center", fontSize:"13px", color:C.mt}},
              isSignup?"¿Ya tienes cuenta? ":"¿No tienes cuenta? ",
              e("button",{
                onClick:AU_toggleMode,
                disabled:AU_loading,
                style:{
                  background:"none", border:"none",
                  color:C.ac2,
                  cursor:AU_loading?"default":"pointer",
                  fontSize:"13px", fontWeight:600,
                  padding:"4px 6px",
                  textDecoration:"underline",
                  opacity:AU_loading?0.5:1
                }
              }, isSignup?"Inicia sesión":"Regístrate")
            )
          )
    )
  );
}

window.AuthModal = AuthModal;
