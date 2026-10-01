import { createFileRoute } from "@tanstack/react-router";
import { loadSite, resolveDomain, siteJson, siteOptions } from "@/lib/site-api";

/** Public: branding/contact details for a customer website (no secrets). */
export const Route = createFileRoute("/api/public/site/brand")({
  server: {
    handlers: {
      OPTIONS: async () => siteOptions(),
      HEAD: async ({ request }) => {
        const site = await loadSite(resolveDomain(request, new URL(request.url).searchParams.get("domain")));
        return new Response(null, { status: site ? 200 : 404 });
      },
      GET: async ({ request }) => {
        try {
          const site = await loadSite(resolveDomain(request, new URL(request.url).searchParams.get("domain")));
          if (!site) return siteJson({ ok: false, error: "Website not configured" }, 404);
          const { is_active: _a, ...brand } = site;
          return siteJson({ ok: true, ...brand, brand, website: brand });
        } catch (e) {
          console.error("[site/brand]", e);
          return siteJson({ ok: false, error: "Could not load website" }, 500);
        }
      },
    },
  },
});
