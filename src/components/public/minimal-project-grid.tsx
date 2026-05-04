import { Link } from '@tanstack/react-router'
import type { SerializedProject } from '~/lib/content/types'

function formatProjectDate(value: string | null) {
  if (!value) {
    return 'Draft'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function MinimalProjectGrid({
  emptyText = '',
  emptyTitle = 'No published projects yet',
  items,
  mode = 'index',
}: Readonly<{
  emptyText?: string
  emptyTitle?: string
  items: SerializedProject[]
  mode?: 'home' | 'index'
}>) {
  if (mode === 'home') {
    return (
      <div className="minimal-project-story" data-reveal-sequence>
        {items.length ? (
          items.map((project, index) => (
            <article
              className={`minimal-project-story-panel ${index % 2 === 0 ? 'is-media-right' : 'is-media-left'} ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}
              data-reveal-item
              key={project.id}
            >
              <div className="minimal-project-story-sticky">
                <div className="minimal-project-story-shell">
                  <div className="minimal-project-story-copy">
                    <div className="minimal-project-story-index">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <span>{project.featured ? 'Featured project' : 'Selected project'}</span>
                    </div>
                    <div className="minimal-project-story-meta">
                      <span>{formatProjectDate(project.publishedAt)}</span>
                      <span>{project.techStack.slice(0, 2).join(' · ')}</span>
                    </div>
                    <h2 className="minimal-project-story-title">{project.title}</h2>
                    <p className="minimal-project-story-summary">{project.summary}</p>
                    <div className="minimal-project-story-tags">
                      {project.techStack.slice(0, 5).map((tag) => (
                        <span className="minimal-project-card-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="minimal-project-story-actions">
                      <Link
                        className="minimal-project-card-link"
                        preload="intent"
                        to="/projects/$slug"
                        params={{ slug: project.slug }}
                      >
                        Open project
                      </Link>
                      {project.liveUrl ? (
                        <a
                          className="minimal-project-card-link is-secondary"
                          href={project.liveUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Live site
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <div className="minimal-project-story-media-wrap">
                    <div className="minimal-project-story-panel-number" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="minimal-project-story-media">
                      {project.coverImagePath ? (
                        <img
                          alt={project.title}
                          className="minimal-project-story-image"
                          src={project.coverImagePath}
                        />
                      ) : (
                        <div className="minimal-project-story-image minimal-project-card-placeholder">
                          <span>{String(index + 1).padStart(2, '0')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
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

  return (
    <div className={`minimal-project-grid ${mode === 'home' ? 'is-home' : 'is-index'}`} data-reveal-sequence>
      {items.length ? (
        items.map((project, index) => (
          <article
            className={`minimal-project-card ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}
            data-reveal-item
            key={project.id}
          >
            <div className="minimal-project-card-media">
              {project.coverImagePath ? (
                <img
                  alt={project.title}
                  className="minimal-project-card-image"
                  src={project.coverImagePath}
                />
              ) : (
                <div className="minimal-project-card-image minimal-project-card-placeholder">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
              )}
            </div>
            <div className="minimal-project-card-copy">
              <div className="minimal-project-card-meta">
                <span>{project.featured ? 'Featured project' : 'Project'}</span>
                <span>{formatProjectDate(project.publishedAt)}</span>
              </div>
              <h2 className="minimal-project-card-title">{project.title}</h2>
              <p className="minimal-project-card-summary">{project.summary}</p>
              <div className="minimal-project-card-tags">
                {project.techStack.slice(0, 4).map((tag) => (
                  <span className="minimal-project-card-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="minimal-project-card-actions">
                <Link
                  className="minimal-project-card-link"
                  preload="intent"
                  to="/projects/$slug"
                  params={{ slug: project.slug }}
                >
                  Open project
                </Link>
                {project.liveUrl ? (
                  <a
                    className="minimal-project-card-link is-secondary"
                    href={project.liveUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Live site
                  </a>
                ) : null}
              </div>
            </div>
          </article>
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
