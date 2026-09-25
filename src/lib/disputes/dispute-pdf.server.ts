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
  
  // Row 5: Gateway & Transaction ID (Full line without overlapping Order Status)
  drawText(coverPage, "Gateway / Txn ID", { x: col1L, y: rowY, size: 8.5, font: helv, color: TEXT_MUTED });
  drawText(coverPage, `: ${data.payment?.gatewayName ?? "Razorpay"} / ${data.payment?.transactionId ?? "—"}`, {
    x: col1V,
    y: rowY,
    size: 8.5,
    font: helvBold,
    color: TEXT_DARK,
  });
  rowY -= rowH;

  // Row 6: Generated By & (Optional) Dispute ID
  drawText(coverPage, "Generated By", { x: col1L, y: rowY, size: 8.5, font: helv, color: TEXT_MUTED });
  drawText(coverPage, `: ${data.staff.name} (${data.staff.role || "Staff"})`, { x: col1V, y: rowY, size: 8.5, font: helvBold, color: TEXT_DARK });
  if (data.disputeId) {
    drawText(coverPage, "Dispute ID", { x: col2L, y: rowY, size: 8.5, font: helv, color: TEXT_MUTED });
    drawText(coverPage, `: ${safePdfText(data.disputeId)}`, { x: col2V, y: rowY, size: 8.5, font: helvBold, color: rgb(0.7, 0.15, 0.1) });
  }

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

  // Section 3: Legal & Audit Statement (Specified Jurisdiction sentence removed as requested)
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

    // Header Banner for this Email (STATUS: VERIFIED SENT removed as requested)
    emailPage.drawRectangle({
      x: MARGIN_X,
      y: ey - 24,
      width: CONTENT_W,
      height: 24,
      color: NAVY,
    });
    drawText(emailPage, `EVIDENCE ITEM: SENT EMAIL #${emailIndex} of ${sortedEmails.length}`, {
      x: MARGIN_X + 12,
      y: ey - 16,
      size: 9,
      font: helvBold,
      color: WHITE,
    });

    ey -= 34;

    // Email Metadata Card (Template ID removed as requested)
    emailPage.drawRectangle({
      x: MARGIN_X,
      y: ey - 68,
      width: CONTENT_W,
      height: 68,
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

    drawText(emailPage, "Message ID", { x: MARGIN_X + 300, y: metaY, size: 8, font: helv, color: TEXT_MUTED });
    drawText(emailPage, `: ${safePdfText(email.message_id || `msg_${email.id.slice(0, 16)}`)}`, { x: MARGIN_X + 360, y: metaY, size: 7.5, font: helv, color: TEXT_MUTED });

    ey -= 78;

    // Body Container Header (ACTUAL SENT VERSION text removed as requested)
    drawText(emailPage, "EMAIL BODY CONTENT:", {
      x: MARGIN_X,
      y: ey,
      size: 8.5,
      font: helvBold,
      color: NAVY_SOFT,
    });

    ey -= 14;

    // High-Fidelity Structured Rendering of Email Body
    const rawContent = email.body_html || email.body_text || "No body captured for this email record.";
    const blocks = parseHtmlToDocumentBlocks(rawContent);

    const BODY_LEFT = MARGIN_X + 6;
    const BODY_MAX_W = CONTENT_W - 12;

    const ensureSpace = (requiredH: number) => {
      if (ey - requiredH < 45) {
        emailPage = mergedPdf.addPage([PAGE_W, PAGE_H]);
        ey = PAGE_H - 45;
      }
    };

    for (const block of blocks) {
      if (block.type === "heading") {
        ensureSpace(24);
        ey -= 4;
        drawText(emailPage, block.text, {
          x: BODY_LEFT,
          y: ey,
          size: 9.5,
          font: helvBold,
          color: NAVY,
        });
        ey -= 14;
      } else if (block.type === "paragraph") {
        const wrapped = wrap(block.text, helv, 8.5, BODY_MAX_W);
        for (const line of wrapped) {
          ensureSpace(12);
          drawText(emailPage, line, {
            x: BODY_LEFT,
            y: ey,
            size: 8.5,
            font: helv,
            color: TEXT_DARK,
          });
          ey -= 12;
        }
        ey -= 4;
      } else if (block.type === "list_item") {
        const wrapped = wrap(block.text, helv, 8.5, BODY_MAX_W - 14);
        let first = true;
        for (const line of wrapped) {
          ensureSpace(12);
          if (first) {
            drawText(emailPage, "*", {
              x: BODY_LEFT + 2,
              y: ey,
              size: 9,
              font: helvBold,
              color: ACCENT,
            });
            drawText(emailPage, line, {
              x: BODY_LEFT + 14,
              y: ey,
              size: 8.5,
              font: helv,
              color: TEXT_DARK,
            });
            first = false;
          } else {
            drawText(emailPage, line, {
              x: BODY_LEFT + 14,
              y: ey,
              size: 8.5,
              font: helv,
              color: TEXT_DARK,
            });
          }
          ey -= 12;
        }
        ey -= 2;
      } else if (block.type === "table_2col") {
        // Structured 2-column key-value rendering (like Order Summary)
        const rowHeight = 15;
        const keyW = 180;
        const valW = BODY_MAX_W - keyW;

        for (let r = 0; r < block.rows.length; r++) {
          ensureSpace(rowHeight + 2);
          const row = block.rows[r];
          const isEven = r % 2 === 0;

          // Subtle background for alternating rows
          emailPage.drawRectangle({
            x: BODY_LEFT,
            y: ey - rowHeight + 4,
            width: BODY_MAX_W,
            height: rowHeight,
            color: isEven ? LIGHT_BG : WHITE,
            borderColor: BORDER_COLOR,
            borderWidth: 0.5,
          });

          drawText(emailPage, wrap(row.key, helvBold, 8, keyW - 12)[0] || row.key, {
            x: BODY_LEFT + 8,
            y: ey - 8,
            size: 8,
            font: helvBold,
            color: TEXT_MUTED,
          });

          const isAmount = row.val.includes("Rs.") || row.val.includes("INR");
          drawText(emailPage, wrap(row.val, isAmount ? helvBold : helv, 8, valW - 12)[0] || row.val, {
            x: BODY_LEFT + keyW,
            y: ey - 8,
            size: 8,
            font: isAmount ? helvBold : helv,
            color: isAmount ? NAVY : TEXT_DARK,
          });

          ey -= rowHeight;
        }
        ey -= 6;
      } else if (block.type === "table_1col") {
        // Timeline or bullet list rows
        for (const item of block.rows) {
          ensureSpace(14);
          drawText(emailPage, item, {
            x: BODY_LEFT + 4,
            y: ey,
            size: 8.5,
            font: item.startsWith("[OK]") ? helvBold : helv,
            color: item.startsWith("[OK]") ? GREEN_DARK : TEXT_DARK,
          });
          ey -= 14;
        }
        ey -= 4;
      } else if (block.type === "hr") {
        ensureSpace(10);
        emailPage.drawLine({
          start: { x: BODY_LEFT, y: ey },
          end: { x: BODY_LEFT + BODY_MAX_W, y: ey },
          thickness: 0.5,
          color: BORDER_COLOR,
        });
        ey -= 8;
      }
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
  const disputeTag = data.disputeId ? `Dispute ID: ${data.disputeId}` : `Dispute Evidence ID: ${data.packageId.slice(0, 8)}`;

  for (let i = 0; i < totalPages; i++) {
    const page = mergedPdf.getPage(i);
    const footY = 24;

    page.drawLine({
      start: { x: MARGIN_X, y: footY + 10 },
      end: { x: PAGE_W - MARGIN_X, y: footY + 10 },
      thickness: 0.5,
      color: BORDER_COLOR,
    });

    drawText(page, `Order: ${data.order.applicationCode}  |  ${disputeTag}`, {
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
 * Decodes HTML entities (numeric and named) into safe text equivalents.
 */
function decodeHtmlEntities(raw: string): string {
  if (!raw) return "";
  let s = raw;

  // Numeric decimal entities &#8377;
  s = s.replace(/&#(\d+);/g, (_, dec) => {
    const code = parseInt(dec, 10);
    if (code === 8377 || code === 0x20b9) return "Rs.";
    if (code === 9989 || code === 10004 || code === 10003) return "[OK] ";
    if (code === 8987) return "[Pending] ";
    if (code === 128231 || code === 9993) return "[Email] ";
    if (code === 8226 || code === 9679) return "* ";
    if (code === 8211 || code === 8212) return "-";
    if (code === 8216 || code === 8217) return "'";
    if (code === 8220 || code === 8221) return '"';
    if (code === 8230) return "...";
    try {
      return String.fromCharCode(code);
    } catch {
      return " ";
    }
  });

  // Numeric hex entities &#x20b9;
  s = s.replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
    const code = parseInt(hex, 16);
    if (code === 8377 || code === 0x20b9) return "Rs.";
    if (code === 9989 || code === 10004 || code === 10003) return "[OK] ";
    if (code === 8987) return "[Pending] ";
    if (code === 128231 || code === 9993) return "[Email] ";
    if (code === 8226 || code === 9679) return "* ";
    if (code === 8211 || code === 8212) return "-";
    if (code === 8216 || code === 8217) return "'";
    if (code === 8220 || code === 8221) return '"';
    if (code === 8230) return "...";
    try {
      return String.fromCharCode(code);
    } catch {
      return " ";
    }
  });

  // Named entities
  const named: Record<string, string> = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&apos;": "'",
    "&#39;": "'",
    "&#x27;": "'",
    "&bull;": "* ",
    "&copy;": "(c)",
    "&reg;": "(R)",
    "&trade;": "(TM)",
    "&mdash;": "-",
    "&ndash;": "-",
    "&hellip;": "...",
    "&check;": "[OK] ",
    "&cross;": "[X] ",
    "&rupee;": "Rs.",
    "&inr;": "Rs.",
    "&deg;": " deg ",
  };

  for (const [k, v] of Object.entries(named)) {
    s = s.replaceAll(k, v);
  }

  return s;
}

type DocumentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list_item"; text: string }
  | { type: "table_2col"; rows: Array<{ key: string; val: string }> }
  | { type: "table_1col"; rows: string[] }
  | { type: "hr" };

function stripTags(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parses HTML email body into high-fidelity structured blocks for PDF rendering.
 */
function parseHtmlToDocumentBlocks(htmlOrText: string): DocumentBlock[] {
  if (!htmlOrText) return [];

  // Plain text fallback
  if (!/<[a-z][\s\S]*>/i.test(htmlOrText)) {
    const rawLines = decodeHtmlEntities(htmlOrText).split(/\r?\n/);
    const blocks: DocumentBlock[] = [];
    for (const rawL of rawLines) {
      const l = rawL.trim();
      if (!l) continue;
      if (l.startsWith("---") || l.startsWith("===")) {
        blocks.push({ type: "hr" });
      } else if (l.startsWith("• ") || l.startsWith("* ") || l.startsWith("- ")) {
        blocks.push({ type: "list_item", text: l.replace(/^[•*\-\s]+/, "") });
      } else if (l.includes(":") && l.length < 80 && !l.startsWith("http")) {
        const parts = l.split(":");
        blocks.push({
          type: "table_2col",
          rows: [{ key: parts[0].trim(), val: parts.slice(1).join(":").trim() }],
        });
      } else {
        blocks.push({ type: "paragraph", text: l });
      }
    }
    return blocks;
  }

  // Remove <style>, <script>, <head>
  let cleanHtml = htmlOrText
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "");

  const blocks: DocumentBlock[] = [];

  // Extract tables separately
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tableRegex.exec(cleanHtml)) !== null) {
    const beforeTable = cleanHtml.slice(lastIndex, match.index);
    if (beforeTable.trim()) {
      blocks.push(...parseNonTableHtml(beforeTable));
    }

    // Process Table Content
    const tableHtml = match[1];
    const rowMatches = tableHtml.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
    const twoColRows: Array<{ key: string; val: string }> = [];
    const oneColRows: string[] = [];

    for (const rowHtml of rowMatches) {
      const cellMatches = rowHtml.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || [];
      const cellTexts = cellMatches.map((c) => stripTags(c)).filter((t) => t.length > 0);

      if (cellTexts.length >= 2) {
        twoColRows.push({ key: cellTexts[0], val: cellTexts.slice(1).join(" — ") });
      } else if (cellTexts.length === 1) {
        oneColRows.push(cellTexts[0]);
      }
    }

    if (twoColRows.length > 0) {
      blocks.push({ type: "table_2col", rows: twoColRows });
    }
    if (oneColRows.length > 0) {
      blocks.push({ type: "table_1col", rows: oneColRows });
    }

    lastIndex = match.index + match[0].length;
  }

  const remaining = cleanHtml.slice(lastIndex);
  if (remaining.trim()) {
    blocks.push(...parseNonTableHtml(remaining));
  }

  return blocks;
}

function parseNonTableHtml(html: string): DocumentBlock[] {
  const blocks: DocumentBlock[] = [];

  // Normalize breaks and list items
  const tokens = html
    .replace(/<hr\s*[\/]?>/gi, "\n[[[HR]]]\n")
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, "\n[[[H]]]$1\n")
    .replace(/<li[^>]*>(.*?)<\/li>/gi, "\n[[[LI]]]$1\n")
    .replace(/<p[^>]*>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<div[^>]*>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<br\s*[\/]?>/gi, "\n")
    .split(/\r?\n/);

  for (const rawToken of tokens) {
    const t = rawToken.trim();
    if (!t) continue;

    if (t.includes("[[[HR]]]")) {
      blocks.push({ type: "hr" });
    } else if (t.startsWith("[[[H]]]")) {
      const text = stripTags(t.replace("[[[H]]]", ""));
      if (text) blocks.push({ type: "heading", text });
    } else if (t.startsWith("[[[LI]]]")) {
      const text = stripTags(t.replace("[[[LI]]]", ""));
      if (text) blocks.push({ type: "list_item", text });
    } else {
      const text = stripTags(t);
      if (text) {
        // Detect bold heading paragraphs e.g. "Order Summary" or "Order Timeline"
        if (
          (text.endsWith("Summary") || text.endsWith("Timeline") || text.endsWith("Information") || text.startsWith("Dear ") || text.length < 30) &&
          !text.includes(".") &&
          !text.includes(",")
        ) {
          blocks.push({ type: "heading", text });
        } else {
          blocks.push({ type: "paragraph", text });
        }
      }
    }
  }

  return blocks;
}
