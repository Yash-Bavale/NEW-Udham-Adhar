import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-register.html?raw";

export const Route = createFileRoute("/udyam-register")({
  head: () => ({
    meta: [
      { title: "Udyam Register - How to Register Your Business as MSME" },
      { name: "description", content: "Udyam register is the official process for formally listing your business as a Micro, Small, or Medium Enterprise through the government’s Udyam portal. The registration process is free, secure, and entirely digital, requiring basic business details and Aadhaar verification. Once registered, businesses receive a..." },
      { property: "og:title", content: "Udyam Register - How to Register Your Business as MSME" },
      { property: "og:description", content: "Udyam register is the official process for formally listing your business as a Micro, Small, or Medium Enterprise through the government’s Udyam portal. The registration process is free, secure, and entirely digital, requiring basic business details and Aadhaar verification. Once registered, businesses receive a..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-register" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam register" linkTitle="Udyam Register - How to Register Your Business as MSME" html={html} />,
});
