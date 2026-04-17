/* PuntosAnatomicos — static 4-card grid for the unified
   emergency-procedures anatomy table (tx-4). */

var TRAUMA_ANAT_PUNTOS = [
  {color:"#60a5fa", ico:"\ud83d\udca8", name:"Toracocentesis",
   use:"Descompresi\u00f3n \u00b7 neumot\u00f3rax a tensi\u00f3n",
   pt:"<strong>2\u00b0 espacio intercostal, l\u00ednea medioclavicular</strong>, sobre la costilla (borde superior de la costilla inferior) del lado afectado.<br><br>Br\u00e1nula N\u00b0 14 o 16."},
  {color:"#34d399", ico:"\ud83e\ude78", name:"Toracostom\u00eda",
   use:"Tubo bajo sello de agua \u00b7 neumot\u00f3rax, hemot\u00f3rax",
   pt:"<strong>5\u00b0 espacio intercostal, entre l\u00ednea axilar anterior y media</strong>, sobre la costilla.<br><br>La incisi\u00f3n se hace en el 6\u00b0 espacio y se tuneliza al 5\u00b0."},
  {color:"#ef4444", ico:"\u2764\ufe0f", name:"Pericardiocentesis",
   use:"Taponamiento card\u00edaco",
   pt:"<strong>Debajo del xifoides</strong>, en el \u00e1ngulo con el borde inferior costal <strong>izquierdo</strong>.<br><br>Dirigir la aguja hacia el <strong>hombro izquierdo</strong>."},
  {color:"#fbbf24", ico:"\ud83e\udec1", name:"Cricotiroidotom\u00eda",
   use:"V\u00eda a\u00e9rea imposible por otra v\u00eda",
   pt:"<strong>L\u00ednea media del cuello, entre el cart\u00edlago tiroides y el cricoides</strong> (membrana cricotiroidea).<br><br><span class=\"tag-bad\">Contraindicada en pediatr\u00eda</span>"}
];

function PuntosAnatomicos() {
  return e("div", {style:{display:"grid",
                          gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",
                          gap:"12px", marginBottom:"14px"}},
    TRAUMA_ANAT_PUNTOS.map(function(a, i){
      return e("div", {key:i,
        style:{padding:"16px", borderRadius:"12px",
               background:"#0d1224", border:"1px solid #1a2040",
               borderLeft:"4px solid " + a.color}
      },
        e("div", {style:{display:"flex", alignItems:"center",
                         gap:"10px", marginBottom:"8px"}},
          e("div", {style:{width:"32px", height:"32px", borderRadius:"8px",
                           background:"rgba(255,255,255,.04)",
                           display:"flex", alignItems:"center",
                           justifyContent:"center", fontSize:"16px"}}, a.ico),
          e("div", {style:{fontFamily:"'Playfair Display',serif",
                           fontSize:"17px", fontWeight:800, color:"#f1f5f9"}}, a.name)
        ),
        e("div", {style:{fontSize:"11.5px", fontWeight:700,
                         letterSpacing:".08em", textTransform:"uppercase",
                         color: a.color, marginBottom:"8px"}}, a.use),
        e("div", {
          style:{padding:"10px 12px", background:"rgba(255,255,255,.02)",
                 borderRadius:"8px", fontSize:"13.5px", color:"#e2e8f0",
                 lineHeight:"1.5", border:"1px solid #1a2040"},
          dangerouslySetInnerHTML:{__html: a.pt}
        })
      );
    })
  );
}

/* Inline "tag-bad" styling shim: match artifact's .tag-bad look when
   referenced via dangerouslySetInnerHTML. One-time style injection. */
(function(){
  if (typeof document === "undefined") return;
  if (document.getElementById("ecept-trauma-tags")) return;
  var st = document.createElement("style");
  st.id = "ecept-trauma-tags";
  st.textContent = ".tag-bad{display:inline-block;padding:2px 8px;background:rgba(239,68,68,.15);color:#fca5a5;border-radius:6px;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}"
    + ".tag-ok{display:inline-block;padding:2px 8px;background:rgba(52,211,153,.15);color:#86efac;border-radius:6px;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}"
    + ".tag-grade{display:inline-block;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;vertical-align:middle}"
    + ".linkbadge{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.25);color:#93c5fd;font-size:12px;font-weight:600;cursor:pointer;margin:2px 4px 2px 0}"
    + ".linkbadge:hover{background:rgba(59,130,246,.2);border-color:#3b82f6;color:#fff}"
    + ".linkbadge::before{content:\"\\1F4CE\";font-size:11px;margin-right:2px}";
  document.head.appendChild(st);
})();
