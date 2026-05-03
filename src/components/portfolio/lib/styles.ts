export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

export const pageContainerClass = 'mx-auto w-full max-w-[73.75rem] px-5 sm:px-6 md:px-7 lg:px-8'

export const sectionShellClass = `${pageContainerClass} relative scroll-mt-24 py-14 sm:py-16 md:py-20 lg:py-28`

export const surfaceCardClass = 'crayon-surface bg-paper'

const buttonToneClasses = {
  yellow: 'bg-yellow',
  mint: 'bg-mint',
  sky: 'bg-sky',
  peach: 'bg-peach',
  pink: 'bg-pink',
  lilac: 'bg-lilac',
} as const

export type ButtonTone = keyof typeof buttonToneClasses

export function crayonButtonClass(
  tone: ButtonTone = 'yellow',
  options?: {
    ghost?: boolean
    className?: string
  },
) {
  const ghost = options?.ghost ?? false

  return cx(
    'crayon-btn',
    ghost ? 'crayon-btn-ghost' : buttonToneClasses[tone],
    options?.className,
  )
}
