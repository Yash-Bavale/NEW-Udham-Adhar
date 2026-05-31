import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-update.html?raw";

export const Route = createFileRoute("/udyam-update")({
  head: () => ({
    meta: [
      { title: "Udyam Update - How to Update Your MSME Details Online — Business Help Services Consultancy" },
      { name: "description", content: "Udyam Update Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prade" },
      { property: "og:title", content: "Udyam Update - How to Update Your MSME Details Online" },
      { property: "og:description", content: "Udyam Update Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prade" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Update - How to Update Your MSME Details Online" html={html} />,
});
