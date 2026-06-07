import { useMemo, useState } from "react";
import PageWrap from "@/components/ui/PageWrap";
import PageHeader from "@/components/ui/PageHeader";
import Bullet from "@/components/ui/Bullet";
import Callout from "@/components/ui/Callout";
// @ts-ignore
import { MED_ROLES, MED_FAMILIES, MED_LIST, MED_RELATIONS } from "@/data/mediadores";

export default function MediadoresModule() {
  const [fam, setFam] = useState<string | "all">("all");
  const families = MED_FAMILIES as any[];
  const list = MED_LIST as any[];
  const roles = MED_ROLES as any;

  const visible = useMemo(() => list.filter((m) => fam === "all" || m.fam === fam), [list, fam]);

  return (
    <PageWrap>
      <PageHeader
        kicker="Módulo básico"
        title="Mediadores"
        tagline="Citocinas, eicosanoides, aminas vasoactivas y demás mediadores químicos con su rol clínico."
        icon="💧"
        accent="#06b6d4"
      />

      {roles && (
        <section className="mb-8">
          <h2 className="font-display font-bold text-[18px] tracking-tight mb-3">Roles funcionales</h2>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {Object.entries(roles).map(([k, v]: [string, any]) => (
              <Callout key={k} tone="blue" title={k} icon="🔹">
                {typeof v === "string" ? v : v.d || JSON.stringify(v)}
              </Callout>
            ))}
          </div>
        </section>
      )}

      <div className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mb-5">
        <Pill active={fam === "all"} color="#94a3b8" onClick={() => setFam("all")}>
          Todos · {list.length}
        </Pill>
        {families.map((f) => {
          const count = list.filter((m) => m.fam === f.id).length;
          return (
            <Pill key={f.id} active={fam === f.id} color={f.c} onClick={() => setFam(f.id)}>
              <span className="mr-1">{f.i}</span>
              {f.n} · {count}
            </Pill>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {visible.map((m: any) => {
          const family = families.find((f) => f.id === m.fam);
          const color = family?.c || "#60a5fa";
          return (
            <article
              key={m.id}
              className="p-4 rounded-2xl bg-grad-surface border border-white/[0.06]"
              style={{ borderColor: `${color}33` }}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-[20px]" aria-hidden>{family?.i || "💧"}</span>
                <h3 className="font-display font-semibold text-[15.5px] tracking-tight" style={{ color }}>
                  {m.n}
                </h3>
              </div>
              {m.r && <p className="text-[12.5px] text-ink-dim mb-1.5">{m.r}</p>}
              {m.o && <p className="text-[13px] text-ink-muted mb-1.5"><strong>Origen:</strong> {m.o}</p>}
              {m.f && <p className="text-[13px] text-ink leading-relaxed mb-2">{m.f}</p>}
              {Array.isArray(m.k) && m.k.length > 0 && <Bullet items={m.k} accent={color} />}
              {m.t && (
                <div className="mt-2.5">
                  <Callout tone="purple" title="Terapia">{m.t}</Callout>
                </div>
              )}
              {m.p && (
                <div className="mt-2">
                  <Callout tone="orange" title="Perla">{m.p}</Callout>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {Array.isArray(MED_RELATIONS) && MED_RELATIONS.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display font-bold text-[18px] tracking-tight mb-3">Relaciones clave</h2>
          <div className="space-y-2">
            {(MED_RELATIONS as any[]).map((r, i) => (
              <Callout key={i} tone="purple" title={r.titulo || r.t || `Relación ${i + 1}`}>
                {r.desc || r.d || JSON.stringify(r)}
              </Callout>
            ))}
          </div>
        </section>
      )}
    </PageWrap>
  );
}

function Pill({
  active,
  color,
  onClick,
  children,
}: {
  active: boolean;
  color: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 inline-flex items-center px-3 h-9 rounded-full text-[12px] font-medium transition border"
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
