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
6. Para CTAs: `<Button variant="primary">` o `variant="premium"` según contexto.
