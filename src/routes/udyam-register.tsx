import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-register.html?raw";

export const Route = createFileRoute("/udyam-register")({
  head: () => ({
    meta: [
      { title: "Udyam Register - How to Register Your Business as MSME — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Register Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Pra" },
      { property: "og:title", content: "Udyam Register - How to Register Your Business as MSME" },
      { property: "og:description", content: "Udyam Register Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Pra" },
    ],
  }),
  component: () => <WpPage title="Udyam Register - How to Register Your Business as MSME" html={html} />,
});
