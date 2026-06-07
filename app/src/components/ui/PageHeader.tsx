import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  tagline?: string;
  icon?: string;
  accent?: string;
  kicker?: string;
}

// Header de página de módulo — usado en TODAS las vistas de módulo.
// Incluye breadcrumb back-to-home + título grande con accent + tagline.
export default function PageHeader({ title, tagline, icon, accent, kicker }: PageHeaderProps) {
  return (
    <div className="relative pt-8 sm:pt-12 pb-6 border-b border-white/[0.05] mb-8">
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px opacity-50"
        style={{
          background: accent
            ? `linear-gradient(90deg, transparent, ${accent}66, transparent)`
            : "linear-gradient(90deg, transparent, rgba(96,165,250,0.4), transparent)",
        }}
      />
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-[12px] text-ink-dim hover:text-ink-muted transition mb-4 min-h-11"
      >
        <span aria-hidden>←</span> Inicio
      </Link>
      <div className="flex items-start gap-4">
        {icon && (
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-[32px] sm:text-[36px] shrink-0"
            style={{
              background: accent
                ? `linear-gradient(135deg, ${accent}33, ${accent}11)`
                : "linear-gradient(135deg, rgba(96,165,250,0.18), rgba(96,165,250,0.06))",
              border: `1px solid ${accent ? `${accent}44` : "rgba(96,165,250,0.22)"}`,
            }}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          {kicker && (
            <div className="text-[11px] uppercase tracking-[0.18em] text-ink-dim font-medium mb-1">
              {kicker}
            </div>
          )}
          <h1 className="font-display font-extrabold text-[28px] sm:text-[40px] tracking-tight leading-tight text-balance">
            {title}
          </h1>
          {tagline && (
            <p className="text-[14px] sm:text-[16px] text-ink-muted mt-2 max-w-2xl text-pretty">
              {tagline}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
