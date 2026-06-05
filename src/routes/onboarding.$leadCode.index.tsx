import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getOnboarding, submitOnboarding } from "@/lib/onboarding/onboarding.functions";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";
import { CORRECT_PAN_AADHAAR_STAGE2 } from "@/lib/onboarding/schemas";

export const Route = createFileRoute("/onboarding/$leadCode/")({
  head: () => ({
    meta: [
      { title: "Complete your application — Business Help Services" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: OnboardingDetailsPage,
});

function OnboardingDetailsPage() {
  const { leadCode } = Route.useParams();
  const navigate = useNavigate();
  const fetchFn = useServerFn(getOnboarding);
  const submitFn = useServerFn(submitOnboarding);
  const [submitting, setSubmitting] = useState(false);
  const [stage, setStage] = useState<1 | 2>(1);

  const { data, isLoading } = useQuery({
    queryKey: ["onboarding", leadCode],
    queryFn: () => fetchFn({ data: { leadCode } }),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
      </div>
    );
  }
  if (!data) return null;

  // Talk-to-Expert is a paid consultation — no intake form after payment.
  // Send the user straight to the thank-you screen.
  const isTalkToExpert =
    data.serviceCode === "talk-to-expert" ||
    data.lead.service === "Expert Consultation" ||
    data.lead.service === "Talk to Expert – Suitable Service Selection";
  if (data.lead.paid && isTalkToExpert) {
    return <TalkToExpertRedirect leadCode={leadCode} />;
  }

  if (!data.lead.paid) {
    return (
      <OnboardingShell leadCode={leadCode} step={1} totalSteps={2} title="Payment required">
        <p className="text-sm text-foreground">
          We haven't received your consultancy fee yet. Please complete the payment first.
        </p>
        <Link
          to="/payment/$leadCode"
          params={{ leadCode }}
          className="mt-4 inline-flex rounded-full bg-brand-navy hover:bg-brand-navy-deep text-white font-semibold px-6 py-2.5"
        >
          Go to Payment
        </Link>
      </OnboardingShell>
    );
  }

  const isCorrectPan = data.serviceCode === "correct-pan-aadhaar";
  const activeSchema = isCorrectPan && stage === 2 ? CORRECT_PAN_AADHAAR_STAGE2 : data.schema;

  const initial: Record<string, string> = {};
  const existing = (data.submission?.form_data ?? {}) as Record<string, unknown>;
  for (const f of activeSchema.fields) {
    const v = existing[f.key];
    initial[f.key] = v === undefined || v === null ? "" : String(v);
  }
  initial.applicant_name ||= data.lead.name ?? "";
  initial.aadhaar_mobile ||= data.lead.mobile ?? "";

  const hasRequiredDocs = (data.schema.documents ?? []).some((d) => d.required);
  const hasStage2 = isCorrectPan;
  const totalSteps: 2 | 3 = hasRequiredDocs || hasStage2 ? 3 : 2;
  const isFinalFormStage = !hasStage2 || stage === 2;

  return (
    <OnboardingShell
      leadCode={leadCode}
      step={1}
      totalSteps={totalSteps}
      title={activeSchema.title}
      subtitle={activeSchema.description}
    >
      {hasStage2 && (
        <div className="mb-4 flex items-center gap-2 text-xs font-medium">
          <span className={`px-3 py-1 rounded-full ${stage === 1 ? "bg-brand-navy text-white" : "bg-emerald-100 text-emerald-700"}`}>
            Stage 1 — Basic Details
          </span>
          <span className="text-muted-foreground">→</span>
          <span className={`px-3 py-1 rounded-full ${stage === 2 ? "bg-brand-navy text-white" : "bg-muted text-muted-foreground"}`}>
            Stage 2 — Enterprise Details
          </span>
        </div>
      )}
      <OnboardingForm
        key={hasStage2 ? `stage-${stage}` : "single"}
        schema={activeSchema}
        initial={initial}
        busy={submitting}
        submitLabel={
          hasStage2 && stage === 1
            ? "Save & Continue to Stage 2"
            : hasRequiredDocs
            ? "Save & Continue"
            : "Submit Details"
        }
        submittingLabel={
          hasStage2 && stage === 1 ? "Opening Stage 2…" : hasRequiredDocs ? "Opening next step…" : "Submitting…"
        }
        successMessage={
          hasStage2 && stage === 1
            ? "Saved. Opening Stage 2 — Enterprise details…"
            : hasRequiredDocs
            ? "Details submitted. Continue to document upload…"
            : "Details submitted successfully. Finalising…"
        }
        onSaveDraft={async (values) => {
          await submitFn({ data: { leadCode, data: values, draft: true } });
        }}
        onSubmit={async (values) => {
          if (submitting) return;
          setSubmitting(true);
          try {
            const finalSubmit = isFinalFormStage;
            await submitFn({ data: { leadCode, data: values, draft: !finalSubmit } });
            if (finalSubmit) toast.success("Details submitted successfully");
          } catch (e) {
            const msg = e instanceof Error ? e.message : "Could not submit. Please try again.";
            toast.error(msg);
            setSubmitting(false);
            throw e;
          }
        }}
        onSubmitted={async () => {
          try {
            if (hasStage2 && stage === 1) {
              setStage(2);
              window.scrollTo({ top: 0, behavior: "smooth" });
              return;
            }
            await navigate({
              to: hasRequiredDocs
                ? "/onboarding/$leadCode/documents"
                : "/onboarding/$leadCode/done",
              params: { leadCode },
              replace: true,
            });
          } finally {
            setSubmitting(false);
          }
        }}
      />
    </OnboardingShell>
  );
}

function TalkToExpertRedirect({ leadCode }: { leadCode: string }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({
      to: "/onboarding/$leadCode/done",
      params: { leadCode },
      replace: true,
    });
  }, [leadCode, navigate]);
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
    </div>
  );
}
