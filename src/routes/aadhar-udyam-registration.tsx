import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam-registration.html?raw";

export const Route = createFileRoute("/aadhar-udyam-registration")({
    head: () => ({
    meta: [
      { title: "Aadhar Business Help Services - Access MSME Certificate" },
      { name: "description", content: "Expert consultancy assistance for aadhar udyam/msme - access msme certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Aadhar Business Help Services - Access MSME Certificate" },
      { property: "og:description", content: "Expert consultancy assistance for aadhar udyam/msme - access msme certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyam-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Business Help Services - Access MSME Certificate" html={html} />,
});
