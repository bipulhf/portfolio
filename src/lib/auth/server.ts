import { getAdminSessionByToken } from './session'
import { SESSION_COOKIE_NAME } from './constants'

type CookieOptions = {
  expires?: Date
  maxAge?: number
}

function buildCookieAttributes(options: CookieOptions = {}) {
  const secure = (process.env.SITE_URL ?? 'http://localhost:3000').startsWith('https://')

  const parts = [
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    secure ? 'Secure' : null,
    options.expires ? `Expires=${options.expires.toUTCString()}` : null,
    typeof options.maxAge === 'number' ? `Max-Age=${options.maxAge}` : null,
  ]

  return parts.filter(Boolean).join('; ')
}

export function createSessionCookie(token: string, expiresAt: Date) {
  return `${SESSION_COOKIE_NAME}=${token}; ${buildCookieAttributes({ expires: expiresAt })}`
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE_NAME}=; ${buildCookieAttributes({
    expires: new Date(0),
    maxAge: 0,
  })}`
}

export function parseCookieHeader(cookieHeader: string | null) {
  const values = new Map<string, string>()

  if (!cookieHeader) {
    return values
  }

  cookieHeader.split(';').forEach((part) => {
    const [name, ...valueParts] = part.trim().split('=')

    if (!name) {
      return
    }

    values.set(name, decodeURIComponent(valueParts.join('=')))
  })

  return values
}

export async function getAdminFromRequest(request: Request) {
  const cookies = parseCookieHeader(request.headers.get('cookie'))
  return getAdminSessionByToken(cookies.get(SESSION_COOKIE_NAME))
}

export async function requireAdminFromRequest(request: Request) {
  const session = await getAdminFromRequest(request)

  if (!session) {
    throw new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    })
  }

  return session
}
