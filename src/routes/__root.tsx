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
import { getCurrentBrand } from "@/lib/websites/current-brand.functions";
import { BrandProvider } from "@/lib/websites/brand-context";
import { getSiteContent } from "@/lib/websites/site-content.functions";
import { SiteContentProvider } from "@/lib/websites/site-content-context";
import { isBlockedOnSecondarySite } from "@/lib/websites/secondary-site-routes";



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
  loader: async ({ location }) => {
    const [brand, siteContent] = await Promise.all([getCurrentBrand(), getSiteContent()]);
    // On secondary public-only sites the hardcoded SEO/legacy pages are gated
    // off. A slug published in that site's own Contentful space must still go
    // live, so resolve it here before falling back to 404.
    let cfArticle: any = null;
    if (brand?.allowAdmin === false) {
      const navPaths = [
        ...(siteContent?.headerNav ?? []),
        ...(siteContent?.footerNav ?? []),
      ].map((n: { path: string }) => n.path);
      const path = location.pathname;
      if (isBlockedOnSecondarySite(path, navPaths)) {
        const slug = path.replace(/^\/+/, "").replace(/\/+$/, "").toLowerCase();
        if (slug && !slug.includes("/")) {
          cfArticle = await getContentfulSeoArticle({ data: { slug } }).catch(() => null);
        }
      }
    }
    return { brand, siteContent, cfArticle };
  },

  head: ({ loaderData }) => {
    const brand = (loaderData as { brand?: Awaited<ReturnType<typeof getCurrentBrand>> } | undefined)?.brand;
    const verify = brand?.googleSiteVerification || "RtG2UFXWGV5kl4RjhU7eQd6T3tx_DraF1D0WCFYmDAY";
    const siteName = brand?.siteName || "Udyam Aadhar";
    const baseUrl = brand?.baseUrl || "https://udyamadhar.in";
    const title = `${siteName} | MSME Certificate Download`;
    const description = `Consultancy for ${siteName} / MSME registration, certificate updates, downloads, Udyog Aadhaar migration and related registration assistance.`;
    return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "google-site-verification", content: verify },
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${baseUrl}/` },
      { property: "og:site_name", content: siteName },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/x-icon", href: brand?.faviconAssetUrl || "/favicon.ico" },
      { rel: "preconnect", href: "https://www.googletagmanager.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://www.google-analytics.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
      { rel: "dns-prefetch", href: "https://www.google-analytics.com" },
    ],

    scripts: [
      // GA/Ads gtag is injected from RootComponent after first paint (idle
      // callback) to keep the critical path light for Core Web Vitals.
    ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* gtag (GA4 + Google Ads) is loaded from RootComponent after first
            paint via requestIdleCallback — see effect below. */}
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-62JC7PRPMM');
            gtag('config', 'AW-18336340451');
            function gtag_report_conversion(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') { window.location = url; }
              };
              gtag('event', 'conversion', {
                'send_to': 'AW-18336340451/tS7UCOaYs9McEOOzuadE',
                'event_callback': callback
              });
              return false;
            }
            window.gtag_report_conversion = gtag_report_conversion;
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
  const { brand, siteContent } = Route.useLoaderData();
  const router = useRouter();
  const path = useRouterState({ select: (s) => s.location.pathname });
  // Route id of the deepest match — "/$" means no hardcoded route claims this
  // path, so it's resolved dynamically (DB / Contentful) and must stay open
  // on secondary sites so they can publish their own SEO pages.
  const leafRouteId = useRouterState({
    select: (s: any) => String(s.matches[s.matches.length - 1]?.routeId ?? ""),
  }) as unknown as string;
  const isAdminPath = path.startsWith("/admin") || path === "/admin-login";
  const bareLayout = isAdminPath;
  // Secondary public-only domains (allow_admin = false) must not expose the
  // staff panel — serve the normal 404 there instead.
  const secondarySite = brand?.allowAdmin === false;
  const adminBlocked = isAdminPath && secondarySite;
  // Secondary sites carry none of the primary site's hardcoded SEO / legacy-WP
  // pages, but dynamic (catch-all) slugs and the site's own nav/service pages
  // stay allowed.
  const navPaths = [
    ...(siteContent?.headerNav ?? []),
    ...(siteContent?.footerNav ?? []),
  ].map((n) => n.path);
  const contentBlocked =
    secondarySite &&
    leafRouteId !== "/$" &&
    isBlockedOnSecondarySite(path, navPaths);
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


  // Load gtag.js after first paint via requestIdleCallback so it never
  // competes with LCP. dataLayer + config commands are already queued in
  // RootShell, so once the script hydrates it replays them in order.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.querySelector('script[data-gtag="1"]')) return;
    const load = () => {
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=G-62JC7PRPMM";
      s.setAttribute("data-gtag", "1");
      document.head.appendChild(s);
    };
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
    if (typeof ric === "function") ric(load, { timeout: 4000 });
    else setTimeout(load, 2500);
  }, []);





  return (
    <QueryClientProvider client={queryClient}>
      <BrandProvider value={brand}>
        <SiteContentProvider value={siteContent}>
          {adminBlocked ? (
            <NotFoundComponent />
          ) : contentBlocked ? (
            <SiteShell>
              <NotFoundComponent />
            </SiteShell>
          ) : bareLayout ? (
            <Outlet />
          ) : (
            <SiteShell>
              <Outlet />
            </SiteShell>
          )}
          <Toaster />
        </SiteContentProvider>
      </BrandProvider>
    </QueryClientProvider>
  );
}
