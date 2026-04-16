/* WordOfDay — daily VOC entry (deterministic by date).
   Collapsible card that shows term → definition + examples + tip.
   Ported from artifacts/vocabulario_medico_v4.html lines 731-762. */

function VocabWordOfDay() {
  var w = useMemo(vocabWordOfDay, []);
  var cat = VOCAB_CATS.find(function(c){ return c.id === w.cat; });
  var dState = useState(false); var d = dState[0], setD = dState[1];
  var today = new Date();
  var dateStr = today.toLocaleDateString("es", {weekday:"long", day:"numeric", month:"long"});

  return e("div", {onClick: function(){ setD(!d); },
    style:{margin:"0 20px 18px", padding:"18px",
           background:"linear-gradient(135deg, "+cat.c+"15 0%, rgba(13,18,36,.7) 100%)",
           border:"1px solid "+cat.c+"44", borderRadius:"16px",
           cursor:"pointer", transition:"all .3s"}
  },
    e("div", {style:{display:"flex", justifyContent:"space-between",
                     alignItems:"center", marginBottom:"8px"}},
      e("div", {style:{fontSize:"10px", color:cat.c, letterSpacing:"2px",
                       textTransform:"uppercase", fontWeight:700}}, "◆ Palabra del día"),
      e("div", {style:{fontSize:"10px", color:C.mt,
                       textTransform:"capitalize"}}, dateStr)
    ),
    e("div", {style:{display:"flex", alignItems:"center", gap:"12px",
                     marginBottom: d ? "12px" : 0}},
      e("div", {style:{fontSize:"32px"}}, cat.i),
      e("div", {style:{flex:1, minWidth:0}},
        e("div", {style:{fontFamily:"'JetBrains Mono',monospace",
                         fontSize:"18px", fontWeight:800,
                         color: VOCAB_TIPO[w.t].c}}, w.tx),
        e("div", {style:{fontSize:"11px", color:C.mt, fontStyle:"italic"}}, w.or)
      ),
      e("div", {style:{fontSize:"16px", color:cat.c,
                       transform: d ? "rotate(180deg)" : "rotate(0)",
                       transition:"transform .3s"}}, "▾")
    ),
    d && e("div", {style:{animation:"fadeIn .3s"}},
      e("div", {style:{fontSize:"13px", color:C.tx,
                       lineHeight:"1.5", marginBottom:"10px"}}, w.sig),
      e("div", {style:{fontSize:"10px", color:cat.c, fontWeight:700,
                       letterSpacing:"1.5px", textTransform:"uppercase",
                       marginBottom:"6px"}}, "Ejemplos"),
      e("div", {style:{display:"flex", flexDirection:"column",
                       gap:"4px", marginBottom:"10px"}},
        w.ej.slice(0, 3).map(function(ex, i) {
          return e("div", {key:i,
            style:{padding:"7px 10px", background:"rgba(6,10,20,.4)",
                   borderLeft:"2px solid "+cat.c, borderRadius:"6px",
                   fontSize:"11px", color:C.tx}}, ex);
        })
      ),
      e("div", {style:{padding:"8px 10px", background:cat.c+"15",
                       border:"1px solid "+cat.c+"33",
                       borderRadius:"8px", fontSize:"11px", color:C.tx}}, w.tip)
    ),
    !d && e("div", {style:{fontSize:"10px", color:C.dm,
                           textAlign:"center", marginTop:"6px"}},
      "Toca para ver definición y ejemplos")
  );
}
