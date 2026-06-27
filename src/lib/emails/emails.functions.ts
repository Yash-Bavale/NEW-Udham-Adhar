import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ─────────────────────────── Admin server fns ───────────────────────────

export const getEmailDashboard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    type QStatus = "queued" | "sending" | "sent" | "failed" | "dlq";
    const counts = async (status: QStatus) => {
      const { count } = await supabase
        .from("email_queue")
        .select("*", { count: "exact", head: true })
        .eq("status", status);
      return count ?? 0;
    };

    const [queued, sending, dlq, sent24h, sent7d, recentLogs, topErrors] = await Promise.all([
      counts("queued"),
      counts("sending"),
      counts("dlq"),
      supabase.from("email_logs").select("*", { count: "exact", head: true }).eq("status", "sent").gte("sent_at", since24h).then((r) => r.count ?? 0),
      supabase.from("email_logs").select("*", { count: "exact", head: true }).eq("status", "sent").gte("sent_at", since7d).then((r) => r.count ?? 0),
      supabase.from("email_logs").select("id, to_email, subject, status, error_message, smtp_response, sent_at, template_code").order("sent_at", { ascending: false }).limit(20),
      supabase.from("email_queue").select("id, to_email, subject, last_error, attempts").eq("status", "dlq").order("updated_at", { ascending: false }).limit(10),
    ]);

    return {
      counts: { queued, sending, dlq, sent24h, sent7d },
      recentLogs: recentLogs.data ?? [],
      dlqRows: topErrors.data ?? [],
    };
  });

export const getSmtpSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("smtp_settings")
      .select("id, from_email, from_name, reply_to, daily_quota, is_enabled, notes, updated_at")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return {
      settings: data,
      hasSmtpHost: Boolean(process.env.SMTP_HOST),
      hasSmtpUser: Boolean(process.env.SMTP_USER),
      hasSmtpPass: Boolean(process.env.SMTP_PASS),
    };
  });

const SmtpInput = z.object({
  from_email: z.string().email().max(160),
  from_name: z.string().trim().min(1).max(120),
  reply_to: z.string().email().max(160).nullable().optional(),
  daily_quota: z.number().int().min(0).max(100_000),
  is_enabled: z.boolean(),
  notes: z.string().max(1000).nullable().optional(),
});

export const saveSmtpSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => SmtpInput.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase.from("smtp_settings").select("id").order("updated_at", { ascending: false }).limit(1).maybeSingle();
    const payload = { ...data, updated_by: userId };
    if (existing) {
      const { error } = await supabase.from("smtp_settings").update(payload).eq("id", existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("smtp_settings").insert(payload);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const sendTestEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({ toEmail: z.string().email(), subject: z.string().min(1).max(200).optional() }).parse(i),
  )
  .handler(async ({ data }) => {
    const { enqueueEmailInternal, processQueueInternal } = await import("./emails.server");
    await enqueueEmailInternal({
      toEmail: data.toEmail,
      subject: data.subject ?? "SMTP test from Business Help Services",
      bodyHtml:
        "<p>This is a test email sent from the admin email console.</p><p>If you received this, SMTP is configured correctly.</p>",
      bodyText: "This is a test email. If you received this, SMTP is configured correctly.",
    });
    // Process immediately so admin sees feedback fast
    const result = await processQueueInternal(5);
    return { queued: true, ...result };
  });

export const processEmailQueueNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { processQueueInternal } = await import("./emails.server");
    return await processQueueInternal(50);
  });

// ── Template management ──
export const listEmailTemplates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("email_templates")
      .select("id, code, name, subject, body_html, body_text, description, variables, is_enabled, is_system, updated_at, disabled_reason, last_toggled_by, last_toggled_at, last_sent_at, total_sent")
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });

export const toggleEmailTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        code: z.string().min(1),
        enabled: z.boolean(),
        reason: z.string().trim().max(500).optional(),
      })
      .parse(i)
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const [{ data: isAdmin }, { data: isSuper }] = await Promise.all([
      supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
      supabase.rpc("has_role", { _user_id: userId, _role: "super_admin" }),
    ]);
    if (!isAdmin && !isSuper) throw new Error("Forbidden");
    const patch: Record<string, unknown> = {
      is_enabled: data.enabled,
      disabled_reason: data.enabled ? null : data.reason ?? null,
      last_toggled_by: userId,
      last_toggled_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("email_templates").update(patch as never).eq("code", data.code);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const TemplateInput = z.object({
  id: z.string().uuid().optional(),
  code: z.string().trim().min(2).max(80).regex(/^[a-z0-9_]+$/, "code must be lowercase a-z, 0-9, _"),
  name: z.string().trim().min(2).max(120),
  subject: z.string().trim().min(2).max(200),
  body_html: z.string().min(2).max(50_000),
  body_text: z.string().max(50_000).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  variables: z.array(z.string().max(60)).max(50).default([]),
  is_enabled: z.boolean().default(true),
});

export const saveEmailTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => TemplateInput.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    if (data.id) {
      const { id, ...patch } = data;
      const { error } = await supabase.from("email_templates").update(patch).eq("id", id);
      if (error) throw new Error(error.message);
      return { ok: true, id };
    }
    const { data: row, error } = await supabase
      .from("email_templates")
      .insert({ ...data, created_by: userId })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, id: row.id };
  });

export const duplicateEmailTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: src, error } = await supabase.from("email_templates").select("*").eq("id", data.id).single();
    if (error || !src) throw new Error(error?.message ?? "Template not found");
    const newCode = `${src.code}_copy_${Date.now().toString(36)}`.slice(0, 80);
    const { data: row, error: insErr } = await supabase
      .from("email_templates")
      .insert({
        code: newCode,
        name: `${src.name} (copy)`,
        subject: src.subject,
        body_html: src.body_html,
        body_text: src.body_text,
        description: src.description,
        variables: src.variables,
        is_enabled: false,
        is_system: false,
        created_by: userId,
      })
      .select("id")
      .single();
    if (insErr) throw new Error(insErr.message);
    return { ok: true, id: row.id };
  });

export const deleteEmailTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: src } = await supabase.from("email_templates").select("is_system").eq("id", data.id).maybeSingle();
    if (src?.is_system) throw new Error("System templates cannot be deleted. Disable instead.");
    const { error } = await supabase.from("email_templates").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ── Logs ──
const LogsInput = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(50),
  search: z.string().trim().max(200).optional(),
  status: z.enum(["sent", "failed", "bounced"]).optional(),
});

export const listEmailLogs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => LogsInput.parse(i ?? {}))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const from = (data.page - 1) * data.pageSize;
    const to = from + data.pageSize - 1;
    let q = supabase
      .from("email_logs")
      .select("id, to_email, subject, status, error_message, smtp_response, attempt, template_code, sent_at", { count: "exact" })
      .order("sent_at", { ascending: false })
      .range(from, to);
    if (data.status) q = q.eq("status", data.status);
    if (data.search) {
      const s = data.search.replace(/[,()]/g, " ").trim();
      q = q.or(`to_email.ilike.%${s}%,subject.ilike.%${s}%`);
    }
    const { data: rows, error, count } = await q;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [], total: count ?? 0, page: data.page, pageSize: data.pageSize };
  });

// ── Send test by template (per-template end-to-end verification) ──
const TestTplInput = z.object({
  code: z.string().trim().min(1).max(80),
  toEmail: z.string().email(),
  variablesJson: z.string().max(10_000).optional(),
});

export const sendTestTemplateEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => TestTplInput.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: tpl, error } = await supabase
      .from("email_templates")
      .select("code, subject, body_html, body_text, variables, is_enabled")
      .eq("code", data.code)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!tpl) throw new Error(`Template '${data.code}' not found`);

    // Build variables: user overrides merged onto auto-generated samples.
    const sampleFor = (k: string): string => {
      const lk = k.toLowerCase();
      if (lk.includes("email")) return data.toEmail;
      if (lk.includes("name")) return "Sample Customer";
      if (lk.includes("phone") || lk.includes("mobile")) return "9876543210";
      if (lk.includes("amount") || lk.includes("price") || lk.includes("total")) return "₹1,499";
      if (lk.includes("date") || lk.includes("time")) return new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      if (lk.includes("order") || lk.includes("application")) return "AP-2026-000000";
      if (lk.includes("invoice")) return "UA-2026-000000";
      if (lk.includes("transaction") || lk.includes("txn") || lk.includes("reference")) return "TXN-TEST-1234567890";
      if (lk.includes("url") || lk.includes("link")) return "https://udyamadhar.in";
      if (lk.includes("service")) return "Download Udyam Certificate";
      if (lk.includes("certificate")) return "UDYAM-XX-00-0000000";
      if (lk.includes("reason")) return "Sample reason for testing";
      return `[Sample ${k}]`;
    };
    const auto: Record<string, string> = {};
    for (const v of (tpl.variables ?? []) as string[]) auto[v] = sampleFor(v);

    let overrides: Record<string, unknown> = {};
    if (data.variablesJson?.trim()) {
      try {
        const parsed = JSON.parse(data.variablesJson);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          overrides = parsed as Record<string, unknown>;
        } else throw new Error("Variables JSON must be an object");
      } catch (e) {
        throw new Error(`Invalid variables JSON: ${(e as Error).message}`);
      }
    }
    const variables = { ...auto, ...overrides };

    const { enqueueFromTemplateInternal, processQueueInternal } = await import("./emails.server");
    // Temporarily allow disabled templates for testing by setting enable=true in memory only.
    if (!tpl.is_enabled) {
      // enqueueFromTemplateInternal would no-op for disabled templates; bypass with raw render.
      const { renderTemplate } = await import("./smtp.server");
      const { enqueueEmailInternal } = await import("./emails.server");
      await enqueueEmailInternal({
        templateCode: tpl.code,
        toEmail: data.toEmail,
        subject: `[TEST] ${renderTemplate(tpl.subject, variables)}`,
        bodyHtml: renderTemplate(tpl.body_html, variables),
        bodyText: tpl.body_text ? renderTemplate(tpl.body_text, variables) : null,
        variables,
      });
    } else {
      await enqueueFromTemplateInternal(tpl.code, data.toEmail, variables);
    }
    const result = await processQueueInternal(5);
    return { ok: true, template: tpl.code, variablesUsed: variables as Record<string, string>, ...result };
  });
