import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Lock, CheckCircle2 } from "lucide-react";
import { getApplicationSummary } from "@/lib/payments/gateways.functions";

export const Route = createFileRoute("/apply/$leadCode/summary")({
  head: () => ({
    meta: [
      { title: "Application Summary — Business Help Services" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SummaryPage,
});

function SummaryPage() {
  const { leadCode } = Route.useParams();
  const fn = useServerFn(getApplicationSummary);
  const { data, isLoading, error } = useQuery({
    queryKey: ["apply.summary", leadCode],
    queryFn: () => fn({ data: { leadCode } }),
  });
  const [chosen, setChosen] = useState<string | null>(null);

  if (isLoading) {
    return <div className="mx-auto max-w-2xl px-4 py-10 text-sm text-muted-foreground">Loading your application…</div>;
  }
  if (error || !data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error instanceof Error ? error.message : "Could not load your application."}
        </div>
      </div>
    );
  }

  const { lead, gateways } = data;
  const payu = gateways.find((g) => g.name === "payu");
  const activeGateway = chosen ?? payu?.name ?? gateways[0]?.name ?? null;

  return (
    <section className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="bg-form-header text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold font-display">Application Summary</h1>
            <p className="text-xs text-white/80">Ref: {lead.leadCode}</p>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Lock className="w-3.5 h-3.5" /> Secure
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <Field label="Service" value={lead.service} />
            <Field label="Applicant" value={lead.name} />
            <Field label="Email" value={lead.email} />
            <Field label="Mobile" value={`+91 ${lead.mobile}`} />
          </div>

          <div className="rounded-xl bg-muted/40 border border-border p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Total payable</span>
            <span className="text-2xl font-bold text-brand-navy">
              ₹{lead.totalAmount.toFixed(2)}
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Choose payment method</h2>
            <div className="space-y-2">
              {gateways.map((g) => {
                const supported = g.name === "payu";
                const selected = activeGateway === g.name;
                return (
                  <label
                    key={g.name}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                      selected ? "border-brand-navy bg-brand-navy/5" : "border-border bg-background"
                    } ${supported ? "" : "opacity-60 cursor-not-allowed"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="gateway"
                        value={g.name}
                        checked={selected}
                        disabled={!supported}
                        onChange={() => supported && setChosen(g.name)}
                        className="accent-brand-navy"
                      />
                      <span className="text-sm font-medium">{g.display_name}</span>
                      {supported && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    {!supported && (
                      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        Coming soon
                      </span>
                    )}
                  </label>
                );
              })}
              {gateways.length === 0 && (
                <p className="text-sm text-muted-foreground">No payment methods are enabled. Please contact support.</p>
              )}
            </div>
          </div>

          {activeGateway === "payu" ? (
            <Link
              to="/payment/$leadCode"
              params={{ leadCode: lead.leadCode }}
              className="block w-full text-center rounded-full bg-brand-navy hover:bg-brand-navy-deep text-white font-semibold py-3 transition-colors"
            >
              Pay ₹{lead.totalAmount.toFixed(2)} now
            </Link>
          ) : (
            <button
              disabled
              className="block w-full rounded-full bg-muted text-muted-foreground font-semibold py-3 cursor-not-allowed"
            >
              Select an active payment method
            </button>
          )}

          <p className="text-center text-[11px] text-muted-foreground">
            By proceeding you agree to our terms and refund policy.
          </p>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}
