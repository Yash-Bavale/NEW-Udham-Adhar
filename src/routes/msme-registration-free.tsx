import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-free.html?raw";

export const Route = createFileRoute("/msme-registration-free")({
  head: () => ({
    meta: [
      { title: "MSME Registration Free – Government Udyam Registration — Udyam Registration Consultancy" },
      { name: "description", content: "MSME Registration Free Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State An" },
      { property: "og:title", content: "MSME Registration Free – Government Udyam Registration" },
      { property: "og:description", content: "MSME Registration Free Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State An" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Free – Government Udyam Registration" html={html} />,
});
