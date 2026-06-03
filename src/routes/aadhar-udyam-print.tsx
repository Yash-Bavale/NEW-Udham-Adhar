import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam-print.html?raw";

export const Route = createFileRoute("/aadhar-udyam-print")({
    head: () => ({
    meta: [
      { title: "Aadhar Udyam Print | Print MSME Udyam Certificate" },
      { name: "description", content: "Expert consultancy assistance for aadhar udyam print | print msme udyam certificate. Get help with Udyam/MSME registration, updates and certificates across I..." },
      { property: "og:title", content: "Aadhar Udyam Print | Print MSME Udyam Certificate" },
      { property: "og:description", content: "Expert consultancy assistance for aadhar udyam print | print msme udyam certificate. Get help with Udyam/MSME registration, updates and certificates across I..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyam-print" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam Print" linkTitle="Aadhar Udyam Print | Print MSME Udyam Certificate" html={html} />,
});
