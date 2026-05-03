import { ScribbleUnder, Squiggle, Star } from './doodles'
import { NAV_LINKS } from './lib/content'
import { cx } from './lib/styles'

const navLinkTones = [
  'hover:bg-yellow/45',
  'hover:bg-mint/45',
  'hover:bg-peach/45',
  'hover:bg-sky/45',
  'hover:bg-pink/45',
  'hover:bg-lilac/50',
] as const

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-[linear-gradient(180deg,rgba(244,250,249,0.96),rgba(244,250,249,0.72))] pt-2.5 md:pt-3">
      <div className="mx-auto w-full max-w-[73.75rem] px-0 sm:px-4 md:px-6 lg:px-8">
        <div
          className={cx(
            'page-enter enter-from-top motion-delay-1 relative rounded-[1.2rem] border border-ink bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(244,250,249,0.94)),var(--color-paper)] px-3 py-3 shadow-[0_0.5rem_1.2rem_rgba(46,61,58,0.08)] transition-[translate,box-shadow,border-color] duration-300 ease-out-soft hover:-translate-y-0.5 hover:shadow-[0_0.9rem_1.8rem_rgba(46,61,58,0.12)] sm:rounded-[1.4rem] md:px-4 md:py-[0.95rem] lg:rounded-[1.75rem_1.375rem_1.875rem_1.5rem/1.5rem_1.875rem_1.5rem_2rem] lg:px-[1.2rem] lg:py-[0.95rem]',
            "before:pointer-events-none before:absolute before:right-6 before:top-[-0.625rem] before:hidden before:h-[1.125rem] before:w-[4.5rem] before:rounded-full before:border-2 before:border-ink/30 before:bg-peach/70 before:content-[''] before:rotate-[7deg] lg:before:block",
            "after:pointer-events-none after:absolute after:inset-2 after:hidden after:rounded-[1.375rem_1.125rem_1.5rem_1.25rem/1.25rem_1.5rem_1.25rem_1.625rem] after:content-[''] lg:after:block",
          )}
        >
          <div className="relative z-[1] flex flex-wrap items-center justify-between gap-3 md:gap-4">
            <a className="inline-flex min-w-0 items-center gap-2.5 no-underline md:gap-3.5" href="/">
              <span className="inline-flex size-[2.45rem] items-center justify-center rounded-[1.1rem] border-2 border-ink bg-[linear-gradient(145deg,var(--color-peach),#ffe8dc)] shadow-[3px_3px_0_var(--color-ink)] rotate-[-4deg] md:size-[2.875rem] lg:rounded-[1.1rem_1.35rem_1rem_1.25rem/1.3rem_1rem_1.35rem_1rem]">
                <span className="size-[0.95rem] rounded-full bg-yellow shadow-[2px_2px_0_var(--color-ink)]" />
              </span>
              <span className="flex min-w-0 flex-col leading-none">
                <span className="font-display text-[1.85rem] font-bold md:text-[2.2rem]">Bipul</span>
                <span className="mt-0.5 hidden font-hand text-[0.92rem] text-ink-soft sm:inline">
                  software engineer portfolio
                </span>
              </span>
            </a>

            <div
              className="hidden items-center gap-2 rounded-full border-2 border-ink/12 bg-white/45 p-[0.35rem] xl:flex"
              role="navigation"
            >
              {NAV_LINKS.map((link, index) => (
                <a
                  className={cx(
                    'group relative inline-flex min-h-11 items-center justify-center rounded-full px-[0.95rem] py-[0.55rem] font-hand text-[1.02rem] text-ink no-underline transition-[transform,background-color,box-shadow,color] duration-200 ease-out-soft hover:-translate-y-px hover:rotate-[-1deg]',
                    navLinkTones[index],
                  )}
                  href={link.href}
                  key={link.href}
                >
                  <span>{link.label}</span>
                  <span className="pointer-events-none absolute inset-x-[0.55rem] bottom-[0.3rem] h-[0.35rem] origin-left scale-x-0 opacity-0 transition-[transform,opacity] duration-300 ease-out-soft group-hover:scale-x-100 group-hover:opacity-100">
                    <ScribbleUnder color="var(--color-ink)" strokeWidth={3} />
                  </span>
                </a>
              ))}
            </div>

            <a
              className="ml-auto hidden min-h-11 items-center gap-[0.55rem] rounded-full border-2 border-ink bg-[linear-gradient(135deg,rgba(174,228,214,0.86),rgba(255,255,255,0.7))] px-4 py-[0.65rem] font-hand text-base text-ink no-underline shadow-[3px_3px_0_var(--color-ink)] transition-[transform,box-shadow,background-color] duration-200 ease-out-soft hover:-translate-y-px hover:rotate-[1deg] hover:shadow-[4px_4px_0_var(--color-ink)] lg:inline-flex xl:ml-0"
              href="/#contact"
            >
              <span className="size-3 shrink-0 rounded-full border-2 border-ink bg-[#7fd893] shadow-[0_0_0_0.15rem_rgba(127,216,147,0.18)]" />
              Open to collaborate
            </a>
          </div>

          <div className="relative z-[1] mt-3 grid grid-cols-3 gap-2 sm:gap-[0.65rem] xl:hidden">
            {NAV_LINKS.map((link, index) => (
              <a
                className={cx(
                  'inline-flex min-h-[2.55rem] items-center justify-center rounded-full border-2 border-ink/15 bg-white/55 px-2 py-[0.55rem] text-center font-hand text-[0.92rem] text-ink no-underline shadow-[0.12rem_0.12rem_0_rgba(46,61,58,0.18)] transition-[transform,background-color,box-shadow] duration-200 ease-out-soft hover:-translate-y-px hover:rotate-[-1deg] sm:px-3 sm:text-[0.96rem] lg:text-[0.98rem]',
                  navLinkTones[index],
                )}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div aria-hidden="true" className="pointer-events-none absolute left-[8.5rem] top-[-0.55rem] hidden rotate-[-12deg] opacity-85 lg:block">
            <Star color="var(--color-yellow)" size={24} />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute bottom-[-0.45rem] right-[8.25rem] hidden rotate-[9deg] opacity-85 lg:block">
            <Squiggle color="var(--color-mint)" size={24} />
          </div>
        </div>
      </div>
    </nav>
  )
}
