import { Check, FileText, CreditCard, Send, UserCog, Award, ClipboardList } from "lucide-react";

const STEPS = [
  { key: "created_at", label: "Order Created", icon: ClipboardList },
  { key: "payment_received_at", label: "Payment Received", icon: CreditCard },
  { key: "info_submitted_at", label: "Information Submitted", icon: FileText },
  { key: "welcome_mail_at", label: "Welcome Mail Sent", icon: Send },
  { key: "expert_allocated_at", label: "Expert Allocated", icon: UserCog },
  { key: "completed_at", label: "Order Completed", icon: Award },
] as const;

function fmt(iso?: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export function OrderJourney({ journey }: { journey: Record<string, string | null> }) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface)" }}
    >
      <div
        className="text-[10px] uppercase tracking-wider mb-4"
        style={{ color: "var(--admin-fg-muted)" }}
      >
        Order Journey
      </div>
      <ol className="flex items-start gap-0 overflow-x-auto">
        {STEPS.map((s, i) => {
          const ts = journey?.[s.key] ?? null;
          const done = Boolean(ts);
          const Icon = done ? Check : s.icon;
          const color = done ? "var(--admin-success)" : "var(--admin-border)";
          return (
            <li key={s.key} className="flex items-start min-w-0">
              <div className="flex flex-col items-center gap-1.5 min-w-[120px] px-1">
                <div
                  className="size-9 rounded-full flex items-center justify-center"
                  style={{
                    background: done ? color : "var(--admin-surface-2)",
                    color: done ? "#fff" : "var(--admin-fg-muted)",
                    border: `1px solid ${color}`,
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div
                  className="text-[11px] text-center leading-tight"
                  style={{
                    color: done ? "var(--admin-fg)" : "var(--admin-fg-muted)",
                    fontWeight: done ? 600 : 400,
                  }}
                >
                  {s.label}
                </div>
                <div className="text-[10px] text-center" style={{ color: "var(--admin-fg-muted)" }}>
                  {fmt(ts) ?? "Pending"}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="h-px w-10 flex-shrink-0 mt-[18px]"
                  style={{ background: done ? "var(--admin-success)" : "var(--admin-border)" }}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
