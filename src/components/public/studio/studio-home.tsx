import { Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  ACHIEVEMENT_ITEMS,
  CONTACT_LINKS,
  SKILL_CATEGORIES,
} from "~/components/portfolio/lib/content";
import type {
  SerializedBlogCard,
  SerializedProjectCard,
} from "~/lib/content/types";
import { StudioScene } from "./studio-scene";
import { WorldHeading } from "./world-heading";
import { WORLD_LOCATIONS } from "./world-locations";
import "~/styles/studio-cinematic.css";
import "~/styles/studio-world.css";

const headlines = [
  ["Bipul’s", "world."],
  ["Made to", "work."],
  ["Stay", "curious."],
  ["Worth the", "all-nighters."],
  ["Thinking", "out loud."],
  ["Your move.", "Say hello."],
] as const;

export default function StudioHome({
  blogs,
  projects,
}: Readonly<{
  blogs: SerializedBlogCard[];
  projects: SerializedProjectCard[];
}>) {
  const selected = useMemo(() => {
    const featured = projects.filter((project) => project.featured);
    return (featured.length ? featured : projects).slice(0, 4);
  }, [projects]);
  const dialog = useRef<HTMLDialogElement>(null);
  const [detail, setDetail] = useState<"about" | "achievements">("about");
  function openDetail(value: typeof detail) {
    setDetail(value);
    dialog.current?.showModal();
  }
  const captions = [
    "Software engineer. Dhaka, Bangladesh.",
    "Real problems. Working software.",
    "I build things to understand them better.",
    "Good teammates. Very little sleep.",
    blogs.length
      ? "Notes from the other side of the screen."
      : "The notebook is open. First notes coming soon.",
    "Something on your mind? Let’s build it.",
  ];

  return (
    <div className="studio-cinematic">
      <StudioScene projects={selected} />
      <div className="studio-film-grain" aria-hidden="true" />
      <div className="studio-scroll-line" aria-hidden="true">
        <span />
      </div>
      <main aria-label="A walk through Bipul’s island">
        {WORLD_LOCATIONS.map((place, index) => (
          <section
            className={`studio-chapter${index === 0 ? " studio-opening" : ""}`}
            data-studio-chapter={index}
            id={place.id}
            key={place.id}
            aria-label={place.title}
          >
            <div className="studio-chapter-copy">
              <span className="studio-caption-tether" aria-hidden="true" />
              <p className="studio-chapter-kicker">
                <span>0{index + 1}</span>
                {place.title}
              </p>
              <WorldHeading opening={index === 0} lines={headlines[index]} />
              <p className="studio-chapter-description">{captions[index]}</p>
              <div className="studio-caption-action">
                {index === 0 ? (
                  <a href="#projects">
                    Take a walk <span aria-hidden="true">↓</span>
                  </a>
                ) : null}
                {index === 1 ? (
                  <Link to="/projects">
                    Explore the work <span aria-hidden="true">↗</span>
                  </Link>
                ) : null}
                {index === 2 ? (
                  <button type="button" onClick={() => openDetail("about")}>
                    Meet the maker <span aria-hidden="true">↗</span>
                  </button>
                ) : null}
                {index === 3 ? (
                  <button
                    type="button"
                    onClick={() => openDetail("achievements")}
                  >
                    The highlights <span aria-hidden="true">↗</span>
                  </button>
                ) : null}
                {index === 4 ? (
                  <Link to="/blog">
                    Open the notebook <span aria-hidden="true">↗</span>
                  </Link>
                ) : null}
                {index === 5 ? (
                  <a href={CONTACT_LINKS[0].href}>
                    bipulhf@gmail.com <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
              </div>
            </div>
          </section>
        ))}
      </main>
      <dialog
        className="studio-detail-dialog"
        ref={dialog}
        aria-labelledby="studio-dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="studio-detail-inner">
          <form method="dialog">
            <button className="studio-dialog-close" aria-label="Close details">
              Close ×
            </button>
          </form>
          <p className="studio-eyebrow">
            {detail === "about" ? "Inside the studio" : "From the courtyard"}
          </p>
          <h2 id="studio-dialog-title">
            {detail === "about"
              ? "Hello, I’m Bipul."
              : "A few late nights paid off."}
          </h2>
          {detail === "about" ? (
            <>
              <p>
                I’m a software engineer in Dhaka. I work across interfaces and
                backend systems, and I like understanding how the pieces fit.
              </p>
              <div className="studio-detail-skills">
                {SKILL_CATEGORIES.map((category) => (
                  <div key={category.title}>
                    <h3>{category.title}</h3>
                    <p>{category.tags.join(" · ")}</p>
                  </div>
                ))}
              </div>
              <div className="studio-socials">
                {CONTACT_LINKS.slice(1).map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            </>
          ) : (
            <div className="studio-detail-achievements">
              {ACHIEVEMENT_ITEMS.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{item.icon}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.meta}</p>
                  </div>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
