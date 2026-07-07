// Zoho Mail delivery helper (server-only).
// Uses Zoho Mail's HTTPS API instead of SMTP sockets because the hosted
// runtime can block raw SMTP connections and surface them as proxy failures.

export type ZohoAttachment = {
  filename: string;
  content_base64: string;
  content_type: string;
};

export type ZohoSendInput = {
  to: string;
  subject: string;
  html: string;
  text?: string | null;
  fromName?: string | null;
  replyTo?: string | null;
  attachments?: ZohoAttachment[];
  headers?: Record<string, string>;
  /** Threading + BHS trace headers — used by incoming-mail matching. */
  messageId?: string;         // Full <local@domain> Message-ID; auto-generated if missing.
  inReplyTo?: string | null;  // <parent-message-id>
  references?: string | null; // space-separated list of <ids>
  orderId?: string | null;
  customerId?: string | null;
  templateCode?: string | null;
  queueId?: string | null;
};

export type ZohoSendResult = {
  ok: boolean;
  messageId?: string;
  response?: string;
  error?: string;
};

type TokenCache = { token: string; expiresAt: number };
type ZohoUploadedAttachment = {
  storeName: string;
  attachmentPath: string;
  attachmentName: string;
};

const ZOHO_FROM_EMAIL = "help@busiesshelpservices.com";
const DC = (process.env.ZOHO_MAIL_DC || "in").trim();
const ACCOUNTS_HOST = `https://accounts.zoho.${DC}`;
const MAIL_HOST = `https://mail.zoho.${DC}`;

let tokenCache: TokenCache | null = null;
let accountIdCache: string | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Zoho Mail API credentials missing (${name}).`);
  return value.trim();
}

function angleWrap(id: string): string {
  const t = id.trim();
  if (!t) return t;
  return t.startsWith("<") ? t : `<${t.replace(/[<>\s]/g, "")}>`;
}

function generateMessageId(user: string): string {
  const domain = (user.split("@")[1] || "udyamadhar.in").trim();
  const rnd = Math.random().toString(36).slice(2, 10);
  return `<bhs.${Date.now()}.${rnd}@${domain}>`;
}

async function getZohoAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) return tokenCache.token;

  const params = new URLSearchParams({
    refresh_token: requireEnv("ZOHO_MAIL_REFRESH_TOKEN"),
    client_id: requireEnv("ZOHO_MAIL_CLIENT_ID"),
    client_secret: requireEnv("ZOHO_MAIL_CLIENT_SECRET"),
    grant_type: "refresh_token",
  });
  const res = await fetch(`${ACCOUNTS_HOST}/oauth/v2/token?${params.toString()}`, { method: "POST" });
  const body = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error?: string };
  if (!res.ok || !body.access_token) {
    throw new Error(`Zoho token refresh failed: ${body.error || res.status}`);
  }
  tokenCache = {
    token: body.access_token,
    expiresAt: Date.now() + (body.expires_in ?? 3600) * 1000,
  };
  return body.access_token;
}

async function resolveAccountId(forceRefresh = false): Promise<string> {
  if (accountIdCache && !forceRefresh) return accountIdCache;

  const raw = (process.env.ZOHO_MAIL_ACCOUNT_ID || ZOHO_FROM_EMAIL).trim();
  if (raw && /^\d+$/.test(raw) && !forceRefresh) {
    accountIdCache = raw;
    return raw;
  }

  const token = await getZohoAccessToken();
  const res = await fetch(`${MAIL_HOST}/api/accounts`, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Zoho GET /api/accounts failed: ${res.status} ${text.slice(0, 300)}`);

  const json = JSON.parse(text || "{}") as {
    data?: Array<{ accountId?: string | number; primaryEmailAddress?: string; mailboxAddress?: string; emailAddress?: string }>;
  };
  const accounts = json.data ?? [];
  if (accounts.length === 0) throw new Error("Zoho: no mail accounts are available for this OAuth token.");

  const wanted = raw.toLowerCase();
  const from = ZOHO_FROM_EMAIL.toLowerCase();
  const match = accounts.find((account) => {
    const addresses = [account.primaryEmailAddress, account.mailboxAddress, account.emailAddress]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase());
    return addresses.includes(wanted) || addresses.includes(from);
  });
  const chosen = match ?? accounts[0];
  if (!chosen?.accountId) throw new Error("Zoho: selected account has no accountId.");
  accountIdCache = String(chosen.accountId);
  return accountIdCache;
}

async function zohoApi<T>(path: string, init?: RequestInit, retryAccountOn404 = false): Promise<T> {
  const token = await getZohoAccessToken();
  const res = await fetch(`${MAIL_HOST}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(init?.headers ?? {}),
      Authorization: `Zoho-oauthtoken ${token}`,
    },
  });

  if (res.status === 401) {
    tokenCache = null;
    return zohoApi<T>(path, init, retryAccountOn404);
  }

  if (res.status === 404 && retryAccountOn404) {
    accountIdCache = null;
    const refreshed = await resolveAccountId(true);
    return zohoApi<T>(path.replace(/\/api\/accounts\/[^/]+\//, `/api/accounts/${refreshed}/`), init, false);
  }

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Zoho API ${init?.method ?? "GET"} ${path} failed: ${res.status} ${text.slice(0, 500)}`);
  }
  return (text ? JSON.parse(text) : {}) as T;
}

async function uploadAttachment(accountId: string, attachment: ZohoAttachment): Promise<ZohoUploadedAttachment> {
  const bytes = Uint8Array.from(Buffer.from(attachment.content_base64, "base64"));
  const file = new File([bytes], attachment.filename, { type: attachment.content_type || "application/octet-stream" });
  const form = new FormData();
  form.append("attach", file);

  const result = await zohoApi<{
    data?: ZohoUploadedAttachment | ZohoUploadedAttachment[];
  }>(
    `/api/accounts/${accountId}/messages/attachments?uploadType=multipart&isInline=false`,
    { method: "POST", body: form },
    true,
  );

  const data = Array.isArray(result.data) ? result.data[0] : result.data;
  if (!data?.storeName || !data.attachmentPath || !data.attachmentName) {
    throw new Error(`Zoho attachment upload failed for ${attachment.filename}: invalid upload response.`);
  }
  return data;
}

export async function sendViaZoho(input: ZohoSendInput): Promise<ZohoSendResult> {
  try {
    const accountId = await resolveAccountId();
    const fromEmail = ZOHO_FROM_EMAIL;
    const fromName = (input.fromName || process.env.ZOHO_FROM_NAME || "Udyam Registration Consultancy & Assistance Services").trim();
    const messageId = angleWrap(input.messageId || generateMessageId(fromEmail));
    const threadHeaders: Record<string, string> = { "Message-ID": messageId };
    if (input.inReplyTo) threadHeaders["In-Reply-To"] = angleWrap(input.inReplyTo);
    if (input.references) {
      threadHeaders["References"] = input.references
        .split(/\s+/)
        .filter(Boolean)
        .map(angleWrap)
        .join(" ");
    }
    if (input.orderId) threadHeaders["X-BHS-Order"] = input.orderId;
    if (input.customerId) threadHeaders["X-BHS-Customer"] = input.customerId;
    if (input.templateCode) threadHeaders["X-BHS-Template"] = input.templateCode;
    if (input.queueId) threadHeaders["X-BHS-Queue-Id"] = input.queueId;

    const attachments = input.attachments?.length
      ? await Promise.all(input.attachments.map((attachment) => uploadAttachment(accountId, attachment)))
      : undefined;

    const headerText = Object.entries({ ...threadHeaders, ...(input.headers || {}) })
      .map(([key, value]) => `${key}: ${value}`)
      .join("\r\n");

    const response = await zohoApi<{ data?: { messageId?: string; status?: string; message?: string }; status?: { description?: string } }>(
      `/api/accounts/${accountId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({
          fromAddress: fromEmail,
          toAddress: input.to,
          replyTo: input.replyTo || fromEmail,
          subject: input.subject,
          content: input.html,
          mailFormat: "html",
          encoding: "UTF-8",
          askReceipt: "no",
          attachments,
          header: headerText || undefined,
        }),
      },
      true,
    );

    return {
      ok: true,
      messageId: response.data?.messageId || messageId,
      response: response.data?.message || response.status?.description || "Zoho Mail API accepted message",
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Zoho Mail API send failed",
    };
  }
}

export function zohoSenderInfo() {
  return {
    host: MAIL_HOST,
    port: 443,
    user: ZOHO_FROM_EMAIL,
    fromName: process.env.ZOHO_FROM_NAME || "Udyam Registration Consultancy & Assistance Services",
  };
}
