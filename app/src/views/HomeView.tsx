import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MODULES } from "@/modules/manifest";
import type { ModuleManifest } from "@/types";

// ════════════════════════════════════════════════════════════════
// HomeView — hero premium + grid de módulos agrupado por categoría.
// Animaciones sutiles, sin glitter. Touch-first.
// ════════════════════════════════════════════════════════════════
export default function HomeView() {
  const clinicos = MODULES.filter((m) => m.kind === "clinico");
  const basicos = MODULES.filter((m) => m.kind === "basico");
  const herramientas = MODULES.filter((m) => m.kind === "herramienta");

  return (
    <div>
      <Hero />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <Section title="Clínicos" subtitle="Enfermedades, manejo y exámenes" modules={clinicos} />
        <Section title="Básicos" subtitle="Bases científicas y propedéutica" modules={basicos} />
        <Section title="Herramientas" subtitle="Referencia rápida y estudio" modules={herramientas} />

        <FooterCta />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="aurora" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-12 sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <span className="chip mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" /> v1.0 · Alpha 26
          </span>
          <h1 className="text-balance font-display font-extrabold tracking-tight text-[36px] sm:text-[56px] leading-[1.02] mb-5">
            El conocimiento médico,{" "}
            <span className="bg-grad-mixed bg-clip-text text-transparent">para todos.</span>
          </h1>
          <p className="text-pretty text-[16px] sm:text-[18px] text-ink-muted max-w-2xl leading-relaxed">
            ECEPT es una plataforma de estudio diseñada para que cualquier estudiante de medicina en
            Latinoamérica pueda preparar exámenes sin pagar lo que no puede pagar. Contenido auditado,
            sin relleno, listo para Safari iPhone.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/modulo/reuma"
              className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full bg-grad-blue text-white font-semibold text-[14px] shadow-glow-blue hover:brightness-110 active:scale-[0.98] transition"
            >
              Empezar con Reumatología
              <ArrowIcon />
            </Link>
            <Link
              to="/flashcards"
              className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full bg-white/[0.05] border border-white/[0.08] text-ink font-medium text-[14px] hover:bg-white/[0.08] transition"
            >
              🎴 Flashcards
            </Link>
            <Link
              to="/buscar?q="
              className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full bg-white/[0.05] border border-white/[0.08] text-ink font-medium text-[14px] hover:bg-white/[0.08] transition"
            >
              <SearchIcon /> Buscar
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-6 max-w-xl">
            <Stat label="módulos" value={MODULES.length.toString()} />
            <Stat label="dark mode" value="100%" />
            <Stat label="bundle inicial" value="<500KB" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display font-bold text-[22px] sm:text-[28px] tracking-tight">{value}</div>
      <div className="text-[11px] sm:text-[12px] uppercase tracking-wider text-ink-dim mt-0.5">
        {label}
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  modules,
}: {
  title: string;
  subtitle: string;
  modules: ModuleManifest[];
}) {
  return (
    <section className="mt-14">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="font-display font-bold text-[22px] sm:text-[28px] tracking-tight">{title}</h2>
          <p className="text-[13px] sm:text-[14px] text-ink-dim mt-1">{subtitle}</p>
        </div>
        <span className="chip">{modules.length}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {modules.map((m, i) => (
          <ModuleCard key={m.slug} module={m} index={i} />
        ))}
      </div>
    </section>
  );
}

function ModuleCard({ module: m, index }: { module: ModuleManifest; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.04 * index, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/modulo/${m.slug}`}
        className="group relative block p-5 rounded-2xl bg-grad-surface border border-white/[0.05] hover:border-white/[0.12] hover:-translate-y-0.5 transition-all duration-300 ease-standard overflow-hidden min-h-[136px]"
      >
        {/* Accent glow */}
        <div
          aria-hidden
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
          style={{ background: m.accent }}
        />

        <div className="relative flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] shrink-0"
            style={{
              background: `linear-gradient(135deg, ${m.accent}26 0%, ${m.accent}10 100%)`,
              border: `1px solid ${m.accent}33`,
            }}
          >
            {m.icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-semibold text-[16px] tracking-tight text-ink mb-1 truncate">
              {m.name}
            </h3>
            <p className="text-[13px] text-ink-muted leading-snug line-clamp-2">{m.tagline}</p>
          </div>
        </div>

        <div className="relative mt-4 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-ink-dim font-medium">
            {m.kind === "clinico" ? "Clínico" : m.kind === "basico" ? "Básico" : "Herramienta"}
          </span>
          <span
            className="text-[12px] text-ink-muted group-hover:text-ink-hi inline-flex items-center gap-1 transition"
            style={{ color: undefined }}
          >
            Abrir <ArrowIcon className="w-3 h-3" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function FooterCta() {
  return (
    <section className="mt-20 relative overflow-hidden rounded-3xl border border-white/[0.06] bg-grad-surface p-8 sm:p-12">
      <div className="aurora opacity-50" aria-hidden />
      <div className="relative max-w-2xl">
        <h2 className="font-display font-bold text-[24px] sm:text-[32px] tracking-tight mb-3">
          Sin paywalls, sin spam, sin BS.
        </h2>
        <p className="text-[15px] text-ink-muted leading-relaxed mb-5">
          ECEPT lo construyó un estudiante de medicina mientras estudiaba. Si te sirve, compartilo con
          tus compañeros. Si encontrás un error, contame por GitHub.
        </p>
        <a
          href="https://github.com/cbitaSama/ECEPT"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-white/[0.05] border border-white/[0.08] text-ink font-medium text-[13px] hover:bg-white/[0.08] transition"
        >
          Ver repo en GitHub <ArrowIcon />
        </a>
      </div>
    </section>
  );
}

function ArrowIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
