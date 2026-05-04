import { PUBLIC_THEME_CONFIG, themeOnlyClass } from '~/components/public/public-theme'
import {
  sanitizeTrackedHref,
  trackUmamiEvent,
} from '~/lib/analytics/umami'
import { Heart, HeroBackdrop, HeroScribble, Star, Squiggle } from './doodles'
import {
  crayonButtonClass,
  cx,
  pageContainerClass,
  surfaceCardClass,
} from './lib/styles'

export function Hero() {
  return (
    <section
      className={cx(
        'relative flex items-center overflow-hidden py-6 sm:py-8 lg:min-h-[40rem] lg:py-14',
        themeOnlyClass('crayon'),
      )}
      id="top"
    >
      <div
        aria-hidden="true"
        className="hero-backdrop hero-backdrop-intro hero-backdrop-mask pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 ease-out-soft"
      >
        <HeroBackdrop />
      </div>

      <div
        className={cx(
          pageContainerClass,
          'relative z-[1] grid gap-7 md:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,26rem)] lg:items-center lg:gap-12',
        )}
      >
        <div className="hero-portrait-intro order-2 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[19.5rem] px-1 pb-5 pt-2 sm:max-w-[22rem] sm:px-2.5 sm:pb-6 sm:pt-3 md:max-w-[24rem] lg:max-w-[26rem]">
            <div
              className={cx(
                surfaceCardClass,
                "relative rotate-[1.4deg] rounded-[2rem_1.625rem_2.375rem_1.75rem/1.75rem_2.125rem_1.75rem_2.375rem] border-[2.5px] border-ink p-3.5 shadow-[6px_6px_0_var(--color-ink)] hover:-translate-y-[0.3rem] hover:shadow-[8px_10px_0_var(--color-ink)]",
                "before:pointer-events-none before:absolute before:inset-[0.55rem] before:rounded-[1.75rem_1.25rem_2rem_1.375rem/1.5rem_1.875rem_1.375rem_2rem] before:border-2 before:border-dashed before:border-ink/25 before:content-['']",
              )}
            >
              <div className="portrait-blob-mask relative aspect-[1/1.06] overflow-hidden rounded-[42%_58%_52%_48%/34%_40%_60%_66%] border-2 border-ink bg-[radial-gradient(circle_at_20%_18%,rgba(255,229,122,0.25),transparent_18%),radial-gradient(circle_at_82%_20%,rgba(169,212,236,0.24),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.32),transparent_28%)] shadow-[inset_0_-0.375rem_0_rgba(46,61,58,0.08)]">
                <img
                  alt={PUBLIC_THEME_CONFIG.crayon.hero.artAlt}
                  className="block h-full w-full scale-[1.02] object-cover object-center transition-transform duration-700 ease-out-soft hover:scale-[1.045]"
                  loading="eager"
                  src={PUBLIC_THEME_CONFIG.crayon.hero.artSrc}
                />
              </div>
            </div>

            <div className="hero-portrait-note absolute bottom-0 left-1 inline-flex min-h-10 max-w-[12rem] items-center gap-2 rounded-2xl border-2 border-ink bg-yellow px-3 py-2 font-hand text-sm text-ink shadow-crayon-sm rotate-[-4deg] sm:left-0 sm:max-w-none sm:px-4 sm:text-base">
              <span className="size-[0.9rem] shrink-0 rounded-full border-2 border-ink bg-peach shadow-[inset_-1px_-2px_0_rgba(46,61,58,0.18)]" />
              <span>{PUBLIC_THEME_CONFIG.crayon.hero.note}</span>
            </div>

            <div
              aria-hidden="true"
              className="hero-ornament-float absolute right-[0.35rem] top-0 rotate-[14deg]"
            >
              <Star color="var(--color-yellow)" size={34} />
            </div>
            <div
              aria-hidden="true"
              className="hero-ornament-float delay-2 absolute left-0 top-[4.5rem] rotate-[-12deg]"
            >
              <Heart color="var(--color-pink)" size={30} />
            </div>
            <div
              aria-hidden="true"
              className="hero-ornament-float delay-3 absolute bottom-[4.25rem] right-0 rotate-[18deg]"
            >
              <Squiggle color="var(--color-mint)" size={34} />
            </div>
          </div>
        </div>

        <div className="order-1 relative flex max-w-[42rem] flex-col justify-center py-2 sm:py-4 md:max-w-[46rem] lg:max-w-[47.5rem]">
          <div
            className="hero-copy-item type-kicker mb-2 flex flex-wrap items-center gap-3 md:mb-3"
            style={{ ['--hero-delay' as string]: '40ms' }}
          >
            <span className="inline-flex items-center gap-2.5 text-ink-soft">
              <span className="h-0.5 w-7 rounded-full bg-peach/90 md:w-9" />
              <span className="font-hand text-[1rem] tracking-[0.03em] text-ink-soft/95">
                {PUBLIC_THEME_CONFIG.crayon.hero.intro}
              </span>
            </span>
          </div>

          <h1
            className="type-display-hero hero-copy-item relative mb-[1.125rem] mt-1 block"
            style={{ ['--hero-delay' as string]: '90ms' }}
          >
            <span className="relative inline-block">
              {PUBLIC_THEME_CONFIG.crayon.hero.title}
              <span className="hero-scribble pointer-events-none absolute bottom-[-0.625rem] left-[-0.625rem] h-8 w-[calc(100%+1.25rem)]">
                <HeroScribble color="var(--color-peach)" />
              </span>
            </span>
          </h1>

          <div
            className="type-lead-hand hero-copy-item mb-[1.125rem] max-w-[35rem] lg:max-w-[32.5rem]"
            style={{ ['--hero-delay' as string]: '140ms' }}
          >
            A{' '}
            <span className="mx-0.5 inline-block whitespace-nowrap rounded-[1.25rem] border-[1.5px] border-ink bg-mint px-3 py-px shadow-[2px_2px_0_var(--color-ink)] rotate-[-1.2deg]">
              {PUBLIC_THEME_CONFIG.crayon.hero.support}
            </span>{' '}
            crafting calm, considered software one careful detail at a time.
          </div>

          <div
            className="hero-copy-item flex flex-wrap items-center gap-3.5"
            style={{ ['--hero-delay' as string]: '240ms' }}
          >
            <a
              className={crayonButtonClass('yellow', {
                className: 'w-full justify-center sm:w-auto',
              })}
              href="/#projects"
              onClick={() =>
                trackUmamiEvent('cta-clicked', {
                  href: sanitizeTrackedHref('/#projects'),
                  id: 'hero-projects',
                  page: 'home',
                  surface: 'crayon-hero',
                  theme: 'crayon',
                })
              }
            >
              {PUBLIC_THEME_CONFIG.crayon.hero.ctaPrimary}
            </a>
            <a
              className={crayonButtonClass('yellow', {
                className: 'w-full justify-center sm:w-auto',
                ghost: true,
              })}
              href="/#contact"
              onClick={() =>
                trackUmamiEvent('cta-clicked', {
                  href: sanitizeTrackedHref('/#contact'),
                  id: 'hero-contact',
                  page: 'home',
                  surface: 'crayon-hero',
                  theme: 'crayon',
                })
              }
            >
              {PUBLIC_THEME_CONFIG.crayon.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
