import PageWrap from "@/components/ui/PageWrap";
import PageHeader from "@/components/ui/PageHeader";
import Callout from "@/components/ui/Callout";

export default function AboutView() {
  return (
    <PageWrap>
      <PageHeader
        title="Sobre ECEPT"
        tagline="Qué es, por qué existe, y quién lo hace."
        icon="📖"
        accent="#fbbf24"
      />

      <article className="prose prose-invert max-w-none">
        <p className="text-[16px] text-ink leading-relaxed">
          <strong>ECEPT — El Conocimiento Es Para Todos —</strong> es una plataforma de estudio
          médica en español, gratuita, sin anuncios y sin paywalls. Nació como notas personales y
          fue creciendo hasta convertirse en un recurso completo de estudio para preparar exámenes
          en la facultad.
        </p>

        <h2 className="font-display font-bold text-[22px] tracking-tight mt-8 mb-3">Filosofía</h2>
        <ul className="space-y-2 text-[15px] text-ink leading-relaxed">
          <li className="flex gap-2"><span aria-hidden>·</span> Contenido auditado, sin relleno, lo mínimo necesario para pasar exámenes.</li>
          <li className="flex gap-2"><span aria-hidden>·</span> Mobile-first. Diseñado primero para Safari iPhone, donde estudia la mayoría.</li>
          <li className="flex gap-2"><span aria-hidden>·</span> Dark mode siempre. Para estudiar de noche sin destruirte los ojos.</li>
          <li className="flex gap-2"><span aria-hidden>·</span> Sin tracking, sin spam, sin login obligatorio.</li>
          <li className="flex gap-2"><span aria-hidden>·</span> Open source en GitHub. Si querés contribuir o reportar un error, está abierto.</li>
        </ul>

        <h2 className="font-display font-bold text-[22px] tracking-tight mt-8 mb-3">Sobre esta versión</h2>
        <p className="text-[15px] text-ink leading-relaxed mb-3">
          Esta es la versión <strong>Alpha 26 — Restructure</strong>. El contenido (todas las 14
          unidades) es idéntico al que estaba en producción; la arquitectura es nueva: bundle
          inicial menor a 500KB, code splitting por módulo, y Tailwind como sistema de diseño
          unificado.
        </p>

        <Callout tone="orange" title="Aviso médico">
          ECEPT es una herramienta de estudio para estudiantes. No reemplaza guías oficiales,
          textbooks ni el criterio clínico. Si encontrás un error, abrí un issue en GitHub.
        </Callout>

        <h2 className="font-display font-bold text-[22px] tracking-tight mt-8 mb-3">Tecnología</h2>
        <p className="text-[15px] text-ink leading-relaxed">
          Vite · React 18 · TypeScript · Tailwind CSS · Framer Motion · React Router · Vercel ·
          Apple Silicon dev. El código fuente está en{" "}
          <a href="https://github.com/cbitaSama/ECEPT" target="_blank" rel="noreferrer" className="text-primary-hi hover:underline">
            github.com/cbitaSama/ECEPT
          </a>
          .
        </p>
      </article>
    </PageWrap>
  );
}
