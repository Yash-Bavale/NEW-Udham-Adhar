import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-print-udyam-certificate.html?raw";

export const Route = createFileRoute("/msme-print-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "MSME Print Udyam Certificate | Download & Print Online — Business Help Services Consultancy" },
      { name: "description", content: "MSME Print Udyam Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your St" },
      { property: "og:title", content: "MSME Print Udyam Certificate | Download & Print Online" },
      { property: "og:description", content: "MSME Print Udyam Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your St" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Print Udyam Certificate | Download & Print Online" html={html} />,
});
