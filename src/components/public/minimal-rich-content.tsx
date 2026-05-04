import { Link } from '@tanstack/react-router'
import { cx, pageContainerClass } from '~/components/portfolio/lib/styles'

export function MinimalRichContentPage({
  backLabel,
  backTo,
  bodyHtml,
  coverImagePath,
  description,
  kicker,
  meta,
  title,
}: Readonly<{
  backLabel: string
  backTo: string
  bodyHtml: string
  coverImagePath?: string | null
  description: string
  kicker: string
  meta: string
  title: string
}>) {
  return (
    <main className={cx(pageContainerClass, 'theme-only-minimal pb-32 pt-32')} id="top">
      <article className="minimal-article-shell mx-auto max-w-5xl">
        <header className="minimal-article-header">
          <div className="reveal-mask">
            <div className="minimal-article-meta">
              <span>{kicker}</span>
              <span>{meta}</span>
            </div>
          </div>

          <div className="minimal-article-headline-block">
            <h1 className="minimal-article-title reveal-skew">{title}</h1>
            <p className="minimal-article-description reveal-mask">{description}</p>
          </div>

          <div className="minimal-page-hero-actions reveal-skew">
            <Link className="minimal-article-back" preload="intent" to={backTo}>
              {backLabel}
            </Link>
          </div>
        </header>

        {coverImagePath ? (
          <div className="minimal-article-cover reveal-mask">
            <img
              alt={title}
              className="minimal-article-cover-image"
              src={coverImagePath}
            />
          </div>
        ) : null}

        <div className="reveal-mask">
          <div
            className="minimal-rich-content"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </div>
      </article>
    </main>
  )
}
