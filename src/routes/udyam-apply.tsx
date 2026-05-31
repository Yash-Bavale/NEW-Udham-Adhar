import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-apply.html?raw";

export const Route = createFileRoute("/udyam-apply")({
  head: () => ({
    meta: [
      { title: "Udyam Apply - Registration Online — Business Help Services Consultancy" },
      { name: "description", content: "Udyam Apply Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prades" },
      { property: "og:title", content: "Udyam Apply - Registration Online" },
      { property: "og:description", content: "Udyam Apply Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prades" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Apply - Registration Online" html={html} />,
});
