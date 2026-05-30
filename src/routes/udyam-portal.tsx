import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-portal.html?raw";

export const Route = createFileRoute("/udyam-portal")({
  head: () => ({
    meta: [
      { title: "Udyam Portal - Official MSME Registration Website — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Portal Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prade" },
      { property: "og:title", content: "Udyam Portal - Official MSME Registration Website" },
      { property: "og:description", content: "Udyam Portal Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prade" },
    ],
  }),
  component: () => <WpPage title="Udyam Portal - Official MSME Registration Website" html={html} />,
});
