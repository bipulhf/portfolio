import { createFileRoute } from '@tanstack/react-router'
import { requireAdminFromRequest } from '~/lib/auth/server'
import { deleteBlog, getAdminBlogById, updateBlog } from '~/lib/content/queries'
import { errorResponse, NO_STORE_CACHE_CONTROL, jsonResponse } from '~/lib/http'
import { blogInputSchema } from '~/lib/validation/content'

export const Route = createFileRoute('/api/admin/blogs/$id')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        await requireAdminFromRequest(request)
        const blog = await getAdminBlogById(params.id)

        if (!blog) {
          return errorResponse('Blog post not found.', 404, {
            headers: {
              'Cache-Control': NO_STORE_CACHE_CONTROL,
            },
          })
        }

        return jsonResponse(blog, {
          headers: {
            'Cache-Control': NO_STORE_CACHE_CONTROL,
          },
        })
      },
      PATCH: async ({ params, request }) => {
        await requireAdminFromRequest(request)

        try {
          const payload = blogInputSchema.parse(await request.json())
          const blog = await updateBlog(params.id, payload)

          if (!blog) {
            return errorResponse('Blog post not found.', 404, {
              headers: {
                'Cache-Control': NO_STORE_CACHE_CONTROL,
              },
            })
          }

          return jsonResponse(blog, {
            headers: {
              'Cache-Control': NO_STORE_CACHE_CONTROL,
            },
          })
        } catch (error) {
          return errorResponse(error instanceof Error ? error.message : 'Failed to update blog post.', 400, {
            headers: {
              'Cache-Control': NO_STORE_CACHE_CONTROL,
            },
          })
        }
      },
      DELETE: async ({ params, request }) => {
        await requireAdminFromRequest(request)
        await deleteBlog(params.id)

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
