import { useMemo, useState } from "react";
import PageWrap from "@/components/ui/PageWrap";
import PageHeader from "@/components/ui/PageHeader";
import Bullet from "@/components/ui/Bullet";
// @ts-ignore
import { LAB_SECTIONS } from "@/data/labs";

// LAB_SECTIONS: [{id, label, icon, accent, subtitle, analytes: [{name, range, note, up[], down[]}]}]

export default function LabsModule() {
  const sections = LAB_SECTIONS as any[];
  const [active, setActive] = useState<string>(sections[0]?.id || "");
  const [q, setQ] = useState("");

  const current = sections.find((s) => s.id === active);

  const filtered = useMemo(() => {
    if (!current) return [];
    const term = q.trim().toLowerCase();
    if (!term) return current.analytes || [];
    return (current.analytes || []).filter((a: any) =>
      (a.name + " " + (a.note || "")).toLowerCase().includes(term)
    );
  }, [current, q]);

  return (
    <PageWrap>
      <PageHeader
        kicker="Herramienta"
        title="Laboratorio"
        tagline="Valores de referencia organizados por sistema. Cada analito con rango, qué lo eleva y qué lo baja."
        icon="🧪"
        accent="#34d399"
      />

      <div className="sticky top-16 z-10 -mx-4 px-4 sm:mx-0 sm:px-0 py-2 bg-bg/85 backdrop-blur-xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 h-10 rounded-full text-[12px] font-medium transition border"
                style={{
                  background: isActive ? `${s.accent}1c` : "rgba(255,255,255,0.03)",
                  borderColor: isActive ? `${s.accent}55` : "rgba(255,255,255,0.06)",
                  color: isActive ? s.accent : "#94a3b8",
                }}
              >
                <span aria-hidden>{s.icon}</span>
                <span className="whitespace-nowrap">{s.label}</span>
                <span className="opacity-60 text-[10px]">{s.analytes?.length || 0}</span>
              </button>
            );
          })}
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filtrar analito dentro de la sección…"
          className="mt-2 w-full h-10 rounded-full bg-white/[0.04] border border-white/[0.06] px-4 text-[13px] placeholder:text-ink-dim outline-none focus:border-primary-hi/60"
        />
      </div>

      {current && (
        <div className="mt-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-[28px]" aria-hidden>{current.icon}</span>
            <div>
              <h2 className="font-display font-bold text-[20px] tracking-tight" style={{ color: current.accent }}>
                {current.label}
              </h2>
              {current.subtitle && <p className="text-[13px] text-ink-muted">{current.subtitle}</p>}
            </div>
          </div>

          <div className="space-y-2.5">
            {filtered.map((a: any, i: number) => (
              <Analyte key={i} analyte={a} accent={current.accent} />
            ))}
            {filtered.length === 0 && <p className="text-center text-ink-dim py-6">Sin coincidencias.</p>}
          </div>
        </div>
      )}
    </PageWrap>
  );
}

function Analyte({ analyte: a, accent }: { analyte: any; accent: string }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="rounded-2xl bg-grad-surface border border-white/[0.06] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left p-4 flex items-center justify-between gap-4 min-h-14"
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-semibold text-[15px] tracking-tight">{a.name}</h3>
          <div className="text-[12px] mt-0.5">
            <span className="font-mono font-semibold" style={{ color: accent }}>{a.range}</span>
          </div>
        </div>
        <span aria-hidden className={`w-6 h-6 inline-flex items-center justify-center text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="border-t border-white/[0.06] p-4 pt-4 space-y-3 text-[13.5px]">
          {a.note && (
            <p className="text-ink leading-relaxed" dangerouslySetInnerHTML={{ __html: a.note }} />
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            {Array.isArray(a.up) && a.up.length > 0 && (
              <div className="p-3 rounded-xl bg-danger/8 border border-danger/20">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-danger mb-1.5">↑ Aumentado</div>
                <Bullet items={a.up} accent="#ef4444" />
              </div>
            )}
            {Array.isArray(a.down) && a.down.length > 0 && (
              <div className="p-3 rounded-xl bg-primary/8 border border-primary/20">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-primary-hi mb-1.5">↓ Disminuido</div>
                <Bullet items={a.down} accent="#60a5fa" />
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
