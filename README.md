# ECEPT — El Conocimiento Es Para Todos

Aplicación web de estudio médico para estudiantes de medicina de Latinoamérica.
Archivo único HTML con React 18, optimizada para móvil, instalable como PWA.

**En línea:** https://cbitasama.github.io/ECEPT/

## Instalación en iOS

1. Abrir el enlace en Safari.
2. Tocar el botón de compartir.
3. Elegir **"Añadir a pantalla de inicio"**.

## Contenido

Ver [`docs/CONTENT_INVENTORY.md`](docs/CONTENT_INVENTORY.md) para el inventario completo.

- **Reumatología** — 52 enfermedades reumáticas
- **Cirugía** — Abdomen Agudo
- **Emergenciología** — Quemaduras + Calculadoras · Trauma Unidad 1 (artefacto embebido)
- **Anatomía** — Conducto Inguinal · Pares Craneales (mapa interactivo)
- **Epidemiología** — Estudios, Sesgos, Medidas, Lectura Crítica
- **Fisiología** — Receptores Adrenérgicos, SNA
- **Generalidades** — Pares Craneales, Factores de Coagulación, Inmunología
- **Laboratorios** — Hemograma, Coagulación, Hepáticas, Renal, Ionograma, Tiroides
- **Tríadas y Síndromes** — Asociaciones clásicas multidisciplinarias

## Arquitectura

Ver [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) para detalles de la arquitectura y `docs/SCHEMA.md` para los esquemas de datos.

- Un solo archivo HTML servido estáticamente (GitHub Pages).
- React 18 vía CDN, sin bundler ni dependencias npm.
- Módulos en `src/` concatenados por `scripts/build.js` en `build/ECSC.html` y `index.html` (raíz).
- Convención: `React.createElement` (alias `e`), sin JSX; `var` y `function` únicamente.

## Desarrollo

```bash
node scripts/build.js       # genera build/ECSC.html + index.html
```

No requiere instalación de dependencias. Abrir `index.html` en el navegador para probar localmente.

## Estructura

```
src/
  index.html                plantilla HTML (inserta bundle en /* BUNDLE */)
  styles/theme.js           paleta + shortcuts React
  data/                     fuentes de datos (reumatología, cirugía, etc.)
  components/               SearchEngine, LinkBadge, NervesMap, TraumaEmbedView
  app.js                    App principal + ReactDOM.render
artifacts/
  trauma_unidad_1.html      artefacto sellado embebido en base64 en el build
scripts/
  build.js                  concatenación + inyección del artefacto
docs/
  ARCHITECTURE.md           arquitectura
  SCHEMA.md                 esquemas de datos
  CONTENT_INVENTORY.md      inventario de contenido
  CHANGELOG.md              historial
```

## Licencia

Uso educativo. Todo el contenido clínico es propiedad de sus respectivos autores.
