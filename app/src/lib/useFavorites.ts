import { useCallback, useEffect, useState } from "react";

// ════════════════════════════════════════════════════════════════
// useFavorites — persistencia ligera en localStorage.
// Key formato: "<modulo>:<id>". Ej: "reuma:ar", "vocab:term-asterixis".
// ════════════════════════════════════════════════════════════════

const STORAGE_KEY = "ecept_favs_v1";

function load(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(list: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* quota etc — silenciar */
  }
}

// Pub-sub para que múltiples consumidores se mantengan sincronizados.
type Listener = (favs: string[]) => void;
const listeners = new Set<Listener>();
function notify(favs: string[]) {
  listeners.forEach((fn) => fn(favs));
}

export function useFavorites() {
  const [favs, setFavs] = useState<string[]>(load);

  useEffect(() => {
    const listener: Listener = (next) => setFavs(next);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const toggle = useCallback((key: string) => {
    setFavs((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      save(next);
      notify(next);
      return next;
    });
  }, []);

  const has = useCallback((key: string) => favs.includes(key), [favs]);

  const clear = useCallback(() => {
    setFavs([]);
    save([]);
    notify([]);
  }, []);

  return { favs, toggle, has, clear };
}

// Helpers para construir keys consistentes.
export function favKey(modulo: string, id: string) {
  return `${modulo}:${id}`;
}
