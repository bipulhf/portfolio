import { ACHIEVEMENT_ITEMS } from '~/components/portfolio/lib/content'
import { cx, pageContainerClass } from '~/components/portfolio/lib/styles'

export function MinimalAchievements() {
  return (
    <section className={cx(pageContainerClass, 'minimal-wins-stage')} id="wins">
      <div className="minimal-wins-shell">
        <div className="minimal-wins-header reveal reveal-soft">
          <div className="minimal-home-label">03 / hackathon wins</div>
          <div className="minimal-wins-heading-grid">
            <h2 className="minimal-wins-title">Hackathons taught me how to build under pressure.</h2>
            <p className="minimal-wins-copy">
              Live demos, short deadlines, and high-stakes judging made me sharper about product
              scope, reliability, and shipping what matters first.
            </p>
          </div>
        </div>

        <div className="minimal-wins-list" data-reveal-sequence>
          {ACHIEVEMENT_ITEMS.map((item, index) => (
            <article
              className={cx(
                'minimal-win-card',
                index % 2 === 0 ? 'reveal-left' : 'reveal-right',
              )}
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
                <a className="minimal-project-card-link" href={item.href} rel="noreferrer" target="_blank">
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
