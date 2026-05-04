export const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Achievements", href: "/#achievements" },
  { label: "Blog", href: "/#blog" },
  { label: "Contact", href: "/#contact" },
] as const;

export const EXPERIENCE_ITEMS = [
  {
    role: "Software Engineer",
    place: "InfancyIT Ltd.",
    when: "2023 — Present",
    bullets: [
      "Building and maintaining product features end-to-end",
      "Shipping reliable backend services and clean APIs",
      "Mentoring teammates and improving engineering practices",
    ],
  },
  {
    role: "Junior Developer",
    place: "Previous Role · Placeholder",
    when: "2022 — 2023",
    bullets: [
      "Worked across the stack on web applications",
      "Contributed to internal tooling and design systems",
    ],
  },
  {
    role: "Freelance & Open Source",
    place: "Various",
    when: "2021 — 2022",
    bullets: ["Small client projects, side experiments, and OSS contributions"],
  },
] as const;

export const EDUCATION_ITEMS = [
  {
    role: "B.Sc. in Computer Science",
    when: "SUST",
    place: "Shahjalal University of Science and Technology",
    bullets: [
      "Specialized coursework in algorithms, systems, and software engineering",
      "Active in programming contests and university tech clubs",
      "Final year project — placeholder for your thesis or capstone",
    ],
  },
] as const;

export const SKILL_CATEGORIES = [
  {
    title: "Languages",
    tags: ["JavaScript", "TypeScript", "Java"],
  },
  {
    title: "Frontend",
    tags: ["React", "Next.js", "Tanstack Start", "Zustand", "Tailwind CSS"],
  },
  {
    title: "Backend",
    tags: ["Node.js", "Express", "SQL", "Spring Boot"],
  },
  {
    title: "Tools",
    tags: ["Git", "Docker", "GitHub Actions"],
  },
] as const;

export const ACHIEVEMENT_ITEMS = [
  {
    title: "Where it started",
    meta: "Therap Javafest + SUST CSE Hackathon · 2023",
    icon: "01",
    summary:
      "These early hackathons pulled me into competitive building. My projects explored practical software ideas under pressure, and the experience pushed me deeper into product thinking, speed, and execution.",
    href: "https://github.com/bipulhf/GreenRoof",
    linkLabel: "View the project",
  },
  {
    title: "CodeSamurai 2024",
    meta: "8th place · smart waste management system",
    icon: "8",
    summary:
      "My first onsite hackathon. I worked on a smart waste management system designed to make collection more data-driven, and seeing the product work in a live competition made it unforgettable.",
    href: "https://github.com/bipulhf/EcoSync",
    linkLabel: "View the project",
  },
  {
    title: "Leading University Hackathon",
    meta: "Champions · AI meeting scheduler",
    icon: "1st",
    summary:
      "I led the frontend for an AI meeting scheduler that matched time slots to user needs. A strong product demo and clear presentation helped turn it into a championship win.",
    href: "https://github.com/bipulhf/shakkhat-frontend",
    linkLabel: "View the project",
  },
  {
    title: "HackTheAI",
    meta: "Runner-up · creator toolkit",
    icon: "2nd",
    summary:
      "I helped build a creator toolkit that generated video ideas from trends, comments, and competitor signals. The product also included thumbnail generation, sentiment analysis, and calendar-based scheduling.",
    href: "https://github.com/Unayes09/Thryve-Youtubers-Toolkit-SmythOS-HackTheAI-2025",
    linkLabel: "View the project",
  },
  {
    title: "Solvio Hackathon",
    meta: "Honorable mention · autism support system",
    icon: "HM",
    summary:
      "I handled deployment for a system focused on autism identification and gamified therapy. My role was keeping 18 services stable and running reliably throughout the event.",
    href: "https://github.com/TajulTarek/NeuroNurture-Solvio",
    linkLabel: "View the project",
  },
  {
    title: "AI Meets Climate Action",
    meta: "Champions · Oxfam Bangladesh",
    icon: "1st",
    summary:
      "My final hackathon win. I worked on a voice reporting system where people could call a toll-free number, and the product turned those reports into structured data for an interactive climate dashboard.",
    href: "https://github.com/bipulhf/oxfam-voice",
    linkLabel: "View the project",
  },
] as const;

export const CONTACT_LINKS = [
  { label: "✉ Email me", href: "mailto:bipulhf@gmail.com", tone: "yellow" },
  { label: "GitHub", href: "https://github.com/bipulhf", tone: "mint" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/bipulhf",
    tone: "sky",
  },
  { label: "Twitter", href: "https://twitter.com/bipulhf", tone: "peach" },
] as const;
