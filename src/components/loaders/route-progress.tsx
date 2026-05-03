import { useRouterState } from '@tanstack/react-router'

export function RouteProgress() {
  const isLoading = useRouterState({
    select: (state) => state.isLoading || state.isTransitioning,
  })

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 right-0 top-0 z-[120] transition-opacity duration-200 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="mx-auto h-1 max-w-[73.75rem] overflow-hidden rounded-full bg-transparent">
        <div className="route-progress-bar h-full w-40 rounded-full bg-[linear-gradient(90deg,var(--color-yellow),var(--color-peach),var(--color-sky))]" />
      </div>
    </div>
  )
}
