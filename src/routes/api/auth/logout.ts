import { createFileRoute } from '@tanstack/react-router'
import { clearSessionCookie, parseCookieHeader } from '~/lib/auth/server'
import { deleteAdminSession } from '~/lib/auth/session'
import { SESSION_COOKIE_NAME } from '~/lib/auth/constants'
import { NO_STORE_CACHE_CONTROL, jsonResponse } from '~/lib/http'

export const Route = createFileRoute('/api/auth/logout')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const cookies = parseCookieHeader(request.headers.get('cookie'))
        await deleteAdminSession(cookies.get(SESSION_COOKIE_NAME))

        return jsonResponse(
          { ok: true },
          {
            headers: {
              'Cache-Control': NO_STORE_CACHE_CONTROL,
              'Set-Cookie': clearSessionCookie(),
            },
          },
        )
      },
    },
  },
})
