// ══════════════════════════════════════════════════════════════
// ELION GENERATOR — AI flashcard generation from text/PDF/image
// ──────────────────────────────────────────────────────────────
// ES5 estricto: solo declaraciones var y function. Nada de ES6+.
// React.createElement vía el alias global `e`. Sin JSX.
// Globales internos con prefijo EG_ para evitar colisiones.
// Props: user, supabase, deckId, onImport, onClose
// ══════════════════════════════════════════════════════════════

function ElionGenerator(props) {
  var user = props.user;
  var supabase = props.supabase || window.ECEPT_SUPABASE;
  var deckId = props.deckId;
  var onImport = props.onImport;
  var onClose = props.onClose;
  var s;

  s=useState('input');  var EG_step=s[0],        EG_setStep=s[1];
  s=useState('text');   var EG_sourceType=s[0],   EG_setSourceType=s[1];
  s=useState('');       var EG_sourceText=s[0],   EG_setSourceText=s[1];
  s=useState(null);     var EG_sourceFile=s[0],   EG_setSourceFile=s[1];
  s=useState('');       var EG_sourceName=s[0],   EG_setSourceName=s[1];
  s=useState(10);       var EG_count=s[0],        EG_setCount=s[1];
  s=useState('mixed');  var EG_cardType=s[0],     EG_setCardType=s[1];
  s=useState([]);       var EG_cards=s[0],        EG_setCards=s[1];
  s=useState({});       var EG_cardStates=s[0],   EG_setCardStates=s[1];
  s=useState({});       var EG_editValues=s[0],   EG_setEditValues=s[1];
  s=useState('');       var EG_error=s[0],        EG_setError=s[1];

  // ── Derived ──
  var EG_approvedCount = 0;
  for (var _i = 0; _i < EG_cards.length; _i++) {
    if (EG_cardStates[_i] === 'approved') EG_approvedCount++;
  }
  var EG_canGenerate = EG_sourceType === 'text'
    ? EG_sourceText.trim().length > 0
    : EG_sourceFile !== null;

  // ── Shared input style ──
  var EG_inputSt = {
    width:'100%', padding:'10px 12px', borderRadius:'10px',
    border:'1px solid '+C.bd, background:C.bg, color:C.tx,
    fontSize:'13px', outline:'none', boxSizing:'border-box',
    fontFamily:'inherit', resize:'vertical', lineHeight:1.6
  };

  // ── State helpers ──
  function EG_copyStates() {
    var next = {};
    for (var k in EG_cardStates) next[k] = EG_cardStates[k];
    return next;
  }

  function EG_toggleState(idx, targetState) {
    var next = EG_copyStates();
    next[idx] = EG_cardStates[idx] === targetState ? 'pending' : targetState;
    EG_setCardStates(next);
  }

  function EG_startEdit(idx) {
    var next = EG_copyStates();
    next[idx] = 'editing';
    EG_setCardStates(next);
    var evNext = {};
    for (var k in EG_editValues) evNext[k] = EG_editValues[k];
    if (!evNext[idx]) {
      evNext[idx] = { front: EG_cards[idx].front, back: EG_cards[idx].back };
    }
    EG_setEditValues(evNext);
  }

  function EG_saveEdit(idx) {
    var next = EG_copyStates();
    next[idx] = 'approved';
    EG_setCardStates(next);
  }

  function EG_updateEditField(idx, field, val) {
    var evNext = {};
    for (var k in EG_editValues) evNext[k] = EG_editValues[k];
    var existing = evNext[idx] || {};
    evNext[idx] = { front: existing.front, back: existing.back };
    evNext[idx][field] = val;
    EG_setEditValues(evNext);
  }

  function EG_approveAll() {
    var next = {};
    for (var j = 0; j < EG_cards.length; j++) next[j] = 'approved';
    EG_setCardStates(next);
  }

  function EG_discardAll() {
    var next = {};
    for (var j = 0; j < EG_cards.length; j++) next[j] = 'discarded';
    EG_setCardStates(next);
  }

  function EG_import() {
    var approved = [];
    for (var j = 0; j < EG_cards.length; j++) {
      if (EG_cardStates[j] === 'approved') {
        var c = EG_cards[j];
        var ev = EG_editValues[j];
        if (ev) {
          approved.push({
            card_type: c.card_type,
            front: ev.front !== undefined ? ev.front : c.front,
            back: ev.back !== undefined ? ev.back : c.back,
            tags: c.tags
          });
        } else {
          approved.push(c);
        }
      }
    }
    if (typeof onImport === 'function') onImport(approved);
    if (typeof onClose === 'function') onClose();
  }

  // ── Generate ──
  async function EG_generate() {
    EG_setError('');
    EG_setStep('loading');

    try {
      var sourceData = '';
      if (EG_sourceType === 'text') {
        sourceData = EG_sourceText;
      } else if (EG_sourceFile) {
        sourceData = await new Promise(function(resolve, reject) {
          var reader = new FileReader();
          reader.onload = function(ev) { resolve(ev.target.result.split(',')[1]); };
          reader.onerror = reject;
          reader.readAsDataURL(EG_sourceFile);
        });
      }

      var sessionRes = await supabase.auth.getSession();
      var token = sessionRes.data.session.access_token;

      var resp = await fetch('/api/flashcard-gen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          sourceType: EG_sourceType,
          sourceData: sourceData,
          sourceName: EG_sourceName || 'Sin nombre',
          count: EG_count,
          cardType: EG_cardType
        })
      });

      var data = await resp.json();

      if (!resp.ok) {
        EG_setError(data.error === 'premium_required' ? 'premium_required' : (data.error || 'Error al generar. Intentá de nuevo.'));
        EG_setStep('input');
        return;
      }

      var initialStates = {};
      for (var ii = 0; ii < data.cards.length; ii++) initialStates[ii] = 'approved';
      EG_setCards(data.cards);
      EG_setCardStates(initialStates);
      EG_setStep('review');

    } catch(err) {
      EG_setError('Error de conexión. Intentá de nuevo.');
      EG_setStep('input');
    }
  }

  // ── Render: input step ──
  function renderInput() {
    if (EG_error === 'premium_required') {
      return e('div', { style: { textAlign:'center', padding:'40px 24px' } },
        e('div', { style: { fontSize:'48px', marginBottom:'16px' } }, '⭐'),
        e('div', { style: { fontSize:'20px', fontWeight:700, color:C.tx, marginBottom:'8px' } }, 'Función Premium'),
        e('div', { style: { fontSize:'14px', color:C.mt, maxWidth:'260px', margin:'0 auto 24px', lineHeight:1.5 } },
          'Generá flashcards automáticamente desde tus apuntes, PDFs e imágenes con Elion.'),
        e('button', {
          onClick: onClose,
          style: { background:C.ac, color:'#fff', border:'none', borderRadius:'12px', padding:'14px 28px', fontSize:'15px', fontWeight:600, cursor:'pointer', minHeight:'44px' }
        }, 'Entendido')
      );
    }

    var sourceTabs = [['text','📝 Texto'],['pdf','📄 PDF'],['image','🖼 Imagen']];
    var cardTypeOpts = [['basic','Básicas'],['cloze','Cloze'],['mixed','Mixtas']];

    return e('div', null,
      // Non-premium error banner
      EG_error && e('div', { style: {
        color:'#fca5a5', background:'rgba(239,68,68,.10)',
        border:'1px solid rgba(239,68,68,.28)', borderRadius:'10px',
        padding:'10px 12px', fontSize:'13px', marginBottom:'14px'
      }}, EG_error),

      // Source type tabs
      e('div', { style: { display:'flex', gap:'6px', marginBottom:'18px' } },
        sourceTabs.map(function(tab) {
          var active = EG_sourceType === tab[0];
          return e('button', {
            key: tab[0],
            onClick: function() { EG_setSourceType(tab[0]); EG_setSourceFile(null); },
            style: {
              flex:1, padding:'9px 8px', borderRadius:'10px',
              border:'1px solid '+(active?'#a78bfa':C.bd),
              background: active?'rgba(167,139,250,.15)':C.bg,
              color: active?'#a78bfa':C.mt,
              fontSize:'12px', fontWeight:700, cursor:'pointer'
            }
          }, tab[1]);
        })
      ),

      // Text area
      EG_sourceType === 'text' && e('textarea', {
        value: EG_sourceText,
        onChange: function(ev) { EG_setSourceText(ev.target.value); },
        placeholder: 'Pegá el contenido aquí…',
        rows: 7,
        style: {
          width:'100%', padding:'10px 12px', borderRadius:'10px',
          border:'1px solid '+C.bd, background:C.bg, color:C.tx,
          fontSize:'13px', outline:'none', boxSizing:'border-box',
          fontFamily:'inherit', resize:'vertical', lineHeight:1.6,
          marginBottom:'14px', minHeight:'140px'
        }
      }),

      // File drop area (PDF / image)
      EG_sourceType !== 'text' && e('div', { style: { marginBottom:'14px' } },
        e('label', { style: {
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          gap:'10px', padding:'28px 20px', borderRadius:'12px',
          border:'2px dashed '+(EG_sourceFile?'#a78bfa':C.bd),
          background: EG_sourceFile?'rgba(167,139,250,.08)':C.bg,
          cursor:'pointer', color: EG_sourceFile?'#a78bfa':C.mt,
          fontSize:'13px', textAlign:'center'
        }},
          e('span', { style: { fontSize:'28px' } }, EG_sourceType==='pdf'?'📄':'🖼'),
          e('span', null, EG_sourceFile ? EG_sourceFile.name : ('Seleccioná un '+(EG_sourceType==='pdf'?'PDF':'imagen'))),
          EG_sourceFile && e('span', { style: { fontSize:'11px', color:C.mt } }, '✓ Archivo listo'),
          e('input', {
            type:'file',
            accept: EG_sourceType==='pdf' ? '.pdf,application/pdf' : 'image/*',
            style: { display:'none' },
            onChange: function(ev) {
              var f = ev.target.files && ev.target.files[0];
              if (f) EG_setSourceFile(f);
            }
          })
        )
      ),

      // Source name
      e('input', {
        type:'text', value:EG_sourceName,
        onChange: function(ev) { EG_setSourceName(ev.target.value); },
        placeholder: 'Ej: Capítulo 3 - Cardiología',
        style: {
          width:'100%', padding:'10px 12px', borderRadius:'10px',
          border:'1px solid '+C.bd, background:C.bg, color:C.tx,
          fontSize:'13px', outline:'none', boxSizing:'border-box',
          fontFamily:'inherit', lineHeight:1.6, marginBottom:'16px'
        }
      }),

      // Count slider
      e('div', { style: { marginBottom:'16px' } },
        e('div', { style: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' } },
          e('span', { style: { fontSize:'12px', color:C.mt, fontWeight:700 } }, 'Cantidad de flashcards'),
          e('span', { style: { fontSize:'14px', color:C.tx, fontWeight:700 } }, EG_count+' flashcards')
        ),
        e('input', {
          type:'range', min:5, max:30, value:EG_count,
          onChange: function(ev) { EG_setCount(parseInt(ev.target.value)); },
          style: { width:'100%', accentColor:'#a78bfa' }
        })
      ),

      // Card type selector
      e('div', { style: { marginBottom:'20px' } },
        e('div', { style: { fontSize:'12px', color:C.mt, fontWeight:700, marginBottom:'8px' } }, 'Tipo de tarjetas'),
        e('div', { style: { display:'flex', gap:'6px' } },
          cardTypeOpts.map(function(opt) {
            var active = EG_cardType === opt[0];
            return e('button', {
              key: opt[0],
              onClick: function() { EG_setCardType(opt[0]); },
              style: {
                flex:1, padding:'9px 8px', borderRadius:'10px',
                border:'1px solid '+(active?'#a78bfa':C.bd),
                background: active?'rgba(167,139,250,.15)':C.bg,
                color: active?'#a78bfa':C.mt,
                fontSize:'12px', fontWeight:700, cursor:'pointer'
              }
            }, opt[1]);
          })
        )
      ),

      // Generate button
      e('button', {
        onClick: EG_generate,
        disabled: !EG_canGenerate,
        style: {
          width:'100%', padding:'14px', borderRadius:'12px', border:'none',
          background: EG_canGenerate ? 'linear-gradient(135deg,#a78bfa,#60a5fa)' : C.bd,
          color: EG_canGenerate ? '#fff' : C.dm,
          fontSize:'15px', fontWeight:700,
          cursor: EG_canGenerate ? 'pointer' : 'default',
          boxShadow: EG_canGenerate ? '0 4px 14px rgba(167,139,250,.35)' : 'none',
          minHeight:'48px'
        }
      }, '✨ Generar')
    );
  }

  // ── Render: loading step ──
  function renderLoading() {
    return e('div', { style: { textAlign:'center', padding:'60px 24px' } },
      e('div', { style: { fontSize:'48px', marginBottom:'16px', animation:'float 2s ease-in-out infinite' } }, '🧬'),
      e('div', { style: { fontSize:'16px', fontWeight:700, color:C.tx, marginBottom:'8px' } }, 'Elion está analizando el contenido…'),
      e('div', { style: { fontSize:'13px', color:C.mt } }, 'Esto puede tomar unos segundos')
    );
  }

  // ── Render: review step ──
  function renderReview() {
    return e('div', null,
      // Card list
      e('div', { style: { display:'flex', flexDirection:'column', gap:'10px', marginBottom:'16px' } },
        EG_cards.map(function(card, idx) {
          var st = EG_cardStates[idx];
          var bdrColor = st==='approved'?'#34d399':st==='discarded'?'#ef4444':C.bd;
          var ev = EG_editValues[idx] || {};
          var isEditing = st === 'editing';

          return e('div', { key:idx, style: {
            background:C.cd, border:'1px solid '+C.bd,
            borderLeft:'4px solid '+bdrColor, borderRadius:'12px', padding:'14px',
            opacity: st==='discarded'?0.5:1, transition:'opacity .2s'
          }},
            // Badge row
            e('div', { style: { display:'flex', gap:'6px', alignItems:'center', marginBottom:'10px' } },
              e('span', { style: {
                fontSize:'9px', fontWeight:800, letterSpacing:1.5, textTransform:'uppercase',
                padding:'2px 8px', borderRadius:'4px',
                background: card.card_type==='cloze'?'rgba(251,191,36,.15)':'rgba(96,165,250,.15)',
                color: card.card_type==='cloze'?'#fbbf24':'#60a5fa',
                border:'1px solid '+(card.card_type==='cloze'?'rgba(251,191,36,.3)':'rgba(96,165,250,.3)')
              }}, card.card_type.toUpperCase()),
              e('span', { style: { fontSize:'11px', color:C.dm } }, '#'+(idx+1))
            ),

            // Content: editing vs display
            isEditing
              ? e('div', null,
                  e('textarea', {
                    value: ev.front !== undefined ? ev.front : card.front,
                    onChange: function(ev2) { EG_updateEditField(idx, 'front', ev2.target.value); },
                    placeholder: 'Frente / pregunta', rows:3,
                    style: {
                      width:'100%', padding:'10px 12px', borderRadius:'10px',
                      border:'1px solid '+C.bd, background:C.bg, color:C.tx,
                      fontSize:'13px', outline:'none', boxSizing:'border-box',
                      fontFamily:'inherit', resize:'vertical', lineHeight:1.6, marginBottom:'8px'
                    }
                  }),
                  card.card_type !== 'cloze' && e('textarea', {
                    value: ev.back !== undefined ? ev.back : card.back,
                    onChange: function(ev3) { EG_updateEditField(idx, 'back', ev3.target.value); },
                    placeholder: 'Dorso / respuesta', rows:2,
                    style: {
                      width:'100%', padding:'10px 12px', borderRadius:'10px',
                      border:'1px solid '+C.bd, background:C.bg, color:C.tx,
                      fontSize:'13px', outline:'none', boxSizing:'border-box',
                      fontFamily:'inherit', resize:'vertical', lineHeight:1.6, marginBottom:'8px'
                    }
                  }),
                  e('button', {
                    onClick: function() { EG_saveEdit(idx); },
                    style: {
                      padding:'7px 14px', borderRadius:'8px', border:'none',
                      background:'#34d399', color:'#fff',
                      fontSize:'12px', fontWeight:700, cursor:'pointer', marginBottom:'10px'
                    }
                  }, '✓ Guardar edición')
                )
              : e('div', { style: { marginBottom:'10px' } },
                  e('p', { style: { fontSize:'13px', color:C.tx, margin:'0 0 6px', lineHeight:1.5 } }, card.front),
                  card.back && e('p', { style: { fontSize:'12px', color:C.mt, margin:0, lineHeight:1.5 } }, card.back),
                  card.tags && card.tags.length > 0 && e('div', { style: { display:'flex', flexWrap:'wrap', gap:'4px', marginTop:'8px' } },
                    card.tags.map(function(t, ti) {
                      return e('span', { key:ti, style: {
                        fontSize:'10px', padding:'2px 7px', borderRadius:'999px',
                        background:'rgba(167,139,250,.15)', border:'1px solid rgba(167,139,250,.3)',
                        color:'#a78bfa', fontWeight:600
                      }}, '#'+t);
                    })
                  )
                ),

            // Action buttons
            e('div', { style: { display:'flex', gap:'6px', flexWrap:'wrap' } },
              e('button', {
                onClick: function() { EG_toggleState(idx, 'approved'); },
                style: {
                  padding:'6px 12px', borderRadius:'8px',
                  border:'1px solid '+(st==='approved'?'#34d399':'rgba(52,211,153,.4)'),
                  background: st==='approved'?'rgba(52,211,153,.15)':'none',
                  color:'#34d399', fontSize:'11px', fontWeight:700, cursor:'pointer', minHeight:'32px'
                }
              }, st==='approved'?'✓ Aprobada':'✓ Aprobar'),
              e('button', {
                onClick: function() { EG_startEdit(idx); },
                style: {
                  padding:'6px 12px', borderRadius:'8px', border:'1px solid '+C.bd,
                  background:'none', color:C.mt, fontSize:'11px', fontWeight:700,
                  cursor:'pointer', minHeight:'32px'
                }
              }, '✎ Editar'),
              e('button', {
                onClick: function() { EG_toggleState(idx, 'discarded'); },
                style: {
                  padding:'6px 12px', borderRadius:'8px',
                  border:'1px solid '+(st==='discarded'?'#ef4444':'rgba(239,68,68,.4)'),
                  background: st==='discarded'?'rgba(239,68,68,.15)':'none',
                  color:'#ef4444', fontSize:'11px', fontWeight:700, cursor:'pointer', minHeight:'32px'
                }
              }, st==='discarded'?'✗ Descartada':'✗ Descartar')
            )
          );
        })
      ),

      // Sticky footer
      e('div', { style: {
        position:'sticky', bottom:0, background:C.cd,
        borderTop:'1px solid '+C.bd, paddingTop:'12px',
        display:'flex', gap:'8px', flexWrap:'wrap'
      }},
        e('button', {
          onClick: EG_approveAll,
          style: {
            padding:'8px 14px', borderRadius:'9px',
            border:'1px solid rgba(52,211,153,.4)',
            background:'rgba(52,211,153,.1)', color:'#34d399',
            fontSize:'12px', fontWeight:700, cursor:'pointer'
          }
        }, '✓ Aprobar todas'),
        e('button', {
          onClick: EG_discardAll,
          style: {
            padding:'8px 14px', borderRadius:'9px',
            border:'1px solid rgba(239,68,68,.4)',
            background:'rgba(239,68,68,.1)', color:'#ef4444',
            fontSize:'12px', fontWeight:700, cursor:'pointer'
          }
        }, '✗ Descartar todas'),
        e('button', {
          onClick: EG_import,
          disabled: EG_approvedCount === 0,
          style: {
            flex:1, padding:'12px 16px', borderRadius:'12px', border:'none',
            background: EG_approvedCount>0 ? 'linear-gradient(135deg,#a78bfa,#60a5fa)' : C.bd,
            color: EG_approvedCount>0 ? '#fff' : C.dm,
            fontSize:'14px', fontWeight:700,
            cursor: EG_approvedCount>0 ? 'pointer' : 'default',
            boxShadow: EG_approvedCount>0 ? '0 4px 14px rgba(167,139,250,.3)' : 'none',
            minHeight:'44px'
          }
        }, '📥 Importar '+EG_approvedCount+' card'+(EG_approvedCount!==1?'s':'')+' aprobada'+(EG_approvedCount!==1?'s':''))
      )
    );
  }

  // ── Portal ──
  return ReactDOM.createPortal(
    e('div', {
      style: {
        position:'fixed', top:0, left:0, right:0, bottom:0, zIndex:300,
        background:'rgba(6,10,20,.88)', backdropFilter:'blur(6px)',
        WebkitBackdropFilter:'blur(6px)',
        display:'flex', alignItems:'flex-start', justifyContent:'center',
        padding:'20px', overflowY:'auto', WebkitOverflowScrolling:'touch'
      },
      onClick: function(ev) { if (ev.target===ev.currentTarget && EG_step!=='loading') onClose(); }
    },
    e('div', {
      style: {
        width:'100%', maxWidth:'640px',
        background:C.cd, border:'1px solid '+C.bd, borderRadius:'18px',
        boxShadow:'0 16px 48px rgba(0,0,0,.7)',
        padding:'22px 20px 20px', boxSizing:'border-box',
        marginTop:'20px', marginBottom:'40px'
      },
      onClick: function(ev) { ev.stopPropagation(); }
    },
      // Header
      e('div', { style: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' } },
        e('div', null,
          e('h2', { style: { fontSize:'17px', fontWeight:800, color:C.tx, margin:0 } },
            '✨ Generar flashcards con Elion'),
          EG_step==='review' && e('p', { style: { fontSize:'11px', color:C.dm, margin:'3px 0 0' } },
            EG_approvedCount+' aprobadas / '+EG_cards.length+' total'
          )
        ),
        e('button', {
          onClick: onClose, 'aria-label':'Cerrar',
          disabled: EG_step==='loading',
          style: {
            background:'none', border:'none', color:C.mt, fontSize:'24px',
            cursor: EG_step==='loading'?'default':'pointer',
            minWidth:'44px', minHeight:'44px',
            display:'flex', alignItems:'center', justifyContent:'center',
            borderRadius:'8px', opacity: EG_step==='loading'?0.4:1
          }
        }, '×')
      ),

      // Step content
      EG_step==='input'   && renderInput(),
      EG_step==='loading' && renderLoading(),
      EG_step==='review'  && renderReview()
    )
    ),
    document.body
  );
}

window.ElionGenerator = ElionGenerator;
