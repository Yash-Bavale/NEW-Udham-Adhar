import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-register.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-register")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Register — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyog Aadhaar Register was the former online system for registering MSMEs across India. It allowed small businesses to obtain a Udyog Aadhaar Number (UAN) using Aadhaar verification and basic enterprise details. Thousands of micro, small, and medium enterprises successfully registered, enabling them to access..." },
      { property: "og:title", content: "Udyog Aadhaar Register — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyog Aadhaar Register was the former online system for registering MSMEs across India. It allowed small businesses to obtain a Udyog Aadhaar Number (UAN) using Aadhaar verification and basic enterprise details. Thousands of micro, small, and medium enterprises successfully registered, enabling them to access..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-register" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Register" linkTitle="Udyog Aadhaar Register" html={html} />,
});
