import { Link } from '@tanstack/react-router'
import { crayonButtonClass, cx, pageContainerClass, surfaceCardClass } from '~/components/portfolio/lib/styles'

function formatLongDate(value: string | null) {
  if (!value) {
    return 'Draft'
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export function RichContentPage({
  backLabel,
  backTo,
  bodyHtml,
  coverImagePath,
  description,
  kicker,
  meta,
  title,
}: Readonly<{
  backLabel: string
  backTo: string
  bodyHtml: string
  coverImagePath?: string | null
  description: string
  kicker: string
  meta: string
  title: string
}>) {
  return (
    <main className={cx(pageContainerClass, 'pb-14 pt-8 sm:pt-10 md:pb-16 md:pt-16')}>
      <article className={`${surfaceCardClass} page-enter enter-soft overflow-hidden rounded-[2rem] border-[2.5px] border-ink shadow-crayon-lg`}>
        <div className="border-b-2 border-ink bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(244,250,249,0.95)),var(--color-paper)] px-5 py-7 sm:px-6 sm:py-8 md:px-10 md:py-10">
          <div className="page-enter enter-soft motion-delay-3 mb-4 flex flex-wrap items-center gap-3 font-hand text-base text-ink-soft">
            <span className="inline-flex rounded-full border border-ink/15 bg-white/70 px-3 py-1">
              {kicker}
            </span>
            <span>{meta}</span>
          </div>
          <h1 className="page-enter enter-soft motion-delay-4 max-w-4xl font-display text-[clamp(2.6rem,8vw,5rem)] font-bold leading-[0.96] text-ink">
            {title}
          </h1>
          <p className="page-enter enter-soft motion-delay-5 mt-5 max-w-3xl text-base text-ink-soft md:text-lg">{description}</p>
          <div className="page-enter enter-soft motion-delay-6 mt-6">
            <Link className={crayonButtonClass('mint', { className: 'w-full justify-center sm:w-auto', ghost: true })} preload="intent" to={backTo}>
              {backLabel}
            </Link>
          </div>
        </div>

        {coverImagePath ? (
          <div className="page-enter enter-soft motion-delay-6 border-b-2 border-ink bg-paper-shadow/30 px-3 py-3 sm:px-4 sm:py-4 md:px-6">
            <img
              alt={title}
              className="motion-cover w-full rounded-[1.1rem] border-2 border-ink object-cover shadow-crayon-sm sm:rounded-[1.5rem]"
              src={coverImagePath}
            />
          </div>
        ) : null}

        <div className="page-enter enter-soft motion-delay-6 px-5 py-7 sm:px-6 sm:py-8 md:px-10 md:py-10">
          <div
            className="rich-content mx-auto max-w-3xl"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </div>
      </article>
    </main>
  )
}

export function projectMeta(project: {
  publishedAt: string | null
  techStack: string[]
}) {
  return [formatLongDate(project.publishedAt), project.techStack.slice(0, 3).join(' · ')]
    .filter(Boolean)
    .join(' · ')
}

export function blogMeta(blog: {
  publishedAt: string | null
  readingTimeMinutes: number
}) {
  return `${formatLongDate(blog.publishedAt)} · ${blog.readingTimeMinutes} min read`
}
