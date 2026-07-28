import { createServerFn } from "@tanstack/react-start";
import { notFound } from "@tanstack/react-router";

// Public server fn — read an enabled article-type SEO page by slug.
export const getArticleBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => {
    if (!data?.slug || typeof data.slug !== "string") {
      throw new Error("slug required");
    }
    return { slug: data.slug.trim().toLowerCase().slice(0, 200) };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getRequest } = await import("@tanstack/react-start/server");
    const { resolveCurrentWebsite } = await import(
      "@/lib/websites/current-website.server"
    );
    const site = await resolveCurrentWebsite(getRequest());
    const slugVariants = data.slug.startsWith("/")
      ? [data.slug, data.slug.slice(1)]
      : [data.slug, `/${data.slug}`];

    const { data: row } = await supabaseAdmin
      .from("seo_pages")
      .select(
        "slug, label, page_type, h1, meta_title, meta_description, intro, sections, faq, cover_image_url, related_slugs, published_at, updated_at",
      )
      .in("slug", slugVariants)
      .eq("website_id", site.id)
      .eq("enabled", true)
      .eq("page_type", "article")
      .maybeSingle();

    if (!row) throw notFound();

    // Fetch related labels.
    const relatedSlugs = Array.isArray((row as any).related_slugs)
      ? ((row as any).related_slugs as string[])
      : [];
    let related: { slug: string; label: string }[] = [];
    if (relatedSlugs.length) {
      const { data: rel } = await supabaseAdmin
        .from("seo_pages")
        .select("slug, label")
        .in("slug", relatedSlugs)
        .eq("website_id", site.id)
        .eq("enabled", true);
      related = (rel ?? []).map((r: any) => ({ slug: r.slug, label: r.label }));
    }

    return { article: row as any, related };
  });
