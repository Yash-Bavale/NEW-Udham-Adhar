import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-download.html?raw";

export const Route = createFileRoute("/udyog-aadhar-download")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Download - Get Your Old MSME Certificate — Udyam Registration Consultancy" },
      { name: "description", content: "Udyog Aadhar Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State And" },
      { property: "og:title", content: "Udyog Aadhar Download - Get Your Old MSME Certificate" },
      { property: "og:description", content: "Udyog Aadhar Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State And" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Download - Get Your Old MSME Certificate" html={html} />,
});
