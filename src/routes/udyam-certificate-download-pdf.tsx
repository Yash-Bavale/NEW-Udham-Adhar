import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-download-pdf.html?raw";

export const Route = createFileRoute("/udyam-certificate-download-pdf")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Download PDF | Get MSME Certificate Online — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Certificate Download PDF Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your " },
      { property: "og:title", content: "Udyam Certificate Download PDF | Get MSME Certificate Online" },
      { property: "og:description", content: "Udyam Certificate Download PDF Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your " },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Download PDF | Get MSME Certificate Online" html={html} />,
});
