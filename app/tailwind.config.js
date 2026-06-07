/** @type {import('tailwindcss').Config} */
// Paleta C (theme.js original) + tokens (tokens.js) preservados 1:1.
// Cada color mapea a su key original para que el código quede legible:
//   bg/cd/bd/ac/cl/dx/ex/tt/px/pl/tr.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Backgrounds (capa por profundidad)
        bg: "#060a14", // bg0 — fondo base
        "bg-1": "#0a0e1f",
        "bg-2": "#0d1224", // cd — card base
        "bg-3": "#11173a",
        "bg-4": "#1a2040", // bd — borde / divisor

        // ── Texto
        ink: "#e2e8f0", // tx
        "ink-muted": "#94a3b8", // mt
        "ink-dim": "#64748b", // dm
        "ink-ghost": "#475569",

        // ── Primario azul (acento principal)
        primary: "#3b82f6", // ac
        "primary-hi": "#60a5fa", // ac2

        // ── Sub-secciones médicas (mapeo 1:1 con SUB array original)
        cc: "#f472b6", // Cuadro Clínico — pink
        dx: "#60a5fa", // Diagnóstico — blue
        ex: "#34d399", // Exámenes — green
        tt: "#a78bfa", // Tratamiento — purple
        px: "#fbbf24", // Pronóstico — gold
        pl: "#fb923c", // Perlas — orange
        tr: "#e879f9", // Triadas — fuchsia

        // ── Semánticos
        success: "#34d399",
        warning: "#fbbf24",
        danger: "#ef4444",
        gold: "#fbbf24",
        "gold-hi": "#fcd34d",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "SF Pro Text",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        // tokens.js font scale
        display: ["48px", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "800" }],
        h1: ["36px", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        h2: ["24px", { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "700" }],
        h3: ["18px", { lineHeight: "1.35", letterSpacing: "-0.01em", fontWeight: "600" }],
        body: ["15px", { lineHeight: "1.55" }],
        "body-sm": ["13px", { lineHeight: "1.5" }],
        caption: ["12px", { lineHeight: "1.4", fontWeight: "500" }],
        micro: ["11px", { lineHeight: "1.3", fontWeight: "500" }],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
        "2xl": "28px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.15)",
        elev: "0 8px 24px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)",
        hero: "0 20px 48px rgba(0,0,0,0.4), 0 8px 16px rgba(0,0,0,0.25)",
        "glow-blue": "0 0 32px rgba(96,165,250,0.25)",
        "glow-purple": "0 0 32px rgba(167,139,250,0.25)",
        "glow-gold": "0 0 40px rgba(251,191,36,0.2), 0 4px 16px rgba(251,191,36,0.15)",
      },
      backgroundImage: {
        "grad-blue": "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
        "grad-purple": "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
        "grad-mixed": "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
        "grad-gold": "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        "grad-hero": "linear-gradient(180deg, #0a0e1f 0%, #060a14 100%)",
        "grad-surface": "linear-gradient(180deg, #0d1224 0%, #0a0e1f 100%)",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.32, 0.72, 0, 1)",
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};
