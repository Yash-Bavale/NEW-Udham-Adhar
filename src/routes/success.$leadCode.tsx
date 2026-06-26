import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, History, Loader2, ArrowRight } from "lucide-react";
import { getApplicationSummary } from "@/lib/payments/gateways.functions";
import { trackEvent } from "@/lib/analytics/track";
import { Button } from "@/components/ui/button";
import { TrustBlock } from "@/components/site/TrustBlock";

export const Route = createFileRoute("/success/$leadCode")({
  head: () => ({
    meta: [
      { title: "Payment Successful — Business Help Services" },
      { name: "description", content: "Your payment was received successfully." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SuccessPage,
});

const PAID_STATUSES = new Set(["payment_successful", "under_process", "completed"]);

function SuccessPage() {
  const { leadCode } = Route.useParams();
  const navigate = useNavigate();
  const getSummary = useServerFn(getApplicationSummary);

  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent("payment_success_page_view", { leadCode });
    let cancelled = false;
    (async () => {
      const maxAttempts = 15;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          const res = await getSummary({ data: { leadCode } });
          if (cancelled) return;
          const isPaid = !!res?.lead?.payment || PAID_STATUSES.has(res?.lead?.status);
          if (isPaid) {
            setConfirmed(true);
            navigate({ to: "/apply/$leadCode/summary", params: { leadCode }, replace: true });
            return;
          }
        } catch (err: any) {
          if (cancelled) return;
          setError(err?.message || "Failed to load details");
          return;
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [leadCode, getSummary, navigate]);

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <History className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-brand-navy mb-2">Something went wrong</h2>
          <p className="text-slate-600 text-sm mb-6">{error}</p>
          <Button className="bg-brand-navy" onClick={() => window.location.reload()}>
            Try Refreshing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative mx-auto max-w-2xl px-4 py-12 md:py-20">
        <div className="rounded-3xl border border-border bg-card/85 backdrop-blur shadow-2xl p-8 md:p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            {confirmed ? (
              <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            ) : (
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            )}
          </div>
          <h1 className="mt-6 text-2xl md:text-3xl font-bold font-display text-foreground">
            {confirmed ? "Payment received" : "Confirming payment…"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {confirmed
              ? "Redirecting you to your application…"
              : "We're confirming the transaction with your bank. This usually takes a few seconds."}
          </p>
          <p className="mt-6 text-[11px] text-muted-foreground font-mono">
            Ref:{" "}
            <span className="text-foreground font-semibold tracking-wider">{leadCode}</span>
          </p>
          {confirmed && (
            <Link
              to="/apply/$leadCode/summary"
              params={{ leadCode }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-deep"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </section>
      <TrustBlock />
    </div>
  );
}
