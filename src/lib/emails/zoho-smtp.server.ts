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
};

export type ZohoSendResult = {
  ok: boolean;
  messageId?: string;
  response?: string;
  error?: string;
};

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

    const info = await transporter.sendMail({
      from: `"${fromName.replace(/"/g, "'")}" <${user}>`,
      to: input.to,
      replyTo: input.replyTo || undefined,
      subject: input.subject,
      html: input.html,
      text: input.text || undefined,
      attachments: atts,
      headers: input.headers,
    });

    return {
      ok: true,
      messageId: info.messageId,
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
