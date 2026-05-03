import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { ScribbleUnder } from '~/components/portfolio/doodles'
import { crayonButtonClass, cx, pageContainerClass } from '~/components/portfolio/lib/styles'

export function PageHero({
  actions,
  description,
  eyebrow,
  title,
}: Readonly<{
  actions?: ReactNode
  description: string
  eyebrow: string
  title: string
}>) {
  return (
    <section className={cx(pageContainerClass, 'relative pt-12 md:pt-16 lg:pt-20')}>
      <div className="page-enter enter-soft motion-delay-2 relative overflow-hidden rounded-[2rem] border-[2.5px] border-ink bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(244,250,249,0.95)),var(--color-paper)] px-6 py-10 shadow-crayon-lg md:px-10 md:py-12 lg:px-14 lg:py-16">
        <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(255,200,184,0.35),transparent_56%),radial-gradient(circle_at_top_right,rgba(169,212,236,0.28),transparent_52%)]" />
        <div className="relative max-w-3xl">
          <div className="mb-4 flex items-center gap-3 font-hand text-lg text-ink-soft md:text-xl">
            <span className="h-0.5 w-10 rounded-full bg-ink-soft" />
            <span>{eyebrow}</span>
          </div>
          <h1 className="section-scribble relative inline-block font-display text-[clamp(2.8rem,8vw,5.2rem)] font-bold leading-[0.95] text-ink">
            {title}
            <span className="pointer-events-none absolute bottom-[-0.9rem] left-[-0.3rem] h-[1.4rem] w-[calc(100%+0.9rem)]">
              <ScribbleUnder color="var(--color-yellow)" strokeWidth={5} />
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-ink-soft md:text-lg">{description}</p>
          {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </div>
    </section>
  )
}

export function PageHeroActions({
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
}: Readonly<{
  primaryLabel: string
  primaryTo: string
  secondaryLabel?: string
  secondaryTo?: string
}>) {
  return (
    <>
      <Link className={crayonButtonClass('yellow')} preload="intent" to={primaryTo}>
        {primaryLabel}
      </Link>
      {secondaryLabel && secondaryTo ? (
        <Link
          className={crayonButtonClass('mint', { ghost: true })}
          preload="intent"
          to={secondaryTo}
        >
          {secondaryLabel}
        </Link>
      ) : null}
    </>
  )
}
