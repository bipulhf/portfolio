import { PUBLIC_THEME_CONFIG } from '~/components/public/public-theme'
import { MinimalAchievements } from '~/components/public/minimal-achievements'
import { CONTACT_LINKS } from '~/components/portfolio/lib/content'
import { cx, pageContainerClass } from '~/components/portfolio/lib/styles'
import type { SerializedProject } from '~/lib/content/types'
import { MinimalProjectGrid } from '~/components/public/minimal-project-grid'

export function MinimalHome({
  projects,
}: Readonly<{
  projects: SerializedProject[]
}>) {
  const featuredProjects = projects.filter((project) => project.featured)
  const items = (featuredProjects.length ? featuredProjects : projects).slice(0, 4)

  return (
    <main className="minimal-home pb-14 sm:pb-16 md:pb-20">
      <section className={cx(pageContainerClass, 'minimal-manifesto-stage')}>
        <div className="minimal-manifesto-shell reveal reveal-soft">
          <div className="minimal-home-label">01 / profile</div>
          <div className="minimal-manifesto-grid">
            <h2 className="minimal-manifesto-title">
              Interfaces that stay calm.
              <br />
              Systems that stay reliable.
            </h2>
            <div className="minimal-manifesto-copy">
              <p>
                I build web products with a frontend eye and a backend mindset. The goal is
                clarity on the surface, and reliability underneath it.
              </p>
              <p>
                Hackathons trained me to move fast in public. Product work taught me what should
                remain careful even when the pace is high.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={cx(pageContainerClass, 'minimal-home-stage')} id="projects">
        <div className="minimal-home-intro reveal reveal-soft">
          <div className="minimal-home-label">{PUBLIC_THEME_CONFIG.minimal.home.workEyebrow}</div>
          <div className="minimal-home-grid">
            <h2 className="minimal-home-headline">{PUBLIC_THEME_CONFIG.minimal.home.workTitle}</h2>
            <p className="minimal-home-body">{PUBLIC_THEME_CONFIG.minimal.home.workDescription}</p>
          </div>
        </div>
        <MinimalProjectGrid items={items} mode="home" />
      </section>

      <MinimalAchievements />

      <section className={cx(pageContainerClass, 'minimal-home-contact')} id="contact">
        <div className="minimal-contact-panel reveal reveal-soft">
          <div className="minimal-home-label">{PUBLIC_THEME_CONFIG.minimal.home.contactEyebrow}</div>
          <div className="minimal-contact-grid">
            <div>
              <h2 className="minimal-contact-title">{PUBLIC_THEME_CONFIG.minimal.home.contactTitle}</h2>
              <p className="minimal-contact-copy">{PUBLIC_THEME_CONFIG.minimal.home.contactDescription}</p>
            </div>
            <div className="minimal-contact-links">
              {CONTACT_LINKS.map((link, index) => (
                <a
                  className={cx('minimal-contact-link', index === 0 && 'is-accent')}
                  href={link.href}
                  key={link.label}
                  target="_blank"
                >
                  {link.label.replace(/^✉\s*/, '')}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
