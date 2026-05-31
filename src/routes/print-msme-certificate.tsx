import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/print-msme-certificate.html?raw";

export const Route = createFileRoute("/print-msme-certificate")({
  head: () => ({
    meta: [
      { title: "Print MSME Certificate | Download Your Business Help Services Certificate — Business Help Services Consultancy" },
      { name: "description", content: "Print MSME Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State An" },
      { property: "og:title", content: "Print MSME Certificate | Download Your Business Help Services Ce" },
      { property: "og:description", content: "Print MSME Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State An" },
    ],
  }),
  component: () => <SeoLandingPage title="Print MSME Certificate | Download Your Business Help Services Ce" html={html} />,
});
