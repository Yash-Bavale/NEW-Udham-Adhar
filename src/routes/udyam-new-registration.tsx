import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-new-registration.html?raw";

export const Route = createFileRoute("/udyam-new-registration")({
  head: () => ({
    meta: [
      { title: "Udyam New Registration - Step-by-Step MSME Registration Guide — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam New Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State An" },
      { property: "og:title", content: "Udyam New Registration - Step-by-Step MSME Registration Guid" },
      { property: "og:description", content: "Udyam New Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State An" },
    ],
  }),
  component: () => <WpPage title="Udyam New Registration - Step-by-Step MSME Registration Guid" html={html} />,
});
