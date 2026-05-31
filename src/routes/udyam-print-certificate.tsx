import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-print-certificate.html?raw";

export const Route = createFileRoute("/udyam-print-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam Print Certificate | MSME Certificate Printing Guide — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Print Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
      { property: "og:title", content: "Udyam Print Certificate | MSME Certificate Printing Guide" },
      { property: "og:description", content: "Udyam Print Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Print Certificate | MSME Certificate Printing Guide" html={html} />,
});
