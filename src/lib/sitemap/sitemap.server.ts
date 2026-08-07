import { supabaseAdmin } from "@/integrations/supabase/client.server";

const GATEWAY = "https://connector-gateway.lovable.dev/contentful";

/** Only these env var names may be selected per-website (allow-list). */
const ALLOWED_TOKEN_SECRETS = [
  "CONTENTFUL_API_KEY",
  "CONTENTFUL_API_KEY_1",
  "CONTENTFUL_API_KEY_2",
] as const;

/** Content types that represent real, indexable pages. */
const PAGE_CONTENT_TYPES = ["seoArticle", "servicePage", "landingPage"] as const;

export type CfSlugRow = {
  slug: string;
  title: string;
  canonicalUrl: string;
  updatedAt: string;
  contentType: string;
};

type CfItem = {
  sys?: { id?: string; updatedAt?: string };
  fields?: { slug?: string; title?: string; canonicalUrl?: string };
};

async function credsForWebsite(
  websiteId: string,
): Promise<{ spaceId: string; apiKey: string } | null> {
  const { data } = await supabaseAdmin
    .from("websites")
    .select("contentful_space_id, contentful_delivery_token_secret")
    .eq("id", websiteId)
    .maybeSingle();

  let secretName = "CONTENTFUL_API_KEY";
  const chosen = (data as { contentful_delivery_token_secret?: string } | null)
    ?.contentful_delivery_token_secret;
  if (chosen && (ALLOWED_TOKEN_SECRETS as readonly string[]).includes(chosen)) {
    secretName = chosen;
  }
  const suffix = secretName.replace("CONTENTFUL_API_KEY", "");
  const spaceId =
    (data as { contentful_space_id?: string } | null)?.contentful_space_id ||
    process.env[`CONTENTFUL_SPACE_ID${suffix}`] ||
    process.env["CONTENTFUL_SPACE_ID"] ||
    "";
  const apiKey = process.env[secretName] ?? "";
  if (!spaceId || !apiKey) return null;
  return { spaceId, apiKey };
}

/**
 * List every published page-type entry for a specific website's Contentful
 * space. Unlike the host-scoped version this takes an explicit website id, so
 * admin tooling can inspect any site's CMS regardless of the current domain.
 */
export async function listContentfulPageSlugsForWebsite(
  websiteId: string,
): Promise<CfSlugRow[]> {
  const gatewayKey = process.env["LOVABLE_API_KEY"];
  if (!gatewayKey) return [];
  const creds = await credsForWebsite(websiteId);
  if (!creds) return [];

  const out: CfSlugRow[] = [];
  const seen = new Set<string>();

  for (const type of PAGE_CONTENT_TYPES) {
    let skip = 0;
    for (;;) {
      const url =
        `${GATEWAY}/spaces/${creds.spaceId}/entries?content_type=${type}` +
        `&select=sys.id,sys.updatedAt,fields.slug,fields.title,fields.canonicalUrl` +
        `&limit=200&skip=${skip}`;
      let page: { items?: CfItem[]; total?: number; limit?: number };
      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${gatewayKey}`,
            "X-Connection-Api-Key": creds.apiKey,
          },
        });
        if (!res.ok) break;
        page = (await res.json()) as { items?: CfItem[]; total?: number; limit?: number };
      } catch {
        break;
      }
      const items = page.items ?? [];
      for (const e of items) {
        const slug = (e.fields?.slug ?? "").trim().toLowerCase();
        if (!slug || slug === "home" || slug === "index") continue;
        if (seen.has(slug)) continue;
        seen.add(slug);
        out.push({
          slug,
          title: (e.fields?.title ?? "").trim(),
          canonicalUrl: (e.fields?.canonicalUrl ?? "").trim(),
          updatedAt: (e.sys?.updatedAt ?? "").slice(0, 10),
          contentType: type,
        });
      }
      skip += page.limit || 200;
      if (items.length === 0 || skip >= (page.total || 0)) break;
    }
  }

  return out;
}

/** Slugs the admin explicitly excluded from a website's sitemap. */
export async function loadSitemapExclusions(websiteId: string): Promise<Set<string>> {
  const set = new Set<string>();
  try {
    const { data } = await supabaseAdmin
      .from("sitemap_overrides")
      .select("slug, included")
      .eq("website_id", websiteId)
      .eq("included", false);
    for (const row of (data ?? []) as Array<{ slug: string }>) {
      const s = (row.slug || "").trim().toLowerCase();
      if (!s) continue;
      set.add(s.startsWith("/") ? s : `/${s}`);
    }
  } catch {
    // best-effort — a missing override table must never break the sitemap
  }
  return set;
}

const SENSITIVE_PREFIXES = [
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

export function isSensitivePath(path: string): boolean {
  const p = path.toLowerCase().trim();
  if (
    p.includes("$") ||
    p.includes("*") ||
    p.includes("[") ||
    p.includes("]") ||
    p.startsWith("/.") ||
    p.includes("mcp") ||
    p.includes("oauth")
  ) {
    return true;
  }
  return SENSITIVE_PREFIXES.some((pre) => p === pre || p.startsWith(pre + "/"));
}

export function normalizePath(slug: string): string {
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

export type SitemapManagerItem = {
  slug: string;
  label: string;
  source: "Contentful CMS" | "Database SEO Page" | "Static Route";
  lastmod: string;
  included: boolean;
  hasOverride: boolean;
};

const CORE_PAGES: Array<{ slug: string; label: string }> = [
  { slug: "/", label: "Homepage" },
  { slug: "/about-us", label: "About Us" },
  { slug: "/contact-us", label: "Contact Us" },
  { slug: "/terms-conditions", label: "Terms & Conditions" },
  { slug: "/privacy-policy", label: "Privacy Policy" },
  { slug: "/refund-cancellation-policy", label: "Refund & Cancellation Policy" },
];

/**
 * Every page discoverable for a website (static core pages, database SEO
 * pages, and that site's own Contentful space) with its sitemap state.
 */
export async function collectSitemapItems(
  websiteId: string,
): Promise<SitemapManagerItem[]> {
  const overrides = new Map<string, boolean>();
  try {
    const { data: ov } = await supabaseAdmin
      .from("sitemap_overrides")
      .select("slug, included")
      .eq("website_id", websiteId);
    for (const row of (ov ?? []) as Array<{ slug: string; included: boolean }>) {
      overrides.set(normalizePath(row.slug), row.included);
    }
  } catch {
    // ignore
  }

  const items = new Map<string, SitemapManagerItem>();
  const put = (
    slug: string,
    label: string,
    source: SitemapManagerItem["source"],
    lastmod: string,
  ) => {
    const path = normalizePath(slug);
    if (isSensitivePath(path)) return;
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

  try {
    const { data: dbPages } = await supabaseAdmin
      .from("seo_pages")
      .select("slug, label, enabled, updated_at")
      .eq("website_id", websiteId);
    for (const row of (dbPages ?? []) as Array<{
      slug: string;
      label: string | null;
      enabled: boolean | null;
      updated_at: string | null;
    }>) {
      const path = normalizePath(row.slug);
      if (isSensitivePath(path)) continue;
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
  } catch {
    // ignore
  }

  const cf = await listContentfulPageSlugsForWebsite(websiteId).catch(() => []);
  for (const row of cf) {
    put(row.slug, row.title || titleize(row.slug), "Contentful CMS", row.updatedAt);
  }

  return Array.from(items.values()).sort((a, b) => a.slug.localeCompare(b.slug));
}
