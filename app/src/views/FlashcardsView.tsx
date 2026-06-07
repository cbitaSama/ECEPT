import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageWrap from "@/components/ui/PageWrap";
import PageHeader from "@/components/ui/PageHeader";
import { useDecks, type Deck } from "@/lib/useDecks";
import { ensureSeedDecks } from "@/lib/seedDecks";

// ════════════════════════════════════════════════════════════════
// FlashcardsView — lista de decks (oficiales del sistema + custom).
// Boot: garantiza que los decks seed estén creados.
// CTA: "Nuevo deck" + cada card abre /flashcards/<id>.
// ════════════════════════════════════════════════════════════════

export default function FlashcardsView() {
  const { decks, cards, createDeck, addManyCards, deleteDeck } = useDecks();
  const [filter, setFilter] = useState<"all" | "official" | "user">("all");
  const [showCreate, setShowCreate] = useState(false);

  // Seed oficial al primer mount — idempotente
  useEffect(() => {
    const ids = decks.map((d) => d.id);
    ensureSeedDecks(ids, createDeck, addManyCards);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const visible = useMemo(
    () => decks.filter((d) => (filter === "all" ? true : d.ownership === filter)),
    [decks, filter]
  );

  function countCards(deckId: string) {
    return cards.filter((c) => c.deckId === deckId).length;
  }

  return (
    <PageWrap>
      <PageHeader
        kicker="Herramienta"
        title="Flashcards"
        tagline="Decks oficiales generados desde el contenido + los tuyos custom. Todo guardado en este dispositivo."
        icon="🎴"
        accent="#a78bfa"
      />

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Pill active={filter === "all"} onClick={() => setFilter("all")}>
          Todo · {decks.length}
        </Pill>
        <Pill active={filter === "official"} onClick={() => setFilter("official")}>
          ★ Oficiales
        </Pill>
        <Pill active={filter === "user"} onClick={() => setFilter("user")}>
          ✏️ Tuyos
        </Pill>
        <button
          onClick={() => setShowCreate(true)}
          className="ml-auto inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-grad-blue text-white font-semibold text-[12.5px] shadow-glow-blue min-h-10"
        >
          + Nuevo deck
        </button>
      </div>

      {showCreate && (
        <CreateDeckModal
          onClose={() => setShowCreate(false)}
          onCreate={(d) => {
            createDeck(d);
            setShowCreate(false);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {visible.map((d) => {
          const total = countCards(d.id);
          return (
            <article
              key={d.id}
              className="relative p-4 rounded-2xl bg-grad-surface border border-white/[0.06] group"
              style={{ boxShadow: `inset 0 0 0 1px ${d.color}33` }}
            >
              <Link to={`/flashcards/${d.id}`} className="block">
                <div className="flex items-start gap-3 mb-3">
                  <span
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] shrink-0"
                    style={{ background: `${d.color}1f`, border: `1px solid ${d.color}44` }}
                  >
                    {d.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-semibold text-[15.5px] tracking-tight" style={{ color: d.color }}>
                      {d.name}
                    </h3>
                    {d.description && (
                      <p className="text-[12.5px] text-ink-muted mt-0.5 line-clamp-2">{d.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[12px]">
                  <span className="chip" style={{ background: `${d.color}14`, borderColor: `${d.color}33`, color: d.color }}>
                    {total} cartas
                  </span>
                  <span className="chip">
                    {d.ownership === "official" ? "★ Oficial" : "✏️ Tuyo"}
                  </span>
                </div>
              </Link>
              <div className="mt-3 flex items-center gap-1.5">
                <Link
                  to={`/flashcards/${d.id}?mode=study`}
                  className="flex-1 inline-flex items-center justify-center h-10 rounded-full bg-white/[0.05] hover:bg-white/[0.08] text-[12.5px] font-medium text-ink min-h-10"
                >
                  🎴 Estudiar
                </Link>
                <Link
                  to={`/flashcards/${d.id}`}
                  className="inline-flex items-center justify-center h-10 px-3 rounded-full bg-white/[0.05] hover:bg-white/[0.08] text-[12.5px] text-ink-muted min-h-10"
                >
                  Ver
                </Link>
                {d.ownership === "user" && (
                  <button
                    onClick={() => {
                      if (confirm(`¿Borrar deck "${d.name}"?`)) deleteDeck(d.id);
                    }}
                    aria-label="Borrar deck"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full text-ink-dim hover:text-danger hover:bg-danger/8 min-h-10"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </article>
          );
        })}
        {visible.length === 0 && (
          <p className="md:col-span-2 text-center text-ink-dim py-10">Sin decks en esta vista.</p>
        )}
      </div>
    </PageWrap>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-3 h-9 rounded-full text-[12px] font-medium border min-h-9 transition ${
        active
          ? "bg-primary/15 border-primary-hi/40 text-primary-hi"
          : "bg-white/[0.03] border-white/[0.06] text-ink-muted hover:bg-white/[0.06]"
      }`}
    >
      {children}
    </button>
  );
}

function CreateDeckModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (d: Partial<Deck>) => void;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState("🎴");
  const [color, setColor] = useState("#a78bfa");

  const palette = ["#60a5fa", "#a78bfa", "#f472b6", "#34d399", "#fbbf24", "#fb923c", "#06b6d4", "#e879f9"];
  const icons = ["🎴", "🧠", "💊", "🩺", "🔬", "🦴", "🫀", "🧬", "📚", "⚡"];

  return (
    <div
      role="dialog"
      aria-modal
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md p-5 sm:p-6 rounded-3xl bg-grad-surface border border-white/[0.08] shadow-elev"
      >
        <h3 className="font-display font-bold text-[20px] tracking-tight mb-4">Nuevo deck</h3>
        <label className="block mb-3">
          <span className="text-[12px] uppercase tracking-wider text-ink-dim font-medium">Nombre</span>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Reuma extra · cardio repaso"
            className="mt-1 w-full h-11 rounded-xl bg-white/[0.04] border border-white/[0.06] px-3 text-[14px] outline-none focus:border-primary-hi/60"
          />
        </label>
        <label className="block mb-4">
          <span className="text-[12px] uppercase tracking-wider text-ink-dim font-medium">Descripción</span>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Opcional"
            rows={2}
            className="mt-1 w-full rounded-xl bg-white/[0.04] border border-white/[0.06] px-3 py-2 text-[13px] outline-none focus:border-primary-hi/60 resize-none"
          />
        </label>
        <div className="mb-4">
          <span className="text-[12px] uppercase tracking-wider text-ink-dim font-medium block mb-2">Icono</span>
          <div className="flex flex-wrap gap-1.5">
            {icons.map((i) => (
              <button
                key={i}
                onClick={() => setIcon(i)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-[20px] transition ${icon === i ? "bg-primary/15 ring-1 ring-primary-hi/50" : "bg-white/[0.03] hover:bg-white/[0.06]"}`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <span className="text-[12px] uppercase tracking-wider text-ink-dim font-medium block mb-2">Color</span>
          <div className="flex flex-wrap gap-1.5">
            {palette.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-9 h-9 rounded-full transition ${color === c ? "ring-2 ring-offset-2 ring-offset-bg-2" : ""}`}
                style={{ background: c, boxShadow: color === c ? `0 0 0 2px ${c}` : undefined }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-full bg-white/[0.04] text-ink-muted text-[13px] font-medium hover:bg-white/[0.08]"
          >
            Cancelar
          </button>
          <button
            disabled={!name.trim()}
            onClick={() => onCreate({ name: name.trim(), description: desc.trim() || undefined, icon, color, ownership: "user" })}
            className="flex-1 h-11 rounded-full bg-grad-blue text-white text-[13px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Crear deck
          </button>
        </div>
      </div>
    </div>
  );
}
