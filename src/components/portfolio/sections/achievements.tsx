import { SectionHeader } from '../section-header'
import { SectionShell } from '../section-shell'
import { ACHIEVEMENT_ITEMS } from '../lib/content'
import { surfaceCardClass } from '../lib/styles'

const medalTones = ['bg-yellow', 'bg-peach', 'bg-mint', 'bg-sky', 'bg-pink', 'bg-lilac'] as const

export function Achievements() {
  return (
    <SectionShell accent="achievements" id="achievements">
      <SectionHeader
        description="A few wins and moments that signal how I like to learn in public, compete hard, and keep getting sharper."
        kicker="06 - wins"
        title="Selected milestones"
        underlineColor="var(--color-mint)"
      />
      <div className="mt-12 grid gap-[1.375rem] md:grid-cols-2 lg:grid-cols-6" data-reveal-sequence>
        {ACHIEVEMENT_ITEMS.map((item, index) => (
          <div
            className={`${surfaceCardClass} ${index % 3 === 0 ? 'reveal-left' : index % 3 === 1 ? 'reveal-pop' : 'reveal-right'} flex items-start gap-4 rounded-[1.375rem] border-[2.5px] border-ink p-6 shadow-crayon-md ${index % 2 === 0 ? 'rotate-[-0.8deg]' : 'rotate-[0.8deg]'} hover:-translate-y-[0.3rem] hover:shadow-[7px_9px_0_var(--color-ink)] ${index === 0 || index === 3 ? 'md:col-span-2 lg:col-span-4' : 'lg:col-span-2'}`}
            data-reveal-item
            key={`${item.title}-${item.meta}`}
          >
            <div
              className={`${medalTones[index % medalTones.length]} flex size-14 shrink-0 items-center justify-center rounded-full border-[2.5px] border-ink font-display text-[1.875rem] font-bold text-ink shadow-[2px_2px_0_var(--color-ink)]`}
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
        ))}
      </div>
    </SectionShell>
  )
}
