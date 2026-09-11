import { useEffect, useState } from 'react'
import { rafThrottle } from '~/lib/raf-throttle'

export function MinimalScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = rafThrottle(() => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll <= 0) {
        setProgress(0)
        return
      }

      const next = (window.scrollY / totalScroll) * 100
      setProgress((current) => (Math.abs(current - next) < 0.15 ? current : next))
    })

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      handleScroll.cancel()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      className="minimal-scroll-progress theme-only-minimal"
      style={{ width: `${progress}%` }}
    />
  )
}
