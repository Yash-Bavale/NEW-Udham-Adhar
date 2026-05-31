import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-certificate.html?raw";

export const Route = createFileRoute("/msme-certificate")({
  head: () => ({
    meta: [
      { title: "MSME Certificate - Benefits and Online Registration — Udyam Registration Consultancy" },
      { name: "description", content: "MSME Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra P" },
      { property: "og:title", content: "MSME Certificate - Benefits and Online Registration" },
      { property: "og:description", content: "MSME Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra P" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Certificate - Benefits and Online Registration" html={html} />,
});
