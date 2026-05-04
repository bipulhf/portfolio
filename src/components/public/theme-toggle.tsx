import { usePublicTheme } from '~/components/public/public-theme'
import { cx } from '~/components/portfolio/lib/styles'

const options = [
  { label: 'Crayon', value: 'crayon' },
  { label: 'Minimal', value: 'minimal' },
] as const

export function ThemeToggle({
  className,
}: Readonly<{
  className?: string
}>) {
  const { setTheme, theme } = usePublicTheme()

  return (
    <div
      aria-label="Switch portfolio theme"
      className={cx('public-theme-toggle', className)}
      role="group"
    >
      {options.map((option) => {
        const active = theme === option.value

        return (
          <button
            aria-pressed={active}
            className={cx('public-theme-toggle__button', active && 'is-active')}
            key={option.value}
            onClick={() => setTheme(option.value)}
            type="button"
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
