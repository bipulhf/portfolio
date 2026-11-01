import sanitizeHtml from 'sanitize-html'
import { and, desc, eq, ne, sql } from 'drizzle-orm'
import { db } from '~/lib/db'
import { blogs, projects } from '~/lib/db/schema'
import {
  cleanupRemovedUploadThingFiles,
  cleanupUnreferencedUploadThingFiles,
  collectUploadThingFileKeys,
} from '~/lib/uploadthing/cleanup'
import type { BlogInput, ProjectInput } from '~/lib/validation/content'
import { buildExcerpt, computeReadingTimeMinutes, stripHtml } from '~/lib/utils/text'
import { slugify } from '~/lib/utils/slug'

const allowedHtml = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    'img',
    'h1',
    'h2',
    'h3',
    'h4',
    'blockquote',
    'pre',
    'code',
    'hr',
  ]),
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'title'],
    '*': ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'data'],
}

function cleanOptional(value?: string | null) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function normalizePublishedAt(status: 'draft' | 'published', publishedAt?: string | null) {
  if (status === 'draft') {
    return null
  }

  if (publishedAt) {
    return new Date(publishedAt)
  }

  return new Date()
}

function sanitizeContentBody(bodyHtml: string) {
  return sanitizeHtml(bodyHtml, allowedHtml)
}

function buildProjectValues(input: ProjectInput) {
  const bodyHtml = sanitizeContentBody(input.bodyHtml)
  const excerpt = cleanOptional(input.excerpt) ?? buildExcerpt(bodyHtml || input.summary)

  return {
    title: input.title.trim(),
    slug: slugify(input.slug?.trim() || input.title),
    summary: input.summary.trim(),
    excerpt,
    coverImagePath: cleanOptional(input.coverImagePath),
    status: input.status,
    publishedAt: normalizePublishedAt(input.status, input.publishedAt),
    seoTitle: cleanOptional(input.seoTitle),
    seoDescription: cleanOptional(input.seoDescription) ?? excerpt,
    ogImagePath: cleanOptional(input.ogImagePath),
    bodyJson: input.bodyJson ?? null,
    bodyHtml,
    techStack: input.techStack,
    liveUrl: cleanOptional(input.liveUrl),
    repoUrl: cleanOptional(input.repoUrl),
    featured: input.featured,
  }
}

function buildBlogValues(input: BlogInput) {
  const bodyHtml = sanitizeContentBody(input.bodyHtml)
  const excerpt = cleanOptional(input.excerpt) ?? buildExcerpt(bodyHtml)

  return {
    title: input.title.trim(),
    slug: slugify(input.slug?.trim() || input.title),
    excerpt,
    coverImagePath: cleanOptional(input.coverImagePath),
    status: input.status,
    publishedAt: normalizePublishedAt(input.status, input.publishedAt),
    seoTitle: cleanOptional(input.seoTitle),
    seoDescription: cleanOptional(input.seoDescription) ?? excerpt,
    ogImagePath: cleanOptional(input.ogImagePath),
    bodyJson: input.bodyJson ?? null,
    bodyHtml,
    tags: input.tags,
    readingTimeMinutes:
      input.readingTimeMinutes ?? computeReadingTimeMinutes(stripHtml(bodyHtml)),
  }
}

async function ensureUniqueProjectSlug(slug: string, excludeId?: string) {
  const [existing] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(excludeId ? and(eq(projects.slug, slug), ne(projects.id, excludeId)) : eq(projects.slug, slug))
    .limit(1)

  if (existing) {
    throw new Error('A project with this slug already exists.')
  }
}

async function ensureUniqueBlogSlug(slug: string, excludeId?: string) {
  const [existing] = await db
    .select({ id: blogs.id })
    .from(blogs)
    .where(excludeId ? and(eq(blogs.slug, slug), ne(blogs.id, excludeId)) : eq(blogs.slug, slug))
    .limit(1)

  if (existing) {
    throw new Error('A blog post with this slug already exists.')
  }
}

const projectCardColumns = {
  id: projects.id,
  slug: projects.slug,
  title: projects.title,
  summary: projects.summary,
  excerpt: projects.excerpt,
  coverImagePath: projects.coverImagePath,
  status: projects.status,
  publishedAt: projects.publishedAt,
  seoTitle: projects.seoTitle,
  seoDescription: projects.seoDescription,
  ogImagePath: projects.ogImagePath,
  techStack: projects.techStack,
  liveUrl: projects.liveUrl,
  repoUrl: projects.repoUrl,
  featured: projects.featured,
  createdAt: projects.createdAt,
  updatedAt: projects.updatedAt,
}

const blogCardColumns = {
  id: blogs.id,
  slug: blogs.slug,
  title: blogs.title,
  excerpt: blogs.excerpt,
  coverImagePath: blogs.coverImagePath,
  status: blogs.status,
  publishedAt: blogs.publishedAt,
  seoTitle: blogs.seoTitle,
  seoDescription: blogs.seoDescription,
  ogImagePath: blogs.ogImagePath,
  tags: blogs.tags,
  readingTimeMinutes: blogs.readingTimeMinutes,
  createdAt: blogs.createdAt,
  updatedAt: blogs.updatedAt,
}

type ProjectCardRow = {
  [K in keyof typeof projectCardColumns]: (typeof projects.$inferSelect)[K]
}

type BlogCardRow = {
  [K in keyof typeof blogCardColumns]: (typeof blogs.$inferSelect)[K]
}

function serializeProjectCard(row: ProjectCardRow) {
  return {
    ...row,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

function serializeBlogCard(row: BlogCardRow) {
  return {
    ...row,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

function serializeProject(row: typeof projects.$inferSelect) {
  return {
    ...row,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

function serializeBlog(row: typeof blogs.$inferSelect) {
  return {
    ...row,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

function isPublicContentBootstrapError(error: unknown) {
  const cause = error instanceof Error && 'cause' in error ? (error as { cause?: { code?: string } }).cause : null

  return (
    (cause && typeof cause === 'object' && 'code' in cause && cause.code === '42P01') ||
    (error instanceof Error &&
      /relation .* does not exist|connect ECONNREFUSED|database/i.test(error.message))
  )
}

const PUBLIC_CACHE_FRESH_MS = 30_000
const PUBLIC_CACHE_STALE_MS = 300_000

type CacheEntry<T> = {
  expiresAt: number
  staleUntil: number
  value: T
}

const publicContentCache = new Map<string, CacheEntry<unknown>>()
const inflightPublicQueries = new Map<string, Promise<unknown>>()

export function invalidatePublicContentCache() {
  publicContentCache.clear()
}

async function cachedPublicQuery<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const now = Date.now()
  const hit = publicContentCache.get(key) as CacheEntry<T> | undefined

  if (hit && now < hit.expiresAt) {
    return hit.value
  }

  const refresh = () => {
    const existing = inflightPublicQueries.get(key) as Promise<T> | undefined
    if (existing) {
      return existing
    }

    const pending = fetcher()
      .then((value) => {
        const settledAt = Date.now()
        publicContentCache.set(key, {
          value,
          expiresAt: settledAt + PUBLIC_CACHE_FRESH_MS,
          staleUntil: settledAt + PUBLIC_CACHE_STALE_MS,
        })
        return value
      })
      .finally(() => {
        inflightPublicQueries.delete(key)
      })

    inflightPublicQueries.set(key, pending)
    return pending
  }

  if (hit && now < hit.staleUntil) {
    void refresh().catch(() => {})
    return hit.value
  }

  return refresh()
}

function warnPublicQueryFallback(scope: string, error: unknown) {
  console.warn(`[content] ${scope} fell back to empty content during build/runtime bootstrap.`, error)
}

export async function getHomeContent() {
  return cachedPublicQuery('home', async () => {
    try {
      const [publishedProjects, publishedBlogs] = await Promise.all([
        db
          .select(projectCardColumns)
          .from(projects)
          .where(eq(projects.status, 'published'))
          .orderBy(desc(projects.featured), desc(projects.publishedAt), desc(projects.updatedAt))
          .limit(6),
        db
          .select(blogCardColumns)
          .from(blogs)
          .where(eq(blogs.status, 'published'))
          .orderBy(desc(blogs.publishedAt), desc(blogs.updatedAt))
          .limit(3),
      ])

      return {
        projects: publishedProjects.map(serializeProjectCard),
        blogs: publishedBlogs.map(serializeBlogCard),
      }
    } catch (error) {
      if (!isPublicContentBootstrapError(error)) {
        throw error
      }

      warnPublicQueryFallback('getHomeContent', error)
      return {
        projects: [],
        blogs: [],
      }
    }
  })
}

export async function listPublishedProjects() {
  return cachedPublicQuery('projects:list', async () => {
    try {
      const rows = await db
        .select(projectCardColumns)
        .from(projects)
        .where(eq(projects.status, 'published'))
        .orderBy(desc(projects.featured), desc(projects.publishedAt), desc(projects.updatedAt))

      return rows.map(serializeProjectCard)
    } catch (error) {
      if (!isPublicContentBootstrapError(error)) {
        throw error
      }

      warnPublicQueryFallback('listPublishedProjects', error)
      return []
    }
  })
}

export async function listPublishedBlogs() {
  return cachedPublicQuery('blogs:list', async () => {
    try {
      const rows = await db
        .select(blogCardColumns)
        .from(blogs)
        .where(eq(blogs.status, 'published'))
        .orderBy(desc(blogs.publishedAt), desc(blogs.updatedAt))

      return rows.map(serializeBlogCard)
    } catch (error) {
      if (!isPublicContentBootstrapError(error)) {
        throw error
      }

      warnPublicQueryFallback('listPublishedBlogs', error)
      return []
    }
  })
}

export async function getPublishedProjectBySlug(slug: string) {
  return cachedPublicQuery(`projects:slug:${slug}`, async () => {
    try {
      const [row] = await db
        .select()
        .from(projects)
        .where(and(eq(projects.slug, slug), eq(projects.status, 'published')))
        .limit(1)

      return row ? serializeProject(row) : null
    } catch (error) {
      if (!isPublicContentBootstrapError(error)) {
        throw error
      }

      warnPublicQueryFallback('getPublishedProjectBySlug', error)
      return null
    }
  })
}

export async function getPublishedBlogBySlug(slug: string) {
  return cachedPublicQuery(`blogs:slug:${slug}`, async () => {
    try {
      const [row] = await db
        .select()
        .from(blogs)
        .where(and(eq(blogs.slug, slug), eq(blogs.status, 'published')))
        .limit(1)

      return row ? serializeBlog(row) : null
    } catch (error) {
      if (!isPublicContentBootstrapError(error)) {
        throw error
      }

      warnPublicQueryFallback('getPublishedBlogBySlug', error)
      return null
    }
  })
}

export async function listAdminProjects() {
  const rows = await db.select().from(projects).orderBy(desc(projects.updatedAt))
  return rows.map(serializeProject)
}

export async function listAdminBlogs() {
  const rows = await db.select().from(blogs).orderBy(desc(blogs.updatedAt))
  return rows.map(serializeBlog)
}

export async function getAdminProjectById(id: string) {
  const [row] = await db.select().from(projects).where(eq(projects.id, id)).limit(1)
  return row ? serializeProject(row) : null
}

export async function getAdminBlogById(id: string) {
  const [row] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1)
  return row ? serializeBlog(row) : null
}

export async function createProject(input: ProjectInput) {
  const values = buildProjectValues(input)
  await ensureUniqueProjectSlug(values.slug)

  const [row] = await db.insert(projects).values(values).returning()
  invalidatePublicContentCache()
  return serializeProject(row)
}

export async function updateProject(id: string, input: ProjectInput) {
  const [existing] = await db.select().from(projects).where(eq(projects.id, id)).limit(1)

  if (!existing) {
    return null
  }

  const values = buildProjectValues(input)
  await ensureUniqueProjectSlug(values.slug, id)
  const previousFileKeys = collectUploadThingFileKeys(existing)
  const nextFileKeys = collectUploadThingFileKeys(values)

  const [row] = await db
    .update(projects)
    .set({
      ...values,
      updatedAt: sql`now()`,
    })
    .where(eq(projects.id, id))
    .returning()

  if (!row) {
    return null
  }

  await cleanupRemovedUploadThingFiles(previousFileKeys, nextFileKeys)
  invalidatePublicContentCache()

  return serializeProject(row)
}

export async function deleteProject(id: string) {
  const [existing] = await db.select().from(projects).where(eq(projects.id, id)).limit(1)

  if (!existing) {
    return
  }

  await db.delete(projects).where(eq(projects.id, id))
  await cleanupUnreferencedUploadThingFiles(collectUploadThingFileKeys(existing))
  invalidatePublicContentCache()
}

export async function createBlog(input: BlogInput) {
  const values = buildBlogValues(input)
  await ensureUniqueBlogSlug(values.slug)

  const [row] = await db.insert(blogs).values(values).returning()
  invalidatePublicContentCache()
  return serializeBlog(row)
}

export async function updateBlog(id: string, input: BlogInput) {
  const [existing] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1)

  if (!existing) {
    return null
  }

  const values = buildBlogValues(input)
  await ensureUniqueBlogSlug(values.slug, id)
  const previousFileKeys = collectUploadThingFileKeys(existing)
  const nextFileKeys = collectUploadThingFileKeys(values)

  const [row] = await db
    .update(blogs)
    .set({
      ...values,
      updatedAt: sql`now()`,
    })
    .where(eq(blogs.id, id))
    .returning()

  if (!row) {
    return null
  }

  await cleanupRemovedUploadThingFiles(previousFileKeys, nextFileKeys)
  invalidatePublicContentCache()

  return serializeBlog(row)
}

export async function deleteBlog(id: string) {
  const [existing] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1)

  if (!existing) {
    return
  }

  await db.delete(blogs).where(eq(blogs.id, id))
  await cleanupUnreferencedUploadThingFiles(collectUploadThingFileKeys(existing))
  invalidatePublicContentCache()
}

export async function getPublishedSlugs() {
  return cachedPublicQuery('slugs:published', async () => {
    try {
      const [projectRows, blogRows] = await Promise.all([
        db.select({ slug: projects.slug }).from(projects).where(eq(projects.status, 'published')),
        db.select({ slug: blogs.slug }).from(blogs).where(eq(blogs.status, 'published')),
      ])

      return {
        projects: projectRows.map((row) => row.slug),
        blogs: blogRows.map((row) => row.slug),
      }
    } catch (error) {
      if (!isPublicContentBootstrapError(error)) {
        throw error
      }

      warnPublicQueryFallback('getPublishedSlugs', error)
      return {
        projects: [],
        blogs: [],
      }
    }
  })
}
