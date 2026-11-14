import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, n as number, b as boolean, s as string } from "../_libs/zod.mjs";
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
const SENSITIVE_PREFIXES = ["/api", "/admin", "/admin-login", "/seo-admin", "/onboarding", "/payment", "/payment-pending", "/payment-failed", "/processing", "/success", "/apply", "/email", "/lovable", "/mcp", "/.mcp", "/.well-known"];
function isPathSensitive(path) {
  const p = path.toLowerCase().trim();
  if (p.includes("$") || p.includes("*") || p.includes("[") || p.includes("]") || p.startsWith("/.") || p.includes("mcp") || p.includes("oauth")) {
    return true;
  }
  return SENSITIVE_PREFIXES.some((pre) => p === pre || p.startsWith(pre + "/"));
}
async function assertAdmin(userId) {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data,
    error
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}
const listPublicSeoPages_createServerFn_handler = createServerRpc({
  id: "fd963bea4cc60c9f99bb62927d1ff7e65a6f2659027181393ebed6da00cb1db5",
  name: "listPublicSeoPages",
  filename: "src/lib/seo-pages.functions.ts"
}, (opts) => listPublicSeoPages.__executeServer(opts));
const listPublicSeoPages = createServerFn({
  method: "GET"
}).handler(listPublicSeoPages_createServerFn_handler, async () => {
  const {
    getRequest
  } = await import("./server-BvFUsV4_.mjs");
  const {
    resolveCurrentWebsite
  } = await import("./current-website.server-D9vbN4Zc.mjs");
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const site = await resolveCurrentWebsite(getRequest());
  const {
    data,
    error
  } = await supabaseAdmin.from("seo_pages").select("id, slug, label, enabled, sort_order, page_type").eq("enabled", true).eq("website_id", site.id).order("sort_order", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const listAllSeoPages_createServerFn_handler = createServerRpc({
  id: "ead327ebc9c4fbefa84dd85284c0d83b8884e6feeb42e1fba252c8eb6911259e",
  name: "listAllSeoPages",
  filename: "src/lib/seo-pages.functions.ts"
}, (opts) => listAllSeoPages.__executeServer(opts));
const listAllSeoPages = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listAllSeoPages_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data,
    error
  } = await supabaseAdmin.from("seo_pages").select("id, slug, label, enabled, sort_order").order("sort_order", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const UpsertInput = object({
  id: string().uuid().optional(),
  website_id: string().uuid().optional(),
  slug: string().trim().min(1).max(160).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  label: string().trim().min(1).max(200),
  enabled: boolean(),
  sort_order: number().int().min(0).max(1e5)
});
const upsertSeoPage_createServerFn_handler = createServerRpc({
  id: "bf98d6a120e262e69216c45bb7aedba8dd849aa814e7e516140cb1533ed812fe",
  name: "upsertSeoPage",
  filename: "src/lib/seo-pages.functions.ts"
}, (opts) => upsertSeoPage.__executeServer(opts));
const upsertSeoPage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => UpsertInput.parse(input)).handler(upsertSeoPage_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  if (data.id) {
    const {
      error
    } = await supabaseAdmin.from("seo_pages").update({
      slug: data.slug,
      label: data.label,
      enabled: data.enabled,
      sort_order: data.sort_order,
      ...data.website_id ? {
        website_id: data.website_id
      } : {}
    }).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    let websiteId = data.website_id;
    if (!websiteId) {
      const {
        data: site,
        error: sErr
      } = await supabaseAdmin.from("websites").select("id").eq("is_primary", true).maybeSingle();
      if (sErr) throw new Error(sErr.message);
      if (!site) throw new Error("No primary website configured");
      websiteId = site.id;
    }
    const {
      error
    } = await supabaseAdmin.from("seo_pages").insert({
      website_id: websiteId,
      slug: data.slug,
      label: data.label,
      enabled: data.enabled,
      sort_order: data.sort_order
    });
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const deleteSeoPage_createServerFn_handler = createServerRpc({
  id: "602cdfe45c47e09b3bf7c1e91d5d600dc3cd155ca29992a4294b9312b9b5b41a",
  name: "deleteSeoPage",
  filename: "src/lib/seo-pages.functions.ts"
}, (opts) => deleteSeoPage.__executeServer(opts));
const deleteSeoPage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => object({
  id: string().uuid()
}).parse(input)).handler(deleteSeoPage_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    error
  } = await supabaseAdmin.from("seo_pages").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const checkIsAdmin_createServerFn_handler = createServerRpc({
  id: "091bb78af65becdc45c0fe332eba528a3e29940a4d33856ad620342c332c2b49",
  name: "checkIsAdmin",
  filename: "src/lib/seo-pages.functions.ts"
}, (opts) => checkIsAdmin.__executeServer(opts));
const checkIsAdmin = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(checkIsAdmin_createServerFn_handler, async ({
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  return {
    isAdmin: !!data
  };
});
const getSitemapPageManagerData_createServerFn_handler = createServerRpc({
  id: "176f832daaa17526348ddd41ceee0cc440f5f0d8f0e55254f7150c96a8384443",
  name: "getSitemapPageManagerData",
  filename: "src/lib/seo-pages.functions.ts"
}, (opts) => getSitemapPageManagerData.__executeServer(opts));
const getSitemapPageManagerData = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getSitemapPageManagerData_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    getRequest
  } = await import("./server-BvFUsV4_.mjs");
  const {
    resolveCurrentWebsite
  } = await import("./current-website.server-D9vbN4Zc.mjs");
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    listContentfulSeoSlugs
  } = await import("./client.functions-WMvtjq1i.mjs");
  const site = await resolveCurrentWebsite(getRequest());
  const itemsMap = /* @__PURE__ */ new Map();
  const CORE_PAGES = [{
    slug: "/",
    label: "Homepage"
  }, {
    slug: "/udyam-registration",
    label: "Udyam Registration Online"
  }, {
    slug: "/new-udyam-registration",
    label: "New Udyam Registration"
  }, {
    slug: "/download-udyam-certificate",
    label: "Download Udyam Certificate"
  }, {
    slug: "/print-udyam-certificate",
    label: "Print Udyam Certificate"
  }, {
    slug: "/verify-udyam-certificate",
    label: "Verify Udyam Certificate"
  }, {
    slug: "/update-udyam-certificate",
    label: "Update Udyam Certificate"
  }, {
    slug: "/forgot-udyam-registration-number",
    label: "Forgot Udyam Registration Number"
  }, {
    slug: "/msme-registration",
    label: "MSME Registration"
  }, {
    slug: "/msme-registration-fee",
    label: "MSME Registration Fee"
  }, {
    slug: "/migrate-udyog-aadhaar-to-udyam",
    label: "Migrate Udyog Aadhaar to Udyam"
  }, {
    slug: "/talk-to-expert",
    label: "Talk to Expert"
  }, {
    slug: "/about-us",
    label: "About Us"
  }, {
    slug: "/contact-us",
    label: "Contact Us"
  }, {
    slug: "/terms-conditions",
    label: "Terms & Conditions"
  }, {
    slug: "/privacy-policy",
    label: "Privacy Policy"
  }, {
    slug: "/refund-cancellation-policy",
    label: "Refund & Cancellation Policy"
  }, {
    slug: "/service-delivery-policy",
    label: "Service Delivery Policy"
  }, {
    slug: "/pricing-transparency",
    label: "Pricing Transparency"
  }, {
    slug: "/disclaimer",
    label: "Disclaimer"
  }, {
    slug: "/cookie-policy",
    label: "Cookie Policy"
  }, {
    slug: "/important-notice",
    label: "Important Notice"
  }, {
    slug: "/grievance-redressal-policy",
    label: "Grievance Redressal Policy"
  }, {
    slug: "/complaint-grievance-policy",
    label: "Complaint Grievance Policy"
  }, {
    slug: "/compliance-statement",
    label: "Compliance Statement"
  }, {
    slug: "/consent-acknowledgment",
    label: "Consent Acknowledgment"
  }, {
    slug: "/aml-anti-fraud-policy",
    label: "AML & Anti-Fraud Policy"
  }];
  for (const c of CORE_PAGES) {
    if (isPathSensitive(c.slug)) continue;
    itemsMap.set(c.slug, {
      id: `static-${c.slug}`,
      slug: c.slug,
      label: c.label,
      source: "Static Route",
      inSitemap: true,
      lastmod: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      isSensitive: false
    });
  }
  try {
    const {
      data: dbPages
    } = await supabaseAdmin.from("seo_pages").select("id, slug, label, enabled, updated_at").or(`website_id.eq.${site.id},website_id.is.null`);
    for (const row of dbPages ?? []) {
      const path = row.slug.startsWith("/") ? row.slug : `/${row.slug}`;
      if (isPathSensitive(path)) continue;
      itemsMap.set(path, {
        id: row.id,
        slug: path,
        label: row.label || path,
        source: "Database SEO Page",
        inSitemap: row.enabled ?? true,
        lastmod: (row.updated_at ?? "").slice(0, 10) || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        isSensitive: false
      });
    }
  } catch {
  }
  try {
    const cfSlugs = await listContentfulSeoSlugs();
    for (const row of cfSlugs) {
      const path = `/${row.slug.replace(/^\/+/, "")}`;
      if (isPathSensitive(path)) continue;
      const formattedLabel = row.slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      itemsMap.set(path, {
        id: `cf-${row.slug}`,
        slug: path,
        label: formattedLabel,
        source: "Contentful CMS",
        inSitemap: true,
        lastmod: row.updatedAt || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        isSensitive: false
      });
    }
  } catch {
  }
  return Array.from(itemsMap.values()).sort((a, b) => a.slug.localeCompare(b.slug));
});
const submitAllPagesToSitemap_createServerFn_handler = createServerRpc({
  id: "cb2a013f6771304a32e61c341b866d5ac79f7e61d1b0d819782c58afed8a7cfa",
  name: "submitAllPagesToSitemap",
  filename: "src/lib/seo-pages.functions.ts"
}, (opts) => submitAllPagesToSitemap.__executeServer(opts));
const submitAllPagesToSitemap = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(submitAllPagesToSitemap_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    getRequest
  } = await import("./server-BvFUsV4_.mjs");
  const {
    resolveCurrentWebsite
  } = await import("./current-website.server-D9vbN4Zc.mjs");
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    listContentfulSeoSlugs
  } = await import("./client.functions-WMvtjq1i.mjs");
  const site = await resolveCurrentWebsite(getRequest());
  if (!site?.id) throw new Error("Could not resolve the current website");
  const cfSlugs = await listContentfulSeoSlugs().catch(() => []);
  let count = 0;
  for (const cf of cfSlugs) {
    const path = cf.slug.replace(/^\/+/, "");
    if (isPathSensitive(`/${path}`)) continue;
    const label = path.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    const {
      error
    } = await supabaseAdmin.from("seo_pages").upsert({
      website_id: site.id,
      slug: path,
      label,
      enabled: true,
      sort_order: 10
    }, {
      onConflict: "website_id,slug"
    });
    if (!error) count++;
  }
  return {
    ok: true,
    submitted: count
  };
});
export {
  checkIsAdmin_createServerFn_handler,
  deleteSeoPage_createServerFn_handler,
  getSitemapPageManagerData_createServerFn_handler,
  listAllSeoPages_createServerFn_handler,
  listPublicSeoPages_createServerFn_handler,
  submitAllPagesToSitemap_createServerFn_handler,
  upsertSeoPage_createServerFn_handler
};
