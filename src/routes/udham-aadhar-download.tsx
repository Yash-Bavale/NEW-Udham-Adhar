import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udham-aadhar-download.html?raw";

export const Route = createFileRoute("/udham-aadhar-download")({
    head: () => ({
    meta: [
      { title: "Udham Aadhar Download | Get Udyam Certificate Online" },
      { name: "description", content: "Expert consultancy assistance for udham aadhar download | get udyam certificate online. Get help with Udyam/MSME registration, updates and certificates acros..." },
      { property: "og:title", content: "Udham Aadhar Download | Get Udyam Certificate Online" },
      { property: "og:description", content: "Expert consultancy assistance for udham aadhar download | get udyam certificate online. Get help with Udyam/MSME registration, updates and certificates acros..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udham-aadhar-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udham Aadhar Download" linkTitle="Udham Aadhar Download | Get Udyam Certificate Online" html={html} />,
});
