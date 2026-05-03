import { Dot, Heart, Spiral, Squiggle, Star, Triangle } from './doodles'

const items = [
  { Component: Star, x: '6%', y: '14%', size: 28, color: '#ffd84a', rotation: -8, duration: 7 },
  { Component: Squiggle, x: '92%', y: '10%', size: 36, color: '#7fb8a0', rotation: 10, duration: 8 },
  { Component: Heart, x: '4%', y: '38%', size: 24, color: '#f7a3a8', rotation: 6, duration: 9 },
  { Component: Spiral, x: '95%', y: '32%', size: 36, color: '#7eb1d6', rotation: -6, duration: 10 },
  { Component: Star, x: '88%', y: '54%', size: 22, color: '#ffd84a', rotation: 12, duration: 7 },
  { Component: Triangle, x: '8%', y: '60%', size: 26, color: '#b8e6c8', rotation: -4, duration: 8 },
  { Component: Squiggle, x: '6%', y: '82%', size: 30, color: '#ffc7a8', rotation: 8, duration: 9 },
  { Component: Heart, x: '93%', y: '78%', size: 22, color: '#f7c1c9', rotation: -10, duration: 7 },
  { Component: Dot, x: '50%', y: '7%', size: 8, color: '#3d3a2e', rotation: 0, duration: 6 },
  { Component: Star, x: '48%', y: '92%', size: 18, color: '#b9dcf2', rotation: 0, duration: 8 },
] as const

export function BackgroundDoodles() {
  return (
    <div aria-hidden="true" className="bg-doodles pointer-events-none absolute inset-0 z-0 overflow-x-clip">
      {items.map(({ Component, color, duration, rotation, size, x, y }, index) => (
        <div
          key={`${x}-${y}-${index}`}
          className="float-doodle absolute"
          style={{
            left: x,
            top: y,
            ['--r' as string]: `${rotation}deg`,
            animationDuration: `${duration}s`,
            animationDelay: `${-index * 0.7}s`,
          }}
        >
          <Component color={color} size={size} />
        </div>
      ))}
    </div>
  )
}
