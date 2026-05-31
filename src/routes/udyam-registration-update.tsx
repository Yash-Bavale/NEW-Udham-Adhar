import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-update.html?raw";

export const Route = createFileRoute("/udyam-registration-update")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Update | Modify MSME Certificate Details Online — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Registration Update Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
      { property: "og:title", content: "Udyam Registration Update | Modify MSME Certificate Details " },
      { property: "og:description", content: "Udyam Registration Update Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Update | Modify MSME Certificate Details " html={html} />,
});
