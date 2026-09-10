import { Link } from "@tanstack/react-router";
import type {
  SerializedBlogCard,
  SerializedProjectCard,
} from "~/lib/content/types";

type GridProps<T> = Readonly<{
  items: T[];
  emptyTitle?: string;
  emptyText?: string;
}>;

export function StudioProjectGrid({
  items,
  emptyTitle = "Projects are on their way.",
  emptyText,
}: GridProps<SerializedProjectCard>) {
  if (!items.length)
    return (
      <div className="studio-empty">
        <h2>{emptyTitle}</h2>
        {emptyText ? <p>{emptyText}</p> : null}
      </div>
    );

  return (
    <div className="studio-project-grid">
      {items.map((project, index) => (
        <article className="studio-project-card" key={project.id}>
          <Link
            className={`studio-project-cover studio-tone-${index % 4}`}
            to="/projects/$slug"
            params={{ slug: project.slug }}
            aria-label={`Open ${project.title}`}
          >
            {project.coverImagePath ? (
              <img
                src={project.coverImagePath}
                alt=""
                width={800}
                height={500}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="studio-project-object" aria-hidden="true">
                <span>{project.title.slice(0, 1)}</span>
                <div className="studio-object-lines">
                  <i />
                  <i />
                  <i />
                </div>
                <small>{project.techStack[0] || "Built by Bipul"}</small>
              </div>
            )}
            <span className="studio-project-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="studio-project-open" aria-hidden="true">
              ↗
            </span>
          </Link>
          <div className="studio-project-copy">
            <div className="studio-tags">
              {project.techStack.slice(0, 4).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <h2>
              <Link to="/projects/$slug" params={{ slug: project.slug }}>
                {project.title}
              </Link>
            </h2>
            <p>{project.summary}</p>
            <div className="studio-project-links">
              <Link
                className="studio-text-link"
                to="/projects/$slug"
                params={{ slug: project.slug }}
              >
                View case study ↗
              </Link>
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  Live site ↗
                </a>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function StudioBlogGrid({
  items,
  emptyTitle = "The next note is taking shape.",
  emptyText,
}: GridProps<SerializedBlogCard>) {
  if (!items.length)
    return (
      <div className="studio-empty">
        <h2>{emptyTitle}</h2>
        {emptyText ? <p>{emptyText}</p> : null}
      </div>
    );

  return (
    <div className="studio-blog-grid">
      {items.map((post, index) => (
        <Link
          className="studio-note-card"
          to="/blog/$slug"
          params={{ slug: post.slug }}
          key={post.id}
        >
          <div className="studio-note-meta">
            <span className="studio-eyebrow">
              Note {String(index + 1).padStart(2, "0")}
            </span>
            <span>{post.readingTimeMinutes} min read</span>
          </div>
          {post.coverImagePath ? (
            <img
              src={post.coverImagePath}
              alt=""
              width={600}
              height={340}
              loading="lazy"
              decoding="async"
            />
          ) : null}
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <span className="studio-text-link">Read the note ↗</span>
        </Link>
      ))}
    </div>
  );
}
