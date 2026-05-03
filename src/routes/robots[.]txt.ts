import { createFileRoute } from '@tanstack/react-router'
import { getSiteUrl } from '~/lib/env.server'
import { PUBLIC_LIST_CACHE_CONTROL, textResponse } from '~/lib/http'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: async () =>
        textResponse(`User-agent: *\nAllow: /\nSitemap: ${getSiteUrl('/sitemap.xml')}\n`, {
          headers: {
            'Cache-Control': PUBLIC_LIST_CACHE_CONTROL,
          },
        }),
    },
  },
})
