import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertRole, writeAudit } from "@/lib/audit";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}


// We do NOT use PostgREST nested selects because the DB has no FK constraints.
// Fetch certificates, then hydrate leads/applications manually.

async function hydrate(rows: any[]) {
  if (rows.length === 0) return [];
  const leadIds = Array.from(new Set(rows.map((r) => r.lead_id).filter(Boolean)));
  const appIds = Array.from(new Set(rows.map((r) => r.application_id).filter(Boolean)));
  const [leadsRes, appsRes] = await Promise.all([
    leadIds.length
      ? (await getAdmin()).from("leads").select("id, name, email, mobile, lead_code, service").in("id", leadIds)
      : Promise.resolve({ data: [] as any[] }),
    appIds.length
      ? (await getAdmin()).from("applications").select("id, application_code, application_status").in("id", appIds)
      : Promise.resolve({ data: [] as any[] }),
  ]);
  const leadMap = new Map((leadsRes.data ?? []).map((l: any) => [l.id, l]));
  const appMap = new Map((appsRes.data ?? []).map((a: any) => [a.id, a]));
  return rows.map((r) => ({
    ...r,
    lead: r.lead_id ? leadMap.get(r.lead_id) ?? null : null,
    application: r.application_id ? appMap.get(r.application_id) ?? null : null,
  }));
}

export const listCertificates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({
    delivered: z.enum(["all", "yes", "no"]).default("all"),
    search: z.string().optional(),
  }))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, ["super_admin", "admin", "operations", "support", "accounts", "finance", "manager", "executive"]);
    let q = (await getAdmin()).from("certificates").select("*").order("created_at", { ascending: false });
    if (data.delivered === "yes") q = q.not("delivered_at", "is", null);
    if (data.delivered === "no") q = q.is("delivered_at", null);
    const { data: rows, error } = await q.limit(500);
    if (error) throw new Error(error.message);
    let hydrated = await hydrate(rows ?? []);
    if (data.search) {
      const s = data.search.toLowerCase();
      hydrated = hydrated.filter((r: any) =>
        r.certificate_number?.toLowerCase().includes(s) ||
        r.lead?.name?.toLowerCase().includes(s) ||
        r.lead?.email?.toLowerCase().includes(s) ||
        r.lead?.lead_code?.toLowerCase().includes(s)
      );
    }
    return { rows: hydrated };
  });

export const uploadCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({
    applicationId: z.string().min(1),
    fileBase64: z.string(),
    fileName: z.string(),
    mimeType: z.string().default("application/pdf"),
    certificateNumber: z.string().optional(),
  }))
  .handler(async ({ data, context }) => {
    const user = await assertRole(context.supabase, ["super_admin", "admin", "operations"]);
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.applicationId);
    const lookup = (await getAdmin()).from("applications").select("id, lead_id");
    const { data: app } = isUuid
      ? await lookup.eq("id", data.applicationId).single()
      : await lookup.eq("application_code", data.applicationId).single();
    if (!app) throw new Error("Application not found");

    const buffer = Uint8Array.from(atob(data.fileBase64), (c) => c.charCodeAt(0));
    const path = `certificates/${app.id}/${Date.now()}-${data.fileName}`;
    const { error: upErr } = await (await getAdmin()).storage
      .from("documents")
      .upload(path, buffer, { contentType: data.mimeType, upsert: false });
    if (upErr) throw new Error(upErr.message);

    const { data: cert, error: insErr } = await (await getAdmin())
      .from("certificates")
      .insert({
        application_id: app.id,
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
    const { data: cert } = await (await getAdmin())
      .from("certificates")
      .select("*")
      .eq("id", data.certificateId)
      .single();
    if (!cert) throw new Error("Certificate not found");
    if (cert.delivered_at) throw new Error("Already delivered");
    if (!cert.file_path) throw new Error("Certificate has no file");

    const [{ data: lead }, { data: app }] = await Promise.all([
      cert.lead_id
        ? (await getAdmin()).from("leads").select("id, name, email").eq("id", cert.lead_id).single()
        : Promise.resolve({ data: null as any }),
      cert.application_id
        ? (await getAdmin()).from("applications").select("id, application_code").eq("id", cert.application_id).single()
        : Promise.resolve({ data: null as any }),
    ]);

    const { data: signed } = await (await getAdmin()).storage
      .from("documents")
      .createSignedUrl(cert.file_path, 60 * 60 * 24 * 7);

    if (!lead?.email) {
      throw new Error("No email address on file for this customer — certificate was not delivered.");
    }
    if (!signed?.signedUrl) {
      throw new Error("Could not generate certificate download link — certificate was not delivered.");
    }

    if (lead.email && signed.signedUrl) {
      // Try to attach the actual file (PDF/JPG/PNG) to the email.
      let attachment: { filename: string; content_type: string; content_base64: string } | null = null;
      try {
        const { data: blob, error: dlErr } = await (await getAdmin()).storage
          .from("documents")
          .download(cert.file_path);
        if (dlErr) throw dlErr;
        if (blob) {
          const buf = Buffer.from(await blob.arrayBuffer());
          if (buf.byteLength <= 9 * 1024 * 1024) {
            const ext = ((cert as any).file_name?.split(".").pop() || "pdf").toLowerCase();
            attachment = {
              filename: `${cert.certificate_number || app?.application_code || "certificate"}.${ext}`,
              content_type: (cert as any).mime_type || "application/octet-stream",
              content_base64: buf.toString("base64"),
            };
          } else {
            console.warn("[certificate.deliver] attachment skipped: file >9MB", buf.byteLength);
          }
        }
      } catch (e) {
        console.warn("[certificate.deliver] attachment skipped: download failed", e);
      }

      const subject = `Your Udyam Certificate is ready — Order ${app?.application_code ?? ""}`;
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#0f3460">Your certificate is ready</h2>
          <p>Dear ${lead.name},</p>
          <p>Your Udyam Registration certificate has been issued and is ready to download.</p>
          <p>The certificate is also attached to this email as a file.</p>
          <p style="text-align:center;margin:32px 0">
            <a href="${signed.signedUrl}" style="background:#0f3460;color:white;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:600">
              Download Certificate
            </a>
          </p>
          <p style="font-size:12px;color:#666">Link valid for 7 days. Save the file locally for future reference.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
          <p style="font-size:12px;color:#999">Order: ${app?.application_code ?? "—"}</p>
        </div>`;
      const { enqueueEmailInternal } = await import("@/lib/emails/emails.server");
      await enqueueEmailInternal({
        templateCode: "certificate_delivery",
        toEmail: lead.email,
        toName: lead.name,
        subject,
        bodyHtml: html,
        leadId: lead.id,
        applicationId: app?.id ?? null,
        variables: {
          certificateId: cert.id,
          certificate_number: cert.certificate_number ?? "",
          certificate_url: signed.signedUrl,
          order_code: app?.application_code ?? "",
        },
        attachments: attachment ? [attachment] : undefined,
        requireImmediateSuccess: true,
      });
    }

    await (await getAdmin())
      .from("certificates")
      .update({ delivered_at: new Date().toISOString() })
      .eq("id", data.certificateId);

    if (app?.id) {
      const { transitionStatusSystem } = await import("@/lib/applications/transitions.server");
      // Cascade only after the certificate email has actually been accepted.
      for (const next of ["certificate_uploaded", "certificate_ready", "completed"] as const) {
        const tr = await transitionStatusSystem({
          applicationId: app.id,
          toStatus: next,
          reason: `Certificate delivered (${next})`,
          force: true,
        });
        if (!tr.ok) console.warn("[certificates] cascade step skipped:", next, tr.reason);
      }
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
    const { data: cert } = await (await getAdmin())
      .from("certificates")
      .select("file_path")
      .eq("id", data.certificateId)
      .single();
    if (!cert || !cert.file_path) throw new Error("Not found");
    const { data: signed } = await (await getAdmin()).storage
      .from("documents")
      .createSignedUrl(cert.file_path, 60 * 10);
    return { url: signed?.signedUrl };
  });
