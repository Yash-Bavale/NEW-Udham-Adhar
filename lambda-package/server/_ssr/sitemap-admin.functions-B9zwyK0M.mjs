import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, b as boolean } from "../_libs/zod.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
async function assertAdmin(userId) {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data,
    error
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).in("role", ["admin", "super_admin"]).limit(1);
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("Forbidden: admin role required");
}
const listSitemapWebsites_createServerFn_handler = createServerRpc({
  id: "83f9ebf8b7f99e8945909ea37614c16e76dc59de78a1b838e05496a15cbeef8b",
  name: "listSitemapWebsites",
  filename: "src/lib/sitemap/sitemap-admin.functions.ts"
}, (opts) => listSitemapWebsites.__executeServer(opts));
const listSitemapWebsites = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listSitemapWebsites_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data,
    error
  } = await supabaseAdmin.from("websites").select("id, name, domain, is_primary").order("is_primary", {
    ascending: false
  }).order("name", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  return (data ?? []).map((w) => {
    const domain = (w.domain || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
    return {
      id: w.id,
      name: w.name || domain,
      domain,
      is_primary: !!w.is_primary,
      sitemapUrl: domain ? `https://${domain}/sitemap.xml` : ""
    };
  });
});
const getSitemapManagerData_createServerFn_handler = createServerRpc({
  id: "7b3ce6f652105ed2102023205023891b0c7f4be4fdcd15ba1931be4948433a49",
  name: "getSitemapManagerData",
  filename: "src/lib/sitemap/sitemap-admin.functions.ts"
}, (opts) => getSitemapManagerData.__executeServer(opts));
const getSitemapManagerData = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => object({
  websiteId: string().uuid()
}).parse(input)).handler(getSitemapManagerData_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    collectSitemapItems
  } = await import("./sitemap.server-BRMRj-I2.mjs");
  return collectSitemapItems(data.websiteId);
});
const setSitemapInclusion_createServerFn_handler = createServerRpc({
  id: "b08fbdd9d88ccbe5e6a2b1eb82bfbe5632066df4623ed1444654c3482652d493",
  name: "setSitemapInclusion",
  filename: "src/lib/sitemap/sitemap-admin.functions.ts"
}, (opts) => setSitemapInclusion.__executeServer(opts));
const setSitemapInclusion = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => object({
  websiteId: string().uuid(),
  slug: string().trim().min(1).max(300),
  included: boolean()
}).parse(input)).handler(setSitemapInclusion_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    normalizePath
  } = await import("./sitemap.server-BRMRj-I2.mjs");
  const slug = normalizePath(data.slug);
  const {
    error
  } = await supabaseAdmin.from("sitemap_overrides").upsert({
    website_id: data.websiteId,
    slug,
    included: data.included
  }, {
    onConflict: "website_id,slug"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const checkLiveSitemap_createServerFn_handler = createServerRpc({
  id: "c0f2bf63f75667a3bd0890ba0e616e01daca561a9a899023d27d88c2e47e2622",
  name: "checkLiveSitemap",
  filename: "src/lib/sitemap/sitemap-admin.functions.ts"
}, (opts) => checkLiveSitemap.__executeServer(opts));
const checkLiveSitemap = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => object({
  websiteId: string().uuid()
}).parse(input)).handler(checkLiveSitemap_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    collectSitemapItems,
    normalizePath
  } = await import("./sitemap.server-BRMRj-I2.mjs");
  const {
    data: site
  } = await supabaseAdmin.from("websites").select("domain").eq("id", data.websiteId).maybeSingle();
  const host = (site?.domain || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
  const sitemapUrl = host ? `https://${host}/sitemap.xml` : "";
  const base = {
    sitemapUrl,
    status: 0,
    ok: false,
    parsed: false,
    urlCount: 0,
    missing: [],
    unexpected: [],
    wrongHost: []
  };
  if (!host) return {
    ...base,
    error: "This website has no domain configured."
  };
  let xml = "";
  try {
    const res = await fetch(sitemapUrl, {
      headers: {
        "Cache-Control": "no-cache"
      }
    });
    base.status = res.status;
    base.ok = res.ok;
    xml = await res.text();
  } catch (err) {
    return {
      ...base,
      error: err.message
    };
  }
  if (!base.ok) return {
    ...base,
    error: `Sitemap responded with HTTP ${base.status}`
  };
  const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim());
  base.parsed = xml.includes("<urlset") && locs.length > 0;
  base.urlCount = locs.length;
  const livePaths = /* @__PURE__ */ new Set();
  for (const loc of locs) {
    try {
      const u = new URL(loc);
      if (u.hostname.replace(/^www\./, "") !== host.replace(/^www\./, "")) {
        base.wrongHost.push(loc);
      }
      livePaths.add(normalizePath(u.pathname));
    } catch {
      base.wrongHost.push(loc);
    }
  }
  const expectedItems = await collectSitemapItems(data.websiteId);
  const expected = expectedItems.filter((i) => i.included).map((i) => i.slug);
  const excluded = new Set(expectedItems.filter((i) => !i.included).map((i) => i.slug));
  base.missing = expected.filter((p) => !livePaths.has(p)).sort();
  base.unexpected = Array.from(livePaths).filter((p) => excluded.has(p)).sort();
  return base;
});
export {
  checkLiveSitemap_createServerFn_handler,
  getSitemapManagerData_createServerFn_handler,
  listSitemapWebsites_createServerFn_handler,
  setSitemapInclusion_createServerFn_handler
};
