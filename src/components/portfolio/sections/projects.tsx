import { Cloud, Flower, Heart, Spiral, Star, Sun } from '../doodles'
import { PROJECT_ITEMS } from '../lib/content'
import { SectionAccent } from '../section-accent'
import { SectionHeader } from '../section-header'

function ProjectCover({ index }: { index: number }) {
  const covers = [
    <Sun key="sun" size={90} />,
    <Flower key="flower" size={90} />,
    <Cloud key="cloud" size={120} />,
    <Star color="#fff" key="star" size={90} />,
    <Heart color="#fff" key="heart" size={80} />,
    <Spiral color="#3d3a2e" key="spiral" size={80} />,
  ]

  return covers[index % covers.length]
}

export function Projects() {
  return (
    <section className="container" id="projects">
      <SectionAccent variant="projects" />
      <SectionHeader
        kicker="05 — selected work"
        title="Things I&apos;ve built"
        underlineColor="var(--peach)"
      />
      <div className="projects-grid" data-reveal-sequence>
        {PROJECT_ITEMS.map((project, index) => (
          <div className="project" data-reveal-item key={project.title}>
            <div className="project-cover">
              <ProjectCover index={index} />
            </div>
            <div className="project-body">
              <h3>{project.title}</h3>
              <p className="project-desc">{project.desc}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <a className="project-link" href={project.link}>
                View case study →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
