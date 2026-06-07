import type { ReactNode } from "react";

interface SectionProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  accent?: string;
  children: ReactNode;
  className?: string;
}

// Bloque de contenido — usado por todas las vistas para titular secciones.
export default function Section({ title, subtitle, icon, accent, children, className = "" }: SectionProps) {
  return (
    <section className={`mt-10 first:mt-0 ${className}`}>
      {title && (
        <div className="flex items-baseline gap-3 mb-4">
          {icon && (
            <span
              className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
              style={{
                background: accent ? `${accent}1f` : "rgba(255,255,255,0.04)",
                border: `1px solid ${accent ? `${accent}3a` : "rgba(255,255,255,0.06)"}`,
              }}
            >
              {icon}
            </span>
          )}
          <div>
            <h2 className="font-display font-bold text-[20px] sm:text-[24px] tracking-tight">{title}</h2>
            {subtitle && <p className="text-[13px] text-ink-dim mt-0.5">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}
