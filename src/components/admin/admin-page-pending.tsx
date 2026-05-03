import { AdminShell } from './admin-shell'
import { AdminCard } from './primitives'
import { EditorPendingShell } from '~/components/loaders/crayon-pending'

export function AdminPagePending({
  subtitle,
  title,
}: Readonly<{
  subtitle?: string
  title: string
}>) {
  return (
    <AdminShell subtitle={subtitle} title={title}>
      <AdminCard>
        <EditorPendingShell />
      </AdminCard>
    </AdminShell>
  )
}
