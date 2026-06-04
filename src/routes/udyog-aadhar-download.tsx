import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-download.html?raw";

export const Route = createFileRoute("/udyog-aadhar-download")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Download - Get Your Old MSME Certificate" },
      { name: "description", content: "Udyog Aadhar download allows business owners who registered under the older Udyog Aadhar system to retrieve their certificate for reference, documentation, or migration to the new Udyam platform. This feature is especially important for businesses that previously obtained a Udyog Aadhar Number (UAN) and may still..." },
      { property: "og:title", content: "Udyog Aadhar Download - Get Your Old MSME Certificate" },
      { property: "og:description", content: "Udyog Aadhar download allows business owners who registered under the older Udyog Aadhar system to retrieve their certificate for reference, documentation, or migration to the new Udyam platform. This feature is especially important for businesses that previously obtained a Udyog Aadhar Number (UAN) and may still..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Download" linkTitle="Udyog Aadhar Download - Get Your Old MSME Certificate" html={html} />,
});
