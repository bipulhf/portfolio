import { Cloud, Dot, Heart, Spiral, Squiggle, Star, Triangle } from './doodles'

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

const sidebarNotes = [
  {
    side: 'left',
    tone: 'mint',
    label: 'calm systems',
    x: '0.9rem',
    y: '14%',
    rotate: '-4deg',
    Icon: Spiral,
    iconColor: '#7fb8a0',
    delay: '-1.1s',
    duration: '19s',
  },
  {
    side: 'left',
    tone: 'paper',
    label: 'gentle pace',
    x: '1.4rem',
    y: '53%',
    rotate: '3deg',
    Icon: Dot,
    iconColor: '#a9d4ec',
    delay: '-4.2s',
    duration: '21s',
  },
  {
    side: 'right',
    tone: 'sky',
    label: 'careful details',
    x: '0.8rem',
    y: '21%',
    rotate: '4deg',
    Icon: Star,
    iconColor: '#ffd84a',
    delay: '-2.4s',
    duration: '20s',
  },
  {
    side: 'right',
    tone: 'peach',
    label: 'steady craft',
    x: '1.6rem',
    y: '60%',
    rotate: '-3deg',
    Icon: Squiggle,
    iconColor: '#7fb8a0',
    delay: '-5.1s',
    duration: '22s',
  },
] as const

const sidebarClouds = [
  { side: 'left', x: '2.6rem', y: '33%', size: 44, delay: '-3s', duration: '24s' },
  { side: 'right', x: '2.3rem', y: '43%', size: 48, delay: '-6s', duration: '26s' },
] as const

function AmbientRail({ side }: Readonly<{ side: 'left' | 'right' }>) {
  const notes = sidebarNotes.filter((item) => item.side === side)
  const clouds = sidebarClouds.filter((item) => item.side === side)

  return (
    <div className={`ambient-rail ambient-rail--${side}`}>
      <div className="ambient-rail-line" />

      {notes.map(({ Icon, delay, duration, iconColor, label, rotate, tone, x, y }) => (
        <div
          className={`ambient-note ambient-note--${tone}`}
          key={`${side}-${label}`}
          style={{
            left: x,
            top: y,
            rotate,
            ['--ambient-delay' as string]: delay,
            ['--ambient-duration' as string]: duration,
          }}
        >
          <span className="ambient-note-icon">
            <Icon color={iconColor} size={18} />
          </span>
          <span className="ambient-note-label">{label}</span>
        </div>
      ))}

      {clouds.map(({ delay, duration, size, x, y }, index) => (
        <div
          className="ambient-cloud"
          key={`${side}-cloud-${index}`}
          style={{
            left: x,
            top: y,
            ['--ambient-delay' as string]: delay,
            ['--ambient-duration' as string]: duration,
          }}
        >
          <Cloud color="#fffdf7" size={size} stroke="#b7c5c1" />
        </div>
      ))}

      <div className="ambient-orb ambient-orb--small" style={{ top: '74%', left: '3.1rem' }} />
      <div className="ambient-orb ambient-orb--large" style={{ top: '87%', left: '0.3rem' }} />
      <div className="ambient-dot-cluster" style={{ top: '38%', left: side === 'left' ? '4.9rem' : '0.4rem' }}>
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

export function BackgroundDoodles() {
  return (
    <div aria-hidden="true" className="bg-doodles pointer-events-none absolute inset-0 z-0 overflow-x-clip">
      <AmbientRail side="left" />
      <AmbientRail side="right" />
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
