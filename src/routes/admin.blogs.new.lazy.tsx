import { createLazyFileRoute } from '@tanstack/react-router'
import { AdminShell } from '~/components/admin/admin-shell'
import { BlogEditorForm } from '~/components/admin/blog-editor-form'
import { emptyBlogFormState } from '~/components/admin/form-state'

export const Route = createLazyFileRoute('/admin/blogs/new')({
  component: NewBlogPage,
})

function NewBlogPage() {
  return (
    <AdminShell
      subtitle="Write a new article, enrich it with media, and publish when it is ready."
      title="New blog post"
    >
      <BlogEditorForm initialState={emptyBlogFormState} />
    </AdminShell>
  )
}
