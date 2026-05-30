import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/msme-certificate-download.html?raw";

export const Route = createFileRoute("/msme-certificate-download")({
  head: () => ({
    meta: [
      { title: "MSME Certificate Download - Get Your MSME Certificate Online — Udyam Registration Consultancy" },
      { name: "description", content: "MSME Certificate Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
      { property: "og:title", content: "MSME Certificate Download - Get Your MSME Certificate Online" },
      { property: "og:description", content: "MSME Certificate Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
    ],
  }),
  component: () => <WpPage title="MSME Certificate Download - Get Your MSME Certificate Online" html={html} />,
});
