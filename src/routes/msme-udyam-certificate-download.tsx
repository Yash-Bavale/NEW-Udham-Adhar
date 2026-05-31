import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-udyam-certificate-download.html?raw";

export const Route = createFileRoute("/msme-udyam-certificate-download")({
  head: () => ({
    meta: [
      { title: "MSME Udyam Certificate Download - Instant Online Access — Udyam Registration Consultancy" },
      { name: "description", content: "MSME Udyam Certificate Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your" },
      { property: "og:title", content: "MSME Udyam Certificate Download - Instant Online Access" },
      { property: "og:description", content: "MSME Udyam Certificate Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Udyam Certificate Download - Instant Online Access" html={html} />,
});
