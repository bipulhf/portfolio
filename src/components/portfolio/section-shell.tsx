import type { ReactNode } from 'react'
import { SectionAccent, type AccentVariant } from './section-accent'
import { cx, sectionFrameClass, sectionInnerClass, sectionShellClass } from './lib/styles'

type SectionShellProps = {
  accent: AccentVariant
  children: ReactNode
  className?: string
  id: string
}

export function SectionShell({
  accent,
  children,
  className,
  id,
}: Readonly<SectionShellProps>) {
  return (
    <section className={cx(sectionShellClass, `portfolio-section--${accent}`, className)} id={id}>
      <div className={sectionFrameClass}>
        <div aria-hidden="true" className="portfolio-section-band" />
        <div className={sectionInnerClass}>
          <SectionAccent variant={accent} />
          {children}
        </div>
      </div>
    </section>
  )
}
