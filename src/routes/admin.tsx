import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AdminAppProviders } from '~/components/app/admin-app-providers'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <AdminAppProviders>
      <Outlet />
    </AdminAppProviders>
  )
}
