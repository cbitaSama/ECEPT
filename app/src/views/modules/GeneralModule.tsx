import PageWrap from "@/components/ui/PageWrap";
import PageHeader from "@/components/ui/PageHeader";
import Tabs from "@/components/ui/Tabs";
import Callout from "@/components/ui/Callout";
import Bullet from "@/components/ui/Bullet";
// @ts-ignore
import { COAG_FACTORES, COAG_QUIZ, COAG_PERLAS, COAG_CASCADA } from "@/data/generalidades";

// Generalidades — por ahora la unidad activa es Coagulación.

export default function GeneralModule() {
  return (
    <PageWrap>
      <PageHeader
        kicker="Módulo básico"
        title="Generalidades — Coagulación"
        tagline="Factores, cascada extrínseca/intrínseca, perlas mnemónicas y pool de preguntas."
        icon="📚"
        accent="#94a3b8"
      />
      <Tabs
        tabs={[
          { id: "fact", label: "Factores", icon: "🧬", accent: "#60a5fa", content: <Factores /> },
          { id: "casc", label: "Cascada", icon: "🌊", accent: "#34d399", content: <Cascada /> },
          { id: "pearl", label: "Perlas", icon: "📌", accent: "#fb923c", content: <Perlas /> },
          { id: "quiz", label: `Quiz · ${COAG_QUIZ?.length || 0}`, icon: "📝", accent: "#a78bfa", content: <Quiz /> },
        ]}
      />
    </PageWrap>
  );
}

function Factores() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
      <table className="w-full text-[13.5px]">
        <thead className="bg-white/[0.04]">
          <tr>
            <th className="text-left p-3 font-semibold text-ink-muted">N°</th>
            <th className="text-left p-3 font-semibold text-ink-muted">Nombre</th>
            <th className="text-left p-3 font-semibold text-ink-muted">Alternativos</th>
            <th className="text-center p-3 font-semibold text-ink-muted">Vit. K</th>
          </tr>
        </thead>
        <tbody>
          {(COAG_FACTORES as any[]).map((f, i) => (
            <tr key={i} className="border-t border-white/[0.05]">
              <td className="p-3 font-mono font-semibold text-primary-hi">{f.num}</td>
              <td className="p-3">{f.nombre}</td>
              <td className="p-3 text-ink-muted">{f.alt || "—"}</td>
              <td className="p-3 text-center">{f.vk ? <span className="text-success">●</span> : <span className="text-ink-dim">○</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cascada() {
  if (!COAG_CASCADA) return null;
  const c: any = COAG_CASCADA;
  return (
    <div className="space-y-3">
      {Object.keys(c).map((k) => {
        const seg = (c as any)[k];
        if (!seg) return null;
        if (typeof seg === "string") {
          return (
            <article key={k} className="p-4 rounded-2xl bg-grad-surface border border-white/[0.06]">
              <h3 className="font-display font-semibold text-[15px] tracking-tight mb-1">{k}</h3>
              <p className="text-[13.5px] text-ink leading-relaxed">{seg}</p>
            </article>
          );
        }
        const title = seg.titulo || seg.nombre || k;
        const desc = seg.desc || seg.descripcion;
        const factors = seg.factores || seg.factors;
        const points = seg.puntos || seg.bullets || seg.items;
        return (
          <article key={k} className="p-4 rounded-2xl bg-grad-surface border border-white/[0.06]">
            <h3 className="font-display font-semibold text-[15.5px] tracking-tight mb-1.5 text-success">{title}</h3>
            {desc && <p className="text-[13.5px] text-ink leading-relaxed mb-2">{desc}</p>}
            {Array.isArray(factors) && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {factors.map((f: any, i: number) => (
                  <span key={i} className="inline-flex px-2.5 py-1 rounded-full bg-success/10 border border-success/20 text-[12px] text-success">
                    {typeof f === "string" ? f : f.num || f.n || JSON.stringify(f)}
                  </span>
                ))}
              </div>
            )}
            {Array.isArray(points) && <Bullet items={points} accent="#34d399" />}
          </article>
        );
      })}
    </div>
  );
}

function Perlas() {
  if (!COAG_PERLAS?.length) return <p className="text-ink-dim">Sin perlas.</p>;
  return (
    <div className="space-y-2">
      {(COAG_PERLAS as any[]).map((p, i) => (
        <Callout key={i} tone="orange">
          {typeof p === "string" ? p : p.text || p.t || JSON.stringify(p)}
        </Callout>
      ))}
    </div>
  );
}

function Quiz() {
  if (!COAG_QUIZ?.length) return <p className="text-ink-dim">Sin preguntas.</p>;
  return (
    <div className="space-y-3">
      {(COAG_QUIZ as any[]).map((q, i) => (
        <article key={i} className="p-4 rounded-2xl bg-grad-surface border border-white/[0.06]">
          <p className="font-medium text-[14px] mb-2">{q.p || q.pregunta || q.q}</p>
          {Array.isArray(q.o || q.opciones) && (
            <ul className="space-y-1">
              {(q.o || q.opciones).map((o: string, k: number) => (
                <li key={k} className={`text-[13px] pl-3 ${k === (q.r ?? q.respuesta) ? "text-success font-semibold" : "text-ink-muted"}`}>
                  {String.fromCharCode(65 + k)}. {o}{k === (q.r ?? q.respuesta) && <span className="ml-2">✓</span>}
                </li>
              ))}
            </ul>
          )}
          {(q.x || q.explicacion) && (
            <div className="mt-2.5">
              <Callout tone="blue">{q.x || q.explicacion}</Callout>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
