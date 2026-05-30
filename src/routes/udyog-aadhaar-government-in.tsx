import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyog-aadhaar-government-in.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-government-in")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Government Portal – MSME Registration Details — Udyam Registration Consultancy" },
      { name: "description", content: "Udyog Aadhaar Government Portal Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your" },
      { property: "og:title", content: "Udyog Aadhaar Government Portal – MSME Registration Details" },
      { property: "og:description", content: "Udyog Aadhaar Government Portal Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your" },
    ],
  }),
  component: () => <WpPage title="Udyog Aadhaar Government Portal – MSME Registration Details" html={html} />,
});
