import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AdminPagePending } from '~/components/admin/admin-page-pending'
import { AdminShell } from '~/components/admin/admin-shell'
import {
  AdminActionLink,
  AdminCard,
  AdminSectionHeading,
  AdminStatusPill,
} from '~/components/admin/primitives'
import { listBlogsRequest, listProjectsRequest, queryKeys } from '~/lib/admin-queries'
import { requireAdminSession } from '~/lib/auth/session-fns'
import { NO_STORE_CACHE_CONTROL } from '~/lib/http'

export const Route = createFileRoute('/admin/')({
  loader: async () => requireAdminSession(),
  pendingComponent: () => (
    <AdminPagePending
      subtitle="Checking your session and loading the workspace."
      title="Admin dashboard"
    />
  ),
  headers: () => ({
    'Cache-Control': NO_STORE_CACHE_CONTROL,
  }),
  component: AdminDashboardPage,
})

function AdminDashboardPage() {
  const projectsQuery = useQuery({
    queryKey: queryKeys.projects,
    queryFn: listProjectsRequest,
  })
  const blogsQuery = useQuery({
    queryKey: queryKeys.blogs,
    queryFn: listBlogsRequest,
  })

  const recentProjects = projectsQuery.data?.slice(0, 3) ?? []
  const recentBlogs = blogsQuery.data?.slice(0, 3) ?? []

  return (
    <AdminShell
      subtitle="See what is live, what is still in draft, and where to pick up next."
      title="Admin dashboard"
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AdminCard>
          <div className="font-hand text-lg text-ink-soft">Projects</div>
          <div className="mt-3 font-display text-[3rem] font-bold text-ink">
            {projectsQuery.data?.length ?? '...'}
          </div>
          <div className="mt-4">
            <AdminActionLink to="/admin/projects/new">New project</AdminActionLink>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="font-hand text-lg text-ink-soft">Blog posts</div>
          <div className="mt-3 font-display text-[3rem] font-bold text-ink">
            {blogsQuery.data?.length ?? '...'}
          </div>
          <div className="mt-4">
            <AdminActionLink to="/admin/blogs/new">New post</AdminActionLink>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="font-hand text-lg text-ink-soft">Projects on site</div>
          <div className="mt-3 font-display text-[3rem] font-bold text-ink">
            {projectsQuery.data?.filter((item) => item.status === 'published').length ?? '...'}
          </div>
          <div className="mt-2 text-sm text-ink-soft">Projects currently visible on the public site.</div>
        </AdminCard>
        <AdminCard>
          <div className="font-hand text-lg text-ink-soft">Posts on site</div>
          <div className="mt-3 font-display text-[3rem] font-bold text-ink">
            {blogsQuery.data?.filter((item) => item.status === 'published').length ?? '...'}
          </div>
          <div className="mt-2 text-sm text-ink-soft">Posts currently visible on the public site.</div>
        </AdminCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminCard>
          <AdminSectionHeading
            action={<AdminActionLink to="/admin/projects">See all</AdminActionLink>}
            eyebrow="recent work"
            title="Recent projects"
          />
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <Link
                className="flex items-center justify-between gap-4 rounded-[1.1rem] border border-ink/12 bg-white/60 px-4 py-3 text-ink no-underline transition-colors hover:bg-white"
                key={project.id}
                preload="intent"
                to="/admin/projects/$id/edit"
                params={{ id: project.id }}
              >
                <div>
                  <div className="font-hand text-[1.15rem] text-ink">{project.title}</div>
                  <div className="text-sm text-ink-soft">{project.slug}</div>
                </div>
                <AdminStatusPill status={project.status} />
              </Link>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <AdminSectionHeading
            action={<AdminActionLink to="/admin/blogs">See all</AdminActionLink>}
            eyebrow="recent writing"
            title="Recent posts"
          />
          <div className="space-y-3">
            {recentBlogs.map((blog) => (
              <Link
                className="flex items-center justify-between gap-4 rounded-[1.1rem] border border-ink/12 bg-white/60 px-4 py-3 text-ink no-underline transition-colors hover:bg-white"
                key={blog.id}
                preload="intent"
                to="/admin/blogs/$id/edit"
                params={{ id: blog.id }}
              >
                <div>
                  <div className="font-hand text-[1.15rem] text-ink">{blog.title}</div>
                  <div className="text-sm text-ink-soft">{blog.slug}</div>
                </div>
                <AdminStatusPill status={blog.status} />
              </Link>
            ))}
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  )
}
