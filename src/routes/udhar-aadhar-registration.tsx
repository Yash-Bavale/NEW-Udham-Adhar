import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udhar-aadhar-registration.html?raw";

export const Route = createFileRoute("/udhar-aadhar-registration")({
  head: () => ({
    meta: [
      { title: "Udhar Aadhar Registration Online — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Get complete information on Udhar Aadhar registration and how to apply online easily and securely.
Learn the step-by-step process, required documents, and eligibility criteria in simple language.
Understand how Aadhar-based verification ensures faster approval and smooth processing.
Find out how to link your mobile..." },
      { property: "og:title", content: "Udhar Aadhar Registration Online — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Get complete information on Udhar Aadhar registration and how to apply online easily and securely.
Learn the step-by-step process, required documents, and eligibility criteria in simple language.
Understand how Aadhar-based verification ensures faster approval and smooth processing.
Find out how to link your mobile..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udhar-aadhar-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udhar Aadhar Registration Online" linkTitle="Udhar Aadhar Registration Online" html={html} />,
});
