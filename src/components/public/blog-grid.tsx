import { Link } from '@tanstack/react-router'
import { Cloud, Flower, Sun } from '~/components/portfolio/doodles'
import { surfaceCardClass } from '~/components/portfolio/lib/styles'
import type { SerializedBlog } from '~/lib/content/types'

const coverTones = ['bg-peach', 'bg-mint', 'bg-sky'] as const

function BlogCover({ index }: Readonly<{ index: number }>) {
  const covers = [
    <Sun key="sun" size={70} />,
    <Flower key="flower" size={70} />,
    <Cloud key="cloud" size={90} />,
  ]

  return <div className="absolute inset-0 flex items-center justify-center">{covers[index % covers.length]}</div>
}

function formatPublishedDate(value: string | null) {
  if (!value) {
    return 'Draft'
  }

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function BlogGrid({
  emptyTitle = 'No posts published yet',
  emptyText = 'Publish writing from the admin panel and it will show up here automatically.',
  items,
}: Readonly<{
  emptyText?: string
  emptyTitle?: string
  items: SerializedBlog[]
}>) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-reveal-sequence>
      {items.length ? (
        items.map((post, index) => (
          <Link
            className={`${surfaceCardClass} ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'} group overflow-hidden rounded-[1.375rem] border-[2.5px] border-ink text-ink no-underline shadow-crayon-md hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_var(--color-ink)]`}
            data-reveal-item
            key={post.id}
            preload="intent"
            to="/blog/$slug"
            params={{ slug: post.slug }}
          >
            <div className={`${coverTones[index % coverTones.length]} relative flex min-h-[7rem] items-center justify-center border-b-2 border-ink sm:min-h-[8.125rem]`}>
              {post.coverImagePath ? (
                <img
                  alt={post.title}
                  className="motion-cover absolute inset-0 h-full w-full object-cover"
                  src={post.coverImagePath}
                />
              ) : (
                <div className="motion-cover">
                  <BlogCover index={index} />
                </div>
              )}
            </div>
            <div className="flex h-full flex-col px-5 pb-5 pt-4 sm:px-[1.375rem] sm:pb-[1.375rem] sm:pt-[1.125rem]">
              <div className="mb-1.5 font-hand text-sm text-ink-soft">
                {formatPublishedDate(post.publishedAt)} · {post.readingTimeMinutes} min
              </div>
              <h2 className="mb-2 font-display text-[1.5rem] font-bold leading-[1.05] text-ink sm:text-[1.75rem]">
                {post.title}
              </h2>
              <p className="flex-1 text-[0.9375rem] text-ink-soft">{post.excerpt}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 font-hand text-base text-ink">
                Read on <span className="motion-arrow">→</span>
              </span>
            </div>
          </Link>
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
