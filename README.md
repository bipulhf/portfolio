# Bipul Portfolio

A brand-first portfolio and CMS built with TanStack Start. The public site presents projects, writing, experience, and contact details in three switchable public themes, while the admin workspace lets a single owner manage blog posts and project case studies.

## Theme Preview

<p align="center">
  <img src="./public/home-crayon.jpg" alt="Crayon theme homepage preview" width="48%" />
  <img src="./public/home-minimal.jpg" alt="Minimal theme homepage preview" width="48%" />
</p>

## Overview

This project includes:

- a public portfolio homepage
- public `/projects` and `/blog` listing pages
- public project and blog detail pages
- a protected admin CMS at `/admin`
- headless UploadThing-backed media uploads through the custom admin UI
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

- Three public presentation modes: Crayon, Minimal, and Studio 3D
- Distinctive portfolio landing page with modular section components
- Admin dashboard for managing projects and blog posts
- Rich text editing with Lexical for long-form project and blog content
- Draft and published content states
- Custom-themed image upload workflow backed by UploadThing Cloud
- Dynamic SEO metadata, JSON-LD, `robots.txt`, and `sitemap.xml`
- Responsive public site and admin workspace

## Studio 3D

Select **Studio 3D** in the floating theme switcher. The theme covers the homepage, project and blog archives, detail pages, and loading states. Your choice is saved in a cookie and local storage.

The homepage is a connected Three.js island with six permanent locations: the studio, project gallery, curiosity garden, courtyard, reading room, and post office. Stone paths connect the buildings. Timber trim, tiled roofs, framed glazing, solar panels, planted beds, a reflecting pool, and outdoor furniture give each stop a lived-in setting. Normal browser scrolling moves the camera between them, with a short caption anchored to each landmark and a masked heading entrance on arrival. The bio and achievement details open on request. Project displays open real case studies. Text and links remain accessible HTML.

Choose "Explore the island" to pause the story and visit buildings through the map or labels anchored to their 3D positions. Drag to rotate, use the zoom controls or mouse wheel to get closer, and return to the story at the same scroll position. Chapter links provide direct navigation. Touch scrolling stays available in story mode until "Rotate" is enabled.

Performance choices:

- Studio components and CSS load only when this theme is selected. Three.js is a separate dynamic import used by the homepage.
- Rendering runs on demand for scrolling, camera interaction, and resizing. A short, time-based interpolation settles scroll transitions, then the animation loop stops. Hidden tabs and offscreen scenes do not render.
- Pixel ratio is capped at 1.5 on desktop and 1 on touch devices. The world uses frustum culling, shared geometry/materials, and instanced trees, books, keyboard keys, and architectural details. Repeated decorations are batched by geometry and material. Four 256px surface maps are generated locally for wood, plaster, stone, and lawn. One cached 1024px shadow map updates when object poses change; a small 128px environment map is generated at startup.
- Geometry and screen/project textures are generated locally. There are no model downloads or postprocessing passes. Studio reuses Minimal's font families.
- Leaving the homepage disposes the renderer, geometry, materials, textures, shadows, observers, and input listeners. WebGL failure leaves the content and links usable.
- Reduced motion uses static chapter compositions, without camera travel, parallax, or object animation. Normal links still work.

The detail modules `island-architecture.ts`, `island-life.ts`, and `island-planting.ts` assemble static batches between browser yields. The renderer is in `src/components/public/studio/workspace-renderer.ts`, the landmarks in `scroll-world.ts`, the connected terrain and buildings in `island-environment.ts`, and the workstation geometry in `workspace-model.ts`. `world-locations.ts` defines the shared destinations. Theme styles live in `src/styles/studio.css`; the homepage uses `studio-cinematic.css` and `studio-world.css`.

Three.js adds a download and GPU work when Studio 3D is selected. Frame rate depends on the device; the original themes do not load the renderer.

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
    uploadthing/   UploadThing upload and cleanup helpers
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
UPLOADTHING_TOKEN=your-uploadthing-token
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
npm run media:audit:legacy # Find remaining legacy /media references
```

## Content Workflow

1. Sign in at `/admin/login`
2. Create or edit a project or blog post
3. Save as draft while writing
4. Upload cover or social images when needed
5. Publish when the page is ready

Published entries appear on the public portfolio automatically.

## Media Storage

Images are uploaded to UploadThing Cloud and stored as absolute CDN URLs in project/blog content. The admin UI remains fully custom-themed, so UploadThing handles storage and upload orchestration without replacing your design.

When a project or blog post replaces or removes an UploadThing-hosted image, the app deletes the old file only if no other content still references it. Legacy `/media/...` assets are not migrated automatically; run `npm run media:audit:legacy` before deploy to catch any remaining old references.

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
