# Flashcards Advanced — Update 24a

## Features implementadas

### Tag system (user_tags + user_card_tags)
- Tags como entidades con color custom por usuario
- CRUD completo via TagManager modal (botón 🏷️ en DecksView)
- Tags personales en cards oficiales (user_card_tags), visualmente diferenciados (borde dashed)
- FlashcardEditor: sugerencias desde user_tags, auto-create al guardar
- StudyView: filtro de tags incluye user_card_tags para barajas oficiales

### Drag-to-reorder barajas propias
- Handle ⋮⋮ en barajas propias, Pointer Events API
- Persiste sort_order en Supabase, optimistic update
- Barajas oficiales inmutables en orden

### Card preview modal
- Click en card → modal con flip animado, navegación ◀/▶, indicador X/Y
- Soporte cloze: blank con _____, reveal con color
- Swipe down cierra, teclado (Escape/flechas) navega
- ReactDOM.createPortal

### Show/hide answers toggle
- Toggle 👁 en topbar de DeckDetailView
- Persiste por deck en localStorage (ECEPT_DECK_<id>_SHOW_ANSWERS)
- Cloze: muestra blank/reveal inline, sin fila de back

### Copiar card oficial a baraja propia
- Botón 📥 en cada card de baraja oficial
- Modal: seleccionar baraja propia o crear nueva inline
- Inserta copia con is_official=false, preserva front/back/tags/card_type
- Banner de éxito 2s

## Schema Supabase agregado
- user_tags (id, user_id, name, color)
- user_card_tags (user_id, flashcard_id, tag)
- decks.sort_order (integer, default 0)

## Archivos nuevos
- src/components/TagManager.js
- scripts/backfill-user-tags.sql
- docs/flashcards_advanced_24a.md

## Archivos modificados
- src/components/DecksView.js
- src/components/DeckDetailView.js
- src/components/FlashcardEditor.js
- src/components/StudyView.js
- scripts/build.js (expectedGlobals +2)

## Commits
- ef959dc backfill SQL
- 583f780 TagManager + DecksView + FlashcardEditor (Fase 1)
- 190119d user_card_tags + StudyView filter (Fase 2)
- cd73ba8 drag-to-reorder (Fase 3)
- 41af074 + fa13dfa card preview modal (Fase 4)
- 0913a65 show/hide toggle (Fase 5)
- 18b6d5d fix cloze list render (Fase 5 fix)
- 96d7bad copy card to own deck (Fase 6)

## Fixes post-implementación

### fix(24a): double toast en cards copiadas (d9540e2)
Al editar una card copiada desde oficial, aparecían simultáneamente
"Guardado con éxito" y "Error de conexión". Causa: el upsert fire-and-forget
a user_tags podía lanzar síncronamente, escapando su propio .catch() y
cayendo al .catch() exterior del save handler. Fix: wrappear el bloque
upsert en try/catch adicional.
