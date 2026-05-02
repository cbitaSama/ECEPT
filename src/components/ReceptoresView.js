// ══════════════════════════════════════════════════════════════
// COMPONENT: ReceptoresView — Fisiología receptor families view
// ══════════════════════════════════════════════════════════════
function ReceptoresView(){
  var fs=useState('adr'),family=fs[0],setFamily=fs[1];
  var rs=useState(0),recIdx=rs[0],setRecIdx=rs[1];
  var ts=useState(0),mainTab=ts[0],setMainTab=ts[1];
  var qs=useState({}),quizAns=qs[0],setQuizAns=qs[1];
  var ss=useState(0),streak=ss[0],setStreak=ss[1];
  var bss=useState(0),bestStreak=bss[0],setBestStreak=bss[1];

  var currentFamily=null;
  for(var fi=0;fi<RECEPTOR_FAMILIES.length;fi++){if(RECEPTOR_FAMILIES[fi].id===family){currentFamily=RECEPTOR_FAMILIES[fi];break;}}
  if(!currentFamily) currentFamily=RECEPTOR_FAMILIES[0];

  var currentRec=currentFamily.receptors[recIdx]||currentFamily.receptors[0];
  var currentQuiz=RECEPTOR_QUIZZES[family]||[];
  var currentPearls=RECEPTOR_PEARLS[family]||[];

  function changeFamily(id){
    setFamily(id);setRecIdx(0);setQuizAns({});setMainTab(0);
    try{window.scrollTo({top:0,behavior:'smooth'})}catch(err){}
  }

  useEffect(function(){
    window._receptorFocus=function(subId){changeFamily(subId);};
    return function(){window._receptorFocus=null;};
  },[]);

  function answerQuiz(qi,oi){
    if(quizAns[qi]!==undefined) return;
    var newAns={};
    for(var k in quizAns) newAns[k]=quizAns[k];
    newAns[qi]=oi;
    setQuizAns(newAns);
    if(oi===currentQuiz[qi].r){
      var ns=streak+1;setStreak(ns);
      if(ns>bestStreak) setBestStreak(ns);
    } else {setStreak(0)}
  }

  // ─── HEADER ───
  var header=e('div',{style:{textAlign:'center',marginBottom:'24px'}},
    e('span',{style:{display:'inline-block',fontSize:'10px',letterSpacing:'3px',textTransform:'uppercase',color:'#ec4899',background:'rgba(236,72,153,.12)',border:'1px solid rgba(236,72,153,.3)',padding:'5px 14px',borderRadius:'4px',marginBottom:'12px'}},'Fisiología · Receptores Celulares'),
    e('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'24px',fontWeight:900,background:'linear-gradient(135deg,#3b82f6,#8b5cf6,#f472b6,#fbbf24)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}},'Receptores Farmacológicos'),
    e('p',{style:{color:C.dm,fontSize:'13px'}},RECEPTOR_FAMILIES.length+' familias · '+RECEPTOR_FAMILIES.reduce(function(a,f){return a+f.receptors.length},0)+' subtipos · Mecanismos, fármacos y clínica')
  );

  // ─── FAMILY SELECTOR ───
  var familySelector=e('div',{style:{marginBottom:'20px'}},
    e('div',{style:{fontSize:'11px',fontWeight:700,color:C.dm,textTransform:'uppercase',letterSpacing:'2px',marginBottom:'12px',paddingLeft:'4px'}},'📚 Elige una familia'),
    e('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'10px'}},
      RECEPTOR_FAMILIES.map(function(fam){
        var isActive=family===fam.id;
        return e('button',{key:fam.id,onClick:function(){changeFamily(fam.id)},
          style:{
            background:isActive?'linear-gradient(135deg,'+fam.col+'22,'+fam.col+'08)':C.cd,
            border:'1.5px solid '+(isActive?fam.col+'66':C.bd),
            borderRadius:'14px',padding:'14px',cursor:'pointer',textAlign:'left',
            color:C.tx,transition:'all .2s',
            boxShadow:isActive?'0 4px 20px '+fam.col+'25':'none'
          }},
          e('div',{style:{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}},
            e('span',{style:{fontSize:'22px'}},fam.icon),
            e('div',{style:{fontWeight:800,fontSize:'14px',color:isActive?fam.col:C.tx}},fam.name)
          ),
          e('div',{style:{fontSize:'10px',color:C.dm,lineHeight:1.4}},fam.desc),
          e('div',{style:{fontSize:'10px',color:fam.col,marginTop:'6px',fontWeight:600}},fam.receptors.length+' receptores')
        )
      })
    )
  );

  // ─── FAMILY CARD ───
  var familyCard=e('div',{style:{marginBottom:'20px',padding:'16px 18px',background:'linear-gradient(135deg,'+currentFamily.col+'10,rgba(13,18,36,.9))',border:'1.5px solid '+currentFamily.col+'40',borderRadius:'16px'}},
    e('div',{style:{display:'flex',alignItems:'center',gap:'14px',flexWrap:'wrap'}},
      e('span',{style:{fontSize:'36px'}},currentFamily.icon),
      e('div',{style:{flex:1,minWidth:'200px'}},
        e('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',fontWeight:800,color:currentFamily.col,marginBottom:'2px'}},currentFamily.name),
        e('div',{style:{fontSize:'12px',color:C.mt}},'🧪 ',e('strong',{style:{color:C.tx}},currentFamily.nt))
      )
    )
  );

  // ─── MAIN TABS ───
  var tabs=e('div',{style:{display:'flex',gap:'6px',overflowX:'auto',marginBottom:'20px',padding:'4px',background:'rgba(255,255,255,.02)',borderRadius:'12px'}},
    [{l:'🧬 Receptores',i:0},{l:'📊 Proteínas G',i:1},{l:'🧠 Quiz',i:2},{l:'📌 Perlas',i:3}].map(function(tb){
      var isAct=mainTab===tb.i;
      return e('button',{key:tb.i,onClick:function(){setMainTab(tb.i)},
        style:{flex:'1 1 auto',minWidth:'100px',padding:'10px 14px',
          background:isAct?currentFamily.col:'transparent',
          border:'none',borderRadius:'10px',
          color:isAct?'#060a14':C.mt,
          fontSize:'13px',fontWeight:isAct?700:500,cursor:'pointer',whiteSpace:'nowrap',
          transition:'all .2s'
        }},tb.l)
    })
  );

  // ─── CONTENT ───
  var content;

  if(mainTab===0){
    // RECEPTORS TAB
    var subSelector=e('div',{style:{display:'flex',gap:'8px',overflowX:'auto',marginBottom:'20px',paddingBottom:'6px'}},
      currentFamily.receptors.map(function(r,i){
        var isAct=recIdx===i;
        return e('button',{key:r.id,onClick:function(){setRecIdx(i)},
          style:{
            flexShrink:0,display:'flex',alignItems:'center',gap:'8px',
            padding:'10px 18px',borderRadius:'100px',
            border:'1.5px solid '+(isAct?r.color:r.color+'40'),
            background:isAct?r.color:'transparent',
            color:isAct?'#060a14':r.color,
            fontSize:'14px',fontWeight:isAct?700:500,cursor:'pointer',whiteSpace:'nowrap'
          }},
          e('span',{style:{fontSize:'18px',fontWeight:800}},r.symbol)
        )
      })
    );

    var heroCard=e('div',{style:{borderRadius:'16px',padding:'24px',marginBottom:'20px',border:'1.5px solid '+currentRec.color+'40',background:currentRec.colorBg}},
      e('div',{style:{display:'flex',alignItems:'flex-start',gap:'16px',marginBottom:'20px',flexWrap:'wrap'}},
        e('span',{style:{fontFamily:"'Playfair Display',serif",fontSize:'64px',fontWeight:900,lineHeight:1,color:currentRec.color,textShadow:'0 0 30px '+currentRec.color+'40'}},currentRec.letter),
        e('div',{style:{flex:1,minWidth:'200px'}},
          e('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'26px',fontWeight:800,marginBottom:'6px',color:C.tx}},currentRec.symbol+' — '+currentRec.name),
          e('div',{style:{display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap'}},
            e('span',{style:{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.12)',padding:'4px 12px',borderRadius:'100px',fontSize:'12px',fontWeight:600,color:C.tx}},'🔗 '+currentRec.protein),
            currentRec.messenger.map(function(m,mi){
              return e('span',{key:mi,style:{fontSize:'12px',color:C.mt,padding:'4px 10px',background:'rgba(255,255,255,.03)',borderRadius:'100px'}},m)
            })
          ),
          e('div',{style:{fontSize:'12px',color:C.mt,marginTop:'8px',fontFamily:"'Playfair Display',serif",fontStyle:'italic'}},'→ '+currentRec.net)
        )
      ),
      e('div',{style:{padding:'16px',background:'rgba(0,0,0,.4)',borderRadius:'12px',marginBottom:'20px',border:'1px solid '+C.bd,overflowX:'auto'}},
        e('div',{style:{fontSize:'10px',fontWeight:700,color:currentRec.color,textTransform:'uppercase',letterSpacing:'2px',marginBottom:'12px'}},'⚙️ Vía de señalización'),
        e('div',{style:{display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap'}},
          currentRec.pathway.map(function(p,pi){
            return e(F,{key:pi},
              pi>0&&e('span',{style:{color:currentRec.color,fontSize:'16px'}},'→'),
              e('span',{style:{padding:'6px 12px',borderRadius:'8px',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.12)',fontSize:'12px',fontWeight:600,whiteSpace:'nowrap',color:C.tx}},p)
            )
          })
        )
      ),
      e('div',{style:{marginBottom:'20px'}},
        e('div',{style:{fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:C.dm,marginBottom:'12px'}},'🎯 Efectos por tejido'),
        currentRec.effects.map(function(ef,ei){
          return e('div',{key:ei,style:{display:'flex',alignItems:'flex-start',gap:'12px',padding:'10px 0',borderBottom:ei<currentRec.effects.length-1?'1px solid rgba(255,255,255,.06)':'none'}},
            e('span',{style:{fontSize:'18px',color:ef.d==='↑'?'#34d399':'#ef4444',fontWeight:800,flexShrink:0,width:'24px',textAlign:'center'}},ef.d),
            e('div',{style:{flex:1}},
              e('div',{style:{fontSize:'13px',fontWeight:600,color:C.tx,marginBottom:'2px'}},ef.t),
              e('div',{style:{fontSize:'12px',color:C.mt,lineHeight:1.5}},ef.x)
            )
          )
        })
      ),
      e('div',{style:{padding:'14px 16px',borderRadius:'12px',background:'rgba(0,0,0,.3)',borderLeft:'3px solid '+currentRec.color,marginBottom:'20px'}},
        e('div',{style:{fontSize:'10px',fontWeight:700,color:currentRec.color,textTransform:'uppercase',letterSpacing:'1px',marginBottom:'6px'}},'🏥 Relevancia clínica'),
        e('div',{style:{fontSize:'13px',color:C.tx,lineHeight:1.6}},currentRec.clinical)
      ),
      e('div',{style:{fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:C.dm,marginBottom:'12px'}},'💊 Fármacos clave'),
      e('div',{style:{display:'flex',flexDirection:'column',gap:'8px'}},
        currentRec.drugs.map(function(d,di){
          return e('div',{key:di,style:{display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',borderRadius:'10px',background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)'}},
            e('div',{style:{width:'10px',height:'10px',borderRadius:'50%',background:d.c,flexShrink:0,boxShadow:'0 0 10px '+d.c+'80'}}),
            e('div',{style:{flex:1,minWidth:0}},
              e('div',{style:{fontSize:'14px',fontWeight:700,color:d.c,marginBottom:'2px'}},d.n),
              e('div',{style:{fontSize:'11px',color:C.dm,marginBottom:'2px'}},d.r),
              e('div',{style:{fontSize:'12px',color:C.mt}},'📌 '+d.u)
            )
          )
        })
      )
    );

    var comparativeTable=e('div',{style:{marginTop:'24px'}},
      e('h4',{style:{fontFamily:"'Playfair Display',serif",fontSize:'16px',fontWeight:700,marginBottom:'12px',color:currentFamily.col}},'📊 Comparativa — '+currentFamily.name),
      e('div',{style:{overflowX:'auto',borderRadius:'12px',border:'1.5px solid '+C.bd}},
        e('table',{style:{width:'100%',borderCollapse:'collapse',fontSize:'12px'}},
          e('thead',null,e('tr',{style:{background:C.cd}},
            e('th',{style:{padding:'10px 12px',textAlign:'left',color:C.dm,fontSize:'10px',fontWeight:600,textTransform:'uppercase'}},'Receptor'),
            e('th',{style:{padding:'10px 12px',textAlign:'left',color:C.dm,fontSize:'10px',fontWeight:600,textTransform:'uppercase'}},'Prot'),
            e('th',{style:{padding:'10px 12px',textAlign:'left',color:C.dm,fontSize:'10px',fontWeight:600,textTransform:'uppercase'}},'Efecto'),
            e('th',{style:{padding:'10px 12px',textAlign:'left',color:C.dm,fontSize:'10px',fontWeight:600,textTransform:'uppercase'}},'Ejemplo')
          )),
          e('tbody',null,currentFamily.receptors.map(function(r,ri){
            return e('tr',{key:r.id,style:{borderTop:'1px solid '+C.bd,cursor:'pointer',background:recIdx===ri?r.color+'10':'transparent'},onClick:function(){setRecIdx(ri)}},
              e('td',{style:{padding:'10px 12px',fontWeight:700,color:r.color,fontSize:'14px'}},r.symbol),
              e('td',{style:{padding:'10px 12px'}},e('span',{style:{display:'inline-block',padding:'2px 8px',borderRadius:'100px',fontSize:'10px',fontWeight:600,background:r.color+'15',color:r.color}},r.protein)),
              e('td',{style:{padding:'10px 12px',color:C.mt,fontSize:'11px'}},r.net),
              e('td',{style:{padding:'10px 12px',color:C.mt,fontSize:'11px'}},r.drugs[0]?r.drugs[0].n:'—')
            )
          }))
        )
      )
    );

    content=e(F,null,subSelector,heroCard,comparativeTable);

  } else if(mainTab===1){
    // PROTEIN G TAB
    content=e(F,null,
      e('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'20px',fontWeight:700,marginBottom:'8px',color:currentFamily.col}},'🔬 Proteínas G — Transversal'),
      e('p',{style:{fontSize:'13px',color:C.mt,marginBottom:'20px'}},'Sistema de señalización que conecta receptores con efectores intracelulares.'),
      e('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:'14px',marginBottom:'24px'}},
        RECEPTOR_PROT_G.map(function(g,gi){
          return e('div',{key:gi,style:{padding:'20px',borderRadius:'14px',background:'linear-gradient(135deg,'+g.color+'15,rgba(13,18,36,.8))',border:'1.5px solid '+g.color+'40'}},
            e('div',{style:{fontSize:'32px',fontWeight:900,fontFamily:"'Playfair Display',serif",color:g.color,marginBottom:'4px'}},g.name),
            e('div',{style:{fontSize:'12px',color:C.dm,marginBottom:'8px'}},g.desc),
            e('div',{style:{fontSize:'14px',fontWeight:700,color:C.tx,marginBottom:'12px',fontFamily:"'JetBrains Mono',monospace"}},g.result),
            e('div',{style:{fontSize:'11px',color:C.dm,borderTop:'1px solid rgba(255,255,255,.08)',paddingTop:'10px'}},
              'Receptores: ',
              e('span',{style:{color:g.color,fontWeight:600}},g.receptors)
            )
          )
        })
      ),
      e('div',{style:{padding:'16px 18px',background:'rgba(251,191,36,.06)',border:'1.5px solid rgba(251,191,36,.25)',borderRadius:'12px'}},
        e('div',{style:{fontSize:'12px',fontWeight:700,color:'#fbbf24',marginBottom:'10px',textTransform:'uppercase',letterSpacing:'1px'}},'💡 Reglas mnemotécnicas'),
        e('div',{style:{fontSize:'13px',color:C.tx,lineHeight:1.8}},
          e('div',null,e('strong',{style:{color:'#fbbf24'}},'Gq → "Q de Quema"'),' → Ca²⁺ → contracción'),
          e('div',null,e('strong',{style:{color:'#fbbf24'}},'Gi → "i de inhibe"'),' → ↓AMPc'),
          e('div',null,e('strong',{style:{color:'#fbbf24'}},'Gs → "s de Sube"'),' → ↑AMPc'),
          e('div',null,e('strong',{style:{color:'#fbbf24'}},'Canal iónico'),' → Transmisión rápida')
        )
      )
    );

  } else if(mainTab===2){
    // QUIZ TAB
    content=e(F,null,
      e('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px',flexWrap:'wrap',gap:'8px'}},
        e('div',null,
          e('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'20px',fontWeight:700,color:currentFamily.col}},'🧠 Quiz — '+currentFamily.name),
          e('p',{style:{fontSize:'12px',color:C.dm,marginTop:'2px'}},currentQuiz.length+' preguntas · '+Object.keys(quizAns).length+'/'+currentQuiz.length+' respondidas')
        ),
        streak>0&&e('div',{style:{display:'flex',alignItems:'center',gap:'6px',padding:'6px 14px',background:'rgba(52,211,153,.12)',borderRadius:'100px',border:'1px solid rgba(52,211,153,.3)'}},
          e('span',{style:{fontSize:'16px'}},'🔥'),
          e('span',{style:{fontSize:'13px',fontWeight:700,color:'#34d399'}},streak+' racha')
        )
      ),
      currentQuiz.map(function(qq,qi){
        var answered=quizAns[qi]!==undefined;
        var isCorrect=answered&&quizAns[qi]===qq.r;
        return e('div',{key:qi,style:{background:C.cd,border:'1.5px solid '+(answered?(isCorrect?'#34d39944':'#ef444444'):C.bd),borderRadius:'14px',padding:'20px',marginBottom:'14px'}},
          e('div',{style:{fontSize:'11px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:C.dm,marginBottom:'8px'}},'Pregunta '+(qi+1)+' de '+currentQuiz.length),
          e('div',{style:{fontFamily:"'Playfair Display',serif",fontSize:'16px',fontWeight:600,marginBottom:'14px',lineHeight:1.5,color:C.tx}},qq.q),
          e('div',{style:{display:'flex',flexDirection:'column',gap:'8px'}},
            qq.opts.map(function(opt,oi){
              var bg='rgba(255,255,255,.03)',bd=C.bd,col=C.mt;
              if(answered&&oi===qq.r){bg='rgba(52,211,153,.12)';bd='#34d399';col='#34d399'}
              if(answered&&oi===quizAns[qi]&&oi!==qq.r){bg='rgba(239,68,68,.12)';bd='#ef4444';col='#ef4444'}
              return e('button',{key:oi,onClick:function(){answerQuiz(qi,oi)},
                style:{padding:'12px 16px',borderRadius:'10px',cursor:answered?'default':'pointer',border:'1.5px solid '+bd,background:bg,color:col,textAlign:'left',width:'100%',fontSize:'14px',fontWeight:500,transition:'all .2s',fontFamily:'inherit'}},
                String.fromCharCode(65+oi)+') '+opt,
                answered&&oi===qq.r?' ✓':'',
                answered&&oi===quizAns[qi]&&oi!==qq.r?' ✗':''
              )
            })
          ),
          answered&&e('div',{style:{marginTop:'14px',padding:'12px 14px',background:'rgba(255,255,255,.03)',borderRadius:'10px',borderLeft:'3px solid '+(isCorrect?'#34d399':'#ef4444'),fontSize:'13px',color:C.mt,lineHeight:1.6}},
            e('span',{style:{color:isCorrect?'#34d399':'#ef4444',fontWeight:700}},isCorrect?'✓ Correcto — ':'✗ Incorrecto — '),
            qq.x
          )
        )
      }),
      Object.keys(quizAns).length===currentQuiz.length&&currentQuiz.length>0&&e('div',{style:{textAlign:'center',marginTop:'20px',padding:'20px',background:'linear-gradient(135deg,'+currentFamily.col+'15,rgba(13,18,36,.8))',border:'1.5px solid '+currentFamily.col+'40',borderRadius:'14px'}},
        e('div',{style:{fontSize:'32px',marginBottom:'8px'}},'🎉'),
        e('div',{style:{fontSize:'16px',fontWeight:700,marginBottom:'4px',color:currentFamily.col}},'Quiz completado'),
        e('div',{style:{fontSize:'13px',color:C.mt,marginBottom:'14px'}},'Aciertos: '+Object.keys(quizAns).filter(function(k){return quizAns[k]===currentQuiz[k].r}).length+'/'+currentQuiz.length+' · Mejor racha: '+bestStreak),
        e('button',{onClick:function(){setQuizAns({})},style:{padding:'10px 24px',borderRadius:'100px',border:'1.5px solid '+currentFamily.col,background:'transparent',color:currentFamily.col,fontSize:'13px',fontWeight:600,cursor:'pointer'}},'↺ Repetir quiz')
      )
    );

  } else {
    // PEARLS TAB
    content=e(F,null,
      e('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'20px',fontWeight:700,marginBottom:'16px',color:currentFamily.col}},'📌 Perlas Clínicas · '+currentFamily.name),
      currentPearls.map(function(p,pi){
        return e('div',{key:pi,style:{background:C.cd,border:'1.5px solid '+C.bd,borderRadius:'12px',padding:'18px 20px',marginBottom:'10px'}},
          e('div',{style:{fontFamily:"'Playfair Display',serif",fontSize:'15px',fontWeight:700,marginBottom:'10px',color:currentFamily.col}},(p.ic||'')+' '+p.t),
          e('div',{style:{display:'flex',flexDirection:'column',gap:'8px'}},
            (p.items||p.i||[]).map(function(item,ii){
              return e('div',{key:ii,style:{display:'flex',gap:'10px',alignItems:'flex-start',lineHeight:1.6}},
                e('span',{style:{color:currentFamily.col,flexShrink:0,marginTop:'8px',width:'4px',height:'4px',borderRadius:'50%',background:currentFamily.col}}),
                e('span',{style:{color:C.tx,fontSize:'13px'}},item)
              )
            })
          )
        )
      })
    );
  }

  return e('div',{style:{paddingBottom:'40px'}},
    header,familySelector,familyCard,tabs,content
  );
}
