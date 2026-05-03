import ky, { type AfterResponseHook } from 'ky'

const afterResponseHook: AfterResponseHook = async ({ response }) => {
  if (response.ok) {
    return response
  }

  let message = 'Request failed.'

  try {
    const payload = (await response.clone().json()) as { message?: string }
    message = payload.message ?? message
  } catch {
    // ignore malformed error payloads
  }

  throw new Error(message)
}

export const api = ky.create({
  prefix: '/api',
  hooks: {
    afterResponse: [afterResponseHook],
  },
})
