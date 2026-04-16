// Vocabulario Médico — embedded artifact view (iframe srcdoc, same pattern as TraumaEmbedView)
function VocabularioEmbedView() {
  var s = useState(function(){ return Date.now(); });
  var iframeKey = s[0];

  return e("iframe", {
    key: iframeKey,
    srcDoc: VOCAB_HTML,
    style: {
      width: "100%",
      height: "calc(100vh - 60px)",
      border: "none",
      display: "block"
    },
    title: "Vocabulario M\u00e9dico"
  });
}
