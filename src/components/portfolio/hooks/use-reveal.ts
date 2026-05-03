import { useEffect } from 'react'

export function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal, [data-reveal-sequence]')

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

            target.classList.add('in')

            items.forEach((item, index) => {
              item.style.setProperty('--reveal-delay', `${index * 70}ms`)
              item.classList.add('in')
            })
          } else {
            target.classList.add('in')
          }

          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -10% 0px',
      },
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])
}
