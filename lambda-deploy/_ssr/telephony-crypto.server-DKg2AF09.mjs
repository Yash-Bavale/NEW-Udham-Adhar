const CRYPTO_VERSION = "v1";
class TelephonyKeyError extends Error {
}
function b64(bytes) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}
function unb64(s) {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function validateKey(raw) {
  const k = (raw ?? "").trim();
  if (!k) throw new TelephonyKeyError("Telephony credential key is not configured.");
  if (k.length < 32 || /\s/.test(k)) throw new TelephonyKeyError("Telephony credential key is invalid.");
  return k;
}
async function importKey(raw) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`bhs-telephony-v1:${validateKey(raw)}`));
  return crypto.subtle.importKey("raw", digest, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}
async function encryptSecret(plain, employeeId, rawKey = process.env["TELEPHONY_CREDENTIAL_KEY"]) {
  if (!plain) throw new Error("Nothing to encrypt.");
  const key = await importKey(rawKey ?? "");
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: new TextEncoder().encode(employeeId) }, key, new TextEncoder().encode(plain)));
  return `${CRYPTO_VERSION}.${b64(iv)}.${b64(ct)}`;
}
async function decryptSecret(blob, employeeId, rawKey = process.env["TELEPHONY_CREDENTIAL_KEY"]) {
  const parts = (blob ?? "").split(".");
  if (parts.length !== 3 || parts[0] !== CRYPTO_VERSION) throw new Error("Stored credential has an unknown format.");
  const key = await importKey(rawKey ?? "");
  try {
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(parts[1]), additionalData: new TextEncoder().encode(employeeId) }, key, unb64(parts[2]));
    return new TextDecoder().decode(pt);
  } catch {
    throw new Error("Stored credential could not be decrypted.");
  }
}
export {
  CRYPTO_VERSION,
  TelephonyKeyError,
  decryptSecret,
  encryptSecret,
  validateKey
};
