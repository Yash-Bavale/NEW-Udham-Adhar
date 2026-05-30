import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/consent-acknowledgment")({
  head: () => ({
    meta: [
      { title: "Consents & Acknowledgements — Udyam Registration Consultancy" },
      { name: "description", content: "Consents and acknowledgements you provide when using Business Help Services for Udyam Registration." },
      { property: "og:title", content: "Consents & Acknowledgements" },
      { property: "og:description", content: "Read the consents and acknowledgements that apply to using our services." },
    ],
  }),
  component: () => (
    <PageHero title="Consents & Acknowledgements">
      <p>
        By submitting any form on this website you confirm that you have read
        and agreed to all applicable Terms &amp; Conditions, Privacy Policy,
        Refund &amp; Cancellation Policy, Disclaimer, Pricing Transparency, and
        related service policies, and you understand that Business Help Services
        is a private consultancy providing paid consultancy and assistance
        services only.
      </p>
      <p>
        You also understand that service processing may require your cooperation
        including providing correct information, documents, and OTP or
        verification inputs wherever required, and failure to do so may affect
        service delivery and refund eligibility as per policy.
      </p>
    </PageHero>
  ),
});
