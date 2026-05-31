import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-number.html?raw";

export const Route = createFileRoute("/udyam-number")({
  head: () => ({
    meta: [
      { title: "Udyam Number - Unique MSME Registration ID — Business Help Services Consultancy" },
      { name: "description", content: "Udyam Number Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prade" },
      { property: "og:title", content: "Udyam Number - Unique MSME Registration ID" },
      { property: "og:description", content: "Udyam Number Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prade" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Number - Unique MSME Registration ID" html={html} />,
});
