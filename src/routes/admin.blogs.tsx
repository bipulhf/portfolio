import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/blogs')({
  component: AdminBlogsLayout,
})

function AdminBlogsLayout() {
  return <Outlet />
}
