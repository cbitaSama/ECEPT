# ECEPT — Changelog

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
