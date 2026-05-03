import { useRouterState } from '@tanstack/react-router'

export function RouteProgress() {
  const isLoading = useRouterState({
    select: (state) => state.isLoading || state.isTransitioning,
  })

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-3 z-[120] transition-opacity duration-150 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="mx-auto max-w-[73.75rem] px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="relative h-2 w-full max-w-[11rem] overflow-hidden rounded-full border border-ink/15 bg-white/80 shadow-[2px_2px_0_rgba(46,61,58,0.14)]">
          <div className="route-progress-bar h-full w-20 rounded-full bg-[linear-gradient(90deg,var(--color-yellow),var(--color-peach),var(--color-sky))]" />
          <div className="route-progress-dot absolute top-1/2 size-2 -translate-y-1/2 rounded-full border border-ink/25 bg-paper shadow-[0_0_0_2px_rgba(255,255,255,0.5)]" />
        </div>
      </div>
    </div>
  )
}
