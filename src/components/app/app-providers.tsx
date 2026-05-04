import type { ReactNode } from 'react'
import { PublicThemeProvider } from '~/components/public/public-theme'

export function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
  return <PublicThemeProvider>{children}</PublicThemeProvider>
}
