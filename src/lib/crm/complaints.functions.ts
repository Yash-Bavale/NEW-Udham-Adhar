import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const listComplaints = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("complaints")
      .select(
        "id, complaint_number, status, notes, submitted_at, created_at, updated_at, lead_id, application_id"
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);

    const leadIds = Array.from(new Set((data ?? []).map((c) => c.lead_id).filter(Boolean)));
    let leadsMap: Record<string, { name: string; email: string; mobile: string }> = {};
    if (leadIds.length > 0) {
      const { data: leads } = await supabase
        .from("leads")
        .select("id, name, email, mobile")
        .in("id", leadIds as string[]);
      (leads ?? []).forEach((l) => {
        leadsMap[l.id] = { name: l.name, email: l.email, mobile: l.mobile };
      });
    }

    return {
      rows: (data ?? []).map((c) => ({
        ...c,
        lead: c.lead_id ? leadsMap[c.lead_id] ?? null : null,
      })),
    };
  });

export const updateComplaintStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: "pending" | "in_progress" | "resolved" | "closed" }) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "in_progress", "resolved", "closed"]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const patch: Record<string, unknown> = { status: data.status };
    if (data.status === "resolved" || data.status === "closed") {
      patch.resolved_at = new Date().toISOString();
    }
    const { error } = await supabase.from("complaints").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
