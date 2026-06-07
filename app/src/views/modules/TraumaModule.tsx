import { useMemo, useState } from "react";
import PageWrap from "@/components/ui/PageWrap";
import PageHeader from "@/components/ui/PageHeader";
import Callout from "@/components/ui/Callout";
import { GlasgowCalculator, ParklandCalculator, ETTCalculator } from "@/components/medical/Calculators";
// @ts-ignore
import { TRAUMA_TOPICS, TRAUMA_HUB, TRAUMA_SECCIONES, TRAUMA_ETT, TRAUMA_ABCD, TRAUMA_LETHAL } from "@/data/trauma";

// TRAUMA_SECCIONES: [{id, topic, title, bloques: [{k: "p"|"h3"|"list"|"table"|"callout"|"pearl"|"danger"|"trap"|"cards"|"widget"|"link", ...}]}]
// TRAUMA_TOPICS: [{id, num, chip, title, accent, desc, chips}]

export default function TraumaModule() {
  const topics = TRAUMA_TOPICS as any[];
  const secciones = TRAUMA_SECCIONES as any[];
  const [topic, setTopic] = useState<string>(topics[0]?.id || "gen");

  const visibles = useMemo(() => secciones.filter((s) => s.topic === topic), [secciones, topic]);
  const t = topics.find((x) => x.id === topic);

  return (
    <PageWrap>
      <PageHeader
        kicker={TRAUMA_HUB?.eyebrow || "Trauma · Unidad 1"}
        title={TRAUMA_HUB?.title || "Trauma"}
        tagline={TRAUMA_HUB?.sub}
        icon="🩹"
        accent="#fb923c"
      />

      {Array.isArray(TRAUMA_HUB?.stats) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {TRAUMA_HUB.stats.map((s: any, i: number) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] text-[12px] text-ink-muted">
              <span>{s.ico}</span>{s.label}
            </span>
          ))}
        </div>
      )}

      <div className="sticky top-16 z-10 py-2 bg-bg/85 backdrop-blur-xl -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {topics.map((tp) => {
            const isActive = topic === tp.id;
            return (
              <button
                key={tp.id}
                onClick={() => setTopic(tp.id)}
                className="shrink-0 inline-flex items-center gap-2 px-3 h-10 rounded-full text-[12px] font-medium transition border"
                style={{
                  background: isActive ? `${tp.accent}1c` : "rgba(255,255,255,0.03)",
                  borderColor: isActive ? `${tp.accent}55` : "rgba(255,255,255,0.06)",
                  color: isActive ? tp.accent : "#94a3b8",
                }}
              >
                <span className="font-mono text-[10px] opacity-70">{tp.num}</span>
                <span className="whitespace-nowrap">{tp.chip}</span>
              </button>
            );
          })}
        </div>
      </div>

      {t && (
        <div className="mb-6 p-4 rounded-2xl bg-grad-surface border border-white/[0.06]" style={{ borderColor: `${t.accent}33` }}>
          <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: t.accent }}>
            {t.chip}
          </div>
          <h2 className="font-display font-bold text-[22px] tracking-tight mb-2">{t.title}</h2>
          {t.desc && <p className="text-[14px] text-ink-muted leading-relaxed">{t.desc}</p>}
          {Array.isArray(t.chips) && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {t.chips.map((c: string, i: number) => (
                <span key={i} className="inline-flex px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] text-ink-muted">{c}</span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="space-y-6">
        {visibles.map((s: any) => (
          <article key={s.id} className="p-5 rounded-2xl bg-grad-surface border border-white/[0.06]">
            <h3 className="font-display font-semibold text-[18px] tracking-tight mb-4" style={{ color: t?.accent || "#60a5fa" }}>
              {s.title}
            </h3>
            <div className="space-y-3">
              {(s.bloques || []).map((b: any, i: number) => (
                <Bloque key={i} bloque={b} />
              ))}
            </div>
          </article>
        ))}

        {visibles.length === 0 && (
          <Callout tone="blue">
            Esta sección está en construcción para esta unidad. El contenido se irá completando con
            cada repaso.
          </Callout>
        )}
      </div>
    </PageWrap>
  );
}

// Renderer para cada bloque trauma — soporta los 11 tipos definidos.
function Bloque({ bloque: b }: { bloque: any }) {
  switch (b.k) {
    case "p":
      return <p className="text-[14px] text-ink leading-relaxed" dangerouslySetInnerHTML={{ __html: b.html || b.texto || "" }} />;
    case "h3":
      return <h4 className="font-display font-semibold text-[15px] tracking-tight mt-3 text-ink">{b.text || b.html}</h4>;
    case "list":
      return (
        <ul className={b.ordered ? "list-decimal pl-5 space-y-1" : "space-y-1.5"}>
          {(b.items || []).map((it: string, i: number) => (
            <li key={i} className="text-[13.5px] text-ink leading-relaxed flex items-start gap-2">
              {!b.ordered && <span aria-hidden className="shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-primary-hi" />}
              <span dangerouslySetInnerHTML={{ __html: it }} />
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
          <table className="w-full text-[13px]">
            {b.headers && (
              <thead className="bg-white/[0.04]">
                <tr>
                  {b.headers.map((h: string, i: number) => (
                    <th key={i} className="text-left p-2.5 font-semibold text-ink-muted">
                      <span dangerouslySetInnerHTML={{ __html: h }} />
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {(b.rows || []).map((row: string[], i: number) => (
                <tr key={i} className={`border-t border-white/[0.05] ${b.hi?.includes(i) ? "bg-warning/5" : ""}`}>
                  {row.map((cell, j) => (
                    <td key={j} className="p-2.5 text-ink leading-relaxed">
                      <span dangerouslySetInnerHTML={{ __html: cell }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout":
      return (
        <Callout tone={b.tone} title={b.title} icon={b.ico}>
          {b.html ? (
            <span dangerouslySetInnerHTML={{ __html: b.html }} />
          ) : Array.isArray(b.items) ? (
            <ul className="space-y-1 mt-1">
              {b.items.map((it: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="opacity-60 mt-1">•</span>
                  <span dangerouslySetInnerHTML={{ __html: it }} />
                </li>
              ))}
            </ul>
          ) : (
            b.texto
          )}
        </Callout>
      );
    case "pearl":
      return (
        <Callout tone="orange" icon={b.ico || "💡"} title="Perla">
          <span dangerouslySetInnerHTML={{ __html: b.html || b.texto || "" }} />
        </Callout>
      );
    case "danger":
      return (
        <Callout tone="red" icon={b.ico || "🚨"} title="Crítico">
          <span dangerouslySetInnerHTML={{ __html: b.html || b.texto || "" }} />
        </Callout>
      );
    case "trap":
      return (
        <Callout tone="yellow" icon={b.ico || "⚠️"} title="Trampa de examen">
          <span dangerouslySetInnerHTML={{ __html: b.html || b.texto || "" }} />
        </Callout>
      );
    case "cards":
      return (
        <div className="grid sm:grid-cols-2 gap-2.5">
          {(b.items || []).map((c: any, i: number) => (
            <article key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              {(c.title || c.t) && <h5 className="font-semibold text-[13.5px] mb-1 text-ink">{c.title || c.t}</h5>}
              {(c.desc || c.html) && (
                <p className="text-[12.5px] text-ink-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: c.desc || c.html }} />
              )}
              {Array.isArray(c.items) && (
                <ul className="mt-1.5 space-y-1">
                  {c.items.map((it: any, j: number) => (
                    <li key={j} className="text-[12.5px] text-ink-muted flex items-start gap-2">
                      <span aria-hidden>•</span>
                      <span dangerouslySetInnerHTML={{ __html: typeof it === "string" ? it : it.text || JSON.stringify(it) }} />
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      );
    case "widget":
      if (b.name === "glasgow") return <GlasgowCalculator />;
      if (b.name === "parkland") return <ParklandCalculator />;
      if (b.name === "ett") return <ETTCalculator />;
      // Widget no implementado todavía — banner sutil
      return (
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[12.5px] text-ink-muted">
          <strong className="text-ink">Widget: {b.name}</strong> — referencia visual disponible en el módulo correspondiente del bundle legacy.
        </div>
      );
    case "link":
      return (
        <a href={`#${b.to || b.jump}`} className="inline-flex items-center gap-1.5 text-[13px] text-primary-hi hover:underline">
          → {b.label}
        </a>
      );
    case "kv":
      return (
        <dl className="space-y-1 text-[13px]">
          {(b.items || []).map((it: any, i: number) => (
            <div key={i} className="flex gap-2">
              <dt className="text-ink-dim font-medium">{it.k}:</dt>
              <dd className="text-ink leading-relaxed">{it.v}</dd>
            </div>
          ))}
        </dl>
      );
    case "subtitulo":
      return <h4 className="font-display font-semibold text-[15px] tracking-tight mt-3">{b.texto || b.text}</h4>;
    case "parrafo":
      return <p className="text-[14px] text-ink leading-relaxed">{b.texto}</p>;
    default:
      return null;
  }
}
