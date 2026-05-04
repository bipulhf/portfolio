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
    <main className={cx(pageContainerClass, 'theme-only-minimal pb-16 pt-10 md:pb-20 md:pt-16')}>
      <article className="minimal-article-shell page-enter enter-soft">
        <header className="minimal-article-header">
          <div className="minimal-article-meta">
            <span>{kicker}</span>
            <span>{meta}</span>
          </div>
          <div className="minimal-article-headline-block">
            <h1 className="minimal-article-title">{title}</h1>
            <p className="minimal-article-description">{description}</p>
          </div>
          <Link className="minimal-article-back" preload="intent" to={backTo}>
            {backLabel}
          </Link>
        </header>

        {coverImagePath ? (
          <div className="minimal-article-cover page-enter enter-soft motion-delay-3">
            <img alt={title} className="minimal-article-cover-image" src={coverImagePath} />
          </div>
        ) : null}

        <div className="minimal-article-body page-enter enter-soft motion-delay-4">
          <div className="minimal-rich-content" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        </div>
      </article>
    </main>
  )
}
