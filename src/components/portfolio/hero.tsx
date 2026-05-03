import { Heart, HeroBackdrop, HeroScribble, Star, Squiggle } from './doodles'
import { crayonButtonClass, cx, pageContainerClass, surfaceCardClass } from './lib/styles'

export function Hero() {
  return (
    <section className="relative flex items-center overflow-hidden py-6 sm:py-8 lg:min-h-[40rem] lg:py-14" id="top">
      <div
        aria-hidden="true"
        className="hero-backdrop hero-backdrop-mask pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 ease-out-soft"
      >
        <HeroBackdrop />
      </div>

      <div className={cx(pageContainerClass, 'relative z-[1] grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(18rem,24rem)] md:items-center lg:grid-cols-[minmax(0,1fr)_minmax(22rem,26rem)] lg:gap-12')}>
        <div className="order-2 flex justify-center md:justify-end">
          <div className="relative w-full max-w-[21rem] px-1 pb-5 pt-2 sm:max-w-96 sm:px-2.5 sm:pb-6 sm:pt-3 md:max-w-[26rem]">
            <div
              className={cx(
                surfaceCardClass,
                'relative rotate-[1.4deg] rounded-[2rem_1.625rem_2.375rem_1.75rem/1.75rem_2.125rem_1.75rem_2.375rem] border-[2.5px] border-ink p-3.5 shadow-[6px_6px_0_var(--color-ink)] hover:-translate-y-[0.3rem] hover:shadow-[8px_10px_0_var(--color-ink)]',
                "before:pointer-events-none before:absolute before:inset-[0.55rem] before:rounded-[1.75rem_1.25rem_2rem_1.375rem/1.5rem_1.875rem_1.375rem_2rem] before:border-2 before:border-dashed before:border-ink/25 before:content-['']",
              )}
            >
              <div className="portrait-blob-mask relative aspect-[1/1.06] overflow-hidden rounded-[42%_58%_52%_48%/34%_40%_60%_66%] border-2 border-ink bg-[radial-gradient(circle_at_20%_18%,rgba(255,229,122,0.25),transparent_18%),radial-gradient(circle_at_82%_20%,rgba(169,212,236,0.24),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.32),transparent_28%)] shadow-[inset_0_-0.375rem_0_rgba(46,61,58,0.08)]">
                <img
                  alt="Portrait of Shahiduzzaman Bipul in a crayon illustration style"
                  className="block h-full w-full scale-[1.02] object-cover object-center transition-transform duration-700 ease-out-soft hover:scale-[1.045]"
                  loading="eager"
                  src="/my-image.png"
                />
              </div>
            </div>

            <div className="hero-portrait-note absolute bottom-0 left-1 inline-flex min-h-10 max-w-[12rem] items-center gap-2 rounded-2xl border-2 border-ink bg-yellow px-3 py-2 font-hand text-sm text-ink shadow-crayon-sm rotate-[-4deg] sm:left-0 sm:max-w-none sm:px-4 sm:text-base">
              <span className="size-[0.9rem] shrink-0 rounded-full border-2 border-ink bg-peach shadow-[inset_-1px_-2px_0_rgba(46,61,58,0.18)]" />
              <span>crayon mood, real me</span>
            </div>

            <div aria-hidden="true" className="hero-ornament-float absolute right-[0.35rem] top-0 rotate-[14deg]">
              <Star color="var(--color-yellow)" size={34} />
            </div>
            <div aria-hidden="true" className="hero-ornament-float delay-2 absolute left-0 top-[4.5rem] rotate-[-12deg]">
              <Heart color="var(--color-pink)" size={30} />
            </div>
            <div aria-hidden="true" className="hero-ornament-float delay-3 absolute bottom-[4.25rem] right-0 rotate-[18deg]">
              <Squiggle color="var(--color-mint)" size={34} />
            </div>
          </div>
        </div>

        <div className="order-1 relative flex max-w-[47.5rem] flex-col justify-center py-2 sm:py-4">
          <div className="mb-2 flex flex-wrap items-center gap-2.5 font-hand text-lg text-ink-soft sm:text-xl md:text-[1.25rem]">
            <span className="hero-wave inline-block">👋</span>
            <span>hello, I&apos;m</span>
          </div>

          <h1 className="relative mb-[1.125rem] mt-1 block font-display text-[clamp(3rem,15vw,6.75rem)] font-bold leading-none tracking-[-0.01em] text-ink">
            <span className="relative inline-block">Shahiduzzaman</span>{' '}
            <span className="relative inline-block">
              Bipul.
              <span className="hero-scribble pointer-events-none absolute bottom-[-0.625rem] left-[-0.625rem] h-8 w-[calc(100%+1.25rem)]">
                <HeroScribble color="var(--color-peach)" />
              </span>
            </span>
          </h1>

          <div className="mb-[1.125rem] max-w-[35rem] font-hand text-[1.18rem] leading-[1.55] text-ink sm:text-[1.3rem] lg:max-w-[32.5rem] lg:text-[1.375rem] lg:leading-[1.6]">
            A{' '}
            <span className="mx-0.5 inline-block whitespace-nowrap rounded-[1.25rem] border-[1.5px] border-ink bg-mint px-3 py-px shadow-[2px_2px_0_var(--color-ink)] rotate-[-1.2deg]">
              software engineer
            </span>{' '}
            crafting calm, considered software one careful detail at a time.
          </div>

          <p className="mb-7 max-w-[35rem] text-base leading-[1.7] text-ink-soft lg:max-w-[32.5rem]">
            Currently at <strong>InfancyIT Ltd.</strong> &middot; Computer Science,{' '}
            <strong>Shahjalal University of Science and Technology</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <a className={crayonButtonClass('yellow', { className: 'w-full justify-center sm:w-auto' })} href="/#projects">
              View my work →
            </a>
            <a className={crayonButtonClass('yellow', { className: 'w-full justify-center sm:w-auto', ghost: true })} href="/#contact">
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
