import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/msme-certificate-print.html?raw";

export const Route = createFileRoute("/msme-certificate-print")({
  head: () => ({
    meta: [
      { title: "MSME Certificate Print Online | Download Udyam/MSME Certificate — Udyam Registration Consultancy" },
      { name: "description", content: "MSME Certificate Print Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State An" },
      { property: "og:title", content: "MSME Certificate Print Online | Download Udyam/MSME Certific" },
      { property: "og:description", content: "MSME Certificate Print Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State An" },
    ],
  }),
  component: () => <WpPage title="MSME Certificate Print Online | Download Udyam/MSME Certific" html={html} />,
});
