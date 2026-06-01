// Server-only template renderer. (SMTP/nodemailer removed — Lovable Emails only.)

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
