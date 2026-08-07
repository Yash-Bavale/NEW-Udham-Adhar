import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isPathSensitive } from "@/lib/seo-pages.functions";

export type SitemapWebsite = {
  id: string;
  name: string;
  domain: string;
  is_primary: boolean;
  sitemapUrl: string;
};

export type SitemapManagerItem = {
  slug: string;
  label: string;
  source: "Contentful CMS" | "Database SEO Page" | "Static Route";
  lastmod: string;
  included: boolean;
  hasOverride: boolean;
};

export type SitemapCheckResult = {
  sitemapUrl: string;
  status: number;
  ok: boolean;
  parsed: boolean;
  urlCount: number;
  missing: string[];
  unexpected: string[];
  wrongHost: string[];
  error?: string;
};

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["admin", "super_admin"])
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

function normPath(slug: string) {
  let p = slug.trim().toLowerCase();
  if (!p.startsWith("/")) p = `/${p}`;
  if (p.length > 1) p = p.replace(/\/$/, "");
  return p;
}

function titleize(slug: string) {
  return slug
    .replace(/^\//, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

/** Websites available in the sitemap manager. */
export const listSitemapWebsites = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SitemapWebsite[]> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("websites")
      .select("id, name, domain, is_primary")
      .order("is_primary", { ascending: false })
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map((w) => ({
      id: w.id as string,
      name: (w.name as string) || (w.domain as string),
      domain: w.domain as string,
      is_primary: !!w.is_primary,
      sitemapUrl: `https://${(w.domain as string).replace(/^https?:\/\//, "")}/sitemap.xml`,
    }));
  });

const CORE_PAGES: Array<{ slug: string; label: string }> = [
  { slug: "/", label: "Homepage" },
  { slug: "/about-us", label: "About Us" },
  { slug: "/contact-us", label: "Contact Us" },
  { slug: "/terms-conditions", label: "Terms & Conditions" },
  { slug: "/privacy-policy", label: "Privacy Policy" },
  { slug: "/refund-cancellation-policy", label: "Refund & Cancellation Policy" },
];

/** Every page discoverable for a website, with its sitemap inclusion state. */
export const getSitemapManagerData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ websiteId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }): Promise<SitemapManagerItem[]> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { listContentfulPageSlugsForWebsite } = await import(
      "@/lib/sitemap/sitemap.server"
    );

    const overrides = new Map<string, boolean>();
    {
      const { data: ov } = await supabaseAdmin
        .from("sitemap_overrides")
        .select("slug, included")
        .eq("website_id", data.websiteId);
      for (const row of (ov ?? []) as Array<{ slug: string; included: boolean }>) {
        overrides.set(normPath(row.slug), row.included);
      }
    }

    const items = new Map<string, SitemapManagerItem>();
    const put = (
      slug: string,
      label: string,
      source: SitemapManagerItem["source"],
      lastmod: string,
    ) => {
      const path = normPath(slug);
      if (isPathSensitive(path)) return;
      const override = overrides.get(path);
      items.set(path, {
        slug: path,
        label,
        source,
        lastmod,
        included: override ?? true,
        hasOverride: override !== undefined,
      });
    };

    for (const c of CORE_PAGES) put(c.slug, c.label, "Static Route", "");

    const { data: dbPages } = await supabaseAdmin
      .from("seo_pages")
      .select("slug, label, enabled, updated_at")
      .eq("website_id", data.websiteId);
    for (const row of (dbPages ?? []) as Array<{
      slug: string;
      label: string | null;
      enabled: boolean | null;
      updated_at: string | null;
    }>) {
      const path = normPath(row.slug);
      if (isPathSensitive(path)) continue;
      const override = overrides.get(path);
      items.set(path, {
        slug: path,
        label: row.label || titleize(path),
        source: "Database SEO Page",
        lastmod: (row.updated_at ?? "").slice(0, 10),
        included: override ?? row.enabled !== false,
        hasOverride: override !== undefined,
      });
    }

    const cf = await listContentfulPageSlugsForWebsite(data.websiteId).catch(() => []);
    for (const row of cf) {
      put(row.slug, row.title || titleize(row.slug), "Contentful CMS", row.updatedAt);
    }

    return Array.from(items.values()).sort((a, b) => a.slug.localeCompare(b.slug));
  });

/** Include or exclude a single page from a website's sitemap. */
export const setSitemapInclusion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        websiteId: z.string().uuid(),
        slug: z.string().trim().min(1).max(300),
        included: z.boolean(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const slug = normPath(data.slug);
    const { error } = await supabaseAdmin.from("sitemap_overrides").upsert(
      { website_id: data.websiteId, slug, included: data.included },
      { onConflict: "website_id,slug" },
    );
    if (error) throw new Error(error.message);

    // Keep database SEO pages consistent with the switch.
    await supabaseAdmin
      .from("seo_pages")
      .update({ enabled: data.included })
      .eq("website_id", data.websiteId)
      .eq("slug", slug.replace(/^\//, ""));

    return { ok: true };
  });

/** Fetch a website's live sitemap and diff it against what should be listed. */
export const checkLiveSitemap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ websiteId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }): Promise<SitemapCheckResult> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: site } = await supabaseAdmin
      .from("websites")
      .select("domain")
      .eq("id", data.websiteId)
      .maybeSingle();
    const host = ((site?.domain as string) || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
    const sitemapUrl = `https://${host}/sitemap.xml`;

    const base: SitemapCheckResult = {
      sitemapUrl,
      status: 0,
      ok: false,
      parsed: false,
      urlCount: 0,
      missing: [],
      unexpected: [],
      wrongHost: [],
    };
    if (!host) return { ...base, error: "This website has no domain configured." };

    let xml = "";
    try {
      const res = await fetch(sitemapUrl, { headers: { "Cache-Control": "no-cache" } });
      base.status = res.status;
      base.ok = res.ok;
      xml = await res.text();
    } catch (err) {
      return { ...base, error: (err as Error).message };
    }
    if (!base.ok) return { ...base, error: `Sitemap responded with HTTP ${base.status}` };

    const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim());
    base.parsed = xml.includes("<urlset") && locs.length > 0;
    base.urlCount = locs.length;

    const livePaths = new Set<string>();
    for (const loc of locs) {
      try {
        const u = new URL(loc);
        if (u.hostname.replace(/^www\./, "") !== host.replace(/^www\./, "")) {
          base.wrongHost.push(loc);
        }
        livePaths.add(normPath(u.pathname));
      } catch {
        base.wrongHost.push(loc);
      }
    }

    const expectedItems = await getSitemapManagerData({ data: { websiteId: data.websiteId } });
    const expected = new Set(
      expectedItems.filter((i) => i.included).map((i) => i.slug),
    );
    const excluded = new Set(
      expectedItems.filter((i) => !i.included).map((i) => i.slug),
    );

    base.missing = Array.from(expected).filter((p) => !livePaths.has(p)).sort();
    base.unexpected = Array.from(livePaths)
      .filter((p) => excluded.has(p))
      .sort();

    return base;
  });
