import { useFavorites } from "@/lib/useFavorites";

interface Props {
  favKey: string;
  size?: "sm" | "md";
  label?: string;
}

// Botón de estrella para marcar/desmarcar como favorito.
// Tap target mínimo 36px (sm) / 44px (md).
export default function FavoriteButton({ favKey, size = "md", label = "Favorito" }: Props) {
  const { has, toggle } = useFavorites();
  const active = has(favKey);
  const dim = size === "sm";
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggle(favKey);
      }}
      aria-pressed={active}
      aria-label={active ? `Quitar de ${label}` : `Marcar como ${label}`}
      className={`shrink-0 inline-flex items-center justify-center rounded-full transition ${dim ? "w-9 h-9" : "w-11 h-11"} ${active ? "text-gold bg-gold/10 hover:bg-gold/15" : "text-ink-dim hover:text-ink-muted hover:bg-white/[0.05]"}`}
    >
      <svg width={dim ? 16 : 18} height={dim ? 16 : 18} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <path d="M12 2.5l2.927 6.054 6.573.954-4.75 4.736 1.122 6.756L12 17.778l-5.872 3.222L7.25 14.244 2.5 9.508l6.573-.954L12 2.5z" />
      </svg>
    </button>
  );
}
