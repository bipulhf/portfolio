import { ScribbleUnder } from './doodles'
import { cx } from './lib/styles'

type SectionHeaderProps = {
  className?: string
  description?: string
  kicker: string
  title: string
  underlineColor?: string
}

export function SectionHeader({
  className,
  description,
  kicker,
  title,
  underlineColor = 'var(--color-peach)',
}: Readonly<SectionHeaderProps>) {
  return (
    <div className={cx('max-w-[40rem]', className)}>
      <div className="type-kicker reveal reveal-soft mb-4 flex flex-wrap items-center gap-3 md:mb-5">
        <span className="h-0.5 w-8 rounded-full bg-ink-soft md:w-[2.375rem]" />
        <span>{kicker}</span>
      </div>
      <h2 className="type-display-section section-scribble reveal reveal-soft relative inline-block">
        {title}
        <span className="pointer-events-none absolute bottom-[-0.875rem] left-[-0.375rem] h-[1.375rem] w-[calc(100%+1rem)]">
          <ScribbleUnder color={underlineColor} strokeWidth={5} />
        </span>
      </h2>
      {description ? (
        <p className="type-copy reveal reveal-soft mt-5 max-w-[34rem] text-pretty md:mt-6">
          {description}
        </p>
      ) : null}
    </div>
  )
}
