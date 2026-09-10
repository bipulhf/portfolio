import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { AdminPagePending } from '~/components/admin/admin-page-pending'
import { blogToFormState } from '~/components/admin/form-state'
import { BlogEditorForm } from '~/components/admin/blog-editor-form'
import { AdminShell } from '~/components/admin/admin-shell'
import { getBlogRequest, queryKeys } from '~/lib/admin-queries'

export const Route = createLazyFileRoute('/admin/blogs/$id/edit')({
  pendingComponent: () => <AdminPagePending subtitle="Loading blog content." title="Edit blog post" />,
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
