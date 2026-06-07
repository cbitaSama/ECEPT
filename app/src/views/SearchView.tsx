import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageWrap from "@/components/ui/PageWrap";
import PageHeader from "@/components/ui/PageHeader";
import { getSearchIndex, searchInIndex, type SearchEntry } from "@/lib/searchIndex";

// ════════════════════════════════════════════════════════════════
// Búsqueda global — carga el índice lazy, debounced.
// Indexa enfermedades, tríadas, vocab, labs, receptores, mediadores
// y conceptos de cada módulo. Soporta múltiples tokens (AND).
// ════════════════════════════════════════════════════════════════
export default function SearchView() {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") || "";
  const [q, setQ] = useState(initialQ);
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [hits, setHits] = useState<SearchEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Carga el índice en cuanto se monta la vista
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSearchIndex().then((idx) => {
      if (!cancelled) {
        setIndex(idx);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync URL ?q= (debounced)
  useEffect(() => {
    const t = setTimeout(() => setParams({ q }, { replace: true }), 200);
    return () => clearTimeout(t);
  }, [q, setParams]);

  // Buscar cuando hay índice + query
  useEffect(() => {
    if (!index) {
      setHits([]);
      return;
    }
    const term = q.trim();
    if (term.length === 0) {
      setHits([]);
      return;
    }
    setHits(searchInIndex(index, term));
  }, [q, index]);

  return (
    <PageWrap>
      <PageHeader title="Buscar" tagline="Enfermedades, tríadas, fármacos, analitos, vocabulario." icon="🔎" accent="#60a5fa" />

      <input
        autoFocus
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="¿Qué estás estudiando hoy?"
        className="w-full h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] px-5 text-[16px] placeholder:text-ink-dim outline-none focus:border-primary-hi/60 mb-6"
      />

      {loading && !index && (
        <div className="text-center text-ink-dim text-[13px] py-6">Cargando índice…</div>
      )}

      {!loading && q.trim() === "" && (
        <div className="text-center text-ink-dim text-[14px] py-12">
          Probá: <em>lupus</em>, <em>quemado</em>, <em>raynaud</em>, <em>parkland</em>, <em>m2</em>, <em>asterixis</em>.
        </div>
      )}

      {q.trim() !== "" && hits.length === 0 && index && (
        <div className="text-center text-ink-dim text-[14px] py-12">Sin resultados.</div>
      )}

      <div className="space-y-1.5">
        {hits.map((h, i) => (
          <Link
            key={i}
            to={h.href}
            className="block p-3.5 rounded-xl bg-grad-surface border border-white/[0.06] hover:border-white/[0.14] transition group"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[10.5px] uppercase tracking-wider font-medium mb-0.5" style={{ color: h.accent }}>
                  {h.module}
                </div>
                <h3 className="font-display font-semibold text-[15px] tracking-tight truncate group-hover:text-primary-hi transition">
                  {h.title}
                </h3>
                {h.subtitle && <p className="text-[12.5px] text-ink-muted mt-0.5 line-clamp-1">{h.subtitle}</p>}
              </div>
              <span aria-hidden className="text-ink-dim shrink-0">→</span>
            </div>
          </Link>
        ))}
      </div>

      {hits.length > 0 && (
        <p className="text-center text-[11px] text-ink-dim mt-6">
          Mostrando {hits.length} resultado{hits.length === 1 ? "" : "s"}.
        </p>
      )}
    </PageWrap>
  );
}
