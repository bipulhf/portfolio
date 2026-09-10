import type { ComponentProps, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PUBLIC_THEME_CONFIG } from "~/components/public/public-theme";
import type { RichContentPage } from "~/components/public/rich-content";

export function StudioPageHero({
  page,
  actions,
}: Readonly<{ page: "projects" | "blog"; actions?: ReactNode }>) {
  const config = PUBLIC_THEME_CONFIG.studio.pages[page];
  return (
    <header className="studio-page-hero studio-container">
      <p className="studio-eyebrow">{config.eyebrow}</p>
      <h1>{config.title}</h1>
      <p>{config.description}</p>
      {actions ? <div className="studio-actions">{actions}</div> : null}
    </header>
  );
}

export function StudioRichContentPage({
  backLabel,
  backTo,
  bodyHtml,
  coverImagePath,
  description,
  detailActions = [],
  detailFacts = [],
  kicker,
  tags = [],
  meta,
  title,
}: ComponentProps<typeof RichContentPage>) {
  return (
    <main className="studio-article studio-container">
      <article>
        <header className="studio-article-header">
          <Link className="studio-text-link" to={backTo}>
            ← {backLabel}
          </Link>
          <p className="studio-eyebrow">
            {kicker} / {meta}
          </p>
          <h1>{title}</h1>
          <p>{description}</p>
          {tags.length ? (
            <div className="studio-tags">
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          ) : null}
          {detailActions.length ? (
            <div className="studio-actions">
              {detailActions.map((action) => (
                <a
                  className="studio-button"
                  key={action.href}
                  href={action.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {action.label} ↗
                </a>
              ))}
            </div>
          ) : null}
        </header>
        {coverImagePath ? (
          <img
            className="studio-article-cover"
            src={coverImagePath}
            alt={title}
            width={1200}
            height={750}
            decoding="async"
          />
        ) : null}
        {detailFacts.length ? (
          <dl className="studio-article-facts">
            {detailFacts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <div
          className="studio-prose"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </article>
    </main>
  );
}
