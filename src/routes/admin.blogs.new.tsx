import { createFileRoute } from '@tanstack/react-router'
import { AdminShell } from '~/components/admin/admin-shell'
import { BlogEditorForm } from '~/components/admin/blog-editor-form'
import { emptyBlogFormState } from '~/components/admin/form-state'
import { requireAdminSession } from '~/lib/auth/session-fns'
import { NO_STORE_CACHE_CONTROL } from '~/lib/http'

export const Route = createFileRoute('/admin/blogs/new')({
  loader: async () => requireAdminSession(),
  headers: () => ({
    'Cache-Control': NO_STORE_CACHE_CONTROL,
  }),
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
