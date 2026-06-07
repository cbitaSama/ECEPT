import { useEffect, useRef, useState } from "react";
import PageWrap from "@/components/ui/PageWrap";
import PageHeader from "@/components/ui/PageHeader";
import Callout from "@/components/ui/Callout";

// ════════════════════════════════════════════════════════════════
// Salud Mental — se embebe el módulo original (Alpha13 IIFE) vía
// iframe a /legacy/salud-mental.html. El contenido es extenso y
// auto-contenido; reescribirlo de cero implicaría riesgo de pérdida.
// Esta capa es 100% lossless: misma data, mismo render que la app
// vieja, dentro del shell premium nuevo.
// ════════════════════════════════════════════════════════════════
export default function SaludMentalModule() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(2400);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function onResize() {
      const h = Math.max(window.innerHeight - 200, 1800);
      setHeight(h);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <PageWrap>
      <PageHeader
        kicker="Módulo clínico"
        title="Salud Mental"
        tagline="Psicosis, neurosis, TCA, sueño, impulsividad, personalidad, depresivos, trauma y somáticos. Incluye flashcards integradas."
        icon="🧠"
        accent="#a78bfa"
      />

      {!loaded && (
        <div className="mb-4">
          <Callout tone="purple">
            Cargando módulo completo · si no se renderiza en unos segundos, recargá la página.
          </Callout>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-bg-1">
        <iframe
          ref={ref}
          src="/legacy/salud-mental.html"
          title="Salud Mental"
          onLoad={() => setLoaded(true)}
          className="w-full bg-bg"
          style={{ height: `${height}px`, border: 0 }}
        />
      </div>

      <p className="text-[12px] text-ink-dim mt-4 text-center">
        Esta unidad se sirve desde el bundle Alpha13 original. La capa de auth y flashcards remotas
        está desactivada en v1; las flashcards locales del navegador siguen funcionando.
      </p>
    </PageWrap>
  );
}
