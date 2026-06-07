import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageWrap from "@/components/ui/PageWrap";
import PageHeader from "@/components/ui/PageHeader";
import Callout from "@/components/ui/Callout";
import { useDecks, type Card, type Deck } from "@/lib/useDecks";

// ════════════════════════════════════════════════════════════════
// FlashcardStudy — modo estudio dentro de un deck.
// Algoritmo simple: la queue prioriza cartas con ease bajo (0 antes
// que 1, etc.) y dentro de cada ease, la que se revisó hace más tiempo.
// Las cartas marcadas "lo sé" suben de ease (max 3). Las "repasar"
// vuelven a ease=0.
// ════════════════════════════════════════════════════════════════

interface Props {
  deckId: string;
  deck: Deck;
  cards: Card[];
  backTo: string;
}

export default function FlashcardStudy({ deck, cards, backTo }: Props) {
  const { markReview } = useDecks();
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [queue, setQueue] = useState<Card[]>([]);
  const [reviewedThisSession, setReviewedThisSession] = useState(0);
  const [knownThisSession, setKnownThisSession] = useState(0);

  // Construyo la queue una sola vez al entrar (no se reacomoda mientras
  // estudiás, para evitar saltar de carta en el medio del flip).
  const orderedCards = useMemo(() => {
    return cards.slice().sort((a, b) => {
      if (a.ease !== b.ease) return a.ease - b.ease;
      return (a.lastReview || 0) - (b.lastReview || 0);
    });
  }, [cards]);

  useEffect(() => {
    setQueue(orderedCards);
    setIdx(0);
    setRevealed(false);
  }, [orderedCards.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const card = queue[idx];
  const done = queue.length === 0 || idx >= queue.length;

  function advance(known: boolean) {
    if (!card) return;
    markReview(card.id, known);
    setReviewedThisSession((n) => n + 1);
    if (known) setKnownThisSession((n) => n + 1);
    setRevealed(false);
    setIdx((i) => i + 1);
  }

  return (
    <PageWrap>
      <PageHeader
        kicker="Estudio"
        title={deck.name}
        tagline="Pensá la respuesta. Tocá «Mostrar». Marcá si la sabías o necesitás repasar."
        icon={deck.icon}
        accent={deck.color}
      />

      <div className="flex items-center justify-between gap-3 mb-5">
        <Link to={backTo} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-white/[0.04] text-[12.5px] text-ink-muted hover:bg-white/[0.08] min-h-10">
          ← Volver al deck
        </Link>
        <div className="text-[12px] text-ink-dim">
          {done ? `${queue.length}/${queue.length}` : `${idx + 1}/${queue.length}`}
          {reviewedThisSession > 0 && ` · ✓ ${knownThisSession}`}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden mb-6">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: queue.length > 0 ? `${Math.min(100, (idx / queue.length) * 100)}%` : "0%",
            background: deck.color,
          }}
        />
      </div>

      {done ? (
        <article className="p-8 rounded-3xl bg-grad-surface border border-white/[0.06] text-center">
          <div className="text-[44px] mb-2">🎉</div>
          <h2 className="font-display font-bold text-[22px] tracking-tight mb-2">
            {queue.length === 0 ? "Deck vacío" : "Sesión completa"}
          </h2>
          <p className="text-[14px] text-ink-muted mb-5">
            {queue.length === 0
              ? "Agregá cartas al deck para poder estudiar."
              : `Conociste ${knownThisSession} de ${reviewedThisSession}. Las que marcaste para repasar aparecerán primero la próxima vez.`}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => {
                setIdx(0);
                setReviewedThisSession(0);
                setKnownThisSession(0);
                setRevealed(false);
              }}
              className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-grad-blue text-white text-[13px] font-semibold"
            >
              Repetir sesión
            </button>
            <Link to={backTo} className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-white/[0.05] border border-white/[0.08] text-ink text-[13px] font-medium">
              Volver al deck
            </Link>
          </div>
        </article>
      ) : card ? (
        <AnimatePresence mode="wait">
          <motion.article
            key={card.id + ":" + (revealed ? "back" : "front")}
            initial={{ opacity: 0, y: 8, rotateX: revealed ? -8 : 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -8, rotateX: revealed ? 8 : -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 sm:p-10 rounded-3xl bg-grad-surface border border-white/[0.08] min-h-[280px] flex flex-col"
            style={{ boxShadow: `inset 0 0 0 1px ${deck.color}33` }}
          >
            {!revealed ? (
              <>
                <div className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-3" style={{ color: deck.color }}>
                  Front
                </div>
                <h2 className="font-display font-extrabold text-[24px] sm:text-[32px] tracking-tight text-balance leading-tight flex-1">
                  {card.front}
                </h2>
                {card.hint && (
                  <p className="text-[12.5px] text-ink-dim italic mt-4">💡 {card.hint}</p>
                )}
                <button
                  onClick={() => setRevealed(true)}
                  className="mt-6 w-full sm:w-auto sm:self-start inline-flex items-center justify-center h-12 px-6 rounded-full bg-grad-blue text-white font-semibold text-[14px] shadow-glow-blue"
                >
                  Mostrar respuesta
                </button>
              </>
            ) : (
              <>
                <div className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-1" style={{ color: deck.color }}>
                  Back
                </div>
                <p className="text-[13px] text-ink-muted mb-2">{card.front}</p>
                <p className="text-[16px] sm:text-[18px] text-ink leading-relaxed flex-1">
                  {card.back}
                </p>
                {Array.isArray(card.tags) && card.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {card.tags.map((t, i) => (
                      <span key={i} className="chip">{t}</span>
                    ))}
                  </div>
                )}
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => advance(false)}
                    className="inline-flex items-center justify-center gap-2 h-12 rounded-full bg-danger/12 text-danger font-semibold text-[14px] border border-danger/30 hover:bg-danger/18"
                  >
                    🔄 Repasar
                  </button>
                  <button
                    onClick={() => advance(true)}
                    className="inline-flex items-center justify-center gap-2 h-12 rounded-full bg-success/15 text-success font-semibold text-[14px] border border-success/40 hover:bg-success/22"
                  >
                    ✓ Ya la sé
                  </button>
                </div>
              </>
            )}
          </motion.article>
        </AnimatePresence>
      ) : (
        <Callout tone="purple">Sin cartas para estudiar.</Callout>
      )}
    </PageWrap>
  );
}
