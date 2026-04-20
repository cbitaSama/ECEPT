// ══════════════════════════════════════════════════════════════
// APP SHELL — 3 niveles: root → neurosis → view
// ══════════════════════════════════════════════════════════════

function App(p){
  // Host prop: onHome is ECEPT's go("home"). Falls back to a no-op if mounted
  // standalone (e.g. artifacts/salud_mental.html).
  var onHome=(p&&p.onHome)||function(){};

  var s1=useState("root");var view=s1[0],setView=s1[1];
  // History stack: every forward navigation pushes the previous view id.
  // back() pops it. When empty, we exit the module via onHome().
  var s2b=useState([]);var smHist=s2b[0],setSmHist=s2b[1];
  var s2=useState(false);var showTop=s2[0],setShowTop=s2[1];

  useEffect(function(){
    function onScroll(){setShowTop(window.scrollY>400);}
    window.addEventListener("scroll",onScroll);
    return function(){window.removeEventListener("scroll",onScroll);};
  },[]);

  // Deep-link hook: ECEPT's globalSearch calls window._smFocus(route) after
  // navigating to the salud_mental view, to jump straight into a specific
  // SM sub-view (e.g. "anx", "toc", "intro"). The current view is pushed onto
  // smHist so back() can unwind. Cleared on unmount.
  useEffect(function(){
    window._smFocus=function(v){
      if(!v)return;
      setSmHist(function(h){return h.concat([view]);});
      setView(v);
    };
    return function(){window._smFocus=null;};
  },[view]);

  useEffect(function(){
    window.scrollTo({top:0,behavior:"instant"});
  },[view]);

  function popStack(){
    if(smHist.length>0){
      var prev=smHist[smHist.length-1];
      setSmHist(smHist.slice(0,-1));
      setView(prev);
      return true;
    }
    return false;
  }

  function go(v){
    setSmHist(function(h){return h.concat([view]);});
    setView(v);
  }
  // Internal "← Inicio" buttons in sub-views. Falls back to onHome if the
  // stack is somehow empty (defensive — sub-views only show after navigation).
  function back(){
    if(!popStack()) onHome();
  }
  function top(){window.scrollTo({top:0,behavior:"smooth"});}

  // Register FAB back handler with ECEPT. Returns true if SM consumed the
  // back (popped its own stack); false lets ECEPT fall through to goBack(),
  // which pops its own hist — so from SM root, FAB ← returns to wherever
  // the user came from (home, or another ECEPT view if they chained).
  useEffect(function(){
    if(p&&p.onBackRef){
      p.onBackRef.current=popStack;
    }
    return function(){
      if(p&&p.onBackRef){p.onBackRef.current=null;}
    };
  },[smHist]);

  var views={anx:AnxView,toc:OCDView,trm:TraumaView,som:SomView,tca:TCAView,sue:SueView,per:PerView,imp:ImpView,dpr:DprView};
  var titles={anx:"Tema 1 · Ansiedad",toc:"Tema 2 · TOC",trm:"Tema 3 · Trauma",som:"Tema 4 · Somáticos / Disociativos",tca:"Tema 5 · Conducta alimentaria",sue:"Tema 6 · Sueño-vigilia",per:"Tema 7 · Personalidad",imp:"Tema 8 · Control de impulsos",dpr:"Tema 9 · Trastornos depresivos"};
  var colors={anx:C.anx,toc:C.toc,trm:C.trm,som:C.som,tca:C.tca,sue:C.sue,per:C.per,imp:C.imp,dpr:C.dpr};

  if(view==="root"){
    return e("div",null,
      // Sticky header at SM root: explicit exit back to ECEPT. Distinct label
      // ("Volver a ECEPT") avoids ambiguity with the sub-view "← Inicio"
      // buttons (which navigate within SM).
      e("div",{style:{position:"sticky",top:62,zIndex:50,padding:"10px 14px",background:"rgba(6,10,20,.92)",backdropFilter:"blur(10px)",borderBottom:"1px solid "+C.bd,display:"flex",alignItems:"center",gap:10}},
        e("button",{onClick:onHome,style:{padding:"8px 12px",background:ax(C.anx,.15),border:"1px solid "+ax(C.anx,.35),color:C.anx,borderRadius:8,fontSize:12.5,fontWeight:700,cursor:"pointer"}},"← Volver a ECEPT"),
        e("div",{style:{flex:1,fontSize:12.5,fontWeight:800,color:C.anx,letterSpacing:.5,textAlign:"center"}},"🧠 Salud Mental II")
      ),
      e(RootHub,{go:go}),
      showTop?e("button",{onClick:top,style:{position:"fixed",bottom:22,right:18,width:46,height:46,borderRadius:"50%",background:C.anx,color:"#fff",border:"none",fontSize:18,cursor:"pointer",boxShadow:"0 8px 20px "+ax(C.anx,.45),zIndex:60}},"↑"):null
    );
  }

  if(view==="intro"){
    return e("div",null,
      e("div",{style:{position:"sticky",top:62,zIndex:50,padding:"10px 14px",background:"rgba(6,10,20,.92)",backdropFilter:"blur(10px)",borderBottom:"1px solid "+C.bd,display:"flex",alignItems:"center",gap:10}},
        e("button",{onClick:back,style:{padding:"8px 12px",background:ax(C.intro,.15),border:"1px solid "+ax(C.intro,.35),color:C.intro,borderRadius:8,fontSize:12.5,fontWeight:700,cursor:"pointer"}},"← Inicio"),
        e("div",{style:{flex:1,fontSize:12.5,fontWeight:800,color:C.intro,letterSpacing:.5,textAlign:"center"}},"📘 Psiquiatría")
      ),
      e("div",{style:{padding:"14px 14px 90px",maxWidth:720,margin:"0 auto",animation:"fadeIn .3s"}},
        e(IntroView,null)
      ),
      showTop?e("button",{onClick:top,style:{position:"fixed",bottom:22,right:18,width:46,height:46,borderRadius:"50%",background:C.intro,color:"#fff",border:"none",fontSize:18,cursor:"pointer",boxShadow:"0 8px 20px "+ax(C.intro,.45),zIndex:60}},"↑"):null
    );
  }

  if(view==="neurosis"){
    return e("div",null,
      e("div",{style:{position:"sticky",top:62,zIndex:50,padding:"10px 14px",background:"rgba(6,10,20,.92)",backdropFilter:"blur(10px)",borderBottom:"1px solid "+C.bd,display:"flex",alignItems:"center",gap:10}},
        e("button",{onClick:back,style:{padding:"8px 12px",background:ax(C.anx,.15),border:"1px solid "+ax(C.anx,.35),color:C.anx,borderRadius:8,fontSize:12.5,fontWeight:700,cursor:"pointer"}},"← Inicio"),
        e("div",{style:{flex:1,fontSize:12.5,fontWeight:800,color:C.anx,letterSpacing:.5,textAlign:"center"}},"🌀 Neurosis")
      ),
      e(NeurosisHub,{go:go}),
      showTop?e("button",{onClick:top,style:{position:"fixed",bottom:22,right:18,width:46,height:46,borderRadius:"50%",background:C.anx,color:"#fff",border:"none",fontSize:18,cursor:"pointer",boxShadow:"0 8px 20px "+ax(C.anx,.45),zIndex:60}},"↑"):null
    );
  }

  if(view==="psicosis"){
    return e("div",null,
      e("div",{style:{position:"sticky",top:62,zIndex:50,padding:"10px 14px",background:"rgba(6,10,20,.92)",backdropFilter:"blur(10px)",borderBottom:"1px solid "+C.bd,display:"flex",alignItems:"center",gap:10}},
        e("button",{onClick:back,style:{padding:"8px 12px",background:ax(C.psi,.15),border:"1px solid "+ax(C.psi,.35),color:C.psi,borderRadius:8,fontSize:12.5,fontWeight:700,cursor:"pointer"}},"← Inicio"),
        e("div",{style:{flex:1,fontSize:12.5,fontWeight:800,color:C.psi,letterSpacing:.5,textAlign:"center"}},"🔺 Psicosis")
      ),
      e("div",{style:{padding:"14px 14px 90px",maxWidth:720,margin:"0 auto",animation:"fadeIn .3s"}},
        e(PsicosisView,{go:go})
      ),
      showTop?e("button",{onClick:top,style:{position:"fixed",bottom:22,right:18,width:46,height:46,borderRadius:"50%",background:C.psi,color:"#fff",border:"none",fontSize:18,cursor:"pointer",boxShadow:"0 8px 20px "+ax(C.psi,.45),zIndex:60}},"↑"):null
    );
  }

  // Hubs globales: flashcards y quiz con filtros
  if(view==="flash-psicosis"||view==="quiz-psicosis"||view==="flash-neurosis"||view==="quiz-neurosis"||view==="flash-all"||view==="quiz-all"){
    var isFlash=view.indexOf("flash-")===0;
    var group=view.indexOf("psicosis")>=0?"psicosis":(view.indexOf("all")>=0?"all":"neurosis");
    var hc=group==="psicosis"?C.psi:(group==="all"?C.pearl:C.anx);
    var hicon=group==="psicosis"?"🔺":(group==="all"?"🧠":"🌀");
    var hbackLabel=group==="psicosis"?"← Psicosis":(group==="all"?"← Inicio":"← Neurosis");
    var groupLabel=group==="psicosis"?"Psicosis":(group==="all"?"toda Salud Mental":"Neurosis");
    var htitle=(isFlash?"🃏 Flashcards":"❓ Quiz")+" · "+(group==="all"?"Todo":groupLabel);
    return e("div",null,
      e("div",{style:{position:"sticky",top:62,zIndex:50,padding:"10px 14px",background:"rgba(6,10,20,.92)",backdropFilter:"blur(10px)",borderBottom:"1px solid "+C.bd,display:"flex",alignItems:"center",gap:10}},
        e("button",{onClick:back,style:{padding:"8px 12px",background:ax(hc,.15),border:"1px solid "+ax(hc,.35),color:hc,borderRadius:8,fontSize:12.5,fontWeight:700,cursor:"pointer"}},hbackLabel),
        e("div",{style:{flex:1,fontSize:12.5,fontWeight:800,color:hc,letterSpacing:.5,textAlign:"center"}},htitle)
      ),
      e("div",{style:{padding:"16px 14px 90px",maxWidth:720,margin:"0 auto",animation:"fadeIn .3s"}},
        e("div",{style:{padding:"18px 18px",background:"linear-gradient(135deg,"+ax(hc,.15)+","+C.cd+" 85%)",border:"1px solid "+ax(hc,.35),borderLeft:"4px solid "+hc,borderRadius:14,marginBottom:18}},
          e("div",{style:{fontSize:10.5,fontWeight:800,color:hc,letterSpacing:2,textTransform:"uppercase",marginBottom:4}},isFlash?"Flashcards globales":"Quiz global"),
          e("div",{style:{fontSize:18,fontWeight:900,color:"#fff",lineHeight:1.2,fontFamily:"Playfair Display",marginBottom:5}},isFlash?"Repaso combinado":"Casos clínicos combinados"),
          e("div",{style:{fontSize:12,color:C.tx,lineHeight:1.5}},
            isFlash?"Todas las flashcards oficiales de "+groupLabel+" + las que tú añadas. Filtra por tema, busca texto, alterna entre modo tarjeta y modo lista.":"Todos los casos clínicos de "+groupLabel+". Filtra por tema, alterna entre modo tarjeta (interactivo) y modo lista (vista rápida con respuestas)."
          )
        ),
        isFlash?e(GlobalFlashDeck,{group:group}):e(GlobalQuiz,{group:group})
      ),
      showTop?e("button",{onClick:top,style:{position:"fixed",bottom:22,right:18,width:46,height:46,borderRadius:"50%",background:hc,color:"#fff",border:"none",fontSize:18,cursor:"pointer",boxShadow:"0 8px 20px "+ax(hc,.45),zIndex:60}},"↑"):null
    );
  }

  var V=views[view];
  var tc=colors[view];
  return e("div",null,
    e("div",{style:{position:"sticky",top:62,zIndex:50,padding:"10px 14px",background:"rgba(6,10,20,.92)",backdropFilter:"blur(10px)",borderBottom:"1px solid "+C.bd,display:"flex",alignItems:"center",gap:10}},
      e("button",{onClick:back,style:{padding:"8px 12px",background:ax(tc,.15),border:"1px solid "+ax(tc,.35),color:tc,borderRadius:8,fontSize:12.5,fontWeight:700,cursor:"pointer"}},"← Neurosis"),
      e("div",{style:{flex:1,fontSize:12.5,fontWeight:800,color:tc,letterSpacing:.5,textAlign:"center"}},titles[view])
    ),
    e("div",{style:{padding:"14px 14px 90px",maxWidth:720,margin:"0 auto",animation:"fadeIn .3s"}},
      e(V,null)
    ),
    showTop?e("button",{onClick:top,style:{position:"fixed",bottom:22,right:18,width:46,height:46,borderRadius:"50%",background:tc,color:"#fff",border:"none",fontSize:18,cursor:"pointer",boxShadow:"0 8px 20px "+ax(tc,.45),zIndex:60}},"↑"):null
  );
}
