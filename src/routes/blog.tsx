import { createFileRoute } from "@tanstack/react-router";
import {
  CrayonGridPending,
  CrayonPendingPage,
} from "~/components/loaders/crayon-pending";
import { pageContainerClass } from "~/components/portfolio/lib/styles";
import { BlogGrid } from "~/components/public/blog-grid";
import { usePublicThemePageMeta } from "~/components/public/public-theme";
import { PageHero, PageHeroActions } from "~/components/public/page-hero";
import { SiteShell } from "~/components/public/site-shell";
import { listPublishedBlogsFn } from "~/lib/server-fns/content";
import { PUBLIC_LIST_CACHE_CONTROL } from "~/lib/http";
import { baseMeta } from "~/lib/seo";

export const Route = createFileRoute("/blog")({
  loader: async () => listPublishedBlogsFn(),
  pendingComponent: () => (
    <SiteShell>
      <CrayonPendingPage title="Loading blog">
        <CrayonGridPending cards={3} />
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
        "Writing on building products, frontend craft, and engineering process by Bipul.",
      pathname: "/blog",
      title: "Blog — Bipul",
    }),
  component: BlogPage,
});

function BlogPage() {
  const posts = Route.useLoaderData();
  usePublicThemePageMeta("blog");

  return (
    <SiteShell>
      <PageHero
        page="blog"
        actions={
          <PageHeroActions
            page="blog"
            primaryLabel="Home"
            primaryTo="/"
            secondaryLabel="Projects"
            secondaryTo="/projects"
          />
        }
      />
      <section className={`${pageContainerClass} py-10 md:py-12 lg:py-16`}>
        <BlogGrid items={posts} />
      </section>
    </SiteShell>
  );
}
