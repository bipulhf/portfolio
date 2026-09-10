import { Outlet, createLazyFileRoute } from '@tanstack/react-router'
import { AdminAppProviders } from '~/components/app/admin-app-providers'

export const Route = createLazyFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <AdminAppProviders>
      <Outlet />
    </AdminAppProviders>
  )
}
