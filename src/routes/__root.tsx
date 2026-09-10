/// <reference types="vite/client" />
import type { ReactNode } from "react";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import appCss from "~/styles/app.css?url";
import { AppProviders } from "~/components/app/app-providers";
import { DefaultCatchBoundary } from "~/components/errors/default-catch-boundary";
import { NotFound } from "~/components/errors/not-found";
import {
  PUBLIC_THEME_BOOTSTRAP_SCRIPT,
} from "~/components/public/public-theme";
import { getInitialPublicThemeFn } from "~/lib/server-fns/public-theme";
import {
  DEFAULT_PUBLIC_THEME,
  PUBLIC_THEME_FONT_STYLESHEETS,
  type PublicTheme,
} from "~/lib/public-theme";

// Only the rendered theme's families are worth blocking the first paint for.
// Preconnects cover both hosts so a theme switch does not pay for a cold
// connection.
function fontLinksFor(theme: PublicTheme) {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous" as const,
    },
    { rel: "preconnect", href: "https://api.fontshare.com" },
    {
      rel: "preconnect",
      href: "https://cdn.fontshare.com",
      crossOrigin: "anonymous" as const,
    },
    { rel: "stylesheet", href: PUBLIC_THEME_FONT_STYLESHEETS[theme] },
  ];
}

export const Route = createRootRoute({
  loader: async () => ({
    initialTheme: await getInitialPublicThemeFn(),
  }),
  head: ({ loaderData }) => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Bipul — Portfolio",
      },
      {
        name: "description",
        content:
          "A crayon-styled portfolio for Bipul built with TanStack Start.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "shortcut icon", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      ...fontLinksFor(loaderData?.initialTheme ?? DEFAULT_PUBLIC_THEME),
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  component: RootApp,
  shellComponent: RootDocument,
});

function RootApp() {
  const { initialTheme } = Route.useLoaderData();

  return (
    <AppProviders initialTheme={initialTheme}>
      <Outlet />
    </AppProviders>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { initialTheme } = Route.useLoaderData();

  return (
    <html data-public-theme={initialTheme} lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: PUBLIC_THEME_BOOTSTRAP_SCRIPT }}
        />
        <HeadContent />
      </head>
      <body>
        {children}
        {import.meta.env.DEV ? (
          <TanStackRouterDevtools position="bottom-right" />
        ) : null}
        <Analytics />
        <SpeedInsights />
        <Scripts />
      </body>
    </html>
  );
}
