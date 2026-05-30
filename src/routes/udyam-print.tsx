import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-print.html?raw";

export const Route = createFileRoute("/udyam-print")({
  head: () => ({
    meta: [
      { title: "Udyam Print Certificate | Download & Print MSME Certificate — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Print Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prades" },
      { property: "og:title", content: "Udyam Print Certificate | Download & Print MSME Certificate" },
      { property: "og:description", content: "Udyam Print Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prades" },
    ],
  }),
  component: () => <WpPage title="Udyam Print Certificate | Download & Print MSME Certificate" html={html} />,
});
