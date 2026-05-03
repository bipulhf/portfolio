export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

export const pageContainerClass = 'mx-auto w-full max-w-[73.75rem] px-4 md:px-6 lg:px-8'

export const sectionShellClass = `${pageContainerClass} relative scroll-mt-28 py-[4.5rem] md:py-[5.625rem] lg:py-[8.125rem]`

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
