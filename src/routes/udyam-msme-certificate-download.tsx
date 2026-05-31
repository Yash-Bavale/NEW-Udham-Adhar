import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-msme-certificate-download.html?raw";

export const Route = createFileRoute("/udyam-msme-certificate-download")({
  head: () => ({
    meta: [
      { title: "Udyam MSME Certificate Download | Get Official PDF Online — Business Help Services Consultancy" },
      { name: "description", content: "Udyam MSME Certificate Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your" },
      { property: "og:title", content: "Udyam MSME Certificate Download | Get Official PDF Online" },
      { property: "og:description", content: "Udyam MSME Certificate Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam MSME Certificate Download | Get Official PDF Online" html={html} />,
});
