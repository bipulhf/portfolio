import { Hero } from './hero'
import type { SerializedBlog, SerializedProject } from '~/lib/content/types'
import { SiteShell } from '~/components/public/site-shell'
import { MinimalHome } from '~/components/public/minimal-home'
import { MinimalHero } from '~/components/public/minimal-hero'
import { usePublicTheme } from '~/components/public/public-theme'
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
  const { theme } = usePublicTheme()

  return (
    <SiteShell>
      {theme === 'minimal' ? (
        <MinimalHero />
      ) : (
        <Hero />
      )}
      {theme === 'minimal' ? (
        <MinimalHome blogs={blogs} projects={projects} />
      ) : (
        <>
          <About />
          <Skills />
          <Projects items={projects} />
          <Achievements />
          <Blog items={blogs} />
          <Contact />
        </>
      )}
    </SiteShell>
  )
}
