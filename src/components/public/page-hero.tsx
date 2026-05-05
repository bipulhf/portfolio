import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { ScribbleUnder } from '~/components/portfolio/doodles'
import { crayonButtonClass, cx, pageContainerClass } from '~/components/portfolio/lib/styles'
import { PUBLIC_THEME_CONFIG, usePublicTheme } from '~/components/public/public-theme'
import { MinimalPageHero } from '~/components/public/minimal-page-hero'

export function PageHero({
  actions,
  page,
}: Readonly<{
  actions?: ReactNode
  page: 'blog' | 'projects'
}>) {
  const { theme } = usePublicTheme()
  const config = PUBLIC_THEME_CONFIG.crayon.pages[page]

  if (theme === 'minimal') {
    return <MinimalPageHero actions={actions} page={page} />
  }

  return (
    <section className={cx(pageContainerClass, 'theme-only-crayon relative pt-8 sm:pt-10 md:pt-16 lg:pt-20')}>
      <div className="public-page-hero page-enter enter-soft motion-delay-2 relative overflow-hidden rounded-[1.6rem] border-[2.5px] border-ink bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(244,250,249,0.95)),var(--color-paper)] px-5 py-8 shadow-crayon-lg sm:rounded-[2rem] sm:px-6 sm:py-10 md:px-10 md:py-12 lg:px-14 lg:py-16">
        <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(255,200,184,0.35),transparent_56%),radial-gradient(circle_at_top_right,rgba(169,212,236,0.28),transparent_52%)]" />
        <div className="relative max-w-3xl">
          <div className="type-kicker page-enter enter-soft motion-delay-3 mb-4 flex flex-wrap items-center gap-3">
            <span className="h-0.5 w-8 rounded-full bg-ink-soft sm:w-10" />
            <span>{config.eyebrow}</span>
          </div>
          <h1 className="type-display-page section-scribble page-enter enter-soft motion-delay-4 relative inline-block">
            {config.title}
            <span className="pointer-events-none absolute bottom-[-0.9rem] left-[-0.3rem] h-[1.4rem] w-[calc(100%+0.9rem)]">
              <ScribbleUnder color="var(--color-yellow)" strokeWidth={5} />
            </span>
          </h1>
          <p className="type-copy page-enter enter-soft motion-delay-5 mt-5 max-w-[62ch]">
            {config.description}
          </p>
          {actions ? (
            <div className="page-enter enter-soft motion-delay-6 mt-7 flex flex-wrap gap-3">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export function PageHeroActions({
  page,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
}: Readonly<{
  page: 'blog' | 'projects'
  primaryLabel: string
  primaryTo: string
  secondaryLabel?: string
  secondaryTo?: string
}>) {
  const { theme } = usePublicTheme()
  const minimalLabels = PUBLIC_THEME_CONFIG.minimal.pages[page]

  return (
    <>
      <Link
        className={crayonButtonClass('yellow', { className: 'w-full justify-center sm:w-auto' })}
        preload="intent"
        to={primaryTo}
      >
        {theme === 'minimal' ? minimalLabels.primaryLabel : primaryLabel}
      </Link>
      {secondaryLabel && secondaryTo ? (
        <Link
          className={cx(
            crayonButtonClass('mint', {
              className: 'w-full justify-center sm:w-auto',
              ghost: true,
            }),
            'minimal-action-button minimal-inline-action',
          )}
          preload="intent"
          to={secondaryTo}
        >
          {theme === 'minimal' ? minimalLabels.secondaryLabel : secondaryLabel}
        </Link>
      ) : null}
    </>
  )
}
