import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertRole } from "@/lib/audit";

// ─── Storage format ────────────────────────────────────────────────────────
// We store payments_enabled inside the website's `description` field using a
// JSON sentinel prefix: __pc__:{"pe":true}
// The rest of the description (after the prefix) is the human-readable text.
// This is backward-compatible: websites without the prefix keep their original
// description intact and default to the primary/secondary site logic.

const PREFIX = "__pc__:";

export function readPaymentsEnabled(description: string | null, isPrimary: boolean): boolean {
  if (!description) return isPrimary; // primary defaults ON, secondary defaults OFF
  if (!description.startsWith(PREFIX)) return isPrimary;
  try {
    const jsonPart = description.slice(PREFIX.length).split("\n")[0].trim();
    const cfg = JSON.parse(jsonPart);
    return cfg.pe === true;
  } catch {
    return isPrimary;
  }
}

function writePaymentsEnabled(description: string | null, enabled: boolean): string {
  // Strip any existing prefix
  const existing = description ?? "";
  const clean = existing.startsWith(PREFIX)
    ? existing.slice(existing.indexOf("\n") + 1).trimStart()
    : existing;
  const prefix = `${PREFIX}${JSON.stringify({ pe: enabled })}`;
  return clean ? `${prefix}\n${clean}` : prefix;
}

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

// ─── Public: resolve payment status for a lead's website ─────────────────

/**
 * Used by the public summary page to determine if the payment UI should be shown.
 * Falls back to enabled=true if no website is set (legacy leads).
 */
export const getLeadWebsitePaymentStatus = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => z.object({ leadCode: z.string().min(3).max(80) }).parse(i))
  .handler(async ({ data }) => {
    const admin = await getAdmin();
    const { findLeadByCode } = await import("@/lib/leads/lead-lookup.server");
    const lead = await findLeadByCode(data.leadCode, "website_id");
    const websiteId: string | null = lead?.website_id ?? null;

    if (!websiteId) {
      // Legacy lead with no website_id → always allow payment
      return { paymentsEnabled: true, websiteId: null };
    }

    const { data: web } = await admin
      .from("websites")
      .select("id, name, domain, is_primary, description")
      .eq("id", websiteId)
      .maybeSingle();

    if (!web) return { paymentsEnabled: true, websiteId };

    const isPrimary = !!(web as any).is_primary;
    const paymentsEnabled = readPaymentsEnabled((web as any).description, isPrimary);
    return { paymentsEnabled, websiteId, name: (web as any).name, domain: (web as any).domain };
  });

// ─── Admin: list all websites with payment status ─────────────────────────

export const listWebsitePaymentStatuses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertRole(context.supabase, ["super_admin", "admin", "manager", "operations"]);
    const admin = await getAdmin();

    // NO is_active filter — show all websites so admin can control any of them
    const { data: websites, error } = await admin
      .from("websites")
      .select("id, name, domain, is_primary, is_active, description, sort_order")
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);

    return {
      websites: (websites ?? []).map((w: any) => ({
        id: w.id,
        name: w.name,
        domain: w.domain,
        isPrimary: !!w.is_primary,
        isActive: !!w.is_active,
        paymentsEnabled: readPaymentsEnabled(w.description, !!w.is_primary),
      })),
    };
  });

// ─── Admin: toggle payments_enabled for a specific website ────────────────

export const setWebsitePaymentsEnabled = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({ websiteId: z.string().uuid(), enabled: z.boolean() }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, ["super_admin", "admin"]);
    const admin = await getAdmin();

    // Read current description so we can preserve its human-readable portion
    const { data: web, error: fetchErr } = await admin
      .from("websites")
      .select("description")
      .eq("id", data.websiteId)
      .maybeSingle();
    if (fetchErr) throw new Error(fetchErr.message);

    const newDescription = writePaymentsEnabled((web as any)?.description ?? null, data.enabled);

    const { error } = await admin
      .from("websites")
      .update({ description: newDescription })
      .eq("id", data.websiteId);
    if (error) throw new Error(error.message);

    return { ok: true, enabled: data.enabled };
  });
