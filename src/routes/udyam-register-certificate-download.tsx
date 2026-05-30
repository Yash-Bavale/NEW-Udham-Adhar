import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-register-certificate-download.html?raw";

export const Route = createFileRoute("/udyam-register-certificate-download")({
  head: () => ({
    meta: [
      { title: "Udyam Register Certificate Download - Download MSME Certificate Online — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Register Certificate Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select " },
      { property: "og:title", content: "Udyam Register Certificate Download - Download MSME Certific" },
      { property: "og:description", content: "Udyam Register Certificate Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select " },
    ],
  }),
  component: () => <WpPage title="Udyam Register Certificate Download - Download MSME Certific" html={html} />,
});
