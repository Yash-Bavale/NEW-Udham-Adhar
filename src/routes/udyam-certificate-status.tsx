import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-status.html?raw";

export const Route = createFileRoute("/udyam-certificate-status")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Status | Check MSME Registration Online — Business Help Services Consultancy" },
      { name: "description", content: "Udyam Certificate Status Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State " },
      { property: "og:title", content: "Udyam Certificate Status | Check MSME Registration Online" },
      { property: "og:description", content: "Udyam Certificate Status Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State " },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Status | Check MSME Registration Online" html={html} />,
});
