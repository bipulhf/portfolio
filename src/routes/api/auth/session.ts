import { createFileRoute } from '@tanstack/react-router'
import { getAdminFromRequest } from '~/lib/auth/server'
import { NO_STORE_CACHE_CONTROL, jsonResponse } from '~/lib/http'

export const Route = createFileRoute('/api/auth/session')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await getAdminFromRequest(request)

        return jsonResponse(
          session
            ? {
                adminId: session.adminId,
                email: session.email,
              }
            : null,
          {
            headers: {
              'Cache-Control': NO_STORE_CACHE_CONTROL,
            },
          },
        )
      },
    },
  },
})
