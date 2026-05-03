import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { crayonButtonClass, surfaceCardClass } from '~/components/portfolio/lib/styles'

export function NotFound({ children }: { children?: ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-6">
      <div
        className={`${surfaceCardClass} w-full max-w-3xl rounded-[1.5rem] border-[2.5px] border-ink px-6 py-8 text-center shadow-crayon-md`}
      >
        <h1 className="mb-3 font-display text-[clamp(2.5rem,10vw,4rem)] font-bold leading-none text-ink">
          Page not found
        </h1>
        <div className="text-ink-soft">
          {children ?? (
            <p>The page you are looking for does not exist in this portfolio.</p>
          )}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
          <button
            className={crayonButtonClass('yellow')}
            onClick={() => window.history.back()}
            type="button"
          >
            Go back
          </button>
          <Link className={crayonButtonClass('mint')} to="/">
            Start over
          </Link>
        </div>
      </div>
    </main>
  )
}
