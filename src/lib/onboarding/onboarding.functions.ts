import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  MAX_DOC_SIZE_BYTES,
  ALLOWED_DOC_MIME,
  type OnboardingSchema,
} from "./schemas";
import { SERVICES } from "@/lib/constants";

const DEFAULT_ADMIN_EMAIL = "help@businesshelpservices.com";

const LeadCode = z.string().trim().regex(/^[A-Z]{2}-\d{4}-\d{6}$/, "Invalid reference code");

async function loadLeadByCode(admin: any, leadCode: string) {
  const { data, error } = await admin
    .from("leads")
    .select("id, lead_code, name, email, mobile, service, status, total_amount")
    .eq("lead_code", leadCode)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("We couldn't find that reference. Please double-check the link.");
  return data;
}


function serviceCodeFromLabel(serviceLabel: string | null): string {
  if (!serviceLabel) return "new-udyam-registration";
  const normalized = serviceLabel
    .trim()
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ");

  const aliases: Record<string, string> = {
    "new udyam registration": "new-udyam-registration",
    "new business help services": "new-udyam-registration",
    "update udyam certificate": "update-udyam-certificate",
    "download udyam certificate": "download-udyam-certificate",
    "udyam registration certificate download": "download-udyam-certificate",
    migrate: "migrate-udyog-aadhaar-to-udyam",
    "udyog aadhaar to udyam migration": "migrate-udyog-aadhaar-to-udyam",
    "udyog aadhar to udyam migration": "migrate-udyog-aadhaar-to-udyam",
    "forgot registered mobile / email": "forgot-mobile-email",
    "forgot registered mobile/email": "forgot-mobile-email",
    "correct pan / aadhaar name in udyam": "correct-pan-aadhaar",
    "correct pan / aadhar name in udyam": "correct-pan-aadhaar",
    "talk to expert": "talk-to-expert",
    "talk to expert - suitable service selection": "talk-to-expert",
    "expert consultation": "talk-to-expert",
  };

  const match = SERVICES.find((s) => s.label.trim().toLowerCase().replace(/[–—]/g, "-") === normalized);
  return aliases[normalized] ?? match?.slug ?? "new-udyam-registration";
}

/** Public: read everything needed to render the onboarding form. */
export const getOnboarding = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => z.object({ leadCode: LeadCode }).parse(i))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { loadServiceSchema } = await import("@/lib/forms/schema-loader.server");
    const lead = await loadLeadByCode(supabaseAdmin, data.leadCode);
    const serviceCode = serviceCodeFromLabel(lead.service);
    const schema: OnboardingSchema = await loadServiceSchema(serviceCode);

    const [submissionRes, docsRes, paidPaymentRes] = await Promise.all([
      supabaseAdmin
        .from("onboarding_submissions")
        .select("id, form_data, status, submitted_at, updated_at")
        .eq("lead_id", lead.id)
        .maybeSingle(),
      supabaseAdmin
        .from("documents")
        .select("id, doc_type, file_name, mime_type, size_bytes, status, remarks, uploaded_at")
        .eq("lead_id", lead.id)
        .order("uploaded_at", { ascending: false }),
      supabaseAdmin
        .from("payments")
        .select("id")
        .eq("lead_id", lead.id)
        .eq("status", "paid")
        .limit(1)
        .maybeSingle(),
    ]);

    if (submissionRes.error) throw new Error(submissionRes.error.message);
    if (docsRes.error) throw new Error(docsRes.error.message);

    const paid =
      !!paidPaymentRes.data ||
      lead.status === "payment_successful" ||
      lead.status === "under_process" ||
      lead.status === "completed";

    return {
      lead: {
        leadCode: lead.lead_code,
        name: lead.name,
        email: lead.email,
        mobile: lead.mobile,
        service: lead.service,
        status: lead.status,
        paid,
      },
      serviceCode,
      schema,
      submission: submissionRes.data,
      documents: docsRes.data ?? [],
    };
  });

const SubmitInput = z.object({
  leadCode: LeadCode,
  data: z.record(z.string().min(1).max(80), z.union([z.string().max(2000), z.number(), z.boolean(), z.null()])),
  draft: z.boolean().optional(),
});

/** Public: save / submit the form data. Validates against the service schema. */
export const submitOnboarding = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => SubmitInput.parse(i))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { loadServiceSchema } = await import("@/lib/forms/schema-loader.server");
    const lead = await loadLeadByCode(supabaseAdmin, data.leadCode);
    const serviceCode = serviceCodeFromLabel(lead.service);
    const schema = await loadServiceSchema(serviceCode);

    // For correct-pan-aadhaar: Stage 2 submit only carries Stage 2 values; merge
    // with the previously-saved Stage 1 draft and validate against both schemas.
    let mergedData: Record<string, any> = { ...data.data };
    let validationFields = schema.fields;
    if (!data.draft && serviceCode === "correct-pan-aadhaar") {
      const { data: prev } = await supabaseAdmin
        .from("onboarding_submissions")
        .select("form_data")
        .eq("lead_id", lead.id)
        .maybeSingle();
      const prevData = (prev?.form_data ?? {}) as Record<string, any>;
      mergedData = { ...prevData, ...mergedData };
      const { CORRECT_PAN_AADHAAR_STAGE2 } = await import("./schemas");
      const seen = new Set<string>();
      validationFields = [...schema.fields, ...CORRECT_PAN_AADHAAR_STAGE2.fields].filter((f) => {
        if (seen.has(f.key)) return false;
        seen.add(f.key);
        return true;
      });
    }

    // Validate required fields on submit
    if (!data.draft) {
      const missing: string[] = [];
      for (const f of validationFields) {
        if (!f.required) continue;
        const v = mergedData[f.key];
        if (v === undefined || v === null || String(v).trim() === "") missing.push(f.label);
      }
      if (missing.length) throw new Error("Please fill: " + missing.slice(0, 4).join(", ") + (missing.length > 4 ? "…" : ""));

      // Pattern validation
      for (const f of validationFields) {
        if (!f.pattern) continue;
        const v = mergedData[f.key];
        if (v === undefined || v === null || String(v).trim() === "") continue;
        if (!new RegExp(f.pattern).test(String(v))) {
          throw new Error(`Invalid format for ${f.label}.`);
        }
      }
    }


    // Find latest application (if any) to link
    const { data: app } = await supabaseAdmin
      .from("applications")
      .select("id")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const now = new Date().toISOString();
    const { error } = await supabaseAdmin
      .from("onboarding_submissions")
      .upsert(
        {
          lead_id: lead.id,
          application_id: app?.id ?? null,
          service_code: serviceCode,
          form_data: mergedData,
          status: data.draft ? "draft" : "submitted",
          submitted_at: data.draft ? null : now,
        },
        { onConflict: "lead_id" },
      );
    if (error) throw new Error(error.message);

    if (!data.draft && app?.id) {
      // form_status is a free-text column managed alongside the audited status transition
      await supabaseAdmin
        .from("applications")
        .update({ form_status: "submitted" })
        .eq("id", app.id);
      const { transitionStatusSystem } = await import("@/lib/applications/transitions.server");
      const tr = await transitionStatusSystem({
        applicationId: app.id,
        toStatus: "details_pending",
        reason: "Onboarding details submitted",
      });
      if (!tr.ok) console.warn("[onboarding] transition skipped:", tr.reason);
    }

    // Fire completion emails on final submit (best-effort, never blocks)
    if (!data.draft) {
      const { count: docCount } = await supabaseAdmin
        .from("documents")
        .select("id", { count: "exact", head: true })
        .eq("lead_id", lead.id);

      const { data: smtp } = await supabaseAdmin
        .from("smtp_settings")
        .select("reply_to")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      const adminTo = smtp?.reply_to ?? DEFAULT_ADMIN_EMAIL;

      const { enqueueEmailInternal } = await import("@/lib/emails/emails.server");
      await enqueueEmailInternal({
        toEmail: adminTo,
        subject: `Onboarding submitted: ${lead.lead_code ?? lead.name ?? "Lead"}`,
        bodyHtml: `<p>Customer onboarding was submitted.</p><p><b>Name:</b> ${lead.name ?? ""}<br/><b>Lead:</b> ${lead.lead_code ?? ""}<br/><b>Service:</b> ${lead.service ?? ""}<br/><b>Documents:</b> ${docCount ?? 0}</p>`,
        leadId: lead.id,
        applicationId: app?.id ?? undefined,
      }).catch((e: unknown) => console.error("admin onboarding notification failed:", e));
    }

    return { ok: true };
  });

const UploadReqInput = z.object({
  leadCode: LeadCode,
  docType: z.string().trim().min(1).max(60),
  fileName: z.string().trim().min(1).max(200),
  mimeType: z.string().trim().min(1).max(120),
  sizeBytes: z.number().int().min(1).max(MAX_DOC_SIZE_BYTES, `File too large. Max ${Math.round(MAX_DOC_SIZE_BYTES / 1024 / 1024)} MB.`),
});

/** Public: get a short-lived signed upload URL. Validates type + size first. */
export const requestDocumentUpload = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => UploadReqInput.parse(i))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await import("@/lib/forms/schema-loader.server");
    if (!ALLOWED_DOC_MIME.includes(data.mimeType.toLowerCase())) {
      throw new Error("Unsupported file type. Use PDF, JPG, PNG or WEBP.");
    }
    const lead = await loadLeadByCode(supabaseAdmin, data.leadCode);
    const ext = (data.fileName.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 6) || "bin";
    const safeDocType = data.docType.replace(/[^a-z0-9_-]/gi, "_").slice(0, 40);
    const path = `${lead.id}/${safeDocType}-${Date.now()}.${ext}`;

    const { data: signed, error } = await supabaseAdmin
      .storage
      .from("documents")
      .createSignedUploadUrl(path);
    if (error || !signed) throw new Error(error?.message ?? "Could not start upload.");

    return { path, token: signed.token, signedUrl: signed.signedUrl };
  });

const ConfirmInput = z.object({
  leadCode: LeadCode,
  docType: z.string().min(1).max(60),
  filePath: z.string().min(1).max(400),
  fileName: z.string().min(1).max(200),
  mimeType: z.string().min(1).max(120),
  sizeBytes: z.number().int().min(1).max(MAX_DOC_SIZE_BYTES),
});

/** Public: after upload completes, register the file row. Replaces any earlier row for the same doc_type. */
export const confirmDocumentUpload = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => ConfirmInput.parse(i))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await import("@/lib/forms/schema-loader.server");
    const lead = await loadLeadByCode(supabaseAdmin, data.leadCode);

    // Find any existing doc of same type to replace (keeps storage tidy)
    const { data: existing } = await supabaseAdmin
      .from("documents")
      .select("id, file_path")
      .eq("lead_id", lead.id)
      .eq("doc_type", data.docType);

    if (existing && existing.length) {
      const oldPaths = existing.map((r) => r.file_path);
      await supabaseAdmin.storage.from("documents").remove(oldPaths);
      await supabaseAdmin.from("documents").delete().in("id", existing.map((r) => r.id));
    }

    const { data: app } = await supabaseAdmin
      .from("applications")
      .select("id")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { error } = await supabaseAdmin.from("documents").insert({
      lead_id: lead.id,
      application_id: app?.id ?? null,
      doc_type: data.docType,
      file_path: data.filePath,
      file_name: data.fileName,
      mime_type: data.mimeType,
      size_bytes: data.sizeBytes,
      status: "pending",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ───────────────────────────────────── Admin ─────────────────────────────────────

export const listOnboardingForLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ leadId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await import("@/integrations/supabase/client.server");
    const { supabase } = context;
    const [subRes, docRes] = await Promise.all([
      supabase
        .from("onboarding_submissions")
        .select("id, service_code, form_data, status, submitted_at, updated_at")
        .eq("lead_id", data.leadId)
        .maybeSingle(),
      supabase
        .from("documents")
        .select("id, doc_type, file_name, file_path, mime_type, size_bytes, status, remarks, uploaded_at, verified_at")
        .eq("lead_id", data.leadId)
        .order("uploaded_at", { ascending: false }),
    ]);
    if (subRes.error) throw new Error(subRes.error.message);
    if (docRes.error) throw new Error(docRes.error.message);
    return { submission: subRes.data, documents: docRes.data ?? [] };
  });

export const getDocumentSignedUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { supabase } = context;
    const { data: doc, error } = await supabase
      .from("documents")
      .select("file_path")
      .eq("id", data.id)
      .single();
    if (error || !doc) throw new Error(error?.message ?? "Document not found.");
    const { data: signed, error: sErr } = await supabaseAdmin
      .storage
      .from("documents")
      .createSignedUrl(doc.file_path, 60 * 10);
    if (sErr || !signed) throw new Error(sErr?.message ?? "Could not generate link.");
    return { url: signed.signedUrl };
  });

export const setDocumentStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["pending", "approved", "rejected"]),
      remarks: z.string().max(500).optional().nullable(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await import("@/integrations/supabase/client.server");
    const { supabase, userId } = context;
    const verified = data.status === "approved";
    const { error } = await supabase
      .from("documents")
      .update({
        status: data.status,
        remarks: data.remarks ?? null,
        verified_by: verified ? userId : null,
        verified_at: verified ? new Date().toISOString() : null,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Public: customer pressed "Contact our team for help" on the onboarding shell.
 *  Logs an activity so the CRM lead timeline shows the request. Best-effort. */
export const requestFormHelp = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => z.object({ leadCode: LeadCode }).parse(i))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const lead = await loadLeadByCode(supabaseAdmin, data.leadCode);
    await supabaseAdmin.from("activity_logs").insert({
      lead_id: lead.id,
      activity_type: "form_help_requested",
      activity_description:
        "Customer requested help submitting the onboarding form. Please contact them on the registered mobile number.",
    });
    return { ok: true };
  });
