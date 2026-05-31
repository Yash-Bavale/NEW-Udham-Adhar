import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-certificate.html?raw";

export const Route = createFileRoute("/udyog-aadhar-certificate")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Certificate - Old MSME Registration Document — Business Help Services Consultancy" },
      { name: "description", content: "Udyog Aadhar Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State " },
      { property: "og:title", content: "Udyog Aadhar Certificate - Old MSME Registration Document" },
      { property: "og:description", content: "Udyog Aadhar Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State " },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Certificate - Old MSME Registration Document" html={html} />,
});
