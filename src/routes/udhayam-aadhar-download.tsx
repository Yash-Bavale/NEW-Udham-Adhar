import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udhayam-aadhar-download.html?raw";

export const Route = createFileRoute("/udhayam-aadhar-download")({
  head: () => ({
    meta: [
      { title: "Udhayam Aadhar Download | MSME Udyam Certificate PDF — Udyam Registration Consultancy" },
      { name: "description", content: "Udhayam Aadhar Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
      { property: "og:title", content: "Udhayam Aadhar Download | MSME Udyam Certificate PDF" },
      { property: "og:description", content: "Udhayam Aadhar Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
    ],
  }),
  component: () => <SeoLandingPage title="Udhayam Aadhar Download | MSME Udyam Certificate PDF" html={html} />,
});
