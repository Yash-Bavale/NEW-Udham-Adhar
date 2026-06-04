import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-check.html?raw";

export const Route = createFileRoute("/udyam-registration-check")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Check — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam Registration Check allows businesses to verify the status of their MSME registration online. By entering your Udyam Number, PAN, or Aadhaar details, you can confirm whether your registration is active, pending, or requires updates. This verification ensures eligibility for bank loans, tenders, government..." },
      { property: "og:title", content: "Udyam Registration Check — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam Registration Check allows businesses to verify the status of their MSME registration online. By entering your Udyam Number, PAN, or Aadhaar details, you can confirm whether your registration is active, pending, or requires updates. This verification ensures eligibility for bank loans, tenders, government..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-check" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Check" linkTitle="Udyam Registration Check" html={html} />,
});
