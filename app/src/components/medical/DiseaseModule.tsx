import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Disease, ModuleSection } from "@/types";
import DiseaseCard from "./DiseaseCard";
import PageWrap from "@/components/ui/PageWrap";
import PageHeader from "@/components/ui/PageHeader";

interface DiseaseModuleProps {
  title: string;
  tagline?: string;
  icon?: string;
  accent?: string;
  kicker?: string;
  sections: ModuleSection[];
  diseases: Disease[];
  /** Identifier para favoritos (ej "reuma"). Default: "disease". */
  moduleId?: string;
}

// ════════════════════════════════════════════════════════════════
// Módulo genérico tipo "reuma": agrupa enfermedades por sección con
// filtro/búsqueda dentro del módulo. Cualquier módulo con el shape
// REUMA_SECS + RD lo puede reutilizar tal cual.
// ════════════════════════════════════════════════════════════════
export default function DiseaseModule({
  title,
  tagline,
  icon,
  accent,
  kicker,
  sections,
  diseases,
  moduleId = "disease",
}: DiseaseModuleProps) {
  const [active, setActive] = useState<string | "all">("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return diseases.filter((d) => {
      if (active !== "all" && d.s !== active) return false;
      if (!term) return true;
      const hay = [d.n, d.cc?.t, ...(d.cc?.p || []), ...(d.pe || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(term);
    });
  }, [active, q, diseases]);

  const grouped = useMemo(() => {
    if (active !== "all") {
      return [{ section: sections.find((s) => s.id === active)!, diseases: filtered }];
    }
    return sections
      .map((s) => ({ section: s, diseases: filtered.filter((d) => d.s === s.id) }))
      .filter((g) => g.diseases.length > 0);
  }, [filtered, sections, active]);

  return (
    <PageWrap>
      <PageHeader title={title} tagline={tagline} icon={icon} accent={accent} kicker={kicker} />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Link
          to="/estudio"
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-white/[0.05] border border-white/[0.08] text-[12.5px] font-medium text-ink hover:bg-white/[0.08] transition min-h-10"
        >
          🎴 Modo estudio
        </Link>
        <Link
          to="/estudio?favs=1"
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-white/[0.05] border border-white/[0.08] text-[12.5px] font-medium text-ink hover:bg-white/[0.08] transition min-h-10"
        >
          ⭐ Estudiar favoritos
        </Link>
        <span className="ml-auto text-[12px] text-ink-dim">{diseases.length} enfermedades</span>
      </div>

      <div className="sticky top-16 z-10 -mx-4 px-4 sm:mx-0 sm:px-0 py-2 bg-bg/85 backdrop-blur-xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Pill active={active === "all"} onClick={() => setActive("all")}>
            Todo
            <span className="ml-1.5 opacity-60">{diseases.length}</span>
          </Pill>
          {sections.map((s) => {
            const count = diseases.filter((d) => d.s === s.id).length;
            return (
              <Pill key={s.id} active={active === s.id} onClick={() => setActive(s.id)}>
                <span aria-hidden className="mr-1.5">{s.i}</span>
                {s.n}
                <span className="ml-1.5 opacity-60">{count}</span>
              </Pill>
            );
          })}
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filtrar dentro del módulo…"
          className="mt-2 w-full h-10 rounded-full bg-white/[0.04] border border-white/[0.06] px-4 text-[13px] placeholder:text-ink-dim outline-none focus:border-primary-hi/60"
        />
      </div>

      <div className="mt-6 space-y-10">
        {grouped.length === 0 ? (
          <p className="text-center text-ink-dim text-[14px] py-12">Sin resultados.</p>
        ) : (
          grouped.map((g) => (
            <section key={g.section.id}>
              <div className="flex items-baseline gap-2 mb-3">
                <h2 className="font-display font-bold text-[18px] sm:text-[20px] tracking-tight">
                  <span aria-hidden className="mr-2">{g.section.i}</span>
                  {g.section.n}
                </h2>
                <span className="text-[12px] text-ink-dim">{g.section.d}</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {g.diseases.map((d) => (
                  <DiseaseCard key={d.id} disease={d} moduleId={moduleId} />
                ))}
              </div>
            </section>
          ))
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
      className={`shrink-0 inline-flex items-center px-3 h-9 rounded-full text-[12px] font-medium transition min-h-9 ${
        active
          ? "bg-primary/15 border border-primary-hi/40 text-primary-hi"
          : "bg-white/[0.03] border border-white/[0.06] text-ink-muted hover:bg-white/[0.06]"
      }`}
    >
      {children}
    </button>
  );
}
