import { useEffect, useId, useState } from 'react'
import { ScribbleUnder, Squiggle, Star } from './doodles'
import { NAV_LINKS } from './lib/content'
import { cx, pageContainerClass } from './lib/styles'

const navLinkTones = [
  'hover:bg-yellow/45',
  'hover:bg-mint/45',
  'hover:bg-peach/45',
  'hover:bg-sky/45',
  'hover:bg-pink/45',
  'hover:bg-lilac/50',
] as const

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const mobileMenuId = useId()

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    function handleResize() {
      if (window.innerWidth >= 1280) {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('keydown', handleEscape)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 pt-2 sm:pt-3 md:pt-5">
      <div className={cx(pageContainerClass, 'px-5 sm:px-5 md:px-6 lg:px-8')}>
        <div
          className={cx(
            'nav-shell-intro relative rounded-[1.05rem] border border-ink bg-white px-3 py-3 shadow-[0_0.5rem_1.2rem_rgba(46,61,58,0.08)] transition-[translate,box-shadow,border-color] duration-300 ease-out-soft hover:-translate-y-0.5 hover:shadow-[0_0.9rem_1.8rem_rgba(46,61,58,0.12)] sm:rounded-[1.25rem] sm:px-3.5 md:px-4 md:py-[0.95rem] lg:rounded-[1.75rem_1.375rem_1.875rem_1.5rem/1.5rem_1.875rem_1.5rem_2rem] lg:px-[1.2rem] lg:py-[0.95rem]',
            "before:pointer-events-none before:absolute before:right-6 before:top-[-0.625rem] before:hidden before:h-[1.125rem] before:w-[4.5rem] before:rounded-full before:border-2 before:border-ink/30 before:bg-peach/70 before:content-[''] before:rotate-[7deg] lg:before:block",
            "after:pointer-events-none after:absolute after:inset-2 after:hidden after:rounded-[1.375rem_1.125rem_1.5rem_1.25rem/1.25rem_1.5rem_1.25rem_1.625rem] after:content-[''] lg:after:block",
          )}
        >
          <div className="relative z-[1] flex items-center gap-3 md:gap-4">
            <a className="nav-brand-intro inline-flex min-w-0 flex-1 items-center gap-2 no-underline md:gap-3.5" href="/">
              <img
                alt="Bipul logo"
                className="size-[2.45rem] rounded-[0.95rem] border-2 border-ink bg-white object-contain p-1 shadow-[3px_3px_0_var(--color-ink)] sm:size-[2.7rem] md:size-[3rem]"
                src="/logo.png"
              />
              <span className="flex min-w-0 flex-col leading-none">
                <span className="font-display text-[1.58rem] font-bold leading-[0.92] tracking-[-0.012em] sm:text-[1.8rem] md:text-[2.2rem]">
                  Bipul
                </span>
                <span className="mt-0.5 hidden font-hand text-[0.92rem] leading-[1.1] tracking-[0.035em] text-ink-soft md:inline">
                  software engineer, calm systems
                </span>
              </span>
            </a>

            <div
              className="nav-items-intro ml-auto hidden items-center gap-2 rounded-full border-2 border-ink/12 bg-white/45 p-[0.35rem] xl:flex"
              role="navigation"
            >
              {NAV_LINKS.map((link, index) => (
                <a
                  className={cx(
                    'group relative inline-flex min-h-11 items-center justify-center rounded-full px-[0.95rem] py-[0.55rem] font-hand text-[0.98rem] leading-none tracking-[0.02em] text-ink no-underline transition-[transform,background-color,box-shadow,color] duration-200 ease-out-soft hover:-translate-y-px hover:rotate-[-1deg]',
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
              className="nav-items-intro hidden min-h-11 items-center gap-[0.55rem] rounded-full border-2 border-ink bg-[linear-gradient(135deg,rgba(174,228,214,0.86),rgba(255,255,255,0.7))] px-4 py-[0.65rem] font-hand text-[0.98rem] leading-none tracking-[0.02em] text-ink no-underline shadow-[3px_3px_0_var(--color-ink)] transition-[transform,box-shadow,background-color] duration-200 ease-out-soft hover:-translate-y-px hover:rotate-[1deg] hover:shadow-[4px_4px_0_var(--color-ink)] xl:inline-flex"
              href="/#contact"
            >
              <span className="size-3 shrink-0 rounded-full border-2 border-ink bg-[#7fd893] shadow-[0_0_0_0.15rem_rgba(127,216,147,0.18)]" />
              Available for collaborations
            </a>

            <button
              aria-controls={mobileMenuId}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="nav-items-intro ml-auto inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-white/80 text-ink shadow-[2px_2px_0_var(--color-ink)] transition-[transform,background-color,box-shadow] duration-200 ease-out-soft hover:-translate-y-px hover:bg-yellow/30 hover:shadow-[3px_3px_0_var(--color-ink)] xl:hidden"
              onClick={() => setMenuOpen((value) => !value)}
              type="button"
            >
              <span className="relative block h-4 w-5">
                <span
                  className={cx(
                    'absolute left-0 top-0 h-[2px] w-full rounded-full bg-current transition-[transform,top,opacity] duration-200',
                    menuOpen && 'top-[7px] rotate-45',
                  )}
                />
                <span
                  className={cx(
                    'absolute left-0 top-[7px] h-[2px] w-full rounded-full bg-current transition-opacity duration-200',
                    menuOpen && 'opacity-0',
                  )}
                />
                <span
                  className={cx(
                    'absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-current transition-[transform,bottom] duration-200',
                    menuOpen && 'bottom-[7px] -rotate-45',
                  )}
                />
              </span>
            </button>
          </div>

          <div
            aria-hidden={!menuOpen}
            className={cx(
              'nav-menu-intro relative z-[1] overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-out-soft xl:hidden',
              menuOpen ? 'mt-2.5 max-h-[30rem] opacity-100' : 'max-h-0 opacity-0',
            )}
            id={mobileMenuId}
          >
            <div className="rounded-[1rem] border-2 border-ink/12 bg-paper/70 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {NAV_LINKS.map((link, index) => (
                  <a
                    className={cx(
                      'inline-flex min-h-11 items-center justify-center rounded-full border-2 border-ink/15 bg-white/65 px-3 py-[0.65rem] text-center font-hand text-[0.96rem] leading-none tracking-[0.02em] text-ink no-underline shadow-[0.12rem_0.12rem_0_rgba(46,61,58,0.18)] transition-[transform,background-color,box-shadow] duration-200 ease-out-soft hover:-translate-y-px hover:rotate-[-1deg]',
                      navLinkTones[index],
                    )}
                    href={link.href}
                    key={link.href}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <a
                className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-[0.55rem] rounded-full border-2 border-ink bg-[linear-gradient(135deg,rgba(174,228,214,0.86),rgba(255,255,255,0.76))] px-4 py-[0.7rem] font-hand text-[0.98rem] leading-none tracking-[0.02em] text-ink no-underline shadow-[2px_2px_0_var(--color-ink)] transition-[transform,box-shadow] duration-200 ease-out-soft hover:-translate-y-px hover:shadow-[3px_3px_0_var(--color-ink)]"
                href="/#contact"
                onClick={closeMenu}
              >
                <span className="size-3 shrink-0 rounded-full border-2 border-ink bg-[#7fd893]" />
                Available for collaborations
              </a>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[8.5rem] top-[-0.55rem] hidden rotate-[-12deg] opacity-85 lg:block"
          >
            <Star color="var(--color-yellow)" size={24} />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-0.45rem] right-[8.25rem] hidden rotate-[9deg] opacity-85 lg:block"
          >
            <Squiggle color="var(--color-mint)" size={24} />
          </div>
        </div>
      </div>
    </nav>
  )
}
