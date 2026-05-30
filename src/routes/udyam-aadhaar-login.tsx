import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-aadhaar-login.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-login")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar Login | Access Your MSME Registration Online — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Aadhaar Login Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhr" },
      { property: "og:title", content: "Udyam Aadhaar Login | Access Your MSME Registration Online" },
      { property: "og:description", content: "Udyam Aadhaar Login Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhr" },
    ],
  }),
  component: () => <WpPage title="Udyam Aadhaar Login | Access Your MSME Registration Online" html={html} />,
});
