import { Hero } from './hero'
import type { SerializedBlog, SerializedProject } from '~/lib/content/types'
import { SiteShell } from '~/components/public/site-shell'
import { MinimalHome } from '~/components/public/minimal-home'
import { MinimalHero } from '~/components/public/minimal-hero'
import { themeOnlyClass } from '~/components/public/public-theme'
import { About } from './sections/about'
import { Achievements } from './sections/achievements'
import { Blog } from './sections/blog'
import { Contact } from './sections/contact'
import { Projects } from './sections/projects'
import { Skills } from './sections/skills'

export function PortfolioPage({
  blogs,
  projects,
}: Readonly<{
  blogs: SerializedBlog[]
  projects: SerializedProject[]
}>) {
  return (
    <SiteShell>
      <div className={themeOnlyClass('crayon')}>
        <Hero />
        <About />
        <Skills />
        <Projects items={projects} />
        <Achievements />
        <Blog items={blogs} />
        <Contact />
      </div>
      <div className={themeOnlyClass('minimal')}>
        <MinimalHero />
        <MinimalHome projects={projects} />
      </div>
    </SiteShell>
  )
}
