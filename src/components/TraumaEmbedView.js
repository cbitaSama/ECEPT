// Embed view for Trauma Unidad 1 artifact (iframe only, no extra header)
function TraumaEmbedView() {
  return e("iframe", {
    srcDoc: TRAUMA_U1_HTML,
    style: {
      width: "100%",
      height: "calc(100vh - 60px)",
      border: "none",
      display: "block"
    },
    title: "Trauma \u2014 Unidad 1"
  });
}
