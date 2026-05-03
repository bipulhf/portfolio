import { Cloud, Flower, Heart, Spiral, Star, Sun } from '../doodles'
import { SectionHeader } from '../section-header'
import { SectionShell } from '../section-shell'
import { surfaceCardClass } from '../lib/styles'
import type { SerializedProject } from '~/lib/content/types'

const coverColors = ['bg-mint', 'bg-peach', 'bg-sky', 'bg-yellow', 'bg-pink', 'bg-lilac'] as const
const cardRotations = ['rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[0.5deg]'] as const

function ProjectCover({ index }: Readonly<{ index: number }>) {
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

export function Projects({ items }: Readonly<{ items: SerializedProject[] }>) {
  return (
    <SectionShell accent="projects" id="projects">
      <SectionHeader
        kicker="05 - selected work"
        title="Things I&apos;ve built"
        underlineColor="var(--color-peach)"
      />
      <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3 lg:gap-8" data-reveal-sequence>
        {items.length ? items.map((project, index) => (
          <div
            className={`${cardRotations[index % cardRotations.length]} ${surfaceCardClass} ${index % 3 === 0 ? 'reveal-left' : index % 3 === 1 ? 'reveal-pop' : 'reveal-right'} overflow-hidden rounded-[1.25rem_1.5rem_1.125rem_1.625rem/1.5rem_1.125rem_1.625rem_1.25rem] border-[2.5px] border-ink shadow-crayon-md hover:-translate-y-[0.3rem] hover:shadow-[7px_9px_0_var(--color-ink)]`}
            data-reveal-item
            key={project.title}
          >
            <div
              className={`${coverColors[index % coverColors.length]} relative flex min-h-40 items-center justify-center border-b-2 border-ink`}
            >
              <ProjectCover index={index} />
            </div>
            <div className="flex h-full flex-col px-[1.375rem] pb-[1.375rem] pt-5">
              <h3 className="mb-2 font-display text-[2rem] font-bold leading-none text-ink">
                {project.title}
              </h3>
              <p className="mb-3.5 flex-1 text-[0.9375rem] text-ink-soft">{project.summary}</p>
              <div className="mb-3.5 flex flex-wrap gap-2">
                {project.techStack.map((tag) => (
                  <span
                    className="inline-flex min-h-8 items-center rounded-[0.875rem] border-[1.5px] border-ink bg-paper px-3 py-1 font-hand text-[0.8125rem] text-ink"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <a
                className="group relative inline-flex items-center self-start font-hand text-[1.0625rem] text-ink no-underline"
                href={`/projects/${project.slug}`}
              >
                View case study →
                <span className="absolute bottom-[-0.1875rem] left-0 h-[3px] w-full origin-left scale-x-0 rounded-full bg-ink transition-transform duration-300 ease-out-soft group-hover:scale-x-100" />
              </a>
            </div>
          </div>
        )) : (
          <div className={`${surfaceCardClass} reveal reveal-soft col-span-full rounded-[1.5rem] border-[2.5px] border-dashed border-ink px-6 py-10 text-center shadow-crayon-md`}>
            <h3 className="mb-2 font-display text-[2rem] font-bold text-ink">Projects coming soon</h3>
            <p className="mx-auto max-w-2xl text-ink-soft">
              Publish projects from the admin panel and they&apos;ll show up here automatically.
            </p>
          </div>
        )}
      </div>
    </SectionShell>
  )
}
