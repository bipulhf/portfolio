import { surfaceCardClass } from './lib/styles'

type TimelineItem = {
  bullets: readonly string[]
  place: string
  role: string
  when: string
}

const markerTones = ['bg-yellow', 'bg-peach', 'bg-mint', 'bg-sky'] as const

export function TimelineList({ items }: Readonly<{ items: readonly TimelineItem[] }>) {
  return (
    <div className="relative mt-14 pl-9" data-reveal-sequence>
      <div
        aria-hidden="true"
        className="absolute bottom-3 left-2 top-3 w-[3px] rounded-full bg-[repeating-linear-gradient(to_bottom,var(--color-ink)_0_8px,transparent_8px_16px)]"
      />

      {items.map((item, index) => (
        <div
          className={index % 2 === 0 ? 'reveal-left relative mb-9 last:mb-0' : 'reveal-right relative mb-9 last:mb-0'}
          data-reveal-item
          key={`${item.role}-${item.place}-${item.when}`}
        >
          <span
            aria-hidden="true"
            className={`${markerTones[index] ?? 'bg-yellow'} absolute left-[-2.25rem] top-2 inline-block size-[1.375rem] rounded-full border-[2.5px] border-ink shadow-[2px_2px_0_var(--color-ink)]`}
          />

          <div
            className={`${surfaceCardClass} rounded-[1.125rem_1.375rem_1rem_1.5rem/1.375rem_1rem_1.5rem_1.125rem] border-2 border-ink px-5 pb-5 pt-5 shadow-[4px_4px_0_var(--color-ink)] hover:-translate-y-[0.3rem] hover:shadow-[7px_9px_0_var(--color-ink)]`}
          >
            <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
              <div className="font-display text-[2rem] font-bold leading-none text-ink">
                {item.role}
              </div>
              <div className="inline-flex min-h-8 items-center rounded-xl border-[1.5px] border-ink bg-yellow px-2.5 py-0.5 font-hand text-base text-ink-soft">
                {item.when}
              </div>
            </div>
            <div className="mb-2 font-hand text-lg text-ink-soft">{item.place}</div>
            <ul className="pl-5">
              {item.bullets.map((bullet) => (
                <li className="mt-1 first:mt-0" key={bullet}>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}
