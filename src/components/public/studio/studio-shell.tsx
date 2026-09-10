import { Suspense, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { FloatingThemeToggle } from "~/components/public/floating-theme-toggle";
import { RouteProgress } from "~/components/loaders/route-progress";
import { CONTACT_LINKS } from "~/components/portfolio/lib/content";
import "~/styles/studio.css";

export default function StudioShell({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="public-site studio-site">
      <a className="studio-skip" href="#studio-content">
        Skip to content
      </a>
      <RouteProgress />
      <header className="studio-nav studio-container">
        <Link className="studio-brand" to="/" aria-label="Bipul, home">
          <span className="studio-brand-mark" aria-hidden="true">
            b.
          </span>
          <span>
            Bipul
            <span className="studio-brand-sub">
              Independent thinking. Thoughtful software.
            </span>
          </span>
        </Link>
        <button
          className="studio-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="studio-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
        <nav
          id="studio-navigation"
          className={`studio-nav-links${menuOpen ? " is-open" : ""}`}
          aria-label="Main navigation"
          onClick={() => setMenuOpen(false)}
        >
          <Link to="/projects" activeProps={{ "aria-current": "page" }}>
            Work
          </Link>
          <Link to="/blog" activeProps={{ "aria-current": "page" }}>
            Notes
          </Link>
          <Link
            to="/"
            hash="about"
            activeOptions={{ exact: true, includeHash: true }}
          >
            About
          </Link>
          <a className="studio-nav-contact" href={CONTACT_LINKS[0].href}>
            Let's talk <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>
      <div id="studio-content" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="studio-container studio-loading" role="status">
              Opening the studio…
            </div>
          }
        >
          {children}
        </Suspense>
      </div>
      <footer className="studio-footer studio-container">
        <Link className="studio-brand" to="/">
          b.
        </Link>
        <span>© {new Date().getFullYear()} Bipul Hf</span>
        <span>Designed with depth. Built with care.</span>
        <a href="#studio-content">Back to top ↑</a>
      </footer>
      <FloatingThemeToggle />
    </div>
  );
}
