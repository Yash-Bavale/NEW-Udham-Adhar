import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { Pencil, Eye, X } from "lucide-react";
import { listEmailTemplates, saveEmailTemplate, toggleEmailTemplate } from "@/lib/emails/emails.functions";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRole } from "@/hooks/useRole";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/email-templates")({
  head: () => ({
    meta: [
      { title: "Email Templates — Udyam Ops OS" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: EmailTemplatesPage,
});

const VARIABLES = [
  "customer_name",
  "order_number",
  "service_name",
  "invoice_url",
  "form_link",
  "document_checklist",
  "complaint_number",
  "refund_amount",
  "refund_reason",
  "refund_gateway_ref",
  "rejection_reason",
  "executive_name",
  "followup_date",
  "authority_name",
  "authority_reference",
  "expected_update_date",
  "ticket_number",
  "subject",
];

type Tpl = {
  id: string;
  code: string;
  name: string;
  subject: string;
  body_html: string;
  body_text: string | null;
  description: string | null;
  variables: string[] | null;
  is_enabled: boolean;
  is_system: boolean;
  updated_at: string;
  last_sent_at: string | null;
  total_sent: number;
};

function formatIST(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const fmt = new Intl.DateTimeFormat("en-IN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
      timeZone: "Asia/Kolkata",
    }).formatToParts(d);
    const get = (t: string) => fmt.find((p) => p.type === t)?.value ?? "";
    return `${get("day")}-${get("month")}-${get("year")} ${get("hour")}:${get("minute")} ${get("dayPeriod").toUpperCase()}`;
  } catch { return "—"; }
}

function EmailTemplatesPage() {
  const role = useRole();
  const qc = useQueryClient();
  const list = useServerFn(listEmailTemplates);
  const toggleFn = useServerFn(toggleEmailTemplate);
  const { data, isLoading } = useQuery({
    queryKey: ["admin.email-templates"],
    queryFn: () => list({ data: {} as never }),
  });
  const [editing, setEditing] = useState<Tpl | null>(null);
  const [previewing, setPreviewing] = useState<Tpl | null>(null);
  const [disableTarget, setDisableTarget] = useState<Tpl | null>(null);

  const canToggle = role.has("admin") || role.has("super_admin");
  const rows: Tpl[] = (data?.rows as Tpl[] | undefined) ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">Email Templates</h1>
        <p className="text-sm text-slate-500">
          Manage system-wide transactional email templates. Use {"{{variable}}"} placeholders.
        </p>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-3 py-2 font-medium">Code</th>
              <th className="text-left px-3 py-2 font-medium">Name</th>
              <th className="text-left px-3 py-2 font-medium">Subject</th>
              <th className="text-left px-3 py-2 font-medium">Status</th>
              <th className="text-left px-3 py-2 font-medium">Last Sent</th>
              <th className="text-right px-3 py-2 font-medium">Sent</th>
              <th className="text-right px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading && (
              <tr><td colSpan={7} className="px-3 py-6 text-center text-slate-500">Loading…</td></tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={7} className="px-3 py-6 text-center text-slate-500">No templates yet.</td></tr>
            )}
            {rows.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-3 py-2 font-mono text-xs">{t.code}</td>
                <td className="px-3 py-2">{t.name}</td>
                <td className="px-3 py-2 text-slate-600 truncate max-w-[24rem]">{t.subject}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={t.is_enabled}
                      disabled={!canToggle}
                      onCheckedChange={async (v) => {
                        if (!v) { setDisableTarget(t); return; }
                        try {
                          await toggleFn({ data: { code: t.code, enabled: true } });
                          toast.success(`Enabled ${t.name}`);
                          qc.invalidateQueries({ queryKey: ["admin.email-templates"] });
                        } catch (e) { toast.error((e as Error).message); }
                      }}
                    />
                    <span className="text-[11px]" style={{ color: t.is_enabled ? "#047857" : "#94a3b8" }}>
                      {t.is_enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 text-slate-500 text-xs whitespace-nowrap">{formatIST(t.last_sent_at)}</td>
                <td className="px-3 py-2 text-right text-xs">{t.total_sent ?? 0}</td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  <button
                    onClick={() => setPreviewing(t)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded border text-xs hover:bg-slate-100 mr-1"
                  >
                    <Eye className="size-3.5" /> Preview
                  </button>
                  <button
                    onClick={() => setEditing(t)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded border text-xs hover:bg-slate-100"
                  >
                    <Pencil className="size-3.5" /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <EditorDrawer tpl={editing} onClose={() => setEditing(null)} />}
      {previewing && <PreviewDialog tpl={previewing} onClose={() => setPreviewing(null)} />}
      {disableTarget && (
        <DisableConfirmDialog
          tpl={disableTarget}
          onClose={() => setDisableTarget(null)}
          onConfirmed={() => { setDisableTarget(null); qc.invalidateQueries({ queryKey: ["admin.email-templates"] }); }}
        />
      )}
    </div>
  );
}

function DisableConfirmDialog({ tpl, onClose, onConfirmed }: { tpl: Tpl; onClose: () => void; onConfirmed: () => void }) {
  const toggleFn = useServerFn(toggleEmailTemplate);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  async function confirm() {
    setBusy(true);
    try {
      await toggleFn({ data: { code: tpl.code, enabled: false, reason: reason || undefined } });
      toast.success(`Disabled ${tpl.name}`);
      onConfirmed();
    } catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  }
  return (
    <Dialog open onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>Disable template?</DialogTitle></DialogHeader>
        <div className="space-y-3 text-sm">
          <p>
            Disabling <b>{tpl.name}</b> means <span className="font-mono text-xs">{tpl.code}</span> emails will <b>not</b> be sent.
            Queued items will be skipped silently. Are you sure?
          </p>
          <div className="space-y-1">
            <Label className="text-xs">Reason (optional)</Label>
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Pausing during MSME portal downtime" rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button onClick={confirm} disabled={busy} style={{ background: "#b91c1c" }}>
            {busy ? "Disabling…" : "Disable Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditorDrawer({ tpl, onClose }: { tpl: Tpl; onClose: () => void }) {
  const save = useServerFn(saveEmailTemplate);
  const qc = useQueryClient();
  const [name, setName] = useState(tpl.name);
  const [subject, setSubject] = useState(tpl.subject);
  const [bodyHtml, setBodyHtml] = useState(tpl.body_html);
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const insertVar = (v: string) => {
    const el = bodyRef.current;
    const token = `{{${v}}}`;
    if (!el) {
      setBodyHtml((s) => s + token);
      return;
    }
    const start = el.selectionStart ?? bodyHtml.length;
    const end = el.selectionEnd ?? bodyHtml.length;
    const next = bodyHtml.slice(0, start) + token + bodyHtml.slice(end);
    setBodyHtml(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + token.length, start + token.length);
    });
  };

  const handleSave = async () => {
    setBusy(true);
    try {
      await save({
        data: {
          id: tpl.id,
          code: tpl.code,
          name,
          subject,
          body_html: bodyHtml,
          body_text: tpl.body_text ?? null,
          description: tpl.description ?? null,
          variables: tpl.variables ?? [],
          is_enabled: tpl.is_enabled,
        },
      });
      toast.success("Template saved");
      await qc.invalidateQueries({ queryKey: ["admin.email-templates"] });
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative ml-auto h-full w-full max-w-5xl bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <div className="text-xs font-mono text-slate-500">{tpl.code}</div>
            <div className="text-sm font-medium">Edit template</div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100"><X className="size-4" /></button>
        </div>

        <div className="flex-1 min-h-0 flex">
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            <Field label="Template Code">
              <input value={tpl.code} disabled className="w-full border rounded px-2 py-1.5 text-sm font-mono bg-slate-50 text-slate-500" />
            </Field>
            <Field label="Name">
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-2 py-1.5 text-sm" />
            </Field>
            <Field label="Subject">
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full border rounded px-2 py-1.5 text-sm" />
            </Field>
            <Field label="Body (HTML)">
              <textarea
                ref={bodyRef}
                value={bodyHtml}
                onChange={(e) => setBodyHtml(e.target.value)}
                rows={20}
                className="w-full border rounded px-2 py-1.5 text-xs font-mono leading-relaxed"
              />
            </Field>
          </div>

          <aside className="w-64 border-l bg-slate-50 p-3 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-700 mb-2">Available variables</div>
            <p className="text-[11px] text-slate-500 mb-3">Click to insert at cursor.</p>
            <div className="flex flex-wrap gap-1.5">
              {VARIABLES.map((v) => (
                <button
                  key={v}
                  onClick={() => insertVar(v)}
                  className="text-[11px] font-mono px-2 py-1 rounded border bg-white hover:bg-slate-100"
                  title={`Insert {{${v}}}`}
                >
                  {`{{${v}}}`}
                </button>
              ))}
            </div>
          </aside>
        </div>

        <div className="border-t px-4 py-3 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded border text-sm">Cancel</button>
          <button
            onClick={handleSave}
            disabled={busy}
            className="px-3 py-1.5 rounded bg-slate-900 text-white text-sm disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-slate-600 mb-1">{label}</div>
      {children}
    </label>
  );
}

function PreviewDialog({ tpl, onClose }: { tpl: Tpl; onClose: () => void }) {
  const sampleData = useMemo<Record<string, string>>(
    () => ({
      customer_name: "Rahul Sharma",
      order_number: "SMV000123",
      service_name: "New Udyam Registration",
      invoice_url: "https://example.com/invoice.pdf",
      form_link: "https://example.com/onboarding/UA-2026-000123",
      document_checklist: "Aadhaar, PAN, Bank Proof",
      complaint_number: "CMP-000045",
      refund_amount: "1,499",
      refund_reason: "Service not required",
      refund_gateway_ref: "rfnd_abc123xyz",
      rejection_reason: "Service already initiated",
      executive_name: "Anita Verma",
      followup_date: "28 Jun 2026",
      authority_name: "MSME Ministry",
      authority_reference: "REF/2026/00078",
      expected_update_date: "30 Jun 2026",
      ticket_number: "TKT-2026-00012",
      subject: "Unable to download certificate",
    }),
    [],
  );

  const render = (s: string) =>
    s.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, k) => sampleData[k] ?? `{{${k}}}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-500">{tpl.code}</div>
            <div className="text-sm font-medium">{tpl.name}</div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100"><X className="size-4" /></button>
        </div>
        <div className="px-4 py-3 border-b bg-slate-50">
          <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">Subject</div>
          <div className="text-sm">{render(tpl.subject)}</div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: render(tpl.body_html) }}
          />
        </div>
      </div>
    </div>
  );
}
