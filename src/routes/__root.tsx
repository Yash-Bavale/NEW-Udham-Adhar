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
      { title: "Udyam Aadhar | MSME Certificate Download" },
      {
        name: "description",
        content:
          "Cnsultancy for Udyam Registration, MSME certificate updates, downloads, Udyog Aadhaar migration and related registration assistance.",
      },
      { property: "og:title", content: "Udyam Aadhar | MSME Certificate Download" },
      {
        property: "og:description",
        content:
          "Cnsultancy for Udyam Registration, MSME certificate updates, downloads, Udyog Aadhaar migration and related registration assistance.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://udyamadhar.in/" },
      { property: "og:site_name", content: "Udyam Registration — Business Help Consultancy" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Udyam Aadhar | MSME Certificate Download" },
      { name: "twitter:description", content: "Cnsultancy for Udyam Registration, MSME certificate updates, downloads, Udyog Aadhaar migration and related registration assistance." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/6f8b6b1e-da32-4a33-8101-27b29a8f150e" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/6f8b6b1e-da32-4a33-8101-27b29a8f150e" },

    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preload", as: "image", href: certImg.url, fetchpriority: "high" },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    ],

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
        {/* Google tag (gtag.js) — GA4 + Google Ads share one dataLayer */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-62JC7PRPMM" />
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-62JC7PRPMM');
            gtag('config', 'AW-18336340451');
          `
        }} />

        <script dangerouslySetInnerHTML={{
          __html: `
            function gtag_report_conversion(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                  'send_to': 'AW-18336340451/1BGJCNDNmPEZEI6f2cs-',
                  'event_callback': callback
              });
              return false;
            }
          `
        }} />
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


  // GA4 is loaded eagerly via the standard gtag snippet in RootShell so that
  // page_view fires on first paint. No lazy loader here — the old idle loader
  // pushed `args` (array) instead of `arguments`, so GA4 never registered the
  // config command and Realtime stayed empty even though the tag "verified".



  return (
    <QueryClientProvider client={queryClient}>
      {bareLayout ? <Outlet /> : <SiteShell><Outlet /></SiteShell>}
      <Toaster />
    </QueryClientProvider>
  );
}
