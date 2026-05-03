import { ScribbleUnder } from './doodles'

type SectionHeaderProps = {
  kicker: string
  title: string
  underlineColor?: string
}

export function SectionHeader({
  kicker,
  title,
  underlineColor = 'var(--color-peach)',
}: Readonly<SectionHeaderProps>) {
  return (
    <>
      <div className="type-kicker reveal reveal-soft mb-5 flex flex-wrap items-center gap-3 md:mb-6">
        <span className="h-0.5 w-8 rounded-full bg-ink-soft md:w-[2.375rem]" />
        <span>{kicker}</span>
      </div>
      <h2 className="type-display-section section-scribble reveal reveal-soft relative mb-2 inline-block">
        {title}
        <span className="pointer-events-none absolute bottom-[-0.875rem] left-[-0.375rem] h-[1.375rem] w-[calc(100%+1rem)]">
          <ScribbleUnder color={underlineColor} strokeWidth={5} />
        </span>
      </h2>
    </>
  )
}
