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
              item.style.setProperty('--reveal-delay', `${index * 90}ms`)
              item.classList.add('in')
            })
          } else {
            target.classList.add('in')
          }

          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12 },
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])
}
