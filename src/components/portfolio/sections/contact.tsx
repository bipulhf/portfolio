import { CONTACT_LINKS } from '../lib/content'
import { CornerBurst } from '../doodles'
import { SectionAccent } from '../section-accent'
import { SectionHeader } from '../section-header'

export function Contact() {
  return (
    <section className="container contact" id="contact">
      <SectionAccent variant="contact" />
      <SectionHeader
        kicker="08 — say hi"
        title="Let&apos;s make something"
        underlineColor="var(--peach)"
      />
      <div className="contact-card reveal">
        <div className="corner-doodle tl">
          <CornerBurst />
        </div>
        <div className="corner-doodle tr">
          <CornerBurst color="#b8e6c8" />
        </div>
        <div className="corner-doodle bl">
          <CornerBurst color="#ffc7a8" />
        </div>
        <div className="corner-doodle br">
          <CornerBurst color="#b9dcf2" />
        </div>

        <h2>Drop me a line</h2>
        <p className="contact-blurb">
          I&apos;m always happy to talk about engineering, design, or a good collaboration. The
          inbox is open.
        </p>
        <div className="contact-links">
          {CONTACT_LINKS.map((link) => (
            <a className={link.className} href={link.href} key={link.label}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
