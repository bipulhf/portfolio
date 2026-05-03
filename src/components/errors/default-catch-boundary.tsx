import type { CSSProperties } from 'react'
import type { ErrorComponentProps } from '@tanstack/react-router'
import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router'

const actionStyle: CSSProperties = {
  border: '2px solid var(--ink)',
  borderRadius: '0.875rem',
  background: 'var(--yellow)',
  boxShadow: '3px 3px 0 var(--ink)',
  color: 'var(--ink)',
  cursor: 'pointer',
  display: 'inline-flex',
  fontFamily: "'Patrick Hand', cursive",
  fontSize: '1.125rem',
  minHeight: '2.75rem',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.5rem 1rem',
  textDecoration: 'none',
}

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  console.error('DefaultCatchBoundary Error:', error)

  return (
    <main className="error-shell">
      <div className="error-card">
        <h1 className="error-title">Something went sideways</h1>
        <p className="error-copy">
          The portfolio hit an unexpected problem while rendering.
        </p>
        <div className="error-details">
          <ErrorComponent error={error} />
        </div>
        <div className="error-actions">
          <button
            onClick={() => router.invalidate()}
            style={actionStyle}
            type="button"
          >
            Try again
          </button>
          {isRoot ? (
            <Link to="/" style={actionStyle}>
              Back home
            </Link>
          ) : (
            <Link
              to="/"
              onClick={(event) => {
                event.preventDefault()
                window.history.back()
              }}
              style={actionStyle}
            >
              Go back
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}
