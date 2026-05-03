import { createFileRoute } from '@tanstack/react-router'
import { requireAdminFromRequest } from '~/lib/auth/server'
import { createProject, listAdminProjects } from '~/lib/content/queries'
import { errorResponse, NO_STORE_CACHE_CONTROL, jsonResponse } from '~/lib/http'
import { projectInputSchema } from '~/lib/validation/content'

export const Route = createFileRoute('/api/admin/projects')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await requireAdminFromRequest(request)

        return jsonResponse(await listAdminProjects(), {
          headers: {
            'Cache-Control': NO_STORE_CACHE_CONTROL,
          },
        })
      },
      POST: async ({ request }) => {
        await requireAdminFromRequest(request)

        try {
          const payload = projectInputSchema.parse(await request.json())
          const project = await createProject(payload)

          return jsonResponse(project, {
            status: 201,
            headers: {
              'Cache-Control': NO_STORE_CACHE_CONTROL,
            },
          })
        } catch (error) {
          return errorResponse(error instanceof Error ? error.message : 'Failed to create project.', 400, {
            headers: {
              'Cache-Control': NO_STORE_CACHE_CONTROL,
            },
          })
        }
      },
    },
  },
})
