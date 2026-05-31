import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-download-pdf.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-download-pdf")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar Download PDF – Get Your MSME Certificate — Business Help Services Consultancy" },
      { name: "description", content: "Udyam Aadhaar Download PDF Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your Stat" },
      { property: "og:title", content: "Udyam Aadhaar Download PDF – Get Your MSME Certificate" },
      { property: "og:description", content: "Udyam Aadhaar Download PDF Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your Stat" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar Download PDF – Get Your MSME Certificate" html={html} />,
});
