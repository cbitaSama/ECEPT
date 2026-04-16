# ECEPT — Arquitectura

## Resumen

ECEPT es una aplicación React 18 de archivo único servida como sitio estático por GitHub Pages. No hay bundler, ni npm, ni backend. El build concatena los módulos de `src/` en un único `index.html` de ~430 KB.

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
- Datos: `RD` (reuma), `TR` (tríadas), `MODS`, `LINKS`, `NERVES`, …

### 4. Estado centralizado en `App()`
Un único componente `App` mantiene todo el estado vía `useState`. Sin Redux, sin context. `vista` es el enum de navegación (string) y todo lo demás es estado auxiliar (tabs, quiz, favoritos, etc.).

### 5. Persistencia ligera
Solo `localStorage` con `try/catch`. Clave `ecept_v1` guarda la lista de enfermedades revisadas.

## Estructura de carpetas

```
src/
  index.html                 Shell HTML con placeholders /* BUNDLE */ y /* TRAUMA_ARTIFACT_PLACEHOLDER */
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
    links.js                 LINKS (cross-refs), MODS (cards del home)
  components/
    SearchEngine.js          función globalSearch (indexa todos los datos)
    LinkBadge.js             badge clickeable para cross-refs
    NervesMap.js             mapa SVG de pares craneales
    TraumaEmbedView.js       iframe con el artefacto sellado
  app.js                     Componente App + ReactDOM.render
artifacts/
  trauma_unidad_1.html       Artefacto sellado (125 KB). Inlineado en base64 por el build.
scripts/
  build.js                   Concatena src/ + inyecta artefacto → build/ECSC.html + index.html
docs/
  ARCHITECTURE.md            (este archivo)
  SCHEMA.md                  Esquemas de datos
  CONTENT_INVENTORY.md       Inventario de contenido
  CHANGELOG.md               Historial
```

## Pipeline de build

`node scripts/build.js` hace:

1. **Lee** `src/index.html` (shell).
2. **Concatena** los módulos de `src/` en el orden declarado (orden crítico: `triadas.js` antes que `links.js` porque `MODS` referencia `TR.length`).
3. **Inyecta** el artefacto `artifacts/trauma_unidad_1.html` como base64 en una variable `TRAUMA_U1_B64`, y decodifica en runtime con `TextDecoder('utf-8')` para preservar los caracteres españoles. Base64 es necesario porque el artefacto contiene tags `</script>` que romperían el parseo si se inlineara como template literal.
4. **Verifica** integridad: existen todos los globals esperados, no se fugaron `</script>` del artefacto, los placeholders fueron reemplazados.
5. **Escribe** `build/ECSC.html` + `index.html` (idénticos).
6. **Imprime** manifest (líneas + KB por módulo) y resumen del output.

## Flujo de navegación

```
     home ◀──────── ECEPT logo / 🏠 Inicio (siempre visible)
      │
      ├──► reuma ──► reuma_sec ──► reuma_dis (Quiz · Tabs SUB)
      ├──► cir_menu ──► cir_abd
      ├──► anat_menu ──► anatomia (Pares Craneales + Mapa)
      │              ──► cir_ing  (Conducto Inguinal)
      ├──► emergen_menu ──► cir_quem (Quemaduras + Calculadoras)
      │                 ──► trauma-u1 (iframe full-bleed)
      ├──► epid (tabs: Pirámide, Estudios, Sesgos, Medidas, Lectura Crítica)
      ├──► fisio (tabs: Receptores, Comparación, Quiz, Perlas)
      ├──► labs
      ├──► general (Inmunología · Coagulación · Pares)
      ├──► triadas
      └──► imagenes  (placeholder)
```

- **Breadcrumbs** en el header muestran la ruta; cada nivel superior es clickeable.
- **Botón ← flotante** aparece en todas las vistas excepto `home` y `trauma-u1` (la vista de trauma tiene su propia navegación interna al ser un artefacto embebido).
- **Sidebar** (`☰`) lista todas las materias con acceso directo a subsecciones.

## Caso especial: Trauma — Unidad 1 (embed)

El artefacto `artifacts/trauma_unidad_1.html` es un documento HTML independiente, sellado (no se modifica). Se embebe vía `<iframe srcDoc={TRAUMA_U1_HTML}>` donde `TRAUMA_U1_HTML` viene del base64 inyectado en el build.

- Se renderiza **fuera** del wrapper principal (`<div maxWidth:900px>`) para que el iframe ocupe toda la pantalla.
- La altura es `calc(100vh - 60px)` para dejar el header de ECEPT visible.
- El botón ← flotante se oculta en esta vista para no competir con la navegación interna del artefacto.

## Convenciones

- **Idioma UI**: español rioplatense/latinoamericano.
- **Comentarios de código**: inglés (solo donde el "por qué" no sea obvio).
- **Nombres de vistas**: `snake_case` o slug con guión (`trauma-u1`), nunca camelCase.
- **Colores**: todos los colores hex pasan por `C.*` cuando es parte del tema global; colores de categoría se definen inline en cada sección.
