import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrap from "@/components/ui/PageWrap";
import PageHeader from "@/components/ui/PageHeader";
import Bullet from "@/components/ui/Bullet";
// @ts-ignore
import { ABD_DATA } from "@/data/cirugia";

// ABD_DATA: [{id, name, color, icon, def, cl: [{type, desc, etiology, who, tx}]}]

export default function CirugiaModule() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <PageWrap>
      <PageHeader
        kicker="Módulo clínico"
        title="Cirugía — Abdomen Agudo"
        tagline="Peritonitis, apendicitis, oclusión intestinal y diagnósticos diferenciales con manejo escalonado."
        icon="🔪"
        accent="#a78bfa"
      />

      <div className="space-y-3">
        {(ABD_DATA as any[]).map((it) => {
          const isOpen = open === it.id;
          return (
            <article
              key={it.id}
              className="rounded-2xl bg-grad-surface border border-white/[0.06] overflow-hidden"
              style={{ boxShadow: `inset 0 0 0 1px ${it.color}22` }}
            >
              <button
                onClick={() => setOpen(isOpen ? null : it.id)}
                className="w-full text-left p-4 sm:p-5 flex items-center gap-4 min-h-14"
                aria-expanded={isOpen}
              >
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] shrink-0"
                  style={{ background: `${it.color}22`, border: `1px solid ${it.color}44` }}
                >
                  {it.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display font-semibold text-[17px] tracking-tight">{it.name}</h3>
                  {it.def && (
                    <p className="text-[12.5px] text-ink-dim mt-0.5 line-clamp-2">{it.def}</p>
                  )}
                </div>
                <span aria-hidden className={`w-6 h-6 inline-flex items-center justify-center text-ink-muted transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-white/[0.06] p-4 sm:p-5 pt-5 space-y-3">
                      {it.def && <p className="text-[14px] text-ink leading-relaxed">{it.def}</p>}
                      {(it.cl || []).map((c: any, i: number) => (
                        <div
                          key={i}
                          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                        >
                          <h4 className="font-semibold text-[15px] mb-1.5" style={{ color: it.color }}>
                            {c.type}
                          </h4>
                          {c.desc && <p className="text-[13.5px] text-ink leading-relaxed mb-2">{c.desc}</p>}
                          <KV items={[
                            c.etiology && { k: "Etiología", v: c.etiology },
                            c.who && { k: "Población", v: c.who },
                            c.tx && { k: "Tratamiento", v: c.tx },
                          ].filter(Boolean) as any[]} />
                          {Array.isArray(c.bullets) && c.bullets.length > 0 && (
                            <div className="mt-2.5">
                              <Bullet items={c.bullets} accent={it.color} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          );
        })}
      </div>
    </PageWrap>
  );
}

function KV({ items }: { items: { k: string; v: string }[] }) {
  if (!items?.length) return null;
  return (
    <dl className="space-y-1">
      {items.map((it, i) => (
        <div key={i} className="flex flex-col sm:flex-row sm:gap-2 text-[13px]">
          <dt className="text-ink-dim font-medium sm:w-28 shrink-0">{it.k}:</dt>
          <dd className="text-ink leading-relaxed">{it.v}</dd>
        </div>
      ))}
    </dl>
  );
}
