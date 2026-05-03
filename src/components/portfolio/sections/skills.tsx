import { SKILL_CATEGORIES } from '../lib/content'
import { SectionHeader } from '../section-header'

export function Skills() {
  return (
    <section className="container" id="skills">
      <SectionHeader
        kicker="04 — toolkit"
        title="Things I use"
        underlineColor="var(--yellow)"
      />
      <div className="skills-grid reveal">
        {SKILL_CATEGORIES.map((category) => (
          <div className="skill-cat" key={category.title}>
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
