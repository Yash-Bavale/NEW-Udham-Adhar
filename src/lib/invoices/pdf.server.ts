import { PDFDocument, PDFPage, PDFFont, StandardFonts, rgb, type RGB } from "pdf-lib";
import { BHS_LOGO_BASE64 } from "./bhs-logo";

// ────────────────────────────────────────────────────────────────────────────────
// Shared brand palette + helpers
// ────────────────────────────────────────────────────────────────────────────────

const NAVY = rgb(0.07, 0.13, 0.27);
const NAVY_SOFT = rgb(0.14, 0.22, 0.4);
const ACCENT = rgb(0.95, 0.62, 0.07);
const GRAY = rgb(0.35, 0.38, 0.45);
const MUTED = rgb(0.55, 0.58, 0.63);
const LINE = rgb(0.85, 0.87, 0.9);
const SOFT_LINE = rgb(0.92, 0.93, 0.96);
const ZEBRA = rgb(0.97, 0.98, 0.995);
const HEADBG = rgb(0.95, 0.96, 0.99);
const GREEN = rgb(0.05, 0.55, 0.25);
const RED = rgb(0.78, 0.12, 0.18);
const WHITE = rgb(1, 1, 1);

const COMPANY_NAME = "Business Help Services";
const COMPANY_ADDRESS = "Koregaon Bk, Taluka-Khed, Pune, Maharashtra - 410505, India";
const COMPANY_EMAIL = "help@businesshelpservices.com";
const COMPANY_PHONE = "+91-9767870331";
const COMPANY_WEB = "businesshelpservices.com";
const COMPANY_GSTIN = "27COFPD1743E2ZB";
const COMPANY_STATE_NAME = "Maharashtra";
const COMPANY_STATE_CODE = "27";

const IN_STATE_CODES: Record<string, string> = {
  "andhra pradesh": "37", "arunachal pradesh": "12", "assam": "18", "bihar": "10",
  "chhattisgarh": "22", "goa": "30", "gujarat": "24", "haryana": "06",
  "himachal pradesh": "02", "jharkhand": "20", "karnataka": "29", "kerala": "32",
  "madhya pradesh": "23", "maharashtra": "27", "manipur": "14", "meghalaya": "17",
  "mizoram": "15", "nagaland": "13", "odisha": "21", "punjab": "03",
  "rajasthan": "08", "sikkim": "11", "tamil nadu": "33", "telangana": "36",
  "tripura": "16", "uttar pradesh": "09", "uttarakhand": "05", "west bengal": "19",
  "delhi": "07", "jammu and kashmir": "01", "ladakh": "38", "puducherry": "34",
  "chandigarh": "04", "andaman and nicobar islands": "35",
  "dadra and nagar haveli and daman and diu": "26", "lakshadweep": "31",
};
function stateCode(name?: string | null): string {
  if (!name) return "-";
  return IN_STATE_CODES[name.toLowerCase().trim()] ?? "-";
}
function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}


function rupees(n: number): string {
  return `INR ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function safePdfText(value: string): string {
  return String(value ?? "")
    .replace(/₹/g, "Rs.")
    .replace(/[‐‑‒–—―−]/g, "-")
    .replace(/[‘’‚‛]/g, "'")
    .replace(/[“”„‟]/g, '"')
    .replace(/…/g, "...")
    .replace(/·/g, "|")
    .replace(/\u00a0/g, " ")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x09\x0a\x0d\x20-\x7e]/g, "?");
}

function textWidth(font: PDFFont, text: string, size: number): number {
  return font.widthOfTextAtSize(safePdfText(text), size);
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
  page.drawText(safePdfText(text), { x: opts.x, y: opts.y, size: opts.size, font: opts.font, color: opts.color ?? NAVY });
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = safePdfText(text).split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const trial = cur ? cur + " " + w : w;
    if (textWidth(font, trial, size) <= maxWidth) cur = trial;
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
  drawText(page, `${COMPANY_NAME}  |  ${COMPANY_WEB}  |  ${COMPANY_EMAIL}`,
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
  const logo = await pdf.embedPng(base64ToBytes(BHS_LOGO_BASE64));

  const W = 595.28;
  const MX = 36;        // page margin
  const RX = W - MX;    // right edge
  const sac = d.sacCode ?? "998311";
  const cgst = d.cgstAmount ?? 0;
  const sgst = d.sgstAmount ?? 0;
  const igst = d.igstAmount ?? 0;
  const isIntra = cgst + sgst > 0;
  const gstRate = isIntra ? 18 : 18;
  const subtotal = d.baseAmount;
  const totalTax = cgst + sgst + igst;
  const grand = d.totalAmount;
  const roundOff = +(grand - subtotal - totalTax).toFixed(2);

  // ─── Outer frame
  page.drawRectangle({ x: MX - 4, y: 36, width: (W - (MX - 4) * 2), height: 769, borderColor: LINE, borderWidth: 0.75, color: WHITE });

  // ─── Header band
  let y = 805 - 10;
  // Logo
  const logoDim = logo.scale(0.16); // ~58pt wide
  page.drawImage(logo, { x: MX, y: y - 58, width: 58, height: 58 });
  // Company block
  drawText(page, COMPANY_NAME.toUpperCase(), { x: MX + 70, y: y - 6, size: 14, font: helvBold, color: NAVY });
  drawText(page, COMPANY_ADDRESS, { x: MX + 70, y: y - 22, size: 8.5, font: helv, color: GRAY });
  drawText(page, `Email: ${COMPANY_EMAIL}    Phone: ${COMPANY_PHONE}`, { x: MX + 70, y: y - 34, size: 8.5, font: helv, color: GRAY });
  drawText(page, `GSTIN: ${COMPANY_GSTIN}    State: ${COMPANY_STATE_NAME} (${COMPANY_STATE_CODE})`, { x: MX + 70, y: y - 46, size: 8.5, font: helvBold, color: NAVY_SOFT });

  // Title pill (right)
  page.drawRectangle({ x: RX - 150, y: y - 14, width: 150, height: 24, color: NAVY });
  drawText(page, "TAX INVOICE", { x: RX - 124, y: y - 7, size: 13, font: helvBold, color: WHITE });
  drawText(page, "ORIGINAL FOR RECIPIENT", { x: RX - 110, y: y - 28, size: 7.5, font: helvBold, color: MUTED });

  // Divider
  y -= 70;
  page.drawLine({ start: { x: MX, y }, end: { x: RX, y }, thickness: 1, color: ACCENT });

  // ─── Invoice meta strip (3-column grid)
  y -= 14;
  const colW = (RX - MX) / 3;
  const metaTop = y;
  const metaRows: Array<[string, string]> = [
    ["Invoice No.", d.invoiceNumber],
    ["Invoice Date", fmtDate(d.invoiceDate)],
    ["Order No.", d.applicationCode ?? d.leadCode],
    ["Place of Supply", `${d.placeOfSupply ?? d.customerState ?? "-"} (${stateCode(d.placeOfSupply ?? d.customerState)})`],
    ["Payment Date", fmtDate(d.invoiceDate)],
    ["Payment Status", "PAID"],
  ];
  for (let i = 0; i < metaRows.length; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const cx = MX + col * colW;
    const cy = metaTop - row * 30;
    drawText(page, metaRows[i][0].toUpperCase(), { x: cx, y: cy, size: 7.5, font: helvBold, color: MUTED });
    const isPaid = metaRows[i][0] === "Payment Status";
    drawText(page, metaRows[i][1], { x: cx, y: cy - 12, size: 10, font: helvBold, color: isPaid ? GREEN : NAVY });
  }
  y = metaTop - 60 - 6;
  page.drawLine({ start: { x: MX, y }, end: { x: RX, y }, thickness: 0.5, color: SOFT_LINE });

  // ─── Bill To / Payment block
  y -= 14;
  const cardH = 100;
  const cardW = (RX - MX - 12) / 2;
  page.drawRectangle({ x: MX, y: y - cardH, width: cardW, height: cardH, color: HEADBG, borderColor: SOFT_LINE, borderWidth: 0.5 });
  page.drawRectangle({ x: MX + cardW + 12, y: y - cardH, width: cardW, height: cardH, color: HEADBG, borderColor: SOFT_LINE, borderWidth: 0.5 });

  // Bill To
  drawText(page, "BILL TO", { x: MX + 10, y: y - 14, size: 8, font: helvBold, color: MUTED });
  drawText(page, d.customerName, { x: MX + 10, y: y - 30, size: 12, font: helvBold, color: NAVY });
  drawText(page, d.customerEmail, { x: MX + 10, y: y - 46, size: 9, font: helv, color: GRAY });
  drawText(page, `+91 ${d.customerMobile}`, { x: MX + 10, y: y - 60, size: 9, font: helv, color: GRAY });
  drawText(page, `State: ${d.customerState ?? "-"} (${stateCode(d.customerState)})`, { x: MX + 10, y: y - 74, size: 9, font: helv, color: GRAY });
  drawText(page, `Place of Supply: ${d.placeOfSupply ?? d.customerState ?? "-"}`, { x: MX + 10, y: y - 88, size: 9, font: helv, color: GRAY });

  // Payment / Transaction
  const px = MX + cardW + 22;
  drawText(page, "PAYMENT DETAILS", { x: px, y: y - 14, size: 8, font: helvBold, color: MUTED });
  drawText(page, `Gateway: ${d.gatewayName?.toUpperCase() ?? "-"}`, { x: px, y: y - 30, size: 10, font: helvBold, color: NAVY });
  drawText(page, `Transaction ID: ${d.paymentId ?? "-"}`, { x: px, y: y - 46, size: 9, font: helv, color: GRAY });
  drawText(page, `Status: PAID  |  ${fmtDate(d.invoiceDate)}`, { x: px, y: y - 60, size: 9, font: helvBold, color: GREEN });
  drawText(page, `Lead Code: ${d.leadCode}`, { x: px, y: y - 74, size: 9, font: helv, color: GRAY });
  if (d.applicationCode) drawText(page, `Application: ${d.applicationCode}`, { x: px, y: y - 88, size: 9, font: helv, color: GRAY });

  y -= cardH + 18;

  // ─── Line items table
  const tH = 26;
  page.drawRectangle({ x: MX, y: y - tH, width: RX - MX, height: tH, color: NAVY });
  const cols = [
    { x: MX + 8,   label: "#" },
    { x: MX + 30,  label: "DESCRIPTION" },
    { x: MX + 300, label: "SAC" },
    { x: MX + 350, label: "QTY" },
    { x: MX + 390, label: "RATE (Rs.)" },
    { x: RX - 80,  label: "AMOUNT (Rs.)" },
  ];
  for (const c of cols) drawText(page, c.label, { x: c.x, y: y - tH + 9, size: 9, font: helvBold, color: WHITE });

  y -= tH;
  // Row
  const rowH = 46;
  page.drawRectangle({ x: MX, y: y - rowH, width: RX - MX, height: rowH, color: WHITE, borderColor: SOFT_LINE, borderWidth: 0.5 });
  drawText(page, "1", { x: MX + 8, y: y - 18, size: 10, font: helv, color: GRAY });
  drawText(page, d.serviceName, { x: MX + 30, y: y - 16, size: 11, font: helvBold, color: NAVY });
  drawText(page, "Consultation Service Fee", { x: MX + 30, y: y - 30, size: 8.5, font: helv, color: MUTED });
  drawText(page, `SAC: ${sac}`, { x: MX + 30, y: y - 40, size: 8, font: helv, color: MUTED });
  drawText(page, sac, { x: MX + 300, y: y - 18, size: 10, font: helv, color: NAVY });
  drawText(page, "1", { x: MX + 358, y: y - 18, size: 10, font: helv, color: NAVY });
  drawText(page, subtotal.toFixed(2), { x: MX + 390, y: y - 18, size: 10, font: helv, color: NAVY });
  drawText(page, subtotal.toFixed(2), { x: RX - 80, y: y - 18, size: 10, font: helvBold, color: NAVY });

  y -= rowH + 4;

  // ─── Totals (right side)
  const totalsX = MX + 320;
  const totalsRight = RX - 8;
  const totalLine = (label: string, val: string, opts?: { bold?: boolean; color?: RGB; bg?: RGB }) => {
    if (opts?.bg) page.drawRectangle({ x: totalsX - 6, y: y - 6, width: totalsRight - totalsX + 12, height: 22, color: opts.bg });
    drawText(page, label, { x: totalsX, y: y, size: 10, font: opts?.bold ? helvBold : helv, color: opts?.color ?? GRAY });
    const tw = (opts?.bold ? helvBold : helv).widthOfTextAtSize(val, 10);
    drawText(page, val, { x: totalsRight - tw, y: y, size: 10, font: opts?.bold ? helvBold : helv, color: opts?.color ?? NAVY });
    y -= 18;
  };
  totalLine("Subtotal", `Rs. ${subtotal.toFixed(2)}`);
  if (isIntra) {
    totalLine("CGST (9%)", `Rs. ${cgst.toFixed(2)}`);
    totalLine("SGST (9%)", `Rs. ${sgst.toFixed(2)}`);
  } else {
    totalLine("IGST (18%)", `Rs. ${igst.toFixed(2)}`);
  }
  totalLine("Round Off", `${roundOff >= 0 ? "+" : "-"} Rs. ${Math.abs(roundOff).toFixed(2)}`);
  page.drawLine({ start: { x: totalsX - 6, y: y + 12 }, end: { x: totalsRight, y: y + 12 }, thickness: 0.5, color: LINE });
  y -= 2;
  totalLine("GRAND TOTAL", `Rs. ${grand.toFixed(2)}`, { bold: true, color: WHITE, bg: NAVY });
  y -= 4;

  // ─── Amount in words
  drawText(page, "Amount in Words:", { x: MX, y, size: 8, font: helvBold, color: MUTED });
  const words = wrap(amountInWords(grand), helvBold, 10, RX - MX - 100);
  let wy = y - 14;
  for (const w of words) { drawText(page, w, { x: MX, y: wy, size: 10, font: helvBold, color: NAVY }); wy -= 13; }
  y = wy - 8;

  // ─── HSN / SAC Summary
  page.drawRectangle({ x: MX, y: y - 22, width: RX - MX, height: 22, color: HEADBG, borderColor: SOFT_LINE, borderWidth: 0.5 });
  drawText(page, "HSN / SAC SUMMARY", { x: MX + 8, y: y - 15, size: 9, font: helvBold, color: NAVY });
  y -= 22;
  const sumHeader = ["HSN/SAC", "Taxable Value", "GST %", "CGST", "SGST", "IGST", "Total Tax"];
  const sumX = [MX + 8, MX + 90, MX + 200, MX + 250, MX + 310, MX + 370, MX + 440];
  page.drawRectangle({ x: MX, y: y - 20, width: RX - MX, height: 20, color: NAVY });
  for (let i = 0; i < sumHeader.length; i++) drawText(page, sumHeader[i], { x: sumX[i], y: y - 14, size: 8.5, font: helvBold, color: WHITE });
  y -= 20;
  page.drawRectangle({ x: MX, y: y - 22, width: RX - MX, height: 22, color: WHITE, borderColor: SOFT_LINE, borderWidth: 0.5 });
  const sumVals = [
    sac,
    `Rs. ${subtotal.toFixed(2)}`,
    `${gstRate}%`,
    `Rs. ${cgst.toFixed(2)}`,
    `Rs. ${sgst.toFixed(2)}`,
    `Rs. ${igst.toFixed(2)}`,
    `Rs. ${totalTax.toFixed(2)}`,
  ];
  for (let i = 0; i < sumVals.length; i++) drawText(page, sumVals[i], { x: sumX[i], y: y - 15, size: 9, font: helv, color: NAVY });
  y -= 32;

  // ─── Notes
  drawText(page, "NOTES", { x: MX, y, size: 8, font: helvBold, color: MUTED });
  y -= 12;
  const notes = "Thank you for the payment. Your order has been successfully received. Our experts shall be processing your order during our standard business hours Monday to Saturday (10am to 6pm).";
  for (const ln of wrap(notes, helv, 9, RX - MX)) { drawText(page, ln, { x: MX, y, size: 9, font: helv, color: GRAY }); y -= 12; }
  y -= 6;

  // ─── Terms
  drawText(page, "TERMS & CONDITIONS", { x: MX, y, size: 8, font: helvBold, color: MUTED });
  y -= 12;
  const terms = [
    "1. All orders, once received, are Non-cancellable & Non-refundable.",
    "2. Refund and other policies are published on our website.",
    "3. All disputes are subject to Pune, Maharashtra jurisdictions only.",
    "4. This is a computer generated receipt not requiring signatures.",
  ];
  for (const t of terms) { drawText(page, t, { x: MX, y, size: 8.5, font: helv, color: GRAY }); y -= 11; }

  // ─── Footer signature strip
  page.drawLine({ start: { x: MX, y: 76 }, end: { x: RX, y: 76 }, thickness: 0.5, color: LINE });
  drawText(page, `Support: ${COMPANY_EMAIL}  |  ${COMPANY_PHONE}`, { x: MX, y: 60, size: 8.5, font: helv, color: GRAY });
  drawText(page, COMPANY_WEB, { x: MX, y: 48, size: 8.5, font: helvBold, color: NAVY });
  // Right side: For Company signature
  const sigText = `For ${COMPANY_NAME}`;
  drawText(page, sigText, { x: RX - textWidth(helvBold, sigText, 10), y: 62, size: 10, font: helvBold, color: NAVY });
  const auth = "Authorised Signatory";
  drawText(page, auth, { x: RX - textWidth(helv, auth, 8.5), y: 48, size: 8.5, font: helv, color: GRAY });

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
  const descLines = wrap(d.description || "-", helv, 11, 515);
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
