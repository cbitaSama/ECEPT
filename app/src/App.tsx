import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "@/components/shell/AppShell";
import HomeView from "@/views/HomeView";
import BootLoader from "@/components/shell/BootLoader";
import { MODULES } from "@/modules/manifest";

// ════════════════════════════════════════════════════════════════
// Cada módulo médico es un chunk lazy — el initial bundle no carga
// ninguna data clínica hasta que el usuario navega a un módulo.
// ════════════════════════════════════════════════════════════════
const ReumaModule       = lazy(() => import("@/views/modules/ReumaModule"));
const InmunoModule      = lazy(() => import("@/views/modules/InmunoModule"));
const TriadasModule     = lazy(() => import("@/views/modules/TriadasModule"));
const CirugiaModule     = lazy(() => import("@/views/modules/CirugiaModule"));
const EmergenciasModule = lazy(() => import("@/views/modules/EmergenciasModule"));
const AnatomiaModule    = lazy(() => import("@/views/modules/AnatomiaModule"));
const EpiModule         = lazy(() => import("@/views/modules/EpiModule"));
const LabsModule        = lazy(() => import("@/views/modules/LabsModule"));
const ReceptoresModule  = lazy(() => import("@/views/modules/ReceptoresModule"));
const MediadoresModule  = lazy(() => import("@/views/modules/MediadoresModule"));
const GeneralModule     = lazy(() => import("@/views/modules/GeneralModule"));
const TraumaModule      = lazy(() => import("@/views/modules/TraumaModule"));
const VocabularioModule = lazy(() => import("@/views/modules/VocabularioModule"));
const SaludMentalModule = lazy(() => import("@/views/modules/SaludMentalModule"));
const LinksModule       = lazy(() => import("@/views/modules/LinksModule"));

const SearchView         = lazy(() => import("@/views/SearchView"));
const AboutView          = lazy(() => import("@/views/AboutView"));
const FavoritesView      = lazy(() => import("@/views/FavoritesView"));
const StudyView          = lazy(() => import("@/views/StudyView"));
const FlashcardsView     = lazy(() => import("@/views/FlashcardsView"));
const FlashcardDeckView  = lazy(() => import("@/views/FlashcardDeckView"));

const MODULE_COMPONENTS: Record<string, React.ComponentType> = {
  reuma: ReumaModule,
  inmuno: InmunoModule,
  triadas: TriadasModule,
  cirugia: CirugiaModule,
  emergencias: EmergenciasModule,
  anatomia: AnatomiaModule,
  epidemiologia: EpiModule,
  labs: LabsModule,
  receptores: ReceptoresModule,
  mediadores: MediadoresModule,
  generalidades: GeneralModule,
  trauma: TraumaModule,
  vocabulario: VocabularioModule,
  "salud-mental": SaludMentalModule,
  links: LinksModule,
};

export default function App() {
  return (
    <AppShell>
      <Suspense fallback={<BootLoader />}>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/buscar" element={<SearchView />} />
          <Route path="/favoritos" element={<FavoritesView />} />
          <Route path="/estudio" element={<StudyView />} />
          <Route path="/flashcards" element={<FlashcardsView />} />
          <Route path="/flashcards/:deckId" element={<FlashcardDeckView />} />
          <Route path="/sobre" element={<AboutView />} />
          {MODULES.map((m) => {
            const C = MODULE_COMPONENTS[m.slug];
            if (!C) return null;
            return <Route key={m.slug} path={`/modulo/${m.slug}`} element={<C />} />;
          })}
          {/* Alias legacy: /reuma, /inmuno, etc. */}
          {MODULES.map((m) => {
            const C = MODULE_COMPONENTS[m.slug];
            if (!C) return null;
            return <Route key={`legacy-${m.slug}`} path={`/${m.slug}`} element={<C />} />;
          })}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
