export const NAV_LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Achievements', href: '/#achievements' },
  { label: 'Blog', href: '/#blog' },
  { label: 'Contact', href: '/#contact' },
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
  {
    title: 'Workflow',
    tags: ['Testing', 'Code Review', 'DX', 'Accessibility', 'Performance'],
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

export const CONTACT_LINKS = [
  { label: '✉ Email me', href: 'mailto:bipulhf@gmail.com', tone: 'yellow' },
  { label: 'GitHub', href: 'https://github.com/bipulhf', tone: 'mint' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bipulhf', tone: 'sky' },
  { label: 'Twitter', href: 'https://twitter.com/bipulhf', tone: 'peach' },
] as const
