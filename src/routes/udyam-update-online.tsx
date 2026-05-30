import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-update-online.html?raw";

export const Route = createFileRoute("/udyam-update-online")({
  head: () => ({
    meta: [
      { title: "Udyam Update Online - Update MSME Registration Details — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Update Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhr" },
      { property: "og:title", content: "Udyam Update Online - Update MSME Registration Details" },
      { property: "og:description", content: "Udyam Update Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhr" },
    ],
  }),
  component: () => <WpPage title="Udyam Update Online - Update MSME Registration Details" html={html} />,
});
