import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  accent?: string;
  as?: "div" | "article" | "section";
}

// Card base — superficie elevada con borde sutil.
export default function Card({ children, className = "", accent, as: As = "div" }: CardProps) {
  return (
    <As
      className={`relative p-5 rounded-2xl bg-grad-surface border border-white/[0.05] overflow-hidden ${className}`}
      style={accent ? { boxShadow: `inset 0 0 0 1px ${accent}25` } : undefined}
    >
      {children}
    </As>
  );
}
