import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-reprint.html?raw";

export const Route = createFileRoute("/udyam-reprint")({
  head: () => ({
    meta: [
      { title: "Udyam Reprint Certificate | Reprint MSME Certificate Online — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Reprint Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prad" },
      { property: "og:title", content: "Udyam Reprint Certificate | Reprint MSME Certificate Online" },
      { property: "og:description", content: "Udyam Reprint Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prad" },
    ],
  }),
  component: () => <WpPage title="Udyam Reprint Certificate | Reprint MSME Certificate Online" html={html} />,
});
