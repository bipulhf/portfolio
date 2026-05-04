import type { ReactNode } from 'react'
import { RouteProgress } from '~/components/loaders/route-progress'
import { BackgroundDoodles } from '~/components/portfolio/background-doodles'
import { Footer } from '~/components/portfolio/footer'
import { useReveal } from '~/components/portfolio/hooks/use-reveal'
import { Nav } from '~/components/portfolio/nav'

export function SiteShell({ children }: Readonly<{ children: ReactNode }>) {
  useReveal()

  return (
    <div className="public-site relative isolate z-[1] min-h-screen overflow-x-clip">
      <div aria-hidden="true" className="public-site-theme-layer" />
      <RouteProgress />
      <BackgroundDoodles />
      <Nav />
      {children}
      <Footer />
    </div>
  )
}
