import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-print-certificate.html?raw";

export const Route = createFileRoute("/msme-print-certificate")({
  head: () => ({
    meta: [
      { title: "MSME Print Certificate | Download & Print MSME Udyam Certificate — Udyam Registration Consultancy" },
      { name: "description", content: "MSME Print Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State An" },
      { property: "og:title", content: "MSME Print Certificate | Download & Print MSME Udyam Certifi" },
      { property: "og:description", content: "MSME Print Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State An" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Print Certificate | Download & Print MSME Udyam Certifi" html={html} />,
});
