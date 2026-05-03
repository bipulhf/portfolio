import path from 'node:path'
import { createFileRoute } from '@tanstack/react-router'
import { readMediaAsset } from '~/lib/media'

const mimeTypes: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

export const Route = createFileRoute('/media/$')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const asset = await readMediaAsset(params._splat ?? '')
          const extension = path.extname(asset.filename).toLowerCase()

          return new Response(asset.body, {
            headers: {
              'Cache-Control': 'public, max-age=31536000, immutable',
              'Content-Type': mimeTypes[extension] ?? 'application/octet-stream',
            },
          })
        } catch {
          return new Response('Not found', { status: 404 })
        }
      },
    },
  },
})
