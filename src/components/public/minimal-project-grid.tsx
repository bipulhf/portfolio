import { Link } from '@tanstack/react-router'
import { cx } from '~/components/portfolio/lib/styles'
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
      <div className="theme-only-minimal minimal-project-story" data-reveal-sequence>
        {items.length ? (
          items.map((project, index) => (
            <article
              className={cx(
                'minimal-project-story-panel group reveal-skew',
                index % 2 === 0 ? '' : 'is-media-left'
              )}
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
                      {project.liveUrl ? <span>Live preview available</span> : <span>Case study available</span>}
                      {project.repoUrl ? <span>Repository included</span> : null}
                    </div>

                    <h2 className="minimal-project-story-title">{project.title}</h2>

                    <p className="minimal-project-story-summary">{project.summary}</p>

                    {project.techStack.length ? (
                      <div className="minimal-project-story-tags">
                        {project.techStack.map((tag) => (
                          <span className="minimal-project-card-tag" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="minimal-project-story-actions">
                      <Link
                        className="minimal-project-card-link"
                        preload="intent"
                        to="/projects/$slug"
                        params={{ slug: project.slug }}
                      >
                        Details
                      </Link>
                      {project.liveUrl ? (
                        <a
                          className="minimal-project-card-link is-secondary"
                          href={project.liveUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Live
                        </a>
                      ) : null}
                      {project.repoUrl ? (
                        <a
                          className="minimal-project-card-link is-secondary"
                          href={project.repoUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Code
                        </a>
                      ) : null}
                    </div>
                  </div>
                  <div className="minimal-project-story-media-wrap">
                    <div className="minimal-project-story-media reveal-mask">
                      {project.coverImagePath ? (
                        <img
                          alt={project.title}
                          className="minimal-project-story-image"
                          src={project.coverImagePath}
                        />
                      ) : (
                        <div className="minimal-project-story-image minimal-project-card-placeholder">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                      )}
                    </div>
                    <span aria-hidden="true" className="minimal-project-story-panel-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="reveal-mask">
            <h2 className="text-2xl opacity-40">{emptyTitle}</h2>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cx(
      'theme-only-minimal minimal-project-grid',
      'is-index'
    )} data-reveal-sequence>
      {items.length ? (
        items.map((project, index) => (
          <article
            className="minimal-project-card group reveal-skew"
            data-reveal-item
            key={project.id}
          >
            <div className="minimal-project-card-media reveal-mask">
              {project.coverImagePath ? (
                <img
                  alt={project.title}
                  className="minimal-project-card-image"
                  src={project.coverImagePath}
                />
              ) : (
                <div className="minimal-project-card-image minimal-project-card-placeholder">
                  {project.title.slice(0, 2)}
                </div>
              )}
            </div>

            <div className="minimal-project-card-copy">
              <div className="minimal-project-card-meta">
                <span>{project.featured ? 'Featured project' : 'Project'}</span>
                <span>{formatProjectDate(project.publishedAt)}</span>
                {project.liveUrl ? <span>Live preview</span> : null}
                {project.repoUrl ? <span>Repository</span> : null}
              </div>

              <h2 className="minimal-project-card-title">
                {project.title}
              </h2>

              <p className="minimal-project-card-summary">
                {project.summary}
              </p>

              {project.techStack.length ? (
                <div className="minimal-project-card-tags">
                  {project.techStack.map((tag) => (
                    <span className="minimal-project-card-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="minimal-project-card-actions">
                <Link
                  className="minimal-project-card-link"
                  preload="intent"
                  to="/projects/$slug"
                  params={{ slug: project.slug }}
                >
                  Details
                </Link>
                {project.liveUrl ? (
                  <a
                    className="minimal-project-card-link is-secondary"
                    href={project.liveUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Live
                  </a>
                ) : null}
                {project.repoUrl ? (
                  <a
                    className="minimal-project-card-link is-secondary"
                    href={project.repoUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Code
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        ))
      ) : (
        <div className="col-span-full py-20 text-center reveal-mask">
          <h2 className="text-2xl font-bold uppercase tracking-tighter opacity-20">{emptyTitle}</h2>
          {emptyText ? <p className="mt-4 text-ink-soft">{emptyText}</p> : null}
        </div>
      )}
    </div>
  )
}
