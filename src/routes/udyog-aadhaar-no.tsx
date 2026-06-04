import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-no.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-no")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar No — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyog Aadhaar Number (UAN) is a unique identifier previously issued to micro, small, and medium enterprises (MSMEs) in India to avail government benefits, subsidies, and schemes. Entrepreneurs could register online with basic business details and Aadhaar authentication to obtain their UAN instantly. Existing..." },
      { property: "og:title", content: "Udyog Aadhaar No — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyog Aadhaar Number (UAN) is a unique identifier previously issued to micro, small, and medium enterprises (MSMEs) in India to avail government benefits, subsidies, and schemes. Entrepreneurs could register online with basic business details and Aadhaar authentication to obtain their UAN instantly. Existing..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-no" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar No" linkTitle="Udyog Aadhaar No" html={html} />,
});
