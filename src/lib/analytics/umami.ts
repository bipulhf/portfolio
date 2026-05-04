import type { PublicTheme } from '~/components/public/public-theme'

type UmamiValue = string | number | boolean | null

type PublicAnalyticsPage = 'home' | 'projects' | 'blog'
type NavSurface = 'crayon-nav' | 'minimal-nav' | 'minimal-nav-mobile'
type CtaSurface =
  | 'crayon-hero'
  | 'minimal-hero'
  | 'crayon-nav'
  | 'minimal-nav'
  | 'minimal-nav-mobile'
type ProjectSource =
  | 'home-grid'
  | 'minimal-home-list'
  | 'projects-index'
  | 'minimal-project-index'
type BlogSource =
  | 'home-grid'
  | 'minimal-home-list'
  | 'blog-index'
  | 'minimal-blog-index'
type ContactDestination = 'email' | 'github' | 'linkedin' | 'twitter' | 'other'
type ContactSurface = 'contact-section'

type UmamiEventMap = {
  'theme-changed': {
    from: PublicTheme
    page: PublicAnalyticsPage
    to: PublicTheme
  }
  'nav-clicked': {
    href: string
    label: string
    surface: NavSurface
    theme: PublicTheme
  }
  'cta-clicked': {
    href: string
    id: string
    page: PublicAnalyticsPage
    surface: CtaSurface
    theme: PublicTheme
  }
  'project-opened': {
    slug: string
    source: ProjectSource
    theme: PublicTheme
  }
  'project-live-clicked': {
    slug: string
    source: ProjectSource
    theme: PublicTheme
  }
  'project-code-clicked': {
    slug: string
    source: ProjectSource
    theme: PublicTheme
  }
  'blog-opened': {
    slug: string
    source: BlogSource
    theme: PublicTheme
  }
  'contact-link-clicked': {
    destination: ContactDestination
    label: string
    surface: ContactSurface
    theme: PublicTheme
  }
}

type UmamiEventName = keyof UmamiEventMap

type UmamiTracker = {
  track: <K extends UmamiEventName>(eventName: K, data?: Record<string, UmamiValue>) => void
}

declare global {
  interface Window {
    umami?: UmamiTracker
  }
}

function canTrackUmami() {
  return typeof window !== 'undefined' && typeof window.umami?.track === 'function'
}

export function getPublicAnalyticsPage(pathname?: string): PublicAnalyticsPage {
  const resolvedPathname =
    pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '/')

  if (resolvedPathname === '/' || resolvedPathname === '') {
    return 'home'
  }

  if (resolvedPathname === '/projects' || resolvedPathname.startsWith('/projects/')) {
    return 'projects'
  }

  if (resolvedPathname === '/blog' || resolvedPathname.startsWith('/blog/')) {
    return 'blog'
  }

  return 'home'
}

export function sanitizeTrackedHref(href: string) {
  const [pathWithoutQuery] = href.split('?')
  return pathWithoutQuery || href
}

export function getTrackedContactDestination(href: string): ContactDestination {
  if (href.startsWith('mailto:')) {
    return 'email'
  }

  if (href.includes('github.com')) {
    return 'github'
  }

  if (href.includes('linkedin.com')) {
    return 'linkedin'
  }

  if (href.includes('twitter.com') || href.includes('x.com')) {
    return 'twitter'
  }

  return 'other'
}

export function sanitizeTrackedLabel(label: string) {
  return label.replace(/^✉\s*/, '').trim()
}

export function trackUmamiEvent<K extends UmamiEventName>(
  eventName: K,
  data: UmamiEventMap[K],
) {
  if (!canTrackUmami()) {
    return
  }

  window.umami?.track(eventName, data)
}
