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
          <div className="sticky top-3 z-40 rounded-[1.2rem] border border-ink/10 bg-white/88 px-3.5 py-3.5 shadow-[0_10px_30px_rgba(46,61,58,0.08)] backdrop-blur-sm sm:px-4 md:px-5 md:py-4">
            <div className="flex flex-wrap items-start gap-3 md:items-center">
              <div className="min-w-0">
                <Link className="inline-flex font-display text-[1.65rem] font-bold text-ink no-underline sm:text-[1.9rem]" to="/">
                  Bipul CMS
                </Link>
                <div className="hidden text-sm text-ink-soft sm:block">projects and writing, one calm workspace</div>
              </div>

              <nav className="order-3 flex w-full flex-wrap items-center gap-2 md:order-none md:ml-auto md:w-auto">
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

              <div className="flex w-full flex-wrap items-center justify-between gap-3 border-t border-ink/8 pt-3 sm:justify-between md:w-auto md:border-t-0 md:pt-0">
                <div className="text-sm text-ink-soft">
                  {session.data?.email ?? 'Loading session...'}
                </div>
                <button
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-ink/15 bg-white px-4 py-2 font-hand text-[1rem] text-ink transition-colors hover:bg-peach/25"
                  disabled={logoutMutation.isPending}
                  onClick={async () => {
                    try {
                      await logoutMutation.mutateAsync()
                      toast.success("You're signed out.")
                      await navigate({ to: '/admin/login' })
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "We couldn't sign you out.")
                    }
                  }}
                  type="button"
                >
                  {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            </div>
          </div>

          <main className="mx-auto mt-5 max-w-[70rem] space-y-5 md:mt-6 md:space-y-6">
            <header className="rounded-[1.35rem] border border-ink/10 bg-white px-5 py-5 shadow-[0_10px_28px_rgba(46,61,58,0.05)] sm:px-6 md:rounded-[1.5rem] md:px-7 md:py-7">
              <div className="mb-2 font-hand text-base text-ink-soft">private workspace</div>
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
