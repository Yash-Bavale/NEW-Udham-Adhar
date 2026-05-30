import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-registration-number.html?raw";

export const Route = createFileRoute("/udyam-registration-number")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Number - Unique MSME Identification Code — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Registration Number Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
      { property: "og:title", content: "Udyam Registration Number - Unique MSME Identification Code" },
      { property: "og:description", content: "Udyam Registration Number Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
    ],
  }),
  component: () => <WpPage title="Udyam Registration Number - Unique MSME Identification Code" html={html} />,
});
