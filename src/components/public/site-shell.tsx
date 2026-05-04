import type { ReactNode } from 'react'
import { RouteProgress } from '~/components/loaders/route-progress'
import { BackgroundDoodles } from '~/components/portfolio/background-doodles'
import { Footer } from '~/components/portfolio/footer'
import { useReveal } from '~/components/portfolio/hooks/use-reveal'
import { MinimalAmbientGeometry } from '~/components/public/minimal-ambient-geometry'
import { Nav } from '~/components/portfolio/nav'
import { MinimalScrollProgress } from '~/components/public/minimal-scroll-progress'
import { ThemeToggle } from '~/components/public/theme-toggle'
import { usePublicTheme } from '~/components/public/public-theme'

export function SiteShell({ children }: Readonly<{ children: ReactNode }>) {
  const { theme } = usePublicTheme()
  useReveal([theme])

  return (
    <div className="public-site relative isolate z-[1] min-h-screen overflow-x-clip">
      <div aria-hidden="true" className="public-site-theme-layer" />
      {theme === 'minimal' ? <MinimalAmbientGeometry /> : null}
      <MinimalScrollProgress />
      <RouteProgress />
      <BackgroundDoodles />
      <Nav />
      <div className="public-theme-toggle-rail" aria-label="Theme switcher region">
        <div className="public-theme-toggle-dock">
          <ThemeToggle />
        </div>
      </div>
      {children}
      <Footer />
    </div>
  )
}
