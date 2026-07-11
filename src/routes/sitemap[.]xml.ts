import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { BASE_URL } from "@/lib/brand";

// Path prefixes that must never appear in the sitemap.
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
  "/complaint",
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
  if (p.includes("$") || p.includes("*")) return true;
  return EXCLUDED_PREFIXES.some((pre) => p === pre || p.startsWith(pre + "/"));
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
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
          .filter((p) => !isExcluded(p));

        const buildDate = new Date().toISOString();

        type Entry = { path: string; lastmod: string };
        const entries = new Map<string, Entry>();
        for (const p of routePaths) entries.set(p, { path: p, lastmod: buildDate });

        // 2. Pull enabled SEO pages from the DB and merge in (with lastmod).
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data } = await supabaseAdmin
            .from("seo_pages")
            .select("slug, updated_at")
            .eq("enabled", true);
          for (const row of data ?? []) {
            const slug = (row as { slug: string }).slug?.trim().toLowerCase();
            if (!slug) continue;
            let path = slug.startsWith("/") ? slug : `/${slug}`;
            path = path.length > 1 ? path.replace(/\/$/, "") : path;
            if (isExcluded(path)) continue;
            const lastmod =
              (row as { updated_at?: string }).updated_at ?? buildDate;
            entries.set(path, { path, lastmod });
          }
        } catch {
          // If DB is unreachable, still emit the static route list.
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
            `    <loc>${BASE_URL}${e.path}</loc>`,
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
