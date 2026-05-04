import { PUBLIC_THEME_CONFIG } from '~/components/public/public-theme'
import { pageContainerClass } from '~/components/portfolio/lib/styles'

export function MinimalFooter() {
  const currentYear = new Date().getFullYear()
  const headline = PUBLIC_THEME_CONFIG.minimal.footerText
    .replace(`© YEAR Bipul Hf`, '')
    .trim()
  const detail = `Copyright © ${currentYear}. Designed and built in Dhaka. All rights reserved.`

  return (
    <footer className={`${pageContainerClass} theme-only-minimal py-20`}>
      <div className="minimal-footer-shell">
        <div className="flex flex-col gap-1">
          <div className="minimal-footer-copy">{headline}</div>
          <div className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[#3a342e]/62">
            {detail}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a className="minimal-article-back" href="#top">Back to top</a>
        </div>
      </div>
    </footer>
  )
}
