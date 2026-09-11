import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { RouteProgress } from "~/components/loaders/route-progress";
import { BackgroundDoodles } from "~/components/portfolio/background-doodles";
import { Footer } from "~/components/portfolio/footer";
import { useReveal } from "~/components/portfolio/hooks/use-reveal";
import { MinimalAmbientGeometry } from "~/components/public/minimal-ambient-geometry";
import { MinimalEngineeringBackdrop } from "~/components/public/minimal-engineering-backdrop";
import { MinimalFooter } from "~/components/public/minimal-footer";
import { Nav } from "~/components/portfolio/nav";
import { FloatingThemeToggle } from "~/components/public/floating-theme-toggle";
import { usePublicTheme } from "~/components/public/public-theme";

const StudioShell = lazy(() => import("./studio/studio-shell"));

export function SiteShell({ children }: Readonly<{ children: ReactNode }>) {
  const { theme } = usePublicTheme();
  const isMinimal = theme === "minimal";
  useReveal(theme !== "studio", [theme]);

  useEffect(() => {
    function syncHidden() {
      document.documentElement.dataset.pageHidden = document.hidden
        ? "true"
        : "false";
    }

    syncHidden();
    document.addEventListener("visibilitychange", syncHidden);
    return () => {
      document.removeEventListener("visibilitychange", syncHidden);
      delete document.documentElement.dataset.pageHidden;
    };
  }, []);

  if (theme === "studio") {
    return <Suspense fallback={<div role="status" style={{ minHeight: "100vh", padding: "3rem", background: "#f4f1ea", color: "#293936" }}>Opening the studio…</div>}><StudioShell>{children}</StudioShell></Suspense>;
  }

  return (
    <div className="public-site relative isolate z-[1] min-h-screen overflow-x-clip">
      <div aria-hidden="true" className="public-site-theme-layer" />
      {isMinimal ? <MinimalAmbientGeometry /> : null}
      {isMinimal ? <MinimalEngineeringBackdrop /> : null}
      <RouteProgress />
      {isMinimal ? null : <BackgroundDoodles />}
      <Nav />
      <FloatingThemeToggle />
      {children}
      {isMinimal ? <MinimalFooter /> : <Footer />}
    </div>
  );
}
