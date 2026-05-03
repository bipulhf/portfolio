import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { loginRequest, queryKeys } from '~/lib/admin-queries'
import { redirectAuthenticatedAdmin } from '~/lib/auth/session-fns'
import { NO_STORE_CACHE_CONTROL } from '~/lib/http'
import { pageContainerClass, surfaceCardClass } from '~/components/portfolio/lib/styles'
import { AdminField, AdminInput } from '~/components/admin/primitives'

export const Route = createFileRoute('/admin/login')({
  beforeLoad: async () => redirectAuthenticatedAdmin(),
  headers: () => ({
    'Cache-Control': NO_STORE_CACHE_CONTROL,
  }),
  component: AdminLoginPage,
})

function AdminLoginPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.session })
      toast.success('Welcome back.')
      await navigate({ to: '/admin' })
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Login failed.')
    },
  })

  return (
    <main className={`${pageContainerClass} grid min-h-screen place-items-center py-10`}>
      <div
        className={`${surfaceCardClass} w-full max-w-xl rounded-[2rem] border-[2.5px] border-ink bg-[linear-gradient(180deg,rgba(255,255,255,0.75),rgba(244,250,249,0.96))] px-6 py-8 shadow-crayon-lg md:px-8 md:py-10`}
      >
        <div className="mb-6">
          <div className="mb-3 font-hand text-lg text-ink-soft">single-owner admin</div>
          <h1 className="font-display text-[clamp(2.8rem,8vw,4.5rem)] font-bold leading-[0.95] text-ink">
            Sign in to Bipul CMS
          </h1>
          <p className="mt-4 text-ink-soft">
            Manage projects, publish blog posts, and keep the public site current from one calm workspace.
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            loginMutation.mutate({ email, password })
          }}
        >
          <AdminField label="Email">
            <AdminInput
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              type="email"
              value={email}
            />
          </AdminField>
          <AdminField label="Password">
            <AdminInput
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              type="password"
              value={password}
            />
          </AdminField>
          <button
            className="inline-flex min-h-12 w-full items-center justify-center rounded-[1rem] border-2 border-ink bg-yellow px-4 py-3 font-hand text-xl text-ink shadow-crayon-sm transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loginMutation.isPending}
            type="submit"
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}
