import { useEffect, useId, useState } from 'react'
import { ThemeToggle } from '~/components/public/theme-toggle'
import { PUBLIC_THEME_CONFIG } from '~/components/public/public-theme'
import { cx, pageContainerClass } from '~/components/portfolio/lib/styles'

export function MinimalNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const mobileMenuId = useId()
  const nav = PUBLIC_THEME_CONFIG.minimal.nav

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <nav className="theme-only-minimal sticky top-0 z-50 pt-3 md:pt-5">
      <div className={pageContainerClass}>
        <div className="minimal-nav-shell page-enter enter-from-top motion-delay-1">
          <a className="minimal-nav-brand" href="/">
            <img alt={nav.logoAlt} className="minimal-nav-mark" src={nav.logoSrc} />
            <span className="minimal-nav-brand-copy">
              <span className="minimal-nav-title">{nav.title}</span>
              <span className="minimal-nav-subtitle">{nav.subtitle}</span>
            </span>
          </a>

          <div className="minimal-nav-links" role="navigation">
            {nav.links.map((link) => (
              <a className="minimal-nav-link" href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="minimal-nav-actions">
            <ThemeToggle className="hidden lg:flex" />
            <a className="minimal-nav-cta" href={nav.ctaHref}>
              {nav.ctaLabel}
            </a>
            <button
              aria-controls={mobileMenuId}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="minimal-nav-toggle lg:hidden"
              onClick={() => setMenuOpen((value) => !value)}
              type="button"
            >
              <span />
              <span />
            </button>
          </div>
        </div>

        <div
          aria-hidden={!menuOpen}
          className={cx(
            'minimal-nav-panel overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-out-soft lg:hidden',
            menuOpen ? 'mt-3 max-h-[28rem] opacity-100' : 'max-h-0 opacity-0',
          )}
          id={mobileMenuId}
        >
          <div className="minimal-nav-panel-inner">
            <ThemeToggle className="w-full" />
            <div className="minimal-nav-panel-links">
              {nav.links.map((link) => (
                <a
                  className="minimal-nav-panel-link"
                  href={link.href}
                  key={link.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <a className="minimal-nav-panel-cta" href={nav.ctaHref} onClick={() => setMenuOpen(false)}>
              {nav.ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
