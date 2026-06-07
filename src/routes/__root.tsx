import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteShell } from "../components/site/SiteShell";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";

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

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Udyam Aadhar Registration" },
      {
        name: "description",
        content:
          "Private consultancy for Udyam Registration, MSME certificate updates, downloads, Udyog Aadhaar migration, and related registration assistance.",
      },
      { property: "og:title", content: "Udyam Aadhar Registration" },
      {
        property: "og:description",
        content:
          "Consultancy assistance for Udyam Registration, certificate updates, downloads, migration and corrections.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://udyamadhar.everythinghappens.in/" },
      { property: "og:site_name", content: "Udyam Registration — Business Help Consultancy" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Udyam Aadhar Registration" },
      { name: "twitter:description", content: "Udyam Aadhar Registration, Udyam Aadhar Update, Download Udyam Aadhar, New Udyam Registration" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/c285be05-7fdf-48a5-9f94-2cb31d82485e" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/c285be05-7fdf-48a5-9f94-2cb31d82485e" },
      { name: "description", content: "Udyam Aadhar Registration, Udyam Aadhar Update, Download Udyam Aadhar, New Udyam Registration" },
      { property: "og:description", content: "Udyam Aadhar Registration, Udyam Aadhar Update, Download Udyam Aadhar, New Udyam Registration" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
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
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const bareLayout = path.startsWith("/admin") || path === "/admin-login";
  const seenInitial = useRef(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      // Skip the initial restored-session event to avoid a redundant invalidate.
      if (!seenInitial.current) {
        seenInitial.current = true;
        if (event === "INITIAL_SESSION") return;
      }
      router.invalidate();
      queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {bareLayout ? <Outlet /> : <SiteShell><Outlet /></SiteShell>}
      <Toaster />
    </QueryClientProvider>
  );
}
