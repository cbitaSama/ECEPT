import { Link } from "react-router-dom";
import PageWrap from "@/components/ui/PageWrap";
import PageHeader from "@/components/ui/PageHeader";
import { MODULES } from "@/modules/manifest";
// @ts-ignore
import { LINKS, MODS } from "@/data/links";

// LINKS: {key: {vista, label, materia}}
// MODS: lista de módulos (legacy) — incluye flashcards/chatbot que en v1 NO existen.

export default function LinksModule() {
  const links = LINKS as Record<string, any>;
  // Mapeo legacy vista → slug actual
  const VISTA_TO_SLUG: Record<string, string> = {
    reuma: "reuma",
    inmuno: "inmuno",
    cir_ing: "anatomia",
    anatomia: "anatomia",
    general: "generalidades",
    labs: "labs",
    fisio: "receptores",
    epid: "epidemiologia",
    cir_quem: "emergencias",
    triadas: "triadas",
    "trauma-u1": "trauma",
    cirugia: "cirugia",
    mediadores: "mediadores",
    salud_mental: "salud-mental",
    vocabulario: "vocabulario",
  };

  return (
    <PageWrap>
      <PageHeader
        kicker="Herramienta"
        title="Conectores"
        tagline="Enlaces cruzados entre módulos. Útil cuando estás en un tema y querés saltar al concepto relacionado."
        icon="🔗"
        accent="#60a5fa"
      />

      <section className="mb-10">
        <h2 className="font-display font-bold text-[18px] tracking-tight mb-3">Enlaces curados</h2>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {Object.entries(links).map(([key, l]) => {
            const slug = VISTA_TO_SLUG[l.vista];
            const mod = slug ? MODULES.find((m) => m.slug === slug) : null;
            const dest = mod ? `/modulo/${mod.slug}` : "/";
            return (
              <Link
                key={key}
                to={dest}
                className="p-4 rounded-2xl bg-grad-surface border border-white/[0.06] hover:border-white/[0.12] transition group"
              >
                <div className="text-[11px] uppercase tracking-wider text-ink-dim font-medium mb-1">
                  {l.materia}
                </div>
                <div className="font-display font-semibold text-[15px] tracking-tight group-hover:text-primary-hi transition">
                  {l.label} <span className="text-ink-muted">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-display font-bold text-[18px] tracking-tight mb-3">Vista clásica (MODS legacy)</h2>
        <p className="text-[13px] text-ink-dim mb-4">
          Esta era la lista de módulos del ECEPT antiguo. Se mantiene como referencia histórica.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {(MODS as any[]).map((m: any) => {
            const slug = VISTA_TO_SLUG[m.id];
            const active = slug && MODULES.some((mm) => mm.slug === slug);
            return (
              <div
                key={m.id}
                className={`p-3 rounded-2xl border ${active ? "bg-grad-surface border-white/[0.06]" : "bg-white/[0.02] border-white/[0.04] opacity-60"}`}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="text-[20px]">{m.ic}</span>
                  <h3 className="font-display font-semibold text-[14px]" style={{ color: m.col }}>{m.n}</h3>
                </div>
                <p className="text-[12px] text-ink-muted mb-2">{m.d}</p>
                {active ? (
                  <Link
                    to={`/modulo/${slug}`}
                    className="text-[11px] text-primary-hi hover:underline"
                  >
                    Abrir módulo →
                  </Link>
                ) : (
                  <span className="text-[11px] text-ink-dim">No disponible en v1</span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </PageWrap>
  );
}
