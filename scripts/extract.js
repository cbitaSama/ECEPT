// Extraction script: splits the monolith index.html into modular files
// Run once with: node scripts/extract.js
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync('index.html', 'utf8');
const lines = src.split('\n');

// Helper: get lines (1-indexed, inclusive)
function L(from, to) {
  return lines.slice(from - 1, to).join('\n');
}

// ─── src/styles/theme.js ───
// Colors + SUB array (lines 36-37)
fs.writeFileSync('src/styles/theme.js', [
  '// Color palette and design constants',
  L(36, 37)
].join('\n') + '\n');
console.log('wrote src/styles/theme.js');

// ─── src/data/reuma.js ───
// REUMA_SECS (line 42) + RD (lines 107-120)
fs.writeFileSync('src/data/reuma.js', [
  '// Rheumatology: sections and disease data',
  L(42, 42),
  '',
  L(107, 120)
].join('\n') + '\n');
console.log('wrote src/data/reuma.js');

// ─── src/data/triadas.js ───
// TC + TR (lines 47-88)
fs.writeFileSync('src/data/triadas.js', [
  '// Triads and specialty categories',
  L(47, 88)
].join('\n') + '\n');
console.log('wrote src/data/triadas.js');

// ─── src/data/inmuno.js ───
// INT (lines 93-103)
fs.writeFileSync('src/data/inmuno.js', [
  '// Immunology basics',
  L(93, 103)
].join('\n') + '\n');
console.log('wrote src/data/inmuno.js');

// ─── src/data/cirugia.js ───
// ABD_DATA (lines 125-133)
fs.writeFileSync('src/data/cirugia.js', [
  '// Surgery: acute abdomen classifications',
  L(125, 133)
].join('\n') + '\n');
console.log('wrote src/data/cirugia.js');

// ─── src/data/emergencias.js ───
// QUEM_PASOS (lines 138-147)
fs.writeFileSync('src/data/emergencias.js', [
  '// Emergency: burns algorithm',
  L(138, 147)
].join('\n') + '\n');
console.log('wrote src/data/emergencias.js');

// ─── src/data/anatomia.js ───
// ING_PAREDES, ING_SUPERFICIAL, ING_PROFUNDO, ING_CORDON (lines 151-159)
fs.writeFileSync('src/data/anatomia.js', [
  '// Anatomy: inguinal canal',
  L(151, 159)
].join('\n') + '\n');
console.log('wrote src/data/anatomia.js');

// ─── src/data/epidemiologia.js ───
// PIRAMIDE, ESTUDIOS, SESGOS, MEDIDAS_EPI, CHECKLIST_LC (lines 167-243)
fs.writeFileSync('src/data/epidemiologia.js', [
  '// Epidemiology: evidence pyramid, studies, biases, measures, checklist',
  L(167, 243)
].join('\n') + '\n');
console.log('wrote src/data/epidemiologia.js');

// ─── src/data/labs.js ───
// LAB_SECTIONS (lines 249-560)
fs.writeFileSync('src/data/labs.js', [
  '// Lab values: normal ranges and clinical significance',
  L(249, 560)
].join('\n') + '\n');
console.log('wrote src/data/labs.js');

// ─── src/data/fisiologia.js ───
// FISIO_RECEPTORS, FISIO_QUIZ, FISIO_PERLAS, FISIO_COMPARISON, FISIO_PROTEINAS_G (lines 568-791)
fs.writeFileSync('src/data/fisiologia.js', [
  '// Physiology: adrenergic receptors',
  L(568, 791)
].join('\n') + '\n');
console.log('wrote src/data/fisiologia.js');

// ─── src/data/generalidades.js ───
// NERVES (lines 795-941) + COAG_FACTORES, COAG_QUIZ, COAG_PERLAS, COAG_CASCADA (lines 945-1011)
fs.writeFileSync('src/data/generalidades.js', [
  '// Generalidades: cranial nerves and coagulation factors',
  L(795, 1011)
].join('\n') + '\n');
console.log('wrote src/data/generalidades.js');

// ─── src/data/links.js ───
// LINKS + MODS (lines 1018-1053)
fs.writeFileSync('src/data/links.js', [
  '// Cross-reference links and module definitions',
  L(1018, 1053)
].join('\n') + '\n');
console.log('wrote src/data/links.js');

// ─── src/components/SearchEngine.js ───
// globalSearch function (lines 1058-1114)
fs.writeFileSync('src/components/SearchEngine.js', [
  '// Global search across all modules',
  L(1058, 1114)
].join('\n') + '\n');
console.log('wrote src/components/SearchEngine.js');

// ─── src/components/LinkBadge.js ───
// Ls helper, LinkBadge, cb (lines 1119-1131)
fs.writeFileSync('src/components/LinkBadge.js', [
  '// Helper list component, link badge, and card box style',
  L(1119, 1131)
].join('\n') + '\n');
console.log('wrote src/components/LinkBadge.js');

// ─── src/app.js ───
// App function + ReactDOM.render (lines 1136-2178)
fs.writeFileSync('src/app.js', [
  '// Main App component with routing and navigation',
  L(1136, 2178)
].join('\n') + '\n');
console.log('wrote src/app.js');

// ─── src/index.html ───
// HTML shell with React CDN and placeholders
var htmlShell = L(1, 23) + '\n' +
  '</head>\n' +
  '<body>\n' +
  '<div id="root"></div>\n' +
  '<script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>\n' +
  '<script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>\n' +
  '<script>\n' +
  L(30, 31) + '\n' +
  '\n' +
  '/* THEME_PLACEHOLDER */\n' +
  '\n' +
  '/* DATA_PLACEHOLDER */\n' +
  '\n' +
  '/* COMPONENTS_PLACEHOLDER */\n' +
  '\n' +
  '/* APP_PLACEHOLDER */\n' +
  '\n' +
  '</script>\n' +
  '</body>\n' +
  '</html>\n';

fs.writeFileSync('src/index.html', htmlShell);
console.log('wrote src/index.html');

console.log('\nDone! All files extracted.');
