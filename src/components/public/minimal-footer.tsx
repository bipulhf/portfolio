import { PUBLIC_THEME_CONFIG } from '~/components/public/public-theme'
import { pageContainerClass } from '~/components/portfolio/lib/styles'

export function MinimalFooter() {
  return (
    <footer className={`${pageContainerClass} theme-only-minimal pb-12 pt-10 md:pb-16`}>
      <div className="minimal-footer-shell">
        <div className="minimal-footer-copy">
          {PUBLIC_THEME_CONFIG.minimal.footerText.replace('YEAR', String(new Date().getFullYear()))}
        </div>
        <div className="minimal-footer-rule" />
      </div>
    </footer>
  )
}
