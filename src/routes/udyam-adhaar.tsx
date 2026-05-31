import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-adhaar.html?raw";

export const Route = createFileRoute("/udyam-adhaar")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar - Aadhaar-Based Verification for MSME Registration — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Adhaar Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prade" },
      { property: "og:title", content: "Udyam Aadhaar - Aadhaar-Based Verification for MSME Registra" },
      { property: "og:description", content: "Udyam Adhaar Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prade" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar - Aadhaar-Based Verification for MSME Registra" html={html} />,
});
