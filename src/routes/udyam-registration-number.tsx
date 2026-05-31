import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-number.html?raw";

export const Route = createFileRoute("/udyam-registration-number")({
  head: () => ({
    meta: [
      { title: "Business Help Services Number - Unique MSME Identification Code — Business Help Services Consultancy" },
      { name: "description", content: "Business Help Services Number Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
      { property: "og:title", content: "Business Help Services Number - Unique MSME Identification Code" },
      { property: "og:description", content: "Business Help Services Number Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
    ],
  }),
  component: () => <SeoLandingPage title="Business Help Services Number - Unique MSME Identification Code" html={html} />,
});
