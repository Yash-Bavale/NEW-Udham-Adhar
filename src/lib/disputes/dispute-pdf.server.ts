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
const GREEN_BG = rgb(0.93, 0.98, 0.95);
const GREEN_BORDER = rgb(0.65, 0.88, 0.72);
const AMBER_BG = rgb(1, 0.98, 0.92);
const AMBER_BORDER = rgb(0.96, 0.78, 0.35);
const AMBER_TEXT = rgb(0.65, 0.35, 0.05);
const BLUE_BG = rgb(0.93, 0.96, 1);
const BLUE_BORDER = rgb(0.7, 0.82, 0.98);
const BLUE_TEXT = rgb(0.1, 0.3, 0.7);
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
  // 2. SELECTED SENT EMAILS (High-Fidelity Visual Email Print Layout)
  // ══════════════════════════════════════════════════════════════════════════
  const sortedEmails = [...data.selectedEmails].sort((a, b) => {
    const ta = new Date(a.sent_at || 0).getTime();
    const tb = new Date(b.sent_at || 0).getTime();
    return ta - tb;
  });

  const GOLD_LINE = rgb(0.92, 0.62, 0.15);
  const LINK_BLUE = rgb(0.12, 0.28, 0.8);
  const HEADER_YELLOW_BG = rgb(1, 0.99, 0.9);
  const HEADER_YELLOW_BORDER = rgb(0.92, 0.86, 0.72);
  const INDIGO_BTN = rgb(0.31, 0.27, 0.9);

  for (const email of sortedEmails) {
    let emailPageNum = 1;
    let emailPage = mergedPdf.addPage([PAGE_W, PAGE_H]);
    let ey = PAGE_H - 28;

    const drawPageLabel = (p: PDFPage, num: number) => {
      const pStr = `Evidence Email #${sortedEmails.indexOf(email) + 1} · Page ${num}`;
      const pw = textWidth(helv, pStr, 7.5);
      drawText(p, pStr, { x: (PAGE_W - pw) / 2, y: PAGE_H - 18, size: 7.5, font: helv, color: TEXT_MUTED });
    };

    drawPageLabel(emailPage, emailPageNum);

    // ── Email Client Header Box (Yellow/Cream Background) ──
    const subLines = wrap(email.subject || "Customer Notification", helvBold, 8, CONTENT_W - 90);
    const subHeight = Math.max(subLines.length, 1) * 13;
    const hasAttachment = Boolean(data.invoice);
    const attachHeight = hasAttachment ? 14 : 0;
    const headerBoxH = 70 + subHeight + attachHeight;

    emailPage.drawRectangle({
      x: MARGIN_X,
      y: ey - headerBoxH,
      width: CONTENT_W,
      height: headerBoxH,
      color: HEADER_YELLOW_BG,
      borderColor: HEADER_YELLOW_BORDER,
      borderWidth: 1,
    });

    let hy = ey - 14;
    const labelX = MARGIN_X + 12;
    const valX = MARGIN_X + 70;

    // From
    drawText(emailPage, "From:", { x: labelX, y: hy, size: 8, font: helvBold, color: TEXT_DARK });
    drawText(emailPage, `"Business Help Services" <${email.from_email || COMPANY_EMAIL}>`, {
      x: valX,
      y: hy,
      size: 8,
      font: helv,
      color: LINK_BLUE,
    });

    // Verification Badge Right
    emailPage.drawRectangle({
      x: MARGIN_X + CONTENT_W - 130,
      y: hy - 4,
      width: 120,
      height: 14,
      color: GREEN_BG,
      borderColor: GREEN_BORDER,
      borderWidth: 0.5,
    });
    drawText(emailPage, "[OK] SPF / DKIM / TLS PASS", {
      x: MARGIN_X + CONTENT_W - 124,
      y: hy,
      size: 6.5,
      font: helvBold,
      color: GREEN_DARK,
    });

    hy -= 13;
    // To
    drawText(emailPage, "To:", { x: labelX, y: hy, size: 8, font: helvBold, color: TEXT_DARK });
    drawText(emailPage, safePdfText(email.to_email), {
      x: valX,
      y: hy,
      size: 8,
      font: helv,
      color: LINK_BLUE,
    });

    hy -= 13;
    // Date
    drawText(emailPage, "Date:", { x: labelX, y: hy, size: 8, font: helvBold, color: TEXT_DARK });
    drawText(emailPage, formatIST(email.sent_at), {
      x: valX,
      y: hy,
      size: 8,
      font: helv,
      color: TEXT_DARK,
    });

    hy -= 13;
    // Subject
    drawText(emailPage, "Subject:", { x: labelX, y: hy, size: 8, font: helvBold, color: TEXT_DARK });
    for (let s = 0; s < subLines.length; s++) {
      drawText(emailPage, safePdfText(subLines[s]), {
        x: valX,
        y: hy,
        size: 8,
        font: helvBold,
        color: TEXT_DARK,
      });
      hy -= 13;
    }

    if (hasAttachment) {
      drawText(emailPage, "Attachments:", { x: labelX, y: hy, size: 8, font: helvBold, color: TEXT_DARK });
      drawText(emailPage, `Tax-Invoice-${data.order.applicationCode}.pdf (Verified)`, {
        x: valX,
        y: hy,
        size: 8,
        font: helv,
        color: LINK_BLUE,
      });
      hy -= 13;
    }

    // Message ID footer in header box
    drawText(emailPage, "Message-ID:", { x: labelX, y: hy, size: 7, font: helvBold, color: TEXT_MUTED });
    drawText(emailPage, email.message_id || `msg_${email.id.slice(0, 16)}@businesshelpservices.com`, {
      x: valX,
      y: hy,
      size: 7,
      font: helv,
      color: TEXT_MUTED,
    });

    ey -= (headerBoxH + 16);

    // ── Email Visual Content Rendering ──
    const rawContent = email.body_html || email.body_text || "No email content recorded.";
    const blocks = parseRichHtmlToBlocks(rawContent, email.subject);

    const BODY_LEFT = MARGIN_X;
    const BODY_MAX_W = CONTENT_W;

    const ensureSpace = (requiredH: number) => {
      if (ey - requiredH < 45) {
        emailPageNum++;
        emailPage = mergedPdf.addPage([PAGE_W, PAGE_H]);
        drawPageLabel(emailPage, emailPageNum);
        ey = PAGE_H - 35;
      }
    };

    for (const block of blocks) {
      if (block.type === "banner") {
        ensureSpace(34);
        const bgColor = block.colorScheme === "emerald" ? GREEN_DARK : block.colorScheme === "amber" ? ACCENT : NAVY;
        emailPage.drawRectangle({
          x: BODY_LEFT,
          y: ey - 28,
          width: BODY_MAX_W,
          height: 28,
          color: bgColor,
        });
        emailPage.drawRectangle({
          x: BODY_LEFT,
          y: ey - 30,
          width: BODY_MAX_W,
          height: 2,
          color: GOLD_LINE,
        });
        drawText(emailPage, block.title.toUpperCase(), {
          x: BODY_LEFT + 12,
          y: ey - 18,
          size: 9.5,
          font: helvBold,
          color: WHITE,
        });
        ey -= 40;
      } else if (block.type === "callout") {
        const bg = block.tone === "warning" ? AMBER_BG : block.tone === "success" ? GREEN_BG : BLUE_BG;
        const borderC = block.tone === "warning" ? AMBER_BORDER : block.tone === "success" ? GREEN_BORDER : BLUE_BORDER;
        const leftAccent = block.tone === "warning" ? ACCENT : block.tone === "success" ? GREEN_DARK : BLUE_TEXT;
        const txtColor = block.tone === "warning" ? AMBER_TEXT : block.tone === "success" ? GREEN_DARK : BLUE_TEXT;

        const wrapped = wrap(block.text, helv, 8, BODY_MAX_W - 24);
        const boxH = Math.max(wrapped.length * 12 + 16, 28);

        ensureSpace(boxH + 8);

        // Box background & outline
        emailPage.drawRectangle({
          x: BODY_LEFT,
          y: ey - boxH,
          width: BODY_MAX_W,
          height: boxH,
          color: bg,
          borderColor: borderC,
          borderWidth: 0.5,
        });

        // Left 3px accent bar
        emailPage.drawRectangle({
          x: BODY_LEFT,
          y: ey - boxH,
          width: 3.5,
          height: boxH,
          color: leftAccent,
        });

        let textY = ey - 14;
        for (const line of wrapped) {
          drawText(emailPage, line, {
            x: BODY_LEFT + 12,
            y: textY,
            size: 8,
            font: helv,
            color: txtColor,
          });
          textY -= 12;
        }

        ey -= (boxH + 10);
      } else if (block.type === "cta_button") {
        ensureSpace(34);
        const btnW = Math.min(textWidth(helvBold, block.label, 9) + 40, BODY_MAX_W);
        const btnX = BODY_LEFT + (BODY_MAX_W - btnW) / 2;

        emailPage.drawRectangle({
          x: btnX,
          y: ey - 24,
          width: btnW,
          height: 24,
          color: INDIGO_BTN,
        });

        const labelW = textWidth(helvBold, block.label, 8.5);
        drawText(emailPage, block.label, {
          x: btnX + (btnW - labelW) / 2,
          y: ey - 16,
          size: 8.5,
          font: helvBold,
          color: WHITE,
        });

        ey -= 34;
      } else if (block.type === "key_val_grid") {
        if (block.title) {
          ensureSpace(20);
          drawText(emailPage, block.title.toUpperCase(), {
            x: BODY_LEFT,
            y: ey,
            size: 9,
            font: helvBold,
            color: NAVY,
          });
          emailPage.drawLine({
            start: { x: BODY_LEFT, y: ey - 4 },
            end: { x: BODY_LEFT + BODY_MAX_W, y: ey - 4 },
            thickness: 1,
            color: GOLD_LINE,
          });
          ey -= 14;
        }

        const keyW = 160;
        const valW = BODY_MAX_W - keyW;

        for (let r = 0; r < block.rows.length; r++) {
          const row = block.rows[r];
          const isEven = r % 2 === 0;
          const isAmount = row.val.includes("Rs.") || row.val.includes("INR") || row.val.includes("₹");

          const keyLines = wrap(row.key, helv, 8, keyW - 14);
          const valLines = wrap(row.val, helvBold, 8, valW - 14);
          const lineCount = Math.max(keyLines.length, valLines.length, 1);
          const rowHeight = lineCount * 12 + 6;

          ensureSpace(rowHeight + 2);

          emailPage.drawRectangle({
            x: BODY_LEFT,
            y: ey - rowHeight + 3,
            width: BODY_MAX_W,
            height: rowHeight,
            color: isEven ? LIGHT_BG : WHITE,
            borderColor: BORDER_COLOR,
            borderWidth: 0.5,
          });

          let kY = ey - 8;
          for (const kLine of keyLines) {
            drawText(emailPage, kLine, {
              x: BODY_LEFT + 8,
              y: kY,
              size: 8,
              font: helv,
              color: rgb(0.35, 0.4, 0.48),
            });
            kY -= 12;
          }

          let vY = ey - 8;
          for (const vLine of valLines) {
            drawText(emailPage, vLine, {
              x: BODY_LEFT + keyW,
              y: vY,
              size: 8,
              font: helvBold,
              color: isAmount ? NAVY : TEXT_DARK,
            });
            vY -= 12;
          }

          ey -= rowHeight;
        }
        ey -= 8;
      } else if (block.type === "timeline") {
        const totalH = block.steps.length * 16 + 12;
        ensureSpace(totalH + 10);

        if (block.title) {
          drawText(emailPage, block.title.toUpperCase(), {
            x: BODY_LEFT,
            y: ey,
            size: 9,
            font: helvBold,
            color: NAVY,
          });
          ey -= 12;
        }

        emailPage.drawRectangle({
          x: BODY_LEFT,
          y: ey - totalH + 4,
          width: BODY_MAX_W,
          height: totalH,
          color: LIGHT_BG,
          borderColor: BORDER_COLOR,
          borderWidth: 0.5,
        });

        let sY = ey - 10;
        for (const step of block.steps) {
          const isDone = step.status === "completed";
          const isCurr = step.status === "current";

          drawText(emailPage, isDone ? "[OK]" : isCurr ? "[*]" : "[ ]", {
            x: BODY_LEFT + 10,
            y: sY,
            size: 8,
            font: helvBold,
            color: isDone ? GREEN_DARK : isCurr ? ACCENT : TEXT_MUTED,
          });

          drawText(emailPage, step.label, {
            x: BODY_LEFT + 30,
            y: sY,
            size: 8,
            font: isDone || isCurr ? helvBold : helv,
            color: isDone ? GREEN_DARK : isCurr ? NAVY : TEXT_MUTED,
          });

          sY -= 16;
        }
        ey -= (totalH + 8);
      } else if (block.type === "heading") {
        const wrapped = wrap(block.text.toUpperCase(), helvBold, 9, BODY_MAX_W);
        ensureSpace(wrapped.length * 13 + 10);
        ey -= 4;
        for (const line of wrapped) {
          drawText(emailPage, line, {
            x: BODY_LEFT,
            y: ey,
            size: 9,
            font: helvBold,
            color: NAVY,
          });
          ey -= 12;
        }
        emailPage.drawLine({
          start: { x: BODY_LEFT, y: ey + 4 },
          end: { x: BODY_LEFT + BODY_MAX_W, y: ey + 4 },
          thickness: 1,
          color: GOLD_LINE,
        });
        ey -= 8;
      } else if (block.type === "paragraph") {
        const wrapped = wrap(block.text, block.isBold ? helvBold : helv, 8.5, BODY_MAX_W);
        for (const line of wrapped) {
          ensureSpace(12);
          drawText(emailPage, line, {
            x: BODY_LEFT,
            y: ey,
            size: 8.5,
            font: block.isBold ? helvBold : helv,
            color: TEXT_DARK,
          });
          ey -= 12;
        }
        ey -= 5;
      } else if (block.type === "list_item") {
        const wrapped = wrap(block.text, helv, 8, BODY_MAX_W - 14);
        let first = true;
        for (const line of wrapped) {
          ensureSpace(12);
          if (first) {
            drawText(emailPage, "*", {
              x: BODY_LEFT + 2,
              y: ey,
              size: 8.5,
              font: helvBold,
              color: ACCENT,
            });
            drawText(emailPage, line, {
              x: BODY_LEFT + 12,
              y: ey,
              size: 8,
              font: helv,
              color: TEXT_DARK,
            });
            first = false;
          } else {
            drawText(emailPage, line, {
              x: BODY_LEFT + 12,
              y: ey,
              size: 8,
              font: helv,
              color: TEXT_DARK,
            });
          }
          ey -= 11.5;
        }
        ey -= 3;
      } else if (block.type === "divider") {
        ensureSpace(10);
        emailPage.drawLine({
          start: { x: BODY_LEFT, y: ey },
          end: { x: BODY_LEFT + BODY_MAX_W, y: ey },
          thickness: 0.5,
          color: BORDER_COLOR,
        });
        ey -= 8;
      } else if (block.type === "disclaimer_box") {
        const wrapped = wrap(block.text, helv, 7.5, BODY_MAX_W - 16);
        const boxH = wrapped.length * 10.5 + 14;
        ensureSpace(boxH + 6);

        emailPage.drawRectangle({
          x: BODY_LEFT,
          y: ey - boxH,
          width: BODY_MAX_W,
          height: boxH,
          color: rgb(0.98, 0.98, 0.99),
          borderColor: BORDER_COLOR,
          borderWidth: 0.5,
        });

        let dY = ey - 10;
        for (const dLine of wrapped) {
          drawText(emailPage, dLine, {
            x: BODY_LEFT + 8,
            y: dY,
            size: 7.5,
            font: helv,
            color: TEXT_MUTED,
          });
          dY -= 10.5;
        }
        ey -= (boxH + 8);
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

type RichEmailBlock =
  | { type: "banner"; title: string; colorScheme: "navy" | "indigo" | "emerald" | "amber" }
  | { type: "callout"; text: string; tone: "warning" | "info" | "success" | "neutral" }
  | { type: "cta_button"; label: string }
  | { type: "key_val_grid"; title?: string; rows: Array<{ key: string; val: string }> }
  | { type: "timeline"; title?: string; steps: Array<{ label: string; status: "completed" | "current" | "pending" }> }
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string; isBold?: boolean }
  | { type: "list_item"; text: string }
  | { type: "divider" }
  | { type: "disclaimer_box"; text: string };

function stripTags(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Intelligent HTML-to-PDF Block Parser
 * Translates HTML email templates into visual components (Cards, Banners, Callouts, Buttons, Tables).
 */
function parseRichHtmlToBlocks(htmlOrText: string, emailSubject?: string): RichEmailBlock[] {
  if (!htmlOrText) return [];

  const blocks: RichEmailBlock[] = [];

  // Plain text email fallback
  if (!/<[a-z][\s\S]*>/i.test(htmlOrText)) {
    const rawLines = decodeHtmlEntities(htmlOrText).split(/\r?\n/);
    for (const rawL of rawLines) {
      const l = rawL.trim();
      if (!l) continue;
      if (l.startsWith("---") || l.startsWith("===")) {
        blocks.push({ type: "divider" });
      } else if (l.startsWith("• ") || l.startsWith("* ") || l.startsWith("- ")) {
        blocks.push({ type: "list_item", text: l.replace(/^[•*\-\s]+/, "") });
      } else if (l.includes(":") && l.length < 90 && !l.startsWith("http")) {
        const parts = l.split(":");
        blocks.push({
          type: "key_val_grid",
          rows: [{ key: parts[0].trim(), val: parts.slice(1).join(":").trim() }],
        });
      } else {
        blocks.push({ type: "paragraph", text: l });
      }
    }
    return blocks;
  }

  // 1. Clean script/style/head
  let clean = htmlOrText
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "");

  // 2. Identify top title banner
  const h1Match = clean.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/i);
  if (h1Match) {
    const bannerTitle = stripTags(h1Match[1]);
    if (bannerTitle && bannerTitle.length < 80) {
      const isSuccess = bannerTitle.toLowerCase().includes("success") || bannerTitle.toLowerCase().includes("completed") || bannerTitle.toLowerCase().includes("verified");
      const isWarning = bannerTitle.toLowerCase().includes("incomplete") || bannerTitle.toLowerCase().includes("action") || bannerTitle.toLowerCase().includes("delay");
      blocks.push({
        type: "banner",
        title: bannerTitle,
        colorScheme: isSuccess ? "emerald" : isWarning ? "amber" : "navy",
      });
      clean = clean.replace(h1Match[0], "");
    }
  }

  // 3. Extract CTA buttons (<a ... class="button"...> or styled anchors)
  const btnRegex = /<a[^>]+(?:class="[^"]*button[^"]*"|style="[^"]*background[^"]*")[^>]*>([\s\S]*?)<\/a>/gi;
  let btnMatch: RegExpExecArray | null;
  while ((btnMatch = btnRegex.exec(clean)) !== null) {
    const btnText = stripTags(btnMatch[1]);
    if (btnText && btnText.length < 60) {
      blocks.push({ type: "cta_button", label: btnText });
    }
  }

  // 4. Extract Callouts / Notice alerts (e.g., border-left or alert containers)
  const calloutRegex = /<(?:div|table|td)[^>]+(?:background:[^;]*#(?:fffbeb|fef3c7|f0fdf4|ecfdf5|eff6ff|f0f9ff)|border-left)[^>]*>([\s\S]*?)<\/(?:div|table|td)>/gi;
  let calloutMatch: RegExpExecArray | null;
  while ((calloutMatch = calloutRegex.exec(clean)) !== null) {
    const calloutText = stripTags(calloutMatch[1]);
    if (calloutText && calloutText.length > 15 && calloutText.length < 500) {
      const isWarn = calloutText.toLowerCase().includes("important") || calloutText.toLowerCase().includes("note") || calloutText.toLowerCase().includes("warning");
      const isSuccess = calloutText.toLowerCase().includes("verified") || calloutText.toLowerCase().includes("success");
      blocks.push({
        type: "callout",
        text: calloutText,
        tone: isWarn ? "warning" : isSuccess ? "success" : "info",
      });
    }
  }

  // 5. Extract Tables (Structured Data / Financials)
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let tableMatch: RegExpExecArray | null;
  const structuredRows: Array<{ key: string; val: string }> = [];
  const timelineSteps: Array<{ label: string; status: "completed" | "current" | "pending" }> = [];

  while ((tableMatch = tableRegex.exec(clean)) !== null) {
    const tContent = tableMatch[1];
    const trMatches = tContent.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];

    for (const tr of trMatches) {
      const cells = tr.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || [];
      const cellTexts = cells.map((c) => stripTags(c)).filter((c) => c.length > 0);

      if (cellTexts.length >= 2) {
        const k = cellTexts[0];
        const v = cellTexts.slice(1).join(" : ");
        if (k.length <= 60 && v.length <= 150) {
          structuredRows.push({ key: k, val: v });
        }
      } else if (cellTexts.length === 1) {
        const single = cellTexts[0];
        if (single.toLowerCase().includes("step") || single.toLowerCase().includes("order") || single.toLowerCase().includes("payment")) {
          const isDone = single.includes("[OK]") || single.toLowerCase().includes("completed") || single.toLowerCase().includes("success");
          timelineSteps.push({
            label: single.replace(/\[OK\]\s*/g, ""),
            status: isDone ? "completed" : "current",
          });
        }
      }
    }
  }

  if (structuredRows.length > 0) {
    // Deduplicate rows
    const uniqueRows: Array<{ key: string; val: string }> = [];
    const seen = new Set<string>();
    for (const r of structuredRows) {
      const combo = `${r.key}_${r.val}`;
      if (!seen.has(combo)) {
        seen.add(combo);
        uniqueRows.push(r);
      }
    }
    blocks.push({
      type: "key_val_grid",
      title: "Transaction & Order Summary",
      rows: uniqueRows,
    });
  }

  if (timelineSteps.length > 0) {
    blocks.push({
      type: "timeline",
      title: "Service Fulfillment Timeline",
      steps: timelineSteps,
    });
  }

  // 6. Remaining HTML Paragraphs / Disclaimers / Sign-offs
  const remainingTokens = clean
    .replace(/<table[^>]*>[\s\S]*?<\/table>/gi, "\n")
    .replace(/<hr\s*[\/]?>/gi, "\n[[[HR]]]\n")
    .replace(/<h[3-6][^>]*>(.*?)<\/h[3-6]>/gi, "\n[[[H]]]$1\n")
    .replace(/<li[^>]*>(.*?)<\/li>/gi, "\n[[[LI]]]$1\n")
    .replace(/<p[^>]*>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<div[^>]*>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<br\s*[\/]?>/gi, "\n")
    .split(/\r?\n/);

  for (const rawToken of remainingTokens) {
    const t = rawToken.trim();
    if (!t) continue;

    if (t.includes("[[[HR]]]")) {
      blocks.push({ type: "divider" });
    } else if (t.startsWith("[[[H]]]")) {
      const txt = stripTags(t.replace("[[[H]]]", ""));
      if (txt) blocks.push({ type: "heading", text: txt });
    } else if (t.startsWith("[[[LI]]]")) {
      const txt = stripTags(t.replace("[[[LI]]]", ""));
      if (txt) blocks.push({ type: "list_item", text: txt });
    } else {
      const txt = stripTags(t);
      if (txt) {
        if (txt.toLowerCase().includes("this is an automated") || txt.toLowerCase().includes("please do not reply") || txt.toLowerCase().includes("koregaon bk")) {
          blocks.push({ type: "disclaimer_box", text: txt });
        } else if (txt.length < 50 && (txt.endsWith(":") || txt.endsWith("Details") || txt.endsWith("Information"))) {
          blocks.push({ type: "heading", text: txt });
        } else {
          blocks.push({ type: "paragraph", text: txt });
        }
      }
    }
  }

  return blocks;
}
