import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

export function NotFound({ children }: { children?: ReactNode }) {
  return (
    <main className="error-shell">
      <div className="error-card">
        <h1 className="error-title">Page not found</h1>
        <div className="error-copy">
          {children ?? (
            <p>The page you are looking for does not exist in this portfolio.</p>
          )}
        </div>
        <div className="error-actions">
          <button
            className="btn"
            onClick={() => window.history.back()}
            type="button"
          >
            Go back
          </button>
          <Link className="btn mint" to="/">
            Start over
          </Link>
        </div>
      </div>
    </main>
  )
}
