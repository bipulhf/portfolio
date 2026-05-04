import type { ReactNode } from 'react'
import { PUBLIC_THEME_CONFIG } from '~/components/public/public-theme'
import { cx, pageContainerClass } from '~/components/portfolio/lib/styles'

export function MinimalPageHero({
  actions,
  page,
}: Readonly<{
  actions?: ReactNode
  page: 'blog' | 'projects'
}>) {
  const config = PUBLIC_THEME_CONFIG.minimal.pages[page]

  return (
    <section className={cx(pageContainerClass, 'theme-only-minimal relative pt-10 md:pt-16 lg:pt-20')}>
      <div className="minimal-page-hero-shell page-enter enter-soft motion-delay-2">
        <div className="minimal-page-hero-header">
          <div className="minimal-page-hero-label">{config.eyebrow}</div>
          <h1 className="minimal-page-hero-title">{config.title}</h1>
        </div>
        <div className="minimal-page-hero-lower">
          <p className="minimal-page-hero-description">{config.description}</p>
          {actions ? <div className="minimal-page-hero-actions">{actions}</div> : null}
        </div>
      </div>
    </section>
  )
}
