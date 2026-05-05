import { Link } from "@tanstack/react-router";
import { MinimalWindowControls } from "~/components/public/minimal-window-controls";
import { cx, pageContainerClass } from "~/components/portfolio/lib/styles";

export function MinimalRichContentPage({
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
}: Readonly<{
  backLabel: string;
  backTo: string;
  bodyHtml: string;
  coverImagePath?: string | null;
  description: string;
  detailActions?: Array<{
    href: string;
    label: string;
  }>;
  detailFacts?: Array<{
    label: string;
    value: string;
  }>;
  kicker: string;
  tags?: string[];
  meta: string;
  title: string;
}>) {
  const detailPath =
    backTo === "/blog" ? "/notes/entry.md" : "/projects/case-study.ts";
  const panelLabel =
    backTo === "/blog" ? "Reading context" : "Project snapshot";
  const bodyLabel = backTo === "/blog" ? "Article" : "Case study";
  const bodySupport =
    backTo === "/blog" ? "Notes and references" : "Build notes and outcomes";

  return (
    <main
      className={cx(
        pageContainerClass,
        "theme-only-minimal pb-24 pt-32 md:pb-28 md:pt-36",
      )}
      id="top"
    >
      <article className="minimal-article-shell mx-auto max-w-6xl">
        <header className="minimal-article-header coding-border overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#3a342e]/8 px-6 py-4 text-[11px] text-[#3a342e]/46 [font-family:var(--minimal-mono)]">
            <div className="flex items-center gap-3">
              <MinimalWindowControls />
              <span>{detailPath}</span>
            </div>
            <span>detail</span>
          </div>

          <div className="minimal-article-hero">
            <div className="minimal-article-copy">
              <div className="reveal-mask">
                <div className="minimal-article-meta">
                  <span>{kicker}</span>
                  <span>{meta}</span>
                </div>
              </div>

              <div className="minimal-article-headline-block">
                <h1 className="minimal-article-title reveal-skew">{title}</h1>
                <p className="minimal-article-description reveal-mask">
                  {description}
                </p>
              </div>

              {tags.length ? (
                <div className="minimal-article-tags reveal-mask">
                  {tags.map((tag) => (
                    <span className="minimal-project-card-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="minimal-article-actions reveal-skew">
                <Link
                  className="minimal-article-action is-primary"
                  preload="intent"
                  to={backTo}
                >
                  {backLabel}
                </Link>
                {detailActions.map((action) => (
                  <a
                    className="minimal-article-action"
                    href={action.href}
                    key={action.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            </div>

            {detailFacts.length ? (
              <aside className="minimal-article-sidebar reveal-mask">
                <div className="minimal-article-sidebar-shell">
                  <div className="minimal-article-sidebar-label">
                    {panelLabel}
                  </div>
                  <dl className="minimal-article-facts">
                    {detailFacts.map((fact) => (
                      <div className="minimal-article-fact" key={fact.label}>
                        <dt>{fact.label}</dt>
                        <dd>{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </aside>
            ) : null}
          </div>
        </header>

        {coverImagePath ? (
          <div className="minimal-article-cover reveal-mask">
            <div className="minimal-article-cover-frame">
              <img
                alt={title}
                className="minimal-article-cover-image"
                src={coverImagePath}
              />
            </div>
            <div className="minimal-article-cover-caption">
              <span>{bodyLabel}</span>
              <span>{title}</span>
            </div>
          </div>
        ) : null}

        <section className="">
          <div className="minimal-article-body-panel coding-border">
            <div
              className="minimal-rich-content"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </div>
        </section>
      </article>
    </main>
  );
}
