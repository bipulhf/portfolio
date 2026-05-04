# Shahiduzzaman Bipul Portfolio

A brand-first portfolio and CMS built with TanStack Start. The public site presents projects, writing, experience, and contact details in two switchable public themes, while the admin workspace lets a single owner manage blog posts and project case studies.

## Theme Preview

<p align="center">
  <img src="./public/home-crayon.png" alt="Crayon theme homepage preview" width="48%" />
  <img src="./public/home-minimal.png" alt="Minimal theme homepage preview" width="48%" />
</p>

## Overview

This project includes:

- a public portfolio homepage
- public `/projects` and `/blog` listing pages
- public project and blog detail pages
- a protected admin CMS at `/admin`
- local media uploads served from `/media/*`
- SEO-friendly SSR with prerendering for stable public routes

The original handoff/prototype is kept in [`my-portfolio/`](./my-portfolio) for reference. The working TanStack Start app lives in [`src/`](./src).

## Stack

- TanStack Start
- TanStack Router
- React 19
- Tailwind CSS v4
- Drizzle ORM
- PostgreSQL
- React Query
- `ky`
- Lexical
- Nitro

## Features

- Two public presentation modes: crayon and minimal
- Distinctive portfolio landing page with modular section components
- Admin dashboard for managing projects and blog posts
- Rich text editing with Lexical for long-form project and blog content
- Draft and published content states
- Local image upload workflow
- Dynamic SEO metadata, JSON-LD, `robots.txt`, and `sitemap.xml`
- Responsive public site and admin workspace

## Project Structure

```text
src/
  components/
    admin/         Admin shell, forms, and CMS UI
    app/           Shared app providers
    editor/        Lexical editor and editor nodes
    loaders/       Themed loading states
    portfolio/     Landing page sections and brand UI
    public/        Public detail/listing page UI
  lib/
    api/           Client API setup with ky
    auth/          Session helpers and auth utilities
    content/       Content queries and serializers
    db/            Drizzle schema and DB setup
    media/         Local media storage helpers
    seo/           Metadata and structured data helpers
    validation/    Shared Zod schemas
  routes/
    admin*         Protected CMS routes
    api/           JSON endpoints for admin/auth flows
    blog*          Public blog routes
    projects*      Public project routes
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

Copy `.env.example` to `.env` and adjust values as needed.

Required environment variables:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/portfolio
SESSION_SECRET=replace-with-a-long-random-secret
MEDIA_ROOT=./storage/uploads
PUBLIC_MEDIA_BASE_URL=/media
SITE_URL=http://localhost:3000
```

### 3. Push the database schema

```bash
npm run db:push
```

### 4. Bootstrap the admin account

```bash
npm run admin:bootstrap -- --email you@example.com --password your-password
```

### 5. Start the app

```bash
npm run dev
```

The public site will be available at `http://localhost:3000` and the CMS login at `http://localhost:3000/admin/login`.

## Scripts

```bash
npm run dev              # Start the local dev server
npm run build            # Production build + typecheck
npm run preview          # Preview the built app
npm run start            # Run the built server
npm run db:push          # Push Drizzle schema to the database
npm run db:studio        # Open Drizzle Studio
npm run admin:bootstrap  # Create the first admin account
```

## Content Workflow

1. Sign in at `/admin/login`
2. Create or edit a project or blog post
3. Save as draft while writing
4. Upload cover or social images when needed
5. Publish when the page is ready

Published entries appear on the public portfolio automatically.

## Media Storage

Uploaded files are stored locally on disk using `MEDIA_ROOT`. Public URLs are served through the configured `PUBLIC_MEDIA_BASE_URL`, which defaults to `/media`.

This setup is intended for a persistent Node/VPS deployment rather than ephemeral serverless storage.

## Build Notes

- Stable public routes are prerendered:
  - `/`
  - `/projects`
  - `/blog`
  - `/robots.txt`
  - `/sitemap.xml`
- Project and blog detail pages remain server-rendered so CMS content can change without a rebuild.
- Admin routes and admin APIs are configured for `no-store` caching behavior.

## Design Context

This repo also includes:

- [`PRODUCT.md`](./PRODUCT.md): brand, audience, and strategic direction
- [`DESIGN.md`](./DESIGN.md): visual system and implementation guidance
- [`DESIGN.json`](./DESIGN.json): structured design-system export

## License

This repository is private and intended for personal portfolio use.
