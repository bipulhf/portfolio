import { createFileRoute } from '@tanstack/react-router'
import { redirectAuthenticatedAdmin } from '~/lib/auth/session-fns'
import { NO_STORE_CACHE_CONTROL } from '~/lib/http'

export const Route = createFileRoute('/admin/login')({
  beforeLoad: async () => redirectAuthenticatedAdmin(),
  headers: () => ({
    'Cache-Control': NO_STORE_CACHE_CONTROL,
  }),
})
