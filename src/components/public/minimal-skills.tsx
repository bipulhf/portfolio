import { SKILL_CATEGORIES } from '~/components/portfolio/lib/content'
import { cx, pageContainerClass } from '~/components/portfolio/lib/styles'

export function MinimalSkills() {
  return (
    <section className={cx(pageContainerClass, 'theme-only-minimal minimal-skills-stage py-32')} id="skills">
      <div className="reveal-mask">
        <div className="minimal-home-label mb-12">04 / toolkit</div>
      </div>
      
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 mb-20">
        <div className="lg:col-span-8">
          <h2 className="minimal-home-headline reveal-skew max-w-[9ch]">
            A small toolkit I trust deeply.
          </h2>
        </div>
        <div className="lg:col-span-4 flex items-end">
          <p className="minimal-home-body reveal-mask">
            Range to move comfortably from interface details to backend systems.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" data-reveal-sequence>
        {SKILL_CATEGORIES.map((category) => (
          <article
            className="group relative rounded-[1.75rem] border border-ink/10 bg-white/72 p-8 shadow-[0_1rem_2rem_rgba(22,22,22,0.06)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_1.4rem_2.4rem_rgba(22,22,22,0.1)] reveal-skew"
            data-reveal-item
            key={category.title}
          >
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.16em] text-ink/70 transition-colors group-hover:text-ink">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.tags.map((tag) => (
                <span className="rounded-full border border-ink/10 bg-paper/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink transition-colors group-hover:border-yellow/70 group-hover:bg-yellow/35" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
