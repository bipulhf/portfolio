import sanitizeHtml from 'sanitize-html'
import { and, desc, eq, ne, sql } from 'drizzle-orm'
import { db } from '~/lib/db'
import { blogs, projects } from '~/lib/db/schema'
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

function warnPublicQueryFallback(scope: string, error: unknown) {
  console.warn(`[content] ${scope} fell back to empty content during build/runtime bootstrap.`, error)
}

export async function getHomeContent() {
  try {
    const [publishedProjects, publishedBlogs] = await Promise.all([
      db
        .select()
        .from(projects)
        .where(eq(projects.status, 'published'))
        .orderBy(desc(projects.featured), desc(projects.publishedAt), desc(projects.updatedAt))
        .limit(6),
      db
        .select()
        .from(blogs)
        .where(eq(blogs.status, 'published'))
        .orderBy(desc(blogs.publishedAt), desc(blogs.updatedAt))
        .limit(3),
    ])

    return {
      projects: publishedProjects.map(serializeProject),
      blogs: publishedBlogs.map(serializeBlog),
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
}

export async function listPublishedProjects() {
  try {
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.status, 'published'))
      .orderBy(desc(projects.featured), desc(projects.publishedAt), desc(projects.updatedAt))

    return rows.map(serializeProject)
  } catch (error) {
    if (!isPublicContentBootstrapError(error)) {
      throw error
    }

    warnPublicQueryFallback('listPublishedProjects', error)
    return []
  }
}

export async function listPublishedBlogs() {
  try {
    const rows = await db
      .select()
      .from(blogs)
      .where(eq(blogs.status, 'published'))
      .orderBy(desc(blogs.publishedAt), desc(blogs.updatedAt))

    return rows.map(serializeBlog)
  } catch (error) {
    if (!isPublicContentBootstrapError(error)) {
      throw error
    }

    warnPublicQueryFallback('listPublishedBlogs', error)
    return []
  }
}

export async function getPublishedProjectBySlug(slug: string) {
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
}

export async function getPublishedBlogBySlug(slug: string) {
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
  return serializeProject(row)
}

export async function updateProject(id: string, input: ProjectInput) {
  const values = buildProjectValues(input)
  await ensureUniqueProjectSlug(values.slug, id)

  const [row] = await db
    .update(projects)
    .set({
      ...values,
      updatedAt: sql`now()`,
    })
    .where(eq(projects.id, id))
    .returning()

  return row ? serializeProject(row) : null
}

export async function deleteProject(id: string) {
  await db.delete(projects).where(eq(projects.id, id))
}

export async function createBlog(input: BlogInput) {
  const values = buildBlogValues(input)
  await ensureUniqueBlogSlug(values.slug)

  const [row] = await db.insert(blogs).values(values).returning()
  return serializeBlog(row)
}

export async function updateBlog(id: string, input: BlogInput) {
  const values = buildBlogValues(input)
  await ensureUniqueBlogSlug(values.slug, id)

  const [row] = await db
    .update(blogs)
    .set({
      ...values,
      updatedAt: sql`now()`,
    })
    .where(eq(blogs.id, id))
    .returning()

  return row ? serializeBlog(row) : null
}

export async function deleteBlog(id: string) {
  await db.delete(blogs).where(eq(blogs.id, id))
}

export async function getPublishedSlugs() {
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
}
