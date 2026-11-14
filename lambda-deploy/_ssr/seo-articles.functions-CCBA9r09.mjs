import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
const getArticleBySlug_createServerFn_handler = createServerRpc({
  id: "de8a02d50774582b4c08f65e0206f58913670b8d18ea311db23be0e45639c1cb",
  name: "getArticleBySlug",
  filename: "src/lib/seo-articles.functions.ts"
}, (opts) => getArticleBySlug.__executeServer(opts));
const getArticleBySlug = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  if (!data?.slug || typeof data.slug !== "string") {
    throw new Error("slug required");
  }
  return {
    slug: data.slug.trim().toLowerCase().slice(0, 200)
  };
}).handler(getArticleBySlug_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    getRequest
  } = await import("./server-BvFUsV4_.mjs");
  const {
    resolveCurrentWebsite
  } = await import("./current-website.server-D9vbN4Zc.mjs");
  const site = await resolveCurrentWebsite(getRequest());
  const slugVariants = data.slug.startsWith("/") ? [data.slug, data.slug.slice(1)] : [data.slug, `/${data.slug}`];
  let {
    data: row
  } = await supabaseAdmin.from("seo_pages").select("slug, label, page_type, h1, meta_title, meta_description, intro, sections, faq, cover_image_url, related_slugs, published_at, updated_at").in("slug", slugVariants).eq("website_id", site.id).eq("enabled", true).eq("page_type", "article").maybeSingle();
  if (!row) {
    const {
      data: fallbackRow
    } = await supabaseAdmin.from("seo_pages").select("slug, label, page_type, h1, meta_title, meta_description, intro, sections, faq, cover_image_url, related_slugs, published_at, updated_at").in("slug", slugVariants).eq("enabled", true).eq("page_type", "article").maybeSingle();
    row = fallbackRow;
  }
  if (!row) return {
    article: null,
    related: []
  };
  const relatedSlugs = Array.isArray(row.related_slugs) ? row.related_slugs : [];
  let related = [];
  if (relatedSlugs.length) {
    let {
      data: rel
    } = await supabaseAdmin.from("seo_pages").select("slug, label").in("slug", relatedSlugs).eq("website_id", site.id).eq("enabled", true);
    if (!rel || rel.length === 0) {
      const {
        data: fallbackRel
      } = await supabaseAdmin.from("seo_pages").select("slug, label").in("slug", relatedSlugs).eq("enabled", true);
      rel = fallbackRel;
    }
    related = (rel ?? []).map((r) => ({
      slug: r.slug,
      label: r.label
    }));
  }
  return {
    article: row,
    related
  };
});
export {
  getArticleBySlug_createServerFn_handler
};
