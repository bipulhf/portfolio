import { BackgroundDoodles } from './background-doodles'
import { Footer } from './footer'
import { Hero } from './hero'
import { Nav } from './nav'
import { usePageReady } from './hooks/use-page-ready'
import { useReveal } from './hooks/use-reveal'
import { About } from './sections/about'
import { Achievements } from './sections/achievements'
import { Blog } from './sections/blog'
import { Contact } from './sections/contact'
import { Education } from './sections/education'
import { Experience } from './sections/experience'
import { Projects } from './sections/projects'
import { Skills } from './sections/skills'

export function PortfolioPage() {
  useReveal()
  const pageReady = usePageReady()

  return (
    <div className={`app ${pageReady ? 'motion-ready' : ''}`}>
      <BackgroundDoodles />
      <Nav />
      <Hero />
      <About />
      <Experience />
      <Education />
      <Skills />
      <Projects />
      <Achievements />
      <Blog />
      <Contact />
      <Footer />
    </div>
  )
}
