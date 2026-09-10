import { createLazyFileRoute } from '@tanstack/react-router'
import { AdminShell } from '~/components/admin/admin-shell'
import { ProjectEditorForm } from '~/components/admin/project-editor-form'
import { emptyProjectFormState } from '~/components/admin/form-state'

export const Route = createLazyFileRoute('/admin/projects/new')({
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
