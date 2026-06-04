import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam-aadhar.html?raw";

export const Route = createFileRoute("/download-udyam-aadhar")({
  head: () => ({
    meta: [
      { title: "Download Udyam Aadhar — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Download Udyam Aadhar. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Download Udyam Aadhar — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Download Udyam Aadhar. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-udyam-aadhar" },
    ],
  }),
  component: () => <SeoLandingPage title="Download Udyam Aadhar" linkTitle="Download Udyam Aadhar" html={html} />,
});
