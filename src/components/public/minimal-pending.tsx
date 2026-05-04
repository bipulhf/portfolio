import { cx, pageContainerClass } from '~/components/portfolio/lib/styles'

export function MinimalPendingPage({
  cards = 3,
  title = 'Loading',
}: Readonly<{
  cards?: number
  title?: string
}>) {
  return (
    <div className={cx(pageContainerClass, 'theme-only-minimal py-32')}>
      <div className="max-w-4xl">
        <div className="h-4 w-24 bg-ink/5 rounded-full mb-8 animate-pulse" />
        <div className="h-16 md:h-24 w-full bg-ink/5 rounded-2xl mb-12 animate-pulse" />
        <div className="h-8 w-2/3 bg-ink/5 rounded-xl mb-24 animate-pulse" />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: cards }).map((_, index) => (
            <div className="flex flex-col gap-4" key={index}>
              <div className="aspect-[16/10] bg-ink/5 rounded-2xl animate-pulse" />
              <div className="h-6 w-3/4 bg-ink/5 rounded-lg animate-pulse" />
              <div className="h-4 w-1/2 bg-ink/5 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
