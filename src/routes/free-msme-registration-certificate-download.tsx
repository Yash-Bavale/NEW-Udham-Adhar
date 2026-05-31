import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/free-msme-registration-certificate-download.html?raw";

export const Route = createFileRoute("/free-msme-registration-certificate-download")({
  head: () => ({
    meta: [
      { title: "MSME Registration Certificate Download - Get Your Certificate Online — Business Help Services Consultancy" },
      { name: "description", content: "Free MSME Registration Certificate Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य" },
      { property: "og:title", content: "MSME Registration Certificate Download - Get Your Certificat" },
      { property: "og:description", content: "Free MSME Registration Certificate Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Certificate Download - Get Your Certificat" html={html} />,
});
