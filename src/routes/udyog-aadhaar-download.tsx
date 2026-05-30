import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyog-aadhaar-download.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-download")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Download | Old UAN Certificate Online — Udyam Registration Consultancy" },
      { name: "description", content: "Udyog Aadhaar Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State An" },
      { property: "og:title", content: "Udyog Aadhaar Download | Old UAN Certificate Online" },
      { property: "og:description", content: "Udyog Aadhaar Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State An" },
    ],
  }),
  component: () => <WpPage title="Udyog Aadhaar Download | Old UAN Certificate Online" html={html} />,
});
