import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { db } from '~/lib/db'
import { mediaAssets } from '~/lib/db/schema'
import { getEnv } from '~/lib/env.server'

function normalizeMediaBasePath() {
  const basePath = getEnv().PUBLIC_MEDIA_BASE_URL.replace(/\/+$/, '')
  return basePath.startsWith('/') ? basePath : `/${basePath}`
}

function ensureSafeRelativePath(relativePath: string) {
  const normalized = relativePath.replace(/^\/+/, '')

  if (normalized.includes('..')) {
    throw new Error('Invalid media path.')
  }

  return normalized
}

function extensionFromName(name: string) {
  const ext = path.extname(name).toLowerCase()
  return ext && ext.length <= 10 ? ext : ''
}

export async function saveImageUpload(file: File, uploadedByAdminId?: string) {
  const buffer = Buffer.from(await file.arrayBuffer())
  const directory = path.resolve(getEnv().MEDIA_ROOT)
  const extension = extensionFromName(file.name) || '.bin'
  const filename = `${randomUUID()}${extension}`

  await mkdir(directory, { recursive: true })
  await writeFile(path.join(directory, filename), buffer)

  const publicPath = `${normalizeMediaBasePath()}/${filename}`

  await db.insert(mediaAssets).values({
    filename,
    mimeType: file.type || 'application/octet-stream',
    sizeBytes: buffer.byteLength,
    publicPath,
    uploadedByAdminId,
  })

  return {
    filename,
    mimeType: file.type || 'application/octet-stream',
    publicPath,
    sizeBytes: buffer.byteLength,
  }
}

export async function readMediaAsset(relativePath: string) {
  const safePath = ensureSafeRelativePath(relativePath)
  const fullPath = path.resolve(getEnv().MEDIA_ROOT, safePath)
  const directory = path.resolve(getEnv().MEDIA_ROOT)

  if (!fullPath.startsWith(directory)) {
    throw new Error('Invalid media path.')
  }

  const body = await readFile(fullPath)
  return {
    body,
    filename: path.basename(fullPath),
  }
}
