import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { AdminPagePending } from '~/components/admin/admin-page-pending'
import { projectToFormState } from '~/components/admin/form-state'
import { ProjectEditorForm } from '~/components/admin/project-editor-form'
import { AdminShell } from '~/components/admin/admin-shell'
import { getProjectRequest, queryKeys } from '~/lib/admin-queries'

export const Route = createLazyFileRoute('/admin/projects/$id/edit')({
  pendingComponent: () => <AdminPagePending subtitle="Loading project content." title="Edit project" />,
  component: EditProjectPage,
})

function EditProjectPage() {
  const { id } = Route.useParams()
  const projectQuery = useQuery({
    queryKey: queryKeys.project(id),
    queryFn: () => getProjectRequest(id),
  })

  if (!projectQuery.data) {
    return <AdminPagePending subtitle="Loading project content." title="Edit project" />
  }

  return (
    <AdminShell
      subtitle="Refine the case study, media, metadata, and publishing state."
      title={`Edit: ${projectQuery.data.title}`}
    >
      <ProjectEditorForm initialState={projectToFormState(projectQuery.data)} projectId={id} />
    </AdminShell>
  )
}
