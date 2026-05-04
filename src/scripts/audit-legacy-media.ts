import { db } from '~/lib/db'
import { blogs, projects } from '~/lib/db/schema'

const MEDIA_PATH_PATTERN = /\/media\/[^\s"'<>)]*/gu

function listMediaMatches(value?: string | null) {
  if (!value) {
    return []
  }

  return value.match(MEDIA_PATH_PATTERN) ?? []
}

async function main() {
  const [projectRows, blogRows] = await Promise.all([
    db
      .select({
        id: projects.id,
        slug: projects.slug,
        bodyHtml: projects.bodyHtml,
        coverImagePath: projects.coverImagePath,
        ogImagePath: projects.ogImagePath,
      })
      .from(projects),
    db
      .select({
        id: blogs.id,
        slug: blogs.slug,
        bodyHtml: blogs.bodyHtml,
        coverImagePath: blogs.coverImagePath,
        ogImagePath: blogs.ogImagePath,
      })
      .from(blogs),
  ])

  const findings: string[] = []

  for (const project of projectRows) {
    if (project.coverImagePath?.startsWith('/media/')) {
      findings.push(`project ${project.slug} (${project.id}) coverImagePath -> ${project.coverImagePath}`)
    }

    if (project.ogImagePath?.startsWith('/media/')) {
      findings.push(`project ${project.slug} (${project.id}) ogImagePath -> ${project.ogImagePath}`)
    }

    for (const match of listMediaMatches(project.bodyHtml)) {
      findings.push(`project ${project.slug} (${project.id}) bodyHtml -> ${match}`)
    }
  }

  for (const blog of blogRows) {
    if (blog.coverImagePath?.startsWith('/media/')) {
      findings.push(`blog ${blog.slug} (${blog.id}) coverImagePath -> ${blog.coverImagePath}`)
    }

    if (blog.ogImagePath?.startsWith('/media/')) {
      findings.push(`blog ${blog.slug} (${blog.id}) ogImagePath -> ${blog.ogImagePath}`)
    }

    for (const match of listMediaMatches(blog.bodyHtml)) {
      findings.push(`blog ${blog.slug} (${blog.id}) bodyHtml -> ${match}`)
    }
  }

  if (!findings.length) {
    console.log('No legacy /media/ references found.')
    return
  }

  console.error('Legacy /media/ references found:')

  for (const finding of findings) {
    console.error(`- ${finding}`)
  }

  process.exitCode = 1
}

await main()
