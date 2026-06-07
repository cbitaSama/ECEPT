import type { ReactNode } from "react";

const TONE_STYLES: Record<string, { bg: string; border: string; ink: string; icon: string }> = {
  blue:    { bg: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.25)",  ink: "#bfdbfe", icon: "💡" },
  green:   { bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.25)",  ink: "#a7f3d0", icon: "✅" },
  purple:  { bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.25)", ink: "#ddd6fe", icon: "🧠" },
  yellow:  { bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.25)",  ink: "#fde68a", icon: "⚠️" },
  orange:  { bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.25)",  ink: "#fed7aa", icon: "📌" },
  red:     { bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.25)",   ink: "#fecaca", icon: "🚨" },
  pink:    { bg: "rgba(244,114,182,0.08)", border: "rgba(244,114,182,0.25)", ink: "#fbcfe8", icon: "💗" },
  fuchsia: { bg: "rgba(232,121,249,0.08)", border: "rgba(232,121,249,0.25)", ink: "#f5d0fe", icon: "✨" },
};

interface CalloutProps {
  tone?: keyof typeof TONE_STYLES | string;
  title?: string;
  icon?: string;
  children?: ReactNode;
}

// Callout — caja informativa con tono. Usado para pearls, trampas, dangers, etc.
export default function Callout({ tone = "blue", title, icon, children }: CalloutProps) {
  const style = TONE_STYLES[tone] || TONE_STYLES.blue;
  return (
    <div
      className="p-4 rounded-xl text-[14px] leading-relaxed"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.ink,
      }}
    >
      {title && (
        <div className="flex items-center gap-2 font-semibold mb-1.5 text-[13px] uppercase tracking-wider opacity-90">
          <span aria-hidden>{icon || style.icon}</span>
          <span>{title}</span>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
