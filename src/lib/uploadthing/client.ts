import { generateReactHelpers } from '@uploadthing/react'
import type { UploadRouter } from './server'

const { uploadFiles } = generateReactHelpers<UploadRouter>()
const maxImageSizeBytes = 5 * 1024 * 1024

export async function uploadAdminImage(
  file: File,
  options: {
    onUploadProgress?: (progress: number) => void
  } = {},
) {
  if (file.size > maxImageSizeBytes) {
    throw new Error('Image must be 5MB or smaller.')
  }

  const uploads = await uploadFiles('adminImage', {
    files: [file],
    onUploadProgress: ({ progress }) => {
      options.onUploadProgress?.(progress)
    },
  })

  const [upload] = uploads

  if (!upload) {
    throw new Error('Image upload failed.')
  }

  return {
    fileKey: upload.serverData?.fileKey ?? upload.key ?? '',
    publicPath: upload.serverData?.publicPath ?? upload.ufsUrl,
  }
}
