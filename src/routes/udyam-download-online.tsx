import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-download-online.html?raw";

export const Route = createFileRoute("/udyam-download-online")({
  head: () => ({
    meta: [
      { title: "Udyam Download Online — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Learn how to download your Udyam certificate online quickly and securely.
This guide explains the step-by-step process for accessing your certificate anytime.
Find out how to verify your business details before downloading the certificate.
Understand how your Aadhar and Udyam registration number are used for..." },
      { property: "og:title", content: "Udyam Download Online — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Learn how to download your Udyam certificate online quickly and securely.
This guide explains the step-by-step process for accessing your certificate anytime.
Find out how to verify your business details before downloading the certificate.
Understand how your Aadhar and Udyam registration number are used for..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-download-online" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Download Online" linkTitle="Udyam Download Online" html={html} />,
});
