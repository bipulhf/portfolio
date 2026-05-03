import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AdminPagePending } from '~/components/admin/admin-page-pending'
import { AdminShell } from '~/components/admin/admin-shell'
import { AdminActionLink, AdminCard, AdminEmptyState, AdminSectionHeading, AdminStatusPill } from '~/components/admin/primitives'
import { listBlogsRequest, queryKeys } from '~/lib/admin-queries'
import { requireAdminSession } from '~/lib/auth/session-fns'
import { NO_STORE_CACHE_CONTROL } from '~/lib/http'

export const Route = createFileRoute('/admin/blogs')({
  loader: async () => requireAdminSession(),
  pendingComponent: () => <AdminPagePending subtitle="Loading your writing library." title="Blog posts" />,
  headers: () => ({
    'Cache-Control': NO_STORE_CACHE_CONTROL,
  }),
  component: AdminBlogsPage,
})

function AdminBlogsPage() {
  const blogsQuery = useQuery({
    queryKey: queryKeys.blogs,
    queryFn: listBlogsRequest,
  })

  const blogs = blogsQuery.data ?? []

  return (
    <AdminShell
      subtitle="Draft and publish articles that feed the public writing section."
      title="Blog posts"
    >
      {blogs.length ? (
        <AdminCard>
          <AdminSectionHeading action={<AdminActionLink to="/admin/blogs/new">New post</AdminActionLink>} eyebrow="content" title="All blog posts" />
          <div className="space-y-3">
            {blogs.map((blog) => (
              <Link
                className="flex flex-wrap items-center justify-between gap-4 rounded-[1.2rem] border border-ink/12 bg-white/60 px-4 py-4 text-ink no-underline transition-colors hover:bg-white"
                key={blog.id}
                preload="intent"
                to="/admin/blogs/$id/edit"
                params={{ id: blog.id }}
              >
                <div className="min-w-0">
                  <div className="font-hand text-[1.25rem] text-ink">{blog.title}</div>
                  <div className="mt-1 text-sm text-ink-soft">{blog.slug}</div>
                  <div className="mt-2 line-clamp-2 max-w-3xl text-sm text-ink-soft">{blog.excerpt}</div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex rounded-full border border-ink/15 bg-white/70 px-3 py-1 font-hand text-sm text-ink-soft">
                    {blog.readingTimeMinutes} min
                  </span>
                  <AdminStatusPill status={blog.status} />
                </div>
              </Link>
            ))}
          </div>
        </AdminCard>
      ) : (
        <AdminEmptyState
          actionLabel="Create your first post"
          actionTo="/admin/blogs/new"
          description="Publish a post here and it will immediately feed the public blog."
          title="No posts yet"
        />
      )}
    </AdminShell>
  )
}
