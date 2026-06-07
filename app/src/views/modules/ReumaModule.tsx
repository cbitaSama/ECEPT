import DiseaseModule from "@/components/medical/DiseaseModule";
import { REUMA_SECS, RD } from "@/data/reuma";
import type { Disease, ModuleSection } from "@/types";

export default function ReumaModule() {
  return (
    <DiseaseModule
      kicker="Módulo clínico"
      title="Reumatología"
      tagline="Artritis inflamatorias e infecciosas, conectivopatías, fiebre reumática y dolor regional. Toda la unidad con criterios, tratamiento y quiz."
      icon="🦴"
      accent="#f472b6"
      sections={REUMA_SECS as ModuleSection[]}
      diseases={RD as Disease[]}
      moduleId="reuma"
    />
  );
}
