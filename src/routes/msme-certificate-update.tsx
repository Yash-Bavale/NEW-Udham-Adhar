import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-certificate-update.html?raw";

export const Route = createFileRoute("/msme-certificate-update")({
  head: () => ({
    meta: [
      { title: "MSME Certificate Update - How to Update Your MSME Registration — Business Help Services Consultancy" },
      { name: "description", content: "MSME Certificate Update Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
      { property: "og:title", content: "MSME Certificate Update - How to Update Your MSME Registrati" },
      { property: "og:description", content: "MSME Certificate Update Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Certificate Update - How to Update Your MSME Registrati" html={html} />,
});
