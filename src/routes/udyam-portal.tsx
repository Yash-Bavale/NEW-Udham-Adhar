import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-portal.html?raw";

export const Route = createFileRoute("/udyam-portal")({
  head: () => ({
    meta: [
      { title: "Udyam Portal - Official MSME Registration Website — Business Help Services Consultancy" },
      { name: "description", content: "Udyam Portal Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prade" },
      { property: "og:title", content: "Udyam Portal - Official MSME Registration Website" },
      { property: "og:description", content: "Udyam Portal Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prade" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Portal - Official MSME Registration Website" html={html} />,
});
