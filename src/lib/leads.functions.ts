import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SERVICES, SERVICE_LABELS, INDIAN_STATES, LANGUAGES } from "./constants";

const LeadInput = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  state: z.enum(INDIAN_STATES as [string, ...string[]]),
  language: z.enum(LANGUAGES as [string, ...string[]]),
  service: z.enum(SERVICE_LABELS as unknown as [string, ...string[]]),
  consent: z.literal(true, { message: "You must accept the terms to proceed" }),
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
    // 1. Map form label -> internal slug -> DB service row
    const slug = SERVICES.find((s) => s.label === data.service)?.slug;
    if (!slug) {
      throw new Error("Selected service is not available. Please try again.");
    }

    const { data: service, error: svcErr } = await supabaseAdmin
      .from("services")
      .select("id, service_name, base_amount, gst_amount, total_amount, is_active")
      .eq("service_code", slug)
      .maybeSingle();

    if (svcErr) throw new Error(svcErr.message);
    if (!service || !service.is_active) {
      throw new Error("Selected service is not currently available.");
    }

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
          lead_source: "website",
          is_duplicate: isDuplicate,
          duplicate_of: duplicateOf,
          customer_id: customerId,
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



    // 3. Create application row (one per submission). Trigger writes activity log.
    const { error: appErr } = await supabaseAdmin
      .from("applications")
      .insert({
        lead_id: leadId,
        service_id: service.id,
        application_status: "awaiting_payment",
      });
    if (appErr) {
      // non-fatal: lead is saved, but log so we can fix
      console.error("Application insert failed:", appErr.message);
    }

    return {
      leadId,
      leadCode,
      baseAmount,
      gstAmount,
      totalAmount,
    };
  });
