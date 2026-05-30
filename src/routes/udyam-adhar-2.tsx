import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-adhar-2.html?raw";

export const Route = createFileRoute("/udyam-adhar-2")({
  head: () => ({
    meta: [
      { title: "Udyam Adhar — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Adhar Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prades" },
      { property: "og:title", content: "Udyam Adhar" },
      { property: "og:description", content: "Udyam Adhar Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prades" },
    ],
  }),
  component: () => <WpPage title="Udyam Adhar" html={html} />,
});
