import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/print-msme-udyam-certificate.html?raw";

export const Route = createFileRoute("/print-msme-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Print MSME Udyam Certificate | Online Printing Guide — Udyam Registration Consultancy" },
      { name: "description", content: "Print MSME Udyam Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your St" },
      { property: "og:title", content: "Print MSME Udyam Certificate | Online Printing Guide" },
      { property: "og:description", content: "Print MSME Udyam Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your St" },
    ],
  }),
  component: () => <WpPage title="Print MSME Udyam Certificate | Online Printing Guide" html={html} />,
});
