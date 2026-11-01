import { lazy, Suspense } from "react";
import { Hero } from './hero'
import type { SerializedBlogCard, SerializedProjectCard } from '~/lib/content/types'
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

const StudioHome = lazy(() => import("~/components/public/studio/studio-home"));

export function PortfolioPage({
  blogs,
  projects,
}: Readonly<{
  blogs: SerializedBlogCard[]
  projects: SerializedProjectCard[]
}>) {
  const { theme } = usePublicTheme()

  if (theme === 'studio') {
    return (
      <SiteShell>
        <Suspense
          fallback={
            <div
              role="status"
              style={{
                minHeight: "100dvh",
                padding: "3rem",
                background: "#d6d3eb",
                color: "#1f2438",
              }}
            >
              Pitching the 3D basecamp…
            </div>
          }
        >
          <StudioHome blogs={blogs} projects={projects} />
        </Suspense>
      </SiteShell>
    )
  }

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
