import { createFileRoute } from '@tanstack/react-router'
import { AdminShell } from '~/components/admin/admin-shell'
import { ProjectEditorForm } from '~/components/admin/project-editor-form'
import { emptyProjectFormState } from '~/components/admin/form-state'
import { requireAdminSession } from '~/lib/auth/session-fns'
import { NO_STORE_CACHE_CONTROL } from '~/lib/http'

export const Route = createFileRoute('/admin/projects/new')({
  loader: async () => requireAdminSession(),
  headers: () => ({
    'Cache-Control': NO_STORE_CACHE_CONTROL,
  }),
  component: NewProjectPage,
})

function NewProjectPage() {
  return (
    <AdminShell
      subtitle="Shape a new case study with metadata, media, and a full rich-text narrative."
      title="New project"
    >
      <ProjectEditorForm initialState={emptyProjectFormState} />
    </AdminShell>
  )
}
