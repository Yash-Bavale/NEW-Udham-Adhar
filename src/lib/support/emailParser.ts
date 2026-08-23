/**
 * Parse inbound customer emails (plain text or HTML) and extract
 * the fresh reply content vs quoted thread history.
 */

export interface ParsedEmail {
  newContent: string;
  quotedContent: string;
  hasQuotedContent: boolean;
}

const GMAIL_QUOTE = /\bOn\s+[^\n]{1,200}\bwrote:\s*[\r\n]/i;
const OUTLOOK_QUOTE = /\r?\n[-]{0,}\s*From:\s.+\r?\n(?:Sent|Date):\s/i;
const ORIGINAL_MSG = /[-]{2,}\s*Original Message\s*[-]{2,}/i;
const FORWARDED_MSG = /[-]{2,}\s*Forwarded message\s*[-]{2,}/i;
const ZOHO_QUOTE_DIVIDER = /[-]{3,}\s*Zoho Mail\s*[-]{3,}/i;
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

  const patterns: RegExp[] = [GMAIL_QUOTE, OUTLOOK_QUOTE, ORIGINAL_MSG, FORWARDED_MSG, ZOHO_QUOTE_DIVIDER];
  for (const rx of patterns) {
    const m = rx.exec(body);
    if (m && (cutAt === -1 || m.index < cutAt)) cutAt = m.index;
  }

  // Generic "> quoted" block: cut at the first quoted line followed by more quoted lines
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

  newContent = newContent.replace(SENT_FROM_DEVICE, "");
  const sigIdx = newContent.search(SIG_DIVIDER);
  if (sigIdx > 40) newContent = newContent.slice(0, sigIdx);

  newContent = trimBody(newContent);

  return {
    newContent: newContent || trimBody(body),
    quotedContent: trimBody(quotedContent),
    hasQuotedContent: quotedContent.trim().length > 0,
  };
}

/**
 * Parse HTML body to separate main content from quoted blocks
 * (e.g., <blockquote...>, <div class="gmail_quote">, <div id="divRplyFwdMsg">)
 */
export function parseHtmlEmailReply(html: string | null | undefined): ParsedEmail {
  if (!html || !html.trim()) {
    return { newContent: "", quotedContent: "", hasQuotedContent: false };
  }

  const raw = html.trim();
  // Look for common HTML blockquote / reply containers
  const quoteSelectors = [
    /<div[^>]*class="[^"]*gmail_quote[^"]*"[^>]*>/i,
    /<blockquote[^>]*>/i,
    /<div[^>]*id="[^"]*divRplyFwdMsg[^"]*"[^>]*>/i,
    /<div[^>]*class="[^"]*zohomail[^"]*"[^>]*>/i,
    /<hr[^>]*id="[^"]*stopSpelling[^"]*"[^>]*>/i,
  ];

  let cutIdx = -1;
  for (const rx of quoteSelectors) {
    const match = rx.exec(raw);
    if (match && (cutIdx === -1 || match.index < cutIdx)) {
      cutIdx = match.index;
    }
  }

  if (cutIdx >= 0) {
    const newHtml = raw.slice(0, cutIdx).trim();
    const quotedHtml = raw.slice(cutIdx).trim();
    return {
      newContent: newHtml || raw,
      quotedContent: quotedHtml,
      hasQuotedContent: quotedHtml.length > 0,
    };
  }

  // Fallback to text parsing if no HTML blockquote wrapper found
  return { newContent: raw, quotedContent: "", hasQuotedContent: false };
}
