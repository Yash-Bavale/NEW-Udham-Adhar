import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-certificate-download.html?raw";

export const Route = createFileRoute("/udyog-aadhar-certificate-download")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Certificate Download - Get Your Old MSME Document — Business Help Services Consultancy" },
      { name: "description", content: "Udyog Aadhar Certificate Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Yo" },
      { property: "og:title", content: "Udyog Aadhar Certificate Download - Get Your Old MSME Docume" },
      { property: "og:description", content: "Udyog Aadhar Certificate Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Yo" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Certificate Download - Get Your Old MSME Docume" html={html} />,
});
