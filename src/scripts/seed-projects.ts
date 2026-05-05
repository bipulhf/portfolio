import "dotenv/config";

import { eq } from "drizzle-orm";
import { createProject, updateProject } from "~/lib/content/queries";
import { db } from "~/lib/db";
import { projects } from "~/lib/db/schema";
import {
  projectInputSchema,
  type ProjectInput,
} from "~/lib/validation/content";

function buildSection(
  title: string,
  paragraphs: string[] = [],
  items: string[] = [],
) {
  const paragraphHtml = paragraphs
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("\n");
  const listHtml = items.length
    ? `<ul>\n${items.map((item) => `  <li>${item}</li>`).join("\n")}\n</ul>`
    : "";

  return [`<h2>${title}</h2>`, paragraphHtml, listHtml]
    .filter(Boolean)
    .join("\n");
}

function buildProjectBody(sections: string[]) {
  return sections.join("\n\n");
}

const seedProjects: ProjectInput[] = [
  {
    title: "Bijoy to Unicode LaTeX",
    slug: "bijoy-to-unicode-latex",
    summary:
      "A TypeScript document-conversion tool that turns Bijoy Bangla MCQ .docx files into structured Unicode JSON with raw LaTeX equations while preserving document order and option layouts.",
    excerpt:
      "Converts Bijoy-encoded Bangla MCQ Word files into structured JSON with Unicode text and raw LaTeX equations.",
    status: "published",
    publishedAt: "2026-03-17T14:14:14.000Z",
    seoTitle: "Bijoy to Unicode LaTeX",
    seoDescription:
      "Parse Bijoy Bangla MCQ Word documents into structured Unicode JSON with embedded raw LaTeX equations.",
    bodyHtml: buildProjectBody([
      buildSection("Overview", [
        "This project solves a very specific but high-value workflow: taking Bangla MCQ documents written in Bijoy encoding and turning them into clean structured data that can be rendered on the web.",
        "It reads <code>.docx</code> files, converts Bijoy Bangla text to Unicode, walks OMML math nodes into raw LaTeX, and keeps question text and options aligned in the same order they appeared in the original document.",
      ]),
      buildSection(
        "Highlights",
        [],
        [
          "Converts Bijoy Bangla text to Unicode with reordering and normalization support.",
          "Transforms Word equations from OMML into raw LaTeX for KaTeX or MathJax pipelines.",
          "Handles common Bangladesh MCQ layouts including multi-column option tables.",
          "Ships both a browser-based upload UI and a CLI workflow for batch conversion.",
        ],
      ),
      buildSection("Why it matters", [
        "This reduces a painful manual content-preparation step for exam, LMS, and question-bank workflows where Bangla text and math formatting usually break during migration.",
        'Repository: <a href="https://github.com/bipulhf/bijoy-to-unicode-latex" target="_blank" rel="noreferrer">github.com/bipulhf/bijoy-to-unicode-latex</a>.',
      ]),
    ]),
    techStack: [
      "TypeScript",
      "Node.js",
      "DOCX parsing",
      "OMML",
      "LaTeX",
      "KaTeX",
      "Web UI",
    ],
    liveUrl: "",
    repoUrl: "https://github.com/bipulhf/bijoy-to-unicode-latex",
    featured: false,
    coverImagePath: "",
    ogImagePath: "",
    bodyJson: null,
  },
  {
    title: "Thryve",
    slug: "thryve-youtubers-toolkit",
    summary:
      "An AI-powered toolkit for YouTube creators that combines channel analysis, competitor research, idea generation, thumbnail workflows, reels creation, SEO help, and comment intelligence.",
    excerpt:
      "An AI platform for YouTube creators covering channel analysis, idea generation, thumbnails, reels, and creator workflows.",
    status: "published",
    publishedAt: "2025-10-02T18:06:25.000Z",
    seoTitle: "Thryve",
    seoDescription:
      "AI-powered YouTube creator toolkit for research, planning, thumbnails, reels, and growth workflows.",
    bodyHtml: buildProjectBody([
      buildSection("Overview", [
        "Thryve is a creator-ops platform aimed at making YouTube production more systematic, from research and planning to packaging and audience feedback.",
        "The product combines channel and competitor analysis with AI-generated ideas, voice workflows, thumbnails, reels, and comment insight features in one place.",
      ]),
      buildSection(
        "Highlights",
        [],
        [
          "Fetches channel content, transcripts, comments, and competitor signals for idea generation.",
          "Supports thumbnail generation, short-form reel creation, SEO suggestions, and CTR-oriented packaging.",
          "Includes subscription tiers, onboarding, dashboard workflows, and calendar-based planning.",
          "Blends web app tooling with a Python backend and external AI services for specialized tasks.",
        ],
      ),
      buildSection("Links", [
        'Live product: <a href="https://thryve-gold.vercel.app/" target="_blank" rel="noreferrer">thryve-gold.vercel.app</a>.',
        'Repository: <a href="https://github.com/Unayes09/Thryve-Youtubers-Toolkit-SmythOS-HackTheAI-2025" target="_blank" rel="noreferrer">github.com/Unayes09/Thryve-Youtubers-Toolkit-SmythOS-HackTheAI-2025</a>.',
      ]),
    ]),
    techStack: [
      "TypeScript",
      "Next.js",
      "Python",
      "Clerk",
      "Prisma",
      "Stripe",
      "Pinecone",
      "OpenAI",
      "SmythOS",
      "UploadThing",
    ],
    liveUrl: "https://thryve-gold.vercel.app/",
    repoUrl:
      "https://github.com/Unayes09/Thryve-Youtubers-Toolkit-SmythOS-HackTheAI-2025",
    featured: false,
    coverImagePath: "",
    ogImagePath: "",
    bodyJson: null,
  },
  {
    title: "System Visualizer",
    slug: "system-visualizer",
    summary:
      "An interactive distributed-systems learning platform that runs real Redis, BullMQ, RabbitMQ, Kafka, and PostgreSQL flows and visualizes them live through a TanStack Start frontend and Elysia backend.",
    excerpt:
      "A live distributed-systems visualizer with real infrastructure in the loop, built for learning and demos.",
    status: "published",
    publishedAt: "2026-03-29T14:53:10.000Z",
    seoTitle: "System Visualizer",
    seoDescription:
      "Interactive distributed-systems learning platform with real infra, live flow visualization, and scenario playback.",
    bodyHtml: buildProjectBody([
      buildSection("Overview", [
        "System Visualizer is a learning-focused product that makes backend infrastructure behavior visible instead of abstract.",
        "Rather than mocking traces, it runs scenarios through a real backend and streams live events so learners can watch how Redis, BullMQ, RabbitMQ, Kafka, and PostgreSQL interact during each step.",
      ]),
      buildSection(
        "Highlights",
        [],
        [
          "Visualizes scenario execution with animated flows, metrics, replay controls, and event logs.",
          "Uses a TanStack Start web app for the frontend and an Elysia service on Bun for orchestration.",
          "Ships with a production-ready container stack for the app and supporting infrastructure.",
          "Currently an active working project focused on educational quality and system clarity.",
        ],
      ),
      buildSection("Architecture", [
        "The repository is organized as a monorepo with separate web, server, and shared packages so the visualization layer and runtime simulation layer stay loosely coupled.",
        'Repository: <a href="https://github.com/bipulhf/system-visualizer" target="_blank" rel="noreferrer">github.com/bipulhf/system-visualizer</a>.',
      ]),
    ]),
    techStack: [
      "TanStack Start",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Elysia",
      "Bun",
      "Redis",
      "BullMQ",
      "RabbitMQ",
      "Kafka",
      "PostgreSQL",
      "WebSocket",
    ],
    liveUrl: "",
    repoUrl: "https://github.com/bipulhf/system-visualizer",
    featured: true,
    coverImagePath: "",
    ogImagePath: "",
    bodyJson: null,
  },
  {
    title: "ICERIE 2027",
    slug: "icerie-2027",
    summary:
      "A conference website and submission workflow for the 9th International Conference on Engineering Research, Innovation, and Education, presenting deadlines, tracks, notices, and author information for SUST.",
    excerpt:
      "Conference platform for ICERIE 2027 with deadlines, research tracks, registration paths, and author information.",
    status: "published",
    publishedAt: "2026-05-05T00:00:00.000Z",
    seoTitle: "ICERIE 2027",
    seoDescription:
      "Conference website for ICERIE 2027 at SUST, covering deadlines, tracks, submissions, and event information.",
    bodyHtml: buildProjectBody([
      buildSection("Overview", [
        "ICERIE 2027 is the public-facing conference site for the 9th International Conference on Engineering Research, Innovation, and Education at Shahjalal University of Science and Technology.",
        "The experience is structured around the core information attendees and authors need most: conference dates, track discovery, submission deadlines, publication workflow, and venue details.",
      ]),
      buildSection(
        "Highlights",
        [],
        [
          "Publishes important dates for abstract, full-paper, and camera-ready submissions.",
          "Organizes the conference across multiple engineering and research tracks.",
          "Supports author-facing navigation for registration, notices, submissions, and local information.",
          "Connects the conference brand, logistical information, and paper workflow into a single web presence.",
        ],
      ),
      buildSection("Links", [
        'Live site: <a href="https://icerie2027.sust.edu/" target="_blank" rel="noreferrer">icerie2027.sust.edu</a>.',
        "The GitHub repository was not publicly accessible during seeding, so this entry is based on the live conference site content.",
      ]),
    ]),
    techStack: [
      "Conference platform",
      "Submission workflow",
      "Responsive web design",
      "Content publishing",
      "Schedule and deadline management",
    ],
    liveUrl: "https://icerie2027.sust.edu/",
    repoUrl: "https://github.com/bipulhf/icerie2027",
    featured: false,
    coverImagePath: "",
    ogImagePath: "",
    bodyJson: null,
  },
  {
    title: "Endpt",
    slug: "endpt",
    summary:
      "A desktop API client built with Tauri, React, TypeScript, and Rust that delivers native networking, a polished request editor, and cross-platform packaging as a fast Postman alternative.",
    excerpt:
      "A Tauri-based desktop API client with native Rust networking and a focused developer experience.",
    status: "published",
    publishedAt: "2026-03-19T20:00:39.000Z",
    seoTitle: "Endpt",
    seoDescription:
      "Cross-platform desktop API client built with Tauri, React, TypeScript, and Rust.",
    bodyHtml: buildProjectBody([
      buildSection("Overview", [
        "Endpt is a native desktop API client designed as a lighter and faster alternative to browser-like tools such as Postman or Insomnia.",
        "Requests are executed through a Rust backend using <code>reqwest</code>, which avoids webview CORS limitations while keeping the React UI responsive and familiar.",
      ]),
      buildSection(
        "Highlights",
        [],
        [
          "Supports a full request editor with params, headers, auth, multiple body modes, and response inspection.",
          "Uses a workspace model with folders, tabs, import/export, and resizable panels.",
          "Packages the product with Tauri v2 for Linux, Windows, and macOS.",
          "Combines native networking performance with a modern React and Tailwind frontend.",
        ],
      ),
      buildSection("Links", [
        'Repository: <a href="https://github.com/bipulhf/endpt" target="_blank" rel="noreferrer">github.com/bipulhf/endpt</a>.',
      ]),
    ]),
    techStack: [
      "Tauri v2",
      "React 19",
      "TypeScript",
      "Rust",
      "reqwest",
      "Tailwind CSS",
      "Zustand",
    ],
    liveUrl: "",
    repoUrl: "https://github.com/bipulhf/endpt",
    featured: false,
    coverImagePath: "",
    ogImagePath: "",
    bodyJson: null,
  },
  {
    title: "Mehedi's Math Academy LMS",
    slug: "mehedi-math-lms",
    summary:
      "A multi-platform LMS monorepo for Mehedi Math Academy that brings together a TanStack Start web app, Hono API, shared packages, and a React Native mobile app.",
    excerpt:
      "A full-stack LMS monorepo spanning web, API, shared packages, and a React Native mobile app.",
    status: "published",
    publishedAt: "2026-03-26T12:34:15.000Z",
    seoTitle: "Mehedi's Math Academy LMS",
    seoDescription:
      "Multi-platform LMS monorepo with TanStack Start, Hono, Drizzle ORM, Bun, and React Native.",
    bodyHtml: buildProjectBody([
      buildSection("Overview", [
        "This project is a full-stack learning platform for mehedismathacademy.com, organized as a Bun and Turborepo monorepo.",
        "It spans the full product surface: the web app, API, mobile app, shared packages, database layer, and internal tooling required to run an education business across platforms.",
      ]),
      buildSection(
        "Highlights",
        [],
        [
          "Includes course publishing, structured learning content, enrollments, payments, messaging, notices, analytics, and admin operations.",
          "Uses TanStack Start for the web experience, Hono for the API, and Expo for the mobile app.",
          "Keeps validators, auth, config, and database concerns shared through workspace packages.",
          "Currently an active working project with both product and platform scope.",
        ],
      ),
      buildSection("Links", [
        'Repository: <a href="https://github.com/bipulhf/mehedi_math_lms" target="_blank" rel="noreferrer">github.com/bipulhf/mehedi_math_lms</a>.',
        'Product domain: <a href="https://mehedismathacademy.com" target="_blank" rel="noreferrer">mehedismathacademy.com</a>.',
      ]),
    ]),
    techStack: [
      "Bun",
      "Turborepo",
      "TanStack Start",
      "Hono",
      "Drizzle ORM",
      "PostgreSQL",
      "Redis",
      "BullMQ",
      "React Native",
      "Expo",
    ],
    liveUrl: "https://mehedismathacademy.com",
    repoUrl: "https://github.com/bipulhf/mehedi_math_lms",
    featured: false,
    coverImagePath: "",
    ogImagePath: "",
    bodyJson: null,
  },
];

async function upsertProject(input: ProjectInput) {
  const parsed = projectInputSchema.parse(input);
  const slug = parsed.slug ?? parsed.title;

  const [existing] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);

  if (existing) {
    const project = await updateProject(existing.id, parsed);
    return { action: "updated", project };
  }

  const project = await createProject(parsed);
  return { action: "created", project };
}

async function main() {
  const isDryRun = process.argv.includes("--dry-run");

  if (isDryRun) {
    for (const input of seedProjects) {
      const parsed = projectInputSchema.parse(input);
      console.log(`${parsed.slug ?? parsed.title}: ${parsed.title}`);
    }
    return;
  }

  for (const input of seedProjects) {
    const result = await upsertProject(input);
    console.log(`${result.action}: ${result.project?.slug ?? input.slug}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
