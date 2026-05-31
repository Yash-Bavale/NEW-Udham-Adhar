import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-download.html?raw";

export const Route = createFileRoute("/udyam-download")({
  head: () => ({
    meta: [
      { title: "Udyam Download - Download MSME Registration Certificate — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Pra" },
      { property: "og:title", content: "Udyam Download - Download MSME Registration Certificate" },
      { property: "og:description", content: "Udyam Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Pra" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Download - Download MSME Registration Certificate" html={html} />,
});
