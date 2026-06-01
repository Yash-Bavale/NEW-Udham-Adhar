## Root cause

`src/lib/emails/emails.functions.ts` mixes two kinds of exports:

- plain async helpers: `enqueueEmailInternal`, `enqueueFromTemplateInternal`, `processQueueInternal`
- `createServerFn` RPCs: `getEmailDashboard`, `getSmtpSettings`, `sendTestEmail`, etc.

The file is imported by `src/routes/admin.emails.tsx` (a client route). TanStack's server-fn transformer only strips the `.handler()` bodies of `createServerFn` exports — it does NOT strip top-level imports of files that also export plain helpers. So `smtp.server.ts` (which imports `nodemailer`) and `client.server.ts` get bundled into the browser. Nodemailer pulls in `os`, `stream`, `child_process`, etc., which Vite externalizes for the browser, producing:

```
TypeError: Class extends value undefined is not a constructor or null
  at node_modules/nodemailer/lib/base64/index.js
```

That crash happens during admin route hydration, which is also why the admin login feels slow (the page errors into the `CatchBoundary`, re-renders, retries).

## Fix

Split the email module so the client only ever imports the thin server-fn surface.

1. **Create `src/lib/emails/emails.server.ts`** containing:
   - the `nodemailer` / `smtp.server` imports
   - the three plain helpers: `enqueueEmailInternal`, `enqueueFromTemplateInternal`, `processQueueInternal`
   - `supabaseAdmin` usage they need

2. **Rewrite `src/lib/emails/emails.functions.ts`** to be thin:
   - keep ONLY the `createServerFn` exports
   - import helpers from `./emails.server` (the `.server.ts` suffix is import-protected from client bundles)
   - import `supabaseAdmin` and `requireSupabaseAuth` as before — they're only referenced inside `.handler()` bodies, which the transformer strips out of the client bundle

3. **Update `src/routes/api/public/cron/process-emails.ts`** to import `processQueueInternal` from `@/lib/emails/emails.server` instead of `emails.functions`.

4. **No changes** to `admin.emails.tsx`, `smtp.server.ts`, or the database.

## Verification

- Reload `/admin/emails` — no more `Class extends value undefined` console error, no CatchBoundary fallback.
- Admin pages load at normal speed (no failed dynamic-import retries).
- Sending a test email and the cron processor still work (they run on the server, where the split modules behave identically).

After this is in, I'll continue with Sub-Phase 4B.