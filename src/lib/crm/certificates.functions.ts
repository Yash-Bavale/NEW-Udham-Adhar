import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { assertRole, writeAudit } from "@/lib/audit";

export const listCertificates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({
    delivered: z.enum(["all", "yes", "no"]).default("all"),
    search: z.string().optional(),
  }))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, ["super_admin", "admin", "operations", "support", "accounts"]);
    let q = supabaseAdmin
      .from("certificates")
      .select("*, lead:leads(id, name, email, mobile, lead_code, service), application:applications(id, application_code, application_status)")
      .order("created_at", { ascending: false });
    if (data.delivered === "yes") q = q.not("delivered_at", "is", null);
    if (data.delivered === "no") q = q.is("delivered_at", null);
    const { data: rows, error } = await q.limit(500);
    if (error) throw new Error(error.message);
    let filtered = rows ?? [];
    if (data.search) {
      const s = data.search.toLowerCase();
      filtered = filtered.filter((r: any) =>
        r.certificate_number?.toLowerCase().includes(s) ||
        r.lead?.name?.toLowerCase().includes(s) ||
        r.lead?.email?.toLowerCase().includes(s) ||
        r.lead?.lead_code?.toLowerCase().includes(s)
      );
    }
    return { rows: filtered };
  });

export const uploadCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({
    applicationId: z.string().uuid(),
    fileBase64: z.string(),
    fileName: z.string(),
    mimeType: z.string().default("application/pdf"),
    certificateNumber: z.string().optional(),
  }))
  .handler(async ({ data, context }) => {
    const user = await assertRole(context.supabase, ["super_admin", "admin", "operations"]);
    const { data: app } = await supabaseAdmin
      .from("applications")
      .select("id, lead_id")
      .eq("id", data.applicationId)
      .single();
    if (!app) throw new Error("Application not found");

    const buffer = Uint8Array.from(atob(data.fileBase64), (c) => c.charCodeAt(0));
    const path = `certificates/${data.applicationId}/${Date.now()}-${data.fileName}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from("documents")
      .upload(path, buffer, { contentType: data.mimeType, upsert: false });
    if (upErr) throw new Error(upErr.message);

    const { data: cert, error: insErr } = await supabaseAdmin
      .from("certificates")
      .insert({
        application_id: data.applicationId,
        lead_id: app.lead_id,
        certificate_number: data.certificateNumber ?? null,
        file_name: data.fileName,
        file_path: path,
        mime_type: data.mimeType,
        uploaded_by: user.id,
        issued_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (insErr) throw new Error(insErr.message);

    await writeAudit({
      supabase: context.supabase, entityType: "certificate", entityId: cert.id,
      action: "certificate_uploaded", newValue: { file_path: path }, actorId: user.id,
    });
    return { certificate: cert };
  });

export const deliverCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ certificateId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const user = await assertRole(context.supabase, ["super_admin", "admin", "operations"]);
    const { data: cert } = await supabaseAdmin
      .from("certificates")
      .select("*, application:applications(id, application_code), lead:leads(id, name, email)")
      .eq("id", data.certificateId)
      .single();
    if (!cert) throw new Error("Certificate not found");
    if (cert.delivered_at) throw new Error("Already delivered");

    const { data: signed } = await supabaseAdmin.storage
      .from("documents")
      .createSignedUrl(cert.file_path, 60 * 60 * 24 * 7);

    await supabaseAdmin
      .from("certificates")
      .update({ delivered_at: new Date().toISOString() })
      .eq("id", data.certificateId);

    if (cert.application?.id) {
      await supabaseAdmin
        .from("applications")
        .update({ application_status: "completed" })
        .eq("id", cert.application.id);
    }

    // Enqueue delivery email
    if (cert.lead?.email && signed?.signedUrl) {
      const subject = `Your Udyam Certificate is ready — Order ${cert.application?.application_code ?? ""}`;
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#0f3460">Your certificate is ready</h2>
          <p>Dear ${cert.lead.name},</p>
          <p>Your Udyam Registration certificate has been issued and is ready to download.</p>
          <p style="text-align:center;margin:32px 0">
            <a href="${signed.signedUrl}" style="background:#0f3460;color:white;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:600">
              Download Certificate
            </a>
          </p>
          <p style="font-size:12px;color:#666">Link valid for 7 days. Save the file locally for future reference.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
          <p style="font-size:12px;color:#999">Order: ${cert.application?.application_code ?? "—"}</p>
        </div>`;
      await supabaseAdmin.from("email_queue").insert({
        to_email: cert.lead.email,
        to_name: cert.lead.name,
        subject,
        body_html: html,
        template_code: "certificate-delivered",
        lead_id: cert.lead.id,
        application_id: cert.application?.id ?? null,
        variables: { certificateId: cert.id },
        created_by: user.id,
      });
    }

    await writeAudit({
      supabase: context.supabase, entityType: "certificate", entityId: cert.id,
      action: "certificate_delivered", newValue: { delivered_at: new Date().toISOString() }, actorId: user.id,
    });
    return { ok: true };
  });

export const getCertificateUrl = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ certificateId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, ["super_admin", "admin", "operations", "support", "accounts"]);
    const { data: cert } = await supabaseAdmin
      .from("certificates")
      .select("file_path")
      .eq("id", data.certificateId)
      .single();
    if (!cert) throw new Error("Not found");
    const { data: signed } = await supabaseAdmin.storage
      .from("documents")
      .createSignedUrl(cert.file_path, 60 * 10);
    return { url: signed?.signedUrl };
  });
