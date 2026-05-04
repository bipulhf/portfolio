import { SectionHeader } from '../section-header'
import { SectionShell } from '../section-shell'
import { surfaceCardClass } from '../lib/styles'

const statTones = ['bg-mint', 'bg-peach rotate-[1deg]', 'bg-yellow rotate-[-1deg]', 'bg-sky'] as const

export function About() {
  return (
    <SectionShell accent="about" id="about">
      <SectionHeader
        description="I build software with a calm, product-minded approach: clear interfaces, dependable systems, and details that make things easier to use."
        kicker="01 - about"
        title="The person behind the work"
        underlineColor="var(--color-peach)"
      />

      <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] md:items-start md:gap-12 lg:gap-16">
        <div
          className={`${surfaceCardClass} reveal reveal-left relative rotate-[-1deg] rounded-[1.375rem_1.625rem_1.25rem_1.75rem/1.625rem_1.25rem_1.75rem_1.375rem] border-[2.5px] border-ink px-5 py-6 shadow-crayon-md hover:-translate-y-[0.3rem] hover:shadow-[7px_9px_0_var(--color-ink)] sm:px-6 sm:py-8 lg:px-7 lg:py-9`}
        >
          <div className="absolute left-8 top-[-0.875rem] size-7 rounded-full border-2 border-ink bg-peach shadow-[inset_-2px_-3px_0_rgba(46,61,58,0.2)]" />
          <p className="type-copy-strong">
            I build web products that aim to feel clear from the first click. The work I enjoy
            most sits between product thinking and engineering craft: shaping the interface,
            structuring the logic, and making the whole thing feel dependable.
          </p>
          <p className="type-copy-strong mt-3.5">
            Hackathons taught me how to move fast, explain ideas clearly, and build under
            pressure. Longer projects taught me the opposite skill too: slow down, refine the
            details, and leave the code easier to work with than I found it.
          </p>
          <p className="type-copy-strong mt-3.5">
            I care about readable code, thoughtful UX, and products that feel steady rather than
            noisy. That is usually the thread running through everything I make.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3.5 min-[30rem]:grid-cols-2 sm:gap-4.5" data-reveal-sequence>
          {[
            ['6', 'hackathons featured'],
            ['Web', 'product focus'],
            ['UI', 'frontend strength'],
            ['Systems', 'backend mindset'],
            ['Calm', 'build style'],
          ].map(([value, label], index) => (
            <div
              className={`${statTones[index]} ${surfaceCardClass} reveal-pop rounded-[1.125rem] border-2 border-ink p-4 text-center shadow-crayon-sm ${index === 0 ? 'min-[30rem]:col-span-2 min-[30rem]:px-5 min-[30rem]:py-5' : ''}`}
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
