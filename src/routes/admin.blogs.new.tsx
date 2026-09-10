import { createFileRoute } from '@tanstack/react-router'
import { requireAdminSession } from '~/lib/auth/session-fns'
import { NO_STORE_CACHE_CONTROL } from '~/lib/http'

export const Route = createFileRoute('/admin/blogs/new')({
  loader: async () => requireAdminSession(),
  headers: () => ({
    'Cache-Control': NO_STORE_CACHE_CONTROL,
  }),
})
