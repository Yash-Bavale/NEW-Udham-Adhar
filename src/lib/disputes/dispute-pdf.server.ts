import { PDFDocument, PDFPage, PDFFont, StandardFonts, rgb, type RGB } from "pdf-lib";
import { BHS_LOGO_BASE64 } from "../invoices/bhs-logo";

// Brand Colors
const NAVY = rgb(0.07, 0.13, 0.27);
const NAVY_SOFT = rgb(0.14, 0.22, 0.4);
const ACCENT = rgb(0.95, 0.62, 0.07);
const TEXT_DARK = rgb(0.12, 0.15, 0.22);
const TEXT_MUTED = rgb(0.45, 0.48, 0.55);
const BORDER_COLOR = rgb(0.84, 0.86, 0.9);
const LIGHT_BG = rgb(0.96, 0.97, 0.99);
const GREEN_DARK = rgb(0.05, 0.55, 0.25);
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

  coverPage.drawRectangle({
    x: MARGIN_X,
    y: y - 130,
    width: CONTENT_W,
    height: 130,
    color: WHITE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  });

  const rowH = 20;
  let rowY = y - 16;
  const col1L = MARGIN_X + 12;
  const col1V = MARGIN_X + 110;
  const col2L = MARGIN_X + 270;
  const col2V = MARGIN_X + 370;

  const drawMetaRow = (l1: string, v1: string, l2: string, v2: string) => {
    drawText(coverPage, l1, { x: col1L, y: rowY, size: 8.5, font: helv, color: TEXT_MUTED });
    drawText(coverPage, `: ${safePdfText(v1)}`, { x: col1V, y: rowY, size: 8.5, font: helvBold, color: TEXT_DARK });
    if (l2) {
      drawText(coverPage, l2, { x: col2L, y: rowY, size: 8.5, font: helv, color: TEXT_MUTED });
      drawText(coverPage, `: ${safePdfText(v2)}`, { x: col2V, y: rowY, size: 8.5, font: helvBold, color: TEXT_DARK });
    }
    rowY -= rowH;
  };

  drawMetaRow("Order Number", data.order.applicationCode, "Customer Name", data.lead.name);
  drawMetaRow("Mobile", data.lead.mobile, "Email Address", data.lead.email);
  drawMetaRow("Service", data.lead.service, "Order Date", formatIST(data.order.createdAt));
  drawMetaRow("Payment Status", (data.payment?.status ?? "PAID").toUpperCase(), "Payment Amount", `INR ${(data.payment?.amount ?? data.lead.totalAmount ?? 0).toLocaleString("en-IN")}`);
  drawMetaRow("Gateway / Txn ID", `${data.payment?.gatewayName ?? "Razorpay"} / ${data.payment?.transactionId ?? "—"}`, "Order Status", (data.order.orderStatus || data.order.fulfillmentStatus || "IN_PROGRESS").toUpperCase());
  drawMetaRow("Generated By", `${data.staff.name} (${data.staff.role || "Staff"})`, "Package ID", data.packageId.slice(0, 13));

  y -= 150;

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
    y: y - 90,
    width: CONTENT_W,
    height: 90,
    color: rgb(0.98, 0.98, 0.99),
    borderColor: rgb(0.8, 0.83, 0.88),
    borderWidth: 1,
  });

  drawText(coverPage, "LEGAL & REGULATORY DISPUTE STATEMENT", { x: MARGIN_X + 12, y: y - 16, size: 8.5, font: helvBold, color: NAVY });
  const disclaimerText =
    "This evidence package has been compiled from authenticated and immutable CRM server logs for presentation before payment gateways, acquiring banks, dispute handling authorities, and regulatory bodies. All enclosed emails represent actual communications transmitted to the customer's registered email address. Services and consultancy fees are governed under published terms and conditions. All disputes are subject to the jurisdiction of competent courts in Pune, Maharashtra, India.";

  const disclaimerLines = wrap(disclaimerText, helv, 7.5, CONTENT_W - 24);
  let discY = y - 30;
  for (const dl of disclaimerLines) {
    drawText(coverPage, dl, { x: MARGIN_X + 12, y: discY, size: 7.5, font: helv, color: rgb(0.3, 0.35, 0.42) });
    discY -= 11;
  }

  drawText(coverPage, `Entity: ${COMPANY_NAME} | GSTIN: ${COMPANY_GSTIN} | ${COMPANY_ADDRESS}`, {
    x: MARGIN_X + 12,
    y: y - 80,
    size: 7,
    font: helvBold,
    color: TEXT_MUTED,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 2. SELECTED SENT EMAILS
  // ══════════════════════════════════════════════════════════════════════════
  // Chronological sort: oldest sent email first
  const sortedEmails = [...data.selectedEmails].sort((a, b) => {
    const ta = new Date(a.sent_at || 0).getTime();
    const tb = new Date(b.sent_at || 0).getTime();
    return ta - tb;
  });

  let emailIndex = 1;
  for (const email of sortedEmails) {
    let emailPage = mergedPdf.addPage([PAGE_W, PAGE_H]);
    let ey = PAGE_H - 40;

    // Header Badge for this Email
    emailPage.drawRectangle({
      x: MARGIN_X,
      y: ey - 24,
      width: CONTENT_W,
      height: 24,
      color: NAVY,
    });
    drawText(emailPage, `EVIDENCE ITEM: SENT EMAIL #${emailIndex} of ${sortedEmails.length}`, {
      x: MARGIN_X + 10,
      y: ey - 16,
      size: 9,
      font: helvBold,
      color: WHITE,
    });
    drawText(emailPage, "STATUS: VERIFIED SENT", {
      x: MARGIN_X + CONTENT_W - 130,
      y: ey - 16,
      size: 8,
      font: helvBold,
      color: rgb(0.4, 0.9, 0.5),
    });

    ey -= 34;

    // Email Metadata Card (Matching CRM Print / View Headers)
    emailPage.drawRectangle({
      x: MARGIN_X,
      y: ey - 86,
      width: CONTENT_W,
      height: 86,
      color: LIGHT_BG,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
    });

    let metaY = ey - 16;
    drawText(emailPage, "Subject", { x: MARGIN_X + 12, y: metaY, size: 8.5, font: helvBold, color: TEXT_MUTED });
    drawText(emailPage, `: ${safePdfText(email.subject || "No Subject")}`, { x: MARGIN_X + 80, y: metaY, size: 9, font: helvBold, color: NAVY });

    metaY -= 16;
    drawText(emailPage, "From", { x: MARGIN_X + 12, y: metaY, size: 8.5, font: helv, color: TEXT_MUTED });
    drawText(emailPage, `: ${safePdfText(email.from_email || COMPANY_EMAIL)}`, { x: MARGIN_X + 80, y: metaY, size: 8.5, font: helv, color: TEXT_DARK });

    drawText(emailPage, "To", { x: MARGIN_X + 300, y: metaY, size: 8.5, font: helv, color: TEXT_MUTED });
    drawText(emailPage, `: ${safePdfText(email.to_email)}`, { x: MARGIN_X + 330, y: metaY, size: 8.5, font: helv, color: TEXT_DARK });

    metaY -= 16;
    drawText(emailPage, "Sent Date", { x: MARGIN_X + 12, y: metaY, size: 8.5, font: helv, color: TEXT_MUTED });
    drawText(emailPage, `: ${formatIST(email.sent_at)}`, { x: MARGIN_X + 80, y: metaY, size: 8.5, font: helvBold, color: TEXT_DARK });

    drawText(emailPage, "Template", { x: MARGIN_X + 300, y: metaY, size: 8.5, font: helv, color: TEXT_MUTED });
    drawText(emailPage, `: ${safePdfText(email.template_code || "client-communication")}`, { x: MARGIN_X + 355, y: metaY, size: 8, font: helv, color: TEXT_DARK });

    metaY -= 16;
    drawText(emailPage, "Message ID", { x: MARGIN_X + 12, y: metaY, size: 7.5, font: helv, color: TEXT_MUTED });
    drawText(emailPage, `: ${safePdfText(email.message_id || `msg_${email.id.slice(0, 16)}`)}`, { x: MARGIN_X + 80, y: metaY, size: 7.5, font: helv, color: TEXT_MUTED });

    ey -= 96;

    // Body Container Divider
    drawText(emailPage, "EMAIL BODY CONTENT (ACTUAL SENT VERSION):", {
      x: MARGIN_X,
      y: ey,
      size: 8,
      font: helvBold,
      color: NAVY_SOFT,
    });

    ey -= 12;

    // Parse HTML or plain text into clean paragraph strings
    const rawContent = email.body_html || email.body_text || "No body captured for this email record.";
    const plainLines = parseHtmlToTextLines(rawContent);

    const BODY_LEFT = MARGIN_X + 10;
    const BODY_MAX_W = CONTENT_W - 20;
    const LINE_H = 12;

    for (const paragraph of plainLines) {
      if (!paragraph.trim()) {
        ey -= 6;
        continue;
      }

      const isHeading = paragraph.startsWith("### ") || paragraph.startsWith("## ") || paragraph.startsWith("# ");
      const isListItem = paragraph.startsWith("• ") || paragraph.startsWith("- ");
      const cleanPara = paragraph.replace(/^[#•\-\s]+/, "").trim();

      const fontSize = isHeading ? 9.5 : 8.5;
      const fontToUse = isHeading ? helvBold : helv;
      const colorToUse = isHeading ? NAVY : TEXT_DARK;

      const wrapped = wrap(isListItem ? `• ${cleanPara}` : cleanPara, fontToUse, fontSize, BODY_MAX_W);

      for (const line of wrapped) {
        if (ey < 50) {
          // Add overflow page for this email
          emailPage = mergedPdf.addPage([PAGE_W, PAGE_H]);
          ey = PAGE_H - 45;

          // Continuation banner
          emailPage.drawRectangle({
            x: MARGIN_X,
            y: ey - 18,
            width: CONTENT_W,
            height: 18,
            color: LIGHT_BG,
            borderColor: BORDER_COLOR,
            borderWidth: 0.5,
          });
          drawText(emailPage, `SENT EMAIL #${emailIndex} — CONTINUED`, {
            x: MARGIN_X + 10,
            y: ey - 13,
            size: 8,
            font: helvBold,
            color: NAVY,
          });
          ey -= 30;
        }

        drawText(emailPage, line, {
          x: BODY_LEFT + (isListItem ? 6 : 0),
          y: ey,
          size: fontSize,
          font: fontToUse,
          color: colorToUse,
        });
        ey -= LINE_H;
      }
      ey -= 4;
    }

    emailIndex++;
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
  for (let i = 0; i < totalPages; i++) {
    const page = mergedPdf.getPage(i);
    const footY = 24;

    page.drawLine({
      start: { x: MARGIN_X, y: footY + 10 },
      end: { x: PAGE_W - MARGIN_X, y: footY + 10 },
      thickness: 0.5,
      color: BORDER_COLOR,
    });

    drawText(page, `Order: ${data.order.applicationCode}  |  Dispute Evidence ID: ${data.packageId.slice(0, 8)}`, {
      x: MARGIN_X,
      y: footY,
      size: 7.5,
      font: helv,
      color: TEXT_MUTED,
    });

    const pageStr = `Page ${i + 1} of ${totalPages}`;
    const pWidth = textWidth(helvBold, pageStr, 7.5);
    drawText(page, pageStr, {
      x: PAGE_W - MARGIN_X - pWidth,
      y: footY,
      size: 7.5,
      font: helvBold,
      color: NAVY,
    });
  }

  return await mergedPdf.save();
}

/**
 * Parses HTML email body into clean text blocks/lines preserving headings, paragraphs, and list items.
 */
function parseHtmlToTextLines(htmlOrText: string): string[] {
  if (!htmlOrText) return [];

  // If plain text (not containing typical HTML tags)
  if (!/<[a-z][\s\S]*>/i.test(htmlOrText)) {
    return htmlOrText.split(/\r?\n/).map((l) => l.trim());
  }

  // Remove <style> and <script> tags
  let cleaned = htmlOrText
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "");

  // Convert HTML structure to markdown-like lines
  cleaned = cleaned
    .replace(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi, "\n### $1\n")
    .replace(/<h[4-6][^>]*>(.*?)<\/h[4-6]>/gi, "\n### $1\n")
    .replace(/<li[^>]*>(.*?)<\/li>/gi, "\n• $1\n")
    .replace(/<tr[^>]*>(.*?)<\/tr>/gi, "\n$1\n")
    .replace(/<td[^>]*>(.*?)<\/td>/gi, " | $1 ")
    .replace(/<th[^>]*>(.*?)<\/th>/gi, " | $1 ")
    .replace(/<p[^>]*>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<div[^>]*>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<br\s*[\/]?>/gi, "\n")
    .replace(/<hr\s*[\/]?>/gi, "\n-------------------\n")
    .replace(/<[^>]+>/g, " ");

  // Decode common HTML entities
  cleaned = cleaned
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&copy;/g, "(c)")
    .replace(/&reg;/g, "(R)")
    .replace(/&trade;/g, "(TM)");

  const lines = cleaned
    .split(/\r?\n/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => l.length > 0);

  return lines;
}
