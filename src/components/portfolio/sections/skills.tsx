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
      <div className="mt-12 grid items-stretch gap-[1.125rem] sm:grid-cols-2 lg:gap-[1.25rem]" data-reveal-sequence>
        {SKILL_CATEGORIES.map((category, index) => (
          <div
            className={`${skillTones[index % skillTones.length] ?? skillTones[0]} ${surfaceCardClass} reveal-pop flex flex-col gap-3 rounded-[1.25rem] border-2 border-ink p-5 shadow-[4px_4px_0_var(--color-ink)] hover:-translate-y-[0.3rem] hover:shadow-[7px_9px_0_var(--color-ink)] sm:p-[1.375rem]`}
            data-reveal-item
            key={category.title}
          >
            <h3 className="type-display-card-lg text-pretty">
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
    </SectionShell>
  )
}
