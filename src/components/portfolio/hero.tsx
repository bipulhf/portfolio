import { HeroBackdrop, HeroScribble } from './doodles'

export function Hero() {
  return (
    <section className="hero" id="top">
      <div aria-hidden="true" className="hero-backdrop">
        <HeroBackdrop />
      </div>
      <div className="hero-inner container">
        <div className="hero-text">
          <div className="hero-greet">
            <span className="hero-wave">👋</span>
            <span>hello, I&apos;m</span>
          </div>
          <h1 className="hero-name">
            <span className="name-word">Shahiduzzaman</span>{' '}
            <span className="name-word">
              Bipul.
              <span className="scribble-under">
                <HeroScribble color="var(--peach)" />
              </span>
            </span>
          </h1>
          <div className="hero-role">
            A <span className="role-pill">software engineer</span> crafting calm, considered software
            {' '}one careful detail at a time.
          </div>
          <p className="hero-blurb">
            Currently at <strong>InfancyIT Ltd.</strong> &middot; Computer Science,
            {' '}<strong>Shahjalal University of Science and Technology</strong>.
          </p>
          <div className="hero-cta">
            <a className="btn" href="#projects">
              View my work →
            </a>
            <a className="btn ghost" href="#contact">
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
