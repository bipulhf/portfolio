import { cx } from '~/components/portfolio/lib/styles'

export function MinimalWindowControls({
  className,
}: Readonly<{
  className?: string
}>) {
  return (
    <div aria-hidden="true" className={cx('minimal-window-controls', className)}>
      <span className="minimal-window-dot is-close" />
      <span className="minimal-window-dot is-minimize" />
      <span className="minimal-window-dot is-maximize" />
    </div>
  )
}
