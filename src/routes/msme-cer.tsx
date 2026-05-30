import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/msme-cer.html?raw";

export const Route = createFileRoute("/msme-cer")({
  head: () => ({
    meta: [
      { title: "MSME Cer Download | Udyam MSME Certificate Online — Udyam Registration Consultancy" },
      { name: "description", content: "MSME Cer Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Pradesh A" },
      { property: "og:title", content: "MSME Cer Download | Udyam MSME Certificate Online" },
      { property: "og:description", content: "MSME Cer Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Pradesh A" },
    ],
  }),
  component: () => <WpPage title="MSME Cer Download | Udyam MSME Certificate Online" html={html} />,
});
