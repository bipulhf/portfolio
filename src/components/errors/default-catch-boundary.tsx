import type { ErrorComponentProps } from '@tanstack/react-router'
import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router'
import { crayonButtonClass, surfaceCardClass } from '~/components/portfolio/lib/styles'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  console.error('DefaultCatchBoundary Error:', error)

  return (
    <main className="grid min-h-screen place-items-center px-6 py-6">
      <div
        className={`${surfaceCardClass} w-full max-w-3xl rounded-[1.5rem] border-[2.5px] border-ink px-6 py-8 text-center shadow-crayon-md`}
      >
        <h1 className="mb-3 font-display text-[clamp(2.5rem,10vw,4rem)] font-bold leading-none text-ink">
          Something went sideways
        </h1>
        <p className="text-ink-soft">
          The portfolio hit an unexpected problem while rendering.
        </p>
        <div className="my-6 text-left">
          <ErrorComponent error={error} />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <button
            className={crayonButtonClass('yellow')}
            onClick={() => router.invalidate()}
            type="button"
          >
            Try again
          </button>
          {isRoot ? (
            <Link className={crayonButtonClass('mint')} to="/">
              Back home
            </Link>
          ) : (
            <Link
              className={crayonButtonClass('mint')}
              onClick={(event) => {
                event.preventDefault()
                window.history.back()
              }}
              to="/"
            >
              Go back
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}
