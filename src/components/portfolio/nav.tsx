import { NAV_LINKS } from './lib/content'
import { ScribbleUnder, Squiggle, Star } from './doodles'

export function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="nav-shell">
          <div className="nav-row">
            <a className="nav-logo" href="#top">
              <span className="nav-logo-mark">
                <span className="dot" />
              </span>
              <span className="nav-logo-copy">
                <span className="nav-logo-name">Bipul</span>
                <span className="nav-logo-tag">software engineer portfolio</span>
              </span>
            </a>

            <div className="nav-links" role="navigation">
              {NAV_LINKS.map((link, index) => (
                <a className={`nav-link nav-link-${index + 1}`} href={link.href} key={link.href}>
                  <span>{link.label}</span>
                  <span className="underline">
                    <ScribbleUnder color="var(--ink)" strokeWidth={3} />
                  </span>
                </a>
              ))}
            </div>

            <a className="nav-status" href="#contact">
              <span className="nav-status-dot" />
              Open to collaborate
            </a>
          </div>

          <div className="nav-mobile-rail" role="navigation">
            {NAV_LINKS.map((link, index) => (
              <a className={`nav-mobile-link nav-mobile-link-${index + 1}`} href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>

          <div aria-hidden="true" className="nav-doodle nav-doodle-star">
            <Star color="var(--yellow)" size={24} />
          </div>
          <div aria-hidden="true" className="nav-doodle nav-doodle-squiggle">
            <Squiggle color="var(--mint)" size={24} />
          </div>
        </div>
      </div>
    </nav>
  )
}
