import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-download-certificate.html?raw";

export const Route = createFileRoute("/udyam-download-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam Download Certificate - Instant MSME Certificate Access — Business Help Services Consultancy" },
      { name: "description", content: "Udyam Download Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your Stat" },
      { property: "og:title", content: "Udyam Download Certificate - Instant MSME Certificate Access" },
      { property: "og:description", content: "Udyam Download Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your Stat" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Download Certificate - Instant MSME Certificate Access" html={html} />,
});
