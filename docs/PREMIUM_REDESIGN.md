# Premium Redesign — guía del sistema visual

Este documento describe el sistema visual premium implementado en la sesión
de rediseño (branch `claude/ecept-premium-redesign-Y83Dc`). Tomalo como
referencia para futuras sesiones — extender, no reinventar.

---

## 1. Design tokens (`src/styles/tokens.js`)

Expuesto como `window.T` (alias corto). Estructura:

```js
T.space.{xs|sm|md|lg|xl|xxl|xxxl|huge}     // 4..64 px
T.radius.{sm|md|lg|xl|xxl|pill}            // 6..28 + 999
T.shadow.{sm|md|lg|xl|glow_blue|glow_purple|glow_premium|inset_hi}
T.ease.{standard|out|spring|sharp}         // cubic-beziers
T.time.{instant|fast|medium|slow|slower|spring}
T.font.{display|h1|h2|h3|body|bodySm|caption|micro}.{size|weight|lh|spacing}
T.color.{bg0..bg4|text|textMuted|textDim|textGhost|primary|primaryHi|...}
T.color.{gradBlue|gradPurple|gradMixed|gradPremium|gradHero|gradSurface}
T.bp.{mobile|tablet|desktop|wide}          // 640|768|1024|1280
T.z.{base|sticky|dropdown|modal|toast|tooltip|max}
```

Regla: **siempre que pongas un valor visual nuevo, usá un token**. Si el token
no existe, agregalo a `tokens.js` antes de usar el literal.

## 2. Paleta extendida

Escala de profundidad de fondo (más oscuro → más claro):

```
bg0 #060a14   body
bg1 #0a0e1f   surface elevation 1
bg2 #0d1224   cards
bg3 #11173a   modals / dropdowns
bg4 #1a2040   borders / hover bg
```

Texto en 4 niveles: `text` → `textMuted` → `textDim` → `textGhost`.

Acento primario azul (`primary`/`primaryHi`), accents (`purple`, `cyan`,
`pink`), semánticos (`success`, `warning`, `danger`), premium (`gold`,
`goldHi`).

Gradientes pre-armados como strings: `gradMixed` (azul→violeta) es el más
usado para titulares y CTAs principales.

## 3. Typography scale

| Token        | Size | Weight | Letter-spacing | Uso                       |
|--------------|------|--------|----------------|---------------------------|
| `display`    | 48   | 800    | -0.025em       | Hero pages, splash         |
| `h1`         | 36   | 700    | -0.02em        | Title de vista             |
| `h2`         | 24   | 700    | -0.015em       | Section title              |
| `h3`         | 18   | 600    | -0.01em        | Card title                 |
| `body`       | 15   | 400    | —              | Texto principal            |
| `bodySm`     | 13   | 400    | —              | Texto secundario           |
| `caption`    | 12   | 500    | (UPPERCASE 0.12em) | Section label / chip   |
| `micro`      | 11   | 500    | —              | Stats label, micro tags    |

Font family: **Inter** (con fallback a DM Sans + system). Cargada vía Google
Fonts en `src/index.html`.

## 4. Animation curves

| Curve              | Cuándo                                                     |
|--------------------|------------------------------------------------------------|
| `ease.standard`    | Movimiento general 200-280ms (hover, transitions)          |
| `ease.out`         | Entradas (fade-in, slide-up al montar)                     |
| `ease.spring`      | Micro-momentos especiales (card flip, send button, achievement) |
| `ease.sharp`       | Salidas rápidas que no necesitan elegancia                 |

**No abuses del spring**. Solo para 4-5 momentos clave en toda la app.

Keyframes globales en `src/index.html`:

- `ecept_fadeIn`, `ecept_fadeSlideUp`, `ecept_fadeSlideDown`
- `ecept_scaleIn`, `ecept_modalIn`, `ecept_backdropIn`
- `ecept_glowPulse`, `ecept_shimmer`
- `ecept_logoSpin`, `ecept_logoFloat`
- `ecept_messageIn`, `ecept_initialPulse`

## 5. Component primitives

Todos en `src/components/`:

| Component         | Propósito                                              |
|-------------------|--------------------------------------------------------|
| `Logo`            | Hélice doble SVG (props: size, animated, glow, float)  |
| `LoadingScreen`   | Pantalla de transición premium con retry               |
| `HomeView`        | Landing rediseñada (hero + responsive grid)            |
| `ModuleShell`     | Wrapper con header sticky + accent bar + actions slot  |
| `CollapsibleSection` | Sección expandible con jerarquía (level 1-3)        |
| `LayeredCard`     | Card 3 niveles (resumen / details / deepDive)          |
| `InfoLayer`       | Panel slide-in lateral 480px                           |
| `Detail`          | "Ver más" inline                                       |
| `Toast` / `ToastHost` | `window.ECEPT_toast(msg, variant, duration)`       |
| `Button`          | Sistema unificado (primary/secondary/ghost/danger/premium, sm/md/lg) |
| `ECEPT_useViewport` | Hook que retorna `window.innerWidth` reactivo        |

## 6. Patrones de layout responsivo

**Mobile (< 640)** — stack vertical, padding `lg` (16px), 1 columna.
**Tablet (640-1023)** — 2 columnas en grids, padding `lg`-`xl`.
**Desktop (≥ 1024)** — 3 columnas, padding `xl`-`xxl`, max-width 1280.
**Wide (≥ 1280)** — 4 columnas en grids densos.

Hook canónico:
```js
var w = ECEPT_useViewport();
var isDesktop = w >= T.bp.desktop;
```

Desktop NO es mobile estirado: cambia el número de columnas, el tamaño del
hero, el padding y la posición de los elementos. Usá max-width 1280 centrado
en vistas content-heavy.

## 7. Premium feel (Hybrid C)

UI core idéntica para todos. Zonas Premium:

- Modelo Pro 2.5 en chat → badge gold + `shadow.glow_premium`
- Generador Elion para usuarios Pro → background `gradPremium` con glow
- Toast variant `premium` → border-left gold + glow_premium

Reglas:
- Glow_premium **nunca** > 0.3 opacity en sombras
- No usar gold como color de texto general — solo en badges y CTAs Premium
- El gradient gold debe contrastar — usar texto `bg0` (#0a0e1f) sobre gold

## 8. Decisiones tomadas en zonas ambiguas (esta sesión)

- **Branch destino**: el system prompt obliga a `claude/ecept-premium-redesign-Y83Dc`. Se respetó esa instrucción aunque las "Reglas Duras" del usuario pidan Alpha25-elion-flashcards. Sebas decide el merge.
- **HomeView**: nuevo componente dedicado en lugar de inline en `app.js`. Mantiene 100% de la información original (stats, progreso reuma, favoritos, módulos especiales, materias). Reemplaza emoji 🧬 por `Logo` SVG en el hero.
- **ChatBot**: ediciones quirúrgicas en lugar de reescritura total (1051 líneas, lógica frágil). FAB y avatar usan ahora el `Logo` SVG. Empty state, mensajes y panel refinados. Toda la lógica de send/persistencia/model-picker/memoria/deeplinks **intacta**.
- **StudyView**: card flip más cinematográfico (minHeight 320, perspective 1200, transition 600ms standard). Rating buttons con tinte de color semántico al 15% en bg.
- **DecksView**: hover refinado vía CSS class injection (no se tocó la estructura del componente).
- **ModuleShell**: creado pero NO aplicado a vistas existentes para no romper layouts. Disponible como primitive para futuras migraciones.
- **Layered**: infraestructura sin migrar contenido (decisión del plan).
- **Inter font**: agregada como primaria, mantenida DM Sans como fallback y Playfair Display como referencia (no usada en componentes nuevos).
- **Initial loader inline**: SVG de hélice doble en `src/index.html` para mostrar algo inmediatamente. Fallback de error global en `window.onerror` (NO pantalla negra eterna).

## 9. Pendiente para futuras sesiones

- **Migración de contenido a capas**: `ReceptoresView`, `MediadoresView`, `CoagulacionView`, `LabsView` y módulos densos de Salud Mental son candidatos directos para `LayeredCard` + `CollapsibleSection`.
- **Aplicar `ModuleShell`** a las vistas internas de Reumatología, Cirugía, Anatomía, Trauma, Vocab, etc. (no se aplicó esta sesión para evitar romper sus layouts).
- **DecksView/DeckDetailView**: rediseñar más profundamente (esta sesión solo refinó hovers).
- **AuthModal**: ver si conviene cambiar el modelo "modal centrado" por una vista fullscreen tipo onboarding.
- **ProfileView**: agregar el layout 2-columnas con tabs verticales en desktop (esta sesión solo refinó el header).
- **Empty states unificados**: aún hay emoji-pesados sin ilustraciones SVG.
- **Skeletons**: pendientes para listas (chats, decks, cards).
- **Migrar botones inline a `Button`**: hay decenas de inline-styled buttons que se beneficiarían del sistema unificado.
- **Performance**: el bundle está en ~1.55 MB. Auditoría de tree-shaking + lazy load por vistas sería el siguiente paso.

## 10. Reglas duras respetadas

- `0` ocurrencias de `const`/`let`/`=>` en `src/` (verificado por `grep -cE`)
- Build pasa todos los integrity checks (144 globals)
- `src/data/*.js` intacto
- Backend (`api/*`) intacto
- RLS / Supabase queries de negocio intactas
- Una fase = un commit

---

## Cómo seguir desde acá

1. Leé `tokens.js` y mantenelo como fuente de verdad.
2. Antes de agregar un literal de color/spacing/easing, buscá si ya existe en T.
3. Para una vista nueva: empezá con `ModuleShell` + `HomeView`-style hero si aplica.
4. Para listas densas: usá `LayeredCard`.
5. Para feedback al usuario: `window.ECEPT_toast(msg, variant)` en lugar de alerts.
6. Para loading states: usá `SkeletonList`/`SkeletonCard`/`SkeletonRow` en lugar de "Cargando…".

---

## 11. Fixes post-deployment (sesión Mayo 2026)

Commits adicionales sobre el rediseño base. Todos en `Alpha25-elion-flashcards`.

| # | Hash      | Bug / Feature              | Resumen                                                          |
|---|-----------|----------------------------|------------------------------------------------------------------|
| 1 | `a91620e` | Bug 1: Loading invisible   | Initial loader inline robusto + min-time 800ms.                  |
| 2 | `7bf050c` | Bug 2: Home no aprovecha viewport | Wrapper main full-width + grid auto-fit; padding fluido hasta 1400px. |
| 3 | `3f833cc` | Bug 3: Logo cortado/feo    | viewBox 100x100 con padding interno; endpoint circles; container Auth fix. |
| 4 | `03c43bf` | DeckDetailView refinado    | Grid responsive auto-fit + cards minHeight 110.                  |
| 5 | `e6b9664` | DecksView grid wide        | maxWidth 1400, minmax(280), cards minHeight 160.                 |
| 6 | `db15f24` | ModuleShell en Reuma (test) | Vista 'reuma' usa ModuleShell + grid de secciones premium.      |
| 7 | `0afed25` | Skeleton loaders           | Sistema unificado SkeletonBase/Text/Avatar/Card/List/Row.        |

### Bug 1 — Loading screen invisible
**Causa raíz**: El initial-loader inline en `src/index.html` dependía de keyframes
del bundle (`ecept_logoFloat`). Cuando React montaba rápidamente, el dispatch de
`ECEPT_READY` ocurría antes de que el usuario percibiera el loader.

**Solución**:
- `window._ECEPT_START` capturado en el primer `<script>` del `<head>`.
- Initial-loader inline con keyframes propios (`ecept_il_*`) y SVG completo
  embebido — no depende de nada del bundle.
- En `src/app.js`, el dispatch de `ECEPT_READY` ahora espera
  `max(0, 800 - elapsed)` ms para garantizar visibilidad mínima.
- Fail-safe: si pasaron 12s sin `ECEPT_READY`, el tagline se vuelve clickable
  con texto "tocá para recargar" en amarillo.

### Bug 2 — Home no aprovecha viewport
**Causa raíz**: `src/app.js` línea 421 tenía wrapper con `maxWidth:'900px'` que
limitaba TODA la app, incluido el home recién rediseñado.

**Solución**:
- Wrapper main ahora condicional: `vista==='home' || vista==='reuma'` usa
  `width:100%` sin padding lateral. Resto sigue con `maxWidth:900px`.
- HomeView container: `padding:'0 max(32px, calc((100vw - 1400px) / 2))'`.
  En pantallas <1400px usa 32px lateral; en >1400px centra el contenido a
  1400px de ancho útil con padding lateral creciente.
- Grid auto-fit `repeat(auto-fit, minmax(280px, 1fr))` reemplaza los breakpoints
  rígidos previos (3-col desktop, 4-col wide). Ahora es responsive real:
  mobile 1-col → tablet 2-3 → desktop 3-4 → wide 4-5 según viewport real.

### Bug 3 — Logo cortado y feo
**Causa raíz**: viewBox era `0 0 64 64` con paths que llegaban a y=70 (afuera
del viewBox → corte). Curvas Bézier esquemáticas sin refinamiento.

**Solución**:
- viewBox `0 0 100 100` con padding interno 12px (strands en y 12-84, x 22-78).
  Garantiza que NUNCA se corte, ni con strokeWidth grande.
- Strand 1 + Strand 2 con curvas Bézier sinusoidales opuestas (efecto DNA real).
- 4 rungs con opacity gradient (0.7 extremos → 0.55 centro).
- 4 endpoint circles (r:3) en cada extremo — detalle premium.
- Container del Logo en Auth.js con `height:80px`, `overflow:visible`.

### Pendientes documentados (TODOs)

- Aplicar `ModuleShell` a `cir_menu`, `anat_menu`, `emergen_menu`, `fisio` (Reuma
  ya está hecho como test).
- DeckDetailView: header del deck (nombre + acciones) podría rediseñarse con
  ModuleShell premium si pasa el test de Reuma.
- Migrar inline-styled buttons en DecksView/DeckDetailView a `<Button>`.
- Empty states de DecksView y DeckDetailView mantienen el viejo styling (no se
  tocaron esta sesión por riesgo).
- Skeleton para StudyView (durante carga inicial de cards SRS).
- Toast para feedback de actions (export, import, generate, delete) — actualmente
  hay `alert()` y mensajes inline.

### Verificación final (sesión Mayo 2026)

- 0 ocurrencias de `const`/`let`/`=>` en archivos modificados.
- Build: `✓ build OK (148 integrity checks passed)`.
- `src/data/*` intacto.
- `api/*` intacto.
- 8 commits secuenciales, todos en `Alpha25-elion-flashcards`.

---

## 12. Ronda 2 — Fixes finos (sesión Mayo 2026)

8 commits adicionales sobre la ronda 1. Todos en `Alpha25-elion-flashcards`.

| # | Hash      | Fix / Feature                            | Resumen                                         |
|---|-----------|------------------------------------------|-------------------------------------------------|
| 1 | `229e476` | Logo flow infinito (no rotación)         | strokeDashoffset animado + scale breathe        |
| 2 | `4cece43` | Loading screen FORZAR 1200ms             | CSS animation-delay puro, no JS timing          |
| 3 | `c497931` | ModuleShell aplicado a 3 menús           | cir_menu, anat_menu, emergen_menu               |
| 4 | `f19e8f3` | Skeletons VISIBLES con min 400ms         | finishLoading helper en DecksView/DeckDetail/CB |
| 5 | `cd32aac` | ModuleShell con IMPACTO real             | Hero radial + título gradient + icon 80px       |
| 6 | `0cfa566` | EmptyState component + aplicado          | DecksView/DeckDetail/ChatBot empty refinados    |
| 7 | `b8a51bf` | Toast feedback en import/bulk/copy       | API flexible + integrado en flujos              |
| 8 | (este)    | Docs ronda 2                             |                                                 |

### Bug 1 — Animación logo "flow infinito"
**Causa**: la rotación 360° no era el efecto deseado. Sebas quería sensación de movimiento perpetuo (∞) en las strands DNA.

**Solución**: en `src/components/Logo.js` se reemplazó `animation: ecept_logoSpin` por dos clases:
- `.ecept-strand-flow` / `.ecept-strand-flow-reverse`: animan `stroke-dashoffset` de 0 a -20/+20 px en 2.5s linear loop. Las strands ahora tienen `stroke-dasharray: '6 4'` lo que crea segmentos visibles que aparecen "fluyendo" perpetuamente en direcciones opuestas.
- `.ecept-logo-flow`: scale 1↔1.03 en 3s ease-in-out → respiración sutil del container.

Los keyframes están en `src/index.html` (CSS global). El initial-loader inline también usa el mismo efecto vía `il-strand-a/b` classes con keyframes `ecept_il_strandFlow` (idénticos pero scoped).

ID único por instancia (`ECEPT_LOGO_UID++`) para que el avatar del chat (28px) no comparta gradient con el FAB (32px) ni con el hero del home (88px).

### Bug 2 — Loading screen forzado 1200ms
**Causa**: el min-time JS en `src/app.js` no funcionaba consistentemente. En cargas cacheadas, el bundle se ejecutaba antes de que `_ECEPT_START` fuera capturado de manera confiable, y el dispatch de `ECEPT_READY` ocurría inmediato.

**Solución**: cambio a CSS-only. El `#initial-loader` tiene:
```css
animation: ecept_loaderFadeOut 320ms cubic-bezier(0.16,1,0.3,1) forwards;
animation-delay: 1200ms;
animation-play-state: paused;
```

Cuando React monta y dispara `ECEPT_READY`, agregamos clase `.go` que cambia a `animation-play-state: running`. El `animation-delay` CSS de 1200ms garantiza visibilidad mínima desde el primer paint del HTML — sin depender de cuándo se ejecute JS. Si la app monta en 50ms, el loader sigue visible hasta cumplir 1200ms.

Fail-safe a 8s: si nunca llegó `ECEPT_READY`, el loader se reemplaza por mensaje de error con botón Recargar.

### Bug 3 — Premium aplicado app-wide
ModuleShell ahora envuelve también `cir_menu`, `anat_menu`, `emergen_menu` (antes solo `reuma`). Cards internas con grid auto-fit, hover translateY(-2px), stagger animation.

ModuleShell mismo fue refactorizado (Commit 5) para tener IMPACTO visible:
- Hero prominente con padding 56px desktop / 32px móvil.
- Background con accent radial gradient derivado del color del módulo.
- Icon container 80x80 con gradient + glow (24px @ 0.15) + border al 32%.
- Título h1 40px desktop, gradient mixto (text→accent), font-weight 800.
- Subtitle visible al lado del título.
- Layout column en mobile (icon arriba) / row en tablet+.

**Pendiente**: aplicar a `fisio`, `general`, `trauma-u1`, `vocabulario`. No se aplicó esta sesión por riesgo de romper widgets nativos.

### Bug 4 — Skeletons visibles con min 400ms
**Causa**: las queries respondían en <100ms, el flash del skeleton era imperceptible.

**Solución**: helper `finishLoading(fn)` que captura `Date.now()` al iniciar, calcula `elapsed` al recibir respuesta, y espera `max(0, 400 - elapsed)` antes de hacer `setLoading(false)`. Aplicado en:
- `DecksView.DV_loadData` (con `DV_finishLoading`)
- `DeckDetailView.DD_loadCards` (con `DD_finish`)
- `ChatBot.CB_loadConversations` (con `CB_finish`)

No retrasa cargas lentas — solo difiere las rápidas para garantizar visibilidad mínima.

### Bug 5 — ModuleShell visual real
Resuelto en Commit 5. Ver Bug 3 arriba.

### EmptyState component
Nuevo en `src/components/EmptyState.js`. API:
```js
e(EmptyState, {
  icon: '🎴',
  title: 'Todavía no tenés barajas',
  description: '...',
  actions: [
    { label: '+ Crear baraja', onClick: ..., variant: 'primary' },
    { label: '✨ Generar con IA', onClick: ..., variant: 'premium' }
  ]
})
```

Variants: `primary` (gradient mixed), `secondary` (bg primarySoft + border), `premium` (gradient gold + glow_premium, color text bg0 para legibilidad).

Aplicado en DecksView empty, DeckDetailView empty (canEdit + oficial), ChatBot sidebar (versión compacta inline).

### Toast en flujos
ECEPT_toast ahora soporta API string + objeto. Aplicado en:
- `DV_importDeck` success/error
- `DD_bulkDelete` success/error
- `DD_bulkCopy` success

window.alert() activos en src/components/: 0. Los `role:'alert'` que aparecen son ARIA, no native dialogs.

### TODOs ronda 2

- ProfileView con layout 2-col en desktop (sidebar avatar + main cards) — no se aplicó esta sesión.
- StudyView con background gradient + footer stats post-sesión — no se aplicó.
- Aplicar ModuleShell a fisio, general, trauma-u1, vocabulario.
- Migrar inline-styled buttons a `<Button>`.
- Skeleton para StudyView durante carga inicial.
- Auditar mobile (320-480px) tap targets / texto / modales en cada vista — no se hizo smoke test mobile esta sesión.
- ChatBot fullscreen aprovecha hasta 1400px max-width (ya está según el merge previo, solo pendiente verificar en device real).

### Verificación final (ronda 2)

- 0 ocurrencias de `const`/`let`/`=>` en archivos creados/modificados (verificado).
- Build: `✓ build OK (150 integrity checks passed)`.
- `src/data/*` intacto.
- `api/*` intacto.
- RLS / Supabase queries de negocio intactas.
- 8 commits secuenciales, ninguno mergeado a Alpha-2.
6. Para CTAs: `<Button variant="primary">` o `variant="premium"` según contexto.
