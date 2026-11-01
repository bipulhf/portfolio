export type StudioSectionId =
  | "about"
  | "projects"
  | "skills"
  | "achievements"
  | "blog"
  | "contact";

export type CameraPose = Readonly<{
  target: readonly [number, number, number];
  azimuth: number;
  elevation: number;
  zoom: number;
}>;

export type DioramaZone = Readonly<{
  id: StudioSectionId;
  code: string;
  title: string;
  landmark: string;
  tagline: string;
  position: readonly [number, number, number];
  pinHeight: number;
  camera: CameraPose;
}>;

// True 45-degree isometric diamond overview matching the diorama composition.
export const OVERVIEW_CAMERA: CameraPose = {
  target: [-0.15, 1.65, -0.15],
  azimuth: Math.PI / 4, // +X, +Z diagonal looking toward (-X, -Z) apex
  elevation: 0.56,
  zoom: 1.15,
};

export const DIORAMA_ZONES: ReadonlyArray<DioramaZone> = [
  {
    id: "about",
    code: "01",
    title: "About Me",
    landmark: "Basecamp Tent",
    tagline: "Software engineer in Dhaka crafting calm, dependable software.",
    position: [-0.35, 0, -0.45],
    pinHeight: 3.35,
    camera: {
      target: [-0.25, 1.25, -0.25],
      azimuth: 0.84,
      elevation: 0.48,
      zoom: 0.58,
    },
  },
  {
    id: "projects",
    code: "02",
    title: "Projects",
    landmark: "Showcase Easels",
    tagline: "Shipped products, full-stack systems, and engineering case studies.",
    position: [3.45, 0, 0.85],
    pinHeight: 2.75,
    camera: {
      target: [3.25, 1.1, 0.85],
      azimuth: 0.98,
      elevation: 0.46,
      zoom: 0.54,
    },
  },
  {
    id: "skills",
    code: "03",
    title: "Skills",
    landmark: "Trail Signpost",
    tagline: "TypeScript, React, TanStack, Node.js, Spring Boot, SQL & Docker.",
    position: [-3.75, 0, 0.75],
    pinHeight: 2.85,
    camera: {
      target: [-3.55, 1.15, 0.75],
      azimuth: 0.56,
      elevation: 0.47,
      zoom: 0.54,
    },
  },
  {
    id: "achievements",
    code: "04",
    title: "Wins",
    landmark: "Campfire & Trophy",
    tagline: "2x Hackathon Champion and 6 competitive builds under pressure.",
    position: [-1.15, 0, 3.25],
    pinHeight: 2.35,
    camera: {
      target: [-1.25, 0.85, 3.15],
      azimuth: 0.68,
      elevation: 0.48,
      zoom: 0.52,
    },
  },
  {
    id: "blog",
    code: "05",
    title: "Notes",
    landmark: "Field Journal",
    tagline: "Engineering notes, architecture lessons, and frontend craft.",
    position: [1.55, 0, 4.65],
    pinHeight: 2.05,
    camera: {
      target: [1.55, 0.75, 4.55],
      azimuth: 0.78,
      elevation: 0.5,
      zoom: 0.5,
    },
  },
  {
    id: "contact",
    code: "06",
    title: "Contact",
    landmark: "Trail Mailbox",
    tagline: "Open for thoughtful product engineering & collaborations.",
    position: [3.35, 0, 3.85],
    pinHeight: 2.35,
    camera: {
      target: [3.15, 0.9, 3.85],
      azimuth: 0.9,
      elevation: 0.48,
      zoom: 0.5,
    },
  },
];

export type TourStop = Readonly<{
  id: string;
  step: string;
  eyebrow: string;
  headline: string;
  description: string;
  narration: string;
  audioSrc: string;
  highlightSection: StudioSectionId | null;
  durationMs: number;
  narrationDurationMs: number;
  camera: CameraPose;
}>;

export const TOUR_STOPS: ReadonlyArray<TourStop> = [
  {
    id: "welcome",
    step: "01",
    eyebrow: "Welcome to Basecamp",
    headline: "Hi, I’m Bipul.",
    description:
      "Software engineer based in Dhaka, Bangladesh. Step into my miniature 3D camp for a quick guided tour of my work and story.",
    narration:
      "Hey there, welcome to my basecamp! I'm Bipul, a software engineer based in Dhaka, Bangladesh. Settle in by the fire for a quick guided tour of my story, my toolkit, and what I love building.",
    audioSrc: "/audio/tour/stop-01.mp3",
    highlightSection: "about",
    durationMs: 4400,
    narrationDurationMs: 14550,
    camera: {
      target: [-0.15, 1.62, -0.15],
      azimuth: 0.785,
      elevation: 0.55,
      zoom: 1.12,
    },
  },
  {
    id: "about-me",
    step: "02",
    eyebrow: "About & Engineering Stack",
    headline: "Built with clarity & care.",
    description:
      "Software Engineer at InfancyIT Ltd. and CS graduate from SUST — shipping end-to-end products with TypeScript, React, TanStack, Node.js, and Spring Boot.",
    narration:
      "I build full-stack web software at Infancy I.T., backed by a computer science degree from Shahjalal University of Science and Technology. Day to day, I ship products with TypeScript, React, TanStack, Node.js, and Spring Boot — always aiming for calm, dependable engineering.",
    audioSrc: "/audio/tour/stop-02.mp3",
    highlightSection: "skills",
    durationMs: 4700,
    narrationDurationMs: 20550,
    camera: {
      target: [-1.45, 1.15, 0.15],
      azimuth: 0.64,
      elevation: 0.47,
      zoom: 0.64,
    },
  },
  {
    id: "selected-work",
    step: "03",
    eyebrow: "Selected Projects",
    headline: "Ideas turned into working software.",
    description:
      "From crisp product interfaces to dependable backend APIs — explore case studies and live builds right from the camp easels.",
    narration:
      "Over by the camp easels, you'll find my favorite shipped builds — including System Visualizer for interactive distributed systems, Endpoint, a fast native desktop API client, and custom document tooling.",
    audioSrc: "/audio/tour/stop-03.mp3",
    highlightSection: "projects",
    durationMs: 4700,
    narrationDurationMs: 14650,
    camera: {
      target: [3.1, 1.1, 0.85],
      azimuth: 0.98,
      elevation: 0.46,
      zoom: 0.6,
    },
  },
  {
    id: "hackathon-wins",
    step: "04",
    eyebrow: "Hackathons & Milestones",
    headline: "Worth the all-nighters.",
    description:
      "2× Hackathon Champion (Leading University & Oxfam Climate Action), HackTheAI Runner-up, and 6 live competition builds.",
    narration:
      "Around the campfire sit memories from six live hackathons — highlighted by two championship trophies at Leading University and the Oxfam Climate Action Hackathon, plus a runner-up finish at Hack The AI.",
    audioSrc: "/audio/tour/stop-04.mp3",
    highlightSection: "achievements",
    durationMs: 4600,
    narrationDurationMs: 14100,
    camera: {
      target: [-1.25, 0.85, 3.15],
      azimuth: 0.68,
      elevation: 0.48,
      zoom: 0.58,
    },
  },
  {
    id: "notes-contact",
    step: "05",
    eyebrow: "Field Notes & Say Hello",
    headline: "Let’s build something together.",
    description:
      "Browse my field notes or reach out anytime. Up next: the full interactive single-page 3D camp is yours to explore!",
    narration:
      "And right up front are my engineering field notes and trail mailbox. The guided tour wraps up here — now the full 3D camp is yours to orbit, click around, or drop me a hello anytime!",
    audioSrc: "/audio/tour/stop-05.mp3",
    highlightSection: "contact",
    durationMs: 4400,
    narrationDurationMs: 11900,
    camera: {
      target: [2.35, 0.82, 4.2],
      azimuth: 0.86,
      elevation: 0.49,
      zoom: 0.58,
    },
  },
];
