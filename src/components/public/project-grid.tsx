import { Link } from '@tanstack/react-router'
import { Cloud, Flower, Heart, Spiral, Star, Sun } from '~/components/portfolio/doodles'
import { cx, surfaceCardClass } from '~/components/portfolio/lib/styles'
import type { SerializedProject } from '~/lib/content/types'

const coverColors = ['bg-mint', 'bg-peach', 'bg-sky', 'bg-yellow', 'bg-pink', 'bg-lilac'] as const
const cardRotations = ['rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[0.5deg]'] as const

function ProjectCover({ index }: Readonly<{ index: number }>) {
  const covers = [
    <Sun key="sun" size={88} />,
    <Flower key="flower" size={88} />,
    <Cloud key="cloud" size={118} />,
    <Star color="#fff" key="star" size={88} />,
    <Heart color="#fff" key="heart" size={78} />,
    <Spiral color="#3d3a2e" key="spiral" size={78} />,
  ]

  return covers[index % covers.length]
}

export function ProjectGrid({
  emptyTitle = 'Projects coming soon',
  emptyText = 'Publish projects from the admin panel and they will appear here.',
  items,
}: Readonly<{
  emptyText?: string
  emptyTitle?: string
  items: SerializedProject[]
}>) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8" data-reveal-sequence>
      {items.length ? (
        items.map((project, index) => (
          <article
            className={cx(
              cardRotations[index % cardRotations.length],
              surfaceCardClass,
              index % 3 === 0 ? 'reveal-left' : index % 3 === 1 ? 'reveal-pop' : 'reveal-right',
              'group overflow-hidden rounded-[1.25rem_1.5rem_1.125rem_1.625rem/1.5rem_1.125rem_1.625rem_1.25rem] border-[2.5px] border-ink shadow-crayon-md hover:-translate-y-[0.3rem] hover:shadow-[7px_9px_0_var(--color-ink)]',
            )}
            data-reveal-item
            key={project.id}
          >
            <div
              className={cx(
                coverColors[index % coverColors.length],
                'relative flex min-h-32 items-center justify-center border-b-2 border-ink sm:min-h-40',
              )}
            >
              {project.coverImagePath ? (
                <img
                  alt={project.title}
                  className="motion-cover absolute inset-0 h-full w-full object-cover"
                  src={project.coverImagePath}
                />
              ) : (
                <div className="motion-cover">
                  <ProjectCover index={index} />
                </div>
              )}
            </div>
            <div className="flex h-full flex-col px-5 pb-5 pt-4 sm:px-[1.375rem] sm:pb-[1.375rem] sm:pt-5">
              <div className="mb-2 flex flex-wrap items-center gap-2 font-hand text-sm text-ink-soft">
                <span className="inline-flex rounded-full border border-ink/20 bg-white/50 px-2 py-1">
                  {project.featured ? 'featured' : 'project'}
                </span>
                {project.publishedAt ? (
                  <span>{new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(project.publishedAt))}</span>
                ) : null}
              </div>
              <h2 className="mb-2 font-display text-[1.7rem] font-bold leading-none text-ink sm:text-[2rem]">
                {project.title}
              </h2>
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
              <div className="mt-auto flex flex-wrap gap-3">
                <Link
                  className="group relative inline-flex items-center self-start font-hand text-[1.0625rem] text-ink no-underline"
                  preload="intent"
                  to="/projects/$slug"
                  params={{ slug: project.slug }}
                >
                  View case study
                  <span className="motion-arrow ml-1">→</span>
                  <span className="absolute bottom-[-0.1875rem] left-0 h-[3px] w-full origin-left scale-x-0 rounded-full bg-ink transition-transform duration-300 ease-out-soft group-hover:scale-x-100" />
                </Link>
                {project.liveUrl ? (
                  <a
                    className="inline-flex items-center font-hand text-[1.02rem] text-ink-soft no-underline transition-colors hover:text-ink"
                    href={project.liveUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Live site ↗
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        ))
      ) : (
        <div
          className={`${surfaceCardClass} reveal reveal-soft col-span-full rounded-[1.5rem] border-[2.5px] border-dashed border-ink px-6 py-10 text-center shadow-crayon-md`}
        >
          <h2 className="mb-2 font-display text-[2rem] font-bold text-ink">{emptyTitle}</h2>
          <p className="mx-auto max-w-2xl text-ink-soft">{emptyText}</p>
        </div>
      )}
    </div>
  )
}
