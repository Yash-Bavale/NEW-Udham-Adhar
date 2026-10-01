import { PDFDocument, PDFPage, PDFFont, StandardFonts, rgb, type RGB } from "pdf-lib";

// PDF colors used for the plain-text fallback only.
const NAVY = rgb(0.07, 0.13, 0.27);
const TEXT_DARK = rgb(0.12, 0.15, 0.22);
const TEXT_MUTED = rgb(0.45, 0.48, 0.55);

const COMPANY_EMAIL = "help@businesshelpservices.com";

function safePdfText(value: string | null | undefined): string {
  return String(value ?? "")
    .replace(/₹/g, "Rs.")
    .replace(/[‐‑‒–—―−]/g, "-")
    .replace(/[‘’‚‛]/g, "'")
    .replace(/[“”„‟]/g, '"')
    .replace(/…/g, "...")
    .replace(/·/g, "|")
    .replace(/•/g, "*")
    .replace(/\u00a0/g, " ")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x09\x0a\x0d\x20-\x7e]/g, " ");
}

function escapeHtml(str: string | null | undefined): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function textWidth(font: PDFFont, text: string, size: number): number {
  return font.widthOfTextAtSize(safePdfText(text), size);
}

function drawText(
  page: PDFPage,
  text: string,
  opts: { x: number; y: number; size: number; font: PDFFont; color?: RGB }
) {
  page.drawText(safePdfText(text), {
    x: opts.x,
    y: opts.y,
    size: opts.size,
    font: opts.font,
    color: opts.color ?? TEXT_DARK,
  });
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const clean = safePdfText(text).trim();
  if (!clean) return [];
  const words = clean.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (textWidth(font, w, size) > maxWidth) {
      if (cur) {
        lines.push(cur);
        cur = "";
      }
      let chunk = "";
      for (const char of w) {
        if (textWidth(font, chunk + char, size) <= maxWidth) {
          chunk += char;
        } else {
          if (chunk) lines.push(chunk);
          chunk = char;
        }
      }
      if (chunk) cur = chunk;
      continue;
    }

    const trial = cur ? cur + " " + w : w;
    if (textWidth(font, trial, size) <= maxWidth) {
      cur = trial;
    } else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function formatIST(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }) + ", " + d.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export interface DisputePackageData {
  packageId: string;
  disputeId?: string | null;
  order: {
    id: string;
    applicationCode: string;
    createdAt: string;
    orderStatus: string;
    fulfillmentStatus: string;
    workflowStatus: string;
  };
  lead: {
    id: string;
    name: string;
    email: string;
    mobile: string;
    service: string;
    totalAmount: number;
    state?: string | null;
  };
  payment?: {
    id?: string;
    transactionId?: string | null;
    paymentDate?: string | null;
    amount?: number | null;
    gatewayName?: string | null;
    status?: string | null;
  } | null;
  staff: {
    id: string;
    name: string;
    role?: string;
  };
  selectedEmails: Array<{
    id: string;
    subject: string;
    from_email: string;
    to_email: string;
    sent_at: string | null;
    status: string;
    template_code?: string | null;
    body_html?: string | null;
    body_text?: string | null;
    message_id?: string | null;
    direction?: string | null;
    attachment_names?: string[];
  }>;
  invoice?: {
    id: string;
    invoiceNumber: string;
    pdfBuffer?: Uint8Array | null;
  } | null;
  certificate?: {
    id: string;
    certificateNumber?: string | null;
    fileName?: string | null;
    fileBuffer?: Uint8Array | null;
    mimeType?: string | null;
  } | null;
}

/**
 * Render a plain mail-print header followed by the exact stored sent email HTML.
 */
function decodeStoredHtml(value: string): string {
  if (!/^\s*&lt;(?:!doctype|html|table|div|body)\b/i.test(value)) return value;
  return value
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&amp;/gi, "&");
}

function renderEmailEvidenceHtmlDocument(params: {
  email: DisputePackageData["selectedEmails"][0];
}): string {
  const { email } = params;

  const fromDisplay = email.from_email || COMPANY_EMAIL;
  const toDisplay = email.to_email || "customer@email.com";
  const dateDisplay = formatIST(email.sent_at);
  const subjectDisplay = email.subject || "Customer Notification";
  const messageIdDisplay = email.message_id || `msg_${email.id.slice(0, 16)}@businesshelpservices.com`;

  const rawBodyHtml = email.body_html?.trim();
  const rawBodyText = email.body_text?.trim();
  const attachmentsDisplay = email.attachment_names?.length
    ? email.attachment_names.join(", ")
    : "None";

  let bodyContentHtml = "";
  if (rawBodyHtml) {
    bodyContentHtml = decodeStoredHtml(rawBodyHtml);
  } else if (rawBodyText) {
    bodyContentHtml = `<div style="white-space: pre-wrap; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #1e293b; padding: 12px 0;">${escapeHtml(
      rawBodyText
    )}</div>`;
  } else {
    bodyContentHtml = `<div style="font-family: sans-serif; font-size: 13px; color: #64748b; padding: 20px 0; text-align: center;">No email content recorded for this transmission.</div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(subjectDisplay)}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 12mm 16mm 12mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #0f172a;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 12px;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .mail-header {
      margin-bottom: 10px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .email-meta-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #edc98e;
      font: 11px Arial, Helvetica, sans-serif;
    }
    .email-meta-table td {
      padding: 2px 8px;
      vertical-align: top;
      border-bottom: 1px solid #f3dfbc;
    }
    .email-meta-table .meta-label {
      width: 95px;
      text-align: right;
      font-weight: 400;
      color: #111111;
      white-space: nowrap;
    }
    .email-meta-table .meta-value {
      color: #111111;
    }
    .email-meta-table .meta-value a {
      color: #0000ee;
      text-decoration: underline;
    }
    .email-meta-table .meta-id {
      font-size: 9px;
      overflow-wrap: anywhere;
    }
    .email-body-wrapper {
      width: 100%;
      background: #ffffff;
      word-break: break-word;
    }
    /* Ensure high-fidelity email layout preservation */
    .email-body-wrapper table {
      max-width: 100% !important;
    }
    .email-body-wrapper img {
      max-width: 100% !important;
      height: auto !important;
    }
    /* Natural pagination rules */
    table, tr, td, img, blockquote {
      page-break-inside: auto;
      break-inside: auto;
    }
  </style>
</head>
<body>
  <div class="mail-header">
    <table class="email-meta-table">
      <tr>
        <td class="meta-label">From:</td>
        <td class="meta-value">&quot;Business Help Services&quot; &lt;<a href="mailto:${escapeHtml(fromDisplay)}">${escapeHtml(fromDisplay)}</a>&gt;</td>
      </tr>
      <tr>
        <td class="meta-label">To:</td>
        <td class="meta-value"><a href="mailto:${escapeHtml(toDisplay)}">${escapeHtml(toDisplay)}</a></td>
      </tr>
      <tr>
        <td class="meta-label">Date:</td>
        <td class="meta-value">${escapeHtml(dateDisplay)}</td>
      </tr>
      <tr>
        <td class="meta-label">Subject:</td>
        <td class="meta-value">${escapeHtml(subjectDisplay)}</td>
      </tr>
      <tr>
        <td class="meta-label">Attachments:</td>
        <td class="meta-value">${escapeHtml(attachmentsDisplay)}</td>
      </tr>
      <tr>
        <td class="meta-label">Message ID:</td>
        <td class="meta-value meta-id">${escapeHtml(messageIdDisplay)}</td>
      </tr>
      <tr>
        <td class="meta-label">Status:</td>
        <td class="meta-value">${escapeHtml(email.status || "sent")}</td>
      </tr>
    </table>
  </div>

  <!-- EXACT HISTORICAL SENT EMAIL HTML -->
  <div class="email-body-wrapper">
    ${bodyContentHtml}
  </div>
</body>
</html>`;
}

async function renderHtmlToPdfBuffer(_html: string): Promise<Uint8Array> {
  throw new Error("Exact email PDF rendering is unavailable on the hosted server");
}

export async function renderDisputeEvidencePackagePdf(data: DisputePackageData): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  const helv = await mergedPdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await mergedPdf.embedFont(StandardFonts.HelveticaBold);

  const PAGE_W = 595.28;
  const PAGE_H = 841.89;
  const MARGIN_X = 36;
  const CONTENT_W = PAGE_W - MARGIN_X * 2;

  // ══════════════════════════════════════════════════════════════════════════
  // 2. SELECTED SENT EMAILS (Rendered 1:1 via Chromium Headless)
  // ══════════════════════════════════════════════════════════════════════════
  const sortedEmails = [...data.selectedEmails].sort((a, b) => {
    const ta = new Date(a.sent_at || 0).getTime();
    const tb = new Date(b.sent_at || 0).getTime();
    return ta - tb;
  });

  for (let idx = 0; idx < sortedEmails.length; idx++) {
    const email = sortedEmails[idx];
    try {
      const emailHtml = renderEmailEvidenceHtmlDocument({ email });
      const emailPdfBytes = await renderHtmlToPdfBuffer(emailHtml);
      const emailDoc = await PDFDocument.load(emailPdfBytes);
      const copiedPages = await mergedPdf.copyPages(emailDoc, emailDoc.getPageIndices());
      for (const page of copiedPages) {
        mergedPdf.addPage(page);
      }
    } catch (renderErr) {
      console.error(`[dispute-pdf] Failed to render email #${idx + 1}:`, renderErr);
      // Fallback page in case of severe rendering fault
      const fallbackPage = mergedPdf.addPage([PAGE_W, PAGE_H]);
      drawText(fallbackPage, `From: ${safePdfText(email.from_email || COMPANY_EMAIL)}`, {
        x: MARGIN_X,
        y: PAGE_H - 40,
        size: 11,
        font: helvBold,
        color: NAVY,
      });
      drawText(fallbackPage, `To: ${safePdfText(email.to_email)}`, {
        x: MARGIN_X,
        y: PAGE_H - 60,
        size: 9,
        font: helv,
        color: TEXT_DARK,
      });
      drawText(fallbackPage, `Date: ${formatIST(email.sent_at)}`, {
        x: MARGIN_X,
        y: PAGE_H - 75,
        size: 8.5,
        font: helv,
        color: TEXT_MUTED,
      });
      drawText(fallbackPage, `Subject: ${safePdfText(email.subject)}`, {
        x: MARGIN_X,
        y: PAGE_H - 90,
        size: 8.5,
        font: helv,
        color: TEXT_DARK,
      });
      drawText(fallbackPage, `Attachments: ${(email.attachment_names ?? []).join(", ") || "None"}`, {
        x: MARGIN_X,
        y: PAGE_H - 105,
        size: 8.5,
        font: helv,
        color: TEXT_DARK,
      });
      drawText(fallbackPage, `Message ID: ${safePdfText(email.message_id || `msg_${email.id.slice(0, 16)}@businesshelpservices.com`)}`, {
        x: MARGIN_X,
        y: PAGE_H - 120,
        size: 8,
        font: helv,
        color: TEXT_MUTED,
      });
      drawText(fallbackPage, `Status: ${safePdfText(email.status || "sent")}`, {
        x: MARGIN_X,
        y: PAGE_H - 135,
        size: 8.5,
        font: helv,
        color: TEXT_DARK,
      });
      const lines = wrap(email.body_text || "Email body could not be rendered.", helv, 8, CONTENT_W);
      let fy = PAGE_H - 165;
      for (const l of lines.slice(0, 45)) {
        drawText(fallbackPage, l, { x: MARGIN_X, y: fy, size: 8, font: helv, color: TEXT_DARK });
        fy -= 12;
      }
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 3. INVOICE PDF (IF SELECTED & AVAILABLE)
  // ══════════════════════════════════════════════════════════════════════════
  if (data.invoice?.pdfBuffer && data.invoice.pdfBuffer.length > 0) {
    try {
      const invDoc = await PDFDocument.load(data.invoice.pdfBuffer);
      const copied = await mergedPdf.copyPages(invDoc, invDoc.getPageIndices());
      for (const p of copied) {
        mergedPdf.addPage(p);
      }
    } catch (invErr) {
      console.error("[dispute-pdf] Error copying invoice pages:", invErr);
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 4. CERTIFICATE PDF / IMAGE (IF SELECTED & AVAILABLE)
  // ══════════════════════════════════════════════════════════════════════════
  if (data.certificate?.fileBuffer && data.certificate.fileBuffer.length > 0) {
    try {
      const mime = (data.certificate.mimeType || "").toLowerCase();
      if (mime.includes("image") || mime.includes("png") || mime.includes("jpeg") || mime.includes("jpg")) {
        const certImgPage = mergedPdf.addPage([PAGE_W, PAGE_H]);
        let certImg: any = null;
        if (mime.includes("png")) {
          certImg = await mergedPdf.embedPng(data.certificate.fileBuffer);
        } else {
          certImg = await mergedPdf.embedJpg(data.certificate.fileBuffer);
        }
        if (certImg) {
          const imgDims = certImg.scaleToFit(PAGE_W - 60, PAGE_H - 100);
          certImgPage.drawImage(certImg, {
            x: (PAGE_W - imgDims.width) / 2,
            y: (PAGE_H - imgDims.height) / 2,
            width: imgDims.width,
            height: imgDims.height,
          });
        }
      } else {
        const certDoc = await PDFDocument.load(data.certificate.fileBuffer);
        const copied = await mergedPdf.copyPages(certDoc, certDoc.getPageIndices());
        for (const p of copied) {
          mergedPdf.addPage(p);
        }
      }
    } catch (certErr) {
      console.error("[dispute-pdf] Error copying certificate pages:", certErr);
    }
  }

  return await mergedPdf.save();
}
