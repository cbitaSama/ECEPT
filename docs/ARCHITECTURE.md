# ECEPT — Arquitectura

## Resumen

ECEPT es una aplicación React 18 de archivo único servida como sitio estático por GitHub Pages. No hay bundler, ni npm, ni backend. El build concatena los módulos de `src/` en un único `index.html` de ~550 KB.

## Decisiones de diseño

### 1. Archivo único

GitHub Pages sirve estáticamente. No hay paso de compilación en el servidor. `scripts/build.js` concatena los módulos en `index.html` (raíz, servido por GH Pages) y `build/ECSC.html` (copia local versionada).

### 2. Sin bundler, sin JSX

- `React.createElement` con alias `e` — equivalente a JSX sin compilación.
- Solo `var` + `function` declarations — nada de ES6+ que requiera transpilación.
- React 18 se carga como UMD desde CDN.

### 3. Variables compactas

El bundle final se carga en móviles con conexión lenta. Variables y propiedades están comprimidas a mano:

- `e` = `React.createElement`, `F` = `React.Fragment`
- `C` = color object (`C.bg`, `C.cd`, `C.bd`, `C.ac`, …)
- `SUB` = subsecciones de enfermedad
- Datos: `RD` (reuma), `TR` (tríadas), `MODS`, `LINKS`, `NERVES`, `TRAUMA_SECCIONES`, `VOCAB_VOC`, …

### 4. Estado centralizado en `App()`

Un único componente `App` mantiene todo el estado vía `useState`. Sin Redux, sin context. `vista` es el enum de navegación (string) y todo lo demás es estado auxiliar (tabs, quiz, favoritos, etc.). Vistas complejas (trauma, vocabulario) encapsulan su propio estado en los componentes hijos.

### 5. Persistencia ligera

Solo `localStorage` con `try/catch`. Claves:
- `ecept_v1` — lista de enfermedades reumáticas revisadas.
- `ecept-trauma-view` — último tema de trauma visitado (hub/gen/via/poli/shock/torax).

## Estructura de carpetas

```
src/
  index.html                 Shell HTML con placeholder /* BUNDLE */
  styles/theme.js            Paleta C y shortcut SUB
  data/                      Fuentes de datos puras (solo var/array/object literales)
    reuma.js                 REUMA_SECS, RD (52 enfermedades)
    inmuno.js                INT (inmunología)
    triadas.js               TC (categorías), TR (tríadas) — debe ir ANTES de links.js
    cirugia.js               ABD_DATA
    emergencias.js           QUEM_PASOS
    anatomia.js              ING_*, NERVES
    epidemiologia.js         PIRAMIDE, ESTUDIOS, SESGOS, MEDIDAS_EPI, CHECKLIST_LC
    labs.js                  LAB_SECTIONS
    fisiologia.js            FISIO_RECEPTORS, FISIO_QUIZ, FISIO_PERLAS, FISIO_COMPARISON, FISIO_PROTEINAS_G
    generalidades.js         COAG_FACTORES, COAG_QUIZ, COAG_PERLAS, COAG_CASCADA
    trauma.js                TRAUMA_TOPICS, TRAUMA_SECCIONES (31), TRAUMA_ETT, TRAUMA_ABCD, TRAUMA_LETHAL, TRAUMA_REPASO, TRAUMA_HUB
    vocabulario.js           VOCAB_CATS (14), VOCAB_VOC (373), VOCAB_DEMOS (10), VOCAB_TIPO
    links.js                 LINKS (cross-refs), MODS (cards del home)
  components/
    SearchEngine.js          función globalSearch (indexa todos los datos)
    LinkBadge.js             badge clickeable para cross-refs
    NervesMap.js             mapa SVG de pares craneales
    BloqueRenderer.js        renderer genérico para la bloque-schema (ver SCHEMA.md)
    TraumaView.js            vista principal de Trauma · Unidad 1 (hub + topic + repaso modal)
    trauma/                  widgets interactivos del módulo trauma
      GlasgowCalculator.js
      HemorrhageCalculator.js
      ETTSelector.js
      ABCDEFGAccordion.js
      LethalLesionsGrid.js
      PuntosAnatomicos.js
    VocabularioView.js       vista principal de Vocabulario Médico
    vocab/                   SVGs + helpers + tarjetas del módulo vocab
      NeckSVG.js  HeartSVG.js  AbdSVG.js  WordSVG.js  DemoSVG.js
      wordDecoder.js         vocabNormalize, vocabCleanPart, vocabDecomposeWord, vocabWordOfDay
      WordOfDay.js  SmartDecoder.js  VocabQuiz.js
      CatCard.js  TermCard.js  DemoCard.js
  app.js                     Componente App + ReactDOM.render
artifacts/
  trauma_unidad_1.html       Fuente de referencia del contenido de Trauma (no se sirve; sólo lectura).
  vocabulario_medico_v4.html Fuente de referencia del contenido de Vocabulario (no se sirve; sólo lectura).
scripts/
  build.js                   Concatena src/ → build/ECSC.html + index.html (integridad verificada)
docs/
  ARCHITECTURE.md            (este archivo)
  SCHEMA.md                  Esquemas de datos + bloque-schema nativa
  CONTENT_INVENTORY.md       Inventario de contenido
  CHANGELOG.md               Historial
```

## Patrón de módulo nativo

Desde Alpha12, los módulos complejos (Trauma, Vocabulario) siguen un patrón uniforme:

1. **Datos puros** (`src/data/<modulo>.js`): sólo declaraciones `var` con arrays/objetos literales. Sin lógica, sin React.
2. **Widgets/componentes atómicos** (`src/components/<modulo>/*.js`): cada interacción (calculadora, acordeón, card) vive en su propio archivo pequeño.
3. **Vista raíz** (`src/components/<Modulo>View.js`): compone los widgets con layout, estado y routing interno. Expone un hook de "focus" en `window._<modulo>Focus` para que los resultados de búsqueda puedan saltar a una sección puntual.
4. **Schema compartida** (`src/components/BloqueRenderer.js`): renderiza primitivas de contenido (`text`, `list`, `table`, `callout`, `pearl`, `danger`, `trap`, `cards`, `widget`, `link`) a partir de un array `bloques`. Permite que el contenido esté en data files planos mientras se renderiza con componentes React.

El artefacto HTML original queda en `artifacts/` como fuente de verdad editorial — útil para diffear contenido sin ruido de layout.

## Pipeline de build

`node scripts/build.js` hace:

1. **Lee** `src/index.html` (shell).
2. **Concatena** los módulos de `src/` en el orden declarado (orden crítico: data files antes de components, widgets antes de sus consumidores, trauma y vocab data antes de sus vistas).
3. **Verifica** integridad: existen los 58 globals esperados, no se fugaron `</script>` extra, el placeholder `/* BUNDLE */` fue reemplazado.
4. **Escribe** `build/ECSC.html` + `index.html` (idénticos).
5. **Imprime** manifest (líneas + KB por módulo) y resumen del output.

No hay más inyección base64, no hay más placeholders de artefactos — todo es código React+datos.

## Flujo de navegación

```
     home ◀──────── ECEPT logo / 🏠 Inicio (siempre visible)
      │
      ├──► reuma ──► reuma_sec ──► reuma_dis (Quiz · Tabs SUB)
      ├──► cir_menu ──► cir_abd
      ├──► anat_menu ──► anatomia (Pares Craneales + Mapa)
      │              ──► cir_ing  (Conducto Inguinal)
      ├──► emergen_menu ──► cir_quem (Quemaduras + Calculadoras)
      │                 ──► trauma-u1 (vista nativa; hub + 5 temas)
      ├──► epid (tabs: Pirámide, Estudios, Sesgos, Medidas, Lectura Crítica)
      ├──► fisio (tabs: Receptores, Comparación, Quiz, Perlas)
      ├──► labs
      ├──► general ──► vocabulario (vista nativa; 373 raíces, decoder, quiz)
      ├──► triadas
      └──► imagenes  (placeholder)
```

- **Breadcrumbs** en el header muestran la ruta; cada nivel superior es clickeable.
- **Botón ← flotante** aparece en todas las vistas excepto `home`.
- **Sidebar** (`☰`) lista todas las materias con acceso directo a subsecciones.
- **Búsqueda global** indexa todas las secciones + 31 secciones de trauma + 373 raíces de vocabulario.

## Trauma y Vocabulario (nativas)

Ambas vistas se renderizan **dentro** del wrapper principal (`maxWidth:900px`), igual que el resto de los módulos. El header de ECEPT y su breadcrumb son la única navegación externa — las vistas no duplican sub-headers.

- `TraumaView` mantiene un ref de back-handler (`traumaBackRef`) que el botón ← del shell consulta: pop interno (modal → sección → tema) antes de salir del módulo.
- `VocabularioView` expone `window._vocabFocus(tx)` para que la búsqueda global pueda saltar al término exacto.

## Convenciones

- **Idioma UI**: español rioplatense/latinoamericano.
- **Comentarios de código**: inglés (solo donde el "por qué" no sea obvio).
- **Nombres de vistas**: `snake_case` o slug con guión (`trauma-u1`), nunca camelCase.
- **Colores**: hex directos cuando son del tema (`C.*`) o cuando son específicos de categoría (inline).
- **Nombres globales**: prefijados por módulo cuando hay riesgo de colisión (`VOCAB_*`, `TRAUMA_*`, `vocabNormalize`, `VocabCatCard`, etc.).
