import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MODULES } from "@/modules/manifest";

// ════════════════════════════════════════════════════════════════
// Header sticky con efecto glass al hacer scroll.
// Búsqueda con shortcut ⌘K / / .
// Logo enlaza al home; en mobile colapsa con menú hamburguesa.
// ════════════════════════════════════════════════════════════════
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = q.trim();
    if (!value) return;
    navigate(`/buscar?q=${encodeURIComponent(value)}`);
  }

  return (
    <header
      className={`sticky top-0 z-50 pt-safe transition-[backdrop-filter,background] duration-300 ${
        scrolled ? "backdrop-blur-xl bg-bg/75 border-b border-white/[0.06]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 min-h-11 min-w-11" aria-label="Ir al inicio">
          <Logo />
          <span className="font-display font-bold text-[17px] tracking-tight hidden sm:block">
            ECEPT
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={onSubmit} className="flex-1 max-w-xl ml-auto sm:ml-6">
          <label className="relative block">
            <span className="sr-only">Buscar</span>
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dim pointer-events-none" />
            <input
              id="global-search"
              type="search"
              inputMode="search"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Buscar enfermedad, fármaco, lab…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full h-10 sm:h-11 rounded-full bg-white/[0.04] border border-white/[0.06] pl-9 pr-14 text-[14px] text-ink placeholder:text-ink-dim outline-none focus:border-primary-hi/60 focus:bg-white/[0.07] transition"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[10px] text-ink-dim font-medium">
              ⌘K
            </kbd>
          </label>
        </form>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-2">
          <Link
            to="/flashcards"
            className="px-3 h-10 inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink rounded-lg hover:bg-white/[0.04] transition"
          >
            🎴 Flashcards
          </Link>
          <Link
            to="/estudio"
            className="px-3 h-10 inline-flex items-center text-[13px] text-ink-muted hover:text-ink rounded-lg hover:bg-white/[0.04] transition"
          >
            Estudiar
          </Link>
          <Link
            to="/favoritos"
            className="px-3 h-10 inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink rounded-lg hover:bg-white/[0.04] transition"
          >
            <StarIcon />
            Favoritos
          </Link>
          <Link
            to="/sobre"
            className="px-3 h-10 inline-flex items-center text-[13px] text-ink-muted hover:text-ink rounded-lg hover:bg-white/[0.04] transition"
          >
            Sobre
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="lg:hidden w-11 h-11 inline-flex items-center justify-center rounded-lg text-ink-muted hover:text-ink hover:bg-white/[0.04] transition"
          aria-label="Menú"
          aria-expanded={menuOpen}
        >
          <HamburgerIcon open={menuOpen} />
        </button>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="lg:hidden border-t border-white/[0.06] bg-bg-1/95 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Link to="/flashcards" className="flex items-center justify-center gap-1.5 h-11 rounded-lg bg-white/[0.05] border border-white/[0.08] text-[13px] font-medium">🎴 Flashcards</Link>
              <Link to="/estudio" className="flex items-center justify-center gap-1.5 h-11 rounded-lg bg-white/[0.05] border border-white/[0.08] text-[13px] font-medium">📖 Estudiar</Link>
              <Link to="/favoritos" className="flex items-center justify-center gap-1.5 h-11 rounded-lg bg-white/[0.05] border border-white/[0.08] text-[13px] font-medium"><StarIcon /> Favoritos</Link>
              <Link to="/sobre" className="flex items-center justify-center h-11 rounded-lg bg-white/[0.05] border border-white/[0.08] text-[13px] font-medium">Sobre</Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {MODULES.slice(0, 8).map((m) => (
                <Link
                  key={m.slug}
                  to={`/modulo/${m.slug}`}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05] active:bg-white/[0.06] min-h-11"
                >
                  <span className="text-lg">{m.icon}</span>
                  <span className="text-[13px] font-medium truncate">{m.name}</span>
                </Link>
              ))}
            </div>
            <Link
              to="/"
              className="block text-center text-[12px] text-ink-muted py-3 hover:text-ink"
            >
              Ver todos los módulos →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Logo() {
  return (
    <div className="w-9 h-9 rounded-xl bg-grad-mixed shadow-glow-blue flex items-center justify-center font-display font-extrabold text-bg text-[14px]">
      E
    </div>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M12 2.5l2.927 6.054 6.573.954-4.75 4.736 1.122 6.756L12 17.778l-5.872 3.222L7.25 14.244 2.5 9.508l6.573-.954L12 2.5z" />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d={open ? "M4 4l12 12M16 4L4 16" : "M3 6h14M3 10h14M3 14h14"}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        className="transition-[d] duration-200"
      />
    </svg>
  );
}
