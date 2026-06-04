import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-free-registration.html?raw";

export const Route = createFileRoute("/udyog-aadhar-free-registration")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Free Registration - Old MSME Registration Process" },
      { name: "description", content: "Udyog Aadhar free registration was the government’s official system for registering MSMEs online without any fees. This older registration process allowed businesses to obtain a unique Udyog Aadhaar Number (UAN) to access loans, subsidies, and participation in government tenders. While still recognized, the Udyog..." },
      { property: "og:title", content: "Udyog Aadhar Free Registration - Old MSME Registration Process" },
      { property: "og:description", content: "Udyog Aadhar free registration was the government’s official system for registering MSMEs online without any fees. This older registration process allowed businesses to obtain a unique Udyog Aadhaar Number (UAN) to access loans, subsidies, and participation in government tenders. While still recognized, the Udyog..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-free-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar free registration" linkTitle="Udyog Aadhar Free Registration - Old MSME Registration Process" html={html} />,
});
