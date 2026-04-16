// Build script: concatenates src/ modules into build/ECSC.html
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

var bundle = parts.map(function(f) {
  return fs.readFileSync(f, 'utf8');
}).join('\n');

var output = shell.replace('/* BUNDLE */', bundle);

// Inline trauma artifact as base64 (avoids </script> collision in template literals)
var artifactSrc = 'artifacts/trauma_unidad_1.html';
if (fs.existsSync(artifactSrc)) {
  var traumaRaw = fs.readFileSync(artifactSrc, 'utf8');
  var traumaB64 = Buffer.from(traumaRaw).toString('base64');
  var injection = 'var TRAUMA_U1_B64 = "' + traumaB64 + '";\n' +
    'var TRAUMA_U1_HTML = new TextDecoder().decode(Uint8Array.from(atob(TRAUMA_U1_B64), function(c){ return c.charCodeAt(0); }));';
  output = output.replace('/* TRAUMA_ARTIFACT_PLACEHOLDER */', injection);
  console.log('Inlined trauma_unidad_1.html as base64 (' + (traumaB64.length / 1024).toFixed(0) + 'KB encoded)');
}

fs.mkdirSync('build', { recursive: true });
fs.writeFileSync('build/ECSC.html', output);
fs.writeFileSync('index.html', output);

var sizeKB = (Buffer.byteLength(output, 'utf8') / 1024).toFixed(0);
var lineCount = output.split('\n').length;
console.log('Built build/ECSC.html + index.html: ' + sizeKB + 'KB, ' + lineCount + ' lines');
