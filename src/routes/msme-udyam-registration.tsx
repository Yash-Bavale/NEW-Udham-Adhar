import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-udyam-registration.html?raw";

export const Route = createFileRoute("/msme-udyam-registration")({
  head: () => ({
    meta: [
      { title: "MSME Business Help Services - Quick and Free MSME Registration — Business Help Services Consultancy" },
      { name: "description", content: "MSME Business Help Services Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
      { property: "og:title", content: "MSME Business Help Services - Quick and Free MSME Registration" },
      { property: "og:description", content: "MSME Business Help Services Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Business Help Services - Quick and Free MSME Registration" html={html} />,
});
