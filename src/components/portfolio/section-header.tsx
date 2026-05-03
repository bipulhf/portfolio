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
      <div className="reveal reveal-soft mb-5 flex flex-wrap items-center gap-3 font-hand text-lg tracking-[0.03125rem] text-ink-soft md:mb-6 md:text-[1.25rem]">
        <span className="h-0.5 w-8 rounded-full bg-ink-soft md:w-[2.375rem]" />
        <span>{kicker}</span>
      </div>
      <h2 className="section-scribble reveal reveal-soft relative mb-2 inline-block font-display text-[clamp(2.2rem,10vw,4rem)] font-bold leading-none text-ink">
        {title}
        <span className="pointer-events-none absolute bottom-[-0.875rem] left-[-0.375rem] h-[1.375rem] w-[calc(100%+1rem)]">
          <ScribbleUnder color={underlineColor} strokeWidth={5} />
        </span>
      </h2>
    </>
  )
}
