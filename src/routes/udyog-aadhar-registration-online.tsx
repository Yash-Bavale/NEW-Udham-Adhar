import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-registration-online.html?raw";

export const Route = createFileRoute("/udyog-aadhar-registration-online")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Registration Online — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Get complete guidance on Udyog Aadhar registration and how to apply online without confusion.
Understand the step-by-step process to register your small business quickly and efficiently.
Learn about eligibility criteria, required details, and important documents before applying.
This guide explains how to complete..." },
      { property: "og:title", content: "Udyog Aadhar Registration Online — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Get complete guidance on Udyog Aadhar registration and how to apply online without confusion.
Understand the step-by-step process to register your small business quickly and efficiently.
Learn about eligibility criteria, required details, and important documents before applying.
This guide explains how to complete..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-registration-online" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Registration Online" linkTitle="Udyog Aadhar Registration Online" html={html} />,
});
