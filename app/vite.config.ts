import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config — Apple Silicon dev, Vercel deploy.
// Code splitting: cada módulo médico es un chunk lazy via React.lazy.
// Target ES2020+ porque ECEPT corre en Safari iOS/iPadOS modernos.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Alias @/ → src/ (resuelto por Rollup, no requiere `node:path`).
      { find: /^@\/(.*)$/, replacement: "/src/$1" },
    ],
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Manual chunks: framer-motion separado para que no infle el initial bundle.
        // Cada módulo médico ya es lazy, no necesita manualChunk extra.
        manualChunks: (id: string) => {
          if (id.includes("node_modules")) {
            if (id.includes("framer-motion")) return "motion";
            if (id.includes("react-router")) return "router";
            if (id.includes("react")) return "react";
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
