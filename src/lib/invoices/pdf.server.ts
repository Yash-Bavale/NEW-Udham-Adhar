import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

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
  paymentId?: string | null;
  gatewayName: string;
  companyName?: string;
  companyAddress?: string;
};

export async function renderInvoicePdf(d: InvoiceData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4
  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const navy = rgb(0.07, 0.13, 0.27);
  const gray = rgb(0.35, 0.38, 0.45);
  const muted = rgb(0.55, 0.58, 0.63);
  const line = rgb(0.85, 0.87, 0.9);

  const companyName = d.companyName ?? "Business Help Services Consultancy";
  const companyAddress = d.companyAddress ?? "Udyam Adhar Consulting, India";

  // Header bar
  page.drawRectangle({ x: 0, y: 790, width: 595.28, height: 52, color: navy });
  page.drawText("TAX INVOICE", { x: 40, y: 810, size: 18, font: helvBold, color: rgb(1, 1, 1) });
  page.drawText(companyName, { x: 40, y: 795, size: 9, font: helv, color: rgb(0.85, 0.9, 1) });
  page.drawText(`#${d.invoiceNumber}`, { x: 460, y: 810, size: 12, font: helvBold, color: rgb(1, 1, 1) });

  // Meta block
  let y = 760;
  page.drawText("Issued on", { x: 40, y, size: 9, font: helv, color: muted });
  page.drawText(d.invoiceDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    { x: 40, y: y - 13, size: 11, font: helvBold, color: navy });

  page.drawText("Reference", { x: 220, y, size: 9, font: helv, color: muted });
  page.drawText(d.leadCode, { x: 220, y: y - 13, size: 11, font: helvBold, color: navy });

  if (d.applicationCode) {
    page.drawText("Application", { x: 400, y, size: 9, font: helv, color: muted });
    page.drawText(d.applicationCode, { x: 400, y: y - 13, size: 11, font: helvBold, color: navy });
  }

  // Bill-to
  y = 710;
  page.drawText("BILL TO", { x: 40, y, size: 9, font: helvBold, color: muted });
  page.drawText(d.customerName, { x: 40, y: y - 18, size: 13, font: helvBold, color: navy });
  page.drawText(d.customerEmail, { x: 40, y: y - 34, size: 10, font: helv, color: gray });
  page.drawText(d.customerMobile, { x: 40, y: y - 48, size: 10, font: helv, color: gray });
  if (d.customerState) {
    page.drawText(d.customerState, { x: 40, y: y - 62, size: 10, font: helv, color: gray });
  }

  // From
  page.drawText("FROM", { x: 360, y, size: 9, font: helvBold, color: muted });
  page.drawText(companyName, { x: 360, y: y - 18, size: 12, font: helvBold, color: navy });
  page.drawText(companyAddress, { x: 360, y: y - 34, size: 9, font: helv, color: gray });
  page.drawText("Consultancy Services", { x: 360, y: y - 48, size: 9, font: helv, color: gray });

  // Table header
  y = 615;
  page.drawRectangle({ x: 40, y: y - 6, width: 515, height: 28, color: rgb(0.96, 0.97, 0.99) });
  page.drawText("DESCRIPTION", { x: 50, y: y + 4, size: 9, font: helvBold, color: gray });
  page.drawText("AMOUNT", { x: 480, y: y + 4, size: 9, font: helvBold, color: gray });

  // Service row
  y -= 32;
  page.drawText(d.serviceName, { x: 50, y, size: 11, font: helvBold, color: navy });
  page.drawText("Professional consultancy fee", { x: 50, y: y - 14, size: 9, font: helv, color: muted });
  page.drawText(rupees(d.baseAmount), { x: 480, y, size: 11, font: helv, color: navy });

  // Divider
  y -= 40;
  page.drawLine({ start: { x: 40, y }, end: { x: 555, y }, thickness: 0.7, color: line });

  // Totals
  y -= 22;
  page.drawText("Subtotal", { x: 380, y, size: 10, font: helv, color: gray });
  page.drawText(rupees(d.baseAmount), { x: 480, y, size: 10, font: helv, color: navy });
  y -= 18;
  page.drawText("GST (18%)", { x: 380, y, size: 10, font: helv, color: gray });
  page.drawText(rupees(d.gstAmount), { x: 480, y, size: 10, font: helv, color: navy });
  y -= 8;
  page.drawLine({ start: { x: 370, y }, end: { x: 555, y }, thickness: 0.7, color: line });
  y -= 22;
  page.drawText("TOTAL PAID", { x: 380, y, size: 12, font: helvBold, color: navy });
  page.drawText(rupees(d.totalAmount), { x: 480, y, size: 13, font: helvBold, color: navy });

  // Payment info
  y -= 50;
  page.drawText("PAYMENT DETAILS", { x: 40, y, size: 9, font: helvBold, color: muted });
  page.drawText(`Gateway: ${d.gatewayName.toUpperCase()}`, { x: 40, y: y - 14, size: 10, font: helv, color: gray });
  if (d.paymentId) page.drawText(`Reference: ${d.paymentId}`, { x: 40, y: y - 28, size: 10, font: helv, color: gray });
  page.drawText("Status: PAID", { x: 40, y: y - 42, size: 10, font: helvBold, color: rgb(0.05, 0.55, 0.25) });

  // Footer
  page.drawLine({ start: { x: 40, y: 80 }, end: { x: 555, y: 80 }, thickness: 0.5, color: line });
  page.drawText("This is a computer-generated invoice and does not require a signature.",
    { x: 40, y: 65, size: 8, font: helv, color: muted });
  page.drawText("Thank you for choosing us.",
    { x: 40, y: 52, size: 8, font: helv, color: muted });

  return await pdf.save();
}

function rupees(n: number): string {
  return `INR ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
