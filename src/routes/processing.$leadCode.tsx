import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/processing/$leadCode")({
  head: () => ({
    meta: [
      { title: "Generating Your Lead — Please Wait" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ProcessingPage,
});

function ProcessingPage() {
  const { leadCode } = Route.useParams();
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds <= 0) {
      navigate({ to: "/payment/$leadCode", params: { leadCode } });
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, leadCode, navigate]);

  const pct = ((30 - seconds) / 30) * 100;

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="rounded-2xl border border-border bg-card shadow-sm p-8 md:p-12">
        <div className="mx-auto w-24 h-24 rounded-full border-4 border-brand-navy/20 border-t-brand-navy animate-spin" />
        <h1 className="mt-6 text-2xl md:text-3xl font-bold font-display text-foreground">
          Your information is being processed
        </h1>
        <p className="mt-3 text-muted-foreground">
          Please wait while we securely generate your application reference.
          Do not close or refresh this page.
        </p>

        <div className="mt-8">
          <div className="text-5xl font-bold font-display text-brand-navy tabular-nums">
            {seconds}s
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-brand-navy transition-all duration-1000 ease-linear"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Reference: <span className="font-mono">{leadCode}</span>
          </p>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          You will be redirected to the payment page automatically.
        </p>
      </div>
    </section>
  );
}
