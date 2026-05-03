import type { CSSProperties, ReactNode } from 'react'
import { Cloud, CornerBurst, Heart, Spiral, Squiggle, Star, Sun, Triangle } from './doodles'

type AccentVariant =
  | 'about'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'achievements'
  | 'blog'
  | 'contact'

type AccentItem = {
  node: ReactNode
  style: CSSProperties
}

const accents: Record<AccentVariant, AccentItem[]> = {
  about: [
    {
      node: <Heart color="var(--peach)" size={24} />,
      style: { top: '4.25rem', right: '3rem', rotate: '-10deg' },
    },
    {
      node: <Squiggle color="var(--mint)" size={28} />,
      style: { top: '7.5rem', right: '7.25rem', rotate: '8deg' },
    },
  ],
  experience: [
    {
      node: <Star color="var(--yellow)" size={24} />,
      style: { top: '4rem', right: '2.5rem', rotate: '-8deg' },
    },
    {
      node: <Spiral color="var(--mint)" size={26} />,
      style: { top: '10rem', right: '5.5rem', rotate: '12deg' },
    },
  ],
  education: [
    {
      node: <Cloud color="#fffaf2" size={48} />,
      style: { top: '3.75rem', right: '2rem', rotate: '-3deg' },
    },
    {
      node: <Triangle color="var(--sky)" size={22} />,
      style: { top: '8.5rem', right: '7.25rem', rotate: '10deg' },
    },
  ],
  skills: [
    {
      node: <CornerBurst color="var(--yellow)" size={34} />,
      style: { top: '4.25rem', right: '2.5rem', rotate: '10deg' },
    },
    {
      node: <Squiggle color="var(--sky)" size={28} />,
      style: { top: '8.25rem', right: '6.5rem', rotate: '-10deg' },
    },
  ],
  projects: [
    {
      node: <Sun color="var(--yellow)" size={34} />,
      style: { top: '3.75rem', right: '2rem', rotate: '8deg' },
    },
    {
      node: <Heart color="var(--pink)" size={24} />,
      style: { top: '8rem', right: '7rem', rotate: '-12deg' },
    },
  ],
  achievements: [
    {
      node: <Star color="var(--yellow)" size={22} />,
      style: { top: '4.5rem', right: '2.5rem', rotate: '-6deg' },
    },
    {
      node: <CornerBurst color="var(--mint)" size={30} />,
      style: { top: '8.75rem', right: '6rem', rotate: '10deg' },
    },
  ],
  blog: [
    {
      node: <Cloud color="#fffaf2" size={42} />,
      style: { top: '3.75rem', right: '2.5rem', rotate: '4deg' },
    },
    {
      node: <Heart color="var(--pink)" size={22} />,
      style: { top: '8.5rem', right: '7.2rem', rotate: '-14deg' },
    },
  ],
  contact: [
    {
      node: <Star color="var(--yellow)" size={24} />,
      style: { top: '4.25rem', right: '2.5rem', rotate: '-8deg' },
    },
    {
      node: <Squiggle color="var(--sky)" size={28} />,
      style: { top: '8.25rem', right: '6.5rem', rotate: '8deg' },
    },
  ],
}

export function SectionAccent({ variant }: { variant: AccentVariant }) {
  return (
    <div aria-hidden="true" className={`section-accent section-accent-${variant}`}>
      {accents[variant].map((item, index) => (
        <span
          className="section-accent-item"
          key={`${variant}-${index}`}
          style={{
            ...item.style,
            ['--accent-delay' as string]: `${index * -1.6}s`,
          }}
        >
          {item.node}
        </span>
      ))}
    </div>
  )
}
