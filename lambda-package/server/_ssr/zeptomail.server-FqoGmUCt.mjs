const FALLBACK_FROM_EMAIL = "help@businesshelpservices.com";
function apiHost() {
  const region = (process.env.ZEPTOMAIL_REGION || "in").trim();
  return `https://api.zeptomail.${region}`;
}
function zeptoFromEmail() {
  return (process.env.ZEPTOMAIL_FROM_EMAIL || process.env.ZOHO_FROM_EMAIL || FALLBACK_FROM_EMAIL).trim().toLowerCase();
}
function zeptoConfigured() {
  return Boolean((process.env.ZEPTOMAIL_TOKEN || "").trim());
}
function authHeader() {
  const raw = (process.env.ZEPTOMAIL_TOKEN || "").trim();
  if (!raw) throw new Error("ZeptoMail credentials missing (ZEPTOMAIL_TOKEN).");
  return /^zoho-enczapikey/i.test(raw) ? raw : `Zoho-enczapikey ${raw}`;
}
function angleWrap(id) {
  const t = id.trim();
  if (!t) return t;
  return t.startsWith("<") ? t : `<${t.replace(/[<>\s]/g, "")}>`;
}
function generateMessageId(user) {
  const domain = (user.split("@")[1] || "udyamadhar.in").trim();
  const rnd = Math.random().toString(36).slice(2, 10);
  return `<bhs.${Date.now()}.${rnd}@${domain}>`;
}
async function sendViaZepto(input) {
  try {
    const fromEmail = zeptoFromEmail();
    const fromName = (input.fromName || process.env.ZOHO_FROM_NAME || "Business Help Services").trim();
    const messageId = angleWrap(input.messageId || generateMessageId(fromEmail));
    const headers = { ...input.headers ?? {}, "Message-ID": messageId };
    if (input.inReplyTo) headers["In-Reply-To"] = angleWrap(input.inReplyTo);
    if (input.references) {
      headers["References"] = input.references.split(/\s+/).filter(Boolean).map(angleWrap).join(" ");
    }
    if (input.orderId) headers["X-BHS-Order"] = input.orderId;
    if (input.customerId) headers["X-BHS-Customer"] = input.customerId;
    if (input.templateCode) headers["X-BHS-Template"] = input.templateCode;
    if (input.queueId) headers["X-BHS-Queue-Id"] = input.queueId;
    const body = {
      from: { address: fromEmail, name: fromName },
      to: [{ email_address: { address: input.to } }],
      subject: input.subject,
      htmlbody: input.html
    };
    if (input.cc) {
      const ccList = (Array.isArray(input.cc) ? input.cc : input.cc.split(/[,;\s]+/)).map((e) => e.trim()).filter(Boolean);
      if (ccList.length > 0) {
        body.cc = ccList.map((addr) => ({ email_address: { address: addr } }));
      }
    }
    if (input.bcc) {
      const bccList = (Array.isArray(input.bcc) ? input.bcc : input.bcc.split(/[,;\s]+/)).map((e) => e.trim()).filter(Boolean);
      if (bccList.length > 0) {
        body.bcc = bccList.map((addr) => ({ email_address: { address: addr } }));
      }
    }
    const mimeHeaders = {};
    for (const [k, v] of Object.entries(headers)) {
      if (!v) continue;
      if (k.toLowerCase() === "message-id") continue;
      mimeHeaders[k] = String(v);
    }
    if (Object.keys(mimeHeaders).length) body.mime_headers = mimeHeaders;
    if (input.text) body.textbody = input.text;
    if (input.replyTo) body.reply_to = [{ address: input.replyTo }];
    if (input.attachments?.length) {
      body.attachments = input.attachments.map((a) => ({
        name: a.filename,
        content: a.content_base64,
        mime_type: a.content_type || "application/octet-stream"
      }));
    }
    const res = await fetch(`${apiHost()}/v1.1/email`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authHeader()
      },
      body: JSON.stringify(body)
    });
    const text = await res.text();
    if (!res.ok) {
      return { ok: false, error: `[zeptomail] POST /v1.1/email failed: ${res.status} ${text.slice(0, 500)}` };
    }
    const json = text ? JSON.parse(text) : {};
    return {
      ok: true,
      messageId,
      response: json.data?.[0]?.message || json.message || `ZeptoMail accepted message (${json.request_id ?? "ok"})`
    };
  } catch (e) {
    return { ok: false, error: `[zeptomail] ${e instanceof Error ? e.message : "send failed"}` };
  }
}
export {
  sendViaZepto,
  zeptoConfigured,
  zeptoFromEmail
};
