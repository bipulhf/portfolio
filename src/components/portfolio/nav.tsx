import { NAV_LINKS } from './lib/content'
import { ScribbleUnder } from './doodles'

export function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a className="nav-logo" href="#top">
          <span className="dot" />
          <span>Bipul</span>
        </a>
        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
              <span className="underline">
                <ScribbleUnder color="var(--ink)" strokeWidth={3} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
