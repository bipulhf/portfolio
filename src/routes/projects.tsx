import { createFileRoute } from "@tanstack/react-router";
import {
  CrayonGridPending,
  CrayonPendingPage,
} from "~/components/loaders/crayon-pending";
import { pageContainerClass } from "~/components/portfolio/lib/styles";
import { usePublicThemePageMeta } from "~/components/public/public-theme";
import { PageHero, PageHeroActions } from "~/components/public/page-hero";
import { ProjectGrid } from "~/components/public/project-grid";
import { SiteShell } from "~/components/public/site-shell";
import { listPublishedProjectsFn } from "~/lib/server-fns/content";
import { PUBLIC_LIST_CACHE_CONTROL } from "~/lib/http";
import { baseMeta } from "~/lib/seo";

export const Route = createFileRoute("/projects")({
  loader: async () => listPublishedProjectsFn(),
  pendingComponent: () => (
    <SiteShell>
      <CrayonPendingPage title="Loading projects">
        <CrayonGridPending />
      </CrayonPendingPage>
    </SiteShell>
  ),
  headers: () => ({
    "Cache-Control": PUBLIC_LIST_CACHE_CONTROL,
    Vary: "Cookie",
  }),
  head: () =>
    baseMeta({
      description:
        "Case studies, experiments, and shipped product work by Bipul.",
      pathname: "/projects",
      title: "Projects — Bipul",
    }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const projects = Route.useLoaderData();
  usePublicThemePageMeta("projects");

  return (
    <SiteShell>
      <PageHero
        page="projects"
        actions={
          <PageHeroActions
            page="projects"
            primaryLabel="Home"
            primaryTo="/"
            secondaryLabel="Notes"
            secondaryTo="/blog"
          />
        }
      />
      <section className={`${pageContainerClass} py-10 md:py-12 lg:py-16`}>
        <ProjectGrid items={projects} />
      </section>
    </SiteShell>
  );
}
