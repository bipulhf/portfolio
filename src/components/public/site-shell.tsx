import type { ReactNode } from 'react'
import { BackgroundDoodles } from '~/components/portfolio/background-doodles'
import { Footer } from '~/components/portfolio/footer'
import { usePageReady } from '~/components/portfolio/hooks/use-page-ready'
import { useReveal } from '~/components/portfolio/hooks/use-reveal'
import { cx } from '~/components/portfolio/lib/styles'
import { Nav } from '~/components/portfolio/nav'

export function SiteShell({ children }: Readonly<{ children: ReactNode }>) {
  useReveal()
  const pageReady = usePageReady()

  return (
    <div className={cx('relative isolate z-[1]', pageReady && 'motion-ready')}>
      <BackgroundDoodles />
      <Nav />
      {children}
      <Footer />
    </div>
  )
}
