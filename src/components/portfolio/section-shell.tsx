import type { ReactNode } from 'react'
import { SectionAccent, type AccentVariant } from './section-accent'
import { cx, sectionShellClass } from './lib/styles'

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
    <section className={cx(sectionShellClass, className)} id={id}>
      <SectionAccent variant={accent} />
      {children}
    </section>
  )
}
