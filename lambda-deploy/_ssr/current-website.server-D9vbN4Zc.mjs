import { supabaseAdmin } from "./client.server-3kDCe7R3.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const BRAND_COLUMNS = "id, domain, name, brand_name, legal_entity, company_name, support_email, support_phone, whatsapp_number, business_hours, primary_color, logo_asset_url, favicon_asset_url, sample_certificate_asset_url, contentful_space_id, contentful_delivery_token_secret, sanity_project_id, sanity_dataset, legal_footer_line, postal_address, footer_unlock_code, google_site_verification, gtag_id, is_primary, allow_admin";
const cache = /* @__PURE__ */ new Map();
let primaryCache = null;
function clearWebsiteCache() {
  cache.clear();
  primaryCache = null;
}
async function withRetry(fn, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, 150 * (i + 1)));
    }
  }
  throw lastErr;
}
async function loadPrimary() {
  if (primaryCache) return primaryCache;
  const data = await withRetry(async () => {
    const res = await supabaseAdmin.from("websites").select(BRAND_COLUMNS).eq("is_primary", true).maybeSingle();
    if (res.error) throw res.error;
    return res.data;
  });
  if (data) {
    primaryCache = data;
    return primaryCache;
  }
  const any = await withRetry(async () => {
    const res = await supabaseAdmin.from("websites").select(BRAND_COLUMNS).eq("is_active", true).order("sort_order", { ascending: true }).limit(1).maybeSingle();
    if (res.error) throw res.error;
    return res.data;
  });
  if (!any) throw new Error("No websites configured");
  primaryCache = any;
  return primaryCache;
}
async function resolveCurrentWebsite(request) {
  const host = request?.headers.get("host")?.toLowerCase().split(":")[0] ?? "";
  if (host) {
    const cached = cache.get(host);
    if (cached) return cached;
    const stripped = host.replace(/^www\./, "");
    const data = await withRetry(async () => {
      const res = await supabaseAdmin.from("websites").select(BRAND_COLUMNS).eq("is_active", true).in("domain", [host, stripped]).maybeSingle();
      if (res.error) throw res.error;
      return res.data;
    });
    if (data) {
      const row = data;
      cache.set(host, row);
      return row;
    }
  }
  return loadPrimary();
}
export {
  clearWebsiteCache,
  resolveCurrentWebsite
};
