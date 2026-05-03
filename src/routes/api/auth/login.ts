import { createFileRoute } from '@tanstack/react-router'
import { eq } from 'drizzle-orm'
import { createSessionCookie } from '~/lib/auth/server'
import { verifyPassword } from '~/lib/auth/password'
import { createAdminSession } from '~/lib/auth/session'
import { db } from '~/lib/db'
import { admins } from '~/lib/db/schema'
import { errorResponse, NO_STORE_CACHE_CONTROL, jsonResponse } from '~/lib/http'
import { loginSchema } from '~/lib/validation/content'

export const Route = createFileRoute('/api/auth/login')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const payload = loginSchema.parse(await request.json())
          const [admin] = await db.select().from(admins).where(eq(admins.email, payload.email)).limit(1)

          if (!admin) {
            return errorResponse('Invalid email or password.', 401, {
              headers: {
                'Cache-Control': NO_STORE_CACHE_CONTROL,
              },
            })
          }

          const isValid = await verifyPassword(payload.password, admin.passwordHash)

          if (!isValid) {
            return errorResponse('Invalid email or password.', 401, {
              headers: {
                'Cache-Control': NO_STORE_CACHE_CONTROL,
              },
            })
          }

          const session = await createAdminSession(admin.id)

          return jsonResponse(
            { ok: true },
            {
              headers: {
                'Cache-Control': NO_STORE_CACHE_CONTROL,
                'Set-Cookie': createSessionCookie(session.rawToken, session.expiresAt),
              },
            },
          )
        } catch (error) {
          return errorResponse(error instanceof Error ? error.message : 'Login failed.', 400, {
            headers: {
              'Cache-Control': NO_STORE_CACHE_CONTROL,
            },
          })
        }
      },
    },
  },
})
