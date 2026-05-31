import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhar.html?raw";

export const Route = createFileRoute("/udyam-aadhar")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhar - Aadhaar-based MSME Registration — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Aadhar Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prade" },
      { property: "og:title", content: "Udyam Aadhar - Aadhaar-based MSME Registration" },
      { property: "og:description", content: "Udyam Aadhar Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prade" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhar - Aadhaar-based MSME Registration" html={html} />,
});
