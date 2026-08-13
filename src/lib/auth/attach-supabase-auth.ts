import { createMiddleware } from "@tanstack/react-start";

/**
 * Project-specific replacement for the generated `attachSupabaseAuth`.
 *
 * Identical behaviour (attaches the Supabase bearer token to every server
 * function RPC), but the auth SDK is imported lazily so the ~90KB
 * auth/realtime client stays out of the initial page bundle. Public pages
 * never call a server fn on load, so they never pay for it.
 */
export const attachSupabaseAuthLazy = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data } = await supabase.auth.getSession();
    let token = data.session?.access_token;
    if (!token) {
      // Session read can transiently fail (e.g. auth server briefly
      // unreachable); try one refresh before sending an unauthenticated call.
      const { data: refreshed } = await supabase.auth.refreshSession();
      token = refreshed.session?.access_token;
    }
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
);

