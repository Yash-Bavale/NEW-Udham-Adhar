import { CustomerRefGate, useCustomerLeadCode } from "@/components/site/CustomerRefGate";
import { useEffect, useState } from "react";
import { isService } from "@/lib/services/base-code";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getOnboarding, submitOnboarding } from "@/lib/onboarding/onboarding.functions";
import { useOnboardingAccess } from "@/hooks/useOnboardingAccess";
import { SecureLinkNotice } from "@/components/site/SecureLinkNotice";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";
import { CORRECT_PAN_AADHAAR_STAGE2 } from "@/lib/onboarding/schemas";

export const Route = createFileRoute("/onboarding/$leadCode/")({
  head: () => ({
    meta: [
      { title: "Complete your application — Business Help Services" },
      { name: "description", content: "Complete your Business Help Services application details and activities." },
      { property: "og:title", content: "Complete your application — Business Help Services" },
      { property: "og:description", content: "Complete your Business Help Services application details and activities." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex,nofollow" },
      { name: "referrer", content: "no-referrer" },
    ],
  }),
  component: OnboardingDetailsPageGated,
});

function OnboardingDetailsPage() {
  const leadCode = useCustomerLeadCode();
  const navigate = useNavigate();
  const fetchFn = useServerFn(getOnboarding);
  const submitFn = useServerFn(submitOnboarding);
  const [submitting, setSubmitting] = useState(false);
  const [stage, setStage] = useState<1 | 2>(1);

  const accessToken = useOnboardingAccess(leadCode);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["onboarding", leadCode, accessToken],
    queryFn: () => fetchFn({ data: { leadCode, accessToken: accessToken as string } }),
    enabled: !!accessToken,
    retry: false,
  });

  if (accessToken === null || isError) return <SecureLinkNotice leadCode={leadCode} />;
  if (accessToken === undefined || isLoading) {
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
    isService(data.serviceCode, "talk-to-expert") ||
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

  const isCorrectPan = isService(data.serviceCode, "correct-pan-aadhaar");
  const activeSchema = isCorrectPan && stage === 2 ? CORRECT_PAN_AADHAAR_STAGE2 : data.schema;

  const initial: Record<string, string> = {};
  const existing = (data.submission?.form_data ?? {}) as Record<string, unknown>;
  const schemaKeys = new Set(activeSchema.fields.map((f) => f.key));
  for (const f of activeSchema.fields) {
    const v = existing[f.key];
    initial[f.key] = v === undefined || v === null ? "" : String(v);
  }
  initial.nic_activities = typeof existing.nic_activities === "string" ? existing.nic_activities : "";
  if (schemaKeys.has("applicant_name")) initial.applicant_name ||= data.lead.name ?? "";
  // Only prefill aadhaar_mobile when the active schema actually collects it
  // (New Udyam). Other services have their own `registered_mobile` field and
  // should not have a stray `aadhaar_mobile` saved to form_data.
  if (schemaKeys.has("aadhaar_mobile")) initial.aadhaar_mobile ||= data.lead.mobile ?? "";

  // Strip UI-only `section_*` separator keys before persistence.
  const cleanPayload = (values: Record<string, unknown>): Record<string, unknown> => {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(values ?? {})) {
      const def = activeSchema.fields.find((f) => f.key === k);
      if (def?.type === "section") continue;
      if (k.startsWith("section_")) continue;
      out[k] = v;
    }
    return out;
  };

  const hasRequiredDocs = (data.schema.documents ?? []).some((d) => d.required);
  const hasStage2 = isCorrectPan;
  const totalSteps: 2 | 3 = hasRequiredDocs ? 3 : 2;
  const isFinalFormStage = !hasStage2 || stage === 2;

  return (
    <OnboardingShell
      leadCode={leadCode}
      step={1}
      totalSteps={totalSteps}
      title={activeSchema.title}
      subtitle={activeSchema.description}
      sampleFormUrl={data.schema.sample_form_url}
      sampleFormLabel={data.schema.sample_form_label}
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
          await submitFn({ data: { leadCode, accessToken: accessToken as string, data: cleanPayload(values), draft: true } });
        }}
        onSubmit={async (values) => {
          if (submitting) return;
          setSubmitting(true);
          try {
            const finalSubmit = isFinalFormStage;
            await submitFn({ data: { leadCode, accessToken: accessToken as string, data: cleanPayload(values), draft: !finalSubmit } });
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

function OnboardingDetailsPageGated() {
  return (
    <CustomerRefGate>
      <OnboardingDetailsPage />
    </CustomerRefGate>
  );
}
