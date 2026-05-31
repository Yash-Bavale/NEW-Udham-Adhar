import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam.html?raw";

export const Route = createFileRoute("/udyam")({
  head: () => ({
    meta: [
      { title: "Udyam - Government Portal for MSME Registration — Business Help Services Consultancy" },
      { name: "description", content: "Udyam Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Pradesh Arun" },
      { property: "og:title", content: "Udyam - Government Portal for MSME Registration" },
      { property: "og:description", content: "Udyam Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Pradesh Arun" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam - Government Portal for MSME Registration" html={html} />,
});
