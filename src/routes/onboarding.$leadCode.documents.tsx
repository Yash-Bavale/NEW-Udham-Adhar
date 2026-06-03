import { useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getOnboarding } from "@/lib/onboarding/onboarding.functions";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { DocumentUploader } from "@/components/onboarding/DocumentUploader";

export const Route = createFileRoute("/onboarding/$leadCode/documents")({
  head: () => ({
    meta: [
      { title: "Upload documents — Business Help Services" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: DocsPage,
});

function DocsPage() {
  const { leadCode } = Route.useParams();
  const navigate = useNavigate();
  const fetchFn = useServerFn(getOnboarding);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["onboarding", leadCode],
    queryFn: () => fetchFn({ data: { leadCode } }),
  });

  const hasNoDocuments = data ? (data.schema.documents?.length ?? 0) === 0 : false;

  useEffect(() => {
    if (!hasNoDocuments) return;
    navigate({ to: "/onboarding/$leadCode/done", params: { leadCode }, replace: true });
  }, [hasNoDocuments, leadCode, navigate]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
      </div>
    );
  }
  if (!data) return null;

  // If this service requires no documents at all, skip straight to done.
  if (hasNoDocuments) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
      </div>
    );
  }

  const requiredDocs = data.schema.documents.filter((d) => d.required);
  const allRequiredUploaded = requiredDocs.every((d) =>
    data.documents.some((u) => u.doc_type === d.key),
  );
  const totalSteps: 2 | 3 = requiredDocs.length > 0 ? 3 : 3;
  );

  return (
    <OnboardingShell
      leadCode={leadCode}
      step={2}
      title="Upload supporting documents"
      subtitle="Clear photos or scans only. Max 5 MB each. PDF, JPG, PNG or WEBP."
    >
      <DocumentUploader
        leadCode={leadCode}
        docs={data.schema.documents}
        existing={data.documents}
        onChanged={async () => { await refetch(); }}
      />

      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between items-stretch sm:items-center pt-6 mt-6 border-t border-border">
        <Link
          to="/onboarding/$leadCode"
          params={{ leadCode }}
          className="text-sm text-brand-navy hover:underline text-center sm:text-left"
        >
          ← Edit details
        </Link>
        <button
          disabled={!allRequiredUploaded && requiredDocs.length > 0}
          onClick={() => {
            toast.success("Documents step completed");
            navigate({ to: "/onboarding/$leadCode/done", params: { leadCode }, replace: true });
          }}
          className="rounded-full bg-brand-navy hover:bg-brand-navy-deep text-white font-semibold px-8 py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {requiredDocs.length === 0 || allRequiredUploaded ? "Continue" : "Upload required documents to continue"}
        </button>
      </div>
    </OnboardingShell>
  );
}
