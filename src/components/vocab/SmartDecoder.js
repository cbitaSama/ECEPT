/* SmartDecoder — live morpheme decomposition of user input.
   Ported from artifacts/vocabulario_medico_v4.html lines 1005-1058.
   Props: {v, set} — controlled input. */

function VocabSmartDecoder(props) {
  var v = props.v, set = props.set;
  var decomp = useMemo(function() {
    return v.length >= 3 ? vocabDecomposeWord(v) : null;
  }, [v]);

  return e("div", {
    style:{margin:"0 20px 20px", padding:"22px 20px",
           background:"linear-gradient(135deg, rgba(59,130,246,.08) 0%, rgba(167,139,250,.08) 100%)",
           border:"1px solid rgba(96,165,250,.25)",
           borderRadius:"20px", animation:"fadeIn .7s"}
  },
    e("div", {style:{display:"flex", alignItems:"center",
                     gap:"12px", marginBottom:"14px"}},
      e("div", {style:{fontSize:"26px"}}, "🔎"),
      e("div", {style:{flex:1}},
        e("div", {style:{fontSize:"15px", fontWeight:700, color:C.tx}},
          "Decodificador inteligente"),
        e("div", {style:{fontSize:"11px", color:C.mt}},
          "Escribe cualquier palabra médica — la partiré en piezas")
      )
    ),
    e("input", {type:"text", value:v,
      onChange: function(ev){ set(ev.target.value); },
      placeholder:"Ej: pielonefritis, hepatoesplenomegalia, colecistitis...",
      style:{width:"100%", padding:"14px 16px",
             background:"rgba(6,10,20,.7)", border:"1px solid "+C.bd,
             borderRadius:"12px", color:C.tx, fontSize:"14px",
             fontFamily:"'JetBrains Mono',monospace"}
    }),
    decomp && decomp.length > 0 && e("div", {style:{marginTop:"16px"}},
      e("div", {style:{fontSize:"10px", color:"#60a5fa", fontWeight:700,
                       letterSpacing:"1.5px", textTransform:"uppercase",
                       marginBottom:"10px"}}, "◆ Descomposición"),
      /* Morpheme chips row */
      e("div", {style:{display:"flex", flexWrap:"wrap", gap:"5px",
                       alignItems:"center", justifyContent:"center",
                       padding:"14px 10px", background:"rgba(6,10,20,.4)",
                       borderRadius:"12px", marginBottom:"12px"}},
        decomp.map(function(piece, i) {
          var cat = VOCAB_CATS.find(function(c){ return c.id === piece.voc.cat; });
          return e(F, {key:i},
            i > 0 && e("div", {style:{color:C.dm, fontSize:"14px", fontWeight:700}}, "+"),
            e("div", {title:piece.voc.sig,
              style:{padding:"8px 11px", background:cat.c+"22",
                     border:"1px solid "+cat.c+"66", borderRadius:"10px",
                     animation:"slideInLeft ."+(3+i)+"s"}},
              e("div", {style:{fontFamily:"'JetBrains Mono',monospace",
                               fontSize:"12px", fontWeight:700,
                               color:cat.c}}, piece.piece),
              e("div", {style:{fontSize:"9px", color:C.tx, marginTop:"1px"}},
                piece.voc.sig.split(".")[0].slice(0, 28))
            )
          );
        })
      ),
      /* Detailed rows */
      e("div", {style:{display:"flex", flexDirection:"column", gap:"7px"}},
        decomp.map(function(piece, i) {
          var x = piece.voc;
          var cat = VOCAB_CATS.find(function(c){ return c.id === x.cat; });
          return e("div", {key:i,
            style:{padding:"10px 12px", background:"rgba(13,18,36,.8)",
                   border:"1px solid "+C.bd,
                   borderLeft:"3px solid "+cat.c, borderRadius:"10px"}},
            e("div", {style:{display:"flex", alignItems:"center",
                             gap:"8px", marginBottom:"3px"}},
              e("span", {style:{fontFamily:"'JetBrains Mono',monospace",
                                fontSize:"13px", fontWeight:700, color:cat.c}}, x.tx),
              e("span", {style:{fontSize:"8px", padding:"2px 5px",
                                background:VOCAB_TIPO[x.t].c+"22",
                                color:VOCAB_TIPO[x.t].c, borderRadius:"4px",
                                fontWeight:700, textTransform:"uppercase"}},
                VOCAB_TIPO[x.t].l),
              e("span", {style:{fontSize:"9px", color:C.dm}}, cat.i)
            ),
            e("div", {style:{fontSize:"11px", color:C.mt, lineHeight:"1.4"}},
              x.sig.length > 90 ? x.sig.slice(0, 90) + "..." : x.sig)
          );
        })
      )
    ),
    decomp && decomp.length === 0 && v.length >= 3 && e("div", {
      style:{marginTop:"14px", padding:"14px", textAlign:"center",
             color:C.mt, fontSize:"12px",
             background:"rgba(13,18,36,.4)", borderRadius:"10px"}
    }, "No encontré raíces reconocibles en \"" + v + "\". Prueba con otras palabras como 'neumonía', 'artralgia', 'taquicardia'.")
  );
}
