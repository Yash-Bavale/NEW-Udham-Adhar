import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-application.html?raw";

export const Route = createFileRoute("/udyam-application")({
  head: () => ({
    meta: [
      { title: "Udyam Application Online | Apply for MSME Registration (Udyam Portal) — Business Help Services Consultancy" },
      { name: "description", content: "Udyam Application Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State " },
      { property: "og:title", content: "Udyam Application Online | Apply for MSME Registration (Udya" },
      { property: "og:description", content: "Udyam Application Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State " },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Application Online | Apply for MSME Registration (Udya" html={html} />,
});
