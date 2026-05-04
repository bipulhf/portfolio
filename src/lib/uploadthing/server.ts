import { getEnv } from '~/lib/env.server'
import { getAdminFromRequest } from '~/lib/auth/server'
import { UTApi, UploadThingError, createUploadthing, type FileRouter } from 'uploadthing/server'

const f = createUploadthing()

export const uploadRouter = {
  adminImage: f({
    image: {
      maxFileCount: 1,
      maxFileSize: '8MB',
    },
  })
    .middleware(async ({ req }) => {
      const session = await getAdminFromRequest(req)

      if (!session) {
        throw new UploadThingError('Unauthorized')
      }

      return {
        adminId: session.adminId,
      }
    })
    .onUploadComplete(async ({ file, metadata }) => {
      return {
        fileKey: file.key,
        publicPath: file.ufsUrl,
        uploadedByAdminId: metadata.adminId,
      }
    }),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter

let cachedUtapi: UTApi | null = null

export function getUploadthingToken() {
  return getEnv().UPLOADTHING_TOKEN?.trim() ?? ''
}

export function hasUploadthingToken() {
  return getUploadthingToken().length > 0
}

export function getUtapi() {
  const token = getUploadthingToken()

  if (!token) {
    throw new Error('UploadThing is not configured. Set UPLOADTHING_TOKEN first.')
  }

  if (!cachedUtapi) {
    cachedUtapi = new UTApi({ token })
  }

  return cachedUtapi
}
