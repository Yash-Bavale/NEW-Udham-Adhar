import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-msme.html?raw";

export const Route = createFileRoute("/udyam-msme")({
  head: () => ({
    meta: [
      { title: "Udyam MSME - Government Portal for MSME Registration — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam MSME Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Pradesh" },
      { property: "og:title", content: "Udyam MSME - Government Portal for MSME Registration" },
      { property: "og:description", content: "Udyam MSME Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Pradesh" },
    ],
  }),
  component: () => <WpPage title="Udyam MSME - Government Portal for MSME Registration" html={html} />,
});
