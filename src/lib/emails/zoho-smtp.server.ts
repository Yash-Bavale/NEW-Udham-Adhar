// Zoho Mail SMTP delivery helper (server-only).
// Used by emails.server.ts to send every transactional email via the
// customer's own Zoho mailbox so deliverability + tracking sit on
// infrastructure they control.

import nodemailer, { type Transporter } from "nodemailer";

export type ZohoAttachment = {
  filename: string;
  content_base64: string;
  content_type: string;
};

export type ZohoSendInput = {
  to: string;
  subject: string;
  html: string;
  text?: string | null;
  fromName?: string | null;
  replyTo?: string | null;
  attachments?: ZohoAttachment[];
  headers?: Record<string, string>;
  /** Threading + BHS trace headers — used by incoming-mail matching. */
  messageId?: string;         // Full <local@domain> Message-ID; auto-generated if missing.
  inReplyTo?: string | null;  // <parent-message-id>
  references?: string | null; // space-separated list of <ids>
  orderId?: string | null;
  customerId?: string | null;
  templateCode?: string | null;
  queueId?: string | null;
};

export type ZohoSendResult = {
  ok: boolean;
  messageId?: string;
  response?: string;
  error?: string;
};

function angleWrap(id: string): string {
  const t = id.trim();
  if (!t) return t;
  return t.startsWith("<") ? t : `<${t.replace(/[<>\s]/g, "")}>`;
}

function generateMessageId(user: string): string {
  const domain = (user.split("@")[1] || "udyamadhar.in").trim();
  const rnd = Math.random().toString(36).slice(2, 10);
  return `<bhs.${Date.now()}.${rnd}@${domain}>`;
}

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;
  const host = (process.env.ZOHO_SMTP_HOST || "smtp.zoho.in").trim();
  const port = Number(process.env.ZOHO_SMTP_PORT || 465);
  const user = (process.env.ZOHO_SMTP_USER || "").trim();
  const pass = (process.env.ZOHO_SMTP_PASS || "").trim();
  if (!user || !pass) {
    throw new Error("Zoho SMTP credentials missing (ZOHO_SMTP_USER / ZOHO_SMTP_PASS).");
  }
  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // SSL on 465, STARTTLS on 587
    auth: { user, pass },
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
  });
  return cachedTransporter;
}

export async function sendViaZoho(input: ZohoSendInput): Promise<ZohoSendResult> {
  try {
    const transporter = getTransporter();
    const user = (process.env.ZOHO_SMTP_USER || "").trim();
    const fromName = (input.fromName || process.env.ZOHO_FROM_NAME || "Udyam Registration Consultancy & Assistance Services").trim();

    const atts =
      input.attachments && input.attachments.length > 0
        ? input.attachments.map((a) => ({
            filename: a.filename,
            content: Buffer.from(a.content_base64, "base64"),
            contentType: a.content_type,
          }))
        : undefined;

    const messageId = angleWrap(input.messageId || generateMessageId(user));
    const threadHeaders: Record<string, string> = { "Message-ID": messageId };
    if (input.inReplyTo) threadHeaders["In-Reply-To"] = angleWrap(input.inReplyTo);
    if (input.references) {
      threadHeaders["References"] = input.references
        .split(/\s+/)
        .filter(Boolean)
        .map(angleWrap)
        .join(" ");
    }
    if (input.orderId) threadHeaders["X-BHS-Order"] = input.orderId;
    if (input.customerId) threadHeaders["X-BHS-Customer"] = input.customerId;
    if (input.templateCode) threadHeaders["X-BHS-Template"] = input.templateCode;
    if (input.queueId) threadHeaders["X-BHS-Queue-Id"] = input.queueId;

    const info = await transporter.sendMail({
      from: `"${fromName.replace(/"/g, "'")}" <${user}>`,
      to: input.to,
      replyTo: input.replyTo || undefined,
      subject: input.subject,
      html: input.html,
      text: input.text || undefined,
      attachments: atts,
      headers: { ...threadHeaders, ...(input.headers || {}) },
      messageId, // nodemailer respects this and mirrors into the header
    });

    return {
      ok: true,
      messageId: info.messageId || messageId,
      response: info.response,
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Zoho SMTP send failed",
    };
  }
}

export function zohoSenderInfo() {
  return {
    host: process.env.ZOHO_SMTP_HOST || "smtp.zoho.in",
    port: Number(process.env.ZOHO_SMTP_PORT || 465),
    user: process.env.ZOHO_SMTP_USER || "",
    fromName: process.env.ZOHO_FROM_NAME || "Udyam Registration Consultancy & Assistance Services",
  };
}
