import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

export type PublicTheme = 'crayon' | 'minimal'
export type PublicPageKey = 'home' | 'projects' | 'blog'

type NavLink = {
  href: string
  label: string
}

type PublicThemeConfig = {
  footerText: string
  hero: {
    artAlt: string
    artSrc: string
    ctaPrimary: string
    ctaSecondary: string
    intro: string
    lead: string
    note: string
    support: string
    title: string
  }
  home: {
    contactDescription: string
    contactEyebrow: string
    contactTitle: string
    seoDescription: string
    workDescription: string
    workEyebrow: string
    workTitle: string
  }
  meta: Record<
    PublicPageKey,
    {
      description: string
      title: string
    }
  >
  nav: {
    ctaHref: string
    ctaLabel: string
    links: NavLink[]
    logoAlt: string
    logoSrc: string
    subtitle: string
    title: string
  }
  pages: {
    blog: {
      description: string
      eyebrow: string
      primaryLabel: string
      secondaryLabel: string
      title: string
    }
    projects: {
      description: string
      eyebrow: string
      primaryLabel: string
      secondaryLabel: string
      title: string
    }
  }
}

type PublicThemeContextValue = {
  setTheme: (theme: PublicTheme) => void
  theme: PublicTheme
  toggleTheme: () => void
}

declare global {
  interface Window {
    __PUBLIC_THEME__?: PublicTheme
  }
}

export const DEFAULT_PUBLIC_THEME: PublicTheme = 'crayon'
export const PUBLIC_THEME_STORAGE_KEY = 'portfolio-public-theme'
const PUBLIC_THEME_TRANSITION_MS = 420

export const PUBLIC_THEME_CONFIG: Record<PublicTheme, PublicThemeConfig> = {
  crayon: {
    footerText: 'Made with a box of crayons and careful thinking. © YEAR Bipul Hf',
    hero: {
      artAlt: 'Portrait of Shahiduzzaman Bipul in a crayon illustration style',
      artSrc: '/my-image.png',
      ctaPrimary: 'See selected work →',
      ctaSecondary: 'Start a conversation',
      intro: 'say hello to',
      lead: 'A software engineer crafting calm, considered software one careful detail at a time.',
      note: 'illustrated, still me',
      support: 'software engineer',
      title: 'Bipul',
    },
    home: {
      contactDescription:
        "The best next step is usually a simple hello. If there is a role, product, or idea worth building carefully, I'd love to hear about it.",
      contactEyebrow: '08 - say hi',
      contactTitle: "Let's make something",
      seoDescription:
        'A crayon-styled portfolio for Shahiduzzaman Bipul featuring projects, writing, and achievements.',
      workDescription:
        'A few projects where product thinking, engineering quality, and interface craft come through most clearly.',
      workEyebrow: '05 - selected work',
      workTitle: "Things I've built",
    },
    meta: {
      blog: {
        description:
          'Writing on building products, frontend craft, and engineering process by Shahiduzzaman Bipul.',
        title: 'Blog — Shahiduzzaman Bipul',
      },
      home: {
        description:
          'A crayon-styled portfolio for Shahiduzzaman Bipul featuring projects, writing, and achievements.',
        title: 'Shahiduzzaman Bipul — Portfolio',
      },
      projects: {
        description:
          'Case studies, experiments, and shipped product work by Shahiduzzaman Bipul.',
        title: 'Projects — Shahiduzzaman Bipul',
      },
    },
    nav: {
      ctaHref: '/#contact',
      ctaLabel: 'Available for collaborations',
      links: [
        { href: '/#about', label: 'About' },
        { href: '/#projects', label: 'Projects' },
        { href: '/#achievements', label: 'Achievements' },
        { href: '/#blog', label: 'Blog' },
        { href: '/#contact', label: 'Contact' },
      ],
      logoAlt: 'Bipul logo',
      logoSrc: '/logo.png',
      subtitle: 'software engineer',
      title: 'Bipul',
    },
    pages: {
      blog: {
        description:
          'Writing about product engineering, frontend craft, and the thinking behind the work.',
        eyebrow: 'Writing',
        primaryLabel: 'Back to home',
        secondaryLabel: 'See projects',
        title: 'Blog and essays',
      },
      projects: {
        description:
          'Selected case studies, engineering decisions, and the small details that shaped each build.',
        eyebrow: 'Selected work',
        primaryLabel: 'Back to home',
        secondaryLabel: 'Read the blog',
        title: 'Projects and case studies',
      },
    },
  },
  minimal: {
    footerText: 'Bipul Hf, software engineer. © YEAR Bipul Hf',
    hero: {
      artAlt: 'Minimal hero artwork for Bipul portfolio mode',
      artSrc: '/minimal-portrait.svg',
      ctaPrimary: 'View work',
      ctaSecondary: 'Email',
      intro: 'software engineer',
      lead: 'I build clear interfaces, dependable systems, and product-focused web software.',
      note: 'alternate public mode',
      support: 'frontend clarity / backend reliability',
      title: 'Bipul',
    },
    home: {
      contactDescription:
        'If the work feels aligned, email is still the fastest way in. I keep this version lean on purpose.',
      contactEyebrow: '04 / contact',
      contactTitle: 'Open for selective work',
      seoDescription:
        'A reduced minimalist portfolio for Shahiduzzaman Bipul focused on selected work and direct contact.',
      workDescription:
        'A tighter edit of projects that show how I think about product, interfaces, and system reliability.',
      workEyebrow: '02 / selected work',
      workTitle: 'A quieter portfolio. A stronger work story.',
    },
    meta: {
      blog: {
        description:
          'Short writing by Shahiduzzaman Bipul on product systems, frontend clarity, and build decisions.',
        title: 'Notes — Shahiduzzaman Bipul',
      },
      home: {
        description:
          'A reduced minimalist portfolio for Shahiduzzaman Bipul focused on selected work and direct contact.',
        title: 'Shahiduzzaman Bipul — Minimal Portfolio',
      },
      projects: {
        description:
          'A concise view of shipped interfaces, product systems, and build decisions by Shahiduzzaman Bipul.',
        title: 'Selected Work — Shahiduzzaman Bipul',
      },
    },
    nav: {
      ctaHref: '/#contact',
      ctaLabel: 'Email',
      links: [
        { href: '/#projects', label: 'Work' },
        { href: '/blog', label: 'Notes' },
      ],
      logoAlt: 'Minimal Bipul mark',
      logoSrc: '/minimal-mark.svg',
      subtitle: 'software engineer',
      title: 'Bipul',
    },
    pages: {
      blog: {
        description: 'Short writing on product work, interface decisions, and software craft.',
        eyebrow: '/notes/index.md',
        primaryLabel: 'Home',
        secondaryLabel: 'Projects',
        title: 'Notes',
      },
      projects: {
        description: 'Selected builds, shipped interfaces, and engineering case studies.',
        eyebrow: '/projects/index.ts',
        primaryLabel: 'Home',
        secondaryLabel: 'Notes',
        title: 'Projects',
      },
    },
  },
}

const PublicThemeContext = createContext<PublicThemeContextValue | null>(null)

function isPublicTheme(value: string | null | undefined): value is PublicTheme {
  return value === 'crayon' || value === 'minimal'
}

function getBrowserTheme() {
  if (typeof window === 'undefined') {
    return DEFAULT_PUBLIC_THEME
  }

  if (isPublicTheme(window.__PUBLIC_THEME__)) {
    return window.__PUBLIC_THEME__
  }

  const fromDom = document.documentElement.dataset.publicTheme
  if (isPublicTheme(fromDom)) {
    return fromDom
  }

  try {
    const fromStorage = window.localStorage.getItem(PUBLIC_THEME_STORAGE_KEY)
    return isPublicTheme(fromStorage) ? fromStorage : DEFAULT_PUBLIC_THEME
  } catch {
    return DEFAULT_PUBLIC_THEME
  }
}

function applyThemeToDocument(theme: PublicTheme) {
  document.documentElement.dataset.publicTheme = theme
  window.__PUBLIC_THEME__ = theme
}

function clearThemeTransitionState() {
  delete document.documentElement.dataset.publicThemeTransition
}

function shouldAnimateThemeTransition() {
  return typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const PUBLIC_THEME_BOOTSTRAP_SCRIPT = `(() => {
  const key = '${PUBLIC_THEME_STORAGE_KEY}';
  const fallback = '${DEFAULT_PUBLIC_THEME}';
  try {
    const stored = window.localStorage.getItem(key);
    const theme = stored === 'minimal' || stored === 'crayon' ? stored : fallback;
    document.documentElement.dataset.publicTheme = theme;
    window.__PUBLIC_THEME__ = theme;
  } catch {
    document.documentElement.dataset.publicTheme = fallback;
    window.__PUBLIC_THEME__ = fallback;
  }
})();`

export function themeOnlyClass(theme: PublicTheme) {
  return theme === 'crayon' ? 'theme-only-crayon' : 'theme-only-minimal'
}

export function PublicThemeProvider({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const [theme, setThemeState] = useState<PublicTheme>(DEFAULT_PUBLIC_THEME)
  const themeTransitionTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const nextTheme = getBrowserTheme()
    applyThemeToDocument(nextTheme)
    setThemeState(nextTheme)

    function handleStorage(event: StorageEvent) {
      if (event.key !== PUBLIC_THEME_STORAGE_KEY || !isPublicTheme(event.newValue)) {
        return
      }

      applyThemeToDocument(event.newValue)
      setThemeState(event.newValue)
    }

    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)

      if (themeTransitionTimeoutRef.current !== null) {
        window.clearTimeout(themeTransitionTimeoutRef.current)
      }

      clearThemeTransitionState()
    }
  }, [])

  function updateTheme(nextTheme: PublicTheme, options?: { animate?: boolean }) {
    const shouldAnimate = options?.animate === true && shouldAnimateThemeTransition()

    if (themeTransitionTimeoutRef.current !== null) {
      window.clearTimeout(themeTransitionTimeoutRef.current)
      themeTransitionTimeoutRef.current = null
    }

    if (shouldAnimate) {
      clearThemeTransitionState()
      void document.documentElement.offsetWidth
      document.documentElement.dataset.publicThemeTransition = 'true'
    } else {
      clearThemeTransitionState()
    }

    setThemeState(nextTheme)
    applyThemeToDocument(nextTheme)

    if (shouldAnimate) {
      themeTransitionTimeoutRef.current = window.setTimeout(() => {
        clearThemeTransitionState()
        themeTransitionTimeoutRef.current = null
      }, PUBLIC_THEME_TRANSITION_MS)
    }
  }

  const value = useMemo<PublicThemeContextValue>(
    () => ({
      setTheme: (nextTheme) => {
        if (nextTheme === theme) {
          return
        }

        updateTheme(nextTheme, { animate: true })

        try {
          window.localStorage.setItem(PUBLIC_THEME_STORAGE_KEY, nextTheme)
        } catch {
          // Ignore storage failures and keep the live theme in memory.
        }
      },
      theme,
      toggleTheme: () => {
        const nextTheme = theme === 'crayon' ? 'minimal' : 'crayon'
        updateTheme(nextTheme, { animate: true })

        try {
          window.localStorage.setItem(PUBLIC_THEME_STORAGE_KEY, nextTheme)
        } catch {
          // Ignore storage failures and keep the live theme in memory.
        }
      },
    }),
    [theme],
  )

  return <PublicThemeContext.Provider value={value}>{children}</PublicThemeContext.Provider>
}

export function usePublicTheme() {
  const context = useContext(PublicThemeContext)

  if (!context) {
    throw new Error('usePublicTheme must be used within a PublicThemeProvider')
  }

  return context
}

export function usePublicThemePageMeta(page: PublicPageKey) {
  const { theme } = usePublicTheme()

  useEffect(() => {
    const nextMeta = PUBLIC_THEME_CONFIG[theme].meta[page]
    document.title = nextMeta.title

    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!description) {
      description = document.createElement('meta')
      description.name = 'description'
      document.head.appendChild(description)
    }

    description.content = nextMeta.description
  }, [page, theme])
}
