import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logLoginAttempt, verifyGoogleStaffAccess } from "@/lib/crm/employee-sessions.functions";
import { getOrCreateSessionId } from "@/hooks/useEmployeePresence";

/** Only allow same-origin relative paths as a post-login redirect target. */
function safeNext(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

export const Route = createFileRoute("/admin-login")({
  validateSearch: (s: Record<string, unknown>): { next?: string } => {
    const next = safeNext(s.next);
    return next ? { next } : {};
  },
  head: () => ({
    meta: [
      { title: "Admin Sign In — Business Help Services" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goAfterAuth = () => {
    const stored = safeNext(sessionStorage.getItem("admin_login_next"));
    sessionStorage.removeItem("admin_login_next");
    const target = safeNext(next) || stored;
    window.location.href = target || "/admin";
  };

  // Check auth state on load
  useEffect(() => {
    let cancelled = false;

    const checkAndRedirect = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (cancelled || error || !data.user) return;

      try {
        // Verify staff access
        const verification = await verifyGoogleStaffAccess();
        if (!verification.authorized) {
          setError("Your account is not authorized to access this CRM. Contact your administrator.");
          await supabase.auth.signOut();
          return;
        }

        // Initialize session record
        const sessionId = getOrCreateSessionId();
        await logLoginAttempt({
          data: {
            sessionId,
            loginMethod: data.user.app_metadata?.provider === "google" ? "google" : "password",
            browser: "Chrome",
            os: "Windows",
            deviceType: "Desktop",
          },
        });

        goAfterAuth();
      } catch (err: any) {
        if (!cancelled) setError(err.message || "Failed to verify CRM authorization");
      }
    };

    checkAndRedirect();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await checkAndRedirect();
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [navigate, next]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const verification = await verifyGoogleStaffAccess();
      if (!verification.authorized) {
        setError("Your account is not authorized to access this CRM.");
        await supabase.auth.signOut();
        return;
      }

      const sessionId = getOrCreateSessionId();
      await logLoginAttempt({
        data: {
          sessionId,
          loginMethod: "password",
          browser: "Chrome",
          os: "Windows",
          deviceType: "Desktop",
        },
      });

      goAfterAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleBusy(true);
    setError(null);
    try {
      // Preserve any intended destination across the OAuth round-trip.
      const target = safeNext(next);
      if (target) sessionStorage.setItem("admin_login_next", target);
      const { error: oauthErr } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/admin-login`,
          queryParams: { prompt: "select_account" },
        },
      });
      if (oauthErr) throw oauthErr;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google authentication failed");
      setGoogleBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white font-bold text-lg mb-2 shadow-sm">
            BHS
          </div>
          <h2 className="text-xl font-bold text-slate-900">BUSINESS HELP SERVICES</h2>
          <p className="text-xs text-slate-500 mt-0.5">Employee CRM &amp; Operations Portal</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm space-y-5">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Staff Sign In</h1>
            <p className="text-xs text-slate-500 mt-1">
              Sign in with your approved Google corporate account or staff credentials.
            </p>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleBusy || busy}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 transition"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>{googleBusy ? "Connecting to Google…" : "Continue with Google"}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[11px] uppercase font-bold text-slate-400">
              Or sign in with password
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email / Employee ID
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@udyamadhar.in"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy || googleBusy}
              className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition shadow-xs"
            >
              {busy ? "Signing in…" : "Sign In with Password"}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link to="/" className="hover:underline">
              &larr; Back to public site
            </Link>
            <span className="text-[11px] text-slate-400 font-medium">
              Secure Staff Session &bull; ISO 27001
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
