import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  listAllSeoPages,
  upsertSeoPage,
  deleteSeoPage,
  checkIsAdmin,
  type SeoPage,
} from "@/lib/seo-pages.functions";

export const Route = createFileRoute("/seo-admin")({
  head: () => ({
    meta: [
      { title: "SEO Pages Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SeoAdminPage,
});

type FormState = {
  id?: string;
  slug: string;
  label: string;
  enabled: boolean;
  sort_order: number;
};

const EMPTY: FormState = { slug: "", label: "", enabled: true, sort_order: 0 };

function SeoAdminPage() {
  const navigate = useNavigate();
  const list = useServerFn(listAllSeoPages);
  const upsert = useServerFn(upsertSeoPage);
  const remove = useServerFn(deleteSeoPage);
  const checkAdmin = useServerFn(checkIsAdmin);

  const [status, setStatus] = useState<"checking" | "ready" | "unauth" | "forbidden">(
    "checking",
  );
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const refresh = async () => {
    const data = await list();
    setPages(data);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        if (!cancelled) setStatus("unauth");
        return;
      }
      try {
        const res = await checkAdmin();
        if (cancelled) return;
        if (!res.isAdmin) {
          setStatus("forbidden");
          return;
        }
        await refresh();
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("forbidden");
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "checking") {
    return <div className="mx-auto max-w-3xl px-4 py-12 text-sm">Checking access…</div>;
  }
  if (status === "unauth") {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-sm">
        <p>You need to sign in.</p>
        <Link to="/admin-login" className="text-primary hover:underline">
          Go to admin login →
        </Link>
      </div>
    );
  }
  if (status === "forbidden") {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-sm">
        <p>Your account is not an admin.</p>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/admin-login" });
          }}
          className="text-primary hover:underline mt-2"
        >
          Sign out
        </button>
      </div>
    );
  }

  const startEdit = (p: SeoPage) => {
    setForm({
      id: p.id,
      slug: p.slug,
      label: p.label,
      enabled: p.enabled,
      sort_order: p.sort_order,
    });
    setError(null);
  };

  const resetForm = () => {
    const maxOrder = pages.reduce((m, p) => Math.max(m, p.sort_order), -1);
    setForm({ ...EMPTY, sort_order: maxOrder + 1 });
    setError(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await upsert({
        data: {
          id: form.id,
          slug: form.slug.trim().toLowerCase(),
          label: form.label.trim(),
          enabled: form.enabled,
          sort_order: Number(form.sort_order),
        },
      });
      resetForm();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (p: SeoPage) => {
    if (!confirm(`Delete "${p.label}"? This only removes it from the list, not the route file.`)) return;
    setBusy(true);
    try {
      await remove({ data: { id: p.id } });
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const toggleEnabled = async (p: SeoPage) => {
    setBusy(true);
    try {
      await upsert({
        data: {
          id: p.id,
          slug: p.slug,
          label: p.label,
          enabled: !p.enabled,
          sort_order: p.sort_order,
        },
      });
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const filtered = pages.filter(
    (p) =>
      !filter ||
      p.slug.includes(filter.toLowerCase()) ||
      p.label.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">SEO Pages Admin</h1>
          <p className="text-sm text-muted-foreground">
            Manage the hidden SEO landing pages list. Triple-click "Home" in the footer to view it on the site.
          </p>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/" });
          }}
          className="text-sm text-muted-foreground hover:text-foreground hover:underline"
        >
          Sign out
        </button>
      </div>

      <form onSubmit={onSubmit} className="rounded-lg border bg-card p-4 mb-6">
        <h2 className="font-semibold mb-3">{form.id ? "Edit page" : "Add new page"}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">Slug</label>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="udyam-registration"
              className="w-full rounded-md border px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Label</label>
            <input
              required
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="Business Help Services"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Sort order</label>
            <input
              type="number"
              min={0}
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              id="enabled"
              type="checkbox"
              checked={form.enabled}
              onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
            />
            <label htmlFor="enabled" className="text-sm">
              Enabled (visible in hidden list)
            </label>
          </div>
        </div>
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Saving…" : form.id ? "Update" : "Add page"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="flex items-center justify-between mb-3">
        <input
          placeholder="Filter by slug or label…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm w-full max-w-xs"
        />
        <p className="text-xs text-muted-foreground">
          {filtered.length} of {pages.length}
        </p>
      </div>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-3 py-2 w-16">#</th>
              <th className="px-3 py-2">Slug</th>
              <th className="px-3 py-2">Label</th>
              <th className="px-3 py-2 w-24">Status</th>
              <th className="px-3 py-2 w-48 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-2 text-muted-foreground">{p.sort_order}</td>
                <td className="px-3 py-2 font-mono text-xs">
                  <a
                    href={`/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    /{p.slug}
                  </a>
                </td>
                <td className="px-3 py-2">{p.label}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => toggleEnabled(p)}
                    disabled={busy}
                    className={`text-xs rounded px-2 py-1 ${
                      p.enabled
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {p.enabled ? "Enabled" : "Disabled"}
                  </button>
                </td>
                <td className="px-3 py-2 text-right space-x-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="text-xs text-primary hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(p)}
                    disabled={busy}
                    className="text-xs text-destructive hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
