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
    const token = data.session?.access_token;
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
);
