// Embed view for Trauma Unidad 1 artifact (iframe with postMessage nav integration)
function TraumaEmbedView() {
  var ref = useRef(null);
  var atHub = useRef(true);
  // Lazy key — unique per mount, forces fresh iframe on re-entry
  var s = useState(function(){ return Date.now(); });
  var iframeKey = s[0];

  useEffect(function() {
    function onMsg(ev) {
      if (!ev.data) return;
      if (ev.data.type === "trauma-nav-state") {
        atHub.current = ev.data.isHub;
      }
      if (ev.data.type === "trauma-at-hub") {
        atHub.current = true;
      }
    }
    window.addEventListener("message", onMsg);

    window._traumaGoBack = function() {
      if (atHub.current) return false;
      if (ref.current && ref.current.contentWindow) {
        ref.current.contentWindow.postMessage({type: "trauma-go-back"}, "*");
      }
      return true;
    };

    return function() {
      window.removeEventListener("message", onMsg);
      delete window._traumaGoBack;
    };
  }, []);

  return e("iframe", {
    key: iframeKey,
    ref: ref,
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
