import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { aU as Route$w, _ as useRole, j as useServerFn, aV as getOrderDocumentSignedUrl, a3 as useRealtimeTable } from "./router-QgJicixe.mjs";
import { u as useQueryClient, b as useMutation, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import purify_default from "../_libs/dompurify.mjs";
import { r as replyToTicket, u as updateTicket, m as getAdjacentTickets, n as makeOrderHotFromTicket, o as getTicketAttachmentUploadUrl, p as confirmTicketAttachment, q as closeTicketNormalT001, t as closeTicketRestartT001, v as closeTicketConsultationT001, w as closeTicketReplyReasonT002, x as closeTicketRefundR002, D as DropdownMenu, e as DropdownMenuTrigger, f as DropdownMenuContent, h as DropdownMenuItem, i as DropdownMenuSeparator } from "./dropdown-menu-Df4J-w-0.mjs";
import { listSupportFolders, toggleTicketStar, moveTicketsToFolder, removeTicketsFromFolder } from "./support-folders.functions-DPzEQYcA.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { c as computeOrderStage, S as STAGE_META, a as STAGE_BADGE_CLASS } from "./computeOrderStage-D7ejTUnj.mjs";
import { l as listCannedResponses } from "./canned-responses.functions-Dq1BoixE.mjs";
import { l as listEmailTemplates } from "./emails.functions-Pri3A8op.mjs";
import { l as listStaffForAssignment } from "./tasks.functions-D6mit-5h.mjs";
import { g as reopenOrder } from "./order-actions.functions-D4YiedPe.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { ax as TriangleAlert, b9 as ArrowLeft, b5 as Info, bT as Star, bx as Folder, y as ChevronDown, E as Check, X, L as LoaderCircle, l as CircleCheck, Q as FileText, aI as CircleX, i as Flame, R as RefreshCw, bD as Link2, b6 as MessageSquare, bY as Reply, bB as StickyNote, bZ as Bold, b_ as Italic, b$ as Underline, c0 as Strikethrough, c1 as List, c2 as ListOrdered, c3 as Quote, aO as Image, c4 as Paperclip, c5 as Package, ao as Sparkles, as as Send, ar as User, a as Mail, P as Phone, c as MapPin, aB as Copy, C as Clock, c6 as Ellipsis, O as ChevronUp, c7 as ZoomIn, ad as Eye, D as Download, v as Search } from "../_libs/lucide-react.mjs";
import { o as object, s as string } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./constants-CKRzJJF_.mjs";
import "./client.functions-WMvtjq1i.mjs";
import "./customer-access-core-Bd_9lLsD.mjs";
import "./brand-DLB0j9eh.mjs";
import "../_libs/tanstack__zod-adapter.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./datetime-DvkGwlJs.mjs";
import "./orders-filter-CXWoZisU.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./roles-CFhgFhhh.mjs";
import "./permissions.functions-DO0h7DgB.mjs";
import "./client-BX5UfqqR.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/lovable.dev__webhooks-js.mjs";
import "../_libs/lovable.dev__email-js.mjs";
import "./registry-DV_lUXjY.mjs";
import "../_libs/react-email__html.mjs";
import "../_libs/react-email__head.mjs";
import "../_libs/react-email__preview.mjs";
import "../_libs/react-email__body.mjs";
import "../_libs/react-email__container.mjs";
import "../_libs/react-email__heading.mjs";
import "../_libs/react-email__text.mjs";
import "../_libs/react-email__section.mjs";
import "../_libs/react-email__button.mjs";
import "../_libs/react-email__hr.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/react-day-picker.mjs";
import "../_libs/date-fns__tz.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./consultation-asWR5IET.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
const syncTicketAttachmentsFn = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid()
}).parse(i)).handler(createSsrRpc("64ff918335064fa0f7d92a6e5c83acf632855a47ea1c9c89b64f13a5f235395d"));
const getTicketWorkspace = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid()
}).parse(i)).handler(createSsrRpc("d4c1bef89bd71fafe10b445f2e52b286c4d3dff433b22244f895280313b69ac8"));
const linkTicketToApplication = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid(),
  applicationId: string().uuid()
}).parse(i)).handler(createSsrRpc("1cd121c75b5cf0252b3841e0ea4692c3c1aae560b33820945af83f5795fbf44e"));
const unlinkTicketFromApplication = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid()
}).parse(i)).handler(createSsrRpc("77ef8808231a090f80882f09215f191b1dc84c5b0d44557d4b01a94fec9a0b34"));
function decodeHtmlEntities(input) {
  if (!input) return "";
  return input.replace(/&#x([0-9a-fA-F]+);/g, (_, h) => {
    try {
      return String.fromCodePoint(parseInt(h, 16));
    } catch {
      return _;
    }
  }).replace(/&#(\d+);/g, (_, d) => {
    try {
      return String.fromCodePoint(parseInt(d, 10));
    } catch {
      return _;
    }
  }).replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&hellip;/gi, "…").replace(/&mdash;/gi, "—").replace(/&ndash;/gi, "–").replace(/&rsquo;|&lsquo;/gi, "'").replace(/&rdquo;|&ldquo;/gi, '"');
}
function htmlToPlainText(html) {
  if (!html) return "";
  const withBreaks = html.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n\n").replace(/<\/tr>/gi, "\n").replace(/<\/div>/gi, "\n").replace(/<\/li>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/\r\n/g, "\n").replace(/\n\s+\n/g, "\n\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  return decodeHtmlEntities(withBreaks);
}
const GMAIL_QUOTE = /(?:\n|\.\s+|\s{2,}|\b)On\s+(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun|\d{1,2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[\s\S]{1,250}?\bwrote\s*:\s*/i;
const GENERIC_ON_WROTE = /\bOn\s+[\s\S]{1,200}?\bwrote\s*:\s*/i;
const OUTLOOK_QUOTE = /(?:\r?\n|\s{2,})[-]{0,}\s*From:\s.+?(?:Sent|Date):\s/i;
const ORIGINAL_MSG = /[-]{2,}\s*Original Message\s*[-]{2,}/i;
const FORWARDED_MSG = /[-]{2,}\s*Forwarded message\s*[-]{2,}/i;
const ORDER_RECEIPT_QUOTE = /(?:\bOrder Successfully Received\b|\bThank you for choosing Business Help Services\b)/i;
const SIG_DIVIDER = /\n[-_]{3,}\s*\n/;
const SENT_FROM_DEVICE = /\n\s*(Sent from my (iPhone|iPad|Android|Samsung|BlackBerry)|Get Outlook for (iOS|Android))[^\n]*/i;
function trimBody(s) {
  return s.replace(/\s+$/g, "").replace(/^\s+/g, "");
}
function parseEmailReply(rawBody) {
  const body = (rawBody ?? "").replace(/\r\n/g, "\n");
  if (!body.trim()) {
    return { newContent: "", quotedContent: "", hasQuotedContent: false };
  }
  let cutAt = -1;
  const patterns = [GMAIL_QUOTE, GENERIC_ON_WROTE, OUTLOOK_QUOTE, ORIGINAL_MSG, FORWARDED_MSG];
  for (const rx of patterns) {
    const m = rx.exec(body);
    if (m && (cutAt === -1 || m.index < cutAt)) cutAt = m.index;
  }
  if (cutAt === -1) {
    const m = ORDER_RECEIPT_QUOTE.exec(body);
    if (m && m.index > 10) cutAt = m.index;
  }
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
  newContent = newContent.replace(/^\s*From:\s*[^\n]+\n*/i, "");
  newContent = newContent.replace(/^\s*(?:Sent|To|Subject):\s*[^\n]+\n*/gi, "");
  newContent = trimBody(newContent);
  return {
    newContent: newContent || trimBody(body),
    quotedContent: trimBody(quotedContent),
    hasQuotedContent: quotedContent.trim().length > 0
  };
}
const HTML_QUOTE_PATTERNS = [
  /<(?:div|blockquote)[^>]*class=["'][^"']*\bgmail_quote\b[^"']*["'][^>]*>[\s\S]*$/i,
  /<div[^>]*id=["']divRplyFwdMsg["'][^>]*>[\s\S]*$/i,
  /<div[^>]*id=["']appendonsend["'][^>]*>[\s\S]*$/i,
  /<hr[^>]*id=["']stopSpelling["'][^>]*>[\s\S]*$/i,
  /<div[^>]*style=["'][^"']*border-top:\s*solid\s*#?[a-f0-9]{3,6}[^"']*["'][^>]*>[\s\S]*$/i,
  /<blockquote[^>]*>[\s\S]*<\/blockquote>$/i
];
function parseEmailHtml(rawHtml) {
  if (!rawHtml || !rawHtml.trim()) {
    return { newHtml: "", quotedHtml: "", hasQuotedHtml: false };
  }
  const html = rawHtml.trim();
  for (const pattern of HTML_QUOTE_PATTERNS) {
    const match = pattern.exec(html);
    if (match && match.index > 0) {
      const newHtml = html.slice(0, match.index).trim();
      const quotedHtml = html.slice(match.index).trim();
      const textPreview = htmlToPlainText(newHtml);
      if (textPreview.length > 5) {
        return {
          newHtml,
          quotedHtml,
          hasQuotedHtml: true
        };
      }
    }
  }
  return {
    newHtml: html,
    quotedHtml: "",
    hasQuotedHtml: false
  };
}
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function resolveInlineImages(html, attachments) {
  if (!html) return html;
  let out = html;
  if (attachments && attachments.length > 0) {
    const imagesWithUrls = attachments.filter((a) => a.url);
    for (const att of imagesWithUrls) {
      if (!att.url) continue;
      const identifiers = [
        att.cid,
        att.zoho_attachment_id,
        att.fileName,
        att.file_name
      ].filter(Boolean);
      for (const id of identifiers) {
        const cidRegex = new RegExp(`src=["']cid:${escapeRegex(id)}["']`, "gi");
        out = out.replace(cidRegex, `src="${att.url}" data-resolved-cid="true"`);
        const bareCidRegex = new RegExp(`cid:${escapeRegex(id)}`, "gi");
        out = out.replace(bareCidRegex, att.url);
      }
    }
    const remainingCids = out.match(/cid:[^"'\s>]+/gi);
    if (remainingCids && remainingCids.length === 1 && imagesWithUrls.length === 1) {
      out = out.replace(remainingCids[0], imagesWithUrls[0].url);
    }
  }
  out = out.replace(
    /<img([^>]*?)src=["']cid:([^"']+)["']([^>]*?)>/gi,
    '<div class="inline-flex items-center gap-1.5 px-2.5 py-1.5 my-2 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium"><span>📷 Customer Screenshot / Embedded Image</span></div>'
  );
  return out;
}
function parseEmailMessage(input) {
  const rawHtml = input.bodyHtml && input.bodyHtml.trim() ? input.bodyHtml : null;
  const rawText = input.bodyText && input.bodyText.trim() ? input.bodyText : null;
  if (rawHtml) {
    const htmlWithImages = resolveInlineImages(rawHtml, input.attachments);
    const parsedHtml = parseEmailHtml(htmlWithImages);
    return {
      isHtml: true,
      content: parsedHtml.newHtml || htmlWithImages,
      quotedContent: parsedHtml.quotedHtml,
      hasQuoted: parsedHtml.hasQuotedHtml,
      rawHtml: htmlWithImages,
      rawText: rawText ? decodeHtmlEntities(rawText) : htmlToPlainText(htmlWithImages)
    };
  }
  const decodedText = decodeHtmlEntities(rawText || "");
  const parsedText = parseEmailReply(decodedText);
  return {
    isHtml: false,
    content: parsedText.newContent || decodedText,
    quotedContent: parsedText.quotedContent,
    hasQuoted: parsedText.hasQuotedContent,
    rawHtml: null,
    rawText: decodedText
  };
}
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
const STATUS_CONFIG = {
  open: {
    bg: "bg-blue-50",
    fg: "text-blue-700",
    border: "border-blue-200",
    label: "Open"
  },
  in_progress: {
    bg: "bg-purple-50",
    fg: "text-purple-700",
    border: "border-purple-200",
    label: "In Progress"
  },
  waiting_customer: {
    bg: "bg-amber-50",
    fg: "text-amber-700",
    border: "border-amber-200",
    label: "Waiting Customer"
  },
  resolved: {
    bg: "bg-emerald-50",
    fg: "text-emerald-700",
    border: "border-emerald-200",
    label: "Resolved"
  },
  closed: {
    bg: "bg-slate-100",
    fg: "text-slate-600",
    border: "border-slate-200",
    label: "Closed"
  }
};
const PRIORITY_CONFIG = {
  urgent: {
    bg: "bg-rose-50",
    fg: "text-rose-700",
    border: "border-rose-200",
    label: "Urgent",
    dot: "bg-rose-500"
  },
  high: {
    bg: "bg-orange-50",
    fg: "text-orange-700",
    border: "border-orange-200",
    label: "High",
    dot: "bg-orange-500"
  },
  medium: {
    bg: "bg-rose-50",
    fg: "text-rose-700",
    border: "border-rose-200",
    label: "Medium",
    dot: "bg-rose-500"
  },
  low: {
    bg: "bg-slate-100",
    fg: "text-slate-600",
    border: "border-slate-200",
    label: "Low",
    dot: "bg-slate-400"
  }
};
function ist(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(new Date(iso));
}
function formatDateDivider(iso) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(iso)).toUpperCase();
}
function formatTimeOnly(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(new Date(iso));
}
function initials(name) {
  if (!name) return "?";
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}
function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return "412 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function getOrderStageTimestamp(stage, app, events, ticket) {
  if (!app?.id && !ticket?.id) return null;
  const appEvents = Array.isArray(events) ? events : [];
  switch (stage) {
    case "closed": {
      const closeEv = appEvents.find((e) => {
        const et = String(e.event_type || "").toLowerCase();
        const nv = String(e.new_value || "").toLowerCase();
        const note = String(e.note || "").toLowerCase();
        return et === "order_closed" || et === "workflow_closed" || nv.includes("close") || nv.includes("cancel") || note.includes("closed");
      });
      const ts = closeEv?.created_at || app?.updated_at || ticket?.closed_at || app?.created_at || null;
      return {
        label: "Closed At",
        timestamp: ts
      };
    }
    case "completed": {
      const compEv = appEvents.find((e) => {
        const et = String(e.event_type || "").toLowerCase();
        const nv = String(e.new_value || "").toLowerCase();
        return et === "order_completed" || et === "application_completed" || et === "certificate_uploaded" || et === "certificate_delivered" || nv === "completed" || nv === "order_completed";
      });
      const ts = app?.fulfilled_at || app?.certificate_uploaded_at || compEv?.created_at || app?.updated_at || app?.created_at || null;
      return {
        label: "Completed At",
        timestamp: ts
      };
    }
    case "customer_delay": {
      const custEv = appEvents.find((e) => {
        const et = String(e.event_type || "").toLowerCase();
        const nv = String(e.new_value || "").toLowerCase();
        return et.includes("customer_delay") || nv.includes("customer_delay");
      });
      const ts = app?.customer_hold_started_at || custEv?.created_at || app?.updated_at || null;
      return {
        label: "Customer Delay At",
        timestamp: ts
      };
    }
    case "technical_delay": {
      const techEv = appEvents.find((e) => {
        const et = String(e.event_type || "").toLowerCase();
        const nv = String(e.new_value || "").toLowerCase();
        return et.includes("technical_delay") || nv.includes("technical_delay");
      });
      const ts = app?.technical_hold_started_at || techEv?.created_at || app?.updated_at || null;
      return {
        label: "Tech Delay At",
        timestamp: ts
      };
    }
    case "order_reopened": {
      const reopenEv = appEvents.find((e) => {
        const et = String(e.event_type || "").toLowerCase();
        const nv = String(e.new_value || "").toLowerCase();
        return et.includes("reopened") || nv.includes("reopened");
      });
      const ts = app?.reopened_at || reopenEv?.created_at || app?.updated_at || null;
      return {
        label: "Reopened At",
        timestamp: ts
      };
    }
    case "form_submitted": {
      return {
        label: "Form Submitted At",
        timestamp: app?.form_submitted_at || app?.updated_at || null
      };
    }
    case "refunded": {
      return {
        label: "Refunded At",
        timestamp: app?.refund_processed_at || app?.refund_approved_at || app?.updated_at || null
      };
    }
    case "refund_requested": {
      return {
        label: "Refund Requested At",
        timestamp: app?.refund_requested_at || app?.updated_at || null
      };
    }
    case "certificate_ready": {
      return {
        label: "Cert Ready At",
        timestamp: app?.certificate_uploaded_at || app?.updated_at || null
      };
    }
    case "consultation_completed": {
      const consultEv = appEvents.find((e) => String(e.event_type || "").toLowerCase().includes("consultation"));
      return {
        label: "Consultation At",
        timestamp: consultEv?.created_at || app?.updated_at || null
      };
    }
    default: {
      const latestEv = appEvents[0];
      const ts = latestEv?.created_at || app?.updated_at || null;
      if (ts) {
        return {
          label: "Latest Action",
          timestamp: ts
        };
      }
      return null;
    }
  }
}
function extractTemplateHint(subject, bodyHtml) {
  const src = `${subject ?? ""} ${bodyHtml ?? ""}`;
  const m = src.match(/\b(E0\d{2}|T0\d{2}|TB0\d{2})\b/i);
  if (m) return m[1].toUpperCase();
  if (/Order Confirmation & Tax Invoice/i.test(src)) return "E001";
  if (/Temporary Processing Hold|Operational Hold/i.test(src)) return "E003";
  if (/Service Changed|Service Has Been Updated/i.test(src)) return "E012";
  if (/Consultation Completed/i.test(src)) return "TB01";
  if (/Reply & Close/i.test(src)) return "TB02";
  return null;
}
function TicketWorkspace() {
  const {
    ticketId
  } = Route$w.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const role = useRole();
  role.roles.includes("support") && role.roles.length === 1;
  const loadFn = useServerFn(getTicketWorkspace);
  const replyFn = useServerFn(replyToTicket);
  const updateFn = useServerFn(updateTicket);
  const cannedFn = useServerFn(listCannedResponses);
  const templatesFn = useServerFn(listEmailTemplates);
  const staffFn = useServerFn(listStaffForAssignment);
  const adjacentFn = useServerFn(getAdjacentTickets);
  const getDocUrlFn = useServerFn(getOrderDocumentSignedUrl);
  const reopenOrderFn = useServerFn(reopenOrder);
  const makeHotOrderFn = useServerFn(makeOrderHotFromTicket);
  const linkOrderFn = useServerFn(linkTicketToApplication);
  const unlinkOrderFn = useServerFn(unlinkTicketFromApplication);
  const getAttachmentUploadUrlFn = useServerFn(getTicketAttachmentUploadUrl);
  const confirmAttachmentFn = useServerFn(confirmTicketAttachment);
  const closeNormal = useServerFn(closeTicketNormalT001);
  const closeRestart = useServerFn(closeTicketRestartT001);
  const closeConsult = useServerFn(closeTicketConsultationT001);
  const closeReply = useServerFn(closeTicketReplyReasonT002);
  const closeRefund = useServerFn(closeTicketRefundR002);
  const syncAttachmentsFn = useServerFn(syncTicketAttachmentsFn);
  const foldersFn = useServerFn(listSupportFolders);
  const toggleStarFn = useServerFn(toggleTicketStar);
  const moveTicketsFn = useServerFn(moveTicketsToFolder);
  const removeTicketsFn = useServerFn(removeTicketsFromFolder);
  const doSyncAttachments = useMutation({
    mutationFn: () => syncAttachmentsFn({
      data: {
        ticketId
      }
    }),
    onSuccess: (newAtts) => {
      if (newAtts && newAtts.length > 0) {
        toast.success(`Synced ${newAtts.length} image/attachment(s) from email!`);
      } else {
        toast.info("Checked email: no additional attachments found.");
      }
      invalidate();
    },
    onError: (e) => toast.error(e?.message ?? "Sync failed")
  });
  const {
    data,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["support-workspace", ticketId],
    queryFn: () => loadFn({
      data: {
        ticketId
      }
    })
  });
  const {
    data: foldersData,
    refetch: refetchFolders
  } = useQuery({
    queryKey: ["support-ticket-folders"],
    queryFn: () => foldersFn()
  });
  const folders = foldersData?.folders ?? [];
  const toggleStarMutation = useMutation({
    mutationFn: (isStarred) => toggleStarFn({
      data: {
        ticketId,
        isStarred
      }
    }),
    onSuccess: (res) => {
      invalidate();
      refetchFolders();
      toast.success(res.isStarred ? "Ticket starred" : "Ticket unstarred");
    },
    onError: (e) => toast.error(e.message)
  });
  const moveToFolderMutation = useMutation({
    mutationFn: (folderId) => moveTicketsFn({
      data: {
        ticketIds: [ticketId],
        folderId
      }
    }),
    onSuccess: () => {
      invalidate();
      refetchFolders();
      toast.success("Ticket moved to folder");
    },
    onError: (e) => toast.error(e.message)
  });
  const removeFromFolderMutation = useMutation({
    mutationFn: () => removeTicketsFn({
      data: {
        ticketIds: [ticketId]
      }
    }),
    onSuccess: () => {
      invalidate();
      refetchFolders();
      toast.success("Ticket removed from folder");
    },
    onError: (e) => toast.error(e.message)
  });
  const {
    data: cannedList
  } = useQuery({
    queryKey: ["canned-responses-active"],
    queryFn: () => cannedFn({
      data: {
        activeOnly: true
      }
    })
  });
  const {
    data: templatesList
  } = useQuery({
    queryKey: ["email-templates-active"],
    queryFn: () => templatesFn()
  });
  const {
    data: staffData
  } = useQuery({
    queryKey: ["staff-for-assignment"],
    queryFn: () => staffFn({
      data: {}
    })
  });
  const [navState, setNavState] = reactExports.useState({
    prevId: null,
    nextId: null
  });
  reactExports.useEffect(() => {
    let handled = false;
    try {
      const stored = sessionStorage.getItem("bhs_ticket_ids_context");
      if (stored) {
        const ids = JSON.parse(stored);
        if (Array.isArray(ids)) {
          const idx = ids.indexOf(ticketId);
          if (idx !== -1) {
            setNavState({
              prevId: idx > 0 ? ids[idx - 1] : null,
              nextId: idx < ids.length - 1 ? ids[idx + 1] : null
            });
            handled = true;
          }
        }
      }
    } catch {
    }
    if (!handled) {
      adjacentFn({
        data: {
          ticketId
        }
      }).then((res) => {
        if (res) setNavState({
          prevId: res.prevId,
          nextId: res.nextId
        });
      }).catch(() => {
      });
    }
  }, [ticketId]);
  const invalidate = () => {
    qc.invalidateQueries({
      queryKey: ["support-workspace", ticketId]
    });
    qc.invalidateQueries({
      queryKey: ["support-tickets-ops"]
    });
    qc.invalidateQueries({
      queryKey: ["support-ticket-stats"]
    });
    refetch();
  };
  const setLocalTicketStatus = (newStatus) => {
    qc.setQueryData(["support-workspace", ticketId], (old) => {
      if (!old?.ticket) return old;
      return {
        ...old,
        ticket: {
          ...old.ticket,
          status: newStatus
        }
      };
    });
  };
  useRealtimeTable("ticket_replies", invalidate, {
    filter: `ticket_id=eq.${ticketId}`
  });
  const appId = data?.ticket?.application_id ?? null;
  useRealtimeTable("email_logs", invalidate, appId ? {
    filter: `application_id=eq.${appId}`
  } : void 0);
  const [restartConfirm, setRestartConfirm] = reactExports.useState(false);
  const [reopenConfirm, setReopenConfirm] = reactExports.useState(false);
  const [consultOpen, setConsultOpen] = reactExports.useState(false);
  const [consultNote, setConsultNote] = reactExports.useState("");
  const [reasonOpen, setReasonOpen] = reactExports.useState(false);
  const [cannedModalOpen, setCannedModalOpen] = reactExports.useState(false);
  const [templatesModalOpen, setTemplatesModalOpen] = reactExports.useState(false);
  const [sendOptionsOpen, setSendOptionsOpen] = reactExports.useState(false);
  const [sendCopy, setSendCopy] = reactExports.useState(false);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = reactExports.useState(false);
  const [hotOrderModalOpen, setHotOrderModalOpen] = reactExports.useState(false);
  const [isComposerOpen, setIsComposerOpen] = reactExports.useState(false);
  const [composeTab, setComposeTab] = reactExports.useState("reply");
  const [body, setBody] = reactExports.useState("");
  const [showCc, setShowCc] = reactExports.useState(false);
  const [showBcc, setShowBcc] = reactExports.useState(false);
  const [ccInput, setCcInput] = reactExports.useState("");
  const [bccInput, setBccInput] = reactExports.useState("");
  const [attachedFiles, setAttachedFiles] = reactExports.useState([]);
  const composerRef = reactExports.useRef(null);
  const imageInputRef = reactExports.useRef(null);
  const attachmentInputRef = reactExports.useRef(null);
  const threadRef = reactExports.useRef(null);
  const [showScrollBottom, setShowScrollBottom] = reactExports.useState(false);
  const openComposer = (tab = "reply") => {
    setComposeTab(tab);
    setIsComposerOpen(true);
    setTimeout(() => {
      composerRef.current?.focus();
    }, 50);
  };
  const handleAttachmentSelect = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const items = files.map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file: f,
      name: f.name,
      size: f.size,
      mimeType: f.type || "application/octet-stream"
    }));
    setAttachedFiles((prev) => [...prev, ...items]);
    if (e.target) e.target.value = "";
  };
  const removeAttachment = (id) => {
    setAttachedFiles((prev) => prev.filter((a) => a.id !== id));
  };
  const handleThreadScroll = () => {
    if (!threadRef.current) return;
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = threadRef.current;
    const distFromBottom = scrollHeight - (scrollTop + clientHeight);
    setShowScrollBottom(distFromBottom > 160);
  };
  const scrollToBottom = () => {
    if (threadRef.current) {
      threadRef.current.scrollTo({
        top: threadRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };
  const messages = reactExports.useMemo(() => {
    if (!data) return [];
    const out = [];
    const t = data.ticket;
    const cust2 = t?.customers ?? {};
    const docs = data.documents ?? [];
    const allTicketAtts = data.ticketReplyAttachments ?? [];
    const desc = (t?.description ?? "").trim();
    const firstReply = data.replies?.[0];
    const firstReplyText = (firstReply?.reply_text ?? "").trim();
    const isFirstReplySameAsDesc = Boolean(desc && firstReplyText && (firstReplyText === desc || firstReplyText.includes(desc)));
    if (desc && !isFirstReplySameAsDesc) {
      if (t.source === "staff") {
        out.push({
          kind: "note",
          id: `ticket-desc-${t.id}`,
          created_at: t.created_at,
          author_name: t.assigned_name || "Staff",
          body_text: decodeHtmlEntities(desc)
        });
      } else {
        const initialAtts = allTicketAtts.filter((a) => !a.ticket_reply_id);
        out.push({
          kind: "inbound",
          id: `ticket-desc-${t.id}`,
          created_at: t.created_at,
          from_email: t.ticket_email ?? cust2.primary_email ?? null,
          subject: t.subject ?? null,
          body_text: decodeHtmlEntities(desc),
          body_html: null,
          attachments: initialAtts.length > 0 ? initialAtts : docs.length > 0 ? docs.slice(0, 2) : void 0
        });
      }
    }
    for (const r of data.replies ?? []) {
      if (r.is_internal || r.direction === "note") {
        out.push({
          kind: "note",
          id: `n-${r.id}`,
          created_at: r.created_at,
          author_name: r.author_name ?? "Staff",
          body_text: decodeHtmlEntities(r.reply_text ?? "")
        });
      } else if (r.direction === "inbound" || r.direction === "incoming") {
        const text = decodeHtmlEntities(r.reply_text ?? "");
        const hasAttachmentMention = /attach|document|proof|pdf|file/i.test(text);
        const replyAtts = r.attachments && r.attachments.length > 0 ? r.attachments : allTicketAtts.filter((a) => a.ticket_reply_id === r.id);
        out.push({
          kind: "inbound",
          id: `ri-${r.id}`,
          created_at: r.created_at,
          from_email: r.from_email ?? t.ticket_email ?? cust2.primary_email ?? null,
          subject: r.subject ?? null,
          body_text: text,
          body_html: r.body_html ?? null,
          attachments: replyAtts.length > 0 ? replyAtts : hasAttachmentMention && docs.length > 0 ? docs : void 0
        });
      } else {
        out.push({
          kind: "outbound",
          id: `ro-${r.id}`,
          created_at: r.emailed_at ?? r.created_at,
          from_email: r.from_email ?? "help@businesshelpservices.com",
          subject: r.subject ?? null,
          body_html: r.body_html ?? null,
          body_text: decodeHtmlEntities(r.reply_text ?? ""),
          template_hint: r.template_code ?? extractTemplateHint(r.subject, r.body_html),
          status: r.email_status ?? (r.emailed_at ? "Sent" : "Sent"),
          author_name: r.author_name ?? "Business Help Services",
          attachments: r.attachments
        });
      }
    }
    for (const em of data.emails ?? []) {
      const emCreated = em.sent_at || em.created_at;
      const isInbound = em.direction === "incoming" || em.direction === "inbound";
      const isDuplicate = out.some((m) => m.kind === (isInbound ? "inbound" : "outbound") && (Math.abs(new Date(m.created_at).getTime() - new Date(emCreated).getTime()) < 5e3 || m.subject && em.subject && m.subject === em.subject));
      if (!isDuplicate) {
        if (isInbound) {
          const text = decodeHtmlEntities(em.body_text ?? "");
          const hasAttachmentMention = /attach|document|proof|pdf|file/i.test(text);
          out.push({
            kind: "inbound",
            id: `em-${em.id}`,
            created_at: emCreated,
            from_email: em.from_email ?? t.ticket_email ?? cust2.primary_email ?? null,
            subject: em.subject ?? null,
            body_html: em.body_html ?? null,
            body_text: text,
            attachments: hasAttachmentMention && docs.length > 0 ? docs : void 0
          });
        } else {
          out.push({
            kind: "outbound",
            id: `em-${em.id}`,
            created_at: emCreated,
            from_email: em.from_email ?? "help@businesshelpservices.com",
            subject: em.subject ?? null,
            body_html: em.body_html ?? null,
            body_text: decodeHtmlEntities(em.body_text ?? ""),
            template_hint: em.template_code ?? extractTemplateHint(em.subject, em.body_html),
            status: em.status ?? "Sent",
            author_name: "Business Help Services"
          });
        }
      }
    }
    out.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return out;
  }, [data]);
  const groupedMessages = reactExports.useMemo(() => {
    const groups = [];
    let currentGroup = null;
    for (const m of messages) {
      const label = formatDateDivider(m.created_at);
      if (!currentGroup || currentGroup.dateLabel !== label) {
        currentGroup = {
          dateLabel: label,
          items: []
        };
        groups.push(currentGroup);
      }
      currentGroup.items.push(m);
    }
    return groups;
  }, [messages]);
  reactExports.useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages.length]);
  const sendReply = useMutation({
    mutationFn: async (opts) => {
      let finalMessage = body.trim();
      const emailAttachments = [];
      const storedFiles = [];
      if (attachedFiles.length > 0) {
        let attachLinksHtml = "";
        for (const item of attachedFiles) {
          if (composeTab === "reply") {
            try {
              const buf = new Uint8Array(await item.file.arrayBuffer());
              let bin = "";
              for (let i = 0; i < buf.length; i += 32768) bin += String.fromCharCode(...buf.subarray(i, i + 32768));
              emailAttachments.push({
                filename: item.name,
                content_base64: btoa(bin),
                content_type: item.mimeType || "application/octet-stream"
              });
            } catch {
            }
          }
          try {
            const {
              path,
              token
            } = await getAttachmentUploadUrlFn({
              data: {
                ticketId,
                fileName: item.name,
                mimeType: item.mimeType
              }
            });
            const {
              supabase
            } = await import("./client-BX5UfqqR.mjs");
            const {
              error: upErr
            } = await supabase.storage.from("documents").uploadToSignedUrl(path, token, item.file, {
              contentType: item.mimeType,
              upsert: true
            });
            if (upErr) throw upErr;
            const confirmed = await confirmAttachmentFn({
              data: {
                ticketId,
                applicationId: data?.ticket?.application_id ?? null,
                filePath: path,
                fileName: item.name,
                mimeType: item.mimeType,
                sizeBytes: item.size
              }
            });
            storedFiles.push({
              storage_path: path,
              file_name: item.name,
              mime_type: item.mimeType || "application/octet-stream",
              file_size: item.size
            });
            if (confirmed?.url) {
              attachLinksHtml += `<p style="margin:4px 0;">📎 <strong>Attachment:</strong> <a href="${confirmed.url}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">${escapeHtml(item.name)}</a> (${formatBytes(item.size)})</p>`;
            }
          } catch (err) {
            toast.error(`Failed to upload ${item.name}: ${err?.message ?? "Upload error"}`);
          }
        }
        if (attachLinksHtml) {
          finalMessage += `<div data-crm-attachments="1" style="margin-top:16px;padding:10px 12px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px;font-size:12px;color:#334155">${attachLinksHtml}</div>`;
        }
      }
      const shouldClose = composeTab === "reply" ? opts?.closeAfter !== false : false;
      return replyFn({
        data: {
          ticketId,
          message: finalMessage,
          isInternal: composeTab === "note",
          closeTicket: shouldClose,
          armAutoclose: false,
          cc: opts && "cc" in opts && opts.cc ? opts.cc : ccInput.trim() || void 0,
          bcc: opts && "bcc" in opts && opts.bcc ? opts.bcc : bccInput.trim() || void 0,
          attachments: emailAttachments.length ? emailAttachments : void 0,
          storedFiles: storedFiles.length ? storedFiles : void 0
        }
      });
    },
    onMutate: () => {
      if (composeTab === "reply") {
        setLocalTicketStatus("closed");
      }
    },
    onSuccess: async (r) => {
      if (composeTab === "reply") {
        setLocalTicketStatus("closed");
      }
      if (composeTab === "note") {
        toast.success("Internal note added");
      } else if (r?.emailed === false) {
        toast.warning(`Reply saved: ${r.reason ?? "unknown"}`);
      } else {
        toast.success("Reply sent & ticket closed");
      }
      setBody("");
      setAttachedFiles([]);
      if (composerRef.current) composerRef.current.innerHTML = "";
      setCcInput("");
      setBccInput("");
      setShowCc(false);
      setShowBcc(false);
      setIsComposerOpen(false);
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const changeStatus = useMutation({
    mutationFn: (status) => updateFn({
      data: {
        id: ticketId,
        status
      }
    }),
    onMutate: (newStatus) => {
      setLocalTicketStatus(newStatus);
    },
    onSuccess: () => {
      toast.success("Status updated");
      invalidate();
    },
    onError: (e) => {
      toast.error(e.message);
      invalidate();
    }
  });
  const changePriority = useMutation({
    mutationFn: (priority) => updateFn({
      data: {
        id: ticketId,
        priority
      }
    }),
    onSuccess: () => {
      toast.success("Priority updated");
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const changeAssignee = useMutation({
    mutationFn: (userId) => updateFn({
      data: {
        id: ticketId,
        assigned_to: userId
      }
    }),
    onSuccess: () => {
      toast.success("Assignee updated");
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const doCloseNormal = useMutation({
    mutationFn: () => closeNormal({
      data: {
        ticketId
      }
    }),
    onMutate: () => {
      setLocalTicketStatus("closed");
    },
    onSuccess: () => {
      toast.success("Ticket closed");
      invalidate();
    },
    onError: (e) => {
      toast.error(e.message);
      invalidate();
    }
  });
  const doCloseRestart = useMutation({
    mutationFn: () => closeRestart({
      data: {
        ticketId
      }
    }),
    onMutate: () => {
      setLocalTicketStatus("closed");
    },
    onSuccess: () => {
      toast.success("Order restarted & ticket closed");
      invalidate();
    },
    onError: (e) => {
      toast.error(e.message);
      invalidate();
    }
  });
  const doCloseConsult = useMutation({
    mutationFn: (remarks) => closeConsult({
      data: {
        ticketId,
        remarks: remarks || void 0
      }
    }),
    onMutate: () => {
      setLocalTicketStatus("closed");
    },
    onSuccess: () => {
      toast.success("TB01 Consultation completed — ticket closed");
      invalidate();
    },
    onError: (e) => {
      toast.error(e.message);
      invalidate();
    }
  });
  useMutation({
    mutationFn: (v) => closeReply({
      data: {
        ticketId,
        reasonId: v.reasonId,
        reasonLabel: v.reasonLabel,
        replyBody: v.replyBody
      }
    }),
    onMutate: () => {
      setLocalTicketStatus("waiting_customer");
    },
    onSuccess: () => {
      toast.success("TB02 sent — 24h auto-close armed");
      invalidate();
    },
    onError: (e) => {
      toast.error(e.message);
      invalidate();
    }
  });
  const doCloseRefund = useMutation({
    mutationFn: (v) => closeRefund({
      data: {
        ticketId,
        reasonLabel: v.reasonLabel,
        replyBody: v.replyBody
      }
    }),
    onMutate: () => {
      setLocalTicketStatus("closed");
    },
    onSuccess: () => {
      toast.success("R002 Refund Rejected email sent & ticket closed");
      setReasonOpen(false);
      invalidate();
    },
    onError: (e) => {
      toast.error(e.message);
      invalidate();
    }
  });
  const doReopenOrder = useMutation({
    mutationFn: (orderId) => reopenOrderFn({
      data: {
        orderId
      }
    }),
    onSuccess: () => {
      toast.success("Order reopened successfully — active in Hot Orders");
      invalidate();
      if (app.id) {
        qc.invalidateQueries({
          queryKey: ["admin.order", app.id]
        });
        qc.invalidateQueries({
          queryKey: ["order-workflow-state", app.id]
        });
        qc.invalidateQueries({
          queryKey: ["order-tickets", app.id]
        });
        qc.invalidateQueries({
          queryKey: ["workflow-events", app.id]
        });
      }
      qc.invalidateQueries({
        queryKey: ["admin.orders.v2"]
      });
      qc.invalidateQueries({
        queryKey: ["due-reminders-summary"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const doMakeHotOrder = useMutation({
    mutationFn: (args) => {
      const orderId = typeof args === "string" ? args : args?.orderId;
      const note = typeof args === "object" ? args?.note : void 0;
      return makeHotOrderFn({
        data: {
          ticketId,
          orderId: orderId || app.id,
          note
        }
      });
    },
    onSuccess: () => {
      toast.success("🔥 Order reopened & prioritized as Hot Order!");
      setHotOrderModalOpen(false);
      invalidate();
      if (app.id) {
        qc.invalidateQueries({
          queryKey: ["admin.order", app.id]
        });
        qc.invalidateQueries({
          queryKey: ["order-workflow-state", app.id]
        });
        qc.invalidateQueries({
          queryKey: ["order-tickets", app.id]
        });
        qc.invalidateQueries({
          queryKey: ["workflow-events", app.id]
        });
      }
      qc.invalidateQueries({
        queryKey: ["admin.orders.v2"]
      });
      qc.invalidateQueries({
        queryKey: ["due-reminders-summary"]
      });
      qc.invalidateQueries({
        queryKey: ["sidebar-notification-counts"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const doLinkOrder = useMutation({
    mutationFn: (targetApplicationId) => linkOrderFn({
      data: {
        ticketId,
        applicationId: targetApplicationId
      }
    }),
    onSuccess: () => {
      toast.success("Order linked successfully to ticket");
      invalidate();
      qc.invalidateQueries({
        queryKey: ["support-workspace", ticketId]
      });
      qc.invalidateQueries({
        queryKey: ["support-tickets-ops"]
      });
    },
    onError: (e) => toast.error(e.message || "Failed to link order")
  });
  const doUnlinkOrder = useMutation({
    mutationFn: () => unlinkOrderFn({
      data: {
        ticketId
      }
    }),
    onSuccess: () => {
      toast.success("Order unlinked from ticket");
      invalidate();
      qc.invalidateQueries({
        queryKey: ["support-workspace", ticketId]
      });
      qc.invalidateQueries({
        queryKey: ["support-tickets-ops"]
      });
    },
    onError: (e) => toast.error(e.message || "Failed to unlink order")
  });
  const execFmt = (command, value) => {
    composerRef.current?.focus();
    document.execCommand(command, false, value ?? "");
    if (composerRef.current) {
      setBody(composerRef.current.innerHTML);
    }
  };
  const insertOrderDetails = () => {
    const t = data?.ticket;
    const app2 = t?.applications ?? {};
    const serviceName2 = t?.services?.service_name ?? app2?.services?.service_name ?? "Service";
    const lead = app2?.leads ?? (t?.customers ? {
      name: t.customers.name,
      email: t.customers.primary_email,
      mobile: t.customers.primary_mobile
    } : null);
    const orderStage = app2?.id ? computeOrderStage(lead, app2) : null;
    const stageLabel = orderStage ? STAGE_META[orderStage].label : app2.fulfillment_status ? app2.fulfillment_status.replace(/_/g, " ") : "Processing";
    const stageDate = getOrderStageTimestamp(orderStage, app2, data?.events, t);
    const stageDateHtml = stageDate?.timestamp ? `<p><strong>${stageDate.label}:</strong> ${ist(stageDate.timestamp)}</p>` : "";
    const details = `<p><strong>Order No:</strong> ${app2.application_code || "—"}</p><p><strong>Service:</strong> ${serviceName2}</p><p><strong>Order Date:</strong> ${ist(app2.created_at || t.created_at)}</p><p><strong>Order Stage:</strong> ${stageLabel}</p>${stageDateHtml}`;
    if (composerRef.current) {
      composerRef.current.focus();
      document.execCommand("insertHTML", false, details);
      setBody(composerRef.current.innerHTML);
    }
    toast.success("Order details inserted");
    composerRef.current?.focus();
  };
  const handleDownloadDoc = async (doc) => {
    try {
      const res = await getDocUrlFn({
        data: {
          path: doc.file_path
        }
      });
      if (res?.url) {
        window.open(res.url, "_blank", "noopener,noreferrer");
      } else {
        toast.error(res?.error ?? "Failed to download document");
      }
    } catch (e) {
      toast.error(e?.message ?? "Failed to download document");
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-[calc(100dvh-3.5rem)] -m-4 md:-m-6 -mb-24 md:-mb-6 flex flex-col bg-slate-50 p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-48 bg-slate-200 rounded animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 bg-white border border-slate-200 rounded-xl p-4 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-white border border-slate-200 rounded-xl p-6 animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-80 bg-white border border-slate-200 rounded-xl p-6 animate-pulse hidden lg:block" })
      ] })
    ] });
  }
  if (isError || !data?.ticket) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-[calc(100dvh-3.5rem)] -m-4 md:-m-6 -mb-24 md:-mb-6 flex flex-col items-center justify-center bg-slate-50 p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-10 text-rose-500 mb-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-slate-800", children: "Unable to load ticket workspace" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-1 max-w-sm", children: "The ticket data could not be retrieved. It may have been archived or permissions may be restricted." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => refetch(), className: "px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700", children: "Retry" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
          to: "/admin/support/tickets"
        }), className: "px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50", children: "Back to Tickets" })
      ] })
    ] });
  }
  const ticket = data.ticket;
  const cust = ticket.customers ?? {};
  const app = ticket.applications ?? {};
  const isClosed = ["closed", "resolved"].includes(ticket.status);
  const serviceName = ticket.services?.service_name ?? app.services?.service_name ?? "New Udyam Certificate Registration";
  const customerEmailAddress = ticket.ticket_email ?? cust.primary_email ?? "customer@mail.com";
  Boolean(app.id);
  const slaTargetHours = ticket.priority === "urgent" ? 4 : ticket.priority === "high" ? 8 : ticket.priority === "medium" ? 24 : 48;
  const slaTargetMs = new Date(ticket.created_at).getTime() + slaTargetHours * 3600 * 1e3;
  const slaDiffMs = slaTargetMs - Date.now();
  let slaText = "";
  let slaTone = "healthy";
  if (isClosed) {
    slaText = "Resolved";
    slaTone = "healthy";
  } else if (slaDiffMs <= 0) {
    const bH = Math.floor(Math.abs(slaDiffMs) / 36e5);
    const bM = Math.floor(Math.abs(slaDiffMs) % 36e5 / 6e4);
    slaText = `Breached by ${bH}h ${bM}m`;
    slaTone = "breached";
  } else {
    const rH = Math.floor(slaDiffMs / 36e5);
    const rM = Math.floor(slaDiffMs % 36e5 / 6e4);
    slaText = `${rH}h ${rM}m remaining`;
    slaTone = rH < 4 ? "warning" : "healthy";
  }
  const staffList = (staffData?.staff ?? []).map((s) => ({
    id: s.id,
    full_name: s.name
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-[calc(100dvh-3.5rem)] -m-4 md:-m-6 -mb-24 md:-mb-6 p-3 md:p-4 bg-slate-100/70 flex gap-3 md:gap-4 overflow-hidden font-sans min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex flex-col h-full overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs shrink-0 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              window.history.back();
            } else {
              navigate({
                to: "/admin/support/tickets"
              });
            }
          }, className: "inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3.5" }),
            " Back to Tickets"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSidebarDrawerOpen(true), className: "lg:hidden inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-3.5" }),
            " Info"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => toggleStarMutation.mutate(!ticket.is_starred), disabled: toggleStarMutation.isPending, className: "p-1 rounded-md text-slate-300 hover:text-amber-500 hover:bg-slate-100 transition-colors", title: ticket.is_starred ? "Unstar ticket" : "Star ticket", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `size-5 transition-transform hover:scale-110 ${ticket.is_starred ? "fill-amber-400 text-amber-500" : "text-slate-300 hover:text-amber-400"}` }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-base sm:text-lg font-bold tracking-tight text-slate-900 font-mono shrink-0", children: ticket.ticket_number }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer", title: "Organise in folder", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "size-3.5 text-indigo-600" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ticket.folder_name ? ticket.folder_name : "Move to folder…" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 text-slate-400" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "start", className: "w-52", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider", children: "Folders" }),
                folders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-2 text-xs text-slate-400 italic", children: "No folders created yet" }) : folders.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => moveToFolderMutation.mutate(f.id), className: "text-xs cursor-pointer flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 truncate", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "size-3.5 text-indigo-600" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: f.name })
                  ] }),
                  ticket.folder_id === f.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5 text-emerald-600" })
                ] }, f.id)),
                ticket.folder_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => removeFromFolderMutation.mutate(), className: "text-xs text-rose-600 cursor-pointer", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5 mr-2" }),
                    " Remove from folder"
                  ] })
                ] })
              ] })
            ] }),
            ticket.is_new && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-[#e11d48] text-white shrink-0 shadow-2xs", children: "NEW" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => doCloseNormal.mutate(), disabled: isClosed || doCloseNormal.isPending, className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs shrink-0 cursor-pointer", children: [
              doCloseNormal.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5 text-emerald-600" }),
              "Close Ticket"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setConsultOpen(true), disabled: isClosed, className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs shrink-0 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-3.5 text-blue-600" }),
              "Consultation Completed (TB01)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setReasonOpen(true), disabled: isClosed, className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs shrink-0 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-3.5 text-rose-600" }),
              "Refund Rejected"
            ] }),
            Boolean(app.id) && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setHotOrderModalOpen(true), disabled: doMakeHotOrder.isPending, className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/80 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs shrink-0 cursor-pointer", title: "Reopen order, escalate to Hot Priority (sounds alarm), and close ticket", children: [
              doMakeHotOrder.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-3.5 text-amber-300 fill-amber-300" }),
              "Reopen & Hot 🔥"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => doSyncAttachments.mutate(), disabled: doSyncAttachments.isPending, className: "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-2xs shrink-0 cursor-pointer disabled:opacity-50", title: "Fetch any missing customer images, screenshots or attachments directly from email", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `size-3 text-slate-500 ${doSyncAttachments.isPending ? "animate-spin text-blue-600" : ""}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: doSyncAttachments.isPending ? "Syncing..." : "Sync Images" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs font-semibold text-slate-700 break-words whitespace-normal leading-relaxed", children: ticket.subject ? ticket.subject.trim().toLowerCase().startsWith("re:") ? ticket.subject : `Re: ${ticket.subject}` : "(no subject)" }),
        data?.parentTicket && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "size-3.5 text-amber-600 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Created from closed ticket",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/support/tickets/$ticketId", params: {
              ticketId: data.parentTicket.id
            }, className: "font-mono font-bold text-amber-900 underline hover:text-amber-950", children: data.parentTicket.ticket_number || data.parentTicket.id.slice(0, 8) })
          ] })
        ] }),
        data?.childTickets && data.childTickets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-900 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "size-3.5 text-blue-600 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Created follow-up ticket",
            data.childTickets.length > 1 ? "s" : "",
            ":",
            " ",
            data.childTickets.map((ct, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              idx > 0 && ", ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/support/tickets/$ticketId", params: {
                ticketId: ct.id
              }, className: "font-mono font-bold text-blue-900 underline hover:text-blue-950", children: ct.ticket_number || ct.id.slice(0, 8) })
            ] }, ct.id))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-h-0 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-col overflow-hidden relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: threadRef, onScroll: handleThreadScroll, className: "flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50/40", children: groupedMessages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20 text-slate-400 flex flex-col items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "size-10 text-slate-300" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-slate-700 text-sm", children: "No messages yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: "Use the reply composer below to send an email to the customer." })
        ] }) : groupedMessages.map((group, gIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          group.dateLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center my-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-center w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full border-t border-slate-200" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative bg-slate-100 px-4 py-0.5 rounded-full border border-slate-200/90 text-[11px] font-semibold text-slate-500 uppercase tracking-wider shadow-2xs", children: group.dateLabel })
          ] }) }),
          group.items.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCard, { msg: m, customerName: cust.name, customerEmail: ticket.ticket_email ?? cust.primary_email, onDownloadDoc: handleDownloadDoc, onReply: () => openComposer("reply") }, m.id))
        ] }, group.dateLabel || gIdx)) }),
        showScrollBottom && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: scrollToBottom, className: "absolute bottom-64 right-8 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/85 text-white text-xs font-semibold shadow-lg hover:bg-slate-900 transition-all backdrop-blur-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3.5" }),
          " Jump to latest"
        ] }),
        !isComposerOpen ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border-t border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0 shadow-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => openComposer("reply"), className: "flex-1 flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100/90 border border-slate-200 text-slate-500 text-xs font-medium cursor-pointer transition text-left select-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Reply, { className: "size-4 text-blue-600 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
              "Click here to reply to ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-slate-800 font-semibold", children: customerEmailAddress || cust?.name || "Customer" }),
              "…"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => openComposer("reply"), className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer select-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Reply, { className: "size-3.5" }),
              " Reply"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => openComposer("note"), className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition shadow-xs cursor-pointer select-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNote, { className: "size-3.5 text-amber-700" }),
              " Internal Note"
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border-t border-slate-200 shrink-0 animate-in slide-in-from-bottom-2 duration-150", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-slate-200 px-3 py-1 flex-wrap gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setComposeTab("reply"), className: `px-3 py-1.5 text-xs font-bold transition-all relative ${composeTab === "reply" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-800"}`, children: "Reply" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setComposeTab("note"), className: `px-3 py-1.5 text-xs font-bold transition-all relative ${composeTab === "note" ? "text-amber-700 border-b-2 border-amber-500" : "text-slate-500 hover:text-slate-800"}`, children: "Internal Note" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs flex-wrap", children: [
              composeTab === "reply" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 font-medium", children: "To:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: customerEmailAddress }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => toast.info(`Recipient email is bound to ticket (${customerEmailAddress})`), className: "text-slate-400 hover:text-slate-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowCc((v) => !v), className: `px-1.5 py-0.5 rounded text-xs font-semibold transition-colors ${showCc || ccInput.trim() ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:text-slate-900"}`, children: "Cc" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowBcc((v) => !v), className: `px-1.5 py-0.5 rounded text-xs font-semibold transition-colors ${showBcc || bccInput.trim() ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:text-slate-900"}`, children: "Bcc" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px bg-slate-200 mx-1 hidden sm:block" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setIsComposerOpen(false), className: "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer select-none", title: "Minimize Reply Window", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Minimize" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 px-3 py-1 bg-white border-b border-slate-200 flex-wrap text-slate-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onMouseDown: (e) => {
              e.preventDefault();
              execFmt("bold");
            }, className: "p-1 rounded hover:bg-slate-100 text-slate-700 font-bold", title: "Bold", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bold, { className: "size-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onMouseDown: (e) => {
              e.preventDefault();
              execFmt("italic");
            }, className: "p-1 rounded hover:bg-slate-100 text-slate-700 italic", title: "Italic", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Italic, { className: "size-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onMouseDown: (e) => {
              e.preventDefault();
              execFmt("underline");
            }, className: "p-1 rounded hover:bg-slate-100 text-slate-700 underline", title: "Underline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Underline, { className: "size-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onMouseDown: (e) => {
              e.preventDefault();
              execFmt("strikeThrough");
            }, className: "p-1 rounded hover:bg-slate-100 text-slate-700 line-through", title: "Strikethrough", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Strikethrough, { className: "size-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-px bg-slate-300 mx-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onMouseDown: (e) => {
              e.preventDefault();
              execFmt("insertUnorderedList");
            }, className: "p-1 rounded hover:bg-slate-100 text-slate-700", title: "Bullet list", children: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "size-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onMouseDown: (e) => {
              e.preventDefault();
              execFmt("insertOrderedList");
            }, className: "p-1 rounded hover:bg-slate-100 text-slate-700", title: "Numbered list", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListOrdered, { className: "size-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onMouseDown: (e) => {
              e.preventDefault();
              execFmt("formatBlock", "blockquote");
            }, className: "p-1 rounded hover:bg-slate-100 text-slate-700", title: "Quote", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Quote, { className: "size-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-px bg-slate-300 mx-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onMouseDown: (e) => {
              e.preventDefault();
              const url = window.prompt("Enter link URL:");
              if (url) execFmt("createLink", url);
            }, className: "p-1 rounded hover:bg-slate-100 text-slate-700", title: "Insert link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "size-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onMouseDown: (e) => {
              e.preventDefault();
              imageInputRef.current?.click();
            }, className: "p-1 rounded hover:bg-slate-100 text-slate-700", title: "Insert image", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "size-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: imageInputRef, type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 2 * 1024 * 1024) {
                toast.error("Image must be under 2MB");
                return;
              }
              const reader = new FileReader();
              reader.onload = (ev) => {
                const src = ev.target?.result;
                composerRef.current?.focus();
                document.execCommand("insertHTML", false, `<img src="${src}" style="max-width:100%;height:auto;border-radius:4px;margin:4px 0" />`);
                if (composerRef.current) setBody(composerRef.current.innerHTML);
              };
              reader.readAsDataURL(file);
              e.target.value = "";
            } })
          ] }),
          composeTab === "reply" && showCc && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-1.5 border-b border-slate-100 bg-slate-50 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-500 w-9 shrink-0", children: "Cc:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: ccInput, onChange: (e) => setCcInput(e.target.value), placeholder: "Enter CC email addresses (comma separated)...", className: "flex-1 bg-transparent border-none text-xs text-slate-800 focus:outline-none placeholder:text-slate-400", autoFocus: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
              setShowCc(false);
              setCcInput("");
            }, className: "text-slate-400 hover:text-slate-600 p-0.5", title: "Clear Cc", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" }) })
          ] }),
          composeTab === "reply" && showBcc && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-1.5 border-b border-slate-100 bg-slate-50 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-500 w-9 shrink-0", children: "Bcc:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: bccInput, onChange: (e) => setBccInput(e.target.value), placeholder: "Enter BCC email addresses (comma separated)...", className: "flex-1 bg-transparent border-none text-xs text-slate-800 focus:outline-none placeholder:text-slate-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
              setShowBcc(false);
              setBccInput("");
            }, className: "text-slate-400 hover:text-slate-600 p-0.5", title: "Clear Bcc", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: composerRef, contentEditable: true, suppressContentEditableWarning: true, onInput: () => {
              if (composerRef.current) setBody(composerRef.current.innerHTML);
            }, onKeyDown: (e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && body.trim()) {
                sendReply.mutate({});
              }
            }, "data-placeholder": composeTab === "note" ? "Add an internal note (only visible to staff members)…" : "Type your reply here…", className: `w-full min-h-[72px] max-h-48 overflow-y-auto text-xs px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 transition-all [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-slate-400 ${composeTab === "note" ? "bg-amber-50/40 border-amber-200 focus:ring-amber-400 text-amber-950" : "bg-white border-slate-200 focus:ring-blue-500 text-slate-800"}`, style: {
              lineHeight: "1.5",
              fontFamily: "inherit"
            } }),
            attachedFiles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-100", children: attachedFiles.map((att) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 shadow-2xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "size-3.5 text-slate-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium truncate max-w-[160px]", title: att.name, children: att.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-slate-400", children: [
                "(",
                formatBytes(att.size),
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeAttachment(att.id), className: "text-slate-400 hover:text-slate-700 p-0.5", title: "Remove file", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3" }) })
            ] }, att.id)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => attachmentInputRef.current?.click(), className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold shadow-2xs transition-colors cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "size-3 text-slate-500" }),
                  " Attach File"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: attachmentInputRef, type: "file", multiple: true, accept: "image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip", className: "hidden", onChange: handleAttachmentSelect }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setTemplatesModalOpen(true), className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold shadow-2xs transition-colors cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-3 text-slate-500" }),
                  " Templates"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: insertOrderDetails, className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold shadow-2xs transition-colors cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "size-3 text-slate-500" }),
                  " Insert Order Details"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setCannedModalOpen(true), className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold shadow-2xs transition-colors cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-3 text-slate-500" }),
                  " Canned Responses"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer select-none mr-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: sendCopy, onChange: (e) => setSendCopy(e.target.checked), className: "rounded border-slate-300 text-blue-600 focus:ring-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Send me a copy" })
                ] }),
                composeTab === "reply" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => sendReply.mutate({}), disabled: !body.replace(/<[^>]*>/g, "").trim() || sendReply.isPending, className: "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-emerald-500 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs shrink-0 cursor-pointer", title: "Sends reply email to customer and instantly closes ticket in CRM", children: [
                  sendReply.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5 text-white" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Send & Close Ticket" })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => sendReply.mutate({}), disabled: !body.replace(/<[^>]*>/g, "").trim() || sendReply.isPending, className: "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs shrink-0 cursor-pointer", children: [
                  sendReply.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-3.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Add Note" })
                ] })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: `w-[300px] xl:w-[320px] shrink-0 flex flex-col h-full overflow-y-auto space-y-3 pb-2 ${sidebarDrawerOpen ? "fixed inset-y-0 right-0 z-50 bg-slate-50 shadow-2xl p-4 w-[320px] max-w-full" : "hidden lg:flex"}`, children: [
      sidebarDrawerOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pb-2 border-b border-slate-200 lg:hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-800 text-xs", children: "Context Information" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSidebarDrawerOpen(false), className: "p-1 rounded hover:bg-slate-200 text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs space-y-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1 rounded-md bg-blue-50 text-blue-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-bold text-slate-900 tracking-tight", children: "Customer Information" })
          ] }),
          cust.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/customers/$customerId", params: {
            customerId: cust.id
          }, className: "text-[11px] font-semibold text-blue-600 hover:underline", children: "View Profile" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 border border-emerald-200", children: initials(cust.name) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-slate-900 text-xs truncate", children: cust.name || "Customer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-slate-500 font-mono truncate flex items-center gap-1", title: ticket.ticket_email ?? cust.primary_email, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-3 text-slate-400 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: ticket.ticket_email ?? cust.primary_email ?? "—" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 pt-1 text-xs text-slate-600 border-t border-slate-50", children: [
            cust.primary_mobile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-3 text-slate-400 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-slate-800 text-[11px]", children: cust.primary_mobile })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `tel:${cust.primary_mobile}`, className: "inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-700 font-bold text-[11px] hover:underline cursor-pointer", title: `Call ${cust.primary_mobile}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Call" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3 text-slate-400 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-700 truncate text-[11px]", children: cust.state ? `${cust.state}, India` : "Tamil Nadu, India" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1 rounded-md bg-blue-50 text-blue-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "size-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-bold text-slate-900 tracking-tight", children: "Order Information" })
          ] }),
          app?.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => doUnlinkOrder.mutate(), disabled: doUnlinkOrder.isPending, className: "text-[11px] font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer disabled:opacity-50", title: "Unlink this order from ticket", children: doUnlinkOrder.isPending ? "Unlinking…" : "Unlink" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/orders/$orderId", params: {
              orderId: app.id
            }, className: "text-[11px] font-semibold text-blue-600 hover:underline", children: "View Order" })
          ] })
        ] }),
        app?.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 py-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-[11px]", children: "Order No." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/orders/$orderId", params: {
                orderId: app.id
              }, className: "font-mono font-bold text-blue-700 hover:underline text-[11px]", children: app.application_code || "—" }),
              app.application_code && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                navigator.clipboard.writeText(app.application_code);
                toast.success("Order number copied");
              }, className: "text-slate-400 hover:text-slate-700 p-0.5", title: "Copy order number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-2.5" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 py-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-[11px]", children: "Service" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-800 text-right truncate max-w-[170px] text-[11px]", children: serviceName || "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 py-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-[11px]", children: "Order Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-700 text-right text-[11px]", children: ist(app.created_at || ticket.created_at) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 py-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-[11px]", children: "Order Stage" }),
            (() => {
              const lead = app.leads ?? (ticket.customers ? {
                name: ticket.customers.name,
                email: ticket.customers.primary_email,
                mobile: ticket.customers.primary_mobile
              } : null);
              const orderStage = computeOrderStage(lead, app);
              const stageMeta = STAGE_META[orderStage];
              const stageBadgeClass = STAGE_BADGE_CLASS[orderStage] || "bg-slate-100 text-slate-700 border-slate-200";
              return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${stageBadgeClass}`, children: stageMeta?.label || app.order_status || "Processing" });
            })()
          ] }),
          (() => {
            const lead = app.leads ?? (ticket.customers ? {
              name: ticket.customers.name,
              email: ticket.customers.primary_email,
              mobile: ticket.customers.primary_mobile
            } : null);
            const orderStage = computeOrderStage(lead, app);
            const stageDate = getOrderStageTimestamp(orderStage, app, data?.events, ticket);
            if (!stageDate?.timestamp) return null;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 py-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-[11px]", children: stageDate.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-700 text-right text-[11px] font-medium", children: ist(stageDate.timestamp) })
            ] });
          })(),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 py-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-[11px]", children: "Order Assignee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-2.5 text-slate-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ticket.executive_name || "Unassigned" })
            ] })
          ] }),
          Boolean(app.is_hot) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-lg bg-rose-50 border border-rose-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-rose-700 text-[11px] font-bold flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-3.5 text-rose-600 fill-rose-600 animate-pulse shrink-0" }),
              "🔥 Hot Priority Active"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-rose-600 bg-rose-100/80 px-1.5 py-0.5 rounded uppercase tracking-wider", children: "Needs Action" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setHotOrderModalOpen(true), className: "w-full mt-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-semibold transition-all cursor-pointer shadow-2xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-3 text-rose-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Escalate to Hot Order 🔥" })
          ] })
        ] }) : ticket.order_link_status === "needs_review" && (data?.candidateOrders ?? []).length > 0 ? (
          /* ── Multi-Order Review: employee picks which order to link ── */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-amber-50 border border-amber-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-3.5 text-amber-600 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-amber-800 font-semibold", children: "Multiple active orders found. Select which order this ticket belongs to:" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: data.candidateOrders.map((candidate) => {
              const candStage = computeOrderStage(candidate.lead, candidate);
              const candMeta = STAGE_META[candStage];
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => doLinkOrder.mutate(candidate.id), disabled: doLinkOrder.isPending, className: "w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-left transition-all cursor-pointer disabled:opacity-50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono font-bold text-blue-700 text-[11px]", children: candidate.application_code || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-500 mt-0.5 truncate", children: [
                    candMeta?.label || candidate.order_status || "Processing",
                    " · ",
                    ist(candidate.created_at)
                  ] })
                ] }),
                doLinkOrder.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin text-blue-600 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "size-3.5 text-slate-400 shrink-0" })
              ] }, candidate.id);
            }) })
          ] })
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-3 px-2 text-center space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-slate-600", children: "No order found for this ticket" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400", children: "No connected order is linked to this ticket." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1 rounded-md bg-blue-50 text-blue-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-bold text-slate-900 tracking-tight", children: "Ticket Information" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer", children: "Edit" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 py-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-[11px]", children: "Created" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-700 text-[11px]", children: ist(ticket.created_at) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 py-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-[11px]", children: "Channel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-2.5 text-slate-400" }),
              " ",
              ticket.source || "Email"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 py-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-[11px]", children: "Priority" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PriorityDropdownBadge, { priority: ticket.priority ?? "medium", onChange: (p) => changePriority.mutate(p) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 py-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-[11px]", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusDropdownBadge, { status: ticket.status, onChange: (s) => changeStatus.mutate(s) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 py-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-[11px]", children: "Assigned To" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AssigneeDropdownBadge, { currentId: ticket.assigned_to, currentName: ticket.assigned_name, staff: staffList, onPick: (id) => changeAssignee.mutate(id) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 py-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-[11px]", children: "SLA" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${slaTone === "healthy" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : slaTone === "warning" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-rose-50 text-rose-800 border-rose-200"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `size-1.5 rounded-full ${slaTone === "healthy" ? "bg-emerald-500" : slaTone === "warning" ? "bg-amber-500" : "bg-rose-500"}` }),
              slaText
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-bold text-slate-900 tracking-tight", children: "Recent Activity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-blue-700 hover:underline cursor-pointer", children: "View All" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-2.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900 text-[11px] leading-tight", children: "Customer email received" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-400 mt-0.5", children: ticket.first_response_at ? ist(ticket.first_response_at) : ist(ticket.created_at) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-2.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900 text-[11px] leading-tight", children: "Email sent to customer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-400 mt-0.5", children: ticket.last_staff_message_at ? ist(ticket.last_staff_message_at) : ist(ticket.created_at) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-5 rounded-full bg-slate-400 text-white flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-2.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900 text-[11px] leading-tight", children: "Ticket created" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-400 mt-0.5", children: ist(ticket.created_at) })
            ] })
          ] })
        ] })
      ] })
    ] }),
    restartConfirm && /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmDialog, { title: "Restart Order?", body: "This will close the ticket and return the order to Form Submitted stage. Any pending customer-delay closure timer will be cancelled.", confirmLabel: "Restart Order", confirmTone: "emerald", onConfirm: () => {
      setRestartConfirm(false);
      doCloseRestart.mutate();
    }, onClose: () => setRestartConfirm(false) }),
    reopenConfirm && /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmDialog, { title: "Reopen Order?", body: "This will reopen the closed order and resume operational processing for the customer.", confirmLabel: "Reopen Order", confirmTone: "emerald", onConfirm: () => {
      setReopenConfirm(false);
      if (app.id) doReopenOrder.mutate(app.id);
    }, onClose: () => setReopenConfirm(false) }),
    consultOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(ConsultDialog, { value: consultNote, onChange: setConsultNote, onCancel: () => {
      setConsultOpen(false);
      setConsultNote("");
    }, onSend: () => {
      setConsultOpen(false);
      doCloseConsult.mutate(consultNote);
      setConsultNote("");
    } }),
    reasonOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(RefundRejectDialog, { onCancel: () => setReasonOpen(false), onSend: (v) => {
      setReasonOpen(false);
      doCloseRefund.mutate(v);
    }, isPending: doCloseRefund.isPending }),
    cannedModalOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(CannedResponsesModal, { items: cannedList ?? [], onClose: () => setCannedModalOpen(false), onSelect: (item) => {
      const filled = (item.body ?? "").replace(/\{\{customer_name\}\}/gi, cust.name ?? "[Customer]").replace(/\{\{order_number\}\}/gi, app.application_code ?? "[Order No]").replace(/\{\{ticket_number\}\}/gi, ticket.ticket_number ?? "");
      const formatted = filled.split(/\n{2,}/).map((p) => `<p style="margin: 0 0 8px 0;">${escapeHtml(p).replace(/\n/g, "<br />")}</p>`).join("");
      if (composerRef.current) {
        const currentContent = composerRef.current.innerHTML.trim();
        if (!currentContent || currentContent === "<br>" || currentContent === "<p><br></p>") {
          composerRef.current.innerHTML = formatted;
        } else {
          composerRef.current.innerHTML = `${currentContent}<br /><br />${formatted}`;
        }
        setBody(composerRef.current.innerHTML);
        composerRef.current.focus();
      } else {
        setBody((prev) => prev.trim() ? `${prev}

${filled}` : filled);
      }
      setCannedModalOpen(false);
      toast.success(`Inserted canned response: ${item.title}`);
    } }),
    templatesModalOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(TemplatesModal, { items: templatesList ?? [], onClose: () => setTemplatesModalOpen(false), onSelect: (item) => {
      const rawBody = item.body_html || item.body_text || "";
      const isHtml = /<[a-z][\s\S]*>/i.test(rawBody);
      const filled = rawBody.replace(/\{\{customer_name\}\}/gi, cust.name ?? "[Customer]").replace(/\{\{order_number\}\}/gi, app.application_code ?? "[Order No]").replace(/\{\{ticket_number\}\}/gi, ticket.ticket_number ?? "");
      let formatted = filled;
      if (!isHtml) {
        formatted = filled.split(/\n{2,}/).map((p) => `<p style="margin: 0 0 8px 0;">${escapeHtml(p).replace(/\n/g, "<br />")}</p>`).join("");
      }
      if (composerRef.current) {
        const currentContent = composerRef.current.innerHTML.trim();
        if (!currentContent || currentContent === "<br>" || currentContent === "<p><br></p>") {
          composerRef.current.innerHTML = formatted;
        } else {
          composerRef.current.innerHTML = `${currentContent}<br /><br />${formatted}`;
        }
        setBody(composerRef.current.innerHTML);
        composerRef.current.focus();
      } else {
        setBody((prev) => prev.trim() ? `${prev}

${filled}` : filled);
      }
      setTemplatesModalOpen(false);
      toast.success(`Inserted template: ${item.template_name || item.template_code}`);
    } }),
    hotOrderModalOpen && Boolean(app.id) && /* @__PURE__ */ jsxRuntimeExports.jsx(HotOrderModal, { order: {
      id: app.id,
      application_code: app.application_code,
      service_name: serviceName
    }, customerName: cust.name, assigneeName: ticket.executive_name || "Unassigned", ticketNumber: ticket.ticket_number ?? void 0, isPending: doMakeHotOrder.isPending, onClose: () => setHotOrderModalOpen(false), onConfirm: (note) => {
      doMakeHotOrder.mutate({
        orderId: app.id,
        note
      });
    } })
  ] });
}
function MessageCard({
  msg,
  customerName,
  customerEmail,
  onDownloadDoc,
  onReply
}) {
  const [showRawText, setShowRawText] = reactExports.useState(false);
  const [lightboxImage, setLightboxImage] = reactExports.useState(null);
  const [isExpanded, setIsExpanded] = reactExports.useState(false);
  const parsed = reactExports.useMemo(() => parseEmailMessage({
    bodyHtml: msg.body_html,
    bodyText: msg.body_text,
    attachments: msg.attachments
  }), [msg.body_html, msg.body_text, msg.attachments]);
  if (msg.kind === "note") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-[90%] sm:max-w-[85%] rounded-xl p-4 shadow-2xs border border-amber-200/90 bg-amber-50/70 border-l-4 border-l-amber-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-amber-950 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-5 rounded-full bg-amber-200 text-amber-950 text-[10px] flex items-center justify-center font-bold", children: "👁" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: msg.author_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold bg-amber-200/90 text-amber-950 px-2 py-0.5 rounded-full uppercase tracking-wider", children: "Internal Note" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-800/80 text-[11px] font-medium", children: formatTimeOnly(msg.created_at) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-amber-950 whitespace-pre-wrap leading-relaxed", children: msg.body_text })
    ] }) });
  }
  if (msg.kind === "inbound") {
    const rawContent = msg.body_text || parsed.rawText || msg.body_html || "";
    const hasLongBody = parsed.content && parsed.content.length > 300 || parsed.hasQuoted || Boolean(parsed.quotedContent) || Boolean(msg.body_html);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex justify-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-[92%] sm:max-w-[88%] lg:max-w-[84%] mr-auto bg-white rounded-xl shadow-2xs border border-slate-200/90 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 flex items-center justify-between flex-wrap gap-1.5 border-b border-slate-100/80 bg-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-7 rounded-full bg-[#10b981] text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs", children: initials(customerName || "RK") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-900 text-xs truncate", children: customerName || "Customer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 text-xs font-mono truncate", children: customerEmail || msg.from_email || "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase bg-[#ecfdf5] text-[#059669] border border-emerald-200 px-1.5 py-0.5 rounded", children: "Customer" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 text-xs font-medium", title: ist(msg.created_at), children: formatTimeOnly(msg.created_at) }),
            onReply && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: onReply, className: "inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-md transition-colors cursor-pointer shadow-2xs select-none", title: "Reply to this message", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Reply, { className: "size-3 text-blue-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Reply" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-slate-400 hover:text-slate-600 p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "size-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3.5 py-3 space-y-2", children: [
          msg.subject && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-slate-800 pb-1", children: decodeHtmlEntities(msg.subject) }),
          showRawText ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed", children: rawContent }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-sm text-slate-800 leading-relaxed font-normal overflow-x-auto [&_table]:w-full [&_table]:border-collapse [&_td]:p-2 [&_th]:p-2 [&_img]:max-w-full [&_a]:text-blue-600 [&_a]:underline font-sans ${hasLongBody && !isExpanded ? "max-h-56 overflow-hidden" : ""}`, children: parsed.isHtml ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { dangerouslySetInnerHTML: {
                  __html: purify_default.sanitize(parsed.content, {
                    WHOLE_DOCUMENT: false,
                    ADD_ATTR: ["target", "style", "class"]
                  })
                } }),
                isExpanded && parsed.quotedContent && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 pt-3 border-t border-slate-200 text-slate-600", dangerouslySetInnerHTML: {
                  __html: purify_default.sanitize(parsed.quotedContent, {
                    WHOLE_DOCUMENT: false,
                    ADD_ATTR: ["target", "style", "class"]
                  })
                } })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "whitespace-pre-wrap", children: isExpanded && parsed.quotedContent ? `${parsed.content}

${parsed.quotedContent}` : parsed.content || rawContent || "(no content)" }) }),
              hasLongBody && !isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white/85 to-transparent pointer-events-none" })
            ] }),
            hasLongBody && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 flex items-center justify-between border-t border-slate-100 mt-2 z-10 relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setIsExpanded((v) => !v), className: "text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-lg px-3.5 py-1.5 transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer select-none", children: isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                "Show less ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "size-3.5" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                "Show full email ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3.5" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowRawText((v) => !v), className: "text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors ml-auto cursor-pointer select-none", title: "Toggle raw original email text", children: showRawText ? "Show Formatted" : "Raw Text" })
            ] })
          ] }),
          msg.attachments && msg.attachments.length > 0 && (() => {
            const imageAttachments = msg.attachments.filter((a) => a.isImage || a.mimeType?.startsWith("image/") || a.mime_type?.startsWith("image/") || /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(a.fileName || a.file_name || ""));
            const nonImageAttachments = msg.attachments.filter((a) => !imageAttachments.includes(a));
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2.5 space-y-3", children: [
              imageAttachments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "size-3.5 text-blue-600 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Customer Images & Screenshots (",
                    imageAttachments.length,
                    ")"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5", children: imageAttachments.map((img, idx) => {
                  const imgUrl = img.url;
                  const imgName = img.fileName || img.file_name || `image_${idx + 1}.png`;
                  const imgSize = img.fileSize || img.file_size || img.size_bytes || 0;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative rounded-xl border border-slate-200/90 bg-slate-50 overflow-hidden shadow-2xs hover:shadow-xs transition-all", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video max-h-56 bg-slate-100 flex items-center justify-center overflow-hidden cursor-pointer", onClick: () => imgUrl && setLightboxImage({
                      url: imgUrl,
                      name: imgName
                    }), children: [
                      imgUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgUrl, alt: imgName, className: "w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-200", loading: "lazy" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1 text-slate-400 p-4", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "size-8" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Image loading..." })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-slate-900 font-semibold text-xs shadow-md", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "size-3.5" }),
                        " Enlarge"
                      ] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 bg-white border-t border-slate-100 flex items-center justify-between gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-slate-800 truncate", title: imgName, children: imgName }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-400", children: imgSize ? formatBytes(imgSize) : "Image file" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 shrink-0", children: imgUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setLightboxImage({
                          url: imgUrl,
                          name: imgName
                        }), className: "p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors", title: "View full image", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-3.5" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: imgUrl, download: imgName, target: "_blank", rel: "noopener noreferrer", className: "p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors", title: "Download image", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5" }) })
                      ] }) })
                    ] })
                  ] }, img.id || idx);
                }) })
              ] }),
              nonImageAttachments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: nonImageAttachments.map((doc) => {
                const docName = doc.fileName || doc.file_name || "document.pdf";
                const docSize = doc.fileSize || doc.file_size || doc.size_bytes || 0;
                const docUrl = doc.url;
                const isPdf = /\.pdf$/i.test(docName);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-3 min-w-[220px] max-w-sm transition-colors shadow-2xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-7 rounded border flex items-center justify-center shrink-0 font-bold text-[10px] ${isPdf ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-blue-50 border-blue-200 text-blue-600"}`, children: isPdf ? "PDF" : "DOC" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-slate-800 truncate", title: docName, children: docName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-400", children: formatBytes(docSize) })
                    ] })
                  ] }),
                  docUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: docUrl, download: docName, target: "_blank", rel: "noopener noreferrer", className: "p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0", title: "Download attachment", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onDownloadDoc(doc), className: "p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0", title: "Download attachment", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5" }) })
                ] }, doc.id);
              }) })
            ] });
          })()
        ] })
      ] }),
      lightboxImage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4", onClick: () => setLightboxImage(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-5xl max-h-[92vh] w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-slate-700", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold truncate pr-4 text-slate-200", children: lightboxImage.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: lightboxImage.url, download: lightboxImage.name, target: "_blank", rel: "noopener noreferrer", className: "px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3" }),
              " Download"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setLightboxImage(null), className: "p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 flex items-center justify-center overflow-auto max-h-[calc(92vh-60px)] bg-slate-950/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: lightboxImage.url, alt: lightboxImage.name, className: "max-w-full max-h-[82vh] object-contain rounded-lg shadow-lg" }) })
      ] }) })
    ] });
  }
  parsed.isHtml || Boolean(msg.body_html);
  const isLongHtml = Boolean(parsed.content && parsed.content.length > 300 || parsed.hasQuoted || parsed.quotedContent || msg.body_html && msg.body_html.length > 300);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-[92%] sm:max-w-[88%] lg:max-w-[84%] ml-auto bg-[#f8fafc] rounded-xl shadow-2xs border border-slate-200/90 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 flex items-center justify-between flex-wrap gap-1.5 border-b border-slate-200/70 bg-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-7 rounded-full bg-[#3b82f6] text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs", children: "BH" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-900 text-xs truncate", children: msg.author_name || "Business Help Services" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase bg-[#eff6ff] text-[#2563eb] border border-blue-200 px-1.5 py-0.2 rounded", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold uppercase bg-[#ecfdf5] text-[#059669] border border-emerald-200 px-1.5 py-0.2 rounded flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-2.5" }),
              " Sent"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400 font-mono truncate", children: msg.from_email || "help@businesshelpservices.com" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 text-xs font-medium", title: ist(msg.created_at), children: formatTimeOnly(msg.created_at) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-slate-400 hover:text-slate-600 p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "size-4" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3.5 py-3 space-y-2", children: [
      msg.subject && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-slate-800 pb-1", children: decodeHtmlEntities(msg.subject) }),
      parsed.isHtml ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-sm text-slate-800 leading-relaxed font-normal overflow-x-auto [&_table]:w-full [&_table]:border-collapse [&_td]:p-2 [&_th]:p-2 [&_img]:max-w-full [&_a]:text-blue-600 [&_a]:underline font-sans ${isLongHtml && !isExpanded ? "max-h-56 overflow-hidden" : ""}`, dangerouslySetInnerHTML: {
            __html: purify_default.sanitize(isExpanded && parsed.quotedContent ? `${parsed.content}<div class="mt-3 pt-3 border-t border-slate-200">${parsed.quotedContent}</div>` : parsed.content, {
              WHOLE_DOCUMENT: false,
              ADD_ATTR: ["target", "style", "class"]
            })
          } }),
          isLongHtml && !isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white/85 to-transparent pointer-events-none" })
        ] }),
        isLongHtml && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 flex justify-start border-t border-slate-100 mt-2 z-10 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setIsExpanded((v) => !v), className: "text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-lg px-3.5 py-1.5 transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer select-none", children: isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Show less ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "size-3.5" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Show full email ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3.5" })
        ] }) }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-normal", children: parsed.content || /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "Dear ",
          customerName || "Customer",
          ","
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Thank you for reaching out. We have received your request regarding the Udyam certificate. Our team is already checking the status and we will get back to you shortly." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "If you have any additional details, please share." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "Regards,",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Business Help Services"
        ] })
      ] }) }),
      msg.attachments && msg.attachments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2.5 flex flex-wrap gap-2 border-t border-slate-100 mt-2", children: msg.attachments.map((doc, idx) => {
        const docName = doc.fileName || doc.file_name || "attachment";
        const docSize = doc.fileSize || doc.file_size || doc.size_bytes || 0;
        const isPdf = /\.pdf$/i.test(docName);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-3 min-w-[220px] max-w-sm shadow-2xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-7 rounded border flex items-center justify-center shrink-0 font-bold text-[10px] ${isPdf ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-blue-50 border-blue-200 text-blue-600"}`, children: isPdf ? "PDF" : "FILE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-slate-800 truncate", title: docName, children: docName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-400", children: formatBytes(docSize) })
            ] })
          ] }),
          doc.url ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: doc.url, download: docName, target: "_blank", rel: "noopener noreferrer", className: "p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 shrink-0", title: "Download attachment", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onDownloadDoc(doc), className: "p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 shrink-0", title: "Download attachment", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5" }) })
        ] }, doc.id || idx);
      }) })
    ] })
  ] }) });
}
function StatusDropdownBadge({
  status,
  onChange
}) {
  const [open, setOpen] = reactExports.useState(false);
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.open;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen((v) => !v), className: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-colors ${cfg.bg} ${cfg.fg} ${cfg.border}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "★" }),
      " ",
      cfg.label,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 ml-0.5 opacity-70" })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-30 text-xs py-1 min-w-[130px]", onMouseLeave: () => setOpen(false), children: Object.keys(STATUS_CONFIG).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
      setOpen(false);
      onChange(s);
    }, className: "w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium", children: STATUS_CONFIG[s].label }, s)) })
  ] });
}
function PriorityDropdownBadge({
  priority,
  onChange
}) {
  const [open, setOpen] = reactExports.useState(false);
  const cfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.medium;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen((v) => !v), className: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-colors ${cfg.bg} ${cfg.fg} ${cfg.border}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `size-1.5 rounded-full ${cfg.dot}` }),
      " ",
      cfg.label,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 ml-0.5 opacity-70" })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-30 text-xs py-1 min-w-[120px]", onMouseLeave: () => setOpen(false), children: Object.keys(PRIORITY_CONFIG).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
      setOpen(false);
      onChange(p);
    }, className: "w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `size-1.5 rounded-full ${PRIORITY_CONFIG[p].dot}` }),
      PRIORITY_CONFIG[p].label
    ] }, p)) })
  ] });
}
function AssigneeDropdownBadge({
  currentId,
  currentName,
  staff,
  onPick
}) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen((v) => !v), className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-3 text-slate-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: currentName || "Unassigned" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 ml-0.5 opacity-70" })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-30 text-xs py-1 max-h-56 overflow-y-auto", onMouseLeave: () => setOpen(false), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        setOpen(false);
        onPick(null);
      }, className: "w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-500 font-medium", children: "Unassigned" }),
      staff.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        setOpen(false);
        onPick(s.id);
      }, className: "w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium truncate", children: s.full_name || "Staff Member" }, s.id))
    ] })
  ] });
}
function CannedResponsesModal({
  items,
  onClose,
  onSelect
}) {
  const [search, setSearch] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("all");
  const categories = reactExports.useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    items.forEach((it) => {
      if (it.category) set.add(it.category);
    });
    return ["all", ...Array.from(set)];
  }, [items]);
  const filtered = reactExports.useMemo(() => {
    return items.filter((it) => {
      const matchCat = category === "all" || it.category === category;
      const q = search.toLowerCase();
      const matchSearch = !search || it.title?.toLowerCase().includes(q) || it.body?.toLowerCase().includes(q) || it.shortcut?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [items, search, category]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-2xl w-full max-w-xl p-5 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-100", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-slate-200 pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4 text-blue-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-slate-900", children: "Canned Responses" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1 rounded-md text-slate-400 hover:text-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 pb-2 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 text-slate-400 absolute left-3 top-2.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search canned responses...", className: "w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500", autoFocus: true })
      ] }),
      categories.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 overflow-x-auto pb-1 text-xs", children: categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCategory(cat), className: `px-2.5 py-1 rounded-full capitalize font-semibold shrink-0 text-[11px] transition-colors ${category === cat ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`, children: cat }, cat)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto space-y-2 py-2 pr-1", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-10 text-xs text-slate-400", children: "No canned responses found." }) : filtered.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => onSelect(item), className: "p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer transition-all space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-900 text-xs", children: item.title }),
        item.category && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize", children: item.category })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 line-clamp-2 leading-relaxed", children: item.body })
    ] }, item.id)) })
  ] }) });
}
function TemplatesModal({
  items,
  onClose,
  onSelect
}) {
  const [search, setSearch] = reactExports.useState("");
  const filtered = reactExports.useMemo(() => {
    return items.filter((it) => {
      const q = search.toLowerCase();
      return !search || it.template_code?.toLowerCase().includes(q) || it.template_name?.toLowerCase().includes(q) || it.subject?.toLowerCase().includes(q);
    });
  }, [items, search]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-2xl w-full max-w-xl p-5 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-100", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-slate-200 pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 text-blue-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-slate-900", children: "Email Templates" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1 rounded-md text-slate-400 hover:text-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-3 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 text-slate-400 absolute left-3 top-2.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search email templates by code, name, subject...", className: "w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500", autoFocus: true })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto space-y-2 py-2 pr-1", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-10 text-xs text-slate-400", children: "No email templates found." }) : filtered.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => onSelect(item), className: "p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer transition-all space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-slate-900 text-xs", children: [
          item.template_code,
          " — ",
          item.template_name || item.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded", children: item.dispatch_mode || "Automated" })
      ] }),
      item.subject && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-semibold text-slate-700", children: [
        "Subject: ",
        item.subject
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 line-clamp-2 leading-relaxed", children: item.body_text || stripHtml(item.body_html || "") })
    ] }, item.id)) })
  ] }) });
}
function stripHtml(html) {
  return html.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function ConfirmDialog({
  title,
  body,
  confirmLabel,
  confirmTone,
  onConfirm,
  onClose
}) {
  const tone = confirmTone === "emerald" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-xl w-full max-w-md p-5 animate-in zoom-in-95 duration-100", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-slate-900", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-slate-600 leading-relaxed", children: body }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100", children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onConfirm, className: `px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white ${tone}`, children: confirmLabel })
    ] })
  ] }) });
}
function ConsultDialog({
  value,
  onChange,
  onCancel,
  onSend
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs", onClick: onCancel, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-xl w-full max-w-md p-5 animate-in zoom-in-95 duration-100", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-slate-900", children: "Consultation Completed (TB01)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-slate-600 leading-relaxed", children: "Sends the T001 consultation-completed confirmation email to the customer and closes the ticket." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mt-3 text-xs font-semibold text-slate-700", children: "Remarks (optional)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value, onChange: (e) => onChange(e.target.value), rows: 4, placeholder: "Anything to include in the email or audit record…", className: "mt-1 w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onCancel, className: "px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100", children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onSend, className: "px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700", children: "Send & Close Ticket" })
    ] })
  ] }) });
}
function RefundRejectDialog({
  onCancel,
  onSend,
  isPending
}) {
  const [reasonLabel, setReasonLabel] = reactExports.useState("Refund Request Reviewed & Closed");
  const [reply, setReply] = reactExports.useState("Dear Customer,\n\nWe have thoroughly reviewed your refund request. As per our service terms and policy, this service has already been initiated/processed, and therefore your refund request cannot be approved at this stage.\n\nIf you have any further questions, please reply to this message.\n\nRegards,\nSupport Team");
  const presetReasons = ["Service already initiated / processed with government portal", "Application under active verification / processing", "Customer requested cancellation post document submission", "Non-refundable government statutory fee already incurred"];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs", onClick: onCancel, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-2xl w-full max-w-lg p-5 animate-in zoom-in-95 duration-100 flex flex-col max-h-[90vh]", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-rose-100 text-rose-600 shadow-2xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4 text-rose-600" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-slate-900", children: "Refund Rejected (R002)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500", children: "Sends official R002 refund rejection email to the customer and closes this ticket under Refund KPI" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onCancel, className: "p-1 rounded-md text-slate-400 hover:text-slate-700 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-3.5 space-y-3.5 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-bold text-slate-800 text-xs", children: "Rejection / Review Reason" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: reasonLabel, onChange: (e) => setReasonLabel(e.target.value), className: "w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500", placeholder: "e.g. Service already initiated / processed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 pt-1", children: presetReasons.map((preset, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setReasonLabel(preset), className: "text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 text-slate-600 transition-all text-left cursor-pointer", children: preset }, idx)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "font-bold text-slate-800 text-xs flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Customer Email Message (Standard R002)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-slate-400 font-normal", children: [
            reply.length,
            " chars"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: reply, onChange: (e) => setReply(e.target.value), rows: 6, className: "w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-sans leading-relaxed resize-none" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 border-t border-slate-100 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onCancel, disabled: isPending, className: "px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50", children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onSend({
        reasonLabel: reasonLabel.trim(),
        replyBody: reply.trim()
      }), disabled: isPending || !reply.trim(), className: "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer", children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sending & Closing..." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-3.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Send R002 & Close Ticket" })
      ] }) })
    ] })
  ] }) });
}
function HotOrderModal({
  order,
  customerName,
  assigneeName,
  ticketNumber,
  isPending,
  onClose,
  onConfirm
}) {
  const [note, setNote] = reactExports.useState("");
  const presetReasons = ["Urgent: Customer called requesting immediate filing / status update", "Customer submitted requested OTP / documents — please verify & file", "Customer requested correction / rework on certificate", "VIP / High priority escalation — please process on priority"];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-2xl w-full max-w-lg p-5 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-100", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-rose-100 text-rose-600 shadow-2xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-4 text-rose-600 fill-rose-600 animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-slate-900", children: "Reopen Order & Escalate to Hot 🔥" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500", children: "Reopens the linked order, prioritizes it in Hot Orders with sound alerts, and closes this ticket" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1 rounded-md text-slate-400 hover:text-slate-700 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-3.5 space-y-3.5 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-slate-50/80 border border-slate-200/90 p-3 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-[11px]", children: "Order No:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-slate-900", children: order.application_code || "—" })
        ] }),
        order.service_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-[11px]", children: "Service:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-800 text-right truncate max-w-[220px]", children: order.service_name })
        ] }),
        customerName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-[11px]", children: "Customer:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-800", children: customerName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-[11px]", children: "Assigned Employee:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[10px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-3 text-blue-500" }),
            assigneeName || "Unassigned"
          ] })
        ] }),
        ticketNumber && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-[11px]", children: "Source Ticket:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-slate-700", children: [
            "#",
            ticketNumber
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "font-bold text-slate-800 flex items-center justify-between text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Share Note / Instructions with Employee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-normal text-slate-400", children: [
            note.length,
            "/1000"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-slate-500 leading-snug", children: [
          "This note will be notified to ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: assigneeName || "the assigned staff" }),
          " and attached to the Hot Order alert & activity history."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: note, onChange: (e) => setNote(e.target.value.slice(0, 1e3)), placeholder: "e.g., Customer called requesting urgent verification. Please process right away.", rows: 3, className: "w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all resize-none leading-relaxed", autoFocus: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-slate-400 uppercase tracking-wider", children: "Quick Suggestions:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: presetReasons.map((preset, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setNote(preset), className: "text-[10px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-slate-600 transition-all text-left cursor-pointer", children: preset }, idx)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 border-t border-slate-100 flex items-center justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onClose, disabled: isPending, className: "px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50", children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onConfirm(note.trim()), disabled: isPending, className: "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer", children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Escalating..." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-3.5 fill-current" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Confirm & Reopen Order Hot 🔥" })
      ] }) })
    ] })
  ] }) });
}
export {
  TicketWorkspace as component
};
