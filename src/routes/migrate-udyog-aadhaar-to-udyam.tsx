import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-to-udyam-migration.html?raw";

export const Route = createFileRoute("/migrate-udyog-aadhaar-to-udyam")({
  head: () => ({
    meta: [
      { title: "Migrate Udyog Aadhaar to Business Help Services" },
      { name: "description", content: "Migrate your old Udyog Aadhaar (UAM) registration to the new Business Help Services with consultancy assistance." },
      { property: "og:title", content: "Udyog Aadhaar to Udyam Migration" },
      { property: "og:description", content: "Convert your existing Udyog Aadhaar to the new Business Help Services with help from Business Help Services." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/migrate-udyog-aadhaar-to-udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar to Udyam Migration | Update Old UAN to Udyam Certificate" html={html} />,
});
