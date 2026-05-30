import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { SERVICE_LABELS, INDIAN_STATES, LANGUAGES, computeAmounts } from "./constants";

const LeadInput = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  state: z.enum(INDIAN_STATES as [string, ...string[]]),
  language: z.enum(LANGUAGES as [string, ...string[]]),
  service: z.enum(SERVICE_LABELS as unknown as [string, ...string[]]),
  consent: z.literal(true, { message: "You must accept the terms to proceed" }),
});

export const createLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => LeadInput.parse(input))
  .handler(async ({ data }) => {
    const base = 99; // dynamic pricing placeholder — all services ₹99 for now
    const { baseAmount, gstAmount, totalAmount } = computeAmounts(base);

    const { data: row, error } = await supabaseAdmin
      .from("leads")
      .insert({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        state: data.state,
        language: data.language,
        service: data.service,
        base_amount: baseAmount,
        gst_amount: gstAmount,
        total_amount: totalAmount,
        status: "payment_pending",
      })
      .select("id, lead_code, base_amount, gst_amount, total_amount")
      .single();

    if (error || !row) {
      throw new Error(error?.message ?? "Could not save your details. Please try again.");
    }

    return {
      leadId: row.id,
      leadCode: row.lead_code as string,
      baseAmount: Number(row.base_amount),
      gstAmount: Number(row.gst_amount),
      totalAmount: Number(row.total_amount),
    };
  });
