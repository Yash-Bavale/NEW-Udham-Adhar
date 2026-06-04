import { PDFDocument, PDFPage, PDFFont, StandardFonts, rgb, type RGB } from "pdf-lib";

// ────────────────────────────────────────────────────────────────────────────────
// Shared brand palette + helpers
// ────────────────────────────────────────────────────────────────────────────────

const NAVY = rgb(0.07, 0.13, 0.27);
const NAVY_SOFT = rgb(0.14, 0.22, 0.4);
const ACCENT = rgb(0.95, 0.62, 0.07);
const GRAY = rgb(0.35, 0.38, 0.45);
const MUTED = rgb(0.55, 0.58, 0.63);
const LINE = rgb(0.85, 0.87, 0.9);
const ZEBRA = rgb(0.97, 0.98, 0.995);
const GREEN = rgb(0.05, 0.55, 0.25);
const WHITE = rgb(1, 1, 1);

const COMPANY_NAME = "Business Help Services Consultancy";
const COMPANY_ADDRESS = "Udyam Adhar Consulting, India";
const COMPANY_EMAIL = "support@everythinghappens.in";
const COMPANY_WEB = "udyamadhar.everythinghappens.in";

function rupees(n: number): string {
  return `INR ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// Indian numbering: amount-in-words for INR
function amountInWords(n: number): string {
  const rupees = Math.floor(n);
  const paise = Math.round((n - rupees) * 100);
  const word = numberToWordsIndian(rupees);
  const paiseWord = paise > 0 ? ` and ${numberToWordsIndian(paise)} Paise` : "";
  return `Rupees ${word}${paiseWord} Only`;
}

function numberToWordsIndian(num: number): string {
  if (num === 0) return "Zero";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const twoDigits = (n: number): string => {
    if (n < 20) return ones[n];
    return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
  };
  const threeDigits = (n: number): string => {
    const h = Math.floor(n / 100);
    const r = n % 100;
    return (h ? ones[h] + " Hundred" + (r ? " " : "") : "") + (r ? twoDigits(r) : "");
  };
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const rest = num % 1000;
  let out = "";
  if (crore) out += threeDigits(crore) + " Crore ";
  if (lakh) out += twoDigits(lakh) + " Lakh ";
  if (thousand) out += twoDigits(thousand) + " Thousand ";
  if (rest) out += threeDigits(rest);
  return out.trim();
}

function drawText(
  page: PDFPage,
  text: string,
  opts: { x: number; y: number; size: number; font: PDFFont; color?: RGB },
) {
  page.drawText(text, { x: opts.x, y: opts.y, size: opts.size, font: opts.font, color: opts.color ?? NAVY });
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const trial = cur ? cur + " " + w : w;
    if (font.widthOfTextAtSize(trial, size) <= maxWidth) cur = trial;
    else { if (cur) lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

async function brandHeader(
  page: PDFPage,
  helv: PDFFont,
  helvBold: PDFFont,
  opts: { title: string; rightLabel?: string; rightValue?: string },
) {
  const w = 595.28;
  // Navy bar
  page.drawRectangle({ x: 0, y: 790, width: w, height: 52, color: NAVY });
  // Accent strip
  page.drawRectangle({ x: 0, y: 786, width: w, height: 4, color: ACCENT });
  drawText(page, opts.title, { x: 40, y: 810, size: 18, font: helvBold, color: WHITE });
  drawText(page, COMPANY_NAME, { x: 40, y: 795, size: 9, font: helv, color: rgb(0.85, 0.9, 1) });
  if (opts.rightLabel && opts.rightValue) {
    drawText(page, opts.rightLabel, { x: 410, y: 819, size: 8, font: helv, color: rgb(0.75, 0.83, 0.97) });
    drawText(page, opts.rightValue, { x: 410, y: 803, size: 13, font: helvBold, color: WHITE });
  }
}

function brandFooter(page: PDFPage, helv: PDFFont, note?: string) {
  page.drawLine({ start: { x: 40, y: 70 }, end: { x: 555, y: 70 }, thickness: 0.5, color: LINE });
  drawText(page, note ?? "This is a computer-generated document and does not require a signature.",
    { x: 40, y: 55, size: 8, font: helv, color: MUTED });
  drawText(page, `${COMPANY_NAME}  ·  ${COMPANY_WEB}  ·  ${COMPANY_EMAIL}`,
    { x: 40, y: 42, size: 8, font: helv, color: MUTED });
}

// ────────────────────────────────────────────────────────────────────────────────
// 1. INVOICE
// ────────────────────────────────────────────────────────────────────────────────

export type InvoiceData = {
  invoiceNumber: string;
  invoiceDate: Date;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  customerState?: string | null;
  serviceName: string;
  leadCode: string;
  applicationCode?: string | null;
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  sacCode?: string;
  placeOfSupply?: string | null;
  paymentId?: string | null;
  gatewayName: string;
  companyName?: string;
  companyAddress?: string;
};

export async function renderInvoicePdf(d: InvoiceData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const sac = d.sacCode ?? "998311";
  const cgst = d.cgstAmount ?? 0;
  const sgst = d.sgstAmount ?? 0;
  const igst = d.igstAmount ?? 0;
  const isIntra = cgst + sgst > 0;

  await brandHeader(page, helv, helvBold, {
    title: "TAX INVOICE",
    rightLabel: "INVOICE NO.",
    rightValue: d.invoiceNumber,
  });

  // Meta strip
  let y = 760;
  drawText(page, "Issued on", { x: 40, y, size: 8, font: helv, color: MUTED });
  drawText(page, fmtDate(d.invoiceDate), { x: 40, y: y - 13, size: 11, font: helvBold });
  drawText(page, "Reference", { x: 200, y, size: 8, font: helv, color: MUTED });
  drawText(page, d.leadCode, { x: 200, y: y - 13, size: 11, font: helvBold });
  if (d.applicationCode) {
    drawText(page, "Application", { x: 360, y, size: 8, font: helv, color: MUTED });
    drawText(page, d.applicationCode, { x: 360, y: y - 13, size: 11, font: helvBold });
  }
  drawText(page, "Place of Supply", { x: 470, y, size: 8, font: helv, color: MUTED });
  drawText(page, d.placeOfSupply ?? d.customerState ?? "—", { x: 470, y: y - 13, size: 11, font: helvBold });

  // Bill-to / From cards
  y = 710;
  page.drawRectangle({ x: 40, y: y - 78, width: 250, height: 90, color: ZEBRA });
  page.drawRectangle({ x: 305, y: y - 78, width: 250, height: 90, color: ZEBRA });
  drawText(page, "BILL TO", { x: 50, y: y - 4, size: 8, font: helvBold, color: MUTED });
  drawText(page, d.customerName, { x: 50, y: y - 22, size: 12, font: helvBold });
  drawText(page, d.customerEmail, { x: 50, y: y - 38, size: 9, font: helv, color: GRAY });
  drawText(page, d.customerMobile, { x: 50, y: y - 52, size: 9, font: helv, color: GRAY });
  if (d.customerState) drawText(page, d.customerState, { x: 50, y: y - 66, size: 9, font: helv, color: GRAY });

  drawText(page, "FROM", { x: 315, y: y - 4, size: 8, font: helvBold, color: MUTED });
  drawText(page, d.companyName ?? COMPANY_NAME, { x: 315, y: y - 22, size: 11, font: helvBold });
  drawText(page, d.companyAddress ?? COMPANY_ADDRESS, { x: 315, y: y - 38, size: 9, font: helv, color: GRAY });
  drawText(page, "Consultancy Services", { x: 315, y: y - 52, size: 9, font: helv, color: GRAY });
  drawText(page, COMPANY_EMAIL, { x: 315, y: y - 66, size: 9, font: helv, color: GRAY });

  // Table header
  y = 600;
  page.drawRectangle({ x: 40, y: y - 6, width: 515, height: 26, color: NAVY });
  drawText(page, "#", { x: 50, y: y + 2, size: 9, font: helvBold, color: WHITE });
  drawText(page, "DESCRIPTION", { x: 78, y: y + 2, size: 9, font: helvBold, color: WHITE });
  drawText(page, "SAC", { x: 340, y: y + 2, size: 9, font: helvBold, color: WHITE });
  drawText(page, "QTY", { x: 395, y: y + 2, size: 9, font: helvBold, color: WHITE });
  drawText(page, "RATE", { x: 435, y: y + 2, size: 9, font: helvBold, color: WHITE });
  drawText(page, "AMOUNT", { x: 500, y: y + 2, size: 9, font: helvBold, color: WHITE });

  // Single zebra row
  y -= 34;
  page.drawRectangle({ x: 40, y: y - 16, width: 515, height: 36, color: ZEBRA });
  drawText(page, "1", { x: 50, y, size: 10, font: helv, color: GRAY });
  drawText(page, d.serviceName, { x: 78, y, size: 11, font: helvBold });
  drawText(page, "Professional consultancy fee", { x: 78, y: y - 12, size: 8, font: helv, color: MUTED });
  drawText(page, sac, { x: 340, y, size: 10, font: helv });
  drawText(page, "1", { x: 400, y, size: 10, font: helv });
  drawText(page, rupees(d.baseAmount), { x: 425, y, size: 10, font: helv });
  drawText(page, rupees(d.baseAmount), { x: 495, y, size: 10, font: helvBold });

  // Totals block (right)
  y -= 50;
  const totalsX = 360;
  drawText(page, "Subtotal", { x: totalsX, y, size: 10, font: helv, color: GRAY });
  drawText(page, rupees(d.baseAmount), { x: 495, y, size: 10, font: helv });
  y -= 16;
  if (isIntra) {
    drawText(page, "CGST (9%)", { x: totalsX, y, size: 10, font: helv, color: GRAY });
    drawText(page, rupees(cgst), { x: 495, y, size: 10, font: helv });
    y -= 16;
    drawText(page, "SGST (9%)", { x: totalsX, y, size: 10, font: helv, color: GRAY });
    drawText(page, rupees(sgst), { x: 495, y, size: 10, font: helv });
    y -= 16;
  } else {
    drawText(page, "IGST (18%)", { x: totalsX, y, size: 10, font: helv, color: GRAY });
    drawText(page, rupees(igst || d.gstAmount), { x: 495, y, size: 10, font: helv });
    y -= 16;
  }
  page.drawLine({ start: { x: totalsX, y }, end: { x: 555, y }, thickness: 0.7, color: LINE });
  y -= 18;
  page.drawRectangle({ x: totalsX - 10, y: y - 6, width: 195, height: 24, color: NAVY });
  drawText(page, "TOTAL PAID", { x: totalsX, y, size: 11, font: helvBold, color: WHITE });
  drawText(page, rupees(d.totalAmount), { x: 490, y, size: 12, font: helvBold, color: WHITE });

  // Amount in words
  y -= 40;
  drawText(page, "Amount in words", { x: 40, y, size: 8, font: helv, color: MUTED });
  const words = wrap(amountInWords(d.totalAmount), helvBold, 10, 500);
  for (const w of words) { y -= 14; drawText(page, w, { x: 40, y, size: 10, font: helvBold }); }

  // Payment block
  y -= 30;
  page.drawLine({ start: { x: 40, y }, end: { x: 555, y }, thickness: 0.5, color: LINE });
  y -= 18;
  drawText(page, "PAYMENT DETAILS", { x: 40, y, size: 9, font: helvBold, color: MUTED });
  drawText(page, `Gateway: ${d.gatewayName.toUpperCase()}`, { x: 40, y: y - 16, size: 10, font: helv, color: GRAY });
  if (d.paymentId) drawText(page, `Txn Reference: ${d.paymentId}`, { x: 40, y: y - 30, size: 10, font: helv, color: GRAY });
  drawText(page, "Status: PAID", { x: 40, y: y - 44, size: 10, font: helvBold, color: GREEN });

  drawText(page, "TERMS", { x: 320, y, size: 9, font: helvBold, color: MUTED });
  drawText(page, "Service consultancy fees are non-refundable once", { x: 320, y: y - 16, size: 8, font: helv, color: GRAY });
  drawText(page, "the application processing has commenced.", { x: 320, y: y - 28, size: 8, font: helv, color: GRAY });
  drawText(page, "GST collected as per applicable rules.", { x: 320, y: y - 40, size: 8, font: helv, color: GRAY });

  brandFooter(page, helv, "This is a computer-generated tax invoice and does not require a signature.");
  return await pdf.save();
}

// ────────────────────────────────────────────────────────────────────────────────
// 2. GRIEVANCE APPLICATION
// ────────────────────────────────────────────────────────────────────────────────

export type GrievanceData = {
  complaintNumber: string;
  submittedAt: Date;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  leadCode?: string | null;
  applicationCode?: string | null;
  serviceName?: string | null;
  category?: string | null;
  severity?: string | null;
  description: string;
};

export async function renderGrievancePdf(d: GrievanceData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  await brandHeader(page, helv, helvBold, {
    title: "GRIEVANCE APPLICATION",
    rightLabel: "COMPLAINT NO.",
    rightValue: d.complaintNumber,
  });

  let y = 760;
  drawText(page, "Filed on", { x: 40, y, size: 8, font: helv, color: MUTED });
  drawText(page, fmtDate(d.submittedAt), { x: 40, y: y - 13, size: 11, font: helvBold });
  if (d.category) {
    drawText(page, "Category", { x: 220, y, size: 8, font: helv, color: MUTED });
    drawText(page, d.category, { x: 220, y: y - 13, size: 11, font: helvBold });
  }
  if (d.severity) {
    drawText(page, "Severity", { x: 400, y, size: 8, font: helv, color: MUTED });
    drawText(page, d.severity.toUpperCase(), { x: 400, y: y - 13, size: 11, font: helvBold, color: ACCENT });
  }

  // Complainant card
  y = 700;
  page.drawRectangle({ x: 40, y: y - 90, width: 515, height: 100, color: ZEBRA });
  drawText(page, "COMPLAINANT", { x: 50, y: y - 4, size: 8, font: helvBold, color: MUTED });
  drawText(page, d.customerName, { x: 50, y: y - 24, size: 13, font: helvBold });
  drawText(page, `Email: ${d.customerEmail}`, { x: 50, y: y - 42, size: 10, font: helv, color: GRAY });
  drawText(page, `Mobile: ${d.customerMobile}`, { x: 50, y: y - 58, size: 10, font: helv, color: GRAY });
  if (d.leadCode) drawText(page, `Reference: ${d.leadCode}`, { x: 50, y: y - 74, size: 10, font: helv, color: GRAY });
  if (d.applicationCode) drawText(page, `Application: ${d.applicationCode}`, { x: 300, y: y - 74, size: 10, font: helv, color: GRAY });
  if (d.serviceName) drawText(page, `Service: ${d.serviceName}`, { x: 300, y: y - 58, size: 10, font: helv, color: GRAY });

  // Description block
  y = 575;
  drawText(page, "DESCRIPTION OF GRIEVANCE", { x: 40, y, size: 9, font: helvBold, color: MUTED });
  y -= 18;
  page.drawLine({ start: { x: 40, y: y + 8 }, end: { x: 555, y: y + 8 }, thickness: 0.5, color: LINE });
  const descLines = wrap(d.description || "—", helv, 11, 515);
  for (const ln of descLines) {
    if (y < 140) break;
    drawText(page, ln, { x: 40, y, size: 11, font: helv, color: NAVY_SOFT });
    y -= 16;
  }

  // Acknowledgement strip
  y = 120;
  page.drawRectangle({ x: 40, y: y - 28, width: 515, height: 44, color: NAVY });
  drawText(page, "We acknowledge receipt of this grievance.", { x: 50, y: y, size: 10, font: helvBold, color: WHITE });
  drawText(page, "Our team will respond within 48 working hours with an update on resolution.",
    { x: 50, y: y - 14, size: 9, font: helv, color: rgb(0.85, 0.9, 1) });

  brandFooter(page, helv);
  return await pdf.save();
}

// ────────────────────────────────────────────────────────────────────────────────
// 3. SERVICE ACKNOWLEDGEMENT LETTER
// ────────────────────────────────────────────────────────────────────────────────

export type AcknowledgementData = {
  customerName: string;
  customerEmail: string;
  leadCode: string;
  applicationCode?: string | null;
  serviceName: string;
  issuedAt: Date;
  expectedDays?: number;
};

export async function renderAcknowledgementPdf(d: AcknowledgementData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  await brandHeader(page, helv, helvBold, {
    title: "SERVICE ACKNOWLEDGEMENT",
    rightLabel: "REFERENCE",
    rightValue: d.applicationCode ?? d.leadCode,
  });

  let y = 760;
  drawText(page, "Issued on", { x: 40, y, size: 8, font: helv, color: MUTED });
  drawText(page, fmtDate(d.issuedAt), { x: 40, y: y - 13, size: 11, font: helvBold });
  drawText(page, "Lead Code", { x: 220, y, size: 8, font: helv, color: MUTED });
  drawText(page, d.leadCode, { x: 220, y: y - 13, size: 11, font: helvBold });
  if (d.applicationCode) {
    drawText(page, "Application", { x: 400, y, size: 8, font: helv, color: MUTED });
    drawText(page, d.applicationCode, { x: 400, y: y - 13, size: 11, font: helvBold });
  }

  y = 700;
  drawText(page, `Dear ${d.customerName},`, { x: 40, y, size: 12, font: helvBold });
  y -= 24;
  const body = [
    `Thank you for choosing ${COMPANY_NAME} for your ${d.serviceName} application. We confirm that your request has been received and assigned to our operations team for processing.`,
    "",
    `Your application has been registered under the reference shown above. Our team will review the details, verify the documents on record and proceed with filing within ${d.expectedDays ?? 3} working days.`,
    "",
    "You will receive email updates at every stage of processing. Should we require additional information, our support team will reach out using your registered contact details.",
    "",
    "If you have any questions, please reply to this email or contact our support desk.",
  ];
  for (const para of body) {
    const lines = para === "" ? [""] : wrap(para, helv, 11, 515);
    for (const ln of lines) {
      drawText(page, ln, { x: 40, y, size: 11, font: helv, color: NAVY_SOFT });
      y -= 16;
    }
  }

  // Signature block
  y = 200;
  drawText(page, "Warm regards,", { x: 40, y, size: 11, font: helv, color: GRAY });
  drawText(page, "Operations Team", { x: 40, y: y - 18, size: 12, font: helvBold });
  drawText(page, COMPANY_NAME, { x: 40, y: y - 32, size: 10, font: helv, color: GRAY });

  // Note card
  page.drawRectangle({ x: 40, y: 110, width: 515, height: 50, color: ZEBRA });
  drawText(page, "NOTE", { x: 50, y: 140, size: 8, font: helvBold, color: MUTED });
  drawText(page, "This acknowledgement does not constitute the final certificate. The official",
    { x: 50, y: 126, size: 9, font: helv, color: GRAY });
  drawText(page, "certificate will be issued upon successful approval by the concerned authority.",
    { x: 50, y: 114, size: 9, font: helv, color: GRAY });

  brandFooter(page, helv);
  return await pdf.save();
}
