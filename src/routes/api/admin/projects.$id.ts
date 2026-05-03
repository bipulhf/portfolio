import { createFileRoute } from '@tanstack/react-router'
import { requireAdminFromRequest } from '~/lib/auth/server'
import { deleteProject, getAdminProjectById, updateProject } from '~/lib/content/queries'
import { errorResponse, NO_STORE_CACHE_CONTROL, jsonResponse } from '~/lib/http'
import { projectInputSchema } from '~/lib/validation/content'

export const Route = createFileRoute('/api/admin/projects/$id')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        await requireAdminFromRequest(request)
        const project = await getAdminProjectById(params.id)

        if (!project) {
          return errorResponse('Project not found.', 404, {
            headers: {
              'Cache-Control': NO_STORE_CACHE_CONTROL,
            },
          })
        }

        return jsonResponse(project, {
          headers: {
            'Cache-Control': NO_STORE_CACHE_CONTROL,
          },
        })
      },
      PATCH: async ({ params, request }) => {
        await requireAdminFromRequest(request)

        try {
          const payload = projectInputSchema.parse(await request.json())
          const project = await updateProject(params.id, payload)

          if (!project) {
            return errorResponse('Project not found.', 404, {
              headers: {
                'Cache-Control': NO_STORE_CACHE_CONTROL,
              },
            })
          }

          return jsonResponse(project, {
            headers: {
              'Cache-Control': NO_STORE_CACHE_CONTROL,
            },
          })
        } catch (error) {
          return errorResponse(error instanceof Error ? error.message : 'Failed to update project.', 400, {
            headers: {
              'Cache-Control': NO_STORE_CACHE_CONTROL,
            },
          })
        }
      },
      DELETE: async ({ params, request }) => {
        await requireAdminFromRequest(request)
        await deleteProject(params.id)

        return jsonResponse(
          { ok: true },
          {
            headers: {
              'Cache-Control': NO_STORE_CACHE_CONTROL,
            },
          },
        )
      },
    },
  },
})
