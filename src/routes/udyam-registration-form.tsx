import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-form.html?raw";

export const Route = createFileRoute("/udyam-registration-form")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Form - Online MSME Registration Application — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Registration Form Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
      { property: "og:title", content: "Udyam Registration Form - Online MSME Registration Applicati" },
      { property: "og:description", content: "Udyam Registration Form Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Form - Online MSME Registration Applicati" html={html} />,
});
