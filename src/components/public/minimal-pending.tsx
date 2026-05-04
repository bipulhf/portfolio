import { cx, pageContainerClass } from '~/components/portfolio/lib/styles'

export function MinimalPendingPage({
  cards = 4,
  title = 'Loading',
}: Readonly<{
  cards?: number
  title?: string
}>) {
  return (
    <div className={cx(pageContainerClass, 'theme-only-minimal py-16 md:py-20')}>
      <div className="minimal-pending-shell">
        <div className="minimal-pending-title">{title}</div>
        <div className="minimal-pending-hero" />
        <div className="minimal-pending-grid">
          {Array.from({ length: cards }).map((_, index) => (
            <div className="minimal-pending-card" key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
