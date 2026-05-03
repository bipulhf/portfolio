import { Cloud, Flower, Sun } from '../doodles'
import { BLOG_ITEMS } from '../lib/content'
import { SectionAccent } from '../section-accent'
import { SectionHeader } from '../section-header'

function BlogCover({ index }: { index: number }) {
  const covers = [
    <Sun key="sun" size={70} />,
    <Flower key="flower" size={70} />,
    <Cloud key="cloud" size={90} />,
  ]

  return (
    <div className="blog-cover-art">
      {covers[index % covers.length]}
    </div>
  )
}

export function Blog() {
  return (
    <section className="container" id="blog">
      <SectionAccent variant="blog" />
      <SectionHeader
        kicker="07 — words"
        title="From the blog"
        underlineColor="var(--sky)"
      />
      <div className="blog-grid reveal">
        {BLOG_ITEMS.map((post, index) => (
          <a className="blog-card" href="#" key={post.title}>
            <div className="blog-cover">
              <BlogCover index={index} />
            </div>
            <div className="blog-body">
              <div className="blog-date">{post.date}</div>
              <h3>{post.title}</h3>
              <p className="excerpt">{post.excerpt}</p>
              <span className="blog-readmore">Read on →</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
