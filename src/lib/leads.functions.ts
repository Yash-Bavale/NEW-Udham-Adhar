import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SERVICES, INDIAN_STATES, LANGUAGES } from "./constants";

/**
 * Converts a raw source URL into a clean admin-friendly label.
 * - Google Ads traffic  → "Google Ads | Campaign: 24100987356 | kw: udyam registration"
 * - Organic / direct   → "Website | /download-udyam-certificate"
 * - No source          → "Website"
 */
function parseLeadSource(sourcePage?: string): string {
  if (!sourcePage) return "Website";
  try {
    // sourcePage may now be a full URL (origin + path + search) or just path + search.
    const isFullUrl = sourcePage.startsWith("http://") || sourcePage.startsWith("https://");
    const baseUrl = isFullUrl ? sourcePage : `https://placeholder.invalid${sourcePage}`;
    const url = new URL(baseUrl);
    const params = url.searchParams;

    // Extract hostname hint (empty for placeholder/localhost)
    const hostname = isFullUrl ? url.hostname.toLowerCase().replace(/^www\./, "") : "";
    // Build a short domain tag shown in the label only when it differs from default
    const domainTag =
      hostname && hostname !== "udyamadhar.in" && hostname !== "placeholder.invalid"
        ? ` [${hostname}]`
        : "";

    // Detect Google Ads: Gad_source, gclid, gbraid, or wbraid are all Google Ads signals
    const isGoogleAds =
      params.has("Gad_source") ||
      params.has("gad_source") ||
      params.has("gclid") ||
      params.has("Gclid") ||
      params.has("gbraid") ||
      params.has("Gbraid") ||
      params.has("wbraid") ||
      params.has("Wbraid");

    if (isGoogleAds) {
      const campaignId =
        params.get("Gad_campaignid") ||
        params.get("gad_campaignid") ||
        params.get("utm_campaign") ||
        null;
      const keyword =
        params.get("utm_term") ||
        params.get("keyword") ||
        null;
      const adGroup =
        params.get("utm_content") ||
        null;

      let label = `Google Ads${domainTag}`;
      if (campaignId) label += ` | Campaign: ${campaignId}`;
      if (keyword) label += ` | kw: ${keyword}`;
      if (adGroup) label += ` | adg: ${adGroup}`;
      // Also record which landing page the ad pointed to (path only, no params)
      const landingPath = url.pathname.replace(/^\/+/, "") || "/";
      label += ` | Page: /${landingPath}`;
      return label;
    }

    // Organic / direct — store just the clean path (no query string noise)
    const cleanPath = url.pathname || "/";
    return `Website${domainTag} | ${cleanPath}`;
  } catch {
    // Fallback for malformed URLs
    return `Website | ${sourcePage.split("?")[0].slice(0, 120)}`;
  }
}


const LeadInput = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  state: z.enum(INDIAN_STATES as [string, ...string[]]),
  language: z.enum(LANGUAGES as [string, ...string[]]),
  service: z.string().trim().min(1).max(200),
  consent: z.literal(true, { message: "You must accept the terms to proceed" }),
  source_page: z.string().trim().max(400).optional(),
});

/**
 * Public lead intake server function.
 * - Looks up service + dynamic pricing from DB
 * - Dedupes by email OR mobile within last 30 days (reuses lead, no duplicate row)
 * - Creates a linked application row
 * - Activity log entries are written automatically by DB triggers
 */
export const createLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => LeadInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { resolveWebsiteIdFromRequest } = await import("./websites/default-website.server");
    const { getRequest } = await import("@tanstack/react-start/server");

    // ── Website resolution (3-tier, most-reliable first) ────────────────────
    // 1. Server Request Host header — works correctly for all real production domains.
    //    (The form always runs on the domain the user is visiting.)
    let websiteId: string | null = null;
    try {
      websiteId = await resolveWebsiteIdFromRequest(getRequest());
    } catch { websiteId = null; }

    // 2. Full URL sent by the client (includes origin hostname since the last fix).
    //    Handles cases where the SSR request host is a proxy/CDN address.
    if (!websiteId || websiteId === await import("./websites/default-website.server").then(m => m.getDefaultWebsiteId()).catch(() => null)) {
      const srcUrl = (data.source_page ?? "").trim();
      if (srcUrl.startsWith("http")) {
        try {
          const parsed = new URL(srcUrl);
          const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
          const { data: hostnameWeb } = await supabaseAdmin
            .from("websites")
            .select("id")
            .eq("is_active", true)
            .in("domain", [hostname, `www.${hostname}`])
            .maybeSingle();
          if (hostnameWeb?.id) websiteId = hostnameWeb.id;
        } catch { /* malformed URL — skip */ }
      }
    }

    // 3. Last resort: keyword heuristic on path if still unresolved.
    if (!websiteId) {
      const pathLower = (data.source_page ?? "").toLowerCase();
      const looksLikeReg =
        pathLower.includes("udyamregistration") ||
        pathLower.includes("udyam-registration") ||
        pathLower.includes("new-udyam");
      if (looksLikeReg) {
        const { data: regWeb } = await supabaseAdmin
          .from("websites")
          .select("id")
          .or("name.ilike.%registration%,domain.ilike.%registration%")
          .limit(1)
          .maybeSingle();
        if (regWeb?.id) websiteId = regWeb.id;
      }
    }

    // 4. Absolute fallback — udyamadhar.in (primary site).
    if (!websiteId) {
      const { getDefaultWebsiteId } = await import("./websites/default-website.server");
      websiteId = await getDefaultWebsiteId();
    }
    // 1. Map form label -> internal slug -> DB service row
    // 1. Resolve service by code (slug) OR by legacy label — supports admin-renamed services.
    const raw = data.service;
    const slugFromStatic = SERVICES.find((s) => s.label === raw)?.slug;
    const candidate = slugFromStatic ?? raw;

    let service: { id: string; service_code: string; service_name: string; base_amount: number; gst_amount: number; total_amount: number; is_active: boolean } | null = null;
    if (websiteId) {
      const { data: webSvc } = await supabaseAdmin
        .from("services")
        .select("id, service_code, service_name, base_amount, gst_amount, total_amount, is_active")
        .or(`service_code.eq.${candidate},service_name.eq.${raw}`)
        .eq("website_id", websiteId)
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();
      if (webSvc) service = webSvc as any;
    }

    if (!service) {
      const { data: fallbackSvc, error: svcErr } = await supabaseAdmin
        .from("services")
        .select("id, service_code, service_name, base_amount, gst_amount, total_amount, is_active")
        .or(`service_code.eq.${candidate},service_name.eq.${raw}`)
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();
      if (svcErr) throw new Error(svcErr.message);
      service = fallbackSvc as any;
    }
    if (!service || !service.is_active) {
      throw new Error("Selected service is not currently available.");
    }
    // Store the current display name so renamed services propagate.
    data.service = service.service_name as string;

    const baseAmount = Number(service.base_amount);
    const gstAmount = Number(service.gst_amount);
    const totalAmount = Number(service.total_amount);

    // 2. Duplicate detection — match on mobile OR email (case-insensitive).
    const normalizedEmail = data.email.toLowerCase();
    const { data: existing } = await supabaseAdmin
      .from("leads")
      .select("id")
      .or(`mobile.eq.${data.mobile},email.eq.${normalizedEmail}`)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    const isDuplicate = !!existing?.id;
    const duplicateOf = existing?.id ?? null;

    // 2b. Resolve or create the customer (dedupes by mobile, then email).
    // Non-fatal: if this fails we still save the lead.
    let customerId: string | null = null;
    {
      const { data: cid, error: custErr } = await supabaseAdmin.rpc(
        "find_or_create_customer",
        {
          p_name: data.name,
          p_email: normalizedEmail,
          p_mobile: data.mobile,
          p_state: data.state,
          p_language: data.language,
        },
      );
      if (custErr) {
        console.error("find_or_create_customer failed:", custErr.message);
      } else {
        customerId = (cid as unknown as string) ?? null;
      }
    }

    // 3. Always create a new lead row — treat every submission as a fresh application.
    let leadId: string;
    let leadCode: string;
    {
      const { data: row, error } = await supabaseAdmin
        .from("leads")
        .insert({
          name: data.name,
          email: normalizedEmail,
          mobile: data.mobile,
          state: data.state,
          language: data.language,
          service: data.service,
          service_id: service.id,
          base_amount: baseAmount,
          gst_amount: gstAmount,
          total_amount: totalAmount,
          status: "new_lead",
          lead_source: parseLeadSource(data.source_page),
          is_duplicate: isDuplicate,
          duplicate_of: duplicateOf,
          customer_id: customerId,
          website_id: websiteId,
        })
        .select("id, lead_code")
        .single();
      if (error || !row) {
        throw new Error(error?.message ?? "Could not save your details. Please try again.");
      }
      leadId = row.id;
      leadCode = row.lead_code as string;
    }

    // If this was a duplicate, bump the original's counter.
    if (duplicateOf) {
      const { data: orig } = await supabaseAdmin
        .from("leads")
        .select("duplicate_count")
        .eq("id", duplicateOf)
        .maybeSingle();
      await supabaseAdmin
        .from("leads")
        .update({ duplicate_count: (orig?.duplicate_count ?? 0) + 1 })
        .eq("id", duplicateOf);
    }

    // NOTE: No application/order row is created here on purpose.
    // An order exists only once a payment succeeds — see
    // src/lib/payments/finalize-paid.server.ts. This keeps the order's
    // created_at equal to the actual payment time.


    // Emit internal CRM notifications to staff/admins
    try {
      const { emitToRole } = await import("@/lib/notifications/emit.server");
      await emitToRole("admin", {
        kind: "form_submitted",
        title: "New Lead Received",
        body: `${data.name} (${data.service}) — ${data.mobile}`,
        href: `/admin/leads/${leadId}`,
        entityKind: "lead",
        entityId: leadId,
      });
      await emitToRole("super_admin", {
        kind: "form_submitted",
        title: "New Lead Received",
        body: `${data.name} (${data.service}) — ${data.mobile}`,
        href: `/admin/leads/${leadId}`,
        entityKind: "lead",
        entityId: leadId,
      });
    } catch (e: unknown) {
      console.error("Lead creation notification failed:", e);
    }

    return {
      leadId,
      leadCode,
      baseAmount,
      gstAmount,
      totalAmount,
    };
  });
