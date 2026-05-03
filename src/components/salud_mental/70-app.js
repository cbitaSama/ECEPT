// ══════════════════════════════════════════════════════════════
// APP SHELL — 3 niveles: root → neurosis → view
// ══════════════════════════════════════════════════════════════

var SM_goFlashcards=null;
var SM_SUPABASE_DECKS={
  anxiety:{id:"f46157d1-56d5-5132-b1ab-e8bc594f129e",name:"Ansiedad",color:C.anx,icon:"🫀",is_official:true,user_id:null,description:null},
  psicosis:{id:"f2760c5b-a34f-5701-b8fe-d19e76cb7e85",name:"Psicosis",color:C.psi,icon:"🔺",is_official:true,user_id:null,description:null},
  toc:{id:"19c71fc4-0082-5ad6-bd89-cc4865c6e03e",name:"TOC",color:C.toc,icon:"🔁",is_official:true,user_id:null,description:null},
  trauma:{id:"7961df40-25bb-59fd-b440-fa3dde5d3181",name:"Trauma",color:C.trm,icon:"⚡",is_official:true,user_id:null,description:null},
  somaticos:{id:"aab1a948-080a-5b97-8afc-bf35d3c9b8f7",name:"Somáticos",color:C.som,icon:"🧬",is_official:true,user_id:null,description:null},
  tca:{id:"7031c483-db20-5c86-813d-cecb4531be87",name:"TCA",color:C.tca,icon:"🍽️",is_official:true,user_id:null,description:null},
  sueno:{id:"1061175e-a84c-583f-ae9e-f5b4f6e5b6cd",name:"Sueño",color:C.sue,icon:"🌙",is_official:true,user_id:null,description:null},
  personalidad:{id:"3f0c92fe-1e66-5f70-82f6-ab0c4c5835eb",name:"Personalidad",color:C.per,icon:"🎭",is_official:true,user_id:null,description:null},
  impulsos:{id:"debb4556-a5f6-5529-96b0-20e8ad36b9a1",name:"Impulsos",color:C.imp,icon:"🎯",is_official:true,user_id:null,description:null},
  depresivos:{id:"d6a7a64c-08e2-53f6-83c1-d52b14c7e3a2",name:"Depresivos",color:C.dpr,icon:"💧",is_official:true,user_id:null,description:null}
};
function SM_FlashBridge(p){
  var deckObj=SM_SUPABASE_DECKS[p.deckId]||null;
  return e("div",{style:{textAlign:"center",padding:"40px 24px",display:"flex",flexDirection:"column",alignItems:"center",gap:"20px"}},
    e("div",{style:{fontSize:"48px"}},"🎴"),
    e("div",{style:{fontSize:"18px",fontWeight:600,color:C.tx}},"El modo repaso se mudó"),
    e("div",{style:{fontSize:"14px",color:C.mt,maxWidth:"280px",lineHeight:"1.5"}},"Las flashcards de Salud Mental ahora están en el sistema de flashcards de ECEPT, con repetición espaciada y seguimiento de progreso."),
    e("button",{
      onClick:function(){if(p.goFlashcards)p.goFlashcards(deckObj);},
      style:{background:C.ac,color:"#fff",border:"none",borderRadius:"12px",padding:"14px 28px",fontSize:"15px",fontWeight:600,cursor:"pointer",minHeight:"44px"}
    },deckObj?"🎴 Estudiar estas cards":"🎴 Ver en flashcards")
  );
}

function App(p){
  // Host prop: onHome is ECEPT's go("home"). Falls back to a no-op if mounted
  // standalone (e.g. artifacts/salud_mental.html).
  var onHome=(p&&p.onHome)||function(){};
  SM_goFlashcards=p.goFlashcards||null;

  var s1=useState("root");var view=s1[0],setView=s1[1];
  // History stack: every forward navigation pushes the previous view id.
  // back() pops it. When empty, we exit the module via onHome().
  var s2b=useState([]);var smHist=s2b[0],setSmHist=s2b[1];
  // Disease route context: populated when view==="disease". Carries the
  // disease item (name, kicker, sections), the color of the parent theme
  // (so DzDetail paints in the right palette), and the id of the hub we
  // came from (so back goes there via popStack and the breadcrumb renders
  // the parent crumb correctly).
  var s2d=useState(null);var diseaseCtx=s2d[0],setDiseaseCtx=s2d[1];
  // Section route context: populated when view==="section". Carries the
  // section object ({id,t,sub,c,content}) from a theme/intro hub's
  // "general" grid (Perlas, Resumen, Flashcards, Quiz, Conceptos…) plus
  // the id of the hub we came from (for back + breadcrumb).
  var s2s=useState(null);var sectionCtx=s2s[0],setSectionCtx=s2s[1];
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
      var VALID=['root','intro','neurosis','psicosis','anx','toc','trm','som','tca','sue','per','imp','dpr'];
      if(VALID.indexOf(v)===-1){console.warn('[ECEPT] SM view not found:',v);return;}
      setSmHist(function(h){return h.concat([view]);});
      setView(v);
    };
    return function(){window._smFocus=null;};
  },[view]);

  useEffect(function(){
    window.scrollTo({top:0,behavior:"instant"});
  },[view]);

  // Notify host (ECEPT) on every view change so it can render a deeper
  // breadcrumb ("Inicio › Salud Mental › Neurosis › Ansiedad", etc.).
  // When on disease/section routes we also pass {name, parent} so ECEPT
  // can append the leaf name as the last crumb. No-op when standalone.
  useEffect(function(){
    if(p&&typeof p.onViewChange==="function"){
      if(view==="disease" && diseaseCtx){
        p.onViewChange(view,{name:diseaseCtx.item.name,parent:diseaseCtx.parent});
      } else if(view==="section" && sectionCtx){
        p.onViewChange(view,{name:sectionCtx.section.t,parent:sectionCtx.parent});
      } else {
        p.onViewChange(view,null);
      }
    }
  },[view,diseaseCtx,sectionCtx]);

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
  // Promover una enfermedad (desde un theme hub o Psicosis hub) a ruta de
  // primer nivel: empuja la vista actual al stack, guarda el contexto de
  // la enfermedad y cambia la vista a "disease". DzDetail la pinta como
  // página inline reemplazando el hub. Back via FAB ← → popStack → hub.
  function openDisease(item,color){
    setSmHist(function(h){return h.concat([view]);});
    setDiseaseCtx({item:item,color:color,parent:view});
    setView("disease");
  }
  // Igual que openDisease pero para las "secciones generales" de cada hub
  // (Perlas, Resumen, Flashcards del tema, Quiz del tema, Conceptos del
  // tema 0, etc.). La sección ya trae su propio color en section.c.
  function openSection(section){
    if(!section)return;
    setSmHist(function(h){return h.concat([view]);});
    setSectionCtx({section:section,parent:view});
    setView("section");
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

  // Cada branch de vista es sólo contenido + FAB scroll-to-top. SIN header
  // local ni botón "← Inicio" interno: la navegación se maneja desde el
  // cromo de ECEPT (top bar + breadcrumb + FAB ← que invoca onBackRef →
  // popStack). Así sólo hay UN header visible (el de ECEPT) en cualquier
  // profundidad del módulo.
  function scrollTopBtn(color){
    return showTop?e("button",{onClick:top,style:{position:"fixed",bottom:22,right:18,width:46,height:46,borderRadius:"50%",background:color,color:"#fff",border:"none",fontSize:18,cursor:"pointer",boxShadow:"0 8px 20px "+ax(color,.45),zIndex:60}},"↑"):null;
  }

  if(view==="root"){
    return e("div",null,
      e(RootHub,{go:go}),
      scrollTopBtn(C.anx)
    );
  }

  if(view==="intro"){
    return e("div",null,
      e("div",{style:{padding:"14px 14px 90px",maxWidth:1200,margin:"0 auto",animation:"fadeIn .3s"}},
        e(IntroView,{onOpenSection:openSection})
      ),
      scrollTopBtn(C.intro)
    );
  }

  if(view==="neurosis"){
    return e("div",null,
      e(NeurosisHub,{go:go}),
      scrollTopBtn(C.anx)
    );
  }

  if(view==="psicosis"){
    return e("div",null,
      e("div",{style:{padding:"14px 14px 90px",maxWidth:1200,margin:"0 auto",animation:"fadeIn .3s"}},
        e(PsicosisView,{go:go,onOpen:function(item){openDisease(item,C.psi);},onOpenSection:openSection})
      ),
      scrollTopBtn(C.psi)
    );
  }

  // Section route: renderiza DzSectionView como página completa (sección
  // general de un hub: perlas, resumen, flashcards del tema, quiz del
  // tema, conceptos del tema 0, etc.). El hub padre desaparece del árbol.
  if(view==="section" && sectionCtx){
    var secColor=sectionCtx.section.c||C.anx;
    return e("div",null,
      e(DzSectionView,{
        c:secColor,
        name:sectionCtx.section.t,
        kicker:"Sección del tema",
        content:sectionCtx.section.content
      }),
      scrollTopBtn(secColor)
    );
  }

  // Disease route: renderiza DzDetail como página completa (reemplaza al
  // hub). Sin chrome propio; el FAB ← de ECEPT vuelve al hub padre vía
  // smBackRef → popStack.
  if(view==="disease" && diseaseCtx){
    return e("div",null,
      e(DzDetail,{
        c:diseaseCtx.color,
        name:diseaseCtx.item.name,
        kicker:diseaseCtx.item.kicker||"Enfermedad",
        sections:diseaseCtx.item.sections
      }),
      scrollTopBtn(diseaseCtx.color)
    );
  }

  // Hubs globales: flashcards y quiz con filtros
  if(view==="flash-psicosis"||view==="quiz-psicosis"||view==="flash-neurosis"||view==="quiz-neurosis"||view==="flash-all"||view==="quiz-all"){
    var isFlash=view.indexOf("flash-")===0;
    var group=view.indexOf("psicosis")>=0?"psicosis":(view.indexOf("all")>=0?"all":"neurosis");
    var hc=group==="psicosis"?C.psi:(group==="all"?C.pearl:C.anx);
    var groupLabel=group==="psicosis"?"Psicosis":(group==="all"?"toda Salud Mental":"Neurosis");
    return e("div",null,
      e("div",{style:{padding:"16px 14px 90px",maxWidth:1200,margin:"0 auto",animation:"fadeIn .3s"}},
        e("div",{style:{padding:"18px 18px",background:"linear-gradient(135deg,"+ax(hc,.15)+","+C.cd+" 85%)",border:"1px solid "+ax(hc,.35),borderLeft:"4px solid "+hc,borderRadius:14,marginBottom:18}},
          e("div",{style:{fontSize:10.5,fontWeight:800,color:hc,letterSpacing:2,textTransform:"uppercase",marginBottom:4}},isFlash?"Flashcards globales":"Quiz global"),
          e("div",{style:{fontSize:18,fontWeight:900,color:"#fff",lineHeight:1.2,fontFamily:"Inter,DM Sans",marginBottom:5}},isFlash?"Repaso combinado":"Casos clínicos combinados"),
          e("div",{style:{fontSize:12,color:C.tx,lineHeight:1.5}},
            isFlash?"Todas las flashcards oficiales de "+groupLabel+" + las que tú añadas. Filtra por tema, busca texto, alterna entre modo tarjeta y modo lista.":"Todos los casos clínicos de "+groupLabel+". Filtra por tema, alterna entre modo tarjeta (interactivo) y modo lista (vista rápida con respuestas)."
          )
        ),
        isFlash?(SM_goFlashcards?e(SM_FlashBridge,{deckId:null,goFlashcards:SM_goFlashcards}):e(GlobalFlashDeck,{group:group})):e(GlobalQuiz,{group:group})
      ),
      scrollTopBtn(hc)
    );
  }

  var V=views[view];
  var tc=colors[view];
  return e("div",null,
    e("div",{style:{padding:"14px 14px 90px",maxWidth:1200,margin:"0 auto",animation:"fadeIn .3s"}},
      e(V,{onOpen:function(item){openDisease(item,tc);},onOpenSection:openSection})
    ),
    scrollTopBtn(tc)
  );
}
