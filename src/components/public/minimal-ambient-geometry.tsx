import type { CSSProperties } from 'react'

type ShapeKind = 'rectangle' | 'triangle' | 'hexagon'
type ShapeVariant = 'filled' | 'outline'

type ShapePalette = {
  fillFilled: string
  fillOutline: string
  glow: string
  stroke: string
}

type AmbientShape = {
  delay: string
  driftX: string
  driftXAlt: string
  driftY: string
  driftYAlt: string
  duration: string
  fill: string
  glow: string
  left: string
  opacity: string
  pulseDelay: string
  pulseDuration: string
  rotate: string
  size: string
  stroke: string
  top: string
  turn: string
  type: ShapeKind
  variant: ShapeVariant
}

const PALETTES: ShapePalette[] = [
  {
    stroke: 'rgb(194 176 167 / 0.74)',
    fillFilled: 'rgb(223 210 201 / 0.38)',
    fillOutline: 'rgb(223 210 201 / 0.14)',
    glow: 'rgb(223 210 201 / 0.2)',
  },
  {
    stroke: 'rgb(236 214 133 / 0.86)',
    fillFilled: 'rgb(244 229 170 / 0.4)',
    fillOutline: 'rgb(244 229 170 / 0.16)',
    glow: 'rgb(244 229 170 / 0.24)',
  },
  {
    stroke: 'rgb(171 208 231 / 0.84)',
    fillFilled: 'rgb(197 226 243 / 0.38)',
    fillOutline: 'rgb(197 226 243 / 0.15)',
    glow: 'rgb(197 226 243 / 0.22)',
  },
  {
    stroke: 'rgb(168 221 201 / 0.82)',
    fillFilled: 'rgb(196 236 220 / 0.36)',
    fillOutline: 'rgb(196 236 220 / 0.14)',
    glow: 'rgb(196 236 220 / 0.22)',
  },
  {
    stroke: 'rgb(238 186 169 / 0.84)',
    fillFilled: 'rgb(246 214 203 / 0.38)',
    fillOutline: 'rgb(246 214 203 / 0.15)',
    glow: 'rgb(246 214 203 / 0.22)',
  },
  {
    stroke: 'rgb(205 188 231 / 0.82)',
    fillFilled: 'rgb(224 214 242 / 0.36)',
    fillOutline: 'rgb(224 214 242 / 0.14)',
    glow: 'rgb(224 214 242 / 0.22)',
  },
]

function seededUnit(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

function pickType(index: number): ShapeKind {
  const value = seededUnit(index, 1)
  if (value < 0.34) return 'rectangle'
  if (value < 0.67) return 'triangle'
  return 'hexagon'
}

function formatSignedRem(amount: number) {
  return `${amount.toFixed(3)}rem`
}

function buildAmbientShapes(count: number): AmbientShape[] {
  return Array.from({ length: count }, (_, index) => {
    const type = pickType(index)
    const palette = PALETTES[Math.floor(seededUnit(index, 2) * PALETTES.length) % PALETTES.length]
    const variant: ShapeVariant = seededUnit(index, 3) > 0.56 ? 'outline' : 'filled'
    const left = 2 + seededUnit(index, 4) * 96
    const top = 5 + seededUnit(index, 5) * 90
    const size = 9 + seededUnit(index, 6) * 16 + (type === 'rectangle' ? 1.5 : 0)
    const opacity = 0.18 + seededUnit(index, 7) * 0.14
    const delay = seededUnit(index, 8) * 6.4
    const duration = 18 + seededUnit(index, 9) * 16
    const pulseDelay = seededUnit(index, 10) * 5.2
    const pulseDuration = 6.8 + seededUnit(index, 11) * 5.6
    const rotate = -18 + seededUnit(index, 12) * 36
    const turn = 4 + seededUnit(index, 13) * 8
    const turnSigned = seededUnit(index, 14) > 0.5 ? turn : -turn
    const driftX = (0.16 + seededUnit(index, 15) * 0.78) * (seededUnit(index, 16) > 0.5 ? 1 : -1)
    const driftY = (0.28 + seededUnit(index, 17) * 1.05) * (seededUnit(index, 18) > 0.5 ? 1 : -1)
    const driftXAlt = (0.12 + seededUnit(index, 19) * 0.72) * (seededUnit(index, 20) > 0.5 ? 1 : -1)
    const driftYAlt = (0.24 + seededUnit(index, 21) * 0.94) * (seededUnit(index, 22) > 0.5 ? 1 : -1)

    return {
      type,
      variant,
      stroke: palette.stroke,
      fill: variant === 'filled' ? palette.fillFilled : palette.fillOutline,
      glow: palette.glow,
      left: `${left.toFixed(3)}%`,
      top: `${top.toFixed(3)}%`,
      size: `${size.toFixed(2)}px`,
      opacity: opacity.toFixed(3),
      delay: `${delay.toFixed(2)}s`,
      duration: `${duration.toFixed(2)}s`,
      pulseDelay: `${pulseDelay.toFixed(2)}s`,
      pulseDuration: `${pulseDuration.toFixed(2)}s`,
      rotate: `${rotate.toFixed(2)}deg`,
      turn: `${turnSigned.toFixed(2)}deg`,
      driftX: formatSignedRem(driftX),
      driftY: formatSignedRem(driftY),
      driftXAlt: formatSignedRem(driftXAlt),
      driftYAlt: formatSignedRem(driftYAlt),
    }
  })
}

const SHAPES: AmbientShape[] = buildAmbientShapes(132)

function ShapeIcon({ type }: Readonly<{ type: ShapeKind }>) {
  if (type === 'triangle') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <polygon points="12 4 20 19 4 19" />
      </svg>
    )
  }

  if (type === 'hexagon') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <polygon points="8 3.5 16 3.5 21 12 16 20.5 8 20.5 3 12" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect height="14" rx="3" width="18" x="3" y="5" />
    </svg>
  )
}

export function MinimalAmbientGeometry() {
  return (
    <div aria-hidden="true" className="minimal-ambient-geometry">
      {SHAPES.map((shape, index) => {
        const style = {
          '--shape-delay': shape.delay,
          '--shape-drift-x': shape.driftX,
          '--shape-drift-x-alt': shape.driftXAlt,
          '--shape-drift-y': shape.driftY,
          '--shape-drift-y-alt': shape.driftYAlt,
          '--shape-duration': shape.duration,
          '--shape-fill': shape.fill,
          '--shape-glow': shape.glow,
          '--shape-left': shape.left,
          '--shape-opacity': shape.opacity,
          '--shape-pulse-delay': shape.pulseDelay,
          '--shape-pulse-duration': shape.pulseDuration,
          '--shape-rotate': shape.rotate,
          '--shape-size': shape.size,
          '--shape-stroke': shape.stroke,
          '--shape-top': shape.top,
          '--shape-turn': shape.turn,
        } as CSSProperties

        return (
          <span
            className={`minimal-ambient-shape is-${shape.type} is-${shape.variant}`}
            key={`${shape.type}-${shape.variant}-${index}`}
            style={style}
          >
            <ShapeIcon type={shape.type} />
          </span>
        )
      })}
    </div>
  )
}
