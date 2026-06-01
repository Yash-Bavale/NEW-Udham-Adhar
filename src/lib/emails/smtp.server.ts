// Server-only SMTP transport + template renderer.
import nodemailer, { type Transporter } from "nodemailer";

let cached: Transporter | null = null;

export function getSmtpTransport(): Transporter {
  if (cached) return cached;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error(
      "SMTP not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in secrets.",
    );
  }
  cached = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return cached;
}

/** Replace {{var}} placeholders with values; missing vars become empty string. */
export function renderTemplate(
  source: string,
  variables: Record<string, unknown>,
): string {
  return source.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, k: string) => {
    const v = variables[k];
    if (v === null || v === undefined) return "";
    return String(v);
  });
}
