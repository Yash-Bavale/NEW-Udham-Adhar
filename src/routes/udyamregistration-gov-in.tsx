import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyamregistration-gov-in.html?raw";

export const Route = createFileRoute("/udyamregistration-gov-in")({
  head: () => ({
    meta: [
      { title: "Udyamregistration Gov In - Official MSME Registration Portal — Udyam Registration Consultancy" },
      { name: "description", content: "Udyamregistration gov in Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State " },
      { property: "og:title", content: "Udyamregistration Gov In - Official MSME Registration Portal" },
      { property: "og:description", content: "Udyamregistration gov in Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State " },
    ],
  }),
  component: () => <WpPage title="Udyamregistration Gov In - Official MSME Registration Portal" html={html} />,
});
