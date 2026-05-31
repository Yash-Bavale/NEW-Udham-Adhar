import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-to-udyam-migration.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-to-udyam-migration")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar to Udyam Migration | Update Old UAN to Udyam Certificate — Udyam Registration Consultancy" },
      { name: "description", content: "Udyog Aadhaar to Udyam Migration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select You" },
      { property: "og:title", content: "Udyog Aadhaar to Udyam Migration | Update Old UAN to Udyam C" },
      { property: "og:description", content: "Udyog Aadhaar to Udyam Migration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select You" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar to Udyam Migration | Update Old UAN to Udyam C" html={html} />,
});
