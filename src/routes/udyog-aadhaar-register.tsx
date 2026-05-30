import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyog-aadhaar-register.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-register")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Register – MSME Registration for Small Businesses — Udyam Registration Consultancy" },
      { name: "description", content: "Udyog Aadhaar Register Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State An" },
      { property: "og:title", content: "Udyog Aadhaar Register – MSME Registration for Small Busines" },
      { property: "og:description", content: "Udyog Aadhaar Register Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State An" },
    ],
  }),
  component: () => <WpPage title="Udyog Aadhaar Register – MSME Registration for Small Busines" html={html} />,
});
