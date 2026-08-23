import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertRole } from "@/lib/audit";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

/**
 * Get the payments_enabled flag for a specific website from its metadata.
 * Falls back to true for the primary site if the flag is absent.
 */
export const getWebsitePaymentStatus = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) => z.object({ websiteId: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const admin = await getAdmin();
    const { data: web, error } = await admin
      .from("websites")
      .select("id, name, domain, is_primary, metadata")
      .eq("id", data.websiteId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!web) return { paymentsEnabled: false, websiteId: data.websiteId };

    const meta = (web as any).metadata ?? {};
    // Primary site defaults to enabled; secondary sites default to disabled until explicitly turned on
    const defaultEnabled = !!(web as any).is_primary;
    const paymentsEnabled = meta.payments_enabled !== undefined
      ? Boolean(meta.payments_enabled)
      : defaultEnabled;

    return {
      paymentsEnabled,
      websiteId: data.websiteId,
      name: (web as any).name,
      domain: (web as any).domain,
    };
  });

/**
 * Resolve website id from a lead code and return its payment status.
 * Used by the public summary/processing page.
 */
export const getLeadWebsitePaymentStatus = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => z.object({ leadCode: z.string().min(3).max(80) }).parse(i))
  .handler(async ({ data }) => {
    const admin = await getAdmin();

    // Resolve lead → website_id
    const codeUpper = data.leadCode.toUpperCase();
    let websiteId: string | null = null;
    let isPrimary = true;

    if (codeUpper.startsWith("AP-")) {
      const { data: app } = await admin
        .from("applications")
        .select("lead_id, leads:lead_id (website_id)")
        .eq("application_code", codeUpper)
        .maybeSingle();
      websiteId = (app as any)?.leads?.website_id ?? null;
    } else {
      const { data: lead } = await admin
        .from("leads")
        .select("website_id")
        .eq("lead_code", codeUpper)
        .maybeSingle();
      websiteId = (lead as any)?.website_id ?? null;
    }

    if (!websiteId) {
      // No website_id means legacy primary site — payments always enabled
      return { paymentsEnabled: true, websiteId: null };
    }

    const { data: web } = await admin
      .from("websites")
      .select("id, name, domain, is_primary, metadata")
      .eq("id", websiteId)
      .maybeSingle();

    if (!web) return { paymentsEnabled: true, websiteId };

    isPrimary = !!(web as any).is_primary;
    const meta = (web as any).metadata ?? {};
    const defaultEnabled = isPrimary;
    const paymentsEnabled = meta.payments_enabled !== undefined
      ? Boolean(meta.payments_enabled)
      : defaultEnabled;

    return {
      paymentsEnabled,
      websiteId,
      name: (web as any).name,
      domain: (web as any).domain,
    };
  });

/**
 * Admin: toggle payments_enabled for a website.
 * Writes into the website's metadata JSON column.
 */
export const setWebsitePaymentsEnabled = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      websiteId: z.string().uuid(),
      enabled: z.boolean(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, ["super_admin", "admin"]);
    const admin = await getAdmin();

    // Read current metadata first to avoid overwriting other fields
    const { data: web, error: fetchErr } = await admin
      .from("websites")
      .select("metadata")
      .eq("id", data.websiteId)
      .maybeSingle();
    if (fetchErr) throw new Error(fetchErr.message);

    const existingMeta = (web as any)?.metadata ?? {};
    const newMeta = { ...existingMeta, payments_enabled: data.enabled };

    const { error } = await admin
      .from("websites")
      .update({ metadata: newMeta } as never)
      .eq("id", data.websiteId);
    if (error) throw new Error(error.message);

    return { ok: true, enabled: data.enabled };
  });

/**
 * Admin: list all websites with their current payment status.
 */
export const listWebsitePaymentStatuses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertRole(context.supabase, ["super_admin", "admin", "manager"]);
    const admin = await getAdmin();

    const { data: websites, error } = await admin
      .from("websites")
      .select("id, name, domain, is_primary, is_active, metadata, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);

    return {
      websites: (websites ?? []).map((w: any) => {
        const meta = w.metadata ?? {};
        const defaultEnabled = !!w.is_primary;
        const paymentsEnabled = meta.payments_enabled !== undefined
          ? Boolean(meta.payments_enabled)
          : defaultEnabled;
        return {
          id: w.id,
          name: w.name,
          domain: w.domain,
          isPrimary: !!w.is_primary,
          paymentsEnabled,
        };
      }),
    };
  });
