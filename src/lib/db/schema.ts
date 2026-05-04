import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const contentStatusEnum = pgEnum('content_status', ['draft', 'published'])

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}

export const admins = pgTable('admins', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  ...timestamps,
})

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  adminId: uuid('admin_id')
    .notNull()
    .references(() => admins.id, { onDelete: 'cascade' }),
  tokenHash: varchar('token_hash', { length: 128 }).notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  ...timestamps,
})

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  summary: text('summary').notNull(),
  excerpt: text('excerpt').notNull(),
  coverImagePath: text('cover_image_path'),
  status: contentStatusEnum('status').default('draft').notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  ogImagePath: text('og_image_path'),
  bodyJson: jsonb('body_json').$type<Record<string, unknown> | null>(),
  bodyHtml: text('body_html').notNull().default(''),
  techStack: text('tech_stack').array().notNull().default([]),
  liveUrl: text('live_url'),
  repoUrl: text('repo_url'),
  featured: boolean('featured').notNull().default(false),
  ...timestamps,
})

export const blogs = pgTable('blogs', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  excerpt: text('excerpt').notNull(),
  coverImagePath: text('cover_image_path'),
  status: contentStatusEnum('status').default('draft').notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  ogImagePath: text('og_image_path'),
  bodyJson: jsonb('body_json').$type<Record<string, unknown> | null>(),
  bodyHtml: text('body_html').notNull().default(''),
  tags: text('tags').array().notNull().default([]),
  readingTimeMinutes: integer('reading_time_minutes').notNull().default(1),
  ...timestamps,
})

export type AdminRow = typeof admins.$inferSelect
export type ProjectRow = typeof projects.$inferSelect
export type BlogRow = typeof blogs.$inferSelect
