import { db } from '~/lib/db'
import { blogs, projects } from '~/lib/db/schema'
import { getUtapi, hasUploadthingToken } from './server'

type UploadThingContentFields = {
  bodyHtml?: string | null
  coverImagePath?: string | null
  ogImagePath?: string | null
}

const UPLOADTHING_HOST_SUFFIX = '.ufs.sh'
const LEGACY_UPLOADTHING_HOST = 'utfs.io'
const URL_PATTERN = /https?:\/\/[^\s"'<>]+/gu

function extractFileKeyFromUploadThingUrl(value: string) {
  let parsed: URL

  try {
    parsed = new URL(value)
  } catch {
    return null
  }

  const isUploadThingHost =
    parsed.hostname === LEGACY_UPLOADTHING_HOST ||
    parsed.hostname.endsWith(UPLOADTHING_HOST_SUFFIX)

  if (!isUploadThingHost) {
    return null
  }

  const segments = parsed.pathname.split('/').filter(Boolean)

  if (segments[0] !== 'f' || !segments[1]) {
    return null
  }

  return decodeURIComponent(segments[1])
}

function extractUploadThingFileKeysFromText(value?: string | null) {
  const fileKeys = new Set<string>()

  if (!value) {
    return fileKeys
  }

  for (const match of value.match(URL_PATTERN) ?? []) {
    const normalized = match.replace(/[),.;]+$/u, '')
    const fileKey = extractFileKeyFromUploadThingUrl(normalized)

    if (fileKey) {
      fileKeys.add(fileKey)
    }
  }

  return fileKeys
}

export function collectUploadThingFileKeys(fields: UploadThingContentFields) {
  return new Set([
    ...extractUploadThingFileKeysFromText(fields.coverImagePath),
    ...extractUploadThingFileKeysFromText(fields.ogImagePath),
    ...extractUploadThingFileKeysFromText(fields.bodyHtml),
  ])
}

function getRemovedKeys(previous: Set<string>, next: Set<string>) {
  return [...previous].filter((fileKey) => !next.has(fileKey))
}

async function listReferencedUploadThingKeys() {
  const [projectRows, blogRows] = await Promise.all([
    db
      .select({
        bodyHtml: projects.bodyHtml,
        coverImagePath: projects.coverImagePath,
        ogImagePath: projects.ogImagePath,
      })
      .from(projects),
    db
      .select({
        bodyHtml: blogs.bodyHtml,
        coverImagePath: blogs.coverImagePath,
        ogImagePath: blogs.ogImagePath,
      })
      .from(blogs),
  ])

  const referencedKeys = new Set<string>()

  for (const row of [...projectRows, ...blogRows]) {
    for (const fileKey of collectUploadThingFileKeys(row)) {
      referencedKeys.add(fileKey)
    }
  }

  return referencedKeys
}

export async function cleanupRemovedUploadThingFiles(previous: Set<string>, next: Set<string>) {
  const removedKeys = getRemovedKeys(previous, next)

  if (!removedKeys.length) {
    return
  }

  await cleanupUnreferencedUploadThingFiles(removedKeys)
}

export async function cleanupUnreferencedUploadThingFiles(fileKeys: Iterable<string>) {
  const uniqueKeys = [...new Set([...fileKeys].filter(Boolean))]

  if (!uniqueKeys.length) {
    return
  }

  if (!hasUploadthingToken()) {
    console.warn('[uploadthing] Skipping cleanup because UPLOADTHING_TOKEN is not configured.')
    return
  }

  try {
    const referencedKeys = await listReferencedUploadThingKeys()
    const deletableKeys = uniqueKeys.filter((fileKey) => !referencedKeys.has(fileKey))

    if (!deletableKeys.length) {
      return
    }

    await getUtapi().deleteFiles(deletableKeys)
  } catch (error) {
    console.error('[uploadthing] Failed to delete unreferenced files.', error)
  }
}
