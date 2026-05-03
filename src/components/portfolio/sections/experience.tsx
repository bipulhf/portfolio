import { EXPERIENCE_ITEMS } from '../lib/content'
import { SectionAccent } from '../section-accent'
import { SectionHeader } from '../section-header'

export function Experience() {
  return (
    <section className="container" id="experience">
      <SectionAccent variant="experience" />
      <SectionHeader
        kicker="02 — experience"
        title="Where I&apos;ve worked"
        underlineColor="var(--mint)"
      />
      <div className="timeline reveal">
        {EXPERIENCE_ITEMS.map((item) => (
          <div className="timeline-item" key={`${item.role}-${item.when}`}>
            <div className="timeline-card">
              <div className="timeline-meta">
                <div className="timeline-role">{item.role}</div>
                <div className="timeline-when">{item.when}</div>
              </div>
              <div className="timeline-place">{item.place}</div>
              <ul>
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
