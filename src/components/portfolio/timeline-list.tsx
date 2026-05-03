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
    <div className="relative mt-10 pl-7 sm:mt-14 sm:pl-9" data-reveal-sequence>
      <div
        aria-hidden="true"
        className="absolute bottom-3 left-1.5 top-3 w-[3px] rounded-full bg-[repeating-linear-gradient(to_bottom,var(--color-ink)_0_8px,transparent_8px_16px)] sm:left-2"
      />

      {items.map((item, index) => (
        <div
          className={index % 2 === 0 ? 'reveal-left relative mb-9 last:mb-0' : 'reveal-right relative mb-9 last:mb-0'}
          data-reveal-item
          key={`${item.role}-${item.place}-${item.when}`}
        >
          <span
            aria-hidden="true"
            className={`${markerTones[index] ?? 'bg-yellow'} absolute left-[-1.75rem] top-2 inline-block size-[1.125rem] rounded-full border-[2.5px] border-ink shadow-[2px_2px_0_var(--color-ink)] sm:left-[-2.25rem] sm:size-[1.375rem]`}
          />

          <div
            className={`${surfaceCardClass} rounded-[1.125rem_1.375rem_1rem_1.5rem/1.375rem_1rem_1.5rem_1.125rem] border-2 border-ink px-4 pb-4 pt-4 shadow-[4px_4px_0_var(--color-ink)] hover:-translate-y-[0.3rem] hover:shadow-[7px_9px_0_var(--color-ink)] sm:px-5 sm:pb-5 sm:pt-5`}
          >
            <div className="mb-1.5 flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between">
              <div className="type-display-card-lg">
                {item.role}
              </div>
              <div className="type-meta inline-flex min-h-8 items-center rounded-xl border-[1.5px] border-ink bg-yellow px-2.5 py-0.5">
                {item.when}
              </div>
            </div>
            <div className="type-lead-hand mb-2 text-[1.05rem] text-ink-soft sm:text-[1.12rem] md:text-[1.16rem]">{item.place}</div>
            <ul className="type-copy-strong pl-5">
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
