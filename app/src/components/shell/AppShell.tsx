import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

interface AppShellProps {
  children: ReactNode;
}

// ════════════════════════════════════════════════════════════════
// Shell global: header sticky + main scrollable + footer.
// Dismiss el boot-loader inline de index.html al primer mount.
// Scroll-restoration al cambiar ruta.
// ════════════════════════════════════════════════════════════════
export default function AppShell({ children }: AppShellProps) {
  const location = useLocation();

  useEffect(() => {
    // Remove inline boot loader once React has mounted
    const inline = document.querySelector(".boot-loader");
    inline?.remove();
  }, []);

  useEffect(() => {
    // Scroll a top en cada navegación. El usuario espera esto en SPAs.
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-bg text-ink">
      <Header />
      <main className="flex-1 px-safe">{children}</main>
      <Footer />
    </div>
  );
}
