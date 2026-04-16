// Build script: concatenates src/ modules into build/ECSC.html + index.html
// Run with: node scripts/build.js
var fs = require('fs');
var path = require('path');

var shell = fs.readFileSync('src/index.html', 'utf8');

// Concatenation order:
// 1. styles (theme + React shortcuts)
// 2. data files (dependency order: triadas before links because MODS references TR.length)
// 3. components (SearchEngine needs data vars, LinkBadge is standalone)
// 4. app.js (main App + ReactDOM.render)
var parts = [
  // styles
  'src/styles/theme.js',
  // data (order matters: triadas before links)
  'src/data/reuma.js',
  'src/data/inmuno.js',
  'src/data/triadas.js',
  'src/data/cirugia.js',
  'src/data/emergencias.js',
  'src/data/anatomia.js',
  'src/data/epidemiologia.js',
  'src/data/labs.js',
  'src/data/fisiologia.js',
  'src/data/generalidades.js',
  'src/data/links.js',
  // components
  'src/components/SearchEngine.js',
  'src/components/LinkBadge.js',
  'src/components/NervesMap.js',
  'src/components/TraumaEmbedView.js',
  // app
  'src/app.js'
];

// ─── concat bundle ───
var manifest = [];
var bundle = parts.map(function(f) {
  var src = fs.readFileSync(f, 'utf8');
  manifest.push({ file: f, bytes: Buffer.byteLength(src, 'utf8'), lines: src.split('\n').length });
  return src;
}).join('\n');

var output = shell.replace('/* BUNDLE */', bundle);

// ─── inline trauma artifact as base64 ───
// Base64 avoids </script> collision inside the artifact when inlined in a template.
// TextDecoder(UTF-8) is used on read so Spanish chars survive the atob() round-trip.
var artifactSrc = 'artifacts/trauma_unidad_1.html';
var artifactBytes = 0, artifactB64Len = 0;
if (fs.existsSync(artifactSrc)) {
  var traumaRaw = fs.readFileSync(artifactSrc, 'utf8');

  // Inject CSS to hide the artifact's own topbar when embedded in ECEPT.
  // ECEPT provides header/breadcrumbs, so the artifact's internal nav bar is redundant.
  // Strategy: collapse .topbar to zero height, hide crumb + back individually,
  // but keep #btnRepaso visible as a floating button (it's the only Repaso trigger).
  var embedCSS = '<style id="ecept-embed-overrides">' +
    '.topbar { height: 0 !important; overflow: visible !important; margin: 0 !important; padding: 0 !important; border: none !important; }' +
    '.topbar > .crumb { display: none !important; }' +
    '.topbar > .btn-back { display: none !important; }' +
    '#btnRepaso { position: fixed !important; bottom: 20px !important; right: 20px !important; z-index: 40 !important; box-shadow: 0 4px 20px rgba(59,130,246,.3) !important; }' +
    '.shell { padding-top: 12px !important; }' +
    'body { padding-top: 0 !important; margin-top: 0 !important; }' +
    '</style>';
  traumaRaw = traumaRaw.replace('</head>', embedCSS + '</head>');

  // Inject postMessage bridge for back-button navigation + localStorage reset.
  // - Clears saved view so iframe always starts at hub on each mount.
  // - Listens for "trauma-go-back" from parent and clicks the artifact's own back button.
  // - Observes #viewHub class changes and reports hub/topic state to parent.
  var embedScript = '<script id="ecept-embed-bridge">' +
    '(function(){' +
    'try{localStorage.removeItem("ecept-trauma-view")}catch(e){}' +
    'window.addEventListener("message",function(ev){' +
    '  if(!ev.data)return;' +
    '  if(ev.data.type==="trauma-go-back"){' +
    '    var hub=document.getElementById("viewHub");' +
    '    if(hub&&!hub.classList.contains("hidden")){' +
    '      parent.postMessage({type:"trauma-at-hub"},"*");' +
    '    }else{' +
    '      document.getElementById("btnBack").click();' +
    '    }' +
    '  }' +
    '});' +
    'function startObs(){' +
    '  var hub=document.getElementById("viewHub");' +
    '  if(!hub)return;' +
    '  var obs=new MutationObserver(function(){' +
    '    parent.postMessage({type:"trauma-nav-state",isHub:!hub.classList.contains("hidden")},"*");' +
    '  });' +
    '  obs.observe(hub,{attributes:true,attributeFilter:["class"]});' +
    '  parent.postMessage({type:"trauma-nav-state",isHub:!hub.classList.contains("hidden")},"*");' +
    '}' +
    'if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",startObs)}' +
    'else{startObs()}' +
    '})();' +
    '<\/script>';
  traumaRaw = traumaRaw.replace('</body>', embedScript + '</body>');

  // Inject Manchester vs START note at end of triage section (gen-4).
  var triageNote = '\n    <div class="pearl"><span class="ico">💡</span><div class="body">' +
    '<strong>START vs Manchester</strong><br>' +
    '<strong>START</strong> → Triage <em>extrahospitalario</em> (escena, ambulancia). ' +
    'Clasifica víctimas en masa por colores según respiración, perfusión y conciencia.<br>' +
    '<strong>Manchester</strong> → Triage <em>intrahospitalario</em> (urgencias). ' +
    'Usa 5 niveles de prioridad (rojo, naranja, amarillo, verde, azul) ' +
    'basados en discriminadores clínicos para asignar tiempo máximo de espera.' +
    '</div></div>';
  traumaRaw = traumaRaw.replace(
    'Valorar a los que quedan: respiración → circulación → conciencia</li>\n    </ol>',
    'Valorar a los que quedan: respiración → circulación → conciencia</li>\n    </ol>' + triageNote
  );

  artifactBytes = Buffer.byteLength(traumaRaw, 'utf8');
  var traumaB64 = Buffer.from(traumaRaw).toString('base64');
  artifactB64Len = traumaB64.length;
  var injection = 'var TRAUMA_U1_B64 = "' + traumaB64 + '";\n' +
    'var TRAUMA_U1_HTML = new TextDecoder().decode(Uint8Array.from(atob(TRAUMA_U1_B64), function(c){ return c.charCodeAt(0); }));';
  output = output.replace('/* TRAUMA_ARTIFACT_PLACEHOLDER */', injection);
} else {
  console.warn('WARN: ' + artifactSrc + ' not found — TraumaEmbedView will fail at runtime.');
  output = output.replace('/* TRAUMA_ARTIFACT_PLACEHOLDER */', 'var TRAUMA_U1_HTML = "";');
}

// ─── integrity checks ───
// These guards catch classes of regressions that silently produce a broken bundle.
var errors = [];
var expectedGlobals = [
  'RD=', 'REUMA_SECS', 'SUB=', 'TR=', 'TC=',
  'ABD_DATA', 'QUEM_PASOS', 'ING_',
  'PIRAMIDE', 'ESTUDIOS', 'SESGOS', 'MEDIDAS_EPI', 'CHECKLIST_LC',
  'LAB_SECTIONS', 'FISIO_', 'NERVES=',
  'COAG_', 'MODS=', 'LINKS=',
  'function globalSearch', 'function LinkBadge', 'function NervesMap', 'function TraumaEmbedView',
  'function App',
  'TRAUMA_U1_B64', 'TRAUMA_U1_HTML'
];
expectedGlobals.forEach(function(g) {
  if (output.indexOf(g) === -1) errors.push('missing global: ' + g);
});

// The shell contains 3 legitimate </script> tags: react CDN, react-dom CDN, main bundle.
// Anything over 3 means the artifact leaked a </script> and the base64 wrapper failed.
var shellClosingScripts = (shell.match(/<\/script>/g) || []).length;
var outputClosingScripts = (output.match(/<\/script>/g) || []).length;
if (outputClosingScripts !== shellClosingScripts) {
  errors.push('leaked </script> tags: output=' + outputClosingScripts + ' shell=' + shellClosingScripts + ' (base64 inlining should have prevented this)');
}

// Placeholders must have been replaced.
if (output.indexOf('/* BUNDLE */') !== -1) errors.push('unreplaced /* BUNDLE */ placeholder');
if (output.indexOf('/* TRAUMA_ARTIFACT_PLACEHOLDER */') !== -1) errors.push('unreplaced /* TRAUMA_ARTIFACT_PLACEHOLDER */');

if (errors.length) {
  console.error('BUILD FAILED — integrity check errors:');
  errors.forEach(function(msg) { console.error('  ✗ ' + msg); });
  process.exit(1);
}

// ─── write outputs ───
fs.mkdirSync('build', { recursive: true });
fs.writeFileSync('build/ECSC.html', output);
fs.writeFileSync('index.html', output);

// ─── manifest ───
var totalBytes = manifest.reduce(function(a, m) { return a + m.bytes; }, 0);
var totalLines = manifest.reduce(function(a, m) { return a + m.lines; }, 0);
var outBytes = Buffer.byteLength(output, 'utf8');

console.log('');
console.log('── BUILD MANIFEST ──');
manifest.forEach(function(m) {
  console.log('  ' + m.file.padEnd(38) + String(m.lines).padStart(5) + ' lines  ' + (m.bytes / 1024).toFixed(1).padStart(6) + ' KB');
});
console.log('  ' + '(subtotal)'.padEnd(38) + String(totalLines).padStart(5) + ' lines  ' + (totalBytes / 1024).toFixed(1).padStart(6) + ' KB');
if (artifactBytes) {
  console.log('  ' + artifactSrc.padEnd(38) + '  (b64)  ' + (artifactBytes / 1024).toFixed(1).padStart(6) + ' KB → ' + (artifactB64Len / 1024).toFixed(1) + ' KB encoded');
}
console.log('');
console.log('── OUTPUT ──');
console.log('  build/ECSC.html   ' + (outBytes / 1024).toFixed(1) + ' KB   ' + output.split('\n').length + ' lines');
console.log('  index.html        ' + (outBytes / 1024).toFixed(1) + ' KB   (GitHub Pages root)');
console.log('');
console.log('✓ build OK (' + expectedGlobals.length + ' integrity checks passed)');
