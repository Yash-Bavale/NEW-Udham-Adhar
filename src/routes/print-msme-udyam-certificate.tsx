import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/print-msme-udyam-certificate.html?raw";

export const Route = createFileRoute("/print-msme-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Print MSME Udyam Certificate | Online Printing Guide — Business Help Services Consultancy" },
      { name: "description", content: "Print MSME Udyam Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your St" },
      { property: "og:title", content: "Print MSME Udyam Certificate | Online Printing Guide" },
      { property: "og:description", content: "Print MSME Udyam Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your St" },
    ],
  }),
  component: () => <SeoLandingPage title="Print MSME Udyam Certificate | Online Printing Guide" html={html} />,
});
