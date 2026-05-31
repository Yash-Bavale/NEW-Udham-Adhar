import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-download-online.html?raw";

export const Route = createFileRoute("/udyam-download-online")({
  head: () => ({
    meta: [
      { title: "Udyam Download Online — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Download Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State And" },
      { property: "og:title", content: "Udyam Download Online" },
      { property: "og:description", content: "Udyam Download Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State And" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Download Online" html={html} />,
});
