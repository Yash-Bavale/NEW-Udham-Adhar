function extractEmailAddress(raw) {
  if (!raw) return null;
  const str = String(raw).trim();
  if (!str) return null;
  const angleMatch = str.match(/<([^>]+)>/);
  const target = angleMatch ? angleMatch[1] : str;
  const cleaned = target.replace(/["']/g, "").trim().toLowerCase();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
    return cleaned;
  }
  return cleaned || null;
}
function extractDisplayName(raw) {
  if (!raw) return null;
  const str = String(raw).trim();
  const angleIdx = str.indexOf("<");
  if (angleIdx > 0) {
    const name = str.slice(0, angleIdx).replace(/^["'\s]+|["'\s]+$/g, "").trim();
    return name || null;
  }
  return null;
}
function parseSender(fromHeader, replyToHeader) {
  const rawFrom = String(fromHeader || "").trim();
  const rawReplyTo = replyToHeader ? String(replyToHeader).trim() : null;
  const fromEmail = extractEmailAddress(rawFrom);
  const fromName = extractDisplayName(rawFrom);
  const replyToEmail = extractEmailAddress(rawReplyTo);
  let effectiveEmail = fromEmail;
  if (replyToEmail && !isKnownSystemSender(replyToEmail)) {
    effectiveEmail = replyToEmail;
  }
  const isSystem = isKnownSystemSender(fromEmail);
  return {
    rawFrom,
    rawReplyTo,
    fromEmail,
    fromName,
    replyToEmail,
    effectiveEmail,
    isSystemSender: isSystem
  };
}
function isKnownSystemSender(email) {
  if (!email) return false;
  const lower = email.trim().toLowerCase();
  return /(^|[.@])(noreply|no-reply|mailer-daemon|postmaster|welcome|notifications?|mailer|bounce|donotreply)@/i.test(lower) || lower.endsWith("@zohoaccounts.in") || lower.endsWith("@zoho.in") || lower.endsWith("@zoho.com") || lower.endsWith("@zeptomail.in") || lower.endsWith("@zeptomail.com") || lower.endsWith("@businesshelpservices.com") || lower.endsWith("@udyamadhar.in");
}
function normalizeMessageId$1(id) {
  if (!id) return null;
  const str = String(id).trim();
  if (!str) return null;
  const m = str.match(/<([^>]+)>/);
  const unwrapped = m ? m[1].trim() : str.replace(/^<|>$/g, "").trim();
  return unwrapped || null;
}
function normalizeReferences(refs) {
  if (!refs) return [];
  return String(refs).split(/\s+/).map(normalizeMessageId$1).filter(Boolean);
}
function normalizeSubject(subject) {
  if (!subject) return "";
  return decodeEntities(String(subject)).replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\s+/g, " ").trim();
}
function decodeEntities(input) {
  if (!input) return "";
  return String(input).replace(/&#x([0-9a-fA-F]+);/g, (_, h) => {
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
function stripHtmlToPlainText(html) {
  if (!html) return "";
  const withBreaks = String(html).replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n\n").replace(/<\/tr>/gi, "\n").replace(/<\/div>/gi, "\n").replace(/<\/li>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/\r\n/g, "\n").replace(/\n\s+\n/g, "\n\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  return decodeEntities(withBreaks);
}
function extractTicketNumber(subject) {
  if (!subject) return null;
  const norm = normalizeSubject(subject);
  const bracketMatch = norm.match(/\[#\s*(TKT-\d{8}-\d{3,6})\s*\]/i);
  if (bracketMatch) return bracketMatch[1].toUpperCase();
  const bareMatch = norm.match(/\b(TKT-\d{8}-\d{3,6})\b/i);
  if (bareMatch) return bareMatch[1].toUpperCase();
  return null;
}
function extractOrderCodes(subject, bodySnippet) {
  const text = `${subject || ""} ${bodySnippet || ""}`;
  const apMatch = text.match(/\bAP[-\s_/.]?(\d{4})[-\s_/.]?(\d{6})\b/i);
  const uaMatch = text.match(/\bUA[-\s_/.]?(\d{4})[-\s_/.]?(\d{6})\b/i);
  return {
    applicationCode: apMatch ? `AP-${apMatch[1]}-${apMatch[2]}` : null,
    leadCode: uaMatch ? `UA-${uaMatch[1]}-${uaMatch[2]}` : null
  };
}
const DC = (process.env.ZOHO_MAIL_DC || "in").trim();
const ACCOUNTS_HOST = `https://accounts.zoho.${DC}`;
const MAIL_HOST = `https://mail.zoho.${DC}`;
let tokenCache = null;
let accountIdCache = null;
function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Zoho inbox: missing env ${name}`);
  return v.trim();
}
async function resolveAccountId(forceRefresh = false) {
  if (accountIdCache && !forceRefresh) return accountIdCache;
  const raw = (process.env.ZOHO_MAIL_ACCOUNT_ID || "").trim();
  if (raw && /^\d+$/.test(raw) && !forceRefresh) {
    accountIdCache = raw;
    return raw;
  }
  const token = await getZohoAccessToken();
  const res = await fetch(`${MAIL_HOST}/api/accounts`, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` }
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Zoho GET /api/accounts failed: ${res.status} host=${MAIL_HOST} dc=${DC} body=${body.slice(0, 300)}`
    );
  }
  const j = await res.json();
  const list = j?.data ?? [];
  if (list.length === 0) throw new Error("Zoho: no mail accounts on this token");
  const wanted = raw.toLowerCase();
  const match = wanted && !/^\d+$/.test(raw) ? list.find(
    (a) => (a.primaryEmailAddress || "").toLowerCase() === wanted || (a.mailboxAddress || "").toLowerCase() === wanted
  ) : null;
  const chosen = match ?? list[0];
  if (!chosen?.accountId) throw new Error("Zoho: account has no accountId");
  accountIdCache = String(chosen.accountId);
  return accountIdCache;
}
async function getZohoAccessToken() {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 6e4) {
    return tokenCache.token;
  }
  const params = new URLSearchParams({
    refresh_token: requireEnv("ZOHO_MAIL_REFRESH_TOKEN"),
    client_id: requireEnv("ZOHO_MAIL_CLIENT_ID"),
    client_secret: requireEnv("ZOHO_MAIL_CLIENT_SECRET"),
    grant_type: "refresh_token"
  });
  const res = await fetch(`${ACCOUNTS_HOST}/oauth/v2/token?${params.toString()}`, {
    method: "POST"
  });
  const j = await res.json();
  if (!res.ok || !j.access_token) {
    throw new Error(`Zoho token refresh failed: ${j.error || res.status}`);
  }
  tokenCache = {
    token: j.access_token,
    expiresAt: Date.now() + (j.expires_in ?? 3600) * 1e3
  };
  return j.access_token;
}
async function zohoFetch(path) {
  const token = await getZohoAccessToken();
  const res = await fetch(`${MAIL_HOST}${path}`, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` }
  });
  if (res.status === 401) {
    tokenCache = null;
    const token2 = await getZohoAccessToken();
    const res2 = await fetch(`${MAIL_HOST}${path}`, {
      headers: { Authorization: `Zoho-oauthtoken ${token2}` }
    });
    if (!res2.ok) {
      const body = await res2.text().catch(() => "");
      throw new Error(`Zoho GET ${path} failed: ${res2.status} ${body.slice(0, 200)}`);
    }
    return await res2.json();
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Zoho GET ${path} failed: ${res.status} ${body.slice(0, 200)}`);
  }
  return await res.json();
}
async function discoverZohoFolders() {
  const accountId = await resolveAccountId();
  let data;
  try {
    data = await zohoFetch(
      `/api/accounts/${accountId}/folders`
    );
  } catch (e) {
    const msg = String(e.message || "");
    if (/ 401| 404/.test(msg)) {
      accountIdCache = null;
      const freshAcc = await resolveAccountId(true);
      data = await zohoFetch(
        `/api/accounts/${freshAcc}/folders`
      );
    } else {
      throw e;
    }
  }
  const list = data?.data ?? [];
  const ignoredPatterns = /^(sent|drafts?|trash|deleted|outbox|templates|scheduled)$/i;
  return list.map((f) => {
    const name = (f.folderName || "").trim();
    const type = (f.folderType || "").trim();
    const isIgnored = ignoredPatterns.test(name) || ignoredPatterns.test(type);
    return {
      folderId: String(f.folderId),
      folderName: name,
      folderType: type || void 0,
      isRelevantInbound: !isIgnored
    };
  });
}
async function getInboxFolderId() {
  const folders = await discoverZohoFolders();
  const inbox = folders.find((f) => f.folderType === "Inbox" || /inbox/i.test(f.folderName));
  if (!inbox) throw new Error("Zoho: Inbox folder not found");
  return inbox.folderId;
}
async function fetchFolderMessagesPage(folderId, start = 1, limit = 50) {
  const accountId = await resolveAccountId();
  const data = await zohoFetch(
    `/api/accounts/${accountId}/messages/view?folderId=${folderId}&start=${start}&limit=${limit}&sortBy=date&sortorder=false`
  );
  return data?.data ?? [];
}
async function listInboxMessages(limit = 50) {
  const folderId = await getInboxFolderId();
  return fetchFolderMessagesPage(folderId, 1, limit);
}
async function getMessageHeaders(messageId, folderId) {
  const accountId = await resolveAccountId();
  const data = await zohoFetch(
    `/api/accounts/${accountId}/folders/${folderId}/messages/${messageId}/header`
  );
  const raw = data?.data;
  if (!raw) return {};
  if (typeof raw === "object") return raw;
  const out = {};
  const lines = String(raw).split(/\r?\n/);
  let lastKey = null;
  for (const line of lines) {
    if (/^\s/.test(line) && lastKey) {
      out[lastKey] = (out[lastKey] || "") + " " + line.trim();
      continue;
    }
    const m = line.match(/^([A-Za-z0-9-]+):\s*(.*)$/);
    if (m) {
      lastKey = m[1];
      out[lastKey] = m[2];
    }
  }
  return out;
}
async function getMessageContent(messageId, folderId) {
  const accountId = await resolveAccountId();
  const data = await zohoFetch(
    `/api/accounts/${accountId}/folders/${folderId}/messages/${messageId}/content`
  );
  const c = data?.data?.content ?? null;
  const ct = data?.data?.contentType ?? "text/html";
  if (!c) return { html: null, text: null };
  if (ct.includes("html")) return { html: c, text: null };
  return { html: null, text: c };
}
async function fetchMessageAttachmentsList(messageId, folderId) {
  const accountId = await resolveAccountId();
  try {
    const data = await zohoFetch(
      `/api/accounts/${accountId}/folders/${folderId}/messages/${messageId}/attachmentinfo?includeInline=true`
    );
    const payload = data?.data;
    const rawList = [];
    if (Array.isArray(payload)) {
      rawList.push(...payload);
    } else if (payload && typeof payload === "object") {
      const obj = payload;
      if (Array.isArray(obj.attachments)) rawList.push(...obj.attachments);
      if (Array.isArray(obj.inline)) rawList.push(...obj.inline);
      if (Array.isArray(obj.attachment)) rawList.push(...obj.attachment);
    }
    return rawList.map((a) => ({
      attachmentId: String(a.attachmentId || a.attachment_id || a.id || ""),
      attachmentName: a.attachmentName || a.fileName || a.name || "attachment",
      attachmentSize: a.attachmentSize || a.size || 0,
      contentType: a.contentType || a.mimeType || "application/octet-stream",
      cid: a.cid || a.contentId || a.content_id || void 0,
      isInline: Boolean(a.isInline || a.inline || a.cid || a.contentId)
    })).filter((a) => a.attachmentId);
  } catch (e) {
    console.warn(`[zoho-inbox] fetchMessageAttachmentsList error for msg ${messageId}:`, e);
    return [];
  }
}
async function downloadZohoAttachment(messageId, folderId, attachmentId, attachmentName, isInline, cid) {
  const accountId = await resolveAccountId();
  const token = await getZohoAccessToken();
  const encodedName = encodeURIComponent(attachmentName || "attachment");
  const primaryUrl = `${MAIL_HOST}/api/accounts/${accountId}/folders/${folderId}/messages/${messageId}/attachments/${attachmentId}?fileName=${encodedName}`;
  let res = await fetch(primaryUrl, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` }
  });
  if (!res.ok && (isInline || cid || attachmentId)) {
    const inlineParam = encodeURIComponent(cid || attachmentId);
    const inlineUrl = `${MAIL_HOST}/api/accounts/${accountId}/folders/${folderId}/messages/${messageId}/inline?contentId=${inlineParam}`;
    try {
      const inlineRes = await fetch(inlineUrl, {
        headers: { Authorization: `Zoho-oauthtoken ${token}` }
      });
      if (inlineRes.ok) {
        res = inlineRes;
      }
    } catch {
    }
  }
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Zoho download attachment failed: ${res.status} ${errText.slice(0, 200)}`);
  }
  const arrayBuf = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuf);
  const contentType = res.headers.get("content-type") || "application/octet-stream";
  return { buffer, contentType };
}
function normalizeMessageId(id) {
  return normalizeMessageId$1(id);
}
function extractEmail(v) {
  return extractEmailAddress(v);
}
const zohoInbox_server = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  discoverZohoFolders,
  downloadZohoAttachment,
  extractEmail,
  fetchFolderMessagesPage,
  fetchMessageAttachmentsList,
  getInboxFolderId,
  getMessageContent,
  getMessageHeaders,
  getZohoAccessToken,
  listInboxMessages,
  normalizeMessageId,
  resolveAccountId,
  zohoFetch
}, Symbol.toStringTag, { value: "Module" }));
export {
  discoverZohoFolders as a,
  fetchFolderMessagesPage as b,
  getMessageContent as c,
  downloadZohoAttachment as d,
  extractOrderCodes as e,
  fetchMessageAttachmentsList as f,
  getMessageHeaders as g,
  normalizeReferences as h,
  normalizeSubject as i,
  extractTicketNumber as j,
  normalizeMessageId$1 as n,
  parseSender as p,
  stripHtmlToPlainText as s,
  zohoInbox_server as z
};
