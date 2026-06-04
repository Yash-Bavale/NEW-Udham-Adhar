import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, PhoneCall } from "lucide-react";
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
      title={helpMode ? "Help is on the way" : "You're all set"}
    >
      <div className="text-center space-y-4 py-4">
        {helpMode ? (
          <PhoneCall className="w-14 h-14 text-brand-navy mx-auto" />
        ) : (
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
        )}
        <p className="text-foreground">
          {helpMode
            ? "Our expert is reaching out to help you submit the form. We'll call you on your registered mobile number as soon as possible."
            : `Your details ${hasAnyDocs ? "and documents " : ""}have been submitted. Our team will contact you on your registered mobile number as soon as possible.`}
        </p>
        <p className="text-sm text-muted-foreground">
          Reference: <span className="font-mono text-brand-navy">{leadCode}</span>
        </p>
        <div className="flex gap-3 justify-center pt-2 flex-wrap">
          {hasAnyDocs && !helpMode && (
            <Link
              to="/onboarding/$leadCode/documents"
              params={{ leadCode }}
              className="rounded-full border border-border bg-background hover:bg-muted text-foreground font-medium px-6 py-2.5"
            >
              View documents
            </Link>
          )}
          <Link
            to="/"
            className="rounded-full bg-brand-navy hover:bg-brand-navy-deep text-white font-semibold px-6 py-2.5"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </OnboardingShell>
  );
}
