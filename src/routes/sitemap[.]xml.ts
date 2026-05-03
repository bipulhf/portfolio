import { createFileRoute } from '@tanstack/react-router'
import { getSiteUrl } from '~/lib/env.server'
import { PUBLIC_LIST_CACHE_CONTROL } from '~/lib/http'
import { getPublishedSlugs } from '~/lib/content/queries'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const { blogs, projects } = await getPublishedSlugs()
        const urls = [
          '/',
          '/projects',
          '/blog',
          ...projects.map((slug) => `/projects/${slug}`),
          ...blogs.map((slug) => `/blog/${slug}`),
        ]

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((pathname) => `  <url><loc>${getSiteUrl(pathname)}</loc></url>`).join('\n')}
</urlset>`

        return new Response(body, {
          headers: {
            'Cache-Control': PUBLIC_LIST_CACHE_CONTROL,
            'Content-Type': 'application/xml; charset=utf-8',
          },
        })
      },
    },
  },
})
