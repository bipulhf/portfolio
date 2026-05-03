import type { ReactNode } from 'react'
import { BackgroundDoodles } from '~/components/portfolio/background-doodles'
import { Footer } from '~/components/portfolio/footer'
import { useReveal } from '~/components/portfolio/hooks/use-reveal'
import { Nav } from '~/components/portfolio/nav'

export function SiteShell({ children }: Readonly<{ children: ReactNode }>) {
  useReveal()

  return (
    <div className="relative isolate z-[1]">
      <BackgroundDoodles />
      <Nav />
      {children}
      <Footer />
    </div>
  )
}
