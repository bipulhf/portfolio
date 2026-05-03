import { notFound } from '@tanstack/react-router'
import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import type { SerializedBlog, SerializedProject } from '~/lib/content/types'
import {
  getHomeContent,
  getPublishedBlogBySlug,
  getPublishedProjectBySlug,
  listPublishedBlogs,
  listPublishedProjects,
} from '~/lib/content/queries'

export const getHomeContentFn = createServerFn({
  method: 'GET',
  strict: { output: false },
}).handler(async (): Promise<{ blogs: SerializedBlog[]; projects: SerializedProject[] }> => {
  return getHomeContent()
})

export const listPublishedProjectsFn = createServerFn({
  method: 'GET',
  strict: { output: false },
}).handler(
  async (): Promise<SerializedProject[]> => listPublishedProjects(),
)

export const listPublishedBlogsFn = createServerFn({
  method: 'GET',
  strict: { output: false },
}).handler(
  async (): Promise<SerializedBlog[]> => listPublishedBlogs(),
)

export const getPublishedProjectBySlugFn = createServerFn({
  method: 'GET',
  strict: { output: false },
})
  .inputValidator((data: { slug: string }) => z.object({ slug: z.string().min(1) }).parse(data))
  .handler(async ({ data }): Promise<SerializedProject> => {
    const project = await getPublishedProjectBySlug(data.slug)

    if (!project) {
      throw notFound()
    }

    return project
  })

export const getPublishedBlogBySlugFn = createServerFn({
  method: 'GET',
  strict: { output: false },
})
  .inputValidator((data: { slug: string }) => z.object({ slug: z.string().min(1) }).parse(data))
  .handler(async ({ data }): Promise<SerializedBlog> => {
    const blog = await getPublishedBlogBySlug(data.slug)

    if (!blog) {
      throw notFound()
    }

    return blog
  })
