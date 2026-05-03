// Main Portfolio App — Crayon Style

const { useState, useEffect, useRef } = React;
const D = window.Doodles;

// ===== Palettes =====
const PALETTES = {
  sunny: {
    name: "Sunny Meadow",
    paper: "#fdf9ec", paperShadow: "#f3eddb", ink: "#3d3a2e", inkSoft: "#6b6750",
    yellow: "#ffe57a", mint: "#b8e6c8", peach: "#ffc7a8", sky: "#b9dcf2",
    pink: "#f7c1c9", lilac: "#d8c8ec",
  },
  sherbet: {
    name: "Soft Sherbet",
    paper: "#fdf4f1", paperShadow: "#f5e3dc", ink: "#3d2e3a", inkSoft: "#6b5060",
    yellow: "#fdd9b5", mint: "#fbc7d4", peach: "#f5a6b3", sky: "#d8c8ec",
    pink: "#f7a3b8", lilac: "#e6c4e0",
  },
  skysea: {
    name: "Sky & Sea",
    paper: "#f4faf9", paperShadow: "#dceeec", ink: "#2e3d3a", inkSoft: "#506b67",
    yellow: "#fde98a", mint: "#aee4d6", peach: "#ffc8b8", sky: "#a9d4ec",
    pink: "#f4c5cf", lilac: "#c8d4ec",
  },
  storybook: {
    name: "Storybook",
    paper: "#f9f5ea", paperShadow: "#ece4cd", ink: "#3a3528", inkSoft: "#6a6248",
    yellow: "#f5dc8e", mint: "#c4d8a8", peach: "#ecb89a", sky: "#bcd2dc",
    pink: "#e8b4b8", lilac: "#cabfdb",
  },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "skysea"
}/*EDITMODE-END*/;

// ===== Reveal on scroll =====
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ===== Background floating doodles (page-level scatter) =====
function BackgroundDoodles() {
  const items = [
    { Comp: D.Star, x: '6%', y: '14%', size: 28, color: '#ffd84a', r: -8, dur: 7 },
    { Comp: D.Squiggle, x: '92%', y: '10%', size: 36, color: '#7fb8a0', r: 10, dur: 8 },
    { Comp: D.Heart, x: '4%', y: '38%', size: 24, color: '#f7a3a8', r: 6, dur: 9 },
    { Comp: D.Spiral, x: '95%', y: '32%', size: 36, color: '#7eb1d6', r: -6, dur: 10 },
    { Comp: D.Star, x: '88%', y: '54%', size: 22, color: '#ffd84a', r: 12, dur: 7 },
    { Comp: D.Triangle, x: '8%', y: '60%', size: 26, color: '#b8e6c8', r: -4, dur: 8 },
    { Comp: D.Squiggle, x: '6%', y: '82%', size: 30, color: '#ffc7a8', r: 8, dur: 9 },
    { Comp: D.Heart, x: '93%', y: '78%', size: 22, color: '#f7c1c9', r: -10, dur: 7 },
    { Comp: D.Dot, x: '50%', y: '7%', size: 8, color: '#3d3a2e', r: 0, dur: 6 },
    { Comp: D.Star, x: '48%', y: '92%', size: 18, color: '#b9dcf2', r: 0, dur: 8 },
  ];
  return (
    <div className="bg-doodles" aria-hidden="true">
      {items.map((it, i) => (
        <div key={i}
          className="float-doodle"
          style={{
            left: it.x, top: it.y,
            ['--r']: `${it.r}deg`,
            animationDuration: `${it.dur}s`,
            animationDelay: `${-i * 0.7}s`,
          }}>
          <it.Comp size={it.size} color={it.color} />
        </div>
      ))}
    </div>
  );
}

// ===== Nav =====
function Nav() {
  const links = [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ];
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#top" className="nav-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className="dot" />
          <span>Bipul</span>
        </a>
        <div className="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
              <span className="underline">
                <D.ScribbleUnder color="var(--ink)" strokeWidth={3} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ===== Hero =====
function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-backdrop" aria-hidden="true">
        <D.HeroBackdrop />
      </div>
      <div className="hero-inner container">
        <div className="hero-text">
          <div className="hero-greet">
            <span className="hero-wave">👋</span>
            <span>hello, I'm</span>
          </div>
          <h1 className="hero-name">
            <span className="name-word">Shahiduzzaman</span>{' '}
            <span className="name-word">
              Bipul.
              <span className="scribble-under">
                <D.HeroScribble color="var(--peach)" />
              </span>
            </span>
          </h1>
          <div className="hero-role">
            A <span className="role-pill">software engineer</span> crafting calm, considered software — one careful detail at a time.
          </div>
          <p className="hero-blurb">
            Currently at <strong>InfancyIT Ltd.</strong> &middot; Computer Science, <strong>Shahjalal University of Science and Technology</strong>.
          </p>
          <div className="hero-cta">
            <a href="#projects" className="btn">View my work →</a>
            <a href="#contact" className="btn ghost">Get in touch</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== Section Header =====
function SectionHeader({ kicker, title, underlineColor = "var(--peach)" }) {
  return (
    <>
      <div className="section-kicker reveal">{kicker}</div>
      <h2 className="section-title reveal">
        {title}
        <span className="scribble-under">
          <D.ScribbleUnder color={underlineColor} strokeWidth={5} />
        </span>
      </h2>
    </>
  );
}

// ===== About =====
function About() {
  return (
    <section id="about" className="container">
      <SectionHeader kicker="01 — about" title="A little about me" underlineColor="var(--peach)" />

      <div className="about" style={{ marginTop: 48 }}>
        <div className="about-card reveal">
          <div className="pin" />
          <p>
            I'm a software engineer at <strong>InfancyIT Ltd.</strong>, where
            I focus on building products that feel calm, considered, and
            genuinely useful.
          </p>
          <p>
            I graduated in Computer Science from <strong>Shahjalal University
            of Science and Technology</strong>, and have spent the years since
            shipping products, contributing to teams, and quietly racking up
            hackathon wins on the weekends.
          </p>
          <p>
            I care about the small details — the readable code, the gentle
            interaction, the right word in the right place.
          </p>
        </div>

        <div className="about-stats reveal">
          <div className="stat">
            <div className="num">10+</div>
            <div className="label">hackathons won</div>
          </div>
          <div className="stat">
            <div className="num">4+</div>
            <div className="label">years coding</div>
          </div>
          <div className="stat">
            <div className="num">20+</div>
            <div className="label">projects shipped</div>
          </div>
          <div className="stat">
            <div className="num">∞</div>
            <div className="label">cups of chai</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== Experience =====
function Experience() {
  const jobs = [
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
  ];

  return (
    <section id="experience" className="container">
      <SectionHeader kicker="02 — experience" title="Where I've worked" underlineColor="var(--mint)" />
      <div className="timeline reveal" style={{ marginTop: 56 }}>
        {jobs.map((j, i) => (
          <div key={i} className="timeline-item">
            <div className="timeline-card">
              <div className="timeline-meta">
                <div className="timeline-role">{j.role}</div>
                <div className="timeline-when">{j.when}</div>
              </div>
              <div className="timeline-place">{j.place}</div>
              <ul>{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ===== Education =====
function Education() {
  return (
    <section id="education" className="container">
      <SectionHeader kicker="03 — education" title="Where I studied" underlineColor="var(--sky)" />
      <div className="timeline reveal" style={{ marginTop: 56 }}>
        <div className="timeline-item">
          <div className="timeline-card">
            <div className="timeline-meta">
              <div className="timeline-role">B.Sc. in Computer Science</div>
              <div className="timeline-when">SUST</div>
            </div>
            <div className="timeline-place">Shahjalal University of Science and Technology</div>
            <ul>
              <li>Specialized coursework in algorithms, systems, and software engineering</li>
              <li>Active in programming contests and university tech clubs</li>
              <li>Final year project — placeholder for your thesis or capstone</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== Skills =====
function Skills() {
  const cats = [
    { title: 'Languages', tags: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'] },
    { title: 'Frontend', tags: ['React', 'Next.js', 'Tailwind', 'HTML/CSS', 'Redux'] },
    { title: 'Backend', tags: ['Node.js', 'Express', 'Django', 'PostgreSQL', 'MongoDB'] },
    { title: 'Tools', tags: ['Git', 'Docker', 'AWS', 'Figma', 'Linux'] },
  ];
  return (
    <section id="skills" className="container">
      <SectionHeader kicker="04 — toolkit" title="Things I use" underlineColor="var(--yellow)" />
      <div className="skills-grid reveal" style={{ marginTop: 56 }}>
        {cats.map((c, i) => (
          <div key={i} className="skill-cat">
            <h3>{c.title}</h3>
            <div className="skill-tags">
              {c.tags.map((t, k) => <span key={k} className="skill-tag">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ===== Projects =====
function ProjectCover({ index }) {
  // Simple crayon-doodle covers per project
  const covers = [
    <D.Sun size={90} />,
    <D.Flower size={90} />,
    <D.Cloud size={120} />,
    <D.Star size={90} color="#fff" />,
    <D.Heart size={80} color="#fff" />,
    <D.Spiral size={80} color="#3d3a2e" />,
  ];
  return covers[index % covers.length];
}

function Projects() {
  const projects = [
    { title: 'Project Aurora', desc: 'A real-time collaboration tool for distributed teams. Placeholder description.', tags: ['React', 'Node', 'WebSocket'], link: '#' },
    { title: 'Bloom Tracker', desc: 'A habit and mood tracker with playful gamification. Placeholder description.', tags: ['Next.js', 'Postgres'], link: '#' },
    { title: 'CrayonAPI', desc: 'A lightweight design tokens API for crayon-styled apps. Placeholder description.', tags: ['TypeScript', 'Express'], link: '#' },
    { title: 'Hackathon Kit', desc: 'A bootstrap kit my team uses to ship hackathon projects in 24 hours.', tags: ['Vite', 'React'], link: '#' },
    { title: 'StudyBuddy', desc: 'A pomodoro + note app for university friends. Placeholder description.', tags: ['Flutter'], link: '#' },
    { title: 'Sketch CMS', desc: 'A handwriting-friendly CMS for journaling sites. Placeholder description.', tags: ['Django', 'React'], link: '#' },
  ];
  return (
    <section id="projects" className="container">
      <SectionHeader kicker="05 — selected work" title="Things I've built" underlineColor="var(--peach)" />
      <div className="projects-grid reveal" style={{ marginTop: 56 }}>
        {projects.map((p, i) => (
          <div key={i} className="project">
            <div className="project-cover">
              <ProjectCover index={i} />
            </div>
            <div className="project-body">
              <h3>{p.title}</h3>
              <p className="project-desc">{p.desc}</p>
              <div className="project-tags">
                {p.tags.map((t, k) => <span key={k}>{t}</span>)}
              </div>
              <a href={p.link} className="project-link">View case study →</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ===== Achievements =====
function Achievements() {
  const items = [
    { title: 'Winner — National Hackathon', meta: 'placeholder · 2024', icon: '1st' },
    { title: 'Runner-up — Regional CodeFest', meta: 'placeholder · 2023', icon: '2nd' },
    { title: 'Best UI Award — University Hack', meta: 'SUST · 2023', icon: 'UI' },
    { title: 'Top 10 — Online AI Challenge', meta: 'placeholder · 2023', icon: 'AI' },
    { title: 'Winner — InterUni Code Sprint', meta: 'placeholder · 2022', icon: 'CS' },
    { title: 'Speaker — University Tech Talk', meta: 'SUST · 2022', icon: '🎤' },
  ];
  return (
    <section id="achievements" className="container">
      <SectionHeader kicker="06 — wins" title="A few proud moments" underlineColor="var(--mint)" />
      <div className="achievements-grid reveal" style={{ marginTop: 56 }}>
        {items.map((it, i) => (
          <div key={i} className="medal">
            <div className="medal-icon">{it.icon}</div>
            <div>
              <h3>{it.title}</h3>
              <div className="medal-meta">{it.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ===== Blog =====
function BlogCover({ i }) {
  const covers = [
    <D.Sun size={70} />,
    <D.Flower size={70} />,
    <D.Cloud size={90} />,
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {covers[i % covers.length]}
    </div>
  );
}
function Blog() {
  const posts = [
    { date: 'Mar 12, 2026', title: 'How I Approach Hackathons (and actually finish)', excerpt: 'A friendly guide to scoping, shipping, and not burning out at 3am.' },
    { date: 'Feb 04, 2026', title: 'Notes on Building Tiny Tools at Work', excerpt: 'Small internal tools changed our team. Here\'s how I think about them.' },
    { date: 'Jan 18, 2026', title: 'From SUST to Software: A Friendly Roadmap', excerpt: 'What I\'d tell my first-year self about university, code, and craft.' },
  ];
  return (
    <section id="blog" className="container">
      <SectionHeader kicker="07 — words" title="From the blog" underlineColor="var(--sky)" />
      <div className="blog-grid reveal" style={{ marginTop: 56 }}>
        {posts.map((p, i) => (
          <a key={i} href="#" className="blog-card">
            <div className="blog-cover"><BlogCover i={i} /></div>
            <div className="blog-body">
              <div className="blog-date">{p.date}</div>
              <h3>{p.title}</h3>
              <p className="excerpt">{p.excerpt}</p>
              <span className="blog-readmore">Read on →</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ===== Contact =====
function Contact() {
  return (
    <section id="contact" className="container contact">
      <SectionHeader kicker="08 — say hi" title="Let's make something" underlineColor="var(--peach)" />
      <div className="contact-card reveal" style={{ marginTop: 56 }}>
        <div className="corner-doodle tl"><D.CornerBurst /></div>
        <div className="corner-doodle tr"><D.CornerBurst color="#b8e6c8" /></div>
        <div className="corner-doodle bl"><D.CornerBurst color="#ffc7a8" /></div>
        <div className="corner-doodle br"><D.CornerBurst color="#b9dcf2" /></div>

        <h2>Drop me a line</h2>
        <p className="contact-blurb">
          I'm always happy to talk about engineering, design, or a good
          collaboration. The inbox is open.
        </p>
        <div className="contact-links">
          <a href="mailto:hello@example.com" className="btn">✉ Email me</a>
          <a href="#" className="btn mint">GitHub</a>
          <a href="#" className="btn sky">LinkedIn</a>
          <a href="#" className="btn peach">Twitter</a>
        </div>
      </div>
    </section>
  );
}

// ===== Footer =====
function Footer() {
  return (
    <footer className="footer">
      Made with <span className="heart">♥</span> and a box of crayons — © 2026 Shahiduzzaman Bipul
    </footer>
  );
}

// ===== Apply palette =====
function applyPalette(key) {
  const p = PALETTES[key] || PALETTES.sunny;
  const root = document.documentElement;
  root.style.setProperty('--paper', p.paper);
  root.style.setProperty('--paper-shadow', p.paperShadow);
  root.style.setProperty('--ink', p.ink);
  root.style.setProperty('--ink-soft', p.inkSoft);
  root.style.setProperty('--yellow', p.yellow);
  root.style.setProperty('--mint', p.mint);
  root.style.setProperty('--peach', p.peach);
  root.style.setProperty('--sky', p.sky);
  root.style.setProperty('--pink', p.pink);
  root.style.setProperty('--lilac', p.lilac);
}

// ===== App =====
function App() {
  const [tweaks, setTweak] = window.useTweaks
    ? window.useTweaks(TWEAK_DEFAULTS)
    : [TWEAK_DEFAULTS, () => {}];

  useReveal();

  useEffect(() => {
    applyPalette(tweaks.palette);
  }, [tweaks.palette]);

  return (
    <div className="app">
      <BackgroundDoodles />
      <Nav />
      <Hero />
      <About />
      <Experience />
      <Education />
      <Skills />
      <Projects />
      <Achievements />
      <Blog />
      <Contact />
      <Footer />

      {window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection title="Palette">
            <window.TweakSelect
              label="Color set"
              value={tweaks.palette}
              onChange={(v) => setTweak('palette', v)}
              options={Object.entries(PALETTES).map(([k, v]) => ({ value: k, label: v.name }))}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              {Object.entries(PALETTES).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setTweak('palette', k)}
                  title={v.name}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    border: tweaks.palette === k ? '2.5px solid #3d3a2e' : '1.5px solid #3d3a2e80',
                    cursor: 'pointer',
                    background: `linear-gradient(135deg, ${v.yellow} 0%, ${v.peach} 50%, ${v.sky} 100%)`,
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </window.TweakSection>
        </window.TweaksPanel>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
