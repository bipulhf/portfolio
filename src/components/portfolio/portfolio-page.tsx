import { Hero } from './hero'
import type { SerializedBlog, SerializedProject } from '~/lib/content/types'
import { SiteShell } from '~/components/public/site-shell'
import { About } from './sections/about'
import { Achievements } from './sections/achievements'
import { Blog } from './sections/blog'
import { Contact } from './sections/contact'
import { Education } from './sections/education'
import { Experience } from './sections/experience'
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
      <Hero />
      <About />
      <Experience />
      <Education />
      <Skills />
      <Projects items={projects} />
      <Achievements />
      <Blog items={blogs} />
      <Contact />
    </SiteShell>
  )
}
