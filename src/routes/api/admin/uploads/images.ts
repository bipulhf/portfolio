import { createFileRoute } from '@tanstack/react-router'
import { requireAdminFromRequest } from '~/lib/auth/server'
import { errorResponse, NO_STORE_CACHE_CONTROL, jsonResponse } from '~/lib/http'
import { saveImageUpload } from '~/lib/media'

const allowedMimeTypes = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml'])
const maxSizeBytes = 5 * 1024 * 1024

export const Route = createFileRoute('/api/admin/uploads/images')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const session = await requireAdminFromRequest(request)

        try {
          const formData = await request.formData()
          const file = formData.get('file')

          if (!(file instanceof File)) {
            return errorResponse('Please provide an image file.', 400, {
              headers: {
                'Cache-Control': NO_STORE_CACHE_CONTROL,
              },
            })
          }

          if (file.size > maxSizeBytes) {
            return errorResponse('Image must be 5MB or smaller.', 400, {
              headers: {
                'Cache-Control': NO_STORE_CACHE_CONTROL,
              },
            })
          }

          if (file.type && !allowedMimeTypes.has(file.type)) {
            return errorResponse('Unsupported image type.', 400, {
              headers: {
                'Cache-Control': NO_STORE_CACHE_CONTROL,
              },
            })
          }

          const upload = await saveImageUpload(file, session.adminId)

          return jsonResponse(
            { publicPath: upload.publicPath },
            {
              status: 201,
              headers: {
                'Cache-Control': NO_STORE_CACHE_CONTROL,
              },
            },
          )
        } catch (error) {
          return errorResponse(error instanceof Error ? error.message : 'Image upload failed.', 400, {
            headers: {
              'Cache-Control': NO_STORE_CACHE_CONTROL,
            },
          })
        }
      },
    },
  },
})
