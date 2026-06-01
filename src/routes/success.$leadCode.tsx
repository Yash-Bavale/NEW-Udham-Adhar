import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { trackEvent } from "@/lib/analytics/track";

export const Route = createFileRoute("/success/$leadCode")({
  head: () => ({
    meta: [
      { title: "Payment Successful — Business Help Services Consultancy" },
      { name: "description", content: "Your consultancy fee has been received. Our team will contact you shortly." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { leadCode } = Route.useParams();
  useEffect(() => {
    trackEvent("payment_success", { leadCode });
  }, [leadCode]);
  return (
    <PageHero title="Payment Successful">
      <p>
        Thank you — your consultancy fee has been received and your request has
        been confirmed.
      </p>
      <p>
        Your reference number is{" "}
        <strong className="font-mono text-brand-navy">{leadCode}</strong>.
        Please save it for any future communication.
      </p>
      <p>
        <strong>Next step:</strong> complete a short onboarding form and upload
        your supporting documents so our expert can start work right away.
      </p>
      <p className="mt-4 flex flex-wrap gap-3">
        <Link
          to="/onboarding/$leadCode"
          params={{ leadCode }}
          className="inline-flex items-center rounded-full bg-brand-navy hover:bg-brand-navy-deep text-white font-semibold px-6 py-2.5 transition-colors"
        >
          Continue to onboarding →
        </Link>
        <Link to="/contact" className="inline-flex items-center text-brand-navy underline px-2 py-2">
          Contact us
        </Link>
      </p>
    </PageHero>
  );
}
