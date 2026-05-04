import { PUBLIC_THEME_CONFIG } from '~/components/public/public-theme'
import { ACHIEVEMENT_ITEMS } from '~/components/portfolio/lib/content'
import { pageContainerClass } from '~/components/portfolio/lib/styles'

const heroSignals = [
  ['Role', 'Fullstack engineer'],
  ['Base', 'Dhaka, Bangladesh'],
  ['Wins', `${ACHIEVEMENT_ITEMS.length}+ hackathons`],
] as const

export function MinimalHero() {
  const hero = PUBLIC_THEME_CONFIG.minimal.hero
  const charcoalStrong = 'text-[#3a342e]'
  const charcoalSoft = 'text-[#3a342e]/72'
  const charcoalFaint = 'text-[#3a342e]/58'

  return (
    <section className="theme-only-minimal py-20" id="top">
      <div className={pageContainerClass}>
        <div className="coding-border p-6 md:p-10 rounded-lg relative overflow-hidden">
          <div className="space-y-5">
            <span className={`block text-sm font-semibold uppercase tracking-[0.14em] ${charcoalFaint}`}>
              {hero.intro}
            </span>

            <h1 className={`text-4xl font-bold tracking-tight md:text-6xl ${charcoalStrong}`}>
              {hero.title}
            </h1>

            <p className={`max-w-3xl text-sm leading-relaxed md:text-base ${charcoalSoft}`}>
              {hero.lead}
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-4 pt-2">
              {heroSignals.map(([label, value]) => (
                <div className="flex flex-col" key={label}>
                  <span className={`mb-1 text-[10px] font-semibold uppercase tracking-widest ${charcoalFaint}`}>
                    {label}
                  </span>
                  <span className={`text-sm ${label === 'Role' ? 'font-bold' : 'font-normal'} ${label === 'Role' ? charcoalStrong : charcoalSoft}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <a 
              className={`rounded border border-[#3a342e]/14 bg-[#3a342e] px-6 py-2 text-xs font-bold uppercase tracking-widest text-[#f5efe7] transition-all hover:bg-[#2f2a25] no-underline`}
              href="#projects"
            >
              {hero.ctaPrimary}
            </a>
            <a 
              className={`rounded border border-[#3a342e]/14 bg-white/38 px-6 py-2 text-xs font-semibold uppercase tracking-widest ${charcoalStrong} transition-all hover:bg-white/58 no-underline`}
              href="#contact"
            >
              {hero.ctaSecondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
