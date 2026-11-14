import { supabaseAdmin } from "./client.server-3kDCe7R3.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
async function getFolderCheckpoint(mailboxAddress, folderId) {
  const { data, error } = await supabaseAdmin.from("email_ingestion_checkpoints").select("*").eq("mailbox_address", mailboxAddress.toLowerCase()).eq("folder_id", folderId).maybeSingle();
  if (error) {
    throw new Error(`[checkpoint] getFolderCheckpoint failed for ${mailboxAddress}/${folderId}: ${error.message}`);
  }
  if (!data) return null;
  const d = data;
  return {
    ...d,
    last_received_time_ms: Number(d.last_received_time_ms || 0)
  };
}
async function getAllCheckpoints(mailboxAddress) {
  const { data, error } = await supabaseAdmin.from("email_ingestion_checkpoints").select("*").eq("mailbox_address", mailboxAddress.toLowerCase()).order("folder_name", { ascending: true });
  if (error) {
    throw new Error(`[checkpoint] getAllCheckpoints failed: ${error.message}`);
  }
  return (data ?? []).map((d) => ({
    ...d,
    last_received_time_ms: Number(d.last_received_time_ms || 0)
  }));
}
async function updateFolderCheckpoint(input) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const mailbox = input.mailboxAddress.toLowerCase();
  const existing = await getFolderCheckpoint(mailbox, input.folderId);
  const newMaxTime = Math.max(existing?.last_received_time_ms || 0, input.lastReceivedTimeMs);
  const consecutiveFailures = input.resetFailures ? 0 : input.errorMessage ? (existing?.consecutive_failures || 0) + 1 : 0;
  const { error } = await supabaseAdmin.from("email_ingestion_checkpoints").upsert(
    {
      mailbox_address: mailbox,
      account_id: input.accountId,
      folder_id: input.folderId,
      folder_name: input.folderName,
      folder_type: input.folderType ?? null,
      last_received_time_ms: newMaxTime,
      last_processed_uid: input.lastProcessedUid ?? existing?.last_processed_uid ?? null,
      last_sync_at: now,
      status: input.status || (input.errorMessage ? "error" : "active"),
      error_message: input.errorMessage ?? null,
      consecutive_failures: consecutiveFailures,
      updated_at: now
    },
    { onConflict: "mailbox_address,folder_id" }
  );
  if (error) {
    throw new Error(`[checkpoint] updateFolderCheckpoint failed for ${mailbox}/${input.folderId}: ${error.message}`);
  }
}
async function acquireMailboxLock(mailboxAddress, workerId, ttlSeconds = 120) {
  const { data, error } = await supabaseAdmin.rpc("acquire_email_ingestion_lock", {
    p_mailbox: mailboxAddress.toLowerCase(),
    p_worker_id: workerId,
    p_ttl_seconds: ttlSeconds
  });
  if (error) {
    throw new Error(`[checkpoint] acquire_email_ingestion_lock failed: ${error.message}`);
  }
  return Boolean(data);
}
async function releaseMailboxLock(mailboxAddress, workerId) {
  const { error } = await supabaseAdmin.rpc("release_email_ingestion_lock", {
    p_mailbox: mailboxAddress.toLowerCase(),
    p_worker_id: workerId
  });
  if (error) {
    throw new Error(`[checkpoint] release_email_ingestion_lock failed: ${error.message}`);
  }
}
export {
  acquireMailboxLock,
  getAllCheckpoints,
  getFolderCheckpoint,
  releaseMailboxLock,
  updateFolderCheckpoint
};
