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
  'src/styles/tokens.js',
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
  // ─── Salud Mental II (IIFE-scoped · split into src/components/salud_mental/*) ───
  // Files are concatenated in order into one IIFE body. _iife-open.js contains
  // the `(function(){`, _iife-close.js the matching `})();`. _exposures.js is
  // the `window.SaludMentalView = App; …` block. Between them, files are
  // ordered so that data (DECKS, EXTRA_*) and primitives precede the views
  // that use them — although hoisting makes most of this ordering cosmetic,
  // it keeps the concatenated output grep-friendly and easy to audit.
  'src/components/salud_mental/_iife-open.js',
  'src/components/salud_mental/00-bindings.js',
  'src/components/salud_mental/01-palette.js',
  'src/components/salud_mental/02-primitives.js',
  'src/components/salud_mental/10-decks.js',
  'src/components/salud_mental/11-flash-quiz.js',
  'src/components/salud_mental/12-globals.js',
  'src/components/salud_mental/20-shared.js',
  'src/components/salud_mental/21-dz.js',
  'src/components/salud_mental/30-anx.js',
  'src/components/salud_mental/31-psicosis.js',
  'src/components/salud_mental/32-toc.js',
  'src/components/salud_mental/33-trm.js',
  'src/components/salud_mental/34-som.js',
  'src/components/salud_mental/35-tca.js',
  'src/components/salud_mental/36-sue.js',
  'src/components/salud_mental/37-per.js',
  'src/components/salud_mental/38-imp.js',
  'src/components/salud_mental/39-dpr.js',
  'src/components/salud_mental/40-extras.js',
  'src/components/salud_mental/50-search.js',
  'src/components/salud_mental/60-intro.js',
  'src/components/salud_mental/61-root-hub.js',
  'src/components/salud_mental/62-neurosis-hub.js',
  'src/components/salud_mental/70-app.js',
  'src/components/salud_mental/_exposures.js',
  'src/components/salud_mental/_iife-close.js',
  // logo + loading screen (premium primitives — must precede everything that consumes them)
  'src/components/Logo.js',
  'src/components/LoadingScreen.js',
  'src/components/HomeView.js',
  'src/components/ModuleShell.js',
  'src/components/Layered.js',
  'src/components/Toast.js',
  'src/components/Button.js',
  'src/components/Skeleton.js',
  'src/components/EmptyState.js',
  'src/components/VisitTracker.js',
  'src/components/FavoriteHelper.js',
  'src/components/FavoriteButton.js',
  'src/components/FavoritesView.js',
  'src/components/ElionIntro.js',
  // chatbot (must come after App? no — function hoisted; keep with components)
  'src/components/ChatBot.js',
  // supabase client (reads window.__ECEPT_ENV; exposes window.ECEPT_SUPABASE)
  'src/components/SupabaseClient.js',
  // auth modal (uses ECEPT_SUPABASE; exposes window.AuthModal)
  'src/components/Auth.js',
  // user menu (sidebar session widget; exposes window.UserMenu)
  'src/components/UserMenu.js',
  // profile view (editable user profile screen; exposes window.ProfileView)
  'src/components/ProfileView.js',
  // decks view (flashcards deck list; exposes window.DecksView)
  'src/components/DecksView.js',
  // elion generator (AI flashcard generation; exposes window.ElionGenerator)
  'src/components/ElionGenerator.js',
  // flashcard editor (create/edit flashcards; exposes window.FlashcardEditor)
  'src/components/FlashcardEditor.js',
  // deck detail view (flashcards inside a deck; exposes window.DeckDetailView)
  'src/components/DeckDetailView.js',
  // study view (SM-2 spaced repetition study session; exposes window.StudyView)
  'src/components/StudyView.js',
  // tag manager (user tag entities CRUD; exposes window.TagManager)
  'src/components/TagManager.js',
  // debug panel (admin-only backend diagnostic; exposes window.DebugPanel)
  'src/components/DebugPanel.js',
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
  // design tokens
  'ECEPT_TOKENS', 'window.T',
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
  'function DzDetail', 'function DzSectionView', 'function DzGrid', 'function DzCard',
  'function getAllCards', 'function getAllQuiz',
  'function AnxView', 'function PsicosisView', 'function OCDView',
  'function SomView', 'function TCAView', 'function SueView',
  'function PerView', 'function ImpView', 'function DprView',
  'function IntroView', 'function RootHub', 'function NeurosisHub',
  'window.SaludMentalView', 'window.SM_SEARCH_INDEX',
  // logo + loading screen + home view
  'function Logo', 'window.Logo', 'function LoadingScreen', 'window.LoadingScreen',
  'function HomeView', 'window.HomeView',
  'function ModuleShell', 'window.ModuleShell',
  'function CollapsibleSection', 'window.CollapsibleSection',
  'function ToastHost', 'window.ToastHost', 'window.ECEPT_toast',
  'function Button', 'window.Button',
  'function SkeletonCard', 'function SkeletonList', 'window.SkeletonCard', 'window.SkeletonList',
  'function EmptyState', 'window.EmptyState',
  'function ElionIntro', 'window.ElionIntro',
  'function VisitTracker', 'window.VisitTracker', 'window.ECEPT_FAVORITES',
  'function FavoriteButton', 'window.FavoriteButton', 'function useLongPress', 'window.useLongPress',
  'function FavoritesView', 'window.FavoritesView',
  'function LayeredCard', 'window.LayeredCard',
  'function InfoLayer', 'window.InfoLayer',
  'function Detail', 'window.Detail',
  // chatbot
  'function ChatBot', 'window.ChatBot',
  // supabase client
  'window.ECEPT_SUPABASE',
  // auth modal
  'function AuthModal', 'window.AuthModal',
  // user menu
  'function UserMenu', 'window.UserMenu',
  // profile view
  'function ProfileView', 'window.ProfileView',
  // decks view
  'function DecksView', 'window.DecksView',
  // elion generator
  'function ElionGenerator', 'window.ElionGenerator',
  // flashcard editor
  'function FlashcardEditor', 'window.FlashcardEditor',
  // deck detail view
  'function DeckDetailView', 'window.DeckDetailView',
  // study view
  'function StudyView', 'window.StudyView',
  // tag manager
  'function TagManager', 'window.TagManager',
  // debug panel
  'function DebugPanel', 'window.DebugPanel'
];
expectedGlobals.forEach(function(g) {
  if (output.indexOf(g) === -1) errors.push('missing global: ' + g);
});

// The shell contains 5 legitimate </script> tags: vercel×2, react CDN, react-dom CDN, main bundle.
// (supabase CDN + __ECEPT_ENV inline were added in Alpha17)
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

// ─── env var substitution (only when vars are actually set) ───
console.log('[build] env substitution: SUPABASE_URL=' + (process.env.SUPABASE_URL ? 'SET' : 'MISSING'));
console.log('[build] env substitution: SUPABASE_ANON_KEY=' + (process.env.SUPABASE_ANON_KEY ? 'SET' : 'MISSING'));
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  var outputFinal = output
    .replace(/__SUPABASE_URL__/g, process.env.SUPABASE_URL)
    .replace(/__SUPABASE_ANON_KEY__/g, process.env.SUPABASE_ANON_KEY);
  fs.writeFileSync('build/ECSC.html', outputFinal);
  fs.writeFileSync('index.html', outputFinal);
} else {
  console.log('[build] env vars not set — placeholders left intact in output files');
}

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

// ─── placeholder verification ───
var check = fs.readFileSync('index.html', 'utf8');
var hasPlaceholder = check.indexOf('__SUPABASE_URL__') !== -1;
console.log('[build] placeholder check:', hasPlaceholder ? 'STILL PRESENT (bad)' : 'SUBSTITUTED (good)');
