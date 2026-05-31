import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-edit.html?raw";

export const Route = createFileRoute("/udyam-edit")({
  head: () => ({
    meta: [
      { title: "Udyam Edit – Update or Modify Your MSME Registration Details — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Edit Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Pradesh" },
      { property: "og:title", content: "Udyam Edit – Update or Modify Your MSME Registration Details" },
      { property: "og:description", content: "Udyam Edit Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Pradesh" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Edit – Update or Modify Your MSME Registration Details" html={html} />,
});
