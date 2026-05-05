import { createFileRoute } from '@tanstack/react-router'
import { CrayonPendingPage } from '~/components/loaders/crayon-pending'
import { RichContentPage, projectMeta } from '~/components/public/rich-content'
import { SiteShell } from '~/components/public/site-shell'
import type { SerializedProject } from '~/lib/content/types'
import { getPublishedProjectBySlugFn } from '~/lib/server-fns/content'
import { PUBLIC_DETAIL_CACHE_CONTROL } from '~/lib/http'
import { baseMeta, projectJsonLd, resolveOgImage, resolveSeoDescription, resolveSeoTitle } from '~/lib/seo'

export const Route = createFileRoute('/projects/$slug')({
  loader: async ({ params }) => getPublishedProjectBySlugFn({ data: { slug: params.slug } }),
  pendingComponent: () => (
    <SiteShell>
      <CrayonPendingPage title="Loading case study" />
    </SiteShell>
  ),
  headers: () => ({
    'Cache-Control': PUBLIC_DETAIL_CACHE_CONTROL,
    Vary: 'Cookie',
  }),
  head: ({ loaderData, params }) => {
    const project = loaderData as SerializedProject
    const title = resolveSeoTitle(project)
    const description = resolveSeoDescription(project)
    const ogImage = resolveOgImage(project)
    const meta = baseMeta({
      description,
      ogImage,
      pathname: `/projects/${params.slug}`,
      title,
    })

    return {
      ...meta,
      meta: [
        ...meta.meta,
        {
          'script:ld+json': projectJsonLd({
            bodyHtml: project.bodyHtml,
            liveUrl: project.liveUrl,
            pathname: `/projects/${params.slug}`,
            repoUrl: project.repoUrl,
            title: project.title,
          }),
        },
      ],
    } as any
  },
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const project = Route.useLoaderData() as SerializedProject

  return (
    <SiteShell>
      <RichContentPage
        backLabel="Back to projects"
        backTo="/projects"
        bodyHtml={project.bodyHtml}
        coverImagePath={project.coverImagePath}
        description={project.excerpt || project.summary}
        kicker="case study"
        meta={projectMeta(project)}
        title={project.title}
      />
    </SiteShell>
  )
}
