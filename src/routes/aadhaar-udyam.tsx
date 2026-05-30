import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/aadhaar-udyam.html?raw";

export const Route = createFileRoute("/aadhaar-udyam")({
  head: () => ({
    meta: [
      { title: "Aadhaar Udyam - Aadhaar Based MSME Registration Verification — Udyam Registration Consultancy" },
      { name: "description", content: "Aadhaar Udyam Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prad" },
      { property: "og:title", content: "Aadhaar Udyam - Aadhaar Based MSME Registration Verification" },
      { property: "og:description", content: "Aadhaar Udyam Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prad" },
    ],
  }),
  component: () => <WpPage title="Aadhaar Udyam - Aadhaar Based MSME Registration Verification" html={html} />,
});
