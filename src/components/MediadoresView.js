// ══════════════════════════════════════════════════════════════
// COMPONENT: MediadoresView — Generalidades inflammation mediators
// ══════════════════════════════════════════════════════════════

function MediadoresHeader(){
  return e("div",{style:{textAlign:"center",marginBottom:"22px"}},
    e("div",{style:{fontSize:"44px",marginBottom:"4px"}},"🔥"),
    e("h1",{style:{fontFamily:"'Playfair Display',serif",fontSize:"26px",fontWeight:900,
      background:"linear-gradient(135deg,#ef4444 0%,#f472b6 50%,#a78bfa 100%)",
      WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"-0.5px"}},
      "Mediadores de la Inflamación"),
    e("p",{style:{color:C.dm,fontSize:"12px",letterSpacing:"1px",textTransform:"uppercase",marginTop:"4px"}},
      "Citocinas · Eicosanoides · Complemento · Quininas"),
    e("div",{style:{marginTop:"10px",display:"inline-flex",gap:"6px",padding:"5px 14px",
      background:"rgba(59,130,246,.08)",borderRadius:"20px",border:"1px solid rgba(59,130,246,.18)"}},
      e("span",{style:{fontSize:"10px",color:C.ac,fontWeight:700,letterSpacing:"1.5px"}},
        MED_LIST.length+" MEDIADORES · "+MED_FAMILIES.length+" FAMILIAS"))
  );
}

function MediadoresLegend(){
  return e("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px",justifyContent:"center",marginBottom:"18px"}},
    Object.keys(MED_ROLES).map(function(k){
      var r=MED_ROLES[k];
      return e("div",{key:k,style:{display:"inline-flex",alignItems:"center",gap:"5px",padding:"4px 10px",
        background:r.bg,border:"1px solid "+r.bd,borderRadius:"12px",fontSize:"10px",fontWeight:600,color:r.c}},
        e("span",null,r.i),
        e("span",null,r.l))
    })
  );
}

function MediadoresFamilyTabs(props){
  return e("div",{style:{display:"flex",gap:"6px",overflowX:"auto",paddingBottom:"8px",marginBottom:"14px",
    scrollbarWidth:"thin"}},
    [{id:"all",n:"Todos",i:"⚪",c:C.ac}].concat(MED_FAMILIES).map(function(f){
      var active=props.active===f.id;
      var count=f.id==="all"?MED_LIST.length:MED_LIST.filter(function(m){return m.fam===f.id}).length;
      return e("button",{key:f.id,onClick:function(){props.set(f.id)},
        style:{padding:"9px 14px",borderRadius:"11px",whiteSpace:"nowrap",
          background:active?f.c+"18":C.cd,
          border:"1px solid "+(active?f.c+"55":C.bd),
          color:active?f.c:C.mt,fontSize:"12px",fontWeight:700,
          display:"flex",alignItems:"center",gap:"6px",transition:"all .2s",flexShrink:0,
          cursor:"pointer",fontFamily:"inherit"}},
        e("span",{style:{fontSize:"14px"}},f.i),
        e("span",null,f.n),
        e("span",{style:{padding:"1px 6px",borderRadius:"6px",fontSize:"9px",fontWeight:800,
          background:active?f.c+"25":"rgba(255,255,255,.04)",color:active?f.c:C.dm}},count))
    })
  );
}

function MediadoresRoleFilter(props){
  var roleKeys=Object.keys(MED_ROLES);
  var filters=[{id:"all",l:"Todos los roles",c:C.mt}];
  for(var rk=0;rk<roleKeys.length;rk++){
    var k=roleKeys[rk];
    filters.push({id:k,l:MED_ROLES[k].l,c:MED_ROLES[k].c,i:MED_ROLES[k].i});
  }
  return e("div",{style:{display:"flex",gap:"5px",flexWrap:"wrap",marginBottom:"18px"}},
    filters.map(function(rf){
      var active=props.active===rf.id;
      return e("button",{key:rf.id,onClick:function(){props.set(rf.id)},
        style:{padding:"6px 10px",borderRadius:"8px",
          background:active?rf.c+"15":"transparent",
          border:"1px solid "+(active?rf.c+"40":C.bd),
          color:active?rf.c:C.dm,fontSize:"10.5px",fontWeight:600,
          display:"inline-flex",alignItems:"center",gap:"4px",transition:"all .15s",
          cursor:"pointer",fontFamily:"inherit"}},
        rf.i&&e("span",null,rf.i),
        e("span",null,rf.l))
    })
  );
}

function MediadoresSearchBar(props){
  return e("div",{style:{position:"relative",marginBottom:"14px"}},
    e("input",{value:props.q,onChange:function(ev){props.set(ev.target.value)},
      placeholder:"Buscar mediador, función, fármaco...",
      style:{width:"100%",padding:"11px 14px 11px 38px",background:C.cd,border:"1px solid "+C.bd,
        borderRadius:"11px",color:C.tx,fontSize:"13px",outline:"none",fontFamily:"inherit"}}),
    e("span",{style:{position:"absolute",left:"13px",top:"50%",transform:"translateY(-50%)",
      fontSize:"14px",opacity:.6}},"🔎")
  );
}

function MediatorCard(props){
  var m=props.m,role=MED_ROLES[m.r];
  var fam=MED_FAMILIES.filter(function(f){return f.id===m.fam})[0];
  var open=props.open;
  return e("div",{onClick:props.toggle,
    className:"fade",
    style:{background:C.cd,border:"1px solid "+(open?role.bd.replace(".25",".5"):C.bd),
      borderRadius:"14px",marginBottom:"10px",overflow:"hidden",cursor:"pointer",
      borderLeft:"3px solid "+role.c,transition:"border-color .2s"}},
    e("div",{style:{padding:"14px 16px",display:"flex",alignItems:"center",gap:"12px"}},
      e("div",{style:{flexShrink:0,width:"38px",height:"38px",borderRadius:"10px",
        background:role.bg,border:"1px solid "+role.bd,
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px"}},role.i),
      e("div",{style:{flex:1,minWidth:0}},
        e("div",{style:{display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap",marginBottom:"2px"}},
          e("h3",{style:{fontSize:"15px",fontWeight:700,color:C.tx,fontFamily:"'DM Sans',sans-serif"}},m.n),
          e("span",{style:{fontSize:"9px",padding:"1px 6px",borderRadius:"5px",
            background:fam.c+"15",color:fam.c,fontWeight:700,letterSpacing:".5px"}},fam.n.split(" ")[0].toUpperCase())
        ),
        e("p",{style:{fontSize:"11.5px",color:C.mt,lineHeight:1.4,
          overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",
          WebkitLineClamp:open?10:2,WebkitBoxOrient:"vertical"}},m.f)
      ),
      e("span",{style:{fontSize:"11px",color:role.c,transform:open?"rotate(180deg)":"none",
        transition:"transform .25s",flexShrink:0}},"▼")
    ),
    open&&e("div",{className:"fade",style:{borderTop:"1px solid "+C.bd,padding:"14px 16px",
      background:"rgba(0,0,0,.15)"}},
      e("div",{style:{marginBottom:"12px"}},
        e("div",{style:{fontSize:"9px",fontWeight:800,color:C.dm,letterSpacing:"1.5px",
          textTransform:"uppercase",marginBottom:"4px"}},"📍 Origen"),
        e("p",{style:{fontSize:"12.5px",color:C.tx,lineHeight:1.5}},m.o)
      ),
      m.k&&m.k.length>0&&e("div",{style:{marginBottom:m.t||m.p?"12px":0}},
        e("div",{style:{fontSize:"9px",fontWeight:800,color:C.dm,letterSpacing:"1.5px",
          textTransform:"uppercase",marginBottom:"6px"}},"🎯 Puntos clave"),
        e("div",{style:{display:"flex",flexDirection:"column",gap:"6px"}},
          m.k.map(function(kp,ki){
            return e("div",{key:ki,style:{display:"flex",gap:"8px",alignItems:"flex-start",
              fontSize:"12.5px",color:C.tx,lineHeight:1.55,
              animation:"slideRight .3s ease-out backwards",animationDelay:(ki*60)+"ms"}},
              e("span",{style:{color:role.c,flexShrink:0,fontWeight:700,marginTop:"1px"}},"▸"),
              e("span",{dangerouslySetInnerHTML:{__html:kp.replace(/\*\*(.+?)\*\*/g,'<strong style="color:'+role.c+'">$1</strong>')}}))
          })
        )
      ),
      m.t&&e("div",{style:{marginBottom:m.p?"12px":0,padding:"10px 12px",
        background:"rgba(59,130,246,.06)",borderLeft:"2px solid "+C.ac,borderRadius:"0 8px 8px 0"}},
        e("div",{style:{fontSize:"9px",fontWeight:800,color:C.ac,letterSpacing:"1.5px",
          textTransform:"uppercase",marginBottom:"4px"}},"💊 Farmacología"),
        e("p",{style:{fontSize:"12px",color:C.tx,lineHeight:1.55}},m.t)
      ),
      m.p&&e("div",{style:{padding:"10px 12px",background:"rgba(251,191,36,.06)",
        borderLeft:"2px solid #fbbf24",borderRadius:"0 8px 8px 0"}},
        e("div",{style:{fontSize:"9px",fontWeight:800,color:"#fbbf24",letterSpacing:"1.5px",
          textTransform:"uppercase",marginBottom:"4px"}},"💎 Perla"),
        e("p",{style:{fontSize:"12px",color:C.tx,lineHeight:1.55,fontStyle:"italic"}},m.p)
      )
    )
  );
}

function MediadoresRelationsPanel(){
  var _u=useState(false),show=_u[0],setShow=_u[1];
  return e("div",{style:{marginBottom:"18px"}},
    e("button",{onClick:function(){setShow(!show)},
      style:{width:"100%",padding:"12px 14px",background:C.cd,border:"1px solid "+C.bd,
        borderRadius:"11px",display:"flex",alignItems:"center",justifyContent:"space-between",
        color:C.tx,fontWeight:600,fontSize:"13px",cursor:"pointer",fontFamily:"inherit"}},
      e("span",{style:{display:"flex",alignItems:"center",gap:"8px"}},
        e("span",{style:{fontSize:"16px"}},"🔗"),
        e("span",null,"Red de interacciones clave")),
      e("span",{style:{fontSize:"10px",color:C.dm,transform:show?"rotate(180deg)":"none",transition:"transform .2s"}},"▼")
    ),
    show&&e("div",{className:"fade",style:{marginTop:"8px",padding:"14px",background:C.cd,
      border:"1px solid "+C.bd,borderRadius:"11px"}},
      MED_RELATIONS.map(function(r,ri){
        return e("div",{key:ri,style:{padding:"10px 0",borderBottom:ri<MED_RELATIONS.length-1?"1px dashed "+C.bd:"none"}},
          e("div",{style:{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap",fontSize:"12px"}},
            e("span",{style:{padding:"3px 8px",borderRadius:"6px",background:r.color+"15",
              color:r.color,fontWeight:700,fontSize:"11px"}},r.from),
            e("span",{style:{color:r.color,fontWeight:600,fontSize:"10.5px",fontStyle:"italic"}},
              "— "+r.label+" →"),
            r.to.map(function(t,ti){
              return e("span",{key:ti,style:{padding:"3px 8px",borderRadius:"6px",
                background:"rgba(255,255,255,.04)",color:C.mt,fontWeight:600,fontSize:"11px"}},t)
            })
          )
        )
      })
    )
  );
}

function MediadoresQuickFacts(){
  var facts=[
    {t:"Triada pirógena",v:"IL-1 + IL-6 + TNF-α",c:"#ef4444"},
    {t:"PCR la induce",v:"IL-6 (por eso sube en inflamación)",c:"#f472b6"},
    {t:"IL-4 suprime",v:"IL-6 e IL-11",c:"#34d399"},
    {t:"Antiinflamatorias",v:"IL-4, IL-10, TGF-β",c:"#34d399"},
    {t:"Asma — mediador clave",v:"Leucotrienos (LTC₄/D₄/E₄)",c:"#a78bfa"},
    {t:"Angioedema hereditario",v:"Déficit de C1-inhibidor",c:"#22d3ee"},
    {t:"MAC deficit → infección por",v:"Neisseria (meningitis, GC)",c:"#fbbf24"},
    {t:"Tos por IECA",v:"Bradicinina acumulada",c:"#e879f9"}
  ];
  return e("div",{style:{marginBottom:"18px"}},
    e("div",{style:{fontSize:"10px",fontWeight:800,color:C.dm,letterSpacing:"2px",
      textTransform:"uppercase",marginBottom:"8px",paddingLeft:"4px"}},"⚡ Datos fulminantes"),
    e("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px"}},
      facts.map(function(f,fi){
        return e("div",{key:fi,style:{padding:"10px 12px",background:C.cd,
          border:"1px solid "+C.bd,borderRadius:"10px",borderLeft:"2px solid "+f.c}},
          e("div",{style:{fontSize:"9px",color:f.c,fontWeight:700,letterSpacing:".5px",
            textTransform:"uppercase",marginBottom:"3px"}},f.t),
          e("div",{style:{fontSize:"11.5px",color:C.tx,fontWeight:600,lineHeight:1.3}},f.v)
        )
      })
    )
  );
}

function MediadoresView(){
  var _f=useState("all"),fam=_f[0],setFam=_f[1];
  var _r=useState("all"),rol=_r[0],setRol=_r[1];
  var _q=useState(""),q=_q[0],setQ=_q[1];
  var _o=useState(null),open=_o[0],setOpen=_o[1];

  useEffect(function(){
    window._medFocus=function(subId){setFam(subId);setOpen(null);try{window.scrollTo({top:0,behavior:'smooth'});}catch(e2){}};
    return function(){window._medFocus=null;};
  },[]);

  var filtered=useMemo(function(){
    var l=q.toLowerCase();
    return MED_LIST.filter(function(m){
      if(fam!=="all"&&m.fam!==fam) return false;
      if(rol!=="all"&&m.r!==rol) return false;
      if(!l) return true;
      var hay=(m.n+" "+m.f+" "+m.o+" "+(m.t||"")+" "+(m.p||"")+" "+(m.k||[]).join(" ")).toLowerCase();
      return hay.indexOf(l)>-1;
    });
  },[fam,rol,q]);

  var familyDesc=fam==="all"?null:MED_FAMILIES.filter(function(f){return f.id===fam})[0];

  return e("div",{style:{maxWidth:"720px",margin:"0 auto",paddingBottom:"40px"}},
    e(MediadoresHeader,null),
    e(MediadoresLegend,null),
    e(MediadoresSearchBar,{q:q,set:setQ}),
    e(MediadoresFamilyTabs,{active:fam,set:function(x){setFam(x);setOpen(null)}}),
    familyDesc&&e("div",{className:"fade",style:{padding:"11px 14px",marginBottom:"14px",
      background:familyDesc.c+"0c",border:"1px solid "+familyDesc.c+"30",borderRadius:"10px",
      display:"flex",gap:"10px",alignItems:"flex-start"}},
      e("span",{style:{fontSize:"20px",flexShrink:0}},familyDesc.i),
      e("p",{style:{fontSize:"12px",color:C.mt,lineHeight:1.5}},familyDesc.d)),
    e(MediadoresRoleFilter,{active:rol,set:setRol}),
    fam==="all"&&!q&&rol==="all"&&e(MediadoresQuickFacts,null),
    fam==="all"&&!q&&rol==="all"&&e(MediadoresRelationsPanel,null),
    e("div",{style:{fontSize:"10px",color:C.dm,fontWeight:700,letterSpacing:"1.5px",
      textTransform:"uppercase",marginBottom:"10px",paddingLeft:"4px"}},
      filtered.length+" "+(filtered.length===1?"resultado":"resultados")),
    filtered.length===0?
      e("div",{style:{textAlign:"center",padding:"40px 20px",color:C.dm}},
        e("div",{style:{fontSize:"32px",marginBottom:"8px",opacity:.4}},"🔍"),
        e("p",{style:{fontSize:"13px"}},"Sin resultados. Probá otro filtro o término.")):
      filtered.map(function(m){
        return e(MediatorCard,{key:m.id,m:m,open:open===m.id,
          toggle:function(){setOpen(open===m.id?null:m.id)}})
      })
  );
}
