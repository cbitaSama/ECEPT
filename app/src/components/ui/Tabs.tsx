import { useState, type ReactNode } from "react";

interface TabsProps {
  tabs: { id: string; label: string; icon?: string; accent?: string; content: ReactNode }[];
  initial?: string;
}

// Tabs reutilizables — usadas por módulos con múltiples vistas (Epi, Anatomía, etc.).
export default function Tabs({ tabs, initial }: TabsProps) {
  const [active, setActive] = useState(initial || tabs[0]?.id);
  const current = tabs.find((t) => t.id === active);
  return (
    <div>
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-5 border-b border-white/[0.05] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className="shrink-0 inline-flex items-center gap-1.5 px-3.5 h-10 text-[13px] font-medium transition relative min-h-10"
              style={{
                color: isActive ? t.accent || "#60a5fa" : "#94a3b8",
              }}
            >
              {t.icon && <span aria-hidden>{t.icon}</span>}
              <span className="whitespace-nowrap">{t.label}</span>
              {isActive && (
                <span
                  className="absolute left-2 right-2 -bottom-px h-px"
                  style={{ background: t.accent || "#60a5fa" }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div>{current?.content}</div>
    </div>
  );
}
