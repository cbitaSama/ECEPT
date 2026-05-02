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

function AU_googleIcon(){
  return e("svg",{
    viewBox:"0 0 24 24",
    width:"18",height:"18",
    style:{flexShrink:0},
    "aria-hidden":"true"
  },
    e("path",{fill:"#4285F4",d:"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"}),
    e("path",{fill:"#34A853",d:"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"}),
    e("path",{fill:"#FBBC05",d:"M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"}),
    e("path",{fill:"#EA4335",d:"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"})
  );
}

function AuthModal(props){
  var s;
  s=useState("login"); var AU_mode=s[0], AU_setMode=s[1];
  s=useState(""); var AU_email=s[0], AU_setEmail=s[1];
  s=useState(""); var AU_password=s[0], AU_setPassword=s[1];
  s=useState(""); var AU_displayName=s[0], AU_setDisplayName=s[1];
  s=useState(false); var AU_loading=s[0], AU_setLoading=s[1];
  s=useState(false); var AU_oauthLoading=s[0], AU_setOauthLoading=s[1];
  s=useState(""); var AU_error=s[0], AU_setError=s[1];
  s=useState(false); var AU_signupDone=s[0], AU_setSignupDone=s[1];

  var AU_busy = AU_loading || AU_oauthLoading;

  function AU_toggleMode(){
    if(AU_busy) return;
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
    if(AU_busy) return;
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
      if(emailTrim.indexOf("@")!==-1){
        window.ECEPT_SUPABASE.auth.signInWithPassword({
          email:emailTrim,
          password:AU_password
        }).then(AU_handleResult, AU_handleReject);
      } else {
        window.ECEPT_SUPABASE.rpc("get_email_by_username",{p_username:emailTrim.toLowerCase()})
          .then(function(res){
            if(res.error||!res.data){
              AU_setLoading(false);
              AU_setError("No encontramos una cuenta con ese usuario.");
              return;
            }
            window.ECEPT_SUPABASE.auth.signInWithPassword({
              email:res.data,
              password:AU_password
            }).then(AU_handleResult, AU_handleReject);
          }, AU_handleReject);
      }
    }
  }

  function AU_handleOAuth(){
    if(AU_busy) return;
    if(!window.ECEPT_SUPABASE||!window.ECEPT_SUPABASE.auth){ AU_setError("Servicio de autenticación no disponible."); return; }
    AU_setError("");
    AU_setOauthLoading(true);
    window.ECEPT_SUPABASE.auth.signInWithOAuth({
      provider:"google",
      options:{ redirectTo: window.location.origin }
    }).then(function(res){
      AU_setOauthLoading(false);
      if(res && res.error) AU_setError(AU_translateError(res.error));
      // success: browser redirects — no further action needed here
    }, function(err){
      AU_setOauthLoading(false);
      AU_setError(AU_translateError(err));
    });
  }

  function AU_onKeyDown(ev){ if(ev.key==="Enter") AU_submit(); }

  function AU_onClose(){
    if(AU_busy) return;
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
      background:"rgba(6,10,20,.85)",
      backdropFilter:"blur(12px)",
      WebkitBackdropFilter:"blur(12px)",
      display:"flex",
      alignItems:"flex-start",
      justifyContent:"center",
      padding:"24px",
      overflowY:"auto",
      WebkitOverflowScrolling:"touch",
      zIndex:200,
      animation:"ecept_fadeIn .24s cubic-bezier(0.16,1,0.3,1)"
    }
  },
    e("div",{
      onClick:function(ev){ ev.stopPropagation(); },
      style:{
        minWidth:"320px",
        width:"100%",
        maxWidth:"440px",
        background:"linear-gradient(180deg,#0d1224 0%,#0a0e1f 100%)",
        border:"1px solid "+C.bd,
        borderRadius:"24px",
        boxShadow:"0 20px 48px rgba(0,0,0,0.4), 0 8px 16px rgba(0,0,0,0.25)",
        padding:"36px 32px 28px",
        animation:"ecept_modalIn .32s cubic-bezier(0.16,1,0.3,1)",
        boxSizing:"border-box",
        marginTop:"40px",marginBottom:"40px"
      }
    },
      // ── Premium logo header ──
      // Container con altura fija = al size del logo + breathing room para
      // el drop-shadow del glow. NO usar overflow:hidden ni padding negativo.
      !AU_signupDone && e("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",width:"100%",height:"80px",marginBottom:"20px",overflow:"visible"}},
        e(window.Logo || "span",{ size: 64, glow: true, animated: true, idSuffix:"auth" })
      ),
      // ── Header ──
      e("div",{style:{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px"}},
        e("div",{style:{fontSize:"22px", fontWeight:800, letterSpacing:"-0.02em", background:"linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text"}}, AU_signupDone?"¡Cuenta creada!":isSignup?"Crear cuenta":"Bienvenido a ECEPT"),
        e("button",{
          onClick:AU_onClose,
          "aria-label":"Cerrar",
          disabled:AU_busy,
          style:{
            background:"none", border:"none",
            color:C.mt, fontSize:"24px",
            cursor:AU_busy?"default":"pointer",
            minWidth:"44px", minHeight:"44px",
            display:"flex", alignItems:"center", justifyContent:"center",
            borderRadius:"8px",
            opacity:AU_busy?0.5:1
          }
        },"×")
      ),

      // ── Post-signup confirmation OR form ──
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

            // ── Google OAuth button ──
            e("button",{
              onClick:AU_handleOAuth,
              disabled:AU_busy,
              style:{
                width:"100%",
                minHeight:"44px",
                padding:"10px 14px",
                borderRadius:"10px",
                background:"#fff",
                border:"1px solid #dadce0",
                color:"#3c4043",
                fontSize:"14px",
                fontWeight:600,
                cursor:AU_busy?"default":"pointer",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                gap:"10px",
                marginBottom:"14px",
                opacity:AU_busy?0.6:1,
                boxSizing:"border-box"
              }
            },
              AU_oauthLoading
                ? e("span",{style:{color:"#3c4043",fontSize:"14px"}},"Redirigiendo...")
                : e(F,null, AU_googleIcon(), e("span",null,"Continuar con Google"))
            ),

            // ── Divider ──
            e("div",{style:{
              display:"flex",
              alignItems:"center",
              gap:"10px",
              marginBottom:"14px",
              color:C.dm,
              fontSize:"12px"
            }},
              e("div",{style:{flex:1,height:"1px",background:C.bd}}),
              e("span",null,"o"),
              e("div",{style:{flex:1,height:"1px",background:C.bd}})
            ),

            // ── display_name (signup only) ──
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
                disabled:AU_busy,
                style:inputStyle
              })
            ),

            // ── email / username ──
            e("div",{style:{marginBottom:"12px"}},
              e("label",{style:labelStyle, htmlFor:"AU_email"},isSignup?"Correo electrónico":"Email o usuario"),
              e("input",{
                id:"AU_email",
                type:isSignup?"email":"text",
                value:AU_email,
                onChange:function(ev){ AU_setEmail(ev.target.value); },
                onKeyDown:AU_onKeyDown,
                placeholder:isSignup?"tu@correo.com":"correo o usuario",
                autoComplete:isSignup?"email":"username",
                autoCapitalize:"none",
                spellCheck:false,
                disabled:AU_busy,
                style:inputStyle
              })
            ),

            // ── password ──
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
                disabled:AU_busy,
                style:inputStyle
              })
            ),

            // ── error ──
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

            // ── submit ──
            e("button",{
              onClick:AU_submit,
              disabled:AU_busy,
              style:{
                width:"100%",
                minHeight:"48px",
                padding:"14px 18px",
                borderRadius:"14px",
                background:AU_busy?C.bd:"linear-gradient(135deg,#60a5fa,#a78bfa)",
                color:"#fff",
                border:"none",
                cursor:AU_busy?"default":"pointer",
                fontSize:"15px",
                fontWeight:700,
                letterSpacing:"-0.01em",
                marginBottom:"14px",
                boxShadow:AU_busy?"none":"0 4px 16px rgba(167,139,250,0.25)",
                transition:"all 240ms cubic-bezier(0.32,0.72,0,1)"
              }
            }, AU_loading?"Cargando...":(isSignup?"Crear cuenta":"Entrar")),

            // ── toggle link ──
            e("div",{style:{textAlign:"center", fontSize:"13px", color:C.mt}},
              isSignup?"¿Ya tienes cuenta? ":"¿No tienes cuenta? ",
              e("button",{
                onClick:AU_toggleMode,
                disabled:AU_busy,
                style:{
                  background:"none", border:"none",
                  color:C.ac2,
                  cursor:AU_busy?"default":"pointer",
                  fontSize:"13px", fontWeight:600,
                  padding:"4px 6px",
                  textDecoration:"underline",
                  opacity:AU_busy?0.5:1
                }
              }, isSignup?"Inicia sesión":"Regístrate")
            )
          )
    )
  );
}

window.AuthModal = AuthModal;
