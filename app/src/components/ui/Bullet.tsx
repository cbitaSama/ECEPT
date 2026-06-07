import type { ReactNode } from "react";

// Bullet list — usado para listar puntos clínicos / criterios / pearls.
// Acepta strings o ReactNode. El bullet visual es un dot azul sutil.
export default function Bullet({
  items,
  accent,
  ordered = false,
  className = "",
}: {
  items: (string | ReactNode)[];
  accent?: string;
  ordered?: boolean;
  className?: string;
}) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`space-y-1.5 ${className}`}>
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-2.5 text-[14px] text-ink leading-relaxed">
          {ordered ? (
            <span
              className="shrink-0 w-5 h-5 mt-0.5 rounded-full flex items-center justify-center text-[11px] font-semibold"
              style={{
                background: accent ? `${accent}26` : "rgba(96,165,250,0.18)",
                color: accent || "#60a5fa",
              }}
            >
              {i + 1}
            </span>
          ) : (
            <span
              aria-hidden
              className="shrink-0 w-1.5 h-1.5 mt-2 rounded-full"
              style={{ background: accent || "#60a5fa" }}
            />
          )}
          <span dangerouslySetInnerHTML={typeof it === "string" ? { __html: it } : undefined}>
            {typeof it !== "string" ? it : undefined}
          </span>
        </li>
      ))}
    </Tag>
  );
}
