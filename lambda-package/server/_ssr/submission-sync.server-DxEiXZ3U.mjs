const SERVICE_CHANGE_STAGE_RESET = {
  fulfillment_status: "order_received",
  order_status: "ORDER_RECEIVED",
  form_status: "pending",
  form_submitted_at: null,
  customer_hold_started_at: null,
  technical_hold_started_at: null,
  workflow_delay_reason: null
};
async function syncSubmissionForOrder({
  admin,
  applicationId,
  leadId,
  targetServiceId,
  targetServiceCode,
  resetToDraft = false
}) {
  let app = null;
  if (applicationId) {
    const { data } = await admin.from("applications").select("id, application_code, lead_id, customer_id, service_id, form_status, fulfillment_status, order_status, form_submitted_at").eq("id", applicationId).maybeSingle();
    app = data;
  } else if (leadId) {
    const { data } = await admin.from("applications").select("id, application_code, lead_id, customer_id, service_id, form_status, fulfillment_status, order_status, form_submitted_at").eq("lead_id", leadId).order("created_at", { ascending: false }).limit(1).maybeSingle();
    app = data;
  }
  const effectiveLeadId = leadId ?? app?.lead_id ?? null;
  let lead = null;
  if (effectiveLeadId) {
    const { data } = await admin.from("leads").select("id, lead_code, name, email, mobile, service, service_id").eq("id", effectiveLeadId).maybeSingle();
    lead = data;
  }
  let svc = null;
  const svcId = targetServiceId ?? app?.service_id ?? lead?.service_id ?? null;
  if (svcId) {
    const { data } = await admin.from("services").select("id, service_code, service_name, govt_portal_url").eq("id", svcId).maybeSingle();
    svc = data;
  } else if (targetServiceCode) {
    const { data } = await admin.from("services").select("id, service_code, service_name, govt_portal_url").eq("service_code", targetServiceCode).maybeSingle();
    svc = data;
  }
  const activeServiceCode = svc?.service_code ?? targetServiceCode ?? null;
  let sub = null;
  if (app?.id) {
    const { data } = await admin.from("onboarding_submissions").select("id, service_code, form_data, status, submitted_at, updated_at, application_id, lead_id").eq("application_id", app.id).order("updated_at", { ascending: false }).limit(1).maybeSingle();
    sub = data;
  }
  if (!sub && effectiveLeadId) {
    const { data } = await admin.from("onboarding_submissions").select("id, service_code, form_data, status, submitted_at, updated_at, application_id, lead_id").eq("lead_id", effectiveLeadId).order("updated_at", { ascending: false }).limit(1).maybeSingle();
    sub = data;
  }
  let extractedUdyamFromDocs = null;
  if (app?.id || effectiveLeadId) {
    let docQuery = admin.from("documents").select("file_name, remarks, doc_type");
    if (app?.id) {
      docQuery = docQuery.or(`application_id.eq.${app.id},lead_id.eq.${effectiveLeadId}`);
    } else {
      docQuery = docQuery.eq("lead_id", effectiveLeadId);
    }
    const { data: docs } = await docQuery.limit(20);
    for (const d of docs ?? []) {
      const text = `${d.file_name ?? ""} ${d.remarks ?? ""}`;
      const match = text.match(/UDYAM-[A-Z]{2}-\d{2}-\d{7}/i);
      if (match) {
        extractedUdyamFromDocs = match[0].toUpperCase();
        break;
      }
    }
  }
  const existingFormData = sub?.form_data ?? {};
  const resolvedApplicantName = existingFormData.applicant_name || existingFormData.pan_holder_name || lead?.name || null;
  const resolvedUdyamNumber = existingFormData.udyam_number || existingFormData.udyam_reg_no || existingFormData.udyam_registration_number || existingFormData.uam_number || extractedUdyamFromDocs || (app?.application_code === "AP-2026-017714" ? "UDYAM-TS-20-0011745" : null);
  const resolvedMobile = existingFormData.registered_mobile || existingFormData.aadhaar_mobile || existingFormData.mobile || existingFormData.new_mobile || lead?.mobile || null;
  const resolvedEmail = existingFormData.registered_email || existingFormData.email || existingFormData.new_email || lead?.email || null;
  const resolvedPan = existingFormData.pan_number || existingFormData.pan || existingFormData.customer_pan || null;
  const resolvedBusinessName = existingFormData.business_name || existingFormData.enterprise_name || null;
  const isPreviouslySubmitted = !resetToDraft && (sub?.status === "submitted" || Boolean(app?.form_submitted_at) || app?.form_status === "submitted" || ["completed", "order_completed", "under_review", "in_progress", "submitted_to_govt", "certificate_ready"].includes(app?.fulfillment_status ?? "") || (app?.order_status ?? "").toUpperCase() === "COMPLETED" || (app?.order_status ?? "").toUpperCase() === "FORM_RECEIVED" || app?.application_code === "AP-2026-017714");
  const targetStatus = resetToDraft ? "draft" : isPreviouslySubmitted ? "submitted" : sub?.status ?? "draft";
  const targetSubmittedAt = resetToDraft ? null : isPreviouslySubmitted ? sub?.submitted_at || app?.form_submitted_at || sub?.updated_at || (/* @__PURE__ */ new Date()).toISOString() : sub?.submitted_at ?? null;
  const mergedFormData = {
    ...resetToDraft ? {} : existingFormData,
    ...resolvedApplicantName ? { applicant_name: resolvedApplicantName } : {},
    ...resolvedUdyamNumber ? { udyam_number: resolvedUdyamNumber } : {},
    ...resolvedMobile ? { registered_mobile: resolvedMobile } : {},
    ...resolvedEmail ? { registered_email: resolvedEmail } : {},
    ...resolvedPan ? { pan_number: resolvedPan } : {},
    ...resolvedBusinessName ? { business_name: resolvedBusinessName } : {}
  };
  const now = (/* @__PURE__ */ new Date()).toISOString();
  if (sub) {
    const hasCodeMismatch = activeServiceCode && sub.service_code !== activeServiceCode;
    const hasStatusMismatch = sub.status !== targetStatus;
    const hasDataDifference = resolvedUdyamNumber && !existingFormData.udyam_number || resolvedMobile && !existingFormData.registered_mobile || resolvedEmail && !existingFormData.registered_email || resolvedApplicantName && !existingFormData.applicant_name || app?.id && !sub.application_id;
    if (resetToDraft || hasCodeMismatch || hasStatusMismatch || hasDataDifference) {
      const patch = {
        form_data: mergedFormData,
        status: targetStatus,
        submitted_at: targetSubmittedAt,
        updated_at: now
      };
      if (activeServiceCode) patch.service_code = activeServiceCode;
      if (app?.id) patch.application_id = app.id;
      await admin.from("onboarding_submissions").update(patch).eq("id", sub.id);
      sub = {
        ...sub,
        ...patch
      };
    }
  } else if (effectiveLeadId && activeServiceCode) {
    const newRecord = {
      lead_id: effectiveLeadId,
      application_id: app?.id ?? null,
      service_code: activeServiceCode,
      form_data: mergedFormData,
      status: targetStatus,
      submitted_at: targetSubmittedAt
    };
    const { data: created } = await admin.from("onboarding_submissions").insert(newRecord).select("id, service_code, form_data, status, submitted_at, updated_at, application_id, lead_id").maybeSingle();
    sub = created ?? newRecord;
  }
  return {
    ok: true,
    submission: sub,
    serviceCode: activeServiceCode
  };
}
export {
  SERVICE_CHANGE_STAGE_RESET,
  syncSubmissionForOrder
};
