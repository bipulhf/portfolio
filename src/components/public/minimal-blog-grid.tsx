import { Link } from '@tanstack/react-router'
import { trackUmamiEvent } from '~/lib/analytics/umami'
import type { SerializedBlog } from '~/lib/content/types'

function formatBlogDate(value: string | null) {
  if (!value) {
    return 'Draft'
  }

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function MinimalBlogGrid({
  emptyText = '',
  emptyTitle = 'No published posts yet',
  items,
}: Readonly<{
  emptyText?: string
  emptyTitle?: string
  items: SerializedBlog[]
}>) {
  return (
    <div className="theme-only-minimal minimal-blog-grid" data-reveal-sequence>
      {items.length ? (
        items.map((post, index) => (
          <Link
            className="minimal-blog-card group reveal-skew"
            data-reveal-item
            key={post.id}
            onClick={() =>
              trackUmamiEvent('blog-opened', {
                slug: post.slug,
                source: 'minimal-blog-index',
                theme: 'minimal',
              })
            }
            preload="intent"
            to="/blog/$slug"
            params={{ slug: post.slug }}
          >
            <div className="minimal-blog-card-meta">
              {formatBlogDate(post.publishedAt)}
              <span>{post.readingTimeMinutes} min read</span>
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <h2 className="minimal-blog-card-title">{post.title}</h2>

            <p className="minimal-blog-card-excerpt">{post.excerpt}</p>

            <div className="minimal-blog-card-link">Read</div>
          </Link>
        ))
      ) : (
        <div className="py-20 text-center reveal-mask">
          <h2 className="text-2xl font-bold uppercase tracking-tighter opacity-20">{emptyTitle}</h2>
          {emptyText ? <p className="mt-4 text-ink-soft">{emptyText}</p> : null}
        </div>
      )}
    </div>
  )
}
