import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { AdminPagePending } from '~/components/admin/admin-page-pending'
import { projectToFormState } from '~/components/admin/form-state'
import { ProjectEditorForm } from '~/components/admin/project-editor-form'
import { AdminShell } from '~/components/admin/admin-shell'
import { getProjectRequest, queryKeys } from '~/lib/admin-queries'
import { requireAdminSession } from '~/lib/auth/session-fns'
import { NO_STORE_CACHE_CONTROL } from '~/lib/http'

export const Route = createFileRoute('/admin/projects/$id/edit')({
  loader: async () => requireAdminSession(),
  pendingComponent: () => <AdminPagePending subtitle="Loading project content." title="Edit project" />,
  headers: () => ({
    'Cache-Control': NO_STORE_CACHE_CONTROL,
  }),
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
