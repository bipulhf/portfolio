import { z } from 'zod'

const imagePathSchema = z.string().trim().min(1).optional().or(z.literal(''))
const contentStatusSchema = z.enum(['draft', 'published'])

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

const baseContentSchema = z.object({
  title: z.string().trim().min(3).max(255),
  slug: z.string().trim().max(200).optional(),
  excerpt: z.string().trim().min(10).max(280).optional(),
  coverImagePath: imagePathSchema,
  seoTitle: z.string().trim().max(255).optional(),
  seoDescription: z.string().trim().max(280).optional(),
  ogImagePath: imagePathSchema,
  bodyJson: z.record(z.string(), z.unknown()).nullable().optional(),
  bodyHtml: z.string().trim().default(''),
  status: contentStatusSchema.default('draft'),
  publishedAt: z.string().datetime().optional().or(z.literal('')),
})

export const projectInputSchema = baseContentSchema.extend({
  summary: z.string().trim().min(10).max(400),
  techStack: z.array(z.string().trim().min(1)).default([]),
  liveUrl: z.url().optional().or(z.literal('')),
  repoUrl: z.url().optional().or(z.literal('')),
  featured: z.boolean().default(false),
})

export const blogInputSchema = baseContentSchema.extend({
  tags: z.array(z.string().trim().min(1)).default([]),
  readingTimeMinutes: z.number().int().min(1).max(120).optional(),
})

export type ProjectInput = z.infer<typeof projectInputSchema>
export type BlogInput = z.infer<typeof blogInputSchema>
