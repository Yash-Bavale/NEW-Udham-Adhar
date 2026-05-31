import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-apply-online.html?raw";

export const Route = createFileRoute("/msme-apply-online")({
  head: () => ({
    meta: [
      { title: "MSME Apply Online | Udyam Registration for Small Businesses — Udyam Registration Consultancy" },
      { name: "description", content: "MSME Apply Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra " },
      { property: "og:title", content: "MSME Apply Online | Udyam Registration for Small Businesses" },
      { property: "og:description", content: "MSME Apply Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra " },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Apply Online | Udyam Registration for Small Businesses" html={html} />,
});
