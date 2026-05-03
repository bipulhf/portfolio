import { createFileRoute } from '@tanstack/react-router'
import { CrayonPendingPage } from '~/components/loaders/crayon-pending'
import { PortfolioPage } from '~/components/portfolio/portfolio-page'
import { SiteShell } from '~/components/public/site-shell'
import { getHomeContentFn } from '~/lib/server-fns/content'
import { baseMeta } from '~/lib/seo'

export const Route = createFileRoute('/')({
  loader: async () => getHomeContentFn(),
  pendingComponent: () => (
    <SiteShell>
      <CrayonPendingPage title="Loading home" />
    </SiteShell>
  ),
  headers: () => ({
    'Cache-Control': 'public, max-age=120, stale-while-revalidate=900',
  }),
  head: () =>
    baseMeta({
      description:
        'A crayon-styled portfolio for Shahiduzzaman Bipul featuring projects, writing, and experience.',
      pathname: '/',
      title: 'Shahiduzzaman Bipul — Portfolio',
    }),
  component: HomePage,
})

function HomePage() {
  const { blogs, projects } = Route.useLoaderData()

  return <PortfolioPage blogs={blogs} projects={projects} />
}
