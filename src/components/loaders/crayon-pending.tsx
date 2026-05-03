import { cx, pageContainerClass } from '~/components/portfolio/lib/styles'

export function CrayonPendingPage({
  children,
  title = 'Loading',
}: Readonly<{ children?: React.ReactNode; title?: string }>) {
  return (
    <div className={cx(pageContainerClass, 'py-14 md:py-20')}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center gap-3 font-hand text-xl text-ink-soft">
          <span className="h-0.5 w-10 rounded-full bg-ink-soft/60" />
          <span>{title}</span>
        </div>
        {children ?? (
          <div className="space-y-5">
            <div className="loader-card h-14 w-3/4 rounded-[1.5rem]" />
            <div className="loader-card h-32 w-full rounded-[1.75rem]" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div className="loader-card h-72 rounded-[1.5rem]" key={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function CrayonGridPending({
  cards = 6,
}: Readonly<{ cards?: number }>) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: cards }).map((_, index) => (
        <div className="loader-card h-72 rounded-[1.5rem]" key={index} />
      ))}
    </div>
  )
}

export function EditorPendingShell() {
  return (
    <div className="space-y-4">
      <div className="loader-card h-11 rounded-[1rem]" />
      <div className="loader-card h-64 rounded-[1.5rem]" />
    </div>
  )
}

export function ImageFieldPendingShell() {
  return (
    <div className="space-y-3">
      <div className="loader-card h-12 rounded-[1rem]" />
      <div className="loader-card h-11 rounded-[1rem]" />
      <div className="loader-card h-36 rounded-[1.25rem]" />
    </div>
  )
}
