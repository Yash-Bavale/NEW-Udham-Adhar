import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { VARIANT_SLUGS } from "@/lib/seo/canonical-clusters";

// Path prefixes that must never appear in the sitemap.
// Intentional exclusions (not bugs — scanner may flag these as "missing"):
//   /admin-login, /llms.txt, /llms-full.txt — not indexable pages.
//   /$ (splat 404) — catch-all, not a real URL.
const EXCLUDED_PREFIXES = [
  "/api",
  "/admin",
  "/admin-login",
  "/seo-admin",
  "/onboarding",
  "/payment",
  "/payment-pending",
  "/payment-failed",
  "/processing",
  "/success",
  "/apply",
  "/email",
  "/lovable",
  "/mcp",
  "/.mcp",
  "/.well-known",
];


// Top-funnel high-priority paths (includes Batch 1 SEO landing pages).
const HIGH_PRIORITY = new Set<string>([
  "/",
  // Batch 1 SEO pages
  "/udyam-registration",
  "/udyam-registration-online",
  "/udyam-registration-process",
  "/udyam-registration-number",
  "/udyam-registration-status",
  "/udyam-registration-fee",
  "/udyam-registration-free",
  "/udyam-registration-benefits",
  "/udyam-registration-eligibility",
  "/udyam-registration-documents-required",
  "/udyam-registration-certificate",
  "/udyam-registration-update",
  "/udyam-certificate",
  "/udyam-login",
  "/forgot-udyam-registration-number",
  "/download-udyam-certificate",
  "/print-udyam-certificate",
  "/verify-udyam-certificate",
  "/msme-registration",
  "/msme-certificate-benefits",
  // Other top-funnel
  "/udyam-aadhar-registration",
  "/new-udyam-registration",
  "/update-udyam-certificate",
  "/migrate-udyog-aadhaar-to-udyam",
  "/msme-registration-fee",
]);


function isExcluded(p: string): boolean {
  if (p === "/sitemap.xml" || p === "/llms.txt" || p === "/llms-full.txt") return true;
  if (
    p.includes("$") ||
    p.includes("*") ||
    p.includes("[") ||
    p.includes("]") ||
    p.startsWith("/.") ||
    p.includes("mcp") ||
    p.includes("oauth")
  )
    return true;
  // Retired / non-indexable paths that should never appear in sitemap.
  if (
    p === "/home" ||
    p === "/index.html" ||
    p === "/unauthorized" ||
    p === "/not-found" ||
    p === "/404"
  ) return true;
  // Keyword-variant pages stay live but are dropped from the sitemap;
  // their canonical points at the cluster primary (see canonical-clusters.ts).
  const slug = p.replace(/^\/+/, "");
  if (VARIANT_SLUGS.has(slug)) return true;
  return EXCLUDED_PREFIXES.some((pre) => p === pre || p.startsWith(pre + "/"));
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Resolve the correct base URL for this domain so each website
        // (udyamadhar.in, udyamregistrations.in) gets its own sitemap URLs.
        const reqUrl = new URL(request.url);
        const SITE_BASE = `${reqUrl.protocol}//${reqUrl.host}`;

        const { resolveCurrentWebsite } = await import(
          "@/lib/websites/current-website.server"
        );
        const { isBlockedOnSecondarySite } = await import(
          "@/lib/websites/secondary-site-routes"
        );
        const currentSite = await resolveCurrentWebsite(request).catch(() => null);
        const publicOnly = currentSite ? !currentSite.allow_admin : false;
        const siteBlocked = (p: string) => publicOnly && isBlockedOnSecondarySite(p);
        // 1. Discover static routes from the generated route tree.
        const mod = await import("@/routeTree.gen");
        const tree = (mod as unknown as {
          routeTree: { children?: Record<string, { fullPath?: string }> };
        }).routeTree;
        const all: string[] = [];
        const walk = (node: { fullPath?: string; children?: Record<string, unknown> }) => {
          if (node.fullPath !== undefined) all.push(node.fullPath);
          const ch = node.children as
            | Record<string, { fullPath?: string; children?: Record<string, unknown> }>
            | undefined;
          if (ch) Object.values(ch).forEach(walk);
        };
        walk(tree as never);

        const routePaths = all
          .filter((p): p is string => typeof p === "string")
          .map((p) => (p.length > 1 ? p.replace(/\/$/, "") : p))
          .map((p) => p.toLowerCase())
          .filter((p) => !isExcluded(p) && !siteBlocked(p));

        // Stable lastmod for static routes. Bump this string only when the
        // route list or page content materially changes — do NOT use
        // `new Date()` here or Google sees every URL "updated today" on
        // every crawl, which suppresses re-indexing signals.
        const STATIC_LASTMOD = "2026-07-11";

        type Entry = { path: string; lastmod: string };
        const entries = new Map<string, Entry>();
        for (const p of routePaths) entries.set(p, { path: p, lastmod: STATIC_LASTMOD });

        // 2. Pull enabled SEO pages from the DB and merge in — these carry
        //    their own updated_at so lastmod reflects real edits.
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data } = await supabaseAdmin
            .from("seo_pages")
            .select("slug, updated_at")
            .eq("website_id", currentSite?.id ?? "")
            .eq("enabled", true);
          for (const row of data ?? []) {
            const slug = (row as { slug: string }).slug?.trim().toLowerCase();
            if (!slug) continue;
            let path = slug.startsWith("/") ? slug : `/${slug}`;
            path = path.length > 1 ? path.replace(/\/$/, "") : path;
            if (isExcluded(path) || siteBlocked(path)) continue;
            const raw = (row as { updated_at?: string }).updated_at;
            const lastmod = raw ? raw.slice(0, 10) : STATIC_LASTMOD;
            entries.set(path, { path, lastmod });
          }
        } catch {
          // If DB is unreachable, still emit the static route list.
        }

        // 3. Contentful is the source of truth for SEO pages: every published
        //    seoArticle for THIS site is added automatically. Entries whose
        //    canonical points at a different page (keyword variants) are
        //    skipped so the sitemap only lists canonical URLs.
        try {
          const { listContentfulSeoSlugs } = await import(
            "@/lib/contentful/client.functions"
          );
          const cfSlugs = await listContentfulSeoSlugs();
          for (const row of cfSlugs) {
            const path = `/${row.slug.replace(/^\/+/, "")}`;
            if (isExcluded(path) || siteBlocked(path)) continue;
            if (row.canonicalUrl) {
              const canonicalPath = row.canonicalUrl
                .replace(/^https?:\/\/[^/]+/, "")
                .replace(/\/$/, "")
                .toLowerCase();
              if (canonicalPath && canonicalPath !== path) continue;
            }
            entries.set(path, { path, lastmod: row.updatedAt || STATIC_LASTMOD });
          }
        } catch {
          // CMS unreachable — keep the static + DB entries.
        }



        const sorted = Array.from(entries.values()).sort((a, b) =>
          a.path.localeCompare(b.path),
        );


        const urls = sorted.map((e) => {
          const priority = HIGH_PRIORITY.has(e.path)
            ? "1.0"
            : e.path.length < 25
              ? "0.8"
              : "0.6";
          const changefreq = e.path === "/" ? "weekly" : "monthly";
          return [
            "  <url>",
            `    <loc>${SITE_BASE}${e.path}</loc>`,
            `    <lastmod>${e.lastmod}</lastmod>`,
            `    <changefreq>${changefreq}</changefreq>`,
            `    <priority>${priority}</priority>`,
            "  </url>",
          ].join("\n");
        });

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls,
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
