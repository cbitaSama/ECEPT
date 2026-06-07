import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageWrap from "@/components/ui/PageWrap";
import PageHeader from "@/components/ui/PageHeader";
import Callout from "@/components/ui/Callout";
import Bullet from "@/components/ui/Bullet";
import { useFavorites, favKey } from "@/lib/useFavorites";
// @ts-ignore
import { RD, REUMA_SECS } from "@/data/reuma";

// ════════════════════════════════════════════════════════════════
// Study Mode — flashcards de enfermedades (Reuma en v1).
// Front: nombre + sección. Back: cuadro clínico + perlas + pista.
// Acciones por card: ya la sé (siguiente) / repasar / favorito.
// Estado: índice + barajado opcional. Persiste "conocidas" en
// localStorage como ecept_known_v1 para que el siguiente ciclo
// salte lo que ya marcaste como aprendido.
// ════════════════════════════════════════════════════════════════

const KNOWN_KEY = "ecept_known_v1";

function loadKnown(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(KNOWN_KEY) || "[]"));
  } catch {
    return new Set();
  }
}
function saveKnown(s: Set<string>) {
  try {
    localStorage.setItem(KNOWN_KEY, JSON.stringify([...s]));
  } catch {
    /* */
  }
}

export default function StudyView() {
  const [params] = useSearchParams();
  const onlyFavs = params.get("favs") === "1";
  const skipKnown = params.get("skip") !== "0";
  const { favs } = useFavorites();
  const [known, setKnown] = useState<Set<string>>(loadKnown);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [shuffled, setShuffled] = useState<any[]>([]);

  const pool = useMemo(() => {
    let pool = (RD as any[]).slice();
    if (onlyFavs) {
      pool = pool.filter((d) => favs.includes(favKey("reuma", d.id)));
    }
    if (skipKnown) {
      pool = pool.filter((d) => !known.has(`reuma:${d.id}`));
    }
    return pool;
  }, [onlyFavs, skipKnown, favs, known]);

  // Shuffle inicial
  useEffect(() => {
    const arr = pool.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffled(arr);
    setIdx(0);
    setRevealed(false);
  }, [pool]);

  const card = shuffled[idx];
  const done = shuffled.length === 0 || idx >= shuffled.length;

  function next(markKnown: boolean) {
    if (!card) return;
    if (markKnown) {
      const k = new Set(known);
      k.add(`reuma:${card.id}`);
      setKnown(k);
      saveKnown(k);
    }
    setRevealed(false);
    setIdx((i) => i + 1);
  }

  function restartAll() {
    setKnown(new Set());
    saveKnown(new Set());
    setIdx(0);
    setRevealed(false);
  }

  const sectionName = card?.s ? (REUMA_SECS as any[]).find((s) => s.id === card.s)?.n : undefined;

  return (
    <PageWrap>
      <PageHeader
        kicker="Modo estudio"
        title="Reuma — Flashcards"
        tagline={onlyFavs ? "Solo tus favoritos." : "Cicla las enfermedades. Cubrí el back, intentá recordar, después flippeala."}
        icon="🎴"
        accent="#a78bfa"
      />

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Link
          to={onlyFavs ? "/estudio?favs=0" : "/estudio?favs=1"}
          className={`inline-flex items-center px-3 h-9 rounded-full text-[12px] font-medium border min-h-9 transition ${onlyFavs ? "bg-gold/15 text-gold border-gold/40" : "bg-white/[0.03] text-ink-muted border-white/[0.06] hover:bg-white/[0.06]"}`}
        >
          ⭐ Solo favoritos {onlyFavs && `(${favs.length})`}
        </Link>
        <Link
          to={skipKnown ? "/estudio?skip=0" : "/estudio?skip=1"}
          className={`inline-flex items-center px-3 h-9 rounded-full text-[12px] font-medium border min-h-9 transition ${!skipKnown ? "bg-primary/15 text-primary-hi border-primary-hi/40" : "bg-white/[0.03] text-ink-muted border-white/[0.06] hover:bg-white/[0.06]"}`}
        >
          {skipKnown ? "Saltar conocidas" : "Incluir todas"}
        </Link>
        <div className="ml-auto text-[12px] text-ink-dim">
          {done ? `${shuffled.length}/${shuffled.length}` : `${idx + 1}/${shuffled.length || 0}`}
        </div>
      </div>

      {done ? (
        <article className="p-8 rounded-2xl bg-grad-surface border border-white/[0.06] text-center">
          <div className="text-[40px] mb-2">🎉</div>
          <h2 className="font-display font-bold text-[22px] tracking-tight mb-2">
            {shuffled.length === 0 ? "Sin tarjetas disponibles" : "Listo, recorriste el mazo"}
          </h2>
          <p className="text-[14px] text-ink-muted mb-5">
            {shuffled.length === 0
              ? onlyFavs
                ? "No marcaste ningún favorito todavía."
                : "Todas marcadas como conocidas. Resetear para repasar de nuevo."
              : `Conocidas en total: ${known.size} de ${(RD as any[]).length}.`}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={restartAll}
              className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-grad-blue text-white font-semibold text-[13px]"
            >
              Resetear progreso
            </button>
            <Link to="/modulo/reuma" className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-white/[0.05] text-ink font-medium text-[13px] border border-white/[0.08]">
              Volver a Reuma
            </Link>
          </div>
        </article>
      ) : card ? (
        <AnimatePresence mode="wait">
          <motion.article
            key={card.id + ":" + (revealed ? "back" : "front")}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 sm:p-8 rounded-3xl bg-grad-surface border border-white/[0.07] min-h-[280px]"
          >
            {!revealed ? (
              <>
                {sectionName && (
                  <div className="text-[11px] uppercase tracking-wider text-cc font-medium mb-3">
                    {sectionName}
                  </div>
                )}
                <h2 className="font-display font-extrabold text-[28px] sm:text-[36px] tracking-tight text-balance">
                  {card.n}
                </h2>
                <p className="text-[14px] text-ink-muted mt-4">
                  Pensá los puntos clave. Cuando estés, tocá «Mostrar».
                </p>
                <button
                  onClick={() => setRevealed(true)}
                  className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-grad-blue text-white font-semibold text-[14px] shadow-glow-blue"
                >
                  Mostrar
                </button>
              </>
            ) : (
              <>
                <div className="text-[11px] uppercase tracking-wider text-cc font-medium mb-1">
                  {card.n}
                </div>
                {card.cc?.t && (
                  <p className="text-[15px] text-ink leading-relaxed mb-3 mt-1">{card.cc.t}</p>
                )}
                {Array.isArray(card.cc?.p) && card.cc.p.length > 0 && (
                  <Bullet items={card.cc.p.slice(0, 5)} accent="#f472b6" />
                )}
                {Array.isArray(card.pe) && card.pe.length > 0 && (
                  <div className="mt-4">
                    <Callout tone="orange" title="Perlas">
                      <ul className="space-y-1">
                        {card.pe.slice(0, 3).map((p: string, i: number) => (
                          <li key={i}>· {p}</li>
                        ))}
                      </ul>
                    </Callout>
                  </div>
                )}
                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => next(false)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full bg-white/[0.05] text-ink font-medium text-[14px] border border-white/[0.08] min-w-[140px]"
                  >
                    🔄 Repasar
                  </button>
                  <button
                    onClick={() => next(true)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full bg-success/15 text-success font-semibold text-[14px] border border-success/40 min-w-[140px]"
                  >
                    ✓ Ya la sé
                  </button>
                </div>
              </>
            )}
          </motion.article>
        </AnimatePresence>
      ) : null}
    </PageWrap>
  );
}
