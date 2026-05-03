import { Heart, HeroBackdrop, HeroScribble, Star, Squiggle } from './doodles'

export function Hero() {
  return (
    <section className="hero" id="top">
      <div aria-hidden="true" className="hero-backdrop">
        <HeroBackdrop />
      </div>
      <div className="hero-inner container">
        <div className="hero-portrait page-enter motion-delay-4">
          <div className="hero-portrait-stack">
            <div className="hero-portrait-card">
              <div className="hero-portrait-shape">
                <img
                  alt="Portrait of Shahiduzzaman Bipul in a crayon illustration style"
                  className="hero-portrait-image"
                  loading="eager"
                  src="/my-image.png"
                />
              </div>
            </div>
            <div className="hero-portrait-note">
              <span className="hero-portrait-pin" />
              <span>crayon mood, real me</span>
            </div>
            <div aria-hidden="true" className="hero-portrait-doodle hero-portrait-doodle-star hero-ornament-float">
              <Star color="var(--yellow)" size={34} />
            </div>
            <div aria-hidden="true" className="hero-portrait-doodle hero-portrait-doodle-heart hero-ornament-float delay-2">
              <Heart color="var(--pink)" size={30} />
            </div>
            <div aria-hidden="true" className="hero-portrait-doodle hero-portrait-doodle-squiggle hero-ornament-float delay-3">
              <Squiggle color="var(--mint)" size={34} />
            </div>
          </div>
        </div>
        <div className="hero-text">
          <div className="hero-greet page-enter motion-delay-2">
            <span className="hero-wave">👋</span>
            <span>hello, I&apos;m</span>
          </div>
          <h1 className="hero-name page-enter motion-delay-3">
            <span className="name-word">Shahiduzzaman</span>{' '}
            <span className="name-word">
              Bipul.
              <span className="scribble-under">
                <HeroScribble color="var(--peach)" />
              </span>
            </span>
          </h1>
          <div className="hero-role page-enter motion-delay-4">
            A <span className="role-pill">software engineer</span> crafting calm, considered software
            {' '}one careful detail at a time.
          </div>
          <p className="hero-blurb page-enter motion-delay-5">
            Currently at <strong>InfancyIT Ltd.</strong> &middot; Computer Science,
            {' '}<strong>Shahjalal University of Science and Technology</strong>.
          </p>
          <div className="hero-cta page-enter motion-delay-6">
            <a className="btn hero-cta-primary" href="#projects">
              View my work →
            </a>
            <a className="btn ghost hero-cta-secondary" href="#contact">
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
