// ══════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ══════════════════════════════════════════════════════════════
function App(){
  // ─── STATE (compacted via useState alias _) ───
  // vista: current view id. cs/cd: selected section/disease ids. tab/qm/qa: quiz state.
  // sb/sbExp/sbSub: sidebar open + expanded item + nested submenu.
  // abdOpen/abdExp: abdomen-agudo accordion state (reused by labs, epid estudios).
  // et: expanded triada/pirámide index. an: fade-in animation flag.
  // vi (localStorage "ecept_v1"): reviewed-disease ids. favs: favorited disease ids.
  var _=useState;
  var s=_("home");var vista=s[0],setVista=s[1];
  s=_("");var sq=s[0],setSq=s[1]; s=_(false);var so=s[0],setSo=s[1];
  s=_(null);var cs=s[0],setCs=s[1]; s=_(null);var cd=s[0],setCd=s[1];
  s=_(0);var tab=s[0],setTab=s[1]; s=_(false);var qm=s[0],setQm=s[1];
  s=_({});var qa=s[0],setQa=s[1]; s=_(false);var sb=s[0],setSb=s[1];
  s=_(true);var an=s[0],setAn=s[1]; s=_(null);var et=s[0],setEt=s[1];
  s=_(null);var abdOpen=s[0],setAbdOpen=s[1]; s=_({});var abdExp=s[0],setAbdExp=s[1];
  s=_(0);var ingTab=s[0],setIngTab=s[1];
  s=_(0);var calcPeso=s[0],setCalcPeso=s[1]; s=_(0);var calcSCQ=s[0],setCalcSCQ=s[1];
  s=_(0);var calcGotas=s[0],setCalcGotas=s[1]; s=_(null);var sbExp=s[0],setSbExp=s[1]; s=_(null);var sbSub=s[0],setSbSub=s[1];
  s=_([]);var favs=s[0],setFavs=s[1];
  s=_(null);var ecuUser=s[0],setEcuUser=s[1];
  s=_(false);var ecuShowAuth=s[0],setEcuShowAuth=s[1];
  s=_(0);var streak=s[0],setStreak=s[1]; s=_(0);var bestStreak=s[0],setBestStreak=s[1]; s=_(0);var calcHoras=s[0],setCalcHoras=s[1];
  s=_(function(){try{return JSON.parse(localStorage.getItem("ecept_v1")||"[]")}catch(e2){return[]}});
  var vi=s[0],setVi=s[1];
  useEffect(function(){try{localStorage.setItem("ecept_v1",JSON.stringify(vi))}catch(e2){}},[vi]);

  // ─── AUTH SESSION ─── restore on mount + keep in sync via onAuthStateChange
  useEffect(function(){
    if(!window.ECEPT_SUPABASE) return;
    try{
      window.ECEPT_SUPABASE.auth.getSession().then(function(res){
        if(res&&res.data&&res.data.session) setEcuUser(res.data.session.user||null);
      }).catch(function(){});
      var authListener=window.ECEPT_SUPABASE.auth.onAuthStateChange(function(event,session){
        setEcuUser(session&&session.user?session.user:null);
      });
      return function(){
        try{
          if(authListener&&authListener.data&&authListener.data.subscription){
            authListener.data.subscription.unsubscribe();
          }
        }catch(e3){}
      };
    }catch(e2){ console.error('[ECEPT] auth session hook failed:',e2); }
  },[]);

  // ─── NAVIGATION ─── back-button history stack
  s=_([]); var hist=s[0],setHist=s[1];
  // Salud Mental internal-view mirror: SaludMentalView calls onViewChange(v,extra)
  // every time its internal view changes. ECEPT uses smView (string id) to
  // render the deeper breadcrumb so the module can stay chrome-free internally.
  // When v is a leaf route ("disease" or "section"), extra = {name, parent}
  // so the crumb shows the parent hub + the leaf name (e.g.
  // "Neurosis › Ansiedad › Trastorno de pánico" or "Psiquiatría › Flashcards").
  s=_("root"); var smView=s[0],setSmView=s[1];
  s=_(null); var smLeaf=s[0],setSmLeaf=s[1];
  var onSmViewChange=useCallback(function(v,extra){
    setSmView(v);
    setSmLeaf(extra&&extra.name?{name:extra.name,parent:extra.parent}:null);
  },[]);

  // Native trauma view back-handler ref + widget registry
  var traumaBackRef=useRef(null);
  var traumaWidgets={glasgow:GlasgowCalculator,hemorrhage:HemorrhageCalculator,ett:ETTSelector,abcdefg:ABCDEFGAccordion,lethal:LethalLesionsGrid,anat_pts:PuntosAnatomicos};
  // Salud Mental back-handler ref (FAB ← defers to SM's internal stack first).
  var smBackRef=useRef(null);

  var go=useCallback(function(x,sc,dc){
    setAn(false);
    setTimeout(function(){
      setHist(function(h){return h.concat([{v:vista,cs:cs,cd:cd}])});
      setVista(x);setCs(sc||null);setCd(dc||null);setTab(0);setQm(false);setQa({});setEt(null);setAbdOpen(null);setAbdExp({});setIngTab(0);setAn(true);
      if(dc&&vi.indexOf(dc)===-1)setVi(function(p){return p.concat([dc])});
      window.scrollTo(0,0);
    },120);
  },[vista,cs,cd,vi]);
  // Expose go() to ChatBot (and any other window-scoped caller).
  useEffect(function(){ window.CB_go=go; },[go]);

  var goBack=useCallback(function(){
    if(hist.length>0){
      var prev=hist[hist.length-1];
      setHist(function(h){return h.slice(0,-1)});
      setAn(false);
      setTimeout(function(){
        setVista(prev.v);setCs(prev.cs);setCd(prev.cd);setTab(0);setQm(false);setQa({});setEt(null);setAn(true);
        window.scrollTo(0,0);
      },120);
    }
  },[hist]);

  var handleBack=useCallback(function(){
    if(vista==="trauma-u1"){
      if(traumaBackRef.current&&traumaBackRef.current()) return;
    }
    if(vista==="salud_mental"){
      if(smBackRef.current&&smBackRef.current()) return;
    }
    goBack();
  },[vista,goBack]);

  // ─── DERIVED (memos + derived values) ───
  var toggleFav=useCallback(function(id){setFavs(function(prev){return prev.indexOf(id)>-1?prev.filter(function(x){return x!==id}):prev.concat([id])});},[]);
  var isFav=useCallback(function(id){return favs.indexOf(id)>-1},[favs]);
  var dis=useMemo(function(){return cd?RD.find(function(x){return x.id===cd}):null},[cd]);
  var sd=useMemo(function(){return cs?RD.filter(function(x){return x.s===cs}):[]},[cs]);
  var sr=useMemo(function(){return globalSearch(sq)},[sq]);
  var tot=RD.length,pct=Math.round(vi.length/tot*100);
  var fi={opacity:an?1:0,transform:an?"translateY(0)":"translateY(6px)",transition:"all .25s"};

  // Render subsecciones de enfermedad
  function rSub(){
    if(!dis) return null;var s2=SUB[tab],d=dis;
    switch(s2.k){
      case"cc":return e(F,null,e("p",{style:{color:C.tx,lineHeight:1.7,marginBottom:"16px",fontSize:"14px"}},d.cc.t),d.cc.p&&d.cc.p.length>0&&e(F,null,e("h4",{style:{color:s2.c,fontSize:"13px",fontWeight:700,marginBottom:"8px",textTransform:"uppercase"}},"Puntos Clave"),e(Ls,{items:d.cc.p,color:s2.c})));
      case"dx":return e(F,null,d.dx.cr&&d.dx.cr.length>0&&e("div",{style:{overflowX:"auto"}},e("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:"13px"}},e("thead",null,e("tr",null,e("th",{style:{padding:"10px",textAlign:"left",background:"rgba(255,255,255,.04)",borderBottom:"2px solid "+C.bd,color:C.ac,fontWeight:600,fontSize:"11px"}},"Criterio"),e("th",{style:{padding:"10px",textAlign:"left",background:"rgba(255,255,255,.04)",borderBottom:"2px solid "+C.bd,color:C.ac,fontWeight:600,fontSize:"11px"}},"Detalle"))),e("tbody",null,d.dx.cr.map(function(r,i){return e("tr",{key:i,style:{borderBottom:"1px solid "+C.bd}},e("td",{style:{padding:"10px",fontWeight:600,color:C.tx,verticalAlign:"top",minWidth:"90px"}},r.c),e("td",{style:{padding:"10px",color:C.mt,lineHeight:1.6}},r.d))})))),d.dx.nt&&e("p",{style:{color:C.tx,lineHeight:1.7,marginTop:"16px",padding:"12px",background:s2.c+"08",borderRadius:"10px",borderLeft:"3px solid "+s2.c,fontSize:"13px"}},d.dx.nt),d.dx.df&&d.dx.df.length>0&&e("div",{style:{marginTop:"16px"}},e("h4",{style:{color:s2.c,fontSize:"13px",fontWeight:700,marginBottom:"8px"}},"Dx Diferencial"),e("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"}},d.dx.df.map(function(x,i){return e("span",{key:i,style:{padding:"4px 10px",borderRadius:"8px",fontSize:"11px",fontWeight:600,background:s2.c+"15",color:s2.c}},x)}))));
      case"ex":return e(F,null,d.ex.l&&d.ex.l.length>0&&e(F,null,e("h4",{style:{color:s2.c,fontSize:"13px",fontWeight:700,marginBottom:"8px"}},"Laboratorio"),e(Ls,{items:d.ex.l,color:s2.c})),d.ex.im&&e("div",{style:{marginTop:"16px"}},e("h4",{style:{color:s2.c,fontSize:"13px",fontWeight:700,marginBottom:"8px"}},"Imágenes"),e("p",{style:{color:C.mt,lineHeight:1.7,fontSize:"14px"}},d.ex.im)));
      case"tx":return e(F,null,[["Primera Línea",d.tx.p],["Segunda Línea",d.tx.q],["Biológicos",d.tx.b],["Monitoreo",d.tx.m]].filter(function(x){return x[1]}).map(function(x,i){return e("div",{key:i,style:{marginBottom:"16px"}},e("h4",{style:{color:s2.c,fontSize:"13px",fontWeight:700,marginBottom:"6px"}},x[0]),e("p",{style:{color:C.mt,lineHeight:1.7,fontSize:"14px",padding:"10px 14px",background:"rgba(255,255,255,.02)",borderRadius:"8px"}},x[1]))}));
      case"px":return e(F,null,d.px.e&&e("p",{style:{color:C.tx,lineHeight:1.7,marginBottom:"16px",fontSize:"14px"}},d.px.e),d.px.f&&d.px.f.length>0&&e(F,null,e("h4",{style:{color:"#ef4444",fontSize:"13px",fontWeight:700,marginBottom:"8px"}},"Mal Pronóstico"),e(Ls,{items:d.px.f,color:"#ef4444"})),d.px.co&&d.px.co.length>0&&e("div",{style:{marginTop:"16px"}},e("h4",{style:{color:s2.c,fontSize:"13px",fontWeight:700,marginBottom:"8px"}},"Complicaciones"),e(Ls,{items:d.px.co,color:s2.c})));
      case"pe":return e("div",{style:{display:"flex",flexDirection:"column",gap:"10px"}},(d.pe||[]).map(function(p,i){return e("div",{key:i,style:{display:"flex",gap:"12px",alignItems:"flex-start",padding:"12px 16px",background:s2.c+"08",borderRadius:"10px",borderLeft:"3px solid "+s2.c}},e("span",{style:{fontSize:"16px",flexShrink:0}},"💡"),e("span",{style:{color:C.tx,fontSize:"14px",lineHeight:1.6}},p))}));
      default:return null;
    }
  }

  // Fisiología hub — topic picker (Receptores Celulares ready; rest placeholders)
  function FisiologiaHub(){
    var topics=[
      {id:"receptores",ic:"🧬",n:"Receptores Celulares",d:"10 familias · 34 subtipos · quiz por familia",col:"#ec4899",ready:true,v:"receptores"},
      {id:"coagulacion",ic:"🩸",n:"Cascada de Coagulación",d:"Vía extrínseca, intrínseca, común · factores y reguladores",col:"#ef4444",ready:true,v:"coagulacion"},
      {id:"endo",ic:"🧪",n:"Endocrinología",d:"Hormonas, ejes, retroalimentación — Próximamente",col:"#f59e0b",ready:false},
      {id:"cardio",ic:"❤️",n:"Cardiovascular",d:"Ciclo cardíaco, hemodinamia — Próximamente",col:"#ef4444",ready:false},
      {id:"renal",ic:"💧",n:"Renal",d:"Filtración, reabsorción, equilibrio — Próximamente",col:"#06b6d4",ready:false},
      {id:"resp",ic:"🫁",n:"Respiratorio",d:"Ventilación, perfusión, gases — Próximamente",col:"#14b8a6",ready:false},
      {id:"neuro",ic:"🧠",n:"Neurofisiología",d:"Potenciales, sinapsis, reflejos — Próximamente",col:"#8b5cf6",ready:false},
      {id:"gi",ic:"🍽️",n:"Gastrointestinal",d:"Motilidad, secreción, absorción — Próximamente",col:"#84cc16",ready:false},
      {id:"hemato",ic:"🩸",n:"Hematología",d:"Hemostasia, eritropoyesis — Próximamente",col:"#dc2626",ready:false}
    ];
    var readyCount=topics.filter(function(t){return t.ready}).length;
    return e("div",null,
      e("div",{style:{marginBottom:"20px"}},
        e("h2",{style:{fontFamily:"'Playfair Display',serif",fontSize:"24px",fontWeight:800,marginBottom:"4px",color:C.tx}},"🔬 Fisiología"),
        e("p",{style:{fontSize:"13px",color:C.dm}},"Funcionamiento normal del cuerpo humano · "+readyCount+" tema"+(readyCount===1?"":"s")+" disponible"+(readyCount===1?"":"s"))
      ),
      e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"12px"}},
        topics.map(function(t){
          return e("div",{key:t.id,
            onClick:t.ready?function(){go(t.v)}:null,
            style:{
              background:C.cd,
              border:"1.5px solid "+(t.ready?t.col+"40":C.bd),
              borderRadius:"14px",padding:"18px",
              cursor:t.ready?"pointer":"default",
              opacity:t.ready?1:0.55,
              transition:"all .2s"}},
            e("div",{style:{display:"flex",alignItems:"center",gap:"12px",marginBottom:"8px"}},
              e("span",{style:{fontSize:"28px"}},t.ic),
              e("div",{style:{flex:1}},
                e("h3",{style:{fontSize:"15px",fontWeight:700,color:t.ready?t.col:C.mt,marginBottom:"2px"}},t.n),
                t.ready&&e("span",{style:{fontSize:"9px",letterSpacing:"1.5px",textTransform:"uppercase",color:"#34d399",fontWeight:700}},"✓ Disponible")
              )
            ),
            e("p",{style:{fontSize:"11.5px",color:C.dm,lineHeight:1.5}},t.d),
            t.ready&&e("div",{style:{marginTop:"10px",fontSize:"12px",color:t.col,fontWeight:600}},"Abrir →")
          )
        })
      )
    );
  }

  // ═══ RENDER ═══
  return e("div",{style:{background:C.bg,minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",color:C.tx}},
    // HEADER
    e("div",{style:{background:"linear-gradient(180deg,rgba(13,18,36,.98),rgba(6,10,20,.95))",borderBottom:"1px solid "+C.bd,padding:"12px 16px",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"}},
      e("div",{style:{maxWidth:"900px",margin:"0 auto",display:"flex",alignItems:"center",gap:"10px"}},
        e("button",{onClick:function(){setSb(!sb)},style:{background:"none",border:"none",color:C.mt,fontSize:"20px",cursor:"pointer"}},"☰"),
        e("div",{onClick:function(){go("home")},style:{fontFamily:"'Playfair Display',serif",fontSize:"18px",fontWeight:900,background:"linear-gradient(135deg,#3b82f6,#8b5cf6,#f472b6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",cursor:"pointer",flexShrink:0,letterSpacing:"2px"}},"ECEPT"),
        vista!=="home"&&e("div",{style:{display:"flex",alignItems:"center",gap:"4px",fontSize:"11px",flexShrink:0}},
          e("span",{onClick:function(){go("home")},style:{color:C.dm,cursor:"pointer"}},"Inicio"),
          vista==="reuma_sec"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt}},"Reuma")),
          vista==="reuma_dis"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{onClick:function(){go("reuma")},style:{color:C.dm,cursor:"pointer"}},"Reuma"),e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt,maxWidth:"100px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},dis?dis.n:"")),
          vista==="cir_menu"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt}},"Cirugía")),
          vista==="cir_abd"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{onClick:function(){go("cir_menu")},style:{color:C.dm,cursor:"pointer"}},"Cirugía"),e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt}},"Abdomen Agudo")),
          vista==="cir_ing"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{onClick:function(){go("anat_menu")},style:{color:C.dm,cursor:"pointer"}},"Anatomía"),e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt}},"Conducto Inguinal")),
          vista==="anat_menu"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt}},"Anatomía")),
          vista==="anatomia"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{onClick:function(){go("anat_menu")},style:{color:C.dm,cursor:"pointer"}},"Anatomía"),e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt}},"Pares Craneales")),
          vista==="emergen_menu"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt}},"Emergenciología")),
          vista==="cir_quem"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{onClick:function(){go("emergen_menu")},style:{color:C.dm,cursor:"pointer"}},"Emergenciología"),e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt}},"Quemaduras")),
          vista==="trauma-u1"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{onClick:function(){go("emergen_menu")},style:{color:C.dm,cursor:"pointer"}},"Emergenciología"),e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt}},"Trauma — Unidad 1")),
          vista==="vocabulario"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{onClick:function(){go("general")},style:{color:C.dm,cursor:"pointer"}},"Generalidades"),e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt}},"Vocabulario Médico")),
          vista==="mediadores"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{onClick:function(){go("general")},style:{color:C.dm,cursor:"pointer"}},"Generalidades"),e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt}},"Mediadores de la Inflamación")),
          vista==="epid"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt}},"Epidemiología")),
          vista==="labs"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt}},"Laboratorios")),
          vista==="fisio"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt}},"Fisiología")),
          vista==="receptores"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{onClick:function(){go("fisio")},style:{color:C.dm,cursor:"pointer"}},"Fisiología"),e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt}},"Receptores Celulares")),
          vista==="coagulacion"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{onClick:function(){go("fisio")},style:{color:C.dm,cursor:"pointer"}},"Fisiología"),e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt}},"Cascada de Coagulación")),
          vista==="general"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt}},"Generalidades")),
          vista==="triadas"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt}},"Tríadas")),
          vista==="imagenes"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt}},"Imágenes")),
          vista==="flashcards"&&e(F,null,e("span",{style:{color:"rgba(255,255,255,.15)"}}," › "),e("span",{style:{color:C.mt}},"Flashcards")),
          vista==="salud_mental"&&(function(){
            // Deeper SM breadcrumb driven by smView (updated via onViewChange).
            // Each label maps to a single crumb; neurosis themes stack under "Neurosis",
            // per-group flash/quiz hubs stack under their group, and disease routes
            // append the disease name (with its parent theme in between).
            var SM_LABELS={intro:"Psiquiatría",psicosis:"Psicosis",neurosis:"Neurosis","flash-all":"Flashcards globales","quiz-all":"Quiz global","flash-psicosis":"Flashcards","quiz-psicosis":"Quiz","flash-neurosis":"Flashcards","quiz-neurosis":"Quiz",anx:"Ansiedad",toc:"TOC",trm:"Trauma",som:"Somáticos",tca:"TCA",sue:"Sueño",per:"Personalidad",imp:"Impulsos",dpr:"Depresivos"};
            var NEURO_THEMES=["anx","toc","trm","som","tca","sue","per","imp","dpr"];
            var isNeurosisTheme=NEURO_THEMES.indexOf(smView)>=0;
            var isPsicoSub=smView==="flash-psicosis"||smView==="quiz-psicosis";
            var isNeuroSub=smView==="flash-neurosis"||smView==="quiz-neurosis";
            var isDisease=smView==="disease"&&smLeaf;
            var isSection=smView==="section"&&smLeaf;
            var sep=e("span",{style:{color:"rgba(255,255,255,.15)"}}," › ");
            var smLabel=e("span",{style:{color:smView==="root"?C.mt:C.dm,cursor:smView==="root"?"default":"pointer"},onClick:smView==="root"?null:function(){if(window._smFocus)window._smFocus("root")}},"Salud Mental II");
            // Leaf crumbs (disease + section share the same shape {name, parent}).
            // Parent in ["psicosis"] → "Psicosis › <name>"; parent ∈ neurosis themes
            // → "Neurosis › <theme> › <name>"; parent "intro" → "Psiquiatría › <name>";
            // anything else falls back to just "<name>". Name truncated to keep top
            // bar from wrapping on narrow viewports.
            var leafCrumbs=null;
            if(isDisease||isSection){
              var parent=smLeaf.parent;
              var parentIsNeuro=NEURO_THEMES.indexOf(parent)>=0;
              var nameSpan=e("span",{style:{color:C.mt,maxWidth:"160px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"inline-block",verticalAlign:"bottom"}},smLeaf.name);
              if(parent==="psicosis"){
                leafCrumbs=e(F,null,sep,e("span",{style:{color:C.dm,cursor:"pointer"},onClick:function(){if(window._smFocus)window._smFocus("psicosis")}},"Psicosis"),sep,nameSpan);
              } else if(parentIsNeuro){
                leafCrumbs=e(F,null,sep,e("span",{style:{color:C.dm,cursor:"pointer"},onClick:function(){if(window._smFocus)window._smFocus("neurosis")}},"Neurosis"),sep,e("span",{style:{color:C.dm,cursor:"pointer"},onClick:function(){if(window._smFocus)window._smFocus(parent)}},SM_LABELS[parent]),sep,nameSpan);
              } else if(parent==="intro"){
                leafCrumbs=e(F,null,sep,e("span",{style:{color:C.dm,cursor:"pointer"},onClick:function(){if(window._smFocus)window._smFocus("intro")}},"Psiquiatría"),sep,nameSpan);
              } else {
                leafCrumbs=e(F,null,sep,nameSpan);
              }
            }
            return e(F,null,sep,smLabel,
              isNeurosisTheme?e(F,null,sep,e("span",{style:{color:C.dm,cursor:"pointer"},onClick:function(){if(window._smFocus)window._smFocus("neurosis")}},"Neurosis"),sep,e("span",{style:{color:C.mt}},SM_LABELS[smView])):null,
              isPsicoSub?e(F,null,sep,e("span",{style:{color:C.dm,cursor:"pointer"},onClick:function(){if(window._smFocus)window._smFocus("psicosis")}},"Psicosis"),sep,e("span",{style:{color:C.mt}},SM_LABELS[smView])):null,
              isNeuroSub?e(F,null,sep,e("span",{style:{color:C.dm,cursor:"pointer"},onClick:function(){if(window._smFocus)window._smFocus("neurosis")}},"Neurosis"),sep,e("span",{style:{color:C.mt}},SM_LABELS[smView])):null,
              (isDisease||isSection)?leafCrumbs:null,
              (smView!=="root" && !isNeurosisTheme && !isPsicoSub && !isNeuroSub && !isDisease && !isSection)?e(F,null,sep,e("span",{style:{color:C.mt}},SM_LABELS[smView]||smView)):null
            );
          })()
        ),
        e("div",{style:{flex:1,position:"relative"}},
          e("span",{style:{position:"absolute",left:"10px",top:"50%",transform:"translateY(-50%)",color:C.dm,fontSize:"13px",pointerEvents:"none"}},"🔍"),
          e("input",{style:{width:"100%",background:"rgba(255,255,255,.04)",border:"1px solid "+C.bd,borderRadius:"12px",padding:"8px 12px 8px 34px",color:C.tx,fontSize:"14px",outline:"none"},placeholder:"Buscar todo...",value:sq,onChange:function(ev){setSq(ev.target.value);setSo(true)},onFocus:function(){setSo(true)},onBlur:function(){setTimeout(function(){setSo(false)},250)}}),
          so&&sr.length>0&&e("div",{style:{position:"absolute",top:"100%",left:0,right:0,background:C.cd,border:"1px solid "+C.bd,borderRadius:"12px",marginTop:"4px",maxHeight:"350px",overflow:"auto",zIndex:200,boxShadow:"0 20px 40px rgba(0,0,0,.5)"}},sr.map(function(r,i){return e("div",{key:i,onMouseDown:function(){setSq("");setSo(false);go(r.go,r.sec||null,r.id||null);if(r.secId&&window._traumaFocus)setTimeout(function(){window._traumaFocus(r.secId)},200);if(r.vocTx&&window._vocabFocus)setTimeout(function(){window._vocabFocus(r.vocTx)},200);if(r.smRoute&&window._smFocus)setTimeout(function(){window._smFocus(r.smRoute)},200)},style:{padding:"10px 16px",cursor:"pointer",borderBottom:"1px solid "+C.bd,fontSize:"13px"}},e("div",{style:{fontWeight:600}},r.name),e("div",{style:{fontSize:"11px",color:C.dm,marginTop:"2px"}},r.sub))}))
        )
      )
    ),
    // SIDEBAR
    sb&&e("div",{style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",zIndex:150,display:"flex"}},
      e("div",{style:{background:C.cd,width:"290px",height:"100%",borderRight:"1px solid "+C.bd,overflow:"auto",padding:"20px",boxShadow:"4px 0 30px rgba(0,0,0,.5)"}},
        // Header
        e("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}},
          e("div",{style:{display:"flex",alignItems:"center",gap:"8px"}},
            e("span",{style:{fontSize:"18px"}},"🧬"),
            e("span",{style:{fontFamily:"'Playfair Display',serif",fontSize:"18px",fontWeight:900,background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"2px"}},"ECEPT")
          ),
          e("button",{onClick:function(){setSb(false)},style:{background:"none",border:"none",color:C.mt,fontSize:"20px",cursor:"pointer"}},"✕")
        ),
        // UserMenu — session state at top of sidebar
        e(UserMenu,{
          user:ecuUser,
          onLoginClick:function(){setEcuShowAuth(true);setSb(false);},
          onProfileClick:function(){go("profile");setSb(false);},
          onLogout:function(){}
        }),
        // Home
        e("div",{onClick:function(){go("home");setSb(false)},style:{padding:"10px 14px",borderRadius:"10px",cursor:"pointer",marginBottom:"16px",background:vista==="home"?"rgba(59,130,246,.1)":"rgba(255,255,255,.03)",color:vista==="home"?C.ac:C.mt,fontWeight:700,fontSize:"13px",display:"flex",alignItems:"center",gap:"8px",border:"1px solid "+(vista==="home"?C.ac+"30":"transparent")}},"🏠 Inicio"),

        // ── SECCIONES ESPECIALES ──
        e("div",{style:{fontSize:"9px",fontWeight:700,color:C.dm,textTransform:"uppercase",letterSpacing:"2px",padding:"0 4px",marginBottom:"8px"}},"⚡ SECCIONES ESPECIALES"),
        [{ic:"🔺",n:"Tríadas y Síndromes",v:"triadas",col:"#e879f9",sub:[]},
         {ic:"📊",n:"Laboratorios",v:"labs",col:"#4caf82",sub:[]},
         {ic:"📚",n:"Generalidades",v:"general",col:"#8b5cf6",sub:[{n:"🛡️ Bases Inmunológicas",v:"general"},{n:"🩸 Factores de Coagulación",v:"general"},{n:"🔥 Mediadores de la Inflamación",v:"mediadores"},{n:"📖 Vocabulario Médico",v:"vocabulario"}]},
         {ic:"📷",n:"Imágenes Diagnósticas",v:"imagenes",col:"#06b6d4",sub:[]}
        ].map(function(sec){
          var isExp=sbExp===sec.v;
          var hasSub=sec.sub&&sec.sub.length>0;
          return e("div",{key:sec.v,style:{marginBottom:"2px"}},
            e("div",{onClick:function(){
              if(hasSub){setSbExp(isExp?null:sec.v)}
              else{go(sec.v);setSb(false)}
            },style:{padding:"9px 14px",borderRadius:"8px",cursor:"pointer",fontSize:"13px",fontWeight:500,color:vista===sec.v?sec.col:C.mt,background:vista===sec.v?sec.col+"10":"transparent",display:"flex",alignItems:"center",justifyContent:"space-between"}},
              e("div",{style:{display:"flex",alignItems:"center",gap:"8px"}},e("span",{style:{fontSize:"14px"}},sec.ic),e("span",null,sec.n)),
              hasSub&&e("span",{style:{fontSize:"10px",color:C.dm,transform:isExp?"rotate(180deg)":"none",transition:"transform .2s"}},"▾")
            ),
            isExp&&hasSub&&e("div",{style:{paddingLeft:"20px",marginTop:"2px",marginBottom:"4px"}},
              sec.sub.map(function(ss,si){
                return e("div",{key:si,onClick:function(){if(ss.v){go(ss.v);setSb(false)}},style:{padding:"6px 12px",fontSize:"12px",color:ss.v?C.dm:"rgba(255,255,255,.25)",cursor:ss.v?"pointer":"default",borderLeft:"2px solid "+(ss.v?sec.col+"40":"rgba(255,255,255,.08)"),marginBottom:"1px"}},ss.n,!ss.v&&e("span",{style:{fontSize:"9px",color:"rgba(255,255,255,.15)",marginLeft:"6px"}},"pronto"))
              })
            )
          )
        }),

        // ── MATERIAS ──
        e("div",{style:{fontSize:"9px",fontWeight:700,color:C.dm,textTransform:"uppercase",letterSpacing:"2px",padding:"0 4px",marginTop:"16px",marginBottom:"8px",paddingTop:"12px",borderTop:"1px solid "+C.bd}},"📋 MATERIAS"),
        [{ic:"🦴",n:"Reumatología",v:"reuma",col:"#60a5fa",act:true,sub:REUMA_SECS.map(function(s){return{n:s.i+" "+s.n,v:"reuma_sec",sec:s.id}})},
         {ic:"🔪",n:"Cirugía",v:"cir_menu",col:"#ef4444",act:true,sub:[{n:"🔴 Abdomen Agudo",v:"cir_abd"}]},
         {ic:"🔬",n:"Fisiología",v:"fisio",col:"#ec4899",act:true,sub:[
           {n:"🧬 Receptores Celulares",v:"receptores"},
           {n:"  ⚡ Adrenérgicos",v:"receptores"},
           {n:"  🌿 Muscarínicos",v:"receptores"},
           {n:"  🧬 Nicotínicos",v:"receptores"},
           {n:"  🎯 Dopaminérgicos",v:"receptores"},
           {n:"  💫 Serotoninérgicos",v:"receptores"},
           {n:"  🔥 Histaminérgicos",v:"receptores"},
           {n:"  ☯️ Opioides",v:"receptores"},
           {n:"  🧠 Glutamatérgicos",v:"receptores"},
           {n:"  😴 GABAérgicos",v:"receptores"},
           {n:"  🌱 Cannabinoides",v:"receptores"},
           {n:"🩸 Cascada de Coagulación",v:"coagulacion"}
         ]},
         {ic:"🚑",n:"Emergenciología",v:"emergen_menu",col:"#ef4444",act:true,sub:[{n:"🔥 Quemaduras + Calculadoras",v:"cir_quem"},{n:"🩸 Trauma — Unidad 1",v:"trauma-u1"}]},
         {ic:"🩻",n:"Anatomía",v:"anatomia",col:"#f59e0b",act:true,sub:[{n:"🧠 Pares Craneales",grp:true,items:[{n:"🗺️ Mapa Interactivo",v:"anatomia",openMap:true},{n:"📋 Lista de Pares",v:"anatomia"}]},{n:"🧱 Conducto Inguinal",v:"cir_ing"}]},
         {ic:"📊",n:"Epidemiología (Salud Pública)",v:"epid",col:"#00b4d8",act:true,sub:[{n:"🔺 Pirámide de Evidencia",v:"epid"},{n:"📋 Tipos de Estudio",v:"epid"},{n:"⚠️ Sesgos",v:"epid"},{n:"📐 Medidas",v:"epid"},{n:"✅ Lectura Crítica",v:"epid"}]},
         {ic:"🫀",n:"Cardiología",col:"#ef4444",act:false,sub:[]},
         {ic:"🫁",n:"Neumología",col:"#06b6d4",act:false,sub:[]},
         {ic:"🧠",n:"Neurología",col:"#a78bfa",act:false,sub:[]},
         {ic:"🫘",n:"Nefrología",col:"#f59e0b",act:false,sub:[]},
         {ic:"🦠",n:"Infectología",col:"#34d399",act:false,sub:[]},
         {ic:"💊",n:"Farmacología",col:"#8b5cf6",act:false,sub:[]},
         {ic:"🍽️",n:"Gastroenterología",col:"#fb923c",act:false,sub:[]},
         {ic:"⚗️",n:"Endocrinología",col:"#06b6d4",act:false,sub:[]},
         {ic:"🩸",n:"Hematología",col:"#dc2626",act:false,sub:[]},
         {ic:"🧴",n:"Dermatología",col:"#f472b6",act:false,sub:[]},
         {ic:"🦴",n:"Traumatología",col:"#78716c",act:false,sub:[]}
        ].map(function(mat){
          var isExp2=sbExp==="mat_"+mat.n;
          var hasSub2=mat.sub&&mat.sub.length>0&&mat.act;
          return e("div",{key:mat.n,style:{marginBottom:"1px"}},
            e("div",{onClick:function(){
              if(!mat.act) return;
              if(hasSub2){setSbExp(isExp2?null:"mat_"+mat.n)}
              else if(mat.v){go(mat.v);setSb(false)}
            },style:{padding:"8px 14px",borderRadius:"8px",cursor:mat.act?"pointer":"default",fontSize:"13px",fontWeight:500,color:mat.act?C.mt:"rgba(255,255,255,.25)",display:"flex",alignItems:"center",justifyContent:"space-between",opacity:mat.act?1:.4}},
              e("div",{style:{display:"flex",alignItems:"center",gap:"8px"}},e("span",{style:{fontSize:"14px"}},mat.ic),e("span",null,mat.n)),
              mat.act&&hasSub2?e("span",{style:{fontSize:"10px",color:C.dm,transform:isExp2?"rotate(180deg)":"none",transition:"transform .2s"}},"▾"):!mat.act?e("span",{style:{fontSize:"8px",padding:"2px 6px",borderRadius:"4px",background:"rgba(255,255,255,.05)",color:"rgba(255,255,255,.2)"}},"pronto"):null
            ),
            isExp2&&hasSub2&&e("div",{style:{paddingLeft:"20px",marginTop:"2px",marginBottom:"4px"}},
              mat.sub.map(function(ss2,si2){
                if(ss2.grp){var subKey="sub_"+mat.n+"_"+si2;var subOn=sbSub===subKey;return e(F,{key:si2},e("div",{onClick:function(){setSbSub(subOn?null:subKey)},style:{padding:"6px 12px",fontSize:"12px",color:C.dm,cursor:"pointer",borderLeft:"2px solid "+mat.col+"40",marginBottom:"1px",display:"flex",justifyContent:"space-between",alignItems:"center"}},e("span",null,ss2.n),e("span",{style:{fontSize:"9px",color:C.dm,transform:subOn?"rotate(180deg)":"none",transition:"transform .2s"}},"▾")),subOn&&e("div",{style:{paddingLeft:"14px"}},ss2.items.map(function(it,ii){return e("div",{key:ii,onClick:function(){go(it.v);if(it.openMap)setTimeout(function(){setAbdOpen("mapa_nc")},150);setSb(false)},style:{padding:"5px 12px",fontSize:"11px",color:C.dm,cursor:"pointer",borderLeft:"2px solid "+mat.col+"20",marginBottom:"1px"}},it.n)})))}
                return e("div",{key:si2,onClick:function(){
                  if(ss2.sec){go(ss2.v,ss2.sec)}else{go(ss2.v)}
                  setSb(false);
                },style:{padding:"6px 12px",fontSize:"12px",color:C.dm,cursor:"pointer",borderLeft:"2px solid "+mat.col+"40",marginBottom:"1px",transition:"color .15s"}},ss2.n)
              })
            )
          )
        }),

        // Footer
        e("div",{style:{marginTop:"20px",paddingTop:"12px",borderTop:"1px solid "+C.bd,textAlign:"center"}},
          e("p",{style:{fontSize:"10px",color:"rgba(255,255,255,.15)"}},"ECEPT · El Conocimiento Es Para Todos")
        )
      ),
      e("div",{onClick:function(){setSb(false)},style:{flex:1,background:"rgba(0,0,0,.6)"}})
    ),
    // ════════════ MAIN (content wrapper — Trauma + Vocab now render natively inside) ════════════
    e("div",{style:{maxWidth:"900px",margin:"0 auto",padding:"20px 16px 80px"}},e("div",{style:fi},

    // ════════════ HOME ════════════
    vista==="home"&&e(F,null,
      e("div",{style:{textAlign:"center",padding:"40px 20px 32px",marginBottom:"32px",background:"radial-gradient(ellipse at center top,rgba(59,130,246,.06) 0%,transparent 70%)",borderRadius:"20px"}},
        e("div",{style:{fontSize:"48px",marginBottom:"12px",animation:"float 3s ease-in-out infinite"}},"🧬"),
        e("h1",{style:{fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,6vw,42px)",fontWeight:900,background:"linear-gradient(135deg,#3b82f6,#8b5cf6,#f472b6,#fbbf24)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:"8px",letterSpacing:"3px"}},"ECEPT"),
        e("p",{style:{fontFamily:"'Playfair Display',serif",fontSize:"14px",color:C.mt,fontWeight:700,letterSpacing:"1px"}},"El Conocimiento Es Para Todos"),
        // Stats row
        e("div",{style:{display:"flex",justifyContent:"center",gap:"16px",marginTop:"20px",flexWrap:"wrap"}},
          e("div",{style:{textAlign:"center",padding:"10px 18px",background:"rgba(59,130,246,.08)",borderRadius:"12px",border:"1px solid rgba(59,130,246,.15)"}},
            e("div",{style:{fontSize:"22px",fontWeight:800,color:C.ac,fontFamily:"monospace"}},vi.length+"/"+RD.length),
            e("div",{style:{fontSize:"10px",color:C.dm,marginTop:"2px"}},"Revisadas")
          ),
          e("div",{style:{textAlign:"center",padding:"10px 18px",background:"rgba(245,158,11,.08)",borderRadius:"12px",border:"1px solid rgba(245,158,11,.15)"}},
            e("div",{style:{fontSize:"22px",fontWeight:800,color:"#f59e0b",fontFamily:"monospace"}},favs.length),
            e("div",{style:{fontSize:"10px",color:C.dm,marginTop:"2px"}},"Favoritos")
          ),
          e("div",{style:{textAlign:"center",padding:"10px 18px",background:"rgba(52,211,153,.08)",borderRadius:"12px",border:"1px solid rgba(52,211,153,.15)"}},
            e("div",{style:{fontSize:"22px",fontWeight:800,color:"#34d399",fontFamily:"monospace"}},bestStreak),
            e("div",{style:{fontSize:"10px",color:C.dm,marginTop:"2px"}},"Mejor racha")
          )
        ),
        // Progress bar
        e("div",{style:{maxWidth:"300px",margin:"16px auto 0"}},
          e("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"5px"}},
            e("span",{style:{fontSize:"10px",color:C.dm}},"Progreso Reumatología"),
            e("span",{style:{fontSize:"10px",color:C.ac,fontWeight:700}},Math.round(vi.length/RD.length*100)+"%")
          ),
          e("div",{style:{height:"4px",background:"rgba(255,255,255,.06)",borderRadius:"2px",overflow:"hidden"}},
            e("div",{style:{width:Math.round(vi.length/RD.length*100)+"%",height:"100%",background:"linear-gradient(90deg,#3b82f6,#8b5cf6)",borderRadius:"2px",transition:"width .5s"}})
          )
        )
      ),
      // Favorites section (only if there are favorites)
      favs.length>0&&e("div",{style:{marginBottom:"24px",padding:"16px 18px",background:"linear-gradient(135deg,"+C.cd+",rgba(245,158,11,.04))",border:"1px solid rgba(245,158,11,.2)",borderRadius:"16px"}},
        e("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px"}},e("span",{style:{fontSize:"18px"}},"⭐"),e("h3",{style:{fontSize:"14px",fontWeight:700,color:"#f59e0b"}},"Tus Favoritos")),
        e("div",{style:{display:"flex",flexWrap:"wrap",gap:"8px"}},
          favs.map(function(fid){
            var enf=RD.find(function(d){return d.id===fid});
            if(!enf) return null;
            return e("div",{key:fid,onClick:function(){go("reuma_dis",enf.s,enf.id)},style:{padding:"8px 14px",background:"rgba(255,255,255,.04)",border:"1px solid "+C.bd,borderRadius:"10px",cursor:"pointer",fontSize:"12px",fontWeight:600,color:C.tx,display:"flex",alignItems:"center",gap:"6px"}},
              e("span",{style:{fontSize:"14px"}},"⭐"),enf.n
            )
          })
        )
      ),
      e("div",{style:{marginBottom:"36px"}},
        e("h2",{style:{fontFamily:"'Playfair Display',serif",fontSize:"16px",fontWeight:800,color:C.mt,marginBottom:"14px",display:"flex",alignItems:"center",gap:"8px",textTransform:"uppercase",letterSpacing:"1px",fontSize:"12px"}},"⚡ Secciones Especiales"),
        e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"12px"}},
          MODS.filter(function(m){return["triadas","labs","imagenes","general","flashcards"].indexOf(m.id)>-1}).map(function(m,i){
            var lleno=m.st==="lleno";
            return e("div",{key:m.id,onClick:function(){if(lleno)go(m.id)},style:{
              background:"linear-gradient(135deg,"+C.cd+","+m.col+"06)",border:"1px solid "+m.col+"25",borderRadius:"14px",padding:"16px",
              cursor:lleno?"pointer":"default",opacity:lleno?1:.4,transition:"all .2s",
              animation:"slideUp .4s ease-out "+(i*0.05)+"s both"
            }},
              e("div",{style:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px"}},
                e("span",{style:{fontSize:"24px"}},m.ic),
                e("h3",{style:{fontSize:"14px",fontWeight:700}},m.n)
              ),
              e("p",{style:{fontSize:"11px",color:C.dm,lineHeight:1.4}},m.d),
              !lleno&&e("span",{style:{display:"inline-block",marginTop:"6px",fontSize:"9px",padding:"3px 8px",borderRadius:"6px",background:"rgba(255,255,255,.05)",color:C.dm}},"Próximamente")
            )
          })
        )
      ),
      e("h2",{style:{fontFamily:"'Playfair Display',serif",fontSize:"12px",fontWeight:800,color:C.mt,marginBottom:"14px",display:"flex",alignItems:"center",gap:"8px",textTransform:"uppercase",letterSpacing:"1px"}},"📋 Materias"),
      e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:"14px"}},
        MODS.filter(function(m){return["triadas","labs","imagenes","general","flashcards"].indexOf(m.id)===-1}).map(function(m,i){
          var lleno=m.st==="lleno";
          return e("div",{key:m.id,onClick:function(){if(lleno)go(m.id==="cirugia"?"cir_menu":m.id==="anatomia"?"anat_menu":m.id==="labs"?"labs":m.id==="epid"?"epid":m.id==="emergen"?"emergen_menu":m.id==="fisio"?"fisio":m.id)},style:{
            background:C.cd,border:"1px solid "+(lleno?m.col+"30":C.bd),borderRadius:"16px",padding:"20px",
            cursor:lleno?"pointer":"default",opacity:lleno?1:.4,transition:"all .2s",
            animation:"slideUp .4s ease-out "+(i*0.04)+"s both"
          }},
            e("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"}},
              e("span",{style:{fontSize:"28px",width:"46px",height:"46px",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"12px",background:m.col+"10"}},m.ic),
              lleno?e("span",{style:{fontSize:"9px",padding:"3px 8px",borderRadius:"6px",background:m.col+"15",color:m.col,fontWeight:700}},"Activo"):e("span",{style:{fontSize:"9px",padding:"3px 8px",borderRadius:"6px",background:"rgba(255,255,255,.05)",color:C.dm}},"Pronto")
            ),
            e("h3",{style:{fontSize:"15px",fontWeight:700,marginBottom:"4px"}},m.n),
            e("p",{style:{fontSize:"11px",color:C.dm,lineHeight:1.5}},m.d)
          )
        })
      )
    ),

    // ════════════ CIRUGÍA MENÚ ════════════
    vista==="cir_menu"&&e(F,null,
      e("div",{style:{textAlign:"center",marginBottom:"24px"}},e("div",{style:{fontSize:"40px",marginBottom:"8px"}},"🔪"),e("h2",{style:{fontFamily:"'Playfair Display',serif",fontSize:"24px",fontWeight:800,color:"#ef4444"}},"Cirugía")),
      [{v:"cir_abd",ic:"🔴",n:"Abdomen Agudo Infeccioso",d:"Peritonitis, Apendicitis, Colecistitis, Pancreatitis, Colangitis"}].map(function(it){
        return e("div",{key:it.v,onClick:function(){go(it.v)},style:{background:C.cd,border:"1px solid "+C.bd,borderRadius:"14px",padding:"18px",cursor:"pointer",marginBottom:"12px",display:"flex",alignItems:"center",gap:"14px"}},
          e("span",{style:{fontSize:"28px"}},it.ic),e("div",null,e("h3",{style:{fontSize:"15px",fontWeight:700}},it.n),e("p",{style:{fontSize:"12px",color:C.dm}},it.d)),e("span",{style:{color:C.dm,marginLeft:"auto"}},"›"))
      })
    ),

    // ════════════ ANATOMÍA MENÚ ════════════
    vista==="anat_menu"&&e(F,null,
      e("div",{style:{textAlign:"center",marginBottom:"24px"}},e("div",{style:{fontSize:"40px",marginBottom:"8px"}},"🩻"),e("h2",{style:{fontFamily:"'Playfair Display',serif",fontSize:"24px",fontWeight:800,color:"#f59e0b"}},"Anatomía")),
      [{v:"anatomia",ic:"🧠",n:"Pares Craneales",d:"Mapa interactivo · 12 pares · Origen, función y clínica"},{v:"cir_ing",ic:"🧱",n:"Conducto Inguinal",d:"Conducto · Anillos · Cordón Espermático"}].map(function(it){
        return e("div",{key:it.v,onClick:function(){go(it.v)},style:{background:C.cd,border:"1px solid "+C.bd,borderRadius:"14px",padding:"18px",cursor:"pointer",marginBottom:"12px",display:"flex",alignItems:"center",gap:"14px"}},
          e("span",{style:{fontSize:"28px"}},it.ic),e("div",null,e("h3",{style:{fontSize:"15px",fontWeight:700}},it.n),e("p",{style:{fontSize:"12px",color:C.dm}},it.d)),e("span",{style:{color:C.dm,marginLeft:"auto"}},"›"))
      })
    ),

    // ════════════ REUMATOLOGÍA HOME ════════════
    vista==="reuma"&&e(F,null,
      e("div",{style:{textAlign:"center",marginBottom:"28px"}},e("h1",{style:{fontFamily:"'Playfair Display',serif",fontSize:"28px",fontWeight:800,background:"linear-gradient(135deg,#60a5fa,#a78bfa,#f472b6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}},"Reumatología"),e("p",{style:{color:C.mt,fontSize:"14px"}},tot+" enfermedades · "+vi.length+" revisadas")),
      e("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:"12px"}},REUMA_SECS.map(function(sec){var cn=RD.filter(function(d){return d.s===sec.id}).length;return e("div",{key:sec.id,onClick:function(){go("reuma_sec",sec.id)},style:{background:C.cd,border:"1px solid "+C.bd,borderRadius:"14px",padding:"18px",cursor:"pointer"}},e("div",{style:{fontSize:"24px",marginBottom:"8px"}},sec.i),e("h3",{style:{fontSize:"14px",fontWeight:700,marginBottom:"3px"}},sec.n),e("p",{style:{fontSize:"11px",color:C.dm}},sec.d),e("span",{style:{fontSize:"11px",color:C.mt}},cn+" enf"))}))
    ),

    // ════════════ REUMATOLOGÍA SECCIÓN ════════════
    vista==="reuma_sec"&&e(F,null,
      e("h2",{style:{fontFamily:"'Playfair Display',serif",fontSize:"22px",fontWeight:700,marginBottom:"16px"}},(REUMA_SECS.find(function(s2){return s2.id===cs})||{}).i+" "+(REUMA_SECS.find(function(s2){return s2.id===cs})||{}).n),
      e("div",{style:{display:"flex",flexDirection:"column",gap:"10px"}},sd.map(function(d){return e("div",{key:d.id,onClick:function(){go("reuma_dis",d.s,d.id)},style:{background:C.cd,border:"1px solid "+C.bd,borderRadius:"12px",padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}},e("div",{style:{display:"flex",alignItems:"center",gap:"10px"}},isFav(d.id)&&e("span",{style:{fontSize:"14px"}},"⭐"),vi.indexOf(d.id)>-1&&e("span",{style:{color:"#34d399",fontSize:"12px"}},"✓"),e("span",{style:{fontWeight:600,fontSize:"15px"}},d.n)),e("span",{style:{color:C.dm}},"›"))}))
    ),

    // ════════════ REUMATOLOGÍA ENFERMEDAD ════════════
    vista==="reuma_dis"&&dis&&e(F,null,
      e("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"18px",flexWrap:"wrap",gap:"8px"}},e("div",{style:{display:"flex",alignItems:"center",gap:"10px"}},e("h2",{style:{fontFamily:"'Playfair Display',serif",fontSize:"20px",fontWeight:700,margin:0}},dis.n),e("button",{onClick:function(){toggleFav(dis.id)},style:{background:"none",border:"none",fontSize:"20px",cursor:"pointer",padding:"4px"}},isFav(dis.id)?"⭐":"☆")),dis.qz&&dis.qz.length>0&&e("button",{onClick:function(){setQm(!qm);setQa({})},style:{padding:"6px 14px",borderRadius:"20px",cursor:"pointer",fontSize:"13px",background:qm?C.ac:"rgba(255,255,255,.05)",color:qm?"#fff":C.mt,border:"none"}},qm?"✕ Cerrar":"🧠 Quiz")),
      qm?e("div",{style:cb},e("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px"}},e("h3",{style:{color:C.ac,fontSize:"16px",fontWeight:700,margin:0}},"🧠 Quiz"),streak>0&&e("div",{style:{display:"flex",alignItems:"center",gap:"6px",padding:"4px 12px",background:"rgba(52,211,153,.12)",borderRadius:"20px",border:"1px solid rgba(52,211,153,.25)"}},e("span",{style:{fontSize:"14px"}},"🔥"),e("span",{style:{fontSize:"12px",fontWeight:700,color:"#34d399"}},streak+" racha"))),dis.qz.map(function(q,qi){return e("div",{key:qi,style:{marginBottom:"18px",padding:"14px",background:"rgba(255,255,255,.02)",borderRadius:"12px"}},e("p",{style:{color:C.tx,fontWeight:600,marginBottom:"10px",fontSize:"14px"}},(qi+1)+". "+q.p),e("div",{style:{display:"flex",flexDirection:"column",gap:"6px"}},q.o.map(function(o,oi){var an2=qa[qi]!==undefined,sl=qa[qi]===oi,cr=oi===q.r;var bg2="rgba(255,255,255,.04)",bd2=C.bd;if(an2&&cr){bg2="rgba(52,211,153,.15)";bd2="#34d399"}if(an2&&sl&&!cr){bg2="rgba(239,68,68,.15)";bd2="#ef4444"}return e("button",{key:oi,onClick:function(){if(!an2){setQa(function(p2){var n2={};for(var k in p2)n2[k]=p2[k];n2[qi]=oi;return n2});if(oi===q.r){setStreak(function(s2){var ns=s2+1;if(ns>bestStreak)setBestStreak(ns);return ns})}else{setStreak(0)}}},style:{padding:"10px 14px",borderRadius:"8px",border:"1px solid "+bd2,background:bg2,color:C.tx,textAlign:"left",cursor:an2?"default":"pointer",fontSize:"13px"}},String.fromCharCode(65+oi)+") "+o+(an2&&cr?" ✓":"")+(an2&&sl&&!cr?" ✗":""))})),qa[qi]!==undefined&&e("p",{style:{marginTop:"8px",padding:"10px",background:qa[qi]===q.r?"rgba(52,211,153,.1)":"rgba(239,68,68,.1)",borderRadius:"8px",fontSize:"13px",color:qa[qi]===q.r?"#34d399":"#fca5a5",lineHeight:1.5}},q.x))}))
      :e(F,null,
        e("div",{style:{display:"flex",gap:"4px",overflowX:"auto",padding:"4px",background:"rgba(255,255,255,.03)",borderRadius:"14px",marginBottom:"18px",flexWrap:"wrap"}},SUB.map(function(s2,i){return e("div",{key:i,onClick:function(){setTab(i)},style:{padding:"7px 12px",borderRadius:"10px",cursor:"pointer",fontSize:"12px",fontWeight:600,background:tab===i?s2.c+"22":"transparent",color:tab===i?s2.c:C.mt,border:tab===i?"1px solid "+s2.c+"44":"1px solid transparent",whiteSpace:"nowrap"}},s2.i+" "+s2.l)})),
        e("div",{style:cb},e("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"14px"}},e("span",{style:{fontSize:"18px"}},SUB[tab].i),e("h3",{style:{color:SUB[tab].c,fontSize:"15px",fontWeight:700,margin:0}},SUB[tab].l)),rSub())
      )
    ),

    // ════════════ TRÍADAS ════════════
    vista==="triadas"&&e(F,null,
      e("div",{style:{textAlign:"center",marginBottom:"24px"}},e("div",{style:{fontSize:"40px",marginBottom:"10px"}},"🔺"),e("h2",{style:{fontFamily:"'Playfair Display',serif",fontSize:"22px",fontWeight:800,background:"linear-gradient(135deg,#e879f9,#f472b6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}},"Tríadas y Síndromes"),e("p",{style:{color:C.dm,fontSize:"13px"}},TR.length+" asociaciones clásicas")),
      e("div",{style:{display:"flex",flexDirection:"column",gap:"10px"}},TR.map(function(t,i){
        var op=et===i;var ci=TC.find(function(c2){return c2.id===t.ct});
        return e("div",{key:i,style:{background:C.cd,border:"1px solid "+(op?t.cl+"66":C.bd),borderRadius:"14px",overflow:"hidden",transition:"all .3s"}},
          e("div",{onClick:function(){setEt(op?null:i)},style:{padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}},
            e("div",{style:{display:"flex",alignItems:"center",gap:"10px",flex:1}},
              e("span",{style:{fontSize:"18px",width:"34px",height:"34px",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"8px",background:t.cl+"15",flexShrink:0}},t.ic),
              e("div",{style:{flex:1}},e("h3",{style:{fontSize:"14px",fontWeight:700,color:C.tx,margin:0}},t.nm),e("p",{style:{fontSize:"11px",color:t.cl,margin:"1px 0 0",fontWeight:600}},t.en)),
              e("span",{style:{fontSize:"9px",padding:"2px 6px",borderRadius:"5px",background:(ci?ci.c:"#666")+"12",color:ci?ci.c:"#666",fontWeight:600,flexShrink:0}},ci?ci.n:"")
            ),
            e("span",{style:{color:C.dm,fontSize:"14px",transform:op?"rotate(180deg)":"none",transition:"transform .3s",flexShrink:0}},"▾")
          ),
          op&&e("div",{style:{padding:"0 16px 16px",borderTop:"1px solid "+C.bd}},
            e("div",{style:{padding:"12px 0"}},
              e("h4",{style:{color:t.cl,fontSize:"11px",fontWeight:700,textTransform:"uppercase",marginBottom:"10px"}},"Componentes"),
              e("div",{style:{display:"flex",flexDirection:"column",gap:"7px"}},t.cp.map(function(c2,ci2){return e("div",{key:ci2,style:{display:"flex",alignItems:"flex-start",gap:"9px"}},e("span",{style:{background:t.cl,color:"#fff",fontSize:"10px",fontWeight:700,width:"19px",height:"19px",borderRadius:"5px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},ci2+1),e("span",{style:{color:C.tx,fontSize:"13px",lineHeight:1.5}},c2))}))
            ),
            e("div",{style:{padding:"10px 12px",background:t.cl+"08",borderRadius:"8px",borderLeft:"3px solid "+t.cl}},e("span",{style:{color:C.tx,fontSize:"12px",lineHeight:1.5}},"📝 "+t.dt))
          )
        )
      }))
    ),



    // ════════════ ABDOMEN AGUDO ════════════
    vista==="cir_abd"&&e(F,null,
      e("div",{style:{textAlign:"center",marginBottom:"24px"}},e("div",{style:{fontSize:"40px",marginBottom:"8px"}},"🔴"),e("h2",{style:{fontFamily:"'Playfair Display',serif",fontSize:"22px",fontWeight:800,color:"#ef4444"}},"Abdomen Agudo Infeccioso"),e("p",{style:{color:C.dm,fontSize:"13px"}},"Clasificación completa de etiologías y subtipos")),
      e("div",{style:{padding:"10px 14px",background:"rgba(120,53,15,.3)",border:"1px solid rgba(180,83,9,.4)",borderRadius:"10px",marginBottom:"20px"}},e("p",{style:{color:"#fcd34d",fontSize:"12px"}},"⚠️ El abdomen agudo es un SÍNDROME, no una enfermedad.")),
      ABD_DATA.map(function(item){
        var isOpen=abdOpen===item.id;
        return e("div",{key:item.id,style:{marginBottom:"12px"}},
          e("button",{onClick:function(){setAbdOpen(isOpen?null:item.id)},style:{width:"100%",textAlign:"left",borderRadius:"12px",padding:"16px",cursor:"pointer",background:isOpen?item.color+"12":C.cd,border:"1px solid "+(isOpen?item.color+"44":C.bd),color:C.tx,fontSize:"14px"}},
            e("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"}},
              e("div",{style:{display:"flex",alignItems:"center",gap:"12px"}},e("span",{style:{fontSize:"20px"}},item.icon),e("div",null,e("div",{style:{fontWeight:700}},item.name),e("div",{style:{fontSize:"11px",color:C.dm,marginTop:"2px"}},item.def))),
              e("span",{style:{color:C.dm,transform:isOpen?"rotate(180deg)":"none",transition:"transform .2s"}},"▼")
            )
          ),
          isOpen&&e("div",{style:{marginLeft:"16px",marginTop:"8px",display:"flex",flexDirection:"column",gap:"8px"}},
            item.cl.map(function(cl,idx){
              var key2=item.id+"-"+idx;var isExp=abdExp[key2];
              return e("div",{key:idx,style:{background:"#1a1a2e",border:"1px solid rgba(255,255,255,.1)",borderRadius:"8px",overflow:"hidden"}},
                e("button",{onClick:function(){var nw={};for(var k in abdExp)nw[k]=abdExp[k];nw[key2]=!isExp;setAbdExp(nw)},style:{width:"100%",textAlign:"left",padding:"12px",cursor:"pointer",background:"none",border:"none",color:C.tx}},
                  e("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}},
                    e("div",null,e("div",{style:{fontWeight:600,fontSize:"13px",color:item.color}},cl.type),e("div",{style:{fontSize:"11px",color:C.dm,marginTop:"4px"}},cl.desc)),
                    e("span",{style:{color:C.dm,fontSize:"12px",flexShrink:0}},isExp?"−":"+")
                  )
                ),
                isExp&&e("div",{style:{padding:"0 12px 12px",display:"flex",flexDirection:"column",gap:"8px"}},
                  [{l:"Etiología",v:cl.etiology},{l:"¿En quién?",v:cl.who},{l:"Tratamiento",v:cl.tx}].map(function(dd,di){
                    return e("div",{key:di,style:{background:"rgba(0,0,0,.3)",borderRadius:"6px",padding:"8px"}},
                      e("div",{style:{fontSize:"10px",fontWeight:700,color:C.dm,textTransform:"uppercase",letterSpacing:"0.5px"}},dd.l),
                      e("div",{style:{fontSize:"12px",color:"#d1d5db",marginTop:"4px",lineHeight:1.5}},dd.v)
                    )
                  })
                )
              )
            })
          )
        )
      })
    ),

    // ════════════ EMERGENCIOLOGÍA MENÚ ════════════
    vista==="emergen_menu"&&e(F,null,
      e("div",{style:{textAlign:"center",marginBottom:"24px"}},e("div",{style:{fontSize:"40px",marginBottom:"8px"}},"🚑"),e("h2",{style:{fontFamily:"'Playfair Display',serif",fontSize:"24px",fontWeight:800,color:"#ef4444"}},"Emergenciología")),
      [{v:"cir_quem",ic:"🔥",n:"Algoritmo de Quemaduras",d:"Tratamiento paso a paso + Calculadoras de Parkland y Goteo"},{v:"trauma-u1",ic:"🩸",n:"Trauma — Unidad 1",d:"Vía aérea, Shock, Tórax, Triage, Deontología — 5 temas completos"}].map(function(it){
        return e("div",{key:it.v,onClick:function(){go(it.v)},style:{background:C.cd,border:"1px solid "+C.bd,borderRadius:"14px",padding:"18px",cursor:"pointer",marginBottom:"12px",display:"flex",alignItems:"center",gap:"14px"}},
          e("span",{style:{fontSize:"28px"}},it.ic),e("div",null,e("h3",{style:{fontSize:"15px",fontWeight:700}},it.n),e("p",{style:{fontSize:"12px",color:C.dm}},it.d)),e("span",{style:{color:C.dm,marginLeft:"auto"}},"›"))
      }),
      // Placeholders
      [{ic:"💓",n:"RCP — Reanimación",d:"ACLS, BLS, algoritmos — Próximamente"},{ic:"🩸",n:"Shock",d:"Hipovolémico, Distributivo, Cardiogénico, Obstructivo — Próximamente"}].map(function(ph,i){
        return e("div",{key:i,style:{background:C.cd,border:"1px solid "+C.bd,borderRadius:"14px",padding:"16px",marginBottom:"10px",opacity:.4,display:"flex",alignItems:"center",gap:"14px"}},
          e("span",{style:{fontSize:"22px"}},ph.ic),e("div",null,e("h3",{style:{fontSize:"14px",fontWeight:700}},ph.n),e("p",{style:{fontSize:"11px",color:C.dm}},ph.d)),
          e("span",{style:{fontSize:"9px",padding:"3px 8px",borderRadius:"6px",background:"rgba(255,255,255,.05)",color:C.dm,marginLeft:"auto"}},"Pronto")
        )
      })
    ),

    // ════════════ TRAUMA — UNIDAD 1 (NATIVE) ════════════
    vista==="trauma-u1"&&e(TraumaView,{widgets:traumaWidgets,onBackRef:traumaBackRef}),

    // ════════════ VOCABULARIO MÉDICO (NATIVE) ════════════
    vista==="vocabulario"&&e(VocabularioView),

    // ════════════ MEDIADORES DE LA INFLAMACIÓN ════════════
    vista==="mediadores"&&e(MediadoresView),

    // ════════════ SALUD MENTAL II (NATIVE · IIFE-scoped) ════════════
    // onHome       — ECEPT's go("home"), kept for completeness.
    // onBackRef    — registered by SM so the FAB ← defers to SM's internal stack.
    // onViewChange — SM calls this on every internal view change so ECEPT can
    //                render the deeper breadcrumb. Module itself is headless.
    // className "sm-root" scopes the SM-specific CSS (.prose + button resets).
    vista==="salud_mental"&&e("div",{className:"sm-root"},e(SaludMentalView,{onHome:function(){go("home")},onBackRef:smBackRef,onViewChange:onSmViewChange})),

    // ════════════ QUEMADURAS ════════════
    vista==="cir_quem"&&e(F,null,
      e("div",{style:{textAlign:"center",marginBottom:"32px"}},
        e("span",{style:{display:"inline-block",fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:"#ef4444",background:"rgba(239,68,68,.15)",border:"1px solid rgba(239,68,68,.3)",padding:"5px 14px",borderRadius:"4px",marginBottom:"12px"}},"Emergenciología"),
        e("h2",{style:{fontFamily:"'Playfair Display',serif",fontSize:"24px",fontWeight:800,color:C.tx}},"Algoritmo de Quemaduras"),
        e("p",{style:{color:C.dm,fontSize:"13px"}},"Abordaje sistemático paso a paso · Incluye calculadoras clínicas")
      ),
      QUEM_PASOS.map(function(paso,i){
        return e("div",{key:i,style:{marginBottom:"20px",animation:"slideUp .4s ease-out "+(i*0.08)+"s both"}},
          e("div",{style:{background:C.cd,border:"1px solid "+C.bd,borderRadius:"12px",padding:"20px",borderLeft:"3px solid "+paso.col}},
            e("div",{style:{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:paso.col,marginBottom:"8px",fontWeight:700}},"Paso "+paso.n),
            e("h3",{style:{fontSize:"16px",fontWeight:700,marginBottom:"12px",color:C.tx}},paso.t),
            e("div",{style:{display:"flex",flexDirection:"column",gap:"6px"}},paso.items.map(function(it,j){
              return e("div",{key:j,style:{display:"flex",gap:"8px",alignItems:"flex-start",fontSize:"13px",color:C.mt,lineHeight:1.6}},e("span",{style:{color:paso.col,flexShrink:0}},"→"),e("span",null,it))
            })),
            paso.alerta&&e("div",{style:{marginTop:"12px",padding:"10px 14px",borderRadius:"8px",fontSize:"12px",background:paso.col+"10",border:"1px solid "+paso.col+"30",color:paso.col+"dd",lineHeight:1.5}},paso.alerta)
          )
        )
      }),
      e("div",{style:{textAlign:"center",fontSize:"11px",color:C.dm,marginTop:"16px",marginBottom:"32px"}},"Basado en guías ATLS, ABA y ABLS · Solo fines educativos"),

      // ═══ CALCULADORAS ═══
      e("div",{style:{marginTop:"8px"}},
        e("h2",{style:{fontFamily:"'Playfair Display',serif",fontSize:"20px",fontWeight:800,color:"#f59e0b",textAlign:"center",marginBottom:"20px"}},"🧮 Calculadoras Clínicas"),

        // CALCULADORA PARKLAND
        e("div",{style:{background:"linear-gradient(135deg,"+C.cd+",rgba(245,158,11,.04))",border:"1px solid rgba(245,158,11,.25)",borderRadius:"16px",padding:"22px",marginBottom:"16px"}},
          e("div",{style:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"16px"}},
            e("span",{style:{fontSize:"24px"}},"🔥"),
            e("div",null,
              e("h3",{style:{fontSize:"16px",fontWeight:700,color:"#f59e0b"}},"Fórmula de Parkland"),
              e("p",{style:{fontSize:"11px",color:C.dm}},"4 mL × Peso (kg) × %SCQ = Volumen total en 24h")
            )
          ),
          e("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}},
            e("div",null,
              e("label",{style:{fontSize:"11px",fontWeight:700,color:C.mt,display:"block",marginBottom:"6px"}},"Peso (kg)"),
              e("input",{type:"number",value:calcPeso||"",onChange:function(ev){setCalcPeso(Number(ev.target.value))},placeholder:"70",style:{width:"100%",padding:"12px 14px",background:"rgba(255,255,255,.06)",border:"1px solid "+C.bd,borderRadius:"10px",color:C.tx,fontSize:"18px",fontWeight:700,outline:"none",textAlign:"center"}})
            ),
            e("div",null,
              e("label",{style:{fontSize:"11px",fontWeight:700,color:C.mt,display:"block",marginBottom:"6px"}},"% SCQ (superficie quemada)"),
              e("input",{type:"number",value:calcSCQ||"",onChange:function(ev){setCalcSCQ(Number(ev.target.value))},placeholder:"30",style:{width:"100%",padding:"12px 14px",background:"rgba(255,255,255,.06)",border:"1px solid "+C.bd,borderRadius:"10px",color:C.tx,fontSize:"18px",fontWeight:700,outline:"none",textAlign:"center"}})
            )
          ),
          (calcPeso>0&&calcSCQ>0)?e("div",{style:{background:"rgba(0,0,0,.3)",borderRadius:"12px",padding:"18px"}},
            e("div",{style:{textAlign:"center",marginBottom:"14px"}},
              e("div",{style:{fontSize:"11px",color:C.dm,textTransform:"uppercase",letterSpacing:"1px",marginBottom:"4px"}},"Volumen total 24h"),
              e("div",{style:{fontSize:"32px",fontWeight:900,color:"#f59e0b",fontFamily:"monospace"}},Math.round(4*calcPeso*calcSCQ)+" mL"),
              e("div",{style:{fontSize:"13px",color:C.mt,marginTop:"4px"}},"= "+(4*calcPeso*calcSCQ/1000).toFixed(1)+" litros de Ringer Lactato")
            ),
            e("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}},
              e("div",{style:{padding:"14px",background:"rgba(239,68,68,.08)",borderRadius:"10px",borderLeft:"3px solid #ef4444",textAlign:"center"}},
                e("div",{style:{fontSize:"10px",fontWeight:700,color:"#ef4444",marginBottom:"4px"}},"1ª MITAD → 8 HORAS"),
                e("div",{style:{fontSize:"24px",fontWeight:800,color:C.tx,fontFamily:"monospace"}},Math.round(4*calcPeso*calcSCQ/2)+" mL"),
                e("div",{style:{fontSize:"12px",color:C.mt,marginTop:"4px"}},Math.round(4*calcPeso*calcSCQ/2/8)+" mL/h"),
                e("div",{style:{fontSize:"11px",color:"#ef4444",marginTop:"2px"}},"≈ "+Math.round(4*calcPeso*calcSCQ/2/8*20/60)+" gotas/min")
              ),
              e("div",{style:{padding:"14px",background:"rgba(59,130,246,.08)",borderRadius:"10px",borderLeft:"3px solid #3b82f6",textAlign:"center"}},
                e("div",{style:{fontSize:"10px",fontWeight:700,color:"#3b82f6",marginBottom:"4px"}},"2ª MITAD → 16 HORAS"),
                e("div",{style:{fontSize:"24px",fontWeight:800,color:C.tx,fontFamily:"monospace"}},Math.round(4*calcPeso*calcSCQ/2)+" mL"),
                e("div",{style:{fontSize:"12px",color:C.mt,marginTop:"4px"}},Math.round(4*calcPeso*calcSCQ/2/16)+" mL/h"),
                e("div",{style:{fontSize:"11px",color:"#3b82f6",marginTop:"2px"}},"≈ "+Math.round(4*calcPeso*calcSCQ/2/16*20/60)+" gotas/min")
              )
            ),
            e("div",{style:{marginTop:"10px",padding:"10px",background:"rgba(245,158,11,.08)",borderRadius:"8px",textAlign:"center"}},
              e("span",{style:{fontSize:"11px",color:"#f59e0b"}},"📌 Meta diuresis: Adulto 0.5-1 mL/kg/h ("+Math.round(calcPeso*0.5)+"-"+calcPeso+" mL/h) · Eléctrica: 1-2 mL/kg/h"))
          ):e("div",{style:{textAlign:"center",padding:"20px",color:C.dm,fontSize:"13px"}},"Ingresá peso y %SCQ para calcular")
        ),

        // CALCULADORA DE GOTEO
        e("div",{style:{background:"linear-gradient(135deg,"+C.cd+",rgba(59,130,246,.04))",border:"1px solid rgba(59,130,246,.25)",borderRadius:"16px",padding:"22px",marginBottom:"16px"}},
          e("div",{style:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"16px"}},
            e("span",{style:{fontSize:"24px"}},"💧"),
            e("div",null,
              e("h3",{style:{fontSize:"16px",fontWeight:700,color:"#3b82f6"}},"Calculadora de Goteo"),
              e("p",{style:{fontSize:"11px",color:C.dm}},"20 gotas = 1 mL · Convertí gotas/min ↔ mL/h ↔ litros totales")
            )
          ),
          e("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}},
            e("div",null,
              e("label",{style:{fontSize:"11px",fontWeight:700,color:C.mt,display:"block",marginBottom:"6px"}},"Gotas por minuto"),
              e("input",{type:"number",value:calcGotas||"",onChange:function(ev){setCalcGotas(Number(ev.target.value))},placeholder:"7",style:{width:"100%",padding:"12px 14px",background:"rgba(255,255,255,.06)",border:"1px solid "+C.bd,borderRadius:"10px",color:C.tx,fontSize:"18px",fontWeight:700,outline:"none",textAlign:"center"}})
            ),
            e("div",null,
              e("label",{style:{fontSize:"11px",fontWeight:700,color:C.mt,display:"block",marginBottom:"6px"}},"Horas de infusión"),
              e("input",{type:"number",value:calcHoras||"",onChange:function(ev){setCalcHoras(Number(ev.target.value))},placeholder:"24",style:{width:"100%",padding:"12px 14px",background:"rgba(255,255,255,.06)",border:"1px solid "+C.bd,borderRadius:"10px",color:C.tx,fontSize:"18px",fontWeight:700,outline:"none",textAlign:"center"}})
            )
          ),
          (calcGotas>0&&calcHoras>0)?e("div",{style:{background:"rgba(0,0,0,.3)",borderRadius:"12px",padding:"18px"}},
            e("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"14px"}},
              e("div",{style:{textAlign:"center",padding:"14px",background:"rgba(59,130,246,.08)",borderRadius:"10px"}},
                e("div",{style:{fontSize:"10px",fontWeight:700,color:"#3b82f6",marginBottom:"4px"}},"mL por hora"),
                e("div",{style:{fontSize:"24px",fontWeight:800,color:C.tx,fontFamily:"monospace"}},(calcGotas*60/20).toFixed(1)),
                e("div",{style:{fontSize:"10px",color:C.dm,marginTop:"2px"}},calcGotas+" gts × 60 min ÷ 20")
              ),
              e("div",{style:{textAlign:"center",padding:"14px",background:"rgba(52,211,153,.08)",borderRadius:"10px"}},
                e("div",{style:{fontSize:"10px",fontWeight:700,color:"#34d399",marginBottom:"4px"}},"mL totales"),
                e("div",{style:{fontSize:"24px",fontWeight:800,color:C.tx,fontFamily:"monospace"}},Math.round(calcGotas*60/20*calcHoras)),
                e("div",{style:{fontSize:"10px",color:C.dm,marginTop:"2px"}},(calcGotas*60/20).toFixed(1)+" × "+calcHoras+"h")
              ),
              e("div",{style:{textAlign:"center",padding:"14px",background:"rgba(245,158,11,.08)",borderRadius:"10px"}},
                e("div",{style:{fontSize:"10px",fontWeight:700,color:"#f59e0b",marginBottom:"4px"}},"Litros totales"),
                e("div",{style:{fontSize:"24px",fontWeight:800,color:"#f59e0b",fontFamily:"monospace"}},(calcGotas*60/20*calcHoras/1000).toFixed(2)),
                e("div",{style:{fontSize:"10px",color:C.dm,marginTop:"2px"}},Math.round(calcGotas*60/20*calcHoras)+" mL ÷ 1000")
              )
            ),
            // Quick reference table
            e("div",{style:{padding:"12px",background:"rgba(255,255,255,.03)",borderRadius:"10px",border:"1px solid "+C.bd}},
              e("div",{style:{fontSize:"10px",fontWeight:700,color:C.dm,marginBottom:"8px",textTransform:"uppercase"}},"📋 Tabla rápida — gotas/min × 24h"),
              e("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"6px",fontSize:"11px"}},
                e("div",{style:{fontWeight:700,color:C.ac,padding:"6px",textAlign:"center",background:"rgba(59,130,246,.08)",borderRadius:"6px"}},"gts/min"),
                e("div",{style:{fontWeight:700,color:C.ac,padding:"6px",textAlign:"center",background:"rgba(59,130,246,.08)",borderRadius:"6px"}},"mL/h"),
                e("div",{style:{fontWeight:700,color:C.ac,padding:"6px",textAlign:"center",background:"rgba(59,130,246,.08)",borderRadius:"6px"}},"mL/24h"),
                e("div",{style:{fontWeight:700,color:C.ac,padding:"6px",textAlign:"center",background:"rgba(59,130,246,.08)",borderRadius:"6px"}},"L/24h"),
                [7,14,21,28,35,42].map(function(g){
                  var mlh=g*60/20;var ml24=mlh*24;
                  return e(F,{key:g},
                    e("div",{style:{padding:"6px",textAlign:"center",color:g===7?"#f59e0b":C.tx,fontWeight:g===7?700:400,fontFamily:"monospace"}},g),
                    e("div",{style:{padding:"6px",textAlign:"center",color:C.mt,fontFamily:"monospace"}},mlh),
                    e("div",{style:{padding:"6px",textAlign:"center",color:C.mt,fontFamily:"monospace"}},Math.round(ml24)),
                    e("div",{style:{padding:"6px",textAlign:"center",color:g===7?"#f59e0b":C.mt,fontWeight:g===7?700:400,fontFamily:"monospace"}},(ml24/1000).toFixed(1))
                  )
                })
              ),
              e("div",{style:{marginTop:"8px",padding:"8px",background:"rgba(245,158,11,.08)",borderRadius:"6px",textAlign:"center"}},
                e("span",{style:{fontSize:"11px",color:"#f59e0b",fontWeight:600}},"📌 7 gotas/min × 24h ≈ 504 mL ≈ ½ litro (tu docente redondea a 1L, la práctica real da ~500mL)")
              )
            )
          ):e("div",{style:{textAlign:"center",padding:"20px",color:C.dm,fontSize:"13px"}},"Ingresá gotas/min y horas para calcular")
        )
      )
    ),

    // ════════════ ANATOMÍA INGUINAL ════════════
    vista==="cir_ing"&&e(F,null,
      e("div",{style:{textAlign:"center",marginBottom:"24px"}},e("div",{style:{fontSize:"40px",marginBottom:"8px"}},"🧱"),e("h2",{style:{fontFamily:"'Playfair Display',serif",fontSize:"22px",fontWeight:800,color:"#f59e0b"}},"Anatomía Inguinal"),e("p",{style:{color:C.dm,fontSize:"13px"}},"Conducto · Anillos · Cordón Espermático")),
      // Tabs
      e("div",{style:{display:"flex",gap:"6px",marginBottom:"20px",flexWrap:"wrap"}},
        [{l:"🧱 Conducto",i:0},{l:"🔵 Superficial",i:1},{l:"🔴 Profundo",i:2},{l:"🧬 Cordón",i:3}].map(function(tb){
          var cols=["#f59e0b","#3b82f6","#ef4444","#a855f7"];
          return e("button",{key:tb.i,onClick:function(){setIngTab(tb.i)},style:{
            flex:1,minWidth:"70px",padding:"10px 8px",background:"transparent",
            border:"1.5px solid "+(ingTab===tb.i?cols[tb.i]:C.bd),borderRadius:"10px",
            cursor:"pointer",fontSize:"12px",fontWeight:700,color:ingTab===tb.i?cols[tb.i]:C.dm,
            transition:"all .2s"
          }},tb.l)
        })
      ),
      // Conducto
      ingTab===0&&e(F,null,
        ING_PAREDES.map(function(w,i){
          return e("div",{key:i,style:{background:C.cd,borderRadius:"10px",padding:"14px",marginBottom:"10px",borderLeft:"3px solid "+w.color}},
            e("div",{style:{fontSize:"13px",fontWeight:800,color:w.color}},w.nombre),
            e("div",{style:{fontSize:"14px",fontWeight:600,color:C.tx,margin:"4px 0"}},w.estructura),
            e("div",{style:{fontSize:"12px",color:C.dm,lineHeight:1.5}},w.detalle)
          )
        })
      ),
      // Superficial
      ingTab===1&&e(F,null,
        e("div",{style:cb},e("div",{style:{fontSize:"12px",color:C.ac,fontWeight:700,marginBottom:"4px"}},"FORMACIÓN"),e("p",{style:{fontSize:"13px",lineHeight:1.6}},ING_SUPERFICIAL.formacion)),
        e("div",{style:cb},e("div",{style:{fontSize:"12px",color:C.ac,fontWeight:700,marginBottom:"10px"}},"LOS 3 PILARES"),
          ING_SUPERFICIAL.pilares.map(function(p,i){return e("div",{key:i,style:{borderLeft:"3px solid "+p.c,padding:"8px 12px",marginBottom:"8px"}},e("div",{style:{fontSize:"12px",fontWeight:700,color:p.c}},p.n),e("div",{style:{fontSize:"11px",color:C.dm,marginTop:"2px"}},p.d))})
        ),
        e("div",{style:{padding:"14px",background:"rgba(59,130,246,.07)",border:"1px solid rgba(59,130,246,.2)",borderRadius:"12px"}},e("div",{style:{fontSize:"11px",fontWeight:700,color:C.ac,marginBottom:"4px"}},"🩺 CLÍNICA"),e("p",{style:{fontSize:"12px",lineHeight:1.6}},ING_SUPERFICIAL.clinica))
      ),
      // Profundo
      ingTab===2&&e(F,null,
        e("div",{style:cb},e("div",{style:{fontSize:"12px",color:"#ef4444",fontWeight:700,marginBottom:"4px"}},"FORMACIÓN"),e("p",{style:{fontSize:"13px",lineHeight:1.6}},ING_PROFUNDO.formacion)),
        e("div",{style:cb},e("div",{style:{fontSize:"12px",color:"#ef4444",fontWeight:700,marginBottom:"10px"}},"COMPONENTES"),
          ING_PROFUNDO.componentes.map(function(c2,i){return e("div",{key:i,style:{borderLeft:"3px solid "+c2.c,padding:"8px 12px",marginBottom:"8px"}},e("div",{style:{fontSize:"12px",fontWeight:700,color:c2.c}},c2.n),e("div",{style:{fontSize:"11px",color:C.dm,marginTop:"2px"}},c2.d))})
        ),
        e("div",{style:{background:C.cd,borderRadius:"12px",padding:"14px",border:"1px solid "+C.bd,marginBottom:"12px"}},e("div",{style:{fontSize:"11px",fontWeight:700,color:"#f59e0b",marginBottom:"4px"}},"📍 UBICACIÓN"),e("p",{style:{fontSize:"13px",fontWeight:600}},ING_PROFUNDO.ubicacion)),
        e("div",{style:{padding:"14px",background:"rgba(239,68,68,.07)",border:"1px solid rgba(239,68,68,.2)",borderRadius:"12px"}},e("div",{style:{fontSize:"11px",fontWeight:700,color:"#ef4444",marginBottom:"4px"}},"🩺 CLÍNICA — ¡OJO EXAMEN!"),e("p",{style:{fontSize:"12px",lineHeight:1.6}},ING_PROFUNDO.clinica))
      ),
      // Cordón
      ingTab===3&&e(F,null,
        e("div",{style:cb},e("div",{style:{fontSize:"12px",color:"#a855f7",fontWeight:700,marginBottom:"10px"}},"COMPONENTES DEL CORDÓN"),
          ING_CORDON.elementos.map(function(el,i){return e("div",{key:i,style:{borderLeft:"3px solid "+el.c,padding:"10px 12px",marginBottom:"8px",background:el.c+"08",borderRadius:"0 8px 8px 0"}},
            e("div",{style:{display:"flex",alignItems:"center",gap:"8px"}},e("span",{style:{color:el.c,fontSize:"16px"}},el.ic),e("span",{style:{fontSize:"12px",fontWeight:700,color:el.c}},el.n)),
            e("div",{style:{fontSize:"11px",color:C.dm,marginTop:"4px",lineHeight:1.5}},el.d)
          )})
        ),
        e("div",{style:{padding:"14px",background:"rgba(16,185,129,.07)",border:"1px solid rgba(16,185,129,.2)",borderRadius:"12px"}},e("div",{style:{fontSize:"11px",fontWeight:700,color:"#b00ebc",marginBottom:"4px"}},"♀ En la mujer:"),e("p",{style:{fontSize:"12px",lineHeight:1.6}},ING_CORDON.nota_mujer))
      )
    ),
    
    // ════════════ ANATOMÍA (PARES CRANEALES) ════════════
    vista==="anatomia"&&e(F,null,
      e("div",{style:{textAlign:"center",marginBottom:"24px"}},e("div",{style:{fontSize:"40px",marginBottom:"8px"}},"🩻"),e("h2",{style:{fontFamily:"'Playfair Display',serif",fontSize:"22px",fontWeight:800,color:"#f59e0b"}},"Anatomía"),e("p",{style:{color:C.dm,fontSize:"13px"}},"Pares Craneales · Origen, función y clínica")),
      // Interactive brain map (collapsible)
      e("div",{style:{marginBottom:"16px"}},
        e("div",{onClick:function(){setAbdOpen(abdOpen==="mapa_nc"?null:"mapa_nc")},style:{background:C.cd,border:"1px solid "+(abdOpen==="mapa_nc"?"#a78bfa44":C.bd),borderRadius:"14px",padding:"16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}},
          e("div",{style:{display:"flex",alignItems:"center",gap:"10px"}},e("span",{style:{fontSize:"20px"}},"🧠"),e("div",null,e("span",{style:{fontSize:"14px",fontWeight:700,color:"#a78bfa"}},"Mapa Interactivo de Pares Craneales"),e("p",{style:{fontSize:"11px",color:C.dm,margin:"2px 0 0"}},"Vista inferior del encéfalo — toca un nervio para explorar"))),
          e("span",{style:{color:C.dm,transform:abdOpen==="mapa_nc"?"rotate(180deg)":"none",transition:"transform .2s"}},"▼")
        ),
        abdOpen==="mapa_nc"&&e("div",{style:{marginTop:"10px"}},e(NervesMap,null))
      ),
      NERVES.map(function(n,i){
        var isExp2=abdExp["nc_"+n.id];
        return e("div",{key:n.id,style:{background:C.cd,border:"1px solid "+(isExp2?n.color+"44":C.bd),borderRadius:"12px",marginBottom:"8px",overflow:"hidden",animation:"fadeIn .3s ease"}},
          e("div",{onClick:function(){var nw={};for(var k in abdExp)nw[k]=abdExp[k];nw["nc_"+n.id]=!isExp2;setAbdExp(nw)},style:{padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:"12px"}},
            e("span",{style:{fontFamily:"'Playfair Display',serif",fontSize:"20px",fontWeight:900,color:n.color,minWidth:"36px"}},n.id),
            e("div",{style:{flex:1}},
              e("div",{style:{fontWeight:700,fontSize:"14px",color:C.tx}},n.name),
              e("div",{style:{fontSize:"11px",color:C.dm,fontStyle:"italic"}},n.latin)
            ),
            e("div",{style:{display:"flex",gap:"4px",flexWrap:"wrap"}},n.tipos.map(function(t,ti){
              var tc2={"Sensitivo especial":"#60a5fa","Motor somático":"#34d399","Motor":"#34d399","Sensitivo":"#60a5fa","Parasimpático":"#a78bfa","Mixto":"#f97316"};
              return e("span",{key:ti,style:{fontSize:"9px",padding:"2px 8px",borderRadius:"100px",background:(tc2[t]||"#94a3b8")+"15",color:tc2[t]||"#94a3b8",border:"1px solid "+(tc2[t]||"#94a3b8")+"30"}},t)
            })),
            e("span",{style:{color:C.dm,fontSize:"12px",transform:isExp2?"rotate(180deg)":"none",transition:"transform .2s"}},"▾")
          ),
          isExp2&&e("div",{style:{padding:"0 16px 16px",borderTop:"1px solid "+C.bd}},
            e("div",{style:{padding:"12px 14px",background:n.color+"08",borderRadius:"8px",borderLeft:"3px solid "+n.color,margin:"12px 0",fontSize:"13px",color:C.tx,lineHeight:1.7}},n.funcion),
            e("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}},
              e("div",{style:{padding:"10px",background:"rgba(255,255,255,.03)",borderRadius:"8px"}},e("div",{style:{fontSize:"10px",fontWeight:700,color:C.dm,marginBottom:"3px"}},"ORIGEN REAL"),e("div",{style:{fontSize:"11px",color:C.mt,lineHeight:1.5}},n.real)),
              e("div",{style:{padding:"10px",background:"rgba(255,255,255,.03)",borderRadius:"8px"}},e("div",{style:{fontSize:"10px",fontWeight:700,color:C.dm,marginBottom:"3px"}},"ORIGEN APARENTE"),e("div",{style:{fontSize:"11px",color:C.mt,lineHeight:1.5}},n.origen_aparente)),
              e("div",{style:{padding:"10px",background:"rgba(255,255,255,.03)",borderRadius:"8px",gridColumn:"1 / -1"}},e("div",{style:{fontSize:"10px",fontWeight:700,color:C.dm,marginBottom:"3px"}},"LESIÓN"),e("div",{style:{fontSize:"11px",color:"#ef4444",lineHeight:1.5}},n.lesion))
            )
          )
        )
      })
    ),

    // ════════════ LABORATORIOS ════════════
    vista==="labs"&&e(F,null,
      e("div",{style:{textAlign:"center",marginBottom:"24px"}},e("div",{style:{fontSize:"40px",marginBottom:"8px"}},"📊"),e("h2",{style:{fontFamily:"'Playfair Display',serif",fontSize:"22px",fontWeight:800,color:"#4caf82"}},"Valores de Laboratorio"),e("p",{style:{color:C.dm,fontSize:"13px"}},"Rangos normales e interpretación clínica")),
      LAB_SECTIONS.map(function(sec,si){
        var isOpen=abdOpen===sec.id;
        return e("div",{key:sec.id,style:{marginBottom:"12px",animation:"slideUp .4s ease-out "+(si*0.05)+"s both"}},
          e("button",{onClick:function(){setAbdOpen(isOpen?null:sec.id)},style:{width:"100%",textAlign:"left",borderRadius:"12px",padding:"16px",cursor:"pointer",background:isOpen?sec.accent+"12":C.cd,border:"1px solid "+(isOpen?sec.accent+"44":C.bd),color:C.tx,fontSize:"14px"}},
            e("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"}},
              e("div",{style:{display:"flex",alignItems:"center",gap:"12px"}},e("span",{style:{fontSize:"20px"}},sec.icon),e("div",null,e("div",{style:{fontWeight:700}},sec.label),e("div",{style:{fontSize:"11px",color:C.dm,marginTop:"2px"}},sec.subtitle))),
              e("div",{style:{display:"flex",alignItems:"center",gap:"8px"}},e("span",{style:{fontSize:"10px",padding:"2px 8px",borderRadius:"10px",background:"rgba(255,255,255,.06)",color:C.dm}},sec.analytes.length+" analitos"),e("span",{style:{color:C.dm,transform:isOpen?"rotate(180deg)":"none",transition:"transform .2s"}},"▼"))
            )
          ),
          isOpen&&e("div",{style:{marginTop:"8px",display:"flex",flexDirection:"column",gap:"8px"}},
            sec.analytes.map(function(an,ai){
              var akey=sec.id+"-"+ai;var aExp=abdExp[akey];
              return e("div",{key:ai,style:{background:C.cd,border:"1px solid "+C.bd,borderRadius:"10px",overflow:"hidden"}},
                e("button",{onClick:function(){var nw={};for(var k in abdExp)nw[k]=abdExp[k];nw[akey]=!aExp;setAbdExp(nw)},style:{width:"100%",textAlign:"left",padding:"14px 18px",cursor:"pointer",background:"none",border:"none",color:C.tx,display:"flex",alignItems:"center",gap:"14px"}},
                  e("span",{style:{width:"6px",height:"6px",borderRadius:"50%",background:sec.accent,flexShrink:0}}),
                  e("span",{style:{flex:1,fontSize:"14px",fontWeight:500}},an.name),
                  e("span",{style:{fontSize:"11px",color:C.mt,background:"rgba(255,255,255,.04)",padding:"4px 10px",borderRadius:"5px",border:"1px solid "+C.bd,flexShrink:0,maxWidth:"200px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},an.range),
                  e("span",{style:{color:C.dm,fontSize:"11px",transform:aExp?"rotate(180deg)":"none",transition:"transform .2s",flexShrink:0}},"▾")
                ),
                aExp&&e("div",{style:{padding:"0 18px 16px",borderTop:"1px solid "+C.bd}},
                  e("div",{style:{fontSize:"13px",color:C.mt,lineHeight:1.65,padding:"14px 0 12px",borderBottom:"1px solid "+C.bd},dangerouslySetInnerHTML:{__html:an.note}}),
                  (an.up||an.down)&&e("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginTop:"12px"}},
                    an.up&&e("div",{style:{background:"rgba(255,255,255,.03)",borderRadius:"8px",padding:"12px 14px",borderLeft:"3px solid #e05252"}},
                      e("div",{style:{fontSize:"10px",fontWeight:700,color:"#e05252",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:"8px"}},"▲ Se eleva en"),
                      e("div",{style:{display:"flex",flexDirection:"column",gap:"5px"}},an.up.map(function(u,ui){return e("div",{key:ui,style:{fontSize:"12px",color:C.mt,lineHeight:1.4,paddingLeft:"12px",position:"relative"}},e("span",{style:{position:"absolute",left:0,color:C.dm,fontSize:"10px"}},"—"),u)}))
                    ),
                    an.down&&e("div",{style:{background:"rgba(255,255,255,.03)",borderRadius:"8px",padding:"12px 14px",borderLeft:"3px solid #5b8dee"}},
                      e("div",{style:{fontSize:"10px",fontWeight:700,color:"#5b8dee",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:"8px"}},"▼ Disminuye en"),
                      e("div",{style:{display:"flex",flexDirection:"column",gap:"5px"}},an.down.map(function(d2,di){return e("div",{key:di,style:{fontSize:"12px",color:C.mt,lineHeight:1.4,paddingLeft:"12px",position:"relative"}},e("span",{style:{position:"absolute",left:0,color:C.dm,fontSize:"10px"}},"—"),d2)}))
                    )
                  )
                )
              )
            })
          )
        )
      })
    ),



    // ════════════ FISIOLOGÍA ════════════
    vista==="fisio"&&e(F,null,e(FisiologiaHub,null)),

    // ════════════ RECEPTORES CELULARES ════════════
    vista==="receptores"&&e(ReceptoresView,null),

    // ════════════ CASCADA DE COAGULACIÓN ════════════
    vista==="coagulacion"&&e(CoagulacionView,{go:go}),


    // ════════════ IMÁGENES DIAGNÓSTICAS (VACÍA) ════════════
    vista==="imagenes"&&e(F,null,
      e("div",{style:{textAlign:"center",padding:"60px 20px"}},
        e("div",{style:{fontSize:"56px",marginBottom:"16px",opacity:.3}},"📷"),
        e("h2",{style:{fontFamily:"'Playfair Display',serif",fontSize:"22px",fontWeight:800,color:"#06b6d4",marginBottom:"12px"}},"Imágenes Diagnósticas"),
        e("p",{style:{color:C.dm,fontSize:"14px",maxWidth:"400px",margin:"0 auto",lineHeight:1.6}},"Radiografías, Ecografías, Tomografías y Resonancias organizadas por región anatómica y patología."),
        e("div",{style:{marginTop:"24px",padding:"16px 24px",background:C.cd,border:"1px solid "+C.bd,borderRadius:"14px",display:"inline-block"}},
          e("p",{style:{color:C.mt,fontSize:"13px"}},"🚧 Sección en construcción. Se irá completando con imágenes clínicas.")
        )
      )
    ),


        // ════════════ GENERALIDADES ════════════
    vista==="general"&&e(F,null,
      e("div",{style:{textAlign:"center",marginBottom:"28px"}},e("div",{style:{fontSize:"40px",marginBottom:"8px"}},"📚"),e("h2",{style:{fontFamily:"'Playfair Display',serif",fontSize:"22px",fontWeight:800,color:"#8b5cf6"}},"Generalidades"),e("p",{style:{color:C.dm,fontSize:"13px"}},"Contenidos transversales para toda la carrera")),
      // Bases Inmunológicas
      e("div",{style:{marginBottom:"24px"}},
        e("div",{onClick:function(){setAbdOpen(abdOpen==="inmuno"?null:"inmuno")},style:{background:C.cd,border:"1px solid "+(abdOpen==="inmuno"?"#3b82f644":C.bd),borderRadius:"14px",padding:"18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}},
          e("div",{style:{display:"flex",alignItems:"center",gap:"12px"}},e("span",{style:{fontSize:"24px"}},"🛡️"),e("div",null,e("h3",{style:{fontSize:"16px",fontWeight:700,color:"#3b82f6"}},"Bases Inmunológicas"),e("p",{style:{fontSize:"11px",color:C.dm}},"Innata, Adaptativa, Inmunoglobulinas, Citocinas"))),
          e("span",{style:{color:C.dm,transform:abdOpen==="inmuno"?"rotate(180deg)":"none",transition:"transform .2s"}},"▼")
        ),
        abdOpen==="inmuno"&&e("div",{style:{marginTop:"10px"}},
          INT.s.map(function(s2,i){return e("div",{key:i,style:{background:C.cd,border:"1px solid "+C.bd,borderRadius:"14px",padding:"18px",marginBottom:"10px",borderLeft:"3px solid "+s2.c}},e("div",{style:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}},e("span",{style:{fontSize:"20px"}},s2.i),e("h3",{style:{color:s2.c,fontSize:"15px",fontWeight:700,margin:0}},s2.t)),s2.x&&e("p",{style:{color:C.tx,lineHeight:1.6,marginBottom:"10px",fontSize:"14px"}},s2.x),e(Ls,{items:s2.p,color:s2.c}))})
        )
      ),
      // FACTORES DE COAGULACIÓN
      e("div",{style:{marginBottom:"24px"}},
        e("div",{onClick:function(){setAbdOpen(abdOpen==="coag"?null:"coag")},style:{background:C.cd,border:"1px solid "+(abdOpen==="coag"?"#ef444444":C.bd),borderRadius:"14px",padding:"18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}},
          e("div",{style:{display:"flex",alignItems:"center",gap:"12px"}},e("span",{style:{fontSize:"24px"}},"🩸"),e("div",null,e("h3",{style:{fontSize:"16px",fontWeight:700,color:"#ef4444"}},"Factores de Coagulación"),e("p",{style:{fontSize:"11px",color:C.dm}},"Cascada intrínseca, extrínseca y común · Quiz"))),
          e("div",{style:{display:"flex",alignItems:"center",gap:"6px"}},
            e(LinkBadge,{to:"lab_coag",go:go}),
            e("span",{style:{color:C.dm,transform:abdOpen==="coag"?"rotate(180deg)":"none",transition:"transform .2s"}},"▼")
          )
        ),
        abdOpen==="coag"&&e("div",{style:{marginTop:"10px"}},
          // Tabla de factores
          e("div",{style:{overflowX:"auto",borderRadius:"12px",border:"1.5px solid "+C.bd,marginBottom:"16px"}},
            e("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:"13px"}},
              e("thead",null,e("tr",{style:{background:C.cd}},e("th",{style:{padding:"10px 14px",textAlign:"left",fontSize:"11px",fontWeight:600,color:C.dm}},"Factor"),e("th",{style:{padding:"10px 14px",textAlign:"left",fontSize:"11px",fontWeight:600,color:C.dm}},"Nombre"),e("th",{style:{padding:"10px 14px",textAlign:"left",fontSize:"11px",fontWeight:600,color:C.dm}},"Sinónimo"),e("th",{style:{padding:"10px 14px",textAlign:"left",fontSize:"11px",fontWeight:600,color:C.dm}},"Vit K"))),
              e("tbody",null,COAG_FACTORES.map(function(f){
                return e("tr",{key:f.num,style:{borderTop:"1px solid "+C.bd,background:f.vk?"rgba(251,191,36,.04)":"transparent"}},
                  e("td",{style:{padding:"10px 14px",fontWeight:800,color:C.tx}},f.num),
                  e("td",{style:{padding:"10px 14px",fontWeight:600,color:C.tx}},f.nombre),
                  e("td",{style:{padding:"10px 14px",color:C.dm}},f.alt||"—"),
                  e("td",{style:{padding:"10px 14px"}},f.vk?e("span",{style:{fontSize:"11px",padding:"2px 8px",borderRadius:"100px",background:"rgba(251,191,36,.15)",color:"#fbbf24",border:"1px solid rgba(251,191,36,.3)",fontWeight:600}},"⚡ Vit K"):e("span",{style:{color:C.dm,fontSize:"12px"}},"—"))
                )
              }))
            )
          ),
          // Cross-link → cascade now lives in Fisiología
          e("div",{onClick:function(){go("coagulacion")},
            style:{marginTop:"4px",padding:"14px 16px",
              background:"linear-gradient(135deg,rgba(220,38,38,.08),rgba(239,68,68,.04))",
              border:"1px solid rgba(220,38,38,.25)",borderRadius:"10px",
              cursor:"pointer",display:"flex",alignItems:"center",gap:"12px",
              transition:"all .2s"}},
            e("span",{style:{fontSize:"22px"}},"🌊"),
            e("div",{style:{flex:1}},
              e("div",{style:{fontSize:"13px",fontWeight:700,color:"#ef4444",marginBottom:"2px"}},"Cascada de Coagulación"),
              e("div",{style:{fontSize:"11px",color:C.dm}},"Vías extrínseca, intrínseca y común · en Fisiología")
            ),
            e("span",{style:{color:"#ef4444",fontSize:"14px"}},"→")
          )
        )
      ),

      // Mediadores de la Inflamación — active card
      e("div",{onClick:function(){go("mediadores")},style:{background:C.cd,border:"1px solid "+C.bd,borderRadius:"14px",padding:"16px",marginBottom:"10px",cursor:"pointer",display:"flex",alignItems:"center",gap:"14px"}},
        e("span",{style:{fontSize:"22px"}},"🔥"),
        e("div",null,e("h3",{style:{fontSize:"14px",fontWeight:700,color:"#ef4444"}},"Mediadores de la Inflamación"),e("p",{style:{fontSize:"11px",color:C.dm}},"Citocinas, eicosanoides, complemento, quininas · 33 mediadores")),
        e("span",{style:{color:C.dm,marginLeft:"auto"}},"›")
      ),

      // Vocabulario Médico — active card
      e("div",{onClick:function(){go("vocabulario")},style:{background:C.cd,border:"1px solid "+C.bd,borderRadius:"14px",padding:"16px",marginBottom:"10px",cursor:"pointer",display:"flex",alignItems:"center",gap:"14px"}},
        e("span",{style:{fontSize:"22px"}},"📖"),
        e("div",null,e("h3",{style:{fontSize:"14px",fontWeight:700}},"Vocabulario Médico"),e("p",{style:{fontSize:"11px",color:C.dm}},"270+ raíces · 13 categorías · Decodificador · Quiz · SVG")),
        e("span",{style:{color:C.dm,marginLeft:"auto"}},"›")
      )
    ),

    // ════════════ EPIDEMIOLOGÍA (SALUD PÚBLICA) ════════════
    vista==="epid"&&e(F,null,
      e("div",{style:{textAlign:"center",marginBottom:"32px"}},
        e("div",{style:{fontSize:"40px",marginBottom:"8px"}},"📊"),
        e("h2",{style:{fontFamily:"'Playfair Display',serif",fontSize:"24px",fontWeight:900,background:"linear-gradient(135deg,#00b4d8,#3b82f6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}},"Epidemiología"),
        e("p",{style:{color:C.dm,fontSize:"13px"}},"Salud Pública · Lectura Crítica · MBE")
      ),
      // Tabs de epidemiología
      e("div",{style:{display:"flex",gap:"6px",marginBottom:"24px",flexWrap:"wrap"}},
        [{l:"🔺 Pirámide",i:0},{l:"📋 Estudios",i:1},{l:"⚠️ Sesgos",i:2},{l:"📐 Medidas",i:3},{l:"✅ Lectura Crítica",i:4}].map(function(tb){
          var cols=["#22d3ee","#3b82f6","#ef4444","#34d399","#06b6d4"];
          return e("button",{key:tb.i,onClick:function(){setIngTab(tb.i)},style:{
            flex:"1 1 auto",minWidth:"80px",padding:"10px 12px",background:"transparent",
            border:"1.5px solid "+(ingTab===tb.i?cols[tb.i]:C.bd),borderRadius:"10px",
            cursor:"pointer",fontSize:"11px",fontWeight:700,color:ingTab===tb.i?cols[tb.i]:C.dm
          }},tb.l)
        })
      ),

      // TAB 0: PIRÁMIDE
      ingTab===0&&e(F,null,
        e("div",{style:{textAlign:"center",marginBottom:"16px"}},e("h3",{style:{fontFamily:"'Playfair Display',serif",fontSize:"18px",fontWeight:800,color:"#22d3ee"}},"Pirámide de Evidencia")),
        e("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",marginBottom:"24px"}},
          PIRAMIDE.map(function(p,i){
            var isOpen=et===i;
            return e("div",{key:i,style:{width:"100%",maxWidth:"600px"}},
              e("div",{onClick:function(){setEt(isOpen?null:i)},style:{
                width:p.ancho,margin:"0 auto",padding:"10px 14px",
                background:isOpen?p.color+"20":p.color+"0a",border:"1.5px solid "+(isOpen?p.color:p.color+"30"),
                borderRadius:i===0?"12px 12px 4px 4px":i===6?"4px 4px 12px 12px":"4px",
                cursor:"pointer",textAlign:"center",transition:"all .2s",position:"relative"
              }},
                e("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}},
                  e("span",{style:{fontSize:"14px"}},p.icono),
                  e("span",{style:{fontSize:"12px",fontWeight:700,color:p.color}},p.nombre)
                ),
                e("div",{style:{fontSize:"9px",color:C.dm,marginTop:"2px"}},"Nivel "+p.nivel)
              ),
              isOpen&&e("div",{style:{width:"90%",margin:"4px auto 8px",background:C.cd,border:"1px solid "+p.color+"30",borderRadius:"10px",padding:"16px"}},
                e("p",{style:{fontSize:"13px",color:C.tx,lineHeight:1.6,marginBottom:"10px"}},p.desc),
                e("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}},
                  e("div",{style:{padding:"10px",background:p.color+"08",borderRadius:"8px",borderLeft:"3px solid "+p.color}},e("div",{style:{fontSize:"10px",fontWeight:700,color:p.color,marginBottom:"4px"}},"¿PARA QUÉ SIRVE?"),e("p",{style:{fontSize:"11px",color:C.mt,lineHeight:1.5}},p.para)),
                  e("div",{style:{padding:"10px",background:"rgba(255,255,255,.02)",borderRadius:"8px",borderLeft:"3px solid "+C.dm}},e("div",{style:{fontSize:"10px",fontWeight:700,color:C.dm,marginBottom:"4px"}},"MEDIDA QUE USA"),e("p",{style:{fontSize:"11px",color:C.mt,lineHeight:1.5}},p.medida))
                ),
                e("div",{style:{marginTop:"8px",padding:"10px",background:"rgba(255,255,255,.02)",borderRadius:"8px"}},e("span",{style:{fontSize:"10px",fontWeight:700,color:C.dm}},"EJEMPLO: "),e("span",{style:{fontSize:"11px",color:C.mt}},p.ejemplo))
              )
            )
          })
        )
      ),

      // TAB 1: ESTUDIOS DETALLADOS
      ingTab===1&&e(F,null,
        ESTUDIOS.map(function(est,i){
          var isOpen=abdOpen===est.nombre;
          return e("div",{key:i,style:{marginBottom:"12px",animation:"slideUp .3s ease-out "+(i*0.06)+"s both"}},
            e("button",{onClick:function(){setAbdOpen(isOpen?null:est.nombre)},style:{width:"100%",textAlign:"left",borderRadius:"12px",padding:"16px",cursor:"pointer",background:isOpen?est.col+"10":C.cd,border:"1px solid "+(isOpen?est.col+"44":C.bd),color:C.tx}},
              e("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"}},
                e("div",{style:{display:"flex",alignItems:"center",gap:"12px"}},
                  e("span",{style:{fontSize:"22px"}},est.ic),
                  e("div",null,e("div",{style:{fontWeight:700,fontSize:"15px"}},est.nombre),e("div",{style:{fontSize:"11px",color:est.col,marginTop:"2px",fontWeight:600}},est.tipo+" · "+est.temporal))
                ),
                e("span",{style:{color:C.dm,transform:isOpen?"rotate(180deg)":"none",transition:"transform .2s"}},"▼")
              )
            ),
            isOpen&&e("div",{style:{marginTop:"8px",background:C.cd,border:"1px solid "+C.bd,borderRadius:"12px",padding:"18px"}},
              e("p",{style:{fontSize:"13px",color:C.tx,lineHeight:1.7,marginBottom:"14px"}},est.def),
              e("div",{style:{padding:"10px 14px",background:est.col+"08",borderRadius:"8px",borderLeft:"3px solid "+est.col,marginBottom:"12px"}},e("div",{style:{fontSize:"10px",fontWeight:700,color:est.col,marginBottom:"4px"}},"PREGUNTA QUE RESPONDE"),e("p",{style:{fontSize:"13px",color:C.tx,fontWeight:600}},est.pregunta)),
              e("div",{style:{padding:"10px 14px",background:"rgba(255,255,255,.02)",borderRadius:"8px",marginBottom:"12px"}},e("div",{style:{fontSize:"10px",fontWeight:700,color:C.dm,marginBottom:"4px"}},"MEDIDA PRINCIPAL"),e("p",{style:{fontSize:"13px",color:C.mt}},est.medidas)),
              e("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}},
                e("div",{style:{padding:"12px",background:"rgba(52,211,153,.06)",borderRadius:"8px",borderLeft:"3px solid #34d399"}},e("div",{style:{fontSize:"10px",fontWeight:700,color:"#34d399",marginBottom:"6px"}},"✓ VENTAJAS"),e(Ls,{items:est.ventajas,color:"#34d399"})),
                e("div",{style:{padding:"12px",background:"rgba(239,68,68,.06)",borderRadius:"8px",borderLeft:"3px solid #ef4444"}},e("div",{style:{fontSize:"10px",fontWeight:700,color:"#ef4444",marginBottom:"6px"}},"✗ LIMITACIONES"),e(Ls,{items:est.limitaciones,color:"#ef4444"}))
              )
            )
          )
        })
      ),

      // TAB 2: SESGOS
      ingTab===2&&e(F,null,
        SESGOS.map(function(sg,i){
          return e("div",{key:i,style:{background:C.cd,border:"1px solid "+C.bd,borderRadius:"14px",padding:"18px",marginBottom:"12px",borderLeft:"3px solid "+sg.col,animation:"slideUp .3s ease-out "+(i*0.06)+"s both"}},
            e("div",{style:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}},e("span",{style:{fontSize:"20px"}},sg.ic),e("h3",{style:{color:sg.col,fontSize:"15px",fontWeight:700,margin:0}},sg.nombre)),
            e("p",{style:{color:C.tx,fontSize:"14px",lineHeight:1.6,marginBottom:"10px"}},sg.def),
            e("div",{style:{padding:"10px 14px",background:sg.col+"08",borderRadius:"8px",marginBottom:"8px"}},e("span",{style:{fontSize:"10px",fontWeight:700,color:sg.col}},"EJEMPLO: "),e("span",{style:{fontSize:"12px",color:C.mt}},sg.ejemplo)),
            e("div",{style:{padding:"10px 14px",background:"rgba(52,211,153,.06)",borderRadius:"8px"}},e("span",{style:{fontSize:"10px",fontWeight:700,color:"#34d399"}},"SOLUCIÓN: "),e("span",{style:{fontSize:"12px",color:C.mt}},sg.solucion))
          )
        })
      ),

      // TAB 3: MEDIDAS
      ingTab===3&&e(F,null,
        MEDIDAS_EPI.map(function(med,i){
          return e("div",{key:i,style:{background:C.cd,border:"1px solid "+C.bd,borderRadius:"14px",padding:"18px",marginBottom:"12px",borderLeft:"3px solid "+med.col,animation:"slideUp .3s ease-out "+(i*0.05)+"s both"}},
            e("h3",{style:{color:med.col,fontSize:"15px",fontWeight:700,marginBottom:"6px"}},med.nombre),
            e("div",{style:{padding:"8px 14px",background:"rgba(255,255,255,.04)",borderRadius:"8px",marginBottom:"10px",fontFamily:"monospace",fontSize:"14px",color:C.tx,fontWeight:600,textAlign:"center",letterSpacing:"0.5px"}},med.formula),
            e("p",{style:{color:C.mt,fontSize:"13px",lineHeight:1.6,marginBottom:"8px"}},med.desc),
            e("div",{style:{padding:"8px 12px",background:med.col+"0a",borderRadius:"6px",borderLeft:"3px solid "+med.col}},e("span",{style:{fontSize:"11px",fontWeight:700,color:med.col}},"📌 "),e("span",{style:{fontSize:"12px",color:C.tx}},med.regla))
          )
        })
      ),

      // TAB 4: LECTURA CRÍTICA CHECKLIST
      ingTab===4&&e(F,null,
        e("div",{style:{textAlign:"center",marginBottom:"16px"}},e("h3",{style:{fontFamily:"'Playfair Display',serif",fontSize:"18px",fontWeight:800,color:"#06b6d4"}},"Checklist de Lectura Crítica")),
        CHECKLIST_LC.map(function(ck,i){
          return e("div",{key:i,style:{display:"flex",gap:"14px",alignItems:"flex-start",marginBottom:"14px",animation:"slideUp .3s ease-out "+(i*0.06)+"s both"}},
            e("div",{style:{width:"36px",height:"36px",borderRadius:"50%",background:ck.col+"15",border:"2px solid "+ck.col,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"14px",color:ck.col,flexShrink:0}},ck.paso),
            e("div",{style:{flex:1,background:C.cd,border:"1px solid "+C.bd,borderRadius:"12px",padding:"14px 16px"}},
              e("h4",{style:{fontSize:"14px",fontWeight:700,color:C.tx,marginBottom:"6px"}},ck.pregunta),
              e("p",{style:{fontSize:"12px",color:C.dm,lineHeight:1.6}},ck.detalle)
            )
          )
        })
      )
    )

    ,vista==="profile"&&e(ProfileView,{user:ecuUser,onBack:function(){go("home");}})
    ,vista==="flashcards"&&e(DecksView,{user:ecuUser,onBack:function(){go("home");},go:go})
    )),
    // ════════════ BACK BUTTON (floating, hidden on home only) ════════════
    vista!=="home"&&e("button",{onClick:handleBack,style:{position:"fixed",bottom:"20px",left:"20px",background:C.ac,color:"#fff",border:"none",borderRadius:"50%",width:"48px",height:"48px",fontSize:"20px",cursor:"pointer",boxShadow:"0 4px 20px "+C.gl,zIndex:90,display:"flex",alignItems:"center",justifyContent:"center"}},"←"),
    // ════════════ CHATBOT (floating bottom-right) ════════════
    e(ChatBot,{onLoginRequest:function(){setEcuShowAuth(true);}}),
    // ════════════ AUTH MODAL ════════════
    ecuShowAuth&&e(AuthModal,{onSuccess:function(){setEcuShowAuth(false);},onClose:function(){setEcuShowAuth(false);}})
  );
}

ReactDOM.render(e(App),document.getElementById("root"));
