export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

export const pageContainerClass = 'mx-auto w-full max-w-[73.75rem] px-5 sm:px-6 md:px-7 lg:px-8'

export const sectionShellClass = 'portfolio-section relative scroll-mt-24 py-5 sm:py-6 md:py-7 lg:py-9'

export const sectionFrameClass = `${pageContainerClass} relative`

export const sectionInnerClass =
  'relative z-[1] px-4 py-12 sm:px-5 sm:py-14 md:px-7 md:py-16 lg:px-8 lg:py-20'

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
