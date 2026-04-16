// Embed view for Trauma Unidad 1 artifact (iframe wrapper)
function TraumaEmbedView(props) {
  var headerH = "48px";
  return e("div", {style: {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    zIndex: 50, background: C.bg, display: "flex", flexDirection: "column"
  }},
    // Header strip
    e("div", {style: {
      height: headerH, minHeight: headerH, background: C.cd,
      borderBottom: "1px solid " + C.bd, display: "flex",
      alignItems: "center", padding: "0 16px", gap: "12px", flexShrink: 0
    }},
      e("button", {onClick: function() { props.goBack(); }, style: {
        background: "none", border: "none", color: C.ac, fontSize: "14px",
        cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
        padding: "6px 10px", borderRadius: "8px", whiteSpace: "nowrap"
      }}, "\u2190 Volver"),
      e("div", {style: {
        fontSize: "12px", color: C.mt, display: "flex",
        alignItems: "center", gap: "4px", overflow: "hidden"
      }},
        e("span", {style: {color: C.dm}}, "Emergenciolog\u00eda"),
        e("span", {style: {color: "rgba(255,255,255,.15)"}}, " \u203A "),
        e("span", {style: {color: C.mt, fontWeight: 600}}, "Trauma \u2014 Unidad 1")
      )
    ),
    // Iframe (srcdoc — artifact inlined at build time, no external file needed)
    e("iframe", {
      srcDoc: TRAUMA_U1_HTML,
      style: {
        flex: 1, width: "100%", height: "calc(100vh - " + headerH + ")",
        border: "none", margin: 0, padding: 0, display: "block"
      },
      allow: "fullscreen",
      loading: "eager",
      title: "Trauma \u2014 Unidad 1"
    })
  );
}
