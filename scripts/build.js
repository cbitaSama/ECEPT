// Build script: concatenates src/ modules into build/ECSC.html + index.html
// Run with: node scripts/build.js
//
// Alpha12+: native-only pipeline. Trauma and Vocabulario are now React
// components + data files; no iframe embedding, no base64 injection.
// artifacts/*.html remain as reference-source-of-truth for the content.
var fs = require('fs');

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
  'src/data/receptores.js',
  'src/data/mediadores.js',
  'src/data/generalidades.js',
  'src/data/trauma.js',
  'src/data/vocabulario.js',
  'src/data/links.js',
  // components
  'src/components/SearchEngine.js',
  'src/components/LinkBadge.js',
  'src/components/NervesMap.js',
  'src/components/ReceptoresView.js',
  'src/components/MediadoresView.js',
  'src/components/CoagulacionView.js',
  // trauma native widgets (must precede TraumaView + BloqueRenderer)
  'src/components/trauma/GlasgowCalculator.js',
  'src/components/trauma/HemorrhageCalculator.js',
  'src/components/trauma/ETTSelector.js',
  'src/components/trauma/ABCDEFGAccordion.js',
  'src/components/trauma/LethalLesionsGrid.js',
  'src/components/trauma/PuntosAnatomicos.js',
  // shared bloque renderer (used by TraumaView + nested widgets)
  'src/components/BloqueRenderer.js',
  // trauma view (depends on BloqueRenderer + widgets + data)
  'src/components/TraumaView.js',
  // vocab native: SVGs → decoder → components → view
  'src/components/vocab/NeckSVG.js',
  'src/components/vocab/HeartSVG.js',
  'src/components/vocab/AbdSVG.js',
  'src/components/vocab/WordSVG.js',
  'src/components/vocab/DemoSVG.js',
  'src/components/vocab/wordDecoder.js',
  'src/components/vocab/WordOfDay.js',
  'src/components/vocab/SmartDecoder.js',
  'src/components/vocab/VocabQuiz.js',
  'src/components/vocab/CatCard.js',
  'src/components/vocab/TermCard.js',
  'src/components/vocab/DemoCard.js',
  'src/components/VocabularioView.js',
  // salud mental II (IIFE-scoped: exposes window.SaludMentalView + SM_SEARCH_INDEX)
  // must precede SearchEngine at runtime? No — SearchEngine checks typeof at call time,
  // not at load time, so order is flexible. Placed here for cohesion with other views.
  'src/components/SaludMentalView.js',
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

// ─── integrity checks ───
// These guards catch classes of regressions that silently produce a broken bundle.
var errors = [];
var expectedGlobals = [
  // core data + existing modules
  'RD=', 'REUMA_SECS', 'SUB=', 'TR=', 'TC=',
  'ABD_DATA', 'QUEM_PASOS', 'ING_',
  'PIRAMIDE', 'ESTUDIOS', 'SESGOS', 'MEDIDAS_EPI', 'CHECKLIST_LC',
  'LAB_SECTIONS', 'var ADR', 'RECEPTOR_FAMILIES', 'RECEPTOR_QUIZZES', 'RECEPTOR_PEARLS', 'RECEPTOR_PROT_G',
  'MED_LIST', 'MED_FAMILIES', 'MED_ROLES', 'MED_RELATIONS',
  'NERVES=',
  'COAG_', 'MODS=', 'LINKS=',
  'function globalSearch', 'function LinkBadge', 'function NervesMap',
  'function ReceptoresView', 'function MediadoresView', 'function CoagulacionView',
  'function App',
  // native trauma module
  'TRAUMA_TOPICS', 'TRAUMA_SECCIONES', 'TRAUMA_ETT', 'TRAUMA_ABCD', 'TRAUMA_LETHAL', 'TRAUMA_REPASO', 'TRAUMA_HUB',
  'function BloqueRenderer', 'function TraumaView',
  'function GlasgowCalculator', 'function HemorrhageCalculator', 'function ETTSelector',
  'function ABCDEFGAccordion', 'function LethalLesionsGrid', 'function PuntosAnatomicos',
  // native vocab module
  'VOCAB_CATS', 'VOCAB_VOC', 'VOCAB_DEMOS', 'VOCAB_TIPO',
  'function vocabNormalize', 'function vocabCleanPart', 'function vocabDecomposeWord', 'function vocabWordOfDay',
  'function NeckSVG', 'function HeartSVG', 'function AbdSVG', 'function WordSVG', 'function DemoSVG',
  'function VocabWordOfDay', 'function VocabSmartDecoder', 'function VocabQuiz',
  'function VocabCatCard', 'function VocabTermCard', 'function VocabDemoCard',
  'function VocabularioView',
  // salud mental II (IIFE-scoped — these substrings live inside the IIFE body)
  'var DECKS=', 'var DECK_GROUPS=', 'var EXTRA_CARDS=', 'var EXTRA_QUIZ=',
  'var SEARCH_INDEX=',
  'function FlashDeck', 'function Quiz', 'function GlobalFlashDeck', 'function GlobalQuiz',
  'function DzModal', 'function DzGrid', 'function DzCard',
  'function getAllCards', 'function getAllQuiz',
  'function AnxView', 'function PsicosisView', 'function OCDView',
  'function SomView', 'function TCAView', 'function SueView',
  'function PerView', 'function ImpView', 'function DprView',
  'function IntroView', 'function RootHub', 'function NeurosisHub',
  'window.SaludMentalView', 'window.SM_SEARCH_INDEX'
];
expectedGlobals.forEach(function(g) {
  if (output.indexOf(g) === -1) errors.push('missing global: ' + g);
});

// The shell contains 3 legitimate </script> tags: react CDN, react-dom CDN, main bundle.
var shellClosingScripts = (shell.match(/<\/script>/g) || []).length;
var outputClosingScripts = (output.match(/<\/script>/g) || []).length;
if (outputClosingScripts !== shellClosingScripts) {
  errors.push('leaked </script> tags: output=' + outputClosingScripts + ' shell=' + shellClosingScripts);
}

// Placeholder must have been replaced.
if (output.indexOf('/* BUNDLE */') !== -1) errors.push('unreplaced /* BUNDLE */ placeholder');

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
  console.log('  ' + m.file.padEnd(44) + String(m.lines).padStart(5) + ' lines  ' + (m.bytes / 1024).toFixed(1).padStart(6) + ' KB');
});
console.log('  ' + '(subtotal)'.padEnd(44) + String(totalLines).padStart(5) + ' lines  ' + (totalBytes / 1024).toFixed(1).padStart(6) + ' KB');
console.log('');
console.log('── OUTPUT ──');
console.log('  build/ECSC.html   ' + (outBytes / 1024).toFixed(1) + ' KB   ' + output.split('\n').length + ' lines');
console.log('  index.html        ' + (outBytes / 1024).toFixed(1) + ' KB   (GitHub Pages root)');
console.log('');
console.log('✓ build OK (' + expectedGlobals.length + ' integrity checks passed)');
