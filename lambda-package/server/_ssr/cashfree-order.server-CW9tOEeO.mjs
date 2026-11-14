async function buildCashfreeOrder(leadCodeInput, returnNonce) {
  const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
  const {
    buildCashfreeOrderId,
    createCashfreeOrder
  } = await import("./cashfree.server-DDK211Dz.mjs");
  const { data: gateway } = await supabaseAdmin.from("payment_gateways").select("is_enabled").ilike("name", "%cashfree%").maybeSingle();
  if (gateway && gateway.is_enabled === false) {
    throw new Error("Cashfree is currently disabled. Please enable it in Admin Settings.");
  }
  const { data: lead, error: leadErr } = await supabaseAdmin.from("leads").select(
    "id, lead_code, website_id, name, email, mobile, total_amount, base_amount, gst_amount, service, status, lead_status_v2"
  ).eq("lead_code", leadCodeInput).maybeSingle();
  if (leadErr) throw new Error(leadErr.message);
  if (!lead) throw new Error("Lead not found");
  if (!lead.lead_code) throw new Error("Lead is missing a lead code");
  const leadCode = lead.lead_code;
  await (await import("./website-gateways.server-BkGrEQ88.mjs")).assertGatewayAllowedForWebsite(lead.website_id, "cashfree", "Cashfree");
  const { credsForWebsite } = await import("./cashfree-accounts.server-guyWBqWD.mjs");
  const creds = await credsForWebsite(lead.website_id);
  const { data: application } = await supabaseAdmin.from("applications").select("id, application_code").eq("lead_id", lead.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
  const { data: pendingLink } = await supabaseAdmin.from("payment_links").select("amount").eq("lead_id", lead.id).eq("status", "pending").order("created_at", { ascending: false }).limit(1).maybeSingle();
  const hasPendingLink = !!pendingLink && Number(pendingLink.amount) > 0;
  const pendingAmount = hasPendingLink ? Number(pendingLink.amount) : 0;
  const { data: paidAlready } = await supabaseAdmin.from("payments").select("id").eq("lead_id", lead.id).eq("status", "paid").limit(1).maybeSingle();
  const awaitingConvertedServicePayment = hasPendingLink || lead.status === "payment_pending" || lead.lead_status_v2 === "payment_pending";
  if (paidAlready && !awaitingConvertedServicePayment) {
    throw new Error("This application has already been paid.");
  }
  const payAmount = hasPendingLink ? pendingAmount : Number(lead.total_amount);
  const payBase = Math.round(payAmount / 1.18 * 100) / 100;
  const payGst = Math.round((payAmount - payBase) * 100) / 100;
  if (["new_lead", "contacted", "follow_up_required", "lead_created"].includes(lead.status ?? "") || ["new_lead", "contacted", "follow_up_required", "lead_created"].includes(lead.lead_status_v2 ?? "")) {
    await supabaseAdmin.from("leads").update({ status: "payment_pending", lead_status_v2: "payment_pending" }).eq("id", lead.id);
  }
  await supabaseAdmin.from("payments").update({ status: "attempted" }).eq("lead_id", lead.id).eq("gateway_name", "cashfree").in("status", ["created"]);
  const cfOrderId = buildCashfreeOrderId(leadCode);
  const { data: inserted, error: insErr } = await supabaseAdmin.from("payments").insert({
    lead_id: lead.id,
    application_id: application?.id ?? null,
    gateway_name: "cashfree",
    transaction_id: cfOrderId,
    razorpay_order_id: cfOrderId,
    // reuse column for gateway order ID
    amount: payAmount,
    base_amount: payBase,
    gst_amount: payGst,
    currency: "INR",
    status: "created",
    idempotency_key: `cashfree:${cfOrderId}`,
    payment_account_id: creds.accountId
  }).select("id").single();
  if (insErr || !inserted) {
    throw new Error(insErr?.message ?? "Could not create payment");
  }
  const paymentId = inserted.id;
  const origin = process.env.APP_BASE_URL || process.env.PUBLIC_SITE_URL || "https://udyamadhar.in";
  const returnOrigin = process.env.LOCAL_RETURN_URL || "http://localhost:3000";
  const returnUrl = `${returnOrigin}/api/public/webhooks/cashfree?order_id={order_id}${returnNonce ? `&r=${encodeURIComponent(returnNonce)}` : ""}`;
  const notifyUrl = `${origin}/api/public/webhooks/cashfree`;
  const phone = String(lead.mobile ?? "").replace(/\D/g, "").slice(-10) || "9999999999";
  const email = String(lead.email ?? "customer@example.com").trim().toLowerCase();
  const name = String(lead.name ?? "Customer").replace(/[^a-zA-Z0-9\s]/g, " ").trim().slice(0, 60) || "Customer";
  const cfOrder = await createCashfreeOrder({
    orderId: cfOrderId,
    orderAmount: payAmount,
    customerId: lead.id,
    customerEmail: email,
    customerPhone: phone,
    customerName: name,
    returnUrl,
    notifyUrl
  }, creds);
  await supabaseAdmin.from("payments").update({ razorpay_payment_id: cfOrder.cf_order_id }).eq("id", paymentId);
  const isProd = creds.isProd;
  return {
    actionUrl: cfOrder.payment_link || "",
    fields: {},
    paymentId,
    leadCode,
    totalAmount: payAmount,
    paymentSessionId: cfOrder.payment_session_id,
    isProd
  };
}
export {
  buildCashfreeOrder
};
