import { Link } from '@tanstack/react-router'
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
    <div className="minimal-blog-grid" data-reveal-sequence>
      {items.length ? (
        items.map((post, index) => (
          <Link
            className={`minimal-blog-card ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}
            data-reveal-item
            key={post.id}
            preload="intent"
            to="/blog/$slug"
            params={{ slug: post.slug }}
          >
            <div className="minimal-blog-card-meta">
              <span>{formatBlogDate(post.publishedAt)}</span>
              <span>{post.readingTimeMinutes} min</span>
            </div>
            <h2 className="minimal-blog-card-title">{post.title}</h2>
            <p className="minimal-blog-card-excerpt">{post.excerpt}</p>
            <span className="minimal-blog-card-link">Read note</span>
          </Link>
        ))
      ) : (
        <div className="minimal-grid-empty reveal reveal-soft col-span-full">
          <h2>{emptyTitle}</h2>
          {emptyText ? <p>{emptyText}</p> : null}
        </div>
      )}
    </div>
  )
}
