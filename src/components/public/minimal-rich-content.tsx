import { Link } from '@tanstack/react-router'
import { MinimalWindowControls } from '~/components/public/minimal-window-controls'
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
    <main className={cx(pageContainerClass, 'theme-only-minimal pb-24 pt-28 md:pb-28 md:pt-32')} id="top">
      <article className="minimal-article-shell mx-auto max-w-5xl">
        <header className="minimal-article-header coding-border overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#3a342e]/8 px-6 py-4 text-[11px] text-[#3a342e]/46 [font-family:var(--minimal-mono)]">
            <div className="flex items-center gap-3">
              <MinimalWindowControls />
              <span>{backTo === '/blog' ? '/notes/entry.md' : '/projects/case-study.ts'}</span>
            </div>
            <span>detail</span>
          </div>

          <div className="px-6 py-7 md:px-7 md:py-8">
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
