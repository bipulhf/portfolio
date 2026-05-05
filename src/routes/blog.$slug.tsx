import { createFileRoute } from '@tanstack/react-router'
import { CrayonPendingPage } from '~/components/loaders/crayon-pending'
import { blogMeta, RichContentPage } from '~/components/public/rich-content'
import { SiteShell } from '~/components/public/site-shell'
import type { SerializedBlog } from '~/lib/content/types'
import { getPublishedBlogBySlugFn } from '~/lib/server-fns/content'
import { PUBLIC_DETAIL_CACHE_CONTROL } from '~/lib/http'
import { baseMeta, blogJsonLd, resolveOgImage, resolveSeoDescription, resolveSeoTitle } from '~/lib/seo'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => getPublishedBlogBySlugFn({ data: { slug: params.slug } }),
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
    const blog = loaderData as SerializedBlog
    const title = resolveSeoTitle(blog)
    const description = resolveSeoDescription(blog)
    const ogImage = resolveOgImage(blog)
    const meta = baseMeta({
      description,
      ogImage,
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
  const blog = Route.useLoaderData() as SerializedBlog

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
