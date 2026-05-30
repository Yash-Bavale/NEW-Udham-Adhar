import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-card.html?raw";

export const Route = createFileRoute("/udyam-card")({
  head: () => ({
    meta: [
      { title: "Udyam Card - Official MSME Registration Card — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Card Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Pradesh" },
      { property: "og:title", content: "Udyam Card - Official MSME Registration Card" },
      { property: "og:description", content: "Udyam Card Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Pradesh" },
    ],
  }),
  component: () => <WpPage title="Udyam Card - Official MSME Registration Card" html={html} />,
});
