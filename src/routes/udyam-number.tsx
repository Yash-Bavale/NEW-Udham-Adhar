import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-number.html?raw";

export const Route = createFileRoute("/udyam-number")({
  head: () => ({
    meta: [
      { title: "Udyam Number - Unique MSME Registration ID — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Number Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prade" },
      { property: "og:title", content: "Udyam Number - Unique MSME Registration ID" },
      { property: "og:description", content: "Udyam Number Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prade" },
    ],
  }),
  component: () => <WpPage title="Udyam Number - Unique MSME Registration ID" html={html} />,
});
