import { ACHIEVEMENT_ITEMS } from '~/components/portfolio/lib/content'
import { cx, pageContainerClass } from '~/components/portfolio/lib/styles'

export function MinimalAchievements() {
  return (
    <section className={cx(pageContainerClass, 'theme-only-minimal minimal-wins-stage')} id="wins">
      <div className="minimal-wins-shell">
        <div className="minimal-wins-header">
          <div className="reveal-mask">
            <div className="minimal-home-label">03 / hackathon wins</div>
          </div>
          <div className="minimal-wins-heading-grid">
            <h2 className="minimal-wins-title reveal-skew">
              Building under pressure.
            </h2>
            <p className="minimal-wins-copy reveal-mask">
              Live demos and short deadlines made me sharper about product scope and reliability.
            </p>
          </div>
        </div>

        <div className="minimal-wins-list" data-reveal-sequence>
          {ACHIEVEMENT_ITEMS.map((item, index) => (
            <article
              className="minimal-win-card group reveal-skew"
              data-reveal-item
              key={item.title}
            >
              <div className="minimal-win-index">
                <span>{item.icon}</span>
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>

              <div className="minimal-win-body">
                <div className="minimal-win-meta">{item.meta}</div>

                <h3 className="minimal-win-title">{item.title}</h3>

                <p className="minimal-win-summary">{item.summary}</p>

                <a
                  className="minimal-project-card-link is-secondary"
                  href={item.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {item.linkLabel}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
