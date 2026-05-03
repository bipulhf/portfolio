import type { ComponentProps, ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { cx, crayonButtonClass, surfaceCardClass } from '~/components/portfolio/lib/styles'

export function AdminCard({
  children,
  className,
}: Readonly<{
  children: ReactNode
  className?: string
}>) {
  return (
    <section
      className={cx(
        surfaceCardClass,
        'rounded-[1.7rem] border-[2.5px] border-ink bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(244,250,249,0.96))] p-5 shadow-crayon-md md:p-6',
        className,
      )}
    >
      {children}
    </section>
  )
}

export function AdminField({
  children,
  help,
  label,
}: Readonly<{
  children: ReactNode
  help?: string
  label: string
}>) {
  return (
    <label className="block space-y-2">
      <span className="block font-hand text-[1.15rem] text-ink">{label}</span>
      {children}
      {help ? <span className="block text-sm text-ink-soft">{help}</span> : null}
    </label>
  )
}

export function AdminInput(props: Readonly<ComponentProps<'input'>>) {
  return (
    <input
      {...props}
      className={cx(
        'min-h-12 w-full rounded-[1rem] border-2 border-ink bg-white/75 px-4 py-3 text-base text-ink outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-ink-soft/70 focus:border-ink focus:bg-white focus:shadow-[0_0_0_4px_rgba(174,228,214,0.35)]',
        props.className,
      )}
    />
  )
}

export function AdminTextarea(props: Readonly<ComponentProps<'textarea'>>) {
  return (
    <textarea
      {...props}
      className={cx(
        'min-h-32 w-full rounded-[1rem] border-2 border-ink bg-white/75 px-4 py-3 text-base text-ink outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-ink-soft/70 focus:border-ink focus:bg-white focus:shadow-[0_0_0_4px_rgba(174,228,214,0.35)]',
        props.className,
      )}
    />
  )
}

export function AdminSelect(props: Readonly<ComponentProps<'select'>>) {
  return (
    <select
      {...props}
      className={cx(
        'min-h-12 w-full rounded-[1rem] border-2 border-ink bg-white/75 px-4 py-3 text-base text-ink outline-none transition-[border-color,box-shadow,background-color] duration-150 focus:border-ink focus:bg-white focus:shadow-[0_0_0_4px_rgba(174,228,214,0.35)]',
        props.className,
      )}
    />
  )
}

export function AdminCheckbox({
  help,
  label,
  ...props
}: Readonly<ComponentProps<'input'> & { help?: string; label: string }>) {
  return (
    <label className="flex items-start gap-3 rounded-[1rem] border-2 border-ink/10 bg-white/55 px-4 py-3">
      <input {...props} className="mt-1 size-4 accent-ink" type="checkbox" />
      <span className="block">
        <span className="block font-hand text-[1.1rem] text-ink">{label}</span>
        {help ? <span className="mt-1 block text-sm text-ink-soft">{help}</span> : null}
      </span>
    </label>
  )
}

export function AdminSectionHeading({
  action,
  eyebrow,
  title,
}: Readonly<{
  action?: ReactNode
  eyebrow?: string
  title: string
}>) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow ? <div className="mb-2 font-hand text-base text-ink-soft">{eyebrow}</div> : null}
        <h2 className="font-display text-[2.1rem] font-bold leading-none text-ink">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export function AdminStatusPill({ status }: Readonly<{ status: 'draft' | 'published' }>) {
  return (
    <span
      className={cx(
        'inline-flex min-h-8 items-center rounded-full border border-ink px-3 py-1 font-hand text-sm',
        status === 'published' ? 'bg-mint text-ink' : 'bg-yellow text-ink',
      )}
    >
      {status}
    </span>
  )
}

export function AdminEmptyState({
  actionLabel,
  actionTo,
  description,
  title,
}: Readonly<{
  actionLabel: string
  actionTo: string
  description: string
  title: string
}>) {
  return (
    <AdminCard className="text-center">
      <h3 className="font-display text-[2rem] font-bold text-ink">{title}</h3>
      <p className="mx-auto mt-3 max-w-2xl text-ink-soft">{description}</p>
      <div className="mt-6">
        <Link className={crayonButtonClass('yellow')} preload="intent" to={actionTo}>
          {actionLabel}
        </Link>
      </div>
    </AdminCard>
  )
}

export function AdminActionLink({
  children,
  to,
}: Readonly<{
  children: ReactNode
  to: string
}>) {
  return (
    <Link className={crayonButtonClass('yellow')} preload="intent" to={to}>
      {children}
    </Link>
  )
}
