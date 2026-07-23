import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-free-registration.html?raw";

export const Route = createFileRoute("/udyog-aadhar-free-registration")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Free Registration - Old MSME Registration Process" },
      { name: "description", content: "Udyog Aadhar free registration was the government’s official system for registering MSMEs online without any fees. This older registration process allowed..." },
      { property: "og:title", content: "Udyog Aadhar Free Registration - Old MSME Registration Process" },
      { property: "og:description", content: "Udyog Aadhar free registration was the government’s official system for registering MSMEs online without any fees. This older registration process allowed..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyog-aadhaar" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar free registration" linkTitle="Udyog Aadhar Free Registration - Old MSME Registration Process" content={`Udyog Aadhar free registration was the government’s official system for registering MSMEs online without any fees. This older registration process allowed businesses to obtain a unique Udyog Aadhaar Number (UAN) to access loans, subsidies, and participation in government tenders. While still recognized, the Udyog Aadhaar system has been largely replaced by the Udyam portal, which offers faster, paperless, and digitally signed MSME certificates. Businesses using the free Udyog Aadhar registration could formalize their enterprise, enhance credibility with banks and financial institutions, and gain eligibility for various government schemes. Although valid, migrating to the Udyam portal is recommended for startups and existing businesses seeking instant online certificates, enhanced digital access, and broader eligibility for modern MSME benefits, including subsidies, loans, and priority sector opportunities.`} html={html} />,
});
