import { useEffect } from 'react'

export function useReveal(enabled: boolean, deps: any[] = []) {
  useEffect(() => {
    if (!enabled) {
      return
    }

    const elements = document.querySelectorAll<HTMLElement>('.reveal, .reveal-mask, .reveal-skew, [data-reveal-sequence]')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      elements.forEach((element) => {
        element.classList.add('in')
        element
          .querySelectorAll<HTMLElement>('[data-reveal-item]')
          .forEach((item) => item.classList.add('in'))
      })

      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          const target = entry.target as HTMLElement

          if (target.hasAttribute('data-reveal-sequence')) {
            const items = Array.from(
              target.querySelectorAll<HTMLElement>('[data-reveal-item]'),
            )
            const step = Number(target.dataset.revealStep ?? 55)

            target.classList.add('in')

            items.forEach((item, index) => {
              item.style.setProperty('--reveal-delay', `${index * step}ms`)
              item.classList.add('in')
            })
          } else {
            target.classList.add('in')
          }

          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.01,
        rootMargin: '0px 0px 200px 0px',
      },
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [enabled, ...deps])
}
