import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AdminPagePending } from '~/components/admin/admin-page-pending'
import { AdminShell } from '~/components/admin/admin-shell'
import {
  AdminActionLink,
  AdminCard,
  AdminEmptyState,
  AdminSectionHeading,
  AdminStatusPill,
} from '~/components/admin/primitives'
import { listProjectsRequest, queryKeys } from '~/lib/admin-queries'
import { requireAdminSession } from '~/lib/auth/session-fns'
import { NO_STORE_CACHE_CONTROL } from '~/lib/http'

export const Route = createFileRoute('/admin/projects/')({
  loader: async () => requireAdminSession(),
  pendingComponent: () => (
    <AdminPagePending subtitle="Loading your case studies and drafts." title="Projects" />
  ),
  headers: () => ({
    'Cache-Control': NO_STORE_CACHE_CONTROL,
  }),
  component: AdminProjectsPage,
})

function AdminProjectsPage() {
  const projectsQuery = useQuery({
    queryKey: queryKeys.projects,
    queryFn: listProjectsRequest,
  })

  const projects = projectsQuery.data ?? []

  return (
    <AdminShell
      subtitle="Create case studies, revise drafts, and keep the public portfolio current."
      title="Projects"
    >
      {projects.length ? (
        <AdminCard>
          <AdminSectionHeading
            action={<AdminActionLink to="/admin/projects/new">New project</AdminActionLink>}
            eyebrow="content"
            title="All projects"
          />
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                className="flex flex-col items-start gap-3 rounded-[1.2rem] border border-ink/12 bg-white/60 px-4 py-4 text-ink no-underline transition-colors hover:bg-white sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                key={project.id}
                preload="intent"
                to="/admin/projects/$id/edit"
                params={{ id: project.id }}
              >
                <div className="min-w-0 w-full sm:w-auto">
                  <div className="font-hand text-[1.25rem] text-ink">{project.title}</div>
                  <div className="mt-1 text-sm text-ink-soft">{project.slug}</div>
                  <div className="mt-2 line-clamp-2 max-w-3xl text-sm text-ink-soft">
                    {project.summary}
                  </div>
                </div>
                <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto sm:justify-start">
                  {project.featured ? (
                    <span className="inline-flex rounded-full border border-ink bg-peach px-3 py-1 font-hand text-sm text-ink">
                      featured
                    </span>
                  ) : null}
                  <AdminStatusPill status={project.status} />
                </div>
              </Link>
            ))}
          </div>
        </AdminCard>
      ) : (
        <AdminEmptyState
          actionLabel="Create your first project"
          actionTo="/admin/projects/new"
          description="Create a project draft here, then publish it when it is ready for the public portfolio."
          title="No projects yet"
        />
      )}
    </AdminShell>
  )
}
