import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-msme-certificate.html?raw";

export const Route = createFileRoute("/download-msme-certificate")({
  head: () => ({
    meta: [
      { title: "Download MSME Certificate - Importance and Benefits for Small Businesses — Business Help Services Consultancy" },
      { name: "description", content: "Download MSME Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
      { property: "og:title", content: "Download MSME Certificate - Importance and Benefits for Smal" },
      { property: "og:description", content: "Download MSME Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
    ],
  }),
  component: () => <SeoLandingPage title="Download MSME Certificate - Importance and Benefits for Smal" html={html} />,
});
