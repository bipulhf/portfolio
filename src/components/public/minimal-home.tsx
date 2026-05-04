import { Link } from '@tanstack/react-router'
import { CONTACT_LINKS } from '~/components/portfolio/lib/content'
import { MinimalWindowControls } from '~/components/public/minimal-window-controls'
import { pageContainerClass } from '~/components/portfolio/lib/styles'
import type { SerializedBlog, SerializedProject } from '~/lib/content/types'

export function MinimalHome({
  blogs,
  projects,
}: Readonly<{
  blogs: SerializedBlog[]
  projects: SerializedProject[]
}>) {
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 3)
  const recentBlogs = blogs.slice(0, 3)
  const stack = ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind', 'Prisma']
  const profileRows = [
    ['Focus', 'Frontend, product, systems'],
    ['Base', 'Dhaka, Bangladesh'],
    ['Style', 'Clear logic, calm UI'],
  ] as const
  const charcoalStrong = 'text-[#3a342e]'
  const charcoalSoft = 'text-[#3a342e]/72'
  const charcoalFaint = 'text-[#3a342e]/46'

  return (
    <main className="theme-only-minimal minimal-stack-sections pb-10 pt-0 md:pb-12" data-reveal-sequence>
      <section className={`${pageContainerClass} minimal-stack-item`} data-reveal-item id="about">
        <div className="coding-border minimal-stack-shell overflow-hidden rounded-xl">
          <div className={`flex items-center justify-between border-b border-[#3a342e]/8 px-6 py-4 text-[11px] [font-family:var(--minimal-mono)] ${charcoalFaint}`}>
            <div className="flex items-center gap-3">
              <MinimalWindowControls />
              <span>/src/profile.ts</span>
            </div>
            <span>profile</span>
          </div>
          <div className="grid gap-7 px-5 py-6 md:px-6 md:py-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(15rem,0.8fr)]">
            <div className="space-y-5">
              <div className={`space-y-1 text-[0.98rem] leading-7 [font-family:var(--minimal-mono)] ${charcoalSoft}`}>
                <div className={charcoalStrong}>export const profile = {'{'}</div>
                <div className="pl-4">
                  <span className={charcoalFaint}>role:</span>{' '}
                  <span className={`font-semibold ${charcoalStrong}`}>"fullstack engineer"</span>,
                </div>
                <div className="pl-4">
                  <span className={charcoalFaint}>focus:</span>{' '}
                  <span>["frontend", "product", "systems"]</span>,
                </div>
                <div className="pl-4">
                  <span className={charcoalFaint}>style:</span>{' '}
                  <span>"clear, dependable"</span>
                </div>
                <div className={charcoalStrong}>{'}'}</div>
              </div>

              <p className={`max-w-2xl text-sm leading-relaxed md:text-[0.95rem] ${charcoalSoft}`}>
                I ship web products with strong frontend craft, maintainable backend logic, and product decisions that stay clear under pressure.
              </p>

              <div className="flex flex-wrap gap-2">
                {stack.map((skill) => (
                  <span
                    className={`rounded-[0.7rem] border border-[#3a342e]/10 bg-white/36 px-3 py-1.5 text-[11px] font-medium [font-family:var(--minimal-mono)] ${charcoalStrong}`}
                    key={skill}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <dl className="grid gap-3 self-start">
              {profileRows.map(([label, value]) => (
                <div className="rounded-[0.9rem] border border-[#3a342e]/10 bg-white/34 px-4 py-3" key={label}>
                  <dt className={`text-[10px] uppercase tracking-[0.18em] [font-family:var(--minimal-mono)] ${charcoalFaint}`}>
                    {label}
                  </dt>
                  <dd className={`mt-2 text-sm [font-family:var(--minimal-mono)] ${charcoalStrong}`}>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className={`${pageContainerClass} minimal-stack-item`} data-reveal-item id="projects">
        <div className="coding-border minimal-stack-shell overflow-hidden rounded-xl">
          <div className={`flex items-center justify-between border-b border-[#3a342e]/8 px-6 py-4 text-[11px] [font-family:var(--minimal-mono)] ${charcoalFaint}`}>
            <div className="flex items-center gap-3">
              <MinimalWindowControls />
              <span>/src/projects.ts</span>
            </div>
            <Link className={`no-underline transition-colors hover:text-[#3a342e] ${charcoalFaint}`} to="/projects">
              open archive
            </Link>
          </div>
          <div className="px-5 py-4 md:px-6 md:py-5">
            {featuredProjects.length ? (
              featuredProjects.map((project, index) => (
                <Link
                  className="group grid gap-3 border-b border-[#3a342e]/8 py-4 no-underline last:border-b-0 md:grid-cols-[7.5rem_minmax(0,1fr)_auto] md:items-start"
                  key={project.id}
                  params={{ slug: project.slug }}
                  to="/projects/$slug"
                >
                  <div className={`text-[11px] [font-family:var(--minimal-mono)] ${charcoalFaint}`}>
                    <div>{String(index + 1).padStart(2, '0')}</div>
                    <div className="mt-1">{project.slug}.tsx</div>
                  </div>

                  <div className="space-y-2">
                    <h2 className={`text-base font-semibold [font-family:var(--minimal-mono)] ${charcoalStrong}`}>
                      {project.title}
                    </h2>
                    <p className={`max-w-2xl text-sm leading-relaxed ${charcoalSoft}`}>
                      {project.summary}
                    </p>
                    {project.techStack.length ? (
                      <div className={`text-[11px] [font-family:var(--minimal-mono)] ${charcoalFaint}`}>
                        {project.techStack.slice(0, 4).join(' · ')}
                      </div>
                    ) : null}
                  </div>

                  <div className={`text-[11px] font-medium [font-family:var(--minimal-mono)] transition-transform group-hover:translate-x-1 ${charcoalStrong}`}>
                    open
                  </div>
                </Link>
              ))
            ) : (
              <p className={`py-3 text-sm ${charcoalSoft}`}>Projects will appear here.</p>
            )}
          </div>
        </div>
      </section>

      <section className={`${pageContainerClass} minimal-stack-item`} data-reveal-item id="blog">
        <div className="coding-border minimal-stack-shell overflow-hidden rounded-xl">
          <div className={`flex items-center justify-between border-b border-[#3a342e]/8 px-6 py-4 text-[11px] [font-family:var(--minimal-mono)] ${charcoalFaint}`}>
            <div className="flex items-center gap-3">
              <MinimalWindowControls />
              <span>/notes/index.md</span>
            </div>
            <Link className={`no-underline transition-colors hover:text-[#3a342e] ${charcoalFaint}`} to="/blog">
              all notes
            </Link>
          </div>
          <div className="px-5 py-4 md:px-6 md:py-5">
            {recentBlogs.length ? (
              recentBlogs.map((blog) => (
                <Link
                  className="group grid gap-3 border-b border-[#3a342e]/8 py-4 no-underline last:border-b-0 md:grid-cols-[8rem_minmax(0,1fr)_auto] md:items-start"
                  key={blog.id}
                  params={{ slug: blog.slug }}
                  to="/blog/$slug"
                >
                  <div className={`text-[11px] [font-family:var(--minimal-mono)] ${charcoalFaint}`}>
                    {new Date(blog.publishedAt || '').toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                    })}
                  </div>

                  <div className="space-y-2">
                    <h2 className={`text-base font-semibold [font-family:var(--minimal-mono)] ${charcoalStrong}`}>
                      {blog.title}
                    </h2>
                    <p className={`max-w-2xl text-sm leading-relaxed ${charcoalSoft}`}>
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className={`text-[11px] font-medium [font-family:var(--minimal-mono)] transition-transform group-hover:translate-x-1 ${charcoalStrong}`}>
                    read
                  </div>
                </Link>
              ))
            ) : (
              <p className={`py-3 text-sm ${charcoalSoft}`}>Notes will appear here.</p>
            )}
          </div>
        </div>
      </section>

      <section className={`${pageContainerClass} minimal-stack-item`} data-reveal-item id="contact">
        <div className="coding-border minimal-stack-shell overflow-hidden rounded-xl">
          <div className={`flex items-center gap-3 border-b border-[#3a342e]/8 px-6 py-4 text-[11px] [font-family:var(--minimal-mono)] ${charcoalFaint}`}>
            <MinimalWindowControls />
            <span>/src/contact.ts</span>
          </div>
          <div className="px-5 py-6 md:px-6 md:py-7">
            <p className={`text-sm leading-relaxed md:text-[0.95rem] ${charcoalSoft}`}>
              If the work feels aligned, email is the fastest path.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {CONTACT_LINKS.map((link) => (
                <a
                  className={`rounded-[0.8rem] border border-[#3a342e]/12 bg-white/40 px-4 py-2 text-[11px] font-medium no-underline transition-colors hover:bg-white/70 [font-family:var(--minimal-mono)] ${charcoalStrong}`}
                  href={link.href}
                  key={link.label}
                  rel="noreferrer"
                  target="_blank"
                >
                  {link.label.replace(/^✉\s*/, '')}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
