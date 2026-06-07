import PageWrap from "@/components/ui/PageWrap";
import PageHeader from "@/components/ui/PageHeader";
import Tabs from "@/components/ui/Tabs";
import Bullet from "@/components/ui/Bullet";
import Callout from "@/components/ui/Callout";
// @ts-ignore
import { PIRAMIDE, ESTUDIOS, SESGOS, MEDIDAS_EPI, CHECKLIST_LC } from "@/data/epidemiologia";

export default function EpiModule() {
  return (
    <PageWrap>
      <PageHeader
        kicker="Módulo básico"
        title="Epidemiología"
        tagline="Pirámide de evidencia, tipos de estudio, sesgos, medidas y checklist de lectura crítica."
        icon="📊"
        accent="#60a5fa"
      />

      <Tabs
        tabs={[
          {
            id: "piramide",
            label: "Pirámide",
            icon: "👑",
            accent: "#22d3ee",
            content: <Piramide />,
          },
          {
            id: "estudios",
            label: "Estudios",
            icon: "🧪",
            accent: "#34d399",
            content: <Genericos items={ESTUDIOS as any[]} accent="#34d399" />,
          },
          {
            id: "sesgos",
            label: "Sesgos",
            icon: "⚠️",
            accent: "#fbbf24",
            content: <Genericos items={SESGOS as any[]} accent="#fbbf24" />,
          },
          {
            id: "medidas",
            label: "Medidas",
            icon: "🧮",
            accent: "#a78bfa",
            content: <Genericos items={MEDIDAS_EPI as any[]} accent="#a78bfa" />,
          },
          {
            id: "lc",
            label: "Lectura crítica",
            icon: "🔍",
            accent: "#f472b6",
            content: <LecturaCritica />,
          },
        ]}
      />
    </PageWrap>
  );
}

function Piramide() {
  return (
    <div className="space-y-2.5">
      {(PIRAMIDE as any[]).map((p, i) => (
        <article
          key={i}
          className="p-4 rounded-2xl bg-grad-surface border border-white/[0.06]"
          style={{ borderColor: `${p.color}40` }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[22px]" aria-hidden>{p.icono}</span>
            <div>
              <div className="text-[11px] uppercase tracking-wider" style={{ color: p.color }}>
                Nivel {p.nivel}
              </div>
              <h3 className="font-display font-semibold text-[16px] tracking-tight">{p.nombre}</h3>
            </div>
          </div>
          {p.desc && <p className="text-[13.5px] text-ink leading-relaxed">{p.desc}</p>}
          <dl className="mt-3 grid sm:grid-cols-2 gap-2 text-[13px]">
            {p.para && <KV k="Para qué" v={p.para} />}
            {p.medida && <KV k="Medida" v={p.medida} />}
            {p.ejemplo && <KV k="Ejemplo" v={p.ejemplo} />}
          </dl>
        </article>
      ))}
    </div>
  );
}

function Genericos({ items, accent }: { items: any[]; accent: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map((it, i) => {
        const title = it.nombre || it.tipo || it.nm || it.name || it.t || `Item ${i + 1}`;
        return (
          <article
            key={i}
            className="p-4 rounded-2xl bg-grad-surface border border-white/[0.06]"
            style={{ borderColor: `${accent}33` }}
          >
            <h3 className="font-display font-semibold text-[15.5px] tracking-tight mb-1.5" style={{ color: accent }}>
              {title}
            </h3>
            {it.desc && <p className="text-[13.5px] text-ink leading-relaxed mb-2">{it.desc}</p>}
            {it.def && <p className="text-[13.5px] text-ink leading-relaxed mb-2">{it.def}</p>}
            {it.ejemplo && <p className="text-[12.5px] text-ink-muted mb-2"><strong>Ejemplo:</strong> {it.ejemplo}</p>}
            {Array.isArray(it.pros) && (
              <KV k="Pros" v={it.pros.join(" · ")} />
            )}
            {Array.isArray(it.contras) && (
              <KV k="Contras" v={it.contras.join(" · ")} />
            )}
            {Array.isArray(it.bullets) && (
              <Bullet items={it.bullets} accent={accent} />
            )}
            {it.formula && (
              <div className="mt-2 p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] font-mono text-[12.5px] text-ink-muted">
                {it.formula}
              </div>
            )}
            {it.tip && (
              <div className="mt-2.5">
                <Callout tone="blue">{it.tip}</Callout>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-ink-dim font-medium">{k}</dt>
      <dd className="text-[13px] text-ink leading-relaxed mt-0.5">{v}</dd>
    </div>
  );
}

function LecturaCritica() {
  return (
    <div className="space-y-3">
      {(CHECKLIST_LC as any[]).map((c: any, i: number) => (
        <article key={i} className="p-4 rounded-2xl bg-grad-surface border border-white/[0.06]">
          <h3 className="font-display font-semibold text-[15px] tracking-tight mb-2 text-pink-300">
            {c.seccion || c.titulo || c.nombre || `Bloque ${i + 1}`}
          </h3>
          {Array.isArray(c.items) && <Bullet items={c.items} accent="#f472b6" />}
          {Array.isArray(c.preguntas) && <Bullet items={c.preguntas} accent="#f472b6" />}
        </article>
      ))}
    </div>
  );
}
