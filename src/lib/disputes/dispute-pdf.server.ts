import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { PDFDocument, PDFPage, PDFFont, StandardFonts, rgb, type RGB } from "pdf-lib";
import { BHS_LOGO_BASE64 } from "../invoices/bhs-logo";

const execFileAsync = promisify(execFile);

// Brand Colors
const NAVY = rgb(0.07, 0.13, 0.27);
const NAVY_SOFT = rgb(0.14, 0.22, 0.4);
const ACCENT = rgb(0.95, 0.62, 0.07);
const TEXT_DARK = rgb(0.12, 0.15, 0.22);
const TEXT_MUTED = rgb(0.45, 0.48, 0.55);
const BORDER_COLOR = rgb(0.84, 0.86, 0.9);
const LIGHT_BG = rgb(0.96, 0.97, 0.99);
const WHITE = rgb(1, 1, 1);

const COMPANY_NAME = "Business Help Services";
const COMPANY_EMAIL = "help@businesshelpservices.com";
const COMPANY_PHONE = "+91-9767870331";
const COMPANY_ADDRESS = "Koregaon Bk, Taluka-Khed, Pune, Maharashtra - 410505, India";
const COMPANY_GSTIN = "27COFPD1743E2ZB";

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

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
 * Locate installed Chromium / Chrome / Edge binary on the host environment
 */
function findChromiumExecutable(): string | null {
  const envCandidates = [
    process.env.CHROME_BIN,
    process.env.CHROME_PATH,
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROMIUM_PATH,
  ].filter((p): p is string => Boolean(p));

  const standardCandidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, "Google\\Chrome\\Application\\chrome.exe") : null,
    process.env.PROGRAMFILES ? path.join(process.env.PROGRAMFILES, "Google\\Chrome\\Application\\chrome.exe") : null,
    process.env["PROGRAMFILES(X86)"] ? path.join(process.env["PROGRAMFILES(X86)"], "Google\\Chrome\\Application\\chrome.exe") : null,
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/snap/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ].filter((p): p is string => Boolean(p));

  const all = [...envCandidates, ...standardCandidates];
  for (const p of all) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/**
 * High-fidelity HTML to PDF rendering via headless Chromium CLI
 */
async function renderHtmlToPdfBuffer(html: string): Promise<Uint8Array> {
  const browserPath = findChromiumExecutable();
  if (!browserPath) {
    throw new Error(
      "No Chromium/Chrome/Edge browser executable found on the server. Please ensure Chrome or Chromium is installed."
    );
  }

  const tmpId = `dispute_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const tmpDir = os.tmpdir();
  const tmpHtmlPath = path.join(tmpDir, `${tmpId}.html`);
  const tmpPdfPath = path.join(tmpDir, `${tmpId}.pdf`);

  try {
    fs.writeFileSync(tmpHtmlPath, html, "utf8");

    const args = [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-software-rasterizer",
      "--no-pdf-header-footer",
      `--print-to-pdf=${tmpPdfPath}`,
      `file://${tmpHtmlPath.replace(/\\/g, "/")}`,
    ];

    await execFileAsync(browserPath, args, { timeout: 35000 });

    if (!fs.existsSync(tmpPdfPath)) {
      throw new Error("Chromium completed without generating output PDF");
    }

    const pdfBuffer = fs.readFileSync(tmpPdfPath);
    return new Uint8Array(pdfBuffer);
  } finally {
    try {
      if (fs.existsSync(tmpHtmlPath)) fs.unlinkSync(tmpHtmlPath);
      if (fs.existsSync(tmpPdfPath)) fs.unlinkSync(tmpPdfPath);
    } catch {
      // ignore temp file cleanup errors
    }
  }
}

/**
 * Render standard CRM email preview HTML page with Evidence Header and exact stored sent email HTML
 */
function renderEmailEvidenceHtmlDocument(params: {
  email: DisputePackageData["selectedEmails"][0];
  emailIndex: number;
  totalEmails: number;
  orderCode: string;
  hasInvoiceAttachment: boolean;
}): string {
  const { email, emailIndex, totalEmails, orderCode, hasInvoiceAttachment } = params;

  const fromDisplay = email.from_email || COMPANY_EMAIL;
  const toDisplay = email.to_email || "customer@email.com";
  const dateDisplay = formatIST(email.sent_at);
  const subjectDisplay = email.subject || "Customer Notification";
  const messageIdDisplay = email.message_id || `msg_${email.id.slice(0, 16)}@businesshelpservices.com`;

  const rawBodyHtml = email.body_html?.trim();
  const rawBodyText = email.body_text?.trim();

  let bodyContentHtml = "";
  if (rawBodyHtml) {
    bodyContentHtml = rawBodyHtml;
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
  <title>Evidence Sent Email ${emailIndex + 1}</title>
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
    .evidence-header-card {
      margin-bottom: 16px;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .evidence-top-banner {
      background: #072242;
      color: #ffffff;
      padding: 8px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #f59e0b;
    }
    .evidence-title {
      font-size: 10.5px;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #ffffff;
    }
    .evidence-badge {
      background: #059669;
      color: #ffffff;
      font-size: 8.5px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 3px;
      letter-spacing: 0.02em;
    }
    .email-meta-table {
      width: 100%;
      border-collapse: collapse;
      background: #fefce8;
      border: 1px solid #fef08a;
      border-top: none;
      font-size: 11px;
    }
    .email-meta-table td {
      padding: 4px 12px;
      vertical-align: top;
    }
    .email-meta-table .meta-label {
      width: 85px;
      font-weight: 700;
      color: #475569;
      white-space: nowrap;
    }
    .email-meta-table .meta-value {
      color: #0f172a;
    }
    .email-meta-table .meta-value a {
      color: #1e40af;
      text-decoration: none;
    }
    .email-meta-table .meta-sub {
      font-weight: 700;
      color: #0f172a;
    }
    .email-meta-table .meta-id {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 9.5px;
      color: #64748b;
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
  <div class="evidence-header-card">
    <div class="evidence-top-banner">
      <span class="evidence-title">EVIDENCE ITEM: SENT EMAIL #${emailIndex + 1} OF ${totalEmails}</span>
      <span class="evidence-badge">&#10003; AUTHENTICATED SENT RECORD</span>
    </div>
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
        <td class="meta-label">Sent Date:</td>
        <td class="meta-value">${escapeHtml(dateDisplay)}</td>
      </tr>
      <tr>
        <td class="meta-label">Subject:</td>
        <td class="meta-value meta-sub">${escapeHtml(subjectDisplay)}</td>
      </tr>
      ${
        hasInvoiceAttachment
          ? `<tr>
        <td class="meta-label">Attachment:</td>
        <td class="meta-value" style="color:#1e40af;font-weight:600;">Tax-Invoice-${escapeHtml(orderCode)}.pdf (Verified)</td>
      </tr>`
          : ""
      }
      <tr>
        <td class="meta-label">Message ID:</td>
        <td class="meta-value meta-id">${escapeHtml(messageIdDisplay)}</td>
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

export async function renderDisputeEvidencePackagePdf(data: DisputePackageData): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  const helv = await mergedPdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await mergedPdf.embedFont(StandardFonts.HelveticaBold);
  let logo: any = null;
  try {
    logo = await mergedPdf.embedPng(base64ToBytes(BHS_LOGO_BASE64));
  } catch (err) {
    console.warn("[dispute-pdf] Logo embedding failed, continuing without logo:", err);
  }

  const PAGE_W = 595.28;
  const PAGE_H = 841.89;
  const MARGIN_X = 36;
  const CONTENT_W = PAGE_W - MARGIN_X * 2;

  // ══════════════════════════════════════════════════════════════════════════
  // 1. COVER PAGE
  // ══════════════════════════════════════════════════════════════════════════
  const coverPage = mergedPdf.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - 30;

  // Header Banner
  coverPage.drawRectangle({ x: 0, y: y - 50, width: PAGE_W, height: 60, color: NAVY });
  coverPage.drawRectangle({ x: 0, y: y - 54, width: PAGE_W, height: 4, color: ACCENT });

  if (logo) {
    coverPage.drawImage(logo, { x: MARGIN_X, y: y - 44, width: 44, height: 44 });
    drawText(coverPage, COMPANY_NAME.toUpperCase(), { x: MARGIN_X + 54, y: y - 20, size: 14, font: helvBold, color: WHITE });
    drawText(coverPage, "OFFICIAL DISPUTE EVIDENCE & AUDIT PACKAGE", { x: MARGIN_X + 54, y: y - 36, size: 9, font: helv, color: rgb(0.85, 0.9, 1) });
  } else {
    drawText(coverPage, COMPANY_NAME.toUpperCase(), { x: MARGIN_X, y: y - 20, size: 14, font: helvBold, color: WHITE });
    drawText(coverPage, "OFFICIAL DISPUTE EVIDENCE & AUDIT PACKAGE", { x: MARGIN_X, y: y - 36, size: 9, font: helv, color: rgb(0.85, 0.9, 1) });
  }

  y -= 80;

  // Title Box
  coverPage.drawRectangle({
    x: MARGIN_X,
    y: y - 50,
    width: CONTENT_W,
    height: 52,
    color: LIGHT_BG,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });
  drawText(coverPage, "DISPUTE EVIDENCE PACKAGE", { x: MARGIN_X + 16, y: y - 22, size: 14, font: helvBold, color: NAVY });
  drawText(coverPage, `Generated on ${formatIST(new Date().toISOString())} · Prepared for Payment Gateway / Banking Dispute Resolution`, {
    x: MARGIN_X + 16,
    y: y - 38,
    size: 8.5,
    font: helv,
    color: TEXT_MUTED,
  });

  y -= 70;

  // Section 1: Order & Customer Information
  drawText(coverPage, "1. ORDER & CUSTOMER INFORMATION", { x: MARGIN_X, y, size: 10.5, font: helvBold, color: NAVY });
  y -= 8;

  const cardH = data.disputeId ? 115 : 95;
  coverPage.drawRectangle({
    x: MARGIN_X,
    y: y - cardH,
    width: CONTENT_W,
    height: cardH,
    color: WHITE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });

  const rowH = 18;
  let rowY = y - 14;
  const col1L = MARGIN_X + 12;
  const col1V = MARGIN_X + 110;
  const col2L = MARGIN_X + 270;
  const col2V = MARGIN_X + 370;

  const drawMetaRow = (l1: string, v1: string, l2?: string, v2?: string) => {
    drawText(coverPage, l1, { x: col1L, y: rowY, size: 8.5, font: helv, color: TEXT_MUTED });
    drawText(coverPage, `: ${safePdfText(v1)}`, { x: col1V, y: rowY, size: 8.5, font: helvBold, color: TEXT_DARK });
    if (l2 && v2 !== undefined) {
      drawText(coverPage, l2, { x: col2L, y: rowY, size: 8.5, font: helv, color: TEXT_MUTED });
      drawText(coverPage, `: ${safePdfText(v2)}`, { x: col2V, y: rowY, size: 8.5, font: helvBold, color: TEXT_DARK });
    }
    rowY -= rowH;
  };

  drawMetaRow("Order Number", data.order.applicationCode, "Customer Name", data.lead.name);
  drawMetaRow("Mobile", data.lead.mobile, "Email Address", data.lead.email);
  drawMetaRow("Service", data.lead.service, "Order Date", formatIST(data.order.createdAt));
  drawMetaRow("Payment Status", (data.payment?.status ?? "PAID").toUpperCase(), "Payment Amount", `INR ${(data.payment?.amount ?? data.lead.totalAmount ?? 0).toLocaleString("en-IN")}`);

  // Row 5: Gateway & Transaction ID
  drawText(coverPage, "Gateway / Txn ID", { x: col1L, y: rowY, size: 8.5, font: helv, color: TEXT_MUTED });
  drawText(coverPage, `: ${data.payment?.gatewayName ?? "Razorpay"} / ${data.payment?.transactionId ?? "—"}`, {
    x: col1V,
    y: rowY,
    size: 8.5,
    font: helvBold,
    color: TEXT_DARK,
  });
  rowY -= rowH;

  // Row 6: Dispute ID (Optional)
  if (data.disputeId) {
    drawText(coverPage, "Dispute ID", { x: col1L, y: rowY, size: 8.5, font: helv, color: TEXT_MUTED });
    drawText(coverPage, `: ${safePdfText(data.disputeId)}`, { x: col1V, y: rowY, size: 8.5, font: helvBold, color: rgb(0.7, 0.15, 0.1) });
    rowY -= rowH;
  }

  y -= (cardH + 20);

  // Section 2: Included Evidence Manifest
  drawText(coverPage, "2. EVIDENCE MANIFEST / INCLUDED RECORDS", { x: MARGIN_X, y, size: 10.5, font: helvBold, color: NAVY });
  y -= 12;

  // Manifest table header
  coverPage.drawRectangle({
    x: MARGIN_X,
    y: y - 20,
    width: CONTENT_W,
    height: 20,
    color: NAVY_SOFT,
  });
  drawText(coverPage, "#", { x: MARGIN_X + 8, y: y - 14, size: 8, font: helvBold, color: WHITE });
  drawText(coverPage, "TYPE", { x: MARGIN_X + 26, y: y - 14, size: 8, font: helvBold, color: WHITE });
  drawText(coverPage, "ITEM DESCRIPTION", { x: MARGIN_X + 80, y: y - 14, size: 8, font: helvBold, color: WHITE });
  drawText(coverPage, "RECIPIENT / DETAILS", { x: MARGIN_X + 310, y: y - 14, size: 8, font: helvBold, color: WHITE });
  drawText(coverPage, "SENT / ISSUED DATE", { x: MARGIN_X + 430, y: y - 14, size: 8, font: helvBold, color: WHITE });

  y -= 20;

  let itemIdx = 1;
  const manifestItems: Array<{ type: string; desc: string; detail: string; date: string }> = [];

  for (const email of data.selectedEmails) {
    manifestItems.push({
      type: "EMAIL",
      desc: email.subject || "Customer Communication",
      detail: email.to_email || data.lead.email,
      date: formatIST(email.sent_at),
    });
  }

  if (data.invoice) {
    manifestItems.push({
      type: "INVOICE",
      desc: `Tax Invoice #${data.invoice.invoiceNumber}`,
      detail: `Amount: INR ${(data.payment?.amount ?? data.lead.totalAmount ?? 0).toLocaleString("en-IN")}`,
      date: formatIST(data.payment?.paymentDate ?? data.order.createdAt),
    });
  }

  if (data.certificate) {
    manifestItems.push({
      type: "CERTIFICATE",
      desc: `Registration Certificate${data.certificate.certificateNumber ? ` #${data.certificate.certificateNumber}` : ""}`,
      detail: data.certificate.fileName || "Verified Issued Certificate",
      date: formatIST(new Date().toISOString()),
    });
  }

  for (const item of manifestItems) {
    const isEven = itemIdx % 2 === 0;
    coverPage.drawRectangle({
      x: MARGIN_X,
      y: y - 20,
      width: CONTENT_W,
      height: 20,
      color: isEven ? LIGHT_BG : WHITE,
      borderColor: BORDER_COLOR,
      borderWidth: 0.5,
    });
    drawText(coverPage, String(itemIdx), { x: MARGIN_X + 8, y: y - 14, size: 8, font: helvBold, color: TEXT_DARK });
    drawText(coverPage, item.type, { x: MARGIN_X + 26, y: y - 14, size: 7.5, font: helvBold, color: NAVY });
    drawText(coverPage, wrap(item.desc, helv, 8, 220)[0] || item.desc, { x: MARGIN_X + 80, y: y - 14, size: 8, font: helv, color: TEXT_DARK });
    drawText(coverPage, wrap(item.detail, helv, 7.5, 115)[0] || item.detail, { x: MARGIN_X + 310, y: y - 14, size: 7.5, font: helv, color: TEXT_MUTED });
    drawText(coverPage, item.date, { x: MARGIN_X + 430, y: y - 14, size: 7.5, font: helv, color: TEXT_DARK });
    y -= 20;
    itemIdx++;
  }

  y -= 20;

  // Section 3: Legal & Audit Statement
  coverPage.drawRectangle({
    x: MARGIN_X,
    y: y - 80,
    width: CONTENT_W,
    height: 80,
    color: rgb(0.98, 0.98, 0.99),
    borderColor: rgb(0.8, 0.83, 0.88),
    borderWidth: 1,
  });

  drawText(coverPage, "LEGAL & REGULATORY DISPUTE STATEMENT", { x: MARGIN_X + 12, y: y - 16, size: 8.5, font: helvBold, color: NAVY });
  const disclaimerText =
    "This evidence package has been compiled from authenticated and immutable CRM server logs for presentation before payment gateways, acquiring banks, dispute handling authorities, and regulatory bodies. All enclosed emails represent actual communications transmitted to the customer's registered email address.";

  const disclaimerLines = wrap(disclaimerText, helv, 7.5, CONTENT_W - 24);
  let discY = y - 30;
  for (const dl of disclaimerLines) {
    drawText(coverPage, dl, { x: MARGIN_X + 12, y: discY, size: 7.5, font: helv, color: rgb(0.3, 0.35, 0.42) });
    discY -= 11;
  }

  drawText(coverPage, `Entity: ${COMPANY_NAME} | GSTIN: ${COMPANY_GSTIN} | ${COMPANY_ADDRESS}`, {
    x: MARGIN_X + 12,
    y: y - 70,
    size: 7,
    font: helvBold,
    color: TEXT_MUTED,
  });

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
      const emailHtml = renderEmailEvidenceHtmlDocument({
        email,
        emailIndex: idx,
        totalEmails: sortedEmails.length,
        orderCode: data.order.applicationCode,
        hasInvoiceAttachment: Boolean(data.invoice),
      });

      const emailPdfBytes = await renderHtmlToPdfBuffer(emailHtml);
      const emailDoc = await PDFDocument.load(emailPdfBytes);
      const copiedPages = await mergedPdf.copyPages(emailDoc, emailDoc.getPageIndices());
      for (const page of copiedPages) {
        mergedPdf.addPage(page);
      }
    } catch (renderErr) {
      console.error(`[dispute-pdf] Failed to render email #${idx + 1} with Chromium:`, renderErr);
      // Fallback page in case of severe rendering fault
      const fallbackPage = mergedPdf.addPage([PAGE_W, PAGE_H]);
      drawText(fallbackPage, `EVIDENCE ITEM: SENT EMAIL #${idx + 1} OF ${sortedEmails.length}`, {
        x: MARGIN_X,
        y: PAGE_H - 40,
        size: 11,
        font: helvBold,
        color: NAVY,
      });
      drawText(fallbackPage, `Subject: ${safePdfText(email.subject)}`, {
        x: MARGIN_X,
        y: PAGE_H - 60,
        size: 9,
        font: helv,
        color: TEXT_DARK,
      });
      drawText(fallbackPage, `To: ${safePdfText(email.to_email)} | Sent: ${formatIST(email.sent_at)}`, {
        x: MARGIN_X,
        y: PAGE_H - 75,
        size: 8.5,
        font: helv,
        color: TEXT_MUTED,
      });
      const lines = wrap(email.body_text || email.body_html || "Content unavailable", helv, 8, CONTENT_W);
      let fy = PAGE_H - 100;
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

  // ══════════════════════════════════════════════════════════════════════════
  // 5. STAMP RUNNING FOOTER ON ALL PAGES
  // ══════════════════════════════════════════════════════════════════════════
  const totalPages = mergedPdf.getPageCount();
  const disputeTag = data.disputeId ? `Dispute ID: ${data.disputeId}` : `Dispute Evidence ID: ${data.packageId.slice(0, 8)}`;

  for (let i = 0; i < totalPages; i++) {
    const page = mergedPdf.getPage(i);
    const footY = 20;

    page.drawLine({
      start: { x: MARGIN_X, y: footY + 8 },
      end: { x: PAGE_W - MARGIN_X, y: footY + 8 },
      thickness: 0.5,
      color: BORDER_COLOR,
    });

    drawText(page, `Order: ${data.order.applicationCode}  |  ${disputeTag}`, {
      x: MARGIN_X,
      y: footY,
      size: 7,
      font: helv,
      color: TEXT_MUTED,
    });

    const pageStr = `Page ${i + 1} of ${totalPages}`;
    const pWidth = textWidth(helvBold, pageStr, 7);
    drawText(page, pageStr, {
      x: PAGE_W - MARGIN_X - pWidth,
      y: footY,
      size: 7,
      font: helvBold,
      color: TEXT_MUTED,
    });
  }

  return await mergedPdf.save();
}
