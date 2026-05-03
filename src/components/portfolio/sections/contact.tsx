import { CornerBurst } from '../doodles'
import { SectionHeader } from '../section-header'
import { SectionShell } from '../section-shell'
import { CONTACT_LINKS } from '../lib/content'
import { crayonButtonClass, cx, surfaceCardClass } from '../lib/styles'

export function Contact() {
  return (
    <SectionShell accent="contact" className="text-center" id="contact">
      <SectionHeader
        kicker="08 - say hi"
        title="Let&apos;s make something"
        underlineColor="var(--color-peach)"
      />

      <div
        className={cx(
          surfaceCardClass,
          'reveal reveal-soft relative mx-auto mt-14 max-w-[45rem] rounded-[2rem_1.75rem_2.25rem_1.5rem/1.75rem_2rem_1.5rem_2.25rem] border-[3px] border-ink px-6 py-12 shadow-crayon-lg hover:-translate-y-[0.3rem] hover:shadow-[9px_10px_0_var(--color-ink)] md:px-10 md:py-14',
        )}
      >
        <div className="absolute left-[-0.625rem] top-[-0.625rem] size-[3.75rem]">
          <CornerBurst />
        </div>
        <div className="absolute right-[-0.625rem] top-[-0.625rem] size-[3.75rem] scale-x-[-1]">
          <CornerBurst color="#b8e6c8" />
        </div>
        <div className="absolute bottom-[-0.625rem] left-[-0.625rem] size-[3.75rem] scale-y-[-1]">
          <CornerBurst color="#ffc7a8" />
        </div>
        <div className="absolute bottom-[-0.625rem] right-[-0.625rem] size-[3.75rem] scale-[-1]">
          <CornerBurst color="#b9dcf2" />
        </div>

        <h2 className="mb-3 font-display text-[clamp(2.5rem,10vw,4rem)] font-bold leading-none text-ink">
          Drop me a line
        </h2>
        <p className="mx-auto mb-8 max-w-[27.5rem] font-hand text-[1.375rem] text-ink-soft">
          I&apos;m always happy to talk about engineering, design, or a good collaboration. The
          inbox is open.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          {CONTACT_LINKS.map((link) => (
            <a
              className={crayonButtonClass(link.tone)}
              href={link.href}
              key={link.label}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
