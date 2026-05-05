import { createFileRoute } from '@tanstack/react-router'
import { CrayonPendingPage } from '~/components/loaders/crayon-pending'
import { RichContentPage, projectMeta } from '~/components/public/rich-content'
import { SiteShell } from '~/components/public/site-shell'
import type { SerializedProject } from '~/lib/content/types'
import { getPublishedProjectBySlugFn } from '~/lib/server-fns/content'
import { PUBLIC_DETAIL_CACHE_CONTROL } from '~/lib/http'
import { baseMeta, projectJsonLd, resolveOgImage, resolveSeoDescription, resolveSeoTitle } from '~/lib/seo'

function formatProjectDate(value: string | null) {
  if (!value) {
    return 'Draft'
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

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
  const detailActions = [
    project.liveUrl ? { href: project.liveUrl, label: 'View live' } : null,
    project.repoUrl ? { href: project.repoUrl, label: 'Browse code' } : null,
  ].filter((value): value is { href: string; label: string } => Boolean(value))

  const detailFacts = [
    { label: 'Release', value: formatProjectDate(project.publishedAt) },
    { label: 'Updated', value: formatProjectDate(project.updatedAt) },
    {
      label: 'Mode',
      value: project.liveUrl ? 'Live build available' : 'Case study only',
    },
    {
      label: 'Type',
      value: project.featured ? 'Featured project' : 'Selected project',
    },
  ]

  return (
    <SiteShell>
      <RichContentPage
        backLabel="Back to projects"
        backTo="/projects"
        bodyHtml={project.bodyHtml}
        coverImagePath={project.coverImagePath}
        description={project.excerpt || project.summary}
        detailActions={detailActions}
        detailFacts={detailFacts}
        kicker="case study"
        tags={project.techStack}
        meta={projectMeta(project)}
        title={project.title}
      />
    </SiteShell>
  )
}
