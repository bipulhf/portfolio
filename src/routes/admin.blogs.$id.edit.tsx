import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { AdminPagePending } from '~/components/admin/admin-page-pending'
import { blogToFormState } from '~/components/admin/form-state'
import { BlogEditorForm } from '~/components/admin/blog-editor-form'
import { AdminShell } from '~/components/admin/admin-shell'
import { getBlogRequest, queryKeys } from '~/lib/admin-queries'
import { requireAdminSession } from '~/lib/auth/session-fns'
import { NO_STORE_CACHE_CONTROL } from '~/lib/http'

export const Route = createFileRoute('/admin/blogs/$id/edit')({
  loader: async () => requireAdminSession(),
  pendingComponent: () => <AdminPagePending subtitle="Loading blog content." title="Edit blog post" />,
  headers: () => ({
    'Cache-Control': NO_STORE_CACHE_CONTROL,
  }),
  component: EditBlogPage,
})

function EditBlogPage() {
  const { id } = Route.useParams()
  const blogQuery = useQuery({
    queryKey: queryKeys.blog(id),
    queryFn: () => getBlogRequest(id),
  })

  if (!blogQuery.data) {
    return <AdminPagePending subtitle="Loading blog content." title="Edit blog post" />
  }

  return (
    <AdminShell
      subtitle="Revise the article, metadata, and publish state."
      title={`Edit: ${blogQuery.data.title}`}
    >
      <BlogEditorForm blogId={id} initialState={blogToFormState(blogQuery.data)} />
    </AdminShell>
  )
}
