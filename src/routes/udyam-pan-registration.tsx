import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-pan-registration.html?raw";

export const Route = createFileRoute("/udyam-pan-registration")({
  head: () => ({
    meta: [
      { title: "Udyam PAN Registration | Link PAN With MSME Udyam Certificate — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam PAN Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State An" },
      { property: "og:title", content: "Udyam PAN Registration | Link PAN With MSME Udyam Certificat" },
      { property: "og:description", content: "Udyam PAN Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State An" },
    ],
  }),
  component: () => <WpPage title="Udyam PAN Registration | Link PAN With MSME Udyam Certificat" html={html} />,
});
