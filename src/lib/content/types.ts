export type SerializedProject = {
  id: string
  slug: string
  title: string
  summary: string
  excerpt: string
  coverImagePath: string | null
  status: 'draft' | 'published'
  publishedAt: string | null
  seoTitle: string | null
  seoDescription: string | null
  ogImagePath: string | null
  bodyJson: Record<string, unknown> | null
  bodyHtml: string
  techStack: string[]
  liveUrl: string | null
  repoUrl: string | null
  featured: boolean
  createdAt: string
  updatedAt: string
}

export type SerializedBlog = {
  id: string
  slug: string
  title: string
  excerpt: string
  coverImagePath: string | null
  status: 'draft' | 'published'
  publishedAt: string | null
  seoTitle: string | null
  seoDescription: string | null
  ogImagePath: string | null
  bodyJson: Record<string, unknown> | null
  bodyHtml: string
  tags: string[]
  readingTimeMinutes: number
  createdAt: string
  updatedAt: string
}
