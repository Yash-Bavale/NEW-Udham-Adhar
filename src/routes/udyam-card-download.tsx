import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-card-download.html?raw";

export const Route = createFileRoute("/udyam-card-download")({
  head: () => ({
    meta: [
      { title: "Udyam Card Download – Get Your MSME Certificate Online — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Card Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhr" },
      { property: "og:title", content: "Udyam Card Download – Get Your MSME Certificate Online" },
      { property: "og:description", content: "Udyam Card Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhr" },
    ],
  }),
  component: () => <WpPage title="Udyam Card Download – Get Your MSME Certificate Online" html={html} />,
});
