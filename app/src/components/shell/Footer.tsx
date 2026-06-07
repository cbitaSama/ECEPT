// Footer minimalista — link al proyecto, créditos, año dinámico.
export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.05] pb-safe">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-ink-dim">
        <div className="flex items-center gap-2">
          <span className="font-medium text-ink-muted">ECEPT</span>
          <span aria-hidden>·</span>
          <span>El Conocimiento Es Para Todos</span>
        </div>
        <div className="flex items-center gap-4">
          <span>v1.0 · {new Date().getFullYear()}</span>
          <a
            href="https://github.com/cbitaSama/ECEPT"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink transition"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
