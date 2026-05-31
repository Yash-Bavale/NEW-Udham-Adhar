import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar.html?raw";

export const Route = createFileRoute("/udyog-aadhaar")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar - Previous MSME Registration System — Business Help Services Consultancy" },
      { name: "description", content: "Udyog Aadhaar Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prad" },
      { property: "og:title", content: "Udyog Aadhaar - Previous MSME Registration System" },
      { property: "og:description", content: "Udyog Aadhaar Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prad" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar - Previous MSME Registration System" html={html} />,
});
