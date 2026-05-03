import { EDUCATION_ITEMS } from '../lib/content'
import { SectionAccent } from '../section-accent'
import { SectionHeader } from '../section-header'

export function Education() {
  return (
    <section className="container" id="education">
      <SectionAccent variant="education" />
      <SectionHeader
        kicker="03 — education"
        title="Where I studied"
        underlineColor="var(--sky)"
      />
      <div className="timeline reveal">
        {EDUCATION_ITEMS.map((item) => (
          <div className="timeline-item" key={`${item.role}-${item.place}`}>
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
