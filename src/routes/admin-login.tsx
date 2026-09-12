import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
      { title: "Admin Login" },
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
  const [error, setError] = useState<string | null>(null);

  const goAfterAuth = () => {
    const target = safeNext(next);
    window.location.href = target || "/admin";
  };

  // Redirect away if already signed in. Use getUser() so we await session
  // hydration (getSession() can return null on first paint). Also listen
  // for auth state changes so a sign-in elsewhere navigates immediately.
  useEffect(() => {
    let cancelled = false;

    supabase.auth.getUser().then(({ data, error }) => {
      if (!cancelled && !error && data.user) goAfterAuth();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) goAfterAuth();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, next]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      goAfterAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-bold">Admin Sign In</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in with your staff credentials. New accounts are created by an
          existing admin from the Users panel.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-xs text-muted-foreground">
          <Link to="/" className="hover:underline">
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
