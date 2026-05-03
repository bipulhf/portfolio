import type { ReactNode } from 'react'
import { RouteProgress } from '~/components/loaders/route-progress'

export function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <RouteProgress />
      {children}
    </>
  )
}
