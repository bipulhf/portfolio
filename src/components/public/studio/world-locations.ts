import type { WorkspaceDestination } from "./workspace-model";

export const WORLD_LOCATIONS: ReadonlyArray<{
  id: string;
  title: string;
  destination: WorkspaceDestination;
  position: readonly [number, number, number];
  description: string;
}> = [
  {
    id: "studio-intro",
    title: "The studio",
    destination: "projects",
    position: [0, 0, 1],
    description: "My desk. Where most things begin.",
  },
  {
    id: "projects",
    title: "Project gallery",
    destination: "projects",
    position: [-8, 0, -6],
    description: "Click a project window to look inside.",
  },
  {
    id: "about",
    title: "Curiosity garden",
    destination: "about",
    position: [7, 0, -5],
    description: "Meet the person behind the work.",
  },
  {
    id: "achievements",
    title: "The courtyard",
    destination: "achievements",
    position: [8, 0, 4],
    description: "Hackathons, teammates, and a few wins.",
  },
  {
    id: "blog",
    title: "Reading room",
    destination: "blog",
    position: [-7, 0, 5],
    description: "What I learn while building.",
  },
  {
    id: "contact",
    title: "The post office",
    destination: "contact",
    position: [0, 0, -12],
    description: "A new collaboration starts here.",
  },
];
