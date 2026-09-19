/**
 * Parse an inbound customer email body and return only what the sender
 * actually wrote in *this* reply, separating out the quoted history so it
 * can be shown collapsed in the UI.
 *
 * Handles Gmail ("On … wrote:"), Outlook (From:/Sent:/To:/Subject: block),
 * "-----Original Message-----" dividers, and generic "> " line quoting.
 */

export interface ParsedEmail {
  newContent: string;
  quotedContent: string;
  hasQuotedContent: boolean;
}

const GMAIL_QUOTE = /(?:\n|\.\s+|\s{2,}|\b)On\s+(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun|\d{1,2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[\s\S]{1,250}?\bwrote\s*:\s*/i;
const GENERIC_ON_WROTE = /\bOn\s+[\s\S]{1,200}?\bwrote\s*:\s*/i;
const OUTLOOK_QUOTE = /(?:\r?\n|\s{2,})[-]{0,}\s*From:\s.+?(?:Sent|Date):\s/i;
const ORIGINAL_MSG = /[-]{2,}\s*Original Message\s*[-]{2,}/i;
const FORWARDED_MSG = /[-]{2,}\s*Forwarded message\s*[-]{2,}/i;
const ORDER_RECEIPT_QUOTE = /(?:\bOrder Successfully Received\b|\bThank you for choosing Business Help Services\b)/i;
const SIG_DIVIDER = /\n[-_]{3,}\s*\n/;
const SENT_FROM_DEVICE = /\n\s*(Sent from my (iPhone|iPad|Android|Samsung|BlackBerry)|Get Outlook for (iOS|Android))[^\n]*/i;

function trimBody(s: string): string {
  return s.replace(/\s+$/g, "").replace(/^\s+/g, "");
}

export function parseEmailReply(rawBody: string | null | undefined): ParsedEmail {
  const body = (rawBody ?? "").replace(/\r\n/g, "\n");
  if (!body.trim()) {
    return { newContent: "", quotedContent: "", hasQuotedContent: false };
  }

  let cutAt = -1;

  const patterns: RegExp[] = [GMAIL_QUOTE, GENERIC_ON_WROTE, OUTLOOK_QUOTE, ORIGINAL_MSG, FORWARDED_MSG];
  for (const rx of patterns) {
    const m = rx.exec(body);
    if (m && (cutAt === -1 || m.index < cutAt)) cutAt = m.index;
  }

  // Fallback: If "Order Successfully Received" is present further down in a customer reply
  if (cutAt === -1) {
    const m = ORDER_RECEIPT_QUOTE.exec(body);
    if (m && m.index > 10) cutAt = m.index;
  }

  // Generic "> quoted" block: cut at the first quoted line that is followed
  // by more quoted lines (avoids clipping single stray '>' inside prose).
  if (cutAt === -1) {
    const lines = body.split("\n");
    for (let i = 0; i < lines.length - 1; i++) {
      if (/^\s*>/.test(lines[i]) && /^\s*>/.test(lines[i + 1])) {
        cutAt = lines.slice(0, i).join("\n").length;
        break;
      }
    }
  }

  let newContent = cutAt >= 0 ? body.slice(0, cutAt) : body;
  const quotedContent = cutAt >= 0 ? body.slice(cutAt) : "";

  // Drop "Sent from my iPhone"-style tail on the visible portion only.
  newContent = newContent.replace(SENT_FROM_DEVICE, "");
  // Drop signature separators from the visible portion.
  const sigIdx = newContent.search(SIG_DIVIDER);
  if (sigIdx > 40) newContent = newContent.slice(0, sigIdx);

  newContent = trimBody(newContent);

  return {
    newContent: newContent || trimBody(body),
    quotedContent: trimBody(quotedContent),
    hasQuotedContent: quotedContent.trim().length > 0,
  };
}
