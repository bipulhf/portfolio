export const PUBLIC_LIST_CACHE_CONTROL = 'public, max-age=120, stale-while-revalidate=900'
export const PUBLIC_DETAIL_CACHE_CONTROL = 'public, max-age=180, stale-while-revalidate=1200'
export const NO_STORE_CACHE_CONTROL = 'no-store'

export function jsonResponse(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers)

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json; charset=utf-8')
  }

  return new Response(JSON.stringify(data), {
    ...init,
    headers,
  })
}

export function errorResponse(message: string, status = 400, init: ResponseInit = {}) {
  return jsonResponse(
    { message },
    {
      ...init,
      status,
    },
  )
}

export function textResponse(text: string, init: ResponseInit = {}) {
  const headers = new Headers(init.headers)

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'text/plain; charset=utf-8')
  }

  return new Response(text, {
    ...init,
    headers,
  })
}
