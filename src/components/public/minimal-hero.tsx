import { PUBLIC_THEME_CONFIG } from '~/components/public/public-theme'
import { ACHIEVEMENT_ITEMS } from '~/components/portfolio/lib/content'
import { cx, pageContainerClass } from '~/components/portfolio/lib/styles'

const heroSignals = [
  'calm interfaces',
  'reliable systems',
  `${ACHIEVEMENT_ITEMS.length} hackathons`,
] as const

const marqueeWords = [
  'selected work',
  'hackathon wins',
  'frontend clarity',
  'backend reliability',
  'product systems',
] as const

export function MinimalHero() {
  const hero = PUBLIC_THEME_CONFIG.minimal.hero

  return (
    <section className="minimal-hero" id="top">
      <div className={cx(pageContainerClass, 'minimal-hero-stage')}>
        <div className="minimal-hero-grid page-enter enter-soft motion-delay-2">
          <div className="minimal-hero-copy">
            <div className="minimal-hero-kicker-wrap">
              <span className="minimal-eyebrow">{hero.intro}</span>
              <span className="minimal-hero-rule" />
            </div>

            <div className="minimal-hero-stack">
              <h1 className="minimal-hero-title">{hero.title}</h1>
              <p className="minimal-hero-lead">{hero.lead}</p>
            </div>

            <div className="minimal-hero-signals">
              {heroSignals.map((item) => (
                <span className="minimal-hero-signal" key={item}>
                  {item}
                </span>
              ))}
            </div>

            <div className="minimal-hero-actions">
              <a className="minimal-action-button is-accent" href="/#projects">
                {hero.ctaPrimary}
              </a>
              <a className="minimal-action-button" href="/#wins">
                Hackathon wins
              </a>
            </div>
          </div>

          <div className="minimal-hero-visual page-enter enter-from-right motion-delay-4">
            <div className="minimal-hero-art-frame">
              <img
                alt={hero.artAlt}
                className="minimal-hero-image"
                loading="eager"
                src={hero.artSrc}
              />
            </div>

            <div className="minimal-hero-floating-card is-top">
              <span>software engineer</span>
              <strong>{hero.support}</strong>
            </div>
            <div className="minimal-hero-floating-card is-bottom">
              <span>mode</span>
              <strong>{hero.note}</strong>
            </div>
          </div>
        </div>

        <div aria-hidden="true" className="minimal-hero-marquee">
          <div className="minimal-hero-marquee-track">
            {[...marqueeWords, ...marqueeWords].map((item, index) => (
              <span className="minimal-hero-marquee-item" key={`${item}-${index}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
