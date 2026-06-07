import type { ReactNode } from "react";

// Ancho máximo y padding de página — consistencia entre todas las vistas.
export default function PageWrap({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-16">{children}</div>;
}
