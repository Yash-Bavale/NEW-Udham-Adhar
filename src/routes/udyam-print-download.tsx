import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-print-download.html?raw";

export const Route = createFileRoute("/udyam-print-download")({
  head: () => ({
    meta: [
      { title: "Udyam Print Download | Download & Print MSME Certificate — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Print Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andh" },
      { property: "og:title", content: "Udyam Print Download | Download & Print MSME Certificate" },
      { property: "og:description", content: "Udyam Print Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andh" },
    ],
  }),
  component: () => <WpPage title="Udyam Print Download | Download & Print MSME Certificate" html={html} />,
});
