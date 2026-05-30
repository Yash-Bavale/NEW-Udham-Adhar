import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-certificate-update.html?raw";

export const Route = createFileRoute("/udyam-certificate-update")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Update - Modify Your MSME Registration Details — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Certificate Update Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State " },
      { property: "og:title", content: "Udyam Certificate Update - Modify Your MSME Registration Det" },
      { property: "og:description", content: "Udyam Certificate Update Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State " },
    ],
  }),
  component: () => <WpPage title="Udyam Certificate Update - Modify Your MSME Registration Det" html={html} />,
});
