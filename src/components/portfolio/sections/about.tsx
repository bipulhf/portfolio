import { SectionAccent } from '../section-accent'
import { SectionHeader } from '../section-header'

export function About() {
  return (
    <section className="container" id="about">
      <SectionAccent variant="about" />
      <SectionHeader
        kicker="01 — about"
        title="A little about me"
        underlineColor="var(--peach)"
      />

      <div className="about">
        <div className="about-card reveal">
          <div className="pin" />
          <p>
            I&apos;m a software engineer at <strong>InfancyIT Ltd.</strong>, where I focus on
            building products that feel calm, considered, and genuinely useful.
          </p>
          <p>
            I graduated in Computer Science from <strong>Shahjalal University of Science and
            Technology</strong>, and have spent the years since shipping products, contributing to
            teams, and quietly racking up hackathon wins on the weekends.
          </p>
          <p>
            I care about the small details — the readable code, the gentle interaction, the right
            word in the right place.
          </p>
        </div>

        <div className="about-stats reveal">
          <div className="stat">
            <div className="num">10+</div>
            <div className="label">hackathons won</div>
          </div>
          <div className="stat">
            <div className="num">4+</div>
            <div className="label">years coding</div>
          </div>
          <div className="stat">
            <div className="num">20+</div>
            <div className="label">projects shipped</div>
          </div>
          <div className="stat">
            <div className="num">∞</div>
            <div className="label">cups of chai</div>
          </div>
        </div>
      </div>
    </section>
  )
}
