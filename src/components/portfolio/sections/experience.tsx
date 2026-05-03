import { SectionHeader } from '../section-header'
import { SectionShell } from '../section-shell'
import { TimelineList } from '../timeline-list'
import { EXPERIENCE_ITEMS } from '../lib/content'

export function Experience() {
  return (
    <SectionShell accent="experience" id="experience">
      <SectionHeader
        description="Teams, roles, and the kind of engineering work I enjoy owning from first draft to stable release."
        kicker="02 - experience"
        title="Where I&apos;ve worked"
        underlineColor="var(--color-mint)"
      />
      <TimelineList items={EXPERIENCE_ITEMS} />
    </SectionShell>
  )
}
