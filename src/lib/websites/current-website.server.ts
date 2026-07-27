import { supabaseAdmin } from "@/integrations/supabase/client.server";

export interface WebsiteRow {
  id: string;
  domain: string;
  name: string | null;
  brand_name: string | null;
  legal_entity: string | null;
  company_name: string | null;
  support_email: string | null;
  support_phone: string | null;
  whatsapp_number: string | null;
  business_hours: string | null;
  primary_color: string | null;
  logo_asset_url: string | null;
  favicon_asset_url: string | null;
  sample_certificate_asset_url: string | null;
  contentful_space_id: string | null;
  contentful_delivery_token_secret: string | null;
  legal_footer_line: string | null;
  postal_address: string | null;
  footer_unlock_code: string | null;
  google_site_verification: string | null;
  gtag_id: string | null;
  is_primary: boolean;
}

const BRAND_COLUMNS =
  "id, domain, name, brand_name, legal_entity, company_name, support_email, support_phone, whatsapp_number, business_hours, primary_color, logo_asset_url, favicon_asset_url, sample_certificate_asset_url, contentful_space_id, contentful_delivery_token_secret, legal_footer_line, postal_address, footer_unlock_code, google_site_verification, gtag_id, is_primary";

const cache = new Map<string, WebsiteRow>();
let primaryCache: WebsiteRow | null = null;

async function loadPrimary(): Promise<WebsiteRow> {
  if (primaryCache) return primaryCache;
  const { data, error } = await supabaseAdmin
    .from("websites")
    .select(BRAND_COLUMNS)
    .eq("is_primary", true)
    .maybeSingle();
  if (error) throw error;
  if (data) {
    primaryCache = data as unknown as WebsiteRow;
    return primaryCache;
  }
  // Fallback: any active site with lowest sort order
  const { data: any, error: err2 } = await supabaseAdmin
    .from("websites")
    .select(BRAND_COLUMNS)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (err2) throw err2;
  if (!any) throw new Error("No websites configured");
  primaryCache = any as unknown as WebsiteRow;
  return primaryCache;
}

/**
 * Resolve the current website row from a Request's Host header. Falls back
 * to the primary website when the host doesn't match any active row
 * (localhost, Lovable preview, unknown domain).
 */
export async function resolveCurrentWebsite(request: Request | undefined): Promise<WebsiteRow> {
  const host = request?.headers.get("host")?.toLowerCase().split(":")[0] ?? "";
  if (host) {
    const cached = cache.get(host);
    if (cached) return cached;
    const stripped = host.replace(/^www\./, "");
    const { data } = await supabaseAdmin
      .from("websites")
      .select(BRAND_COLUMNS)
      .eq("is_active", true)
      .in("domain", [host, stripped])
      .maybeSingle();
    if (data) {
      const row = data as unknown as WebsiteRow;
      cache.set(host, row);
      return row;
    }
  }
  return loadPrimary();
}
