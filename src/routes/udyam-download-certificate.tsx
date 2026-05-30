import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-download-certificate.html?raw";

export const Route = createFileRoute("/udyam-download-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam Download Certificate - Instant MSME Certificate Access — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Download Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your Stat" },
      { property: "og:title", content: "Udyam Download Certificate - Instant MSME Certificate Access" },
      { property: "og:description", content: "Udyam Download Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your Stat" },
    ],
  }),
  component: () => <WpPage title="Udyam Download Certificate - Instant MSME Certificate Access" html={html} />,
});
