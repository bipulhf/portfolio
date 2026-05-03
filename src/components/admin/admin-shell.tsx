import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAdminSession, useLogoutMutation } from '~/lib/admin-queries'
import { pageContainerClass } from '~/components/portfolio/lib/styles'

const links = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Projects', to: '/admin/projects' },
  { label: 'Blogs', to: '/admin/blogs' },
] as const

export function AdminShell({
  children,
  title,
  subtitle,
}: Readonly<{
  children: ReactNode
  subtitle?: string
  title: string
}>) {
  const location = useLocation()
  const navigate = useNavigate()
  const session = useAdminSession()
  const logoutMutation = useLogoutMutation()

  return (
    <div className="min-h-screen bg-paper pb-12">
      <div className={pageContainerClass}>
        <div className="grid gap-6 py-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:py-8">
          <aside className="crayon-surface self-start rounded-[1.6rem] border-[2.5px] border-ink bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(244,250,249,0.96))] p-5 shadow-crayon-md">
            <Link className="mb-5 inline-flex text-[2rem] font-display font-bold text-ink no-underline" to="/">
              Bipul CMS
            </Link>
            <div className="mb-5 rounded-2xl border border-ink/15 bg-white/60 px-3 py-2 font-hand text-sm text-ink-soft">
              {session.data?.email ?? 'Loading session...'}
            </div>
            <nav className="space-y-2">
              {links.map((link) => {
                const active = location.pathname === link.to
                return (
                  <Link
                    className={`block rounded-2xl px-3 py-2 font-hand text-lg no-underline transition-colors ${active ? 'bg-yellow text-ink shadow-[2px_2px_0_var(--color-ink)]' : 'text-ink-soft hover:bg-white/60 hover:text-ink'}`}
                    key={link.to}
                    to={link.to}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <button
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-[0.9rem] border-2 border-dashed border-ink bg-transparent px-4 py-2 font-hand text-lg text-ink transition-colors hover:bg-peach/40"
              disabled={logoutMutation.isPending}
              onClick={async () => {
                try {
                  await logoutMutation.mutateAsync()
                  toast.success('Signed out.')
                  await navigate({ to: '/admin/login' })
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : 'Failed to sign out.')
                }
              }}
              type="button"
            >
              {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
            </button>
          </aside>

          <main className="space-y-6">
            <header className="crayon-surface rounded-[1.8rem] border-[2.5px] border-ink bg-paper px-6 py-6 shadow-crayon-md">
              <div className="mb-2 flex items-center gap-3 font-hand text-lg text-ink-soft">
                <span className="h-0.5 w-10 rounded-full bg-ink-soft" />
                <span>admin workspace</span>
              </div>
              <h1 className="font-display text-[clamp(2.4rem,6vw,4rem)] font-bold text-ink">
                {title}
              </h1>
              {subtitle ? <p className="mt-3 max-w-3xl text-ink-soft">{subtitle}</p> : null}
            </header>

            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
