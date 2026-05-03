/* BloqueRenderer — renders the 11 bloque primitives used by trauma data.
   Shared with future native modules that adopt the same schema.
   Props:
     - bloques: array of bloque objects
     - accent:  topic accent color (string)
     - onJump:  function(topic)                — handle data-jump="gen|via|..."
     - onSecJump: function(secId)              — handle data-sec-jump="gen-2|..."
     - widgets: optional map {glasgow, hemorrhage, ett, abcdefg, lethal, anat_pts} → React components
*/

var TRAUMA_CALLOUT_TONES = {
  blue:   {border:"#60a5fa", bg:"rgba(255,255,255,.02)"},
  green:  {border:"#34d399", bg:"rgba(255,255,255,.02)"},
  purple: {border:"#a78bfa", bg:"rgba(255,255,255,.02)"},
  yellow: {border:"#fbbf24", bg:"rgba(251,191,36,.05)"},
  red:    {border:"#ef4444", bg:"rgba(239,68,68,.06)"},
  orange: {border:"#fb923c", bg:"rgba(251,146,60,.05)"}
};

/* Small helper: returns React.createElement tree for a string-with-inline-HTML.
   dangerouslySetInnerHTML is OK here — content is static Spanish medical text
   authored by the app, not user input. Matches NervesMap.js precedent. */
function traumaHtml(tag, html, extraStyle, key) {
  var props = {dangerouslySetInnerHTML: {__html: html || ""}};
  if (extraStyle) props.style = extraStyle;
  if (key != null) props.key = key;
  return e(tag, props);
}

/* Attach inline-HTML anchor click handlers for linkbadge elements inside
   dangerouslySetInnerHTML blocks. Each render mounts one listener on the
   container div; delegation handles any .linkbadge inside. */
function traumaInstallLinkHandler(containerRef, onJump, onSecJump) {
  useEffect(function(){
    var node = containerRef.current;
    if (!node) return;
    function handler(ev) {
      var t = ev.target;
      if (!t || !t.classList || !t.classList.contains("linkbadge")) return;
      var jump = t.getAttribute("data-jump");
      var secJump = t.getAttribute("data-sec-jump");
      if (jump && onJump) { onJump(jump); ev.preventDefault(); }
      else if (secJump && onSecJump) { onSecJump(secJump); ev.preventDefault(); }
    }
    node.addEventListener("click", handler);
    return function(){ node.removeEventListener("click", handler); };
  }, [onJump, onSecJump]);
}

function BloqueCallout(props) {
  var b = props.b;
  var tone = TRAUMA_CALLOUT_TONES[b.tone] || TRAUMA_CALLOUT_TONES.blue;
  var header = b.title ? e("h4", {
    style:{margin:"0 0 8px", fontSize:"13px", fontWeight:700,
           letterSpacing:".12em", textTransform:"uppercase",
           fontFamily:"'DM Sans',sans-serif", color:tone.border}
  }, b.title) : null;
  var body = b.html ? traumaHtml("p", b.html, {margin:"0 0 8px", color:"#cbd5e1"}) : null;
  var list = b.items ? e("ul", {style:{margin:"0 0 0", paddingLeft:"20px", color:"#cbd5e1"}},
    b.items.map(function(it, i){
      return traumaHtml("li", it, {marginBottom:"6px"}, i);
    })
  ) : null;
  return e("div", {
    style:{padding:"14px 16px", borderRadius:"12px",
           borderLeft:"4px solid "+tone.border,
           background:tone.bg, marginBottom:"14px"}
  }, header, body, list);
}

function BloquePearl(props) {
  var b = props.b;
  return e("div", {
    style:{display:"flex", gap:"12px", padding:"14px 16px",
           background:"linear-gradient(135deg,rgba(251,146,60,.08),rgba(251,191,36,.06))",
           border:"1px solid rgba(251,146,60,.25)",
           borderRadius:"12px", margin:"14px 0"}
  },
    e("span", {style:{fontSize:"20px", lineHeight:"1.2"}}, b.ico || "💡"),
    traumaHtml("div", b.html, {fontSize:"14px", color:"#fde68a", flex:"1"})
  );
}

function BloqueDanger(props) {
  var b = props.b;
  return e("div", {
    style:{display:"flex", gap:"12px", padding:"14px 16px",
           background:"rgba(239,68,68,.08)",
           border:"1px solid rgba(239,68,68,.3)",
           borderRadius:"12px", margin:"14px 0"}
  },
    e("span", {style:{fontSize:"20px"}}, b.ico || "⚠️"),
    traumaHtml("div", b.html, {fontSize:"14px", color:"#fecaca", flex:"1"})
  );
}

function BloqueTrap(props) {
  var b = props.b;
  return e("div", {
    style:{display:"flex", gap:"12px", padding:"14px 16px",
           background:"linear-gradient(135deg,rgba(239,68,68,.06),rgba(251,146,60,.06))",
           border:"1px solid rgba(251,146,60,.3)",
           borderRadius:"12px", margin:"14px 0", position:"relative"}
  },
    e("div", {
      style:{position:"absolute", top:"-9px", left:"14px",
             background:"#060a14", padding:"0 8px",
             fontSize:"10px", fontWeight:800, letterSpacing:".15em",
             color:"#fb923c"}
    }, "TRAMPA DE EXAMEN"),
    e("span", {style:{fontSize:"20px"}}, b.ico || "⚠️"),
    traumaHtml("div", b.html, {fontSize:"14px", color:"#fed7aa", flex:"1"})
  );
}

function BloqueTable(props) {
  var b = props.b;
  var hi = b.hi || [];
  function isHi(idx){ for(var i=0;i<hi.length;i++) if(hi[i]===idx) return true; return false; }
  var thStyle = {padding:"10px 12px", textAlign:"left",
                 borderBottom:"1px solid #1a2040", verticalAlign:"top",
                 background:"#0a0f1f", color:"#94a3b8",
                 fontWeight:700, fontSize:"12px",
                 letterSpacing:".04em", textTransform:"uppercase",
                 position:"sticky", top:"0"};
  var tdStyle = {padding:"10px 12px", textAlign:"left",
                 borderBottom:"1px solid #1a2040", verticalAlign:"top"};
  if (b.compact) {
    thStyle = Object.assign({}, thStyle, {padding:"8px 10px", fontSize:"11.5px"});
    tdStyle = Object.assign({}, tdStyle, {padding:"8px 10px", fontSize:"12.5px"});
  }
  return e("div", {style:{overflowX:"auto", margin:"0 -4px 14px", padding:"0 4px"}},
    e("table", {style:{width:"100%", borderCollapse:"separate", borderSpacing:"0",
                       fontSize: b.compact ? "12.5px" : "13.5px", minWidth:"480px"}},
      e("thead", null,
        e("tr", null, b.headers.map(function(h, i){
          return traumaHtml("th", h, thStyle, i);
        }))
      ),
      e("tbody", null, b.rows.map(function(row, ri){
        var rowHi = isHi(ri);
        return e("tr", {key:ri},
          row.map(function(cell, ci){
            var cellStyle = Object.assign({}, tdStyle, rowHi ? {background:"rgba(239,68,68,.08)"} : {});
            return traumaHtml("td", cell, cellStyle, ci);
          })
        );
      }))
    )
  );
}

function BloqueList(props) {
  var b = props.b;
  var tag = b.ordered ? "ol" : "ul";
  return e(tag, {style:{margin:"0 0 14px", paddingLeft:"20px", color:"#cbd5e1"}},
    b.items.map(function(it, i){
      return traumaHtml("li", it, {marginBottom:"6px"}, i);
    })
  );
}

function BloqueTriageCards(props) {
  var items = props.items;
  return e("div", {
    style:{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",
           gap:"10px", marginBottom:"14px"}
  }, items.map(function(t, i){
    return e("div", {key:i,
      style:{padding:"14px 12px", borderRadius:"12px",
             background:"#0d1224", border:"1px solid #1a2040",
             borderTop:"4px solid "+t.color, textAlign:"center"}
    },
      e("div", {style:{fontFamily:"'Inter','DM Sans',sans-serif", fontSize:"13px",
                       fontWeight:800, letterSpacing:".14em",
                       textTransform:"uppercase", color:t.color, marginBottom:"4px"}}, t.code),
      e("div", {style:{fontSize:"13px", fontWeight:700, color:"#f1f5f9", marginBottom:"8px"}}, t.cat),
      traumaHtml("div", t.crit, {fontSize:"12px", color:"#94a3b8", lineHeight:"1.4"})
    );
  }));
}

function BloqueDrugCards(props) {
  var items = props.items;
  return e("div", {
    style:{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",
           gap:"12px", marginBottom:"14px"}
  }, items.map(function(d, i){
    return e("div", {key:i,
      style:{padding:"14px 16px", borderRadius:"12px",
             background:"#0d1224", border:"1px solid #1a2040",
             borderTop:"3px solid #fbbf24"}
    },
      e("div", {style:{fontFamily:"'Inter','DM Sans',sans-serif", fontSize:"18px",
                       fontWeight:800, color:"#fde68a", marginBottom:"4px"}}, d.name),
      e("div", {style:{fontSize:"11.5px", fontWeight:700, letterSpacing:".08em",
                       textTransform:"uppercase", color:"#94a3b8", marginBottom:"10px"}}, d.role),
      traumaHtml("div", d.dose, {padding:"10px 12px",
                          background:"rgba(251,191,36,.08)",
                          borderRadius:"8px",
                          border:"1px solid rgba(251,191,36,.2)",
                          fontSize:"13.5px", marginBottom:"10px", color:"#fde68a"}),
      (d.rows || []).map(function(r, ri){
        return e("div", {key:ri, style:{display:"flex", gap:"8px", alignItems:"flex-start",
                                        marginTop:"8px", fontSize:"13px", color:"#cbd5e1"}},
          e("div", {style:{flex:"none", fontSize:"11px", fontWeight:700,
                           letterSpacing:".06em", textTransform:"uppercase",
                           color:"#94a3b8", width:"90px"}}, r.lab),
          traumaHtml("div", r.val, {flex:"1"})
        );
      })
    );
  }));
}

function BloqueGenericCards(props) {
  /* Used by tx-3 (revisión secundaria): each card has title + body (bloques). */
  var items = props.items;
  return e(F, null, items.map(function(card, i){
    return e("div", {key:i,
      style:{background:"#0d1224", border:"1px solid #1a2040",
             borderRadius:"14px", padding:"18px", marginBottom:"14px"}
    },
      e("h3", {style:{marginTop:0, fontSize:"16.5px", fontWeight:700,
                      color:"#e2e8f0", marginBottom:"10px",
                      fontFamily:"'DM Sans',sans-serif"}}, card.title),
      (card.body || []).map(function(b, bi){ return traumaRenderBloque(b, bi, props); })
    );
  }));
}

function BloqueCards(props) {
  var b = props.b;
  if (b.layout === "triage") return e(BloqueTriageCards, {items:b.items});
  if (b.layout === "drug")   return e(BloqueDrugCards,   {items:b.items});
  return e(BloqueGenericCards, {items:b.items});
}

function BloqueLink(props) {
  var b = props.b;
  return e("span", {
    className:"linkbadge",
    style:{display:"inline-flex", alignItems:"center", gap:"6px",
           padding:"4px 10px", borderRadius:"999px",
           background:"rgba(59,130,246,.1)",
           border:"1px solid rgba(59,130,246,.25)",
           color:"#93c5fd", fontSize:"12px", fontWeight:600,
           cursor:"pointer", margin:"2px 4px 2px 0"},
    onClick: function(){
      if (b.jump && props.onJump) props.onJump(b.jump);
      else if (b.to && props.onSecJump) props.onSecJump(b.to);
    }
  }, "📎 ", b.label);
}

function BloqueWidget(props) {
  var name = props.b.name;
  var w = (props.widgets || {})[name];
  if (w) return e(w, {accent: props.accent, onJump: props.onJump, onSecJump: props.onSecJump});
  return e("div", {style:{padding:"12px", border:"1px dashed "+C.bd, borderRadius:"8px",
                          color:C.mt, fontSize:"12px"}},
    "[widget: "+name+" — pendiente]");
}

function traumaRenderBloque(b, i, ctx) {
  var key = "b"+i;
  if (b.k === "p")        return traumaHtml("p", b.html, {margin:"0 0 12px", color:"#cbd5e1"}, key);
  if (b.k === "h3")       return e("h3", {key:key, style:{fontSize:"16.5px", margin:"22px 0 10px",
                                                           fontWeight:700, color:"#e2e8f0",
                                                           fontFamily:"'DM Sans',sans-serif",
                                                           letterSpacing:".01em"}}, b.text);
  if (b.k === "h4")       return e("h4", {key:key, style:{margin:"14px 0 6px", fontSize:"13px",
                                                           color:"#94a3b8", textTransform:"uppercase",
                                                           letterSpacing:".06em",
                                                           fontFamily:"'DM Sans',sans-serif",
                                                           fontWeight:700}}, b.text);
  if (b.k === "list")     return e(BloqueList,    {key:key, b:b});
  if (b.k === "table")    return e(BloqueTable,   {key:key, b:b});
  if (b.k === "callout")  return e(BloqueCallout, {key:key, b:b});
  if (b.k === "pearl")    return e(BloquePearl,   {key:key, b:b});
  if (b.k === "danger")   return e(BloqueDanger,  {key:key, b:b});
  if (b.k === "trap")     return e(BloqueTrap,    {key:key, b:b});
  if (b.k === "cards")    return e(BloqueCards,   {key:key, b:b, widgets:ctx&&ctx.widgets, onJump:ctx&&ctx.onJump, onSecJump:ctx&&ctx.onSecJump, accent:ctx&&ctx.accent});
  if (b.k === "widget")   return e(BloqueWidget,  {key:key, b:b, widgets:ctx&&ctx.widgets, accent:ctx&&ctx.accent, onJump:ctx&&ctx.onJump, onSecJump:ctx&&ctx.onSecJump});
  if (b.k === "link")     return e(BloqueLink,    {key:key, b:b, onJump:ctx&&ctx.onJump, onSecJump:ctx&&ctx.onSecJump});
  return null;
}

function BloqueRenderer(props) {
  var containerRef = useRef(null);
  traumaInstallLinkHandler(containerRef, props.onJump, props.onSecJump);
  var ctx = {widgets: props.widgets, onJump: props.onJump, onSecJump: props.onSecJump, accent: props.accent};
  return e("div", {ref: containerRef},
    (props.bloques || []).map(function(b, i){ return traumaRenderBloque(b, i, ctx); })
  );
}
