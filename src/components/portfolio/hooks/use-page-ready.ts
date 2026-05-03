import { useEffect, useState } from 'react'

export function usePageReady(delay = 40) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let timeoutId = 0
    const frameId = window.requestAnimationFrame(() => {
      timeoutId = window.setTimeout(() => setReady(true), delay)
    })

    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(timeoutId)
    }
  }, [delay])

  return ready
}
