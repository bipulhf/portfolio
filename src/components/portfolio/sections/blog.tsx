import { Cloud, Flower, Sun } from '../doodles'
import { SectionHeader } from '../section-header'
import { SectionShell } from '../section-shell'
import { BLOG_ITEMS } from '../lib/content'
import { surfaceCardClass } from '../lib/styles'

const coverTones = ['bg-peach', 'bg-mint', 'bg-sky'] as const

function BlogCover({ index }: Readonly<{ index: number }>) {
  const covers = [
    <Sun key="sun" size={70} />,
    <Flower key="flower" size={70} />,
    <Cloud key="cloud" size={90} />,
  ]

  return <div className="absolute inset-0 flex items-center justify-center">{covers[index % covers.length]}</div>
}

export function Blog() {
  return (
    <SectionShell accent="blog" id="blog">
      <SectionHeader
        kicker="07 - words"
        title="From the blog"
        underlineColor="var(--color-sky)"
      />
      <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3" data-reveal-sequence>
        {BLOG_ITEMS.map((post, index) => (
          <a
            className={`${surfaceCardClass} overflow-hidden rounded-[1.375rem] border-[2.5px] border-ink text-ink no-underline shadow-crayon-md transition-[transform,box-shadow] duration-200 ease-out-soft hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_var(--color-ink)]`}
            data-reveal-item
            href="#"
            key={post.title}
          >
            <div className={`${coverTones[index % coverTones.length]} relative flex min-h-[8.125rem] items-center justify-center border-b-2 border-ink`}>
              <BlogCover index={index} />
            </div>
            <div className="flex h-full flex-col px-[1.375rem] pb-[1.375rem] pt-[1.125rem]">
              <div className="mb-1.5 font-hand text-sm text-ink-soft">{post.date}</div>
              <h3 className="mb-2 font-display text-[1.75rem] font-bold leading-[1.05] text-ink">
                {post.title}
              </h3>
              <p className="flex-1 text-[0.9375rem] text-ink-soft">{post.excerpt}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 font-hand text-base text-ink">
                Read on →
              </span>
            </div>
          </a>
        ))}
      </div>
    </SectionShell>
  )
}
