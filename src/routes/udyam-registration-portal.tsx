import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-portal.html?raw";

export const Route = createFileRoute("/udyam-registration-portal")({
  head: () => ({
    meta: [
      { title: "Business Help Services Portal - Official MSME Registration Website — Business Help Services Consultancy" },
      { name: "description", content: "Business Help Services Portal Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
      { property: "og:title", content: "Business Help Services Portal - Official MSME Registration Websi" },
      { property: "og:description", content: "Business Help Services Portal Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
    ],
  }),
  component: () => <SeoLandingPage title="Business Help Services Portal - Official MSME Registration Websi" html={html} />,
});
