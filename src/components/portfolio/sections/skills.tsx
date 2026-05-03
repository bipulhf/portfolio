import { SectionHeader } from '../section-header'
import { SectionShell } from '../section-shell'
import { SKILL_CATEGORIES } from '../lib/content'
import { surfaceCardClass } from '../lib/styles'

const skillTones = ['bg-[#fff8d6] rotate-[-0.6deg]', 'bg-[#d8f1e2] rotate-[0.6deg]', 'bg-[#ffe1ce] rotate-[-0.4deg]', 'bg-[#d6eaf7] rotate-[0.4deg]'] as const

export function Skills() {
  return (
    <SectionShell accent="skills" id="skills">
      <SectionHeader
        description="A small toolkit I trust deeply, with just enough range to move comfortably from interface details to backend systems."
        kicker="04 - toolkit"
        title="Tools I reach for"
        underlineColor="var(--color-yellow)"
      />
      <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(19rem,0.9fr)_minmax(0,1.1fr)] lg:gap-6">
        <div
          className={`${surfaceCardClass} reveal reveal-left flex h-full flex-col rounded-[1.4rem_1.65rem_1.2rem_1.9rem/1.55rem_1.2rem_1.85rem_1.35rem] border-[2.5px] border-ink bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(244,250,249,0.95)),var(--color-paper)] px-5 py-6 shadow-crayon-md sm:px-6 sm:py-7 lg:px-7 lg:py-8`}
        >
          <div className="type-kicker mb-3 text-ink">Built to ship, not just to impress</div>
          <h3 className="type-display-card-lg max-w-[10ch] text-pretty">
            Calm tools, strong fundamentals, careful execution.
          </h3>
          <p className="type-copy mt-5 max-w-[31ch]">
            I like dependable tools with clear tradeoffs. The stack changes from project to project,
            but the goal stays the same: ship software that reads well, scales sensibly, and feels
            good to use.
          </p>
        </div>
        <div className="grid gap-[1.375rem] sm:grid-cols-2" data-reveal-sequence>
          {SKILL_CATEGORIES.map((category, index) => (
            <div
              className={`${skillTones[index % skillTones.length] ?? skillTones[0]} ${surfaceCardClass} reveal-pop flex min-h-[11.25rem] flex-col rounded-[1.25rem] border-2 border-ink p-[1.375rem] shadow-[4px_4px_0_var(--color-ink)] hover:-translate-y-[0.3rem] hover:shadow-[7px_9px_0_var(--color-ink)] ${index === SKILL_CATEGORIES.length - 1 ? 'sm:col-span-2' : ''}`}
              data-reveal-item
              key={category.title}
            >
              <h3 className="type-display-card-lg mb-3">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.tags.map((tag) => (
                  <span
                    className="type-tag inline-flex min-h-8 items-center rounded-[0.875rem] border-[1.5px] border-ink bg-paper px-3 py-1 shadow-[1.5px_1.5px_0_var(--color-ink)]"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
