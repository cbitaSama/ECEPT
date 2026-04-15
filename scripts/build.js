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
  // app
  'src/app.js'
];

var bundle = parts.map(function(f) {
  return fs.readFileSync(f, 'utf8');
}).join('\n');

var output = shell.replace('/* BUNDLE */', bundle);

fs.mkdirSync('build', { recursive: true });
fs.writeFileSync('build/ECSC.html', output);
fs.writeFileSync('index.html', output);

var sizeKB = (Buffer.byteLength(output, 'utf8') / 1024).toFixed(0);
var lineCount = output.split('\n').length;
console.log('Built build/ECSC.html + index.html: ' + sizeKB + 'KB, ' + lineCount + ' lines');
