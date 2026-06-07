import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams, Navigate } from "react-router-dom";
import PageWrap from "@/components/ui/PageWrap";
import PageHeader from "@/components/ui/PageHeader";
import Callout from "@/components/ui/Callout";
import { useDecks, type Card } from "@/lib/useDecks";
import FlashcardStudy from "@/components/medical/FlashcardStudy";

// ════════════════════════════════════════════════════════════════
// FlashcardDeckView — detalle de un deck:
// - lista de cartas con front/back y nivel de ease
// - editor inline (agregar / editar / borrar)
// - modo estudio inline (?mode=study)
// ════════════════════════════════════════════════════════════════

export default function FlashcardDeckView() {
  const { deckId = "" } = useParams();
  const [params] = useSearchParams();
  const studyMode = params.get("mode") === "study";

  const { deckById, cardsForDeck, addCard, updateCard, deleteCard, deleteDeck, updateDeck } = useDecks();

  const deck = deckById(deckId);
  const cards = useMemo(() => cardsForDeck(deckId), [deckId, cardsForDeck]);

  const [editing, setEditing] = useState<Card | "new" | null>(null);
  const [q, setQ] = useState("");

  if (!deck) {
    return <Navigate to="/flashcards" replace />;
  }

  const filtered = q.trim()
    ? cards.filter((c) => (c.front + " " + c.back).toLowerCase().includes(q.trim().toLowerCase()))
    : cards;

  if (studyMode) {
    return (
      <FlashcardStudy deckId={deck.id} deck={deck} cards={cards} backTo={`/flashcards/${deck.id}`} />
    );
  }

  return (
    <PageWrap>
      <PageHeader
        kicker={deck.ownership === "official" ? "Deck oficial" : "Tu deck"}
        title={deck.name}
        tagline={deck.description}
        icon={deck.icon}
        accent={deck.color}
      />

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Link
          to={`/flashcards/${deck.id}?mode=study`}
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-grad-blue text-white text-[13px] font-semibold shadow-glow-blue min-h-10"
        >
          🎴 Estudiar {cards.length} cartas
        </Link>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-white/[0.05] border border-white/[0.08] text-ink text-[13px] font-medium hover:bg-white/[0.08] min-h-10"
        >
          + Agregar carta
        </button>
        {deck.ownership === "user" && (
          <button
            onClick={() => {
              const name = prompt("Nuevo nombre", deck.name);
              if (name && name.trim()) updateDeck(deck.id, { name: name.trim() });
            }}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-white/[0.03] border border-white/[0.05] text-ink-muted text-[12.5px] hover:bg-white/[0.06] min-h-10"
          >
            Renombrar
          </button>
        )}
        {deck.ownership === "user" && (
          <button
            onClick={() => {
              if (confirm(`¿Borrar deck "${deck.name}" y todas sus cartas?`)) {
                deleteDeck(deck.id);
                window.location.href = "/flashcards";
              }
            }}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full text-danger text-[12.5px] hover:bg-danger/8 min-h-10"
          >
            Borrar deck
          </button>
        )}
        <Link to="/flashcards" className="ml-auto text-[12px] text-ink-dim hover:text-ink-muted">
          ← Todos los decks
        </Link>
      </div>

      {cards.length > 6 && (
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filtrar cartas…"
          className="w-full h-10 rounded-full bg-white/[0.04] border border-white/[0.06] px-4 text-[13px] placeholder:text-ink-dim outline-none focus:border-primary-hi/60 mb-5"
        />
      )}

      {editing && (
        <CardEditor
          deckColor={deck.color}
          card={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSave={(data) => {
            if (editing === "new") {
              addCard(deck.id, data);
            } else {
              updateCard(editing.id, data);
            }
            setEditing(null);
          }}
        />
      )}

      {cards.length === 0 ? (
        <Callout tone="purple" title="Deck vacío">
          Tocá «Agregar carta» para empezar. Cada carta tiene front + back, opcionalmente un hint y
          tags.
        </Callout>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <CardRow
              key={c.id}
              card={c}
              color={deck.color}
              editable={deck.ownership === "user"}
              onEdit={() => setEditing(c)}
              onDelete={() => {
                if (confirm("¿Borrar esta carta?")) deleteCard(c.id);
              }}
            />
          ))}
          {filtered.length === 0 && <p className="text-center text-ink-dim py-6">Sin resultados.</p>}
        </div>
      )}
    </PageWrap>
  );
}

function CardRow({
  card,
  color,
  editable,
  onEdit,
  onDelete,
}: {
  card: Card;
  color: string;
  editable: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <article className="rounded-2xl bg-grad-surface border border-white/[0.06] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left p-4 flex items-center gap-3 min-h-14"
      >
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0"
          style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}
          title={`Nivel ${card.ease}/3`}
        >
          {card.ease}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-medium text-ink truncate">{card.front}</p>
          {!open && card.back && (
            <p className="text-[12.5px] text-ink-dim truncate mt-0.5">{card.back}</p>
          )}
        </div>
        <span aria-hidden className={`text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="border-t border-white/[0.06] p-4 space-y-2 text-[13.5px]">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-ink-dim font-medium mb-0.5">Atrás</div>
            <p className="text-ink leading-relaxed">{card.back}</p>
          </div>
          {card.hint && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-ink-dim font-medium mb-0.5">Hint</div>
              <p className="text-ink-muted leading-relaxed">{card.hint}</p>
            </div>
          )}
          {Array.isArray(card.tags) && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {card.tags.map((t, i) => (
                <span key={i} className="chip">{t}</span>
              ))}
            </div>
          )}
          <div className="text-[11px] text-ink-dim pt-1">
            Reviews: {card.reviewCount} · Última: {card.lastReview ? new Date(card.lastReview).toLocaleDateString() : "—"}
          </div>
          {editable && (
            <div className="flex gap-2 pt-2">
              <button onClick={onEdit} className="inline-flex items-center justify-center h-9 px-3 rounded-full bg-white/[0.05] text-[12px] text-ink hover:bg-white/[0.08]">
                ✏️ Editar
              </button>
              <button onClick={onDelete} className="inline-flex items-center justify-center h-9 px-3 rounded-full text-[12px] text-danger hover:bg-danger/8">
                🗑️ Borrar
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function CardEditor({
  deckColor,
  card,
  onCancel,
  onSave,
}: {
  deckColor: string;
  card: Card | null;
  onCancel: () => void;
  onSave: (data: { front: string; back: string; hint?: string; tags: string[] }) => void;
}) {
  const [front, setFront] = useState(card?.front || "");
  const [back, setBack] = useState(card?.back || "");
  const [hint, setHint] = useState(card?.hint || "");
  const [tagsRaw, setTagsRaw] = useState((card?.tags || []).join(", "));

  return (
    <div className="mb-5 p-4 rounded-2xl bg-grad-surface border border-white/[0.08]" style={{ boxShadow: `inset 0 0 0 1px ${deckColor}44` }}>
      <h3 className="font-display font-semibold text-[15.5px] tracking-tight mb-3" style={{ color: deckColor }}>
        {card ? "Editar carta" : "Nueva carta"}
      </h3>
      <label className="block mb-2.5">
        <span className="text-[11px] uppercase tracking-wider text-ink-dim font-medium">Front</span>
        <textarea
          autoFocus
          value={front}
          onChange={(e) => setFront(e.target.value)}
          rows={2}
          placeholder="Ej. ¿Qué es Anti-CCP?"
          className="mt-1 w-full rounded-xl bg-white/[0.04] border border-white/[0.06] px-3 py-2 text-[14px] outline-none focus:border-primary-hi/60 resize-none"
        />
      </label>
      <label className="block mb-2.5">
        <span className="text-[11px] uppercase tracking-wider text-ink-dim font-medium">Back</span>
        <textarea
          value={back}
          onChange={(e) => setBack(e.target.value)}
          rows={3}
          placeholder="La respuesta o explicación"
          className="mt-1 w-full rounded-xl bg-white/[0.04] border border-white/[0.06] px-3 py-2 text-[14px] outline-none focus:border-primary-hi/60 resize-none"
        />
      </label>
      <label className="block mb-2.5">
        <span className="text-[11px] uppercase tracking-wider text-ink-dim font-medium">Hint (opcional)</span>
        <input
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="Pista corta"
          className="mt-1 w-full h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] px-3 text-[13px] outline-none focus:border-primary-hi/60"
        />
      </label>
      <label className="block mb-3">
        <span className="text-[11px] uppercase tracking-wider text-ink-dim font-medium">Tags (separados por coma)</span>
        <input
          value={tagsRaw}
          onChange={(e) => setTagsRaw(e.target.value)}
          placeholder="reuma, AR, criterios"
          className="mt-1 w-full h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] px-3 text-[13px] outline-none focus:border-primary-hi/60"
        />
      </label>
      <div className="flex items-center gap-2">
        <button onClick={onCancel} className="flex-1 h-11 rounded-full bg-white/[0.04] text-ink-muted text-[13px] hover:bg-white/[0.08]">
          Cancelar
        </button>
        <button
          disabled={!front.trim() || !back.trim()}
          onClick={() =>
            onSave({
              front: front.trim(),
              back: back.trim(),
              hint: hint.trim() || undefined,
              tags: tagsRaw
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          className="flex-1 h-11 rounded-full bg-grad-blue text-white text-[13px] font-semibold disabled:opacity-40"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
