// ══════════════════════════════════════════════════════════════
// PROFILE VIEW — pantalla de perfil de usuario editable
// ──────────────────────────────────────────────────────────────
// ES5 estricto: solo declaraciones var y function. Nada de ES6+.
// React.createElement vía el alias global `e`. Sin JSX.
// Globales internos con prefijo PV_ para evitar colisiones.
// Props: user (Supabase user), onBack (function)
// ══════════════════════════════════════════════════════════════
function ProfileView(props){
  var user = props.user;
  var s;

  s=useState(null);  var PV_profile=s[0],    PV_setProfile=s[1];
  s=useState(true);  var PV_loading=s[0],    PV_setLoading=s[1];
  s=useState("");    var PV_dn=s[0],         PV_setDn=s[1];
  s=useState("");    var PV_un=s[0],         PV_setUn=s[1];
  s=useState(false); var PV_saveLoading=s[0],PV_setSaveLoading=s[1];
  s=useState(false); var PV_saveOk=s[0],    PV_setSaveOk=s[1];
  s=useState("");    var PV_saveErr=s[0],    PV_setSaveErr=s[1];
  s=useState("");    var PV_pw1=s[0],        PV_setPw1=s[1];
  s=useState("");    var PV_pw2=s[0],        PV_setPw2=s[1];
  s=useState(false); var PV_pwLoading=s[0],  PV_setPwLoading=s[1];
  s=useState(false); var PV_pwOk=s[0],       PV_setPwOk=s[1];
  s=useState("");    var PV_pwErr=s[0],       PV_setPwErr=s[1];
  s=useState(0);     var PV_credits=s[0],     PV_setCredits=s[1];

  // Fetch profile from public.profiles on mount
  useEffect(function(){
    if(!user||!window.ECEPT_SUPABASE){ PV_setLoading(false); return; }
    window.ECEPT_SUPABASE
      .from("profiles")
      .select("display_name,username,role,credits")
      .eq("id",user.id)
      .single()
      .then(function(res){
        PV_setLoading(false);
        if(res&&res.data){
          PV_setProfile(res.data);
          PV_setDn(res.data.display_name||"");
          PV_setUn(res.data.username||"");
          PV_setCredits(typeof res.data.credits==="number"?res.data.credits:0);
        } else {
          var meta=user.user_metadata||{};
          PV_setDn(meta.display_name||"");
          PV_setUn(meta.username||(user.email?user.email.split("@")[0]:""));
        }
      })
      .catch(function(){
        PV_setLoading(false);
        var meta=user.user_metadata||{};
        PV_setDn(meta.display_name||"");
        PV_setUn(meta.username||(user.email?user.email.split("@")[0]:""));
      });
  },[]);

  function PV_handleSave(){
    if(PV_saveLoading) return;
    if(!PV_dn.trim()){ PV_setSaveErr("El nombre no puede estar vacío."); return; }
    if(!PV_un.trim()){ PV_setSaveErr("El usuario no puede estar vacío."); return; }
    if(!window.ECEPT_SUPABASE){ PV_setSaveErr("Servicio no disponible."); return; }
    PV_setSaveErr(""); PV_setSaveOk(false); PV_setSaveLoading(true);
    window.ECEPT_SUPABASE
      .from("profiles")
      .update({display_name:PV_dn.trim(),username:PV_un.trim()})
      .eq("id",user.id)
      .then(function(res){
        PV_setSaveLoading(false);
        if(res&&res.error){ PV_setSaveErr("No se pudieron guardar los cambios."); return; }
        PV_setSaveOk(true);
        PV_setProfile(function(prev){
          if(!prev) return prev;
          return {display_name:PV_dn.trim(),username:PV_un.trim(),role:prev.role,credits:prev.credits};
        });
      })
      .catch(function(){ PV_setSaveLoading(false); PV_setSaveErr("Error de conexión. Intenta de nuevo."); });
  }

  function PV_handlePassword(){
    if(PV_pwLoading) return;
    if(!PV_pw1){ PV_setPwErr("Ingresá la nueva contraseña."); return; }
    if(PV_pw1.length<6){ PV_setPwErr("La contraseña debe tener al menos 6 caracteres."); return; }
    if(PV_pw1!==PV_pw2){ PV_setPwErr("Las contraseñas no coinciden."); return; }
    if(!window.ECEPT_SUPABASE){ PV_setPwErr("Servicio no disponible."); return; }
    PV_setPwErr(""); PV_setPwOk(false); PV_setPwLoading(true);
    window.ECEPT_SUPABASE.auth.updateUser({password:PV_pw1})
      .then(function(res){
        PV_setPwLoading(false);
        if(res&&res.error){ PV_setPwErr("No se pudo cambiar la contraseña."); return; }
        PV_setPwOk(true); PV_setPw1(""); PV_setPw2("");
      })
      .catch(function(){ PV_setPwLoading(false); PV_setPwErr("Error de conexión. Intenta de nuevo."); });
  }

  // ── Derived values ──
  var meta = user ? (user.user_metadata||{}) : {};
  var role = (PV_profile&&PV_profile.role) ? PV_profile.role : "student";
  var displayName = PV_dn || meta.display_name || (user&&user.email ? user.email.split("@")[0] : "Usuario");
  var initial = displayName ? displayName.charAt(0).toUpperCase() : "?";
  var email = user ? (user.email||"") : "";
  var isEmailProvider = !!(user&&user.app_metadata&&user.app_metadata.provider==="email");

  // ── Shared styles ──
  var inputStyle = {
    width:"100%", padding:"12px 14px", minHeight:"44px",
    borderRadius:"10px", border:"1px solid "+C.bd,
    background:C.bg, color:C.tx, fontSize:"14px",
    outline:"none", boxSizing:"border-box"
  };
  var labelStyle = {
    display:"block", color:C.mt, fontSize:"12px",
    fontWeight:600, marginBottom:"6px"
  };
  var cardStyle = {
    background:C.cd, border:"1px solid "+C.bd,
    borderRadius:"14px", padding:"16px", marginBottom:"14px"
  };
  var cardTitleStyle = {
    fontSize:"11px", fontWeight:700, color:C.dm,
    textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:"14px"
  };
  var errBoxStyle = {
    color:"#fca5a5", background:"rgba(239,68,68,.12)",
    border:"1px solid rgba(239,68,68,.35)", borderRadius:"10px",
    padding:"10px 12px", fontSize:"13px", lineHeight:1.4, marginBottom:"12px"
  };
  var okBoxStyle = {
    color:"#34d399", background:"rgba(52,211,153,.10)",
    border:"1px solid rgba(52,211,153,.30)", borderRadius:"10px",
    padding:"10px 12px", fontSize:"13px", marginBottom:"12px"
  };

  function PV_roleBadge(r){
    var label = r==="premium"?"Premium ⭐":r==="admin"?"Admin 🔧":"Plan Gratuito";
    var bg    = r==="premium"?"rgba(251,191,36,.15)":r==="admin"?"rgba(96,165,250,.15)":"rgba(255,255,255,.08)";
    var col   = r==="premium"?"#fbbf24":r==="admin"?"#60a5fa":C.mt;
    return e("span",{style:{
      display:"inline-block", padding:"3px 12px", borderRadius:"999px",
      background:bg, color:col, fontSize:"11px", fontWeight:700
    }},label);
  }

  function PV_submitBtn(label,loadLabel,loading,onClick){
    return e("button",{
      onClick:onClick, disabled:loading,
      style:{
        width:"100%", minHeight:"44px", padding:"12px 14px",
        borderRadius:"10px", background:loading?C.bd:"#3b82f6",
        color:"#fff", border:"none",
        cursor:loading?"default":"pointer",
        fontSize:"14px", fontWeight:700
      }
    }, loading?loadLabel:label);
  }

  return e("div",{style:{maxWidth:"540px",margin:"0 auto",padding:"20px 16px 80px"}},

    // ── Back + title ──
    e("div",{style:{display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px"}},
      e("button",{
        onClick:props.onBack,
        style:{
          background:"none", border:"none", color:C.mt,
          fontSize:"20px", cursor:"pointer",
          minWidth:"44px", minHeight:"44px",
          display:"flex", alignItems:"center", justifyContent:"center",
          borderRadius:"10px"
        }
      },"←"),
      e("div",{style:{fontSize:"18px",fontWeight:700,color:C.tx}},"Mi perfil")
    ),

    // ── 1. HEADER: avatar + name + email + role ──
    e("div",{style:{
      background:C.cd, border:"1px solid "+C.bd, borderRadius:"14px",
      padding:"24px 16px 20px", marginBottom:"14px", textAlign:"center"
    }},
      e("div",{style:{
        width:"56px", height:"56px", borderRadius:"50%",
        background:"linear-gradient(135deg,#60a5fa,#a78bfa)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:"22px", fontWeight:700, color:"#fff",
        margin:"0 auto 12px"
      }},initial),
      e("div",{style:{fontSize:"16px",fontWeight:700,color:C.tx,marginBottom:"4px"}},displayName),
      e("div",{style:{fontSize:"12px",color:C.dm,marginBottom:"10px"}},email),
      PV_roleBadge(role)
    ),

    // ── 2. EDIT PROFILE card ──
    PV_loading
      ? e("div",{style:{textAlign:"center",padding:"20px",color:C.dm,fontSize:"13px"}},"Cargando perfil...")
      : e("div",{style:cardStyle},
          e("div",{style:cardTitleStyle},"Editar perfil"),
          e("div",{style:{marginBottom:"12px"}},
            e("label",{style:labelStyle,htmlFor:"PV_dn"},"Nombre"),
            e("input",{
              id:"PV_dn", type:"text", value:PV_dn,
              onChange:function(ev){PV_setDn(ev.target.value);PV_setSaveOk(false);PV_setSaveErr("");},
              placeholder:"Tu nombre", autoComplete:"name",
              disabled:PV_saveLoading, style:inputStyle
            })
          ),
          e("div",{style:{marginBottom:"14px"}},
            e("label",{style:labelStyle,htmlFor:"PV_un"},"Usuario"),
            e("input",{
              id:"PV_un", type:"text", value:PV_un,
              onChange:function(ev){PV_setUn(ev.target.value);PV_setSaveOk(false);PV_setSaveErr("");},
              placeholder:"tu_usuario", autoComplete:"username",
              disabled:PV_saveLoading, style:inputStyle
            })
          ),
          PV_saveErr&&e("div",{role:"alert",style:errBoxStyle},PV_saveErr),
          PV_saveOk&&e("div",{style:okBoxStyle},"Cambios guardados ✓"),
          PV_submitBtn("Guardar cambios","Guardando...",PV_saveLoading,PV_handleSave)
        ),

    // ── 3. CHANGE PASSWORD card (email provider only) ──
    isEmailProvider&&e("div",{style:cardStyle},
      e("div",{style:cardTitleStyle},"Cambiar contraseña"),
      e("div",{style:{marginBottom:"12px"}},
        e("label",{style:labelStyle,htmlFor:"PV_pw1"},"Nueva contraseña"),
        e("input",{
          id:"PV_pw1", type:"password", value:PV_pw1,
          onChange:function(ev){PV_setPw1(ev.target.value);PV_setPwOk(false);PV_setPwErr("");},
          placeholder:"Mínimo 6 caracteres", autoComplete:"new-password",
          disabled:PV_pwLoading, style:inputStyle
        })
      ),
      e("div",{style:{marginBottom:"14px"}},
        e("label",{style:labelStyle,htmlFor:"PV_pw2"},"Confirmar contraseña"),
        e("input",{
          id:"PV_pw2", type:"password", value:PV_pw2,
          onChange:function(ev){PV_setPw2(ev.target.value);PV_setPwOk(false);PV_setPwErr("");},
          placeholder:"Repetí la contraseña", autoComplete:"new-password",
          disabled:PV_pwLoading, style:inputStyle
        })
      ),
      PV_pwErr&&e("div",{role:"alert",style:errBoxStyle},PV_pwErr),
      PV_pwOk&&e("div",{style:okBoxStyle},"Contraseña actualizada ✓"),
      PV_submitBtn("Cambiar contraseña","Cambiando...",PV_pwLoading,PV_handlePassword)
    ),

    // ── 4. PLAN card ──
    e("div",{style:cardStyle},
      e("div",{style:cardTitleStyle},"Tu plan"),
      e("div",{style:{display:"flex",alignItems:"center",gap:"14px"}},
        e("div",{style:{fontSize:"30px"}},role==="admin"?"🔧":role==="premium"?"⭐":"📚"),
        e("div",null,
          e("div",{style:{fontWeight:700,color:C.tx,fontSize:"14px",marginBottom:"4px"}},
            role==="admin"?"Admin":role==="premium"?"Premium":"Plan Gratuito"
          ),
          role==="student"
            ? e("div",{style:{fontSize:"12px",color:C.dm,lineHeight:1.5}},"Próximamente podrás actualizar a Premium")
            : e("div",{style:{fontSize:"12px",color:"#34d399"}},"Plan activo ✓"),
          e("div",{style:{
            display:"inline-block",
            marginTop:"8px",
            padding:"3px 10px",
            borderRadius:"999px",
            background:"rgba(96,165,250,.12)",
            color:"#60a5fa",
            fontSize:"11px",
            fontWeight:700
          }},"Créditos disponibles: "+PV_credits)
        )
      )
    )
  );
}

window.ProfileView = ProfileView;
