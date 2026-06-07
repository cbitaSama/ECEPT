import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Disease } from "@/types";
import Callout from "@/components/ui/Callout";
import Bullet from "@/components/ui/Bullet";
import FavoriteButton from "@/components/medical/FavoriteButton";
import { favKey } from "@/lib/useFavorites";

const SUB_SECTIONS = [
  { k: "cc" as const, l: "Cuadro Clínico", i: "🩺", c: "#f472b6" },
  { k: "dx" as const, l: "Diagnóstico",   i: "🔬", c: "#60a5fa" },
  { k: "ex" as const, l: "Exámenes",      i: "🧪", c: "#34d399" },
  { k: "tx" as const, l: "Tratamiento",   i: "💊", c: "#a78bfa" },
  { k: "px" as const, l: "Pronóstico",    i: "⚠️", c: "#fbbf24" },
  { k: "pe" as const, l: "Perlas",        i: "📌", c: "#fb923c" },
];

// ════════════════════════════════════════════════════════════════
// DiseaseCard — tarjeta expandible para cualquier enfermedad con la
// shape canónica {cc, dx, ex, tx, px, pe, qz}. Misma data que el old
// ECEPT, layout limpio con tabs internos.
// ════════════════════════════════════════════════════════════════
export default function DiseaseCard({ disease, moduleId = "disease" }: { disease: Disease; moduleId?: string }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"cc" | "dx" | "ex" | "tx" | "px" | "pe" | "qz">("cc");

  return (
    <article className="rounded-2xl bg-grad-surface border border-white/[0.06] overflow-hidden">
      <div className="flex items-center gap-2 p-4 sm:p-5 min-h-14">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex-1 flex items-center justify-between gap-4 text-left min-w-0"
          aria-expanded={open}
        >
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-semibold text-[16px] sm:text-[18px] text-ink tracking-tight truncate">
              {disease.n}
            </h3>
            {disease.cc?.t && (
              <p className="text-[12px] sm:text-[13px] text-ink-dim mt-1 line-clamp-1">
                {disease.cc.t}
              </p>
            )}
          </div>
          <span
            aria-hidden
            className={`w-8 h-8 rounded-full bg-white/[0.05] inline-flex items-center justify-center text-ink-muted shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
        <FavoriteButton favKey={favKey(moduleId, disease.id)} size="sm" />
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.06]">
              <div className="px-4 sm:px-5 pt-3 flex gap-1 overflow-x-auto -mb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {SUB_SECTIONS.map((s) => (
                  <TabButton
                    key={s.k}
                    active={tab === s.k}
                    accent={s.c}
                    onClick={() => setTab(s.k)}
                    icon={s.i}
                    label={s.l}
                  />
                ))}
                {disease.qz?.length > 0 && (
                  <TabButton
                    active={tab === "qz"}
                    accent="#34d399"
                    onClick={() => setTab("qz")}
                    icon="📝"
                    label={`Quiz · ${disease.qz.length}`}
                  />
                )}
              </div>

              <div className="p-4 sm:p-5 pt-5 space-y-4">
                {tab === "cc" && <SectionCC disease={disease} />}
                {tab === "dx" && <SectionDx disease={disease} />}
                {tab === "ex" && <SectionEx disease={disease} />}
                {tab === "tx" && <SectionTx disease={disease} />}
                {tab === "px" && <SectionPx disease={disease} />}
                {tab === "pe" && <SectionPearls disease={disease} />}
                {tab === "qz" && <SectionQuiz disease={disease} />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

function TabButton({
  active,
  accent,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  accent: string;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 flex items-center gap-1.5 px-3 h-9 rounded-t-lg text-[12px] font-medium transition ${
        active ? "text-ink" : "text-ink-dim hover:text-ink-muted"
      }`}
      style={
        active
          ? { borderBottom: `2px solid ${accent}`, background: `${accent}10` }
          : { borderBottom: "2px solid transparent" }
      }
    >
      <span aria-hidden>{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function FieldLabel({ children, accent }: { children: string; accent: string }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.16em] font-semibold mb-1.5" style={{ color: accent }}>
      {children}
    </div>
  );
}

function SectionCC({ disease }: { disease: Disease }) {
  return (
    <div className="space-y-4">
      {disease.cc?.t && (
        <p className="text-[14px] text-ink leading-relaxed">{disease.cc.t}</p>
      )}
      {disease.cc?.p?.length > 0 && <Bullet items={disease.cc.p} accent="#f472b6" />}
    </div>
  );
}

function SectionDx({ disease }: { disease: Disease }) {
  return (
    <div className="space-y-4">
      {disease.dx?.cr?.length > 0 && (
        <div>
          <FieldLabel accent="#60a5fa">Criterios</FieldLabel>
          <div className="space-y-2">
            {disease.dx.cr.map((c, i) => (
              <div key={i} className="rounded-lg bg-white/[0.03] border border-white/[0.05] p-3">
                <div className="text-[13px] font-semibold text-ink mb-0.5">{c.c}</div>
                <div className="text-[13px] text-ink-muted leading-relaxed">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {disease.dx?.df?.length > 0 && (
        <div>
          <FieldLabel accent="#a78bfa">Diferenciales</FieldLabel>
          <div className="flex flex-wrap gap-1.5">
            {disease.dx.df.map((d, i) => (
              <span
                key={i}
                className="inline-flex px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[12px] text-purple-200"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      )}
      {disease.dx?.nt && (
        <Callout tone="blue" title="Nota">
          {disease.dx.nt}
        </Callout>
      )}
    </div>
  );
}

function SectionEx({ disease }: { disease: Disease }) {
  return (
    <div className="space-y-4">
      {disease.ex?.l?.length > 0 && (
        <div>
          <FieldLabel accent="#34d399">Laboratorio</FieldLabel>
          <Bullet items={disease.ex.l} accent="#34d399" />
        </div>
      )}
      {disease.ex?.im && (
        <div>
          <FieldLabel accent="#06b6d4">Imagen</FieldLabel>
          <p className="text-[14px] text-ink leading-relaxed">{disease.ex.im}</p>
        </div>
      )}
    </div>
  );
}

function SectionTx({ disease }: { disease: Disease }) {
  const t = disease.tx;
  if (!t) return null;
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {t.p && <TxBlock label="Primera línea" accent="#a78bfa" body={t.p} />}
      {t.q && <TxBlock label="Segunda línea / químicos" accent="#60a5fa" body={t.q} />}
      {t.b && <TxBlock label="Biológicos" accent="#34d399" body={t.b} />}
      {t.m && <TxBlock label="Manejo / extras" accent="#fbbf24" body={t.m} />}
    </div>
  );
}

function TxBlock({ label, accent, body }: { label: string; accent: string; body: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-3">
      <FieldLabel accent={accent}>{label}</FieldLabel>
      <p className="text-[13px] text-ink leading-relaxed">{body}</p>
    </div>
  );
}

function SectionPx({ disease }: { disease: Disease }) {
  const p = disease.px;
  if (!p) return null;
  return (
    <div className="space-y-4">
      {p.e && (
        <div>
          <FieldLabel accent="#fbbf24">Evolución</FieldLabel>
          <p className="text-[14px] text-ink leading-relaxed">{p.e}</p>
        </div>
      )}
      {p.f?.length > 0 && (
        <div>
          <FieldLabel accent="#fb923c">Factores de mal pronóstico</FieldLabel>
          <Bullet items={p.f} accent="#fb923c" />
        </div>
      )}
      {p.co?.length > 0 && (
        <div>
          <FieldLabel accent="#ef4444">Complicaciones</FieldLabel>
          <Bullet items={p.co} accent="#ef4444" />
        </div>
      )}
    </div>
  );
}

function SectionPearls({ disease }: { disease: Disease }) {
  if (!disease.pe?.length) return <p className="text-[13px] text-ink-dim">Sin perlas listadas.</p>;
  return (
    <div className="space-y-2">
      {disease.pe.map((p, i) => (
        <Callout key={i} tone="orange" icon="📌">
          {p}
        </Callout>
      ))}
    </div>
  );
}

function SectionQuiz({ disease }: { disease: Disease }) {
  if (!disease.qz?.length) return <p className="text-[13px] text-ink-dim">Sin preguntas en el pool.</p>;
  return (
    <div className="space-y-4">
      {disease.qz.map((q, idx) => (
        <QuizItem key={idx} question={q} index={idx} />
      ))}
    </div>
  );
}

function QuizItem({
  question,
  index,
}: {
  question: { p: string; o: string[]; r: number; x: string };
  index: number;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const revealed = picked !== null;
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-4">
      <div className="flex items-start gap-2 mb-3">
        <span className="text-[11px] uppercase tracking-wider text-ink-dim font-semibold mt-0.5">
          Pregunta {index + 1}
        </span>
      </div>
      <p className="text-[14px] text-ink font-medium mb-3 leading-relaxed">{question.p}</p>
      <div className="space-y-1.5">
        {question.o.map((opt, i) => {
          const isCorrect = i === question.r;
          const isPicked = picked === i;
          let cls = "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]";
          if (revealed) {
            if (isCorrect) cls = "border-success/40 bg-success/10";
            else if (isPicked) cls = "border-danger/40 bg-danger/10";
            else cls = "border-white/[0.05] bg-white/[0.02] opacity-60";
          }
          return (
            <button
              key={i}
              onClick={() => !revealed && setPicked(i)}
              disabled={revealed}
              className={`w-full text-left text-[13px] text-ink px-3 py-2.5 rounded-lg border transition min-h-11 ${cls}`}
            >
              <span className="font-semibold opacity-60 mr-2">{String.fromCharCode(65 + i)}.</span>
              {opt}
              {revealed && isCorrect && <span className="ml-2 text-success">✓</span>}
              {revealed && isPicked && !isCorrect && <span className="ml-2 text-danger">✗</span>}
            </button>
          );
        })}
      </div>
      {revealed && question.x && (
        <div className="mt-3">
          <Callout tone="blue" title="Explicación">
            {question.x}
          </Callout>
        </div>
      )}
    </div>
  );
}
