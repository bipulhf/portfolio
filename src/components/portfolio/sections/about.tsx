import { SectionHeader } from '../section-header'
import { SectionShell } from '../section-shell'
import { surfaceCardClass } from '../lib/styles'

const statTones = ['bg-mint', 'bg-peach rotate-[1deg]', 'bg-yellow rotate-[-1deg]', 'bg-sky'] as const

export function About() {
  return (
    <SectionShell accent="about" id="about">
      <SectionHeader
        kicker="01 - about"
        title="A little about me"
        underlineColor="var(--color-peach)"
      />

      <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-[1fr_1.15fr] md:items-center md:gap-14">
        <div
          className={`${surfaceCardClass} reveal reveal-left relative rotate-[-1deg] rounded-[1.375rem_1.625rem_1.25rem_1.75rem/1.625rem_1.25rem_1.75rem_1.375rem] border-[2.5px] border-ink px-5 py-6 shadow-crayon-md hover:-translate-y-[0.3rem] hover:shadow-[7px_9px_0_var(--color-ink)] sm:px-6 sm:py-8`}
        >
          <div className="absolute left-8 top-[-0.875rem] size-7 rounded-full border-2 border-ink bg-peach shadow-[inset_-2px_-3px_0_rgba(46,61,58,0.2)]" />
          <p className="type-copy-strong">
            I&apos;m a software engineer at <strong>InfancyIT Ltd.</strong>, where I focus on
            building products that feel calm, considered, and genuinely useful.
          </p>
          <p className="type-copy-strong mt-3.5">
            I graduated in Computer Science from{' '}
            <strong>Shahjalal University of Science and Technology</strong>, and have spent the
            years since shipping products, contributing to teams, and quietly racking up hackathon
            wins on the weekends.
          </p>
          <p className="type-copy-strong mt-3.5">
            I care about the small details - the readable code, the gentle interaction, the right
            word in the right place.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4" data-reveal-sequence>
          {[
            ['10+', 'hackathons won'],
            ['4+', 'years coding'],
            ['20+', 'projects shipped'],
            ['∞', 'cups of chai'],
          ].map(([value, label], index) => (
            <div
              className={`${statTones[index]} ${surfaceCardClass} reveal-pop rounded-[1.125rem] border-2 border-ink p-4 text-center shadow-crayon-sm`}
              data-reveal-item
              key={label}
            >
              <div className="type-display-stat">{value}</div>
              <div className="type-meta mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
