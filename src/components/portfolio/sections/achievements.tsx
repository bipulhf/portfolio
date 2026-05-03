import { ACHIEVEMENT_ITEMS } from '../lib/content'
import { SectionAccent } from '../section-accent'
import { SectionHeader } from '../section-header'

export function Achievements() {
  return (
    <section className="container" id="achievements">
      <SectionAccent variant="achievements" />
      <SectionHeader
        kicker="06 — wins"
        title="A few proud moments"
        underlineColor="var(--mint)"
      />
      <div className="achievements-grid reveal">
        {ACHIEVEMENT_ITEMS.map((item) => (
          <div className="medal" key={`${item.title}-${item.meta}`}>
            <div className="medal-icon">{item.icon}</div>
            <div>
              <h3>{item.title}</h3>
              <div className="medal-meta">{item.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
