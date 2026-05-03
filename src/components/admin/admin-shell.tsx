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
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fcfb_0%,#f1f8f7_100%)] pb-14">
      <div className={pageContainerClass}>
        <div className="py-5 md:py-6">
          <div className="sticky top-3 z-40 rounded-[1.35rem] border border-ink/10 bg-white/88 px-4 py-4 shadow-[0_10px_30px_rgba(46,61,58,0.08)] backdrop-blur-sm md:px-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-0">
                <Link className="inline-flex font-display text-[1.9rem] font-bold text-ink no-underline" to="/">
                  Bipul CMS
                </Link>
                <div className="text-sm text-ink-soft">simple content workspace</div>
              </div>

              <nav className="ml-auto flex flex-wrap items-center gap-2">
                {links.map((link) => {
                  const active =
                    location.pathname === link.to ||
                    (link.to !== '/admin' && location.pathname.startsWith(`${link.to}/`))

                  return (
                    <Link
                      className={`inline-flex min-h-10 items-center rounded-full px-4 py-2 font-hand text-[1.02rem] no-underline transition-colors ${active ? 'bg-ink text-paper' : 'bg-paper text-ink-soft hover:bg-paper-shadow/55 hover:text-ink'}`}
                      key={link.to}
                      to={link.to}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </nav>

              <div className="flex w-full flex-wrap items-center justify-between gap-3 border-t border-ink/8 pt-3 md:w-auto md:border-t-0 md:pt-0">
                <div className="text-sm text-ink-soft">
                  {session.data?.email ?? 'Loading session...'}
                </div>
                <button
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-ink/15 bg-white px-4 py-2 font-hand text-[1rem] text-ink transition-colors hover:bg-peach/25"
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
              </div>
            </div>
          </div>

          <main className="mx-auto mt-6 max-w-[70rem] space-y-6">
            <header className="rounded-[1.5rem] border border-ink/10 bg-white px-6 py-6 shadow-[0_10px_28px_rgba(46,61,58,0.05)] md:px-7 md:py-7">
              <div className="mb-2 font-hand text-base text-ink-soft">admin workspace</div>
              <h1 className="font-display text-[clamp(2.3rem,6vw,3.8rem)] font-bold leading-[0.95] text-ink">
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
