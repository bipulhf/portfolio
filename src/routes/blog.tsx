import { createFileRoute } from '@tanstack/react-router'
import { CrayonGridPending, CrayonPendingPage } from '~/components/loaders/crayon-pending'
import { pageContainerClass } from '~/components/portfolio/lib/styles'
import { BlogGrid } from '~/components/public/blog-grid'
import { PageHero, PageHeroActions } from '~/components/public/page-hero'
import { SiteShell } from '~/components/public/site-shell'
import { listPublishedBlogsFn } from '~/lib/server-fns/content'
import { PUBLIC_LIST_CACHE_CONTROL } from '~/lib/http'
import { baseMeta } from '~/lib/seo'

export const Route = createFileRoute('/blog')({
  loader: async () => listPublishedBlogsFn(),
  pendingComponent: () => (
    <SiteShell>
      <CrayonPendingPage title="Loading blog">
        <CrayonGridPending cards={3} />
      </CrayonPendingPage>
    </SiteShell>
  ),
  headers: () => ({
    'Cache-Control': PUBLIC_LIST_CACHE_CONTROL,
  }),
  head: () =>
    baseMeta({
      description: 'Writing on building products, frontend craft, and engineering process by Shahiduzzaman Bipul.',
      pathname: '/blog',
      title: 'Blog — Shahiduzzaman Bipul',
    }),
  component: BlogPage,
})

function BlogPage() {
  const posts = Route.useLoaderData()

  return (
    <SiteShell>
      <PageHero
        actions={
          <PageHeroActions
            primaryLabel="Back to home"
            primaryTo="/"
            secondaryLabel="See projects"
            secondaryTo="/projects"
          />
        }
        description="Notes from the build process, ideas worth keeping, and the quieter thinking behind the work."
        eyebrow="Writing"
        title="Blog and essays"
      />
      <section className={`${pageContainerClass} py-10 md:py-12 lg:py-16`}>
        <BlogGrid items={posts} />
      </section>
    </SiteShell>
  )
}
