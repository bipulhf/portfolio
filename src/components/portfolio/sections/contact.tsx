import { CornerBurst } from "../doodles";
import { SectionHeader } from "../section-header";
import { SectionShell } from "../section-shell";
import { CONTACT_LINKS } from "../lib/content";
import {
  getTrackedContactDestination,
  sanitizeTrackedLabel,
  trackUmamiEvent,
} from "~/lib/analytics/umami";
import { crayonButtonClass, cx, surfaceCardClass } from "../lib/styles";

export function Contact() {
  return (
    <SectionShell accent="contact" id="contact">
      <SectionHeader
        description="The best next step is usually a simple hello. If there is a role, product, or idea worth building carefully, I'd love to hear about it."
        kicker="08 - say hi"
        title="Let's make something"
        underlineColor="var(--color-peach)"
      />

      <div
        className={cx(
          surfaceCardClass,
          "reveal reveal-soft relative mx-auto mt-14 max-w-[45rem] rounded-[2rem_1.75rem_2.25rem_1.5rem/1.75rem_2rem_1.5rem_2.25rem] border-[3px] border-ink px-6 py-12 text-center shadow-crayon-lg hover:-translate-y-[0.3rem] hover:shadow-[9px_10px_0_var(--color-ink)] md:px-10 md:py-14",
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

        <h2 className="type-display-page mb-3">Start a conversation</h2>
        <p className="type-lead-hand mx-auto mb-8 max-w-[28ch] text-ink-soft">
          I&apos;m always happy to talk about engineering, design, or a good
          collaboration. The inbox is open.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          {CONTACT_LINKS.map((link) => (
            <a
              className={crayonButtonClass(link.tone)}
              href={link.href}
              key={link.label}
              onClick={() =>
                trackUmamiEvent("contact-link-clicked", {
                  destination: getTrackedContactDestination(link.href),
                  label: sanitizeTrackedLabel(link.label),
                  surface: "contact-section",
                  theme: "crayon",
                })
              }
              target="_blank"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
