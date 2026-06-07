#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════
// build-salud-mental — genera /public/legacy/salud-mental.html
// ════════════════════════════════════════════════════════════════
// El módulo Salud Mental original vive como IIFE con dependencias
// específicas (var C, e=React.createElement, etc.). En vez de
// reescribirlo, lo empaquetamos como HTML standalone y lo embebemos
// en la nueva app vía iframe. Cero pérdida de información.
// ════════════════════════════════════════════════════════════════
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const SM_DIR = path.join(ROOT, "src/components/salud_mental");
const OUT_DIR = path.join(__dirname, "../public/legacy");
const OUT_FILE = path.join(OUT_DIR, "salud-mental.html");

const STYLES_DIR = path.join(ROOT, "src/styles");
// Carga en el mismo orden que scripts/build.js del proyecto original.
const FILES = [
  { abs: path.join(STYLES_DIR, "theme.js") },   // expone var C, e, F, hooks
  { abs: path.join(STYLES_DIR, "tokens.js") },  // tokens premium
  "_iife-open.js",
  "01-palette.js",
  "02-primitives.js",
  "12-globals.js",
  "10-decks.js",
  "11-flash-quiz.js",
  "20-shared.js",
  "21-dz.js",
  "30-anx.js",
  "31-psicosis.js",
  "32-toc.js",
  "33-trm.js",
  "34-som.js",
  "35-tca.js",
  "36-sue.js",
  "37-per.js",
  "38-imp.js",
  "39-dpr.js",
  "40-extras.js",
  "50-search.js",
  "60-intro.js",
  "61-root-hub.js",
  "62-neurosis-hub.js",
  "70-app.js",
  "_exposures.js",
  "00-bindings.js",
  "_iife-close.js",
];

const concatenated = FILES.map((entry) => {
  const abs = typeof entry === "string" ? path.join(SM_DIR, entry) : entry.abs;
  const label = typeof entry === "string" ? entry : path.basename(entry.abs);
  if (!fs.existsSync(abs)) {
    console.warn("[skip] missing:", abs);
    return "";
  }
  return `// ── ${label} ──\n` + fs.readFileSync(abs, "utf8");
}).join("\n\n");

const html = `<!doctype html>
<html lang="es" class="dark">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0,viewport-fit=cover" />
<title>Salud Mental · ECEPT</title>
<style>
  html,body{background:#060a14;color:#e2e8f0;margin:0;font-family:-apple-system,BlinkMacSystemFont,"Inter",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
  #sm-root{min-height:100vh}
  /* SM dependía de globals de ECEPT app.js que no se cargan acá; los stubs evitan ReferenceErrors */
</style>
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
</head>
<body>
<div id="sm-root"></div>
<script>
  // Stubs para integraciones que viven en ECEPT-app shell (Supabase, etc.).
  // SM consulta estos globals condicionalmente; con stubs vacíos cae a su
  // modo standalone y muestra el contenido educativo sin auth.
  window.ECEPT_SUPABASE = null;
  window.ECEPT_USER = null;
  window.ECEPT_NAV = function(){};
</script>
<script>
${concatenated}
</script>
<script>
  // Mount: SM expone window.SaludMentalView vía _exposures.js
  if (window.SaludMentalView) {
    const root = ReactDOM.createRoot(document.getElementById('sm-root'));
    root.render(React.createElement(window.SaludMentalView, {
      onViewChange: function(v, extra){
        try { parent.postMessage({ type:'sm-view', v: v, extra: extra }, '*'); } catch(e){}
      },
      onBack: function(){ try { parent.postMessage({ type:'sm-back' }, '*'); } catch(e){} },
      backRef: { current: null }
    }));
  } else {
    document.getElementById('sm-root').innerHTML = '<div style="padding:40px;text-align:center;color:#94a3b8">No se pudo cargar Salud Mental.</div>';
  }
</script>
</body>
</html>`;

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, html, "utf8");
console.log("OK ->", OUT_FILE);
console.log("Size:", Math.round(html.length / 1024) + "KB");
