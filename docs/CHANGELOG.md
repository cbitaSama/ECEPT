# ECEPT — Changelog

## Alpha12 — Extracción nativa de Trauma + Vocabulario (2026-04)

### Nuevo — Trauma Unidad 1 nativo
- **Datos planos** (`src/data/trauma.js`, 1082 líneas): 5 topics, 31 secciones, ETT (9 filas), ABCD (5 pasos), LETHAL (6 lesiones), REPASO (5 bloques), HUB metadata.
- **Bloque-schema** compartida (`src/components/BloqueRenderer.js`) con 11 primitivas: p, h3, h4, list, table, callout (6 tonos), pearl, danger, trap, cards, widget, link. Documentada en `docs/SCHEMA.md`.
- **6 widgets interactivos** (`src/components/trauma/*.js`): GlasgowCalculator, HemorrhageCalculator, ETTSelector, ABCDEFGAccordion, LethalLesionsGrid, PuntosAnatomicos. React.createElement puro, sin JSX.
- **Vista raíz** (`src/components/TraumaView.js`): hub + topic view + repaso modal. Mantiene su propio estado de navegación y expone `window._traumaFocus(secId)` para la búsqueda global.
- **Búsqueda regenerada** desde `TRAUMA_SECCIONES`: 31 entradas (vs 35 hard-coded anteriores) con keyword aliases por sección y `secId` routing para focus directo.

### Nuevo — Vocabulario Médico nativo
- **Datos planos** (`src/data/vocabulario.js`, 555 líneas): 14 CATS, 373 VOC entries (quir:12, diag:10, pato:32, col:10, sang:11, org:70, gu:14, endo:9, func:28, loc:29, med:21, cel:16, quim:28, term:83), 10 DEMOS, TIPO map.
- **5 SVG components** (`src/components/vocab/*SVG.js`): NeckSVG, HeartSVG, AbdSVG, WordSVG + DemoSVG router — todos en React.createElement, sin `dangerouslySetInnerHTML`.
- **4 helpers** (`src/components/vocab/wordDecoder.js`): `vocabNormalize`, `vocabCleanPart`, `vocabDecomposeWord` (greedy longest-match con gaps de 1 char), `vocabWordOfDay` (hash determinístico YYYY·10000+MM·100+DD × 2654435761).
- **6 componentes interactivos** (`src/components/vocab/*.js`): WordOfDay, SmartDecoder, VocabQuiz, CatCard, TermCard, DemoCard.
- **Vista raíz** (`src/components/VocabularioView.js`): hero + 4 tabs (Biblioteca/Decoder/Ejemplos/Quiz). Expone `window._vocabFocus(tx)`.
- **Búsqueda regenerada** desde `VOCAB_VOC`: 1 resultado por raíz (373) + 4 entradas de navegación.

### Limpieza
- **Eliminados**: `src/components/TraumaEmbedView.js`, `src/components/VocabularioEmbedView.js`.
- **Pipeline de build simplificado** (`scripts/build.js`): se removió toda la inyección base64 (artefactos, CSS overrides, postMessage bridge, nota Manchester, placeholders `TRAUMA_ARTIFACT_PLACEHOLDER` y `VOCAB_ARTIFACT_PLACEHOLDER`). El build ahora es: concatenar módulos → reemplazar `/* BUNDLE */` → escribir.
- **Shell** (`src/index.html`): sin placeholders de artefactos.
- **Sub-headers internos removidos** de TraumaView y VocabularioView — el shell de ECEPT ya muestra el breadcrumb.
- **Artefactos** (`artifacts/trauma_unidad_1.html`, `artifacts/vocabulario_medico_v4.html`) permanecen en disco como fuente de verdad editorial; ya no se sirven a usuarios.

### Integridad
- 58 checks pasando (antes 64: 6 checks de base64/iframe ya no son relevantes).
- 31/31 content markers presentes en `index.html` (antes de Alpha12 sólo 23/31 eran visibles en source porque el resto vivía dentro del base64).
- Parkland, Glasgow, neurogénico, Tríada de Beck, apósito de 3 lados, Hi-Lo, Magill, Murphy, pericardiocentesis, Midazolam, Succinilcolina, tomía/ectomía/stomía/rrafia/plastia, Leuco/Eritro/Hepato/Nefro/Cardio/Neumo — todos preservados byte-for-byte.

### Tamaño
- `index.html`: 661 KB (Alpha11, con ambos base64) → 548.7 KB (Alpha12). Se recuperaron **~112 KB** netos. El base64 encoding añadía ~371 KB; el código React + datos nativos pesa ~260 KB.

### Rutas de navegación
- `vista="trauma-u1"` ahora monta `<TraumaView/>` dentro del wrapper de 900 px (antes era iframe full-bleed).
- `vista="vocabulario"` ahora monta `<VocabularioView/>` dentro del wrapper.
- `handleBack` consulta `traumaBackRef.current()` para pop interno (modal → sección → tema → home). Vocab no necesita ref — la historia lineal cubre su UX.

## Alpha9 — Limpieza profesional (2026-04)

### Nuevo
- **Búsqueda ampliada**: `PIRAMIDE`, `MEDIDAS_EPI` y `CHECKLIST_LC` ahora aparecen en la búsqueda global (`src/components/SearchEngine.js`).
- **Build con verificación de integridad**: `scripts/build.js` falla si faltan globals esperados, si se fugaron tags `</script>` del artefacto, o si los placeholders no se reemplazaron. Imprime manifest con líneas + KB por módulo.
- **Documentación**: `docs/ARCHITECTURE.md`, `docs/SCHEMA.md`, `docs/CHANGELOG.md` (este archivo).

### Corregido
- **Breadcrumbs** para `cir_menu`, `cir_abd` e `imagenes` (antes omitidos o no linkeados).
- **Consistencia de navegación**: `cir_abd` ahora linkea "Cirugía" de vuelta a `cir_menu`, paralelo a `cir_ing → anat_menu`.

### Limpieza
- Eliminados archivos stale: `artifacts/processed/cranial_nerves_map.html.html`, `build/trauma_unidad_1.html`.
- `.gitignore` extendido.
- `README.md` reescrito con estructura clara + enlaces a la documentación.
- `docs/CONTENT_INVENTORY.md` expandido con rutas de archivos y lista completa de módulos.
- Comentarios estructurales en `src/app.js` (STATE / NAVIGATION / DERIVED / RENDER) — sin renames ni refactorizaciones.

## Alpha8 — Trauma Unidad 1 embebida

### Nuevo
- **Artefacto Trauma — Unidad 1** embebido como iframe full-bleed.
  - 5 temas, 29 secciones, 7 widgets interactivos.
  - Inlineado vía base64 (evita colisiones con tags `</script>` y permite despliegue en GitHub Pages sin 404).
  - `TextDecoder('utf-8')` preserva caracteres españoles en el round-trip `atob()`.
- **Componente** `src/components/TraumaEmbedView.js`.
- **Vista** `trauma-u1`, entrada en sidebar bajo Emergenciología, breadcrumb, y 30+ keywords indexadas en búsqueda.
- **Link cruzado** `trauma_u1` en `LINKS`.

### Corregido
- iframe renderizado fuera del wrapper principal para ocupar toda la pantalla.
- Se oculta el botón ← flotante en la vista de trauma (el artefacto tiene su propia navegación).

## Previos

### Alpha-2 (mainline)
- Anatomía hub (Pares Craneales + Conducto Inguinal).
- Mapa interactivo de pares craneales (SVG).
- Laboratorios con analitos (rangos, up/down).
- Epidemiología completa (5 tabs).
- Fisiología — Receptores Adrenérgicos.
- Reumatología 52 enfermedades, tríadas y síndromes, quemaduras + calculadoras, abdomen agudo, inmunología, coagulación.
