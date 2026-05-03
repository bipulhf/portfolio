import { createHash, randomBytes } from 'node:crypto'
import { and, eq, gt } from 'drizzle-orm'
import { db } from '~/lib/db'
import { admins, sessions } from '~/lib/db/schema'
import { SESSION_COOKIE_NAME } from './constants'

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30

export function createSessionToken() {
  return randomBytes(32).toString('hex')
}

export function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function createAdminSession(adminId: string) {
  const rawToken = createSessionToken()
  const tokenHash = hashSessionToken(rawToken)
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)

  await db.insert(sessions).values({
    adminId,
    tokenHash,
    expiresAt,
  })

  return {
    rawToken,
    expiresAt,
  }
}

export async function getAdminSessionByToken(token: string | null | undefined) {
  if (!token) {
    return null
  }

  const tokenHash = hashSessionToken(token)

  const [result] = await db
    .select({
      adminId: admins.id,
      email: admins.email,
      sessionId: sessions.id,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .innerJoin(admins, eq(sessions.adminId, admins.id))
    .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, new Date())))
    .limit(1)

  return result ?? null
}

export async function deleteAdminSession(token: string | null | undefined) {
  if (!token) {
    return
  }

  await db.delete(sessions).where(eq(sessions.tokenHash, hashSessionToken(token)))
}
