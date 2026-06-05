## What the error means

CCAvenue's gateway page shows **"decryption of encRequest failed"** when *their* servers cannot decrypt the `encRequest` we POST to `secure.ccavenue.com/transaction/transaction.do`. Our encryption code itself is correct (AES‑128‑CBC, MD5(workingKey), fixed IV `00..0f` — that's the canonical kit). So the failure is almost always one of three credential/environment mismatches, not a code bug.

## Most likely causes (in order)

1. **Working key ↔ access code ↔ merchant id mismatch.** The three CCAV secrets must come from the *same* CCAvenue sub-account. If the working key was regenerated after the access code was issued, or copied from a different M-ID, decryption fails on their side.
2. **Test credentials used against the live URL** (or vice versa). We hardcode `https://secure.ccavenue.com/...` (live). Test credentials only work against `https://test.ccavenue.com/...`.
3. **Whitespace / stray characters** in `CCAV_WORKING_KEY` (a trailing newline or space changes the MD5 and breaks decryption). Same risk for `CCAV_ACCESS_CODE` / `CCAV_MERCHANT_ID`.

Less likely but worth ruling out: the account hasn't been activated for the iFrame/Non-Seamless integration we're using.

## Plan

1. **Harden credential handling in `ccavenue.server.ts`**
   - `.trim()` `CCAV_MERCHANT_ID`, `CCAV_ACCESS_CODE`, `CCAV_WORKING_KEY` in `getCcavCreds()` so an accidental trailing newline can never poison the MD5 key.
   - Validate non-empty after trim with a clearer error.

2. **Add an environment toggle** (`CCAV_ENV` = `live` | `test`, defaulting to `live`) and derive `CCAV_REDIRECT_URL` / `CCAV_API_URL` from it. This lets us flip to `test.ccavenue.com` for sanity checks without code edits, and prevents the live/test URL trap.

3. **Add a one-shot diagnostic log on initiation** (no secrets printed) — just merchant_id, access_code prefix/length, working_key length, and which endpoint URL we POSTed to. This makes "wrong env" vs "wrong key" obvious from server logs on the next attempt.

4. **Re-verify the three secrets with you.** After the code hardening, the fastest fix is to re-paste the three values directly from the CCAvenue dashboard (Settings → API Keys for the exact sub-account you want to charge through), in case the current values are from a different account or have whitespace. I'll prompt for an update via the secrets tool only after you confirm.

5. **Test again from `/apply/UA-2026-001067/summary`** and check the new diagnostic log line. If CCAvenue still rejects, the log will tell us whether to (a) request fresh keys from CCAvenue support, or (b) switch `CCAV_ENV=test` while they investigate.

## Out of scope

No changes to the response/webhook handler, refunds, or DB schema — those are working, and this issue is strictly on the outbound request to CCAvenue.

## Questions for you before I implement

- Are your CCAvenue keys **live** or **test**? (Live was the original scope, but want to confirm before I add the env switch default.)
- Did you recently regenerate the working key in the CCAvenue dashboard after the access code was issued? If yes, that alone explains the error and we just need to update `CCAV_WORKING_KEY`.
