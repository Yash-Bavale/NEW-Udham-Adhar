import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/print-msme-certificate.html?raw";

export const Route = createFileRoute("/print-msme-certificate")({
  head: () => ({
    meta: [
      { title: "Print MSME Certificate | Download Your Udyam Registration Certificate — Udyam Registration Consultancy" },
      { name: "description", content: "Print MSME Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State An" },
      { property: "og:title", content: "Print MSME Certificate | Download Your Udyam Registration Ce" },
      { property: "og:description", content: "Print MSME Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State An" },
    ],
  }),
  component: () => <WpPage title="Print MSME Certificate | Download Your Udyam Registration Ce" html={html} />,
});
