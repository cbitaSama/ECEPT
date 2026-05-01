// ══════════════════════════════════════════════════════════════
// USER MENU — sidebar session widget
// ──────────────────────────────────────────────────────────────
// ES5 estricto: solo declaraciones var y function. Nada de ES6+.
// React.createElement vía el alias global `e`. Sin JSX.
// Props: user (null | Supabase user), onLoginClick, onLogout
// ══════════════════════════════════════════════════════════════
function UserMenu(props){
  var user=props.user;

  function UM_displayName(){
    if(!user) return "";
    if(user.user_metadata&&user.user_metadata.display_name) return user.user_metadata.display_name;
    if(user.email) return user.email.split("@")[0];
    return "Usuario";
  }

  function UM_handleLogout(){
    if(window.ECEPT_SUPABASE){
      try{ window.ECEPT_SUPABASE.auth.signOut(); }catch(e2){ console.error('[ECEPT] signOut failed:',e2); }
    }
    if(typeof props.onLogout==="function") props.onLogout();
  }

  var name=UM_displayName();
  var initial=name?name.charAt(0).toUpperCase():"?";

  return e("div",{
    style:{
      marginBottom:"16px",
      paddingBottom:"14px",
      borderBottom:"1px solid "+C.bd
    }
  },
    user
      ? e("div",{style:{display:"flex",alignItems:"center",gap:"10px"}},
          // Avatar circle
          e("div",{style:{
            width:"34px",height:"34px",flexShrink:0,
            borderRadius:"50%",
            background:"linear-gradient(135deg,"+C.ac+","+C.tt+")",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:"14px",fontWeight:700,color:"#fff"
          }},initial),
          // Name + status
          e("div",{style:{flex:1,overflow:"hidden"}},
            e("div",{style:{
              fontSize:"13px",fontWeight:600,color:C.tx,
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"
            }},name),
            e("div",{style:{fontSize:"10px",color:C.dm,marginTop:"1px"}},"Conectado")
          ),
          // Logout button
          e("button",{
            onClick:UM_handleLogout,
            title:"Cerrar sesión",
            style:{
              background:"none",
              border:"1px solid "+C.bd,
              borderRadius:"8px",
              color:C.mt,
              fontSize:"11px",fontWeight:600,
              cursor:"pointer",
              minWidth:"44px",minHeight:"44px",
              padding:"6px 10px",
              flexShrink:0,
              whiteSpace:"nowrap"
            }
          },"Salir")
        )
      : e("button",{
          onClick:props.onLoginClick,
          style:{
            width:"100%",
            minHeight:"44px",
            padding:"10px 14px",
            borderRadius:"10px",
            background:"rgba(59,130,246,.1)",
            border:"1px solid rgba(59,130,246,.25)",
            color:C.ac2,
            fontSize:"13px",fontWeight:700,
            cursor:"pointer",
            textAlign:"center",
            boxSizing:"border-box"
          }
        },"Iniciar sesión / Registrarse")
  );
}

window.UserMenu = UserMenu;
