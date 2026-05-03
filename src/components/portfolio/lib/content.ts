export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
] as const

export const EXPERIENCE_ITEMS = [
  {
    role: 'Software Engineer',
    place: 'InfancyIT Ltd.',
    when: '2023 — Present',
    bullets: [
      'Building and maintaining product features end-to-end',
      'Shipping reliable backend services and clean APIs',
      'Mentoring teammates and improving engineering practices',
    ],
  },
  {
    role: 'Junior Developer',
    place: 'Previous Role · Placeholder',
    when: '2022 — 2023',
    bullets: [
      'Worked across the stack on web applications',
      'Contributed to internal tooling and design systems',
    ],
  },
  {
    role: 'Freelance & Open Source',
    place: 'Various',
    when: '2021 — 2022',
    bullets: [
      'Small client projects, side experiments, and OSS contributions',
    ],
  },
] as const

export const EDUCATION_ITEMS = [
  {
    role: 'B.Sc. in Computer Science',
    when: 'SUST',
    place: 'Shahjalal University of Science and Technology',
    bullets: [
      'Specialized coursework in algorithms, systems, and software engineering',
      'Active in programming contests and university tech clubs',
      'Final year project — placeholder for your thesis or capstone',
    ],
  },
] as const

export const SKILL_CATEGORIES = [
  {
    title: 'Languages',
    tags: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'],
  },
  {
    title: 'Frontend',
    tags: ['React', 'Next.js', 'Tailwind', 'HTML/CSS', 'Redux'],
  },
  {
    title: 'Backend',
    tags: ['Node.js', 'Express', 'Django', 'PostgreSQL', 'MongoDB'],
  },
  {
    title: 'Tools',
    tags: ['Git', 'Docker', 'AWS', 'Figma', 'Linux'],
  },
] as const

export const PROJECT_ITEMS = [
  {
    title: 'Project Aurora',
    desc: 'A real-time collaboration tool for distributed teams. Placeholder description.',
    tags: ['React', 'Node', 'WebSocket'],
    link: '#',
  },
  {
    title: 'Bloom Tracker',
    desc: 'A habit and mood tracker with playful gamification. Placeholder description.',
    tags: ['Next.js', 'Postgres'],
    link: '#',
  },
  {
    title: 'CrayonAPI',
    desc: 'A lightweight design tokens API for crayon-styled apps. Placeholder description.',
    tags: ['TypeScript', 'Express'],
    link: '#',
  },
  {
    title: 'Hackathon Kit',
    desc: 'A bootstrap kit my team uses to ship hackathon projects in 24 hours.',
    tags: ['Vite', 'React'],
    link: '#',
  },
  {
    title: 'StudyBuddy',
    desc: 'A pomodoro + note app for university friends. Placeholder description.',
    tags: ['Flutter'],
    link: '#',
  },
  {
    title: 'Sketch CMS',
    desc: 'A handwriting-friendly CMS for journaling sites. Placeholder description.',
    tags: ['Django', 'React'],
    link: '#',
  },
] as const

export const ACHIEVEMENT_ITEMS = [
  { title: 'Winner — National Hackathon', meta: 'placeholder · 2024', icon: '1st' },
  { title: 'Runner-up — Regional CodeFest', meta: 'placeholder · 2023', icon: '2nd' },
  { title: 'Best UI Award — University Hack', meta: 'SUST · 2023', icon: 'UI' },
  { title: 'Top 10 — Online AI Challenge', meta: 'placeholder · 2023', icon: 'AI' },
  { title: 'Winner — InterUni Code Sprint', meta: 'placeholder · 2022', icon: 'CS' },
  { title: 'Speaker — University Tech Talk', meta: 'SUST · 2022', icon: '🎤' },
] as const

export const BLOG_ITEMS = [
  {
    date: 'Mar 12, 2026',
    title: 'How I Approach Hackathons (and actually finish)',
    excerpt: 'A friendly guide to scoping, shipping, and not burning out at 3am.',
  },
  {
    date: 'Feb 04, 2026',
    title: 'Notes on Building Tiny Tools at Work',
    excerpt: "Small internal tools changed our team. Here's how I think about them.",
  },
  {
    date: 'Jan 18, 2026',
    title: 'From SUST to Software: A Friendly Roadmap',
    excerpt: "What I'd tell my first-year self about university, code, and craft.",
  },
] as const

export const CONTACT_LINKS = [
  { label: '✉ Email me', href: 'mailto:hello@example.com', className: 'btn' },
  { label: 'GitHub', href: '#', className: 'btn mint' },
  { label: 'LinkedIn', href: '#', className: 'btn sky' },
  { label: 'Twitter', href: '#', className: 'btn peach' },
] as const
