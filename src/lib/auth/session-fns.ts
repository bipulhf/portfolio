import { getCookie } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { SESSION_COOKIE_NAME } from './constants'

export const getCurrentAdminSession = createServerFn({ method: 'GET' }).handler(async () => {
  const token = getCookie(SESSION_COOKIE_NAME)
  const { getAdminSessionByToken } = await import('./session')
  return getAdminSessionByToken(token)
})

export const requireAdminSession = createServerFn({ method: 'GET' }).handler(async () => {
  const token = getCookie(SESSION_COOKIE_NAME)
  const { getAdminSessionByToken } = await import('./session')
  const session = await getAdminSessionByToken(token)

  if (!session) {
    throw redirect({
      to: '/admin/login',
    })
  }

  return session
})

export const redirectAuthenticatedAdmin = createServerFn({ method: 'GET' }).handler(
  async () => {
    const token = getCookie(SESSION_COOKIE_NAME)
    const { getAdminSessionByToken } = await import('./session')
    const session = await getAdminSessionByToken(token)

    if (session) {
      throw redirect({
        to: '/admin',
      })
    }

    return null
  },
)
