# ECEPT Flashcards — Technical Reference

> Alpha23 implementation. Last updated: 2026-05.

---

## 1. Database Schema

### `public.decks`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | auto-generated |
| `user_id` | uuid FK → auth.users | null for official decks |
| `name` | text | display name |
| `description` | text | optional subtitle |
| `icon` | text | emoji |
| `color` | text | hex color, e.g. `#a78bfa` |
| `is_official` | boolean | true = ECEPT seed deck |
| `created_at` | timestamptz | |

RLS: users can CRUD their own rows; all rows readable by authenticated users.

---

### `public.flashcards`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `deck_id` | uuid FK → decks | |
| `user_id` | uuid FK → auth.users | null for official cards |
| `card_type` | text | `"basic"` or `"cloze"` |
| `front` | text | question side (basic) or full cloze text |
| `back` | text | answer side (basic only); empty for cloze |
| `tags` | text[] | user-defined labels |
| `is_official` | boolean | true = seed content |
| `created_at` | timestamptz | |

RLS: users can CRUD their own rows; all rows readable by authenticated users.

---

### `public.flashcard_progress`

Tracks per-user SM-2 spaced repetition state for each card.

| Column | Type | Notes |
|---|---|---|
| `user_id` | uuid FK → auth.users | |
| `flashcard_id` | uuid FK → flashcards | |
| `ease_factor` | float8 | SM-2 easiness, default 2.5, min 1.3 |
| `interval_days` | int4 | days until next review |
| `repetitions` | int4 | successful consecutive reviews |
| `next_review` | timestamptz | absolute due date |

Primary key: `(user_id, flashcard_id)`.  
Written via `upsert({onConflict:"user_id,flashcard_id"})` after every rating.  
RLS: users can only read/write their own rows.

---

## 2. Seed Content

The migration `supabase/seed.sql` populates 10 official decks covering Salud Mental II content:

| Deck | Cards | Color |
|---|---|---|
| Trastornos del Estado de Ánimo | ~25 | `#a78bfa` |
| Psicosis y Esquizofrenia | ~22 | `#60a5fa` |
| Trastornos de Ansiedad | ~20 | `#34d399` |
| TOC y Espectro | ~18 | `#fbbf24` |
| Trauma y TEPT | ~20 | `#f472b6` |
| Trastornos Somáticos | ~18 | `#ef4444` |
| Trastornos de la Conducta Alimentaria | ~20 | `#06b6d4` |
| Trastornos del Sueño | ~22 | `#fb923c` |
| Trastornos de Personalidad | ~20 | `#e879f9` |
| Trastornos del Control de Impulsos | ~17 | `#38bdf8` |

**Total: 10 decks, 202 official flashcards.**  
All have `is_official = true` and `user_id = null`.

---

## 3. Authentication Gate

| Feature | Guest | Logged in |
|---|---|---|
| Browse official decks | ✓ (guest mode) | ✓ |
| Study official cards | ✗ | ✓ |
| Save SM-2 progress | ✗ | ✓ |
| Create/edit/delete decks | ✗ | ✓ |
| Create/edit/delete cards | ✗ | ✓ |
| Tag suggestions | ✗ | ✓ |

Unauthenticated users who reach `flashcards_study` or `flashcards_deck` (private) see a login prompt. The floating `←` bubble always navigates back.

---

## 4. SM-2 Algorithm

Implemented in `SV_sm2(prog, rating)` in `StudyView.js`.

```
rating 0 — "Otra vez" (Again)
  repetitions = 0
  interval    = 0
  next_review = now + 10 minutes

rating 3 — "Difícil" (Hard)
  ease_factor = max(1.3, ef - 0.15)
  interval    = max(1, round(interval * 1.2))
  repetitions unchanged
  next_review = now + interval days

rating 4 — "Bien" (Good)
  ease_factor unchanged
  interval:
    reps == 0 → 1 day
    reps == 1 → 6 days
    reps >= 2 → round(interval * ease_factor)
  repetitions += 1
  next_review = now + interval days

rating 5 — "Fácil" (Easy)
  ease_factor = ef + 0.15
  interval:
    reps == 0 → 1 day
    reps == 1 → 8 days
    reps >= 2 → round(interval * new_ease_factor * 1.3)
  repetitions += 1
  next_review = now + interval days
```

Interval preview labels shown under each button:

| Result | Label |
|---|---|
| < 10 min | `<10min` |
| 1 day | `1d` |
| 2–6 days | `Nd` |
| 7–13 days | `1sem` |
| 14–29 days | `Nsem` |
| ≥ 30 days | `Nmes` |

Every rating fires a fire-and-forget `flashcard_progress` upsert. Debug logging active: `console.log("[SM-2] card: rating: before: after:")`.

---

## 5. Cloze Syntax

Two syntaxes are supported; both parse identically in `FE_buildClozePreview` and `SV_clozeEl`.

**Preferred (new):**
```
La inflamación de las meninges se llama }}meningitis}}.
```

**Legacy (backwards-compatible):**
```
La inflamación de las meninges se llama {{c1::meningitis}}.
```

Combined regex: `/\{\{c\d+::(.*?)\}\}|\}\}(.*?)\}\}/g`

Hidden tokens render as amber `[...]` pills. Revealed tokens render in green. Multiple tokens per card are supported.

---

## 6. Tag System

### User-facing tags
- Stored in `flashcards.tags` (text[]).
- Added via the `FlashcardEditor` chip input: type + Enter or comma, or click a suggestion chip, or press `+`.
- Colorful chips — deterministic color from `FE_tagColor(tag)` hashing the string onto an 8-color palette: `["#a78bfa","#60a5fa","#34d399","#fbbf24","#f472b6","#ef4444","#06b6d4","#fb923c"]`.
- Same tag always gets the same color (hash-stable).

### Suggestions
- Fetched from `flashcards WHERE user_id = X AND is_official = false`.
- Up to 30 suggestions sorted by frequency.
- System/seed tags (from official cards) are excluded because the query filters `is_official = false`.

### Study filter chips
- `StudyView` setup screen shows only tags from the user's own non-official cards.
- Official-deck cards are skipped when building `tagMap` (checked via `SV_deckOfficial` lookup built from `SV_decks[].is_official`).
- Applying a tag filter narrows both available-card count and session count.

---

## 7. Component Map

| File | Export | Role |
|---|---|---|
| `src/components/DecksView.js` | `window.DecksView` | Deck list, stats, create/edit/delete decks |
| `src/components/DeckDetailView.js` | `window.DeckDetailView` | Card list inside a deck, search, tag filter, inline card actions |
| `src/components/FlashcardEditor.js` | `window.FlashcardEditor` | Create/edit modal (portal to `document.body`); basic + cloze types; draft auto-save |
| `src/components/StudyView.js` | `window.StudyView` | Multi-deck study session: setup → study → summary; SM-2; bidirectional flip |

Navigation uses `window.ECEPT_DECK_SELECTED` to pass the active deck between views. The floating `←` bubble in `app.js` handles all back navigation.

---

## 8. Pending — Update 24

- **Personal tags on official cards** — requires new table `user_card_tags (user_id, flashcard_id, tag)` with composite PK. UI: inline "Mis etiquetas" section on official cards in both DeckDetailView and StudyView.
- **Drag-to-reorder decks** — persistent order column on `decks`.
- **Export / import decks** — JSON format, round-trip fidelity.
- **Move cards between decks** — bulk action in DeckDetailView.
- **Card preview from list** — tap a card item to open full preview with prev/next navigation.
- **Show/hide answers toggle** — toggle in card list to reveal `back` text inline.
- **Tags as entities with custom colors** — tag management screen; override deterministic color with user-chosen color.

---

## 9. Pending — Update 25

- **Elion generates flashcards from uploaded documents** — user uploads PDF/text, Elion (Claude) extracts key concepts and proposes a batch of basic + cloze cards for review before saving to a chosen deck.
