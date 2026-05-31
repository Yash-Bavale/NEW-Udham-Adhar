import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam-certificate.html?raw";

export const Route = createFileRoute("/aadhar-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyam Certificate - Aadhaar Linked MSME Certification — Udyam Registration Consultancy" },
      { name: "description", content: "Aadhar Udyam Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State " },
      { property: "og:title", content: "Aadhar Udyam Certificate - Aadhaar Linked MSME Certification" },
      { property: "og:description", content: "Aadhar Udyam Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State " },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam Certificate - Aadhaar Linked MSME Certification" html={html} />,
});
