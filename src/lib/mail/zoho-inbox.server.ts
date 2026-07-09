// Zoho Mail REST API client (server-only).
// Uses OAuth2 refresh-token flow to poll the Inbox folder and fetch full
// message headers + content. All calls target the .in DC to match the SMTP
// config; override via env if the mailbox is on .com/.eu.

const DC = (process.env.ZOHO_MAIL_DC || "in").trim(); // "in" | "com" | "eu" | "com.au" | "jp"
const ACCOUNTS_HOST = `https://accounts.zoho.${DC}`;
const MAIL_HOST = `https://mail.zoho.${DC}`;

type TokenCache = { token: string; expiresAt: number };
let tokenCache: TokenCache | null = null;
let accountIdCache: string | null = null;

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Zoho inbox: missing env ${name}`);
  return v.trim();
}

/** Resolve the numeric Zoho account ID. If ZOHO_MAIL_ACCOUNT_ID is set to a
 *  numeric value we trust it; otherwise (empty or an email address) we call
 *  /api/accounts and pick the account whose primary email matches, falling
 *  back to the first account. Cached per-worker. */
async function resolveAccountId(forceRefresh = false): Promise<string> {
  if (accountIdCache && !forceRefresh) return accountIdCache;
  const raw = (process.env.ZOHO_MAIL_ACCOUNT_ID || "").trim();
  // If env holds a numeric id, trust it — but only until a call proves it stale
  // (see zohoFetch's 404 handling, which forces a refresh via /api/accounts).
  if (raw && /^\d+$/.test(raw) && !forceRefresh) {
    accountIdCache = raw;
    return raw;
  }
  const token = await getZohoAccessToken();
  const res = await fetch(`${MAIL_HOST}/api/accounts`, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  });
  if (!res.ok) throw new Error(`Zoho GET /api/accounts failed: ${res.status}`);
  const j = (await res.json()) as {
    data?: Array<{ accountId?: string | number; primaryEmailAddress?: string; mailboxAddress?: string }>;
  };
  const list = j?.data ?? [];
  if (list.length === 0) throw new Error("Zoho: no mail accounts on this token");
  const wanted = raw.toLowerCase();
  const match = wanted && !/^\d+$/.test(raw)
    ? list.find(
        (a) =>
          (a.primaryEmailAddress || "").toLowerCase() === wanted ||
          (a.mailboxAddress || "").toLowerCase() === wanted,
      )
    : null;
  const chosen = match ?? list[0];
  if (!chosen?.accountId) throw new Error("Zoho: account has no accountId");
  accountIdCache = String(chosen.accountId);
  return accountIdCache;
}


/** Exchange refresh token for a 1h access token; cached in-memory per worker. */
export async function getZohoAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.token;
  }
  const params = new URLSearchParams({
    refresh_token: requireEnv("ZOHO_MAIL_REFRESH_TOKEN"),
    client_id: requireEnv("ZOHO_MAIL_CLIENT_ID"),
    client_secret: requireEnv("ZOHO_MAIL_CLIENT_SECRET"),
    grant_type: "refresh_token",
  });
  const res = await fetch(`${ACCOUNTS_HOST}/oauth/v2/token?${params.toString()}`, {
    method: "POST",
  });
  const j = (await res.json()) as { access_token?: string; expires_in?: number; error?: string };
  if (!res.ok || !j.access_token) {
    throw new Error(`Zoho token refresh failed: ${j.error || res.status}`);
  }
  tokenCache = {
    token: j.access_token,
    expiresAt: Date.now() + (j.expires_in ?? 3600) * 1000,
  };
  return j.access_token;
}

async function zohoFetch<T>(path: string): Promise<T> {
  const token = await getZohoAccessToken();
  const res = await fetch(`${MAIL_HOST}${path}`, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  });
  if (res.status === 401) {
    // Force token refresh once and retry.
    tokenCache = null;
    const token2 = await getZohoAccessToken();
    const res2 = await fetch(`${MAIL_HOST}${path}`, {
      headers: { Authorization: `Zoho-oauthtoken ${token2}` },
    });
    if (!res2.ok) {
      const body = await res2.text().catch(() => "");
      throw new Error(`Zoho GET ${path} failed: ${res2.status} ${body.slice(0, 200)}`);
    }
    return (await res2.json()) as T;
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Zoho GET ${path} failed: ${res.status} ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

export type ZohoMessageListItem = {
  messageId: string;   // Zoho's internal numeric ID (per-account)
  folderId: string;
  subject: string;
  fromAddress: string;
  toAddress?: string;
  sender?: string;
  receivedTime: string; // epoch ms as string
  summary?: string;
  hasAttachment?: string;
  status2?: string;    // "0" = unread
};

export type ZohoHeaders = {
  "Message-ID"?: string;
  "In-Reply-To"?: string;
  References?: string;
  Subject?: string;
  From?: string;
  To?: string;
  Date?: string;
  "X-BHS-Order"?: string;
  "X-BHS-Customer"?: string;
  [k: string]: string | undefined;
};

/** Find the Inbox folder ID for this account. Retries with a refreshed
 *  account id if the initial one 404s (env var stale or account rotated). */
export async function getInboxFolderId(): Promise<string> {
  const call = async (accountId: string) =>
    zohoFetch<{ data: Array<{ folderId: string; folderName: string; folderType?: string }> }>(
      `/api/accounts/${accountId}/folders`,
    );
  let accountId = await resolveAccountId();
  let data: { data: Array<{ folderId: string; folderName: string; folderType?: string }> };
  try {
    data = await call(accountId);
  } catch (e) {
    // Both 401 and 404 usually mean the cached account ID is stale for this
    // token (mailbox re-provisioned or account rotated). Force /api/accounts
    // to fetch a fresh ID and retry once before giving up.
    const msg = String((e as Error).message || "");
    if (/ 401| 404/.test(msg)) {
      accountIdCache = null;
      accountId = await resolveAccountId(true);
      data = await call(accountId);
    } else {
      throw e;
    }
  }
  const folders = data?.data ?? [];
  const inbox = folders.find((f) => f.folderType === "Inbox" || /inbox/i.test(f.folderName));
  if (!inbox) throw new Error("Zoho: Inbox folder not found");
  return inbox.folderId;
}

/** List recent messages in Inbox (most recent first). */
export async function listInboxMessages(limit = 50): Promise<ZohoMessageListItem[]> {
  const folderId = await getInboxFolderId();
  const accountId = await resolveAccountId();
  const data = await zohoFetch<{ data: ZohoMessageListItem[] }>(
    `/api/accounts/${accountId}/messages/view?folderId=${folderId}&start=1&limit=${limit}&sortBy=date&sortorder=false`,
  );
  return data?.data ?? [];
}

/** Fetch the raw RFC-822 headers for a message as a lookup map. */
export async function getMessageHeaders(messageId: string, folderId: string): Promise<ZohoHeaders> {
  const accountId = await resolveAccountId();
  const data = await zohoFetch<{ data: string | Record<string, string> }>(
    `/api/accounts/${accountId}/folders/${folderId}/messages/${messageId}/header`,
  );
  const raw = data?.data;
  if (!raw) return {};
  if (typeof raw === "object") return raw as ZohoHeaders;
  // Parse the raw header block
  const out: ZohoHeaders = {};
  const lines = String(raw).split(/\r?\n/);
  let lastKey: string | null = null;
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

/** Fetch the plaintext/HTML body of a message. */
export async function getMessageContent(
  messageId: string,
  folderId: string,
): Promise<{ html: string | null; text: string | null }> {
  const accountId = await resolveAccountId();
  const data = await zohoFetch<{ data: { content?: string; contentType?: string } }>(
    `/api/accounts/${accountId}/folders/${folderId}/messages/${messageId}/content`,
  );
  const c = data?.data?.content ?? null;
  const ct = data?.data?.contentType ?? "text/html";
  if (!c) return { html: null, text: null };
  if (ct.includes("html")) return { html: c, text: null };
  return { html: null, text: c };
}

/** Extract an angle-bracketed Message-ID (or the raw token if unwrapped). */
export function normalizeMessageId(id: string | undefined | null): string | null {
  if (!id) return null;
  const m = id.match(/<([^>]+)>/);
  return m ? m[1].trim() : id.trim().replace(/^<|>$/g, "");
}

/** Parse a "Name <email>" or bare email string, returning lowercase email. */
export function extractEmail(v: string | undefined | null): string | null {
  if (!v) return null;
  const m = v.match(/<([^>]+)>/);
  const e = m ? m[1] : v;
  return e.trim().toLowerCase();
}
