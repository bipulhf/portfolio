import { useEffect, useId, useState } from 'react'
import { ThemeToggle } from '~/components/public/theme-toggle'
import { PUBLIC_THEME_CONFIG } from '~/components/public/public-theme'
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
    <nav className="theme-only-minimal fixed top-0 left-0 w-full z-50 transition-all duration-300 py-3">
      <div className={pageContainerClass}>
        <div
          className={cx(
            'rounded-[1.35rem] border border-ink/10 bg-[rgba(248,242,234,0.84)] px-4 py-3 shadow-[0_16px_40px_rgba(21,18,15,0.06)] backdrop-blur-xl transition-all duration-300 md:px-5',
            isScrolled && 'border-ink/14 bg-[rgba(248,242,234,0.96)] shadow-[0_20px_44px_rgba(21,18,15,0.1)]'
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <a className="flex items-center gap-2 no-underline text-ink group" href="/">
              <span className="rounded-full border border-ink/10 bg-yellow/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
                bipul.sh()
              </span>
            </a>

            <div className="hidden lg:flex items-center gap-8" role="navigation">
              {nav.links.map((link) => (
                <a
                  className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/70 no-underline transition-all hover:text-ink"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle className="scale-75" />
              <a
                className="hidden rounded-full border border-ink/12 bg-ink px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-paper transition-all hover:bg-yellow hover:text-ink md:inline-flex no-underline"
                href={nav.ctaHref}
              >
                {nav.ctaLabel}
              </a>

              <button
                aria-controls={mobileMenuId}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className="relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-full border border-ink/12 bg-white/70 lg:hidden"
                onClick={() => setMenuOpen((value) => !value)}
                type="button"
              >
                <span className={cx('h-0.5 w-5 bg-ink transition-all', menuOpen && 'translate-y-1 rotate-45')} />
                <span className={cx('h-0.5 w-5 bg-ink transition-all', menuOpen && 'opacity-0')} />
                <span className={cx('h-0.5 w-5 bg-ink transition-all', menuOpen && '-translate-y-1 -rotate-45')} />
              </button>
            </div>
          </div>

          <div
            className={cx(
              'overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-out lg:hidden',
              menuOpen ? 'mt-4 max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="rounded-[1.15rem] border border-ink/10 bg-white/70 p-3 shadow-[0_10px_24px_rgba(21,18,15,0.06)]">
              <div className="grid gap-2">
                {nav.links.map((link, index) => (
                  <a
                    className="flex items-center justify-between rounded-xl border border-ink/8 bg-paper/80 px-4 py-3 text-sm font-bold tracking-tight text-ink no-underline transition-colors hover:bg-yellow/40"
                    href={link.href}
                    key={link.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{link.label}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/45">
                      {`0${index + 1}`}
                    </span>
                  </a>
                ))}
              </div>

              <a
                className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-ink/12 bg-ink px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-paper no-underline transition-all hover:bg-yellow hover:text-ink"
                href={nav.ctaHref}
                onClick={() => setMenuOpen(false)}
              >
                {nav.ctaLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
