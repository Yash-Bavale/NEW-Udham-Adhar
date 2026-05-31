import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { FileRoutesByTo } from "@/routeTree.gen";

const BASE_URL = "https://udyamadhar.everythinghappens.in";

function getStaticPaths(): string[] {
  // Extract every static (non-param) route from the generated route tree.
  const keys = Object.keys({} as FileRoutesByTo);
  // The generic above gives us no runtime values — fall back to a typed marker
  // approach by deriving keys from the tree object at runtime.
  return keys;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // Pull live routes from generated tree at runtime.
        const mod = await import("@/routeTree.gen");
        const tree = (mod as unknown as { routeTree: { children?: Record<string, { fullPath?: string }> } }).routeTree;
        const all: string[] = [];
        const walk = (node: { fullPath?: string; children?: Record<string, unknown> }) => {
          if (node.fullPath !== undefined) all.push(node.fullPath);
          const ch = node.children as Record<string, { fullPath?: string; children?: Record<string, unknown> }> | undefined;
          if (ch) Object.values(ch).forEach(walk);
        };
        walk(tree as never);

        const paths = Array.from(
          new Set(
            all
              .filter((p) => typeof p === "string")
              .filter((p) => !p.includes("$"))
              .filter((p) => !p.startsWith("/api"))
              .filter((p) => p !== "/sitemap.xml")
              .map((p) => (p.length > 1 ? p.replace(/\/$/, "") : p)),
          ),
        ).sort();

        // Use ignored static helper to suppress unused warning.
        void getStaticPaths;

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
