import { pageContainerClass } from './lib/styles'

export function Footer() {
  return (
    <footer className={`${pageContainerClass} px-4 pb-12 pt-8 text-center font-hand text-base text-ink-soft`}>
      Made with <span className="inline-block text-peach drop-shadow-[1px_1px_0_var(--color-ink)]">♥</span> and a
      box of crayons - © 2026 Shahiduzzaman Bipul
    </footer>
  )
}
