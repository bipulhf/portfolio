import { Link } from '@tanstack/react-router'
import { CONTACT_LINKS } from '~/components/portfolio/lib/content'
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
  const charcoalStrong = 'text-[#3a342e]'
  const charcoalSoft = 'text-[#3a342e]/72'
  const charcoalFaint = 'text-[#3a342e]/58'

  return (
    <main className={`theme-only-minimal py-4 space-y-6 ${charcoalStrong}`}>
      <section className={pageContainerClass} id="about">
        <div className="coding-border p-4 rounded-lg">
          <div className="mb-4 flex items-center justify-between border-b border-[#3a342e]/10 pb-2">
            <span className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${charcoalFaint}`}>
              About
            </span>
          </div>
          <div className="grid lg:grid-cols-[1fr_250px] gap-8">
            <div className="space-y-4">
              <h2 className={`text-lg font-bold ${charcoalStrong}`}>Fullstack engineer</h2>
              <p className={`max-w-md text-[11px] font-normal leading-relaxed ${charcoalSoft}`}>
                I build web products with strong frontend craft and dependable backend logic.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['6+', 'Wins'],
                ['Web', 'Products'],
                ['UI', 'Craft'],
                ['Safe', 'Systems'],
              ].map(([v, l]) => (
                <div className="coding-border rounded bg-white/5 p-2 text-center" key={l}>
                  <div className={`text-lg font-bold ${charcoalStrong}`}>{v}</div>
                  <div className={`text-[9px] font-normal uppercase tracking-tighter ${charcoalFaint}`}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={pageContainerClass} id="projects">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="coding-border p-4 rounded-lg">
            <span className={`mb-4 block text-[10px] font-semibold uppercase tracking-[0.14em] ${charcoalFaint}`}>
              Toolkit
            </span>
            <div className="flex flex-wrap gap-2">
              {['React', 'Next.js', 'Typescript', 'Node.js', 'PostgreSQL', 'Tailwind'].map(skill => (
                <span
                  className={`rounded border border-[#3a342e]/10 bg-white/5 px-2 py-0.5 text-[9px] font-medium ${charcoalStrong}`}
                  key={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="coding-border p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${charcoalFaint}`}>
                Selected work
              </span>
              <Link className={`text-[9px] font-medium no-underline ${charcoalFaint}`} to="/projects">All projects</Link>
            </div>
            <div className="space-y-3">
              {featuredProjects.length ? featuredProjects.map((p) => (
                <Link 
                  className="flex items-center gap-4 no-underline group"
                  key={p.id}
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                >
                  <div className="size-10 rounded overflow-hidden flex-shrink-0 bg-white/5">
                    {p.coverImagePath ? (
                      <img alt={p.title} className="h-full w-full object-cover grayscale opacity-55 group-hover:opacity-100" src={p.coverImagePath} />
                    ) : (
                      <div className={`flex h-full w-full items-center justify-center text-[10px] font-bold ${charcoalStrong}`}>
                        {p.title.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className={`text-[11px] font-bold ${charcoalStrong}`}>{p.title}</h3>
                    <p className={`w-32 truncate text-[9px] font-normal md:w-48 ${charcoalFaint}`}>{p.summary}</p>
                  </div>
                  <span className={`ml-auto text-[10px] font-semibold opacity-0 transition-all group-hover:opacity-100 ${charcoalSoft}`}>→</span>
                </Link>
              )) : (
                <p className={`text-[11px] font-normal ${charcoalSoft}`}>Projects will appear here.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={pageContainerClass} id="contact">
        <div className="coding-border rounded-lg border-[#3a342e]/12 bg-white/5 p-6 text-center">
          <h2 className={`mb-2 text-sm font-bold ${charcoalStrong}`}>Contact</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {CONTACT_LINKS.map(link => (
              <a
                className={`text-[9px] font-semibold uppercase tracking-widest no-underline hover:underline ${charcoalSoft}`}
                href={link.href}
                key={link.label}
                target="_blank"
                rel="noreferrer"
              >
                {link.label.replace(/^✉\s*/, '')}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
