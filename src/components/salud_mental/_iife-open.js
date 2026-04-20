// ══════════════════════════════════════════════════════════════
// SALUD MENTAL II — integrated module (IIFE-scoped)
// ══════════════════════════════════════════════════════════════
// Source of truth: artifacts/salud_mental.html (Alpha13).
// All SM internals (var C, function App, function TraumaView, DECKS,
// EXTRA_CARDS/QUIZ, SEARCH_INDEX, view components) live inside an IIFE
// so their names cannot collide with ECEPT globals. The IIFE exposes:
//   window.SaludMentalView  — SM's App component (renders RootHub)
//   window.SM_SEARCH_INDEX  — for ECEPT's globalSearch integration
//   window._smFocus(route)  — deep-link from ECEPT search → SM sub-view
// localStorage keys (flashcards_<theme>, flashcards_global_<group>) are
// preserved verbatim so students keep their saved cards.
// ══════════════════════════════════════════════════════════════
(function(){
