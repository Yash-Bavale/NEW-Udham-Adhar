import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-certificate-apply.html?raw";

export const Route = createFileRoute("/udyam-certificate-apply")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Apply - How to Apply for MSME Certificate — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Certificate Apply Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
      { property: "og:title", content: "Udyam Certificate Apply - How to Apply for MSME Certificate" },
      { property: "og:description", content: "Udyam Certificate Apply Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State A" },
    ],
  }),
  component: () => <WpPage title="Udyam Certificate Apply - How to Apply for MSME Certificate" html={html} />,
});
