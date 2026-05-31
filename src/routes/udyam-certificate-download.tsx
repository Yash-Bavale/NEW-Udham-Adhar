import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-download.html?raw";

export const Route = createFileRoute("/udyam-certificate-download")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Download - Instant MSME Certificate Access — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Certificate Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your Stat" },
      { property: "og:title", content: "Udyam Certificate Download - Instant MSME Certificate Access" },
      { property: "og:description", content: "Udyam Certificate Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your Stat" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Download - Instant MSME Certificate Access" html={html} />,
});
