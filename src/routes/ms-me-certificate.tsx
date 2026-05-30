import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/ms-me-certificate.html?raw";

export const Route = createFileRoute("/ms-me-certificate")({
  head: () => ({
    meta: [
      { title: "MSME Certificate Online | Get Udyam Registration Certificate — Udyam Registration Consultancy" },
      { name: "description", content: "MSME Certificate Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
      { property: "og:title", content: "MSME Certificate Online | Get Udyam Registration Certificate" },
      { property: "og:description", content: "MSME Certificate Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
    ],
  }),
  component: () => <WpPage title="MSME Certificate Online | Get Udyam Registration Certificate" html={html} />,
});
