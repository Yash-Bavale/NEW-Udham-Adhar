import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { assertRole } from "@/lib/audit";
import { render } from "@react-email/render";
import { TEMPLATES } from "../email-templates/registry";
import React from "react";

export const listLeadEmails = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ leadId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, ["super_admin", "operations", "admin", "support"]);

    const { data: logs, error: logErr } = await supabaseAdmin
      .from("email_logs")
      .select("*")
      .eq("lead_id", data.leadId)
      .order("sent_at", { ascending: false });

    if (logErr) throw new Error(logErr.message);

    const { data: queue, error: queueErr } = await supabaseAdmin
      .from("email_queue")
      .select("*")
      .eq("lead_id", data.leadId)
      .order("created_at", { ascending: false });

    if (queueErr) throw new Error(queueErr.message);

    return { logs: logs || [], queue: queue || [] };
  });

const SendEmailSchema = z.object({
  leadId: z.string().uuid(),
  templateCode: z.string(),
  variables: z.record(z.string(), z.any()),
  toEmail: z.string().email().optional(),
});

export const sendLeadEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => SendEmailSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, ["super_admin", "operations", "admin"]);
    const { leadId, templateCode, variables, toEmail } = data;

    const entry = TEMPLATES[templateCode];
    if (!entry) throw new Error("Invalid template code");

    // Fetch lead details for defaults
    const { data: lead } = await supabaseAdmin
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (!lead) throw new Error("Lead not found");

    const finalTo = toEmail || lead.email;
    const finalVars = {
      customerName: lead.name,
      orderNumber: lead.lead_code,
      formLink: `https://${process.env.LOVABLE_APP_DOMAIN || 'udyamadhar.in'}/onboarding/${lead.lead_code}`,
      ...variables
    };

    const subject = typeof entry.subject === "function" 
      ? entry.subject(finalVars)
      : entry.subject;

    const html = await render(React.createElement(entry.component, finalVars));

    const { error } = await supabaseAdmin
      .from("email_queue")
      .insert({
        lead_id: leadId,
        to_email: finalTo,
        subject,
        body_html: html,
        template_code: templateCode,
        variables: finalVars,
        created_by: context.userId,
      });

    if (error) throw new Error(error.message);

    return { ok: true };
  });
