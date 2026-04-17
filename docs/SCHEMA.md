# ECEPT — Esquemas de Datos

Todos los datos son `var` globales (no se exportan, el bundle es concatenado). Los campos son JS puro — sin tipos runtime, sin validación, sin frameworks.

## Reumatología — `src/data/reuma.js`

### `REUMA_SECS`
Array de secciones.
```js
{id, n, i, d}   // id slug, nombre, icono emoji, descripción corta
```

### `RD` (52 enfermedades)
```js
{
  id, n, s,                    // id, nombre, sección (ref a REUMA_SECS.id)
  cc: { t, p[] },              // cuadro clínico: texto + puntos clave
  dx: { cr[{c,d}], df[], nt }, // diagnóstico: criterios, Dx diferencial, nota
  ex: { l[], im },             // exámenes: laboratorio, imagen
  tx: { p, q, b, m },          // tratamiento: 1ª línea, 2ª, biológicos, monitoreo
  px: { e, f[], co[] },        // pronóstico: evolución, factores, complicaciones
  pe: [],                      // perlas
  qz: [{p, o[], r, x}]         // quiz: pregunta, opciones, índice correcta, explicación
}
```

## Tríadas — `src/data/triadas.js`

### `TC` (categorías)
```js
{id, n, c}   // id, nombre, color hex
```

### `TR`
```js
{ct, nm, en, ic, cl, cp[], dt}
// ct: ref a TC.id
// nm: nombre, en: nombre inglés/síntesis
// ic: icono, cl: color
// cp: componentes (3-5), dt: detalle
```

## Cirugía — `src/data/cirugia.js`

### `ABD_DATA`
```js
{
  id, name, icon, color, def,
  cl: [{type, desc, etiology, who, tx}]  // clasificaciones
}
```

## Emergencias — `src/data/emergencias.js`

### `QUEM_PASOS`
```js
{n, t, col, items[], alerta?}
// n: número de paso, t: título, col: color, items: acciones, alerta: warning opcional
```

## Anatomía — `src/data/anatomia.js`

### `ING_PAREDES`
```js
[{pared, nombre, estructura, detalle}]
```

### `ING_SUPERFICIAL`, `ING_PROFUNDO`, `ING_CORDON`
Objetos con campos `formacion`, `pilares`/`componentes`/`elementos`, `clinica`.

### `NERVES` (12 pares craneales)
```js
{id, name, latin, funcion, lesion, tipo, origen, ...coords SVG}
```

## Epidemiología — `src/data/epidemiologia.js`

### `PIRAMIDE`
```js
{nivel, nombre, color, ancho, desc, para, medida, ejemplo, icono}
```

### `ESTUDIOS`
```js
{nombre, tipo, temporal, ic, col, def, ventajas[], limitaciones[], medidas, pregunta}
```

### `SESGOS`
```js
{nombre, def, ejemplo, solucion, col, ic}
```

### `MEDIDAS_EPI`
```js
{nombre, formula, desc, regla, col}
```

### `CHECKLIST_LC`
```js
{paso, pregunta, detalle, col}
```

## Laboratorios — `src/data/labs.js`

### `LAB_SECTIONS`
```js
{
  id, label, subtitle, icon, accent,
  analytes: [{name, range, note, up[], down[]}]
}
```

## Fisiología — `src/data/fisiologia.js`

### `FISIO_RECEPTORS`
```js
{
  name, symbol, protein, clinical,
  effects: [{desc, organ, direction}],
  ...
}
```

### `FISIO_QUIZ`
```js
{p, o[], r, x}   // idéntica a RD[*].qz
```

### `FISIO_PERLAS`, `FISIO_COMPARISON`, `FISIO_PROTEINAS_G`
Arrays para tabs comparativos; campos `t`, `items`, etc.

## Generalidades — `src/data/generalidades.js` + `src/data/inmuno.js`

### `COAG_FACTORES`
```js
{num, nombre, alt?, fn, via, dep}
// num: romano (I..XIII), alt: nombre alternativo, via: intrínseca/extrínseca/común, dep: vitK
```

### `COAG_QUIZ`, `COAG_PERLAS`, `COAG_CASCADA`
Estructuras paralelas al resto de módulos con quiz.

### `INT` (inmunología)
```js
{t, s: [{t, x?, p[]}]}
// t: título global, s: secciones {título, explicación, puntos}
```

## Links y módulos del home — `src/data/links.js`

### `LINKS`
```js
{slug: {vista, label, materia}}   // cross-refs: cualquier componente puede linkear a otra vista
```

### `MODS` (cards del home)
```js
{id, n, ic, col, d, st}
// id: string corto, ic: emoji, col: color hex, d: descripción, st: "lleno" o "vacío"
// Debe declararse DESPUÉS de TR (usa TR.length en triadas card).
```

## Trauma — `src/data/trauma.js`

Usa la **bloque-schema** nativa (ver sección siguiente).

### `TRAUMA_TOPICS` (5 temas)
```js
{id, num, chip, title, accent, desc, chips[]}
// id: "gen"|"via"|"poli"|"shock"|"torax"
// num: "00"|"01"|"02"|"03"|"04"  (label del hub)
// chip: etiqueta tipográfica
// accent: color hex por tema
// desc: descripción corta en el hub
// chips[]: etiquetas cortas listadas bajo la descripción
```

### `TRAUMA_SECCIONES` (31 secciones)
```js
{id, topic, title, bloques: []}
// id: "gen-1", "via-4", "poli-5", "sh-3", "tx-2", ...
// topic: ref a TRAUMA_TOPICS.id
// bloques: array de primitivas (ver bloque-schema abajo)
```

### `TRAUMA_ETT` (9 filas — selector endotraqueal)
```js
{l, s, b, p, r}
// l: etiqueta de paciente ("Mujer adulta", "Prematuro", ...)
// s: tamaño ("7.0 – 7.5"), b: balón, p: profundidad, r: rama
```

### `TRAUMA_ABCD` (5 pasos)
```js
{letter, title, body: [...bloques]}
```

### `TRAUMA_LETHAL` (6 lesiones)
```js
{n, t, body: [...bloques]}
```

### `TRAUMA_REPASO` (5 bloques del modal)
```js
{accent, title, pairs: [[dt, dd], ...]}
// dt/dd soportan HTML inline
```

### `TRAUMA_HUB`
```js
{eyebrow, title, sub, stats: [{ico, label}]}
```

## Vocabulario — `src/data/vocabulario.js`

### `VOCAB_CATS` (14 categorías)
```js
{id, n, i, c, d}   // id slug, nombre, emoji, color hex, descripción
```

### `VOCAB_VOC` (373 entradas)
```js
{cat, t, tx, or, sig, ej[], tip}
// cat: ref a VOCAB_CATS.id
// t: "p" (prefijo) | "s" (sufijo) | "w" (término)
// tx: el morfema ("-tomía", "leuco-", "Esteatosis")
// or: etimología ("Griego: tomḗ (corte)")
// sig: definición en español
// ej: array de ejemplos clínicos
// tip: regla mnemotécnica con emoji
```

### `VOCAB_DEMOS` (10 decomposiciones animadas)
```js
{id, w, sub, type, p: [{s, m, c, d}], rev}
// type: "neck" | "heart" | "abd" | "word"  (router a SVG)
// p: partes del morfema (símbolo, significado, color, descripción)
// rev: texto de "la clave" que aparece al final de la animación
```

### `VOCAB_TIPO`
```js
{s: {l, c}, p: {l, c}, w: {l, c}}
// label + color por tipo de entrada
```

## Bloque-schema (Trauma)

Usada por `TRAUMA_SECCIONES[*].bloques` y por los bodies de `TRAUMA_ABCD` y `TRAUMA_LETHAL`. Cada bloque es uno de:

```js
{k:"p",       html}                              // párrafo (HTML inline permitido)
{k:"h3",      text}                              // subtítulo
{k:"h4",      text}                              // subtítulo menor (estilo mayúsculas)
{k:"list",    ordered?, items: []}               // ul o ol (items admiten HTML)
{k:"table",   compact?, headers: [], rows: [[]], hi?: [rowIdx]}
{k:"callout", tone, title?, html?, items?}       // tone: blue|green|purple|yellow|red|orange
{k:"pearl",   ico?, html}                        // perla clínica (naranja)
{k:"danger",  ico?, html}                        // alerta roja
{k:"trap",    ico?, html}                        // "TRAMPA DE EXAMEN"
{k:"cards",   layout, items: [...]}              // layout: triage|drug|card
{k:"widget",  name}                              // name: glasgow|hemorrhage|ett|abcdefg|lethal|anat_pts
{k:"link",    to?|jump?, label}                  // linkbadge clickeable; to=sec_id, jump=topic_id
```

`BloqueRenderer` (`src/components/BloqueRenderer.js`) mapea cada primitiva a su JSX correspondiente. Para widgets, el componente padre pasa un `widgets` map por props (`{glasgow:GlasgowCalculator, ...}`).

## Convenciones transversales

- **IDs** son strings cortos en `snake_case` o slug con guión.
- **Colores** son hex (`#rrggbb`) — el alpha (`+color+"15"`) se concatena al renderizar.
- **Iconos** son emojis Unicode directos.
- **Quiz** sigue el shape `{p, o[], r, x}` en todos los módulos (unificado). Vocabulario genera quizzes dinámicamente en runtime desde `VOCAB_VOC`.
- **Búsqueda**: cada módulo se indexa en `src/components/SearchEngine.js#globalSearch`. Para agregar un nuevo módulo al buscador, agregar un `forEach` allí que empuje resultados con `{type, name, sub, go}` (+ opcionalmente `secId` o `vocTx` para focus interno).
