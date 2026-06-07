# ECEPT · App (Alpha 26 — Restructure)

Versión rearmada de ECEPT. Lo nuevo: Vite + React 18 + TypeScript + Tailwind. Code splitting por módulo, bundle inicial bajo 500KB, dark mode premium.

El viejo build sigue intacto en la raíz del repo (`index.html` + `src/` clásico) hasta que decidas cortar.

## Stack

- Vite 5 (bundler)
- React 18 + TypeScript 5
- Tailwind 3.4 (paleta `C` preservada 1:1 desde `theme.js`)
- React Router 6 (rutas SPA)
- Framer Motion (animaciones sutiles)

## Estructura

```
app/
├── public/
│   └── legacy/salud-mental.html   ← bundle Alpha13 del módulo Salud Mental
├── scripts/
│   └── build-salud-mental.mjs      ← genera el HTML standalone de SM
├── src/
│   ├── components/
│   │   ├── shell/   ← Header, Footer, AppShell, BootLoader
│   │   ├── ui/      ← Card, Callout, Bullet, PageHeader, Section, Tabs, PageWrap
│   │   └── medical/ ← DiseaseCard, DiseaseModule (vista genérica reuma-style)
│   ├── data/        ← 14 módulos .ts (espejo 1:1 de src/data/*.js viejos)
│   ├── modules/
│   │   └── manifest.ts  ← Fuente de verdad para el grid del Home
│   ├── styles/index.css ← Tailwind + variables CSS
│   ├── types/index.ts   ← Schemas (Disease, Triada, LabAnalyte, etc.)
│   ├── views/
│   │   ├── HomeView.tsx, SearchView.tsx, AboutView.tsx
│   │   └── modules/   ← 15 archivos (uno por módulo)
│   ├── App.tsx, main.tsx
├── index.html
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── vercel.json     ← config para deployar app/ aislado en Vercel
```

## Comandos

```bash
# Desde /app
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # genera /app/dist
pnpm preview      # sirve /app/dist
pnpm build:sm     # regenera /public/legacy/salud-mental.html si tocaste el módulo SM
```

`pnpm build` corre automáticamente `build:sm` antes (via `prebuild`).

## Deploy a Vercel

Dos opciones:

**Opción A — sub-directorio** (mientras conviven los dos builds):
En el dashboard de Vercel, settá:

- Root Directory = `app`
- Framework Preset = Vite (o "Other")
- Build Command = `pnpm install && pnpm build`
- Output Directory = `dist`

**Opción B — cortar al nuevo** (cuando estés listo):
Reemplazar el `vercel.json` de la raíz por:

```json
{
  "buildCommand": "cd app && pnpm install --frozen-lockfile=false && pnpm build",
  "outputDirectory": "app/dist"
}
```

Y desde Vercel dashboard, Root Directory = raíz (no `app/`).

## Sobre el módulo Salud Mental

Salud Mental se sirve como una página HTML standalone bajo `/legacy/salud-mental.html`, generada
desde los archivos originales `src/components/salud_mental/*.js`. Esto preserva 100% del contenido
sin reescribir las 6.000+ líneas de createElement. La nueva app embebe esta página vía iframe.

Cuando edites contenido de SM en `../src/components/salud_mental/`, correr `pnpm build:sm` para
regenerar el HTML.

## Sobre los datos

Los archivos en `src/data/*.ts` son **espejos byte-por-byte** de los `.js` originales con un único
cambio: `var X = ` → `export const X = `. Cero pérdida de información. Si modificás un dataset acá,
también deberías reflejarlo en el viejo `src/data/*.js` mientras conviven los dos builds.

## Bundle target

Initial load (carga de la home) bajo 500KB gzip. Cada módulo es un chunk lazy — solo se carga
cuando el usuario navega al `/modulo/<slug>`. Verificá con:

```bash
pnpm build
ls -lh dist/assets/*.js | sort -k5
```

## Branch discipline

Esta restructura vive en `Alpha26-restructure`. NO mergear a `Alpha-2` sin verificar:

1. Que el build pasa (`pnpm build`).
2. Que cada uno de los 15 módulos abre sin errores en Safari iOS.
3. Que el bundle inicial es < 500KB.
4. Que el módulo Salud Mental sigue funcionando dentro del iframe.
