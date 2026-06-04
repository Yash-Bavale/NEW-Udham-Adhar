import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyog-registration.html?raw";

export const Route = createFileRoute("/aadhar-udyog-registration")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyog Registration - Aadhaar-Based MSME Registration Process" },
      { name: "description", content: "Aadhar Udyog registration is the process of registering your business as a Micro, Small, or Medium Enterprise using your Aadhaar number for identity verification. This system streamlines MSME registration by linking your personal Aadhaar with the enterprise details, making verification quick, secure, and completely..." },
      { property: "og:title", content: "Aadhar Udyog Registration - Aadhaar-Based MSME Registration Process" },
      { property: "og:description", content: "Aadhar Udyog registration is the process of registering your business as a Micro, Small, or Medium Enterprise using your Aadhaar number for identity verification. This system streamlines MSME registration by linking your personal Aadhaar with the enterprise details, making verification quick, secure, and completely..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyog-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyog registration" linkTitle="Aadhar Udyog Registration - Aadhaar-Based MSME Registration Process" html={html} />,
});
