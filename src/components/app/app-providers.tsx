import type { ReactNode } from 'react'
import { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { createQueryClient } from '~/lib/query-client'
import { RouteProgress } from '~/components/loaders/route-progress'

export function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <RouteProgress />
      {children}
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  )
}
