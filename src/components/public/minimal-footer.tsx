import { PUBLIC_THEME_CONFIG } from "~/components/public/public-theme";
import { pageContainerClass } from "~/components/portfolio/lib/styles";

export function MinimalFooter() {
  const currentYear = new Date().getFullYear();
  const headline = PUBLIC_THEME_CONFIG.minimal.footerText
    .replace(`© YEAR Bipul Hf`, "")
    .trim();

  return (
    <footer className={`${pageContainerClass} theme-only-minimal py-5`}>
      <div className="minimal-footer-shell">
        <div className="flex flex-col gap-1">
          <div className="minimal-footer-copy">
            {headline} &copy; {currentYear}
          </div>
        </div>
      </div>
    </footer>
  );
}
