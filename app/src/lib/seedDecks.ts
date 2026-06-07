import type { Deck, Card } from "./useDecks";
// @ts-ignore
import { RD } from "@/data/reuma";
// @ts-ignore
import { VOCAB_VOC } from "@/data/vocabulario";
// @ts-ignore
import { TR } from "@/data/triadas";
// @ts-ignore
import { LAB_SECTIONS } from "@/data/labs";

// ════════════════════════════════════════════════════════════════
// Decks oficiales — auto-generados desde la data de cada módulo.
// Se inyectan en useDecks la primera vez que se monta una vista
// que los necesite (idempotente: chequea si el id ya existe).
// Cero pérdida: cada enfermedad / término genera una carta.
// ════════════════════════════════════════════════════════════════

export type SeedDeckDef = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  source: string;
  buildCards: () => Array<Pick<Card, "front" | "back" | "hint" | "tags">>;
};

export const SEED_DECKS: SeedDeckDef[] = [
  {
    id: "seed_reuma",
    name: "Reumatología — esencial",
    description: "12 enfermedades. Frente: nombre. Atrás: cuadro clínico + perlas.",
    icon: "🦴",
    color: "#f472b6",
    source: "module:reuma",
    buildCards: () =>
      (RD as any[]).map((d) => ({
        front: d.n,
        back: [d.cc?.t, ...(d.cc?.p || []).slice(0, 3), ...(d.pe || []).slice(0, 2)]
          .filter(Boolean)
          .join(" · "),
        hint: d.cc?.t,
        tags: ["reuma", d.s].filter(Boolean) as string[],
      })),
  },
  {
    id: "seed_vocab",
    name: "Vocabulario — prefijos & sufijos",
    description: "Etimología médica. Frente: prefijo/sufijo. Atrás: significado + ejemplos.",
    icon: "🔤",
    color: "#fbbf24",
    source: "module:vocabulario",
    buildCards: () =>
      (VOCAB_VOC as any[])
        .filter((v) => v.t === "p" || v.t === "s")
        .slice(0, 60)
        .map((v) => ({
          front: v.tx,
          back: v.sig + (v.ej?.length ? " · Ej: " + v.ej.slice(0, 2).join(", ") : ""),
          hint: v.or,
          tags: ["vocab", v.cat, v.t].filter(Boolean) as string[],
        })),
  },
  {
    id: "seed_triadas",
    name: "Tríadas — combos clásicos",
    description: "El nombre adelante, los componentes atrás.",
    icon: "🔺",
    color: "#e879f9",
    source: "module:triadas",
    buildCards: () =>
      (TR as any[]).map((t) => ({
        front: t.nm + (t.en ? ` (${t.en})` : ""),
        back: (t.cp || []).join(" + ") + (t.dt ? ` · ${t.dt}` : ""),
        hint: t.dt,
        tags: ["triadas", t.ct].filter(Boolean) as string[],
      })),
  },
  {
    id: "seed_labs",
    name: "Labs — valores normales",
    description: "Rangos de referencia esenciales.",
    icon: "🧪",
    color: "#34d399",
    source: "module:labs",
    buildCards: () => {
      const out: Array<Pick<Card, "front" | "back" | "hint" | "tags">> = [];
      for (const sec of (LAB_SECTIONS as any[]) || []) {
        for (const a of sec.analytes || []) {
          out.push({
            front: a.name,
            back: `Rango: ${a.range}${a.note ? " · " + String(a.note).replace(/<[^>]+>/g, "") : ""}`,
            tags: ["labs", sec.id].filter(Boolean) as string[],
          });
        }
      }
      return out.slice(0, 80);
    },
  },
];

/**
 * Asegura que los decks oficiales existen en el store.
 * Idempotente: si el deck ya está, no lo duplica ni regenera cartas.
 */
export function ensureSeedDecks(
  existingDeckIds: string[],
  createDeck: (d: Partial<Deck>) => Deck,
  addManyCards: (deckId: string, items: any[]) => void
) {
  for (const seed of SEED_DECKS) {
    if (existingDeckIds.includes(seed.id)) continue;
    try {
      const cards = seed.buildCards();
      createDeck({
        id: seed.id,
        name: seed.name,
        description: seed.description,
        icon: seed.icon,
        color: seed.color,
        source: seed.source,
        ownership: "official",
        tags: [],
      });
      addManyCards(seed.id, cards);
    } catch (err) {
      console.error("[ECEPT] failed to seed deck", seed.id, err);
    }
  }
}
