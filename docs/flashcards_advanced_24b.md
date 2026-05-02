# Flashcards Advanced — Update 24b

Batch flashcard management features built on top of the 24a deck system.
All code is ES5-strict (var/function only, no const/let/arrows).

---

## FASE 2 — Bulk Move & Copy

**Files:** `src/components/DeckDetailView.js`

When select mode is active (non-official decks), a "Bulk action" dropdown
appears in the action bar with "Mover a…" and "Copiar a…" options.

- `DD_execBulkMove`: updates `deck_id` on all selected cards via
  `.update({deck_id}).in("id", snap).eq("user_id", user.id)`,
  then removes them from the current view.
- `DD_execBulkCopy`: inserts cloned rows (new UUID, same front/back/tags)
  into the target deck.
- Target deck picker modal (portal): lists user's other decks. Shows
  "No tenés otras barajas" when none exist.
- Stale-closure guard: `var snap=DD_selectedIds` captured before each `await`.

---

## FASE 3 — Bulk Tag

**Files:** `src/components/DeckDetailView.js`

"Etiquetar selección" button appears when cards are selected.

- `DD_execBulkTag`: reads current tags on each card, merges the new tag,
  writes back via `.update({tags}).in("id",ids)`.
- Auto-creates tag in `user_tags` table if it doesn't exist yet.
- Suggestion dropdown populated from `DD_userTagsList`, loaded in a
  separate `useEffect` (not gated on `is_official`) so it works for
  own decks.
- `Promise.all` loop for concurrent updates; single error state.

---

## FASE 4 — Export Deck to JSON

**Files:** `src/components/DeckDetailView.js`, `src/components/DecksView.js`

Export available from two entry points:

1. **DeckDetailView** — "⬇ Exportar" button in action bar (own decks only,
   shown when select mode is off).
2. **DecksView** — "⬇ Exportar" option in the per-deck dropdown menu.

`DD_exportDeck` / `DV_exportDeck`:
- Fetches all cards for the deck from `flashcards` table.
- Builds JSON object: `{version:1, deck:{id,name,description,color,icon,
  is_official,created_at}, cards:[{front,back,tags,sort_order}], exported_at}`.
- Triggers browser download via `Blob + URL.createObjectURL`.
- Filename: `<deck-name>_ecept.json`.

---

## FASE 5 — Import Deck from JSON

**Files:** `src/components/DecksView.js`

"⬆ Importar baraja" button in the DecksView action bar opens a two-step
portal modal.

**Step 1 — File picker:**
- `FileReader` reads the selected `.json` file.
- Validates `version===1` and presence of `deck` + `cards` arrays.
- Parsing errors shown inline.

**Step 2 — Preview (redesigned):**
- Shows deck metadata card (name, icon, color chip, card count).
- Card list preview (first 5 + "… y N más").
- "Importar baraja" button triggers `DV_importDeck`.

`DV_importDeck`:
- Inserts a new row into `decks` (new UUID, `is_official:false`,
  `user_id:user.id`, name/description/color/icon from JSON).
- Bulk-inserts cards in chunks of 50 via `Promise.all` to respect
  Supabase row limits.
- On success: closes modal, reloads deck list.

---

## Pre-FASE-6 Fixes (bundled in same push)

### Export from Deck Menu (DecksView)
Added "⬇ Exportar" as a dropdown item between "Editar" and "Eliminar"
in `DV_userDeckCard`. Calls `DV_exportDeck(deck)` directly.

### Edit Deck Metadata (DeckDetailView)
"✏️ Editar baraja" button in the search/filter bar opens a portal modal.

- `DD_execEditDeck`: `.update({name,description,color,icon}).eq("id",...)`
- Patch state `DD_deckMeta` merges on top of the server-fetched `deck` prop
  so the header updates immediately without a full reload.
- Color picker uses inlined `DD_DECK_COLORS` (12-color array) because
  `TagManager.js` (where `TAG_PALETTE` lives) bundles after `DeckDetailView.js`.

### Import Preview Redesign
Step 2 of the import modal redesigned: deck metadata card with color chip,
scrollable card list preview, clearer CTA button.

---

## FASE 6 — SM FlashBridge (retire duplicate flashcard mode)

**Files:** `src/components/salud_mental/70-app.js`,
`src/components/salud_mental/11-flash-quiz.js`,
`src/app.js`

Salud Mental had its own localStorage-based flashcard viewer (`FlashDeck`)
that duplicated content already in ECEPT's official deck system.
FASE 6 retires the duplicate UI without touching any data.

**Architecture:**

`app.js` passes a `goFlashcards(deck)` prop to `SaludMentalView`:
- `deck` non-null → sets `window.ECEPT_DECK_SELECTED=deck` and navigates
  to `"flashcards_deck"`.
- `deck` null → navigates to `"flashcards"` (deck list).

In `70-app.js` (module-level, within the SM IIFE):
- `var SM_goFlashcards=null` — set to `p.goFlashcards` on each `App` render.
- `var SM_SUPABASE_DECKS` — maps each SM deckId string (`"anxiety"`,
  `"psicosis"`, etc.) to the full ECEPT deck object (UUID, name, color,
  icon, `is_official:true`).
- `function SM_FlashBridge(p)` — renders a redirect card with
  "🎴 Estudiar estas cards" button. Looks up the full deck object from
  `SM_SUPABASE_DECKS[p.deckId]` and calls `p.goFlashcards(deckObj)`.

In `11-flash-quiz.js`, `FlashDeck` starts with:
```js
if(SM_goFlashcards && SM_SUPABASE_DECKS && SM_SUPABASE_DECKS[p.deckId]){
  return e(SM_FlashBridge,{deckId:p.deckId,goFlashcards:SM_goFlashcards});
}
```

Global flash-* views in `70-app.js` also route through the bridge
(calls `goFlashcards(null)` → deck list).

**Invariants:**
- `DECKS[topic].flash` arrays untouched (data preserved, SACRED RULE).
- Quiz mode (`Quiz` component, `GlobalQuiz`) not modified.
- Bridge is a no-op when `SM_goFlashcards` is null (standalone artifact mode
  keeps the original FlashDeck UI).
- Function declarations hoist within the IIFE, so `SM_FlashBridge` defined
  in `70-app.js` is available to `FlashDeck` in `11-flash-quiz.js` at
  render time despite loading order.

**UUID mapping (seed-flashcards.sql, deterministic UUID v5):**

| SM deckId    | ECEPT UUID                                   |
|--------------|----------------------------------------------|
| anxiety      | f46157d1-56d5-5132-b1ab-e8bc594f129e         |
| psicosis     | f2760c5b-a34f-5701-b8fe-d19e76cb7e85         |
| toc          | 19c71fc4-0082-5ad6-bd89-cc4865c6e03e         |
| trauma       | 7961df40-25bb-59fd-b440-fa3dde5d3181         |
| somaticos    | aab1a948-080a-5b97-8afc-bf35d3c9b8f7         |
| tca          | 7031c483-db20-5c86-813d-cecb4531be87         |
| sueno        | 1061175e-a84c-583f-ae9e-f5b4f6e5b6cd         |
| personalidad | 3f0c92fe-1e66-5f70-82f6-ab0c4c5835eb         |
| impulsos     | debb4556-a5f6-5529-96b0-20e8ad36b9a1         |
| depresivos   | d6a7a64c-08e2-53f6-83c1-d52b14c7e3a2         |

---

## Build Constraints

- ES5 strict throughout: `var`/`function` only.
- `grep -cE '\b(const|let)\b|=>'` must return 0 on all modified files.
- `node scripts/build.js` must pass **117 integrity checks**.
- No data deletion in Supabase at any point (SACRED RULE).
