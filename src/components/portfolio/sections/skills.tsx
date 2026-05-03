import { SKILL_CATEGORIES } from '../lib/content'
import { SectionAccent } from '../section-accent'
import { SectionHeader } from '../section-header'

export function Skills() {
  return (
    <section className="container" id="skills">
      <SectionAccent variant="skills" />
      <SectionHeader
        kicker="04 — toolkit"
        title="Things I use"
        underlineColor="var(--yellow)"
      />
      <div className="skills-grid" data-reveal-sequence>
        {SKILL_CATEGORIES.map((category) => (
          <div className="skill-cat" data-reveal-item key={category.title}>
            <h3>{category.title}</h3>
            <div className="skill-tags">
              {category.tags.map((tag) => (
                <span className="skill-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
