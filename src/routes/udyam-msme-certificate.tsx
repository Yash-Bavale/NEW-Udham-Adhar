import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-msme-certificate.html?raw";

export const Route = createFileRoute("/udyam-msme-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam MSME Certificate — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam MSME Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Pradesh" },
      { property: "og:title", content: "Udyam MSME Certificate" },
      { property: "og:description", content: "Udyam MSME Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Pradesh" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam MSME Certificate" html={html} />,
});
