import { useMemo, useState } from "react";
import PageWrap from "@/components/ui/PageWrap";
import PageHeader from "@/components/ui/PageHeader";
import Bullet from "@/components/ui/Bullet";
// @ts-ignore
import { VOCAB_CATS, VOCAB_TIPO, VOCAB_VOC } from "@/data/vocabulario";

// VOCAB_VOC: [{cat, t:"p"|"s"|"w", tx, or, sig, ej[], tip?, piece?}]

export default function VocabularioModule() {
  const cats = VOCAB_CATS as any[];
  const voc = VOCAB_VOC as any[];
  const [cat, setCat] = useState<string>(cats[0]?.id || "");
  const [tipo, setTipo] = useState<"all" | "p" | "s" | "w">("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return voc.filter((v) => {
      if (cat && v.cat !== cat) return false;
      if (tipo !== "all" && v.t !== tipo) return false;
      if (!term) return true;
      const hay = [v.tx, v.or, v.sig, ...(v.ej || []), v.tip].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(term);
    });
  }, [cat, tipo, q, voc]);

  return (
    <PageWrap>
      <PageHeader
        kicker="Herramienta"
        title="Vocabulario Médico"
        tagline="Prefijos, sufijos y términos por categoría. Cada entrada con etimología, significado, ejemplos y truco mnemónico."
        icon="🔤"
        accent="#fbbf24"
      />

      <div className="sticky top-16 z-10 py-2 bg-bg/85 backdrop-blur-xl -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {cats.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 h-10 rounded-full text-[12px] font-medium transition border"
              style={{
                background: cat === c.id ? `${c.c}1c` : "rgba(255,255,255,0.03)",
                borderColor: cat === c.id ? `${c.c}55` : "rgba(255,255,255,0.06)",
                color: cat === c.id ? c.c : "#94a3b8",
              }}
            >
              <span aria-hidden>{c.i}</span>
              <span className="whitespace-nowrap">{c.n}</span>
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] rounded-full p-0.5">
            {(["all", "p", "s", "w"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTipo(t)}
                className="px-3 h-8 rounded-full text-[12px] font-medium transition"
                style={{
                  background: tipo === t ? "rgba(96,165,250,0.18)" : "transparent",
                  color: tipo === t ? "#60a5fa" : "#94a3b8",
                }}
              >
                {t === "all" ? "Todo" : (VOCAB_TIPO as any)[t]?.l}
              </button>
            ))}
          </div>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar…"
            className="flex-1 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] px-4 text-[13px] placeholder:text-ink-dim outline-none focus:border-primary-hi/60"
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((v, i) => (
          <VocCard key={i} entry={v} />
        ))}
        {filtered.length === 0 && (
          <p className="md:col-span-2 text-center text-ink-dim py-10">Sin resultados.</p>
        )}
      </div>
    </PageWrap>
  );
}

function VocCard({ entry: v }: { entry: any }) {
  const tipoMeta = (VOCAB_TIPO as any)[v.t] || { l: "?", c: "#94a3b8" };
  return (
    <article className="p-4 rounded-2xl bg-grad-surface border border-white/[0.06]">
      <header className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-display font-semibold text-[15.5px] tracking-tight">{v.tx}</h3>
        <span
          className="shrink-0 inline-flex px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold tracking-wider"
          style={{ background: `${tipoMeta.c}1c`, color: tipoMeta.c, border: `1px solid ${tipoMeta.c}44` }}
        >
          {tipoMeta.l}
        </span>
      </header>
      {v.or && <p className="text-[12px] text-ink-dim italic mb-2">{v.or}</p>}
      {v.sig && <p className="text-[13.5px] text-ink leading-relaxed mb-2.5">{v.sig}</p>}
      {Array.isArray(v.ej) && v.ej.length > 0 && (
        <div className="mb-2.5">
          <div className="text-[10px] uppercase tracking-wider text-ink-dim font-medium mb-1">Ejemplos</div>
          <Bullet items={v.ej} accent={tipoMeta.c} />
        </div>
      )}
      {v.tip && (
        <p className="text-[12.5px] text-ink-muted bg-white/[0.04] border border-white/[0.06] rounded-lg p-2.5">
          {v.tip}
        </p>
      )}
    </article>
  );
}
