import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-form.html?raw";

export const Route = createFileRoute("/udyam-registration-form")({
  head: () => ({
    meta: [
      { title: "Fill application - Online MSME Registration Application — Business Help Services Consultancy" },
      { name: "description", content: "Fill application Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
      { property: "og:title", content: "Fill application - Online MSME Registration Applicati" },
      { property: "og:description", content: "Fill application Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
    ],
  }),
  component: () => <SeoLandingPage title="Fill application - Online MSME Registration Applicati" html={html} />,
});
