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
import certImg from "@/assets/udyam-sample-certificate.png.asset.json";
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
      { name: "google-site-verification", content: "RtG2UFXWGV5kl4RjhU7eQd6T3tx_DraF1D0WCFYmDAY" },
      { title: "Udyam Registration | MSME Registration Assistance" },
      {
        name: "description",
        content:
          "Private consultancy for Udyam Registration, MSME certificate updates, downloads, Udyog Aadhaar migration, and related registration assistance.",
      },
      { property: "og:title", content: "Udyam Registration | MSME Registration Assistance" },
      {
        property: "og:description",
        content:
          "Consultancy assistance for Udyam Registration, certificate updates, downloads, migration and corrections.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://udyamadhar.in/" },
      { property: "og:site_name", content: "Udyam Registration — Business Help Consultancy" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Udyam Registration | MSME Registration Assistance" },
      { name: "twitter:description", content: "Expert assistance for Udyam Registration, MSME Certificate, certificate download, updates, migration, and business compliance services. PAN India support." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/c285be05-7fdf-48a5-9f94-2cb31d82485e" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/c285be05-7fdf-48a5-9f94-2cb31d82485e" },
      { name: "description", content: "Expert assistance for Udyam Registration, MSME Certificate, certificate download, updates, migration, and business compliance services. PAN India support." },
      { property: "og:description", content: "Expert assistance for Udyam Registration, MSME Certificate, certificate download, updates, migration, and business compliance services. PAN India support." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [
      // GA is loaded lazily on idle from RootComponent to keep the critical
      // path light (PageSpeed/Core Web Vitals).
    ],

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
      // Only react to real identity transitions — ignore TOKEN_REFRESHED and
      // INITIAL_SESSION, which fire on every mount / hourly refresh and would
      // thrash the router + query cache.
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      if (!seenInitial.current) {
        seenInitial.current = true;
      }
      router.invalidate();
      // Do NOT refetch on SIGNED_OUT — the cleared session would 401-storm
      // every protected query and blank the screen before the redirect lands.
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router, queryClient]);


  // Lazy-load Google Analytics on idle so it doesn't compete with the LCP.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("ga4-script")) return;
    const load = () => {
      if (document.getElementById("ga4-script")) return;
      const s = document.createElement("script");
      s.id = "ga4-script";
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=G-62JC7PRPMM";
      document.head.appendChild(s);
      const w = window as unknown as { dataLayer?: unknown[] };
      w.dataLayer = w.dataLayer || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function gtag(...args: any[]) { (w.dataLayer as unknown[]).push(args); }
      gtag("js", new Date());
      gtag("config", "G-62JC7PRPMM");
    };
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (typeof ric === "function") ric(load);
    else setTimeout(load, 1500);
  }, []);


  return (
    <QueryClientProvider client={queryClient}>
      {bareLayout ? <Outlet /> : <SiteShell><Outlet /></SiteShell>}
      <Toaster />
    </QueryClientProvider>
  );
}
