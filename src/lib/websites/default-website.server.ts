import { supabaseAdmin } from "@/integrations/supabase/client.server";

let cachedId: string | null = null;

/**
 * Resolve the default website id (udyamadhar.in). Cached in-process for the
 * lifetime of the Worker instance. Falls back to first active website if the
 * default domain is missing (should not happen in production).
 */
export async function getDefaultWebsiteId(): Promise<string> {
  if (cachedId) return cachedId;
  const { data, error } = await supabaseAdmin
    .from("websites")
    .select("id")
    .eq("domain", "udyamadhar.in")
    .maybeSingle();
  if (error) throw error;
  if (data?.id) {
    cachedId = data.id;
    return data.id;
  }
  const { data: any, error: err2 } = await supabaseAdmin
    .from("websites")
    .select("id")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (err2) throw err2;
  if (!any?.id) throw new Error("No websites configured");
  cachedId = any.id;
  return any.id;
}

/**
 * Resolve a website id from an incoming Request's Host header. Falls back to
 * the default website when the host does not match any active website
 * (localhost, Lovable preview domains, etc.).
 */
export async function resolveWebsiteIdFromRequest(request: Request | undefined): Promise<string> {
  const host = request?.headers.get("host")?.toLowerCase().split(":")[0] ?? "";
  if (host) {
    const stripped = host.replace(/^www\./, "");
    const { data } = await supabaseAdmin
      .from("websites")
      .select("id")
      .eq("is_active", true)
      .in("domain", [host, stripped])
      .maybeSingle();
    if (data?.id) return data.id;
  }
  return getDefaultWebsiteId();
}

/**
 * Resolve the origin URL (e.g. "https://udyamregistrations.in" or "https://udyamadhar.in")
 * for a specific website_id.
 */
export async function getWebsiteOriginById(websiteId?: string | null): Promise<string | null> {
  if (!websiteId) return null;
  try {
    const { data } = await supabaseAdmin
      .from("websites")
      .select("domain")
      .eq("id", websiteId)
      .maybeSingle();
    if (data?.domain) {
      const cleanDomain = data.domain.toLowerCase().replace(/^www\./, "");
      return `https://${cleanDomain}`;
    }
  } catch { /* ignore */ }
  return null;
}

/**
 * Resolve the origin URL for a lead by checking:
 * 1. website_id if provided
 * 2. lookup lead by leadCode or id to get website_id
 * 3. Request Host header if available
 * 4. Fallback to default APP_BASE_URL / udyamadhar.in
 */
export async function getWebsiteOriginForLead(
  leadCodeOrId?: string | null,
  websiteId?: string | null,
  request?: Request,
): Promise<string> {
  if (websiteId) {
    const origin = await getWebsiteOriginById(websiteId);
    if (origin) return origin;
  }
  if (leadCodeOrId) {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(leadCodeOrId);
      const query = supabaseAdmin.from("leads").select("website_id");
      const { data: lead } = await (isUuid ? query.eq("id", leadCodeOrId) : query.eq("lead_code", leadCodeOrId)).maybeSingle();
      if (lead?.website_id) {
        const origin = await getWebsiteOriginById(lead.website_id);
        if (origin) return origin;
      }
    } catch { /* ignore */ }
  }
  if (request) {
    const host = request.headers.get("host")?.toLowerCase().split(":")[0];
    if (host && !host.includes("localhost") && !host.includes("127.0.0.1") && !host.includes("placeholder")) {
      const stripped = host.replace(/^www\./, "");
      return `https://${stripped}`;
    }
  }
  return process.env.APP_BASE_URL || process.env.PUBLIC_SITE_URL || "https://udyamadhar.in";
}
