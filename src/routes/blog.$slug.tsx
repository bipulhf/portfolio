import { createFileRoute } from '@tanstack/react-router'
import { CrayonPendingPage } from '~/components/loaders/crayon-pending'
import { blogMeta, RichContentPage } from '~/components/public/rich-content'
import { SiteShell } from '~/components/public/site-shell'
import type { SerializedBlog } from '~/lib/content/types'
import { getPublishedBlogBySlugFn } from '~/lib/server-fns/content'
import { getSiteOriginFn } from '~/lib/server-fns/site-url'
import { PUBLIC_DETAIL_CACHE_CONTROL } from '~/lib/http'
import { baseMeta, blogJsonLd, resolveOgImage, resolveSeoDescription, resolveSeoTitle } from '~/lib/seo'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const [blog, siteOrigin] = await Promise.all([
      getPublishedBlogBySlugFn({ data: { slug: params.slug } }),
      getSiteOriginFn(),
    ])

    return {
      blog,
      siteOrigin,
    }
  },
  pendingComponent: () => (
    <SiteShell>
      <CrayonPendingPage title="Loading article" />
    </SiteShell>
  ),
  headers: () => ({
    'Cache-Control': PUBLIC_DETAIL_CACHE_CONTROL,
    Vary: 'Cookie',
  }),
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return baseMeta({
        description: 'Writing on building products, frontend craft, and engineering process by Bipul.',
        pathname: `/blog/${params.slug}`,
        title: 'Blog — Bipul',
      })
    }

    const { blog, siteOrigin } = loaderData
    const title = resolveSeoTitle(blog)
    const description = resolveSeoDescription(blog)
    const ogImage = resolveOgImage(blog)
    const meta = baseMeta({
      description,
      ogImage,
      origin: siteOrigin,
      pathname: `/blog/${params.slug}`,
      title,
    })

    return {
      ...meta,
      meta: [
        ...meta.meta,
        {
          'script:ld+json': blogJsonLd({
            coverImagePath: blog.coverImagePath,
            description,
            pathname: `/blog/${params.slug}`,
            publishedAt: blog.publishedAt,
            title: blog.title,
          }),
        },
      ],
    } as any
  },
  component: BlogDetailPage,
})

function BlogDetailPage() {
  const { blog } = Route.useLoaderData()

  return (
    <SiteShell>
      <RichContentPage
        backLabel="Back to blog"
        backTo="/blog"
        bodyHtml={blog.bodyHtml}
        coverImagePath={blog.coverImagePath}
        description={blog.excerpt}
        kicker="article"
        meta={blogMeta(blog)}
        title={blog.title}
      />
    </SiteShell>
  )
}
