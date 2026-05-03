import { ScribbleUnder } from './doodles'

type SectionHeaderProps = {
  kicker: string
  title: string
  underlineColor?: string
}

export function SectionHeader({
  kicker,
  title,
  underlineColor = 'var(--peach)',
}: SectionHeaderProps) {
  return (
    <>
      <div className="section-kicker reveal">{kicker}</div>
      <h2 className="section-title reveal">
        {title}
        <span className="scribble-under">
          <ScribbleUnder color={underlineColor} strokeWidth={5} />
        </span>
      </h2>
    </>
  )
}
