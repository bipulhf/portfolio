import { useEffect, useId, useState } from 'react'
import { ThemeToggle } from '~/components/public/theme-toggle'
import { PUBLIC_THEME_CONFIG } from '~/components/public/public-theme'
import { MinimalWindowControls } from '~/components/public/minimal-window-controls'
import { cx, pageContainerClass } from '~/components/portfolio/lib/styles'

export function MinimalNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const mobileMenuId = useId()
  const nav = PUBLIC_THEME_CONFIG.minimal.nav

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20)
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <nav className="theme-only-minimal fixed top-0 left-0 w-full z-50 transition-all duration-300 py-3 md:py-4">
      <div className={pageContainerClass}>
        <div
          className={cx(
            'overflow-hidden rounded-[1rem] border border-ink/10 bg-[rgba(248,242,234,0.92)] shadow-[0_12px_28px_rgba(21,18,15,0.05)] backdrop-blur-xl transition-all duration-300',
            isScrolled && 'border-ink/14 bg-[rgba(248,242,234,0.97)] shadow-[0_16px_32px_rgba(21,18,15,0.08)]'
          )}
        >
          <div className="flex items-center justify-between gap-4 border-b border-[#3a342e]/8 px-5 py-3 md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <MinimalWindowControls />
              <a className="truncate no-underline text-[11px] font-medium tracking-[0.04em] text-ink/70 [font-family:var(--minimal-mono)]" href="/">
                ~/bipul/portfolio
              </a>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle className="scale-75" />
              <a
                className="hidden rounded-[0.72rem] border border-ink/12 bg-ink px-4 py-2 text-[11px] font-semibold tracking-[0.04em] text-paper transition-all hover:bg-[#2a2520] md:inline-flex no-underline [font-family:var(--minimal-mono)]"
                href={nav.ctaHref}
              >
                {nav.ctaLabel}
              </a>

              <button
                aria-controls={mobileMenuId}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className="relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-[0.8rem] border border-ink/12 bg-white/70 lg:hidden"
                onClick={() => setMenuOpen((value) => !value)}
                type="button"
              >
                <span className={cx('h-0.5 w-5 bg-ink transition-all', menuOpen && 'translate-y-1 rotate-45')} />
                <span className={cx('h-0.5 w-5 bg-ink transition-all', menuOpen && 'opacity-0')} />
                <span className={cx('h-0.5 w-5 bg-ink transition-all', menuOpen && '-translate-y-1 -rotate-45')} />
              </button>
            </div>
          </div>

          <div className="hidden items-end gap-1 px-5 py-2 lg:flex md:px-6" role="navigation">
            {nav.links.map((link) => (
              <a
                className="rounded-[0.8rem] border border-[#3a342e]/8 bg-white/34 px-3 py-2 text-[11px] font-medium tracking-[0.04em] text-ink/68 no-underline transition-all hover:border-[#3a342e]/14 hover:bg-white/62 hover:text-ink [font-family:var(--minimal-mono)]"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div
            className={cx(
              'overflow-hidden transition-[max-height,opacity] duration-300 ease-out lg:hidden',
              menuOpen ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="px-5 pb-5 pt-3 md:px-6">
              <div className="rounded-[1rem] border border-ink/10 bg-white/70 p-3 shadow-[0_10px_24px_rgba(21,18,15,0.06)]">
                <div className="grid gap-2">
                  {nav.links.map((link, index) => (
                    <a
                      className="flex items-center justify-between rounded-[0.8rem] border border-ink/8 bg-paper/80 px-4 py-3 text-sm font-medium tracking-tight text-ink no-underline transition-colors hover:bg-white/65"
                      href={link.href}
                      key={link.href}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="[font-family:var(--minimal-mono)]">{link.label}</span>
                      <span className="text-[10px] tracking-[0.04em] text-ink/45 [font-family:var(--minimal-mono)]">
                        {`0${index + 1}`}
                      </span>
                    </a>
                  ))}
                </div>

                <a
                  className="mt-3 inline-flex w-full items-center justify-center rounded-[0.8rem] border border-ink/12 bg-ink px-4 py-3 text-[11px] font-semibold tracking-[0.04em] text-paper no-underline transition-all hover:bg-[#2a2520] [font-family:var(--minimal-mono)]"
                  href={nav.ctaHref}
                  onClick={() => setMenuOpen(false)}
                >
                  {nav.ctaLabel}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
