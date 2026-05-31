import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-govin.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-govin")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Govin – Official MSME Registration Support — Udyam Registration Consultancy" },
      { name: "description", content: "Udyog Aadhaar Govin Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhr" },
      { property: "og:title", content: "Udyog Aadhaar Govin – Official MSME Registration Support" },
      { property: "og:description", content: "Udyog Aadhaar Govin Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhr" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Govin – Official MSME Registration Support" html={html} />,
});
