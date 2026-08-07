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
