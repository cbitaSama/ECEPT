import { useCallback, useEffect, useState } from "react";

// ════════════════════════════════════════════════════════════════
// useDecks — sistema de flashcards persistido en localStorage.
// Key: ecept_decks_v1 (JSON)
// Schema:
//   Deck { id, name, color, icon, ownership: "official" | "user",
//          source?: "module:reuma" | null, tags[], createdAt }
//   Card { id, deckId, front, back, hint?, tags[],
//          createdAt, lastReview?, reviewCount, ease (0..3) }
// SRS simple — ease=0 prioriza, ease=3 espacia.
// ════════════════════════════════════════════════════════════════

export interface Deck {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  ownership: "official" | "user";
  source?: string;
  tags: string[];
  createdAt: number;
}

export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  hint?: string;
  tags: string[];
  createdAt: number;
  lastReview?: number;
  reviewCount: number;
  ease: 0 | 1 | 2 | 3; // 0=nueva/olvidada, 3=dominada
}

interface DeckStore {
  decks: Deck[];
  cards: Card[];
}

const STORAGE_KEY = "ecept_decks_v1";

function loadStore(): DeckStore {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return { decks: raw.decks || [], cards: raw.cards || [] };
  } catch {
    return { decks: [], cards: [] };
  }
}

function saveStore(s: DeckStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* quota */
  }
}

type Listener = (s: DeckStore) => void;
const listeners = new Set<Listener>();
function notify(s: DeckStore) {
  listeners.forEach((fn) => fn(s));
}

function uid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function useDecks() {
  const [store, setStore] = useState<DeckStore>(loadStore);

  useEffect(() => {
    const fn: Listener = (s) => setStore(s);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);

  const mutate = useCallback((updater: (s: DeckStore) => DeckStore) => {
    setStore((prev) => {
      const next = updater(prev);
      saveStore(next);
      notify(next);
      return next;
    });
  }, []);

  // ── Decks ─────────────────────────────────────────────────────
  const createDeck = useCallback(
    (data: Partial<Deck>) => {
      const deck: Deck = {
        id: data.id || uid("deck"),
        name: data.name || "Nuevo deck",
        description: data.description,
        color: data.color || "#a78bfa",
        icon: data.icon || "🎴",
        ownership: data.ownership || "user",
        source: data.source,
        tags: data.tags || [],
        createdAt: data.createdAt || Date.now(),
      };
      mutate((s) => ({ ...s, decks: [...s.decks, deck] }));
      return deck;
    },
    [mutate]
  );

  const updateDeck = useCallback(
    (id: string, patch: Partial<Deck>) => {
      mutate((s) => ({
        ...s,
        decks: s.decks.map((d) => (d.id === id ? { ...d, ...patch } : d)),
      }));
    },
    [mutate]
  );

  const deleteDeck = useCallback(
    (id: string) => {
      mutate((s) => ({
        decks: s.decks.filter((d) => d.id !== id),
        cards: s.cards.filter((c) => c.deckId !== id),
      }));
    },
    [mutate]
  );

  // ── Cards ─────────────────────────────────────────────────────
  const addCard = useCallback(
    (deckId: string, data: Partial<Card>) => {
      const card: Card = {
        id: data.id || uid("card"),
        deckId,
        front: data.front || "",
        back: data.back || "",
        hint: data.hint,
        tags: data.tags || [],
        createdAt: data.createdAt || Date.now(),
        reviewCount: 0,
        ease: 0,
      };
      mutate((s) => ({ ...s, cards: [...s.cards, card] }));
      return card;
    },
    [mutate]
  );

  const addManyCards = useCallback(
    (deckId: string, items: Array<Partial<Card>>) => {
      const now = Date.now();
      mutate((s) => ({
        ...s,
        cards: [
          ...s.cards,
          ...items.map<Card>((data) => ({
            id: data.id || uid("card"),
            deckId,
            front: data.front || "",
            back: data.back || "",
            hint: data.hint,
            tags: data.tags || [],
            createdAt: data.createdAt || now,
            reviewCount: 0,
            ease: 0,
          })),
        ],
      }));
    },
    [mutate]
  );

  const updateCard = useCallback(
    (id: string, patch: Partial<Card>) => {
      mutate((s) => ({
        ...s,
        cards: s.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      }));
    },
    [mutate]
  );

  const deleteCard = useCallback(
    (id: string) => {
      mutate((s) => ({ ...s, cards: s.cards.filter((c) => c.id !== id) }));
    },
    [mutate]
  );

  const markReview = useCallback(
    (id: string, knewIt: boolean) => {
      mutate((s) => ({
        ...s,
        cards: s.cards.map((c) => {
          if (c.id !== id) return c;
          // SRS simple: subir ease si la sabe, bajarlo si no.
          const nextEase = knewIt
            ? (Math.min(3, c.ease + 1) as Card["ease"])
            : (0 as Card["ease"]);
          return {
            ...c,
            ease: nextEase,
            lastReview: Date.now(),
            reviewCount: c.reviewCount + 1,
          };
        }),
      }));
    },
    [mutate]
  );

  // ── Helpers ───────────────────────────────────────────────────
  const cardsForDeck = useCallback(
    (deckId: string) => store.cards.filter((c) => c.deckId === deckId),
    [store.cards]
  );

  const deckById = useCallback(
    (id: string) => store.decks.find((d) => d.id === id),
    [store.decks]
  );

  // Cartas priorizadas para study mode: ease=0 primero, después por antigüedad de review
  const reviewQueue = useCallback(
    (deckId: string): Card[] => {
      const list = store.cards.filter((c) => c.deckId === deckId);
      return list.slice().sort((a, b) => {
        if (a.ease !== b.ease) return a.ease - b.ease;
        const la = a.lastReview || 0;
        const lb = b.lastReview || 0;
        return la - lb;
      });
    },
    [store.cards]
  );

  return {
    decks: store.decks,
    cards: store.cards,
    cardsForDeck,
    deckById,
    reviewQueue,
    createDeck,
    updateDeck,
    deleteDeck,
    addCard,
    addManyCards,
    updateCard,
    deleteCard,
    markReview,
  };
}
