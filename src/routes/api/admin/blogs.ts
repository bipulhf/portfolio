import { createFileRoute } from '@tanstack/react-router'
import { requireAdminFromRequest } from '~/lib/auth/server'
import { createBlog, listAdminBlogs } from '~/lib/content/queries'
import { errorResponse, NO_STORE_CACHE_CONTROL, jsonResponse } from '~/lib/http'
import { blogInputSchema } from '~/lib/validation/content'

export const Route = createFileRoute('/api/admin/blogs')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await requireAdminFromRequest(request)

        return jsonResponse(await listAdminBlogs(), {
          headers: {
            'Cache-Control': NO_STORE_CACHE_CONTROL,
          },
        })
      },
      POST: async ({ request }) => {
        await requireAdminFromRequest(request)

        try {
          const payload = blogInputSchema.parse(await request.json())
          const blog = await createBlog(payload)

          return jsonResponse(blog, {
            status: 201,
            headers: {
              'Cache-Control': NO_STORE_CACHE_CONTROL,
            },
          })
        } catch (error) {
          return errorResponse(error instanceof Error ? error.message : 'Failed to create blog post.', 400, {
            headers: {
              'Cache-Control': NO_STORE_CACHE_CONTROL,
            },
          })
        }
      },
    },
  },
})
