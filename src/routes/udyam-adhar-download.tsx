import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-adhar-download.html?raw";

export const Route = createFileRoute("/udyam-adhar-download")({
  head: () => ({
    meta: [
      { title: "Udyam Adhar Download | Get MSME Udyam Certificate Online — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Adhar Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andh" },
      { property: "og:title", content: "Udyam Adhar Download | Get MSME Udyam Certificate Online" },
      { property: "og:description", content: "Udyam Adhar Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andh" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Adhar Download | Get MSME Udyam Certificate Online" html={html} />,
});
