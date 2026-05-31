import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar.html?raw";

export const Route = createFileRoute("/udyam-aadhaar")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar - Aadhaar-Based Verification for MSME Registration — Business Help Services Consultancy" },
      { name: "description", content: "Udyam Aadhaar Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prad" },
      { property: "og:title", content: "Udyam Aadhaar - Aadhaar-Based Verification for MSME Registra" },
      { property: "og:description", content: "Udyam Aadhaar Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prad" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar - Aadhaar-Based Verification for MSME Registra" html={html} />,
});
