import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam.html?raw";

export const Route = createFileRoute("/download-udyam")({
  head: () => ({
    meta: [
      { title: "Udyam Free Registration - No Charges for MSME Registration — Udyam Registration Consultancy" },
      { name: "description", content: "Download Udyam Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Pra" },
      { property: "og:title", content: "Udyam Free Registration - No Charges for MSME Registration" },
      { property: "og:description", content: "Download Udyam Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Pra" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Free Registration - No Charges for MSME Registration" html={html} />,
});
