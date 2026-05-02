// ══════════════════════════════════════════════════════════════
// STUDY VIEW — Modo estudio con SM-2
// ES5 estricto: solo var y function. Sin ES6+.
// Props: user, deck, onBack, go, onLoginRequest
// ══════════════════════════════════════════════════════════════
'use strict';
var SV_styleInjected=false;

// ── Confetti data (30 dots, generated once at module load) ──
var SV_confettiData=[];
(function(){
  var cc=["#a78bfa","#60a5fa","#34d399","#fbbf24","#f87171","#fb923c","#e879f9","#38bdf8"];
  for(var i=0;i<30;i++){
    var left=((i*7.3+Math.sin(i*2.7)*18+50)%100+100)%100;
    SV_confettiData.push({
      left:left.toFixed(1)+"%",
      delay:((i*0.073)%1.4).toFixed(2)+"s",
      color:cc[i%cc.length],
      size:(6+(i%5))+"px",
      dur:(1.3+((i*0.11)%0.8)).toFixed(2)+"s"
    });
  }
})();

// ── SM-2 algorithm ──
function SV_sm2(prog,rating){
  var ef=prog&&prog.ease_factor!=null?prog.ease_factor:2.5;
  var intv=prog&&prog.interval_days!=null?prog.interval_days:0;
  var reps=prog&&prog.repetitions!=null?prog.repetitions:0;
  var newEf,newIntv,newReps,nextReview;
  if(rating===0){
    newEf=ef; newIntv=0; newReps=0;
    nextReview=new Date(Date.now()+10*60*1000).toISOString();
  } else if(rating===3){
    newEf=Math.max(1.3,ef-0.15);
    newIntv=Math.max(1,Math.round(intv*1.2));
    newReps=reps;
    nextReview=new Date(Date.now()+newIntv*86400000).toISOString();
  } else if(rating===4){
    newEf=ef;
    if(reps===0){ newIntv=1; } else if(reps===1){ newIntv=6; } else { newIntv=Math.round(intv*ef); }
    newReps=reps+1;
    nextReview=new Date(Date.now()+newIntv*86400000).toISOString();
  } else {
    newEf=ef+0.15;
    if(reps===0){ newIntv=1; } else if(reps===1){ newIntv=8; } else { newIntv=Math.round(intv*newEf*1.3); }
    newReps=reps+1;
    nextReview=new Date(Date.now()+newIntv*86400000).toISOString();
  }
  return {ease_factor:newEf,interval_days:newIntv,repetitions:newReps,next_review:nextReview};
}

// ── Human-readable interval label ──
function SV_intervalLabel(prog,rating){
  if(rating===0) return "<10min";
  var result=SV_sm2(prog,rating);
  var intv=result.interval_days;
  if(intv<1) return "<1d";
  if(intv===1) return "1d";
  if(intv<7) return intv+"d";
  if(intv<14) return "1sem";
  if(intv<30) return Math.round(intv/7)+"sem";
  return Math.round(intv/30)+"mes";
}

// ── Fisher-Yates shuffle ──
function SV_shuffle(arr){
  var a=[];
  for(var i=0;i<arr.length;i++){ a.push(arr[i]); }
  for(var j=a.length-1;j>0;j--){
    var k=Math.floor(Math.random()*(j+1));
    var tmp=a[j]; a[j]=a[k]; a[k]=tmp;
  }
  return a;
}

// ── Cloze renderer — handles both {{c1::word}} and }}word}} ──
function SV_clozeEl(text,hidden){
  if(!text) return e("span",null,"");
  var regex=/\{\{c\d+::(.*?)\}\}|\}\}(.*?)\}\}/g;
  var parts=[];
  var lastIndex=0;
  var match;
  var idx=0;
  while((match=regex.exec(text))!==null){
    if(match.index>lastIndex){
      parts.push(text.substring(lastIndex,match.index));
    }
    var answer=match[1]!==undefined?match[1]:match[2];
    if(hidden){
      parts.push(e("span",{
        key:"cl-"+idx,
        style:{display:"inline-block",padding:"1px 8px",borderRadius:"5px",
          background:"rgba(251,191,36,.2)",border:"1px solid rgba(251,191,36,.4)",
          color:"#fbbf24",fontWeight:700,margin:"0 2px"}
      },"[...]"));
    } else {
      parts.push(e("span",{key:"cl-"+idx,style:{color:"#34d399",fontWeight:700}},answer));
    }
    lastIndex=match.index+match[0].length;
    idx++;
  }
  if(lastIndex<text.length){ parts.push(text.substring(lastIndex)); }
  if(parts.length===0) return e("span",null,text);
  return e("span",null,parts);
}

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════
function StudyView(props){
  var user=props.user;
  var s;

  s=useState("setup");  var SV_phase=s[0],        SV_setPhase=s[1];
  s=useState([]);       var SV_decks=s[0],         SV_setDecks=s[1];
  s=useState({});       var SV_selIds=s[0],        SV_setSelIds=s[1];
  s=useState(false);    var SV_tagExp=s[0],        SV_setTagExp=s[1];
  s=useState([]);       var SV_selTags=s[0],       SV_setSelTags=s[1];
  s=useState("today");  var SV_mode=s[0],          SV_setMode=s[1];
  s=useState(20);       var SV_maxCards=s[0],      SV_setMaxCards=s[1];
  s=useState([]);       var SV_allCards=s[0],      SV_setAllCards=s[1];
  s=useState({});       var SV_progress=s[0],      SV_setProgress=s[1];
  s=useState([]);       var SV_session=s[0],       SV_setSession=s[1];
  s=useState(0);        var SV_idx=s[0],           SV_setIdx=s[1];
  s=useState(false);    var SV_flipped=s[0],       SV_setFlipped=s[1];
  s=useState(false);    var SV_rated=s[0],         SV_setRated=s[1];
  s=useState({});       var SV_ratedMap=s[0],      SV_setRatedMap=s[1];
  s=useState(null);     var SV_startTime=s[0],     SV_setStartTime=s[1];
  s=useState(true);     var SV_loadingSetup=s[0],  SV_setLoadingSetup=s[1];
  s=useState("");       var SV_loadErr=s[0],       SV_setLoadErr=s[1];
  s=useState(false);    var SV_sliding=s[0],       SV_setSliding=s[1];

  // ── Inject CSS once ──
  useEffect(function(){
    if(SV_styleInjected) return;
    var st=document.createElement("style");
    st.textContent=
      "@keyframes SV_slideOut{0%{transform:translateX(0);opacity:1}100%{transform:translateX(-80px);opacity:0}}" +
      "@keyframes SV_slideIn{0%{transform:translateX(80px);opacity:0}100%{transform:translateX(0);opacity:1}}" +
      "@keyframes SV_fall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(340px) rotate(540deg);opacity:0}}" +
      "@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}" +
      ".sv-wrap-out{animation:SV_slideOut .32s ease-in both}" +
      ".sv-wrap-in{animation:SV_slideIn .32s ease-out both}" +
      ".sv-rating-btn{transition:transform .1s ease,opacity .15s ease}" +
      ".sv-rating-btn:active{transform:scale(0.93)!important}" +
      ".sv-face{-webkit-backface-visibility:hidden;backface-visibility:hidden;" +
        "position:absolute;top:0;left:0;right:0;min-height:100%;" +
        "border-radius:16px;padding:28px 24px;" +
        "display:flex;flex-direction:column;justify-content:center;" +
        "box-sizing:border-box;overflow-y:auto}";
    document.head.appendChild(st);
    SV_styleInjected=true;
  },[]);

  // ── Load data ──
  useEffect(function(){
    if(!user||!window.ECEPT_SUPABASE){
      SV_setLoadingSetup(false);
      return;
    }
    window.ECEPT_SUPABASE
      .from("decks")
      .select("id,name,color,icon,is_official,user_id")
      .or("is_official.eq.true,user_id.eq."+user.id)
      .order("name",{ascending:true})
      .then(function(deckRes){
        if(deckRes&&deckRes.error){
          SV_setLoadErr("Error cargando datos.");
          SV_setLoadingSetup(false);
          return;
        }
        var decksData=(deckRes&&deckRes.data)||[];
        var deckIds=[];
        for(var i=0;i<decksData.length;i++){ deckIds.push(decksData[i].id); }
        if(deckIds.length===0){
          SV_setDecks([]);
          SV_setAllCards([]);
          SV_setProgress({});
          SV_setLoadingSetup(false);
          return;
        }
        var cardsPromise=window.ECEPT_SUPABASE
          .from("flashcards")
          .select("id,deck_id,card_type,front,back,tags")
          .in("deck_id",deckIds);
        var progPromise=window.ECEPT_SUPABASE
          .from("flashcard_progress")
          .select("flashcard_id,next_review,interval_days,repetitions,ease_factor")
          .eq("user_id",user.id);
        Promise.all([cardsPromise,progPromise]).then(function(results){
          var cardRes=results[0], progRes=results[1];
          var cards=(cardRes&&cardRes.data)||[];
          var progRows=(progRes&&progRes.data)||[];
          var progMap={};
          for(var pi=0;pi<progRows.length;pi++){
            progMap[progRows[pi].flashcard_id]=progRows[pi];
          }
          SV_setDecks(decksData);
          SV_setAllCards(cards);
          SV_setProgress(progMap);
          var initSel={};
          if(props.deck&&props.deck.id){
            initSel[props.deck.id]=true;
          } else {
            for(var di=0;di<decksData.length;di++){ initSel[decksData[di].id]=true; }
          }
          SV_setSelIds(initSel);
          SV_setLoadingSetup(false);
        }).catch(function(err){
          console.error("[StudyView] data load error:",err);
          SV_setLoadErr("Error cargando datos.");
          SV_setLoadingSetup(false);
        });
      }).catch(function(err){
        console.error("[StudyView] decks load error:",err);
        SV_setLoadErr("Error cargando datos.");
        SV_setLoadingSetup(false);
      });
  },[]);

  // ── Derived state ──
  var nowIso=new Date().toISOString();
  var selDeckSet={};
  for(var k in SV_selIds){ if(SV_selIds.hasOwnProperty(k)) selDeckSet[k]=true; }

  var tagMap={};
  for(var ci=0;ci<SV_allCards.length;ci++){
    var _c=SV_allCards[ci];
    if(!selDeckSet[_c.deck_id]) continue;
    var _ts=Array.isArray(_c.tags)?_c.tags:[];
    for(var ti=0;ti<_ts.length;ti++){ if(_ts[ti]) tagMap[_ts[ti]]=true; }
  }
  var allTags=Object.keys(tagMap).sort();

  var availableCards=SV_allCards.filter(function(c){
    if(!selDeckSet[c.deck_id]) return false;
    if(SV_selTags.length>0){
      var ct=Array.isArray(c.tags)?c.tags:[];
      for(var si=0;si<SV_selTags.length;si++){
        if(ct.indexOf(SV_selTags[si])===-1) return false;
      }
    }
    var p=SV_progress[c.id];
    if(SV_mode==="today") return !p||!p.next_review||p.next_review<=nowIso;
    if(SV_mode==="new") return !p;
    if(SV_mode==="review") return !!p;
    return true;
  });
  var available=availableCards.length;
  var sessionCount=Math.min(SV_maxCards,available);

  // ── Helpers ──
  function SV_toggleDeck(id){
    var next={};
    for(var dk in SV_selIds){ if(SV_selIds.hasOwnProperty(dk)) next[dk]=SV_selIds[dk]; }
    if(next[id]){ delete next[id]; } else { next[id]=true; }
    SV_setSelIds(next);
    SV_setSelTags([]);
  }
  function SV_selectAll(){
    var next={};
    for(var di=0;di<SV_decks.length;di++){ next[SV_decks[di].id]=true; }
    SV_setSelIds(next);
    SV_setSelTags([]);
  }
  function SV_clearSel(){ SV_setSelIds({}); SV_setSelTags([]); }
  function SV_toggleTag(t){
    var idx=-1;
    for(var i=0;i<SV_selTags.length;i++){ if(SV_selTags[i]===t){ idx=i; break; } }
    var next=[];
    for(var j=0;j<SV_selTags.length;j++){ next.push(SV_selTags[j]); }
    if(idx>=0){ next.splice(idx,1); } else { next.push(t); }
    SV_setSelTags(next);
  }

  function SV_startSession(){
    var shuffled=SV_shuffle(availableCards).slice(0,SV_maxCards);
    SV_setSession(shuffled);
    SV_setIdx(0);
    SV_setFlipped(false);
    SV_setRated(false);
    SV_setRatedMap({});
    SV_setStartTime(Date.now());
    SV_setSliding(false);
    SV_setPhase("study");
  }

  function SV_rate(rating){
    if(SV_rated||SV_sliding) return;
    var capturedIdx=SV_idx;
    var capturedLen=SV_session.length;
    var card=SV_session[capturedIdx];
    if(!card) return;

    SV_setRated(true);
    SV_setSliding(true);

    // Update SM-2 progress
    var prog=SV_progress[card.id];
    var newProg=SV_sm2(prog,rating);
    console.log("[SM-2] card:",card.id,"rating:",rating,"before:",prog||"(new)","after:",newProg);
    var nextProg={};
    for(var pk in SV_progress){ if(SV_progress.hasOwnProperty(pk)) nextProg[pk]=SV_progress[pk]; }
    nextProg[card.id]=newProg;
    SV_setProgress(nextProg);

    // Record this card's rating
    var nextMap={};
    for(var mk in SV_ratedMap){ if(SV_ratedMap.hasOwnProperty(mk)) nextMap[mk]=SV_ratedMap[mk]; }
    nextMap[capturedIdx]=rating;
    SV_setRatedMap(nextMap);

    // Fire-and-forget upsert
    if(window.ECEPT_SUPABASE&&user){
      try{
        window.ECEPT_SUPABASE
          .from("flashcard_progress")
          .upsert({
            user_id:user.id,
            flashcard_id:card.id,
            ease_factor:newProg.ease_factor,
            interval_days:newProg.interval_days,
            repetitions:newProg.repetitions,
            next_review:newProg.next_review
          },{onConflict:"user_id,flashcard_id"})
          .then(function(res){
            if(res&&res.error) console.error("[StudyView] upsert error:",res.error);
          })
          .catch(function(err){ console.error("[StudyView] upsert catch:",err); });
      }catch(ex){
        console.error("[StudyView] upsert sync throw:",ex);
      }
    }

    // Always advance after animation, regardless of upsert outcome
    setTimeout(function(){
      SV_setSliding(false);
      if(capturedIdx+1>=capturedLen){
        SV_setPhase("summary");
      } else {
        SV_setIdx(capturedIdx+1);
        SV_setFlipped(false);
        SV_setRated(false);
      }
    },340);
  }

  function SV_goBack(){
    if(SV_idx<=0||SV_sliding||SV_rated) return;
    var prevIdx=SV_idx-1;
    var capturedMap=SV_ratedMap;
    SV_setSliding(true);
    setTimeout(function(){
      var wasRated=capturedMap.hasOwnProperty(prevIdx);
      SV_setIdx(prevIdx);
      SV_setFlipped(wasRated);
      SV_setRated(wasRated);
      SV_setSliding(false);
    },340);
  }

  function SV_goNext(){
    if(SV_rated||SV_sliding) return;
    var capturedIdx=SV_idx;
    var capturedLen=SV_session.length;
    var capturedMap=SV_ratedMap;
    SV_setSliding(true);
    setTimeout(function(){
      SV_setSliding(false);
      if(capturedIdx+1>=capturedLen){
        SV_setPhase("summary");
      } else {
        var nextIdx=capturedIdx+1;
        var wasRated=capturedMap.hasOwnProperty(nextIdx);
        SV_setIdx(nextIdx);
        SV_setFlipped(wasRated);
        SV_setRated(wasRated);
      }
    },340);
  }

  // ══════════════════════════════════════════════════════════════
  // AUTH GATE
  // ══════════════════════════════════════════════════════════════
  if(!user){
    return e("div",{style:{
      display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",padding:"60px 20px",textAlign:"center"
    }},
      e("div",{style:{maxWidth:"540px"}},
        e("div",{style:{fontSize:"48px",marginBottom:"16px"}},"🎯"),
        e("h1",{style:{fontSize:"24px",fontWeight:700,color:C.tx,marginBottom:"12px"}},"Modo estudio"),
        e("p",{style:{color:C.mt,fontSize:"15px",marginBottom:"28px",lineHeight:1.6}},
          "Iniciá sesión para estudiar y guardar tu progreso."
        ),
        e("button",{
          onClick:function(){ if(props.onLoginRequest) props.onLoginRequest(); },
          style:{
            background:"linear-gradient(135deg,#a78bfa,#60a5fa)",
            color:"#fff",border:"none",borderRadius:"10px",
            padding:"12px 28px",fontSize:"15px",fontWeight:600,
            cursor:"pointer",marginBottom:"14px",display:"block",width:"100%"
          }
        },"Iniciar sesión")
      )
    );
  }

  // ══════════════════════════════════════════════════════════════
  // SETUP PHASE
  // ══════════════════════════════════════════════════════════════
  if(SV_phase==="setup"){
    var modeOpts=[
      {id:"today",icon:"📅",label:"Pendientes hoy",desc:"Vencidas o nuevas"},
      {id:"all",icon:"📚",label:"Todas",desc:"Cualquier tarjeta"},
      {id:"new",icon:"✨",label:"Solo nuevas",desc:"Nunca estudiadas"},
      {id:"review",icon:"🔁",label:"Solo repaso",desc:"Ya vistas"}
    ];
    var sliderMax=Math.min(100,available)||5;

    return e("div",{style:{maxWidth:"760px",margin:"0 auto",padding:"20px 16px 80px"}},
      e("div",{style:{display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px"}},
        e("h1",{style:{fontSize:"22px",fontWeight:700,color:C.tx,margin:0,flex:1}},"Modo estudio"),
        e("div",{style:{fontSize:"28px"}},"🎯")
      ),

      SV_loadErr ? e("div",{style:{
        background:"rgba(239,68,68,.12)",border:"1px solid rgba(239,68,68,.3)",
        borderRadius:"10px",padding:"12px 16px",marginBottom:"20px",
        color:"#fca5a5",fontSize:"14px"
      }},SV_loadErr) : null,

      SV_loadingSetup ? e("div",{style:{textAlign:"center",padding:"60px 20px",color:C.mt,fontSize:"15px"}},
        e("div",{style:{fontSize:"32px",marginBottom:"12px",
          animation:"spin 1s linear infinite",display:"inline-block"}},"⟳"),
        e("div",null,"Cargando...")
      ) : e(F,null,

        // ── DECK SELECTOR ──
        e("div",{style:{marginBottom:"24px"}},
          e("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"}},
            e("span",{style:{fontSize:"11px",fontWeight:700,color:C.dm,
              letterSpacing:"0.08em",textTransform:"uppercase"}},"BARAJAS"),
            e("div",{style:{display:"flex",gap:"8px"}},
              e("button",{onClick:SV_selectAll,style:{
                background:"none",border:"1px solid "+C.bd,color:C.mt,
                borderRadius:"6px",padding:"3px 10px",fontSize:"12px",cursor:"pointer"
              }},"Seleccionar todo"),
              e("button",{onClick:SV_clearSel,style:{
                background:"none",border:"1px solid "+C.bd,color:C.mt,
                borderRadius:"6px",padding:"3px 10px",fontSize:"12px",cursor:"pointer"
              }},"Limpiar")
            )
          ),
          e("div",{style:{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"10px"}},
            SV_decks.map(function(deck){
              var sel=!!selDeckSet[deck.id];
              var col=deck.color||"#a78bfa";
              return e("button",{key:deck.id,
                onClick:function(){ SV_toggleDeck(deck.id); },
                style:{display:"flex",alignItems:"center",gap:"6px",
                  padding:"7px 14px",borderRadius:"20px",
                  border:"1px solid "+(sel?col:C.bd),
                  background:sel?"rgba(167,139,250,.12)":C.cd,
                  color:sel?col:C.mt,
                  fontSize:"13px",fontWeight:sel?600:400,
                  cursor:"pointer",transition:"all .15s"}
              },
                e("span",null,deck.icon||"🎴"),
                e("span",null,deck.name)
              );
            })
          ),
          e("div",{style:{fontSize:"12px",color:C.dm}},
            (function(){
              var cnt=0;
              for(var dk in selDeckSet){ if(selDeckSet.hasOwnProperty(dk)) cnt++; }
              return cnt+" baraja"+(cnt===1?"":"s")+" seleccionada"+(cnt===1?"":"s");
            })()
          )
        ),

        // ── TAG FILTER ──
        allTags.length>0 ? e("div",{style:{marginBottom:"24px"}},
          e("button",{
            onClick:function(){ SV_setTagExp(!SV_tagExp); },
            style:{display:"flex",alignItems:"center",gap:"8px",
              background:"none",border:"none",color:C.mt,
              fontSize:"13px",cursor:"pointer",padding:"4px 0",marginBottom:"8px"}
          },
            e("span",null,SV_tagExp?"▾":"▸"),
            e("span",null,"Filtrar por etiquetas"),
            SV_selTags.length>0 ? e("span",{style:{
              background:"rgba(167,139,250,.2)",color:"#a78bfa",
              borderRadius:"10px",padding:"1px 8px",fontSize:"11px",fontWeight:700
            }},SV_selTags.length) : null
          ),
          SV_tagExp ? e("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px"}},
            e("button",{
              onClick:function(){ SV_setSelTags([]); },
              style:{padding:"5px 12px",borderRadius:"16px",fontSize:"12px",cursor:"pointer",
                border:"1px solid "+(SV_selTags.length===0?C.mt:C.bd),
                background:SV_selTags.length===0?"rgba(148,163,184,.15)":C.cd,
                color:SV_selTags.length===0?C.tx:C.dm}
            },"Sin filtro"),
            allTags.map(function(t){
              var sel=SV_selTags.indexOf(t)>=0;
              return e("button",{key:t,onClick:function(){ SV_toggleTag(t); },
                style:{padding:"5px 12px",borderRadius:"16px",fontSize:"12px",cursor:"pointer",
                  border:"1px solid "+(sel?"#a78bfa":C.bd),
                  background:sel?"rgba(167,139,250,.15)":C.cd,
                  color:sel?"#a78bfa":C.mt}
              },t);
            })
          ) : null
        ) : null,

        // ── STUDY MODE ──
        e("div",{style:{marginBottom:"24px"}},
          e("div",{style:{fontSize:"11px",fontWeight:700,color:C.dm,
            letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"10px"}},"MODO"),
          e("div",{style:{display:"flex",gap:"8px",flexWrap:"wrap"}},
            modeOpts.map(function(mo){
              var sel=SV_mode===mo.id;
              return e("button",{key:mo.id,onClick:function(){ SV_setMode(mo.id); },
                style:{flex:"1 1 140px",minWidth:"130px",
                  display:"flex",flexDirection:"column",alignItems:"flex-start",
                  gap:"4px",padding:"14px",borderRadius:"12px",cursor:"pointer",
                  border:"1px solid "+(sel?"#a78bfa":C.bd),
                  background:sel?"rgba(167,139,250,.1)":C.cd,textAlign:"left"}
              },
                e("span",{style:{fontSize:"20px"}},"  "+mo.icon),
                e("span",{style:{fontSize:"13px",fontWeight:600,color:sel?"#a78bfa":C.tx}},mo.label),
                e("span",{style:{fontSize:"11px",color:C.dm}},mo.desc)
              );
            })
          )
        ),

        // ── CARD COUNT SLIDER ──
        e("div",{style:{marginBottom:"28px"}},
          e("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}},
            e("span",{style:{fontSize:"11px",fontWeight:700,color:C.dm,
              letterSpacing:"0.08em",textTransform:"uppercase"}},"TARJETAS POR SESIÓN"),
            e("span",{style:{fontSize:"12px",color:C.mt}},"Disponibles: "+available)
          ),
          e("div",{style:{display:"flex",alignItems:"center",gap:"14px"}},
            e("input",{type:"range",min:5,max:sliderMax,
              value:Math.min(SV_maxCards,sliderMax),
              disabled:available===0,
              onChange:function(ev){ SV_setMaxCards(parseInt(ev.target.value,10)); },
              style:{flex:1,accentColor:"#a78bfa",cursor:available===0?"not-allowed":"pointer"}}),
            e("span",{style:{minWidth:"44px",textAlign:"center",fontSize:"18px",
              fontWeight:700,color:"#a78bfa"}},sessionCount)
          )
        ),

        // ── START BUTTON ──
        e("button",{
          onClick:sessionCount>0?SV_startSession:null,
          disabled:sessionCount===0,
          style:{width:"100%",padding:"16px",borderRadius:"12px",
            background:sessionCount>0?"linear-gradient(135deg,#a78bfa,#60a5fa)":C.bd,
            border:"none",color:sessionCount>0?"#fff":C.dm,
            fontSize:"16px",fontWeight:700,
            cursor:sessionCount>0?"pointer":"not-allowed",transition:"opacity .15s"}
        },
          sessionCount>0
            ?"Empezar ("+sessionCount+" tarjeta"+(sessionCount===1?"":"s")+")"
            :"Sin tarjetas disponibles"
        )
      )
    );
  }

  // ══════════════════════════════════════════════════════════════
  // STUDY PHASE
  // ══════════════════════════════════════════════════════════════
  if(SV_phase==="study"){
    var currentCard=SV_session[SV_idx];
    if(!currentCard) return e("div",null);
    var currentProg=SV_progress[currentCard.id];
    var cardDeck=null;
    for(var di2=0;di2<SV_decks.length;di2++){
      if(SV_decks[di2].id===currentCard.deck_id){ cardDeck=SV_decks[di2]; break; }
    }
    var deckCol=(cardDeck&&cardDeck.color)||"#a78bfa";
    var isCloze=currentCard.card_type==="cloze";
    var progressPct=SV_session.length>0?Math.round((SV_idx/SV_session.length)*100):0;

    var ratingBtns=[
      {rating:0,label:"Otra vez",color:"#ef4444"},
      {rating:3,label:"Difícil",color:"#fbbf24"},
      {rating:4,label:"Bien",color:"#34d399"},
      {rating:5,label:"Fácil",color:"#60a5fa"}
    ];

    var canGoBack=SV_idx>0&&!SV_sliding&&!SV_rated;
    var canGoNext=!SV_rated&&!SV_sliding;

    return e("div",{style:{maxWidth:"640px",margin:"0 auto",padding:"16px 16px 80px"}},

      // ── Header ──
      e("div",{style:{marginBottom:"18px"}},
        e("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",
          marginBottom:"10px",flexWrap:"wrap",gap:"8px"}},

          // Nav controls + count
          e("div",{style:{display:"flex",alignItems:"center",gap:"6px"}},
            e("button",{
              onClick:SV_goBack,
              disabled:!canGoBack,
              style:{background:"none",border:"1px solid "+(canGoBack?C.bd:"transparent"),
                color:canGoBack?C.mt:C.dm,borderRadius:"8px",
                padding:"4px 9px",fontSize:"12px",
                cursor:canGoBack?"pointer":"default",
                opacity:canGoBack?1:0.3,transition:"all .15s"}
            },"← Anterior"),
            e("span",{style:{fontSize:"13px",fontWeight:600,color:C.mt,
              padding:"0 4px",whiteSpace:"nowrap"}},
              (SV_idx+1)+" / "+SV_session.length
            ),
            e("button",{
              onClick:SV_goNext,
              disabled:!canGoNext,
              style:{background:"none",border:"1px solid "+(canGoNext?C.bd:"transparent"),
                color:canGoNext?C.mt:C.dm,borderRadius:"8px",
                padding:"4px 9px",fontSize:"12px",
                cursor:canGoNext?"pointer":"default",
                opacity:canGoNext?1:0.3,transition:"all .15s"}
            },"Siguiente →")
          ),

          // Deck badge + random badge
          e("div",{style:{display:"flex",alignItems:"center",gap:"6px",flexShrink:0}},
            e("span",{style:{
              fontSize:"10px",color:"#a78bfa",fontWeight:700,
              background:"rgba(167,139,250,.1)",
              border:"1px solid rgba(167,139,250,.25)",
              borderRadius:"12px",padding:"3px 8px",letterSpacing:"0.04em"
            }},"🔀 Aleatorio"),
            e("span",{style:{
              fontSize:"12px",color:deckCol,fontWeight:600,
              background:deckCol+"12",
              border:"1px solid "+deckCol+"30",
              borderRadius:"10px",padding:"3px 10px",
              boxShadow:"0 0 10px "+deckCol+"20"
            }},
              (cardDeck&&cardDeck.icon)||"🎴",
              " ",
              (cardDeck&&cardDeck.name)||"Baraja"
            )
          )
        ),

        // Progress bar (gradient animated fill)
        e("div",{style:{height:"4px",borderRadius:"2px",background:C.bd,overflow:"hidden"}},
          e("div",{style:{
            height:"100%",width:progressPct+"%",
            background:"linear-gradient(90deg,#a78bfa,#60a5fa)",
            borderRadius:"2px",transition:"width .4s ease"
          }})
        )
      ),

      // ── Card area with deck color glow behind ──
      e("div",{style:{position:"relative",marginBottom:"20px"}},

        // Soft radial bg in deck color
        e("div",{style:{
          position:"absolute",top:"-20px",left:"-20px",right:"-20px",bottom:"-20px",
          background:"radial-gradient(ellipse 70% 60% at 50% 40%, "+deckCol+"08, transparent)",
          pointerEvents:"none",borderRadius:"24px"
        }}),

        // Card wrapper: key here so React remounts on advance
        e("div",{
          key:"sv-wrap-"+SV_idx,
          className:SV_sliding?"sv-wrap-out":"sv-wrap-in",
          style:{position:"relative",zIndex:1}
        },
          // 3D flip inner card
          e("div",{
            onClick:function(){ if(!SV_rated) SV_setFlipped(!SV_flipped); },
            style:{
              position:"relative",
              minHeight:"240px",
              WebkitTransformStyle:"preserve-3d",
              transformStyle:"preserve-3d",
              transform:SV_flipped?"rotateY(180deg)":"rotateY(0deg)",
              transition:"transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 300ms ease",
              cursor:SV_rated?"default":"pointer",
              boxShadow:SV_flipped
                ?"0 24px 48px rgba(0,0,0,.45), 0 0 32px "+deckCol+"25"
                :"0 4px 18px rgba(0,0,0,.22)"
            }
          },

            // ── FRONT FACE ──
            e("div",{className:"sv-face",style:{
              background:"linear-gradient(135deg,"+C.cd+","+deckCol+"14)",
              border:"1px solid "+deckCol+"30",
              borderBottom:"4px solid "+deckCol
            }},
              // Type badge
              e("div",{style:{
                position:"absolute",top:"12px",right:"14px",
                display:"inline-block",
                padding:"2px 10px",borderRadius:"12px",
                fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",
                textTransform:"uppercase",color:deckCol,
                background:deckCol+"15",
                border:"1px solid "+deckCol+"30",
                boxShadow:"0 0 8px "+deckCol+"25"
              }},isCloze?"CLOZE":"BÁSICA"),

              // Front text
              e("div",{style:{fontSize:"17px",lineHeight:1.6,color:C.tx,textAlign:"center"}},
                isCloze
                  ?SV_clozeEl(currentCard.front,true)
                  :e("span",null,currentCard.front||"")
              ),

              // Tap hint
              e("div",{style:{
                position:"absolute",bottom:"12px",left:"0",right:"0",
                textAlign:"center",fontSize:"12px",color:C.dm
              }},"Toca para revelar")
            ),

            // ── BACK FACE ──
            e("div",{className:"sv-face",style:{
              background:"linear-gradient(135deg,"+deckCol+"18,"+C.cd+")",
              border:"1px solid "+deckCol+"40",
              borderBottom:"4px solid "+deckCol,
              WebkitTransform:"rotateY(180deg)",
              transform:"rotateY(180deg)"
            }},
              // Type badge (back)
              e("div",{style:{
                position:"absolute",top:"12px",right:"14px",
                display:"inline-block",
                padding:"2px 10px",borderRadius:"12px",
                fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",
                textTransform:"uppercase",color:deckCol,
                background:deckCol+"15",
                border:"1px solid "+deckCol+"30",
                boxShadow:"0 0 8px "+deckCol+"25"
              }},isCloze?"CLOZE":"BÁSICA"),

              // Back content
              e("div",{style:{fontSize:"17px",lineHeight:1.6,textAlign:"center"}},
                isCloze
                  ?SV_clozeEl(currentCard.front,false)
                  :e(F,null,
                    e("div",{style:{color:C.tx,marginBottom:"16px"}},currentCard.front||""),
                    e("div",{style:{height:"1px",background:deckCol+"40",margin:"0 0 16px"}}),
                    e("div",{style:{color:"#a5f3c4",fontSize:"16px"}},currentCard.back||"")
                  )
              )
            )
          )
        )
      ),

      // ── Mostrar respuesta button ──
      !SV_flipped ? e("button",{
        onClick:function(){ SV_setFlipped(true); },
        style:{width:"100%",padding:"14px",borderRadius:"12px",
          background:C.cd,border:"1px solid "+C.bd,
          color:C.tx,fontSize:"15px",fontWeight:600,
          cursor:"pointer",marginBottom:"16px",transition:"all .15s"}
      },"Mostrar respuesta") : null,

      // ── Rating buttons ──
      SV_flipped ? e("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"8px"}},
        ratingBtns.map(function(rb){
          return e("button",{
            key:rb.rating,
            className:"sv-rating-btn",
            onClick:function(){ SV_rate(rb.rating); },
            disabled:SV_rated||SV_sliding,
            style:{
              display:"flex",flexDirection:"column",alignItems:"center",
              gap:"4px",padding:"12px 8px",borderRadius:"12px",
              border:"1px solid "+rb.color+"40",
              background:"rgba(0,0,0,.2)",
              cursor:SV_rated||SV_sliding?"not-allowed":"pointer",
              opacity:SV_rated||SV_sliding?0.45:1
            }
          },
            e("span",{style:{fontSize:"13px",fontWeight:700,color:rb.color}},rb.label),
            e("span",{style:{fontSize:"11px",color:C.dm}},SV_intervalLabel(currentProg,rb.rating))
          );
        })
      ) : null

    );
  }

  // ══════════════════════════════════════════════════════════════
  // SUMMARY PHASE
  // ══════════════════════════════════════════════════════════════
  if(SV_phase==="summary"){
    var elapsed=SV_startTime?Math.round((Date.now()-SV_startTime)/1000):0;
    var timeStr=elapsed<60?elapsed+"s":Math.floor(elapsed/60)+"min "+(elapsed%60)+"s";
    var ratingCounts={0:0,3:0,4:0,5:0};
    var totalRated=0;
    for(var rk in SV_ratedMap){
      if(SV_ratedMap.hasOwnProperty(rk)){
        totalRated++;
        var rr=SV_ratedMap[rk];
        if(ratingCounts.hasOwnProperty(rr)) ratingCounts[rr]++;
      }
    }
    var avgSec=totalRated>0?Math.round(elapsed/totalRated):0;
    var avgStr=avgSec<60?avgSec+"s":Math.floor(avgSec/60)+"min "+(avgSec%60)+"s";

    var ratingRows=[
      {rating:0,label:"Otra vez",color:"#ef4444"},
      {rating:3,label:"Difícil",color:"#fbbf24"},
      {rating:4,label:"Bien",color:"#34d399"},
      {rating:5,label:"Fácil",color:"#60a5fa"}
    ];

    return e("div",{style:{
      maxWidth:"540px",margin:"0 auto",
      padding:"40px 20px 80px",textAlign:"center",
      position:"relative",overflow:"hidden"
    }},

      // ── CSS-only confetti (30 dots) ──
      e("div",{style:{
        position:"absolute",top:0,left:0,right:0,height:"360px",
        pointerEvents:"none",zIndex:0,overflow:"hidden"
      }},
        SV_confettiData.map(function(dot,i){
          return e("div",{key:"cf-"+i,style:{
            position:"absolute",
            top:"-12px",
            left:dot.left,
            width:dot.size,
            height:dot.size,
            borderRadius:"50%",
            background:dot.color,
            animationName:"SV_fall",
            animationDuration:dot.dur,
            animationDelay:dot.delay,
            animationTimingFunction:"ease-in",
            animationFillMode:"both"
          }});
        })
      ),

      // ── Content ──
      e("div",{style:{position:"relative",zIndex:1}},
        e("div",{style:{fontSize:"52px",marginBottom:"12px"}},"🎉"),
        e("h1",{style:{fontSize:"26px",fontWeight:700,color:C.tx,marginBottom:"8px"}},"¡Sesión completa!"),
        e("p",{style:{color:C.mt,fontSize:"14px",marginBottom:"20px"}},
          totalRated+" tarjeta"+(totalRated===1?"":"s")+" estudiada"+(totalRated===1?"":"s")
        ),

        // Time stats row
        e("div",{style:{
          display:"flex",gap:"10px",justifyContent:"center",marginBottom:"24px"
        }},
          e("div",{style:{
            flex:1,maxWidth:"140px",
            background:C.cd,border:"1px solid "+C.bd,
            borderRadius:"12px",padding:"14px 12px",textAlign:"center"
          }},
            e("div",{style:{fontSize:"18px",marginBottom:"4px"}},"⏱"),
            e("div",{style:{fontSize:"18px",fontWeight:700,color:C.tx,marginBottom:"2px"}},timeStr),
            e("div",{style:{fontSize:"11px",color:C.dm,textTransform:"uppercase",
              letterSpacing:"0.06em"}},"Tiempo total")
          ),
          e("div",{style:{
            flex:1,maxWidth:"140px",
            background:C.cd,border:"1px solid "+C.bd,
            borderRadius:"12px",padding:"14px 12px",textAlign:"center"
          }},
            e("div",{style:{fontSize:"18px",marginBottom:"4px"}},"📊"),
            e("div",{style:{fontSize:"18px",fontWeight:700,color:C.tx,marginBottom:"2px"}},avgStr),
            e("div",{style:{fontSize:"11px",color:C.dm,textTransform:"uppercase",
              letterSpacing:"0.06em"}},"Promedio/tarjeta")
          )
        ),

        // Rating breakdown
        e("div",{style:{
          background:C.cd,border:"1px solid "+C.bd,
          borderRadius:"14px",padding:"20px",marginBottom:"24px",textAlign:"left"
        }},
          ratingRows.map(function(row){
            var cnt=ratingCounts[row.rating]||0;
            var pct=totalRated>0?Math.round((cnt/totalRated)*100):0;
            return e("div",{key:row.rating,style:{marginBottom:"12px"}},
              e("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"4px"}},
                e("span",{style:{fontSize:"13px",color:row.color,fontWeight:600}},row.label),
                e("span",{style:{fontSize:"13px",color:C.mt}},cnt+" ("+pct+"%)")
              ),
              e("div",{style:{height:"6px",borderRadius:"3px",background:C.bd,overflow:"hidden"}},
                e("div",{style:{
                  height:"100%",width:pct+"%",background:row.color,
                  borderRadius:"3px",transition:"width .6s ease"
                }})
              )
            );
          })
        ),

        // Action buttons
        e("button",{
          onClick:function(){
            SV_setPhase("setup");
            SV_setIdx(0);
            SV_setRatedMap({});
            SV_setSliding(false);
            SV_setFlipped(false);
            SV_setRated(false);
          },
          style:{width:"100%",padding:"14px",borderRadius:"12px",
            background:"linear-gradient(135deg,#a78bfa,#60a5fa)",
            border:"none",color:"#fff",fontSize:"15px",fontWeight:700,
            cursor:"pointer",marginBottom:"12px"}
        },"Estudiar de nuevo")
      )
    );
  }

  return e("div",null);
}

window.StudyView=StudyView;
