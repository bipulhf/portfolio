import type { ReactNode } from 'react'
import { PublicThemeProvider } from '~/components/public/public-theme'
import type { PublicTheme } from '~/lib/public-theme'

export function AppProviders({
  children,
  initialTheme,
}: Readonly<{
  children: ReactNode
  initialTheme: PublicTheme
}>) {
  return <PublicThemeProvider initialTheme={initialTheme}>{children}</PublicThemeProvider>
}
