import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-status.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-status")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar Status | Track Your MSME Registration Online — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Aadhaar Status Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andh" },
      { property: "og:title", content: "Udyam Aadhaar Status | Track Your MSME Registration Online" },
      { property: "og:description", content: "Udyam Aadhaar Status Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andh" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar Status | Track Your MSME Registration Online" html={html} />,
});
