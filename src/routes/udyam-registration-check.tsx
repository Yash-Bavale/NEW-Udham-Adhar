import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-check.html?raw";

export const Route = createFileRoute("/udyam-registration-check")({
  head: () => ({
    meta: [
      { title: "Business Help Services Check | Verify MSME Status Online — Business Help Services Consultancy" },
      { name: "description", content: "Business Help Services Check Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State " },
      { property: "og:title", content: "Business Help Services Check | Verify MSME Status Online" },
      { property: "og:description", content: "Business Help Services Check Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State " },
    ],
  }),
  component: () => <SeoLandingPage title="Business Help Services Check | Verify MSME Status Online" html={html} />,
});
