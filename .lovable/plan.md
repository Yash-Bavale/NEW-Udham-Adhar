## Goal

1. Stop the admin login from glitching/feeling slow.
2. Remove the public "Create Admin Account" signup from `/admin-login` — new users must only be created by an existing admin via the Users page (server-side, role-gated).

## Root causes

**Login glitch / slowness** in `src/routes/admin-login.tsx` + `src/routes/admin.tsx`:

- `admin-login` fires `supabase.auth.getSession()` in a `useEffect`. While Supabase is hydrating the session from `localStorage` on first paint, this can return `null`, so the redirect-if-already-signed-in path is unreliable and the form flashes before navigation.
- After `signInWithPassword` succeeds, we call `navigate({ to: "/admin/dashboard" })` immediately. The `/admin` `beforeLoad` then calls `getSession()` again — sometimes it races the just-issued session and bounces back to `/admin-login`, causing a visible flicker / "stuck" feel.
- `/admin` uses `getSession()` (cached, not re-validated) instead of `getUser()` (per knowledge: prefer `getUser()` for server/route gates that must trust identity, and it awaits session hydration).
- There is no `onAuthStateChange` listener, so token refresh / sign-in events don't trigger a router invalidation — the UI keeps showing stale state until manual nav.

**Signup in admin panel**: the `/admin-login` page contains a mode toggle that calls `supabase.auth.signUp`. Combined with the DB trigger `bootstrap_first_admin`, anyone hitting `/admin-login` could create the first admin. This must go. New staff users are created only from `/admin/users` (already wired to `listStaffUsers` / `grantRole` server fns gated by `assertAdmin`).

## Changes

### 1. `src/routes/admin-login.tsx`
- Remove `mode` state, the signup branch, the "Need to create the first admin account?" toggle button, and the `signUp` call entirely. Page is **login-only**.
- Replace `getSession()` effect with an `onAuthStateChange` subscription + an initial `getUser()` call. When a session exists, `navigate({ to: "/admin/dashboard", replace: true })`.
- After successful `signInWithPassword`, wait for the auth event (or simply rely on the listener) before navigating, so `/admin` `beforeLoad` always sees the session. Use `replace: true` to avoid back-button bounce.
- Keep email/password form, errors, "Back to site" link.

### 2. `src/routes/admin.tsx`
- Change `beforeLoad` to use `supabase.auth.getUser()` (re-validates + awaits hydration) instead of `getSession()`. Redirect to `/admin-login` only when `error || !data.user`.
- This eliminates the race where the dashboard kicks the user back to login right after sign-in.

### 3. `src/routes/__root.tsx` (light touch — add listener if not already present)
- Add a single root-level `onAuthStateChange` that calls `router.invalidate()` + `queryClient.invalidateQueries()` so sign-in/out immediately refreshes route gates and queries. (Per `tanstack-supabase-integration` cache-invalidation guidance.) If the root already has one, leave it alone.

### 4. No DB / RLS changes
- `user_roles` policies + `assertAdmin` in `users-admin.functions.ts` already restrict role management to admins.
- The existing `bootstrap_first_admin` trigger stays (harmless — only fires when no admin exists; once you have one admin it's a no-op). Bootstrapping a brand-new project still works by an admin signing up directly via Supabase or by temporarily inserting a row.

## Out of scope
- No changes to `/admin/users` (it already is the correct admin-only "create/manage users" surface).
- No visual redesign of the login card.

## Expected outcome
- `/admin-login` shows only a Sign In form — no signup toggle.
- Signing in navigates to `/admin/dashboard` in one smooth transition, no flash back to login.
- Refreshing while signed in lands on the dashboard immediately without a login flash.
