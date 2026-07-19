import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dublin Hacx — October 3, 2026" },
      { name: "description", content: "Dublin's very first Dublin Hacx — bring any idea, build it into reality. October 3, 2026 at the SAP Office in San Ramon." },
      { name: "author", content: "Dublin Hacx" },
      { property: "og:title", content: "Dublin Hacx — October 3, 2026" },
      { property: "og:description", content: "Dublin's very first Dublin Hacx — bring any idea, build it into reality. October 3, 2026 at the SAP Office in San Ramon." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://dublinhacx.com" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Dublin Hacx — October 3, 2026" },
      { name: "twitter:description", content: "Dublin's very first Dublin Hacx — bring any idea, build it into reality. October 3, 2026 at the SAP Office in San Ramon." },
      { property: "og:image", content: "https://dublinhacx.com/og-image.png" },
      { name: "twitter:image", content: "https://dublinhacx.com/og-image.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
