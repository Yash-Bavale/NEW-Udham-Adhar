import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, PhoneCall, Sparkles } from "lucide-react";
import { z } from "zod";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { getOnboarding } from "@/lib/onboarding/onboarding.functions";

export const Route = createFileRoute("/onboarding/$leadCode/done")({
  validateSearch: (s: Record<string, unknown>) =>
    z.object({ help: z.coerce.number().optional() }).parse(s),
  head: () => ({
    meta: [
      { title: "Onboarding complete — Business Help Services" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: DonePage,
});

function DonePage() {
  const { leadCode } = Route.useParams();
  const { help } = Route.useSearch();
  const helpMode = help === 1;
  const fetchFn = useServerFn(getOnboarding);
  const { data } = useQuery({
    queryKey: ["onboarding", leadCode],
    queryFn: () => fetchFn({ data: { leadCode } }),
  });

  const hasAnyDocs = (data?.schema.documents?.length ?? 0) > 0;
  const totalSteps: 2 | 3 = hasAnyDocs ? 3 : 2;

  return (
    <OnboardingShell
      leadCode={leadCode}
      step={3}
      totalSteps={totalSteps}
      title={helpMode ? "Help is on the way" : "Form Submitted Successfully"}
    >
      <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-8 md:p-10 text-center shadow-sm">
        {/* Soft background glow */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="relative z-10 space-y-6">
          {helpMode ? (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-navy/10 ring-8 ring-brand-navy/5">
              <PhoneCall className="h-9 w-9 text-brand-navy" />
            </div>
          ) : (
            <div className="relative mx-auto h-24 w-24">
              <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
              <span className="absolute inset-2 rounded-full bg-emerald-400/20" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="h-12 w-12 text-white" strokeWidth={2.5} />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-bold font-display text-brand-navy-deep">
              {helpMode ? "We'll call you shortly" : "Your Information Is Submitted Successfully"}
            </h3>
            <p className="mx-auto max-w-md text-[15px] leading-relaxed text-foreground/80">
              {helpMode
                ? "Our expert is reaching out to help you submit the form. We'll call you on your registered mobile number as soon as possible."
                : "We have received your details. Our team will call you on your registered mobile number shortly to take the next steps."}
            </p>
          </div>

          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-4 py-1.5 text-sm text-foreground/80 border border-border shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Reference: <span className="font-mono font-semibold text-brand-navy">{leadCode}</span>
          </div>

          <div className="flex justify-center pt-2">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-brand-navy hover:bg-brand-navy-deep text-white font-semibold px-8 py-3 shadow-md shadow-brand-navy/20 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}
