import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-online.html?raw";

export const Route = createFileRoute("/udyam-registration-online")({
  head: () => ({
    meta: [
      { title: "Business Help Services Online - Digital MSME Registration Process — Business Help Services Consultancy" },
      { name: "description", content: "Business Help Services Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
      { property: "og:title", content: "Business Help Services Online - Digital MSME Registration Proces" },
      { property: "og:description", content: "Business Help Services Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
    ],
  }),
  component: () => <SeoLandingPage title="Business Help Services Online - Digital MSME Registration Proces" html={html} />,
});
