import { useMemo, useState } from "react";
import PageWrap from "@/components/ui/PageWrap";
import PageHeader from "@/components/ui/PageHeader";
// @ts-ignore
import { TC, TR } from "@/data/triadas";

// TC: categorías [{id,n,c}]
// TR: tríadas [{ct, nm, en, cp[], cl, ic, dt}]

export default function TriadasModule() {
  const [cat, setCat] = useState<string | "all">("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (TR as any[]).filter((t) => {
      if (cat !== "all" && t.ct !== cat) return false;
      if (!term) return true;
      const hay = [t.nm, t.en, t.dt, ...(t.cp || [])].join(" ").toLowerCase();
      return hay.includes(term);
    });
  }, [cat, q]);

  return (
    <PageWrap>
      <PageHeader
        kicker="Herramienta"
        title="Tríadas y Pirámides"
        tagline="Combos clínicos clásicos. Cada tríada con su entidad, componentes y nota clave de examen."
        icon="🔺"
        accent="#e879f9"
      />

      <div className="sticky top-16 z-10 py-2 bg-bg/85 backdrop-blur-xl -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Pill active={cat === "all"} onClick={() => setCat("all")} color="#94a3b8">
            Todo · {TR.length}
          </Pill>
          {(TC as any[]).map((c) => {
            const count = (TR as any[]).filter((t) => t.ct === c.id).length;
            if (count === 0) return null;
            return (
              <Pill key={c.id} active={cat === c.id} onClick={() => setCat(c.id)} color={c.c}>
                {c.n} · {count}
              </Pill>
            );
          })}
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar tríada…"
          className="mt-2 w-full h-10 rounded-full bg-white/[0.04] border border-white/[0.06] px-4 text-[13px] placeholder:text-ink-dim outline-none focus:border-primary-hi/60"
        />
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((t: any, i: number) => (
          <article
            key={i}
            className="p-5 rounded-2xl bg-grad-surface border border-white/[0.06] overflow-hidden"
            style={{ boxShadow: `inset 0 0 0 1px ${t.cl}22` }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-[24px]" aria-hidden>{t.ic || "🔺"}</span>
              <div className="min-w-0">
                <h3 className="font-display font-semibold text-[16px] tracking-tight truncate">{t.nm}</h3>
                <p className="text-[12px]" style={{ color: t.cl }}>{t.en}</p>
              </div>
            </div>
            <ul className="space-y-1 mb-3">
              {(t.cp || []).map((p: string, k: number) => (
                <li key={k} className="flex items-start gap-2 text-[13.5px] text-ink leading-relaxed">
                  <span
                    className="shrink-0 w-5 h-5 mt-0.5 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: `${t.cl}26`, color: t.cl }}
                  >
                    {k + 1}
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            {t.dt && (
              <div className="text-[12.5px] text-ink-muted leading-relaxed border-t border-white/[0.05] pt-2.5 mt-2">
                <span className="font-semibold text-ink-muted">Pista:</span> {t.dt}
              </div>
            )}
          </article>
        ))}
        {filtered.length === 0 && <p className="text-center text-ink-dim py-10">Sin resultados.</p>}
      </div>
    </PageWrap>
  );
}

function Pill({
  active,
  onClick,
  color,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 inline-flex items-center px-3 h-9 rounded-full text-[12px] font-medium transition min-h-9 border"
      style={{
        background: active ? `${color}1c` : "rgba(255,255,255,0.03)",
        borderColor: active ? `${color}55` : "rgba(255,255,255,0.06)",
        color: active ? color : "#94a3b8",
      }}
    >
      {children}
    </button>
  );
}
