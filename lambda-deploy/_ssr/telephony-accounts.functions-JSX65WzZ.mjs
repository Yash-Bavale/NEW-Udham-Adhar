import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { r as requireTelephonyAdmin } from "./ivr.config-CYf-fKNa.mjs";
import { LEGACY_ENV_USER_IDS } from "./callerdesk-webrtc.config-CFRtE2mu.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, _ as _enum, s as string } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const admin = async () => (await import("./client.server-3kDCe7R3.mjs")).supabaseAdmin;
const listTelephonyAccounts_createServerFn_handler = createServerRpc({
  id: "7387de463f8326ffb9a16501fb46bed89dc5c073feeccf3c5acb4ec05b9f0b61",
  name: "listTelephonyAccounts",
  filename: "src/lib/telephony/telephony-accounts.functions.ts"
}, (opts) => listTelephonyAccounts.__executeServer(opts));
const listTelephonyAccounts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listTelephonyAccounts_createServerFn_handler, async ({
  context
}) => {
  await requireTelephonyAdmin(context);
  const db = await admin();
  const [{
    data: rows,
    error
  }, {
    data: staff
  }] = await Promise.all([db.from("employee_telephony_accounts").select("employee_id, status, member_id, sip_username, display_name, sip_password_ciphertext, source, verified_at, updated_at"), db.from("profiles").select("id, full_name, email").eq("is_active", true).order("full_name")]);
  if (error) throw new Error("Could not load browser phone accounts.");
  const result = {
    accounts: (rows ?? []).map((r) => ({
      employeeId: r.employee_id,
      status: r.status,
      memberId: r.member_id,
      sipUsername: r.sip_username,
      displayName: r.display_name,
      hasPassword: !!r.sip_password_ciphertext,
      source: r.source,
      verifiedAt: r.verified_at,
      updatedAt: r.updated_at
    })),
    staff: (staff ?? []).map((p) => ({
      id: p.id,
      name: p.full_name || p.email || "Employee",
      email: p.email
    })),
    legacyEmployeeIds: [...LEGACY_ENV_USER_IDS]
  };
  return result;
});
const SaveSchema = object({
  employeeId: string().uuid(),
  memberId: string().trim().regex(/^\d*$/).max(20).optional().default(""),
  sipUsername: string().trim().min(3).max(64).regex(/^[A-Za-z0-9._@+-]+$/),
  displayName: string().trim().max(80).optional().default(""),
  password: string().max(128).optional().default(""),
  status: _enum(["unprovisioned", "active", "disabled"])
});
const saveTelephonyAccount_createServerFn_handler = createServerRpc({
  id: "1703190885432f55cd71e6fbe4806a09fffaddf721db8e739d7d2e0828d4d859",
  name: "saveTelephonyAccount",
  filename: "src/lib/telephony/telephony-accounts.functions.ts"
}, (opts) => saveTelephonyAccount.__executeServer(opts));
const saveTelephonyAccount = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => SaveSchema.parse(d)).handler(saveTelephonyAccount_createServerFn_handler, async ({
  context,
  data
}) => {
  await requireTelephonyAdmin(context);
  const {
    encryptSecret,
    decryptSecret
  } = await import("./telephony-crypto.server-DKg2AF09.mjs");
  const db = await admin();
  const {
    data: existing
  } = await db.from("employee_telephony_accounts").select("id, sip_password_ciphertext").eq("employee_id", data.employeeId).maybeSingle();
  const row = {
    employee_id: data.employeeId,
    member_id: data.memberId || null,
    sip_username: data.sipUsername,
    display_name: data.displayName || null,
    status: data.status,
    updated_by: context.userId
  };
  if (data.password) {
    const ct = await encryptSecret(data.password, data.employeeId).catch(() => {
      throw new Error("Credential encryption is not configured on the server.");
    });
    if (await decryptSecret(ct, data.employeeId) !== data.password) throw new Error("Credential verification failed. Nothing was saved.");
    row.sip_password_ciphertext = ct;
    row.verified_at = (/* @__PURE__ */ new Date()).toISOString();
  } else if (!existing?.sip_password_ciphertext && data.status === "active") {
    throw new Error("Enter the SIP password before activating this account.");
  }
  const q = existing ? db.from("employee_telephony_accounts").update(row).eq("id", existing.id) : db.from("employee_telephony_accounts").insert({
    ...row,
    created_by: context.userId,
    source: "admin"
  });
  const {
    error
  } = await q;
  if (error?.code === "23505") throw new Error("That SIP username is already assigned to another employee.");
  if (error) throw new Error("Browser phone account could not be saved.");
  return {
    ok: true
  };
});
const migrateLegacyTelephonyAccount_createServerFn_handler = createServerRpc({
  id: "014e15189e66b9e6f0bd6225154c527a9ccf5931417462192026bd3783101c32",
  name: "migrateLegacyTelephonyAccount",
  filename: "src/lib/telephony/telephony-accounts.functions.ts"
}, (opts) => migrateLegacyTelephonyAccount.__executeServer(opts));
const migrateLegacyTelephonyAccount = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(migrateLegacyTelephonyAccount_createServerFn_handler, async ({
  context
}) => {
  await requireTelephonyAdmin(context);
  const {
    legacyCredentials,
    readEnv
  } = await import("./callerdesk-webrtc.server-Cdgo40_z.mjs");
  const {
    encryptSecret,
    decryptSecret
  } = await import("./telephony-crypto.server-DKg2AF09.mjs");
  const creds = legacyCredentials(readEnv());
  if (!creds) throw new Error("The legacy SIP login is not configured, so there is nothing to migrate.");
  const employeeId = LEGACY_ENV_USER_IDS[0];
  const db = await admin();
  const {
    data: existing
  } = await db.from("employee_telephony_accounts").select("id").eq("employee_id", employeeId).maybeSingle();
  if (existing) return {
    ok: true,
    alreadyMigrated: true
  };
  const ct = await encryptSecret(creds.password, employeeId).catch(() => {
    throw new Error("Credential encryption is not configured on the server.");
  });
  if (await decryptSecret(ct, employeeId) !== creds.password) throw new Error("Credential verification failed. Nothing was saved.");
  const {
    error
  } = await db.from("employee_telephony_accounts").insert({
    employee_id: employeeId,
    member_id: "122354",
    sip_username: creds.username,
    display_name: creds.displayName,
    sip_password_ciphertext: ct,
    status: "active",
    source: "legacy_env_migration",
    verified_at: (/* @__PURE__ */ new Date()).toISOString(),
    created_by: context.userId,
    updated_by: context.userId
  });
  if (error) throw new Error("Migration could not be saved.");
  return {
    ok: true,
    alreadyMigrated: false
  };
});
export {
  listTelephonyAccounts_createServerFn_handler,
  migrateLegacyTelephonyAccount_createServerFn_handler,
  saveTelephonyAccount_createServerFn_handler
};
