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

export const Route = createRootRoute({
  loader: async () => ({
    initialTheme: await getInitialPublicThemeFn(),
  }),
  head: () => ({
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
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Patrick+Hand&family=Nunito:wght@400;600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800&f[]=satoshi@400,500,700,900&display=swap",
      },
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
