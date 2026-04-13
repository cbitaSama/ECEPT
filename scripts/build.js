// Build script: concatenates src/ into build/ECEPT.html
// Run with: node scripts/build.js
const fs = require('fs');
const path = require('path');

const shell = fs.readFileSync('src/index.html', 'utf8');
const theme = fs.readFileSync('src/styles/theme.js', 'utf8');

// Load data files in dependency order
// (links.js references TR.length, so triadas must come first)
const dataOrder = [
  'reuma.js',
  'triadas.js',
  'inmuno.js',
  'cirugia.js',
  'emergencias.js',
  'anatomia.js',
  'epidemiologia.js',
  'labs.js',
  'fisiologia.js',
  'generalidades.js',
  'links.js'
];
const dataContent = dataOrder
  .map(function(f) { return fs.readFileSync(path.join('src/data', f), 'utf8'); })
  .join('\n');

// Load components in order (SearchEngine needs data vars, LinkBadge is standalone)
const compOrder = [
  'SearchEngine.js',
  'LinkBadge.js'
];
const compContent = compOrder
  .map(function(f) { return fs.readFileSync(path.join('src/components', f), 'utf8'); })
  .join('\n');

// Load main app
const app = fs.readFileSync('src/app.js', 'utf8');

// Assemble
const final = shell
  .replace('/* THEME_PLACEHOLDER */', theme)
  .replace('/* DATA_PLACEHOLDER */', dataContent)
  .replace('/* COMPONENTS_PLACEHOLDER */', compContent)
  .replace('/* APP_PLACEHOLDER */', app);

fs.mkdirSync('build', { recursive: true });
fs.writeFileSync('build/ECEPT.html', final);
console.log('Built build/ECEPT.html: ' + (final.length / 1024).toFixed(0) + 'KB, ' + final.split('\n').length + ' lines');
