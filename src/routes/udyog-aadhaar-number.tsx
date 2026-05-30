import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyog-aadhaar-number.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-number")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Number - MSME Identifier Before Udyam Portal — Udyam Registration Consultancy" },
      { name: "description", content: "Udyog Aadhaar Number Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andh" },
      { property: "og:title", content: "Udyog Aadhaar Number - MSME Identifier Before Udyam Portal" },
      { property: "og:description", content: "Udyog Aadhaar Number Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andh" },
    ],
  }),
  component: () => <WpPage title="Udyog Aadhaar Number - MSME Identifier Before Udyam Portal" html={html} />,
});
