import { useEffect, useState } from 'react'

export function MinimalScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      const currentScroll = window.scrollY
      const scrollPercentage = (currentScroll / totalScroll) * 100
      setProgress(scrollPercentage)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div 
      className="minimal-scroll-progress theme-only-minimal" 
      style={{ width: `${progress}%` }} 
    />
  )
}
