import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getOnboarding, submitOnboarding } from "@/lib/onboarding/onboarding.functions";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

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

  const initial: Record<string, string> = {};
  const existing = (data.submission?.form_data ?? {}) as Record<string, unknown>;
  for (const f of data.schema.fields) {
    const v = existing[f.key];
    initial[f.key] = v === undefined || v === null ? "" : String(v);
  }
  initial.applicant_name ||= data.lead.name ?? "";
  initial.aadhaar_mobile ||= data.lead.mobile ?? "";

  const hasRequiredDocs = (data.schema.documents ?? []).some((d) => d.required);
  const totalSteps: 2 | 3 = hasRequiredDocs ? 3 : 2;

  return (
    <OnboardingShell
      leadCode={leadCode}
      step={1}
      totalSteps={totalSteps}
      title={data.schema.title}
      subtitle={data.schema.description}
    >
      <OnboardingForm
        schema={data.schema}
        initial={initial}
        busy={submitting}
        submitLabel={hasRequiredDocs ? "Save & Continue" : "Submit Details"}
        submittingLabel={hasRequiredDocs ? "Opening next step…" : "Submitting…"}
        successMessage={
          hasRequiredDocs
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
            await submitFn({ data: { leadCode, data: values, draft: false } });
            toast.success("Details submitted successfully");
          } catch (e) {
            const msg = e instanceof Error ? e.message : "Could not submit. Please try again.";
            toast.error(msg);
            setSubmitting(false);
            throw e;
          }
        }}
        onSubmitted={async () => {
          try {
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
