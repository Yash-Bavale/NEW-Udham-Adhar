import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BASE_URL = "https://udyamadhar.everythinghappens.in";

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

function isExcluded(p: string): boolean {
  if (p === "/sitemap.xml") return true;
  if (p.includes("$") || p.includes("*")) return true;
  return EXCLUDED_PREFIXES.some((pre) => p === pre || p.startsWith(pre + "/") || p === pre);
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
          .filter((p) => !isExcluded(p));

        // 2. Pull enabled SEO pages from the DB and merge in.
        const seoPaths: string[] = [];
        try {
          const { data } = await supabaseAdmin
            .from("seo_pages")
            .select("slug")
            .eq("enabled", true);
          for (const row of data ?? []) {
            const slug = (row as { slug: string }).slug?.trim();
            if (!slug) continue;
            const path = slug.startsWith("/") ? slug : `/${slug}`;
            if (!isExcluded(path)) seoPaths.push(path);
          }
        } catch {
          // If DB is unreachable, still emit the static route list.
        }

        const paths = Array.from(new Set([...routePaths, ...seoPaths])).sort();

        const urls = paths.map((p) => {
          const priority = p === "/" ? "1.0" : p.length < 25 ? "0.8" : "0.6";
          const changefreq = p === "/" ? "weekly" : "monthly";
          return [
            "  <url>",
            `    <loc>${BASE_URL}${p}</loc>`,
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
