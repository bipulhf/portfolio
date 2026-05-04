import { SectionHeader } from '../section-header'
import { SectionShell } from '../section-shell'
import { ACHIEVEMENT_ITEMS } from '../lib/content'
import { cx, surfaceCardClass } from '../lib/styles'

const medalTones = ['bg-yellow', 'bg-peach', 'bg-mint', 'bg-sky', 'bg-pink', 'bg-lilac'] as const

export function Achievements() {
  return (
    <SectionShell accent="achievements" id="achievements">
      <SectionHeader
        description="A chapter of late nights, team effort, and 24-hour dopamine rushes. These hackathons shaped how I build, present, and grow under pressure."
        kicker="06 - wins"
        title="Hackathons that shaped me"
        underlineColor="var(--color-mint)"
      />
      <div className="mt-12 grid gap-[1.375rem] md:grid-cols-2 lg:grid-cols-6" data-reveal-sequence>
        {ACHIEVEMENT_ITEMS.map((item, index) => (
          <div
            className={`${surfaceCardClass} ${index % 3 === 0 ? 'reveal-left' : index % 3 === 1 ? 'reveal-pop' : 'reveal-right'} flex h-full flex-col gap-5 rounded-[1.375rem] border-[2.5px] border-ink p-6 shadow-crayon-md ${index % 2 === 0 ? 'rotate-[-0.8deg]' : 'rotate-[0.8deg]'} hover:-translate-y-[0.3rem] hover:shadow-[7px_9px_0_var(--color-ink)] lg:col-span-2`}
            data-reveal-item
            key={`${item.title}-${item.meta}`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`${medalTones[index % medalTones.length]} flex size-14 shrink-0 items-center justify-center rounded-full border-[2.5px] border-ink font-display text-[1.55rem] font-bold text-ink shadow-[2px_2px_0_var(--color-ink)]`}
              >
                {item.icon}
              </div>
              <div>
                <h3 className="type-display-card-md mb-1">
                  {item.title}
                </h3>
                <div className="type-meta">{item.meta}</div>
              </div>
            </div>

            <p className="type-copy">
              {item.summary}
            </p>

            <div className="mt-auto">
              <a
                className={cx(
                  'type-link-hand inline-flex items-center gap-2 rounded-full border-2 border-ink/18 bg-white/60 px-3 py-2 no-underline transition-[transform,background-color] duration-200 ease-out-soft hover:-translate-y-px hover:bg-white/85',
                )}
                href={item.href}
                rel="noreferrer"
                target="_blank"
              >
                {item.linkLabel}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
