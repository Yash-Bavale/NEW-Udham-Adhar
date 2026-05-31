import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-print.html?raw";

export const Route = createFileRoute("/udyam-certificate-print")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Print | Download MSME Certificate Instantly — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Certificate Print Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
      { property: "og:title", content: "Udyam Certificate Print | Download MSME Certificate Instantl" },
      { property: "og:description", content: "Udyam Certificate Print Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Print | Download MSME Certificate Instantl" html={html} />,
});
