import type { BlogFormState, ProjectFormState } from '~/lib/api/types'
import type { SerializedBlog, SerializedProject } from '~/lib/content/types'

export const emptyProjectFormState: ProjectFormState = {
  title: '',
  slug: '',
  summary: '',
  excerpt: '',
  coverImagePath: '',
  seoTitle: '',
  seoDescription: '',
  ogImagePath: '',
  bodyJson: null,
  bodyHtml: '',
  status: 'draft',
  publishedAt: '',
  techStack: [],
  liveUrl: '',
  repoUrl: '',
  featured: false,
}

export const emptyBlogFormState: BlogFormState = {
  title: '',
  slug: '',
  excerpt: '',
  coverImagePath: '',
  seoTitle: '',
  seoDescription: '',
  ogImagePath: '',
  bodyJson: null,
  bodyHtml: '',
  status: 'draft',
  publishedAt: '',
  tags: [],
  readingTimeMinutes: 4,
}

export function projectToFormState(project: SerializedProject): ProjectFormState {
  return {
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    excerpt: project.excerpt,
    coverImagePath: project.coverImagePath ?? '',
    seoTitle: project.seoTitle ?? '',
    seoDescription: project.seoDescription ?? '',
    ogImagePath: project.ogImagePath ?? '',
    bodyJson: project.bodyJson,
    bodyHtml: project.bodyHtml,
    status: project.status,
    publishedAt: project.publishedAt ?? '',
    techStack: project.techStack,
    liveUrl: project.liveUrl ?? '',
    repoUrl: project.repoUrl ?? '',
    featured: project.featured,
  }
}

export function blogToFormState(blog: SerializedBlog): BlogFormState {
  return {
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    coverImagePath: blog.coverImagePath ?? '',
    seoTitle: blog.seoTitle ?? '',
    seoDescription: blog.seoDescription ?? '',
    ogImagePath: blog.ogImagePath ?? '',
    bodyJson: blog.bodyJson,
    bodyHtml: blog.bodyHtml,
    status: blog.status,
    publishedAt: blog.publishedAt ?? '',
    tags: blog.tags,
    readingTimeMinutes: blog.readingTimeMinutes,
  }
}

export function stringToList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function listToString(value: string[]) {
  return value.join(', ')
}
