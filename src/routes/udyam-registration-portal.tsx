import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-registration-portal.html?raw";

export const Route = createFileRoute("/udyam-registration-portal")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Portal - Official MSME Registration Website — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Registration Portal Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
      { property: "og:title", content: "Udyam Registration Portal - Official MSME Registration Websi" },
      { property: "og:description", content: "Udyam Registration Portal Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
    ],
  }),
  component: () => <WpPage title="Udyam Registration Portal - Official MSME Registration Websi" html={html} />,
});
