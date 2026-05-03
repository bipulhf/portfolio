import { SectionHeader } from '../section-header'
import { SectionShell } from '../section-shell'
import { TimelineList } from '../timeline-list'
import { EDUCATION_ITEMS } from '../lib/content'

export function Education() {
  return (
    <SectionShell accent="education" id="education">
      <SectionHeader
        description="The systems thinking, contest culture, and product curiosity that shaped how I approach software."
        kicker="03 - education"
        title="Where I studied"
        underlineColor="var(--color-sky)"
      />
      <TimelineList items={EDUCATION_ITEMS} />
    </SectionShell>
  )
}
