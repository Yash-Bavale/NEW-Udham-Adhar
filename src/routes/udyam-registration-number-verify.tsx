import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-number-verify.html?raw";

export const Route = createFileRoute("/udyam-registration-number-verify")({
  head: () => ({
    meta: [
      { title: "Business Help Services Number Verify | MSME Certificate Validation — Business Help Services Consultancy" },
      { name: "description", content: "Business Help Services Number Verify Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select You" },
      { property: "og:title", content: "Business Help Services Number Verify | MSME Certificate Validati" },
      { property: "og:description", content: "Business Help Services Number Verify Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select You" },
    ],
  }),
  component: () => <SeoLandingPage title="Business Help Services Number Verify | MSME Certificate Validati" html={html} />,
});
