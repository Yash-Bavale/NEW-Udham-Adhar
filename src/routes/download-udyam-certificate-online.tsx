import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam-certificate-online.html?raw";

export const Route = createFileRoute("/download-udyam-certificate-online")({
  head: () => ({
    meta: [
      { title: "Download Udyam Certificate Online | Get MSME Certificate PDF — Udyam Registration Consultancy" },
      { name: "description", content: "Download Udyam Certificate Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Yo" },
      { property: "og:title", content: "Download Udyam Certificate Online | Get MSME Certificate PDF" },
      { property: "og:description", content: "Download Udyam Certificate Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Yo" },
    ],
  }),
  component: () => <SeoLandingPage title="Download Udyam Certificate Online | Get MSME Certificate PDF" html={html} />,
});
