import { createFileRoute } from '@tanstack/react-router'
import { createRouteHandler } from 'uploadthing/server'
import { errorResponse, NO_STORE_CACHE_CONTROL } from '~/lib/http'
import { hasUploadthingToken, uploadRouter } from '~/lib/uploadthing/server'

const uploadthingHandler = createRouteHandler({
  router: uploadRouter,
})

function getUploadthingUnavailableResponse() {
  return errorResponse('Image uploads are not configured yet. Set UPLOADTHING_TOKEN first.', 503, {
    headers: {
      'Cache-Control': NO_STORE_CACHE_CONTROL,
    },
  })
}

export const Route = createFileRoute('/api/uploadthing')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!hasUploadthingToken()) {
          return getUploadthingUnavailableResponse()
        }

        return uploadthingHandler(request)
      },
      POST: async ({ request }) => {
        if (!hasUploadthingToken()) {
          return getUploadthingUnavailableResponse()
        }

        return uploadthingHandler(request)
      },
    },
  },
})
