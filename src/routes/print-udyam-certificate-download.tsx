import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/print-udyam-certificate-download.html?raw";

export const Route = createFileRoute("/print-udyam-certificate-download")({
  head: () => ({
    meta: [
      { title: "Print Udyam Certificate Download | Get MSME Certificate PDF — Business Help Services Consultancy" },
      { name: "description", content: "Print Udyam Certificate Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select You" },
      { property: "og:title", content: "Print Udyam Certificate Download | Get MSME Certificate PDF" },
      { property: "og:description", content: "Print Udyam Certificate Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select You" },
    ],
  }),
  component: () => <SeoLandingPage title="Print Udyam Certificate Download | Get MSME Certificate PDF" html={html} />,
});
