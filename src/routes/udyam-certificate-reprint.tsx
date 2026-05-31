import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-reprint.html?raw";

export const Route = createFileRoute("/udyam-certificate-reprint")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Reprint | Download MSME Certificate Again — Business Help Services Consultancy" },
      { name: "description", content: "Udyam Certificate Reprint Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
      { property: "og:title", content: "Udyam Certificate Reprint | Download MSME Certificate Again" },
      { property: "og:description", content: "Udyam Certificate Reprint Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Reprint | Download MSME Certificate Again" html={html} />,
});
