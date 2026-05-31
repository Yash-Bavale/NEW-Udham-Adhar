import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-portal.html?raw";

export const Route = createFileRoute("/msme-registration-portal")({
  head: () => ({
    meta: [
      { title: "MSME Registration Portal - Official Site for MSME Registration — Udyam Registration Consultancy" },
      { name: "description", content: "MSME registration portal Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State " },
      { property: "og:title", content: "MSME Registration Portal - Official Site for MSME Registrati" },
      { property: "og:description", content: "MSME registration portal Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State " },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Portal - Official Site for MSME Registrati" html={html} />,
});
