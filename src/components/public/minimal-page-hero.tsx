import type { ReactNode } from 'react'
import { PUBLIC_THEME_CONFIG } from '~/components/public/public-theme'
import { MinimalWindowControls } from '~/components/public/minimal-window-controls'
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
    <section className={cx(pageContainerClass, 'theme-only-minimal relative pt-12 md:pt-20 lg:pt-24')} id="top">
      <div className="coding-border minimal-page-hero-shell page-enter enter-soft motion-delay-2">
        <div className="flex items-center justify-between border-b border-[#3a342e]/8 px-5 py-4 sm:px-6 md:px-7 text-[11px] text-[#3a342e]/46 [font-family:var(--minimal-mono)]">
          <div className="flex items-center gap-3">
            <MinimalWindowControls />
            <span>{config.eyebrow}</span>
          </div>
          <span>public</span>
        </div>
        <div className="px-5 py-6 sm:px-6 sm:py-7 md:px-7 md:py-8">
          <div className="minimal-page-hero-header">
            <div className="minimal-page-hero-label">index</div>
            <h1 className="minimal-page-hero-title">{config.title}</h1>
          </div>
          <div className="minimal-page-hero-lower">
            <p className="minimal-page-hero-description">{config.description}</p>
            {actions ? <div className="minimal-page-hero-actions">{actions}</div> : null}
          </div>
        </div>
      </div>
    </section>
  )
}
