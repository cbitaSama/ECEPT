// ══════════════════════════════════════════════════════════════
// COMPONENTES HELPER
// ══════════════════════════════════════════════════════════════
function Ls(props){return e("div",{style:{display:"flex",flexDirection:"column",gap:"8px",marginTop:"6px"}},(props.items||[]).filter(Boolean).map(function(it,i){return e("div",{key:i,style:{display:"flex",gap:"10px",alignItems:"flex-start",lineHeight:1.6}},e("span",{style:{color:props.color||C.mt,flexShrink:0,marginTop:"8px",width:"5px",height:"5px",borderRadius:"50%",background:props.color||C.mt}}),e("span",{style:{color:C.tx,fontSize:"13px"}},it))}))}
// Link badge component for cross-navigation
function LinkBadge(props){
  return e("span",{onClick:function(ev){ev.stopPropagation();props.go(LINKS[props.to].vista)},style:{
    display:"inline-flex",alignItems:"center",gap:"5px",padding:"4px 10px",
    borderRadius:"8px",fontSize:"11px",fontWeight:600,cursor:"pointer",
    background:"rgba(59,130,246,.06)",border:"1px solid rgba(59,130,246,.15)",
    color:C.ac,transition:"all .15s",marginTop:props.block?"8px":"0",
    marginRight:"4px"
  }},"📎 ",LINKS[props.to]?LINKS[props.to].label:props.to)
}

var cb={background:C.cd,border:"1px solid "+C.bd,borderRadius:"14px",padding:"20px",marginBottom:"16px"};
