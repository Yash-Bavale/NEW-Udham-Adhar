import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-registration-online.html?raw";

export const Route = createFileRoute("/udyam-registration-online")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Online - Digital MSME Registration Process — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Registration Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
      { property: "og:title", content: "Udyam Registration Online - Digital MSME Registration Proces" },
      { property: "og:description", content: "Udyam Registration Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
    ],
  }),
  component: () => <WpPage title="Udyam Registration Online - Digital MSME Registration Proces" html={html} />,
});
