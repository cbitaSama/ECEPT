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

## Convenciones transversales

- **IDs** son strings cortos en `snake_case` o slug con guión.
- **Colores** son hex (`#rrggbb`) — el alpha (`+color+"15"`) se concatena al renderizar.
- **Iconos** son emojis Unicode directos.
- **Quiz** sigue el shape `{p, o[], r, x}` en todos los módulos (unificado).
- **Búsqueda**: cada módulo se indexa en `src/components/SearchEngine.js#globalSearch`. Para agregar un nuevo módulo al buscador, agregar un `forEach` allí que empuje resultados con `{type, name, sub, go}`.
