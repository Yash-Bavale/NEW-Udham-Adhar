import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-certificate-download.html?raw";

export const Route = createFileRoute("/msme-registration-certificate-download")({
  head: () => ({
    meta: [
      { title: "MSME Registration Certificate Download – Get Udyam Certificate PDF — Udyam Registration Consultancy" },
      { name: "description", content: "MSME Registration Certificate Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Sele" },
      { property: "og:title", content: "MSME Registration Certificate Download – Get Udyam Certifica" },
      { property: "og:description", content: "MSME Registration Certificate Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Sele" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Certificate Download – Get Udyam Certifica" html={html} />,
});
