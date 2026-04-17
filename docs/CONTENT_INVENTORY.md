# ECEPT — Inventario de Contenido

## Reumatología (`src/data/reuma.js`)
- 52 enfermedades reumáticas con cuadro clínico, diagnóstico, criterios, tratamiento y perlas.

## Cirugía (`src/data/cirugia.js`)
- Abdomen Agudo (algoritmo completo con estudios y manejo).

## Emergenciología

### `src/data/emergencias.js`
- Algoritmo de Quemaduras + Calculadoras (SCQ, Parkland, criterios de internación).

### Trauma — Unidad 1 ✅ nativo (`src/data/trauma.js` + `src/components/TraumaView.js` + `src/components/trauma/*`)
- 5 temas · 31 secciones · 6 widgets interactivos · modo repaso.
- **gen** (Generalidades, 4): Definiciones, Deontología, Curva trimodal, Triage/START + Manchester.
- **via** (Vía Aérea, 7): Concepto, Maniobras, Cánulas, Intubación (con selector ETT), SIR + fármacos, Quirúrgica, Vía difícil.
- **poli** (Politraumatizado, 7): Clasificación, Hora de oro, Prehospitalario, ABCDEFG (acordeón), Glasgow (calculadora), Secundaria, Traslado.
- **shock** (9): Definición, Fases, Tríada letal, Clasificación (con calculadora hemorrágica), Trampas, Hemorrágico, Dx, Manejo, No hacer.
- **torax** (Tórax, 4): Definición, 6 lesiones letales (grid), Lesiones secundarias, Puntos anatómicos.
- **Widgets**: GlasgowCalculator, HemorrhageCalculator, ETTSelector, ABCDEFGAccordion, LethalLesionsGrid, PuntosAnatomicos.
- **Búsqueda**: 31 entradas (una por sección) con keyword aliases por tema.

## Anatomía (`src/data/anatomia.js` + `src/components/NervesMap.js`)
- Conducto Inguinal (paredes, contenido, clínica).
- Pares Craneales (mapa SVG interactivo sobre la base del cráneo).

## Epidemiología (`src/data/epidemiologia.js`)
- Pirámide de evidencia.
- Tipos de Estudio (cohorte, caso-control, ensayo clínico, etc.).
- Sesgos.
- Medidas de asociación e impacto.
- Lectura Crítica.

## Fisiología (`src/data/fisiologia.js`)
- Receptores Adrenérgicos.
- Sistema Nervioso Autónomo.

## Generalidades

### `src/data/generalidades.js` + `src/data/inmuno.js`
- Pares Craneales (tabla sinóptica).
- Factores de Coagulación.
- Inmunología (poblaciones celulares, citoquinas, HLA).

### Vocabulario Médico ✅ nativo (`src/data/vocabulario.js` + `src/components/VocabularioView.js` + `src/components/vocab/*`)
- **373 raíces** en 14 categorías (quir, diag, pato, col, sang, org, gu, endo, func, loc, med, cel, quim, term).
- **10 demos anatómicos** con SVGs propios: Esternocleidomastoideo (cuello), Peri-Mio-Endocardio (corazón), Epi-Meso-Hipogastrio (abdomen) + 7 demos tipo "word".
- **Decodificador inteligente** (SmartDecoder): descompone cualquier palabra médica por longest-match greedy.
- **Palabra del día**: entrada rotativa determinística por fecha (hash Knuth).
- **Quiz**: 10 preguntas MCQ generadas dinámicamente desde VOC (score + emoji + restart).
- **Búsqueda**: 1 entrada por raíz (373) + 4 entradas de navegación (Biblioteca/Decoder/Quiz/Ejemplos). Los resultados de búsqueda hacen focus al término exacto via `window._vocabFocus`.

## Laboratorios (`src/data/labs.js`)
- Hemograma.
- Coagulación.
- Hepáticas.
- Renal.
- Ionograma.
- Tiroides.

## Tríadas y Síndromes (`src/data/triadas.js`)
- Asociaciones clásicas multidisciplinarias.

## Links cruzados (`src/data/links.js`)
- Referencias internas entre módulos (ej. trauma → quemaduras, inmuno → reuma).
