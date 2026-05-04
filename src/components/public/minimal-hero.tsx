import { PUBLIC_THEME_CONFIG } from "~/components/public/public-theme";
import {
  sanitizeTrackedHref,
  trackUmamiEvent,
} from "~/lib/analytics/umami";
import { MinimalWindowControls } from "~/components/public/minimal-window-controls";
import { ACHIEVEMENT_ITEMS } from "~/components/portfolio/lib/content";
import { pageContainerClass } from "~/components/portfolio/lib/styles";

const heroSignals = [
  ["Role", "Fullstack engineer"],
  ["Base", "Dhaka, Bangladesh"],
  ["Wins", `${ACHIEVEMENT_ITEMS.length}+ hackathons`],
] as const;

export function MinimalHero() {
  const hero = PUBLIC_THEME_CONFIG.minimal.hero;
  const charcoalStrong = "text-[#3a342e]";
  const charcoalSoft = "text-[#3a342e]/70";
  const charcoalFaint = "text-[#3a342e]/48";

  return (
    <section
      className="theme-only-minimal pb-4 pt-[6.5rem] md:pb-6 md:pt-[10rem]"
      id="top"
    >
      <div className={pageContainerClass}>
        <div className="coding-border page-enter enter-soft overflow-hidden rounded-xl">
          <div
            className={`flex items-center justify-between gap-4 border-b border-[#3a342e]/8 px-6 py-4 text-[11px] [font-family:var(--minimal-mono)] ${charcoalFaint}`}
          >
            <div className="flex items-center gap-3">
              <MinimalWindowControls />
              <span>/src/index.ts</span>
            </div>
            <span>public</span>
          </div>

          <div className="grid gap-8 px-5 py-6 md:grid-cols-[minmax(0,1.4fr)_minmax(14rem,0.7fr)] md:px-7 md:py-7">
            <div className="space-y-5">
              <p
                className={`text-[11px] uppercase tracking-[0.18em] [font-family:var(--minimal-mono)] ${charcoalFaint}`}
              >
                {hero.intro}
              </p>

              <div
                className={`space-y-1 text-[1rem] leading-7 md:text-[1.12rem] [font-family:var(--minimal-mono)] ${charcoalSoft}`}
              >
                <div className={charcoalStrong}>const engineer = {"{"}</div>
                <div className="pl-4">
                  <span className={charcoalFaint}>name:</span>{" "}
                  <span className={`font-semibold ${charcoalStrong}`}>
                    "{hero.title}"
                  </span>
                  ,
                </div>
                <div className="pl-4">
                  <span className={charcoalFaint}>role:</span>{" "}
                  <span>fullstack engineer</span>,
                </div>
                <div className="pl-4">
                  <span className={charcoalFaint}>focus:</span>{" "}
                  <span>["frontend", "product", "systems"]</span>
                </div>
                <div className={charcoalStrong}>{"}"}</div>
              </div>

              <p
                className={`max-w-2xl text-sm leading-relaxed md:text-base ${charcoalSoft}`}
              >
                {hero.lead}
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  className="rounded-[0.8rem] border border-[#3a342e]/14 bg-[#3a342e] px-5 py-2 text-[11px] font-semibold tracking-[0.05em] text-[#f5efe7] transition-all hover:bg-[#2f2a25] no-underline [font-family:var(--minimal-mono)]"
                  href="#projects"
                  onClick={() =>
                    trackUmamiEvent("cta-clicked", {
                      href: sanitizeTrackedHref("/#projects"),
                      id: "hero-projects",
                      page: "home",
                      surface: "minimal-hero",
                      theme: "minimal",
                    })
                  }
                >
                  {hero.ctaPrimary}
                </a>
                <a
                  className={`rounded-[0.8rem] border border-[#3a342e]/14 bg-white/46 px-5 py-2 text-[11px] font-semibold tracking-[0.05em] transition-all hover:bg-white/68 no-underline [font-family:var(--minimal-mono)] ${charcoalStrong}`}
                  href="#contact"
                  onClick={() =>
                    trackUmamiEvent("cta-clicked", {
                      href: sanitizeTrackedHref("/#contact"),
                      id: "hero-contact",
                      page: "home",
                      surface: "minimal-hero",
                      theme: "minimal",
                    })
                  }
                >
                  {hero.ctaSecondary}
                </a>
              </div>
            </div>

            <dl className="grid gap-3 self-start md:pt-1">
              {heroSignals.map(([label, value]) => (
                <div
                  className="rounded-[0.9rem] border border-[#3a342e]/10 bg-white/36 px-4 py-3"
                  key={label}
                >
                  <dt
                    className={`text-[10px] uppercase tracking-[0.18em] [font-family:var(--minimal-mono)] ${charcoalFaint}`}
                  >
                    {label}
                  </dt>
                  <dd
                    className={`mt-2 text-sm font-medium [font-family:var(--minimal-mono)] ${charcoalStrong}`}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
