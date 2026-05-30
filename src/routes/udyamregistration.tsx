import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyamregistration.html?raw";

export const Route = createFileRoute("/udyamregistration")({
  head: () => ({
    meta: [
      { title: "Udyamregistration - Official MSME Registration Portal India — Udyam Registration Consultancy" },
      { name: "description", content: "Udyamregistration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra " },
      { property: "og:title", content: "Udyamregistration - Official MSME Registration Portal India" },
      { property: "og:description", content: "Udyamregistration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra " },
    ],
  }),
  component: () => <WpPage title="Udyamregistration - Official MSME Registration Portal India" html={html} />,
});
